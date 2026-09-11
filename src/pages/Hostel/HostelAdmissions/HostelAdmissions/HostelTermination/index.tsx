import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, SelectInput, TextInput } from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct,
  resetBrchClassAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
  getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import { shallowEqual } from "react-redux";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getHostelTerminationListAct, revertHostelTerminationByIdAct } from "../../../../../store/hostel/hostelrequest/hostelrequestactions";
import { toast } from "react-toastify";
import { useModal } from "../../../../../hooks/modalhook";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: ""
};

const HostelTermination = () => {
  const [filterState, setFilterState] = useState(initialValues);

  const { modalState: delHostelAdmisssionModalState, closeModal: closeDelHostelAdmissionHndlr,
    openModal: openDelHostelAdmissionModalHndlr
  } = useModal();

  const {modalState : retriveHostelAdmissionModalState, closeModal: closeRetriveHostelAdmissionHndlr, openModal: openRetriveHostelAdmissionHndlr } = useModal()

  const dispatch = useAppDispatch(),
    { showApiLoader, currentBranchIdResp: branchId,
      currentInstIdResp: instituteId, branchClassResp,
      academicYearListResp,
      brchCurriculumResp, getHostelTerminationListResp, hostelRequestErrorResp,revertHostelTerminationbyIdResp } =
      useAppSelector(({ appData, globalData, branchAcademics,
        instAcademics, hostelRequest, hostelStuLedger }) => ({
          showApiLoader: globalData.showApiLoader,
          currentBranchIdResp: appData.currentBranchIdResp,
          currentInstIdResp: appData.currentInstIdResp,

          branchClassResp: branchAcademics.branchClassResp,
          brchCurriculumResp: branchAcademics.brchCurriculumResp,
          academicYearListResp: instAcademics.academicYearListResp,

          getHostelTerminationListResp: hostelRequest.getHostelTerminationListResp,
          hostelRequestErrorResp: hostelRequest.hostelRequestErrorResp,
          revertHostelTerminationbyIdResp:hostelRequest.revertHostelTerminationbyIdResp,

          instAcademicErrorResp: instAcademics.instAcademicErrorResp,
          brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp,
          exportHostelShortListResp: hostelStuLedger.exportHostelShortListResp,
        }), shallowEqual);

  const hostelAdmissionRespRef = useRef({
    prevHostelRequestErrorResp: hostelRequestErrorResp,
    prevRevertHostelTerminationbyIdResp : revertHostelTerminationbyIdResp
  })

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const { prevHostelRequestErrorResp,prevRevertHostelTerminationbyIdResp } = hostelAdmissionRespRef.current;
    if (hostelRequestErrorResp && prevHostelRequestErrorResp !== hostelRequestErrorResp) {
      const { details } = hostelRequestErrorResp || {};
      toast.error(details || 'Something went wrong.');
    }
    else if(revertHostelTerminationbyIdResp && prevRevertHostelTerminationbyIdResp !== revertHostelTerminationbyIdResp){
      toast.success('Reverted Successfully.');
      getHostelTerminationListApiCall()
      closeRetriveHostelAdmissionHndlr()
      paginationRef.current.pageNo = 0;
    }

    hostelAdmissionRespRef.current.prevHostelRequestErrorResp = hostelRequestErrorResp;
    hostelAdmissionRespRef.current.prevRevertHostelTerminationbyIdResp = revertHostelTerminationbyIdResp

  }, [hostelRequestErrorResp,revertHostelTerminationbyIdResp]);

  useEffect(() => {
    if (academicYearListResp) {
      const { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      setFilterState((prevState: any) => ({
        ...prevState, academicYearId,
      }));
      setFilterState({ ...initialValues, academicYearId });
      getHostelTerminationListApiCall({ academicYearId });
      getCurriculumApiCall({ academicYearId });
    }
  }, [academicYearListResp,branchId,instituteId]);

  function paginationHndlr(paginationInfo: any) {
    paginationRef.current = paginationInfo;
    getHostelTerminationListApiCall();
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function onChangeFilterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationRef.current.pageNo = 0;

    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      setFilterState((prev:any) => ({ ...prev, [name]: value , classId : "",curriculumId : "" }));
      getHostelTerminationListApiCall({ [name]: value, classId: "" , curriculumId: "" });
    }
    else if (name === "curriculumId") {
        if (value) {
            getClassApiCall(value);
        }
        else {
            dispatch(resetBrchClassAct(undefined));
        }
        getHostelTerminationListApiCall({ [name]: value, classId: "" });
        setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
    } else {
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getHostelTerminationListApiCall({ [name]: value, });
    }
  }

  function getClassApiCall(curriculumId: string) {
    // sortBy: "className", orderBy: "asc"
    const payload = {
      curriculumId, branchId,
      academicYearId : filterState.academicYearId,
      pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function getHostelTerminationListApiCall(otherProps?: any) {
    const payload = {
      branchId,
      ...filterState,
      ...otherProps,
      ...paginationRef.current
    }
    dispatch(getHostelTerminationListAct(generateActionPayload("get_hostel_termination_list", undefined, payload)));
  }

  const confirmTerminationHndlr = ()=> {
    const params = {
      terminationId:retriveHostelAdmissionModalState.modalData
    }

    dispatch(revertHostelTerminationByIdAct(generateActionPayload("revert_hostel_termination_by_id",params)))
  }

  const menuOptions = useMemo(() => [
    {
      id : "revert",
      actionIcon : <span className="text-info text-decoration-underline">Revert</span>,
      actionName :"Revert",
      onClickHndlr: (event:React.MouseEvent<HTMLSpanElement>) => {
        const terminationId = event.currentTarget.getAttribute("data-id")
        openRetriveHostelAdmissionHndlr(terminationId)
      }
    }
  ],[])

  const columns = useMemo(() => generateColumns(menuOptions), []);
  const { data: hosteTerminationList, totalPages, totalElements, pageNo: pageNumber } = getHostelTerminationListResp || {};
  return (
    <>
      <div className="tw-inline-block tw-w-full">
        <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pb-3 tw-pt-2">

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <div className="search-box">
              <TextInput
                name="searchString"
                formgroupClassName="tw-mb-0"
                value={filterState.searchString}
                onChange={onChangeFilterHandler}
                labelText="Search"
                placeHolder="Search"
                floatingLabel
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="academicYearId"
              value={filterState.academicYearId}
              onChange={onChangeFilterHandler}
              menuItems={academicYearListResp?.data}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              labelText="Academic Year"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="curriculumId"
              value={filterState.curriculumId}
              onChange={onChangeFilterHandler}
              menuItems={brchCurriculumResp?.data}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              formgroupClassName="tw-mb-0"
              labelText="Curriculam"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
            <SelectInput
              name="classId"
              value={filterState.classId}
              onChange={onChangeFilterHandler}
              menuItems={branchClassResp?.content}
              valueKey="id"
              textKey="shortName"
              formgroupClassName="tw-mb-0"
              labelText="Class"
              floatingLabel
            />
          </div>
        </div>
        <TableContainer
          columns={columns || []}
          data={Array.isArray(hosteTerminationList) ? hosteTerminationList : []}
          tableClass="tw-mb-0"
          divClass="tw-overflow-x-auto tw-mb-3"
          theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
          showPagination={true}
          totalPages={totalPages}
          totalRecords={totalElements}
          callbackPaginationHndlr={paginationHndlr}
          currentPageNumber={pageNumber || 0}
        />
      </div>
      <ConfirmationModal
        id = "retrive-hostel-termination-modal"
        isOpen = {retriveHostelAdmissionModalState.showModal}
        confirmMessage="You want to Retrive"
        cancelHndlr={closeRetriveHostelAdmissionHndlr}
        confirmHndlr={confirmTerminationHndlr}
        isDisble={showApiLoader}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      ></ConfirmationModal>
    </>
  );
};

export default HostelTermination;

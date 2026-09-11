import { useEffect, useMemo, useRef, useState } from "react";
import { ConfirmationModal, ModalContainerUpdated, OffCanvasContainer, SelectInput, TextInput } from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns, ignoredKeys } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct,
  resetBrchClassAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
  getInstAcademicYearAct,
} from "../../../../../store/mastersettings/instacademics/instacademicactions";
import { shallowEqual, useSelector } from "react-redux";
//Action Generator
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { deleteHostelOptedStudentAct, exportHostelShortlistStuListAct, getHostelOptedStudentsAct, reActivateHostelShortlistByIdAct } from "../../../../../store/hostel/hostelrequest/hostelrequestactions";
import { toast } from "react-toastify";
import { default as DeleteIconSvg } from "../../../../../assets/imagesdps/academics/DeleteIconSvg.svg?react";
import { default as EditSvg } from "../../../../../assets/imagesdps/academics/EditSvg.svg?react";
import { useModal } from "../../../../../hooks/modalhook";
import { default as FilterSvg } from "../../../../../assets/imagesdps/academics/FilterSvg.svg?react";
import AdvanceFilterModal from "./AdvanceFilterModal";
import { downloadExcelFile } from "../../../../../utility/commonutility";
import { useFilterState } from "../../../../../hooks/filterhook";
import { useHistory } from "react-router-dom";
import classnames from "classnames";
import ExportModal from "../../../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckmarkCircle03Icon, SquareUnlock02Icon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  status: "",
};

const HostelShortlistDetails = () => {
  const [filterState, setFilterState] = useState(initialValues);
  const [open, setOpen] = useState<boolean>(false);
  const history = useHistory();

  const { showClearFilterState , count , advanceFilterChange } = useFilterState();
  const [exportExcel, setExportExcel] = useState({
    showModal: false,
  })
  const { modalState: delHostelAdmisssionModalState, closeModal: closeDelHostelAdmissionHndlr,
    openModal: openDelHostelAdmissionModalHndlr
  } = useModal();

  const {modalState : reActivateAdmissionModalState, closeModal : closeReActivateHostelAdmissionHndlr, openModal : openReActivateHostelAdmissionHndlr } = useModal()

  const dispatch = useAppDispatch(),
    { showApiLoader, currentBranchIdResp: branchId,
      currentInstIdResp: instituteId, branchClassResp,
      academicYearListResp, deleteHostelOptedStudentResp, exportHostelShortlistStuListResp,
      brchCurriculumResp, hostelOptedStudentsResp, hostelRequestErrorResp,reActiveHostelShortlistByIdResp } =
      useAppSelector(({ appData, globalData, branchAcademics,
        instAcademics, hostelRequest, hostelStuLedger }) => ({
          showApiLoader: globalData.showApiLoader,
          currentBranchIdResp: appData.currentBranchIdResp,
          currentInstIdResp: appData.currentInstIdResp,

          branchClassResp: branchAcademics.branchClassResp,
          brchCurriculumResp: branchAcademics.brchCurriculumResp,
          academicYearListResp: instAcademics.academicYearListResp,

          hostelOptedStudentsResp: hostelRequest.hostelOptedStudentsResp,
          deleteHostelOptedStudentResp: hostelRequest.deleteHostelOptedStudentResp,
          exportHostelShortlistStuListResp: hostelRequest.exportHostelShortlistStuListResp,
          hostelRequestErrorResp: hostelRequest.hostelRequestErrorResp,
          reActiveHostelShortlistByIdResp: hostelRequest.reActiveHostelShortlistByIdResp,

          instAcademicErrorResp: instAcademics.instAcademicErrorResp,
          brchAcademicErrorResp: branchAcademics.brchAcademicErrorResp,
          exportHostelShortListResp: hostelStuLedger.exportHostelShortListResp,
        }), shallowEqual);

  const hostelAdmissionRespRef = useRef({
    prevDeleteHostelOptedStudentResp: deleteHostelOptedStudentResp,
    prevExportHostelShortlistStuListResp: exportHostelShortlistStuListResp,
    prevHostelRequestErrorResp: hostelRequestErrorResp,
    prevReActiveHostelShortlistByIdresp: reActiveHostelShortlistByIdResp
  })

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  useEffect(() => {
    const { prevDeleteHostelOptedStudentResp, prevHostelRequestErrorResp, prevExportHostelShortlistStuListResp,
    prevReActiveHostelShortlistByIdresp
     } = hostelAdmissionRespRef.current;
    if (deleteHostelOptedStudentResp && prevDeleteHostelOptedStudentResp !== deleteHostelOptedStudentResp) {
      toast.success('Hosted admission deleted successfully.');
      closeDelHostelAdmissionHndlr();
      paginationRef.current.pageNo = 0;
      getHostelOptedStudentApiCall();
    }
    else if(reActiveHostelShortlistByIdResp && prevReActiveHostelShortlistByIdresp !== reActiveHostelShortlistByIdResp){
      toast.success("Hosted admission Reactivated successfully.")
      closeReActivateHostelAdmissionHndlr();
      getHostelOptedStudentApiCall();
    }
    else if (hostelRequestErrorResp && prevHostelRequestErrorResp !== hostelRequestErrorResp) {
      toast.error('Something went wrong.');
    }
    else if (exportHostelShortlistStuListResp && prevExportHostelShortlistStuListResp !== exportHostelShortlistStuListResp) {
      toast.success("List Exported Successfully.")
      toggleExportExcelModal()
      downloadExcelFile(exportHostelShortlistStuListResp,'Hostel_Shortlist_List.xlsx');
    }

    hostelAdmissionRespRef.current.prevDeleteHostelOptedStudentResp = deleteHostelOptedStudentResp;
    hostelAdmissionRespRef.current.prevExportHostelShortlistStuListResp = exportHostelShortlistStuListResp;
    hostelAdmissionRespRef.current.prevHostelRequestErrorResp = hostelRequestErrorResp;
    hostelAdmissionRespRef.current.prevReActiveHostelShortlistByIdresp = reActiveHostelShortlistByIdResp

  }, [deleteHostelOptedStudentResp, exportHostelShortlistStuListResp, hostelRequestErrorResp,reActiveHostelShortlistByIdResp]);

  useEffect(() => {
    if (academicYearListResp) {
      const { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      setFilterState((prevState: any) => ({
        ...prevState, academicYearId,
      }));
      setFilterState({ ...initialValues, academicYearId });
      getHostelOptedStudentApiCall({ academicYearId });
      getCurriculumApiCall({ academicYearId });
    }
  }, [academicYearListResp,branchId,instituteId]);

  function paginationHndlr(paginationInfo: any) {
    paginationRef.current = paginationInfo;
    getHostelOptedStudentApiCall();
  }

  const toggleAdvanceFilter = () => {
    setOpen(prev => !prev);
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
      getHostelOptedStudentApiCall({ [name]: value, classId: "" , curriculumId: "" });
    }
    else if (name === "curriculumId") {
        if (value) {
            getClassApiCall(value);
        }
        else {
            dispatch(resetBrchClassAct(undefined));
        }
        getHostelOptedStudentApiCall({ [name]: value, classId: "" });
        setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
    } else {
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getHostelOptedStudentApiCall({ [name]: value, });
    }

    advanceFilterChange({ keys : { ...filterState, [name]: value, academicYearId: "" } , ignoredKeys})
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

  function getHostelOptedStudentApiCall(otherProps?: any) {
    const payload = {
      branchId,
      ...filterState,
      ...otherProps,
      ...paginationRef.current
    }
    dispatch(getHostelOptedStudentsAct(generateActionPayload("hostel_opted_students", undefined, payload)));
  }

  const menuOptions = useMemo(() => [
    {
      id : "reActivate",
      actionIcon : <HugeiconsIcon icon={SquareUnlock02Icon} className="me-2 text-danger" size={18} />,
      actionName:"Reactivate",
      onClickHndlr: (event:any) => {
        const hostelAdmissionId = event.currentTarget.getAttribute("data-id")
        openReActivateHostelAdmissionHndlr(hostelAdmissionId)
      }
    },
    {
      id: "hostel-termination",
      actionIcon: <HugeiconsIcon icon={CheckmarkCircle03Icon} className="me-2" size={20} />,
      actionName: "Hostel Termination",
      onClickHndlr: (event: any) => {
        const id = event.currentTarget.getAttribute("data-id");
        const data = hostelOptedStudentsResp.data?.find((student: any) => +student.id === +id);
        history.push(`/create-hostel-termination`, { studentDetails : { ...data , academicYearId : filterState.academicYearId} });
      },
    },
  ], [hostelOptedStudentsResp]);

  function confirmDelHostelAdmissionHndlr() {
    const payload = {
      shortListIds: [delHostelAdmisssionModalState.modalData]
    }
    dispatch(deleteHostelOptedStudentAct(generateActionPayload("del_hospital_admissions", undefined, payload)));
  }

  function confirmReActivateHostelAdmissionHndlr() {
    const payload = {
      admissionShortListId : reActivateAdmissionModalState.modalData
    }
    dispatch(reActivateHostelShortlistByIdAct(generateActionPayload("re_activate_hostel_shortlist_by_id",payload)))
  }

  const toggleExportExcelModal = () => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const exportModalHndler = () => {
    dispatch(exportHostelShortlistStuListAct(generateActionPayload("export_hostelrequest_students", undefined, { ...filterState, branchId, instituteId }, {
      responseType: 'blob'
    })));
  }

  function advanceFilterCallbckHndlr(appliedFilters?: any) {
    paginationRef.current = { ...paginationRef.current, pageNo: 0 }

    advanceFilterChange({ keys : {...filterState, ...appliedFilters} , ignoredKeys})
    setFilterState((prevState: any) => ({ ...prevState, ...appliedFilters }));
    getHostelOptedStudentApiCall(appliedFilters)
  }

  const clearFilterHndlr = () => {
    paginationRef.current = { ...paginationRef.current, pageNo: 0 };
    const { academicYearId = "" } = academicYearListResp && academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {}
    setFilterState({ ...initialValues, academicYearId});
    getHostelOptedStudentApiCall({ ...initialValues, academicYearId});
    dispatch(resetBrchClassAct(undefined));
    getCurriculumApiCall({ academicYearId });
    advanceFilterChange({ keys : {...initialValues} , ignoredKeys})
  };

  const columns = useMemo(() => generateColumns(menuOptions), [hostelOptedStudentsResp]);
  const { data: studentListOpted, totalPages, totalElements, pageNo: pageNumber } = hostelOptedStudentsResp || {};
  
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
              defaultSelect="Curriculum"
              labelText="Curriculum"
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
              defaultSelect="Class"
              labelText="Class"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-1 tw-relative">
            <button
              onClick={toggleAdvanceFilter}
              className="tw-flex tw-items-center tw-gap-2 tw-bg-[#F4F7FA] tw-p-2 tw-rounded"
            >
              <FilterSvg height="18px" width="18px" />
              <span>Filters</span>
            </button>
            <span className="badge tw-align-middle rounded-pill ms-1 " style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c" }}>
                    {count}
                  </span>
          </div>

          <div className="tw-col-span-12 tw-flex tw-justify-end">
            <div className="tw-flex tw-items-center tw-gap-2">

              {showClearFilterState && (
                <Button
                variant="wrong"
                  type="button"
                  onClick={clearFilterHndlr}
                  
                >
                  Clear filter
                </Button>
              )}

              <Button
                type="button"
                onClick={() => toggleExportExcelModal()}
                variant="info"
              >
                <i className="ri-add-line" />
                Export
              </Button>
            </div>
          </div>

        </div>
        <TableContainer
          columns={columns || []}
          data={Array.isArray(studentListOpted) ? studentListOpted : []}
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
      <OffCanvasContainer
        isOpen={open}
        headerTitle="Advance Filters"
        closeHndlr={toggleAdvanceFilter}
        id="advance-filter-hostel-shortlist"
      >
        <AdvanceFilterModal
          appliedFilter={filterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
          toggleAdvanceFilter={toggleAdvanceFilter}
          isOpen={open}
        />
      </OffCanvasContainer>
      <ConfirmationModal
        id="reactivate-hostel-shortlist-modal"
        isOpen={reActivateAdmissionModalState.showModal}
        confirmMessage="You want to Reactivate?"
        cancelHndlr={closeReActivateHostelAdmissionHndlr}
        confirmHndlr={confirmReActivateHostelAdmissionHndlr}
        isDisble={showApiLoader}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      ></ConfirmationModal>
      <ConfirmationModal
        id="delete-hostel-shortlist-modal"
        isOpen={delHostelAdmisssionModalState.showModal}
        confirmMessage="Are you sure you want to delete this shortlisted hostel admission?"
        cancelHndlr={closeDelHostelAdmissionHndlr}
        confirmHndlr={confirmDelHostelAdmissionHndlr}
        showImgIcon={true}
        iconType="reject"
      />
      <ModalContainerUpdated
                id="hostel-shortlist-export-modal"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Hostel Shortlist Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportModalHndler}
                    feature="hostel"
                    subFeature="hostel_shortlits_details"
                    remarksText="Enter remarks to export hostel shortlist data?"
                />
            </ModalContainerUpdated>
    </>
  );
};

export default HostelShortlistDetails;

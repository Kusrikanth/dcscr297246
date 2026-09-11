import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, setBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getEligibleStudForPromoteAct, revertRemoveHostelPromotionAct } from "../../../../store/hostel/hostelrequest/hostelrequestactions";
import { getInstAcademicYearAct } from "../../../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import EligibilityPromoteModel from "./EligibilityPromoteModel";
import { checkFitlersApplied, generateColumns, promotionStatusList } from "./helper";
import Button from "../../../../Components/Common/Button";

const initialFilterState = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  promotionStatus: "",
};

const EligibilityPromote = () => {
  const [filterState, setFilterState] = useState(initialFilterState);
  const [clearFilterState, setClearFilterState] = useState(false);
  const [EligibilityPromoteModelState, setEligibilityPromoteModelState] = useState({
    showModal: false,
    branchId: "",
  });
  const [confirmModalState, setConfirmModalState] = useState({
    showModal: false,
    higherClassEligibleId: "",
    message: "", type: "",
  })

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });


  const dispatch = useAppDispatch();
  const {
    branchClassResp,
    academicYearListResp, brchCurriculumResp, currentInstIdResp: instituteId,
    currentBranchIdResp: branchId, showApiLoader, eligibleStudForPromoteResp,
    revertRemoveHostelPromotionResp,
    hostelRequestErrorResp } =
    useAppSelector(({ appData, branchAcademics, globalData, instAcademics, hostelRequest }) => ({
      branchClassResp: branchAcademics.branchClassResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      showApiLoader: globalData.showApiLoader,
      eligibleStudForPromoteResp: hostelRequest.eligibleStudForPromoteResp,
      revertRemoveHostelPromotionResp: hostelRequest.revertRemoveHostelPromotionResp,
      hostelRequestErrorResp: hostelRequest.hostelRequestErrorResp
    }), shallowEqual);

  useEffect(() => {
    if (academicYearListResp) {
      const { data } = academicYearListResp || {};
      if (Array.isArray(data)) {
        let yearId = data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId;
        setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
        getEligibleStudForPromoteApiCall({ academicYearId: yearId });
        getCurriculumApiCall({ academicYearId: yearId });
      }
    }
  }, [branchId,instituteId, academicYearListResp]);

  const eligibilityPromoteRespRef = useRef({
    prevRevertRemoveHostelPromotionResp: revertRemoveHostelPromotionResp,
    prevHostelRequestErrorResp: hostelRequestErrorResp
  });

  useEffect(() => {
    const { prevRevertRemoveHostelPromotionResp, prevHostelRequestErrorResp } = eligibilityPromoteRespRef.current;
    if (revertRemoveHostelPromotionResp && prevRevertRemoveHostelPromotionResp !== revertRemoveHostelPromotionResp) {
      const { type } = confirmModalState;
      if (type === "REVERT") {
        toast.success('Hostel promotion reverted successfully.');
      } else if (type === "REMOVE") {
        toast.success('Hostel promotion removed successfully.');
      } else {
        toast.success('Hostel promotion updated successfully.');
      }
      setConfirmModalState(prevState => ({ ...prevState, showModal: false }));
      getEligibleStudForPromoteApiCall();
    } else if (hostelRequestErrorResp && prevHostelRequestErrorResp !== hostelRequestErrorResp) {
      const { ERROR, message, details } = hostelRequestErrorResp;
      toast.error(ERROR || message || details || 'Something went wrong.');
    }
    eligibilityPromoteRespRef.current.prevRevertRemoveHostelPromotionResp = revertRemoveHostelPromotionResp;
    eligibilityPromoteRespRef.current.prevHostelRequestErrorResp = hostelRequestErrorResp;
  }, [revertRemoveHostelPromotionResp, hostelRequestErrorResp]);

  const menuOptions = useMemo(() => ([
    {
      id: "revert",
      actionIcon: <span className="text-info text-decoration-underline">Revert</span>,
      actionName: "Revert",
      onClickHndlr: (event: any) => {
        const id = event.currentTarget.getAttribute("data-id");
        setConfirmModalState(prevState => ({
          ...prevState, showModal: true, higherClassEligibleId: id,
          message: 'Are you sure you want to revert the promotion?', type: "REMOVE"
        }))
      },
    },
    {
      id: "remove-promotion",
      actionIcon: <span className="text-info text-decoration-underline">Remove Promotion</span>,
      actionName: "Revert",
      onClickHndlr: (event: any) => {
        const id = event.currentTarget.getAttribute("data-id");
        setConfirmModalState(prevState => ({
          ...prevState, showModal: true, higherClassEligibleId: id,
          message: 'Are you sure you want to remove the promotion?', type: "REVERT"
        }))
      },
    },
  ]), [eligibleStudForPromoteResp]);


  function getClassApiCall(curriculumId: string) {
    const payload = { pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",academicYearId : filterState.academicYearId, curriculumId, branchId };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function getEligibleStudForPromoteApiCall(otherProps?: any) {
    const params = { branchId, ...filterState, ...otherProps, ...paginationRef.current };
    setClearFilterState(checkFitlersApplied(params));
    dispatch(getEligibleStudForPromoteAct(generateActionPayload("get_hosteleligible_forpromote", undefined, params)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    paginationRef.current.pageNo = 0;
    const { name, value } = event.target;
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      setFilterState((prev:any) => ({ ...prev, [name]: value , classId : "",curriculumId : "" }));
      getEligibleStudForPromoteApiCall({ [name]: value, classId: "" , curriculumId: "" });
    }
    else if (name === "curriculumId") {
        if (value) {
            getClassApiCall(value);
        }
        else {
            dispatch(resetBrchClassAct(undefined));
        }
        getEligibleStudForPromoteApiCall({ [name]: value, classId: "" });
        setFilterState((prevState: any) => ({ ...prevState, [name]: value, classId: "" }));
    } else {
        setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
        getEligibleStudForPromoteApiCall({ [name]: value, });
    }
  }

  function onChangeSearchHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    paginationRef.current.pageNo = 0;
    const { name, value } = event.target;
    setFilterState(prevState => ({ ...prevState, [name]: value }));
    getEligibleStudForPromoteApiCall({ [name]: value });
  }

  function paginationHndlr(paginationInfo: any) {
    paginationRef.current = paginationInfo;
    getEligibleStudForPromoteApiCall();
  }

  const toggleEligibilityPromoteModel = (apiCall?: any) => {
    if (typeof (apiCall) === "boolean" && apiCall) {
      getEligibleStudForPromoteApiCall();
    }
    setEligibilityPromoteModelState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  function clearFilterHndlr() {
    paginationRef.current.pageNo = 0;
    setFilterState(prevState => ({
      ...initialFilterState, academicYearId: prevState.academicYearId
    }));
    getEligibleStudForPromoteApiCall({
      ...initialFilterState,
      academicYearId: filterState.academicYearId,
    });
    dispatch(resetBrchClassAct(undefined));
  }

  function confirmModalHndlr() {
    const { higherClassEligibleId } = confirmModalState;
    dispatch(revertRemoveHostelPromotionAct(generateActionPayload("revert_remove_hostel_promotion", { higherClassEligibleId })));
  }

  const columns = useMemo(() => generateColumns(menuOptions), [eligibleStudForPromoteResp]);
  const { data: eligibleStudentData, pageNumber, totalPages, totalElements } = eligibleStudForPromoteResp || {};
  return (
    <>
      <div className="page-content free_payment_record_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Eligibility For Promote" pageTitle="Hostel" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">

            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-grid tw-grid-cols-12 tw-items-center">
                <div className="tw-col-span-6">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Eligibility For Promote
                  </h4>
                </div>

                <div className="tw-col-span-6 tw-flex tw-justify-end">
                  <Button
                    type="button"
                    onClick={toggleEligibilityPromoteModel}
                    variant="primary"
                  >
                    <i className="ri-add-line tw-mr-2" />
                    Add Request
                  </Button>
                </div>
              </div>
            </div>
            <div className="tw-inline-block tw-w-full">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pb-3 tw-pt-3">
                <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="search-box">
                    <TextInput
                      name="searchString"
                      formgroupClassName="tw-mb-0"
                      placeHolder="Search..."
                      value={filterState.searchString}
                      onChange={onChangeSearchHndlr}
                      labelText="Search"
                      floatingLabel
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={filterState.academicYearId}
                    onChange={onChangeFilterHndlr}
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
                    onChange={onChangeFilterHndlr}
                    menuItems={brchCurriculumResp?.data}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    formgroupClassName="tw-mb-0"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="classId"
                    value={filterState.classId}
                    onChange={onChangeFilterHndlr}
                    menuItems={branchClassResp?.content}
                    valueKey="id"
                    textKey="shortName"
                    formgroupClassName="tw-mb-0"
                    labelText="Class"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="promotionStatus"
                    value={filterState.promotionStatus}
                    onChange={onChangeFilterHndlr}
                    menuItems={promotionStatusList}
                    valueKey="id"
                    textKey="id"
                    formgroupClassName="tw-mb-0"
                    labelText="Promotion Status"
                    floatingLabel
                  />
                </div>
                <div className="tw-col-span-12 lg:tw-col-span-1 tw-flex tw-items-end">
                  {clearFilterState && (
                    <Button
                      type="button"
                      variant="wrong"
                      onClick={clearFilterHndlr}
                    >
                      Clear filter
                    </Button>
                  )}
                </div>

              </div>
            </div>
            <div className="tw-p-0">
              <TableContainer
                columns={columns}
                data={Array.isArray(eligibleStudentData) ? eligibleStudentData : []}
                tableClass="tw-mb-0"
                divClass="tw-overflow-x-auto tw-mb-3"
                theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
                showPagination={true}
                totalPages={totalPages}
                totalRecords={totalElements}
                callbackPaginationHndlr={paginationHndlr}
                currentPageNumber={pageNumber}
              />
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="detensions-or-promotions"
        isOpen={EligibilityPromoteModelState.showModal}
        toggle={toggleEligibilityPromoteModel}
        modalTitle="Higher Class Eligibility"
        modalSize="xl"
      >
        <EligibilityPromoteModel
          isOpen={EligibilityPromoteModelState.showModal}
          toggle={toggleEligibilityPromoteModel}
          branchId={branchId}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="reject-promotion"
        isOpen={confirmModalState.showModal}
        confirmMessage={confirmModalState.message}
        cancelHndlr={() => { setConfirmModalState(prevState => ({ ...prevState, showModal: false })) }}
        confirmHndlr={confirmModalHndlr}
        isDisble={showApiLoader}
        iconType='reject'
        btnClassName='btn w-sm btn-danger'
      />
    </>
  );
};

export default EligibilityPromote;

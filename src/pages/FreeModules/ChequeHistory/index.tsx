import React, { useRef, useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { SelectInput, TextInput, OffCanvasContainer, ModalContainerUpdated, ConfirmationModal } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  generateColumns, hasStateChanged,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";

import { default as FilterSvg } from "../../../assets/imagesdps/academics/FilterSvg.svg?react";
import { default as ApproveSvg } from "../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { default as CrossSvg } from "../../../assets/imagesdps/academics/CrossSvg.svg?react";
import ChequeHistoryAcceptModal from "./ChequeHistoryAcceptModal";
import AdvanceFilterModal from "./AdvanceFilterModal";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct,
  resetBrchClassAct,
  resetBrchCurriculumAct,
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import {
  exportFeeChequeListAct,
  getChequeHistoryAct,
  setChequeHistoryAct
} from "../../../store/fee/feeapprovals/feeapprovalactions";
import { downloadExcelFile } from "../../../utility/commonutility";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { IBranchInfo } from "../../../store/mastersettings/branch/branchtypes";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { CancelCircleIcon, CheckmarkCircle03StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";
//Common Utility

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  branchClassId: "",
  startDate: "",
  endDate: "",
  branchId: "",
  searchString: "",
  chequeStatus: null,
}
const ChequeHistory = ({ parentModule }: any) => {

  // This component using for Fee and Special Fee Cheque History
  const [filterState, setFilterState] = useState(initialValues);
  const [branchState, setBranchState] = useState<Array<IBranchInfo>>([]);
  const [chequeActionModalState, setChequeActionModalState] = useState({
    showModal: false,
    isApprovedAction: false,
    chequeId: ""
  });
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [count, setCount] = useState<any>(null);

  const [advanceFilterState, setAdvanceFilterState] = useState(false);

  const [exportExcel, setExportExcel] = useState({
    showModal: false,
  })

  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });

  const dispatch = useAppDispatch();
  const {
    branchClassResp,
    academicYearListResp, instAcademicErrorResp,
    brchCurriculumResp,
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    showApiLoader,
    exportFeeChequeResp,
    chequeHistoryResp,
    feeApprovalsErrorResp,
    loggedInUserRole, branchListResp, virtualRoleResp } =
    useAppSelector(({ appData, branchAcademics, feeApprovals,
      instAcademics, globalData, branch }) => ({
        branchClassResp: branchAcademics.branchClassResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        academicYearListResp: instAcademics.academicYearListResp,
        instAcademicErrorResp: instAcademics.instAcademicErrorResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        chequeHistoryResp: feeApprovals.chequeHistoryResp,
        showApiLoader: globalData.showApiLoader,
        exportFeeChequeResp: feeApprovals.exportFeeChequeResp,
        feeApprovalsErrorResp: feeApprovals.feeApprovalsErrorResp,
        loggedInUserRole: appData.loggedInUserRole,
        branchListResp: branch.branchListResp,
        virtualRoleResp: appData.virtualRoleResp
      }), shallowEqual);

  const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;
  const feeDetailsRespRef = useRef({
    prevAcademicYearListResp: academicYearListResp,
    prevBrchCurriculumResp: brchCurriculumResp,
    prevexportFeeChequeResp: exportFeeChequeResp,
    prevFeeApprovalsErrorResp: feeApprovalsErrorResp
  });

  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    }
  }, [instituteId]);

  useEffect(() => {
    const { prevAcademicYearListResp, prevBrchCurriculumResp, prevexportFeeChequeResp, prevFeeApprovalsErrorResp } = feeDetailsRespRef.current;
    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      if (Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
        let updatedBranchId = ""
        if (showInstituteAdminUI) {
          updatedBranchId = ""
        } else {
          updatedBranchId = branchId
        }
        setFilterState((prevState: any) => ({ ...prevState, academicYearId, branchId: updatedBranchId }));
        getChequeHistoryApiCall({ academicYearId, branchId: updatedBranchId, curriculumId: "" });
      }
    }
    if (brchCurriculumResp && prevBrchCurriculumResp !== brchCurriculumResp) {
      const { branchCurriculumId } = brchCurriculumResp?.data[0] || {},
        { academicYearId } = filterState;
      if (academicYearId) {
        // getChequeHistoryApiCall({ academicYearId, curriculumId: branchCurriculumId });
      }
    }
    else if (feeApprovalsErrorResp && feeApprovalsErrorResp !== prevFeeApprovalsErrorResp) {
      const { message }: any = feeApprovalsErrorResp;
      toast.error(message || "Something went wrong.");
    }
    else if (exportFeeChequeResp && prevexportFeeChequeResp !== exportFeeChequeResp) {
      toast.success("List Exported Successfully.")
      toggleExportExcelModal()
      downloadExcelFile(exportFeeChequeResp, 'Fee_Cheque_List.xlsx');
    }
    feeDetailsRespRef.current.prevAcademicYearListResp = academicYearListResp;
    feeDetailsRespRef.current.prevBrchCurriculumResp = brchCurriculumResp;
    feeDetailsRespRef.current.prevFeeApprovalsErrorResp = feeApprovalsErrorResp;
    feeDetailsRespRef.current.prevexportFeeChequeResp = exportFeeChequeResp;
  }, [academicYearListResp, brchCurriculumResp, exportFeeChequeResp, feeApprovalsErrorResp]);

  useEffect(() => {
    if (branchListResp) {
      setBranchState(branchListResp?.data.filter((branch) => branch.branchId != branchId))
    }
  }, [branchListResp])

  useEffect(() => {
    if (branchId && !showInstituteAdminUI) {
      if (academicYearListResp) {
        const { academicYearId }: any = academicYearListResp?.data.find((item: any) => item.yearStatus === "CURRENT") || {};
        getCurriculumApiCall({ academicYearId })
      }
    }
  }, [branchId, showInstituteAdminUI]);

  useEffect(() => {

    return () => {
      dispatch(setChequeHistoryAct(undefined))
    }
  }, [])

  function acceptChequeHndlr(event: any) {
    const chequeId = event.currentTarget.getAttribute("data-id");
    if (chequeId) {
      setChequeActionModalState({
        showModal: true,
        isApprovedAction: true,
        chequeId
      })
    }
  }
  function rejectChequeHndlr(event: any) {
    const chequeId = event.currentTarget.getAttribute("data-id");
    if (chequeId) {
      setChequeActionModalState({
        showModal: true,
        isApprovedAction: false,
        chequeId
      })
    }
  }

  const toggleExportExcelModal = () => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const menuOptions = useMemo(() => [
    {
      id: "acceptCheque",
      actionIcon: <HugeiconsIcon icon={CheckmarkCircle03StrokeStandard} className="me-2 text-success" size={18} />,
      actionName: "Accept Cheque",
      onClickHndlr: acceptChequeHndlr,
    },
    {
      id: "rejectCheque",
      actionIcon: <HugeiconsIcon icon={CancelCircleIcon} className="me-2 text-danger" size={18} />,
      actionName: "Reject Cheque",
      onClickHndlr: rejectChequeHndlr,
    },
  ], []);

  function toggleChequeHistoryAcceptModal(apiCall?: boolean) {
    setChequeActionModalState((prevState: any) => ({
      ...prevState,
      showModal: false,
    }));
    if (typeof (apiCall) === "boolean" && apiCall) {
      getChequeHistoryApiCall();
    }
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationDetailRef.current.pageNo = 0;
    if (name === 'academicYearId') {
      if (value) {
        getChequeHistoryApiCall({ [name]: value, branchClassId: "", curriculumId: "" });
        dispatch(resetBrchClassAct(undefined));
        setFilterState((prev: any) => ({ ...prev, [name]: value, branchClassId: "", curriculumId: "" }));
        if (branchId || filterState.branchId) {
          getCurriculumApiCall({ branchId: showInstituteAdminUI ? filterState.branchId : branchId, academicYearId: value, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" });
        }
      }
      else {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
        setFilterState((prev: any) => ({ ...prev, [name]: value, branchClassId: "", curriculumId: "" }));
      }
    }
    else if (name === "curriculumId") {
      if (!value) {
        setFilterState((prev) => ({ ...prev, [name]: "" }));
        dispatch(resetBrchClassAct(undefined));
      } else {
        setFilterState((prev) => ({ ...prev, [name]: value }));
        getChequeHistoryApiCall({ [name]: value, branchClassId: "" });
        getClassApiCall({ curriculumId: value, academicYearId: filterState.academicYearId });
      }
    }
    else if (name === 'branchId') {
      if (value) {
        getCurriculumApiCall({ branchId: value, academicYearId: filterState.academicYearId });
        setFilterState((prevState) => ({ ...prevState, [name]: value, curriculumId: "", classId: "" }));
        getChequeHistoryApiCall({ [name]: value, curriculumId: "", classId: "" });
      }
      else {
        dispatch(resetBrchCurriculumAct(undefined));
        dispatch(resetBrchClassAct(undefined));
        setFilterState((prevState) => ({ ...prevState, [name]: value, curriculumId: "", classId: "" }));
      }
    }
    else {
      setFilterState((prevState) => ({ ...prevState, [name]: value }));
      getChequeHistoryApiCall({ [name]: value });
    }
    const stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange);
    setCount(stateChanged?.count === 0 ? null : stateChanged?.count);
  }
  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getChequeHistoryApiCall();
  }

  function advanceFilterHndlr() {
    setAdvanceFilterState(true);
  }

  function closeAdvanceModalHndlr() {
    setAdvanceFilterState(false);
  }

  function advanceFilterCallbckHndlr(appliedAdvanceFilter: any) {
    const { curriculumId } = filterState;
    if (appliedAdvanceFilter.curriculumId !== curriculumId) {
      if (appliedAdvanceFilter.curriculumId) {
        getClassApiCall(appliedAdvanceFilter.curriculumId);
      } else {
        dispatch(setBrchClassAct(undefined));
      }
    }
    let updatedBranchId = ""
    if (showInstituteAdminUI) {
      updatedBranchId = filterState.branchId
    } else {
      updatedBranchId = branchId
    }
    const stateChanged = hasStateChanged({ ...filterState, ...appliedAdvanceFilter, academicYearId: "" });
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    setShowClearFilterState(stateChanged?.stateChange)
    getChequeHistoryApiCall({ ...appliedAdvanceFilter, branchId: updatedBranchId });
    setFilterState((prevState: any) => ({ ...prevState, ...appliedAdvanceFilter, branchId: updatedBranchId }));
    closeAdvanceModalHndlr();
  }

  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: showInstituteAdminUI ? filterState.branchId : branchId, academicYearId: filterState.academicYearId, curriculumId: filterState.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }
  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterState.academicYearId, branchId: showInstituteAdminUI ? filterState.branchId : branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getChequeHistoryApiCall(otherProps?: any) {
    const payload = { ...filterState, ...otherProps, ...paginationDetailRef.current, sortBy: "lastModifiedAt", orderBy: "desc", branchId, };
    if (!payload.chequeStatus) {
      payload.chequeStatus = null
    }
    dispatch(getChequeHistoryAct(generateActionPayload(parentModule === "FEE" ? "get_cheque_history" : "get_special_fee_cheque_history", undefined, payload)));
  }

  const exportModalHndler = () => {
    dispatch(exportFeeChequeListAct(generateActionPayload(parentModule === "FEE" ? "export_fee_cheque" : "export_special_fee_cheque_history", undefined, { ...filterState, branchId: showInstituteAdminUI ? filterState.branchId : branchId, instituteId }, {
      responseType: 'blob'
    })));
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
      let { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.isAdmissionDefault) || {};
      dispatch(resetBrchClassAct(undefined));
      setCount(null)
      let updatedBranchId = ""
      if (showInstituteAdminUI) {
        updatedBranchId = ""
      } else {
        updatedBranchId = branchId
      }
      if (!showInstituteAdminUI) {
        getCurriculumApiCall({ academicYearId, branchId: updatedBranchId });
      }
      else {
        dispatch(resetBrchCurriculumAct(undefined));
      }
      setFilterState({ ...initialValues, academicYearId, branchId: updatedBranchId })
      getChequeHistoryApiCall({ ...initialValues, academicYearId, branchId: updatedBranchId })
      setShowClearFilterState(false)
    }
  }

  const chequeHistoryColumns = useMemo(() => {
    const newColumns = generateColumns(menuOptions);
    return newColumns.filter((item: any) => {
      if (item?.Header === "Actions") {
        if (!showInstituteAdminUI) {
          return true
        }
        return false
      }
      else if (item?.Header === "Branch Name") {
        if (showInstituteAdminUI) {
          return true
        }
        return false
      }
      return true
    })
  }, [chequeHistoryResp, showInstituteAdminUI]);


  const { data: chequeListResp, totalPages, totalElements } = chequeHistoryResp || {};
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Cheques Details" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Cheques Details
                  </h4>
                </div>

                <div className="tw-ml-auto">
                  <Button
                    id="export-btn"
                    variant="exportBtn"
                    onClick={toggleExportExcelModal}

                  >
                    <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                  </Button>

                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </div>
              </div>
            </div>

            <div className="tw-p-0">
              <div className="tw-py-4 tw-px-3">
                <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                  <div className="tw-col-span-3">
                    <div className="search-box tw-relative">
                      <TextInput
                        name="searchString"
                        value={filterState.searchString}
                        onChange={onChangeFilterHndlr}
                        inputClassName="tw-bg-gray-100"
                        formgroupClassName="tw-mb-0"
                        placeHolder="Search"
                        labelText="Search"
                        floatingLabel
                      />
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2"></i>
                    </div>
                  </div>

                  <div className="tw-col-span-2">
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

                  {showInstituteAdminUI && (
                    <div className="tw-col-span-12 tw-lg:col-span-3 tw-xl:col-span-2">
                      <SelectInput
                        name="branchId"
                        valueKey="branchId"
                        textKey="branchName"
                        value={filterState.branchId}
                        menuItems={branchState}
                        onChange={onChangeFilterHndlr}
                        labelText="Branch Name"
                        floatingLabel
                        formgroupClassName="tw-mb-0"
                      />
                    </div>
                  )}

                  <div className="tw-col-span-2">
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

                  <div className="tw-col-span-2">
                    <SelectInput
                      name="branchClassId"
                      value={filterState.branchClassId}
                      onChange={onChangeFilterHndlr}
                      menuItems={branchClassResp?.content}
                      valueKey="id"
                      textKey="shortName"
                      formgroupClassName="tw-mb-0"
                      labelText="Class"
                      floatingLabel
                    />
                  </div>

                  <div className="tw-relative">
                    <div
                      onClick={advanceFilterHndlr}
                      className="tw-flex tw-items-center tw-gap-2 tw-bg-gray-100 tw-p-2 tw-cursor-pointer tw-rounded"
                    >
                      <FilterSvg height="18px" width="18px" />
                      <span>Filters</span>
                    </div>

                    <span
                      className="tw-absolute tw--top-2 tw-left-16 tw-rounded-full tw-bg-emerald-500 tw-text-white tw-text-xs tw-px-2"
                    >
                      {count}
                    </span>
                  </div>

                  {showClearFilterState && (
                    <div className="tw-col-span-12 xl:tw-col-span-2 tw-flex tw-items-end tw-justify-end tw-gap-2 tw-flex-wrap">
                      <Button
                        variant="wrong"
                        type="button"
                        onClick={clearFilterHndlr}
                      >
                        Clear filter
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <TableContainer
              columns={chequeHistoryColumns}
              data={Array.isArray(chequeListResp) ? chequeListResp : []}
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
              showPagination={true}
              totalPages={totalPages}
              totalRecords={totalElements}
              callbackPaginationHndlr={paginationHndlr}
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="admission-withdrawal-modal"
        isOpen={chequeActionModalState.showModal}
        hideHeader={true}
        toggle={toggleChequeHistoryAcceptModal}
        modalTitle="Yes Approve it !"
        modalSize="md"
      >
        <ChequeHistoryAcceptModal
          chequeId={chequeActionModalState.chequeId}
          isApprovedAction={chequeActionModalState.isApprovedAction}
          toggle={toggleChequeHistoryAcceptModal}
          parentModule={parentModule}
        />
      </ModalContainerUpdated>
      <OffCanvasContainer
        isOpen={advanceFilterState}
        headerTitle="Cheque Advance Filters"
        closeHndlr={closeAdvanceModalHndlr}
        id="cheque-advance-filter-modal"
      >
        <AdvanceFilterModal
          getClassApiCall={getClassApiCall}
          appliedFilter={filterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
        />
      </OffCanvasContainer>
      <ModalContainerUpdated
        id="fee-cheque-export-modal"
        isOpen={exportExcel.showModal}
        toggle={toggleExportExcelModal}
        modalTitle='Export Cheque History Data'
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcel.showModal}
          toggle={toggleExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportModalHndler}
          feature="fee"
          subFeature={!showInstituteAdminUI ? "cheque_history" : ""}
          remarksText="Enter remarks to export cheque history data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ChequeHistory;

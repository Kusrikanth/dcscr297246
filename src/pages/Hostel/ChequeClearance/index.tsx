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
} from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import AdvanceFilterModal from "./AdvanceFilterModal";
import ChequeHistoryAcceptModal from "./ChequeHistoryAcceptModal";
import { exportHostelChequeClearanceAct, getHostelChequeClearanceListAct } from "../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { CancelCircleIcon, CheckmarkCircle03StrokeStandard } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import Button from "../../../Components/Common/Button";
//Common Utility

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  branchClassId: "",
  startDate: "",
  endDate: "",
  searchString: "",
}
const ChequeClearance = () => {
  const [filterState, setFilterState] = useState<any>(initialValues);
  const [chequeActionModalState, setChequeActionModalState] = useState({
    showModal: false,
    isApprovedAction: false,
    chequeId: ""
  });
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const [count, setCount] = useState<any>(null);

  const [advanceFilterState, setAdvanceFilterState] = useState(false);

  const [exportExcel, setExportExcel] = useState<any>({
    showModal: false,
    scrutinyId: undefined
})

  const paginationDetailRef = useRef<any>({
    pageNo: 0,
    pageSize: 10,
  });

  const dispatch = useAppDispatch();
  const {
    branchClassResp,
    academicYearListResp, instAcademicErrorResp,
    brchCurriculumResp,
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    getHostelChequeClearanceListResp,
    hostelStuLedgerErrResp,
    approvRejectChequeResp,
    exportHostelChequeClearanceResp,
    showApiLoader,
    feeApprovalsErrorResp } =
    useAppSelector(({ appData, branchAcademics, feeApprovals,hostelStuLedger, globalData,
      instAcademics }) => ({
        branchClassResp: branchAcademics.branchClassResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        academicYearListResp: instAcademics.academicYearListResp,
        instAcademicErrorResp: instAcademics.instAcademicErrorResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        getHostelChequeClearanceListResp: hostelStuLedger.getHostelChequeClearanceListResp,
        hostelStuLedgerErrResp: hostelStuLedger.hostelStuLedgerErrResp,
        approvRejectChequeResp: feeApprovals.approvRejectChequeResp,
        feeApprovalsErrorResp: feeApprovals.feeApprovalsErrorResp,
        showApiLoader: globalData.showApiLoader,
        exportHostelChequeClearanceResp: hostelStuLedger.exportHostelChequeClearanceResp,
      }), shallowEqual);
  const feeDetailsRespRef = useRef<any>({
    prevAcademicYearListResp: academicYearListResp,
    prevBrchCurriculumResp: brchCurriculumResp,
    prevFeeApprovalsErrorResp: feeApprovalsErrorResp,
    prevHostelStuLedgerErrResp: hostelStuLedgerErrResp,
    prevExportHostelChequeClearanceResp: exportHostelChequeClearanceResp,
  });

  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    }
  }, [branchId,instituteId]);

  useEffect(() => {
    const { prevAcademicYearListResp, prevBrchCurriculumResp, prevFeeApprovalsErrorResp , prevExportHostelChequeClearanceResp, prevHostelStuLedgerErrResp } = feeDetailsRespRef.current;
    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      if (Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } = academicYearListResp.data?.find((year: any) =>  year.yearStatus === "CURRENT") || {};
        getCurriculumApiCall({ academicYearId });
        setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
        // if (curriculumId) {
          getChequeHistoryApiCall({ academicYearId, curriculumId :"" });
        // }
      }
    }
    if (brchCurriculumResp && prevBrchCurriculumResp !== brchCurriculumResp) {
      const { branchCurriculumId } = brchCurriculumResp?.data[0] || {},
        { academicYearId } = filterState;
      // setFilterState((prevState: any) => ({ ...prevState, curriculumId: branchCurriculumId }));
      // getClassApiCall(branchCurriculumId);
      if (academicYearId) {
        // getChequeHistoryApiCall({ academicYearId, curriculumId: branchCurriculumId });
      }
    }
    else if (feeApprovalsErrorResp && feeApprovalsErrorResp !== prevFeeApprovalsErrorResp) {
      const { message }: any = feeApprovalsErrorResp;
      toast.error(message || "Something went wrong.");
    }
    else if(hostelStuLedgerErrResp && prevHostelStuLedgerErrResp !== hostelStuLedgerErrResp) {
      const { message }: any = hostelStuLedgerErrResp;
      toast.error(message || "Something went wrong.");
    }
    else if (exportHostelChequeClearanceResp && exportHostelChequeClearanceResp !== prevExportHostelChequeClearanceResp) {
      toast.success("Hostel Cheque Clearance Data Download Successfully.");
      toggleExportExcelModal();
      downloadExcelFile(exportHostelChequeClearanceResp)
    }
    feeDetailsRespRef.current.prevAcademicYearListResp = academicYearListResp;
    feeDetailsRespRef.current.prevBrchCurriculumResp = brchCurriculumResp;
    feeDetailsRespRef.current.prevExportHostelChequeClearanceResp = exportHostelChequeClearanceResp
    feeDetailsRespRef.current.prevFeeApprovalsErrorResp = feeApprovalsErrorResp;
    feeDetailsRespRef.current.prevHostelStuLedgerErrResp = hostelStuLedgerErrResp;
  }, [academicYearListResp, brchCurriculumResp, feeApprovalsErrorResp ,hostelStuLedgerErrResp, exportHostelChequeClearanceResp,branchId,instituteId]);



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

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getClassApiCall(curriculumId: string) {
    const payload = {
      curriculumId, branchId,academicYearId : filterState.academicYearId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value })
      setFilterState((prev: any) => ({ ...prev, [name]: value, classId: "", curriculumId: "" }))
      getChequeHistoryApiCall({ academicYearId: value, classId: "", curriculumId: "" })
      dispatch(resetBrchClassAct(undefined));
    }
    else if (name === 'curriculumId') {
      setFilterState((prev: any) => ({ ...prev, [name]: value,classId:"" }))
      getChequeHistoryApiCall({ curriculumId: value, classId: "" })
      if (value) {
          getClassApiCall(value)
      }
      else {
          dispatch(resetBrchClassAct(undefined));
      }
    }
    else {
        setFilterState((prev: any) => ({ ...prev, [name]: value }))
        getChequeHistoryApiCall({ [name]: value })
    }

    const stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
        setShowClearFilterState(stateChanged?.stateChange)
        stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
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
    const stateChanged = hasStateChanged({ ...filterState, ...appliedAdvanceFilter, academicYearId: "" });
    stateChanged?.count === 0 ? setCount(null) : setCount(stateChanged?.count)
    setShowClearFilterState(stateChanged?.stateChange)
    getChequeHistoryApiCall(appliedAdvanceFilter);
    setFilterState((prevState: any) => ({ ...prevState, ...appliedAdvanceFilter }));
    closeAdvanceModalHndlr();
  }

  function getChequeHistoryApiCall(otherProps?: any) {
    const payload = { branchId, ...filterState, ...otherProps, ...paginationDetailRef.current, sortBy: "lastModifiedAt", orderBy: "desc" };
    dispatch(getHostelChequeClearanceListAct(generateActionPayload("hostel_cheque_clearance", undefined, payload)));
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
        paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
        let { academicYearId } = academicYearListResp?.data?.find((year: any) =>  year.yearStatus === "CURRENT") || {};
        dispatch(resetBrchClassAct(undefined));
        setCount(null)
        setFilterState({ ...initialValues, academicYearId })
        getChequeHistoryApiCall({ ...initialValues, academicYearId })
        setShowClearFilterState(false)
    }
}

const toggleExportExcelModal = (id?: any) => {
  setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      scrutinyId: id || "",
  }));
};
function downloadExcelFile(blobStream: any) {

  const url = window.URL.createObjectURL(new Blob([(blobStream)]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'Hostel_Cheque_Clearance.xlsx');
  document.body.appendChild(link);
  link.click();
  link.remove();
}
const exportExcelHndler = () => {

dispatch(exportHostelChequeClearanceAct(generateActionPayload("export_hostel_cheque_clearance", undefined, { ...filterState, branchId, instituteId }, {
    responseType: 'blob'
})));
}

  const chequeHistoryColumns = useMemo(() => generateColumns(menuOptions), [getHostelChequeClearanceListResp]);
  const { data: chequeListResp, totalPages, totalElements } = getHostelChequeClearanceListResp || {};
  return (
    <>
      <div className="page-content">
        <div className="tw-mx-auto tw-px-4">
          <BreadCrumb title="Cheques Details" pageTitle="Hostel" />
          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-200">
              <div className="tw-grid tw-grid-cols-1 tw-items-center">
                <div className="tw-col-span-1">
                  <h4 className="tw-text-lg tw-font-medium tw-mb-0 tw-flex-grow">
                    Cheques Details
                  </h4>
                </div>
              </div>
            </div>
            <div className="tw-p-0">
              <div className="tw-py-3 tw-px-3">
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-12 tw-gap-3">
                  <div className="tw-col-span-1 lg:tw-col-span-3">
                    <div className="search-box">
                      <TextInput
                        name="searchString"
                        value={filterState.searchString}
                        onChange={onChangeFilterHndlr}
                        inputClassName="bg-soft-light"
                        formgroupClassName="tw-mb-0"
                        labelText="Search"
                        placeHolder="Search"
                        floatingLabel
                      />

                      <i className="ri-search-line search-icon"></i>
                    </div>
                  </div>
                  <div className="tw-col-span-1 lg:tw-col-span-2">
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
                  <div className="tw-col-span-1 lg:tw-col-span-2">
                    <SelectInput
                      name="curriculumId"
                      value={filterState.curriculumId}
                      onChange={onChangeFilterHndlr}
                      menuItems={brchCurriculumResp?.data}
                      valueKey="branchCurriculumId"
                      textKey="curriculumName"
                      formgroupClassName="tw-mb-0"
                      labelText="Curriculam"
                      floatingLabel
                    />
                  </div>
                  <div className="tw-col-span-1 lg:tw-col-span-2">
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
                  <div className="tw-col-span-1 xl:tw-col-span-1">
                    <button
                      className="tw-p-2 tw-flex tw-items-center tw-border-0 tw-rounded hover:tw-bg-gray-200 tw-transition-colors"
                      style={{
                        backgroundColor: "#F4F7FA",
                      }}
                      onClick={advanceFilterHndlr}
                    >
                      <FilterSvg height={"18px"} width={"18px"} />
                      <span className='tw-ml-2'>Filters</span>
                    </button>
                    <span className="tw-inline-flex tw-items-center tw-justify-center tw-px-2 tw-py-1 tw-text-xs tw-font-medium tw-text-white tw-rounded-full tw-absolute" style={{ marginBottom: "18px", position: "absolute", top: "-9px", left: "78px", background: "#0ab39c" }}>
                      {count}
                    </span>
                  </div>
                  <div className='tw-col-span-2 tw-flex tw-ml-auto tw-gap-2'>
                    {showClearFilterState && <Button type="button" onClick={clearFilterHndlr} variant="wrong">Clear filter</Button>}
                    <Button variant="info" style={{ background: "#405189" }} onClick={() => toggleExportExcelModal()} >
                      <div className="tw-flex tw-items-center tw-text-white">
                        <span><i className="ri-add-line tw-mr-1" /></span>
                        <span>Export</span>
                      </div>
                    </Button>
                  </div>

                </div> 
              </div>
            </div>
            <TableContainer
              columns={chequeHistoryColumns}
              data={Array.isArray(chequeListResp) ? chequeListResp : []}
              divClass="tw-overflow-x-auto tw-mb-3"
              theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
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
        />
      </ModalContainerUpdated>
      <OffCanvasContainer
        isOpen={advanceFilterState}
        headerTitle="Cheque Advance Filters"
        closeHndlr={closeAdvanceModalHndlr}
        id="hostel-cheque-advance-filter-modal"
      >
        <AdvanceFilterModal
          getClassApiCall={getClassApiCall}
          appliedFilter={filterState}
          applyFilterCallback={advanceFilterCallbckHndlr}
        />

      </OffCanvasContainer>
        <ModalContainerUpdated
                id="Hostel-Cheque-Clearance-export"
                isOpen={exportExcel.showModal}
                toggle={toggleExportExcelModal}
                modalTitle="Export Hostel Cheque Clearance Data"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportExcel.showModal}
                    toggle={toggleExportExcelModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportExcelHndler}
                    feature="hostel"
                    subFeature="cheque_clearance"
                    remarksText="Enter remarks to export hostel cheque clearance data?"
                />
            </ModalContainerUpdated>
    </>
  );
};

export default ChequeClearance;

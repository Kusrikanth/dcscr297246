import React, { useRef, useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { ConfirmationModal, ModalContainerUpdated, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useHistory } from "react-router-dom";
import {
  generateColumns,
  hasStateChanged,
} from "./helper";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../../utility/reduxutility";
import {
  getInstAcademicYearAct,
} from "../../../../store/mastersettings/instacademics/instacademicactions";
import {
  getBranchCurriculumAct, getBranchClassAct,
  setBrchClassAct,
  resetBrchClassAct,
} from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { exportHostelFeeRefundsAct, getHostelFeeRefundsListAct } from "../../../../store/hostel/hostelfee/hostelstudentledger/hostelstudentledgeractions";
import { useModal } from "../../../../hooks/modalhook";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import Button from "../../../../Components/Common/Button";

const initialFilterState = {
  studentName: "",
  startDate: "",
  endDate: "",
  branchClassId: "",
  academicYearId: "",
  branchCurriculumId: "",
};
const FeeRefunds = () => {
  const history = useHistory();
  const [filterState, setFilterState] = useState(initialFilterState);
  const [showClearFilterState, setShowClearFilterState] = useState(false);
  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();

  const dispatch = useAppDispatch();
  const {
    branchClassResp,
    academicYearListResp,
    brchCurriculumResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    exportHostelFeeRefundsResp, hostelStuLedgerErrResp,
    getHostelFeeRefundsListResp,
    showApiLoader } =
    useAppSelector(({ appData, branchAcademics,
      instAcademics, globalData, hostelStuLedger }) => ({
        branchClassResp: branchAcademics.branchClassResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        academicYearListResp: instAcademics.academicYearListResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        exportHostelFeeRefundsResp: hostelStuLedger.exportHostelFeeRefundsResp,
        showApiLoader: globalData.showApiLoader,
        getHostelFeeRefundsListResp: hostelStuLedger.getHostelFeeRefundsListResp,
        hostelStuLedgerErrResp: hostelStuLedger.hostelStuLedgerErrResp,
      }), shallowEqual);

  const feeDetailsRespRef = useRef({
    prevAcademicYearListResp: academicYearListResp,
    prevExportHostelFeeRefundsResp: exportHostelFeeRefundsResp,
    prevHostelStuLedgerErrResp: hostelStuLedgerErrResp
  });

  useEffect(() => {
    const { prevAcademicYearListResp, prevExportHostelFeeRefundsResp, prevHostelStuLedgerErrResp } = feeDetailsRespRef.current;
    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      if (Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
        setFilterState((prevState: any) => ({ ...prevState, academicYearId }));
        getHostelFeeRefundApiCall({ academicYearId });
        getCurriculumApiCall({ academicYearId })
      }
    }
    else if (hostelStuLedgerErrResp && hostelStuLedgerErrResp !== prevHostelStuLedgerErrResp) {
      const { details } = hostelStuLedgerErrResp;
      toast.error(details || "Something went wrong.");
    }
    else if (exportHostelFeeRefundsResp && prevExportHostelFeeRefundsResp !== exportHostelFeeRefundsResp) {
      toast.success("List Exported Successfully.")
      closeExportExcelModal()
      downloadExcelFile(exportHostelFeeRefundsResp, 'Hostel_Fee_Refund_List.xlsx');
    }
    feeDetailsRespRef.current.prevAcademicYearListResp = academicYearListResp;
    feeDetailsRespRef.current.prevExportHostelFeeRefundsResp = exportHostelFeeRefundsResp;
    feeDetailsRespRef.current.prevHostelStuLedgerErrResp = hostelStuLedgerErrResp;
  }, [academicYearListResp, exportHostelFeeRefundsResp, hostelStuLedgerErrResp]);

  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    }
  }, [branchId, instituteId]);

  const moveToNewFeeRefundHandler = () => {
    history.push("/hostel-fee-refund/create-refund");
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterState.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getClassApiCall(curriculumId: string) {
    const payload = {
      curriculumId, branchId, academicYearId: filterState.academicYearId, pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationDetailRef.current.pageNo = 0;

    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value })
      setFilterState((prev: any) => ({ ...prev, [name]: value, branchClassId: "", branchCurriculumId: "" }))
      getHostelFeeRefundApiCall({ academicYearId: value, branchClassId: "", branchCurriculumId: "" })
      dispatch(resetBrchClassAct(undefined));
    }
    else if (name === 'branchCurriculumId') {
      setFilterState((prev: any) => ({ ...prev, [name]: value, branchClassId: "" }))
      getHostelFeeRefundApiCall({ branchCurriculumId: value, branchClassId: "" })
      if (value) {
        getClassApiCall(value)
      }
      else {
        dispatch(resetBrchClassAct(undefined));
      }
    }
    else {
      setFilterState((prev: any) => ({ ...prev, [name]: value }))
      getHostelFeeRefundApiCall({ [name]: value })
    }
    const stateChanged = hasStateChanged({ ...filterState, [name]: value, academicYearId: "" });
    setShowClearFilterState(stateChanged?.stateChange)
  }

  function getHostelFeeRefundApiCall(otherProps?: any) {
    const payload = { instituteId, branchId, ...filterState, ...paginationDetailRef.current, ...otherProps };
    dispatch(getHostelFeeRefundsListAct(generateActionPayload("get_hostel_fee_refund_list", undefined, payload)));
  }

  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getHostelFeeRefundApiCall();
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
      let { academicYearId = "" } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      dispatch(resetBrchClassAct(undefined));
      setFilterState({ ...initialFilterState, academicYearId })
      getHostelFeeRefundApiCall({ ...initialFilterState, academicYearId })
      setShowClearFilterState(false)
    }
  }

  const exportExcelHndler = () => {

    dispatch(exportHostelFeeRefundsAct(generateActionPayload("export_hostel_fee_refund_list", undefined, { ...filterState, branchId, instituteId }, {
      responseType: 'blob'
    })));
  }

  const roleColumns = useMemo(() => generateColumns(), []),
    { data: refundsList, pageNumber, totalPages, totalElements } = getHostelFeeRefundsListResp || {};
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Fee Refunds" pageTitle="Fee" />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-6 tw-py-4">
              <div className="tw-flex tw-items-center tw-justify-between">
                <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800">
                  Refund List
                </h4>

                <div className="tw-flex tw-items-center tw-gap-2">
                  <Button
                    onClick={moveToNewFeeRefundHandler}
                    variant="primary"
                  >
                    <i className="ri-add-line" />
                    Create New
                  </Button>

                  <Button
                    onClick={openExportExcelModal}
                    variant="info"
                  >
                    <i className="ri-add-line" />
                    Export
                  </Button>
                </div>
              </div>
            </div>

            <div className="tw-p-0">
                            <div className="tw-py-3 tw-px-3">
              <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                  <div className="tw-relative search-box">
                    <TextInput
                      name="studentName"
                      value={filterState.studentName}
                      onChange={onChangeFilterHndlr}
                      inputClassName="tw-bg-gray-100"
                      formgroupClassName="tw-mb-0"
                      labelText="Search"
                      placeHolder="Search"
                      floatingLabel
                    />
                    <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                  </div>
                </div>

                <div className="xl:tw-col-span-2">
                  <SelectInput
                    name="academicYearId"
                    value={filterState.academicYearId}
                    onChange={onChangeFilterHndlr}
                    menuItems={academicYearListResp?.data}
                    valueKey="academicYearId"
                    textKey="academicYearName"
                    labelText="Academic Year"
                    floatingLabel
                  />
                </div>

                <div className="xl:tw-col-span-2">
                  <SelectInput
                    name="branchCurriculumId"
                    value={filterState.branchCurriculumId}
                    onChange={onChangeFilterHndlr}
                    menuItems={brchCurriculumResp?.data}
                    valueKey="branchCurriculumId"
                    textKey="curriculumName"
                    labelText="Curriculum"
                    floatingLabel
                  />
                </div>

                <div className="xl:tw-col-span-2">
                  <SelectInput
                    name="branchClassId"
                    value={filterState.branchClassId}
                    onChange={onChangeFilterHndlr}
                    menuItems={branchClassResp?.content}
                    valueKey="id"
                    textKey="shortName"
                    labelText="Class"
                    floatingLabel
                  />
                </div>

                <div className="xl:tw-col-span-3 tw-flex tw-justify-end">
                  {showClearFilterState && (
                    <Button
                      type="button"
                      onClick={clearFilterHndlr}
                      variant="wrong"
                    >
                      Clear filter
                    </Button>
                  )}
                </div>
              </div>
              </div>
            </div>

            <TableContainer
              columns={roleColumns || []}
              data={Array.isArray(refundsList) ? refundsList : []}
              divClass="tw-overflow-x-auto tw-mb-3"
              tableClass="tw-mb-0"
              theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
              showPagination={true}
              totalPages={totalPages}
              totalRecords={totalElements}
              callbackPaginationHndlr={paginationHndlr}
              currentPageNumber={pageNumber}
            />
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="Hostel-Fee-Refund-export"
        isOpen={exportExcelState.showModal}
        toggle={closeExportExcelModal}
        modalTitle="Export Hostel Fee Refund Data"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcelState.showModal}
          toggle={closeExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="hostel"
          subFeature="fee_refund"
          remarksText="Enter remarks to export hostel fee refund data?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default FeeRefunds;

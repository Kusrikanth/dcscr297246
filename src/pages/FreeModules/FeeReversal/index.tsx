import React, { useRef, useEffect, useMemo, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { SelectInput, TextInput, ConfirmationModal, ModalContainerUpdated } from "../../../Components/Common";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import {
  generateColumns,
} from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

//Action Generator
import { generateActionPayload } from "../../../utility/reduxutility";
import {
  getInstAcademicYearAct,
} from "../../../store/mastersettings/instacademics/instacademicactions";
import { exportFeeReversalAct, getFeeReversalsAct } from "../../../store/fee/feecollections/feecollectionactions";
import PreviewReceipt from "./PreviewReceipt";
import { useLocation } from "react-router-dom";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { IBranchInfo } from "../../../store/mastersettings/branch/branchtypes";
import { useFilterState } from "../../../hooks/filterhook";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { PrinterIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../Components/Common/Button";

//Common Utility

const initialValues = {
  searchString: "",
  academicYearId: "",
  branchId: "",
}
const FeeReversal = () => {
  const [filterState, setFilterState] = useState(initialValues);
  const [branchState, setBranchState] = useState<Array<IBranchInfo>>([]);
  const { showClearFilterState, advanceFilterChange } = useFilterState();


  const paginationDetailRef = useRef({
    pageNo: 0,
    pageSize: 10,
  });
  const location = useLocation();

  // This component is used in Special Fee Reversal and Fee Reversal pages; the condition below adapts the logic for each context.
  const componentType = location.pathname.includes("special") ? "special_fee" : "fee"
  const studentTypes = location.pathname.includes("special") ? ["SPECIAL_FEE"] : ["EXISTING_STUDENT", "NEW_STUDENT"]

  const [exportExcel, setExportExcel] = useState({
    showModal: false,
  })

  const [printReceipt, setPrintReceipt] = useState({
    showModal: false,
    receiptId: undefined,
  })

  const dispatch = useAppDispatch();
  const {
    academicYearListResp, instAcademicErrorResp,
    currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    feeReversalsResp, feeCollectionErrorResp, showApiLoader, exportFeeReversalResp, loggedInUserRole,
    branchListResp, virtualRoleResp
  } =
    useAppSelector(({ appData, globalData, feeCollections,
      instAcademics, branch }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        instAcademicErrorResp: instAcademics.instAcademicErrorResp,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        showApiLoader: globalData.showApiLoader,
        feeReversalsResp: feeCollections.feeReversalsResp,
        exportFeeReversalResp: feeCollections.exportFeeReversalResp,
        feeCollectionErrorResp: feeCollections.feeCollectionErrorResp,
        loggedInUserRole: appData.loggedInUserRole,
        branchListResp: branch.branchListResp,
        virtualRoleResp: appData.virtualRoleResp
      }), shallowEqual);

  const showInstituteAdminUI = loggedInUserRole === 'INSTITUTE_ADMIN' && !virtualRoleResp;


  const feeDetailsRespRef = useRef<any>({
    prevAcademicYearListResp: academicYearListResp,
    prevFeeReversalsResp: feeReversalsResp,
    prevExportFeeReversalResp: exportFeeReversalResp,
    prevFeeCollectionErrorResp: feeCollectionErrorResp
  });

  useEffect(() => {
    if (instituteId) {
      const payload = { instituteId, sortBy: "academicYearName", orderBy: "desc", pageNo: 0, pageSize: 20 };
      dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));
    }
  }, [instituteId]);

  useEffect(() => {
    const { prevAcademicYearListResp, prevExportFeeReversalResp, prevFeeApprovalsErrorResp } = feeDetailsRespRef.current;
    if (academicYearListResp && prevAcademicYearListResp !== academicYearListResp) {
      if (Array.isArray(academicYearListResp?.data)) {
        const { academicYearId } = academicYearListResp.data?.find((year: any) => year.yearStatus === "CURRENT") || {};
        let updatedBranchId = ""
        if (showInstituteAdminUI) {
          updatedBranchId = ""
        } else {
          updatedBranchId = branchId
        }
        // { curriculumId } = filterState;
        setFilterState((prevState: any) => ({ ...prevState, academicYearId, branchId: updatedBranchId }));
        // if (curriculumId) {
        getFeeReversalApiCall({ academicYearId, branchId: updatedBranchId });
        // }
      }
    }
    else if (exportFeeReversalResp && prevExportFeeReversalResp !== exportFeeReversalResp) {
      toast.success("Fee Reversal List Exported Successfully.")
      toggleExportExcelModal()
      downloadExcelFile(exportFeeReversalResp)

    }
    feeDetailsRespRef.current.prevAcademicYearListResp = academicYearListResp;
    feeDetailsRespRef.current.prevExportFeeReversalResp = exportFeeReversalResp;
  }, [academicYearListResp, exportFeeReversalResp]);

  useEffect(() => {
    if (branchListResp) {
      setBranchState(branchListResp?.data.filter((branch: any) => branch.branchId != branchId))
    }
  }, [branchListResp])

  function printReceiptHndlr(event: any) {
    const feeReceiptId = event.currentTarget.getAttribute("data-id");
    if (feeReceiptId) {
      togglePrintReceiptModal(feeReceiptId);
    }

  }

  const menuOptions = useMemo(
    () => [
      {
        id: "print",
        actionIcon: <HugeiconsIcon icon={PrinterIcon} className="me-2 text-muted" size={18} />,
        actionName: "Print",
        onClickHndlr: printReceiptHndlr,
      },
    ], [feeReversalsResp]);

  function downloadExcelFile(blobStream: any) {

    const url = window.URL.createObjectURL(new Blob([(blobStream)]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'fee_reversal.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function onChangeFilterHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    paginationDetailRef.current.pageNo = 0;
    setFilterState((prevState: any) => ({ ...prevState, [name]: value }));
    getFeeReversalApiCall({ [name]: value });
    advanceFilterChange({ keys: { ...filterState, [name]: value }, ignoredKeys: [] })


  }
  function paginationHndlr(paginationInfo: any) {
    paginationDetailRef.current = paginationInfo;
    getFeeReversalApiCall();
  }


  function getFeeReversalApiCall(otherProps?: any) {
    const payload = { studentTypes: studentTypes.join(","), ...filterState, ...otherProps, ...paginationDetailRef.current };
    dispatch(getFeeReversalsAct(generateActionPayload("get_fee_reversal", undefined, payload)));
  }

  const toggleExportExcelModal = () => {
    setExportExcel((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const togglePrintReceiptModal = (receiptId?: any) => {
    setPrintReceipt((prevState: any) => ({
      ...prevState,
      showModal: !prevState.showModal,
      receiptId: receiptId || "",
    }));
  };

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      paginationDetailRef.current = { ...paginationDetailRef.current, pageNo: 0 }
      let { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus === "CURRENT") || { academicYearId: "" };
      let updatedBranchId = ""
      if (showInstituteAdminUI) {
        updatedBranchId = ""
      } else {
        updatedBranchId = branchId
      }
      setFilterState({ ...initialValues, academicYearId, branchId: updatedBranchId });
      getFeeReversalApiCall({ ...initialValues, academicYearId, branchId: updatedBranchId });
      advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] })
    }
  }

  const exportExcelHndler = () => {
    const payload = {
      ...filterState, studentTypes: studentTypes.join(","),
    }
    dispatch(exportFeeReversalAct(generateActionPayload("export_fee_reversal", undefined, { ...payload, branchId: showInstituteAdminUI ? filterState.branchId : branchId }, {
      responseType: 'blob'
    })));
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
  }, [feeReversalsResp, showInstituteAdminUI]);
  const { data: feeReversalList, totalPages, totalElements } = feeReversalsResp || {};
  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb
            title="Cheques Details"
            pageTitle={componentType === "special_fee" ? "Special Fee" : "Fee"}
          />

          <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3">
              <div className="tw-flex tw-items-center">
                <div className="tw-w-1/2">
                  <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    {componentType === "special_fee"
                      ? "Special Fee Reversal"
                      : "Fee Reversal"}
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
                      <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2" />
                    </div>
                  </div>

                  {showInstituteAdminUI && (
                    <div className="tw-col-span-2">
                      <SelectInput
                        name="branchId"
                        valueKey="branchId"
                        textKey="branchName"
                        value={filterState.branchId}
                        menuItems={branchState}
                        onChange={onChangeFilterHndlr}
                        formgroupClassName="tw-mb-0"
                        labelText="Branch Name"
                        floatingLabel
                      />
                    </div>
                  )}

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

                  {showClearFilterState && (
                    <div className="tw-col-span-auto tw-flex tw-justify-end">
                      <Button
                        type="button"
                        onClick={clearFilterHndlr}
                        variant="wrong"
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
              data={Array.isArray(feeReversalList) ? feeReversalList : []}
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
        id="fee-reversal-export"
        isOpen={exportExcel.showModal}
        toggle={toggleExportExcelModal}
        modalTitle={componentType === 'special_fee' ? 'Export Special Fee Reversal Data' : 'Export Fee Reversal Data'}
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcel.showModal}
          toggle={toggleExportExcelModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportExcelHndler}
          feature="fee"
          subFeature={!showInstituteAdminUI ? (componentType === 'special_fee' ? "special_fee_fee_reversal" : "fee_reversals") : ""}
          remarksText={componentType === 'special_fee' ?
            "Enter remarks to export special fee reversal data?" :
            "Enter remarks to export fee reversal data?"}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="print-receipt-modal"
        isOpen={printReceipt.showModal}
        toggle={() => togglePrintReceiptModal()}
        modalTitle="Receipt Details"
        modalSize="lg"
      >
        <PreviewReceipt
          toggle={() => togglePrintReceiptModal()}
          receiptId={printReceipt.receiptId}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default FeeReversal;

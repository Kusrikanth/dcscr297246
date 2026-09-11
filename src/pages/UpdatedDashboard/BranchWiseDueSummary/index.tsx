import { useEffect, useMemo, useRef, useState } from "react";
import { Button, ModalContainerUpdated, SelectInput, TableExpandable } from "../../../Components/Common";
import { feeTypeOptions, generateColumns, modeOptions, stuStatusOptions } from "./helper";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { exportBranchWiseDueSummaryAct, getBranchWiseDueSummaryAct, getBranchWiseNetAmountAct, getFeeTermByTypeAct } from "../../../store/fee/feereport/feereportactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { useFilterState } from "../../../hooks/filterhook";
import { useModal } from "../../../hooks/modalhook";
import ShowStudents from "./ShowStudents";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../utility/commonutility";

const initialValues = {
  academicYearId: "",
  termId: "",
  mode: "",
  studentStatus: "",
}

const BranchWiseDueSummary = (props: any) => {

  const dispatch = useAppDispatch()
  const [filterState, setFilterState] = useState(initialValues);
  const [tableDataState, setTableDataState] = useState([]);
  const { closeModal: closeShowStuModal, openModal: openShowStuModal, modalState: showStuModalState } = useModal()
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()
  const { showClearFilterState, advanceFilterChange } = useFilterState();

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    feeTermByTypeResp,
    getBranchWiseNetAmountResp,
    getBranchWiseDueSummaryExportResp,
    feeReportErrorResp,
  } = useAppSelector(
    ({ globalData, instAcademics, appData, feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      feeTermByTypeResp: feeReport.feeTermByTypeResp,
      getBranchWiseNetAmountResp: feeReport.getBranchWiseNetAmountResp,
      getBranchWiseDueSummaryExportResp: feeReport.getBranchWiseDueSummaryExportResp,
      feeReportErrorResp: feeReport.feeReportErrorResp,
    }),
    shallowEqual
  );

  const getExportApiResp = () => {
    const payload = { instituteId, ...filterState, branchId: props.branchIdState }
    dispatch(exportBranchWiseDueSummaryAct(generateActionPayload("fee_dashboard_due_summary_export", undefined, payload, {
      responseType: 'blob'
    })));
  }

  const studentCountRef = useRef({
    prevFeeReportErrorResp: feeReportErrorResp,
    prevGetBranchWiseDueSummaryExportResp: getBranchWiseDueSummaryExportResp,

  });

  useEffect(() => {
    const { prevFeeReportErrorResp, prevGetBranchWiseDueSummaryExportResp } =
      studentCountRef.current;
    if (feeReportErrorResp && feeReportErrorResp !== prevFeeReportErrorResp) {
      const { details } = feeReportErrorResp || {}
      toast.error(details || "Something went wrong");
    }
    else if (getBranchWiseDueSummaryExportResp && getBranchWiseDueSummaryExportResp !== prevGetBranchWiseDueSummaryExportResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(getBranchWiseDueSummaryExportResp, "Branch_Wise_Due_Summary");
    }
    studentCountRef.current.prevFeeReportErrorResp = feeReportErrorResp;
    studentCountRef.current.prevGetBranchWiseDueSummaryExportResp = getBranchWiseDueSummaryExportResp;

  }, [feeReportErrorResp, getBranchWiseDueSummaryExportResp]);

  useEffect(() => {
    const feeTermParams = {
      feeType: "TERM",
      instituteId,
    }
    dispatch(getFeeTermByTypeAct(generateActionPayload("get_feeterm_bytype", undefined, feeTermParams)));

  }, [instituteId]);

  useEffect(() => {
    if (Array.isArray(academicYearListResp?.data)) {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      getBranchWiseDueSummaryApiCall({ academicYearId })
      setFilterState((prev: any) => ({ ...prev, academicYearId }));
    }
  }, [academicYearListResp, instituteId, props.branchIdState]);

  useEffect(() => {
    if (Array.isArray(getBranchWiseNetAmountResp) && getBranchWiseNetAmountResp.length > 0) {
      const modilfiedData = getBranchWiseNetAmountResp.reduce((acc: any, curr: any, index: number) => {
        const branchObj = {
          branchId: curr?.branchId,
          branchName: curr?.branchName,
          termId: curr?.termId,
          termName: curr?.termName,
        }
        const termObj = {
          termId: curr?.termId,
          termName: curr?.termName,
          branchId: curr?.branchId,
        }
        const payload: any = {};
        if (curr?.feeType === feeTypeOptions.FEE_STRUCTURE) {
          payload.feeNoOfStudents = curr?.totalStudents
          payload.feeUnPaidPer = curr?.dueAmountPercentage?.toFixed(2)
          payload.feePaidPer = curr?.paidAmountPercentage?.toFixed(2)
          payload.feeUnpaid = curr?.unpaidStudents
          payload.feePaidStudents = curr?.paidStudents
        } else if (curr?.feeType === feeTypeOptions.CUMULATIVE_FEE) {
          payload.accumulatedNoOfStudents = curr?.totalStudents
          payload.accumulatedPaidPer = curr?.paidAmountPercentage?.toFixed(2)
          payload.accumulatedUnPaidPer = curr?.dueAmountPercentage?.toFixed(2)
          payload.accumulatedUnpaid = curr?.unpaidStudents
          payload.accumulatedPaid = curr?.paidStudents
        } else {
          payload.transportNoOfStudents = curr?.totalStudents
          payload.transportUnPaidPer = curr?.dueAmountPercentage?.toFixed(2)
          payload.transportPaidPer = curr?.paidAmountPercentage?.toFixed(2)
          payload.transportUnpaid = curr?.unpaidStudents
          payload.transportPaidStudents = curr?.paidStudents
        }
        const branchIdIdx = acc?.findIndex((item: any) => item?.branchName === curr?.branchName)
        if (branchIdIdx > -1) {
          const matchTermId = acc[branchIdIdx]?.termName === curr?.termName
          if (matchTermId) {
            acc[branchIdIdx] = { ...acc[branchIdIdx], ...payload }
          } else {
            const subRowsIdx = acc[branchIdIdx]?.subRows?.findIndex((item: any) => item?.termName === curr?.termName)
            if (subRowsIdx > -1) {
              acc[branchIdIdx].subRows[subRowsIdx] = {
                ...acc[branchIdIdx]?.subRows[subRowsIdx],
                ...payload
              }
            } else if (!filterState.termId) {
              if (Array.isArray(acc[branchIdIdx]["subRows"]) && acc[branchIdIdx]["subRows"]?.length > 0) {
                acc[branchIdIdx]["subRows"].push({
                  ...termObj,
                  ...payload
                })
              } else {
                acc[branchIdIdx]["subRows"] = [{
                  ...termObj,
                  ...payload
                }]
              }
            }
          }
          if (curr?.termName?.toLowerCase() === "total" && !filterState.termId) {
            acc[branchIdIdx] = {
              ...acc[branchIdIdx],
              totalObj: {
                ...acc[branchIdIdx]["totalObj"],
                ...termObj,
                ...payload
              }
            }
          }
        } else {
          const data = {
            ...branchObj,
            ...payload,
          }
          acc?.push(data)
        }
        return acc
      }, [])
      setTableDataState(modilfiedData)
    }
    else if (Array.isArray(getBranchWiseNetAmountResp) && getBranchWiseNetAmountResp.length === 0) {
      setTableDataState([])
    }
  }, [getBranchWiseNetAmountResp])

  const getBranchWiseDueSummaryApiCall = (otherProps?: any) => {
    const payload = {
      instituteId, branchId: props.branchIdState, ...filterState, ...otherProps,
    }
    dispatch(getBranchWiseNetAmountAct(generateActionPayload("branch_wise_net_amount", undefined, payload)))
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId" && !value) return
    setFilterState((prev) => ({ ...prev, [name]: value }));
    getBranchWiseDueSummaryApiCall({ [name]: value })
    advanceFilterChange({ keys: { ...filterState, [name]: value, academicYearId: "" }, ignoredKeys: [] })
  }

  const clearFilterHndlr = () => {
    if (academicYearListResp) {
      let academicYearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      setFilterState({ ...initialValues, academicYearId: academicYearId || "" });
      getBranchWiseDueSummaryApiCall({ ...initialValues, academicYearId })
      advanceFilterChange({ keys: { ...initialValues }, ignoredKeys: [] })
    }
  }

  const tableColumns = useMemo(() => generateColumns(openShowStuModal), [tableDataState, filterState.termId]);

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <div>
      <div className="tw-shadow-none">
        <div className="tw-border-b tw-border-gray-200 tw-pt-0">
          <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-m-4">
            <div className="tw-w-1/2">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">Branch wise Due Summary</h4>
            </div>
            <div className="tw-mt-2 lg:tw-mt-0">
              <Button
                id="export-btn"
                variant="exportBtn"
                onClick={openExportModal}
              >
                <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                <UncontrolledTooltip placement="bottom" target="export-btn">
                  Export
                </UncontrolledTooltip>
              </Button>
            </div>
          </div>
        </div>
        <div className="tw-p-0 tw-my-3">
          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-pt-3 tw-px-4">
            <div className="tw-col-span-12 md:tw-col-span-2">
              <SelectInput
                name="academicYearId"
                value={filterState.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="tw-mb-0"
                labelText="Academic Year"
                floatingLabel
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-2">
              <SelectInput
                name="termId"
                value={filterState.termId}
                onChange={filterHandler}
                menuItems={feeTermByTypeResp || []}
                valueKey="termId"
                textKey="termTypeName"
                labelText="Terms"
                floatingLabel
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-2">
              <SelectInput
                name="mode"
                value={filterState.mode}
                onChange={filterHandler}
                menuItems={modeOptions}
                valueKey="id"
                textKey="name"
                labelText="Mode"
                floatingLabel
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-2">
              <SelectInput
                name="studentStatus"
                value={filterState.studentStatus}
                onChange={filterHandler}
                menuItems={stuStatusOptions}
                valueKey="id"
                textKey="name"
                labelText="Student Status"
                floatingLabel
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-auto tw-ms-auto">
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

      <div className="tw-mb-0">
        <TableExpandable
          columns={tableColumns || []}
          data={tableDataState}
          divClass="table-responsive mb-3 table-expandable table-sticky"
          theadClass="text-muted align-middle theadPrimary"
          tableClass="table-bordered table-nowrap"
          showFooter={true}
          tdFooterClass="tw-font-bold"
          trFooterClass="tw-text-center tw-bg-gray-100"
          rowDataInfo={filterState}
          trBodyClass={(row: any) => row.original?.termName === "Total" ? "fw-bold trTotal" : ""}
        ></TableExpandable>
      </div>

      <ModalContainerUpdated
        id="show-unpaid-students-list-modal"
        isOpen={showStuModalState.showModal}
        toggle={closeShowStuModal}
        modalTitle="Students List"
        modalSize="lg"
      >
        <ShowStudents
          isOpen={showStuModalState.showModal}
          toggle={closeShowStuModal}
          modalData={showStuModalState.modalData}
          filterValues={filterState}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="export-section-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Branch wise Due Summary"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={getExportApiResp}
          feature="fee"
          subFeature={"branch_wise_due_summary"}
          remarksText="Enter remarks to export Branch wise Due Summary?"
        />
      </ModalContainerUpdated>
    </div>
  );
};

export default BranchWiseDueSummary;

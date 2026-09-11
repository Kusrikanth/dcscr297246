import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import {
  Button,
  ModalContainerUpdated,
  SelectInput
} from "../../../Components/Common";
import TableContainer from "../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { exportBranchWiseNetPaidByDateAct, getBranchWiseNetPaidByDateAct } from "../../../store/fee/feereport/feereportactions";
import { Current_Date, getPreviousDateFromToday } from "../../../utility/dateutility";
import { generateActionPayload } from "../../../utility/reduxutility";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";
import { generateColumns, paymentModeOptions } from "./helper";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { useModal } from "../../../hooks/modalhook";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../utility/commonutility";

const initialValues = {
  paymentMode: "",
  startDate: getPreviousDateFromToday(6),
  endDate: Current_Date,
}

const BranchWiseNetPaidByDate = (props: any) => {

  const dispatch = useAppDispatch();
  const [filterState, setFilterState] = useState(initialValues);
  const [tableDataState, setTableDataState] = useState<any[]>([]);
  const [transDateColumns, setTransDateColumns] = useState<any[]>([]);
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    feeTermByTypeResp,
    getBranchWiseNetPaidByDateResp,
    exportBranchWiseNetPaidByDateResp,
    feeReportErrorResp,
  } = useAppSelector(
    ({ globalData, instAcademics, appData, feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      feeTermByTypeResp: feeReport.feeTermByTypeResp,
      getBranchWiseNetPaidByDateResp: feeReport.getBranchWiseNetPaidByDateResp,
      exportBranchWiseNetPaidByDateResp: feeReport.exportBranchWiseNetPaidByDateResp,
      feeReportErrorResp: feeReport.feeReportErrorResp,
    }),
    shallowEqual
  );

  const branchWiseNetPaidByDateRef = useRef({
    prevFeeReportErrorResp: feeReportErrorResp,
    prevExportBranchWiseNetPaidByDateResp: exportBranchWiseNetPaidByDateResp,
  });

  useEffect(() => {
    const { prevFeeReportErrorResp, prevExportBranchWiseNetPaidByDateResp } =
      branchWiseNetPaidByDateRef.current;
    if (feeReportErrorResp && feeReportErrorResp !== prevFeeReportErrorResp) {
      const { details } = feeReportErrorResp || {}
      toast.error(details || "Something went wrong");
    }
    else if (exportBranchWiseNetPaidByDateResp && exportBranchWiseNetPaidByDateResp !== prevExportBranchWiseNetPaidByDateResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(exportBranchWiseNetPaidByDateResp, "Branch_Wise_Net_Paid_By_Date");
    }
    branchWiseNetPaidByDateRef.current.prevFeeReportErrorResp = feeReportErrorResp;
    branchWiseNetPaidByDateRef.current.prevExportBranchWiseNetPaidByDateResp = exportBranchWiseNetPaidByDateResp;

  }, [feeReportErrorResp, exportBranchWiseNetPaidByDateResp]);

  useEffect(() => {
    if (instituteId) {
      getBranchWiseNetPaidByDateApiCall()
    }
  }, [instituteId, props.branchIdState])

  useEffect(() => {
    if (Array.isArray(getBranchWiseNetPaidByDateResp) && getBranchWiseNetPaidByDateResp.length > 0) {
      const updatedData = getBranchWiseNetPaidByDateResp.reduce((acc: any[], curr: any, index: any) => {
        const findIndex = acc?.findIndex((item: any) => item.branchName === curr.branchName);
        if (findIndex > -1) {
          acc[findIndex][curr.transactionDate] = curr.paidAmount
          acc[findIndex].transactionDateArr = [...acc[findIndex].transactionDateArr, curr.transactionDate]
        } else {
          acc = [...acc, {
            branchId: curr.branchId,
            branchName: curr.branchName,
            [curr.transactionDate]: curr.paidAmount,
            transactionDateArr: [curr.transactionDate]
          }]
        }
        if (index === getBranchWiseNetPaidByDateResp.length - 1) {
          const maxTrasactionDate = acc.reduce((accc: any, curr: any) =>
            [...accc, ...curr.transactionDateArr], []
          );
          const getUniqueDates = (dates: string[]): string[] => Array.from(new Set(dates));
          setTransDateColumns(getUniqueDates(maxTrasactionDate))

          acc = acc.map((i: any) => {
            const branchTotal = i?.transactionDateArr?.reduce((accc: any, curr: any) => accc + i[curr], 0)
            return { ...i, branchTotal }
          })
        }
        return acc
      }, [])
      setTableDataState(updatedData)
    }
    else if (Array.isArray(getBranchWiseNetPaidByDateResp) && getBranchWiseNetPaidByDateResp.length === 0) {
      setTableDataState([])
      setTransDateColumns([])
    }
  }, [getBranchWiseNetPaidByDateResp])

  const getBranchWiseNetPaidByDateApiCall = (otherProps?: any) => {
    const payload = {
      ...filterState, instituteId, branchId: props.branchIdState, ...otherProps
    }
    dispatch(getBranchWiseNetPaidByDateAct(generateActionPayload("branch_wise_net_paid_by_date", undefined, payload)));
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilterState((prev) => ({ ...prev, [name]: value }));
    getBranchWiseNetPaidByDateApiCall({ [name]: value })
  }

  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      setFilterState((prev) => ({ ...prev, startDate, endDate }));
      getBranchWiseNetPaidByDateApiCall({ startDate, endDate });
    }
  }

  const exportSubmitHndlr = () => {
    const payload = { instituteId, ...filterState, branchId: props.branchIdState }
    dispatch(exportBranchWiseNetPaidByDateAct(generateActionPayload("fee_dashboard_net_paid_by_date_export", undefined, payload, {
      responseType: 'blob'
    })));
  }

  const tableColumns = useMemo(() => generateColumns(transDateColumns), [transDateColumns, tableDataState]);

  return (
    <div>
      <div className="tw-shadow-none">
        <div className="tw-border-b tw-border-gray-200 tw-pt-0">
          <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-m-4">
            <div className="tw-w-1/2">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">Branch wise Net Paid by Date</h4>
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
        <div className="tw-p-0 tw-mt-3 tw-mb-4">
          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-pt-3 tw-px-4">
            <div className="tw-col-span-12 md:tw-col-span-2">
              <SelectInput
                name="paymentMode"
                value={filterState.paymentMode}
                onChange={filterHandler}
                menuItems={paymentModeOptions}
                valueKey="id"
                textKey="name"
                formgroupClassName="mb-0"
                defaultSelect="Select"
                labelText="Payment Mode"
                floatingLabel
              ></SelectInput>
            </div>
            <div className="tw-col-span-12 md:tw-col-span-3">
              <CustomDatePicker
                name="dateRange"
                startDate={filterState.startDate}
                endDate={filterState.endDate}
                onChange={handleDateChange}
                placeholder="Select a Date Range"
                formgroupClassName="mb-0"
                labelText="Date Range"
                floatingLabel
              ></CustomDatePicker>
            </div>
          </div>
        </div>
      </div>
      <div className="tw-mb-0">
        <TableContainer
          columns={tableColumns || []}
          data={Array.isArray(tableDataState) ? tableDataState : []}
          tableClass="table-bordered table-nowrap tw-mb-0"
          divClass="table-responsive mb-3"
          theadClass="table-light text-muted align-middle theadPrimary"
          showFooter={true}
          tdFooterClass="tw-font-bold"
          trFooterClass="tw-bg-gray-100"
        ></TableContainer>
      </div>
      <ModalContainerUpdated
        id="export-branch-wise-net-paid-by-date-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Branch wise Net Paid by Date"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportSubmitHndlr}
          feature="fee"
          subFeature={"branch_net_paid_by_date"}
          remarksText="Enter remarks to export Branch wise Net Paid By Date?"
        />
      </ModalContainerUpdated>
    </div>
  );
};

export default BranchWiseNetPaidByDate;

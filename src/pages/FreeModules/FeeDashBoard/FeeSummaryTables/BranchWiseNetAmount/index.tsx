import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../../../assets/imagesdps/common_icon/export_icon.svg";
import { ModalContainerUpdated, SelectInput, TableExpandable } from "../../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { exportBranchWiseNetAmountAct, getBranchWiseNetAmountAct, getFeeTermByTypeAct } from "../../../../../store/fee/feereport/feereportactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { accumulatedData, findSectionWiseAmt, generateColumns, modeOptions, stuStatusOptions } from "./helper";
import { useModal } from "../../../../../hooks/modalhook";
import ShowStudents from "../BranchWiseDueSummary/ShowStudents";
import { feeTypeOptions } from "../BranchWiseDueSummary/helper";
import ExportModal from "../../../../Directory/StudentManagement/ExportModal";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../../utility/commonutility";
import Button from "../../../../../Components/Common/Button";

const initialValues = {
    academicYearId: "",
    termId: "",
    mode: "",
    studentStatus: "",
}

const BranchWiseNet = () => {

    const dispatch = useAppDispatch()
    const [filterState, setFilterState] = useState(initialValues);
    const [tableDataState, setTableDataState] = useState<any[]>([]);
    const { closeModal: closeShowStuModal, openModal: openShowStuModal, modalState: showStuModalState } = useModal()
    const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        feeTermByTypeResp,
        getBranchWiseNetAmountResp,
        feeReportErrorResp,
        exportBranchWiseNetAmountResp,
    } = useAppSelector(
        ({ globalData, instAcademics, appData, feeReport }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            feeTermByTypeResp: feeReport.feeTermByTypeResp,
            getBranchWiseNetAmountResp: feeReport.getBranchWiseNetAmountResp,
            feeReportErrorResp: feeReport.feeReportErrorResp,
            exportBranchWiseNetAmountResp: feeReport.exportBranchWiseNetAmountResp,
        }),
        shallowEqual
    );

    const branchWiseNetPaidByDateRef = useRef({
        prevFeeReportErrorResp: feeReportErrorResp,
        prevExportBranchWiseNetAmountResp: exportBranchWiseNetAmountResp,
    });

    useEffect(() => {
        const { prevFeeReportErrorResp, prevExportBranchWiseNetAmountResp } =
            branchWiseNetPaidByDateRef.current;
        if (feeReportErrorResp && feeReportErrorResp !== prevFeeReportErrorResp) {
            const { details } = feeReportErrorResp || {}
            toast.error(details || "Something went wrong");
        }
        else if (exportBranchWiseNetAmountResp && exportBranchWiseNetAmountResp !== prevExportBranchWiseNetAmountResp) {
            toast.success("Exported successfully");
            closeExportModal()
            downloadExcelFile(exportBranchWiseNetAmountResp, "Branch_Wise_Net_Paid_By_Date");
        }
        branchWiseNetPaidByDateRef.current.prevFeeReportErrorResp = feeReportErrorResp;
        branchWiseNetPaidByDateRef.current.prevExportBranchWiseNetAmountResp = exportBranchWiseNetAmountResp;

    }, [feeReportErrorResp, exportBranchWiseNetAmountResp]);

    useEffect(() => {
        const feeTermParams = {
            feeType: "TERM",
            instituteId,
            branchId,
        }
        dispatch(getFeeTermByTypeAct(generateActionPayload("get_feeterm_bytype", undefined, feeTermParams)));

    }, [instituteId]);

    useEffect(() => {
        if (Array.isArray(academicYearListResp?.data)) {
            const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
            getBranchWiseNetAmtApiCall({ academicYearId })
            setFilterState((prev: any) => ({ ...prev, academicYearId }));
        }
    }, [academicYearListResp, instituteId])

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
                    payload.feeNet = curr?.netAmount
                    payload.feePaid = curr?.paidAmount
                    payload.feeDue = curr?.dueAmount
                    payload.feeUnpaidStudent = curr?.unpaidStudents
                } else if (curr?.feeType === feeTypeOptions.CUMULATIVE_FEE) {
                    payload.cumulativeNet = curr?.netAmount
                    payload.cumulativePaid = curr?.paidAmount
                    payload.cumulativeDue = curr?.dueAmount
                    payload.cumulativeUnpaidStudent = curr?.unpaidStudents
                } else {
                    payload.transportNet = curr?.netAmount
                    payload.transportPaid = curr?.paidAmount
                    payload.transportDue = curr?.dueAmount
                    payload.transportUnpaidStudent = curr?.unpaidStudents
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
            if (modilfiedData?.length > 0) {
                const data = [
                    { ...modilfiedData[0] },
                    ...(Array.isArray(modilfiedData[0]?.subRows) ? modilfiedData[0].subRows : [])
                ];
                setTableDataState(data);
            }
        }
        else if (Array.isArray(getBranchWiseNetAmountResp) && getBranchWiseNetAmountResp.length === 0) {
            setTableDataState([])
        }
    }, [getBranchWiseNetAmountResp])

    const getBranchWiseNetAmtApiCall = (otherProps?: any) => {
        const payload = {
            instituteId, branchId, ...filterState, ...otherProps,
        }
        dispatch(getBranchWiseNetAmountAct(generateActionPayload("branch_wise_net_amount", undefined, payload)))
    }

    const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if (name === "academicYearId" && !value) return
        setFilterState((prev) => ({ ...prev, [name]: value }));
        getBranchWiseNetAmtApiCall({ [name]: value })
    }

    const exportSubmitHndlr = () => {
        const payload = { instituteId, branchId, ...filterState }
        dispatch(exportBranchWiseNetAmountAct(generateActionPayload("fee_dashboard_net_amt_export", undefined, payload, {
            responseType: 'blob'
        })));
    }

    const tableColumns = useMemo(() => generateColumns(openShowStuModal), [tableDataState, filterState.termId]);

    const { data: academicYearList } = academicYearListResp || {};

    return (
        <div>
            <div className="">
                <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                    <div className="tw-flex tw-items-center">
                        <div className="tw-w-10/12 lg:tw-w-1/2">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Branch wise Net amount
                            </h4>
                        </div>

                        <div className="tw-ml-auto ">
                            <div className="tw-flex tw-items-center">
                                <Button
                                    id="export-btn"
                                    variant="exportBtn"
                                    onClick={openExportModal}
                                >
                                    <img
                                        src={ExportIcon}
                                        alt="Export"
                                        className="tw-h-full tw-w-auto"
                                    />
                                    <UncontrolledTooltip placement="bottom" target="export-btn">
                                        Export
                                    </UncontrolledTooltip>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="tw-p-0">
                    <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pt-3">
                        <div className="lg:tw-col-span-2">
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

                        <div className="lg:tw-col-span-2">
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

                        <div className="lg:tw-col-span-2">
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

                        <div className="lg:tw-col-span-2">
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
                    </div>
                </div>
            </div>
            <div className="tw-mb-0">
                <TableExpandable
                    columns={tableColumns || []}
                    data={tableDataState}
                    divClass="table-responsive tw-mb-3 table-expandable table-sticky"
                    theadClass="tw-text-gray-500 tw-align-middle theadPrimary"
                    tableClass="table-bordered table-nowrap"
                    showFooter={false}
                    tdFooterClass="fw-bold"
                    trFooterClass="tw-bg-gray-100 tw-text-center"
                    trBodyClass={(row: any) =>
                        row.original?.termName === "Total" ? "fw-bold trTotal" : ""
                    }
                    rowDataInfo={filterState}
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
                id="export-branch-wise-net-paid-by-date-modal"
                isOpen={exportModalState.showModal}
                toggle={closeExportModal}
                modalTitle="Export Branch wise Net Amount"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportModalState.showModal}
                    toggle={closeExportModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportSubmitHndlr}
                    feature="fee"
                    subFeature={"branch_wise_net_amount"}
                    remarksText="Enter remarks to export Branch wise Net Amount?"
                />
            </ModalContainerUpdated>
        </div>
    );
};

export default BranchWiseNet;

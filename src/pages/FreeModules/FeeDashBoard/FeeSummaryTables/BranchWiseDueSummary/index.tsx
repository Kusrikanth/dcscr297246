import { useEffect, useMemo, useRef, useState } from "react";
import { ModalContainerUpdated, SelectInput, TableExpandable } from "../../../../../Components/Common";
import { feeTypeOptions, generateColumns, modeOptions, stuStatusOptions } from "./helper";
import ExportIcon from "../../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { exportBranchWiseDueSummaryAct, getBranchWiseDueSummaryAct, getFeeTermByTypeAct } from "../../../../../store/fee/feereport/feereportactions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { useFilterState } from "../../../../../hooks/filterhook";
import { useModal } from "../../../../../hooks/modalhook";
import ExportModal from "../../../../Directory/StudentManagement/ExportModal";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../../utility/commonutility";
import ShowStudents from "./ShowStudents";
import Button from "../../../../../Components/Common/Button";

const initialValues = {
    academicYearId: "",
    termId: "",
    mode: "",
    studentStatus: "",
}

const BranchWiseDueSummary = () => {

    const dispatch = useAppDispatch()
    const [filterState, setFilterState] = useState(initialValues);
    const [tableDataState, setTableDataState] = useState<any[]>([]);
    const { closeModal: closeShowStuModal, openModal: openShowStuModal, modalState: showStuModalState } = useModal()
    const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()
    const { showClearFilterState, advanceFilterChange } = useFilterState();

    const {
        academicYearListResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        feeTermByTypeResp,
        getBranchWiseDueSummaryResp,
        getBranchWiseDueSummaryExportResp,
        feeReportErrorResp,
    } = useAppSelector(
        ({ globalData, instAcademics, appData, feeReport }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            feeTermByTypeResp: feeReport.feeTermByTypeResp,
            getBranchWiseDueSummaryResp: feeReport.getBranchWiseDueSummaryResp,
            getBranchWiseDueSummaryExportResp: feeReport.getBranchWiseDueSummaryExportResp,
            feeReportErrorResp: feeReport.feeReportErrorResp,
        }),
        shallowEqual
    );

    const getExportApiResp = () => {
        const payload = { instituteId, branchId, ...filterState }
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
    }, [academicYearListResp, instituteId])

    useEffect(() => {
        if (Array.isArray(getBranchWiseDueSummaryResp) && getBranchWiseDueSummaryResp.length > 0) {
            const modilfiedData = getBranchWiseDueSummaryResp.reduce((acc: any, curr: any, index: number) => {
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
                    payload.feeUnPaidPer = curr?.unpaidStudentsPercentage?.toFixed(2)
                    payload.feePaidPer = curr?.paidStudentsPercentage?.toFixed(2)
                    payload.feeUnpaid = curr?.unpaidStudents
                    payload.feePaidStudents = curr?.paidStudents
                } else if (curr?.feeType === feeTypeOptions.CUMULATIVE_FEE) {
                    payload.accumulatedNoOfStudents = curr?.totalStudents
                    payload.accumulatedPaidPer = curr?.paidStudentsPercentage?.toFixed(2)
                    payload.accumulatedUnPaidPer = curr?.unpaidStudentsPercentage?.toFixed(2)
                    payload.accumulatedUnpaid = curr?.unpaidStudents
                    payload.accumulatedPaid = curr?.paidStudents
                } else {
                    payload.transportNoOfStudents = curr?.totalStudents
                    payload.transportUnPaidPer = curr?.unpaidStudentsPercentage?.toFixed(2)
                    payload.transportPaidPer = curr?.paidStudentsPercentage?.toFixed(2)
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
            if (modilfiedData?.length > 0) {
                const data = [
                    { ...modilfiedData[0] },
                    ...(Array.isArray(modilfiedData[0]?.subRows) ? modilfiedData[0].subRows : [])
                ];
                setTableDataState(data);
            }
        }
        else {
            setTableDataState([])
        }
    }, [getBranchWiseDueSummaryResp])

    const getBranchWiseDueSummaryApiCall = (otherProps?: any) => {
        const payload = {
            instituteId, ...filterState, branchId, ...otherProps,
        }
        dispatch(getBranchWiseDueSummaryAct(generateActionPayload("branch_wise_due_summary", undefined, payload)))
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
            <div className="tw-bg-white tw-rounded-md tw-shadow-none">
                <div className=" tw-px-4 tw-py-3 tw-border-b">
                    <div className="tw-grid tw-grid-cols-12 tw-items-center">

                        <div className="tw-col-span-10 ">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Branch wise Due Summary
                            </h4>
                        </div>

                        <div className="tw-col-span-2 tw-flex tw-justify-end">
                            <div className="tw-flex tw-items-center">
                                <Button
                                    id="export-btn"
                                    variant="exportBtn"
                                    onClick={openExportModal}
                                >
                                    <img
                                        src={ExportIcon}
                                        alt="Export"
                                        className="tw-h-4 tw-w-4"
                                    />
                                </Button>

                                <UncontrolledTooltip placement="bottom" target="export-btn">
                                    Export
                                </UncontrolledTooltip>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="tw-p-0">
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3 tw-pt-3">

                        <div className="tw-col-span-12 lg:tw-col-span-2">
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

                        <div className="tw-col-span-12 lg:tw-col-span-2">
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

                        <div className="tw-col-span-12 lg:tw-col-span-2">
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

                        <div className="tw-col-span-12 lg:tw-col-span-2">
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

                        <div className="tw-col-span-12 lg:tw-col-span-4 tw-flex tw-justify-end tw-items-center">
                            {showClearFilterState && (
                                <Button
                                    variant="wrong"
                                    type="button"
                                    onClick={clearFilterHndlr}
                                    
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
                    divClass="table-responsive tw-mb-3 table-expandable table-sticky"
                    theadClass="tw-text-gray-500 tw-align-middle theadPrimary"
                    tableClass="table-bordered table-nowrap"
                    showFooter={false}
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

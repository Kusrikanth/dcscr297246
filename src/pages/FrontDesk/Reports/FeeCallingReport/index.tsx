import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { ModalContainerUpdated, MultiSelectCheckbox, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import Button from "../../../../Components/Common/Button";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useModal } from "../../../../hooks/modalhook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getApplicationRemarksStatusAct } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { getChronicParentTypesListAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { exportFeeCallingReportAct, getFeeCallingReportAct, getFeeCallingReportSummaryAct } from "../../../../store/fee/feereport/feereportactions";
import { sampleChronicParentTypes, USE_SAMPLE_CHRONIC_PARENT_TYPES } from "../../../FreeModules/ChronicParentType/helper";
import OutcomeSummary from "./OutcomeSummary";
import DayWiseCallsChart from "./DayWiseCallsChart";
import CallerWiseTable from "./CallerWiseTable";
import ExportColumnsModal from "./ExportColumnsModal";
import {
    eliteYesNoOptions,
    generateColumns,
    getDayWiseRange,
    sampleFeeCallingReport,
    sampleFeeCallingReportSummary,
    serializeFilters,
    USE_SAMPLE_FEE_CALLING_REPORT,
} from "./helper";

/** Report scope: drives the summary cards, chart, caller-wise table and the call log. Applied via Get Report. */
const initialScope: any = {
    academicYearId: "",
    curriculumId: "",
    classId: "",
    followUpStartDate: null,
    followUpEndDate: null,
};

/** Call log filters: narrow the log only, applied instantly on change. */
const initialLogFilters: any = {
    searchString: "",
    callerIds: [],
    statusIds: [],
    isChronicParent: "",
    chronicParentTypeIds: [],
    nextActionStartDate: null,
    nextActionEndDate: null,
};

export default function FeeCallingReport() {
    const dispatch = useAppDispatch();
    const [scope, setScope] = useState<any>(initialScope);
    const [logFilters, setLogFilters] = useState<any>(initialLogFilters);
    const [dayWiseRange, setDayWiseRange] = useState(() => getDayWiseRange());
    const appliedScope = useRef<any>(initialScope);
    const pagination = useRef({ pageNo: 0, pageSize: 10 });
    const { closeModal: closeExportModal, modalState: exportModalState, openModal: openExportModal } = useModal();

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        getApplicationRemarksStatusResp,
        getChronicParentTypesListResp,
        feeCallingReportResp,
        feeCallingReportSummaryResp,
        exportFeeCallingReportResp,
        feeReportErrorResp,
    }: any = useAppSelector(
        ({ instAcademics, branchAcademics, appData, globalData, applicationSale, feeCollections, feeReport }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            getApplicationRemarksStatusResp: applicationSale.getApplicationRemarksStatusResp,
            getChronicParentTypesListResp: feeCollections.getChronicParentTypesListResp,
            feeCallingReportResp: feeReport.feeCallingReportResp,
            feeCallingReportSummaryResp: feeReport.feeCallingReportSummaryResp,
            exportFeeCallingReportResp: feeReport.exportFeeCallingReportResp,
            feeReportErrorResp: feeReport.feeReportErrorResp,
        }),
        shallowEqual
    );

    // ---------- lookups ----------
    useEffect(() => {
        dispatch(getApplicationRemarksStatusAct(generateActionPayload("get_application_remarks_stauts", undefined, { feeFollowUpCategory: "FEE" })));
        dispatch(getChronicParentTypesListAct(generateActionPayload("get_chronic_parent_types_list", undefined, { branchId, pageNo: 0, pageSize: 100, sortBy: "createdAt", orderBy: "desc" })));
    }, [instituteId, branchId]);

    useEffect(() => {
        const yearId = academicYearListResp?.data?.find((year: any) => year?.yearStatus?.toLowerCase() === "current")?.academicYearId;
        if (yearId) {
            setScope((prev: any) => ({ ...prev, academicYearId: yearId }));
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, { academicYearId: yearId, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" })));
        }
    }, [academicYearListResp]);

    const chronicParentTypes = useMemo(() => {
        const apiList = getChronicParentTypesListResp?.data;
        if (Array.isArray(apiList) && apiList.length > 0) return apiList;
        return USE_SAMPLE_CHRONIC_PARENT_TYPES ? sampleChronicParentTypes : [];
    }, [getChronicParentTypesListResp]);

    // ---------- data ----------
    const useSample = USE_SAMPLE_FEE_CALLING_REPORT && !(Array.isArray(feeCallingReportResp?.data) && feeCallingReportResp.data.length > 0);
    const report = useSample ? sampleFeeCallingReport : feeCallingReportResp || {};
    const summary = useSample ? sampleFeeCallingReportSummary : feeCallingReportSummaryResp || {};

    const statusOptions = useMemo(() => {
        const fromSummary = (summary?.outcomes || [])
            .map((o: any) => ({ id: o?.statusId ?? o?.statusName, name: o?.statusName }))
            .filter((o: any) => o.name);
        // In sample mode the dropdown must match the sample data, not the live status list.
        if (useSample) return fromSummary;
        const rawList = Array.isArray(getApplicationRemarksStatusResp)
            ? getApplicationRemarksStatusResp
            : getApplicationRemarksStatusResp?.data || [];
        const fromApi = rawList
            .map((item: any) => ({ id: item?.id, name: item?.status ?? item?.statusName ?? item?.name }))
            .filter((o: any) => o.name);
        return fromApi.length > 0 ? fromApi : fromSummary;
    }, [getApplicationRemarksStatusResp, summary, useSample]);

    const callerOptions = useMemo(
        () => (summary?.callerWise || []).map((c: any) => ({ employeeId: c?.employeeId ?? c?.employeeName, employeeName: c?.employeeName })),
        [summary]
    );

    const scopeParams = (s: any) => serializeFilters({ instituteId, branchId, ...s });

    const fetchSummary = (s: any) => {
        const range = getDayWiseRange(s.followUpStartDate, s.followUpEndDate);
        setDayWiseRange(range);
        dispatch(getFeeCallingReportSummaryAct(generateActionPayload("get_fee_calling_report_summary", undefined, {
            ...scopeParams(s),
            dayWiseStartDate: range.startDate,
            dayWiseEndDate: range.endDate,
        })));
    };

    const fetchCallLog = (s: any, lf: any) => {
        const params = { ...scopeParams(s), ...serializeFilters(lf), ...pagination.current, sortBy: "createdAt", orderBy: "desc" };
        dispatch(getFeeCallingReportAct(generateActionPayload("get_fee_calling_report", undefined, params)));
    };

    const fetchReport = (s: any = scope, lf: any = logFilters) => {
        appliedScope.current = s;
        fetchSummary(s);
        fetchCallLog(s, lf);
    };

    useEffect(() => {
        if (scope.academicYearId) {
            fetchReport();
        }
    }, [scope.academicYearId]);

    const prevRef = useRef({ prevError: feeReportErrorResp, prevExport: exportFeeCallingReportResp });
    useEffect(() => {
        const { prevError, prevExport } = prevRef.current;
        if (feeReportErrorResp && prevError !== feeReportErrorResp) {
            toast.error(feeReportErrorResp?.details || "Something went wrong.");
        } else if (exportFeeCallingReportResp && prevExport !== exportFeeCallingReportResp) {
            toast.success("Fee Calling Report Downloaded Successfully.");
            downloadExcelFile(exportFeeCallingReportResp, "Fee_Calling_Report");
            closeExportModal();
        }
        prevRef.current = { prevError: feeReportErrorResp, prevExport: exportFeeCallingReportResp };
    }, [feeReportErrorResp, exportFeeCallingReportResp]);

    // ---------- scope filters (applied via Get Report) ----------
    const scopeHandler = (event: any) => {
        const { name, value } = event.target;
        setScope((prev: any) => {
            const next = { ...prev, [name]: value };
            if (name === "academicYearId") { next.curriculumId = ""; next.classId = ""; }
            if (name === "curriculumId") { next.classId = ""; }
            return next;
        });
        if (name === "academicYearId") {
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, { academicYearId: value, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" })));
            dispatch(resetBrchClassAct(undefined));
        } else if (name === "curriculumId") {
            if (value) {
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, { academicYearId: scope.academicYearId, branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 })));
            } else {
                dispatch(resetBrchClassAct(undefined));
            }
        }
    };

    const scopeDateHandler = ({ startDate, endDate }: any) => {
        setScope((prev: any) => ({ ...prev, followUpStartDate: startDate || null, followUpEndDate: endDate || null }));
    };

    const getReportHandler = () => {
        pagination.current = { ...pagination.current, pageNo: 0 };
        fetchReport();
    };

    const clearScopeHandler = () => {
        const reset = { ...initialScope, academicYearId: scope.academicYearId };
        setScope(reset);
        setLogFilters(initialLogFilters);
        dispatch(resetBrchClassAct(undefined));
        pagination.current = { ...pagination.current, pageNo: 0 };
        fetchReport(reset, initialLogFilters);
    };

    // ---------- call log filters (instant) ----------
    const applyLogFilters = (next: any) => {
        setLogFilters(next);
        pagination.current = { ...pagination.current, pageNo: 0 };
        fetchCallLog(appliedScope.current, next);
    };

    const logFilterHandler = (event: any) => {
        const { name, value } = event.target;
        applyLogFilters({ ...logFilters, [name]: value });
    };

    const logMultiSelectHandler = (selectedOptions: any, config?: any) => {
        const { name } = config || {};
        if (!name) return;
        applyLogFilters({ ...logFilters, [name]: Array.isArray(selectedOptions) ? selectedOptions : [] });
    };

    const logDateHandler = ({ startDate, endDate }: any) => {
        applyLogFilters({ ...logFilters, nextActionStartDate: startDate || null, nextActionEndDate: endDate || null });
    };

    const clearLogFilters = () => applyLogFilters(initialLogFilters);

    const hasLogFilters = useMemo(
        () => Object.keys(initialLogFilters).some((key) => {
            const v = logFilters[key];
            return Array.isArray(v) ? v.length > 0 : !!v;
        }),
        [logFilters]
    );

    const renderSelected = (labelKey: string) => (items: any) =>
        Array.isArray(items) ? <div className="text-truncate">{items.map((i: any) => i?.[labelKey]).join(", ")}</div> : null;

    const exportHandler = (columns: string[]) => {
        dispatch(exportFeeCallingReportAct(generateActionPayload("export_fee_calling_report", undefined, {
            ...scopeParams(appliedScope.current),
            ...serializeFilters(logFilters),
            columns: columns.join(","),
        }, { responseType: "blob" })));
    };

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        fetchCallLog(appliedScope.current, logFilters);
    }

    // ---------- table ----------
    const columns = useMemo(() => generateColumns(appliedScope.current.academicYearId || scope.academicYearId), [scope.academicYearId]);
    const { data: rows, totalElements, totalPages, pageble } = report;

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};

    return (
        <div className="page-content fee-status-reports">
            <div className="container-fluid">
                <BreadCrumb title="Fee Calling Report" pageTitle="Fee" />

                <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4 tw-sticky tw-top-[64px] tw-z-20">
                    <div className="tw-border-b tw-px-4 tw-py-3 tw-flex tw-items-center tw-justify-between">
                        <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0">Fee Calling Report</h4>
                        <Button type="button" variant="secondary" onClick={() => openExportModal()} disabled={showApiLoader} className="tw-flex tw-items-center">
                            <img src={ExportIcon} alt="" className="tw-h-4 tw-w-4 tw-mr-2" />
                            Export
                        </Button>
                    </div>

                    <div className="tw-p-4">
                        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <SelectInput
                                    name="academicYearId"
                                    value={scope.academicYearId}
                                    onChange={scopeHandler}
                                    menuItems={academicYearList || []}
                                    valueKey="academicYearId"
                                    textKey="academicYearName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Academic Year"
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <SelectInput
                                    name="curriculumId"
                                    value={scope.curriculumId}
                                    onChange={scopeHandler}
                                    menuItems={curriculumTypes || []}
                                    valueKey="branchCurriculumId"
                                    textKey="curriculumName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Curriculum"
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <SelectInput
                                    name="classId"
                                    value={scope.classId}
                                    onChange={scopeHandler}
                                    menuItems={classTypes || []}
                                    valueKey="id"
                                    textKey="shortName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Class"
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <CustomDatePicker
                                    name="followUpDateRange"
                                    startDate={scope.followUpStartDate}
                                    endDate={scope.followUpEndDate}
                                    onChange={scopeDateHandler}
                                    placeholder="Last 7 days"
                                    monthsShown={2}
                                    formgroupClassName="tw-mb-0"
                                    labelText="Called On"
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-12 lg:tw-col-span-12 xl:tw-col-span-4 tw-flex tw-items-center tw-justify-end tw-gap-2">
                                <Button type="button" variant="wrong" onClick={clearScopeHandler} className="!tw-px-3 !tw-py-1">
                                    Clear filter
                                </Button>
                                <Button type="button" variant="primary" onClick={getReportHandler} disabled={showApiLoader}>
                                    Get Report
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <OutcomeSummary
                    summary={summary}
                    afterCards={
                        <DayWiseCallsChart
                            startDate={dayWiseRange.startDate}
                            endDate={dayWiseRange.endDate}
                            data={summary?.dayWiseCalls || []}
                        />
                    }
                />

                <CallerWiseTable
                    startDate={dayWiseRange.startDate}
                    endDate={dayWiseRange.endDate}
                    data={summary?.callerWise || []}
                    outcomeNames={statusOptions.map((o: any) => o?.name)}
                />

                <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                    <div className="tw-border-b tw-px-4 tw-py-3 tw-flex tw-items-center tw-justify-between">
                        <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-0">Call Log</h4>
                        {hasLogFilters && (
                            <Button type="button" variant="wrong" onClick={clearLogFilters} className="!tw-px-3 !tw-py-1">
                                Clear filter
                            </Button>
                        )}
                    </div>
                    <div className="tw-p-4">
                        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">
                            <div className="md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-3">
                                <div className="search-box">
                                    <TextInput
                                        name="searchString"
                                        value={logFilters.searchString}
                                        onChange={logFilterHandler}
                                        inputClassName="tw-bg-gray-100"
                                        formgroupClassName="tw-mb-0"
                                        placeHolder="Search"
                                        labelText="Student / Phone"
                                        floatingLabel
                                    />
                                    <i className="ri-search-line search-icon"></i>
                                </div>
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-2">
                                <MultiSelectCheckbox
                                    name="callerIds"
                                    idKey="employeeId"
                                    labelText="Called By"
                                    containerClassName="mb-0"
                                    value={logFilters.callerIds}
                                    renderValue={renderSelected("employeeName")}
                                    renderOptions={(item: any) => item?.employeeName}
                                    onChange={logMultiSelectHandler}
                                    searchKey="employeeName"
                                    options={callerOptions}
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-2">
                                <MultiSelectCheckbox
                                    name="statusIds"
                                    idKey="id"
                                    labelText="Outcome"
                                    containerClassName="mb-0"
                                    value={logFilters.statusIds}
                                    renderValue={renderSelected("name")}
                                    renderOptions={(item: any) => item?.name}
                                    onChange={logMultiSelectHandler}
                                    searchKey="name"
                                    options={statusOptions}
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-1">
                                <SelectInput
                                    name="isChronicParent"
                                    value={logFilters.isChronicParent}
                                    onChange={logFilterHandler}
                                    menuItems={eliteYesNoOptions}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Chronic"
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-2">
                                <MultiSelectCheckbox
                                    name="chronicParentTypeIds"
                                    idKey="id"
                                    labelText="Chronic Parent Type"
                                    containerClassName="mb-0"
                                    value={logFilters.chronicParentTypeIds}
                                    renderValue={renderSelected("chronicParentTypeName")}
                                    renderOptions={(item: any) => item?.chronicParentTypeName}
                                    onChange={logMultiSelectHandler}
                                    searchKey="chronicParentTypeName"
                                    options={chronicParentTypes}
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-4 xl:tw-col-span-2">
                                <CustomDatePicker
                                    name="nextActionDateRange"
                                    startDate={logFilters.nextActionStartDate}
                                    endDate={logFilters.nextActionEndDate}
                                    onChange={logDateHandler}
                                    placeholder="Select a Date Range"
                                    monthsShown={2}
                                    formgroupClassName="tw-mb-0"
                                    labelText="Next Action Date"
                                    floatingLabel
                                />
                            </div>
                        </div>
                    </div>
                    <TableContainer
                        columns={columns}
                        data={rows || []}
                        divClass="tw-overflow-x-auto tw-mb-3"
                        theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                        showPagination={true}
                        totalPages={totalPages || 0}
                        totalRecords={totalElements || 0}
                        callbackPaginationHndlr={paginationHndlr}
                        currentPageNumber={pageble?.pageNumber || 0}
                    />
                </div>
            </div>

            <ModalContainerUpdated
                id="fee-calling-report-export-modal"
                isOpen={exportModalState.showModal}
                toggle={closeExportModal}
                modalTitle="Export Fee Calling Report"
                modalSize="lg"
            >
                <ExportColumnsModal
                    isOpen={exportModalState.showModal}
                    toggle={closeExportModal}
                    onDownload={exportHandler}
                    isDisabled={showApiLoader}
                />
            </ModalContainerUpdated>
        </div>
    );
}

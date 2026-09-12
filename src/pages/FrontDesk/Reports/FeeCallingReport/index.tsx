import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { MultiSelectCheckbox, SelectInput, TextInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../Components/Common/TableContainer";
import Button from "../../../../Components/Common/Button";
import { IPaginationState } from "../../../../Components/Common/Pagination";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getApplicationRemarksStatusAct } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { getChronicParentTypesListAct } from "../../../../store/fee/feecollections/feecollectionactions";
import { exportFeeCallingReportAct, getFeeCallingReportAct, getFeeCallingReportSummaryAct } from "../../../../store/fee/feereport/feereportactions";
import { sampleChronicParentTypes, USE_SAMPLE_CHRONIC_PARENT_TYPES } from "../../../FreeModules/ChronicParentType/helper";
import OutcomeSummary from "./OutcomeSummary";
import {
    eliteYesNoOptions,
    generateColumns,
    sampleFeeCallingReport,
    sampleFeeCallingReportSummary,
    serializeFilters,
    USE_SAMPLE_FEE_CALLING_REPORT,
} from "./helper";

const initialValues: any = {
    searchString: "",
    academicYearId: "",
    curriculumId: "",
    classId: "",
    statusIds: [],
    chronicParentTypeIds: [],
    isChronicParent: "",
    followUpStartDate: null,
    followUpEndDate: null,
    nextActionStartDate: null,
    nextActionEndDate: null,
};

export default function FeeCallingReport() {
    const dispatch = useAppDispatch();
    const [filterState, setFilterState] = useState<any>(initialValues);
    const pagination = useRef({ pageNo: 0, pageSize: 10 });

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
            setFilterState((prev: any) => ({ ...prev, academicYearId: yearId }));
            dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, { academicYearId: yearId, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" })));
        }
    }, [academicYearListResp]);

    const chronicParentTypes = useMemo(() => {
        const apiList = getChronicParentTypesListResp?.data;
        if (Array.isArray(apiList) && apiList.length > 0) return apiList;
        return USE_SAMPLE_CHRONIC_PARENT_TYPES ? sampleChronicParentTypes : [];
    }, [getChronicParentTypesListResp]);

    const statusOptions = useMemo(
        () => (Array.isArray(getApplicationRemarksStatusResp) ? getApplicationRemarksStatusResp : []).map((item: any) => ({ id: item?.id, name: item?.status })),
        [getApplicationRemarksStatusResp]
    );

    // ---------- data ----------
    const buildParams = (overrides?: any) => serializeFilters({ instituteId, branchId, ...filterState, ...overrides });

    const fetchReport = (overrides?: any) => {
        const params = { ...buildParams(overrides), ...pagination.current, sortBy: "createdAt", orderBy: "desc" };
        dispatch(getFeeCallingReportAct(generateActionPayload("get_fee_calling_report", undefined, params)));
        dispatch(getFeeCallingReportSummaryAct(generateActionPayload("get_fee_calling_report_summary", undefined, buildParams(overrides))));
    };

    useEffect(() => {
        if (filterState.academicYearId) {
            fetchReport();
        }
    }, [filterState.academicYearId]);

    const prevRef = useRef({ prevError: feeReportErrorResp, prevExport: exportFeeCallingReportResp });
    useEffect(() => {
        const { prevError, prevExport } = prevRef.current;
        if (feeReportErrorResp && prevError !== feeReportErrorResp) {
            toast.error(feeReportErrorResp?.details || "Something went wrong.");
        } else if (exportFeeCallingReportResp && prevExport !== exportFeeCallingReportResp) {
            toast.success("Fee Calling Report Downloaded Successfully.");
            downloadExcelFile(exportFeeCallingReportResp, "Fee_Calling_Report");
        }
        prevRef.current = { prevError: feeReportErrorResp, prevExport: exportFeeCallingReportResp };
    }, [feeReportErrorResp, exportFeeCallingReportResp]);

    // ---------- filters ----------
    const filterHandler = (event: any) => {
        const { name, value } = event.target;
        setFilterState((prev: any) => {
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
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, { academicYearId: filterState.academicYearId, branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 })));
            } else {
                dispatch(resetBrchClassAct(undefined));
            }
        }
    };

    const multiSelectHandler = (selectedOptions: any, config?: any) => {
        const { name } = config || {};
        if (!name) return;
        setFilterState((prev: any) => ({ ...prev, [name]: Array.isArray(selectedOptions) ? selectedOptions : [] }));
    };

    const dateRangeHandler = ({ startDate, endDate }: any, startKey: string, endKey: string) => {
        setFilterState((prev: any) => ({ ...prev, [startKey]: startDate || null, [endKey]: endDate || null }));
    };

    const renderSelected = (labelKey: string) => (items: any) =>
        Array.isArray(items) ? <div className="text-truncate">{items.map((i: any) => i?.[labelKey]).join(", ")}</div> : null;

    const getReportHandler = () => {
        pagination.current = { ...pagination.current, pageNo: 0 };
        fetchReport();
    };

    const clearFilterHandler = () => {
        const yearId = filterState.academicYearId;
        const reset = { ...initialValues, academicYearId: yearId };
        setFilterState(reset);
        dispatch(resetBrchClassAct(undefined));
        pagination.current = { ...pagination.current, pageNo: 0 };
        fetchReport(reset);
    };

    const exportHandler = () => {
        dispatch(exportFeeCallingReportAct(generateActionPayload("export_fee_calling_report", undefined, buildParams(), { responseType: "blob" })));
    };

    function paginationHndlr(paginationInfo: IPaginationState) {
        pagination.current = paginationInfo;
        fetchReport();
    }

    // ---------- table ----------
    const columns = useMemo(() => generateColumns(filterState.academicYearId), [filterState.academicYearId]);

    const useSample = USE_SAMPLE_FEE_CALLING_REPORT && !(Array.isArray(feeCallingReportResp?.data) && feeCallingReportResp.data.length > 0);
    const report = useSample ? sampleFeeCallingReport : feeCallingReportResp || {};
    const summary = useSample ? sampleFeeCallingReportSummary : feeCallingReportSummaryResp || {};
    const { data: rows, totalElements, totalPages, pageble } = report;

    const { data: academicYearList } = academicYearListResp || {};
    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};

    return (
        <div className="page-content fee-status-reports">
            <div className="container-fluid">
                <BreadCrumb title="Fee Calling Report" pageTitle="Fee" />

                <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
                    <div className="tw-border-b tw-px-4 tw-py-3 tw-flex tw-items-center tw-justify-between">
                        <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0">Fee Calling Report</h4>
                        <Button type="button" variant="secondary" onClick={exportHandler} disabled={showApiLoader} className="tw-flex tw-items-center">
                            <img src={ExportIcon} alt="" className="tw-h-4 tw-w-4 tw-mr-2" />
                            Export
                        </Button>
                    </div>

                    <div className="tw-p-4">
                        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <div className="search-box">
                                    <TextInput
                                        name="searchString"
                                        value={filterState.searchString}
                                        onChange={filterHandler}
                                        inputClassName="tw-bg-gray-100"
                                        formgroupClassName="tw-mb-0"
                                        placeHolder="Search"
                                        labelText="Search"
                                        floatingLabel
                                    />
                                    <i className="ri-search-line search-icon"></i>
                                </div>
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
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
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <SelectInput
                                    name="curriculumId"
                                    value={filterState.curriculumId}
                                    onChange={filterHandler}
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
                                    value={filterState.classId}
                                    onChange={filterHandler}
                                    menuItems={classTypes || []}
                                    valueKey="id"
                                    textKey="shortName"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Class"
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <MultiSelectCheckbox
                                    name="statusIds"
                                    idKey="id"
                                    labelText="Call Outcome"
                                    containerClassName="mb-0"
                                    value={filterState.statusIds}
                                    renderValue={renderSelected("name")}
                                    renderOptions={(item: any) => item?.name}
                                    onChange={multiSelectHandler}
                                    searchKey="name"
                                    options={statusOptions}
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <SelectInput
                                    name="isChronicParent"
                                    value={filterState.isChronicParent}
                                    onChange={filterHandler}
                                    menuItems={eliteYesNoOptions}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Is Chronic Parent"
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <MultiSelectCheckbox
                                    name="chronicParentTypeIds"
                                    idKey="id"
                                    labelText="Chronic Parent Type"
                                    containerClassName="mb-0"
                                    value={filterState.chronicParentTypeIds}
                                    renderValue={renderSelected("chronicParentTypeName")}
                                    renderOptions={(item: any) => item?.chronicParentTypeName}
                                    onChange={multiSelectHandler}
                                    searchKey="chronicParentTypeName"
                                    options={chronicParentTypes}
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <CustomDatePicker
                                    name="followUpDateRange"
                                    startDate={filterState.followUpStartDate}
                                    endDate={filterState.followUpEndDate}
                                    onChange={(dates: any) => dateRangeHandler(dates, "followUpStartDate", "followUpEndDate")}
                                    placeholder="Select a Date Range"
                                    monthsShown={2}
                                    formgroupClassName="tw-mb-0"
                                    labelText="Called On"
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <CustomDatePicker
                                    name="nextActionDateRange"
                                    startDate={filterState.nextActionStartDate}
                                    endDate={filterState.nextActionEndDate}
                                    onChange={(dates: any) => dateRangeHandler(dates, "nextActionStartDate", "nextActionEndDate")}
                                    placeholder="Select a Date Range"
                                    monthsShown={2}
                                    formgroupClassName="tw-mb-0"
                                    labelText="Next Action Date"
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-12 lg:tw-col-span-6 xl:tw-col-span-4 tw-flex tw-items-center tw-justify-end tw-gap-2">
                                <Button type="button" variant="wrong" onClick={clearFilterHandler} className="!tw-px-3 !tw-py-1">
                                    Clear filter
                                </Button>
                                <Button type="button" variant="primary" onClick={getReportHandler} disabled={showApiLoader}>
                                    Get Report
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <OutcomeSummary summary={summary} />

                <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                    <div className="tw-border-b tw-px-4 tw-py-3">
                        <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-0">Call Log</h4>
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
        </div>
    );
}

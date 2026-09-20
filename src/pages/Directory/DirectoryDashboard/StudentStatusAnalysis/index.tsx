import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { UncontrolledTooltip } from "reactstrap";

import { DateInput, ModalContainerUpdated, MultiSelectCheckbox, SelectInput, TableExpandable } from "../../../../Components/Common";
import Button from "../../../../Components/Common/Button";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { useModal } from "../../../../hooks/modalhook";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import {
    exportStudentStatusAnalysisAct,
    getStudentStatusAnalysisAct,
} from "../../../../store/academic/academicRequest/academicrequestactions";
import { setStudentStatusAnalysisAct } from "../../../../store/academic/academicRequest/academicrequestslice";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { Current_Date_YYYYMMDD } from "../../../../utility/dateutility";
import { generateActionPayload } from "../../../../utility/reduxutility";
import ExportModal from "../../StudentManagement/ExportModal";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import {
    admissionTypeFilterOptions,
    applySampleAdmissionTypeFilter,
    buildStudentStatusRows,
    generateColumns,
    residentialStatusFilterOptions,
    sampleStudentStatusAnalysis,
    USE_SAMPLE_STUDENT_STATUS_ANALYSIS,
} from "./helper";

const initialValues = {
    academicYearIds: [] as any[],    // [] => all academic years
    admissionType: "BOTH",
    residentialStatus: "BOTH",           // "BOTH" => day scholars and residential
    activeInAcademicYearId: "",      // student must still be active in this academic year
    asOnDate: Current_Date_YYYYMMDD, // active snapshot cut-off
    admissionFromDate: "",
    admissionToDate: "",
    inactiveFromDate: "",
    inactiveToDate: "",
};

// Filters kept behind the "More Filters" toggle on screens too narrow for a single row.
const COLLAPSIBLE_FILTER_COUNT = 3;

const StudentStatusAnalysis = () => {
    const dispatch = useAppDispatch();
    const [filterState, setFilterState] = useState(initialValues);
    const [showAllFilters, setShowAllFilters] = useState(false);

    // All seven filters fit one row at 2xl; below that the last three collapse behind the toggle.
    const collapsedClass = showAllFilters ? "" : "tw-hidden 2xl:tw-block";
    const {
        closeModal: closeExportModal,
        openModal: openExportModal,
        modalState: exportModalState,
    } = useModal();

    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        academicYearListResp,
        getStudentStatusAnalysisResp,
        exportStudentStatusAnalysisResp,
    } = useAppSelector(
        ({ appData, instAcademics, academicRequest }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            academicYearListResp: instAcademics.academicYearListResp,
            getStudentStatusAnalysisResp: academicRequest.getStudentStatusAnalysisResp,
            exportStudentStatusAnalysisResp: academicRequest.exportStudentStatusAnalysisResp,
        }),
        shallowEqual
    );

    const { data: academicYearList } = academicYearListResp || {};

    // Current academic year (e.g. 2026-2027) drives the "Stats for Academic Year" default.
    const defaultActiveAcademicYearId = useMemo(() => {
        const years = Array.isArray(academicYearList) ? academicYearList : [];
        const currentYear = years.find(
            (year: any) => `${year?.yearStatus}`.toLowerCase() === "current"
        );
        // This select has no placeholder option, so falling back to the first year keeps it
        // from rendering blank if nothing is flagged "current".
        return (currentYear || years[0])?.academicYearId || "";
    }, [academicYearList]);

    // Set once the academic-year list arrives, so the default year is applied only on first load.
    const initializedRef = useRef(false);

    const studentStatusRef = useRef({
        prevExportStudentStatusAnalysisResp: exportStudentStatusAnalysisResp,
    });

    // The multi-select holds academic-year objects; the API only wants their ids.
    const buildPayload = (otherProps?: any) => {
        const { academicYearIds, ...rest } = { ...filterState, ...otherProps };
        return {
            branchId,
            instituteId,
            ...rest,
            academicYearIds: (Array.isArray(academicYearIds) ? academicYearIds : []).map(
                (year: any) => year?.academicYearId
            ),
        };
    };

    const studentStatusApiCall = (otherProps?: any) => {
        // While the report runs on sample data the endpoint does not exist yet. Calling it 404s,
        // which sets the shared academicRequest error and makes the other dashboard widgets
        // toast "Something went wrong". Drop this guard with the sample flag.
        if (USE_SAMPLE_STUDENT_STATUS_ANALYSIS) return;
        dispatch(getStudentStatusAnalysisAct(generateActionPayload("get_student_status_analysis", undefined, buildPayload(otherProps))));
    };

    // "Stats for Academic Year" defaults to the current academic year, so the first fetch waits
    // for the year list rather than firing with an empty value.
    useEffect(() => {
        if (!branchId || !instituteId || initializedRef.current) return;
        const years = academicYearListResp?.data;
        if (!Array.isArray(years) || years.length === 0) return;
        initializedRef.current = true;
        const nextFilters = { ...initialValues, activeInAcademicYearId: defaultActiveAcademicYearId };
        setFilterState(nextFilters);
        studentStatusApiCall(nextFilters);
    }, [branchId, instituteId, academicYearListResp]);

    useEffect(() => {
        return () => {
            dispatch(setStudentStatusAnalysisAct(undefined));
        };
    }, []);

    useEffect(() => {
        const { prevExportStudentStatusAnalysisResp } = studentStatusRef.current;
        if (exportStudentStatusAnalysisResp && exportStudentStatusAnalysisResp !== prevExportStudentStatusAnalysisResp) {
            toast.success("Exported successfully");
            closeExportModal();
            downloadExcelFile(exportStudentStatusAnalysisResp, "student_status_analysis");
        }
        studentStatusRef.current.prevExportStudentStatusAnalysisResp = exportStudentStatusAnalysisResp;
    }, [exportStudentStatusAnalysisResp]);

    const filterHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilterState((prev) => ({ ...prev, [name]: value }));
        studentStatusApiCall({ [name]: value });
    };

    const multiSelectHandler = (selectedOptions: any, config?: any) => {
        const { name } = config || {};
        if (!name) return;
        const next = { [name]: Array.isArray(selectedOptions) ? selectedOptions : [] };
        setFilterState((prev) => ({ ...prev, ...next }));
        studentStatusApiCall(next);
    };

    const renderSelectedValue = (labelKey: string) => (selectedItems: any) =>
        Array.isArray(selectedItems) ? (
            <div className="text-truncate">
                {selectedItems.map((item: any) => item?.[labelKey]).join(", ")}
            </div>
        ) : null;

    // CustomDatePicker hands back { startDate, endDate } already in yyyy-MM-dd.
    const dateRangeHandler = (fromKey: string, toKey: string) => ({ startDate, endDate }: any) => {
        const range = { [fromKey]: startDate || "", [toKey]: endDate || "" };
        setFilterState((prev) => ({ ...prev, ...range }));
        studentStatusApiCall(range);
    };

    // A collapsed filter that is set still affects the numbers, so say so on the toggle.
    const hiddenActiveCount = [
        filterState.admissionFromDate || filterState.admissionToDate,
        filterState.inactiveFromDate || filterState.inactiveToDate,
        filterState.residentialStatus !== initialValues.residentialStatus,
    ].filter(Boolean).length;

    const moreFiltersLabel = hiddenActiveCount
        ? `More Filters (${hiddenActiveCount} applied)`
        : `More Filters (${COLLAPSIBLE_FILTER_COUNT})`;

    const resetFiltersHndlr = () => {
        const nextFilters = { ...initialValues, activeInAcademicYearId: defaultActiveAcademicYearId };
        setFilterState(nextFilters);
        studentStatusApiCall(nextFilters);
    };

    const exportSubmitHndlr = () => {
        if (USE_SAMPLE_STUDENT_STATUS_ANALYSIS) {
            toast.info("Export will be available once the student status analysis API is enabled.");
            closeExportModal();
            return;
        }
        const payload = buildPayload();
        dispatch(
            exportStudentStatusAnalysisAct(
                generateActionPayload("export_student_status_analysis", undefined, payload, { responseType: "blob" })
            )
        );
    };

    const useSample =
        USE_SAMPLE_STUDENT_STATUS_ANALYSIS &&
        !(Array.isArray(getStudentStatusAnalysisResp) && getStudentStatusAnalysisResp.length > 0);

    const tableData = useMemo(() => {
        const source = useSample
            ? applySampleAdmissionTypeFilter(sampleStudentStatusAnalysis, filterState.admissionType)
            : getStudentStatusAnalysisResp;
        return buildStudentStatusRows(source);
    }, [getStudentStatusAnalysisResp, useSample, filterState.admissionType]);

    const expandableTableColumns = useMemo(() => generateColumns(), []);

    return (
        <>
            <div className="tw-w-full">
                <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-border tw-border-gray-100 tw-mb-6">

                    <div className="tw-px-6 tw-py-4 tw-border-b tw-border-gray-100">
                        <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-items-center sm:tw-justify-between tw-gap-4">
                            <h4 className="tw-text-[16px] tw-font-[500] tw-text-gray-800 text-align-center tw-mb-0">
                                Active / Inactive Students
                            </h4>

                            <Button id="export-student-status-btn" variant="exportBtn" onClick={openExportModal}>
                                <img src={ExportIcon} alt="Export" className="tw-w-5 tw-h-5" />
                            </Button>

                            <UncontrolledTooltip placement="bottom" target="export-student-status-btn">
                                Export
                            </UncontrolledTooltip>
                        </div>
                    </div>

                    <div className="tw-p-0">

                        <div className="tw-flex tw-flex-wrap tw-gap-3 tw-px-4 tw-py-3 tw-w-full">

                        <div className="tw-w-full sm:tw-w-1/2 lg:tw-w-1/4 2xl:tw-w-[13%] tw-min-w-[200px]">
                            <SelectInput
                                name="activeInAcademicYearId"
                                value={filterState.activeInAcademicYearId}
                                onChange={filterHandler}
                                menuItems={academicYearList || []}
                                valueKey="academicYearId"
                                textKey="academicYearName"
                                formgroupClassName="tw-mb-0"
                                labelText="Stats for Academic Year"
                                hideSelectOption
                                floatingLabel
                            />
                        </div>

                        <div className="tw-w-full sm:tw-w-1/2 lg:tw-w-1/4 2xl:tw-w-[13%] tw-min-w-[200px]">
                            <MultiSelectCheckbox
                                name="academicYearIds"
                                idKey="academicYearId"
                                value={filterState.academicYearIds}
                                renderValue={renderSelectedValue("academicYearName")}
                                renderOptions={(item: any) => item?.academicYearName}
                                onChange={multiSelectHandler}
                                searchKey="academicYearName"
                                options={Array.isArray(academicYearList) ? academicYearList : []}
                                containerClassName="tw-mb-0"
                                labelText="Admission in Academic Year"
                                defaultSelect="All"
                                floatingLabel
                            />
                        </div>

                        <div className="tw-w-full sm:tw-w-1/2 lg:tw-w-1/4 2xl:tw-w-[13%] tw-min-w-[200px]">
                            <DateInput
                                name="asOnDate"
                                value={filterState.asOnDate}
                                onChange={filterHandler}
                                formgroupClassName="tw-mb-0"
                                labelText="Active As On"
                                maxDate={Current_Date_YYYYMMDD}
                                floatingLabel
                            />
                        </div>

                        <div className="tw-w-full sm:tw-w-1/2 lg:tw-w-1/4 2xl:tw-w-[13%] tw-min-w-[200px]">
                            <SelectInput
                                name="admissionType"
                                value={filterState.admissionType}
                                onChange={filterHandler}
                                menuItems={admissionTypeFilterOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                labelText="Admission Type"
                                hideSelectOption
                                floatingLabel
                            />
                        </div>

                        <div className={`tw-w-full sm:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-[15%] tw-min-w-[210px] ${collapsedClass}`}>
                            <CustomDatePicker
                                name="admissionDateRange"
                                startDate={filterState.admissionFromDate}
                                endDate={filterState.admissionToDate}
                                onChange={dateRangeHandler("admissionFromDate", "admissionToDate")}
                                placeholder="Select a date range"
                                monthsShown={2}
                                formgroupClassName="tw-mb-0"
                                labelText="Admission Date Range"
                                floatingLabel
                            />
                        </div>

                        <div className={`tw-w-full sm:tw-w-1/2 lg:tw-w-1/3 2xl:tw-w-[15%] tw-min-w-[210px] ${collapsedClass}`}>
                            <CustomDatePicker
                                name="inactiveDateRange"
                                startDate={filterState.inactiveFromDate}
                                endDate={filterState.inactiveToDate}
                                onChange={dateRangeHandler("inactiveFromDate", "inactiveToDate")}
                                placeholder="Select a date range"
                                monthsShown={2}
                                formgroupClassName="tw-mb-0"
                                labelText="Inactive Date Range"
                                floatingLabel
                            />
                        </div>

                        <div className={`tw-w-full sm:tw-w-1/2 lg:tw-w-1/4 2xl:tw-w-[13%] tw-min-w-[200px] ${collapsedClass}`}>
                            <SelectInput
                                name="residentialStatus"
                                value={filterState.residentialStatus}
                                onChange={filterHandler}
                                menuItems={residentialStatusFilterOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                labelText="Residential Status"
                                hideSelectOption
                                floatingLabel
                            />
                        </div>

                        <div className="tw-flex tw-items-center tw-gap-2 tw-w-full sm:tw-w-auto">
                            <Button
                                variant="linkBtn"
                                className="2xl:tw-hidden"
                                onClick={() => setShowAllFilters((prev) => !prev)}
                            >
                                {showAllFilters ? "Less Filters" : moreFiltersLabel}
                            </Button>

                            <Button variant="secondary" onClick={resetFiltersHndlr}>
                                Reset
                            </Button>
                        </div>

                        </div>

                        <div className="tw-w-full tw-overflow-auto tw-rounded-lg tw-border tw-border-gray-100 tw-h-[468px]">
                            <TableExpandable
                                columns={expandableTableColumns || []}
                                data={Array.isArray(tableData) ? tableData : []}
                                divClass="tw-w-full"
                                theadClass="tw-text-gray-500 tw-align-middle theadPrimary"
                                tableClass="tw-min-w-full table-bordered tw-border-collapse"
                            />
                        </div>

                    </div>
                </div>
            </div>

            <ModalContainerUpdated
                id="export-student-status-analysis-modal"
                isOpen={exportModalState.showModal}
                toggle={closeExportModal}
                modalTitle="Export Active / Inactive Students"
                modalSize="md"
            >
                <ExportModal
                    isOpen={exportModalState.showModal}
                    toggle={closeExportModal}
                    instituteId={instituteId}
                    branchId={branchId}
                    submitHndlr={exportSubmitHndlr}
                    feature="academic"
                    subFeature="student_status_analysis"
                    remarksText="Enter remarks to export the active / inactive student report?"
                />
            </ModalContainerUpdated>
        </>
    );
};

export default StudentStatusAnalysis;

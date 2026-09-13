import { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { InputCheckboxUpdated, ModalContainerUpdated, MultiSelectCheckbox, SelectInput } from "../../../../Components/Common";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import Button from "../../../../Components/Common/Button";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { useModal } from "../../../../hooks/modalhook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { exportClassWiseFeeSummaryAct, getClassWiseFeeSummaryAct } from "../../../../store/fee/feereport/feereportactions";
import OutstandingSummaryCards from "./OutstandingSummaryCards";
import TrendChart from "./TrendChart";
import ClassWiseMatrixTable from "./ClassWiseMatrixTable";
import StudentDuesModal from "./StudentDuesModal";
import {
    applyScope,
    buildClassWiseAmounts,
    buildClassWiseStudentCounts,
    buildSummary,
    buildYearWiseTotals,
    describeCell,
    dropEmptyClasses,
    eliteParentOptions,
    feeTypeOptions,
    getEmptyClassCount,
    getNonEmptyYears,
    getYearColumns,
    groupByOptions,
    IDrillDownCell,
    sampleClassWiseFeeSummary,
    serializeFilters,
    studentStatusOptions,
    USE_SAMPLE_CLASS_WISE_FEE_SUMMARY,
} from "./helper";

/** Report scope: applied via Get Report, since every panel on the page is rebuilt from one API call. */
const initialScope: any = {
    academicYearIds: [],
    curriculumId: "",
    classIds: [],
    studentStatus: "",
    feeType: "",
    isEliteParent: "",
};

export default function ClassWiseFeeSummaryReport() {
    const dispatch = useAppDispatch();
    const [scope, setScope] = useState<any>(initialScope);
    const [groupBy, setGroupBy] = useState("CLASS");
    const [hideEmpty, setHideEmpty] = useState(true);
    const [drillDownCell, setDrillDownCell] = useState<IDrillDownCell | null>(null);
    /** The scope the numbers on screen belong to. Held in state, not a ref, because it re-shapes what renders. */
    const [appliedScope, setAppliedScope] = useState<any>(initialScope);
    const { closeModal: closeStudentsModal, modalState: studentsModalState, openModal: openStudentsModal } = useModal();
    const { closeModal: closeYearWiseModal, modalState: yearWiseModalState, openModal: openYearWiseModal } = useModal();
    const { closeModal: closeStudentsChartModal, modalState: studentsChartModalState, openModal: openStudentsChartModal } = useModal();
    /** Which arrears bucket the class-wise amount modal is showing, if any. */
    const [amountChartBucket, setAmountChartBucket] = useState<"current" | "prior" | null>(null);

    const {
        academicYearListResp,
        brchCurriculumResp,
        branchClassResp,
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
        showApiLoader,
        classWiseFeeSummaryResp,
        exportClassWiseFeeSummaryResp,
        feeReportErrorResp,
    }: any = useAppSelector(
        ({ instAcademics, branchAcademics, appData, globalData, feeReport }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            brchCurriculumResp: branchAcademics.brchCurriculumResp,
            branchClassResp: branchAcademics.branchClassResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
            showApiLoader: globalData.showApiLoader,
            classWiseFeeSummaryResp: feeReport.classWiseFeeSummaryResp,
            exportClassWiseFeeSummaryResp: feeReport.exportClassWiseFeeSummaryResp,
            feeReportErrorResp: feeReport.feeReportErrorResp,
        }),
        shallowEqual
    );

    const academicYearList = academicYearListResp?.data;

    /**
     * Curriculum and class lists belong to a single year, so one of the selected years has to drive those
     * lookups: the running year when it is in the selection, otherwise the most recent one.
     */
    const lookupYearId = (years: any[]) => {
        const list = Array.isArray(years) ? years : [];
        const running = list.find((year: any) => year?.yearStatus?.toLowerCase() === "current");
        if (running) return running.academicYearId;
        return [...list].sort((a, b) => String(b?.academicYearName).localeCompare(String(a?.academicYearName)))[0]?.academicYearId;
    };

    // ---------- lookups ----------
    useEffect(() => {
        if (Array.isArray(academicYearList) && academicYearList.length > 0) {
            // Opens on every academic year, so the report reads as the full arrears history until narrowed.
            setScope((prev: any) => ({ ...prev, academicYearIds: academicYearList }));
            const yearId = lookupYearId(academicYearList);
            if (yearId) {
                dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, { academicYearId: yearId, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" })));
            }
        }
    }, [academicYearListResp]);

    // ---------- data ----------
    const useSample = USE_SAMPLE_CLASS_WISE_FEE_SUMMARY && !(Array.isArray(classWiseFeeSummaryResp?.data) && classWiseFeeSummaryResp.data.length > 0);
    // Memoised so the panels below keep a stable report identity between renders.
    const rawReport = useMemo(
        () => useSample ? sampleClassWiseFeeSummary : (classWiseFeeSummaryResp || {}),
        [useSample, classWiseFeeSummaryResp]
    );
    /** Names the applied filters are matched by; ids belong to the API, names to the data on screen. */
    const appliedNames = useMemo(() => ({
        yearNames: (appliedScope.academicYearIds || []).map((year: any) => year?.academicYearName).filter(Boolean),
        classNames: (appliedScope.classIds || []).map((cls: any) => cls?.shortName).filter(Boolean),
        curriculumNames: [brchCurriculumResp?.data?.find((item: any) => item?.branchCurriculumId === appliedScope.curriculumId)?.curriculumName]
            .filter(Boolean),
        feeType: appliedScope.feeType || "",
        isEliteParent: appliedScope.isEliteParent || "",
    }), [appliedScope, brchCurriculumResp]);

    // Class and curriculum rows are only narrowed here in sample mode; live responses arrive filtered.
    const report = useMemo(() => applyScope(rawReport, appliedNames, useSample), [rawReport, appliedNames, useSample]);

    const allYears = useMemo(() => getYearColumns(report), [report]);
    /** The running year the arrears split is measured against; falls back to the latest year on screen. */
    const currentYearName = useMemo(() => {
        const runningYear = academicYearList?.find((year: any) => year?.yearStatus?.toLowerCase() === "current")?.academicYearName;
        return (runningYear && allYears.includes(runningYear)) ? runningYear : allYears[allYears.length - 1];
    }, [academicYearList, allYears]);
    const nonEmptyYears = useMemo(() => getNonEmptyYears(report, allYears), [report, allYears]);
    const years = hideEmpty ? nonEmptyYears : allYears;
    /** What the matrix and the class-wise graphs plot; the cards always speak for the whole filtered report. */
    const visibleReport = useMemo(() => hideEmpty ? dropEmptyClasses(report) : report, [report, hideEmpty]);

    const summary = useMemo(() => buildSummary(report, allYears, currentYearName), [report, allYears, currentYearName]);
    const yearWiseTotals = useMemo(() => buildYearWiseTotals(visibleReport, years), [visibleReport, years]);
    const classWiseStudents = useMemo(() => buildClassWiseStudentCounts(visibleReport), [visibleReport]);
    const classWiseAmounts = useMemo(
        () => amountChartBucket ? buildClassWiseAmounts(visibleReport, allYears, currentYearName, amountChartBucket) : [],
        [visibleReport, allYears, currentYearName, amountChartBucket]
    );

    // Counts of what the toggle drops, reported the same whether it is on or off.
    const emptyYearCount = allYears.length - nonEmptyYears.length;
    const emptyClassCount = useMemo(() => getEmptyClassCount(report), [report]);
    const hideEmptyLabel = useMemo(() => {
        const parts = [
            emptyYearCount > 0 ? `${emptyYearCount} year${emptyYearCount === 1 ? "" : "s"}` : "",
            emptyClassCount > 0 ? `${emptyClassCount} class${emptyClassCount === 1 ? "" : "es"}` : "",
        ].filter(Boolean);
        return `Hide years and classes with no dues${parts.length ? ` (${parts.join(" · ")})` : ""}`;
    }, [emptyYearCount, emptyClassCount]);

    const scopeParams = (s: any) => ({ ...serializeFilters({ instituteId, branchId, ...s }), includeSections: true });

    const fetchReport = (s: any = scope) => {
        setAppliedScope(s);
        dispatch(getClassWiseFeeSummaryAct(generateActionPayload("get_class_wise_fee_summary", undefined, scopeParams(s))));
    };

    useEffect(() => {
        if (scope.academicYearIds.length > 0 && appliedScope.academicYearIds.length === 0) {
            fetchReport();
        }
    }, [scope.academicYearIds]);

    const prevRef = useRef({ prevError: feeReportErrorResp, prevExport: exportClassWiseFeeSummaryResp });
    useEffect(() => {
        const { prevError, prevExport } = prevRef.current;
        if (feeReportErrorResp && prevError !== feeReportErrorResp) {
            toast.error(feeReportErrorResp?.details || "Something went wrong.");
        } else if (exportClassWiseFeeSummaryResp && prevExport !== exportClassWiseFeeSummaryResp) {
            toast.success("Class-wise Outstanding Summary Downloaded Successfully.");
            downloadExcelFile(exportClassWiseFeeSummaryResp, "Class_Wise_Outstanding_Summary");
        }
        prevRef.current = { prevError: feeReportErrorResp, prevExport: exportClassWiseFeeSummaryResp };
    }, [feeReportErrorResp, exportClassWiseFeeSummaryResp]);

    // ---------- scope filters ----------
    const scopeHandler = (event: any) => {
        const { name, value } = event.target;
        setScope((prev: any) => {
            const next = { ...prev, [name]: value };
            if (name === "curriculumId") { next.classIds = []; }
            return next;
        });
        if (name === "curriculumId") {
            if (value) {
                dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, { academicYearId: lookupYearId(scope.academicYearIds), branchId, curriculumId: value, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 })));
            } else {
                dispatch(resetBrchClassAct(undefined));
            }
        }
    };

    const multiSelectHandler = (selectedOptions: any, config?: any) => {
        const { name } = config || {};
        if (!name) return;
        const selected = Array.isArray(selectedOptions) ? selectedOptions : [];
        setScope((prev: any) => {
            const next = { ...prev, [name]: selected };
            if (name === "academicYearIds") { next.curriculumId = ""; next.classIds = []; }
            return next;
        });
        if (name === "academicYearIds") {
            const yearId = lookupYearId(selected);
            if (yearId) {
                dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, { academicYearId: yearId, branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" })));
            }
            dispatch(resetBrchClassAct(undefined));
        }
    };

    const getReportHandler = () => fetchReport();

    const clearScopeHandler = () => {
        const reset = { ...initialScope, academicYearIds: academicYearList || [] };
        setScope(reset);
        dispatch(resetBrchClassAct(undefined));
        fetchReport(reset);
    };

    const exportHandler = () => {
        dispatch(exportClassWiseFeeSummaryAct(generateActionPayload("export_class_wise_fee_summary", undefined, {
            ...scopeParams(appliedScope),
            groupBy,
        }, { responseType: "blob" })));
    };

    const cellClickHandler = (cell: IDrillDownCell) => {
        setDrillDownCell({ ...cell, feeType: appliedNames.feeType });
        openStudentsModal();
    };

    const closeDrillDown = () => {
        closeStudentsModal();
        setDrillDownCell(null);
    };

    const renderSelected = (labelKey: string) => (items: any) =>
        Array.isArray(items) ? <div className="text-truncate">{items.map((item: any) => item?.[labelKey]).join(", ")}</div> : null;

    const { data: curriculumTypes } = brchCurriculumResp || {};
    const { content: classTypes } = branchClassResp || {};

    return (
        <div className="page-content fee-status-reports">
            <div className="container-fluid">
                <BreadCrumb title="Class-wise Outstanding Summary" pageTitle="Fee" />

                <OutstandingSummaryCards
                    summary={summary}
                    currentYearName={currentYearName}
                    onViewYearWise={() => openYearWiseModal()}
                    onViewClassWiseStudents={() => openStudentsChartModal()}
                    onViewCurrentYearDues={() => setAmountChartBucket("current")}
                    onViewPriorYearArrears={() => setAmountChartBucket("prior")}
                />

                <ClassWiseMatrixTable
                    report={visibleReport}
                    years={years}
                    groupBy={groupBy}
                    currentYearName={currentYearName}
                    onCellClick={cellClickHandler}
                    scopeNote={[
                        feeTypeOptions.find((option) => option.id === appliedNames.feeType)?.name,
                        appliedNames.isEliteParent === "true" ? "Elite parents"
                            : appliedNames.isEliteParent === "false" ? "Non-elite parents" : "",
                    ].filter(Boolean).join(" · ")}
                    headerActions={
                        <Button type="button" variant="secondary" onClick={exportHandler} disabled={showApiLoader} className="tw-flex tw-items-center">
                            <img src={ExportIcon} alt="" className="tw-h-4 tw-w-4 tw-mr-2" />
                            Export
                        </Button>
                    }
                    filterBar={
                        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-12 tw-gap-4">
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <MultiSelectCheckbox
                                    name="academicYearIds"
                                    idKey="academicYearId"
                                    labelText="Academic Year"
                                    containerClassName="mb-0"
                                    value={scope.academicYearIds}
                                    renderValue={renderSelected("academicYearName")}
                                    renderOptions={(item: any) => item?.academicYearName}
                                    onChange={multiSelectHandler}
                                    searchKey="academicYearName"
                                    options={academicYearList || []}
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
                                <MultiSelectCheckbox
                                    name="classIds"
                                    idKey="id"
                                    labelText="Class"
                                    containerClassName="mb-0"
                                    value={scope.classIds}
                                    renderValue={renderSelected("shortName")}
                                    renderOptions={(item: any) => item?.shortName}
                                    onChange={multiSelectHandler}
                                    searchKey="shortName"
                                    options={classTypes || []}
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <SelectInput
                                    name="studentStatus"
                                    value={scope.studentStatus}
                                    onChange={scopeHandler}
                                    menuItems={studentStatusOptions}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Student Status"
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <SelectInput
                                    name="feeType"
                                    value={scope.feeType}
                                    onChange={scopeHandler}
                                    menuItems={feeTypeOptions}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Fee Type"
                                    defaultSelect="All Fees"
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                                <SelectInput
                                    name="isEliteParent"
                                    value={scope.isEliteParent}
                                    onChange={scopeHandler}
                                    menuItems={eliteParentOptions}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Is Elite Parent"
                                    defaultSelect="All"
                                    floatingLabel
                                />
                            </div>
                            <div className="md:tw-col-span-12 lg:tw-col-span-12 xl:tw-col-span-12 tw-flex tw-items-center tw-justify-end tw-gap-2">
                                <Button type="button" variant="wrong" onClick={clearScopeHandler} className="!tw-px-3 !tw-py-1">
                                    Clear filter
                                </Button>
                                <Button type="button" variant="primary" onClick={getReportHandler} disabled={showApiLoader}>
                                    Get Report
                                </Button>
                            </div>
                        </div>
                    }
                    viewControls={
                        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-4">
                            <div className="tw-w-[190px]">
                                <SelectInput
                                    name="groupBy"
                                    value={groupBy}
                                    onChange={(event: any) => setGroupBy(event.target.value)}
                                    menuItems={groupByOptions}
                                    valueKey="id"
                                    textKey="name"
                                    formgroupClassName="tw-mb-0"
                                    labelText="Group By"
                                    floatingLabel
                                    hideSelectOption
                                />
                            </div>
                            <InputCheckboxUpdated
                                name="hideEmpty"
                                labelName={hideEmptyLabel}
                                value={hideEmpty}
                                onChange={() => setHideEmpty((prev) => !prev)}
                                formgroupClassName="tw-mb-0"
                            />
                        </div>
                    }
                />
            </div>

            <ModalContainerUpdated
                id="class-wise-outstanding-year-wise-modal"
                isOpen={yearWiseModalState.showModal}
                toggle={closeYearWiseModal}
                modalTitle="Year-wise Outstanding"
                modalSize="xl"
            >
                <div className="tw-p-2">
                    <TrendChart
                        data={yearWiseTotals}
                        valueType="amount"
                        caption="All classes in the current filters, by the year the due belongs to"
                        highlightLabel={currentYearName}
                        inModal
                    />
                    <div className="tw-px-2 tw-pb-2 tw-flex tw-justify-end">
                        <Button type="button" variant="secondary" onClick={closeYearWiseModal}>Close</Button>
                    </div>
                </div>
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="class-wise-students-chart-modal"
                isOpen={studentsChartModalState.showModal}
                toggle={closeStudentsChartModal}
                modalTitle="Class-wise Students with Dues"
                modalSize="xl"
            >
                <div className="tw-p-2">
                    <TrendChart
                        data={classWiseStudents}
                        valueType="count"
                        caption="Students carrying dues in each class, under the current filters"
                        categoryPrefix="Class "
                        inModal
                    />
                    <div className="tw-px-2 tw-pb-2 tw-flex tw-justify-end">
                        <Button type="button" variant="secondary" onClick={closeStudentsChartModal}>Close</Button>
                    </div>
                </div>
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="class-wise-amounts-chart-modal"
                isOpen={amountChartBucket !== null}
                toggle={() => setAmountChartBucket(null)}
                modalTitle={amountChartBucket === "prior"
                    ? "Class-wise Prior Year Arrears"
                    : `Class-wise Current Year Dues${currentYearName ? ` — ${currentYearName}` : ""}`}
                modalSize="xl"
            >
                <div className="tw-p-2">
                    <TrendChart
                        data={classWiseAmounts}
                        valueType="amount"
                        caption={amountChartBucket === "prior"
                            ? "Outstanding carried forward from years before the running year, by class"
                            : "Outstanding raised in the running year, by class"}
                        categoryPrefix="Class "
                        inModal
                    />
                    <div className="tw-px-2 tw-pb-2 tw-flex tw-justify-end">
                        <Button type="button" variant="secondary" onClick={() => setAmountChartBucket(null)}>Close</Button>
                    </div>
                </div>
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="class-wise-outstanding-students-modal"
                isOpen={studentsModalState.showModal}
                toggle={closeDrillDown}
                modalTitle={`Students with Dues — ${describeCell(drillDownCell)}`}
                modalSize="xl"
            >
                <StudentDuesModal
                    cell={drillDownCell}
                    scope={appliedScope}
                    academicYearList={academicYearList || []}
                    report={report}
                    toggle={closeDrillDown}
                />
            </ModalContainerUpdated>
        </div>
    );
}

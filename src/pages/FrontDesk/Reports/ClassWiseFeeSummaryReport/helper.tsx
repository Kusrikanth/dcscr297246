import { getDisplayAmountValue } from "../../../../utility/commonutility";

/**
 * Class-wise Outstanding Summary.
 *
 * The student-wise unpaid report lists one row per student with the outstanding amount split across the
 * academic year the due belongs to (2015-2016 … 2026-2027) and a Grand Total. This report rolls those rows
 * up by the student's class, so the same matrix is read class-wise: rows are classes (optionally sections),
 * columns are academic years, cells are the outstanding amount carried by that class for that year.
 */

/** Mirrors the `student_status` column of the student-wise unpaid report. */
export const studentStatusOptions = [
    { id: "ACTIVE", name: "Active" },
    { id: "INACTIVE", name: "Inactive" },
];

/** Server vocabulary for fee types, matching the fee dashboard's existing `feeType` parameter. */
export const feeTypeOptions = [
    { id: "FEE STRUCTURE", name: "Academic Fee" },
    { id: "TRANSPORT FEE", name: "Transport Fee" },
];

/** Per-fee-type buckets the sample data carries alongside the combined `yearWise` map. */
const FEE_TYPE_KEYS: Record<string, string> = {
    "FEE STRUCTURE": "academicYearWise",
    "TRANSPORT FEE": "transportYearWise",
};
const ACADEMIC_KEY = FEE_TYPE_KEYS["FEE STRUCTURE"];
const TRANSPORT_KEY = FEE_TYPE_KEYS["TRANSPORT FEE"];
/** Dues owed by parents flagged elite, carried by the sample data alongside `yearWise`. */
const ELITE_KEY = "eliteYearWise";

export const eliteParentOptions = [
    { id: "true", name: "Yes" },
    { id: "false", name: "No" },
];

export const groupByOptions = [
    { id: "CLASS", name: "Class" },
    { id: "CLASS_SECTION", name: "Class & Section" },
];

/** Multi-select filters are kept as option objects in state; the API expects comma-separated ids. */
export const multiSelectFilterKeys: Record<string, string> = {
    academicYearIds: "academicYearId",
    classIds: "id",
};

export function serializeFilters(filters: any) {
    const serialized: any = { ...filters };
    Object.entries(multiSelectFilterKeys).forEach(([key, idKey]) => {
        const value = filters?.[key];
        serialized[key] = Array.isArray(value) ? value.map((item: any) => item?.[idKey]).filter(Boolean).join(",") : (value || "");
    });
    return serialized;
}

export function formatAmount(value: any) {
    return getDisplayAmountValue(Number(value) || 0);
}

export interface IMatrixRow {
    id: string;
    rowType: "class" | "section" | "total";
    /** Class row a section row belongs to; used to hide/show sections. */
    parentId?: string;
    label: string;
    subLabel?: string;
    studentCount: number;
    yearWise: Record<string, number>;
    grandTotal: number;
    hasSections?: boolean;
    /** Identity the student drill-down is scoped by. Absent on the Total row, which spans every class. */
    classId?: string | number;
    className?: string;
    sectionId?: string | number;
    sectionName?: string;
    curriculumName?: string;
}

/** The cell a user drilled into: one class/section for one academic year, or its Grand Total (year = null). */
export interface IDrillDownCell {
    classId?: string | number;
    className?: string;
    sectionId?: string | number;
    sectionName?: string;
    year: string | null;
    amount: number;
    /** Applied Fee Type filter, if any: "FEE STRUCTURE" or "TRANSPORT FEE". */
    feeType?: string;
}

function toNumber(value: any) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
}

/** Year-wise buckets may arrive keyed by year name or as [{ academicYearName, outstandingAmount }]. */
function readYearWise(source: any): Record<string, number> {
    const yearWise: Record<string, number> = {};
    const raw = source?.yearWise ?? source?.yearWiseOutstanding ?? source?.years;
    if (Array.isArray(raw)) {
        raw.forEach((item: any) => {
            const key = item?.academicYearName ?? item?.year ?? item?.key;
            if (key) yearWise[key] = toNumber(item?.outstandingAmount ?? item?.amount ?? item?.value);
        });
    } else if (raw && typeof raw === "object") {
        Object.entries(raw).forEach(([key, value]) => { yearWise[key] = toNumber(value); });
    }
    return yearWise;
}

function sumYearWise(yearWise: Record<string, number>) {
    return Object.values(yearWise).reduce((acc, value) => acc + value, 0);
}

/**
 * Academic year columns, in the order the report should read them.
 * Preferred source is the API's own year list; otherwise every year that appears in the data is used.
 */
export function getYearColumns(report: any): string[] {
    const declared = report?.academicYears;
    if (Array.isArray(declared) && declared.length > 0) {
        return declared
            .map((item: any) => (typeof item === "string" ? item : item?.academicYearName ?? item?.name))
            .filter(Boolean);
    }
    const seen: string[] = [];
    (Array.isArray(report?.data) ? report.data : []).forEach((cls: any) => {
        [cls, ...(Array.isArray(cls?.sections) ? cls.sections : [])].forEach((node: any) => {
            Object.keys(readYearWise(node)).forEach((year) => { if (!seen.includes(year)) seen.push(year); });
        });
    });
    return seen.sort();
}

/**
 * Flattens the API response into the rows the matrix renders: one row per class, section rows under an
 * expanded class when grouping by section, and a trailing Total row.
 */
export function buildMatrixRows(report: any, years: string[], groupBy: string, expandedClassIds: string[]): IMatrixRow[] {
    const classes = Array.isArray(report?.data) ? report.data : [];
    const showSections = groupBy === "CLASS_SECTION";
    const rows: IMatrixRow[] = [];

    classes.forEach((cls: any) => {
        const classId = String(cls?.classId ?? cls?.className ?? rows.length);
        const sections = Array.isArray(cls?.sections) ? cls.sections : [];
        const classYearWise = readYearWise(cls);
        const grandTotal = cls?.grandTotal != null ? toNumber(cls.grandTotal) : sumYearWise(classYearWise);

        rows.push({
            id: `class-${classId}`,
            rowType: "class",
            label: cls?.className || "-",
            subLabel: cls?.curriculumName || "",
            studentCount: toNumber(cls?.studentCount),
            yearWise: classYearWise,
            grandTotal,
            hasSections: showSections && sections.length > 0,
            classId: cls?.classId,
            className: cls?.className,
            curriculumName: cls?.curriculumName,
        });

        if (showSections && sections.length > 0 && expandedClassIds.includes(classId)) {
            sections.forEach((section: any, index: number) => {
                const sectionYearWise = readYearWise(section);
                rows.push({
                    id: `section-${classId}-${section?.sectionId ?? index}`,
                    rowType: "section",
                    parentId: classId,
                    label: section?.sectionName || "-",
                    studentCount: toNumber(section?.studentCount),
                    yearWise: sectionYearWise,
                    grandTotal: section?.grandTotal != null ? toNumber(section.grandTotal) : sumYearWise(sectionYearWise),
                    classId: cls?.classId,
                    className: cls?.className,
                    sectionId: section?.sectionId,
                    sectionName: section?.sectionName,
                    curriculumName: cls?.curriculumName,
                });
            });
        }
    });

    if (rows.length === 0) return rows;

    const classRows = rows.filter((row) => row.rowType === "class");
    const totalYearWise: Record<string, number> = {};
    years.forEach((year) => {
        totalYearWise[year] = classRows.reduce((acc, row) => acc + (row.yearWise[year] || 0), 0);
    });
    rows.push({
        id: "total",
        rowType: "total",
        label: "Total",
        studentCount: classRows.reduce((acc, row) => acc + row.studentCount, 0),
        yearWise: totalYearWise,
        grandTotal: classRows.reduce((acc, row) => acc + row.grandTotal, 0),
    });

    return rows;
}

/** Years carrying no dues at all are droppable — 12 empty columns otherwise crowd out the ones that matter. */
export function getNonEmptyYears(report: any, years: string[]) {
    const classes = Array.isArray(report?.data) ? report.data : [];
    return years.filter((year) => classes.some((cls: any) => (readYearWise(cls)[year] || 0) !== 0));
}

function nodeTotal(node: any) {
    return node?.grandTotal != null ? toNumber(node.grandTotal) : sumYearWise(readYearWise(node));
}

/** Classes clear of dues, and clear sections inside the ones that remain, for the same reason. */
export function dropEmptyClasses(report: any) {
    const classes = Array.isArray(report?.data) ? report.data : [];
    if (classes.length === 0) return report;
    return {
        ...report,
        data: classes
            .filter((cls: any) => nodeTotal(cls) !== 0)
            .map((cls: any) => ({
                ...cls,
                sections: Array.isArray(cls?.sections) ? cls.sections.filter((section: any) => nodeTotal(section) !== 0) : [],
            })),
    };
}

/** How many classes the toggle hides, whether or not it is currently on. */
export function getEmptyClassCount(report: any) {
    const classes = Array.isArray(report?.data) ? report.data : [];
    return classes.filter((cls: any) => nodeTotal(cls) === 0).length;
}

/**
 * Headline numbers. `currentYearName` splits the total into what the running year owes and what has been
 * carried forward from earlier years — the arrears the class teacher/accounts team actually chase.
 */
export function buildSummary(report: any, years: string[], currentYearName?: string) {
    const classes = Array.isArray(report?.data) ? report.data : [];
    let totalOutstanding = 0;
    let studentsWithDues = 0;
    let classesWithDues = 0;
    let currentYearDues = 0;
    let priorYearArrears = 0;
    let topClass: { className: string; amount: number } | null = null;

    classes.forEach((cls: any) => {
        const yearWise = readYearWise(cls);
        const classTotal = cls?.grandTotal != null ? toNumber(cls.grandTotal) : sumYearWise(yearWise);
        totalOutstanding += classTotal;
        studentsWithDues += toNumber(cls?.studentCount);
        if (classTotal > 0) classesWithDues += 1;
        if (!topClass || classTotal > topClass.amount) topClass = { className: cls?.className || "-", amount: classTotal };
        years.forEach((year) => {
            const amount = yearWise[year] || 0;
            if (currentYearName && year === currentYearName) currentYearDues += amount;
            else if (currentYearName && year < currentYearName) priorYearArrears += amount;
        });
    });

    return { totalOutstanding, studentsWithDues, classesWithDues, currentYearDues, priorYearArrears, topClass };
}

/** Re-totals a class/section after its year buckets were narrowed, scaling the student count with the amount. */
function rescaleNode(node: any, yearWise: Record<string, number>) {
    const narrowedTotal = sumYearWise(yearWise);
    const originalTotal = node?.grandTotal != null ? toNumber(node.grandTotal) : sumYearWise(readYearWise(node));
    // Student counts are not broken down per year or fee type, so they follow the share of the amount kept.
    const studentCount = originalTotal > 0
        ? Math.max(narrowedTotal > 0 ? 1 : 0, Math.round((toNumber(node?.studentCount) * narrowedTotal) / originalTotal))
        : 0;
    return { ...node, yearWise, grandTotal: narrowedTotal, studentCount };
}

/**
 * Re-splits the per-fee-type buckets to match a narrowed year map, keeping academic + transport equal to the
 * narrowed total so a Fee Type filter applied afterwards still reconciles.
 */
function realignFeeTypeBuckets(node: any, narrowed: Record<string, number>, originalYearWise: Record<string, number>) {
    if (!node?.[ACADEMIC_KEY] && !node?.[TRANSPORT_KEY]) return {};
    const academic = readYearWise({ yearWise: node?.[ACADEMIC_KEY] });
    const nextAcademic: Record<string, number> = {};
    const nextTransport: Record<string, number> = {};
    Object.keys(narrowed).forEach((year) => {
        const original = originalYearWise[year] || 0;
        const kept = narrowed[year] || 0;
        const share = original > 0 ? kept / original : 0;
        nextAcademic[year] = Math.min(Math.round((academic[year] || 0) * share), kept);
        nextTransport[year] = kept - nextAcademic[year];
    });
    return { [ACADEMIC_KEY]: nextAcademic, [TRANSPORT_KEY]: nextTransport };
}

/** Applies a node-level transform to every class and its sections, keeping class counts equal to their sections. */
function mapReportNodes(report: any, transform: (node: any) => any) {
    return {
        ...report,
        data: (Array.isArray(report?.data) ? report.data : []).map((cls: any) => {
            const sections = Array.isArray(cls?.sections) ? cls.sections.map(transform) : [];
            const projected = transform(cls);
            return {
                ...projected,
                studentCount: sections.length
                    ? sections.reduce((acc: number, section: any) => acc + toNumber(section?.studentCount), 0)
                    : projected.studentCount,
                sections,
            };
        }),
    };
}

/**
 * Narrows a report to one fee type. The live API filters server-side, so this only does the work when the
 * response actually carries the per-fee-type buckets (as the sample data does) — otherwise it is a no-op.
 */
export function projectFeeType(report: any, feeType: string) {
    const key = FEE_TYPE_KEYS[feeType];
    const classes = Array.isArray(report?.data) ? report.data : [];
    if (!key || classes.length === 0 || !classes.some((cls: any) => cls?.[key])) return report;
    return mapReportNodes(report, (node: any) => rescaleNode(node, readYearWise({ yearWise: node?.[key] })));
}

/**
 * Narrows the report to the selected academic years. Years are matched by name so this holds whether the
 * response was already filtered server-side or not; if no selected year appears in the data (naming differs
 * between the year list and the report) the report is left alone rather than blanked.
 */
export function narrowToYears(report: any, yearNames: string[]) {
    if (!Array.isArray(yearNames) || yearNames.length === 0) return report;
    const available = getYearColumns(report);
    const kept = available.filter((year) => yearNames.includes(year));
    if (kept.length === 0 || kept.length === available.length) return report;

    const narrow = (node: any) => {
        const yearWise = readYearWise(node);
        const narrowed: Record<string, number> = {};
        kept.forEach((year) => { narrowed[year] = yearWise[year] || 0; });
        const elite = readYearWise({ yearWise: node?.[ELITE_KEY] });
        const narrowedElite: Record<string, number> = {};
        kept.forEach((year) => { narrowedElite[year] = elite[year] || 0; });
        return {
            ...rescaleNode(node, narrowed),
            ...realignFeeTypeBuckets(node, narrowed, yearWise),
            ...(node?.[ELITE_KEY] ? { [ELITE_KEY]: narrowedElite } : {}),
        };
    };

    return { ...mapReportNodes(report, narrow), academicYears: kept };
}

/**
 * Splits the report by whether the dues are owed by parents flagged elite. Like the fee-type projection this
 * only does the work when the response carries the elite bucket; live responses arrive filtered.
 */
export function projectEliteParent(report: any, isEliteParent: string) {
    if (isEliteParent !== "true" && isEliteParent !== "false") return report;
    const classes = Array.isArray(report?.data) ? report.data : [];
    if (classes.length === 0 || !classes.some((cls: any) => cls?.[ELITE_KEY])) return report;
    const wantElite = isEliteParent === "true";

    return mapReportNodes(report, (node: any) => {
        const yearWise = readYearWise(node);
        const elite = readYearWise({ yearWise: node?.[ELITE_KEY] });
        const narrowed: Record<string, number> = {};
        Object.keys(yearWise).forEach((year) => {
            const eliteAmount = elite[year] || 0;
            narrowed[year] = wantElite ? eliteAmount : Math.max(0, (yearWise[year] || 0) - eliteAmount);
        });
        return {
            ...rescaleNode(node, narrowed),
            ...realignFeeTypeBuckets(node, narrowed, yearWise),
            [ELITE_KEY]: wantElite ? narrowed : {},
        };
    });
}

/**
 * Narrows the report to the selected curriculum and classes by name. Only used against the sample fixture —
 * the live API filters server-side, and matching its ids by label would be guesswork.
 */
export function narrowToClasses(report: any, curriculumNames: string[], classNames: string[]) {
    const classes = Array.isArray(report?.data) ? report.data : [];
    if (classes.length === 0) return report;
    const wanted = (names: string[], value: any) =>
        names.length === 0 || names.some((name) => String(name).trim().toLowerCase() === String(value ?? "").trim().toLowerCase());

    const filtered = classes.filter((cls: any) => wanted(curriculumNames, cls?.curriculumName) && wanted(classNames, cls?.className));
    // A filter whose vocabulary does not line up with the data should not blank the screen.
    if (filtered.length === 0) return report;
    return { ...report, data: filtered };
}

/** Everything the applied filters do to the numbers on screen, in one pass. */
export function applyScope(
    report: any,
    scope: { yearNames: string[]; feeType: string; curriculumNames: string[]; classNames: string[]; isEliteParent: string },
    narrowRowsClientSide: boolean
) {
    let narrowed = report;
    if (narrowRowsClientSide) narrowed = narrowToClasses(narrowed, scope.curriculumNames, scope.classNames);
    narrowed = narrowToYears(narrowed, scope.yearNames);
    narrowed = projectEliteParent(narrowed, scope.isEliteParent);
    return projectFeeType(narrowed, scope.feeType);
}

/** One point on a trend line: `value` is what is plotted, the rest is tooltip context. */
export interface ITrendPoint {
    label: string;
    value: number;
    studentCount?: number;
    outstanding?: number;
}

/** Students carrying dues in each class. */
export function buildClassWiseStudentCounts(report: any): ITrendPoint[] {
    return (Array.isArray(report?.data) ? report.data : []).map((cls: any) => ({
        label: cls?.className || "-",
        value: toNumber(cls?.studentCount),
        studentCount: toNumber(cls?.studentCount),
        outstanding: cls?.grandTotal != null ? toNumber(cls.grandTotal) : sumYearWise(readYearWise(cls)),
    }));
}

/**
 * Class-wise amounts for one side of the arrears split — the running year's dues, or everything carried
 * forward from before it. Uses the same year comparison as the summary cards, so the totals agree.
 */
export function buildClassWiseAmounts(
    report: any,
    years: string[],
    currentYearName: string | undefined,
    bucket: "current" | "prior"
): ITrendPoint[] {
    return (Array.isArray(report?.data) ? report.data : []).map((cls: any) => {
        const yearWise = readYearWise(cls);
        const value = !currentYearName ? 0 : years.reduce((acc, year) => {
            const belongs = bucket === "current" ? year === currentYearName : year < currentYearName;
            return acc + (belongs ? (yearWise[year] || 0) : 0);
        }, 0);
        return {
            label: cls?.className || "-",
            value,
            studentCount: toNumber(cls?.studentCount),
            outstanding: value,
        };
    });
}

/** Year-wise totals across every class, for the trend chart. */
export function buildYearWiseTotals(report: any, years: string[]): ITrendPoint[] {
    const classes = Array.isArray(report?.data) ? report.data : [];
    return years.map((year) => {
        const value = classes.reduce((acc: number, cls: any) => acc + (readYearWise(cls)[year] || 0), 0);
        return { label: year, value, outstanding: value };
    });
}

// TODO: remove once the class-wise summary API is available. Lets the UI be reviewed without a backend.
export const USE_SAMPLE_CLASS_WISE_FEE_SUMMARY = true;

const SAMPLE_YEARS = [
    "2015-2016", "2016-2017", "2017-2018", "2018-2019", "2019-2020", "2020-2021",
    "2021-2022", "2022-2023", "2023-2024", "2024-2025", "2025-2026", "2026-2027",
];

const SAMPLE_CLASSES = [
    { classId: 1, className: "I", curriculumName: "CBSE", sections: ["I-A", "I-B"] },
    { classId: 2, className: "II", curriculumName: "CBSE", sections: ["II-A", "II-B"] },
    { classId: 3, className: "III", curriculumName: "CBSE", sections: ["III-A", "III-B"] },
    { classId: 4, className: "IV", curriculumName: "CBSE", sections: ["IV-A", "IV-B"] },
    { classId: 5, className: "V", curriculumName: "CBSE", sections: ["V-A", "V-B", "V-C"] },
    { classId: 6, className: "VI", curriculumName: "CBSE", sections: ["VI-A", "VI-B"] },
    { classId: 7, className: "VII", curriculumName: "CBSE", sections: ["VII-D", "VII-F"] },
    { classId: 8, className: "VIII", curriculumName: "CBSE", sections: ["VIII-I", "VIII-N"] },
    { classId: 9, className: "IX", curriculumName: "CBSE", sections: ["IX-B", "IX-J"] },
    { classId: 10, className: "X", curriculumName: "CBSE", sections: ["X-G", "X-H"] },
    { classId: 11, className: "XI", curriculumName: "CBSE", sections: ["XI-G", "XI-K"] },
    { classId: 12, className: "XII", curriculumName: "CBSE", sections: ["XII-E", "XII-I"] },
    { classId: 13, className: "XI - AS", curriculumName: "CAMBRIDGE", sections: ["XI-A"] },
    { classId: 14, className: "XII - A2", curriculumName: "CAMBRIDGE", sections: ["XII-A"] },
];

/** Fixed-seed LCG so the sample matrix is identical on every render and reload. */
function makeRandom(seed: number) {
    let state = seed % 2147483647;
    if (state <= 0) state += 2147483646;
    return () => {
        state = (state * 16807) % 2147483647;
        return (state - 1) / 2147483646;
    };
}

function buildSampleClasses() {
    const random = makeRandom(20260913);
    const lastIndex = SAMPLE_YEARS.length - 1;

    return SAMPLE_CLASSES.map((cls) => {
        const sections = cls.sections.map((sectionName, sectionIndex) => {
            const yearWise: Record<string, number> = {};
            const academicYearWise: Record<string, number> = {};
            const transportYearWise: Record<string, number> = {};
            const eliteYearWise: Record<string, number> = {};
            let studentCount = 0;

            SAMPLE_YEARS.forEach((year, index) => {
                // Old dues are rare leftovers; recent years carry most of the outstanding amount.
                const recency = index / lastIndex;
                const chance = 0.06 + recency * recency * 0.8;
                if (random() >= chance) {
                    yearWise[year] = 0;
                    academicYearWise[year] = 0;
                    transportYearWise[year] = 0;
                    eliteYearWise[year] = 0;
                    return;
                }
                const students = 1 + Math.floor(random() * (1 + recency * 7));
                const perStudent = 2000 + random() * 60000 * (0.2 + recency);
                const total = Math.round((students * perStudent) / 50) * 50;
                // Transport is the smaller half, and only some of the dues involve it at all.
                const transport = random() < 0.6 ? Math.round((total * (0.1 + random() * 0.25)) / 50) * 50 : 0;
                yearWise[year] = total;
                transportYearWise[year] = transport;
                academicYearWise[year] = total - transport;
                // Elite parents are the minority of defaulters, and not every cell has one.
                eliteYearWise[year] = random() < 0.3 ? Math.round((total * (0.15 + random() * 0.35)) / 50) * 50 : 0;
                studentCount += students;
            });

            return {
                sectionId: cls.classId * 10 + sectionIndex,
                sectionName,
                studentCount,
                yearWise,
                academicYearWise,
                transportYearWise,
                eliteYearWise,
                grandTotal: sumYearWise(yearWise),
            };
        });

        const yearWise: Record<string, number> = {};
        const academicYearWise: Record<string, number> = {};
        const transportYearWise: Record<string, number> = {};
        const eliteYearWise: Record<string, number> = {};
        SAMPLE_YEARS.forEach((year) => {
            yearWise[year] = sections.reduce((acc, section) => acc + (section.yearWise[year] || 0), 0);
            academicYearWise[year] = sections.reduce((acc, section) => acc + (section.academicYearWise[year] || 0), 0);
            transportYearWise[year] = sections.reduce((acc, section) => acc + (section.transportYearWise[year] || 0), 0);
            eliteYearWise[year] = sections.reduce((acc, section) => acc + (section.eliteYearWise[year] || 0), 0);
        });

        return {
            ...cls,
            studentCount: sections.reduce((acc, section) => acc + section.studentCount, 0),
            yearWise,
            academicYearWise,
            transportYearWise,
            eliteYearWise,
            grandTotal: sumYearWise(yearWise),
            sections,
        };
    });
}

export const sampleClassWiseFeeSummary = {
    academicYears: SAMPLE_YEARS,
    data: buildSampleClasses(),
};

/** "Class V - V-B · 2023-2024" — the scope line shown in the student drill-down modal. */
export function describeCell(cell: IDrillDownCell | null) {
    if (!cell) return "";
    const where = cell.className
        ? `Class ${cell.className}${cell.sectionName ? ` - ${cell.sectionName}` : ""}`
        : "All classes";
    return `${where} · ${cell.year || "All academic years"}`;
}

const SAMPLE_STUDENT_NAMES = [
    "AADHYA RAGINI S", "AARAV JALAN", "ABHIJITH JANNU", "AVIJWAL", "BODA AISHWARYA",
    "DURGA RUSHI M", "G KAUSHIK", "HASINI REDDY", "ISHAAN VERMA", "KAVYA NAIR",
    "MANAV BOMMAKUNTA", "MEGH H KARANI", "NEHA SRIVASTAVA", "PRACHET YERRAMA", "RIAAN KHANNA",
    "SAI ABHIJEET R", "SHIKHA I", "TANVI DESHMUKH", "VIHAAN MALHOTRA", "ZARA SHAIKH",
];

function hashSeed(text: string) {
    let hash = 7;
    for (let index = 0; index < text.length; index += 1) {
        hash = (hash * 31 + text.charCodeAt(index)) % 2147483647;
    }
    return hash;
}

/**
 * Sample students behind one drilled cell. Their Academic + Transport dues add up to exactly the amount the
 * matrix shows for that cell, so the modal always ties back to the number that was clicked.
 */
export function buildSampleCellStudents(cell: IDrillDownCell | null, report: any) {
    const amount = Number(cell?.amount) || 0;
    if (!cell || amount <= 0) return [];

    const random = makeRandom(hashSeed(`${cell.classId ?? "all"}-${cell.sectionId ?? ""}-${cell.year ?? "all"}`));
    const classes = Array.isArray(report?.data) ? report.data : [];
    const matchedClass = classes.find((item: any) => String(item?.classId) === String(cell.classId));
    const sectionNames: string[] = cell.sectionName
        ? [cell.sectionName]
        : (Array.isArray(matchedClass?.sections) ? matchedClass.sections.map((section: any) => section?.sectionName).filter(Boolean) : []);

    const count = Math.max(1, Math.min(12, Math.round(amount / 45000) + 1));
    const weights = Array.from({ length: count }, () => 0.4 + random());
    const weightTotal = weights.reduce((acc, weight) => acc + weight, 0);
    // Names are walked from a per-cell starting point rather than drawn at random, so no student repeats in a list.
    const firstName = Math.floor(random() * SAMPLE_STUDENT_NAMES.length);

    let allocated = 0;
    return weights.map((weight, index) => {
        const isLast = index === count - 1;
        const totalDue = isLast
            ? Math.max(0, amount - allocated)
            : Math.round((amount * weight) / weightTotal / 50) * 50;
        allocated += totalDue;

        // Under a fee-type filter the cell only holds that one kind of due; otherwise it is a mix, and
        // transport is always the smaller half.
        const mixedTransport = random() < 0.55 ? Math.round((totalDue * (0.12 + random() * 0.2)) / 50) * 50 : 0;
        const transportFeeDue = cell.feeType === "TRANSPORT FEE" ? totalDue
            : cell.feeType === "FEE STRUCTURE" ? 0
                : mixedTransport;
        const nameIndex = (firstName + index) % SAMPLE_STUDENT_NAMES.length;
        const sectionName = sectionNames.length ? sectionNames[Math.floor(random() * sectionNames.length)] : "";
        const rollNumber = 200000 + Math.floor(random() * 99999);

        return {
            studentId: 60000 + (rollNumber % 9999),
            studentCode: `1${rollNumber}`,
            studentName: SAMPLE_STUDENT_NAMES[nameIndex],
            className: cell.className || matchedClass?.className || "-",
            sectionName,
            curriculumName: matchedClass?.curriculumName || "",
            studentStatus: random() < 0.65 ? "ACTIVE" : "INACTIVE",
            academicFeeDue: Math.max(0, totalDue - transportFeeDue),
            transportFeeDue,
            totalDue,
        };
    });
}

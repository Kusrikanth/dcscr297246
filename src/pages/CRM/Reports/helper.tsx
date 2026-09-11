import type { ChangeEvent } from "react";
import { evaluateFormula } from "./calculationengine";

export type FieldChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>;

export type ReportValue = unknown;

export interface ReportRecord {
    [fieldId: string]: ReportValue;
}

type DateLike = string | number | Date;

export type ReportFieldType =
    | "text"
    | "number"
    | "date"
    | "datetime"
    | "boolean"
    | "calculated";

export interface ReportField {
    id: string;
    label: string;
    type: ReportFieldType;
}

export interface ReportMeasure {
    field: string;
    aggregation: string;
    label?: string;
    outputType?: string;
    outputTypeCustomized?: boolean;
}

export interface ReportFilter {
    id: string;
    field: string;
    operator: string;
    value: Array<string> | string;
    type: ReportFieldType;
}

export interface ConditionNode {
    id: string;
    kind: "condition" | "group";
    logic?: "AND" | "OR";
    children?: Array<ConditionNode>;
    field?: string;
    operator?: string;
    value?: Array<string> | string;
}

export interface CalculatedField {
    id: string;
    name: string;
    formula: string;
    formulaMode?: "auto" | "manual";
    calculationType: "row" | "measure";
    outputType: string;
    conditions?: ConditionNode;
    aggregationFunction?: string;
    aggregationField?: string;
    dependencies?: Array<string>;
}

export interface ReportDefinition {
    id?: string;
    type: string;
    title: string;
    description: string;
    dataSourceId: string;
    dateField: string;
    dateFrom: string;
    dateTo: string;
    stages: Array<string>;
    filters: Array<ReportFilter>;
    rows: Array<string>;
    columns: Array<string>;
    values: Array<ReportMeasure>;
    dateGroups: Record<string, string>;
    calculatedFields: Array<CalculatedField>;
    fieldCatalog: Array<ReportField>;
    cardColumns: number;
    showLabels: boolean;
    showRowTotals: boolean;
    showColumnTotals: boolean;
    mapLatitudeField?: string;
    mapLongitudeField?: string;
    generatedAt?: string;
    updatedAt?: string;
    createdByUserId?: string;
    createdByName?: string;
    visibleToUserIds?: Array<string>;
    generatedData?: PivotData;
}

export interface PivotRow {
    label: string;
    level: number;
    path: string;
    cells: Array<number | Array<ReportValue>>;
    measureCells: Array<Array<number | Array<ReportValue>>>;
    measureTotals: Array<number | Array<ReportValue>>;
    total: number;
    color: string;
    children: Array<PivotRow>;
}

export interface PivotMeasureDefinition {
    field: string;
    aggregation: string;
    label: string;
    valueFormat: ReportValueFormat;
}

export interface PivotData {
    rows: Array<PivotRow>;
    columnNames: Array<string>;
    measures: Array<PivotMeasureDefinition>;
    grandMeasureCells: Array<Array<number | Array<ReportValue>>>;
    grandTotals: Array<number | Array<ReportValue>>;
    recordCount: number;
    funnel: Array<{ label: string; value: number; color: string }>;
}

export interface ReportValueFormat {
    outputType?: string;
    percentageIsWhole?: boolean;
}

export interface ReportLead extends ReportRecord {
    leadId: string;
    studentName: string;
    phone: string;
    email: string;
    branchName: string;
    applyingClass: string;
    leadType: string;
    source: string;
    campaign: string;
    channel: string;
    stage: string;
    status: string;
    owner: string;
    city: string;
    score: number;
    remarksCount: number;
    isParent: boolean;
    addedAt: string;
    updatedAt: string;
    nextFollowup: string;
    latitude: number;
    longitude: number;
}

export interface ReportDataSource {
    id: string;
    sourceName: string;
    displayName: string;
    sourceType: string;
}

export interface SavedReportUser {
    id: string;
    name: string;
    email: string;
    role: string;
}

export const reportTypes = [
    { id: "cards", label: "Cards", icon: "ri-layout-grid-line" },
    { id: "table", label: "Table", icon: "ri-table-line" },
    { id: "funnel", label: "Funnel", icon: "ri-filter-2-line" },
    { id: "pie", label: "Pie chart", icon: "ri-pie-chart-line" },
    { id: "donut", label: "Donut chart", icon: "ri-donut-chart-line" },
    { id: "line", label: "Line graph", icon: "ri-line-chart-line" },
    { id: "stacked-column", label: "Stacked column", icon: "ri-bar-chart-grouped-line" },
    { id: "stacked-bar", label: "Stacked bar", icon: "ri-bar-chart-horizontal-line" },
    { id: "map", label: "Map", icon: "ri-map-pin-line" },
];

export const reportPalette = [
    "#5b61c4",
    "#4e8bd8",
    "#e28a45",
    "#9b66c7",
    "#43a486",
    "#8d96a8",
    "#d85f70",
    "#555aaf",
];

export const aggregationOptions = [
    "Don't summarize",
    "Count",
    "Distinct count",
    "Sum",
    "Average",
    "Percentage",
];

export const outputTypeOptions = [
    "Number",
    "Integer",
    "Decimal",
    "Currency",
    "Percentage",
    "Text",
    "Date",
    "Date & Time",
    "Boolean",
];

export const dateGroupOptions = [
    { id: "month", name: "By month" },
    { id: "date", name: "By date" },
];

export const cardColumnOptions = [
    { id: "1", name: "1 per row" },
    { id: "2", name: "2 per row" },
    { id: "3", name: "3 per row" },
    { id: "4", name: "4 per row" },
];

export const calculationTypeOptions = [
    { id: "row", name: "Row-level calculated field" },
    { id: "measure", name: "Measure" },
];

export const measureFunctionOptions = [
    "SUM",
    "AVERAGE",
    "MIN",
    "MAX",
    "COUNT",
    "COUNTA",
    "DISTINCTCOUNT",
];

export const reportFieldCatalogue: Array<ReportField> = [
    { id: "leadId", label: "Lead Number", type: "text" },
    { id: "studentName", label: "Student Name", type: "text" },
    { id: "phone", label: "Primary Phone", type: "text" },
    { id: "email", label: "Email", type: "text" },
    { id: "branchName", label: "Branch Name", type: "text" },
    { id: "applyingClass", label: "Applying Class", type: "text" },
    { id: "leadType", label: "Lead Type", type: "text" },
    { id: "stage", label: "Lead Stage", type: "text" },
    { id: "status", label: "Lead Status", type: "text" },
    { id: "source", label: "Lead Source", type: "text" },
    { id: "channel", label: "Channel", type: "text" },
    { id: "campaign", label: "Campaign", type: "text" },
    { id: "owner", label: "Lead Owner", type: "text" },
    { id: "city", label: "City", type: "text" },
    { id: "isParent", label: "Is Parent", type: "boolean" },
    { id: "score", label: "Lead Score", type: "number" },
    { id: "remarksCount", label: "Remarks Count", type: "number" },
    { id: "latitude", label: "Latitude", type: "number" },
    { id: "longitude", label: "Longitude", type: "number" },
    { id: "addedAt", label: "Added", type: "date" },
    { id: "updatedAt", label: "Updated", type: "date" },
    { id: "nextFollowup", label: "Next Follow-up", type: "date" },
];

export const reportFieldAliases: Record<string, string> = {
    branch: "branchName",
    branch_id: "branchName",
    branch_name: "branchName",
    class: "applyingClass",
    class_id: "applyingClass",
    student_name: "studentName",
    lead_id: "leadId",
    lead_number: "leadId",
    lead_score: "score",
    created_at: "addedAt",
    createdAt: "addedAt",
    added_at: "addedAt",
    followupAt: "nextFollowup",
    next_followup_at: "nextFollowup",
    stage_id: "stage",
    source_id: "source",
    campaign_id: "campaign",
    channel_id: "channel",
    owner_employee_id: "owner",
};

export const canonicalReportFieldId = (id: string) => reportFieldAliases[id] || id;

export const reportDateFieldOptions = reportFieldCatalogue
    .filter(field => field.type === "date" || field.type === "datetime")
    .map(field => ({ id: field.id, name: field.label }));

export function filterOperators(type: string | undefined): Array<[string, string]> {
    if (type === "date" || type === "datetime") {
        return [
            ["equals", "On"],
            ["before", "Before"],
            ["after", "After"],
            ["is_blank", "Is blank"],
            ["is_not_blank", "Is not blank"],
        ];
    }

    if (type === "number") {
        return [
            ["equals", "Equals"],
            ["not_equals", "Does not equal"],
            ["greater_than", "Greater than"],
            ["less_than", "Less than"],
            ["is_blank", "Is blank"],
            ["is_not_blank", "Is not blank"],
        ];
    }

    return [
        ["equals", "Equals"],
        ["not_equals", "Does not equal"],
        ["contains", "Contains"],
        ["not_contains", "Does not contain"],
        ["is_blank", "Is blank"],
        ["is_not_blank", "Is not blank"],
    ];
}

export function conditionOperators(type: string | undefined): Array<[string, string]> {
    const normalized = String(type || "text").toLowerCase();

    if (["number", "currency", "decimal", "integer", "percentage"].includes(normalized)) {
        return [
            ["in", "Include"],
            ["not_in", "Exclude"],
            ["equals", "Equals"],
            ["not_equals", "Not equals"],
            ["greater_than", "Greater than"],
            ["greater_equal", "Greater than or equal"],
            ["less_than", "Less than"],
            ["less_equal", "Less than or equal"],
            ["is_blank", "Is blank"],
            ["is_not_blank", "Is not blank"],
        ];
    }

    if (["date", "datetime", "date & time"].includes(normalized)) {
        return [
            ["in", "Include"],
            ["not_in", "Exclude"],
            ["equals", "On"],
            ["before", "Before"],
            ["after", "After"],
            ["on_or_before", "On or before"],
            ["on_or_after", "On or after"],
            ["today", "Today"],
            ["yesterday", "Yesterday"],
            ["last_x_days", "Last X days"],
            ["is_blank", "Is blank"],
            ["is_not_blank", "Is not blank"],
        ];
    }

    if (normalized === "boolean") {
        return [
            ["in", "Include"],
            ["not_in", "Exclude"],
            ["equals", "Is"],
            ["not_equals", "Is not"],
            ["is_blank", "Is blank"],
            ["is_not_blank", "Is not blank"],
        ];
    }

    return [
        ["in", "Include"],
        ["not_in", "Exclude"],
        ["equals", "Equals"],
        ["not_equals", "Not equals"],
        ["contains", "Contains"],
        ["not_contains", "Does not contain"],
        ["starts_with", "Starts with"],
        ["ends_with", "Ends with"],
        ["is_blank", "Is blank"],
        ["is_not_blank", "Is not blank"],
    ];
}

export function leadFieldValue(lead: ReportRecord, fieldId: string): ReportValue {
    if (!lead) {
        return undefined;
    }

    const mapped = canonicalReportFieldId(fieldId);

    if (Object.prototype.hasOwnProperty.call(lead, mapped)) {
        return lead[mapped];
    }

    if (Object.prototype.hasOwnProperty.call(lead, fieldId)) {
        return lead[fieldId];
    }

    const camel = String(fieldId).replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
    return lead[camel];
}

export const normalizedFilterText = (value: ReportValue) =>
    String(value ?? "").normalize("NFKC").trim().toLocaleLowerCase();

export function reportFieldCatalog(report: Partial<ReportDefinition>): Array<ReportField> {
    const fields = report.fieldCatalog?.length ? report.fieldCatalog : reportFieldCatalogue;
    return [...new Map(fields.map(field => [canonicalReportFieldId(field.id), field])).values()];
}

export function displayFieldValue(
    lead: ReportRecord,
    fieldId: string,
    report: Partial<ReportDefinition>,
    dateGrouping = "month"
): string {
    const value = leadFieldValue(lead, fieldId);

    if (value === null || value === undefined || value === "") {
        return "Blank";
    }

    const fieldType = reportFieldCatalog(report || {}).find(field => field.id === fieldId)?.type;

    if (fieldType === "date" || fieldType === "datetime") {
        const date = new Date(value as DateLike);
        if (Number.isNaN(date.getTime())) {
            return "Blank";
        }
        return dateGrouping === "date"
            ? date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
            : date.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    }

    return String(value);
}

function numericFieldValue(lead: ReportRecord, fieldId: string, report: Partial<ReportDefinition>): number {
    const calculated = (report.calculatedFields || []).find(item => item.id === fieldId);

    if (!calculated) {
        return Number(leadFieldValue(lead, fieldId)) || 0;
    }

    try {
        return (
            Number(
                evaluateFormula(calculated.formula, {
                    record: lead,
                    rows: [lead],
                    fields: reportFieldCatalog(report),
                    calculatedFields: report.calculatedFields || [],
                    getFieldValue: leadFieldValue,
                    stack: [calculated.id],
                })
            ) || 0
        );
    } catch {
        return 0;
    }
}

export function aggregateLeads(
    items: Array<ReportRecord>,
    measure: ReportMeasure | undefined,
    report: Partial<ReportDefinition>,
    grandTotal: number
): number | Array<ReportValue> {
    const aggregation = measure?.aggregation || "Count";
    const field = measure?.field || "leadId";

    if (aggregation === "Don't summarize") {
        const values = items
            .map(item => leadFieldValue(item, field))
            .filter(value => value !== null && value !== undefined && value !== "");

        return [
            ...new Map(
                values.map(value => [
                    value instanceof Date ? value.toISOString() : String(value),
                    value,
                ])
            ).values(),
        ];
    }

    const calculated = (report.calculatedFields || []).find(item => item.id === field);

    if (calculated?.calculationType === "measure") {
        try {
            return (
                Number(
                    evaluateFormula(calculated.formula, {
                        rows: items,
                        record: items[0],
                        fields: reportFieldCatalog(report),
                        calculatedFields: report.calculatedFields || [],
                        getFieldValue: leadFieldValue,
                        stack: [calculated.id],
                    })
                ) || 0
            );
        } catch {
            return 0;
        }
    }

    if (aggregation === "Count") return items.length;
    if (aggregation === "Distinct count") {
        return new Set(items.map(item => displayFieldValue(item, field, report))).size;
    }
    if (aggregation === "Percentage") {
        return grandTotal ? (items.length / grandTotal) * 100 : 0;
    }

    const numbers = items.map(item => numericFieldValue(item, field, report));

    if (aggregation === "Average") {
        return numbers.length ? numbers.reduce((sum, value) => sum + value, 0) / numbers.length : 0;
    }

    return numbers.reduce((sum, value) => sum + value, 0);
}

export function reportMeasureFormat(
    report: Partial<ReportDefinition> | undefined,
    measure: ReportMeasure | undefined = report?.values?.[0]
): ReportValueFormat {
    const calculated = (report?.calculatedFields || []).find(item => item.id === measure?.field);

    return {
        outputType:
            measure?.outputType ||
            calculated?.outputType ||
            (measure?.aggregation === "Percentage" ? "Percentage" : "Number"),
        percentageIsWhole: !calculated && measure?.aggregation === "Percentage",
    };
}

export function formatReportValue(value: ReportValue, format: ReportValueFormat = {}): string {
    if (Array.isArray(value)) {
        return value.length ? value.map(item => formatReportValue(item, format)).join(", ") : "Blank";
    }

    const numeric = Number(value);

    if (format.outputType === "Percentage") {
        return new Intl.NumberFormat("en-IN", {
            style: "percent",
            maximumFractionDigits: 2,
        }).format((Number.isFinite(numeric) ? numeric : 0) / (format.percentageIsWhole ? 100 : 1));
    }

    if (format.outputType === "Currency") {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(Number.isFinite(numeric) ? numeric : 0);
    }

    if (format.outputType === "Integer") {
        return Math.round(Number.isFinite(numeric) ? numeric : 0).toLocaleString("en-IN");
    }

    if (format.outputType === "Boolean") {
        return value ? "True" : "False";
    }

    if (["Date", "Date & Time"].includes(String(format.outputType))) {
        const date = new Date(value as DateLike);
        return Number.isNaN(date.getTime())
            ? "Blank"
            : date.toLocaleString(
                "en-IN",
                format.outputType === "Date"
                    ? { dateStyle: "medium" }
                    : { dateStyle: "medium", timeStyle: "short" }
            );
    }

    return Number.isFinite(numeric)
        ? Number(numeric.toFixed(2)).toLocaleString("en-IN")
        : String(value ?? "Blank");
}

export function buildPivotData(leads: Array<ReportRecord>, report: Partial<ReportDefinition>): PivotData {
    const rowFields = report.rows || [];
    const columnFields = report.columns || [];
    const measures: Array<ReportMeasure> = report.values?.length
        ? report.values
        : [{ field: "leadId", aggregation: "Count" }];

    const columnParts = (lead: ReportRecord) =>
        columnFields.map((field, index) =>
            displayFieldValue(lead, field, report, report.dateGroups?.[`columns:${index}`] || "month")
        );
    const columnLabel = (lead: ReportRecord) => columnParts(lead).join(" / ");

    const columnPaths = columnFields.length
        ? [...new Map(leads.map(lead => [columnLabel(lead), columnParts(lead)])).values()]
        : [["Value"]];
    const columnNames = columnPaths.map(path => path.join(" / "));

    const makeRow = (
        rowName: string,
        rowLeads: Array<ReportRecord>,
        level: number,
        path: string,
        index: number
    ): PivotRow => {
        const measureCells = measures.map(currentMeasure =>
            columnNames.map(columnName =>
                aggregateLeads(
                    columnFields.length
                        ? rowLeads.filter(lead => columnLabel(lead) === columnName)
                        : rowLeads,
                    currentMeasure,
                    report,
                    leads.length
                )
            )
        );

        const cells = measureCells[0];
        const nextField = rowFields[level + 1];
        const nextDateGrouping = report.dateGroups?.[`rows:${level + 1}`] || "month";
        const childNames = nextField
            ? [...new Set(rowLeads.map(lead => displayFieldValue(lead, nextField, report, nextDateGrouping)))]
            : [];

        return {
            label: rowName,
            level,
            path,
            cells,
            measureCells,
            measureTotals: measures.map(currentMeasure =>
                aggregateLeads(rowLeads, currentMeasure, report, leads.length)
            ),
            total: cells.reduce(
                (sum: number, value) => sum + (Number.isFinite(Number(value)) ? Number(value) : 0),
                0
            ),
            color: reportPalette[index % reportPalette.length],
            children: childNames.map((childName, childIndex) =>
                makeRow(
                    childName,
                    rowLeads.filter(
                        lead => displayFieldValue(lead, nextField, report, nextDateGrouping) === childName
                    ),
                    level + 1,
                    `${path}/${childName}`,
                    childIndex
                )
            ),
        };
    };

    const firstField = rowFields[0];
    const firstDateGrouping = report.dateGroups?.["rows:0"] || "month";
    const rowNames = firstField
        ? [...new Set(leads.map(lead => displayFieldValue(lead, firstField, report, firstDateGrouping)))]
        : ["All leads"];

    const rows = rowNames.map((rowName, index) =>
        makeRow(
            rowName,
            firstField
                ? leads.filter(
                    lead => displayFieldValue(lead, firstField, report, firstDateGrouping) === rowName
                )
                : leads,
            0,
            rowName,
            index
        )
    );

    const measureDefinitions: Array<PivotMeasureDefinition> = measures.map(currentMeasure => ({
        field: currentMeasure.field,
        aggregation: currentMeasure.aggregation,
        label:
            currentMeasure.label?.trim() ||
            reportFieldCatalog(report).find(field => field.id === currentMeasure.field)?.label ||
            (report.calculatedFields || []).find(field => field.id === currentMeasure.field)?.name ||
            currentMeasure.field,
        valueFormat: reportMeasureFormat(report, currentMeasure),
    }));

    const grandMeasureCells = measures.map(currentMeasure =>
        columnNames.map(columnName =>
            aggregateLeads(
                columnFields.length ? leads.filter(lead => columnLabel(lead) === columnName) : leads,
                currentMeasure,
                report,
                leads.length
            )
        )
    );

    return {
        rows,
        columnNames,
        measures: measureDefinitions,
        grandMeasureCells,
        grandTotals: measures.map(currentMeasure =>
            aggregateLeads(leads, currentMeasure, report, leads.length)
        ),
        recordCount: leads.length,
        funnel: rows.map((row, index) => ({
            label: row.label,
            value: Number(row.measureTotals[0]) || 0,
            color: reportPalette[index % reportPalette.length],
        })),
    };
}

export function filterReportLeads(
    leads: Array<ReportRecord>,
    report: Partial<ReportDefinition>
): Array<ReportRecord> {
    return leads.filter(lead => {
        const stageMatches = !report.stages?.length || report.stages.includes(String(lead.stage));

        const reportDateValue = leadFieldValue(lead, report.dateField || "addedAt");
        const reportDate = new Date(reportDateValue as DateLike);
        const dateMatches =
            (!report.dateFrom ||
                (!Number.isNaN(reportDate.getTime()) &&
                    String(reportDateValue).slice(0, 10) >= report.dateFrom)) &&
            (!report.dateTo ||
                (!Number.isNaN(reportDate.getTime()) &&
                    String(reportDateValue).slice(0, 10) <= report.dateTo));

        const dynamicMatches = (report.filters || []).every(filter => {
            const raw = leadFieldValue(lead, filter.field);
            const actual = raw === null || raw === undefined ? "" : raw;

            const expectedValues = Array.isArray(filter.value)
                ? filter.value
                : filter.value === "" || filter.value === undefined
                    ? []
                    : [filter.value];

            const operator = String(filter.operator || "equals").toLowerCase().replace(/\s+/g, "_");

            const compare = (expected: ReportValue) => {
                if (operator === "contains") {
                    return normalizedFilterText(actual).includes(normalizedFilterText(expected));
                }
                if (operator === "not_contains") {
                    return !normalizedFilterText(actual).includes(normalizedFilterText(expected));
                }
                if (operator === "not_equals") {
                    return normalizedFilterText(actual) !== normalizedFilterText(expected);
                }
                if (operator === "greater_than") return Number(actual) > Number(expected);
                if (operator === "less_than") return Number(actual) < Number(expected);
                if (operator === "before") {
                    return new Date(actual as DateLike) < new Date(expected as DateLike);
                }
                if (operator === "after") {
                    return new Date(actual as DateLike) > new Date(expected as DateLike);
                }
                if ((filter.type === "date" || filter.type === "datetime") && operator === "equals") {
                    return String(actual).slice(0, 10) === String(expected).slice(0, 10);
                }
                return normalizedFilterText(actual) === normalizedFilterText(expected);
            };

            if (operator === "is_blank") return normalizedFilterText(actual) === "";
            if (operator === "is_not_blank") return normalizedFilterText(actual) !== "";
            if (!expectedValues.length) return true;

            return ["not_equals", "not_contains"].includes(operator)
                ? expectedValues.every(compare)
                : expectedValues.some(compare);
        });

        return stageMatches && dateMatches && dynamicMatches;
    });
}

export function buildLiveReportData(
    report: Partial<ReportDefinition>,
    leads: Array<ReportRecord> = []
): PivotData {
    return buildPivotData(filterReportLeads(Array.isArray(leads) ? leads : [], report), report);
}

const savedReportsKey = "crm_saved_reports";

export const savedReportsChangedEvent = "crm:saved-reports-changed";

export function readSavedReports(): Array<ReportDefinition> {
    try {
        const reports = JSON.parse(localStorage.getItem(savedReportsKey) || "[]");
        return Array.isArray(reports)
            ? reports.filter(report => report.generatedAt && report.generatedData)
            : [];
    } catch {
        return [];
    }
}

export function writeSavedReports(reports: Array<ReportDefinition>) {
    localStorage.setItem(savedReportsKey, JSON.stringify(reports));
    window.dispatchEvent(new CustomEvent(savedReportsChangedEvent));
}

export function currentCrmUser(): SavedReportUser | null {
    try {
        return JSON.parse(localStorage.getItem("crm_user") || "null");
    } catch {
        return null;
    }
}

export function canViewSavedReport(
    report: Partial<ReportDefinition>,
    user: SavedReportUser | null = currentCrmUser()
) {
    if (!user?.id) {
        return true;
    }

    const createdBy = report.createdByUserId;
    const visibleTo = Array.isArray(report.visibleToUserIds)
        ? report.visibleToUserIds.map(String)
        : [];

    if (!visibleTo.length && !createdBy) {
        return true;
    }

    return String(createdBy) === String(user.id) || visibleTo.includes(String(user.id));
}

export const reportDataSources: Array<ReportDataSource> = [
    {
        id: "reporting_admissions",
        sourceName: "reporting_admissions",
        displayName: "Admissions Summary",
        sourceType: "VIEW",
    },
    {
        id: "reporting_followups",
        sourceName: "reporting_followups",
        displayName: "Follow-up Activity",
        sourceType: "TABLE",
    },
];

export const savedReportUsers: Array<SavedReportUser> = [
    {
        id: "u1",
        name: "SRIKANTH KUNCHALA",
        email: "srikanth.kunchala@dps.edu.in",
        role: "CRM Administrator",
    },
    {
        id: "u2",
        name: "MOHAMMED TAUFEEQ AHMED",
        email: "taufeeq.ahmed@dps.edu.in",
        role: "Branch Manager",
    },
    {
        id: "u3",
        name: "MADHURI CHENNA",
        email: "madhuri.chenna@dps.edu.in",
        role: "Counsellor",
    },
    {
        id: "u5",
        name: "Sneha Kulkarni",
        email: "sneha.kulkarni@dps.edu.in",
        role: "Viewer",
    },
];

const sampleBranches = [
    { name: "Nacharam", city: "Hyderabad", latitude: 17.4326, longitude: 78.5583 },
    { name: "Secunderabad", city: "Secunderabad", latitude: 17.4399, longitude: 78.4983 },
    { name: "Mahendra Hills", city: "Secunderabad", latitude: 17.4603, longitude: 78.5117 },
    { name: "Khajaguda", city: "Hyderabad", latitude: 17.4126, longitude: 78.3562 },
    { name: "Miyapur", city: "Hyderabad", latitude: 17.4948, longitude: 78.3578 },
    { name: "Kompally", city: "Hyderabad", latitude: 17.5384, longitude: 78.4867 },
];

const sampleStages = [
    "Untouched",
    "Contacted",
    "Counselling",
    "Campus Visit",
    "Application",
    "Admitted",
];
const sampleSources = ["Meta Ads", "Google Sheets", "Walk-in", "Referral", "Website", "Telecall"];
const sampleChannels = ["Digital", "Offline", "Referral"];
const sampleCampaigns = [
    "Admissions 2026-27",
    "Open House",
    "Transport Drive",
    "Re-enrolment",
];
const sampleOwners = [
    "SRIKANTH KUNCHALA",
    "MADHURI CHENNA",
    "PRIYA NAIR",
    "RAVI TEJA",
    "Unassigned",
];
const sampleClasses = ["Nursery", "Class I", "Class IV", "Class V", "Class VIII", "Class X"];
const sampleTypes = ["New Admission", "Transfer", "Re-enrolment"];
const sampleNames = [
    "Aarav Menon", "Ishita Kumar", "Kabir Varma", "Zoya Sheikh", "Vihaan Rao",
    "Anaya Reddy", "Arjun Nair", "Diya Sharma", "Reyansh Gupta", "Myra Iyer",
    "Advik Bose", "Saanvi Pillai", "Vivaan Chandra", "Aadhya Menon", "Kiara Joshi",
    "Rudra Patel", "Navya Rao", "Ayaan Khan", "Prisha Das", "Shaurya Malhotra",
    "Anika Verma", "Ishaan Kapoor", "Tara Bhatt", "Devansh Mishra", "Riya Saxena",
    "Atharv Kulkarni", "Meera Nambiar", "Kabir Sethi", "Ira Chatterjee", "Yuvan Raghavan",
];

export const reportLeads: Array<ReportLead> = sampleNames.map((name, index) => {
    const branch = sampleBranches[index % sampleBranches.length];
    const addedDay = ((index * 3) % 27) + 1;
    const addedMonth = index % 2 === 0 ? "07" : "08";

    return {
        leadId: `LD-${String(1001 + index)}`,
        studentName: name,
        phone: `98${String(48000000 + index * 1379).slice(0, 8)}`,
        email: `${name.split(" ")[0].toLowerCase()}.${index}@example.in`,
        branchName: branch.name,
        applyingClass: sampleClasses[index % sampleClasses.length],
        leadType: sampleTypes[index % sampleTypes.length],
        source: sampleSources[index % sampleSources.length],
        campaign: sampleCampaigns[index % sampleCampaigns.length],
        channel: sampleChannels[index % sampleChannels.length],
        stage: sampleStages[index % sampleStages.length],
        status: index % 3 === 0 ? "Untouched" : "Touched",
        owner: sampleOwners[index % sampleOwners.length],
        city: branch.city,
        score: 40 + ((index * 7) % 60),
        remarksCount: (index * 2) % 9,
        isParent: index % 4 === 0,
        addedAt: `2026-${addedMonth}-${String(addedDay).padStart(2, "0")}`,
        updatedAt: `2026-08-${String(((index * 2) % 13) + 1).padStart(2, "0")}`,
        nextFollowup: index % 5 === 0 ? "" : `2026-09-${String((index % 27) + 1).padStart(2, "0")}`,
        latitude: branch.latitude,
        longitude: branch.longitude,
    };
});

export const reportSourceRows: Record<string, Array<ReportRecord>> = {
    reporting_admissions: reportLeads
        .filter(lead => ["Application", "Admitted"].includes(lead.stage))
        .map(lead => ({
            leadId: lead.leadId,
            studentName: lead.studentName,
            branchName: lead.branchName,
            applyingClass: lead.applyingClass,
            stage: lead.stage,
            score: lead.score,
            addedAt: lead.addedAt,
        })),
    reporting_followups: reportLeads
        .filter(lead => lead.nextFollowup)
        .map(lead => ({
            leadId: lead.leadId,
            studentName: lead.studentName,
            branchName: lead.branchName,
            owner: lead.owner,
            nextFollowup: lead.nextFollowup,
            remarksCount: lead.remarksCount,
        })),
};

export const reportSourceFields: Record<string, Array<ReportField>> = {
    reporting_admissions: [
        { id: "leadId", label: "Lead Number", type: "text" },
        { id: "studentName", label: "Student Name", type: "text" },
        { id: "branchName", label: "Branch Name", type: "text" },
        { id: "applyingClass", label: "Applying Class", type: "text" },
        { id: "stage", label: "Lead Stage", type: "text" },
        { id: "score", label: "Lead Score", type: "number" },
        { id: "addedAt", label: "Added", type: "date" },
    ],
    reporting_followups: [
        { id: "leadId", label: "Lead Number", type: "text" },
        { id: "studentName", label: "Student Name", type: "text" },
        { id: "branchName", label: "Branch Name", type: "text" },
        { id: "owner", label: "Lead Owner", type: "text" },
        { id: "nextFollowup", label: "Next Follow-up", type: "date" },
        { id: "remarksCount", label: "Remarks Count", type: "number" },
    ],
};

export function emptyReport(fieldCatalog: Array<ReportField>): ReportDefinition {
    return {
        type: "",
        title: "Untitled report",
        description: "",
        dataSourceId: "leads",
        dateField: "addedAt",
        dateFrom: "",
        dateTo: "",
        stages: [],
        filters: [],
        rows: [],
        columns: [],
        values: [],
        dateGroups: {},
        calculatedFields: [],
        fieldCatalog,
        cardColumns: 4,
        showLabels: true,
        showRowTotals: true,
        showColumnTotals: false,
    };
}

export const sampleReportData: PivotData = {
    rows: [],
    columnNames: ["Value"],
    measures: [
        { field: "leadId", aggregation: "Count", label: "Lead Number", valueFormat: { outputType: "Integer" } },
    ],
    grandMeasureCells: [[]],
    grandTotals: [97],
    recordCount: 97,
    funnel: [
        { label: "New", value: 42, color: reportPalette[0] },
        { label: "Contacted", value: 28, color: reportPalette[1] },
        { label: "Counselling", value: 18, color: reportPalette[2] },
        { label: "Campus Visit", value: 9, color: reportPalette[3] },
    ],
};

export const formatDateTime = (value: string | undefined | null) =>
    value
        ? new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })
        : "—";

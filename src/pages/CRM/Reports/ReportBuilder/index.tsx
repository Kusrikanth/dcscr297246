import { useMemo, useState } from "react";
import { toast } from "react-toastify";

import {
    Button,
    ConfirmationModal,
    DateInput,
    ModalContainerUpdated,
    MultiSelect,
    SelectInput,
    Switch,
    TextInput,
} from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";

import { detectCircularDependency } from "../calculationengine";
import {
    aggregationOptions,
    buildPivotData,
    cardColumnOptions,
    canonicalReportFieldId,
    dateGroupOptions,
    emptyReport,
    filterOperators,
    filterReportLeads,
    leadFieldValue,
    outputTypeOptions,
    reportDataSources,
    reportDateFieldOptions,
    reportFieldCatalogue,
    reportLeads,
    reportSourceFields,
    reportSourceRows,
    reportTypes,
    sampleReportData,
    type CalculatedField,
    type FieldChangeEvent,
    type PivotData,
    type ReportDefinition,
    type ReportField,
    type ReportFilter,
    type ReportMeasure,
    type ReportRecord,
} from "../helper";
import ReportVisual from "../ReportVisual";
import CalculatedFieldModal from "./CalculatedFieldModal";
import { emptyCalculatedField } from "./calculatedfieldhelper";
import FieldPickerModal from "./FieldPickerModal";
import ReportVisibilityModal from "./ReportVisibilityModal";

interface ReportBuilderProps {
    initialReport?: ReportDefinition;
    onBack: () => void;
    onSave: (report: ReportDefinition, visibleToUserIds: Array<string>) => void;
    onDelete: (report: ReportDefinition) => void;
}

type Shelf = "rows" | "columns" | "values";

type ShelfItem = string | ReportMeasure;

const shelfLabels: Record<Shelf, string> = {
    rows: "Rows",
    columns: "Columns",
    values: "Values / Measures",
};

const ReportBuilder = ({ initialReport, onBack, onSave, onDelete }: ReportBuilderProps) => {
    const [activeSourceId, setActiveSourceId] = useState(
        String(initialReport?.dataSourceId || "leads")
    );

    const sourceRows = useMemo<Array<ReportRecord>>(
        () => (activeSourceId === "leads" ? reportLeads : reportSourceRows[activeSourceId] || []),
        [activeSourceId]
    );

    const configuredFields = useMemo<Array<ReportField>>(
        () =>
            activeSourceId === "leads"
                ? reportFieldCatalogue
                : reportSourceFields[activeSourceId] || [],
        [activeSourceId]
    );

    const [report, setReport] = useState<ReportDefinition>(
        () => initialReport || emptyReport(configuredFields)
    );

    const [generatedReport, setGeneratedReport] = useState<ReportDefinition | null>(
        initialReport || null
    );
    const [generatedData, setGeneratedData] = useState<PivotData | null>(
        initialReport?.generatedData || null
    );

    const [calculated, setCalculated] = useState<CalculatedField>(emptyCalculatedField);
    const [pickerShelf, setPickerShelf] = useState<Shelf | "filters" | null>(null);

    const {
        openModal: calculatedOpenModal,
        closeModal: calculatedCloseModal,
        modalState: calculatedModalState,
    } = useModal();

    const {
        openModal: visibilityOpenModal,
        closeModal: visibilityCloseModal,
        modalState: visibilityModalState,
    } = useModal();

    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const patch = (values: Partial<ReportDefinition>) => {
        setReport(current => ({ ...current, ...values }));

        if (Object.keys(values).some(key => !["title", "description"].includes(key))) {
            setGeneratedReport(null);
            setGeneratedData(null);
        }
    };

    const allFields = useMemo<Array<ReportField>>(
        () => [
            ...configuredFields,
            ...(report.calculatedFields || []).map(item => ({
                id: item.id,
                label: item.name,
                type: "calculated" as const,
            })),
        ],
        [configuredFields, report.calculatedFields]
    );

    const fieldLabel = (id: string) =>
        allFields.find(field => field.id === canonicalReportFieldId(id))?.label || id;

    const defaultValueOutputType = (fieldId: string, aggregation = "Count") => {
        if (["Count", "Distinct count"].includes(aggregation)) return "Integer";
        if (aggregation === "Percentage") return "Percentage";

        const calculatedField = (report.calculatedFields || []).find(item => item.id === fieldId);
        if (calculatedField?.outputType) return calculatedField.outputType;

        const type = String(
            configuredFields.find(item => item.id === canonicalReportFieldId(fieldId))?.type || "number"
        ).toLowerCase();

        if (type === "boolean") return "Boolean";
        if (type === "date") return "Date";
        if (type === "datetime") return "Date & Time";
        if (type === "text" && !["Sum", "Average"].includes(aggregation)) return "Text";

        return "Number";
    };

    function chooseDataSourceHndlr(event: FieldChangeEvent) {
        const nextId = String(event.target.value || "leads");

        setActiveSourceId(nextId);
        setReport(current => ({
            ...current,
            dataSourceId: nextId,
            rows: [],
            columns: [],
            values: [],
            filters: [],
            dateField: nextId === "leads" ? "addedAt" : "",
            fieldCatalog: nextId === "leads" ? reportFieldCatalogue : reportSourceFields[nextId] || [],
        }));
        setGeneratedReport(null);
        setGeneratedData(null);
    }

    function addFieldHndlr(shelf: Shelf, fieldId: string) {
        const field = canonicalReportFieldId(fieldId);

        if (shelf === "values") {
            patch({
                values: [
                    ...(report.values || []),
                    {
                        field,
                        aggregation: "Count",
                        outputType: defaultValueOutputType(field, "Count"),
                    },
                ],
            });
            return;
        }

        if (!(report[shelf] || []).includes(field)) {
            patch({ [shelf]: [...(report[shelf] || []), field] });
        }
    }

    function removeFieldHndlr(shelf: Shelf, index: number) {
        const nextItems = (report[shelf] as Array<ShelfItem>).filter((_, itemIndex) => itemIndex !== index);
        const nextGroups = { ...(report.dateGroups || {}) };

        delete nextGroups[`${shelf}:${index}`];

        for (let itemIndex = index + 1; itemIndex <= nextItems.length; itemIndex += 1) {
            const previous = nextGroups[`${shelf}:${itemIndex}`];
            delete nextGroups[`${shelf}:${itemIndex}`];
            if (previous) {
                nextGroups[`${shelf}:${itemIndex - 1}`] = previous;
            }
        }

        patch({ [shelf]: nextItems, dateGroups: nextGroups });
    }

    function moveFieldHndlr(shelf: Shelf, fromIndex: number, toIndex: number) {
        const currentItems = [...(report[shelf] as Array<ShelfItem>)];

        if (toIndex < 0 || toIndex >= currentItems.length || fromIndex === toIndex) {
            return;
        }

        const [item] = currentItems.splice(fromIndex, 1);
        currentItems.splice(toIndex, 0, item);

        const nextGroups: Record<string, string> = Object.fromEntries(
            Object.entries(report.dateGroups || {}).filter(([key]) => !key.startsWith(`${shelf}:`))
        );

        currentItems.forEach((_, nextIndex) => {
            const previousIndex =
                nextIndex === toIndex
                    ? fromIndex
                    : fromIndex < toIndex && nextIndex >= fromIndex && nextIndex < toIndex
                        ? nextIndex + 1
                        : fromIndex > toIndex && nextIndex > toIndex && nextIndex <= fromIndex
                            ? nextIndex - 1
                            : nextIndex;

            const value = report.dateGroups?.[`${shelf}:${previousIndex}`];
            if (value) {
                nextGroups[`${shelf}:${nextIndex}`] = value;
            }
        });

        patch({ [shelf]: currentItems, dateGroups: nextGroups });
    }

    function addFilterHndlr(fieldId: string) {
        const field = canonicalReportFieldId(fieldId);
        const definition = configuredFields.find(item => item.id === field);

        patch({
            filters: [
                ...(report.filters || []),
                {
                    id: `filter_${(report.filters || []).length + 1}_${field}`,
                    field,
                    operator: "equals",
                    value: [],
                    type: definition?.type || "text",
                },
            ],
        });
    }

    const updateFilter = (index: number, values: Partial<ReportFilter>) =>
        patch({
            filters: (report.filters || []).map((filter, filterIndex) =>
                filterIndex === index ? { ...filter, ...values } : filter
            ),
        });

    function saveCalculatedHndlr(validation: { dependencies: Array<string> }) {
        const field: CalculatedField = {
            ...calculated,
            id: calculated.id || `calc_${(report.calculatedFields || []).length + 1}`,
            name: calculated.name.trim(),
            formula: calculated.formula.trim(),
            dependencies: validation.dependencies,
        };

        const cycle = detectCircularDependency(field, report.calculatedFields || []);
        if (cycle) {
            toast.error(`Circular dependency detected: ${cycle.join(" → ")}`);
            return;
        }

        const isEditing = (report.calculatedFields || []).some(item => item.id === field.id);

        const calculatedFields = isEditing
            ? (report.calculatedFields || []).map(item => (item.id === field.id ? field : item))
            : [...(report.calculatedFields || []), field];

        const values = isEditing
            ? (report.values || []).map(item =>
                item.field === field.id
                    ? {
                        ...item,
                        aggregation:
                            field.calculationType === "measure"
                                ? "Measure"
                                : item.aggregation === "Measure"
                                    ? "Sum"
                                    : item.aggregation,
                        outputType: item.outputTypeCustomized
                            ? item.outputType
                            : field.outputType || item.outputType || "Number",
                    }
                    : item
            )
            : [
                ...(report.values || []),
                {
                    field: field.id,
                    aggregation: field.calculationType === "measure" ? "Measure" : "Sum",
                    outputType: field.outputType || "Number",
                    outputTypeCustomized: false,
                },
            ];

        patch({ calculatedFields, values });
        setCalculated(emptyCalculatedField());
        calculatedCloseModal();
        toast.success(isEditing ? "Calculated field updated" : "Calculated field added");
    }

    function editCalculatedFieldHndlr(fieldId: string) {
        const field = (report.calculatedFields || []).find(item => item.id === fieldId);
        if (!field) {
            return;
        }

        setCalculated({ ...field, conditions: field.conditions });
        calculatedOpenModal(field.id);
    }

    const canGenerate =
        !!report.values?.length && (!!report.rows?.length || !!report.columns?.length);

    function generateHndlr() {
        const snapshot: ReportDefinition = JSON.parse(JSON.stringify(report));

        if (!snapshot.type) {
            snapshot.type = "table";
        }

        snapshot.fieldCatalog = configuredFields;
        snapshot.generatedAt = new Date().toISOString();

        const filteredLeads = filterReportLeads(sourceRows, snapshot);

        setGeneratedReport(snapshot);
        setGeneratedData(buildPivotData(filteredLeads, snapshot));
        toast.success(`Report generated from ${filteredLeads.length.toLocaleString()} records`);
    }

    function saveHndlr() {
        if (!generatedReport || !generatedData) {
            return;
        }
        visibilityOpenModal(report.visibleToUserIds || []);
    }

    const selectedType = reportTypes.find(type => type.id === report.type);

    const previewReport = selectedType
        ? {
            ...emptyReport(configuredFields),
            ...report,
            title: `${selectedType.label} preview`,
            rows: report.rows?.length ? report.rows : ["branchName"],
            values: report.values?.length
                ? report.values
                : [{ field: "leadId", aggregation: "Count" }],
            showLabels: true,
        }
        : null;

    const filteredLeadsForConditions = useMemo(
        () => filterReportLeads(sourceRows, report),
        [report, sourceRows]
    );

    return (
        <>
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="tw-card">
                        <div className="tw-card-header">
                            <Button
                                type="button"
                                variant="linkBtn" className="tw-mb-2 tw-px-0"
                                onClick={onBack}
                            >
                                <i className="ri-arrow-left-line tw-mr-1"></i>
                                Back to reports
                            </Button>

                            <div className="row">
                                <div className="col-12 col-lg-6">
                                    <TextInput
                                        name="title"
                                        labelText="Report Title"
                                        placeHolder="Untitled report"
                                        value={report.title}
                                        onChange={(event: FieldChangeEvent) =>
                                            patch({ title: event.target.value })
                                        }
                                        labelClass="required"
                                        maxLength={120}
                                    />
                                </div>

                                <div className="col-12 col-lg-6">
                                    <TextInput
                                        name="description"
                                        labelText="Description"
                                        placeHolder="Add a description"
                                        value={report.description}
                                        onChange={(event: FieldChangeEvent) =>
                                            patch({ description: event.target.value })
                                        }
                                        maxLength={200}
                                    />
                                </div>
                            </div>

                            <label className="form-label">Visual</label>
                            <div className="tw-mb-3 tw-flex tw-flex-wrap tw-gap-2">
                                {reportTypes.map(type => (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        key={type.id}
                                        title={type.label}
                                        onClick={() => patch({ type: type.id })}
                                        className={`!tw-gap-1 tw-border !tw-px-2.5 !tw-py-1.5 !tw-text-xs ${report.type === type.id
                                            ? "tw-border-[#405189] !tw-bg-[#4051891a] tw-text-[#405189]"
                                            : "tw-border-gray-200 !tw-bg-transparent tw-text-gray-600 hover:!tw-bg-gray-50"
                                            }`}
                                    >
                                        <i className={`${type.icon} tw-text-sm`}></i>
                                        {type.label}
                                    </Button>
                                ))}
                            </div>

                            <div className="tw-flex tw-flex-wrap tw-gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={generateHndlr}
                                    disabled={!canGenerate}
                                >
                                    <i className="ri-bar-chart-2-line tw-mr-1"></i>
                                    Generate Report
                                </Button>

                                <Button
                                    type="button"
                                    variant="primary"
                                    onClick={saveHndlr}
                                    disabled={!generatedReport || !generatedData}
                                >
                                    <i className="ri-save-line tw-mr-1"></i>
                                    Save Report
                                </Button>
                            </div>

                            {!canGenerate && (
                                <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                                    Add at least one value and one row or column to generate.
                                </p>
                            )}
                        </div>

                        <div className="tw-card-body">
                            {generatedReport && generatedData ? (
                                <>
                                    <div className="tw-mb-3 tw-flex tw-items-start tw-justify-between tw-gap-2">
                                        <div>
                                            <h5 className="tw-mb-0 tw-text-base tw-font-semibold">
                                                {generatedReport.title || "Untitled report"}
                                            </h5>
                                            {generatedReport.description && (
                                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                    {generatedReport.description}
                                                </p>
                                            )}
                                        </div>

                                        <span className="tw-text-xs tw-text-gray-500">
                                            Generated preview ·{" "}
                                            {generatedData.recordCount.toLocaleString()} records
                                        </span>
                                    </div>

                                    <ReportVisual
                                        report={generatedReport}
                                        data={generatedData}
                                        leads={filterReportLeads(sourceRows, generatedReport)}
                                    />
                                </>
                            ) : selectedType ? (
                                <>
                                    <div className="tw-mb-3">
                                        <h5 className="tw-mb-0 tw-text-base tw-font-semibold">
                                            {selectedType.label} preview
                                        </h5>
                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                            Sample view only. Add fields and generate the report to see
                                            live data.
                                        </p>
                                    </div>

                                    <ReportVisual
                                        report={previewReport as ReportDefinition}
                                        data={sampleReportData}
                                        leads={sourceRows}
                                    />
                                </>
                            ) : (
                                <div className="tw-py-8 tw-text-center">
                                    <i className="ri-bar-chart-box-line tw-text-3xl tw-text-gray-300"></i>
                                    <h5 className="tw-mb-1 tw-mt-2 tw-text-base tw-font-semibold">
                                        Start creating your pivot report
                                    </h5>
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        Select a visual, add fields to Rows and Values, then generate
                                        the report.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-4">
                    <div className="tw-card">
                        <div className="tw-card-header">
                            <h4 className="tw-card-title tw-mb-0">Options &amp; filters</h4>
                        </div>

                        <div className="tw-card-body">
                            <SelectInput
                                name="dataSourceId"
                                labelText="Data Source"
                                hideSelectOption={true}
                                value={String(report.dataSourceId || "leads")}
                                onChange={chooseDataSourceHndlr}
                                menuItems={[
                                    { id: "leads", name: "CRM Leads (default)" },
                                    ...reportDataSources.map(source => ({
                                        id: source.id,
                                        name: `${source.displayName} · ${source.sourceType.toLowerCase()}`,
                                    })),
                                ]}
                                valueKey="id"
                                textKey="name"
                            />

                            <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                                {configuredFields.length.toLocaleString()} fields available ·{" "}
                                {sourceRows.length.toLocaleString()} rows
                            </p>

                            {(["rows", "columns", "values"] as Array<Shelf>).map(shelf => (
                                <div className="tw-mb-3" key={shelf}>
                                    <div className="tw-mb-1 tw-flex tw-items-center tw-justify-between">
                                        <label className="form-label tw-mb-0">
                                            {shelfLabels[shelf]}
                                        </label>

                                        <div className="tw-flex tw-gap-1">
                                            {shelf === "values" && (
                                                <Button
                                                    type="button"
                                                    variant="secondary"
                                                    title="Create calculated field"
                                                    onClick={() => {
                                                        setCalculated(emptyCalculatedField());
                                                        calculatedOpenModal();
                                                    }}
                                                >
                                                    <i className="ri-calculator-line"></i>
                                                </Button>
                                            )}

                                            <Button
                                                type="button"
                                                variant="soft"
                                                onClick={() => setPickerShelf(shelf)}
                                            >
                                                <i className="ri-add-fill tw-mr-1"></i>
                                                Add field
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="tw-rounded-lg tw-border tw-border-gray-200 tw-p-2">
                                        {!(report[shelf] as Array<ShelfItem>).length && (
                                            <p className="tw-mb-0 tw-text-xs tw-text-gray-400">
                                                No fields added.
                                            </p>
                                        )}

                                        {(report[shelf] as Array<ShelfItem>).map((item, index) => {
                                            const field: string =
                                                shelf === "values" ? (item as ReportMeasure).field : (item as string);
                                            const measure = shelf === "values" ? (item as ReportMeasure) : null;

                                            const definition = configuredFields.find(
                                                candidate => candidate.id === canonicalReportFieldId(field)
                                            );
                                            const calculatedDefinition = (report.calculatedFields || []).find(
                                                candidate => candidate.id === field
                                            );
                                            const isDateDimension =
                                                shelf !== "values" &&
                                                ["date", "datetime"].includes(String(definition?.type));

                                            return (
                                                <div
                                                    className="tw-mb-2 tw-rounded-md tw-bg-gray-50 tw-p-2"
                                                    key={`${field}-${index}`}
                                                >
                                                    <div className="tw-mb-1 tw-flex tw-items-center tw-justify-between tw-gap-1">
                                                        <span className="tw-truncate tw-text-sm">
                                                            {measure?.label || fieldLabel(field)}
                                                        </span>

                                                        <span className="tw-flex tw-shrink-0 tw-gap-1">
                                                            {calculatedDefinition && (
                                                                <Button
                                                                    type="button"
                                                                    variant="secondary"
                                                                    title="Edit formula"
                                                                    onClick={() => editCalculatedFieldHndlr(field)}
                                                                >
                                                                    <i className="ri-calculator-line"></i>
                                                                </Button>
                                                            )}

                                                            <Button
                                                                type="button"
                                                                variant="secondary"
                                                                disabled={index === 0}
                                                                title="Move up"
                                                                onClick={() =>
                                                                    moveFieldHndlr(shelf, index, index - 1)
                                                                }
                                                            >
                                                                <i className="ri-arrow-up-line"></i>
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                variant="secondary"
                                                                disabled={
                                                                    index === (report[shelf] as Array<ShelfItem>).length - 1
                                                                }
                                                                title="Move down"
                                                                onClick={() =>
                                                                    moveFieldHndlr(shelf, index, index + 1)
                                                                }
                                                            >
                                                                <i className="ri-arrow-down-line"></i>
                                                            </Button>

                                                            <Button
                                                                type="button"
                                                                variant="wrong"
                                                                title="Remove"
                                                                onClick={() => removeFieldHndlr(shelf, index)}
                                                            >
                                                                <i className="ri-close-line"></i>
                                                            </Button>
                                                        </span>
                                                    </div>

                                                    {measure && (
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <TextInput
                                                                    name={`alias-${shelf}-${index}`}
                                                                    placeHolder={`Label (defaults to ${fieldLabel(field)})`}
                                                                    value={measure.label || ""}
                                                                    onChange={(event: FieldChangeEvent) =>
                                                                        patch({
                                                                            values: report.values.map((value, valueIndex) =>
                                                                                valueIndex === index
                                                                                    ? {
                                                                                        ...value,
                                                                                        label: event.target.value || undefined,
                                                                                    }
                                                                                    : value
                                                                            ),
                                                                        })
                                                                    }
                                                                    formgroupClassName="tw-mb-2"
                                                                    maxLength={60}
                                                                />
                                                            </div>

                                                            <div className="col-6">
                                                                <SelectInput
                                                                    name={`aggregation-${index}`}
                                                                    hideSelectOption={true}
                                                                    isDisabled={
                                                                        calculatedDefinition?.calculationType === "measure"
                                                                    }
                                                                    value={measure.aggregation}
                                                                    onChange={(event: FieldChangeEvent) => {
                                                                        const aggregation = event.target.value;

                                                                        patch({
                                                                            values: report.values.map((value, valueIndex) =>
                                                                                valueIndex === index
                                                                                    ? {
                                                                                        ...value,
                                                                                        aggregation,
                                                                                        outputType: value.outputTypeCustomized
                                                                                            ? value.outputType
                                                                                            : defaultValueOutputType(
                                                                                                value.field,
                                                                                                aggregation
                                                                                            ),
                                                                                    }
                                                                                    : value
                                                                            ),
                                                                        });
                                                                    }}
                                                                    menuItems={[
                                                                        ...aggregationOptions,
                                                                        ...(measure.aggregation === "Measure"
                                                                            ? ["Measure"]
                                                                            : []),
                                                                    ].map(option => ({ id: option, name: option }))}
                                                                    valueKey="id"
                                                                    textKey="name"
                                                                    formgroupClassName="tw-mb-0"
                                                                />
                                                            </div>

                                                            <div className="col-6">
                                                                <SelectInput
                                                                    name={`outputType-${index}`}
                                                                    hideSelectOption={true}
                                                                    value={
                                                                        measure.outputType ||
                                                                        defaultValueOutputType(field, measure.aggregation)
                                                                    }
                                                                    onChange={(event: FieldChangeEvent) =>
                                                                        patch({
                                                                            values: report.values.map((value, valueIndex) =>
                                                                                valueIndex === index
                                                                                    ? {
                                                                                        ...value,
                                                                                        outputType: event.target.value,
                                                                                        outputTypeCustomized: true,
                                                                                    }
                                                                                    : value
                                                                            ),
                                                                        })
                                                                    }
                                                                    menuItems={outputTypeOptions.map(type => ({
                                                                        id: type,
                                                                        name: type,
                                                                    }))}
                                                                    valueKey="id"
                                                                    textKey="name"
                                                                    formgroupClassName="tw-mb-0"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {isDateDimension && (
                                                        <SelectInput
                                                            name={`dateGroup-${shelf}-${index}`}
                                                            hideSelectOption={true}
                                                            value={
                                                                report.dateGroups?.[`${shelf}:${index}`] || "month"
                                                            }
                                                            onChange={(event: FieldChangeEvent) =>
                                                                patch({
                                                                    dateGroups: {
                                                                        ...(report.dateGroups || {}),
                                                                        [`${shelf}:${index}`]: event.target.value,
                                                                    },
                                                                })
                                                            }
                                                            menuItems={dateGroupOptions}
                                                            valueKey="id"
                                                            textKey="name"
                                                            formgroupClassName="tw-mb-0"
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {report.type === "cards" && (
                                <SelectInput
                                    name="cardColumns"
                                    labelText="Cards Per Row"
                                    hideSelectOption={true}
                                    value={String(report.cardColumns || 4)}
                                    onChange={(event: FieldChangeEvent) =>
                                        patch({ cardColumns: Number(event.target.value) })
                                    }
                                    menuItems={cardColumnOptions}
                                    valueKey="id"
                                    textKey="name"
                                />
                            )}

                            {report.type === "map" && (
                                <div className="row">
                                    <div className="col-12 col-lg-6">
                                        <SelectInput
                                            name="mapLatitudeField"
                                            labelText="Latitude Field"
                                            defaultSelect="Auto detect latitude"
                                            value={report.mapLatitudeField || ""}
                                            onChange={(event: FieldChangeEvent) =>
                                                patch({ mapLatitudeField: event.target.value })
                                            }
                                            menuItems={configuredFields.map(field => ({
                                                id: field.id,
                                                name: field.label,
                                            }))}
                                            valueKey="id"
                                            textKey="name"
                                        />
                                    </div>

                                    <div className="col-12 col-lg-6">
                                        <SelectInput
                                            name="mapLongitudeField"
                                            labelText="Longitude Field"
                                            defaultSelect="Auto detect longitude"
                                            value={report.mapLongitudeField || ""}
                                            onChange={(event: FieldChangeEvent) =>
                                                patch({ mapLongitudeField: event.target.value })
                                            }
                                            menuItems={configuredFields.map(field => ({
                                                id: field.id,
                                                name: field.label,
                                            }))}
                                            valueKey="id"
                                            textKey="name"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="tw-mb-3 tw-rounded-lg tw-border tw-border-gray-200 tw-p-3">
                                <label className="form-label">Date range</label>

                                <SelectInput
                                    name="dateField"
                                    defaultSelect="Select date field"
                                    value={report.dateField || ""}
                                    onChange={(event: FieldChangeEvent) =>
                                        patch({ dateField: event.target.value })
                                    }
                                    menuItems={
                                        activeSourceId === "leads"
                                            ? reportDateFieldOptions
                                            : configuredFields
                                                .filter(field => ["date", "datetime"].includes(field.type))
                                                .map(field => ({ id: field.id, name: field.label }))
                                    }
                                    valueKey="id"
                                    textKey="name"
                                />

                                <div className="row">
                                    <div className="col-6">
                                        <DateInput
                                            name="dateFrom"
                                            labelText="From"
                                            value={report.dateFrom}
                                            onChange={(event: FieldChangeEvent) =>
                                                patch({ dateFrom: event.target.value })
                                            }
                                        />
                                    </div>

                                    <div className="col-6">
                                        <DateInput
                                            name="dateTo"
                                            labelText="To"
                                            value={report.dateTo}
                                            onChange={(event: FieldChangeEvent) =>
                                                patch({ dateTo: event.target.value })
                                            }
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => patch({ dateFrom: "", dateTo: "" })}
                                >
                                    Clear dates
                                </Button>
                            </div>

                            <div className="tw-mb-3">
                                <div className="tw-mb-1 tw-flex tw-items-center tw-justify-between">
                                    <label className="form-label tw-mb-0">
                                        Report filters ({(report.filters || []).length})
                                    </label>

                                    <Button
                                        type="button"
                                        variant="soft"
                                        onClick={() => setPickerShelf("filters")}
                                    >
                                        <i className="ri-add-fill tw-mr-1"></i>
                                        Add filter
                                    </Button>
                                </div>

                                {(report.filters || []).map((filter, index) => {
                                    const definition = configuredFields.find(
                                        field => field.id === canonicalReportFieldId(filter.field)
                                    ) || { label: filter.field, type: filter.type || "text" };

                                    const noValue = ["is_blank", "is_not_blank"].includes(filter.operator);

                                    const options = [
                                        ...new Set(
                                            sourceRows
                                                .map(lead => leadFieldValue(lead, filter.field))
                                                .filter(item => item !== null && item !== undefined && item !== "")
                                                .map(item => String(item).trim())
                                        ),
                                    ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

                                    const selectedValues = Array.isArray(filter.value)
                                        ? filter.value
                                        : filter.value
                                            ? [filter.value]
                                            : [];

                                    return (
                                        <div
                                            className="tw-mb-2 tw-rounded-lg tw-border tw-border-gray-200 tw-p-2"
                                            key={filter.id}
                                        >
                                            <div className="tw-mb-1 tw-flex tw-items-center tw-justify-between">
                                                <span className="tw-text-sm tw-font-medium">
                                                    {definition.label}
                                                </span>

                                                <Button
                                                    type="button"
                                                    variant="wrong"
                                                    onClick={() =>
                                                        patch({
                                                            filters: report.filters.filter(
                                                                (_, filterIndex) => filterIndex !== index
                                                            ),
                                                        })
                                                    }
                                                    aria-label={`Remove ${definition.label} filter`}
                                                >
                                                    <i className="ri-close-line"></i>
                                                </Button>
                                            </div>

                                            <SelectInput
                                                name={`filterOperator-${filter.id}`}
                                                hideSelectOption={true}
                                                value={filter.operator}
                                                onChange={(event: FieldChangeEvent) =>
                                                    updateFilter(index, { operator: event.target.value })
                                                }
                                                menuItems={filterOperators(definition.type).map(
                                                    ([value, label]) => ({ id: value, name: label })
                                                )}
                                                valueKey="id"
                                                textKey="name"
                                                formgroupClassName={noValue ? "tw-mb-0" : "tw-mb-2"}
                                            />

                                            {!noValue && (
                                                <MultiSelect
                                                    name={`filterValue-${filter.id}`}
                                                    menuItems={options.map(option => ({
                                                        id: option,
                                                        name: option,
                                                    }))}
                                                    valueKey="id"
                                                    textKey="name"
                                                    value={selectedValues.map(option => ({
                                                        id: option,
                                                        name: option,
                                                    }))}
                                                    onChange={(selected: Array<{ id: string }>) =>
                                                        updateFilter(index, {
                                                            value: (selected || []).map(item => item.id),
                                                        })
                                                    }
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="tw-mb-2">
                                <Switch
                                    attributeId="showLabels"
                                    labelName="Data labels"
                                    checked={report.showLabels !== false}
                                    onChangeHndlr={() => patch({ showLabels: !report.showLabels })}
                                />
                                <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                                    Show values on the visual.
                                </p>

                                <Switch
                                    attributeId="showRowTotals"
                                    labelName="Row totals"
                                    checked={report.showRowTotals !== false}
                                    onChangeHndlr={() =>
                                        patch({ showRowTotals: report.showRowTotals === false })
                                    }
                                />
                                <p className="tw-mb-2 tw-text-xs tw-text-gray-500">
                                    Show the total column on table reports.
                                </p>

                                <Switch
                                    attributeId="showColumnTotals"
                                    labelName="Column totals"
                                    checked={!!report.showColumnTotals}
                                    onChangeHndlr={() =>
                                        patch({ showColumnTotals: !report.showColumnTotals })
                                    }
                                />
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    Show the grand total row on table reports.
                                </p>
                            </div>

                            {report.id && (
                                <Button
                                    type="button"
                                    variant="wrong" className="tw-mt-3"
                                    onClick={() => deleteOpenModal(report)}
                                >
                                    <i className="ri-delete-bin-line tw-mr-1"></i>
                                    Delete saved report
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ModalContainerUpdated
                id="report-field-picker-modal"
                isOpen={!!pickerShelf}
                toggle={() => setPickerShelf(null)}
                modalTitle={
                    pickerShelf === "filters"
                        ? "Add Filter Field"
                        : `Add Field to ${shelfLabels[(pickerShelf || "rows") as Shelf]}`
                }
                modalSize="md"
            >
                <FieldPickerModal
                    toggle={() => setPickerShelf(null)}
                    fields={pickerShelf === "values" ? allFields : configuredFields}
                    usedFieldIds={
                        pickerShelf && pickerShelf !== "filters" && pickerShelf !== "values"
                            ? (report[pickerShelf] as Array<string>)
                            : []
                    }
                    onSelect={fieldId => {
                        if (pickerShelf === "filters") {
                            addFilterHndlr(fieldId);
                            return;
                        }
                        if (pickerShelf) {
                            addFieldHndlr(pickerShelf, fieldId);
                        }
                    }}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="calculated-field-modal"
                isOpen={calculatedModalState.showModal}
                toggle={calculatedCloseModal}
                modalTitle={
                    calculatedModalState.modalData ? "Edit Calculated Field" : "New Calculated Field"
                }
                modalSize="lg"
            >
                <CalculatedFieldModal
                    toggle={calculatedCloseModal}
                    value={calculated}
                    onChange={setCalculated}
                    fields={configuredFields}
                    existing={report.calculatedFields || []}
                    rows={filteredLeadsForConditions}
                    report={report}
                    onSave={saveCalculatedHndlr}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="report-visibility-modal"
                isOpen={visibilityModalState.showModal}
                toggle={visibilityCloseModal}
                modalTitle="Saved Report Visibility"
                modalSize="md"
            >
                <ReportVisibilityModal
                    toggle={visibilityCloseModal}
                    selectedUserIds={visibilityModalState.modalData || []}
                    onConfirm={userIds => {
                        onSave(
                            {
                                ...(generatedReport as ReportDefinition),
                                title: report.title,
                                description: report.description,
                                generatedData: generatedData as PivotData,
                            },
                            userIds
                        );
                        visibilityCloseModal();
                    }}
                />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="delete-report-modal"
                isOpen={deleteModalState.showModal}
                iconType="reject"
                confirmTitle="Delete saved report?"
                confirmMessage={`"${deleteModalState.modalData?.title || "Untitled report"}" will be removed from the reports library.`}
                cancelHndlr={deleteCloseModal}
                confirmHndlr={() => {
                    onDelete(deleteModalState.modalData);
                    deleteCloseModal();
                }}
                confirmBtnText="Delete report"
            />
        </>
    );
};

export default ReportBuilder;

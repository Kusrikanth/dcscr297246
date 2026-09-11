import { useMemo, useState } from "react";

import {
    Button,
    SelectInput,
    TextArea,
    TextInput,
} from "../../../../Components/Common";
import {
    CALCULATION_FUNCTIONS,
    evaluateFormula,
    validateFormula,
} from "../calculationengine";
import {
    calculationTypeOptions,
    leadFieldValue,
    measureFunctionOptions,
    outputTypeOptions,
    reportFieldCatalog,
    type CalculatedField,
    type FieldChangeEvent,
    type ReportDefinition,
    type ReportField,
    type ReportRecord,
} from "../helper";
import ConditionGroup from "./ConditionGroup";
import { conditionExpression, makeGroup } from "./conditionhelper";

interface CalculatedFieldModalProps {
    toggle: () => void;
    value: CalculatedField;
    onChange: (field: CalculatedField) => void;
    fields: Array<ReportField>;
    existing: Array<CalculatedField>;
    rows: Array<ReportRecord>;
    report: Partial<ReportDefinition>;
    onSave: (validation: { dependencies: Array<string> }) => void;
}

const CalculatedFieldModal = ({
    toggle,
    value,
    onChange,
    fields,
    existing,
    rows,
    report,
    onSave,
}: CalculatedFieldModalProps) => {
    const isEditing = Boolean(value.id);
    const [testResult, setTestResult] = useState<string>("");
    const [testError, setTestError] = useState<string>("");

    const composedFormula = useMemo(() => {
        if (value.formulaMode !== "auto") {
            return value.formula || "";
        }

        const aggregationField = fields.find(field => field.id === value.aggregationField);

        const base =
            value.calculationType === "measure" && value.aggregationFunction && aggregationField
                ? `${value.aggregationFunction}([${aggregationField.label}])`
                : value.formula || "";

        if (!base) {
            return "";
        }

        const condition = value.conditions ? conditionExpression(value.conditions, fields) : "";

        return condition && condition !== "()" && value.calculationType === "measure"
            ? `CALCULATE(${base}, ${condition})`
            : base;
    }, [fields, value]);

    const validation = useMemo(
        () =>
            validateFormula(composedFormula, {
                fields,
                calculatedFields: existing.filter(field => field.id !== value.id),
                calculationType: value.calculationType,
            }),
        [composedFormula, existing, fields, value.calculationType, value.id]
    );

    const nameError = !value.name.trim()
        ? "Field name is required."
        : existing.some(
            field =>
                field.id !== value.id &&
                field.name.trim().toLowerCase() === value.name.trim().toLowerCase()
        )
            ? "Another calculated field already uses this name."
            : "";

    const formulaError = !composedFormula.trim()
        ? "Formula is required."
        : validation.errors[0] || "";

    const canSave = !nameError && !formulaError;

    function testFormulaHndlr() {
        setTestError("");
        setTestResult("");

        try {
            const result = evaluateFormula(composedFormula, {
                record: rows[0],
                rows,
                fields: reportFieldCatalog(report),
                calculatedFields: existing.filter(field => field.id !== value.id),
                getFieldValue: leadFieldValue,
            });

            setTestResult(
                result === null || result === undefined
                    ? "Blank"
                    : result instanceof Date
                        ? result.toLocaleString("en-IN")
                        : String(result)
            );
        } catch (error: unknown) {
            setTestError(error instanceof Error ? error.message : String(error));
        }
    }

    function saveHndlr() {
        if (!canSave) {
            return;
        }

        onChange({ ...value, formula: composedFormula });
        onSave({ dependencies: validation.dependencies });
    }

    const groupedFunctions = useMemo(() => {
        const groups = new Map<string, typeof CALCULATION_FUNCTIONS>();

        CALCULATION_FUNCTIONS.forEach(item => {
            groups.set(item.category, [...(groups.get(item.category) || []), item]);
        });

        return [...groups.entries()];
    }, []);

    return (
        <div className="tw-p-4">
            <div className="row">
                <div className="col-12 col-lg-4">
                    <TextInput
                        name="calculatedName"
                        labelText="Field Name"
                        placeHolder="e.g. Qualified leads"
                        value={value.name}
                        onChange={(event: FieldChangeEvent) =>
                            onChange({ ...value, name: event.target.value })
                        }
                        invalid={!!nameError}
                        error={nameError}
                        labelClass="required"
                        maxLength={60}
                    />
                </div>

                <div className="col-12 col-lg-4">
                    <SelectInput
                        name="calculationType"
                        labelText="Calculation Type"
                        hideSelectOption={true}
                        value={value.calculationType}
                        onChange={(event: FieldChangeEvent) =>
                            onChange({
                                ...value,
                                calculationType: event.target.value as "row" | "measure",
                            })
                        }
                        menuItems={calculationTypeOptions}
                        valueKey="id"
                        textKey="name"
                        labelClass="required"
                    />
                </div>

                <div className="col-12 col-lg-4">
                    <SelectInput
                        name="calculatedOutputType"
                        labelText="Output Data Type"
                        hideSelectOption={true}
                        value={value.outputType}
                        onChange={(event: FieldChangeEvent) =>
                            onChange({ ...value, outputType: event.target.value })
                        }
                        menuItems={outputTypeOptions.map(type => ({ id: type, name: type }))}
                        valueKey="id"
                        textKey="name"
                    />
                </div>
            </div>

            <div className="tw-mb-3 tw-flex tw-gap-2">
                {(["auto", "manual"] as const).map(mode => (
                    <Button
                        type="button"
                        key={mode}
                        variant={
                            value.formulaMode === mode ? "primary" : "secondary"
                        }
                        onClick={() => onChange({ ...value, formulaMode: mode })}
                    >
                        {mode === "auto" ? "Guided builder" : "Write formula"}
                    </Button>
                ))}
            </div>

            {value.formulaMode === "auto" ? (
                <>
                    {value.calculationType === "measure" && (
                        <div className="row">
                            <div className="col-12 col-lg-4">
                                <SelectInput
                                    name="aggregationFunction"
                                    labelText="Aggregation"
                                    defaultSelect="Select function"
                                    value={value.aggregationFunction || ""}
                                    onChange={(event: FieldChangeEvent) =>
                                        onChange({ ...value, aggregationFunction: event.target.value })
                                    }
                                    menuItems={measureFunctionOptions.map(item => ({
                                        id: item,
                                        name: item,
                                    }))}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>

                            <div className="col-12 col-lg-4">
                                <SelectInput
                                    name="aggregationField"
                                    labelText="Field"
                                    defaultSelect="Select field"
                                    value={value.aggregationField || ""}
                                    onChange={(event: FieldChangeEvent) =>
                                        onChange({ ...value, aggregationField: event.target.value })
                                    }
                                    menuItems={fields.map(field => ({
                                        id: field.id,
                                        name: field.label,
                                    }))}
                                    valueKey="id"
                                    textKey="name"
                                />
                            </div>
                        </div>
                    )}

                    {value.calculationType === "row" && (
                        <TextArea
                            name="rowFormula"
                            labelText="Row Expression"
                            placeHolder='e.g. IF([Lead Score] > 70, "Hot", "Warm")'
                            value={value.formula}
                            onChange={(event: FieldChangeEvent) =>
                                onChange({ ...value, formula: event.target.value })
                            }
                            maxLength={500}
                        />
                    )}

                    <div className="tw-mb-3">
                        <label className="form-label">Filter conditions</label>
                        <ConditionGroup
                            group={value.conditions || makeGroup("AND")}
                            fields={fields}
                            rows={rows}
                            onChange={conditions => onChange({ ...value, conditions })}
                        />
                    </div>
                </>
            ) : (
                <TextArea
                    name="manualFormula"
                    labelText="Formula"
                    placeHolder='e.g. CALCULATE(COUNT([Lead Number]), [Lead Stage] = "Admitted")'
                    value={value.formula}
                    onChange={(event: FieldChangeEvent) =>
                        onChange({ ...value, formula: event.target.value })
                    }
                    maxLength={1000}
                    height="120px"
                />
            )}

            <div className="tw-mb-3 tw-rounded-lg tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                <div className="tw-mb-1 tw-text-xs tw-font-semibold tw-text-gray-700">
                    Resolved formula
                </div>
                <code className="tw-block tw-break-all tw-text-xs tw-text-gray-800">
                    {composedFormula || "—"}
                </code>

                {formulaError ? (
                    <p className="tw-mb-0 tw-mt-2 tw-text-xs text-danger">{formulaError}</p>
                ) : (
                    <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-emerald-700">
                        Formula is valid
                        {validation.dependencies.length
                            ? ` · uses ${validation.dependencies.length} field(s)`
                            : ""}
                    </p>
                )}

                <div className="tw-mt-2 tw-flex tw-items-center tw-gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        disabled={!!formulaError}
                        onClick={testFormulaHndlr}
                    >
                        Test on current data
                    </Button>

                    {testResult && (
                        <span className="tw-text-xs tw-text-gray-700">Result: {testResult}</span>
                    )}
                    {testError && <span className="tw-text-xs text-danger">{testError}</span>}
                </div>
            </div>

            <details className="tw-mb-3">
                <summary className="tw-cursor-pointer tw-text-sm tw-font-medium tw-text-gray-700">
                    Function reference
                </summary>

                <div className="tw-mt-2 tw-max-h-56 tw-overflow-auto">
                    {groupedFunctions.map(([category, items]) => (
                        <div className="tw-mb-2" key={category}>
                            <div className="tw-mb-1 tw-text-xs tw-font-semibold tw-text-gray-600">
                                {category}
                            </div>

                            {items.map(item => (
                                <div className="tw-mb-1" key={item.name}>
                                    <code className="tw-text-xs tw-text-[#405189]">{item.signature}</code>
                                    <span className="tw-ml-2 tw-text-xs tw-text-gray-500">
                                        {item.description}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </details>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="primary"
                    disabled={!canSave}
                    onClick={saveHndlr}
                >
                    {isEditing ? "Save Field" : "Add Field"}
                </Button>
            </div>
        </div>
    );
};

export default CalculatedFieldModal;

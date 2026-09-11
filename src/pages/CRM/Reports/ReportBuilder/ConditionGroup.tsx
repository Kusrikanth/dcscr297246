import { useMemo } from "react";

import { Button,
    MultiSelect, SelectInput, TextInput } from "../../../../Components/Common";
import {
    conditionOperators,
    type ConditionNode,
    type FieldChangeEvent,
    type ReportField,
    type ReportRecord,
} from "../helper";
import { conditionFieldValues, makeCondition, makeGroup } from "./conditionhelper";

interface ConditionGroupProps {
    group: ConditionNode;
    fields: Array<ReportField>;
    rows: Array<ReportRecord>;
    onChange: (group: ConditionNode) => void;
    depth?: number;
}

const ConditionGroup = ({ group, fields, rows, onChange, depth = 0 }: ConditionGroupProps) => {
    const children = group.children || [];

    const updateChild = (index: number, child: ConditionNode) =>
        onChange({
            ...group,
            children: children.map((item, itemIndex) => (itemIndex === index ? child : item)),
        });

    const removeChild = (index: number) =>
        onChange({
            ...group,
            children: children.filter((_, itemIndex) => itemIndex !== index),
        });

    const fieldOptions = useMemo(
        () => fields.map(field => ({ id: field.id, name: field.label })),
        [fields]
    );

    return (
        <div
            className="tw-rounded-lg tw-border tw-border-gray-200 tw-p-3"
            style={{ marginLeft: depth ? "12px" : 0 }}
        >
            <div className="tw-mb-2 tw-flex tw-items-center tw-justify-between tw-gap-2">
                <span className="tw-text-xs tw-font-semibold tw-text-gray-600">WHERE group</span>

                <div style={{ minWidth: "110px" }}>
                    <SelectInput
                        name={`logic-${group.id}`}
                        hideSelectOption={true}
                        value={group.logic || "AND"}
                        onChange={(event: FieldChangeEvent) =>
                            onChange({ ...group, logic: event.target.value as "AND" | "OR" })
                        }
                        menuItems={[
                            { id: "AND", name: "AND" },
                            { id: "OR", name: "OR" },
                        ]}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                    />
                </div>
            </div>

            {children.map((child, index) => {
                if (child.kind === "group") {
                    return (
                        <div className="tw-mb-2" key={child.id}>
                            <ConditionGroup
                                group={child}
                                fields={fields}
                                rows={rows}
                                depth={depth + 1}
                                onChange={value => updateChild(index, value)}
                            />
                            <Button
                                type="button"
                                variant="linkBtn" className="text-danger tw-px-0"
                                onClick={() => removeChild(index)}
                            >
                                Remove group
                            </Button>
                        </div>
                    );
                }

                const selectedField = fields.find(item => item.id === child.field);
                const fieldType = String(selectedField?.type || "text").toLowerCase();
                const availableValues =
                    fieldType === "boolean" ? ["true", "false"] : conditionFieldValues(selectedField, rows);

                const multiValue = ["in", "not_in"].includes(String(child.operator));
                const noValue = ["is_blank", "is_not_blank", "today", "yesterday"].includes(
                    String(child.operator)
                );
                const isDate = fieldType === "date";
                const isDateTime = fieldType === "datetime";
                const isNumber = ["number", "currency", "decimal", "integer", "percentage"].includes(
                    fieldType
                );
                const isBoolean = fieldType === "boolean";
                const isFreeText = ["contains", "not_contains", "starts_with", "ends_with"].includes(
                    String(child.operator)
                );

                const selectedValues = Array.isArray(child.value) ? child.value : [];

                return (
                    <div className="row tw-items-end" key={child.id}>
                        <div className="col-12 col-lg-3">
                            <SelectInput
                                name={`field-${child.id}`}
                                defaultSelect="Field"
                                value={child.field || ""}
                                onChange={(event: FieldChangeEvent) => {
                                    const nextField = fields.find(item => item.id === event.target.value);
                                    const operator = conditionOperators(nextField?.type)[0][0];

                                    updateChild(index, {
                                        ...child,
                                        field: event.target.value,
                                        operator,
                                        value: ["in", "not_in"].includes(operator) ? [] : "",
                                    });
                                }}
                                menuItems={fieldOptions}
                                valueKey="id"
                                textKey="name"
                            />
                        </div>

                        <div className="col-12 col-lg-3">
                            <SelectInput
                                name={`operator-${child.id}`}
                                hideSelectOption={true}
                                value={child.operator || "equals"}
                                onChange={(event: FieldChangeEvent) => {
                                    const operator = event.target.value;

                                    updateChild(index, {
                                        ...child,
                                        operator,
                                        value: ["in", "not_in"].includes(operator)
                                            ? Array.isArray(child.value)
                                                ? child.value
                                                : child.value
                                                    ? [child.value]
                                                    : []
                                            : Array.isArray(child.value)
                                                ? child.value[0] || ""
                                                : child.value,
                                    });
                                }}
                                menuItems={conditionOperators(selectedField?.type).map(
                                    ([value, label]) => ({ id: value, name: label })
                                )}
                                valueKey="id"
                                textKey="name"
                            />
                        </div>

                        <div className="col-12 col-lg-5">
                            {noValue ? null : multiValue ? (
                                <MultiSelect
                                    name={`values-${child.id}`}
                                    menuItems={availableValues.map(value => ({ id: value, name: value }))}
                                    valueKey="id"
                                    textKey="name"
                                    value={selectedValues.map(value => ({ id: value, name: value }))}
                                    onChange={(selected: Array<{ id: string }>) =>
                                        updateChild(index, {
                                            ...child,
                                            value: (selected || []).map(item => item.id),
                                        })
                                    }
                                />
                            ) : isBoolean || (!isDate && !isDateTime && !isNumber && !isFreeText && availableValues.length) ? (
                                <SelectInput
                                    name={`value-${child.id}`}
                                    defaultSelect="Select value"
                                    value={String(child.value ?? "")}
                                    onChange={(event: FieldChangeEvent) =>
                                        updateChild(index, { ...child, value: event.target.value })
                                    }
                                    menuItems={availableValues.map(value => ({ id: value, name: value }))}
                                    valueKey="id"
                                    textKey="name"
                                />
                            ) : (
                                <TextInput
                                    name={`value-${child.id}`}
                                    inputType={
                                        child.operator === "last_x_days" || isNumber ? "number" : "text"
                                    }
                                    placeHolder={
                                        child.operator === "last_x_days"
                                            ? "Number of days"
                                            : isDate
                                                ? "YYYY-MM-DD"
                                                : "Value"
                                    }
                                    value={String(child.value ?? "")}
                                    onChange={(event: FieldChangeEvent) =>
                                        updateChild(index, { ...child, value: event.target.value })
                                    }
                                    maxLength={80}
                                />
                            )}
                        </div>

                        <div className="col-12 col-lg-1 tw-mb-3 tw-text-end">
                            <Button
                                type="button"
                                variant="wrong"
                                onClick={() => removeChild(index)}
                                aria-label="Remove condition"
                            >
                                <i className="ri-close-line"></i>
                            </Button>
                        </div>
                    </div>
                );
            })}

            <div className="tw-flex tw-gap-2">
                <Button
                    type="button"
                    variant="soft"
                    onClick={() => onChange({ ...group, children: [...children, makeCondition()] })}
                >
                    <i className="ri-add-fill tw-mr-1"></i>
                    Add condition
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => onChange({ ...group, children: [...children, makeGroup("AND")] })}
                >
                    <i className="ri-add-fill tw-mr-1"></i>
                    Add group
                </Button>
            </div>
        </div>
    );
};

export default ConditionGroup;

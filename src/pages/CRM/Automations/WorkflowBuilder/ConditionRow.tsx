import { type ChangeEvent, type MouseEvent } from "react";

import {
    Button,
    DateInput,
    MultiSelectCheckbox,
    SelectInput,
    TextInput,
} from "../../../../Components/Common";
import {
    conditionFieldOptions,
    dateConditionFields,
    dateModeOptions,
    dateOperatorOptions,
    durationUnitOptions,
    getFieldOptions,
    listOperatorOptions,
    valuelessOperators,
    type AutomationCondition,
    type MetaOption,
} from "../helper";

export type ConditionValue = string | Array<MetaOption>;

interface ConditionRowProps {
    condition: AutomationCondition;
    index: number;
    onChange: (index: number, key: string, value: ConditionValue) => void;
    onRemove: (index: number) => void;
}

const renderSelectedValues = (
    selectedItems: Array<MetaOption>,
    removeItemHandler: (event: MouseEvent<HTMLElement>) => void,
) => (
    <div className="tw-flex tw-flex-wrap tw-gap-1">
        {selectedItems.map(item => (
            <span
                key={item.id}
                className="badge badge-soft-primary tw-flex tw-items-center tw-gap-1"
            >
                {item.name}
                <i
                    data-id={item.id}
                    className="ri-close-line tw-cursor-pointer"
                    onClick={removeItemHandler}
                ></i>
            </span>
        ))}
    </div>
);

const renderOption = (item: MetaOption) => <span>{item.name}</span>;

const ConditionRow = ({
    condition,
    index,
    onChange,
    onRemove,
}: ConditionRowProps) => {
    const isDateField = dateConditionFields.includes(condition.field);
    const isValueless = valuelessOperators.includes(condition.operator);
    const fieldLabel =
        conditionFieldOptions.find(item => item.id === condition.field)?.name ||
        condition.field;

    const changeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        onChange(index, event.target.name, event.target.value);
    };

    return (
        <div className="tw-flex tw-flex-wrap tw-items-start tw-gap-2 tw-rounded tw-border tw-border-gray-200 tw-bg-white tw-p-2">
            <div className="tw-w-full sm:tw-w-44">
                <SelectInput
                    name="field"
                    labelText="Field"
                    value={condition.field}
                    onChange={changeHandler}
                    menuItems={conditionFieldOptions}
                    valueKey="id"
                    textKey="name"
                    hideSelectOption
                    formgroupClassName="tw-mb-0"
                />
            </div>

            <div className="tw-w-full sm:tw-w-44">
                <SelectInput
                    name="operator"
                    labelText="Operator"
                    value={condition.operator}
                    onChange={changeHandler}
                    menuItems={
                        isDateField ? dateOperatorOptions : listOperatorOptions
                    }
                    valueKey="id"
                    textKey="name"
                    hideSelectOption
                    formgroupClassName="tw-mb-0"
                />
            </div>

            {isDateField ? (
                <>
                    <div className="tw-w-full sm:tw-w-40">
                        <SelectInput
                            name="dateMode"
                            labelText="Date type"
                            value={condition.dateMode}
                            onChange={changeHandler}
                            menuItems={dateModeOptions}
                            valueKey="id"
                            textKey="name"
                            hideSelectOption
                            formgroupClassName="tw-mb-0"
                        />
                    </div>

                    {condition.dateMode === "relative" ? (
                        <>
                            <div className="tw-w-full sm:tw-w-28">
                                <TextInput
                                    name="duration"
                                    labelText="Duration"
                                    inputType="number"
                                    placeHolder="Duration"
                                    value={condition.duration}
                                    onChange={changeHandler}
                                    formgroupClassName="tw-mb-0"
                                />
                            </div>

                            <div className="tw-w-full sm:tw-w-32">
                                <SelectInput
                                    name="durationUnit"
                                    labelText="Unit"
                                    value={condition.durationUnit}
                                    onChange={changeHandler}
                                    menuItems={durationUnitOptions}
                                    valueKey="id"
                                    textKey="name"
                                    hideSelectOption
                                    formgroupClassName="tw-mb-0"
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="tw-w-full sm:tw-w-40">
                                <DateInput
                                    name="dateFrom"
                                    labelText={
                                        condition.operator === "between"
                                            ? "From"
                                            : "Date"
                                    }
                                    value={condition.dateFrom}
                                    onChange={changeHandler}
                                    maxDate={
                                        condition.operator === "between"
                                            ? condition.dateTo || undefined
                                            : undefined
                                    }
                                    formgroupClassName="tw-mb-0"
                                />
                            </div>

                            {condition.operator === "between" && (
                                <div className="tw-w-full sm:tw-w-40">
                                    <DateInput
                                        name="dateTo"
                                        labelText="To"
                                        value={condition.dateTo}
                                        onChange={changeHandler}
                                        minDate={
                                            condition.dateFrom || undefined
                                        }
                                        formgroupClassName="tw-mb-0"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : isValueless ? (
                <div className="tw-flex tw-min-w-56 tw-flex-1 tw-items-end">
                    <p className="tw-mb-0 tw-w-full tw-rounded tw-border tw-border-dashed tw-border-gray-300 tw-bg-gray-50 tw-px-2 tw-py-2 tw-text-sm tw-text-gray-500">
                        No value required
                    </p>
                </div>
            ) : (
                <div className="tw-min-w-56 tw-flex-1">
                    <MultiSelectCheckbox
                        name="values"
                        idKey="id"
                        labelText={`${fieldLabel} values`}
                        value={condition.values}
                        renderValue={renderSelectedValues}
                        renderOptions={renderOption}
                        onChange={(selectedOptions: Array<MetaOption>) =>
                            onChange(index, "values", selectedOptions)
                        }
                        searchKey="name"
                        options={getFieldOptions(condition.field)}
                        containerClassName="tw-mb-0"
                        defaultSelect={`Select ${fieldLabel.toLowerCase()} values`}
                    />
                </div>
            )}

            <Button
                type="button"
                variant="secondary"
                className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50 tw-mt-4"
                title="Remove condition"
                aria-label="Remove condition"
                onClick={() => onRemove(index)}
            >
                <i className="ri-delete-bin-line tw-text-danger"></i>
            </Button>
        </div>
    );
};

export default ConditionRow;

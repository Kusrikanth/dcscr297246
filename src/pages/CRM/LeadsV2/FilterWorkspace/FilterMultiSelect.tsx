import { type MouseEvent } from "react";

import { MultiSelectCheckbox } from "../../../../Components/Common";
import type { Option } from "../types";

interface FilterMultiSelectProps {
    name: string;
    labelText: string;
    value: string[];
    options: Option[];
    onChange: (name: string, ids: string[]) => void;
    isDisabled?: boolean;
}

const renderOption = (item: Option) => item.name;

const renderValue = (
    selectedItems: Option[],
    removeItemHandler: (
        event: MouseEvent<HTMLSpanElement>,
    ) => void,
) => {
    if (!Array.isArray(selectedItems)) {
        return null;
    }

    return (
        <div className="selected-container">
            {selectedItems.map(item => (
                <div
                    key={item.id}
                    className="selectedoption-item"
                >
                    <span>{item.name}</span>
                    <span
                        data-id={item.id}
                        onClick={removeItemHandler}
                        className="remove-icon"
                    >
                        <i className="ri-close-line"></i>
                    </span>
                </div>
            ))}
        </div>
    );
};

const FilterMultiSelect = ({
    name,
    labelText,
    value,
    options,
    onChange,
    isDisabled,
}: FilterMultiSelectProps) => (
    <MultiSelectCheckbox
        name={name}
        idKey="id"
        searchKey="name"
        labelText={labelText}
        value={options.filter(option =>
            value.includes(String(option.id)),
        )}
        options={options}
        renderValue={renderValue}
        renderOptions={renderOption}
        onChange={(selected: Option[]) =>
            onChange(
                name,
                selected.map(item => String(item.id)),
            )
        }
        isDisabled={isDisabled}
        containerClassName="tw-mb-0"
    />
);

export default FilterMultiSelect;

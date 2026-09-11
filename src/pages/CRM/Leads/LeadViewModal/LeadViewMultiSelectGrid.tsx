import {
    type MouseEvent,
} from "react";

import { MultiSelectCheckbox } from "../../../../Components/Common";
import { type LeadViewOption } from "./types";

interface LeadViewMultiSelectField {
    id: string;
    labelName: string;
    defaultSelect: string;
    options: LeadViewOption[];
}

interface LeadViewMultiSelectGridProps<
    TState extends Record<string, LeadViewOption[]>,
> {
    fields: LeadViewMultiSelectField[];
    value: TState;
    onChange: (
        selectedOptions: LeadViewOption[],
        config: { name: keyof TState },
    ) => void;
}

const renderLeadViewOptions = (item: LeadViewOption) =>
    item.name;

const renderLeadViewValue = (
    selectedItems: LeadViewOption[],
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

const LeadViewMultiSelectGrid = <
    TState extends Record<string, LeadViewOption[]>,
>({
    fields,
    value,
    onChange,
}: LeadViewMultiSelectGridProps<TState>) => {
    return (
        <div className="tw-grid tw-grid-cols-1 tw-gap-x-8 tw-gap-y-4 xl:tw-grid-cols-2">
            {fields.map(field => (
                <MultiSelectCheckbox
                    key={field.id}
                    name={field.id}
                    idKey="id"
                    labelText={field.labelName}
                    value={value[field.id]}
                    renderValue={renderLeadViewValue}
                    renderOptions={renderLeadViewOptions}
                    onChange={onChange}
                    searchKey="name"
                    options={field.options}
                    containerClassName="tw-mb-0"
                />
            ))}
        </div>
    );
};

export default LeadViewMultiSelectGrid;

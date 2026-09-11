import { useEffect, useState, type ChangeEvent } from "react";

import {
    Button,
    DateInput,
    SelectInput,
} from "../../../../../Components/Common";
import {
    templateStatusOptions,
    whatsAppAccounts,
} from "../../helper";
import {
    emptyTemplateFilters,
    type TemplateAdvancedFilters,
} from "./helper";

interface FilterOption {
    id: string;
    name: string;
}

interface TemplateFilterModalProps {
    filters: TemplateAdvancedFilters;
    typeOptions: Array<FilterOption>;
    categoryOptions: Array<FilterOption>;
    languageOptions: Array<FilterOption>;
    matchCount: number;
    toggle: () => void;
    onApply: (filters: TemplateAdvancedFilters) => void;
}

const TemplateFilterModal = ({
    filters,
    typeOptions,
    categoryOptions,
    languageOptions,
    matchCount,
    toggle,
    onApply,
}: TemplateFilterModalProps) => {
    const [draftFilters, setDraftFilters] =
        useState<TemplateAdvancedFilters>(filters);

    useEffect(() => {
        setDraftFilters(filters);
    }, [filters]);

    const changeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setDraftFilters(prevState => ({ ...prevState, [name]: value }));
    };

    return (
        <div className="tw-p-4">
            <div className="row">
                <div className="col-12 col-md-6">
                    <SelectInput
                        name="integrationId"
                        labelText="WhatsApp Account"
                        defaultSelect="All accounts"
                        value={draftFilters.integrationId}
                        onChange={changeHandler}
                        menuItems={whatsAppAccounts}
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="col-12 col-md-6">
                    <SelectInput
                        name="status"
                        labelText="Status"
                        defaultSelect="All statuses"
                        value={draftFilters.status}
                        onChange={changeHandler}
                        menuItems={templateStatusOptions}
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="col-12 col-md-6">
                    <SelectInput
                        name="templateType"
                        labelText="Template Type"
                        defaultSelect="All types"
                        value={draftFilters.templateType}
                        onChange={changeHandler}
                        menuItems={typeOptions}
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="col-12 col-md-6">
                    <SelectInput
                        name="category"
                        labelText="Category"
                        defaultSelect="All categories"
                        value={draftFilters.category}
                        onChange={changeHandler}
                        menuItems={categoryOptions}
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="col-12 col-md-6">
                    <SelectInput
                        name="language"
                        labelText="Language"
                        defaultSelect="All languages"
                        value={draftFilters.language}
                        onChange={changeHandler}
                        menuItems={languageOptions}
                        valueKey="id"
                        textKey="name"
                    />
                </div>

                <div className="col-12 col-md-3">
                    <DateInput
                        name="createdFrom"
                        labelText="Created From"
                        value={draftFilters.createdFrom}
                        onChange={changeHandler}
                        maxDate={draftFilters.createdTo || undefined}
                    />
                </div>

                <div className="col-12 col-md-3">
                    <DateInput
                        name="createdTo"
                        labelText="Created To"
                        value={draftFilters.createdTo}
                        onChange={changeHandler}
                        minDate={draftFilters.createdFrom || undefined}
                    />
                </div>
            </div>

            <div className="tw-mt-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-3">
                <span className="tw-text-sm tw-text-gray-500">
                    {matchCount} template{matchCount === 1 ? "" : "s"} match the
                    applied filters
                </span>

                <div className="tw-flex tw-gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setDraftFilters(emptyTemplateFilters)}
                    >
                        Reset
                    </Button>

                    <Button type="button" variant="secondary" onClick={toggle}>
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => onApply(draftFilters)}
                    >
                        Apply Filters
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TemplateFilterModal;

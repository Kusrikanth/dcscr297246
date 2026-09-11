import { useMemo, useState } from "react";

import { Button,
    TextInput } from "../../../../Components/Common";
import type { FieldChangeEvent, ReportField } from "../helper";

interface FieldPickerModalProps {
    toggle: () => void;
    fields: Array<ReportField>;
    usedFieldIds?: Array<string>;
    onSelect: (fieldId: string) => void;
}

const FieldPickerModal = ({
    toggle,
    fields,
    usedFieldIds = [],
    onSelect,
}: FieldPickerModalProps) => {
    const [searchText, setSearchText] = useState("");

    const visibleFields = useMemo(() => {
        const term = searchText.trim().toLowerCase();

        return fields.filter(
            field =>
                !usedFieldIds.includes(field.id) &&
                (!term || field.label.toLowerCase().includes(term))
        );
    }, [fields, searchText, usedFieldIds]);

    return (
        <div className="tw-p-4">
            <TextInput
                name="fieldSearch"
                placeHolder="Search fields"
                value={searchText}
                onChange={(event: FieldChangeEvent) => setSearchText(event.target.value)}
                autoFocus={true}
                maxLength={60}
            />

            <div className="tw-max-h-80 tw-overflow-auto tw-rounded-lg tw-border tw-border-gray-200">
                {visibleFields.map(field => (
                    <Button
                        type="button"
                        variant="secondary"
                        key={field.id}
                        className="tw-w-full !tw-justify-between !tw-bg-white !tw-rounded-none !tw-shadow-none tw-border-b tw-border-gray-100 !tw-px-3 !tw-py-2 tw-text-left last:tw-border-b-0 hover:!tw-bg-gray-50"
                        onClick={() => {
                            onSelect(field.id);
                            toggle();
                        }}
                    >
                        <span className="tw-text-sm">{field.label}</span>
                        <span className="tw-text-xs tw-text-gray-400">{field.type}</span>
                    </Button>
                ))}

                {!visibleFields.length && (
                    <p className="tw-mb-0 tw-p-3 tw-text-sm tw-text-gray-500">
                        No fields match this search.
                    </p>
                )}
            </div>

            <div className="tw-mt-4 tw-flex tw-justify-end tw-border-t tw-border-gray-200 tw-pt-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Close
                </Button>
            </div>
        </div>
    );
};

export default FieldPickerModal;

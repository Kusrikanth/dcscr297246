import { useMemo, useState, type ChangeEvent } from "react";

import { Button, SelectInput } from "../../../../Components/Common";
import {
    autoMapSuggestions,
    mappingCrmFields,
    mappingSourceColumns,
} from "./helper";
import { toast } from "react-toastify";

interface FieldMappingPanelProps {
    sourceLabel?: string;
    onSaved?: () => void;
}

const columnKey = (index: number) => `column_${index}`;

const FieldMappingPanel = ({
    sourceLabel = "source",
    onSaved,
}: FieldMappingPanelProps) => {
    const [mappings, setMappings] = useState<Record<string, string>>({
        column_0: "student_name",
        column_1: "phone",
    });
    const [hasChanges, setHasChanges] = useState<boolean>(false);

    const suggestions = useMemo(
        () => autoMapSuggestions(mappingSourceColumns, mappingCrmFields),
        [],
    );

    const columnOptions = useMemo(
        () =>
            mappingSourceColumns.map(column => ({
                id: columnKey(column.index),
                name: column.name,
            })),
        [],
    );

    const mapFieldHandler = (crmFieldName: string, nextColumnKey: string) => {
        setMappings(current => {
            const next = { ...current };

            Object.keys(next).forEach(key => {
                if (next[key] === crmFieldName || key === nextColumnKey) {
                    delete next[key];
                }
            });

            if (nextColumnKey) {
                next[nextColumnKey] = crmFieldName;
            }

            return next;
        });

        setHasChanges(true);
    };

    const autoMapHandler = () => {
        setMappings(
            Object.entries(suggestions).reduce<Record<string, string>>(
                (next, [crmFieldName, key]) => {
                    next[key] = crmFieldName;
                    return next;
                },
                {},
            ),
        );
        setHasChanges(true);
    };

    const saveHandler = () => {
        const mapped = Object.values(mappings);
        const missing = mappingCrmFields.filter(
            field => field.isRequired && !mapped.includes(field.name),
        );

        if (missing.length) {
            toast.error(
                `Map every required CRM field before activating this source: ${missing
                    .map(field => field.label)
                    .join(", ")}.`,
            );
            return;
        }

        setHasChanges(false);
        toast.success("Field mappings saved");
        onSaved?.();
    };

    const mappedCount = Object.keys(mappings).length;
    const suggestionCount = Object.keys(suggestions).length;

    return (
        <div>
            <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-2">
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                        Map CRM fields to {sourceLabel} columns
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        Select the matching column for each CRM field.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="hoverInfo"
                    title="Automatically map matching columns"
                    onClick={autoMapHandler}
                >
                    <i className="ri-magic-line tw-me-1"></i>
                    Auto Map
                </Button>
            </div>

            {suggestionCount > 0 && (
                <div className="alert alert-info tw-flex tw-items-center tw-gap-2 tw-py-2">
                    <i className="ri-information-line"></i>
                    <span className="tw-text-sm">
                        {suggestionCount} matching column
                        {suggestionCount === 1 ? "" : "s"} found. Select Auto Map to
                        apply them.
                    </span>
                </div>
            )}

            <div className="tw-flex tw-flex-col tw-gap-2">
                {mappingCrmFields.map(field => {
                    const selectedColumn =
                        Object.keys(mappings).find(
                            key => mappings[key] === field.name,
                        ) || "";
                    const suggestion = suggestions[field.name];
                    const hasSuggestion =
                        suggestion && selectedColumn !== suggestion;

                    return (
                        <div
                            key={field.name}
                            className="tw-flex tw-flex-wrap tw-items-center tw-gap-3 tw-rounded tw-border tw-border-gray-200 tw-p-3"
                        >
                            <div className="tw-min-w-[180px]">
                                <p className="tw-mb-0 tw-text-[11px] tw-text-gray-500">
                                    CRM field
                                </p>
                                <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                    {field.label}
                                    {field.isRequired && (
                                        <span
                                            className="tw-text-danger"
                                            aria-label="required"
                                        >
                                            {" "}
                                            *
                                        </span>
                                    )}
                                </p>
                            </div>

                            <i
                                className="ri-arrow-right-line tw-text-gray-400"
                                aria-hidden="true"
                            ></i>

                            <div className="tw-min-w-[220px] tw-flex-1">
                                <p className="tw-mb-0 tw-text-[11px] tw-text-gray-500">
                                    Imported column
                                </p>

                                <SelectInput
                                    name={`mapping-${field.name}`}
                                    value={selectedColumn}
                                    onChange={(
                                        event: ChangeEvent<HTMLSelectElement>,
                                    ) =>
                                        mapFieldHandler(
                                            field.name,
                                            event.target.value,
                                        )
                                    }
                                    menuItems={columnOptions}
                                    valueKey="id"
                                    textKey="name"
                                    defaultSelect="Select a column"
                                    inputClassName="form-select-sm"
                                    formgroupClassName="tw-mb-0"
                                />

                                {hasSuggestion && (
                                    <p className="tw-mb-0 tw-text-[11px] tw-text-amber-700">
                                        Suggested:{" "}
                                        {
                                            mappingSourceColumns.find(
                                                column =>
                                                    columnKey(column.index) ===
                                                    suggestion,
                                            )?.name
                                        }
                                    </p>
                                )}
                            </div>

                            {selectedColumn && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                    title="Clear this mapping"
                                    aria-label={`Clear the mapping for ${field.label}`}
                                    onClick={() => mapFieldHandler(field.name, "")}
                                >
                                    <i className="ri-delete-bin-line"></i>
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="tw-mt-3 tw-flex tw-flex-wrap tw-items-center tw-gap-3 tw-border-t tw-border-gray-200 tw-pt-3">
                <Button
                    type="button"
                    variant="primary"
                    disabled={!hasChanges}
                    onClick={saveHandler}
                >
                    Save Mappings
                </Button>

                <span className="tw-text-xs tw-text-gray-500">
                    {mappedCount} field{mappedCount === 1 ? "" : "s"} mapped
                </span>

                {hasChanges && (
                    <span className="tw-text-xs tw-text-amber-700">
                        Unsaved changes
                    </span>
                )}
            </div>
        </div>
    );
};

export default FieldMappingPanel;

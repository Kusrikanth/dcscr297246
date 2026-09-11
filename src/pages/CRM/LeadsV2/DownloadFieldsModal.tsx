import {
    useMemo,
    useState,
    type ChangeEvent,
} from "react";

import {
    Button,
    InputCheckbox,
    InputCheckboxUpdated,
    TextIconInput,
} from "../../../Components/Common";
import type { ExportField, ExportFieldGroup } from "./types";

interface DownloadFieldsModalProps {
    groups: ExportFieldGroup[];
    recordCount: number;
    toggle: () => void;
    onDownload: (fields: ExportField[]) => void;
}

const DownloadFieldsModal = ({
    groups,
    recordCount,
    toggle,
    onDownload,
}: DownloadFieldsModalProps) => {
    const allFields = useMemo(
        () => groups.flatMap(group => group.fields),
        [groups],
    );

    const defaultIds = useMemo(
        () =>
            allFields
                .filter(field => field.defaultSelected)
                .map(field => field.id),
        [allFields],
    );

    const [selectedIds, setSelectedIds] = useState<string[]>(
        () => defaultIds,
    );
    const [searchString, setSearchString] =
        useState<string>("");

    const visibleGroups = useMemo(
        () =>
            groups
                .map(group => ({
                    ...group,
                    fields: group.fields.filter(field =>
                        field.label
                            .toLowerCase()
                            .includes(
                                searchString
                                    .trim()
                                    .toLowerCase(),
                            ),
                    ),
                }))
                .filter(group => group.fields.length),
        [groups, searchString],
    );

    const visibleIds = visibleGroups.flatMap(group =>
        group.fields.map(field => field.id),
    );

    const allVisibleSelected =
        visibleIds.length > 0 &&
        visibleIds.every(id => selectedIds.includes(id));

    const toggleField = (id: string) => {
        setSelectedIds(current =>
            current.includes(id)
                ? current.filter(item => item !== id)
                : [...current, id],
        );
    };

    const toggleVisible = () => {
        setSelectedIds(current =>
            allVisibleSelected
                ? current.filter(
                    id => !visibleIds.includes(id),
                )
                : [...new Set([...current, ...visibleIds])],
        );
    };

    const resetHandler = () => {
        setSelectedIds(defaultIds);
        setSearchString("");
    };

    return (
        <div className="tw-bg-white">
            <div className="tw-border-b tw-border-gray-200 tw-p-4">
                <TextIconInput
                    name="fieldSearch"
                    formgroupClassName="search-box tw-mb-3"
                    value={searchString}
                    onChange={(
                        event: ChangeEvent<HTMLInputElement>,
                    ) => setSearchString(event.target.value)}
                    placeHolder="Search field"
                >
                    <i className="ri-search-line search-icon"></i>
                </TextIconInput>

                <p className="tw-mb-2 tw-text-sm tw-text-gray-500">
                    Choose the fields to include in the CSV
                    download. {recordCount} lead
                    {recordCount === 1 ? "" : "s"} in the current
                    filtered view will be exported.
                </p>

                <InputCheckboxUpdated
                    name="toggleVisibleFields"
                    formgroupClassName="tw-mb-0"
                    value={allVisibleSelected}
                    onChange={toggleVisible}
                    labelName={
                        <span className="tw-text-sm tw-font-medium tw-text-gray-700">
                            {allVisibleSelected
                                ? "Clear visible fields"
                                : "Select all visible fields"}
                        </span>
                    }
                >
                    <span className="badge badge-soft-primary">
                        {selectedIds.length}
                    </span>
                </InputCheckboxUpdated>
            </div>

            <div className="tw-max-h-[52vh] tw-overflow-y-auto tw-p-4">
                {visibleGroups.length ? (
                    visibleGroups.map(group => (
                        <div
                            key={group.name}
                            className="tw-mb-4 last:tw-mb-0"
                        >
                            <p className="tw-mb-2 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-500">
                                {group.name}
                            </p>
                            <div className="row tw-gap-y-2">
                                {group.fields.map(field => (
                                    <div
                                        key={field.id}
                                        className="col-12 col-md-6 col-lg-4"
                                    >
                                        <InputCheckbox
                                            name={`download-${field.id}`}
                                            formgroupClassName="tw-mb-0"
                                            labelName={field.label}
                                            labelClassName="tw-text-sm tw-text-gray-700"
                                            value={selectedIds.includes(
                                                field.id,
                                            )}
                                            onChange={() =>
                                                toggleField(field.id)
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                        No fields match your search.
                    </p>
                )}
            </div>

            <div className="tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-p-4">
                <Button
                    type="button"
                    variant="hoverInfo"
                    onClick={resetHandler}
                >
                    <i className="ri-reset-left-line"></i>
                    Reset
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={toggle}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    disabled={!selectedIds.length}
                    onClick={() =>
                        onDownload(
                            allFields.filter(field =>
                                selectedIds.includes(field.id),
                            ),
                        )
                    }
                >
                    <i className="ri-download-2-line"></i>
                    Download
                </Button>
            </div>
        </div>
    );
};

export default DownloadFieldsModal;

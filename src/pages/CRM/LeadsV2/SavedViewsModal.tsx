import {
    useMemo,
    useState,
    type ChangeEvent,
} from "react";

import { leadMeta } from "./data";
import { buildAppliedFilterGroups } from "./helper";
import type { SavedView } from "./types";
import Button from "../../../Components/Common/Button";
import { RadioInputContainer } from "../../../Components/Common";

interface SavedViewsModalProps {
    savedViews: SavedView[];
    selectedViewId: string;
    toggle: () => void;
    onApply: (viewId: string) => void;
    onDelete: (viewId: string) => void;
}

const SavedViewsModal = ({
    savedViews,
    selectedViewId,
    toggle,
    onApply,
    onDelete,
}: SavedViewsModalProps) => {
    const [viewId, setViewId] = useState<string>(
        selectedViewId || savedViews[0]?.id || "",
    );

    const summaries = useMemo(
        () =>
            savedViews.map(view => ({
                view,
                groups: buildAppliedFilterGroups(
                    leadMeta,
                    "",
                    view.filters,
                ),
            })),
        [savedViews],
    );

    return (
        <div>
            <div className="tw-max-h-[64vh] tw-overflow-y-auto tw-p-4">
                {summaries.length ? (
                    <div className="tw-flex tw-flex-col tw-gap-3">
                        {summaries.map(({ view, groups }) => (
                            <div
                                key={view.id}
                                className={`tw-rounded-lg tw-border tw-bg-white tw-p-4 ${viewId === view.id
                                    ? "tw-border-[#405189] tw-shadow-sm"
                                    : "tw-border-gray-200"
                                    }`}
                            >
                                <div className="tw-flex tw-items-start tw-justify-between tw-gap-3">
                                    <RadioInputContainer
                                        name="savedView"
                                        formgroupClassName="tw-mb-0"
                                        radioOptions={[
                                            {
                                                id: view.id,
                                                name: (
                                                    <span className="tw-text-sm tw-font-semibold tw-text-gray-900">
                                                        {view.name}
                                                    </span>
                                                ),
                                                description:
                                                    view.type === "funnel"
                                                        ? "Saved view"
                                                        : "Saved filter",
                                            },
                                        ]}
                                        value={viewId}
                                        onChange={(
                                            event: ChangeEvent<HTMLInputElement>,
                                        ) => setViewId(event.target.value)}
                                    />

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                        title={`Delete ${view.name}`}
                                        aria-label={`Delete ${view.name}`}
                                        onClick={() =>
                                            onDelete(view.id)
                                        }
                                    >
                                        <i className="ri-delete-bin-5-line text-danger fs-16"></i>
                                    </Button>
                                </div>

                                <div className="tw-mt-4 tw-flex tw-flex-col tw-gap-3">
                                    {groups.length ? (
                                        groups.map(group => (
                                            <div
                                                key={group.title}
                                            >
                                                <div className="tw-mb-2 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-500">
                                                    {group.title}
                                                </div>
                                                <div className="tw-flex tw-flex-wrap tw-gap-2">
                                                    {group.items.map(
                                                        item => (
                                                            <span
                                                                key={
                                                                    item.label
                                                                }
                                                                className="badge badge-soft-primary tw-rounded tw-px-2 tw-py-1 tw-text-[11px] tw-font-medium"
                                                            >
                                                                {
                                                                    item.label
                                                                }
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                            No filters saved with
                                            this view.
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-sm tw-text-gray-500">
                        No saved views yet. Set some filters, then
                        use "Save view" in the filter workspace.
                    </p>
                )}
            </div>

            <div className="tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-p-4">
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
                    disabled={!viewId}
                    onClick={() => onApply(viewId)}
                >
                    Apply
                </Button>
            </div>
        </div>
    );
};

export default SavedViewsModal;

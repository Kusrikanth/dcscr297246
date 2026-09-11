import {
    useEffect,
    useState,
    type ChangeEvent,
} from "react";
import Button from "../../../Components/Common/Button";
import { RadioInputContainer } from "../../../Components/Common";

interface ViewOption {
    id: string;
    labelName: string;
}

interface AppliedFilterGroup {
    title: string;
    filters: string[];
}

interface FilterViewOption extends ViewOption {
    appliedFilters: AppliedFilterGroup[];
}

interface LeadViewFilterModalProps {
    selectedViewId: string;
    viewsList: ViewOption[];
    onApply: (viewId: string) => void;
    toggle: () => void;
}

const defaultFilterGroups: AppliedFilterGroup[][] = [
    [
        {
            title: "Lead details",
            filters: [
                "Touch status",
                "Current stage",
                "Lead source",
            ],
        },
        {
            title: "Academic details",
            filters: [
                "Class",
                "Curriculum",
                "Admission type",
            ],
        },
        {
            title: "Date filters",
            filters: [
                "Added",
                "Next follow up",
            ],
        },
    ],
    [
        {
            title: "Lead details",
            filters: [
                "Branch",
                "Sub stage",
                "Counsellor referred to",
            ],
        },
        {
            title: "Communication details",
            filters: [
                "Student name",
                "Primary phone",
            ],
        },
        {
            title: "Marketing campaigns",
            filters: [
                "Campaign category",
                "WhatsApp delivery status",
            ],
        },
    ],
];

const getFilterViews = (
    viewsList: ViewOption[],
): FilterViewOption[] =>
    viewsList.map((view, index) => ({
        ...view,
        appliedFilters:
            defaultFilterGroups[index] || defaultFilterGroups[0],
    }));

const LeadViewFilterModal = ({
    selectedViewId,
    viewsList,
    onApply,
    toggle,
}: LeadViewFilterModalProps) => {
    const filterViews = getFilterViews(viewsList);
    const [viewId, setViewId] =
        useState(
            selectedViewId || filterViews[0]?.id || "",
        );

    useEffect(() => {
        setViewId(
            selectedViewId || filterViews[0]?.id || "",
        );
    }, [filterViews, selectedViewId]);

    const viewChangeHandler = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        setViewId(event.target.value);
    };

    const applyHandler = () => {
        onApply(viewId);
    };

    return (
        <div>
            <div className="tw-max-h-[64vh] tw-overflow-y-auto tw-p-4">
                <div className="tw-space-y-3">
                    {filterViews.map(view => (
                        <div
                            key={view.id}
                            className={`tw-rounded-lg tw-border tw-bg-white tw-p-4 ${viewId === view.id
                                ? "tw-border-[#405189] tw-shadow-sm"
                                : "tw-border-gray-200"
                                }`}
                        >
                            <div className="tw-flex tw-items-start tw-justify-between tw-gap-3">
                                <RadioInputContainer
                                    name="filterView"
                                    formgroupClassName="tw-mb-0"
                                    radioOptions={[
                                        {
                                            id: view.id,
                                            name: (
                                                <span className="tw-text-sm tw-font-semibold tw-text-gray-900">
                                                    {view.labelName}
                                                </span>
                                            ),
                                        },
                                    ]}
                                    value={viewId}
                                    onChange={viewChangeHandler}
                                />

                                <Button
                                    type="button"
                                    variant="secondary"
                                    className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                    title="Delete filter view"
                                    aria-label="Delete filter view"
                                >
                                    <i className="ri-delete-bin-5-line text-danger fs-16"></i>
                                </Button>
                            </div>

                            <div className="tw-mt-4 tw-space-y-3">
                                {view.appliedFilters.map(group => (
                                    <div key={group.title}>
                                        <div className="tw-mb-2 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-500">
                                            {group.title}
                                        </div>
                                        <div className="tw-flex tw-flex-wrap tw-gap-2">
                                            {group.filters.map(filterName => (
                                                <span
                                                    key={filterName}
                                                    className="badge badge-soft-primary tw-rounded tw-px-2 tw-py-1 tw-text-[11px] tw-font-medium"
                                                >
                                                    {filterName}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
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
                    onClick={applyHandler}
                >
                    Apply
                </Button>
            </div>
        </div>
    );
};

export default LeadViewFilterModal;

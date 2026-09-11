import { Button } from "../../../Components/Common";
import type { AppliedFilterGroup } from "./helper";

interface AppliedFiltersPanelProps {
    groups: AppliedFilterGroup[];
    isExpanded: boolean;
    onToggle: () => void;
    onReset: () => void;
    onEdit: () => void;
}

const AppliedFiltersPanel = ({
    groups,
    isExpanded,
    onToggle,
    onReset,
    onEdit,
}: AppliedFiltersPanelProps) => {
    const activeCount = groups.reduce(
        (total, group) => total + group.items.length,
        0,
    );

    if (!activeCount) {
        return null;
    }

    return (
        <div className="tw-border-b tw-border-gray-200 tw-bg-[#f8fafc] tw-px-3 tw-py-2">
            <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                <Button
                    type="button"
                    variant="sidebarMenu"
                    onClick={onToggle}
                    className="!tw-items-center tw-gap-2 tw-text-sm tw-font-semibold tw-text-gray-700"
                >
                    <i
                        className={`ri-arrow-${isExpanded ? "down" : "right"}-s-line`}
                    ></i>
                    Applied filters
                    <span className="badge badge-soft-primary">
                        {activeCount} active
                    </span>
                </Button>

                <div className="tw-flex tw-gap-2">
                    <Button
                        type="button"
                        variant="hoverInfo"
                        onClick={onReset}
                    >
                        <i className="ri-reset-left-line"></i>
                        Reset
                    </Button>
                    <Button
                        type="button"
                        variant="hoverInfo"
                        onClick={onEdit}
                    >
                        <i className="ri-pencil-line"></i>
                        Edit filters
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <div className="tw-mt-3 tw-flex tw-flex-wrap tw-gap-4">
                    {groups.map(group => (
                        <div
                            key={group.title}
                            className="tw-min-w-[220px] tw-flex-1 tw-rounded tw-border tw-border-gray-200 tw-bg-white tw-p-3"
                        >
                            <p className="tw-mb-2 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-500">
                                {group.title}
                                <span className="badge badge-soft-secondary tw-ms-2">
                                    {group.items.length}
                                </span>
                            </p>

                            <div className="tw-flex tw-flex-col tw-gap-2">
                                {group.items.map(item => (
                                    <div key={item.label}>
                                        <p className="tw-mb-1 tw-text-xs tw-text-gray-500">
                                            {item.label}
                                        </p>
                                        <div className="tw-flex tw-flex-wrap tw-gap-1">
                                            {item.values.map(
                                                value => (
                                                    <span
                                                        key={`${item.label}-${value}`}
                                                        className="badge badge-soft-primary tw-text-[11px] tw-font-medium"
                                                    >
                                                        {value}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AppliedFiltersPanel;

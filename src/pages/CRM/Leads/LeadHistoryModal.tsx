import {
    useMemo,
    useState,
    type ChangeEvent,
} from "react";

import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowDown01Icon,
    Calendar03Icon,
    Clock01Icon,
    FilterIcon,
    Message01Icon,
    PencilEdit02Icon,
    Recycle03Icon,
    UserAdd01Icon,
    UserCheck01Icon,
} from "@hugeicons-pro/core-stroke-standard";

import { Button, SelectInput } from "../../../Components/Common";
import {
    getLeadHistory,
    leadActivityFilterOptions,
    type LeadHistoryEntry,
    type LeadHistoryMilestone,
    type LeadRecord,
} from "./helper";

interface ILeadHistoryModal {
    data: LeadRecord;
    toggle: () => void;
}

type LeadHistoryIcon = typeof UserAdd01Icon;

const milestoneIconMap: Record<string, LeadHistoryIcon> = {
    added: UserAdd01Icon,
    updated: PencilEdit02Icon,
    referred: UserCheck01Icon,
    "re-enquired": Recycle03Icon,
    "next-follow-up": Calendar03Icon,
};

const activityIconMap: Record<string, LeadHistoryIcon> = {
    created: UserAdd01Icon,
    stage: PencilEdit02Icon,
    followup: Calendar03Icon,
    communication: Message01Icon,
    workflow: Clock01Icon,
};

const activityFilterGroupMap: Record<string, string> = {
    created: "stage",
    stage: "stage",
    followup: "followup",
    communication: "communication",
    workflow: "workflow",
};

const SummaryTile = ({
    labelText,
    value,
    icon,
}: {
    labelText: string;
    value: string;
    icon: LeadHistoryIcon;
}) => {
    return (
        <div className="tw-card tw-mb-0">
            <div className="tw-card-body tw-flex tw-gap-2">
                <div className="tw-flex tw-h-9 tw-w-9 tw-flex-shrink-0 tw-items-center tw-justify-center tw-rounded tw-bg-gray-100">
                    <HugeiconsIcon
                        icon={icon}
                        className="tw-text-gray-500"
                        size={18}
                    />
                </div>
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-xs tw-font-medium tw-text-gray-500">
                        {labelText}
                    </p>
                    <p className="tw-mb-0 tw-text-base">
                        {value || "-"}
                    </p>
                </div>
            </div>
        </div>
    );
};

const MilestoneItem = ({
    milestone,
}: {
    milestone: LeadHistoryMilestone;
}) => {
    return (
        <div className="tw-flex tw-min-w-[110px] tw-flex-1 tw-flex-col tw-items-center tw-text-center">
            <div
                className={`tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-full tw-z-20 ${milestone.isCompleted
                    ? "tw-bg-emerald-100"
                    : "tw-bg-gray-100"
                    }`}
            >
                <HugeiconsIcon
                    icon={milestoneIconMap[milestone.id]}
                    className={
                        milestone.isCompleted
                            ? "tw-text-emerald-500"
                            : "tw-text-gray-400"
                    }
                    size={18}
                />
            </div>

            <p
                className={`tw-mb-0 tw-mt-2 tw-text-sm tw-font-semibold ${milestone.isCompleted
                    ? "tw-text-gray-900"
                    : "tw-text-gray-400"
                    }`}
            >
                {milestone.labelName}
            </p>

            {milestone.isCompleted ? (
                <>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {milestone.dateText}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {milestone.timeText}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-400">
                        {milestone.relativeText}
                    </p>
                </>
            ) : (
                <p className="tw-mb-0 tw-text-xs tw-text-gray-400">
                    {milestone.emptyText}
                </p>
            )}
        </div>
    );
};

const ActivityItem = ({
    activity,
    isLastItem,
    isExpanded,
    toggleHndlr,
}: {
    activity: LeadHistoryEntry;
    isLastItem: boolean;
    isExpanded: boolean;
    toggleHndlr: () => void;
}) => {
    return (
        <div className="tw-flex tw-gap-3">
            <div className="tw-flex tw-flex-col tw-items-center">
                <div className="tw-flex tw-h-8 tw-w-8 tw-flex-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-bg-emerald-100">
                    <HugeiconsIcon
                        icon={
                            activityIconMap[activity.type] ||
                            Clock01Icon
                        }
                        className="tw-text-emerald-500"
                        size={16}
                    />
                </div>
                {!isLastItem && (
                    <div className="tw-my-1 tw-w-px tw-flex-1 tw-bg-slate-200"></div>
                )}
            </div>

            <div className="tw-flex-1 tw-pb-4">
                <div className="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-2">
                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-700">
                        {activity.title}
                        {activity.performedBy && (
                            <span className="tw-font-normal tw-text-gray-500">
                                {" "}
                                · {activity.performedBy}
                            </span>
                        )}
                    </p>

                    <Button
                        type="button"
                        variant="linkBtn"
                        className="tw-flex tw-items-center tw-gap-1 tw-text-sm tw-font-semibold"
                        onClick={toggleHndlr}
                    >
                        {isExpanded ? "Less" : "More"}
                        <HugeiconsIcon
                            icon={ArrowDown01Icon}
                            size={16}
                            className={
                                isExpanded
                                    ? "tw-rotate-180"
                                    : ""
                            }
                        />
                    </Button>
                </div>

                {isExpanded && activity.description && (
                    <p className="tw-mb-0 tw-mt-1 tw-text-sm tw-text-gray-600">
                        {activity.description}
                    </p>
                )}

                <p className="tw-mb-0 tw-mt-1 tw-flex tw-items-center tw-gap-1 tw-text-xs tw-text-gray-400">
                    <HugeiconsIcon
                        icon={Clock01Icon}
                        size={14}
                    />
                    {activity.relativeText}
                </p>
            </div>
        </div>
    );
};

const LeadHistoryModal = ({
    data,
    toggle,
}: ILeadHistoryModal) => {
    const [activityFilter, setActivityFilter] =
        useState<string>("all");
    const [expandedActivityIds, setExpandedActivityIds] =
        useState<string[]>([]);

    const leadHistory = useMemo(
        () => getLeadHistory(data),
        [data],
    );

    const filteredActivities = useMemo(() => {
        if (activityFilter === "all") {
            return leadHistory.activities;
        }

        return leadHistory.activities.filter(
            activity =>
                activityFilterGroupMap[activity.type] ===
                activityFilter,
        );
    }, [leadHistory.activities, activityFilter]);

    const activityFilterOptionsWithCount = useMemo(
        () =>
            leadActivityFilterOptions.map(item => ({
                ...item,
                name:
                    item.id === "all"
                        ? `${item.name} (${leadHistory.activities.length})`
                        : `${item.name} (${leadHistory.activities.filter(
                            activity =>
                                activityFilterGroupMap[
                                activity.type
                                ] === item.id,
                        ).length})`,
            })),
        [leadHistory.activities],
    );

    const activityFilterChangeHandler = (
        event: ChangeEvent<HTMLSelectElement>,
    ) => {
        setActivityFilter(event.target.value);
    };

    const activityToggleHandler = (activityId: string) => {
        setExpandedActivityIds(prevState =>
            prevState.includes(activityId)
                ? prevState.filter(
                    item => item !== activityId,
                )
                : [...prevState, activityId],
        );
    };

    return (
        <div className="tw-bg-white">
            <div className="tw-border-b tw-border-gray-200 tw-p-4">
                <div className="row tw-gap-y-3 tw-mb-4">
                    <div className="col-12 col-md-6 col-xl-3">
                        <SummaryTile
                            labelText="Current stage"
                            value={leadHistory.currentStage}
                            icon={PencilEdit02Icon}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-xl-3">
                        <SummaryTile
                            labelText="Current sub-stage"
                            value={
                                leadHistory.currentSubStage
                            }
                            icon={UserCheck01Icon}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-xl-3">
                        <SummaryTile
                            labelText="Next follow-up"
                            value={leadHistory.nextFollowUp}
                            icon={Calendar03Icon}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-xl-3">
                        <SummaryTile
                            labelText="Lead owner"
                            value={leadHistory.leadOwner}
                            icon={UserAdd01Icon}
                        />
                    </div>
                </div>
            </div>

            <div className="tw-p-4">
                <div className="tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-4">
                    <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                        <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-uppercase tw-text-gray-700">
                            Lead timeline
                        </p>
                    </div>

                    <div className="tw-mt-4 tw-overflow-x-auto">
                        <div className="tw-flex tw-min-w-[560px] tw-items-start">
                            {leadHistory.milestones.map(
                                (
                                    milestone,
                                    milestoneIndex,
                                ) => (
                                    <div
                                        key={milestone.id}
                                        className="tw-relative tw-flex tw-flex-1 tw-items-start"
                                    >
                                        {milestoneIndex <
                                            leadHistory
                                                .milestones
                                                .length -
                                            1 && (
                                                <div className="tw-absolute tw-left-1/2 tw-right-[-50%] tw-top-5 tw-h-px tw-bg-gray-200 tw-z-10"></div>
                                            )}
                                        <MilestoneItem
                                            milestone={
                                                milestone
                                            }
                                        />
                                    </div>
                                ),
                            )}
                        </div>
                    </div>
                </div>

                <div className="tw-mt-4 tw-rounded tw-border tw-border-gray-200 tw-bg-white tw-p-4">
                    <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                        <div>
                            <p className="tw-mb-1 tw-text-base tw-font-semibold tw-text-gray-900">
                                Activity
                            </p>
                            <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                {leadHistory.activities.length}{" "}
                                {leadHistory.activities
                                    .length === 1
                                    ? "entry"
                                    : "entries"}
                            </p>
                        </div>

                        <div className="tw-flex tw-items-center tw-gap-2">
                            <HugeiconsIcon
                                icon={FilterIcon}
                                className="tw-text-gray-400"
                                size={18}
                            />
                            <SelectInput
                                name="activityFilter"
                                value={activityFilter}
                                onChange={
                                    activityFilterChangeHandler
                                }
                                menuItems={
                                    activityFilterOptionsWithCount
                                }
                                valueKey="id"
                                textKey="name"
                                hideSelectOption
                                formgroupClassName="tw-mb-0"
                                customWidth="200px"
                            />
                        </div>
                    </div>

                    <div className="tw-mt-4">
                        {filteredActivities.length ? (
                            filteredActivities.map(
                                (
                                    activity,
                                    activityIndex,
                                ) => (
                                    <ActivityItem
                                        key={activity.id}
                                        activity={activity}
                                        isLastItem={
                                            activityIndex ===
                                            filteredActivities.length -
                                            1
                                        }
                                        isExpanded={expandedActivityIds.includes(
                                            activity.id,
                                        )}
                                        toggleHndlr={() =>
                                            activityToggleHandler(
                                                activity.id,
                                            )
                                        }
                                    />
                                ),
                            )
                        ) : (
                            <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                                No activity found for the
                                selected filter
                            </p>
                        )}
                    </div>
                </div>

                <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={toggle}
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LeadHistoryModal;

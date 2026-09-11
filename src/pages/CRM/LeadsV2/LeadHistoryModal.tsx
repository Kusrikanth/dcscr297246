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
    LinkForwardIcon,
    Message01Icon,
    PencilEdit02Icon,
    Recycle03Icon,
    UserAdd01Icon,
    UserCheck01Icon,
} from "@hugeicons-pro/core-stroke-standard";

import {
    Button,
    SelectInput,
} from "../../../Components/Common";
import { leadMeta } from "./data";
import {
    activityFilterGroupMap,
    buildLeadMilestones,
    displayNameOf,
    employeeName,
    formatDateTime,
    leadActivityFilterOptions,
    relativeText,
    type LeadHistoryMilestone,
} from "./helper";
import type { LeadActivity, LeadRecord } from "./types";

interface LeadHistoryModalProps {
    lead: LeadRecord;
    toggle?: () => void;
}

type HistoryIcon = typeof UserAdd01Icon;

const milestoneIconMap: Record<string, HistoryIcon> = {
    added: UserAdd01Icon,
    updated: PencilEdit02Icon,
    referred: UserCheck01Icon,
    "re-enquired": Recycle03Icon,
    "next-follow-up": Calendar03Icon,
};

const activityIconMap: Record<string, HistoryIcon> = {
    created: UserAdd01Icon,
    stage: PencilEdit02Icon,
    followup: Calendar03Icon,
    communication: Message01Icon,
    referral: LinkForwardIcon,
    workflow: Clock01Icon,
};

const SummaryTile = ({
    labelText,
    value,
    icon,
}: {
    labelText: string;
    value: string;
    icon: HistoryIcon;
}) => (
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

const MilestoneItem = ({
    milestone,
}: {
    milestone: LeadHistoryMilestone;
}) => (
    <div className="tw-flex tw-min-w-[110px] tw-flex-1 tw-flex-col tw-items-center tw-text-center">
        <div
            className={`tw-z-20 tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-full ${milestone.isCompleted
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

const ActivityItem = ({
    activity,
    isLastItem,
    isExpanded,
    toggleHndlr,
}: {
    activity: LeadActivity;
    isLastItem: boolean;
    isExpanded: boolean;
    toggleHndlr: () => void;
}) => (
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
                            isExpanded ? "tw-rotate-180" : ""
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
                <HugeiconsIcon icon={Clock01Icon} size={14} />
                {formatDateTime(activity.createdAt)}
                {relativeText(activity.createdAt) &&
                    ` · ${relativeText(activity.createdAt)}`}
            </p>
        </div>
    </div>
);

const LeadHistoryModal = ({
    lead,
    toggle,
}: LeadHistoryModalProps) => {
    const [activityFilter, setActivityFilter] =
        useState<string>("all");
    const [expandedActivityIds, setExpandedActivityIds] =
        useState<string[]>([]);

    const milestones = useMemo(
        () => buildLeadMilestones(lead),
        [lead],
    );

    const activities = useMemo(
        () => lead.activities || [],
        [lead.activities],
    );

    const filteredActivities = useMemo(() => {
        if (activityFilter === "all") {
            return activities;
        }

        return activities.filter(
            activity =>
                activityFilterGroupMap[activity.type] ===
                activityFilter,
        );
    }, [activities, activityFilter]);

    const activityFilterOptionsWithCount = useMemo(
        () =>
            leadActivityFilterOptions.map(item => ({
                ...item,
                name:
                    item.id === "all"
                        ? `${item.name} (${activities.length})`
                        : `${item.name} (${activities.filter(
                            activity =>
                                activityFilterGroupMap[
                                activity.type
                                ] === item.id,
                        ).length})`,
            })),
        [activities],
    );

    const activityToggleHandler = (activityId: string) => {
        setExpandedActivityIds(prevState =>
            prevState.includes(activityId)
                ? prevState.filter(item => item !== activityId)
                : [...prevState, activityId],
        );
    };

    return (
        <div className="tw-bg-white">
            <div className="tw-border-b tw-border-gray-200 tw-p-4">
                <div className="tw-mb-3">
                    <p className="tw-mb-0 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-400">
                        Lead history
                    </p>
                    <h5 className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-900">
                        {lead.studentName}
                    </h5>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                        {lead.leadId}
                    </p>
                </div>

                <div className="row tw-gap-y-3">
                    <div className="col-12 col-md-6 col-xl-3">
                        <SummaryTile
                            labelText="Current stage"
                            value={displayNameOf(
                                leadMeta.stages,
                                lead.stageId,
                            )}
                            icon={PencilEdit02Icon}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-xl-3">
                        <SummaryTile
                            labelText="Current sub-stage"
                            value={
                                displayNameOf(
                                    leadMeta.substages,
                                    lead.substageId,
                                ) || "Not specified"
                            }
                            icon={UserCheck01Icon}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-xl-3">
                        <SummaryTile
                            labelText="Next follow-up"
                            value={
                                formatDateTime(
                                    lead.nextFollowupAt,
                                ) || "Not scheduled"
                            }
                            icon={Calendar03Icon}
                        />
                    </div>
                    <div className="col-12 col-md-6 col-xl-3">
                        <SummaryTile
                            labelText="Lead owner"
                            value={
                                employeeName(
                                    leadMeta,
                                    lead.ownerEmployeeId,
                                ) || "Unassigned"
                            }
                            icon={UserAdd01Icon}
                        />
                    </div>
                </div>
            </div>

            <div className="tw-p-4">
                <div className="tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-4">
                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-uppercase tw-text-gray-700">
                        Lead timeline
                    </p>

                    <div className="tw-mt-4 tw-overflow-x-auto">
                        <div className="tw-flex tw-min-w-[560px] tw-items-start">
                            {milestones.map(
                                (milestone, milestoneIndex) => (
                                    <div
                                        key={milestone.id}
                                        className="tw-relative tw-flex tw-flex-1 tw-items-start"
                                    >
                                        {milestoneIndex <
                                            milestones.length -
                                            1 && (
                                                <div className="tw-absolute tw-left-1/2 tw-right-[-50%] tw-top-5 tw-z-10 tw-h-px tw-bg-gray-200"></div>
                                            )}
                                        <MilestoneItem
                                            milestone={milestone}
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
                                {activities.length}{" "}
                                {activities.length === 1
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
                                onChange={(
                                    event: ChangeEvent<HTMLSelectElement>,
                                ) =>
                                    setActivityFilter(
                                        event.target.value,
                                    )
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
                                (activity, activityIndex) => (
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
                                No activity found for the selected
                                filter
                            </p>
                        )}
                    </div>
                </div>

                {toggle && (
                    <div className="tw-mt-4 tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-pt-4">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={toggle}
                        >
                            Close
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadHistoryModal;

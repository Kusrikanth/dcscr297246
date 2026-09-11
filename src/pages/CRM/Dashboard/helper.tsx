import {
    reportLeads,
    reportPalette,
    type ReportLead,
} from "../Reports/helper";

export interface DashboardLead extends ReportLead {
    branch: string;
    substage: string;
    curriculum: string;
    referredAt: string;
    reEnquiredAt: string;
    followupDoneAt: string;
}

export type DashboardDateField =
    | "addedAt"
    | "updatedAt"
    | "referredAt"
    | "nextFollowup"
    | "reEnquiredAt";

export interface DashboardFilterState {
    branches: string[];
    owners: string[];
    stages: string[];
    substages: string[];
    channels: string[];
    sources: string[];
    campaigns: string[];
    dateField: DashboardDateField;
    dateFrom: string;
    dateTo: string;
}

export interface DashboardOption {
    id: string;
    name: string;
}

export interface ActivityPoint {
    day: string;
    leads: number;
    crmHours: number;
}

export interface FunnelSlice {
    label: string;
    value: number;
    color: string;
}

export interface DashboardStatCard {
    id: string;
    label: string;
    value: number;
    trend: string;
    trendTone: "up" | "down" | "warning" | "neutral";
    icon: string;
    iconClassName: string;
}

const pad = (value: number) => String(value).padStart(2, "0");

export const dateKey = (
    value: string | Date | undefined | null,
) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const dayOffsetKey = (offsetDays: number) => {
    const date = new Date();

    date.setDate(date.getDate() + offsetDays);

    return dateKey(date);
};

export const formatDayLabel = (day: string) =>
    day
        ? new Date(`${day}T00:00:00`).toLocaleDateString(
            "en-IN",
            { day: "2-digit", month: "short" },
        )
        : "";

export const daysBetween = (from: string, to: string) => {
    if (!from || !to || from > to) {
        return [];
    }

    const days: string[] = [];
    const cursor = new Date(`${from}T00:00:00`);
    const end = new Date(`${to}T00:00:00`);

    while (cursor <= end && days.length < 732) {
        days.push(dateKey(cursor));
        cursor.setDate(cursor.getDate() + 1);
    }

    return days;
};

export const greeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
        return "morning";
    }

    if (hour < 18) {
        return "afternoon";
    }

    return "evening";
};

export const todayLabel = () =>
    new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

const curriculaByIndex = [
    "CBSE",
    "Cambridge",
    "Integrated",
];

const substagesByStage: Record<string, string[]> = {
    Untouched: ["New Lead", "New - Pending"],
    Contacted: ["Call attempted", "Callback requested"],
    Counselling: ["Counselling scheduled", "Counselling done"],
    "Campus Visit": ["Visit scheduled", "Campus visit done"],
    Application: [
        "Application shared",
        "Application submitted",
    ],
    Admitted: ["Admission confirmed"],
};

export const dashboardLeads: DashboardLead[] = reportLeads.map(
    (lead, index) => {
        const addedOffset = -((index * 2) % 58) - 1;
        const updatedOffset = Math.min(
            0,
            addedOffset + (index % 5),
        );
        const substages =
            substagesByStage[lead.stage] || ["Not specified"];

        const followupOffset =
            index % 5 === 0
                ? null
                : ((index % 7) - 3);

        return {
            ...lead,
            branch: lead.branchName,
            curriculum:
                curriculaByIndex[index % curriculaByIndex.length],
            substage: substages[index % substages.length],
            addedAt: dayOffsetKey(addedOffset),
            updatedAt: dayOffsetKey(updatedOffset),
            nextFollowup:
                followupOffset === null
                    ? ""
                    : dayOffsetKey(followupOffset),
            referredAt:
                index % 4 === 0
                    ? dayOffsetKey(
                        Math.min(0, addedOffset + 2),
                    )
                    : "",
            reEnquiredAt:
                index % 6 === 0
                    ? dayOffsetKey(
                        Math.min(0, addedOffset + 4),
                    )
                    : "",
            followupDoneAt:
                index % 3 === 0
                    ? dayOffsetKey(-(index % 3))
                    : "",
        };
    },
);

export const dashboardDateFieldOptions = [
    { id: "addedAt", name: "Lead added" },
    { id: "updatedAt", name: "Lead updated" },
    { id: "referredAt", name: "Lead referred" },
    { id: "nextFollowup", name: "Next follow-up" },
    { id: "reEnquiredAt", name: "Re-enquired" },
];

export const initialDashboardFilters: DashboardFilterState = {
    branches: [],
    owners: [],
    stages: [],
    substages: [],
    channels: [],
    sources: [],
    campaigns: [],
    dateField: "addedAt",
    dateFrom: "",
    dateTo: "",
};

const optionsOf = (
    leads: DashboardLead[],
    key: keyof DashboardLead,
): DashboardOption[] =>
    [
        ...new Set(
            leads
                .map(lead => String(lead[key] || ""))
                .filter(Boolean),
        ),
    ]
        .sort((left, right) => left.localeCompare(right))
        .map(value => ({ id: value, name: value }));

export const buildFilterOptions = (
    leads: DashboardLead[],
    filters: DashboardFilterState,
) => {
    const inSelectedBranches = filters.branches.length
        ? leads.filter(lead =>
            filters.branches.includes(lead.branch),
        )
        : leads;

    const inSelectedStages = filters.stages.length
        ? inSelectedBranches.filter(lead =>
            filters.stages.includes(lead.stage),
        )
        : inSelectedBranches;

    const inSelectedChannels = filters.channels.length
        ? inSelectedBranches.filter(lead =>
            filters.channels.includes(lead.channel),
        )
        : inSelectedBranches;

    const inSelectedSources = filters.sources.length
        ? inSelectedChannels.filter(lead =>
            filters.sources.includes(lead.source),
        )
        : inSelectedChannels;

    return {
        branches: optionsOf(leads, "branch"),
        owners: optionsOf(inSelectedBranches, "owner"),
        stages: optionsOf(inSelectedBranches, "stage"),
        substages: optionsOf(inSelectedStages, "substage"),
        channels: optionsOf(inSelectedBranches, "channel"),
        sources: optionsOf(inSelectedSources, "source"),
        campaigns: optionsOf(inSelectedSources, "campaign"),
    };
};

const matchesMulti = (selected: string[], value: string) =>
    !selected.length || selected.includes(String(value || ""));

export const applyDashboardFilters = (
    leads: DashboardLead[],
    filters: DashboardFilterState,
) =>
    leads.filter(lead => {
        if (!matchesMulti(filters.branches, lead.branch)) {
            return false;
        }

        if (!matchesMulti(filters.owners, lead.owner)) {
            return false;
        }

        if (!matchesMulti(filters.stages, lead.stage)) {
            return false;
        }

        if (!matchesMulti(filters.substages, lead.substage)) {
            return false;
        }

        if (!matchesMulti(filters.channels, lead.channel)) {
            return false;
        }

        if (!matchesMulti(filters.sources, lead.source)) {
            return false;
        }

        if (!matchesMulti(filters.campaigns, lead.campaign)) {
            return false;
        }

        if (!filters.dateFrom && !filters.dateTo) {
            return true;
        }

        const value = String(lead[filters.dateField] || "");

        if (!value) {
            return false;
        }

        const day = dateKey(value);

        return (
            (!filters.dateFrom || day >= filters.dateFrom) &&
            (!filters.dateTo || day <= filters.dateTo)
        );
    });

export const dashboardFilterCount = (
    filters: DashboardFilterState,
) =>
    [
        filters.branches.length > 0,
        filters.owners.length > 0,
        filters.stages.length > 0,
        filters.substages.length > 0,
        filters.channels.length > 0,
        filters.sources.length > 0,
        filters.campaigns.length > 0,
        Boolean(filters.dateFrom || filters.dateTo),
    ].filter(Boolean).length;

export const applyFilterCascade = (
    filters: DashboardFilterState,
    key: keyof DashboardFilterState,
    values: string[],
): DashboardFilterState => ({
    ...filters,
    [key]: values,
    ...(key === "branches"
        ? { owners: [], stages: [], substages: [] }
        : {}),
    ...(key === "stages" ? { substages: [] } : {}),
    ...(key === "channels" ? { sources: [], campaigns: [] } : {}),
    ...(key === "sources" ? { campaigns: [] } : {}),
});

const comparisonLabel = (
    current: number,
    previous: number,
    suffix: string,
) => {
    if (!previous) {
        return current ? `No ${suffix} baseline` : "";
    }

    const change = ((current - previous) / previous) * 100;

    return `${change > 0 ? "+" : ""}${change.toFixed(1)}% ${suffix}`;
};

export const buildStatCards = (
    leads: DashboardLead[],
): DashboardStatCard[] => {
    const today = dayOffsetKey(0);
    const weekAgo = dayOffsetKey(-7);
    const twoWeeksAgo = dayOffsetKey(-14);
    const yesterday = dayOffsetKey(-1);

    const newThisWeek = leads.filter(
        lead => lead.addedAt && lead.addedAt >= weekAgo,
    ).length;

    const newPreviousWeek = leads.filter(
        lead =>
            lead.addedAt &&
            lead.addedAt >= twoWeeksAgo &&
            lead.addedAt < weekAgo,
    ).length;

    const followupsDue = leads.filter(
        lead => lead.nextFollowup && lead.nextFollowup <= today,
    ).length;

    const followupsOverdue = leads.filter(
        lead => lead.nextFollowup && lead.nextFollowup < today,
    ).length;

    const followupsDoneToday = leads.filter(
        lead => lead.followupDoneAt === today,
    ).length;

    const followupsDoneYesterday = leads.filter(
        lead => lead.followupDoneAt === yesterday,
    ).length;

    return [
        {
            id: "total-leads",
            label: "Total Leads",
            value: leads.length,
            trend: "In the current view",
            trendTone: "neutral",
            icon: "ri-team-line",
            iconClassName:
                "tw-bg-purple-100 tw-text-purple-600",
        },
        {
            id: "new-this-week",
            label: "New This Week",
            value: newThisWeek,
            trend: comparisonLabel(
                newThisWeek,
                newPreviousWeek,
                "vs previous week",
            ),
            trendTone:
                newThisWeek >= newPreviousWeek ? "up" : "down",
            icon: "ri-line-chart-line",
            iconClassName: "tw-bg-blue-100 tw-text-blue-600",
        },
        {
            id: "followups-due",
            label: "Follow-ups Due",
            value: followupsDue,
            trend: `${followupsOverdue.toLocaleString()} overdue`,
            trendTone: followupsOverdue
                ? "warning"
                : "neutral",
            icon: "ri-time-line",
            iconClassName: "tw-bg-amber-100 tw-text-amber-600",
        },
        {
            id: "followups-done",
            label: "Follow-ups Done",
            value: followupsDoneToday,
            trend: comparisonLabel(
                followupsDoneToday,
                followupsDoneYesterday,
                "vs yesterday",
            ),
            trendTone:
                followupsDoneToday >= followupsDoneYesterday
                    ? "up"
                    : "down",
            icon: "ri-checkbox-circle-line",
            iconClassName:
                "tw-bg-emerald-100 tw-text-emerald-600",
        },
    ];
};

export const dashboardStages = [
    "Untouched",
    "Contacted",
    "Counselling",
    "Campus Visit",
    "Application",
    "Admitted",
];

export const buildFunnel = (
    leads: DashboardLead[],
): FunnelSlice[] =>
    dashboardStages.map((stage, index) => ({
        label: stage,
        value: leads.filter(lead => lead.stage === stage)
            .length,
        color: reportPalette[index % reportPalette.length],
    }));

const crmHoursFor = (day: string) => {
    const date = new Date(`${day}T00:00:00`);
    const weekday = date.getDay();

    if (weekday === 0) {
        return 0;
    }

    const seed = date.getDate() + date.getMonth() * 31;

    return Number(
        (3 + ((seed * 7) % 45) / 10).toFixed(1),
    );
};

export const buildActivityTrends = (
    leads: DashboardLead[],
    filters: DashboardFilterState,
): ActivityPoint[] => {
    const from = filters.dateFrom || dayOffsetKey(-13);
    const to = filters.dateTo || dayOffsetKey(0);

    return daysBetween(from, to).map(day => ({
        day,
        crmHours: crmHoursFor(day),
        leads: leads.filter(
            lead =>
                dateKey(
                    String(lead[filters.dateField] || ""),
                ) === day,
        ).length,
    }));
};

export const formatHours = (value: number) => {
    const totalMinutes = Math.max(
        0,
        Math.round((Number(value) || 0) * 60),
    );

    return `${pad(Math.floor(totalMinutes / 60))}:${pad(totalMinutes % 60)}`;
};

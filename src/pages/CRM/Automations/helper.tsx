export interface MetaOption {
    id: string;
    name: string;
}

export interface LeadMeta {
    stages: Array<MetaOption>;
    substages: Array<MetaOption>;
    branches: Array<MetaOption>;
    sources: Array<MetaOption>;
    channels: Array<MetaOption>;
    campaigns: Array<MetaOption>;
    classes: Array<MetaOption>;
    curricula: Array<MetaOption>;
    employees: Array<MetaOption>;
}

export interface AutomationCondition {
    field: string;
    operator: string;
    values: Array<MetaOption>;
    subgroup: boolean;
    joinWith: string;
    dateMode: string;
    duration: string;
    durationUnit: string;
    dateFrom: string;
    dateTo: string;
}

export interface AutomationAction {
    type: string;
    field: string;
    value: string;
    delay: string;
    integrationId: string;
    templateId: string;
    templateName: string;
    templateBody: string;
    templateLanguage: string;
    templateParams: Array<string>;
}

export interface AutomationDefinition {
    conditions: Array<AutomationCondition>;
    logic: string;
    actions: Array<AutomationAction>;
    noRecheckAfterDelay: boolean;
}

export interface AutomationWorkflow {
    id: string;
    name: string;
    category: string;
    createdBy: string;
    createdAt: string;
    startAt: string;
    isActive: boolean;
    lastStatus: string;
    completedCount: number;
    failedCount: number;
    skippedCount: number;
    pendingCount: number;
    definition: AutomationDefinition;
}

export interface MarketingCampaign {
    id: string;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    ruleType: string;
    gapDays: number;
    integrationName: string;
    recipientCount: number;
    primaryCount: number;
    alternateCount: number;
    communicationCount: number;
    firstCommunicationAt: string;
    totalDeliveries: number;
    pendingDeliveries: number;
    queuedDeliveries: number;
    sentDeliveries: number;
    deliveredDeliveries: number;
    readDeliveries: number;
    completedDeliveries: number;
    failedDeliveries: number;
}

export interface AssignmentRule {
    id: string;
    name: string;
    createdAt: string;
    branchIds: Array<string>;
    sourceIds: Array<string>;
    employeeIds: Array<string>;
    isActive: boolean;
}

export const automationCategories = [
    {
        id: "attribute",
        title: "Update attributes, fields or add milestones",
        lines: [
            "Update priority, stage, owner or other lead fields",
            "Add time delay or update immediately",
        ],
    },
    {
        id: "immediate",
        title: "Send immediate communication",
        lines: [
            "Send a single email, SMS or WhatsApp message",
            "No dependent actions are added",
        ],
    },
    {
        id: "timed",
        title: "Nurture with time based workflow",
        lines: [
            "Send multiple communications with delays",
            "Add dependent actions and update fields",
        ],
    },
    {
        id: "outcome",
        title: "Nurture with action or outcome based workflow",
        lines: [
            "Branch based on delivery, response or outcome",
            "Add delays and dependent actions",
        ],
    },
];

export const conditionFieldOptions = [
    { id: "stage", name: "Stage" },
    { id: "substage", name: "Substage" },
    { id: "branch", name: "Branch" },
    { id: "source", name: "Source" },
    { id: "channel", name: "Channel" },
    { id: "campaign", name: "Campaign" },
    { id: "class", name: "Class" },
    { id: "curriculum", name: "Curriculum" },
    { id: "owner", name: "Owner" },
    { id: "addedDate", name: "Added date" },
    { id: "modifiedDate", name: "Modified date" },
];

export const dateConditionFields = ["addedDate", "modifiedDate"];

export const listOperatorOptions = [
    { id: "includes", name: "includes" },
    { id: "excludes", name: "excludes" },
    { id: "equals", name: "equals" },
    { id: "not_equals", name: "does not equal" },
    { id: "is_empty", name: "is empty" },
    { id: "not_empty", name: "is not empty" },
];

export const valuelessOperators = ["is_empty", "not_empty"];

export const dateOperatorOptions = [
    { id: "within_last", name: "is within last" },
    { id: "not_within_last", name: "is not within last" },
    { id: "on", name: "is on" },
    { id: "before", name: "is before" },
    { id: "after", name: "is after" },
    { id: "between", name: "is between" },
];

export const dateModeOptions = [
    { id: "relative", name: "Flexible (relative)" },
    { id: "absolute", name: "Fixed date" },
];

export const durationUnitOptions = [
    { id: "minutes", name: "Minutes" },
    { id: "hours", name: "Hours" },
    { id: "days", name: "Days" },
    { id: "weeks", name: "Weeks" },
    { id: "months", name: "Months" },
];

export const actionTypeOptions = [
    { id: "update", name: "Update attribute" },
    { id: "email", name: "Send email" },
    { id: "sms", name: "Send SMS" },
    { id: "whatsapp", name: "Send WhatsApp" },
    { id: "task", name: "Create task" },
];

export const unconfigurableActionTypes = ["email", "sms", "task"];

export const actionFieldOptions = [
    { id: "stage", name: "Stage" },
    { id: "substage", name: "Sub-stage" },
    { id: "owner", name: "Owner" },
    { id: "score", name: "Lead score" },
];

export const actionDelayOptions = [
    { id: "immediate", name: "Immediate" },
    { id: "1h", name: "After 1 hour" },
    { id: "1d", name: "After 1 day" },
    { id: "3d", name: "After 3 days" },
];

export const campaignStatusOptions = [
    { id: "ACTIVE", name: "Active" },
    { id: "PAUSED", name: "Paused" },
    { id: "COMPLETED", name: "Completed" },
    { id: "CANCELLED", name: "Cancelled" },
];

export const blankCondition = (): AutomationCondition => ({
    field: "stage",
    operator: "includes",
    values: [],
    subgroup: false,
    joinWith: "and",
    dateMode: "relative",
    duration: "",
    durationUnit: "days",
    dateFrom: "",
    dateTo: "",
});

export const blankAction = (): AutomationAction => ({
    type: "update",
    field: "stage",
    value: "",
    delay: "immediate",
    integrationId: "",
    templateId: "",
    templateName: "",
    templateBody: "",
    templateLanguage: "en",
    templateParams: [],
});

export const currentSchedule = () => {
    const now = new Date();
    const pad = (value: number) => String(value).padStart(2, "0");

    return {
        startDate: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
        startTime: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
    };
};

export const formatDateTime = (value: string | undefined | null) =>
    value
        ? new Date(value).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "—";

export const getCategoryTitle = (categoryId: string) =>
    automationCategories.find(item => item.id === categoryId)?.title ||
    categoryId;

export const getCampaignRuleLabel = (campaign: MarketingCampaign) => {
    if (campaign.ruleType === "calendar_dates") {
        return "Selected calendar dates";
    }

    if (campaign.ruleType === "weekdays") {
        return "Selected weekdays";
    }

    const gap = Number(campaign.gapDays || 1);

    return `Every ${gap} day${gap === 1 ? "" : "s"}`;
};

export const getCampaignProgress = (campaign: MarketingCampaign) =>
    campaign.totalDeliveries
        ? Math.round(
            ((campaign.completedDeliveries + campaign.failedDeliveries) /
                campaign.totalDeliveries) *
            100,
        )
        : 0;

export const namesForIds = (
    ids: Array<string>,
    options: Array<MetaOption>,
) => {
    const byId = new Map(options.map(item => [String(item.id), item.name]));

    return ids.map(id => byId.get(String(id)) || `#${id}`);
};

export const getStatusLabelType = (status: string | undefined | null) => {
    switch (String(status || "").toUpperCase()) {
        case "ACTIVE":
        case "COMPLETED":
        case "SUCCESS":
            return "active";

        case "PAUSED":
        case "PENDING":
        case "PARTIAL":
            return "pending";

        case "CANCELLED":
        case "FAILED":
            return "rejected";

        case "INACTIVE":
            return "inactive";

        default:
            return "inprogress";
    }
};

export const leadMeta: LeadMeta = {
    stages: [
        { id: "1", name: "Enquiry" },
        { id: "2", name: "Campus Visit" },
        { id: "3", name: "Application" },
        { id: "4", name: "Follow Up" },
        { id: "5", name: "Admitted" },
        { id: "6", name: "Closed" },
    ],
    substages: [
        { id: "11", name: "Prospectus shared" },
        { id: "12", name: "Visit scheduled" },
        { id: "13", name: "Visit completed" },
        { id: "14", name: "Documents pending" },
        { id: "15", name: "Fee pending" },
        { id: "16", name: "Not interested" },
    ],
    branches: [
        { id: "1", name: "Nacharam" },
        { id: "2", name: "Secunderabad" },
        { id: "3", name: "Mahendra Hills" },
        { id: "4", name: "Khajaguda" },
        { id: "5", name: "Miyapur" },
        { id: "6", name: "Kompally" },
    ],
    sources: [
        { id: "21", name: "Website" },
        { id: "22", name: "Meta Lead Ads" },
        { id: "23", name: "Google Ads" },
        { id: "24", name: "Walk-in" },
        { id: "25", name: "Referral" },
    ],
    channels: [
        { id: "31", name: "Organic" },
        { id: "32", name: "Paid Social" },
        { id: "33", name: "Paid Search" },
        { id: "34", name: "Offline" },
    ],
    campaigns: [
        { id: "41", name: "Admissions Open 2026-27" },
        { id: "42", name: "Monsoon Admissions" },
        { id: "43", name: "Open House August" },
        { id: "44", name: "Transport Awareness" },
    ],
    classes: [
        { id: "51", name: "Nursery" },
        { id: "52", name: "Grade 1" },
        { id: "53", name: "Grade 2" },
        { id: "54", name: "Grade 3" },
        { id: "55", name: "Grade 5" },
        { id: "56", name: "Grade 8" },
    ],
    curricula: [
        { id: "61", name: "CBSE" },
        { id: "62", name: "ICSE" },
        { id: "63", name: "IB" },
        { id: "64", name: "State Board" },
    ],
    employees: [
        { id: "71", name: "Srikanth Reddy" },
        { id: "72", name: "Taufeeq Ahmed" },
        { id: "73", name: "Priya Nair" },
        { id: "74", name: "Ravi Teja" },
        { id: "75", name: "Anitha Rao" },
        { id: "76", name: "Mohammed Irfan" },
        { id: "77", name: "Sneha Kulkarni" },
        { id: "78", name: "Vikram Choudhary" },
    ],
};

export const getFieldOptions = (field: string): Array<MetaOption> => {
    switch (field) {
        case "stage":
            return leadMeta.stages;
        case "substage":
            return leadMeta.substages;
        case "branch":
            return leadMeta.branches;
        case "source":
            return leadMeta.sources;
        case "channel":
            return leadMeta.channels;
        case "campaign":
            return leadMeta.campaigns;
        case "class":
            return leadMeta.classes;
        case "curriculum":
            return leadMeta.curricula;
        case "owner":
            return leadMeta.employees;
        default:
            return [];
    }
};

export const automationWorkflows: Array<AutomationWorkflow> = [
    {
        id: "w1",
        name: "Untouched leads – assign counsellor",
        category: "attribute",
        createdBy: "Srikanth Reddy",
        createdAt: "2026-07-18T10:20:00",
        startAt: "2026-07-19T09:00:00",
        isActive: true,
        lastStatus: "completed",
        completedCount: 248,
        failedCount: 4,
        skippedCount: 12,
        pendingCount: 0,
        definition: {
            conditions: [
                {
                    ...blankCondition(),
                    field: "stage",
                    operator: "includes",
                    values: [{ id: "1", name: "Enquiry" }],
                },
                {
                    ...blankCondition(),
                    field: "owner",
                    operator: "is_empty",
                    subgroup: true,
                    joinWith: "and",
                },
            ],
            logic: "and",
            actions: [
                {
                    ...blankAction(),
                    type: "update",
                    field: "owner",
                    value: "73",
                    delay: "immediate",
                },
            ],
            noRecheckAfterDelay: false,
        },
    },
    {
        id: "w2",
        name: "Campus visit reminder – WhatsApp",
        category: "immediate",
        createdBy: "Priya Nair",
        createdAt: "2026-07-25T14:05:00",
        startAt: "2026-07-26T08:30:00",
        isActive: true,
        lastStatus: "partial",
        completedCount: 96,
        failedCount: 7,
        skippedCount: 0,
        pendingCount: 21,
        definition: {
            conditions: [
                {
                    ...blankCondition(),
                    field: "stage",
                    operator: "includes",
                    values: [{ id: "2", name: "Campus Visit" }],
                },
            ],
            logic: "and",
            actions: [
                {
                    ...blankAction(),
                    type: "whatsapp",
                    integrationId: "1",
                    templateId: "t2",
                    templateName: "campus_visit_confirmation",
                    templateBody:
                        "Dear {{1}}, your campus visit is confirmed for {{2}} at {{3}}. Please carry a photo ID at the reception.",
                    templateLanguage: "English",
                    templateParams: ["Parent", "tomorrow", "11:00 AM"],
                    delay: "immediate",
                },
            ],
            noRecheckAfterDelay: true,
        },
    },
    {
        id: "w3",
        name: "Stale enquiries – move to follow up",
        category: "timed",
        createdBy: "Taufeeq Ahmed",
        createdAt: "2026-08-02T11:40:00",
        startAt: "2026-08-03T07:00:00",
        isActive: false,
        lastStatus: "failed",
        completedCount: 0,
        failedCount: 3,
        skippedCount: 0,
        pendingCount: 0,
        definition: {
            conditions: [
                {
                    ...blankCondition(),
                    field: "modifiedDate",
                    operator: "not_within_last",
                    dateMode: "relative",
                    duration: "7",
                    durationUnit: "days",
                },
            ],
            logic: "and",
            actions: [
                {
                    ...blankAction(),
                    type: "update",
                    field: "stage",
                    value: "4",
                    delay: "1d",
                },
            ],
            noRecheckAfterDelay: false,
        },
    },
    {
        id: "w4",
        name: "Meta Ads leads – boost lead score",
        category: "outcome",
        createdBy: "Srikanth Reddy",
        createdAt: "2026-08-09T16:15:00",
        startAt: "2026-08-10T09:30:00",
        isActive: true,
        lastStatus: "",
        completedCount: 0,
        failedCount: 0,
        skippedCount: 0,
        pendingCount: 58,
        definition: {
            conditions: [
                {
                    ...blankCondition(),
                    field: "source",
                    operator: "includes",
                    values: [{ id: "22", name: "Meta Lead Ads" }],
                },
                {
                    ...blankCondition(),
                    field: "branch",
                    operator: "includes",
                    subgroup: true,
                    joinWith: "or",
                    values: [
                        { id: "1", name: "Nacharam" },
                        { id: "2", name: "Secunderabad" },
                    ],
                },
            ],
            logic: "and",
            actions: [
                {
                    ...blankAction(),
                    type: "update",
                    field: "score",
                    value: "80",
                    delay: "immediate",
                },
            ],
            noRecheckAfterDelay: false,
        },
    },
];

export const marketingCampaigns: Array<MarketingCampaign> = [
    {
        id: "c1",
        name: "Admissions Open 2026-27 – Grade 1 to 5",
        status: "ACTIVE",
        createdAt: "2026-08-01T09:30:00",
        updatedAt: "2026-08-13T18:10:00",
        createdBy: "Priya Nair",
        ruleType: "gap_days",
        gapDays: 3,
        integrationName: "DPS Admissions – Main",
        recipientCount: 1240,
        primaryCount: 1240,
        alternateCount: 418,
        communicationCount: 4,
        firstCommunicationAt: "2026-08-02T10:00:00",
        totalDeliveries: 4960,
        pendingDeliveries: 1180,
        queuedDeliveries: 240,
        sentDeliveries: 860,
        deliveredDeliveries: 1720,
        readDeliveries: 890,
        completedDeliveries: 3470,
        failedDeliveries: 70,
    },
    {
        id: "c2",
        name: "Monsoon Admissions – Secunderabad",
        status: "PAUSED",
        createdAt: "2026-07-20T11:15:00",
        updatedAt: "2026-08-11T09:45:00",
        createdBy: "Srikanth Reddy",
        ruleType: "weekdays",
        gapDays: 0,
        integrationName: "DPS Admissions – Secunderabad",
        recipientCount: 680,
        primaryCount: 680,
        alternateCount: 202,
        communicationCount: 3,
        firstCommunicationAt: "2026-07-22T09:00:00",
        totalDeliveries: 2040,
        pendingDeliveries: 640,
        queuedDeliveries: 0,
        sentDeliveries: 320,
        deliveredDeliveries: 760,
        readDeliveries: 290,
        completedDeliveries: 1370,
        failedDeliveries: 30,
    },
    {
        id: "c3",
        name: "Open House August – All branches",
        status: "COMPLETED",
        createdAt: "2026-07-05T08:00:00",
        updatedAt: "2026-07-31T20:00:00",
        createdBy: "Taufeeq Ahmed",
        ruleType: "calendar_dates",
        gapDays: 0,
        integrationName: "DPS Counselling Desk",
        recipientCount: 2150,
        primaryCount: 2150,
        alternateCount: 745,
        communicationCount: 2,
        firstCommunicationAt: "2026-07-08T10:30:00",
        totalDeliveries: 4300,
        pendingDeliveries: 0,
        queuedDeliveries: 0,
        sentDeliveries: 410,
        deliveredDeliveries: 2360,
        readDeliveries: 1420,
        completedDeliveries: 4190,
        failedDeliveries: 110,
    },
    {
        id: "c4",
        name: "Transport Awareness – Kompally route",
        status: "CANCELLED",
        createdAt: "2026-06-18T15:20:00",
        updatedAt: "2026-06-25T12:00:00",
        createdBy: "Ravi Teja",
        ruleType: "gap_days",
        gapDays: 1,
        integrationName: "DPS Admissions – Main",
        recipientCount: 320,
        primaryCount: 320,
        alternateCount: 96,
        communicationCount: 2,
        firstCommunicationAt: "2026-06-19T09:00:00",
        totalDeliveries: 640,
        pendingDeliveries: 380,
        queuedDeliveries: 0,
        sentDeliveries: 60,
        deliveredDeliveries: 160,
        readDeliveries: 48,
        completedDeliveries: 220,
        failedDeliveries: 40,
    },
];

export const assignmentRules: Array<AssignmentRule> = [
    {
        id: "r1",
        name: "Nacharam · Website leads",
        createdAt: "2026-07-12T10:00:00",
        branchIds: ["1"],
        sourceIds: ["21"],
        employeeIds: ["71", "73"],
        isActive: true,
    },
    {
        id: "r2",
        name: "Secunderabad · Paid campaigns",
        createdAt: "2026-07-22T14:30:00",
        branchIds: ["2"],
        sourceIds: ["22", "23"],
        employeeIds: ["72", "75"],
        isActive: true,
    },
    {
        id: "r3",
        name: "Walk-ins · All branches",
        createdAt: "2026-08-04T09:15:00",
        branchIds: ["1", "2", "3", "5"],
        sourceIds: ["24"],
        employeeIds: ["74", "76", "77"],
        isActive: false,
    },
    {
        id: "r4",
        name: "Referrals · Senior counsellors",
        createdAt: "2026-08-10T16:45:00",
        branchIds: ["3", "6"],
        sourceIds: ["25"],
        employeeIds: ["78"],
        isActive: true,
    },
];

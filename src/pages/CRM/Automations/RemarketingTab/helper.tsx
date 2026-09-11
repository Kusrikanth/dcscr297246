import type { SettingsOption } from "../../Settings/helper";

export interface RemarketingAudience {
    id: string;
    name: string;
    description: string;
    adAccountId: string;
    adAccountName: string;
    metaAudienceId: string;
    crmLeadCount: number;
    syncedLeadCount: number;
    syncType: string;
    syncInterval: string;
    status: string;
    lastSyncAt: string;
    lastError: string;
    createdBy: string;
    createdAt: string;
    filters: {
        branchId: string;
        stageId: string;
        sourceId: string;
        classId: string;
        curriculumId: string;
        campaignId: string;
        ownerEmployeeId: string;
        academicYear: string;
        admissionStatus: string;
        city: string;
        createdFrom: string;
        createdTo: string;
        metaOnly: string;
    };
    excludeStageId: string;
}

export interface AudienceMember {
    id: string;
    name: string;
    city: string;
    matchKeys: string;
    isEligible: boolean;
    syncStatus: string;
    lastSyncedAt: string;
}

export interface RemarketingSyncLog {
    id: string;
    audienceName: string;
    metaAudienceId: string;
    action: string;
    status: string;
    startedAt: string;
    completedAt: string;
    leadsConsidered: number;
    leadsAdded: number;
    leadsRemoved: number;
    leadsFailed: number;
    leadsSkipped: number;
    triggeredBy: string;
    triggeredByUser: string;
    errorMessage: string;
}

export const emptyAudienceFilters = {
    branchId: "",
    stageId: "",
    sourceId: "",
    classId: "",
    curriculumId: "",
    campaignId: "",
    ownerEmployeeId: "",
    academicYear: "",
    admissionStatus: "",
    city: "",
    createdFrom: "",
    createdTo: "",
    metaOnly: "",
};

export const syncTypeOptions: Array<SettingsOption> = [
    { id: "manual", name: "Manual" },
    { id: "automatic", name: "Automatic" },
];

export const syncIntervalOptions: Array<SettingsOption> = [
    { id: "daily", name: "Daily" },
    { id: "every_6_hours", name: "Every 6 hours" },
    { id: "every_12_hours", name: "Every 12 hours" },
    { id: "weekly", name: "Weekly" },
];

export const admissionStatusOptions: Array<SettingsOption> = [
    { id: "admitted", name: "Admitted" },
    { id: "not_admitted", name: "Not admitted" },
];

export const metaOnlyOptions: Array<SettingsOption> = [
    { id: "yes", name: "Only leads from Meta ads" },
];

export const syncLogStatusOptions: Array<SettingsOption> = [
    { id: "completed", name: "Completed" },
    { id: "partial", name: "Partial" },
    { id: "failed", name: "Failed" },
    { id: "running", name: "Running" },
];

export const metaAdAccounts: Array<SettingsOption> = [
    { id: "act-90210", name: "Digital Campus Ads · INR" },
    { id: "act-90211", name: "Campus Realty Ads · INR" },
];

export const audienceStatusTone = (status: string) => {
    if (status === "active") {
        return "active";
    }

    if (status === "error") {
        return "failed";
    }

    if (status === "paused") {
        return "pending";
    }

    return "new";
};

export const remarketingAudiences: Array<RemarketingAudience> = [
    {
        id: "1",
        name: "Admissions 2026 — Interested leads",
        description: "Leads that reached campus visit but have not admitted",
        adAccountId: "act-90210",
        adAccountName: "Digital Campus Ads · INR",
        metaAudienceId: "23861099274120117",
        crmLeadCount: 1840,
        syncedLeadCount: 1712,
        syncType: "automatic",
        syncInterval: "daily",
        status: "active",
        lastSyncAt: "2026-08-19T02:00:00",
        lastError: "",
        createdBy: "Srikanth Reddy",
        createdAt: "2026-06-02T11:20:00",
        filters: {
            ...emptyAudienceFilters,
            branchId: "1",
            stageId: "3",
        },
        excludeStageId: "5",
    },
    {
        id: "2",
        name: "Transport enquiries — Kompally",
        description: "",
        adAccountId: "act-90210",
        adAccountName: "Digital Campus Ads · INR",
        metaAudienceId: "",
        crmLeadCount: 260,
        syncedLeadCount: 0,
        syncType: "manual",
        syncInterval: "daily",
        status: "draft",
        lastSyncAt: "",
        lastError: "",
        createdBy: "ARJUN",
        createdAt: "2026-08-10T15:45:00",
        filters: { ...emptyAudienceFilters, branchId: "2" },
        excludeStageId: "",
    },
    {
        id: "3",
        name: "Campus visit no-shows",
        description: "Follow up on visits that never happened",
        adAccountId: "act-90211",
        adAccountName: "Campus Realty Ads · INR",
        metaAudienceId: "23861099274120994",
        crmLeadCount: 412,
        syncedLeadCount: 390,
        syncType: "automatic",
        syncInterval: "weekly",
        status: "paused",
        lastSyncAt: "2026-08-12T02:00:00",
        lastError: "",
        createdBy: "TARUN",
        createdAt: "2026-07-19T09:05:00",
        filters: { ...emptyAudienceFilters, stageId: "3", metaOnly: "yes" },
        excludeStageId: "5",
    },
    {
        id: "4",
        name: "Lost leads — re-engage",
        description: "",
        adAccountId: "act-90210",
        adAccountName: "Digital Campus Ads · INR",
        metaAudienceId: "23861099274121330",
        crmLeadCount: 980,
        syncedLeadCount: 0,
        syncType: "manual",
        syncInterval: "daily",
        status: "error",
        lastSyncAt: "2026-08-17T18:30:00",
        lastError:
            "Meta rejected the upload: the ad account has no active payment method",
        createdBy: "Srikanth Reddy",
        createdAt: "2026-05-28T13:10:00",
        filters: { ...emptyAudienceFilters, stageId: "6" },
        excludeStageId: "",
    },
];

export const audienceMembers: Array<AudienceMember> = [
    {
        id: "1",
        name: "Aarav Sharma",
        city: "Hyderabad",
        matchKeys: "phone, email",
        isEligible: true,
        syncStatus: "synced",
        lastSyncedAt: "2026-08-19T02:00:00",
    },
    {
        id: "2",
        name: "Raj Malhotra",
        city: "Secunderabad",
        matchKeys: "phone",
        isEligible: true,
        syncStatus: "synced",
        lastSyncedAt: "2026-08-19T02:00:00",
    },
    {
        id: "3",
        name: "Bowenpally Enquiry",
        city: "",
        matchKeys: "",
        isEligible: false,
        syncStatus: "pending",
        lastSyncedAt: "",
    },
    {
        id: "4",
        name: "Ishita Verma",
        city: "Hyderabad",
        matchKeys: "email",
        isEligible: true,
        syncStatus: "synced",
        lastSyncedAt: "2026-08-19T02:00:00",
    },
];

export const remarketingSyncLogs: Array<RemarketingSyncLog> = [
    {
        id: "1",
        audienceName: "Admissions 2026 — Interested leads",
        metaAudienceId: "23861099274120117",
        action: "delta",
        status: "completed",
        startedAt: "2026-08-19T02:00:00",
        completedAt: "2026-08-19T02:04:00",
        leadsConsidered: 1840,
        leadsAdded: 62,
        leadsRemoved: 8,
        leadsFailed: 0,
        leadsSkipped: 128,
        triggeredBy: "schedule",
        triggeredByUser: "",
        errorMessage: "",
    },
    {
        id: "2",
        audienceName: "Lost leads — re-engage",
        metaAudienceId: "23861099274121330",
        action: "full",
        status: "failed",
        startedAt: "2026-08-17T18:30:00",
        completedAt: "2026-08-17T18:31:00",
        leadsConsidered: 980,
        leadsAdded: 0,
        leadsRemoved: 0,
        leadsFailed: 980,
        leadsSkipped: 0,
        triggeredBy: "manual",
        triggeredByUser: "Srikanth Reddy",
        errorMessage:
            "Meta rejected the upload: the ad account has no active payment method",
    },
    {
        id: "3",
        audienceName: "Campus visit no-shows",
        metaAudienceId: "23861099274120994",
        action: "delta",
        status: "partial",
        startedAt: "2026-08-12T02:00:00",
        completedAt: "2026-08-12T02:03:00",
        leadsConsidered: 412,
        leadsAdded: 18,
        leadsRemoved: 2,
        leadsFailed: 4,
        leadsSkipped: 22,
        triggeredBy: "schedule",
        triggeredByUser: "",
        errorMessage: "4 leads had no usable match key",
    },
];

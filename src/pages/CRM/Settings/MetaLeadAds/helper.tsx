import {
    settingsBranches,
    settingsBusinessUnits,
    type SettingsOption,
} from "../helper";

export interface MetaConfiguration {
    appId: string;
    hasAppSecret: boolean;
    hasSystemUserToken: boolean;
    isConfigured: boolean;
    webhookUrl: string;
    verifyToken: string;
}

export interface MetaRouting {
    actorUserId: string;
    defaultBranchId: string;
    defaultBusinessUnitId: string;
}

export interface MetaPage {
    pageId: string;
    pageName: string;
    accountId: string;
    accountName: string;
    isSubscribed: boolean;
    branchId: string;
    businessUnitId: string;
    subscribeError: string;
}

export interface MetaLeadForm {
    formId: string;
    formName: string;
    pageId: string;
    formStatus: string;
    branchId: string;
    businessUnitId: string;
    stageId: string;
    substageId: string;
    questions: Array<{ key: string; label: string }>;
    fieldMapping: Record<string, string>;
}

export interface MetaImportRecord {
    leadgenId: string;
    status: "imported" | "duplicate" | "failed" | "skipped";
    leadNumber: string;
    campaignName: string;
    adName: string;
    errorMessage: string;
    createdAt: string;
}

export const metaCrmFieldOptions: Array<SettingsOption> = [
    { id: "", name: "— Ignore —" },
    { id: "studentName", name: "Student name" },
    { id: "firstName", name: "First name" },
    { id: "lastName", name: "Last name" },
    { id: "phone", name: "Phone" },
    { id: "alternatePhone", name: "Alternate phone" },
    { id: "email", name: "Email" },
    { id: "parentName", name: "Parent name" },
    { id: "city", name: "City" },
    { id: "state", name: "State" },
    { id: "postalCode", name: "PIN / postal code" },
    { id: "country", name: "Country" },
    { id: "applyingClass", name: "Applying class" },
    { id: "academicYear", name: "Academic year" },
];

export const branchNameFor = (branchId: string) =>
    settingsBranches.find(branch => branch.id === branchId)?.name || "";

export const businessUnitNameFor = (businessUnitId: string) =>
    settingsBusinessUnits.find(unit => unit.id === businessUnitId)?.name || "";

export const subscribedOptions: Array<SettingsOption> = [
    { id: "yes", name: "Receiving leads" },
    { id: "no", name: "Not receiving" },
];

export const formMappedOptions: Array<SettingsOption> = [
    { id: "yes", name: "Questions mapped" },
    { id: "no", name: "Not mapped yet" },
];

export const importStatusTone = (status: string) => {
    if (status === "imported") {
        return "active";
    }

    if (status === "failed") {
        return "failed";
    }

    if (status === "duplicate") {
        return "pending";
    }

    return "new";
};

export const metaConfiguration: MetaConfiguration = {
    appId: "1234567890123456",
    hasAppSecret: true,
    hasSystemUserToken: true,
    isConfigured: true,
    webhookUrl: "https://crm.digitalcampus.in/api/meta/webhook",
    verifyToken: "dc-meta-verify-9f3b2a",
};

export const metaRouting: MetaRouting = {
    actorUserId: "11",
    defaultBranchId: "1",
    defaultBusinessUnitId: "1",
};

export const metaPages: Array<MetaPage> = [
    {
        pageId: "1010101010",
        pageName: "Digital Campus Schools",
        accountId: "acct-1",
        accountName: "Digital Campus Marketing",
        isSubscribed: true,
        branchId: "1",
        businessUnitId: "1",
        subscribeError: "",
    },
    {
        pageId: "1010101011",
        pageName: "Digital Campus — Kompally",
        accountId: "acct-1",
        accountName: "Digital Campus Marketing",
        isSubscribed: true,
        branchId: "2",
        businessUnitId: "1",
        subscribeError: "",
    },
    {
        pageId: "2020202020",
        pageName: "Campus Realty",
        accountId: "acct-2",
        accountName: "Campus Realty Ads",
        isSubscribed: false,
        branchId: "",
        businessUnitId: "2",
        subscribeError:
            "Page token missing leads_retrieval — regenerate it in Business Settings",
    },
];

export const metaLeadForms: Array<MetaLeadForm> = [
    {
        formId: "form-9001",
        formName: "Admissions 2026-27 Enquiry",
        pageId: "1010101010",
        formStatus: "ACTIVE",
        branchId: "1",
        businessUnitId: "1",
        stageId: "1",
        substageId: "1",
        questions: [
            {
                key: "full_name",
                label: "What is your full name?",
            },
            {
                key: "phone_number",
                label: "Phone number",
            },
            {
                key: "email",
                label: "Email",
            },
            {
                key: "what_class_are_you_applying_for?",
                label: "What class are you applying for?",
            },
            {
                key: "city",
                label: "Which city do you live in?",
            },
            {
                key: "preferred_start_date",
                label: "When would you like to start?",
            },
        ],
        fieldMapping: {
            full_name: "studentName",
            phone_number: "phone",
            email: "email",
            "what_class_are_you_applying_for?": "applyingClass",
            city: "city",
        },
    },
    {
        formId: "form-9002",
        formName: "Open House Registration",
        pageId: "1010101011",
        formStatus: "ACTIVE",
        branchId: "2",
        businessUnitId: "1",
        stageId: "1",
        substageId: "",
        questions: [
            {
                key: "full_name",
                label: "What is your full name?",
            },
            {
                key: "phone_number",
                label: "Phone number",
            },
            {
                key: "parent_name",
                label: "Parent name",
            },
            {
                key: "preferred_slot",
                label: "Preferred open house slot",
            },
        ],
        fieldMapping: {
            full_name: "studentName",
            phone_number: "phone",
            parent_name: "parentName",
        },
    },
    {
        formId: "form-9003",
        formName: "Campus Realty Site Visit",
        pageId: "2020202020",
        formStatus: "PAUSED",
        branchId: "",
        businessUnitId: "2",
        stageId: "",
        substageId: "",
        questions: [
            {
                key: "full_name",
                label: "What is your full name?",
            },
            {
                key: "phone_number",
                label: "Phone number",
            },
            {
                key: "email",
                label: "Email",
            },
        ],
        fieldMapping: {
            full_name: "studentName",
            phone_number: "phone",
            email: "",
        },
    },
];

export const metaImports: Array<MetaImportRecord> = [
    {
        leadgenId: "lg-7781200341",
        status: "imported",
        leadNumber: "LEAD-24118",
        campaignName: "Admissions 2026-27",
        adName: "Class V Video Ad",
        errorMessage: "",
        createdAt: "2026-08-15T08:42:00",
    },
    {
        leadgenId: "lg-7781200338",
        status: "duplicate",
        leadNumber: "LEAD-24101",
        campaignName: "Admissions 2026-27",
        adName: "Carousel — Campus Tour",
        errorMessage: "Phone already on an open lead",
        createdAt: "2026-08-15T07:15:00",
    },
    {
        leadgenId: "lg-7781200330",
        status: "failed",
        leadNumber: "",
        campaignName: "Open House August",
        adName: "Open House Reminder",
        errorMessage: "No import user configured",
        createdAt: "2026-08-14T19:03:00",
    },
    {
        leadgenId: "lg-7781200322",
        status: "imported",
        leadNumber: "LEAD-24096",
        campaignName: "Admissions 2026-27",
        adName: "Class V Video Ad",
        errorMessage: "",
        createdAt: "2026-08-14T16:28:00",
    },
    {
        leadgenId: "lg-7781200310",
        status: "skipped",
        leadNumber: "",
        campaignName: "Campus Realty Launch",
        adName: "Site Visit Ad",
        errorMessage: "Form is not routed to a branch",
        createdAt: "2026-08-13T11:50:00",
    },
];

export const discoverablePages = {
    accountName: "Digital Campus Media",
    pages: [
        { pageId: "1010101010", name: "Digital Campus Schools" },
        { pageId: "1010101011", name: "Digital Campus — Kompally" },
        { pageId: "3030303030", name: "Digital Campus Junior College" },
        { pageId: "3030303031", name: "Digital Campus Sports Academy" },
    ],
};

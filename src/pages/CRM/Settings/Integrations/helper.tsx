import { formatDateTime, type SettingsOption } from "../helper";

export interface Integration {
    id: string;
    integrationName: string;
    providerName: string;
    status: string;
    accountLabel: string;
    createdAt: string;
    lastSyncAt: string;
    recordsSynced: number;
}

export interface IntegrationType {
    id: string;
    name: string;
    providers: Array<string>;
    isAvailable: boolean;
    icon: string;
    accent: string;
}

export const integrationTypes: Array<IntegrationType> = [
    {
        id: "google_sheets",
        name: "Google Sheets",
        providers: ["Google Sheets API v4"],
        isAvailable: true,
        icon: "ri-file-excel-2-line",
        accent: "#0f9d58",
    },
    {
        id: "smartping",
        name: "WhatsApp (Smartping)",
        providers: ["AiSensy Smartping"],
        isAvailable: true,
        icon: "ri-whatsapp-line",
        accent: "#25d366",
    },
    {
        id: "callerdesk",
        name: "Cloud Calling",
        providers: ["CallerDesk"],
        isAvailable: true,
        icon: "ri-phone-line",
        accent: "#3b82f6",
    },
    {
        id: "smartflo",
        name: "Tata Cloud Telephony",
        providers: ["Tata Smartflo"],
        isAvailable: true,
        icon: "ri-customer-service-2-line",
        accent: "#6366f1",
    },
    {
        id: "meta_lead_ads",
        name: "Meta Lead Ads",
        providers: ["Facebook / Instagram Lead Ads"],
        isAvailable: true,
        icon: "ri-facebook-circle-line",
        accent: "#1877f2",
    },
    {
        id: "sms",
        name: "SMS",
        providers: ["SmartPing SMS"],
        isAvailable: true,
        icon: "ri-message-2-line",
        accent: "#8b5cf6",
    },
    {
        id: "email",
        name: "Email",
        providers: ["SMTP"],
        isAvailable: true,
        icon: "ri-mail-line",
        accent: "#ea580c",
    },
];

export const providerNameMap: Record<string, string> = {
    "Google Sheets API v4": "google_sheets",
    "AiSensy Smartping": "smartping",
    "SmartPing SMS": "smartping_sms",
    SMTP: "smtp",
    CallerDesk: "callerdesk",
    "Tata Smartflo": "smartflo",
    "Facebook / Instagram Lead Ads": "meta_lead_ads",
};

export const integrationTypeOf = (integration: Integration) => {
    const provider = integration.providerName.toLowerCase();

    if (provider === "smartping_sms") {
        return "sms";
    }

    if (provider === "smtp") {
        return "email";
    }

    return provider;
};

export const providerScreens: Record<string, string> = {
    callerdesk: "/integrations/calling",
    smartflo: "/integrations/smartflo",
    meta_lead_ads: "/integrations/meta-lead-ads",
    google_sheets: "/integrations/google-sheets",
    smtp: "/integrations/email-configuration",
};

export const integrationStatusOptions: Array<SettingsOption> = [
    { id: "active", name: "Connected" },
    { id: "disconnected", name: "Disconnected" },
    { id: "error", name: "Error" },
    { id: "pending_auth", name: "Pending" },
];

const statusLabels: Record<string, string> = {
    active: "Connected",
    error: "Error",
    pending: "Pending",
    pending_auth: "Pending",
    inactive: "Not connected",
    disconnected: "Disconnected",
};

export const isAuthorized = (integration: Integration) =>
    ["active", "connected"].includes(integration.status);

export const statusLabel = (status: string) =>
    statusLabels[status] || status;

export const statusBadgeClass = (status: string) => {
    if (["active", "connected"].includes(status)) {
        return "badge-soft-success";
    }

    if (status === "error") {
        return "badge-soft-danger";
    }

    if (["pending", "pending_auth"].includes(status)) {
        return "badge-soft-warning";
    }

    return "badge-soft-secondary";
};

export const providerVisual = (providerName: string) => {
    const provider = providerName.toLowerCase();

    if (provider === "smartping_sms") {
        return { icon: "ri-message-2-line", tone: "tw-bg-violet-50 tw-text-violet-600" };
    }

    if (provider === "smtp") {
        return { icon: "ri-mail-line", tone: "tw-bg-orange-50 tw-text-orange-600" };
    }

    if (["smartping", "aisensy", "whatsapp"].some(token => provider.includes(token))) {
        return { icon: "ri-whatsapp-line", tone: "tw-bg-emerald-50 tw-text-emerald-600" };
    }

    if (provider.includes("google")) {
        return { icon: "ri-file-excel-2-line", tone: "tw-bg-emerald-50 tw-text-emerald-700" };
    }

    if (["meta", "facebook", "instagram"].some(token => provider.includes(token))) {
        return { icon: "ri-facebook-circle-line", tone: "tw-bg-blue-50 tw-text-blue-600" };
    }

    if (provider.includes("callerdesk")) {
        return { icon: "ri-phone-line", tone: "tw-bg-indigo-50 tw-text-indigo-600" };
    }

    if (["smartflo", "tata"].some(token => provider.includes(token))) {
        return { icon: "ri-customer-service-2-line", tone: "tw-bg-teal-50 tw-text-teal-600" };
    }

    return { icon: "ri-plug-line", tone: "tw-bg-gray-100 tw-text-gray-500" };
};

export const statusDotClass = (status: string) => {
    if (["active", "connected"].includes(status)) {
        return "tw-bg-emerald-500";
    }

    if (status === "error") {
        return "tw-bg-red-500";
    }

    if (["pending", "pending_auth"].includes(status)) {
        return "tw-bg-amber-500";
    }

    return "tw-bg-gray-400";
};

export const lastSyncLabel = (integration: Integration) =>
    integration.lastSyncAt ? formatDateTime(integration.lastSyncAt) : "Never";

export interface MappingSourceColumn {
    index: number;
    name: string;
}

export interface MappingCrmField {
    name: string;
    label: string;
    isRequired: boolean;
}

export const mappingCrmFields: Array<MappingCrmField> = [
    { name: "student_name", label: "Student Name", isRequired: true },
    { name: "phone", label: "Phone", isRequired: true },
    { name: "email", label: "Email", isRequired: false },
    { name: "parent_name", label: "Parent Name", isRequired: false },
    { name: "class_id", label: "Class Applying For", isRequired: false },
    { name: "city", label: "City", isRequired: false },
    { name: "remarks", label: "Remarks", isRequired: false },
];

export const mappingSourceColumns: Array<MappingSourceColumn> = [
    { index: 0, name: "Student Name" },
    { index: 1, name: "Mobile" },
    { index: 2, name: "Email ID" },
    { index: 3, name: "Parent Name" },
    { index: 4, name: "Class" },
    { index: 5, name: "City" },
    { index: 6, name: "Notes" },
    { index: 7, name: "Submitted On" },
];

const normalise = (value: string) =>
    String(value || "")
        .toLowerCase()
        .replace(/\*/g, "")
        .replace(/[^a-z0-9]/g, "");

export const autoMapSuggestions = (
    columns: Array<MappingSourceColumn>,
    fields: Array<MappingCrmField>,
) =>
    fields.reduce<Record<string, string>>((suggestions, field) => {
        const names = [normalise(field.label), normalise(field.name)];
        const match = columns.find(column => names.includes(normalise(column.name)));

        if (match) {
            suggestions[field.name] = `column_${match.index}`;
        }

        return suggestions;
    }, {});

export interface SyncLog {
    id: string;
    syncType: string;
    status: string;
    recordsProcessed: number;
    durationSeconds: number;
    createdAt: string;
}

export const syncLogs: Array<SyncLog> = [
    {
        id: "1",
        syncType: "continuous",
        status: "success",
        recordsProcessed: 14,
        durationSeconds: 3,
        createdAt: "2026-08-15T09:00:00",
    },
    {
        id: "2",
        syncType: "manual",
        status: "success",
        recordsProcessed: 62,
        durationSeconds: 11,
        createdAt: "2026-08-14T17:22:00",
    },
    {
        id: "3",
        syncType: "continuous",
        status: "failed",
        recordsProcessed: 0,
        durationSeconds: 2,
        createdAt: "2026-08-14T11:05:00",
    },
    {
        id: "4",
        syncType: "continuous",
        status: "success",
        recordsProcessed: 8,
        durationSeconds: 3,
        createdAt: "2026-08-13T10:40:00",
    },
];

export const integrations: Array<Integration> = [
    {
        id: "1",
        integrationName: "Admissions Google Sheets",
        providerName: "google_sheets",
        status: "active",
        accountLabel: "admissions@digitalcampus.in",
        createdAt: "2026-05-02T10:00:00",
        lastSyncAt: "2026-08-15T09:00:00",
        recordsSynced: 1284,
    },
    {
        id: "2",
        integrationName: "Marketing Google Sheets",
        providerName: "google_sheets",
        status: "pending_auth",
        accountLabel: "marketing@digitalcampus.in",
        createdAt: "2026-08-11T15:30:00",
        lastSyncAt: "",
        recordsSynced: 0,
    },
    {
        id: "3",
        integrationName: "Campus WhatsApp",
        providerName: "smartping",
        status: "active",
        accountLabel: "+91 90000 11122",
        createdAt: "2026-03-18T09:15:00",
        lastSyncAt: "2026-08-15T08:45:00",
        recordsSynced: 5412,
    },
    {
        id: "4",
        integrationName: "CallerDesk Cloud Calling",
        providerName: "callerdesk",
        status: "active",
        accountLabel: "CallerDesk",
        createdAt: "2026-02-04T12:00:00",
        lastSyncAt: "2026-08-14T19:00:00",
        recordsSynced: 0,
    },
    {
        id: "5",
        integrationName: "Tata Smartflo",
        providerName: "smartflo",
        status: "active",
        accountLabel: "crm@digitalcampus.in",
        createdAt: "2026-04-22T11:20:00",
        lastSyncAt: "2026-08-14T18:30:00",
        recordsSynced: 0,
    },
    {
        id: "6",
        integrationName: "Facebook Lead Ads",
        providerName: "meta_lead_ads",
        status: "error",
        accountLabel: "Digital Campus Schools",
        createdAt: "2026-06-09T14:05:00",
        lastSyncAt: "2026-08-12T07:10:00",
        recordsSynced: 318,
    },
    {
        id: "7",
        integrationName: "SmartPing SMS",
        providerName: "smartping_sms",
        status: "disconnected",
        accountLabel: "DCAMPS",
        createdAt: "2026-01-30T16:40:00",
        lastSyncAt: "",
        recordsSynced: 0,
    },
    {
        id: "8",
        integrationName: "Office 365 SMTP",
        providerName: "smtp",
        status: "active",
        accountLabel: "admissions@digitalcampus.in",
        createdAt: "2026-01-12T08:00:00",
        lastSyncAt: "2026-08-15T06:00:00",
        recordsSynced: 0,
    },
];

export const wizardScreens: Record<string, string> = {
    callerdesk: "/integrations/calling",
    smartflo: "/integrations/smartflo",
    email: "/integrations/email-configuration",
};

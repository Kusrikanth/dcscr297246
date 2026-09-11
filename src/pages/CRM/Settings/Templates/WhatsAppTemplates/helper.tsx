import { settingsBranches, type SettingsOption } from "../../helper";

export interface WhatsAppButton {
    id: string;
    buttonType: "quick_reply" | "url" | "phone";
    text: string;
    value: string;
}

export interface WhatsAppTemplate {
    id: string;
    accountId: string;
    templateName: string;
    category: string;
    language: string;
    headerType: "none" | "text" | "image" | "document" | "video";
    headerText: string;
    body: string;
    footer: string;
    buttons: Array<WhatsAppButton>;
    status: "approved" | "pending" | "rejected" | "draft";
    rejectionReason: string;
    updatedAt: string;
}

export interface WhatsAppBranchMapping {
    branchId: string;
    accountId: string;
    senderNumber: string;
    isActive: boolean;
}

export const whatsappCategories: Array<SettingsOption> = [
    { id: "MARKETING", name: "Marketing" },
    { id: "UTILITY", name: "Utility" },
    { id: "AUTHENTICATION", name: "Authentication" },
];

export const whatsappLanguages: Array<SettingsOption> = [
    { id: "en", name: "English" },
    { id: "en_US", name: "English (US)" },
    { id: "hi", name: "Hindi" },
    { id: "te", name: "Telugu" },
    { id: "ta", name: "Tamil" },
];

export const whatsappHeaderTypes: Array<SettingsOption> = [
    { id: "none", name: "No header" },
    { id: "text", name: "Text" },
    { id: "image", name: "Image" },
    { id: "document", name: "Document" },
    { id: "video", name: "Video" },
];

export const whatsappButtonTypes: Array<SettingsOption> = [
    { id: "quick_reply", name: "Quick reply" },
    { id: "url", name: "Visit website" },
    { id: "phone", name: "Call phone number" },
];

export const whatsappStatusOptions: Array<SettingsOption> = [
    { id: "approved", name: "Approved" },
    { id: "pending", name: "Pending review" },
    { id: "rejected", name: "Rejected" },
    { id: "draft", name: "Draft" },
];

export const variableCountOf = (body: string) => {
    const seen = new Set<string>();

    for (const match of String(body || "").matchAll(/\{\{\s*(\d+)\s*\}\}/g)) {
        seen.add(match[1]);
    }

    return seen.size;
};

export const hasSequentialVariables = (body: string) => {
    const indexes = [
        ...new Set(
            [...String(body || "").matchAll(/\{\{\s*(\d+)\s*\}\}/g)].map(match =>
                Number(match[1]),
            ),
        ),
    ].sort((left, right) => left - right);

    return indexes.every((value, index) => value === index + 1);
};

export const previewBody = (body: string) =>
    String(body || "").replace(
        /\{\{\s*(\d+)\s*\}\}/g,
        (_match, index) => `value ${index}`,
    );

export const statusTone = (status: string) => {
    if (status === "approved") {
        return "active";
    }

    if (status === "rejected") {
        return "failed";
    }

    if (status === "pending") {
        return "pending";
    }

    return "new";
};

export const statusLabel = (status: string) =>
    whatsappStatusOptions.find(option => option.id === status)?.name || status;

export const branchNameFor = (branchId: string) =>
    settingsBranches.find(branch => branch.id === branchId)?.name || "";

export const whatsappAccounts: Array<
    SettingsOption & { senderNumber: string; wabaId: string }
> = [
        {
            id: "3",
            name: "Campus WhatsApp",
            senderNumber: "+91 90000 11122",
            wabaId: "WABA-88213",
        },
    ];

export const whatsappTemplates: Array<WhatsAppTemplate> = [
    {
        id: "1",
        accountId: "3",
        templateName: "enquiry_acknowledgement",
        category: "UTILITY",
        language: "en",
        headerType: "text",
        headerText: "Digital Campus Admissions",
        body: "Hi {{1}}, thank you for your enquiry about admission for {{2}}. Your counsellor will call you shortly.",
        footer: "Reply STOP to opt out",
        buttons: [
            {
                id: "b1",
                buttonType: "url",
                text: "View brochure",
                value: "https://digitalcampus.in/brochure",
            },
            {
                id: "b2",
                buttonType: "phone",
                text: "Call admissions",
                value: "+919000011122",
            },
        ],
        status: "approved",
        rejectionReason: "",
        updatedAt: "2026-08-01T10:30:00",
    },
    {
        id: "2",
        accountId: "3",
        templateName: "campus_visit_reminder",
        category: "UTILITY",
        language: "en",
        headerType: "none",
        headerText: "",
        body: "Hi {{1}}, your campus visit at {{2}} is on {{3}}. Please carry a photo ID.",
        footer: "",
        buttons: [
            {
                id: "b3",
                buttonType: "quick_reply",
                text: "Confirm",
                value: "",
            },
            {
                id: "b4",
                buttonType: "quick_reply",
                text: "Reschedule",
                value: "",
            },
        ],
        status: "approved",
        rejectionReason: "",
        updatedAt: "2026-08-05T14:10:00",
    },
    {
        id: "3",
        accountId: "3",
        templateName: "open_house_invite",
        category: "MARKETING",
        language: "en",
        headerType: "image",
        headerText: "",
        body: "Hi {{1}}, join our open house at {{2}} on {{3}}. Meet the faculty and tour the campus.",
        footer: "Digital Campus Schools",
        buttons: [
            {
                id: "b5",
                buttonType: "url",
                text: "Register",
                value: "https://digitalcampus.in/open-house",
            },
        ],
        status: "pending",
        rejectionReason: "",
        updatedAt: "2026-08-13T09:25:00",
    },
    {
        id: "4",
        accountId: "3",
        templateName: "fee_reminder_v2",
        category: "UTILITY",
        language: "en",
        headerType: "none",
        headerText: "",
        body: "Hi {{1}}, the admission fee for {{2}} is pending. Pay now to confirm the seat.",
        footer: "",
        buttons: [],
        status: "rejected",
        rejectionReason:
            "Utility templates cannot include promotional wording — remove “Pay now to confirm the seat”.",
        updatedAt: "2026-08-09T16:45:00",
    },
];

export const whatsappBranchMappings: Array<WhatsAppBranchMapping> =
    settingsBranches.map((branch, index) => ({
        branchId: branch.id,
        accountId: index < 4 ? "3" : "",
        senderNumber: index < 4 ? "+91 90000 11122" : "",
        isActive: index < 4,
    }));

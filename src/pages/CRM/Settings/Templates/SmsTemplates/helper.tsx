import type { SettingsOption } from "../../helper";

export interface SmsTemplate {
    id: string;
    accountId: string;
    templateName: string;
    category: string;
    body: string;
    dltContentId: string;
    senderId: string;
    isActive: boolean;
    visibleUserIds: Array<string>;
}

export const variableCountOf = (body: string) => {
    const seen = new Set<string>();

    for (const match of String(body || "").matchAll(/\{\{\s*(\d+)\s*\}\}/g)) {
        seen.add(match[1]);
    }

    return seen.size;
};

export const segmentCountOf = (body: string) =>
    Math.ceil(String(body || "").length / 160) || 1;

export const previewBody = (body: string) =>
    String(body || "").replace(
        /\{\{\s*(\d+)\s*\}\}/g,
        (_match, index) => `value ${index}`,
    );

export const dltContentIdPattern = /^\d{4,19}$/;

export const smsTemplateCategories: Array<SettingsOption> = [
    "General",
    "Lead",
    "Follow-up",
    "Application",
    "Payment",
    "Transactional",
].map(category => ({ id: category, name: category }));

export const smsAccounts: Array<SettingsOption & { senderId: string }> = [
    { id: "7", name: "SmartPing SMS", senderId: "DCAMPS" },
];

export const smsTemplates: Array<SmsTemplate> = [
    {
        id: "1",
        accountId: "7",
        templateName: "Enquiry Acknowledgement",
        category: "Lead",
        body: "Dear {{1}}, thank you for your enquiry at {{2}}. Our counsellor will call you shortly. - Digital Campus",
        dltContentId: "1707169284736",
        senderId: "",
        isActive: true,
        visibleUserIds: [],
    },
    {
        id: "2",
        accountId: "7",
        templateName: "Campus Visit Reminder",
        category: "Follow-up",
        body: "Dear {{1}}, your campus visit at {{2}} is scheduled on {{3}}. Please carry a photo ID. - Digital Campus",
        dltContentId: "1707169284811",
        senderId: "",
        isActive: true,
        visibleUserIds: ["11", "12"],
    },
    {
        id: "3",
        accountId: "7",
        templateName: "Fee Payment Reminder",
        category: "Payment",
        body: "Dear {{1}}, the admission fee for {{2}} is pending. Pay at {{3}}. - Digital Campus",
        dltContentId: "1707169285102",
        senderId: "DCFEES",
        isActive: false,
        visibleUserIds: [],
    },
];

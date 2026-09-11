export interface WhatsAppAccount {
    id: string;
    name: string;
    branchId: string;
    branchName: string;
    hasCredentials: boolean;
    isDefault: boolean;
}

export interface WhatsAppConversation {
    id: string;
    contactName: string;
    studentName: string;
    mobile: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
    integrationId: string;
    integrationName: string;
    leadId: string;
    leadNumber: string;
    stageName: string;
    branchName: string;
}

export interface WhatsAppMessage {
    id: string;
    conversationId: string;
    direction: "incoming" | "outgoing";
    message: string;
    caption?: string;
    mediaUrl?: string;
    type: string;
    status: string;
    createdAt: string;
}

export interface LeadActivity {
    id: string;
    summary: string;
    actorName: string;
    occurredAt: string;
    commentText?: string;
}

export interface LeadComment {
    id: string;
    counsellorName: string;
    commentText: string;
    createdAt: string;
}

export interface LeadSourceHistory {
    id: string;
    isPrimary: boolean;
    source: string;
    academicYear: string;
    channel: string;
    campaign: string;
    addedBy: string;
    createdAt: string;
}

export interface LeadProfile {
    leadId: string;
    studentName: string;
    stage: string;
    substage: string;
    branch: string;
    applyingClass: string;
    curriculum: string;
    owner: string;
    leadScore: number;
    source: string;
    nextFollowupAt: string;
    activities: Array<LeadActivity>;
    comments: Array<LeadComment>;
    sourceHistory: Array<LeadSourceHistory>;
}

export interface TemplateCTAButton {
    type: string;
    buttonTitle: string;
    buttonValue: string;
}

export interface WhatsAppTemplate {
    id: string;
    templateName: string;
    label: string;
    category: string;
    language: string;
    templateType: string;
    messageActionType: string;
    status: string;
    body: string;
    headerContent: string;
    footer: string;
    sampleText: string;
    quickReplies: Array<string>;
    callToAction: Array<TemplateCTAButton>;
    visibleUserIds: Array<string>;
    rejectionReason: string;
    integrationId: string;
    integrationName: string;
    createdAt: string;
    updatedAt: string;
}

export interface MessageHistoryRecord {
    id: string;
    sentAt: string;
    integrationName: string;
    templateName: string;
    phoneNumber: string;
    status: string;
    failureReason: string;
}

export interface CrmUser {
    id: string;
    name: string;
    email: string;
}

export interface BranchRecord {
    id: string;
    branchName: string;
}

export interface DailyUsageRecord {
    day: string;
    utility: number;
    marketing: number;
    incoming: number;
    spend: number;
}

export interface UsageBreakdownRecord {
    id: string;
    name: string;
    utility: number;
    marketing: number;
    messages: number;
    spend: number;
}

export interface WhatsAppAnalytics {
    summary: {
        totalMessages: number;
        incomingMessages: number;
        utilityMessages: number;
        marketingMessages: number;
        utilitySpend: number;
        marketingSpend: number;
        estimatedSpend: number;
        delivered: number;
        pending: number;
        failed: number;
    };
    daily: Array<DailyUsageRecord>;
    integrations: Array<UsageBreakdownRecord>;
    branchWise: Array<UsageBreakdownRecord>;
    campaignWise: Array<UsageBreakdownRecord>;
}

export const templateCategoryOptions = [
    { id: "MARKETING", name: "Marketing" },
    { id: "TRANSACTIONAL", name: "Transactional" },
    { id: "OTP", name: "OTP" },
];

export const templateLanguageOptions = [
    { id: "English", name: "English" },
    { id: "Hindi", name: "Hindi" },
    { id: "Spanish", name: "Spanish" },
    { id: "French", name: "French" },
    { id: "German", name: "German" },
    { id: "Portuguese", name: "Portuguese" },
    { id: "Italian", name: "Italian" },
    { id: "Russian", name: "Russian" },
    { id: "Chinese", name: "Chinese" },
    { id: "Japanese", name: "Japanese" },
    { id: "Korean", name: "Korean" },
    { id: "Arabic", name: "Arabic" },
];

export const templateTypeOptions = [
    { id: "TEXT", name: "Text" },
    { id: "IMAGE", name: "Image" },
    { id: "VIDEO", name: "Video" },
    { id: "FILE", name: "File" },
    { id: "LOCATION", name: "Location" },
    { id: "CAROUSEL", name: "Carousel" },
    { id: "ORDER_DETAILS", name: "Order details" },
];

export const messageActionTypeOptions = [
    { id: "NONE", name: "None" },
    { id: "QuickReplies", name: "Quick replies" },
    { id: "CTA", name: "Call to action" },
];

export const ctaTypeOptions = [
    { id: "URL", name: "URL" },
    { id: "Phone Number", name: "Phone Number" },
];

export const templateStatusList = [
    "APPROVED",
    "PENDING",
    "DRAFT",
    "REJECTED",
    "ARCHIVED",
];

export const templateStatusOptions = templateStatusList.map(item => ({
    id: item,
    name: item.charAt(0) + item.slice(1).toLowerCase(),
}));

export const messageStatusOptions = [
    { id: "SENT", name: "Sent" },
    { id: "DELIVERED", name: "Delivered" },
    { id: "READ", name: "Read" },
    { id: "FAILED", name: "Failed" },
];

export const mediaTemplateTypes = ["IMAGE", "VIDEO", "FILE", "DOCUMENT"];

export const cleanPhone = (value: string | number | undefined | null) =>
    String(value || "")
        .replace(/\D/g, "")
        .replace(/^91(?=\d{10}$)/, "");

export const isValidIndianMobile = (value: string | number | undefined | null) =>
    /^[6-9]\d{9}$/.test(cleanPhone(value));

export const formatDateTime = (value: string | undefined | null) =>
    value
        ? new Date(value).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "—";

export const formatTime = (value: string | undefined | null) =>
    value
        ? new Date(value).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

export const formatDate = (value: string | undefined | null) =>
    value
        ? new Date(value).toLocaleDateString("en-IN", {
            dateStyle: "medium",
        })
        : "—";

export const formatMoney = (value: number | undefined | null) =>
    `₹${Number(value || 0).toLocaleString("en-IN", {
        maximumFractionDigits: 2,
    })}`;

export const formatCount = (value: number | undefined | null) =>
    Number(value || 0).toLocaleString("en-IN");

export const detectTemplateVariables = (text: string | undefined | null) => {
    const matches = String(text || "").match(/\{\{\s*\d+\s*\}\}/g) || [];

    return [...new Set(matches.map(item => item.replace(/\s/g, "")))].sort();
};

export const renderTemplateBody = (
    text: string | undefined | null,
    sampleText: string | undefined | null,
) => {
    const body = String(text || "");

    if (!sampleText) {
        return body;
    }

    const sampleLines = String(sampleText)
        .split("\n")
        .filter(line => line.trim());

    let index = 0;

    return body.replace(/\{\{\s*(\d+)\s*\}\}/g, (match) => {
        const replacement = sampleLines[index];
        index += 1;

        return replacement ?? match;
    });
};

export const getStatusLabelType = (status: string | undefined | null) => {
    switch (String(status || "").toUpperCase()) {
        case "APPROVED":
        case "DELIVERED":
        case "READ":
            return "active";

        case "PENDING":
        case "SENT":
            return "pending";

        case "REJECTED":
        case "FAILED":
            return "rejected";

        case "ARCHIVED":
            return "inactive";

        default:
            return "inprogress";
    }
};

export const getInitial = (...values: Array<string | undefined>) => {
    const source = values.find(value => value && value.trim());

    return String(source || "?").trim().charAt(0).toUpperCase();
};

export const buildDateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export const recentDaysRange = (days = 7) => {
    const today = new Date();
    const from = new Date(today);
    from.setDate(today.getDate() - (days - 1));

    return { startDate: buildDateKey(from), endDate: buildDateKey(today) };
};

export const whatsAppAccounts: Array<WhatsAppAccount> = [
    {
        id: "1",
        name: "DPS Admissions – Main",
        branchId: "1",
        branchName: "Nacharam",
        hasCredentials: true,
        isDefault: true,
    },
    {
        id: "2",
        name: "DPS Admissions – Secunderabad",
        branchId: "2",
        branchName: "Secunderabad",
        hasCredentials: true,
        isDefault: false,
    },
    {
        id: "3",
        name: "DPS Counselling Desk",
        branchId: "3",
        branchName: "Mahendra Hills",
        hasCredentials: true,
        isDefault: false,
    },
    {
        id: "4",
        name: "DPS Transport Helpdesk",
        branchId: "4",
        branchName: "Khajaguda",
        hasCredentials: false,
        isDefault: false,
    },
];

export const branchList: Array<BranchRecord> = [
    { id: "1", branchName: "Nacharam" },
    { id: "2", branchName: "Secunderabad" },
    { id: "3", branchName: "Mahendra Hills" },
    { id: "4", branchName: "Khajaguda" },
    { id: "5", branchName: "Miyapur" },
    { id: "6", branchName: "Kompally" },
];

export const branchAccountMapping: Record<string, Array<string>> = {
    "1": ["1", "3"],
    "2": ["2"],
    "3": ["3"],
    "4": [],
    "5": ["1"],
    "6": [],
};

export const crmUsers: Array<CrmUser> = [
    { id: "u1", name: "Srikanth Reddy", email: "srikanth.reddy@dps.edu.in" },
    { id: "u2", name: "Taufeeq Ahmed", email: "taufeeq.ahmed@dps.edu.in" },
    { id: "u3", name: "Priya Nair", email: "priya.nair@dps.edu.in" },
    { id: "u4", name: "Ravi Teja", email: "ravi.teja@dps.edu.in" },
    { id: "u5", name: "Anitha Rao", email: "anitha.rao@dps.edu.in" },
    { id: "u6", name: "Mohammed Irfan", email: "mohammed.irfan@dps.edu.in" },
    { id: "u7", name: "Sneha Kulkarni", email: "sneha.kulkarni@dps.edu.in" },
    { id: "u8", name: "Vikram Choudhary", email: "vikram.choudhary@dps.edu.in" },
];

export const whatsAppConversations: Array<WhatsAppConversation> = [
    {
        id: "1",
        contactName: "Sudha Menon",
        studentName: "Aarav Menon",
        mobile: "9848012345",
        lastMessage: "Could you share the fee structure for Grade 5?",
        lastMessageTime: "2026-08-14T09:42:00",
        unreadCount: 2,
        integrationId: "1",
        integrationName: "DPS Admissions – Main",
        leadId: "L-1001",
        leadNumber: "LEAD-1001",
        stageName: "Enquiry",
        branchName: "Nacharam",
    },
    {
        id: "2",
        contactName: "Ramesh Kumar",
        studentName: "Ishita Kumar",
        mobile: "9701123456",
        lastMessage: "Thank you, we will visit the campus on Saturday.",
        lastMessageTime: "2026-08-14T08:15:00",
        unreadCount: 0,
        integrationId: "1",
        integrationName: "DPS Admissions – Main",
        leadId: "L-1002",
        leadNumber: "LEAD-1002",
        stageName: "Campus Visit",
        branchName: "Nacharam",
    },
    {
        id: "3",
        contactName: "Fatima Sheikh",
        studentName: "Zoya Sheikh",
        mobile: "9966554433",
        lastMessage: "Is the transport available for Kompally route?",
        lastMessageTime: "2026-08-13T18:05:00",
        unreadCount: 5,
        integrationId: "2",
        integrationName: "DPS Admissions – Secunderabad",
        leadId: "L-1003",
        leadNumber: "LEAD-1003",
        stageName: "Follow Up",
        branchName: "Secunderabad",
    },
    {
        id: "4",
        contactName: "Naveen Chandra",
        studentName: "Dhruv Chandra",
        mobile: "9885567788",
        lastMessage: "Application submitted. Awaiting confirmation.",
        lastMessageTime: "2026-08-13T15:30:00",
        unreadCount: 0,
        integrationId: "3",
        integrationName: "DPS Counselling Desk",
        leadId: "L-1004",
        leadNumber: "LEAD-1004",
        stageName: "Application",
        branchName: "Mahendra Hills",
    },
    {
        id: "5",
        contactName: "Lakshmi Prasad",
        studentName: "Nithya Prasad",
        mobile: "9391122334",
        lastMessage: "Please call me after 6 PM.",
        lastMessageTime: "2026-08-12T11:20:00",
        unreadCount: 1,
        integrationId: "1",
        integrationName: "DPS Admissions – Main",
        leadId: "L-1005",
        leadNumber: "LEAD-1005",
        stageName: "Untouched",
        branchName: "Nacharam",
    },
    {
        id: "6",
        contactName: "Arun Varma",
        studentName: "Kabir Varma",
        mobile: "9440099887",
        lastMessage: "We have completed the payment for the application fee.",
        lastMessageTime: "2026-08-11T16:48:00",
        unreadCount: 0,
        integrationId: "2",
        integrationName: "DPS Admissions – Secunderabad",
        leadId: "L-1006",
        leadNumber: "LEAD-1006",
        stageName: "Admitted",
        branchName: "Secunderabad",
    },
];

export const whatsAppMessages: Array<WhatsAppMessage> = [
    {
        id: "m1",
        conversationId: "1",
        direction: "outgoing",
        message:
            "Hello Sudha, thank you for your interest in Delhi Public School. How may we help you today?",
        type: "TEXT",
        status: "READ",
        createdAt: "2026-08-14T09:10:00",
    },
    {
        id: "m2",
        conversationId: "1",
        direction: "incoming",
        message: "Hi, I want to know about admissions for Grade 5.",
        type: "TEXT",
        status: "DELIVERED",
        createdAt: "2026-08-14T09:22:00",
    },
    {
        id: "m3",
        conversationId: "1",
        direction: "outgoing",
        message:
            "Sure. Admissions for Grade 5 are open for the 2026-27 academic year. Sharing the prospectus with you.",
        mediaUrl: "https://example.com/media/dps-prospectus-2026.pdf",
        type: "DOCUMENT",
        status: "DELIVERED",
        createdAt: "2026-08-14T09:35:00",
    },
    {
        id: "m4",
        conversationId: "1",
        direction: "incoming",
        message: "Could you share the fee structure for Grade 5?",
        type: "TEXT",
        status: "DELIVERED",
        createdAt: "2026-08-14T09:42:00",
    },
    {
        id: "m5",
        conversationId: "2",
        direction: "outgoing",
        message:
            "Hello Ramesh, your campus visit is confirmed for Saturday at 11:00 AM.",
        type: "TEXT",
        status: "READ",
        createdAt: "2026-08-14T07:50:00",
    },
    {
        id: "m6",
        conversationId: "2",
        direction: "incoming",
        message: "Thank you, we will visit the campus on Saturday.",
        type: "TEXT",
        status: "DELIVERED",
        createdAt: "2026-08-14T08:15:00",
    },
    {
        id: "m7",
        conversationId: "3",
        direction: "incoming",
        message: "Is the transport available for Kompally route?",
        type: "TEXT",
        status: "DELIVERED",
        createdAt: "2026-08-13T18:05:00",
    },
    {
        id: "m8",
        conversationId: "3",
        direction: "outgoing",
        message:
            "Yes, we operate two buses on the Kompally route. Our transport team will call you shortly.",
        type: "TEXT",
        status: "SENT",
        createdAt: "2026-08-13T18:20:00",
    },
    {
        id: "m9",
        conversationId: "4",
        direction: "outgoing",
        message:
            "Dear Naveen, your application has been received. Reference number APP-4451.",
        type: "TEXT",
        status: "READ",
        createdAt: "2026-08-13T15:10:00",
    },
    {
        id: "m10",
        conversationId: "4",
        direction: "incoming",
        message: "Application submitted. Awaiting confirmation.",
        type: "TEXT",
        status: "DELIVERED",
        createdAt: "2026-08-13T15:30:00",
    },
    {
        id: "m11",
        conversationId: "5",
        direction: "incoming",
        message: "Please call me after 6 PM.",
        type: "TEXT",
        status: "DELIVERED",
        createdAt: "2026-08-12T11:20:00",
    },
    {
        id: "m12",
        conversationId: "6",
        direction: "incoming",
        message: "We have completed the payment for the application fee.",
        type: "TEXT",
        status: "DELIVERED",
        createdAt: "2026-08-11T16:48:00",
    },
];

export const leadProfiles: Record<string, LeadProfile> = {
    "L-1001": {
        leadId: "LEAD-1001",
        studentName: "Aarav Menon",
        stage: "Enquiry",
        substage: "Prospectus shared",
        branch: "Nacharam",
        applyingClass: "Grade 5",
        curriculum: "CBSE",
        owner: "Srikanth Reddy",
        leadScore: 72,
        source: "Website",
        nextFollowupAt: "2026-08-16T10:00:00",
        activities: [
            {
                id: "a1",
                summary: "Prospectus shared over WhatsApp",
                actorName: "Srikanth Reddy",
                occurredAt: "2026-08-14T09:35:00",
            },
            {
                id: "a2",
                summary: "Stage moved to Enquiry",
                actorName: "System",
                occurredAt: "2026-08-14T09:12:00",
                commentText: "Auto-created from the website enquiry form.",
            },
        ],
        comments: [
            {
                id: "c1",
                counsellorName: "Srikanth Reddy",
                commentText:
                    "Parent is comparing with two other schools. Needs the fee break-up urgently.",
                createdAt: "2026-08-14T09:44:00",
            },
        ],
        sourceHistory: [
            {
                id: "s1",
                isPrimary: true,
                source: "Website",
                academicYear: "2026-27",
                channel: "Organic",
                campaign: "Admissions Open",
                addedBy: "System",
                createdAt: "2026-08-14T09:10:00",
            },
        ],
    },
    "L-1003": {
        leadId: "LEAD-1003",
        studentName: "Zoya Sheikh",
        stage: "Follow Up",
        substage: "Transport enquiry",
        branch: "Secunderabad",
        applyingClass: "Grade 3",
        curriculum: "CBSE",
        owner: "Priya Nair",
        leadScore: 58,
        source: "Meta Lead Ads",
        nextFollowupAt: "2026-08-15T17:00:00",
        activities: [
            {
                id: "a3",
                summary: "Transport route enquiry logged",
                actorName: "Priya Nair",
                occurredAt: "2026-08-13T18:22:00",
            },
        ],
        comments: [],
        sourceHistory: [
            {
                id: "s2",
                isPrimary: true,
                source: "Meta Lead Ads",
                academicYear: "2026-27",
                channel: "Paid Social",
                campaign: "Monsoon Admissions",
                addedBy: "Integration",
                createdAt: "2026-08-10T12:00:00",
            },
        ],
    },
};

export const whatsAppTemplates: Array<WhatsAppTemplate> = [
    {
        id: "t1",
        templateName: "admission_enquiry_welcome",
        label: "DPS Admissions – Main",
        category: "MARKETING",
        language: "English",
        templateType: "TEXT",
        messageActionType: "QuickReplies",
        status: "APPROVED",
        body: "Hello {{1}}, thank you for your interest in Delhi Public School {{2}}. Our counsellor will call you shortly to help with the admission process.",
        headerContent: "",
        footer: "Delhi Public School",
        sampleText: "Sudha Menon\nNacharam",
        quickReplies: ["Talk to counsellor", "Share brochure"],
        callToAction: [],
        visibleUserIds: ["u1", "u2", "u3"],
        rejectionReason: "",
        integrationId: "1",
        integrationName: "DPS Admissions – Main",
        createdAt: "2026-07-28T10:15:00",
        updatedAt: "2026-08-05T14:20:00",
    },
    {
        id: "t2",
        templateName: "campus_visit_confirmation",
        label: "DPS Admissions – Main",
        category: "TRANSACTIONAL",
        language: "English",
        templateType: "TEXT",
        messageActionType: "CTA",
        status: "APPROVED",
        body: "Dear {{1}}, your campus visit is confirmed for {{2}} at {{3}}. Please carry a photo ID at the reception.",
        headerContent: "",
        footer: "See you soon!",
        sampleText: "Ramesh Kumar\n16 August 2026\n11:00 AM",
        quickReplies: [],
        callToAction: [
            {
                type: "URL",
                buttonTitle: "View directions",
                buttonValue: "https://dps.edu.in/campus-directions",
            },
            {
                type: "Phone Number",
                buttonTitle: "Call front desk",
                buttonValue: "+914027171717",
            },
        ],
        visibleUserIds: ["u1", "u2", "u3", "u4"],
        rejectionReason: "",
        integrationId: "1",
        integrationName: "DPS Admissions – Main",
        createdAt: "2026-07-20T09:00:00",
        updatedAt: "2026-08-01T11:45:00",
    },
    {
        id: "t3",
        templateName: "fee_structure_2026",
        label: "DPS Admissions – Secunderabad",
        category: "MARKETING",
        language: "English",
        templateType: "FILE",
        messageActionType: "NONE",
        status: "PENDING",
        body: "Hi {{1}}, please find the attached fee structure for the academic year 2026-27.",
        headerContent: "https://cdn.dps.edu.in/documents/fee-structure-2026.pdf",
        footer: "Fees are subject to revision",
        sampleText: "Fatima Sheikh",
        quickReplies: [],
        callToAction: [],
        visibleUserIds: ["u3", "u5"],
        rejectionReason: "",
        integrationId: "2",
        integrationName: "DPS Admissions – Secunderabad",
        createdAt: "2026-08-08T16:30:00",
        updatedAt: "2026-08-08T16:30:00",
    },
    {
        id: "t4",
        templateName: "application_reminder",
        label: "DPS Counselling Desk",
        category: "TRANSACTIONAL",
        language: "English",
        templateType: "TEXT",
        messageActionType: "NONE",
        status: "DRAFT",
        body: "Dear parent, your application for {{1}} is incomplete. Kindly submit the pending documents before {{2}}.",
        headerContent: "",
        footer: "",
        sampleText: "Grade 5\n20 August 2026",
        quickReplies: [],
        callToAction: [],
        visibleUserIds: [],
        rejectionReason: "",
        integrationId: "3",
        integrationName: "DPS Counselling Desk",
        createdAt: "2026-08-10T12:05:00",
        updatedAt: "2026-08-11T09:10:00",
    },
    {
        id: "t5",
        templateName: "open_house_invite",
        label: "DPS Admissions – Main",
        category: "MARKETING",
        language: "English",
        templateType: "IMAGE",
        messageActionType: "CTA",
        status: "REJECTED",
        body: "You are invited to the DPS Open House on {{1}}. Meet our faculty and tour the campus.",
        headerContent: "https://cdn.dps.edu.in/images/open-house-banner.jpg",
        footer: "Limited seats",
        sampleText: "24 August 2026",
        quickReplies: [],
        callToAction: [
            {
                type: "URL",
                buttonTitle: "Register now",
                buttonValue: "https://dps.edu.in/open-house",
            },
        ],
        visibleUserIds: ["u1"],
        rejectionReason:
            "The header image contains promotional text covering more than 20% of the image area.",
        integrationId: "1",
        integrationName: "DPS Admissions – Main",
        createdAt: "2026-07-15T08:40:00",
        updatedAt: "2026-07-19T13:25:00",
    },
    {
        id: "t6",
        templateName: "transport_route_info",
        label: "DPS Transport Helpdesk",
        category: "TRANSACTIONAL",
        language: "English",
        templateType: "TEXT",
        messageActionType: "NONE",
        status: "APPROVED",
        body: "Hi {{1}}, bus route {{2}} covers your locality. Pick-up time is {{3}}.",
        headerContent: "",
        footer: "DPS Transport",
        sampleText: "Fatima Sheikh\nKompally – R4\n7:15 AM",
        quickReplies: [],
        callToAction: [],
        visibleUserIds: ["u4", "u6"],
        rejectionReason: "",
        integrationId: "2",
        integrationName: "DPS Admissions – Secunderabad",
        createdAt: "2026-06-30T10:00:00",
        updatedAt: "2026-07-02T10:00:00",
    },
    {
        id: "t7",
        templateName: "admission_confirmed",
        label: "DPS Admissions – Secunderabad",
        category: "TRANSACTIONAL",
        language: "English",
        templateType: "TEXT",
        messageActionType: "NONE",
        status: "APPROVED",
        body: "Congratulations {{1}}! Admission for {{2}} into {{3}} is confirmed. Welcome to the DPS family.",
        headerContent: "",
        footer: "Delhi Public School",
        sampleText: "Arun Varma\nKabir Varma\nGrade 2",
        quickReplies: [],
        callToAction: [],
        visibleUserIds: ["u1", "u2", "u3", "u4", "u5"],
        rejectionReason: "",
        integrationId: "2",
        integrationName: "DPS Admissions – Secunderabad",
        createdAt: "2026-06-12T09:20:00",
        updatedAt: "2026-06-12T09:20:00",
    },
    {
        id: "t8",
        templateName: "otp_verification",
        label: "DPS Counselling Desk",
        category: "OTP",
        language: "English",
        templateType: "TEXT",
        messageActionType: "NONE",
        status: "APPROVED",
        body: "{{1}} is your verification code for the DPS admission portal. It is valid for 10 minutes.",
        headerContent: "",
        footer: "Do not share this code",
        sampleText: "482913",
        quickReplies: [],
        callToAction: [],
        visibleUserIds: ["u1", "u2"],
        rejectionReason: "",
        integrationId: "3",
        integrationName: "DPS Counselling Desk",
        createdAt: "2026-05-22T11:00:00",
        updatedAt: "2026-05-22T11:00:00",
    },
    {
        id: "t9",
        templateName: "scholarship_announcement",
        label: "DPS Admissions – Main",
        category: "MARKETING",
        language: "Hindi",
        templateType: "TEXT",
        messageActionType: "NONE",
        status: "ARCHIVED",
        body: "प्रिय अभिभावक, शैक्षणिक वर्ष {{1}} के लिए छात्रवृत्ति आवेदन अब खुले हैं।",
        headerContent: "",
        footer: "",
        sampleText: "2025-26",
        quickReplies: [],
        callToAction: [],
        visibleUserIds: [],
        rejectionReason: "",
        integrationId: "1",
        integrationName: "DPS Admissions – Main",
        createdAt: "2025-11-04T15:00:00",
        updatedAt: "2026-01-08T10:30:00",
    },
    {
        id: "t10",
        templateName: "counsellor_followup",
        label: "DPS Counselling Desk",
        category: "MARKETING",
        language: "English",
        templateType: "TEXT",
        messageActionType: "QuickReplies",
        status: "PENDING",
        body: "Hello {{1}}, this is {{2}} from Delhi Public School. Is this a good time to discuss the admission process?",
        headerContent: "",
        footer: "",
        sampleText: "Lakshmi Prasad\nPriya",
        quickReplies: ["Yes, call me", "Call me later", "Not interested"],
        callToAction: [],
        visibleUserIds: ["u3", "u7", "u8"],
        rejectionReason: "",
        integrationId: "3",
        integrationName: "DPS Counselling Desk",
        createdAt: "2026-08-12T14:15:00",
        updatedAt: "2026-08-12T14:15:00",
    },
    {
        id: "t11",
        templateName: "orientation_video",
        label: "DPS Admissions – Main",
        category: "MARKETING",
        language: "English",
        templateType: "VIDEO",
        messageActionType: "NONE",
        status: "DRAFT",
        body: "Take a virtual tour of our {{1}} campus before your visit.",
        headerContent: "https://cdn.dps.edu.in/videos/campus-tour.mp4",
        footer: "Delhi Public School",
        sampleText: "Nacharam",
        quickReplies: [],
        callToAction: [],
        visibleUserIds: [],
        rejectionReason: "",
        integrationId: "1",
        integrationName: "DPS Admissions – Main",
        createdAt: "2026-08-13T17:45:00",
        updatedAt: "2026-08-13T17:45:00",
    },
    {
        id: "t12",
        templateName: "document_pending_alert",
        label: "DPS Admissions – Secunderabad",
        category: "TRANSACTIONAL",
        language: "English",
        templateType: "TEXT",
        messageActionType: "NONE",
        status: "REJECTED",
        body: "Documents pending for {{1}}. Submit them at the front desk.",
        headerContent: "",
        footer: "",
        sampleText: "Ishita Kumar",
        quickReplies: [],
        callToAction: [],
        visibleUserIds: [],
        rejectionReason:
            "Template body is too generic and does not identify the business.",
        integrationId: "2",
        integrationName: "DPS Admissions – Secunderabad",
        createdAt: "2026-07-05T13:00:00",
        updatedAt: "2026-07-07T09:15:00",
    },
];

export const messageHistoryRecords: Array<MessageHistoryRecord> = [
    {
        id: "h1",
        sentAt: "2026-08-14T09:35:00",
        integrationName: "DPS Admissions – Main",
        templateName: "admission_enquiry_welcome",
        phoneNumber: "9848012345",
        status: "READ",
        failureReason: "",
    },
    {
        id: "h2",
        sentAt: "2026-08-14T07:50:00",
        integrationName: "DPS Admissions – Main",
        templateName: "campus_visit_confirmation",
        phoneNumber: "9701123456",
        status: "DELIVERED",
        failureReason: "",
    },
    {
        id: "h3",
        sentAt: "2026-08-13T18:20:00",
        integrationName: "DPS Admissions – Secunderabad",
        templateName: "transport_route_info",
        phoneNumber: "9966554433",
        status: "SENT",
        failureReason: "",
    },
    {
        id: "h4",
        sentAt: "2026-08-13T15:10:00",
        integrationName: "DPS Counselling Desk",
        templateName: "",
        phoneNumber: "9885567788",
        status: "DELIVERED",
        failureReason: "",
    },
    {
        id: "h5",
        sentAt: "2026-08-12T11:05:00",
        integrationName: "DPS Admissions – Main",
        templateName: "counsellor_followup",
        phoneNumber: "9391122334",
        status: "FAILED",
        failureReason: "Recipient does not have a WhatsApp account",
    },
    {
        id: "h6",
        sentAt: "2026-08-11T16:30:00",
        integrationName: "DPS Admissions – Secunderabad",
        templateName: "admission_confirmed",
        phoneNumber: "9440099887",
        status: "READ",
        failureReason: "",
    },
    {
        id: "h7",
        sentAt: "2026-08-10T10:15:00",
        integrationName: "DPS Admissions – Main",
        templateName: "open_house_invite",
        phoneNumber: "9848099001",
        status: "FAILED",
        failureReason: "Template is not approved for this account",
    },
    {
        id: "h8",
        sentAt: "2026-08-09T12:40:00",
        integrationName: "DPS Counselling Desk",
        templateName: "otp_verification",
        phoneNumber: "9701456789",
        status: "DELIVERED",
        failureReason: "",
    },
];

export const whatsAppAnalytics: WhatsAppAnalytics = {
    summary: {
        totalMessages: 18420,
        incomingMessages: 4260,
        utilityMessages: 9180,
        marketingMessages: 4980,
        utilitySpend: 1285.2,
        marketingSpend: 3934.2,
        estimatedSpend: 5219.4,
        delivered: 17240,
        pending: 640,
        failed: 540,
    },
    daily: [
        { day: "2026-08-08", utility: 1180, marketing: 620, incoming: 540, spend: 652.4 },
        { day: "2026-08-09", utility: 1320, marketing: 710, incoming: 610, spend: 745.3 },
        { day: "2026-08-10", utility: 1010, marketing: 540, incoming: 480, spend: 568.1 },
        { day: "2026-08-11", utility: 1450, marketing: 820, incoming: 690, spend: 842.6 },
        { day: "2026-08-12", utility: 1290, marketing: 760, incoming: 620, spend: 774.2 },
        { day: "2026-08-13", utility: 1380, marketing: 810, incoming: 660, spend: 826.5 },
        { day: "2026-08-14", utility: 1550, marketing: 720, incoming: 660, spend: 810.3 },
    ],
    integrations: [
        { id: "1", name: "DPS Admissions – Main", utility: 4820, marketing: 2410, messages: 7230, spend: 2456.8 },
        { id: "2", name: "DPS Admissions – Secunderabad", utility: 2960, marketing: 1620, messages: 4580, spend: 1685.4 },
        { id: "3", name: "DPS Counselling Desk", utility: 1400, marketing: 950, messages: 2350, spend: 1077.2 },
    ],
    branchWise: [
        { id: "1", name: "Nacharam", utility: 3210, marketing: 1680, messages: 4890, spend: 1720.5 },
        { id: "2", name: "Secunderabad", utility: 2480, marketing: 1340, messages: 3820, spend: 1398.2 },
        { id: "3", name: "Mahendra Hills", utility: 1620, marketing: 890, messages: 2510, spend: 962.4 },
        { id: "5", name: "Miyapur", utility: 1180, marketing: 640, messages: 1820, spend: 688.1 },
        { id: "6", name: "Kompally", utility: 690, marketing: 430, messages: 1120, spend: 450.2 },
    ],
    campaignWise: [
        { id: "c1", name: "Admissions Open 2026-27", utility: 2140, marketing: 1860, messages: 4000, spend: 1620.4 },
        { id: "c2", name: "Monsoon Admissions", utility: 1480, marketing: 1220, messages: 2700, spend: 1082.6 },
        { id: "c3", name: "Open House August", utility: 860, marketing: 940, messages: 1800, spend: 764.8 },
        { id: "c4", name: "Transport Awareness", utility: 1240, marketing: 320, messages: 1560, spend: 486.2 },
    ],
};

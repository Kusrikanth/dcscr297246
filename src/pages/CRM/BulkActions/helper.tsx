import {
    MenuOptionHrtl,
    type IOptionsHrtl,
} from "../../../Components/Common/MenuOptions";

export type BulkActionStatus =
    | "processing"
    | "queued"
    | "completed"
    | "success"
    | "error"
    | "failed";

export interface UploadFailedRecord {
    rowNumber: number;
    studentName: string;
    phone: string;
    reasons: string[];
}

export interface UploadEvent {
    id: string;
    label: string;
    performedBy: string;
    createdAt: string;
}

export interface BulkUploadRecord {
    id: string;
    fileName: string;
    type: string;
    status: BulkActionStatus;
    totalRecords: number;
    successCount: number;
    failureCount: number;
    duplicateCount: number;
    createdAt: string;
    createdBy: string;
    errorMessage: string;
    errorSummary: string;
    failedRecords: UploadFailedRecord[];
    events: UploadEvent[];
}

export interface BulkOperationRecord {
    id: string;
    type: string;
    description: string;
    status: BulkActionStatus;
    affectedCount: number;
    successfulCount: number;
    failureCount: number;
    stageName: string;
    substageName: string;
    createdBy: string;
    createdAt: string;
}

export interface DialerCampaignRecord {
    id: string;
    campaignName: string;
    description: string;
    callCount: number;
    connectedCount: number;
    successRate: number;
    status: BulkActionStatus;
    createdBy: string;
    createdAt: string;
}

export interface DownloadRecord {
    id: string;
    dataset: string;
    fileName: string;
    columns: Array<string>;
    recordCount: number;
    fileSizeKb: number;
    isFileRetained: boolean;
    createdBy: string;
    createdAt: string;
}

export interface BulkActionsFilterState {
    searchString: string;
    status: string;
    startDate: string;
    endDate: string;
}

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

    const pad = (part: number) =>
        String(part).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const formatDateTime = (
    value: string | undefined | null,
) =>
    value
        ? new Date(value).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "—";

export const formatDate = (
    value: string | undefined | null,
) =>
    value
        ? new Date(value).toLocaleDateString("en-IN", {
            dateStyle: "medium",
        })
        : "—";

export const successRate = (
    successCount: number,
    totalRecords: number,
) =>
    totalRecords > 0
        ? Number(
            ((successCount / totalRecords) * 100).toFixed(1),
        )
        : 0;

export const bulkActionStatusOptions = [
    { id: "processing", name: "Processing" },
    { id: "queued", name: "Queued" },
    { id: "completed", name: "Completed" },
    { id: "success", name: "Success" },
    { id: "error", name: "Error" },
    { id: "failed", name: "Failed" },
];

export const initialFilterState: BulkActionsFilterState = {
    searchString: "",
    status: "",
    startDate: "",
    endDate: "",
};

export const initialPagination = {
    pageNo: 0,
    pageSize: 10,
};

export const actionsColumn = (
    actionOptions: Array<IOptionsHrtl>,
) => ({
    Header: "Actions",
    disableSortBy: true,
    Cell: ({
        row: { original },
    }: {
        row: { original: { id: string } };
    }) => (
        <MenuOptionHrtl
            actionOptions={actionOptions}
            rowId={original.id}
        />
    ),
});

const pad = (value: number) => String(value).padStart(2, "0");

const dayOffset = (
    offsetDays: number,
    hours = 10,
    minutes = 0,
): string => {
    const date = new Date();

    date.setDate(date.getDate() + offsetDays);
    date.setHours(hours, minutes, 0, 0);

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(hours)}:${pad(minutes)}:00`;
};

export const bulkUploadRecords: BulkUploadRecord[] = [
    {
        id: "1",
        fileName: "meta-leads-august.csv",
        type: "Lead import",
        status: "completed",
        totalRecords: 250,
        successCount: 238,
        failureCount: 9,
        duplicateCount: 3,
        createdAt: dayOffset(-1, 11, 20),
        createdBy: "ARJUN",
        errorMessage: "",
        errorSummary: "",
        failedRecords: [
            {
                rowNumber: 14,
                studentName: "Rohit Sharma",
                phone: "98765",
                reasons: [
                    "Phone must be 10 digits starting with 6-9",
                ],
            },
            {
                rowNumber: 27,
                studentName: "",
                phone: "9812345678",
                reasons: ["Student name is required"],
            },
            {
                rowNumber: 61,
                studentName: "Kavya Menon",
                phone: "9700112244",
                reasons: [
                    'Branch "Kompally" is not configured',
                    "Sub-stage is required",
                ],
            },
        ],
        events: [
            {
                id: "1-1",
                label: "File received",
                performedBy: "ARJUN",
                createdAt: dayOffset(-1, 11, 20),
            },
            {
                id: "1-2",
                label: "Validation completed",
                performedBy: "System",
                createdAt: dayOffset(-1, 11, 21),
            },
            {
                id: "1-3",
                label: "238 leads imported",
                performedBy: "System",
                createdAt: dayOffset(-1, 11, 24),
            },
        ],
    },
    {
        id: "2",
        fileName: "walk-in-enquiries-week32.csv",
        type: "Lead import",
        status: "processing",
        totalRecords: 84,
        successCount: 40,
        failureCount: 0,
        duplicateCount: 0,
        createdAt: dayOffset(0, 9, 5),
        createdBy: "TARUN",
        errorMessage: "",
        errorSummary: "",
        failedRecords: [],
        events: [
            {
                id: "2-1",
                label: "File received",
                performedBy: "TARUN",
                createdAt: dayOffset(0, 9, 5),
            },
            {
                id: "2-2",
                label: "Import in progress",
                performedBy: "System",
                createdAt: dayOffset(0, 9, 6),
            },
        ],
    },
    {
        id: "3",
        fileName: "google-sheet-sync-july.csv",
        type: "Lead import",
        status: "failed",
        totalRecords: 120,
        successCount: 0,
        failureCount: 120,
        duplicateCount: 0,
        createdAt: dayOffset(-4, 16, 45),
        createdBy: "Sri Lakshmi",
        errorMessage:
            "The file header did not match the lead upload template.",
        errorSummary:
            'Expected column "Primary Phone" was missing, so no row could be validated.',
        failedRecords: [
            {
                rowNumber: 2,
                studentName: "—",
                phone: "—",
                reasons: [
                    'Required column "Primary Phone" is missing',
                ],
            },
        ],
        events: [
            {
                id: "3-1",
                label: "File received",
                performedBy: "Sri Lakshmi",
                createdAt: dayOffset(-4, 16, 45),
            },
            {
                id: "3-2",
                label: "Validation failed",
                performedBy: "System",
                createdAt: dayOffset(-4, 16, 45),
            },
        ],
    },
    {
        id: "4",
        fileName: "referral-leads-june.csv",
        type: "Lead import",
        status: "success",
        totalRecords: 46,
        successCount: 46,
        failureCount: 0,
        duplicateCount: 0,
        createdAt: dayOffset(-9, 14, 10),
        createdBy: "ARJUN",
        errorMessage: "",
        errorSummary: "",
        failedRecords: [],
        events: [
            {
                id: "4-1",
                label: "File received",
                performedBy: "ARJUN",
                createdAt: dayOffset(-9, 14, 10),
            },
            {
                id: "4-2",
                label: "46 leads imported",
                performedBy: "System",
                createdAt: dayOffset(-9, 14, 12),
            },
        ],
    },
];

export const bulkOperationRecords: BulkOperationRecord[] = [
    {
        id: "1",
        type: "Stage change",
        description:
            "Leads from the Meta Ads August import moved after the first calling round",
        status: "completed",
        affectedCount: 64,
        successfulCount: 64,
        failureCount: 0,
        stageName: "Not Connected",
        substageName: "Call attempted",
        createdBy: "TARUN",
        createdAt: dayOffset(-1, 18, 30),
    },
    {
        id: "2",
        type: "Stage change",
        description:
            "Campus visit attendees moved to Application",
        status: "completed",
        affectedCount: 18,
        successfulCount: 17,
        failureCount: 1,
        stageName: "Application",
        substageName: "Application shared",
        createdBy: "ARJUN",
        createdAt: dayOffset(-3, 12, 15),
    },
    {
        id: "3",
        type: "Stage change",
        description:
            "Unresponsive leads from the June referral batch closed out",
        status: "failed",
        affectedCount: 32,
        successfulCount: 0,
        failureCount: 32,
        stageName: "Lost",
        substageName: "Joined elsewhere",
        createdBy: "Sri Lakshmi",
        createdAt: dayOffset(-6, 17, 40),
    },
    {
        id: "4",
        type: "Stage change",
        description:
            "Fee-paid leads confirmed as admissions",
        status: "processing",
        affectedCount: 12,
        successfulCount: 5,
        failureCount: 0,
        stageName: "Admission Done",
        substageName: "Admission confirmed",
        createdBy: "Gulshan",
        createdAt: dayOffset(0, 10, 5),
    },
];

export const dialerCampaignRecords: DialerCampaignRecord[] = [
    {
        id: "1",
        campaignName: "August admissions follow-up",
        description:
            "Auto-dial the Meta Ads August batch that has not been contacted",
        callCount: 220,
        connectedCount: 168,
        successRate: 76.4,
        status: "completed",
        createdBy: "ARJUN",
        createdAt: dayOffset(-2, 9, 30),
    },
    {
        id: "2",
        campaignName: "Campus visit reminders",
        description:
            "Remind parents with a scheduled campus visit this week",
        callCount: 48,
        connectedCount: 41,
        successRate: 85.4,
        status: "processing",
        createdBy: "TARUN",
        createdAt: dayOffset(0, 8, 45),
    },
    {
        id: "3",
        campaignName: "Transport fee due calls",
        description:
            "Call parents with a pending transport fee balance",
        callCount: 96,
        connectedCount: 52,
        successRate: 54.2,
        status: "failed",
        createdBy: "Sri Lakshmi",
        createdAt: dayOffset(-7, 15, 0),
    },
];

export const downloadRecords: DownloadRecord[] = [
    {
        id: "1",
        dataset: "Leads",
        fileName: "leads-2026-08-19.csv",
        columns: [
            "Lead ID",
            "Student name",
            "Student ID generated",
            "Payment status",
            "Primary phone",
            "Branch",
            "Class",
            "Curriculum",
            "Stage",
            "Counsellor",
        ],
        recordCount: 1284,
        fileSizeKb: 412.6,
        isFileRetained: true,
        createdBy: "Srikanth Reddy",
        createdAt: "2026-08-19T10:15:00",
    },
    {
        id: "2",
        dataset: "Meta leads awaiting review",
        fileName: "meta-leads-waiting-for-review.csv",
        columns: ["Leadgen ID", "Form", "Page", "Student name", "Phone", "Email"],
        recordCount: 42,
        fileSizeKb: 11.2,
        isFileRetained: true,
        createdBy: "ARJUN",
        createdAt: "2026-08-19T08:02:00",
    },
    {
        id: "3",
        dataset: "Payment collections",
        fileName: "payment-collections-2026-08-18.csv",
        columns: ["Source", "Form / link", "Branch", "Payer", "Amount", "Status"],
        recordCount: 318,
        fileSizeKb: 96.4,
        isFileRetained: false,
        createdBy: "TARUN",
        createdAt: "2026-08-18T18:44:00",
    },
    {
        id: "4",
        dataset: "Remarketing audiences",
        fileName: "meta-remarketing-audiences.csv",
        columns: ["Audience", "Meta audience ID", "Ad account", "CRM leads"],
        recordCount: 4,
        fileSizeKb: 1.8,
        isFileRetained: true,
        createdBy: "Srikanth Reddy",
        createdAt: "2026-08-17T12:30:00",
    },
];

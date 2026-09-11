export interface TrackerWorkflow {
    id: string;
    displayName: string;
    isDefault: boolean;
}

export interface TrackerStage {
    id: string;
    workflowId: string;
    displayName: string;
    color: string;
    stageType: "open" | "in_progress" | "completed" | "cancelled";
}

export interface TrackerUser {
    userId: string;
    employeeId: string;
    name: string;
}

export interface GuestOwner {
    id: string;
    name: string;
}

export interface ApprovalEntry {
    id: string;
    approver: string;
    decision: "pending" | "approved" | "rejected";
    remarks: string;
}

export interface TimeLogEntry {
    id: string;
    loggedBy: string;
    minutesSpent: number;
    workNote: string;
}

export interface ActionItemRecord {
    id: string;
    recordNumber: string;
    title: string;
    description: string;
    workflowId: string;
    workflow: string;
    stageId: string;
    ownerEmployeeId: string;
    guestOwnerId: string;
    owner: string;
    createdAt: string;
    dueAt: string;
    minutesSpent: number;
    estimatedHours: number;
    approvalRequired: boolean;
    approvalStatus: "pending" | "approved" | "rejected" | "not_required";
    approvals: Array<ApprovalEntry>;
    timeLogs: Array<TimeLogEntry>;
}

export interface ApprovalRecord {
    id: string;
    recordId: string;
    actionItem: string;
    actionItemCode: string;
    owner: string;
    approver: string;
    decisionLogin: string;
    decidedAt: string;
    requestedAt: string;
    decision: "pending" | "approved" | "rejected";
    remarks: string;
}

export interface MomPoint {
    id: string;
    operationRecordId: string;
    recordNumber: string;
    actionItem: string;
    owner: string;
    dueAt: string;
    estimatedHours: number;
    minutesSpent: number;
    statusKey: string;
    approvalRequired: boolean;
    approvalStatus: string;
    approvers: string;
    approvalDetails: Array<{
        id: string;
        approver: string;
        decision: string;
        comments: string;
    }>;
    description: string;
    notes: string;
}

export interface MomSession {
    id: string;
    sessionNumber: string;
    createdBy: string;
    endedAt: string;
    notes: string;
    actionItemCount: number;
    points: Array<MomPoint>;
}

export const estimateUnitOptions = [
    { id: "hours", name: "Hours" },
    { id: "days", name: "Days" },
    { id: "weeks", name: "Weeks" },
    { id: "months", name: "Months" },
];

export const deadlineFilterOptions = [
    { id: "overdue", name: "Overdue" },
    { id: "today", name: "Due today" },
    { id: "upcoming", name: "Upcoming" },
    { id: "unscheduled", name: "Unscheduled" },
];

export const approvalFilterOptions = [
    { id: "required", name: "Approval required" },
    { id: "pending", name: "Pending" },
    { id: "approved", name: "Approved" },
    { id: "rejected", name: "Rejected" },
    { id: "not_required", name: "Not required" },
];

export const approvalStatusOptions = [
    { id: "pending", name: "Pending" },
    { id: "approved", name: "Approved" },
    { id: "rejected", name: "Rejected" },
];

export const taskViewOptions = [
    { id: "list", name: "List", icon: "ri-list-check-2" },
    { id: "board", name: "Board", icon: "ri-layout-column-line" },
    { id: "calendar", name: "Calendar", icon: "ri-calendar-2-line" },
];

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const toLocalInputValue = (value: string | Date | undefined | null) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const pad = (part: number) => String(part).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const dateKey = (value: string | Date | undefined | null) => {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const pad = (part: number) => String(part).padStart(2, "0");

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const formatDateTime = (value: string | undefined | null) =>
    value
        ? new Date(value).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        })
        : "—";

export const formatDate = (value: string | undefined | null) =>
    value
        ? new Date(value).toLocaleDateString("en-IN", { dateStyle: "medium" })
        : "—";

export const formatTime = (value: string | undefined | null) =>
    value
        ? new Date(value).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

export const formatDuration = (minutes: number | undefined | null) =>
    `${Math.floor(Number(minutes || 0) / 60)}h ${Number(minutes || 0) % 60}m`;

export const createdLabel = (value: string | undefined | null) => {
    if (!value) {
        return "Created date unavailable";
    }

    const created = new Date(value);

    if (Number.isNaN(created.getTime())) {
        return "Created date unavailable";
    }

    return `Created ${formatDateTime(value)}`;
};

export const formatGap = (milliseconds: number) => {
    const minutes = Math.round(Math.abs(milliseconds) / 60000);

    if (minutes < 1) {
        return "less than a minute";
    }

    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainderMinutes = minutes % 60;

    if (hours < 48) {
        return remainderMinutes
            ? `${hours} hr ${remainderMinutes} min`
            : `${hours} hr`;
    }

    const days = Math.floor(hours / 24);
    const remainderHours = hours % 24;

    if (days >= 7 || !remainderHours) {
        return `${days} days`;
    }

    return `${days} days ${remainderHours} hr`;
};

export interface DueStatus {
    overdue: boolean;
    label: string;
    tone: "danger" | "warning" | "ok";
}

export const getDueStatus = (
    dueAt: string | undefined | null,
    done = false,
    now: number = Date.now(),
): DueStatus | null => {
    if (!dueAt || done) {
        return null;
    }

    const due = new Date(dueAt);

    if (Number.isNaN(due.getTime())) {
        return null;
    }

    const remaining = due.getTime() - now;
    const gap = formatGap(remaining);

    if (remaining < 0) {
        return { overdue: true, label: `overdue by ${gap}`, tone: "danger" };
    }

    return {
        overdue: false,
        label: `${gap} left`,
        tone: remaining <= 24 * 60 * 60 * 1000 ? "warning" : "ok",
    };
};

export const DUE_TONE_CLASS: Record<string, string> = {
    danger: "tw-bg-red-100 tw-text-red-700",
    warning: "tw-bg-amber-100 tw-text-amber-800",
    ok: "tw-bg-emerald-100 tw-text-emerald-700",
};

export const DUE_TONE_TEXT: Record<string, string> = {
    danger: "tw-text-red-600",
    warning: "tw-text-amber-700",
    ok: "tw-text-gray-500",
};

export const estimateInHours = (
    value: string | number,
    unit: string,
) => {
    const multipliers: Record<string, number> = {
        hours: 1,
        days: 24,
        weeks: 24 * 7,
        months: 24 * 30,
    };

    return Number(value || 0) * (multipliers[unit] || 1);
};

export const addEstimateToNow = (value: string | number, unit: string) => {
    const amount = Number(value);

    if (!Number.isFinite(amount) || amount <= 0) {
        return "";
    }

    const deadline = new Date();

    if (unit === "months") {
        deadline.setMonth(deadline.getMonth() + amount);
    } else if (unit === "weeks") {
        deadline.setDate(deadline.getDate() + amount * 7);
    } else if (unit === "days") {
        deadline.setDate(deadline.getDate() + amount);
    } else {
        deadline.setHours(deadline.getHours() + amount);
    }

    return toLocalInputValue(deadline);
};

export const monthWeeks = (cursor: Date) => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const start = new Date(year, month, 1 - new Date(year, month, 1).getDay());
    const weeks: Array<Array<Date>> = [];

    for (let week = 0; week < 6; week += 1) {
        const days = Array.from(
            { length: 7 },
            (_, index) =>
                new Date(
                    start.getFullYear(),
                    start.getMonth(),
                    start.getDate() + week * 7 + index,
                ),
        );

        if (week > 3 && days.every(day => day.getMonth() !== month)) {
            break;
        }

        weeks.push(days);
    }

    return weeks;
};

export const stripHtml = (value: string | undefined | null) =>
    String(value || "")
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();

export const richTextHasContent = (value: string | undefined | null) =>
    stripHtml(value).length > 0;

export const trackerWorkflows: Array<TrackerWorkflow> = [
    { id: "1", displayName: "Admissions Operations", isDefault: true },
    { id: "2", displayName: "Campus Facilities", isDefault: false },
];

export const trackerStages: Array<TrackerStage> = [
    {
        id: "11",
        workflowId: "1",
        displayName: "Open",
        color: "#405189",
        stageType: "open",
    },
    {
        id: "12",
        workflowId: "1",
        displayName: "In Progress",
        color: "#f7b84b",
        stageType: "in_progress",
    },
    {
        id: "13",
        workflowId: "1",
        displayName: "Under Review",
        color: "#299cdb",
        stageType: "in_progress",
    },
    {
        id: "14",
        workflowId: "1",
        displayName: "Completed",
        color: "#0ab39c",
        stageType: "completed",
    },
    {
        id: "15",
        workflowId: "1",
        displayName: "Cancelled",
        color: "#f06548",
        stageType: "cancelled",
    },
    {
        id: "21",
        workflowId: "2",
        displayName: "Reported",
        color: "#405189",
        stageType: "open",
    },
    {
        id: "22",
        workflowId: "2",
        displayName: "Scheduled",
        color: "#f7b84b",
        stageType: "in_progress",
    },
    {
        id: "23",
        workflowId: "2",
        displayName: "Resolved",
        color: "#0ab39c",
        stageType: "completed",
    },
];

export const trackerUsers: Array<TrackerUser> = [
    { userId: "u1", employeeId: "e1", name: "SRIKANTH KUNCHALA" },
    { userId: "u2", employeeId: "e2", name: "MOHAMMED TAUFEEQ AHMED" },
    { userId: "u3", employeeId: "e3", name: "MADHURI CHENNA" },
    { userId: "u4", employeeId: "e4", name: "PRIYA NAIR" },
    { userId: "u5", employeeId: "e5", name: "RAVI TEJA" },
    { userId: "u6", employeeId: "", name: "Srikanth Testing" },
];

export const guestOwners: Array<GuestOwner> = [
    { id: "g1", name: "External Auditor" },
    { id: "g2", name: "Facilities Vendor" },
];

export const actionItemRecords: Array<ActionItemRecord> = [
    {
        id: "a1",
        recordNumber: "MOM-SCHO-000028",
        title: "Prepare Grade 5 admission seat matrix",
        description:
            "Consolidate seat availability across all branches and share the matrix with the admissions committee.",
        workflowId: "1",
        workflow: "Admissions Operations",
        stageId: "12",
        ownerEmployeeId: "e3",
        guestOwnerId: "",
        owner: "MADHURI CHENNA",
        createdAt: "2026-08-10T17:19:00",
        dueAt: "2026-08-16T18:00:00",
        minutesSpent: 150,
        estimatedHours: 8,
        approvalRequired: true,
        approvalStatus: "approved",
        approvals: [
            {
                id: "ap1",
                approver: "MOHAMMED TAUFEEQ AHMED",
                decision: "approved",
                remarks: "Matrix looks complete. Approved for circulation.",
            },
        ],
        timeLogs: [
            {
                id: "tl1",
                loggedBy: "MADHURI CHENNA",
                minutesSpent: 150,
                workNote: "Collated branch-wise seat counts.",
            },
        ],
    },
    {
        id: "a2",
        recordNumber: "MOM-SCHO-000027",
        title: "Verify pending admission documents",
        description:
            "Cross-check the pending document list against the registrar records before the deadline.",
        workflowId: "1",
        workflow: "Admissions Operations",
        stageId: "11",
        ownerEmployeeId: "e3",
        guestOwnerId: "",
        owner: "MADHURI CHENNA",
        createdAt: "2026-08-10T10:13:00",
        dueAt: "2026-08-12T12:00:00",
        minutesSpent: 0,
        estimatedHours: 4,
        approvalRequired: true,
        approvalStatus: "pending",
        approvals: [
            {
                id: "ap2",
                approver: "Srikanth Testing",
                decision: "pending",
                remarks: "",
            },
        ],
        timeLogs: [],
    },
    {
        id: "a3",
        recordNumber: "MOM-SCHO-000026",
        title: "Publish revised transport routes",
        description:
            "Update the Kompally and Miyapur route timings on the parent portal.",
        workflowId: "1",
        workflow: "Admissions Operations",
        stageId: "14",
        ownerEmployeeId: "e1",
        guestOwnerId: "",
        owner: "SRIKANTH KUNCHALA",
        createdAt: "2026-08-09T16:02:00",
        dueAt: "2026-08-11T17:00:00",
        minutesSpent: 90,
        estimatedHours: 3,
        approvalRequired: true,
        approvalStatus: "approved",
        approvals: [
            {
                id: "ap3",
                approver: "MADHURI CHENNA",
                decision: "approved",
                remarks: "Timings verified with the transport desk.",
            },
        ],
        timeLogs: [
            {
                id: "tl2",
                loggedBy: "SRIKANTH KUNCHALA",
                minutesSpent: 90,
                workNote: "Portal updated and cache cleared.",
            },
        ],
    },
    {
        id: "a4",
        recordNumber: "MOM-SCHO-000025",
        title: "Draft counsellor allocation policy",
        description:
            "Prepare the first draft of the branch-wise counsellor allocation policy for review.",
        workflowId: "1",
        workflow: "Admissions Operations",
        stageId: "13",
        ownerEmployeeId: "e1",
        guestOwnerId: "",
        owner: "SRIKANTH KUNCHALA",
        createdAt: "2026-08-09T15:58:00",
        dueAt: "2026-08-14T11:00:00",
        minutesSpent: 45,
        estimatedHours: 6,
        approvalRequired: true,
        approvalStatus: "approved",
        approvals: [
            {
                id: "ap4",
                approver: "SRIKANTH KUNCHALA",
                decision: "approved",
                remarks: "Draft accepted for committee review.",
            },
        ],
        timeLogs: [],
    },
    {
        id: "a5",
        recordNumber: "MOM-SCHO-000024",
        title: "Audit fee reconciliation report",
        description:
            "Reconcile the July fee collections against the ledger entries.",
        workflowId: "1",
        workflow: "Admissions Operations",
        stageId: "12",
        ownerEmployeeId: "",
        guestOwnerId: "g1",
        owner: "External Auditor",
        createdAt: "2026-08-05T09:30:00",
        dueAt: "2026-08-09T18:00:00",
        minutesSpent: 300,
        estimatedHours: 12,
        approvalRequired: false,
        approvalStatus: "not_required",
        approvals: [],
        timeLogs: [
            {
                id: "tl3",
                loggedBy: "External Auditor",
                minutesSpent: 300,
                workNote: "Reconciled 82% of the entries.",
            },
        ],
    },
    {
        id: "a6",
        recordNumber: "MOM-SCHO-000018",
        title: "Replace lab equipment in Block C",
        description:
            "Coordinate with the vendor to replace the faulty microscopes.",
        workflowId: "2",
        workflow: "Campus Facilities",
        stageId: "22",
        ownerEmployeeId: "",
        guestOwnerId: "g2",
        owner: "Facilities Vendor",
        createdAt: "2026-07-31T15:51:00",
        dueAt: "2026-08-20T10:00:00",
        minutesSpent: 0,
        estimatedHours: 16,
        approvalRequired: false,
        approvalStatus: "not_required",
        approvals: [],
        timeLogs: [],
    },
    {
        id: "a7",
        recordNumber: "MOM-SCHO-000016",
        title: "Schedule annual fire safety drill",
        description:
            "Book the drill with the local fire station and inform all branch heads.",
        workflowId: "2",
        workflow: "Campus Facilities",
        stageId: "21",
        ownerEmployeeId: "e2",
        guestOwnerId: "",
        owner: "MOHAMMED TAUFEEQ AHMED",
        createdAt: "2026-07-31T12:43:00",
        dueAt: "",
        minutesSpent: 0,
        estimatedHours: 2,
        approvalRequired: false,
        approvalStatus: "not_required",
        approvals: [],
        timeLogs: [],
    },
    {
        id: "a8",
        recordNumber: "MOM-SCHO-000005",
        title: "Close out pending parent grievances",
        description:
            "Review and close the three grievances pending from the July cycle.",
        workflowId: "1",
        workflow: "Admissions Operations",
        stageId: "15",
        ownerEmployeeId: "e2",
        guestOwnerId: "",
        owner: "MOHAMMED TAUFEEQ AHMED",
        createdAt: "2026-07-30T18:20:00",
        dueAt: "2026-08-04T18:00:00",
        minutesSpent: 60,
        estimatedHours: 5,
        approvalRequired: true,
        approvalStatus: "rejected",
        approvals: [
            {
                id: "ap5",
                approver: "SRIKANTH KUNCHALA",
                decision: "rejected",
                remarks:
                    "Two grievances still lack a written response. Reopen and complete.",
            },
        ],
        timeLogs: [],
    },
    {
        id: "a9",
        recordNumber: "MOM-SCHO-000004",
        title: "Update admission brochure for 2026-27",
        description:
            "Refresh the fee table and campus photographs in the brochure.",
        workflowId: "1",
        workflow: "Admissions Operations",
        stageId: "11",
        ownerEmployeeId: "e4",
        guestOwnerId: "",
        owner: "PRIYA NAIR",
        createdAt: "2026-07-30T18:19:00",
        dueAt: "2026-08-15T16:00:00",
        minutesSpent: 0,
        estimatedHours: 10,
        approvalRequired: true,
        approvalStatus: "pending",
        approvals: [
            {
                id: "ap6",
                approver: "MADHURI CHENNA",
                decision: "pending",
                remarks: "",
            },
        ],
        timeLogs: [],
    },
    {
        id: "a10",
        recordNumber: "MOM-SCHO-000003",
        title: "Collect faculty feedback on the new timetable",
        description:
            "Circulate the feedback form and consolidate responses by branch.",
        workflowId: "1",
        workflow: "Admissions Operations",
        stageId: "12",
        ownerEmployeeId: "e5",
        guestOwnerId: "",
        owner: "RAVI TEJA",
        createdAt: "2026-08-11T09:00:00",
        dueAt: "2026-08-14T18:00:00",
        minutesSpent: 30,
        estimatedHours: 4,
        approvalRequired: false,
        approvalStatus: "not_required",
        approvals: [],
        timeLogs: [],
    },
];

export const approvalRecords: Array<ApprovalRecord> = [
    {
        id: "r1",
        recordId: "a1",
        actionItem: "Prepare Grade 5 admission seat matrix",
        actionItemCode: "MOM-SCHO-000028",
        owner: "MADHURI CHENNA",
        approver: "MOHAMMED TAUFEEQ AHMED",
        decisionLogin: "SRIKANTH KUNCHALA",
        decidedAt: "2026-08-10T17:20:00",
        requestedAt: "2026-08-10T17:19:00",
        decision: "approved",
        remarks: "Matrix looks complete. Approved for circulation.",
    },
    {
        id: "r2",
        recordId: "a2",
        actionItem: "Verify pending admission documents",
        actionItemCode: "MOM-SCHO-000027",
        owner: "MADHURI CHENNA",
        approver: "Srikanth Testing",
        decisionLogin: "",
        decidedAt: "",
        requestedAt: "2026-08-10T10:13:00",
        decision: "pending",
        remarks: "",
    },
    {
        id: "r3",
        recordId: "a4",
        actionItem: "Draft counsellor allocation policy",
        actionItemCode: "MOM-SCHO-000025",
        owner: "SRIKANTH KUNCHALA",
        approver: "SRIKANTH KUNCHALA",
        decisionLogin: "SRIKANTH KUNCHALA",
        decidedAt: "2026-08-09T16:10:00",
        requestedAt: "2026-08-09T15:58:00",
        decision: "approved",
        remarks: "Draft accepted for committee review.",
    },
    {
        id: "r4",
        recordId: "a3",
        actionItem: "Publish revised transport routes",
        actionItemCode: "MOM-SCHO-000026",
        owner: "SRIKANTH KUNCHALA",
        approver: "MADHURI CHENNA",
        decisionLogin: "MADHURI CHENNA",
        decidedAt: "2026-08-09T16:04:00",
        requestedAt: "2026-08-09T16:02:00",
        decision: "approved",
        remarks: "Timings verified with the transport desk.",
    },
    {
        id: "r5",
        recordId: "a8",
        actionItem: "Close out pending parent grievances",
        actionItemCode: "MOM-SCHO-000005",
        owner: "MOHAMMED TAUFEEQ AHMED",
        approver: "SRIKANTH KUNCHALA",
        decisionLogin: "SRIKANTH KUNCHALA",
        decidedAt: "2026-08-09T15:44:00",
        requestedAt: "2026-07-30T18:20:00",
        decision: "rejected",
        remarks:
            "Two grievances still lack a written response. Reopen and complete.",
    },
    {
        id: "r6",
        recordId: "a7",
        actionItem: "Schedule annual fire safety drill",
        actionItemCode: "MOM-SCHO-000016",
        owner: "MOHAMMED TAUFEEQ AHMED",
        approver: "SRIKANTH KUNCHALA",
        decisionLogin: "SRIKANTH KUNCHALA",
        decidedAt: "2026-08-02T19:29:00",
        requestedAt: "2026-07-31T12:43:00",
        decision: "approved",
        remarks: "Drill date confirmed with the fire station.",
    },
    {
        id: "r7",
        recordId: "a6",
        actionItem: "Replace lab equipment in Block C",
        actionItemCode: "MOM-SCHO-000018",
        owner: "MOHAMMED TAUFEEQ AHMED",
        approver: "SRIKANTH KUNCHALA",
        decisionLogin: "SRIKANTH KUNCHALA",
        decidedAt: "2026-07-31T15:51:00",
        requestedAt: "2026-07-31T15:51:00",
        decision: "approved",
        remarks: "Vendor quotation accepted.",
    },
    {
        id: "r8",
        recordId: "a9",
        actionItem: "Update admission brochure for 2026-27",
        actionItemCode: "MOM-SCHO-000004",
        owner: "PRIYA NAIR",
        approver: "MADHURI CHENNA",
        decisionLogin: "",
        decidedAt: "",
        requestedAt: "2026-07-30T18:19:00",
        decision: "pending",
        remarks: "",
    },
];

export const momSessions: Array<MomSession> = [
    {
        id: "m1",
        sessionNumber: "MOM-SESSION-SCHO-1786116483524",
        createdBy: "SRIKANTH KUNCHALA",
        endedAt: "2026-08-10T17:19:00",
        notes: "<p>Reviewed the Grade 5 admissions pipeline. Agreed to publish the seat matrix before the committee meets on Friday.</p><ul><li>Document verification backlog to be cleared this week</li><li>Transport route revisions to go live alongside the brochure</li></ul>",
        actionItemCount: 2,
        points: [
            {
                id: "p1",
                operationRecordId: "a1",
                recordNumber: "MOM-SCHO-000028",
                actionItem: "Prepare Grade 5 admission seat matrix",
                owner: "MADHURI CHENNA",
                dueAt: "2026-08-16T18:00:00",
                estimatedHours: 8,
                minutesSpent: 150,
                statusKey: "in_progress",
                approvalRequired: true,
                approvalStatus: "approved",
                approvers: "MOHAMMED TAUFEEQ AHMED",
                approvalDetails: [
                    {
                        id: "ap1",
                        approver: "MOHAMMED TAUFEEQ AHMED",
                        decision: "approved",
                        comments:
                            "Matrix looks complete. Approved for circulation.",
                    },
                ],
                description:
                    "Consolidate seat availability across all branches.",
                notes: "<p>Seat matrix to cover all six branches.</p>",
            },
            {
                id: "p2",
                operationRecordId: "a2",
                recordNumber: "MOM-SCHO-000027",
                actionItem: "Verify pending admission documents",
                owner: "MADHURI CHENNA",
                dueAt: "2026-08-12T12:00:00",
                estimatedHours: 4,
                minutesSpent: 0,
                statusKey: "open",
                approvalRequired: true,
                approvalStatus: "pending",
                approvers: "Srikanth Testing",
                approvalDetails: [
                    {
                        id: "ap2",
                        approver: "Srikanth Testing",
                        decision: "pending",
                        comments: "",
                    },
                ],
                description:
                    "Cross-check the pending document list against registrar records.",
                notes: "",
            },
            {
                id: "p3",
                operationRecordId: "",
                recordNumber: "",
                actionItem: "",
                owner: "",
                dueAt: "",
                estimatedHours: 0,
                minutesSpent: 0,
                statusKey: "",
                approvalRequired: false,
                approvalStatus: "",
                approvers: "",
                approvalDetails: [],
                description: "",
                notes: "<p>Discussion point: consider extending the enquiry window by a week.</p>",
            },
        ],
    },
    {
        id: "m2",
        sessionNumber: "MOM-SESSION-SCHO-1785679084080",
        createdBy: "SRIKANTH KUNCHALA",
        endedAt: "2026-08-02T19:28:00",
        notes: "<p>Facilities review for the new academic year.</p><ul><li>Block C lab equipment replacement approved</li><li>Fire safety drill to be scheduled before the term begins</li></ul>",
        actionItemCount: 2,
        points: [
            {
                id: "p4",
                operationRecordId: "a6",
                recordNumber: "MOM-SCHO-000018",
                actionItem: "Replace lab equipment in Block C",
                owner: "Facilities Vendor",
                dueAt: "2026-08-20T10:00:00",
                estimatedHours: 16,
                minutesSpent: 0,
                statusKey: "in_progress",
                approvalRequired: false,
                approvalStatus: "",
                approvers: "",
                approvalDetails: [],
                description: "Coordinate with the vendor for replacements.",
                notes: "",
            },
            {
                id: "p5",
                operationRecordId: "a7",
                recordNumber: "MOM-SCHO-000016",
                actionItem: "Schedule annual fire safety drill",
                owner: "MOHAMMED TAUFEEQ AHMED",
                dueAt: "",
                estimatedHours: 2,
                minutesSpent: 0,
                statusKey: "open",
                approvalRequired: false,
                approvalStatus: "",
                approvers: "",
                approvalDetails: [],
                description: "Book the drill with the local fire station.",
                notes: "",
            },
        ],
    },
    {
        id: "m3",
        sessionNumber: "MOM-SESSION-SCHO-1785042110233",
        createdBy: "MADHURI CHENNA",
        endedAt: "2026-07-26T11:05:00",
        notes: "<p>Weekly counsellor sync. No action items raised; the team is on track with the current allocation.</p>",
        actionItemCount: 0,
        points: [],
    },
];

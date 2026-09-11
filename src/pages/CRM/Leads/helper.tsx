import {
    StatusLabel,
    UserDetails,
} from "../../../Components/Common";
import {
    IOptionsHrtl,
    MenuOptionHrtl,
} from "../../../Components/Common/MenuOptions";

export interface LeadRecord {
    id: string;
    studentName: string;
    phone: string;
    className: string;
    branchId: string;
    branchName: string;
    leadType: string;
    source: string;
    sourceDate: string;
    sourceDateValue: string;
    stage: string;
    status: string;
    owner: string;
    nextFollowUp: string;
    nextFollowUpValue: string;
    nextFollowUpStatus: string;
    followUpOwner: string;
    recentModified: string;
    bucket: string;
}

interface LeadRow {
    original: LeadRecord;
}

export interface LeadHistoryMilestone {
    id: string;
    labelName: string;
    dateText: string;
    timeText: string;
    relativeText: string;
    emptyText: string;
    isCompleted: boolean;
}

export interface LeadHistoryEntry {
    id: string;
    type: string;
    title: string;
    performedBy: string;
    description: string;
    relativeText: string;
}

export interface LeadHistoryRecord {
    leadNumber: string;
    currentStage: string;
    currentSubStage: string;
    nextFollowUp: string;
    leadOwner: string;
    milestones: LeadHistoryMilestone[];
    activities: LeadHistoryEntry[];
}

const getStudentInitial = (studentName: string) =>
    studentName.trim().charAt(0).toUpperCase() || "-";

const getStudentInitialClassName = (status: string) =>
    status === "Touched"
        ? "tw-bg-green-100 tw-text-green-700 tw-border-green-200"
        : "tw-bg-red-100 tw-text-red-700 tw-border-red-200";

export const branchOptions = [
    { id: "nacharam", name: "Nacharam" },
    { id: "bowenpally", name: "Bowenpally" },
    { id: "mahendra-hills", name: "Mahendra Hills" },
];

export const leadTypeOptions = [
    { id: "new-admission", name: "New Admission" },
    { id: "transfer", name: "Transfer" },
    { id: "readmission", name: "Readmission" },
];

export const leadStatusOptions = [
    { id: "Untouched", name: "Untouched" },
    { id: "Touched", name: "Touched" },
    { id: "Qualified", name: "Qualified" },
    { id: "Admitted", name: "Admitted" },
    { id: "Closed", name: "Closed" },
];

export const sourceOptions = [
    { id: "Meta Ads", name: "Meta Ads" },
    { id: "Website", name: "Website" },
    { id: "Google Ads", name: "Google Ads" },
    { id: "Walk-in", name: "Walk-in" },
];

export const nextFollowUpOptions = [
    { id: "all", name: "Added" },
    { id: "scheduled", name: "Updated" },
    { id: "today", name: "Refered" },
    { id: "overdue", name: "Follow up" },
    { id: "not-scheduled", name: "Re Enquired" },
];

export const followUpOwnerOptions = [
    { id: "all", name: "All owners" },
    { id: "unassigned", name: "Unassigned" },
    { id: "srikanth", name: "ARJUN" },
    { id: "taufeeq", name: "Gulshan" },
];

export const viewsList = [
    {
        id: "view-1",
        labelName: "View One",
        count: 6,
    },
    {
        id: "view-2",
        labelName: "View Two",
        count: 2,
    },

];

export const leadTabOptions = [
    {
        id: "all",
        labelName: "All",
        count: 6,
        customPadding: "0px 16px",
    },
    {
        id: "new",
        labelName: "New",
        count: 2,
        customPadding: "0px 16px",
    },
    {
        id: "not-connected",
        labelName: "Not Connected",
        count: 0,
        customPadding: "0px 16px",
    },
    {
        id: "campus-visit",
        labelName: "Campus Visit",
        count: 3,
        customPadding: "0px 16px",
    },
    {
        id: "not-interested",
        labelName: "Not Interested",
        count: 0,
        customPadding: "0px 16px",
    },
    {
        id: "lost",
        labelName: "Lost",
        count: 0,
        customPadding: "0px 16px",
    },
    {
        id: "application",
        labelName: "Application",
        count: 1,
        customPadding: "0px 16px",
    },
    {
        id: "admission-done",
        labelName: "Admission Done",
        count: 0,
        customPadding: "0px 16px",
    },
    {
        id: "re-enquired",
        labelName: "Re-enquired",
        count: 2,
        customPadding: "0px 16px",
    },
];

const stageColorMap = {
    contacted: "waring",
    untouched: "rejected",
    application: "inprogress",
    campusvisit: "inprogress",
    admission: "active",
}

export const leadActivityFilterOptions = [
    { id: "all", name: "All activity" },
    { id: "stage", name: "Stage changes" },
    { id: "followup", name: "Follow-ups" },
    { id: "communication", name: "Communication" },
    { id: "workflow", name: "Workflows" },
];

const MONTH_INDEX_MAP: Record<string, number> = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
};

const parseLeadDateTime = (value: string) => {
    const matchedValue = value
        ?.trim()
        .match(
            /^(\d{1,2}) ([A-Za-z]{3})[a-z]* (\d{4}),\s*(\d{1,2}):(\d{2})\s*(am|pm)$/i,
        );

    if (!matchedValue) {
        return null;
    }

    const monthIndex =
        MONTH_INDEX_MAP[matchedValue[2].toLowerCase()];

    if (monthIndex === undefined) {
        return null;
    }

    const isAfterNoon =
        matchedValue[6].toLowerCase() === "pm";
    const hourValue = Number(matchedValue[4]) % 12;

    return new Date(
        Number(matchedValue[3]),
        monthIndex,
        Number(matchedValue[1]),
        isAfterNoon ? hourValue + 12 : hourValue,
        Number(matchedValue[5]),
    );
};

export const getLeadDatePart = (value: string) => {
    const parsedDate = parseLeadDateTime(value);

    return parsedDate
        ? value.split(",")[0].trim()
        : value || "";
};

export const getLeadTimePart = (value: string) => {
    const parsedDate = parseLeadDateTime(value);

    return parsedDate
        ? value.split(",")[1]?.trim() || ""
        : "";
};

export const getLeadRelativeText = (value: string) => {
    const parsedDate = parseLeadDateTime(value);

    if (!parsedDate) {
        return "";
    }

    const differenceInDays = Math.floor(
        (new Date().getTime() - parsedDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    if (differenceInDays < 0) {
        const upcomingDays = Math.abs(differenceInDays);

        return upcomingDays <= 1
            ? "Due tomorrow"
            : `In ${upcomingDays} days`;
    }

    if (differenceInDays === 0) {
        return "Today";
    }

    return differenceInDays === 1
        ? "1 day ago"
        : `${differenceInDays} days ago`;
};

const buildMilestone = (
    id: string,
    labelName: string,
    value: string,
    emptyText: string,
): LeadHistoryMilestone => {
    const isCompleted = !!parseLeadDateTime(value);

    return {
        id,
        labelName,
        dateText: isCompleted ? getLeadDatePart(value) : "",
        timeText: isCompleted ? getLeadTimePart(value) : "",
        relativeText: isCompleted
            ? getLeadRelativeText(value)
            : "",
        emptyText,
        isCompleted,
    };
};

export const getLeadHistory = (
    lead: LeadRecord,
): LeadHistoryRecord => {
    const historyDetails =
        dummyLeadHistoryMap[lead.id] || {};

    return {
        leadNumber:
            historyDetails.leadNumber ||
            `ADM-2026-000${lead.id}`,
        currentStage: lead.stage || "Not specified",
        currentSubStage:
            historyDetails.currentSubStage ||
            "Not specified",
        nextFollowUp: lead.nextFollowUp || "Not scheduled",
        leadOwner: lead.owner || "Unassigned",
        milestones: [
            buildMilestone(
                "added",
                "Added",
                lead.sourceDate,
                "Not recorded",
            ),
            buildMilestone(
                "updated",
                "Updated",
                lead.recentModified,
                "Not recorded",
            ),
            buildMilestone(
                "referred",
                "Referred",
                historyDetails.referredOn || "",
                "Not recorded",
            ),
            buildMilestone(
                "re-enquired",
                "Re-enquired",
                historyDetails.reEnquiredOn || "",
                "Not recorded",
            ),
            buildMilestone(
                "next-follow-up",
                "Next follow-up",
                lead.nextFollowUp,
                "Not scheduled",
            ),
        ],
        activities: historyDetails.activities || [],
    };
};

export function generateColumns(
    actionsList: Array<IOptionsHrtl>,
) {
    return [
        {
            Header: "Student",
            accessor: "studentName",
            disableSortBy: true,

            Cell: ({
                row: { original },
            }: { row: LeadRow }) => {
                return (
                    <div className="tw-flex tw-items-center">
                        <div
                            className={`tw-me-2 tw-flex tw-h-8 tw-w-8 tw-flex-shrink-0 tw-items-center tw-justify-center tw-rounded tw-border tw-text-sm tw-font-semibold ${getStudentInitialClassName(original.status)}`}
                        >
                            {getStudentInitial(
                                original.studentName,
                            )}
                        </div>
                        <UserDetails
                            displayName={original.studentName}
                            displayId={original.phone}
                            showAvatar={false}
                        />
                    </div>
                );
            },
        },

        {
            Header: "Class / Branch",
            accessor: "className",
            disableSortBy: true,

            Cell: ({
                row: { original },
            }: { row: LeadRow }) => {
                return (
                    <UserDetails
                        displayName={original.className || "-"}
                        displayId={original.branchName}
                        showAvatar={false}
                    />
                );
            },
        },

        {
            Header: "Lead Type",
            accessor: "leadType",
            disableSortBy: true,
        },

        {
            Header: "Source",
            accessor: "source",
            disableSortBy: true,

            Cell: ({
                row: { original },
            }: { row: LeadRow }) => {
                return (
                    <UserDetails
                        displayName={original.source}
                        displayId={original.sourceDate}
                        showAvatar={false}
                    />
                );
            },
        },

        {
            Header: "Stage",
            accessor: "stage",
            disableSortBy: true,

            Cell: ({
                row: { original },
            }: { row: LeadRow }) => {
                return (
                    <StatusLabel
                        type={stageColorMap[original?.stage?.split(" ").join("").toLowerCase()]}
                        labelName={original.stage}
                    />
                );
            },
        },

        {
            Header: "Owner",
            accessor: "owner",
            disableSortBy: true,
        },

        {
            Header: "Next follow-up",
            accessor: "nextFollowUp",
            disableSortBy: true,
        },

        {
            Header: "Recent modified",
            accessor: "recentModified",
            disableSortBy: true,
        },

        {
            Header: "Actions",
            disableSortBy: true,

            Cell: ({
                row: { original },
            }: { row: LeadRow }) => {
                return (
                    <MenuOptionHrtl
                        actionOptions={actionsList}
                        rowId={original.id}
                    />
                );
            },
        },
    ];
}

export const dummyLeadsData = [
    {
        id: "1",
        studentName: "Test",
        phone: "+919281122104",
        className: "Class V",
        branchId: "nacharam",
        branchName: "Nacharam",
        leadType: "New Admission",
        source: "Meta Ads",
        sourceDate: "12 Aug 2026, 1:50 pm",
        sourceDateValue: "2026-08-12",
        stage: "Untouched",
        status: "Untouched",
        owner: "Unassigned",
        nextFollowUp: "Not scheduled",
        nextFollowUpValue: "",
        nextFollowUpStatus: "Not Scheduled",
        followUpOwner: "Unassigned",
        recentModified: "12 Aug 2026, 1:50 pm",
        bucket: "untouched",
    },
    {
        id: "2",
        studentName: "Raj",
        phone: "+919966369102",
        className: "Class IV",
        branchId: "nacharam",
        branchName: "Nacharam",
        leadType: "Transfer",
        source: "Meta Ads",
        sourceDate: "12 Aug 2026, 1:27 pm",
        sourceDateValue: "2026-08-12",
        stage: "Contacted",
        status: "Touched",
        owner: "Unassigned",
        nextFollowUp: "13 Aug 2026, 10:30 am",
        nextFollowUpValue: "2026-08-13",
        nextFollowUpStatus: "Scheduled",
        followUpOwner: "Unassigned",
        recentModified: "12 Aug 2026, 1:27 pm",
        bucket: "touched",
    },
    {
        id: "3",
        studentName: "Bowenpally enquiry form",
        phone: "9666040678",
        className: "Class I",
        branchId: "bowenpally",
        branchName: "Bowenpally",
        leadType: "New Admission",
        source: "Website",
        sourceDate: "10 Aug 2026, 4:35 pm",
        sourceDateValue: "2026-08-10",
        stage: "Application",
        status: "Qualified",
        owner: "ARJUN",
        nextFollowUp: "12 Aug 2026, 9:00 am",
        nextFollowUpValue: "2026-08-12",
        nextFollowUpStatus: "Today",
        followUpOwner: "ARJUN",
        recentModified: "10 Aug 2026, 4:35 pm",
        bucket: "pending-followups",
    },
    {
        id: "4",
        studentName: "Rahul Kumar",
        phone: "9966369102",
        className: "Cambridge - EY - 1",
        branchId: "mahendra-hills",
        branchName: "Mahendra Hills",
        leadType: "Readmission",
        source: "Google Ads",
        sourceDate: "9 Aug 2026, 11:23 pm",
        sourceDateValue: "2026-08-09",
        stage: "Campus Visit",
        status: "Touched",
        owner: "ARJUN",
        nextFollowUp: "12 Aug 2026, 6:37 pm",
        nextFollowUpValue: "2026-08-12",
        nextFollowUpStatus: "Today",
        followUpOwner: "ARJUN",
        recentModified: "12 Aug 2026, 3:35 pm",
        bucket: "pending-followups",
    },
    {
        id: "5",
        studentName: "Test whatsapp",
        phone: "9281122104",
        className: "Power BI - IV",
        branchId: "mahendra-hills",
        branchName: "Mahendra Hills",
        leadType: "New Admission",
        source: "Website",
        sourceDate: "9 Aug 2026, 11:06 pm",
        sourceDateValue: "2026-08-09",
        stage: "Campus Visit",
        status: "Touched",
        owner: "Gulshan",
        nextFollowUp: "11 Aug 2026, 3:15 pm",
        nextFollowUpValue: "2026-08-11",
        nextFollowUpStatus: "Overdue",
        followUpOwner: "Gulshan",
        recentModified: "12 Aug 2026, 4:09 pm",
        bucket: "pending-followups",
    },
    {
        id: "6",
        studentName: "test lead",
        phone: "9876347411",
        className: "Power BI - VIII",
        branchId: "nacharam",
        branchName: "Nacharam",
        leadType: "Transfer",
        source: "Website",
        sourceDate: "8 Aug 2026, 12:49 pm",
        sourceDateValue: "2026-08-08",
        stage: "Campus Visit",
        status: "Closed",
        owner: "ARJUN",
        nextFollowUp: "9 Aug 2026, 1:18 pm",
        nextFollowUpValue: "2026-08-09",
        nextFollowUpStatus: "Overdue",
        followUpOwner: "ARJUN",
        recentModified: "10 Aug 2026, 4:17 pm",
        bucket: "closed",
    },
    {
        id: "7",
        studentName: "Nisha Reddy",
        phone: "9848012345",
        className: "Class II",
        branchId: "bowenpally",
        branchName: "Bowenpally",
        leadType: "New Admission",
        source: "Walk-in",
        sourceDate: "7 Aug 2026, 10:20 am",
        sourceDateValue: "2026-08-07",
        stage: "Admission",
        status: "Admitted",
        owner: "ARJUN",
        nextFollowUp: "Not scheduled",
        nextFollowUpValue: "",
        nextFollowUpStatus: "Not Scheduled",
        followUpOwner: "ARJUN",
        recentModified: "12 Aug 2026, 10:15 am",
        bucket: "admitted",
    },
];

interface LeadHistoryDetails {
    leadNumber?: string;
    currentSubStage?: string;
    referredOn?: string;
    reEnquiredOn?: string;
    activities?: LeadHistoryEntry[];
}

const dummyLeadHistoryMap: Record<
    string,
    LeadHistoryDetails
> = {
    "1": {
        leadNumber: "ADM-2026-000637",
        currentSubStage: "Not specified",
        activities: [
            {
                id: "1-2",
                type: "workflow",
                title: "Workflow “whatsapp test” executed",
                performedBy: "TARUN",
                description:
                    "Workflow “whatsapp test” executed",
                relativeText: "1 day ago",
            },
            {
                id: "1-1",
                type: "created",
                title: "Lead created",
                performedBy: "TARUN",
                description:
                    "Lead captured from Meta Lead Ads (form 1061592760139342)",
                relativeText: "1 day ago",
            },
        ],
    },
    "2": {
        leadNumber: "ADM-2026-000638",
        currentSubStage: "Call attempted",
        activities: [
            {
                id: "2-3",
                type: "followup",
                title: "Follow-up scheduled",
                performedBy: "TARUN",
                description:
                    "Next follow-up scheduled on 13 Aug 2026, 10:30 am",
                relativeText: "1 day ago",
            },
            {
                id: "2-2",
                type: "stage",
                title: "Stage changed to Contacted",
                performedBy: "TARUN",
                description:
                    "Stage moved from New to Contacted after first call",
                relativeText: "1 day ago",
            },
            {
                id: "2-1",
                type: "created",
                title: "Lead created",
                performedBy: "TARUN",
                description:
                    "Lead captured from Meta Lead Ads (form 1061592760139342)",
                relativeText: "1 day ago",
            },
        ],
    },
    "3": {
        leadNumber: "ADM-2026-000639",
        currentSubStage: "Application shared",
        referredOn: "11 Aug 2026, 11:05 am",
        activities: [
            {
                id: "3-3",
                type: "communication",
                title: "Application form shared",
                performedBy: "ARJUN",
                description:
                    "Application form emailed to the parent",
                relativeText: "3 days ago",
            },
            {
                id: "3-2",
                type: "stage",
                title: "Stage changed to Application",
                performedBy: "ARJUN",
                description:
                    "Stage moved from Campus Visit to Application",
                relativeText: "3 days ago",
            },
            {
                id: "3-1",
                type: "created",
                title: "Lead created",
                performedBy: "ARJUN",
                description:
                    "Lead captured from the website enquiry form",
                relativeText: "3 days ago",
            },
        ],
    },
    "4": {
        leadNumber: "ADM-2026-000640",
        currentSubStage: "Campus visit done",
        reEnquiredOn: "12 Aug 2026, 9:40 am",
        activities: [
            {
                id: "4-2",
                type: "followup",
                title: "Campus visit completed",
                performedBy: "ARJUN",
                description:
                    "Parent visited Mahendra Hills campus and met the counsellor",
                relativeText: "1 day ago",
            },
            {
                id: "4-1",
                type: "created",
                title: "Lead created",
                performedBy: "ARJUN",
                description:
                    "Lead captured from Google Ads campaign",
                relativeText: "4 days ago",
            },
        ],
    },
    "5": {
        leadNumber: "ADM-2026-000641",
        currentSubStage: "Awaiting parent response",
        activities: [
            {
                id: "5-2",
                type: "communication",
                title: "WhatsApp message sent",
                performedBy: "Gulshan",
                description:
                    "Campus brochure shared over WhatsApp",
                relativeText: "2 days ago",
            },
            {
                id: "5-1",
                type: "created",
                title: "Lead created",
                performedBy: "Gulshan",
                description:
                    "Lead captured from the website enquiry form",
                relativeText: "4 days ago",
            },
        ],
    },
    "6": {
        leadNumber: "ADM-2026-000642",
        currentSubStage: "Not interested",
        activities: [
            {
                id: "6-1",
                type: "created",
                title: "Lead created",
                performedBy: "ARJUN",
                description:
                    "Lead captured from the website enquiry form",
                relativeText: "5 days ago",
            },
        ],
    },
    "7": {
        leadNumber: "ADM-2026-000643",
        currentSubStage: "Admission confirmed",
        activities: [
            {
                id: "7-2",
                type: "stage",
                title: "Stage changed to Admission",
                performedBy: "ARJUN",
                description:
                    "Admission confirmed after fee payment",
                relativeText: "1 day ago",
            },
            {
                id: "7-1",
                type: "created",
                title: "Lead created",
                performedBy: "ARJUN",
                description:
                    "Walk-in enquiry registered at Bowenpally campus",
                relativeText: "6 days ago",
            },
        ],
    },
};

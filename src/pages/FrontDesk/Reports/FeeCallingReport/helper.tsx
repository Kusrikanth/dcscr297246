import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat, getDateWithTimeFormat } from "../../../../utility/dateutility";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { format, subDays } from "date-fns";

/** Window for the day-wise chart: the applied "Called On" range, else the last 7 days (inclusive of today). */
export function getDayWiseRange(followUpStartDate?: string | null, followUpEndDate?: string | null) {
    if (followUpStartDate && followUpEndDate) {
        return { startDate: followUpStartDate, endDate: followUpEndDate };
    }
    const today = new Date();
    return { startDate: format(subDays(today, 6), "yyyy-MM-dd"), endDate: format(today, "yyyy-MM-dd") };
}

export const eliteYesNoOptions = [
    { id: "true", name: "Yes" },
    { id: "false", name: "No" },
];

/** Multi-select filters are kept as option objects in state; the API expects comma-separated ids. */
export const multiSelectFilterKeys: Record<string, string> = {
    statusIds: "id",
    chronicParentTypeIds: "id",
    callerIds: "employeeId",
};

export function serializeFilters(filters: any) {
    const serialized: any = { ...filters };
    Object.entries(multiSelectFilterKeys).forEach(([key, idKey]) => {
        const value = filters?.[key];
        serialized[key] = Array.isArray(value) ? value.map((item: any) => item?.[idKey]).filter(Boolean).join(",") : (value || "");
    });
    return serialized;
}

/** Columns offered in the Excel export; keys are what the export API receives in `columns`. */
export const exportColumnOptions: Array<{ key: string; label: string; group: string }> = [
    { key: "studentName", label: "Student Name", group: "Student" },
    { key: "studentCode", label: "Student ID", group: "Student" },
    { key: "curriculumName", label: "Curriculum", group: "Student" },
    { key: "className", label: "Class", group: "Student" },
    { key: "sectionName", label: "Section", group: "Student" },
    { key: "contactPersonName", label: "Contact Person", group: "Contact" },
    { key: "contactNumber", label: "Phone No.", group: "Contact" },
    { key: "fatherContact", label: "Father Contact", group: "Contact" },
    { key: "motherContact", label: "Mother Contact", group: "Contact" },
    { key: "totalOutstandingAmount", label: "Outstanding Amount", group: "Fee" },
    { key: "createdAt", label: "Called On", group: "Call" },
    { key: "employeeName", label: "Called By", group: "Call" },
    { key: "statusName", label: "Outcome", group: "Call" },
    { key: "remarks", label: "Remarks", group: "Call" },
    { key: "nextRemarkActionDate", label: "Next Action Date", group: "Call" },
    { key: "isChronicParent", label: "Is Chronic Parent", group: "Chronic Parent" },
    { key: "chronicParentTypeName", label: "Chronic Parent Type", group: "Chronic Parent" },
];

export function stripHtml(html: string) {
    if (!html) return "";
    const temp = document.createElement("div");
    temp.innerHTML = html;
    return temp.textContent?.trim() || "";
}

export function generateColumns(academicYearId: string) {
    return [
        {
            Header: "Student Name",
            accessor: "studentName",
            columnClassName: "w-200px min-w-200px",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => (
                <UserDetails
                    displayName={original?.studentName}
                    displayId={original?.studentCode}
                    showAvatar={false}
                    redirectUrl={"/student-fee-ledger/fee-details"}
                    urlProps={{ academicYearId, studentId: original?.studentId }}
                />
            ),
        },
        {
            Header: "Class",
            accessor: "className",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => (
                <span className="tw-text-nowrap">
                    {original?.className || "-"}{original?.sectionName ? ` - ${original.sectionName}` : ""}
                </span>
            ),
        },
        {
            Header: "Contact Person",
            accessor: "contactPersonName",
            disableSortBy: true,
            Cell: ({ value }: any) => <span>{value || "-"}</span>,
        },
        {
            Header: "Phone No.",
            accessor: "contactNumber",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => (
                <span className="tw-text-nowrap">{original?.contactNumber || original?.fatherContact || original?.motherContact || "-"}</span>
            ),
        },
        {
            Header: "Outstanding (₹)",
            accessor: "totalOutstandingAmount",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ value }: any) => <span>{getDisplayAmountValue(+value || 0)}</span>,
        },
        {
            Header: "Called On",
            accessor: "createdAt",
            disableSortBy: true,
            columnClassName: "w-200px min-w-200px",
            Cell: ({ value }: any) => <span className="tw-text-nowrap">{value ? getDateWithTimeFormat(`${value}Z`) : "-"}</span>,
        },
        {
            Header: "Called By",
            accessor: "employeeName",
            disableSortBy: true,
            Cell: ({ value }: any) => <span className="tw-text-nowrap">{value || "-"}</span>,
        },
        {
            Header: "Outcome",
            accessor: "statusName",
            disableSortBy: true,
            Cell: ({ value }: any) => value ? <StatusLabel type={value} labelName={value} /> : <span>-</span>,
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            disableSortBy: true,
            columnClassName: "w-250px min-w-250px",
            Cell: ({ value }: any) => {
                const text = stripHtml(value);
                if (!text) return <span>-</span>;
                const short = text.length > 90 ? `${text.slice(0, 90)}…` : text;
                return <span title={text}>{short}</span>;
            },
        },
        {
            Header: "Next Action Date",
            accessor: "nextRemarkActionDate",
            disableSortBy: true,
            Cell: ({ value }: any) => <span className="tw-text-nowrap">{value ? getDdMmYyyyWithMonthNameFormat(value) : "-"}</span>,
        },
        {
            Header: "Chronic Parent",
            accessor: "isChronicParent",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ value }: any) => <StatusLabel type={value ? "yes" : "no"} labelName={value ? "Yes" : "No"} />,
        },
        {
            Header: "Chronic Parent Type",
            accessor: "chronicParentTypeName",
            disableSortBy: true,
            Cell: ({ value }: any) => <span className="tw-text-nowrap">{value || "-"}</span>,
        },
    ];
}

// TODO: remove once the calling-report APIs are available. Lets the UI be reviewed without a backend.
export const USE_SAMPLE_FEE_CALLING_REPORT = true;

export const sampleFeeCallingReport = {
    data: [
        { id: 1, studentId: 65473, studentCode: "1250286", studentName: "2nd feb17th", className: "II", sectionName: "II-A", contactPersonName: "dsdswed", contactNumber: "9627027666", totalOutstandingAmount: 3000, createdAt: "2026-09-10T06:42:00", employeeName: "ANCY THOMAS", statusName: "Promised to Pay", remarks: "<p>Parent promised to clear the transport fee by next week.</p>", nextRemarkActionDate: "2026-09-18", isChronicParent: false, chronicParentTypeName: "" },
        { id: 2, studentId: 65474, studentCode: "1260072", studentName: "eewW", className: "II", sectionName: "II-B", contactPersonName: "re", contactNumber: "9343434324", totalOutstandingAmount: 47674, createdAt: "2026-09-10T04:11:00", employeeName: "User", statusName: "Not Reachable", remarks: "<p>Phone switched off. Tried twice.</p>", nextRemarkActionDate: "2026-09-12", isChronicParent: true, chronicParentTypeName: "Unresponsive to Follow-Ups" },
        { id: 3, studentId: 65475, studentCode: "1230536", studentName: "AADHYA RAGINI SAMARAPALLY", className: "I", sectionName: "", contactPersonName: "Ragini", contactNumber: "9876501234", totalOutstandingAmount: 169184, createdAt: "2026-09-09T09:20:00", employeeName: "ANCY THOMAS", statusName: "Requested Time", remarks: "<p>Requested extension till month end due to a family emergency.</p>", nextRemarkActionDate: "2026-09-30", isChronicParent: true, chronicParentTypeName: "Repeated Late Payment" },
        { id: 4, studentId: 65476, studentCode: "1230312", studentName: "AARAV JALAN", className: "I", sectionName: "I-A", contactPersonName: "Mr. Jalan", contactNumber: "9012345678", totalOutstandingAmount: 169184, createdAt: "2026-09-08T11:05:00", employeeName: "User", statusName: "Disputed", remarks: "<p>Parent disputes the concession amount applied. Escalated to accounts.</p>", nextRemarkActionDate: "2026-09-11", isChronicParent: true, chronicParentTypeName: "Disputes Fee Amount" },
        { id: 5, studentId: 65477, studentCode: "1260071", studentName: "ADMSN", className: "I", sectionName: "I-B", contactPersonName: "Admsn Parent", contactNumber: "9988776655", totalOutstandingAmount: 6021, createdAt: "2026-09-07T10:30:00", employeeName: "ANCY THOMAS", statusName: "Paid", remarks: "<p>Paid online after the call. Receipt shared.</p>", nextRemarkActionDate: "", isChronicParent: false, chronicParentTypeName: "" },
        { id: 6, studentId: 65478, studentCode: "1260081", studentName: "CNNNN", className: "V", sectionName: "", contactPersonName: "CN Parent", contactNumber: "9123456780", totalOutstandingAmount: 286452, createdAt: "2026-09-06T08:15:00", employeeName: "User", statusName: "Cheque Bounced", remarks: "<p>Second cheque bounce this year. Advised to pay via online mode only.</p>", nextRemarkActionDate: "2026-09-13", isChronicParent: true, chronicParentTypeName: "Cheque Bounce History" },
    ],
    totalElements: 6,
    totalPages: 1,
    pageble: { pageNumber: 0 },
};

export const sampleFeeCallingReportSummary = {
    dayWiseCalls: [0, 1, 2, 3, 4, 5, 6].map((offset) => ({
        date: format(subDays(new Date(), 6 - offset), "yyyy-MM-dd"),
        count: [2, 0, 3, 1, 4, 2, 1][offset],
    })),
    callerWise: [
        { employeeId: 101, employeeName: "ANCY THOMAS", totalCalls: 3, outcomes: [
            { statusName: "Promised to Pay", count: 1 }, { statusName: "Requested Time", count: 1 }, { statusName: "Paid", count: 1 },
        ] },
        { employeeId: 102, employeeName: "User", totalCalls: 3, outcomes: [
            { statusName: "Not Reachable", count: 1 }, { statusName: "Disputed", count: 1 }, { statusName: "Cheque Bounced", count: 1 },
        ] },
    ],
    totalCalls: 6,
    studentsFollowedUp: 6,
    chronicParents: 4,
    overdueNextActions: 1,
    outcomes: [
        { statusName: "Promised to Pay", count: 1 },
        { statusName: "Paid", count: 1 },
        { statusName: "Requested Time", count: 1 },
        { statusName: "Not Reachable", count: 1 },
        { statusName: "Disputed", count: 1 },
        { statusName: "Cheque Bounced", count: 1 },
    ],
};

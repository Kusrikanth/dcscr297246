import { settingsBranches, type SettingsOption } from "../helper";

export interface SheetSource {
    id: string;
    integrationId: string;
    integrationName: string;
    sheetId: string;
    sheetName: string;
    branchId: string;
    status: "active" | "mapping_required";
    lastSyncAt: string;
    rowsImported: number;
}

export interface SkippedLead {
    id: string;
    branchId: string;
    sheetName: string;
    rowNumber: number;
    studentName: string;
    phone: string;
    reason: string;
    existingLeadNumber: string;
    occurrenceCount: number;
    lastSeenAt: string;
}

export interface SpreadsheetOption {
    id: string;
    name: string;
    modifiedAt: string;
}

export const branchNameFor = (branchId: string) =>
    settingsBranches.find(branch => branch.id === branchId)?.name || "Unassigned";

export const sheetStatusLabel = (source: SheetSource) =>
    source.status === "active"
        ? `Continuous import to ${branchNameFor(source.branchId)}`
        : `Mapping required · ${branchNameFor(source.branchId)}`;

export const skipReasonOptions: Array<SettingsOption> = [
    { id: "Duplicate phone", name: "Duplicate phone" },
    { id: "Missing phone", name: "Missing phone" },
    { id: "Missing student name", name: "Missing student name" },
    { id: "Invalid phone", name: "Invalid phone" },
];

export const googleIntegrations: Array<{
    id: string;
    name: string;
    accountEmail: string;
    isAuthorized: boolean;
}> = [
        {
            id: "1",
            name: "Admissions Google Sheets",
            accountEmail: "admissions@digitalcampus.in",
            isAuthorized: true,
        },
        {
            id: "2",
            name: "Marketing Google Sheets",
            accountEmail: "marketing@digitalcampus.in",
            isAuthorized: false,
        },
    ];

export const availableSpreadsheets: Array<SpreadsheetOption> = [
    {
        id: "sheet-1",
        name: "Website Enquiries 2026-27",
        modifiedAt: "2026-08-15T08:30:00",
    },
    {
        id: "sheet-2",
        name: "Walk-in Register — Kompally",
        modifiedAt: "2026-08-14T18:10:00",
    },
    {
        id: "sheet-3",
        name: "Education Fair Leads",
        modifiedAt: "2026-08-12T12:45:00",
    },
    {
        id: "sheet-4",
        name: "Referral Programme Responses",
        modifiedAt: "2026-08-09T09:20:00",
    },
];

export const sheetSources: Array<SheetSource> = [
    {
        id: "1",
        integrationId: "1",
        integrationName: "Admissions Google Sheets",
        sheetId: "sheet-1",
        sheetName: "Website Enquiries 2026-27",
        branchId: "1",
        status: "active",
        lastSyncAt: "2026-08-15T09:00:00",
        rowsImported: 842,
    },
    {
        id: "2",
        integrationId: "1",
        integrationName: "Admissions Google Sheets",
        sheetId: "sheet-2",
        sheetName: "Walk-in Register — Kompally",
        branchId: "2",
        status: "active",
        lastSyncAt: "2026-08-15T09:00:00",
        rowsImported: 316,
    },
    {
        id: "3",
        integrationId: "1",
        integrationName: "Admissions Google Sheets",
        sheetId: "sheet-3",
        sheetName: "Education Fair Leads",
        branchId: "3",
        status: "mapping_required",
        lastSyncAt: "",
        rowsImported: 0,
    },
];

export const skippedLeads: Array<SkippedLead> = [
    {
        id: "1",
        branchId: "1",
        sheetName: "Website Enquiries 2026-27",
        rowNumber: 184,
        studentName: "Aarav Sharma",
        phone: "9800011122",
        reason: "Duplicate phone; already captured on an open lead",
        existingLeadNumber: "LEAD-24118",
        occurrenceCount: 3,
        lastSeenAt: "2026-08-15T09:00:00",
    },
    {
        id: "2",
        branchId: "1",
        sheetName: "Website Enquiries 2026-27",
        rowNumber: 191,
        studentName: "",
        phone: "9800033344",
        reason: "Missing student name; the field is mandatory on the lead form",
        existingLeadNumber: "",
        occurrenceCount: 1,
        lastSeenAt: "2026-08-15T09:00:00",
    },
    {
        id: "3",
        branchId: "2",
        sheetName: "Walk-in Register — Kompally",
        rowNumber: 57,
        studentName: "Diya Nair",
        phone: "",
        reason: "Missing phone; a lead cannot be created without one",
        existingLeadNumber: "",
        occurrenceCount: 2,
        lastSeenAt: "2026-08-14T17:20:00",
    },
    {
        id: "4",
        branchId: "2",
        sheetName: "Walk-in Register — Kompally",
        rowNumber: 63,
        studentName: "Kabir Rao",
        phone: "12345",
        reason: "Invalid phone; expected a 10-digit mobile number",
        existingLeadNumber: "",
        occurrenceCount: 1,
        lastSeenAt: "2026-08-14T17:20:00",
    },
];

export const sheetPreview: {
    headers: Array<string>;
    rows: Array<Array<string>>;
} = {
    headers: [
        "Student Name",
        "Mobile",
        "Email ID",
        "Parent Name",
        "Class",
        "City",
    ],
    rows: [
        [
            "Aarav Sharma",
            "9800011122",
            "sharma.family@example.com",
            "Rohit Sharma",
            "Class I",
            "Hyderabad",
        ],
        [
            "Diya Nair",
            "9800044455",
            "nair.d@example.com",
            "Anil Nair",
            "Class V",
            "Secunderabad",
        ],
        [
            "Kabir Rao",
            "9800077788",
            "kabir.rao@example.com",
            "Sunita Rao",
            "Nursery",
            "Hyderabad",
        ],
    ],
};

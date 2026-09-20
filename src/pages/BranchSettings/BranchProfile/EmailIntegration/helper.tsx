import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl } from "../../../../Components/Common";
import { IEmailIntegration } from "./emailintegrationtypes";

/** Email integrations are not wired to an API yet, so the screen runs on the sample rows below. */
export const USE_SAMPLE_EMAIL_INTEGRATIONS = true;

/**
 * Sample rows mirror the mail configuration table (institute/branch, host, from address, port,
 * status, department and the admission mail fields). The password values below are dummy
 * placeholders for local development only - never seed this file with live credentials.
 */
export const sampleEmailIntegrations: Array<IEmailIntegration> = [
    {
        id: 31,
        instituteId: 2,
        branchId: 7,
        host: "smtp.gmail.com",
        fromAddress: "admissions_bwp@example-school.org",
        password: "aaaa bbbb cccc dddd",
        actualPassword: "SamplePass@11",
        port: 587,
        rs: "A",
        admissionFromAddress: "admissions_bwp@example-school.org",
        admissionPassword: "SampleAdmission@11",
        department: "Admissions",
        admissionMailId: "admissions_bwp@example-school.org",
    },
    {
        id: 32,
        instituteId: 2,
        branchId: 7,
        host: "smtp.gmail.com",
        fromAddress: "ad_bp@example-school.org",
        password: "eeee ffff gggg hhhh",
        actualPassword: "SamplePass@22",
        port: 587,
        rs: "I",
        admissionFromAddress: "admissions_bwp@example-school.org",
        admissionPassword: "SampleAdmission@22",
        department: "Support",
        admissionMailId: "admissions_bwp@example-school.org",
    },
    {
        id: 38,
        instituteId: 2,
        branchId: 7,
        host: "smtp.gmail.com",
        fromAddress: "accounts2_bwp@example-school.org",
        password: "iiii jjjj kkkk llll",
        actualPassword: "SamplePass@33",
        port: 587,
        rs: "A",
        admissionFromAddress: "admissions_bwp@example-school.org",
        admissionPassword: "SampleAdmission@33",
        department: "Accounts",
        admissionMailId: "admissions_bwp@example-school.org",
    },
    {
        id: 40,
        instituteId: 2,
        branchId: 7,
        host: "smtp.gmail.com",
        fromAddress: "admissions_bwp@example-school.org",
        password: "mmmm nnnn oooo pppp",
        actualPassword: "SamplePass@44",
        port: 587,
        rs: "A",
        admissionFromAddress: "admissions_bwp@example-school.org",
        admissionPassword: "",
        department: "HR",
        admissionMailId: "admissions_bwp@example-school.org",
    },
];

export function getStatusLabel(rs: string) {
    return rs === "A" ? "Active" : "Inactive";
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Department",
            accessor: "department"
        },
        {
            Header: "From Address",
            accessor: "fromAddress",
            disableSortBy: true
        },
        {
            Header: "Admission From Address",
            accessor: "admissionFromAddress",
            disableSortBy: true
        },
        {
            Header: "Status",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => (
                <StatusLabel type={original.rs} labelName={getStatusLabel(original.rs)} />
            ),
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            // Frozen to the right edge so the action stays reachable while the table scrolls.
            columnClassName: "sticky-right !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(243_244_246/var(--tw-bg-opacity))]",
            tdClass: "sticky-right !tw-right-0 !tw-overflow-visible !tw-z-[1] has-[.dropdown.show]:!tw-z-[9999]",
            Cell: ({ row: { original } }: any) => (
                <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
            ),
        },
    ])
}

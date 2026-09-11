import {
    MenuOptionHrtl,
    type IOptionsHrtl,
} from "../../../../Components/Common/MenuOptions";
import { Button, StatusLabel } from "../../../../Components/Common";
import {
    formatDateTime,
    getInitials,
    settingsBranches,
    type SettingsOption,
} from "../helper";

export interface CrmRole {
    name: string;
    displayName: string;
    description: string;
}

export interface CrmUser {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    employeeId: string;
    employeeNumber: string;
    roles: Array<string>;
    branchIds: Array<string>;
    businessUnitIds: Array<string>;
    isActive: boolean;
    lastLoginAt: string;
    callerdeskEnabled: boolean;
    callerdeskMemberId: string;
    callerdeskMemberName: string;
    callerdeskMemberNumber: string;
    callerdeskCallGroup: string;
    smartfloEnabled: boolean;
    smartfloAgentId: string;
    smartfloAgentName: string;
    smartfloAgentNumber: string;
    smartfloDepartmentId: string;
}

interface CrmUserRow {
    row: { original: CrmUser };
}

export const userTypeOptions: Array<SettingsOption & { description: string }> = [
    {
        id: "employee",
        name: "Existing employee",
        description: "Select from the active employee master.",
    },
    {
        id: "external",
        name: "New external user",
        description: "Create a CRM-only user not present in employees.",
    },
];

export const crmRoles: Array<CrmRole> = [
    {
        name: "CRM_ADMIN",
        displayName: "CRM Administrator",
        description: "Full access to every branch, configuration and report.",
    },
    {
        name: "BRANCH_MANAGER",
        displayName: "Branch Manager",
        description: "Manages counsellors and leads for the assigned branches.",
    },
    {
        name: "COUNSELLOR",
        displayName: "Counsellor",
        description: "Works the leads assigned to them and logs follow-ups.",
    },
    {
        name: "TELECALLER",
        displayName: "Telecaller",
        description: "Calls new enquiries and records the outcome.",
    },
    {
        name: "VIEWER",
        displayName: "Viewer",
        description: "Read-only access to leads and reports.",
    },
];

export const branchNamesFor = (branchIds: Array<string>) =>
    settingsBranches
        .filter(branch => branchIds.includes(branch.id))
        .map(branch => branch.name)
        .join(", ");

export const roleDisplayName = (roleName: string) =>
    crmRoles.find(role => role.name === roleName)?.displayName || roleName;

export const crmUsers: Array<CrmUser> = [
    {
        id: "11",
        name: "Ananya Rao",
        firstName: "Ananya",
        lastName: "Rao",
        email: "ananya.rao@digitalcampus.in",
        phone: "9100000201",
        employeeId: "101",
        employeeNumber: "EMP-1041",
        roles: ["CRM_ADMIN"],
        branchIds: ["1", "2", "3", "4", "5"],
        businessUnitIds: ["1"],
        isActive: true,
        lastLoginAt: "2026-08-14T09:12:00",
        callerdeskEnabled: true,
        callerdeskMemberId: "CD-201",
        callerdeskMemberName: "Ananya Rao",
        callerdeskMemberNumber: "9100000201",
        callerdeskCallGroup: "Admissions Desk",
        smartfloEnabled: true,
        smartfloAgentId: "SF-301",
        smartfloAgentName: "Ananya Rao",
        smartfloAgentNumber: "9100000301",
        smartfloDepartmentId: "D-1",
    },
    {
        id: "12",
        name: "Vikram Shetty",
        firstName: "Vikram",
        lastName: "Shetty",
        email: "vikram.shetty@digitalcampus.in",
        phone: "9100000202",
        employeeId: "102",
        employeeNumber: "EMP-1063",
        roles: ["BRANCH_MANAGER"],
        branchIds: ["2"],
        businessUnitIds: ["1"],
        isActive: true,
        lastLoginAt: "2026-08-13T18:40:00",
        callerdeskEnabled: true,
        callerdeskMemberId: "CD-202",
        callerdeskMemberName: "Vikram Shetty",
        callerdeskMemberNumber: "9100000202",
        callerdeskCallGroup: "Senior Counsellors",
        smartfloEnabled: false,
        smartfloAgentId: "",
        smartfloAgentName: "",
        smartfloAgentNumber: "",
        smartfloDepartmentId: "",
    },
    {
        id: "13",
        name: "Sneha Menon",
        firstName: "Sneha",
        lastName: "Menon",
        email: "sneha.menon@digitalcampus.in",
        phone: "9100000203",
        employeeId: "103",
        employeeNumber: "EMP-1092",
        roles: ["COUNSELLOR"],
        branchIds: ["3"],
        businessUnitIds: ["1"],
        isActive: true,
        lastLoginAt: "2026-08-15T08:05:00",
        callerdeskEnabled: true,
        callerdeskMemberId: "CD-203",
        callerdeskMemberName: "Sneha Menon",
        callerdeskMemberNumber: "9100000203",
        callerdeskCallGroup: "Admissions Desk",
        smartfloEnabled: false,
        smartfloAgentId: "",
        smartfloAgentName: "",
        smartfloAgentNumber: "",
        smartfloDepartmentId: "",
    },
    {
        id: "14",
        name: "Priya Nair",
        firstName: "Priya",
        lastName: "Nair",
        email: "priya.nair@partneragency.in",
        phone: "9100000455",
        employeeId: "",
        employeeNumber: "",
        roles: ["TELECALLER"],
        branchIds: ["1", "4"],
        businessUnitIds: ["1", "2"],
        isActive: true,
        lastLoginAt: "2026-08-12T11:55:00",
        callerdeskEnabled: false,
        callerdeskMemberId: "",
        callerdeskMemberName: "",
        callerdeskMemberNumber: "",
        callerdeskCallGroup: "",
        smartfloEnabled: false,
        smartfloAgentId: "",
        smartfloAgentName: "",
        smartfloAgentNumber: "",
        smartfloDepartmentId: "",
    },
    {
        id: "15",
        name: "Rahul Iyer",
        firstName: "Rahul",
        lastName: "Iyer",
        email: "rahul.iyer@digitalcampus.in",
        phone: "9100000204",
        employeeId: "104",
        employeeNumber: "EMP-1117",
        roles: ["COUNSELLOR"],
        branchIds: ["4"],
        businessUnitIds: ["1"],
        isActive: false,
        lastLoginAt: "",
        callerdeskEnabled: false,
        callerdeskMemberId: "",
        callerdeskMemberName: "",
        callerdeskMemberNumber: "",
        callerdeskCallGroup: "",
        smartfloEnabled: false,
        smartfloAgentId: "",
        smartfloAgentName: "",
        smartfloAgentNumber: "",
        smartfloDepartmentId: "",
    },
];

export function generateUserColumns(
    actionsList: Array<IOptionsHrtl>,
    onToggleStatus: (user: CrmUser) => void,
) {
    return [
        {
            Header: "User",
            accessor: "name",
            disableSortBy: true,

            Cell: ({ row: { original } }: CrmUserRow) => (
                <div className="tw-flex tw-min-w-0 tw-items-center tw-gap-2">
                    <span className="tw-grid tw-h-9 tw-w-9 tw-flex-shrink-0 tw-place-items-center tw-rounded-full tw-bg-[#eef1f7] tw-text-xs tw-font-semibold tw-text-[#405189]">
                        {getInitials(original.name)}
                    </span>

                    <div className="tw-min-w-0">
                        <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                            {original.name}
                        </p>
                        <p className="tw-mb-0 tw-truncate tw-text-xs tw-text-gray-500">
                            {original.email}
                        </p>
                    </div>
                </div>
            ),
        },

        {
            Header: "CRM Role",
            accessor: "roles",
            disableSortBy: true,

            Cell: ({ row: { original } }: CrmUserRow) => (
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-800">
                        {original.roles.map(roleDisplayName).join(", ") ||
                            "No dedicated role"}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {original.employeeNumber || "External user"}
                    </p>
                </div>
            ),
        },

        {
            Header: "CRM Branches",
            accessor: "branchIds",
            disableSortBy: true,

            Cell: ({ row: { original } }: CrmUserRow) => (
                <p className="tw-mb-0 tw-max-w-[220px] tw-text-sm tw-text-gray-700">
                    {branchNamesFor(original.branchIds) || "Not assigned"}
                </p>
            ),
        },

        {
            Header: "Calling",
            accessor: "callerdeskEnabled",
            disableSortBy: true,

            Cell: ({ row: { original } }: CrmUserRow) => {
                const providers = [
                    original.callerdeskEnabled ? "CallerDesk" : null,
                    original.smartfloEnabled ? "Smartflo" : null,
                ].filter(Boolean);

                if (!providers.length) {
                    return (
                        <span className="tw-text-gray-400" title="No one-click calling">
                            —
                        </span>
                    );
                }

                return (
                    <div className="tw-flex tw-flex-wrap tw-gap-1">
                        {providers.map(provider => (
                            <span
                                key={provider}
                                className="badge badge-soft-info tw-whitespace-nowrap"
                            >
                                {provider}
                            </span>
                        ))}
                    </div>
                );
            },
        },

        {
            Header: "Status",
            accessor: "isActive",
            disableSortBy: true,

            Cell: ({ row: { original } }: CrmUserRow) => (
                <Button
                    type="button"
                    variant="sidebarMenu"
                    title={
                        original.isActive
                            ? "Mark CRM user inactive"
                            : "Mark CRM user active"
                    }
                    onClick={() => onToggleStatus(original)}
                >
                    <StatusLabel
                        type={original.isActive ? "active" : "inactive"}
                        labelName={original.isActive ? "Active" : "Inactive"}
                    />
                </Button>
            ),
        },

        {
            Header: "Last Login",
            accessor: "lastLoginAt",
            disableSortBy: true,

            Cell: ({ row: { original } }: CrmUserRow) => (
                <p className="tw-mb-0 tw-whitespace-nowrap tw-text-sm tw-text-gray-700">
                    {original.lastLoginAt
                        ? formatDateTime(original.lastLoginAt)
                        : "Never"}
                </p>
            ),
        },

        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,

            Cell: ({ row: { original } }: CrmUserRow) => (
                <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
            ),
        },
    ];
}

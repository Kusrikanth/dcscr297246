import { StatusLabel } from "../../../../Components/Common";
import {
    MenuOptionHrtl,
    type IOptionsHrtl,
} from "../../../../Components/Common/MenuOptions";
import {
    formatDateTime,
    leadMeta,
    namesForIds,
    type AssignmentRule,
} from "../helper";

interface RuleRow {
    row: { original: AssignmentRule };
}

const nameChips = (names: Array<string>) =>
    names.length ? (
        <div className="tw-flex tw-flex-wrap tw-gap-1">
            {names.map(name => (
                <span key={name} className="badge badge-soft-secondary">
                    {name}
                </span>
            ))}
        </div>
    ) : (
        <span className="tw-text-sm tw-text-gray-500">—</span>
    );

export function generateAssignmentRuleColumns(
    actionsList: Array<IOptionsHrtl>,
) {
    return [
        {
            Header: "Rule Name",
            accessor: "name",
            disableSortBy: true,

            Cell: ({ row: { original } }: RuleRow) => (
                <span className="tw-text-sm tw-font-semibold tw-text-gray-800">
                    {original.name}
                </span>
            ),
        },

        {
            Header: "Created On",
            accessor: "createdAt",
            disableSortBy: true,

            Cell: ({ row: { original } }: RuleRow) => (
                <span className="tw-whitespace-nowrap tw-text-sm tw-text-gray-700">
                    {formatDateTime(original.createdAt)}
                </span>
            ),
        },

        {
            Header: "Branch",
            accessor: "branchIds",
            disableSortBy: true,

            Cell: ({ row: { original } }: RuleRow) =>
                nameChips(namesForIds(original.branchIds, leadMeta.branches)),
        },

        {
            Header: "Source",
            accessor: "sourceIds",
            disableSortBy: true,

            Cell: ({ row: { original } }: RuleRow) =>
                nameChips(namesForIds(original.sourceIds, leadMeta.sources)),
        },

        {
            Header: "Assigned Counsellors",
            accessor: "employeeIds",
            disableSortBy: true,

            Cell: ({ row: { original } }: RuleRow) =>
                nameChips(
                    namesForIds(original.employeeIds, leadMeta.employees),
                ),
        },

        {
            Header: "Status",
            accessor: "isActive",
            disableSortBy: true,

            Cell: ({ row: { original } }: RuleRow) => (
                <StatusLabel
                    type={original.isActive ? "active" : "inactive"}
                    labelName={original.isActive ? "Active" : "Inactive"}
                />
            ),
        },

        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,

            Cell: ({ row: { original } }: RuleRow) => (
                <MenuOptionHrtl
                    actionOptions={actionsList.map(item =>
                        item.id === "status"
                            ? {
                                ...item,
                                actionName: original.isActive
                                    ? "Disable Rule"
                                    : "Enable Rule",
                                actionIcon: (
                                    <i
                                        className={`ri-shut-down-line ${original.isActive
                                            ? "tw-text-[#0ab39c]"
                                            : "tw-text-gray-400"
                                            }`}
                                    ></i>
                                ),
                            }
                            : item,
                    )}
                    rowId={original.id}
                />
            ),
        },
    ];
}

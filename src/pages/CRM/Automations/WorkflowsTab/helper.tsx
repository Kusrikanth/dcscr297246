import { Switch } from "../../../../Components/Common";
import {
    MenuOptionHrtl,
    type IOptionsHrtl,
} from "../../../../Components/Common/MenuOptions";
import {
    formatDateTime,
    getCategoryTitle,
    type AutomationWorkflow,
} from "../helper";

interface WorkflowRow {
    row: { original: AutomationWorkflow };
}

const runSummary = (workflow: AutomationWorkflow) =>
    [
        `${workflow.completedCount} completed`,
        workflow.failedCount ? `${workflow.failedCount} failed` : "",
        workflow.skippedCount ? `${workflow.skippedCount} skipped` : "",
        workflow.pendingCount ? `${workflow.pendingCount} pending` : "",
    ]
        .filter(Boolean)
        .join(" · ");

export function generateWorkflowColumns(
    actionsList: Array<IOptionsHrtl>,
    statusChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void,
) {
    return [
        {
            Header: "Workflow Name",
            accessor: "name",
            disableSortBy: true,

            Cell: ({ row: { original } }: WorkflowRow) => (
                <span className="tw-text-sm tw-font-semibold tw-text-gray-800">
                    {original.name}
                </span>
            ),
        },

        {
            Header: "Category",
            accessor: "category",
            disableSortBy: true,

            Cell: ({ row: { original } }: WorkflowRow) => (
                <span className="tw-text-sm tw-text-gray-700">
                    {getCategoryTitle(original.category)}
                </span>
            ),
        },

        {
            Header: "Created By",
            accessor: "createdBy",
            disableSortBy: true,

            Cell: ({ row: { original } }: WorkflowRow) => (
                <span className="tw-text-sm tw-text-gray-700">
                    {original.createdBy || "—"}
                </span>
            ),
        },

        {
            Header: "Created On",
            accessor: "createdAt",
            disableSortBy: true,

            Cell: ({ row: { original } }: WorkflowRow) => (
                <span className="tw-whitespace-nowrap tw-text-sm tw-text-gray-700">
                    {formatDateTime(original.createdAt)}
                </span>
            ),
        },

        {
            Header: "Start Time",
            accessor: "startAt",
            disableSortBy: true,

            Cell: ({ row: { original } }: WorkflowRow) => (
                <span className="tw-whitespace-nowrap tw-text-sm tw-text-gray-700">
                    {original.startAt
                        ? formatDateTime(original.startAt)
                        : "Not scheduled"}
                </span>
            ),
        },

        {
            Header: "Execution",
            accessor: "lastStatus",
            disableSortBy: true,

            Cell: ({ row: { original } }: WorkflowRow) => (
                <div>
                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                        {original.lastStatus
                            ? original.lastStatus.charAt(0).toUpperCase() +
                            original.lastStatus.slice(1)
                            : "Not run"}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {runSummary(original)}
                    </p>
                </div>
            ),
        },

        {
            Header: "Active",
            accessor: "isActive",
            disableSortBy: true,

            Cell: ({ row: { original } }: WorkflowRow) => (
                <Switch
                    attributeId={`workflow-status-${original.id}`}
                    dataId={original.id}
                    checked={original.isActive}
                    onChangeHndlr={statusChangeHandler}
                />
            ),
        },

        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,

            Cell: ({ row: { original } }: WorkflowRow) => (
                <MenuOptionHrtl
                    actionOptions={actionsList.map(item =>
                        item.id === "run" && !original.isActive
                            ? {
                                ...item,
                                disabled: true,
                                actionIcon: (
                                    <i className="ri-play-circle-line tw-text-gray-300"></i>
                                ),
                                onClickHndlr: undefined,
                            }
                            : item,
                    )}
                    rowId={original.id}
                />
            ),
        },
    ];
}

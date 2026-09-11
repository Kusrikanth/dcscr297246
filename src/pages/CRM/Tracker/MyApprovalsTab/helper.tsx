import {
    StatusLabel,
    UserDetails,
} from "../../../../Components/Common";
import {
    MenuOptionHrtl,
    type IOptionsHrtl,
} from "../../../../Components/Common/MenuOptions";
import { formatDateTime, type ApprovalRecord } from "../helper";

interface ApprovalRow {
    row: { original: ApprovalRecord };
}

const actionsForRecord = (
    record: ApprovalRecord,
    actionOptions: Array<IOptionsHrtl>,
) =>
    record.decision === "pending"
        ? actionOptions.filter(item => item.id !== "view")
        : actionOptions.filter(item => item.id === "view");

export const generateColumns = (actionOptions: Array<IOptionsHrtl>) => [
    {
        Header: "Action Item",
        accessor: "actionItem",
        disableSortBy: true,

        Cell: ({ row: { original } }: ApprovalRow) => (
            <UserDetails
                displayName={original.actionItem}
                displayId={original.actionItemCode}
                showAvatar={false}
            />
        ),
    },

    {
        Header: "Owner",
        accessor: "owner",
        disableSortBy: true,

        Cell: ({ row: { original } }: ApprovalRow) => (
            <span className="tw-text-sm tw-text-gray-700">
                {original.owner || "—"}
            </span>
        ),
    },

    {
        Header: "Approver",
        accessor: "approver",
        disableSortBy: true,

        Cell: ({ row: { original } }: ApprovalRow) => (
            <span className="tw-text-sm tw-font-medium tw-text-gray-800">
                {original.approver || "—"}
            </span>
        ),
    },

    {
        Header: "Decision Login",
        accessor: "decisionLogin",
        disableSortBy: true,

        Cell: ({ row: { original } }: ApprovalRow) => (
            <div>
                <p className="tw-mb-0 tw-text-sm tw-text-gray-700">
                    {original.decisionLogin ||
                        (original.decision === "pending"
                            ? "Awaiting decision"
                            : "—")}
                </p>
                {original.decidedAt && (
                    <p className="tw-mb-0 tw-whitespace-nowrap tw-text-[11px] tw-text-gray-500">
                        {formatDateTime(original.decidedAt)}
                    </p>
                )}
            </div>
        ),
    },

    {
        Header: "Request Date",
        accessor: "requestedAt",
        disableSortBy: true,

        Cell: ({ row: { original } }: ApprovalRow) => (
            <span className="tw-whitespace-nowrap tw-text-sm tw-text-gray-700">
                {formatDateTime(original.requestedAt)}
            </span>
        ),
    },

    {
        Header: "Status",
        accessor: "decision",
        disableSortBy: true,

        Cell: ({ row: { original } }: ApprovalRow) => (
            <StatusLabel
                type={original.decision}
                labelName={original.decision}
            />
        ),
    },

    {
        Header: "Decision",
        accessor: "id",
        disableSortBy: true,

        Cell: ({ row: { original } }: ApprovalRow) => (
            <MenuOptionHrtl
                actionOptions={actionsForRecord(original, actionOptions)}
                rowId={original.id}
                className="tw-justify-center"
            />
        ),
    },
];

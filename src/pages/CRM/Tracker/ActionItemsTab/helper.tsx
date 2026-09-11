import {
    MenuOptionHrtl,
    type IOptionsHrtl,
} from "../../../../Components/Common/MenuOptions";
import { Button } from "../../../../Components/Common";
import {
    createdLabel,
    DUE_TONE_TEXT,
    formatDate,
    getDueStatus,
    type ActionItemRecord,
    type TrackerStage,
} from "../helper";

interface ActionItemRow {
    row: { original: ActionItemRecord };
}

export const approvalChipClass = (status: string) => {
    if (status === "approved") {
        return "tw-bg-emerald-100 tw-text-emerald-700 tw-border-emerald-300";
    }

    if (status === "rejected") {
        return "tw-bg-red-100 tw-text-red-700 tw-border-red-300";
    }

    return "tw-bg-amber-100 tw-text-amber-800 tw-border-amber-300";
};

export const approvalChipIcon = (status: string) => {
    if (status === "approved") {
        return "ri-shield-check-line";
    }

    if (status === "rejected") {
        return "ri-close-line";
    }

    return "ri-time-line";
};

export function generateActionItemColumns(
    actionsList: Array<IOptionsHrtl>,
    stages: Array<TrackerStage>,
    terminalStageIds: Set<string>,
    onApprovalClick: (record: ActionItemRecord) => void,
) {
    return [
        {
            Header: "Action Item",
            accessor: "title",
            disableSortBy: true,

            Cell: ({ row: { original } }: ActionItemRow) => (
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                        {original.title}
                    </p>
                    <p className="tw-mb-0 tw-font-mono tw-text-xs tw-text-[#405189]">
                        {original.recordNumber}
                    </p>
                </div>
            ),
        },

        {
            Header: "Owner",
            accessor: "owner",
            disableSortBy: true,

            Cell: ({ row: { original } }: ActionItemRow) => (
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-800">
                        {original.owner || "Unassigned"}
                    </p>
                    <p className="tw-mb-0 tw-whitespace-nowrap tw-text-[11px] tw-text-gray-500">
                        {createdLabel(original.createdAt)}
                    </p>
                </div>
            ),
        },

        {
            Header: "Status",
            accessor: "stageId",
            disableSortBy: true,

            Cell: ({ row: { original } }: ActionItemRow) => {
                const stage = stages.find(
                    item => String(item.id) === String(original.stageId),
                );
                const stageColor = stage?.color || "#087a52";

                return (
                    <span
                        className="tw-inline-flex tw-items-center tw-gap-1.5 tw-whitespace-nowrap tw-rounded-full tw-border tw-px-2.5 tw-py-1 tw-text-xs tw-font-semibold"
                        style={{
                            color: stageColor,
                            borderColor: `${stageColor}61`,
                            backgroundColor: `${stageColor}1f`,
                        }}
                    >
                        <span
                            className="tw-h-1.5 tw-w-1.5 tw-rounded-full"
                            style={{ backgroundColor: stageColor }}
                        />
                        {stage?.displayName || "Unknown"}
                    </span>
                );
            },
        },

        {
            Header: "Deadline",
            accessor: "dueAt",
            disableSortBy: true,

            Cell: ({ row: { original } }: ActionItemRow) => {
                const status = getDueStatus(
                    original.dueAt,
                    terminalStageIds.has(String(original.stageId)),
                );

                return (
                    <div className="tw-whitespace-nowrap">
                        <p className="tw-mb-0 tw-text-sm tw-text-gray-800">
                            {original.dueAt ? formatDate(original.dueAt) : "—"}
                        </p>
                        {status && (
                            <p
                                className={`tw-mb-0 tw-text-[11px] tw-font-semibold ${DUE_TONE_TEXT[status.tone]}`}
                            >
                                {status.label}
                            </p>
                        )}
                    </div>
                );
            },
        },

        {
            Header: "Approval",
            accessor: "approvalStatus",
            disableSortBy: true,

            Cell: ({ row: { original } }: ActionItemRow) => {
                if (!original.approvalRequired) {
                    return (
                        <span
                            className="tw-text-gray-400"
                            title="Approval not required"
                        >
                            —
                        </span>
                    );
                }

                const label = `Approval ${original.approvalStatus.replace(/_/g, " ")}`;

                return (
                    <Button
                        type="button"
                        variant="secondary"
                        title={label}
                        aria-label={label}
                        onClick={() => onApprovalClick(original)}
                        className={`!tw-h-8 !tw-w-8 !tw-p-0 !tw-rounded-full tw-border ${approvalChipClass(original.approvalStatus)}`}
                    >
                        <i
                            className={approvalChipIcon(
                                original.approvalStatus,
                            )}
                        ></i>
                    </Button>
                );
            },
        },

        {
            Header: "Actions",
            accessor: "id",
            disableSortBy: true,

            Cell: ({ row: { original } }: ActionItemRow) => (
                <MenuOptionHrtl
                    actionOptions={actionsList}
                    rowId={original.id}
                />
            ),
        },
    ];
}

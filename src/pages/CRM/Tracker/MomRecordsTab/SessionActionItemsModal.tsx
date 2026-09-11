import {
    DUE_TONE_CLASS,
    formatDateTime,
    getDueStatus,
    type MomSession,
} from "../helper";
import Button from "../../../../Components/Common/Button";

interface SessionActionItemsModalProps {
    session?: MomSession;
    toggle: () => void;
}

const SessionActionItemsModal = ({
    session,
    toggle,
}: SessionActionItemsModalProps) => {
    if (!session) {
        return null;
    }

    const items = (session.points || []).filter(
        point => point.operationRecordId,
    );

    return (
        <>
            <div className="tw-p-4">
                <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                    {session.sessionNumber} · {session.createdBy}
                    {session.endedAt && ` · ${formatDateTime(session.endedAt)}`}
                </p>

                {items.length === 0 ? (
                    <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-sm tw-text-gray-600">
                        This session recorded notes but no action items.
                    </p>
                ) : (
                    items.map((item, index) => {
                        const isDone =
                            item.statusKey === "completed" ||
                            item.statusKey === "cancelled";
                        const status = getDueStatus(item.dueAt, isDone);

                        return (
                            <div
                                key={item.id}
                                className="tw-mb-3 tw-overflow-hidden tw-rounded tw-border tw-border-gray-200"
                            >
                                <div className="tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-2 tw-border-b tw-border-gray-200 tw-bg-gray-50 tw-px-3 tw-py-2">
                                    <div className="tw-min-w-0">
                                        <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                            {index + 1}.{" "}
                                            {item.actionItem ||
                                                "Untitled action item"}
                                        </p>
                                        {item.recordNumber && (
                                            <p className="tw-mb-0 tw-font-mono tw-text-[11px] tw-text-gray-500">
                                                {item.recordNumber}
                                            </p>
                                        )}
                                    </div>

                                    <div className="tw-flex tw-flex-shrink-0 tw-flex-wrap tw-items-center tw-gap-1">
                                        {status && (
                                            <span
                                                className={`tw-inline-flex tw-items-center tw-gap-1 tw-rounded-full tw-px-2 tw-py-0.5 tw-text-[10px] tw-font-semibold ${DUE_TONE_CLASS[status.tone]}`}
                                            >
                                                <i className="ri-timer-line"></i>
                                                {status.label}
                                            </span>
                                        )}

                                        {item.statusKey && (
                                            <span className="badge badge-soft-secondary tw-capitalize">
                                                {String(
                                                    item.statusKey,
                                                ).replace(/_/g, " ")}
                                            </span>
                                        )}

                                        {item.approvalRequired && (
                                            <span className="badge badge-soft-warning tw-capitalize">
                                                {item.approvalStatus
                                                    ? String(
                                                        item.approvalStatus,
                                                    ).replace(/_/g, " ")
                                                    : "approval needed"}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="row tw-px-3 tw-py-2">
                                    <div className="col-6 col-md-3">
                                        <p className="tw-mb-0 tw-text-[11px] tw-text-gray-500">
                                            Owner
                                        </p>
                                        <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                            {item.owner || "Unassigned"}
                                        </p>
                                    </div>

                                    <div className="col-6 col-md-3">
                                        <p className="tw-mb-0 tw-text-[11px] tw-text-gray-500">
                                            Due
                                        </p>
                                        <p
                                            className={`tw-mb-0 tw-text-sm tw-font-medium ${status?.overdue
                                                ? "tw-text-red-600"
                                                : "tw-text-gray-800"
                                                }`}
                                        >
                                            {item.dueAt
                                                ? formatDateTime(item.dueAt)
                                                : "No due date"}
                                        </p>
                                    </div>

                                    <div className="col-6 col-md-3">
                                        <p className="tw-mb-0 tw-text-[11px] tw-text-gray-500">
                                            Estimate
                                        </p>
                                        <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                            {item.estimatedHours
                                                ? `${item.estimatedHours} hour${item.estimatedHours === 1 ? "" : "s"}`
                                                : "—"}
                                            {Number(item.minutesSpent) > 0 && (
                                                <span className="tw-font-normal tw-text-gray-500">
                                                    {" "}
                                                    · {item.minutesSpent} min
                                                    logged
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {item.approvers && (
                                        <div className="col-6 col-md-3">
                                            <p className="tw-mb-0 tw-text-[11px] tw-text-gray-500">
                                                Approval required from
                                            </p>
                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {item.approvers}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {item.approvalDetails.length > 0 && (
                                    <div className="tw-mx-3 tw-mb-3 tw-overflow-hidden tw-rounded tw-border tw-border-gray-200">
                                        <div className="tw-flex tw-gap-3 tw-bg-gray-50 tw-px-3 tw-py-2 tw-text-[10px] tw-font-bold tw-uppercase tw-tracking-wide tw-text-gray-500">
                                            <span className="tw-flex-1">
                                                Approver
                                            </span>
                                            <span className="tw-w-24">
                                                Status
                                            </span>
                                            <span className="tw-flex-1">
                                                Comments
                                            </span>
                                        </div>

                                        {item.approvalDetails.map(approval => (
                                            <div
                                                key={approval.id}
                                                className="tw-flex tw-items-center tw-gap-3 tw-border-t tw-border-gray-100 tw-px-3 tw-py-2 tw-text-xs"
                                            >
                                                <span
                                                    className="tw-flex-1 tw-truncate tw-font-semibold tw-text-gray-800"
                                                    title={approval.approver}
                                                >
                                                    {approval.approver}
                                                </span>
                                                <span className="tw-w-24">
                                                    <span
                                                        className={`tw-rounded-full tw-px-2 tw-py-0.5 tw-font-semibold tw-capitalize ${approval.decision ===
                                                            "approved"
                                                            ? "tw-bg-emerald-100 tw-text-emerald-700"
                                                            : approval.decision ===
                                                                "rejected"
                                                                ? "tw-bg-red-100 tw-text-red-700"
                                                                : "tw-bg-amber-100 tw-text-amber-800"
                                                            }`}
                                                    >
                                                        {approval.decision}
                                                    </span>
                                                </span>
                                                <span className="tw-flex-1 tw-text-gray-600">
                                                    {approval.comments ||
                                                        (approval.decision ===
                                                            "pending"
                                                            ? "Awaiting decision"
                                                            : "No comments")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {item.description && (
                                    <div className="tw-px-3 tw-pb-2 tw-text-xs tw-text-gray-600">
                                        <p className="tw-mb-0.5 tw-text-gray-500">
                                            Description
                                        </p>
                                        {item.description}
                                    </div>
                                )}

                                {item.notes && (
                                    <div className="tw-border-t tw-border-gray-100 tw-px-3 tw-py-2 tw-text-xs tw-text-gray-600">
                                        <p className="tw-mb-0.5 tw-text-gray-500">
                                            Discussion point
                                        </p>
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: item.notes,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            <div className="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-border-t tw-border-gray-200 tw-p-4">
                <span className="tw-text-xs tw-text-gray-500">
                    {items.length} action item{items.length === 1 ? "" : "s"} in
                    this session
                </span>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={toggle}
                >
                    Close
                </Button>
            </div>
        </>
    );
};

export default SessionActionItemsModal;

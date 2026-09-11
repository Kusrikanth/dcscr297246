import { Button,
    StatusLabel } from "../../../../Components/Common";
import {
    createdLabel,
    formatDateTime,
    formatDuration,
    type ActionItemRecord,
    type TrackerStage,
} from "../helper";

interface ViewActionItemModalProps {
    data?: ActionItemRecord;
    stages: Array<TrackerStage>;
    toggle: () => void;
}

const detailItem = (label: string, value: string) => (
    <div className="col-12 col-md-6" key={label}>
        <div className="tw-py-1.5">
            <p className="tw-mb-0 tw-text-[11px] tw-uppercase tw-text-gray-500">
                {label}
            </p>
            <p className="tw-mb-0 tw-break-words tw-text-sm tw-font-medium tw-text-gray-800">
                {value || "—"}
            </p>
        </div>
    </div>
);

const ViewActionItemModal = ({
    data,
    stages,
    toggle,
}: ViewActionItemModalProps) => {
    if (!data) {
        return null;
    }

    const stage = stages.find(
        item => String(item.id) === String(data.stageId),
    );

    return (
        <>
            <div className="tw-p-4">
                <p className="tw-mb-1 tw-font-mono tw-text-xs tw-text-[#405189]">
                    {data.recordNumber}
                </p>
                <p className="tw-mb-3 tw-text-lg tw-font-semibold tw-text-gray-800">
                    {data.title}
                </p>

                <div className="row">
                    {detailItem("Owner", data.owner || "Unassigned")}
                    {detailItem("Status", stage?.displayName || "—")}
                    {detailItem(
                        "Created",
                        createdLabel(data.createdAt).replace(/^Created /, ""),
                    )}
                    {detailItem(
                        "Deadline",
                        data.dueAt
                            ? formatDateTime(data.dueAt)
                            : "Not scheduled",
                    )}
                    {detailItem(
                        "Approval",
                        data.approvalRequired
                            ? String(
                                data.approvalStatus || "pending",
                            ).replace(/_/g, " ")
                            : "Not required",
                    )}
                    {detailItem(
                        "Time recorded",
                        formatDuration(data.minutesSpent),
                    )}
                    {detailItem(
                        "Estimate",
                        data.estimatedHours
                            ? `${data.estimatedHours} hour${data.estimatedHours === 1 ? "" : "s"}`
                            : "—",
                    )}
                    {detailItem("Tracker", data.workflow)}
                </div>

                <div className="tw-mt-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                    <p className="tw-mb-1 tw-text-[11px] tw-uppercase tw-text-gray-500">
                        Description
                    </p>
                    <p className="tw-mb-0 tw-whitespace-pre-wrap tw-text-sm tw-text-gray-700">
                        {data.description || "No description"}
                    </p>
                </div>

                {data.approvals.length > 0 && (
                    <div className="tw-mt-3">
                        <p className="tw-mb-2 tw-text-[11px] tw-uppercase tw-text-gray-500">
                            Approval flow
                        </p>
                        {data.approvals.map(approval => (
                            <div
                                key={approval.id}
                                className="tw-mb-2 tw-flex tw-items-start tw-justify-between tw-gap-2 tw-rounded tw-border tw-border-gray-200 tw-p-2"
                            >
                                <div className="tw-min-w-0">
                                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                        {approval.approver}
                                    </p>
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        {approval.remarks ||
                                            (approval.decision === "pending"
                                                ? "Awaiting decision"
                                                : "No remarks")}
                                    </p>
                                </div>

                                <StatusLabel
                                    type={approval.decision}
                                    labelName={approval.decision}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {data.timeLogs.length > 0 && (
                    <div className="tw-mt-3">
                        <p className="tw-mb-2 tw-text-[11px] tw-uppercase tw-text-gray-500">
                            Time log
                        </p>
                        {data.timeLogs.map(log => (
                            <div
                                key={log.id}
                                className="tw-mb-2 tw-rounded tw-border tw-border-gray-200 tw-p-2"
                            >
                                <div className="tw-flex tw-justify-between tw-gap-2">
                                    <span className="tw-text-sm tw-font-medium tw-text-gray-800">
                                        {log.loggedBy}
                                    </span>
                                    <span className="tw-text-sm tw-text-gray-600">
                                        {log.minutesSpent} min
                                    </span>
                                </div>
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    {log.workNote || "No note"}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="tw-flex tw-justify-end tw-border-t tw-border-gray-200 tw-p-4">
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

export default ViewActionItemModal;

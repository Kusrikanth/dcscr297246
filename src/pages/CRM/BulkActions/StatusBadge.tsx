import { StatusLabel } from "../../../Components/Common";

const statusBadgeMap: Record<string, string> = {
    processing: "waring",
    queued: "new",
    completed: "active",
    success: "active",
    error: "rejected",
    failed: "rejected",
};

const statusLabelMap: Record<string, string> = {
    processing: "Processing",
    queued: "Queued",
    completed: "Completed",
    success: "Success",
    error: "Error",
    failed: "Failed",
};

export const StatusBadge = ({
    status,
}: {
    status: string;
}) => {
    const key = String(status || "").toLowerCase();

    return (
        <StatusLabel
            type={statusBadgeMap[key] || "new"}
            labelName={statusLabelMap[key] || status || "—"}
        />
    );
};

export default StatusBadge;

import {
    Button,
    StatusLabel,
    UserDetails,
} from "../../../../Components/Common";
import { formatDateTime, type ApprovalRecord } from "../helper";

interface ViewApprovalModalProps {
    toggle: () => void;
    data?: ApprovalRecord;
}

const detailItem = (label: string, value: string) => (
    <div className="col-12 col-md-6" key={label}>
        <div className="tw-py-1.5">
            <p className="tw-mb-0 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-500">
                {label}
            </p>
            <p className="tw-mb-0 tw-break-words tw-text-sm tw-font-medium tw-text-gray-800">
                {value || "—"}
            </p>
        </div>
    </div>
);

const ViewApprovalModal = ({ toggle, data }: ViewApprovalModalProps) => {
    return (
        <>
            <div className="tw-p-4">
                {data && (
                    <>
                        <div className="tw-mb-3 tw-flex tw-items-start tw-justify-between tw-gap-2">
                            <UserDetails
                                displayName={data.actionItem}
                                displayId={data.actionItemCode}
                                showAvatar={false}
                            />

                            <StatusLabel
                                type={data.decision}
                                labelName={data.decision}
                            />
                        </div>

                        <div className="row">
                            {detailItem("Owner", data.owner)}
                            {detailItem("Approver", data.approver)}
                            {detailItem(
                                "Decision Login",
                                data.decisionLogin ||
                                (data.decision === "pending"
                                    ? "Awaiting decision"
                                    : ""),
                            )}
                            {detailItem(
                                "Request Raised",
                                formatDateTime(data.requestedAt),
                            )}
                            {detailItem(
                                "Decision Recorded",
                                data.decidedAt
                                    ? formatDateTime(data.decidedAt)
                                    : "",
                            )}
                        </div>

                        <div className="tw-mt-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                            <p className="tw-mb-1 tw-text-xs tw-font-semibold tw-uppercase tw-text-gray-500">
                                Remarks
                            </p>
                            <p className="tw-mb-0 tw-whitespace-pre-wrap tw-text-sm tw-text-gray-700">
                                {data.remarks || "No comments"}
                            </p>
                        </div>
                    </>
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

export default ViewApprovalModal;

import { useState, type ChangeEvent } from "react";

import {
    Button,
    TextArea,
    UserDetails,
} from "../../../../Components/Common";
import { type ApprovalRecord } from "../helper";

interface RejectApprovalModalProps {
    toggle: () => void;
    data?: ApprovalRecord;
    onConfirm: (remarks: string) => void;
}

const MIN_REMARKS_LENGTH = 10;

const RejectApprovalModal = ({
    toggle,
    data,
    onConfirm,
}: RejectApprovalModalProps) => {
    const [remarks, setRemarks] = useState<string>("");
    const [touched, setTouched] = useState<boolean>(false);

    const error =
        remarks.trim().length < MIN_REMARKS_LENGTH
            ? `Provide a clear explanation (at least ${MIN_REMARKS_LENGTH} characters)`
            : "";

    const confirmHandler = () => {
        setTouched(true);

        if (error) {
            return;
        }

        onConfirm(remarks.trim());
        toggle();
    };

    return (
        <>
            <div className="tw-p-4">
                <div className="tw-text-center">
                    <div className="tw-mx-auto tw-mb-3 tw-flex tw-h-14 tw-w-14 tw-items-center tw-justify-center tw-rounded-full tw-bg-red-50 tw-text-red-600">
                        <i className="ri-close-line fs-22"></i>
                    </div>
                    <h4 className="tw-mb-2">Are you sure?</h4>
                    <p className="tw-mb-4 tw-text-sm tw-text-gray-500">
                        Do you want to reject this action item?
                    </p>
                </div>

                {data && (
                    <div className="tw-mb-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3">
                        <UserDetails
                            displayName={data.actionItem}
                            displayId={data.actionItemCode}
                            showAvatar={false}
                        />
                        <p className="tw-mb-0 tw-mt-2 tw-text-xs tw-text-gray-500">
                            Owner: {data.owner} · Approver: {data.approver}
                        </p>
                    </div>
                )}

                <TextArea
                    name="rejectRemarks"
                    labelText="Decision Remarks"
                    labelClass="required"
                    placeHolder="Provide a clear explanation (at least 10 characters)"
                    value={remarks}
                    onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                        setRemarks(event.target.value)
                    }
                    onBlur={() => setTouched(true)}
                    height="110px"
                    showRemainingChars
                    maxLength={500}
                    invalid={touched && error ? true : false}
                    error={touched ? error : ""}
                />
            </div>

            <div className="tw-flex tw-justify-end tw-gap-2 tw-border-t tw-border-gray-200 tw-p-4">
                <Button type="button" variant="secondary" onClick={toggle}>
                    Cancel
                </Button>

                <Button
                    type="button"
                    variant="reject"
                    onClick={confirmHandler}
                >
                    Confirm Reject
                </Button>
            </div>
        </>
    );
};

export default RejectApprovalModal;

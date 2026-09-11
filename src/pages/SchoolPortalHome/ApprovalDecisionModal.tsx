import React, { useState } from "react";
import { ModalBody, ModalFooter } from "reactstrap";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { ModalContainerUpdated, TextArea } from "../../Components/Common";
import Button from "../../Components/Common/Button";
import { IApprovalRequest } from "./helper";

export type IApprovalAction = "approve" | "reject" | "acknowledge";

interface IApprovalDecisionModalProps {
  isOpen: boolean;
  request: IApprovalRequest;
  action: IApprovalAction;
  toggle: () => void;
  onConfirm: (reason: string) => void;
}

const ApprovalDecisionModal: React.FC<IApprovalDecisionModalProps> = ({
  isOpen,
  request,
  action,
  toggle,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const isReject = action === "reject";
  const isAcknowledgement = action === "acknowledge";

  const modalTitle = isReject
    ? "Reject request"
    : isAcknowledgement
      ? "Acknowledge request"
      : "Approve request";

  const fieldLabel = isReject
    ? "Reason for rejection"
    : isAcknowledgement
      ? "Acknowledgement comment"
      : "Approval comment";

  return (
    <ModalContainerUpdated
      id="ui-approval-decision-modal"
      isOpen={isOpen}
      toggle={toggle}
      modalSize="md"
      modalTitle={modalTitle}
    >
      <ModalBody>
        <div className="tw-flex tw-items-center tw-gap-2 tw-mb-3">
          <HugeiconsIcon
            icon={isReject ? CancelCircleIcon : CheckmarkCircle02Icon}
            size={20}
            className={isReject ? "tw-text-red-500" : "tw-text-[#1bb3a6]"}
          />
          <p className="tw-text-sm tw-text-gray-500 tw-mb-0">
            {request.type} for {request.person}
          </p>
        </div>

        <div className="tw-bg-gray-50 tw-rounded-md tw-p-3 tw-mb-3">
          <small className="tw-text-gray-500 tw-block">Request details</small>
          <strong className="tw-block tw-text-sm">{request.detail}</strong>
          <small className="tw-text-gray-500">
            {request.range} · Submitted {request.submitted.toLowerCase()}
          </small>
        </div>

        <TextArea
          name="approvalReason"
          labelText={fieldLabel}
          value={reason}
          height="7rem"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setReason(event.target.value)
          }
          placeHolder={
            isReject
              ? "Enter a clear reason for rejecting this request"
              : isAcknowledgement
                ? "Enter an acknowledgement comment"
                : "Enter an approval comment"
          }
          helperText="Ensure you double-check the relevant information before approving or acknowledging this request."
        />

        {!reason.trim() && (
          <small className="tw-text-red-500">
            A comment is required to continue.
          </small>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          variant={isReject ? "reject" : "primary"}
          disabled={!reason.trim()}
          onClick={() => onConfirm(reason)}
        >
          {isReject
            ? "Reject request"
            : isAcknowledgement
              ? "Acknowledge"
              : "Approve request"}
        </Button>
      </ModalFooter>
    </ModalContainerUpdated>
  );
};

export default ApprovalDecisionModal;

import React, { useState } from "react";
import { ModalBody, ModalFooter } from "reactstrap";
import { ModalContainerUpdated, Switch } from "../../../Components/Common";
import Button from "../../../Components/Common/Button";

interface ITcRetentionPromptModalProps {
  isOpen: boolean;
  toggle: () => void;
  onConfirm: (tcRetentionFormEnabled: boolean) => void;
}

/**
 * Asked when a person is added to the TC Request approvals: whether the TC
 * retention form should be enabled for this approver. Defaults to No.
 */
const TcRetentionPromptModal: React.FC<ITcRetentionPromptModalProps> = ({
  isOpen,
  toggle,
  onConfirm,
}) => {
  const [retentionEnabled, setRetentionEnabled] = useState(false);

  return (
    <ModalContainerUpdated
      id="ui-tc-retention-prompt-modal"
      isOpen={isOpen}
      toggle={toggle}
      modalSize="md"
      modalTitle="TC Retention Form"
    >
      <ModalBody>
        <p className="tw-text-sm tw-text-gray-500 tw-mb-3">
          Should the TC retention form be enabled for this approver? When
          enabled, the retention form is part of their TC request approval.
        </p>

        <Switch
          attributeId="tc-retention-form-switch"
          checked={retentionEnabled}
          onChangeHndlr={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRetentionEnabled(event.target.checked)
          }
          labelClass="tw-ms-2"
          labelName={
            retentionEnabled
              ? "Yes — enable TC retention form"
              : "No — TC retention form not required"
          }
        />
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onConfirm(retentionEnabled)}>
          Add person
        </Button>
      </ModalFooter>
    </ModalContainerUpdated>
  );
};

export default TcRetentionPromptModal;

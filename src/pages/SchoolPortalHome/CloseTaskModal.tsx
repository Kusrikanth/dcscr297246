import React, { useState } from "react";
import { ModalBody, ModalFooter } from "reactstrap";
import { ModalContainerUpdated, TextArea } from "../../Components/Common";
import Button from "../../Components/Common/Button";
import { getDateWithTimeFormat } from "../../utility/dateutility";
import { IPortalTask } from "./helper";

interface ICloseTaskModalProps {
  isOpen: boolean;
  task: IPortalTask;
  toggle: () => void;
  onConfirm: (remarks: string) => void;
}

const CloseTaskModal: React.FC<ICloseTaskModalProps> = ({
  isOpen,
  task,
  toggle,
  onConfirm,
}) => {
  const [remarks, setRemarks] = useState("");

  return (
    <ModalContainerUpdated
      id="ui-close-task-modal"
      isOpen={isOpen}
      toggle={toggle}
      modalSize="md"
      modalTitle="Close action"
    >
      <ModalBody>
        <p className="tw-text-sm tw-text-gray-500 tw-mb-3">{task.title}</p>

        <div className="tw-bg-gray-50 tw-rounded-md tw-p-3 tw-mb-3">
          <small className="tw-text-gray-500 tw-block">
            {task.id} · Assigned to {task.assignee}
          </small>
          <strong className="tw-text-sm">
            Due {getDateWithTimeFormat(task.deadline)}
          </strong>
        </div>

        <TextArea
          name="closureRemarks"
          labelText="Closure remarks"
          value={remarks}
          height="7rem"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRemarks(event.target.value)
          }
          placeHolder="Enter what was completed or the outcome"
          helperText="Remarks are required before this action can be closed."
        />
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={!remarks.trim()}
          onClick={() => onConfirm(remarks.trim())}
        >
          Mark as completed
        </Button>
      </ModalFooter>
    </ModalContainerUpdated>
  );
};

export default CloseTaskModal;

import React, { useState } from "react";
import { ModalBody, ModalFooter } from "reactstrap";
import { ModalContainerUpdated, TextInput } from "../../../Components/Common";
import Button from "../../../Components/Common/Button";

interface IAddActivityModalProps {
  isOpen: boolean;
  toggle: () => void;
  onCreate: (name: string) => void;
}

const AddActivityModal: React.FC<IAddActivityModalProps> = ({
  isOpen,
  toggle,
  onCreate,
}) => {
  const [activityName, setActivityName] = useState("");

  function submitHndlr() {
    if (!activityName.trim()) return;
    onCreate(activityName.trim());
  }

  return (
    <ModalContainerUpdated
      id="ui-add-activity-modal"
      isOpen={isOpen}
      toggle={toggle}
      modalSize="md"
      modalTitle="Add activity"
    >
      <ModalBody>
        <p className="tw-text-sm tw-text-gray-500 tw-mb-3">
          Create a workflow and then assign its participants.
        </p>

        <TextInput
          name="activityName"
          labelText="Activity name"
          value={activityName}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setActivityName(event.target.value)
          }
          placeHolder="Example: Refund request"
          formgroupClassName="tw-mb-0"
          maxLength={60}
          autoFocus
        />
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={!activityName.trim()}
          onClick={submitHndlr}
        >
          Add activity
        </Button>
      </ModalFooter>
    </ModalContainerUpdated>
  );
};

export default AddActivityModal;

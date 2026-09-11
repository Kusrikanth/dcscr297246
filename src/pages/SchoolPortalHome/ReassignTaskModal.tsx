import React, { useState } from "react";
import { ModalBody, ModalFooter } from "reactstrap";
import {
  CustomSelect,
  ModalContainerUpdated,
  TextArea,
} from "../../Components/Common";
import Button from "../../Components/Common/Button";
import { getDateWithTimeFormat } from "../../utility/dateutility";
import {
  calendarEmployees,
  findEmployeeByName,
  IPortalTask,
  renderEmployeeOption,
  renderEmployeeValue,
  searchableEmployees,
} from "./helper";

interface IReassignTaskModalProps {
  isOpen: boolean;
  task: IPortalTask;
  toggle: () => void;
  onReassign: (assigneeId: string, remarks: string) => void;
}

const ReassignTaskModal: React.FC<IReassignTaskModalProps> = ({
  isOpen,
  task,
  toggle,
  onReassign,
}) => {
  const currentEmployee = findEmployeeByName(task.assignee);
  const [assignee, setAssignee] = useState(
    currentEmployee?.id || calendarEmployees[0].id
  );
  const [remarks, setRemarks] = useState("");
  const unchanged = currentEmployee?.id === assignee;

  return (
    <ModalContainerUpdated
      id="ui-reassign-task-modal"
      isOpen={isOpen}
      toggle={toggle}
      modalSize="md"
      modalTitle="Reassign action"
    >
      <ModalBody>
        <p className="tw-text-sm tw-text-gray-500 tw-mb-3">{task.title}</p>

        <div className="tw-bg-gray-50 tw-rounded-md tw-p-3 tw-mb-3">
          <small className="tw-text-gray-500 tw-block">Current assignee</small>
          <strong className="tw-text-sm tw-block">{task.assignee}</strong>
          <small className="tw-text-gray-500">
            {task.id} · Due {getDateWithTimeFormat(task.deadline)}
          </small>
        </div>

        <CustomSelect
          name="reassignAssignee"
          idKey="id"
          searchKey="searchLabel"
          labelText="Assign to"
          value={assignee}
          options={searchableEmployees}
          renderValue={renderEmployeeValue}
          renderOptions={renderEmployeeOption}
          onChange={(employeeId: string) => setAssignee(employeeId)}
        />

        <TextArea
          name="reassignRemarks"
          labelText="Reassignment note (optional)"
          value={remarks}
          height="6rem"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setRemarks(event.target.value)
          }
          placeHolder="Add context for the new assignee"
        />
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={unchanged}
          onClick={() => onReassign(assignee, remarks.trim())}
        >
          Reassign
        </Button>
      </ModalFooter>
    </ModalContainerUpdated>
  );
};

export default ReassignTaskModal;

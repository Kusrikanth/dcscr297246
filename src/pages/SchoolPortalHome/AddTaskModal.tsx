import React, { useState } from "react";
import { ModalBody, ModalFooter } from "reactstrap";
import {
  CustomSelect,
  DateInput,
  ModalContainerUpdated,
  TextInput,
} from "../../Components/Common";
import Button from "../../Components/Common/Button";
import {
  calendarEmployees,
  renderEmployeeOption,
  renderEmployeeValue,
  searchableEmployees,
} from "./helper";

export interface INewTaskValues {
  title: string;
  deadline: string;
  assignee: string;
}

interface IAddTaskModalProps {
  isOpen: boolean;
  toggle: () => void;
  onCreate: (task: INewTaskValues) => void;
}

const AddTaskModal: React.FC<IAddTaskModalProps> = ({
  isOpen,
  toggle,
  onCreate,
}) => {
  const [values, setValues] = useState<INewTaskValues>({
    title: "",
    deadline: "",
    assignee: calendarEmployees[0].id,
  });
  const [error, setError] = useState("");

  function onChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setValues((prevState) => ({ ...prevState, [name]: value }));
  }

  function submitHndlr() {
    if (!values.title.trim() || !values.deadline || !values.assignee) {
      setError("Task title, deadline and assignee are required.");
      return;
    }
    onCreate({ ...values, title: values.title.trim() });
  }

  return (
    <ModalContainerUpdated
      id="ui-add-task-modal"
      isOpen={isOpen}
      toggle={toggle}
      modalSize="md"
      modalTitle="Create an action"
    >
      <ModalBody>
        <p className="tw-text-sm tw-text-gray-500 tw-mb-3">
          Assign a task to yourself or another employee
        </p>

        <TextInput
          name="title"
          labelText="Task title"
          value={values.title}
          onChange={onChangeHndlr}
          placeHolder="Enter task title"
          maxLength={80}
          autoFocus
        />

        <DateInput
          name="deadline"
          labelText="Deadline"
          inputType="datetime-local"
          value={values.deadline}
          onChange={onChangeHndlr}
        />

        <CustomSelect
          name="assignee"
          idKey="id"
          searchKey="searchLabel"
          labelText="Assign to"
          value={values.assignee}
          options={searchableEmployees}
          renderValue={renderEmployeeValue}
          renderOptions={renderEmployeeOption}
          onChange={(assignee: string) =>
            setValues((prevState) => ({ ...prevState, assignee }))
          }
        />

        {error && <small className="tw-text-red-500">{error}</small>}
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submitHndlr}>
          Create action
        </Button>
      </ModalFooter>
    </ModalContainerUpdated>
  );
};

export default AddTaskModal;

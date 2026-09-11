import React, { useState } from "react";
import { ModalBody, ModalFooter } from "reactstrap";
import {
  CustomSelect,
  DateInput,
  ModalContainerUpdated,
  Switch,
  TextArea,
  TextInput,
} from "../../Components/Common";
import Button from "../../Components/Common/Button";
import { getDdMmYyyyWithMonthNameFormat } from "../../utility/dateutility";
import {
  calendarEmployees,
  IPortalEmployee,
  renderEmployeeOption,
  renderEmployeeValue,
  searchableEmployees,
} from "./helper";
import { INewTaskValues } from "./AddTaskModal";

interface ICalendarNoteModalProps {
  isOpen: boolean;
  date: string;
  employee: IPortalEmployee;
  initialValue: string;
  toggle: () => void;
  onSave: (note: string, task: INewTaskValues | null) => void;
}

const CalendarNoteModal: React.FC<ICalendarNoteModalProps> = ({
  isOpen,
  date,
  employee,
  initialValue,
  toggle,
  onSave,
}) => {
  const [note, setNote] = useState(initialValue);
  const [createTask, setCreateTask] = useState(false);
  const [taskValues, setTaskValues] = useState<INewTaskValues>({
    title: "",
    deadline: "",
    assignee: calendarEmployees[0].id,
  });
  const [error, setError] = useState("");

  function onChangeTaskHndlr(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setTaskValues((prevState) => ({ ...prevState, [name]: value }));
  }

  function saveHndlr() {
    if (
      createTask &&
      (!taskValues.title.trim() || !taskValues.deadline || !taskValues.assignee)
    ) {
      setError("Task title, deadline and assignee are required.");
      return;
    }
    onSave(
      note.trim(),
      createTask ? { ...taskValues, title: taskValues.title.trim() } : null
    );
  }

  return (
    <ModalContainerUpdated
      id="ui-calendar-note-modal"
      isOpen={isOpen}
      toggle={toggle}
      modalSize="lg"
      modalTitle="Calendar note"
    >
      <ModalBody>
        <p className="tw-text-sm tw-text-gray-500 tw-mb-3">
          {employee.name} · {employee.id} ·{" "}
          {getDdMmYyyyWithMonthNameFormat(date)}
        </p>

        <TextArea
          name="calendarNote"
          labelText="Note"
          value={note}
          height="9rem"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setNote(event.target.value)
          }
          placeHolder="Type a note, reminder or update for this date..."
          maxLength={500}
          showRemainingChars
        />

        <div className="tw-border tw-rounded-md tw-p-3">
          <div className="tw-flex tw-items-start tw-gap-3">
            <div className="tw-flex-grow">
              <strong className="tw-text-sm tw-block">Create a task</strong>
              <small className="tw-text-gray-500">
                Assign this follow-up to yourself or another employee
              </small>
            </div>
            <Switch
              attributeId="createCalendarTask"
              checked={createTask}
              onChangeHndlr={() => {
                setCreateTask((value) => !value);
                setError("");
              }}
              labelName={createTask ? "On" : "Off"}
            />
          </div>

          {createTask && (
            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mt-3">
              <div className="tw-col-span-12">
                <TextInput
                  name="title"
                  labelText="Task title"
                  value={taskValues.title}
                  onChange={onChangeTaskHndlr}
                  placeHolder="Enter task title"
                  formgroupClassName="tw-mb-0"
                  maxLength={80}
                />
              </div>
              <div className="tw-col-span-12 sm:tw-col-span-6">
                <DateInput
                  name="deadline"
                  labelText="Deadline"
                  inputType="datetime-local"
                  value={taskValues.deadline}
                  onChange={onChangeTaskHndlr}
                  formgroupClassName="tw-mb-0"
                />
              </div>
              <div className="tw-col-span-12 sm:tw-col-span-6">
                <CustomSelect
                  name="calendarTaskAssignee"
                  idKey="id"
                  searchKey="searchLabel"
                  labelText="Assign to"
                  value={taskValues.assignee}
                  options={searchableEmployees}
                  renderValue={renderEmployeeValue}
                  renderOptions={renderEmployeeOption}
                  onChange={(assignee: string) =>
                    setTaskValues((prevState) => ({ ...prevState, assignee }))
                  }
                />
              </div>
              {error && (
                <div className="tw-col-span-12">
                  <small className="tw-text-red-500">{error}</small>
                </div>
              )}
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button variant="primary" onClick={saveHndlr}>
          {createTask ? "Save note & create task" : "Save note"}
        </Button>
      </ModalFooter>
    </ModalContainerUpdated>
  );
};

export default CalendarNoteModal;

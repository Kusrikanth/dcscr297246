import React, { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { CustomSelect } from "../../Components/Common";
import { getFormYyyyMmDdFormat } from "../../utility/dateutility";
import CalendarNoteModal from "./CalendarNoteModal";
import { INewTaskValues } from "./AddTaskModal";
import {
  calendarEmployees,
  findEmployeeById,
  fixedHolidays,
  initialEmployeeNotes,
  punchRecords,
  renderEmployeeOption,
  renderEmployeeValue,
  searchableEmployees,
} from "./helper";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface IWorkingCalendarProps {
  onTaskCreated: (
    task: INewTaskValues,
    ownerId: string,
    sourceDate: string
  ) => void;
}

const statusClasses: Record<string, string> = {
  present: "tw-bg-green-50 tw-border-green-200 tw-text-green-700",
  holiday: "tw-bg-amber-50 tw-border-amber-200 tw-text-amber-700",
  "no-status": "tw-bg-white tw-border-gray-200 tw-text-gray-600",
};

const WorkingCalendar: React.FC<IWorkingCalendarProps> = ({
  onTaskCreated,
}) => {
  const [visibleMonth, setVisibleMonth] = useState(new Date(2026, 7, 1));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(
    calendarEmployees[0].id
  );
  const [notes, setNotes] = useState<Record<string, Record<string, string>>>(
    initialEmployeeNotes
  );
  const [tasks, setTasks] = useState<Record<string, Record<string, number>>>(
    {}
  );
  const [editorDate, setEditorDate] = useState("");

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: Array<number | null> = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
  while (cells.length % 7) cells.push(null);

  const selectedEmployee =
    findEmployeeById(selectedEmployeeId) || calendarEmployees[0];
  const employeeIndex = calendarEmployees.findIndex(
    (employee) => employee.id === selectedEmployeeId
  );

  function changeMonth(amount: number) {
    setVisibleMonth(new Date(year, month + amount, 1));
  }

  function saveNoteHndlr(note: string, task: INewTaskValues | null) {
    setNotes((prevState) => ({
      ...prevState,
      [selectedEmployeeId]: {
        ...(prevState[selectedEmployeeId] || {}),
        [editorDate]: note,
      },
    }));

    if (task) {
      setTasks((prevState) => ({
        ...prevState,
        [selectedEmployeeId]: {
          ...(prevState[selectedEmployeeId] || {}),
          [editorDate]:
            (prevState[selectedEmployeeId]?.[editorDate] || 0) + 1,
        },
      }));
      onTaskCreated(task, selectedEmployeeId, editorDate);
    }
    setEditorDate("");
  }

  return (
    <div className="tw-card tw-mb-0 tw-h-full !tw-overflow-visible">
      <div className="tw-card-header tw-flex tw-items-start tw-gap-3 tw-flex-wrap">
        <div className="tw-flex-grow tw-min-w-0">
          <h4 className="tw-card-title">Working calendar</h4>
          <p className="tw-card-subTitle">
            Attendance status, punches and school holidays
          </p>
        </div>
        <div className="tw-flex tw-items-center tw-gap-2 tw-flex-wrap tw-justify-end tw-flex-shrink-0">
          <div style={{ minWidth: "14rem" }}>
            <CustomSelect
              name="calendarEmployee"
              idKey="id"
              searchKey="searchLabel"
              value={selectedEmployeeId}
              options={searchableEmployees}
              renderValue={renderEmployeeValue}
              renderOptions={renderEmployeeOption}
              onChange={(employeeId: string) =>
                setSelectedEmployeeId(employeeId)
              }
            />
          </div>
          <div className="tw-flex tw-items-center tw-gap-1">
            <button
              type="button"
              className="btn btn-sm btn-soft-secondary"
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
            </button>
            <strong className="tw-text-sm tw-whitespace-nowrap">
              {visibleMonth.toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            </strong>
            <button
              type="button"
              className="btn btn-sm btn-soft-secondary"
              onClick={() => changeMonth(1)}
              aria-label="Next month"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="tw-card-body">
        <div className="tw-flex tw-items-center tw-gap-4 tw-mb-3 tw-text-xs tw-text-gray-500">
          <span className="tw-flex tw-items-center tw-gap-1">
            <i className="tw-inline-block tw-w-3 tw-h-3 tw-rounded-sm tw-bg-green-200" />
            Present
          </span>
          <span className="tw-flex tw-items-center tw-gap-1">
            <i className="tw-inline-block tw-w-3 tw-h-3 tw-rounded-sm tw-bg-amber-200" />
            Holiday
          </span>
          <span className="tw-flex tw-items-center tw-gap-1">
            <i className="tw-inline-block tw-w-3 tw-h-3 tw-rounded-sm tw-bg-gray-200" />
            No status
          </span>
        </div>

        <div className="tw-grid tw-grid-cols-7 tw-gap-1" role="grid">
          {weekdayLabels.map((day) => (
            <div
              key={day}
              className="tw-text-center tw-text-xs tw-font-semibold tw-text-gray-500 tw-py-1"
            >
              {day}
            </div>
          ))}

          {cells.map((day, index) => {
            if (!day) {
              return (
                <div
                  key={`empty-${index}`}
                  className="tw-min-h-[3.5rem] tw-rounded-md"
                />
              );
            }

            const key = getFormYyyyMmDdFormat(new Date(year, month, day)) || "";
            const weekday = new Date(year, month, day).getDay();
            const holiday =
              fixedHolidays[key] || (weekday === 0 ? "Sunday · Weekly holiday" : "");
            const basePunches = punchRecords[key];
            const punches =
              basePunches &&
                !(employeeIndex > 0 && (day + employeeIndex) % 9 === 0)
                ? basePunches
                : null;
            const status = holiday ? "holiday" : punches ? "present" : "no-status";
            const hasNote = Boolean(notes[selectedEmployeeId]?.[key]);
            const taskCount = tasks[selectedEmployeeId]?.[key] || 0;

            const tooltip = holiday
              ? `${holiday} · No punch required`
              : punches
                ? `Present · Punch in ${punches[0]} · Punch out ${punches[1]} · Worked 7h 52m`
                : "No attendance or holiday information.";

            return (
              <button
                type="button"
                key={key}
                role="gridcell"
                title={`${tooltip}${hasNote ? " · Saved note available" : ""
                  }${taskCount ? ` · ${taskCount} assigned task(s)` : ""} · Click to add or edit a note`}
                onClick={() => setEditorDate(key)}
                className={`tw-min-h-[3.5rem] tw-rounded-md tw-border tw-p-1 tw-flex tw-flex-col tw-items-start tw-text-start hover:tw-shadow ${statusClasses[status]}`}
              >
                <b className="tw-text-xs">{day}</b>
                {punches && <span className="tw-text-[10px]">Present</span>}
                {holiday && (
                  <span className="tw-text-[10px]">
                    {weekday === 0 ? "Sunday" : "Holiday"}
                  </span>
                )}
                <span className="tw-flex tw-items-center tw-gap-1 tw-mt-auto">
                  {hasNote && (
                    <i className="tw-inline-block tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-blue-500" />
                  )}
                  {taskCount > 0 && (
                    <i className="tw-inline-block tw-w-1.5 tw-h-1.5 tw-rounded-full tw-bg-orange-500" />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {editorDate && (
          <CalendarNoteModal
            isOpen
            date={editorDate}
            employee={selectedEmployee}
            initialValue={notes[selectedEmployeeId]?.[editorDate] || ""}
            toggle={() => setEditorDate("")}
            onSave={saveNoteHndlr}
          />
        )}
      </div>
    </div>
  );
};

export default WorkingCalendar;

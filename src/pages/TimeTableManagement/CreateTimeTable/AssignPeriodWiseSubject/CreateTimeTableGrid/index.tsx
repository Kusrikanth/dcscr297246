import React from "react";
import { useModal } from "../../../../../hooks/modalhook";
import { ModalContainerUpdated } from "../../../../../Components/Common";
import AddSubjectModal from "./AddSubjectModal";
import { useDroppable } from "@dnd-kit/core";
import { twMerge } from "tailwind-merge";
import { Delete02Icon, PencilEdit01Icon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";

function Droppable(props) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: {
      dayName: props.dayName
    }
  });
  return (
    <div ref={setNodeRef} data-id={props?.id} className={twMerge(`grid-item text-center card mb-0 d-flex 
    align-items-center justify-content-center `, isOver ? '!tw-bg-[rgba(16,185,129,0.4)]' : 'bg-light')}>
      {props.children}
    </div >
  );
}

const CreateTimeTableGrid = ({ timeTable, setTimeTable, periodsList, setSelectedCell, selectedCell, getEmployees }) => {

  const {
    closeModal: closeAddSubjectModal,
    openModal: openAddSubjectModal,
    modalState: addSubjectModalState,
  } = useModal();

  const handleCellClick = (dayName, periodId, subjectId?) => {
    setSelectedCell({ dayName, periodId });
    openAddSubjectModal(subjectId);
  };
  
  const handleCellDelete = (dayName, periodId) => {
    const updatedTimeTable = JSON.parse(JSON.stringify(timeTable));

    const dayIndex = updatedTimeTable.findIndex(day => day.dayName === dayName);

    if (dayIndex !== -1) {
      const periodIndex = updatedTimeTable[dayIndex].periods.findIndex(
        period => period.periodId === periodId
      );

      if (periodIndex !== -1) {
        updatedTimeTable[dayIndex].periods[periodIndex] = {
          ...updatedTimeTable[dayIndex].periods[periodIndex],
          periodSubjectName: "",
          periodSubjectTeacher: "",
          periodSubjectId: null,
          periodSubjectType: "",
          periodTeacherId: null,
          periodSubjectTeacherEmpCode: "",
          substituteTeacherId: null,
          periodSubtituteTeacherEmpCode: "",
          periodSubtituteTeacherName: "",
        };

        setTimeTable(updatedTimeTable);
      }
    }
  };


  const handleSubjectAdded = (subjectData) => {
    // Create a deep copy of the timetable
    const updatedTimeTable = JSON.parse(JSON.stringify(timeTable));

    // Find the day and period to update
    const dayIndex = updatedTimeTable.findIndex(day => day.dayName === subjectData.dayName);

    if (dayIndex !== -1) {
      const periodIndex = updatedTimeTable[dayIndex].periods.findIndex(
        period => period.periodId === subjectData.periodId
      );

      if (periodIndex !== -1) {
        // Update the period with the new subject data
        updatedTimeTable[dayIndex].periods[periodIndex] = {
          ...updatedTimeTable[dayIndex].periods[periodIndex],
          periodSubjectName: subjectData.periodSubjectName,
          periodSubjectTeacher: subjectData.periodSubjectTeacher,
          periodSubjectId: subjectData.periodSubjectId,
          periodSubjectType: subjectData.periodSubjectType,
          periodTeacherId: subjectData.periodTeacherId,
          periodSubjectTeacherEmpCode: subjectData.periodSubjectTeacherEmpCode,
          substituteTeacherId: subjectData.substituteTeacherId,
          periodSubtituteTeacherEmpCode: subjectData.periodSubstituteTeacherEmpCode,
          periodSubtituteTeacherName: subjectData.substituteTeacherName,
        };

        setTimeTable(updatedTimeTable);
      }
    }

    closeAddSubjectModal();
  };
  return (
    <>
      <div className="time-table-grid-container">
        <div
          className="time-table-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${periodsList.length + 1}, 1fr)`,
          }}
        >
          <div className="grid-item header tw-flex tw-items-center tw-border tw-bg-gray-100 tw-rounded tw-justify-center tw-font-bold">
            Days
          </div>

          {periodsList.map((period) => (
            <div
              className="grid-item header tw-text-center tw-place-content-center tw-flex tw-items-center tw-justify-center tw-flex-col tw-border tw-bg-gray-100 tw-rounded tw-font-bold"
              key={period.periodName}
            >
              <p className="tw-mb-0">{period.periodName}</p>
              <p className="tw-mb-0 tw-text-gray-500 tw-text-xs">({period.periodTime})</p>
            </div>
          ))}

          {timeTable?.map((day, dayIndex) => {
            return (
              <React.Fragment key={day.dayName}>

                <div className="grid-item day-name tw-text-center tw-flex tw-items-center tw-border tw-bg-gray-100 tw-rounded tw-justify-center tw-font-bold">
                  {day.dayName}
                </div>
                {day.periods?.map((period, periodIndex) => {
                  if (period.isBreak) {
                    if (dayIndex === 0) {
                      const cellColor =
                        period.periodSubjectName === "Lunch"
                          ? "#0EA5E91A"
                          : period.periodSubjectName === "Assembly"
                            ? "#10B9811A"
                            : period.periodSubjectName === "Break"
                              ? "#8B5CF61A"
                              : "#8B5CF61A";

                      return (
                        <div
                          className="grid-item tw-text-center tw-mb-3 tw-flex tw-items-center tw-justify-center !tw-h-auto tw-shadow-none tw-border tw-rounded-lg"
                          style={{
                            gridRow: `2 / ${timeTable.length + 2}`,
                            gridColumn: `${periodIndex + 2}/${periodIndex + 3}`,
                            writingMode: "vertical-lr",
                            transform: "rotate(180deg)",
                            backgroundColor: `${cellColor}`,
                          }}
                          key={`${period.periodId}`}
                        >
                          <h4 className="tw-mb-0">{period.periodSubjectName}</h4>
                        </div>
                      );
                    } else {
                      return <React.Fragment key={`${period.periodId}`}></React.Fragment>;
                    }
                  } else {
                    return (
                      <Droppable
                        key={`${period.periodId}`}
                        id={period?.periodId}
                        dayName={day.dayName}
                      >
                        {period?.periodSubjectTeacher ? (
                          <div className="tw-flex tw-flex-col">
                            <p
                              className="tw-mb-1 tw-overflow-hidden tw-text-ellipsis tw-whitespace-nowrap tw-max-w-[150px] tw-ps-2 tw-pe-2"
                              title={period.periodSubjectName}
                            >
                              {period.periodSubjectName}
                            </p>
                            <p className="tw-mb-0 tw-text-gray-500 tw-text-sm">
                              {period.periodSubjectTeacher}
                            </p>
                            <p className="tw-mb-0 tw-text-gray-500 tw-text-xs">
                              ({period.periodSubjectType})
                            </p>
                            <div
                              className="hover-edit-icon tw-flex tw-items-center tw-justify-center"
                              data-id={period.periodId}
                              onClick={() => handleCellClick(day.dayName, period.periodId, period.periodSubjectId)}
                            >
                              <HugeiconsIcon icon={PencilEdit01Icon} size={15} />
                            </div>
                            <div
                              className="hover-delete-icon tw-flex tw-items-center tw-justify-center"
                              data-id={period.periodId}
                              onClick={() => handleCellDelete(day.dayName, period.periodId)}
                            >
                              <HugeiconsIcon icon={Delete02Icon} size={15} className="tw-text-red-500" />
                            </div>
                          </div>
                        ) : (
                          <div className="tw-flex tw-items-center">
                            <div
                              className="hover-add-icon tw-flex tw-items-center tw-justify-center tw-cursor-pointer"
                              onClick={() => handleCellClick(day.dayName, period.periodId)}
                            >
                              <i className="ri-add-line tw-text-2xl"></i>
                            </div>
                          </div>
                        )}
                      </Droppable>
                    );
                  }
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
      <ModalContainerUpdated
        id="add-period-modal"
        isOpen={addSubjectModalState.showModal}
        toggle={closeAddSubjectModal}
        modalTitle="Add Subject"
        modalSize="md"
      >
        <AddSubjectModal
          toggle={closeAddSubjectModal}
          selectedCell={selectedCell}
          onSubjectAdded={handleSubjectAdded}
          id={addSubjectModalState.modalData}
          getEmployees={getEmployees}
          timeTable={timeTable}
        />
      </ModalContainerUpdated>
    </>
  );
};

export default CreateTimeTableGrid;
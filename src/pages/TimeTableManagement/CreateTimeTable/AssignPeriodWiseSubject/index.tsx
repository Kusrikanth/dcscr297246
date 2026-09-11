import { useEffect, useMemo, useState } from "react";
import SubjectsList from "./SubjectsList";
import CreateTimeTableGrid from "./CreateTimeTableGrid";
import { ModalContainerUpdated, TextInput } from "../../../../Components/Common";
import { DndContext } from "@dnd-kit/core";
import { generatePeriodsList, generateTimeTable } from "./CreateTimeTableGrid/helper";
import { nanoid } from "nanoid";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getSubjectsTeacherAct, resetSubjectsTeacherAct, saveTimetableAct } from "../../../../store/academic/timetableManagment/timetableManagmentactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useFormik } from "formik";
import { shallowEqual } from "react-redux";
import { useModal } from "../../../../hooks/modalhook";
import AddSubjectModal from "./CreateTimeTableGrid/AddSubjectModal";
import { getTeacherList } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { convertToFullTimeFormat } from "../../../../utility/dateutility";
import { getEmployeeCategoriesAct, getEmployeeStatusAct } from "../../../../store/masterdata/masterdataactions";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  searchString: "",
}

const AssignPeriodWiseSubject = ({ updateStepHndlr, timeTableDetails }) => {
  const [activeDragSubject, setActiveDragSubject] = useState(null);
  const [currentPageSizeState, setCurrentPageSizeState] = useState<any>(10);
  const [totalStudentCountState, setTotalStudentCountState] = useState(0);
  const [isLoadingState, setIsLoadingState] = useState(false);
  const [subjectsList, setSubjectsList] = useState<any>([]);
  const [selectedCell, setSelectedCell] = useState({
    dayName: "",
    periodId: "",
    draggedSubjectId: "",
  });
  const {
    closeModal: closeAddSubjectModal,
    openModal: openAddSubjectModal,
    modalState: addSubjectModalState,
  } = useModal();
  const dispatch = useAppDispatch()

  const {
    getSubjectsTeacherResp,
    currentBranchIdResp: branchId,
    employeeStatusResp,
    employeeCategoriesResp,
  } = useAppSelector(
    ({ timeTableManagement, appData, masterData, classroomManagmentInfo }) => ({
      getSubjectsTeacherResp: timeTableManagement.getSubjectsTeacherResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      employeeStatusResp: masterData.employeeStatusResp,
      employeeCategoriesResp: masterData.employeeCategoriesResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (getSubjectsTeacherResp?.data.length > 0) {
      setSubjectsList(getSubjectsTeacherResp?.data || []);
      setTotalStudentCountState(getSubjectsTeacherResp?.totalElements || 0);
    }
  }, [getSubjectsTeacherResp]);
  
  const formattedTimeTable = useMemo(() => generateTimeTable(timeTableDetails.timeTableInfo || {}), [timeTableDetails]);
  const [timeTable, setTimeTable] = useState<any>(formattedTimeTable);
  const periodsList = useMemo(() => generatePeriodsList(timeTableDetails.timeTableInfo || {}), [timeTableDetails]);

  function handleDragStart(event) {
    setActiveDragSubject(event.active.data.current);
  }

  function handleDragEnd(event) {
    if (event.over && !!event.over.id) {
      const { dayName } = event.over.data.current;
      const { subjectName, teacherName, subjectId, teacherId, substituteTeacherId,subjectType } = event.active.data.current;
      
      if (!teacherName || !teacherId) {
        setSelectedCell({
          dayName: dayName,
          periodId: event.over.id,
          draggedSubjectId: subjectId
        });
        openAddSubjectModal(subjectId);
        getEmployees({ searchString: "" });
      } else {
        setTimeTable(prevState => {
          return prevState.map((day) => {
            if (day.dayName === dayName) {
              const updatedPeriods = day.periods.map((period) => {
                if (period.periodId === event.over.id) {
                  return {
                    ...period, periodSubjectName: subjectName,
                    periodSubjectTeacher: teacherName,
                    periodSubjectId: subjectId,
                    periodTeacherId: teacherId,
                    periodSubstituteTeacherId: substituteTeacherId,
                    periodSubjectType: subjectType
                  };
                }
                return period;
              });
              return { ...day, periods: updatedPeriods };
            }
            return day;
          })
        });
        setSubjectsList(prevState => {
          return prevState.map(item => {
            if (item.subjectId === event.active.id) {
              return { ...item, id: nanoid() }
            }
            return item;
          })
        })
      }
    }
    setActiveDragSubject(null);
  }

  useEffect(() => {
    dispatch(getEmployeeStatusAct(generateActionPayload("get_employee_status")));
    dispatch(getEmployeeCategoriesAct(generateActionPayload("get_employee_categories")));
  }, []);

  const handleSubjectAdded = (subjectData) => {
    const updatedTimeTable = JSON.parse(JSON.stringify(timeTable));

    const dayIndex = updatedTimeTable.findIndex(day => day.dayName === subjectData.dayName);

    if (dayIndex !== -1) {
      const periodIndex = updatedTimeTable[dayIndex].periods.findIndex(
        period => period.periodId === subjectData.periodId
      );

      if (periodIndex !== -1) {
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

        if (handleTimeTableUpdate) {
          handleTimeTableUpdate(updatedTimeTable);
        }
      }
    }
    closeAddSubjectModal();
  };
  const handleTimeTableUpdate = (updatedTimeTable) => {
    setTimeTable(updatedTimeTable);
  };

  const timeTableDetailsFormik = useFormik({
    initialValues,
    onSubmit: (values) => {
    },
  });

  const getEmployees = (otherProps?: any) => {
    let statusID = employeeStatusResp && employeeStatusResp.find((status: any) => status.empStatusName.toLowerCase() === 'active')?.id;
    let categoryID = employeeCategoriesResp && employeeCategoriesResp.find((category: any) => category.categoryName.toLowerCase() === 'teachers')?.employeeCategoryId;
    let filterState = { ...otherProps };

    if (timeTableDetails?.timeTableInfo?.academicYearId && timeTableDetails?.timeTableInfo?.curriculumId && statusID && categoryID) {
      const params = {
        branchId: branchId,
        pageNo: 0,
        pageSize: 2000,
        status: statusID,
        employeeCategoryId: categoryID,
        searchString: filterState.searchString || "",
        masterAcademicYearId: timeTableDetails?.timeTableInfo?.academicYearId,
        curriculumId: timeTableDetails?.timeTableInfo?.curriculumId,
        ...otherProps
      };
      dispatch(getTeacherList(generateActionPayload("get_employees", undefined, params)));
    }
  }

  const getSubjectTeacherApiCall = (otherProps?: any) => {
    const { pageSize, ...otherFilters } = otherProps || {};

    const payload = {
      branchId,
      curriculumId: timeTableDetails?.timeTableInfo?.curriculumId,
      academicYearId: timeTableDetails?.timeTableInfo?.academicYearId,
      classId: timeTableDetails?.timeTableInfo?.classId,
      sectionId: timeTableDetails?.timeTableInfo?.sectionId,
      ...otherFilters,
      pageNo: 0, pageSize: pageSize || currentPageSizeState,
    };
    if (payload.curriculumId && payload.academicYearId && payload.classId && payload.sectionId) {
      dispatch(getSubjectsTeacherAct(generateActionPayload("get_subjects_teacher", undefined, payload)));
    }
  }

  useEffect(() => {
      dispatch(getEmployeeStatusAct(generateActionPayload("get_employee_status")));
      dispatch(getEmployeeCategoriesAct(generateActionPayload("get_employee_categories")));
    }, []);
  
  const handlePrevious = () => {
    updateStepHndlr("time-table-details", timeTableDetails);
  }

  const filterHandler = (e) => {
    getSubjectTeacherApiCall({ searchString: e.target.value });
    timeTableDetailsFormik.setValues((prev: any) => ({ ...prev, searchString: e.target.value }));
  }

  function handleScroll(event: React.UIEvent<HTMLElement>) {
    const target = event.currentTarget as HTMLElement;
    const { scrollTop, scrollHeight, clientHeight } = target;

    if (((scrollHeight - scrollTop) - clientHeight) <= 1) {
      const nextPageSize = currentPageSizeState + 10;
      if (currentPageSizeState >= totalStudentCountState) {
        return;
      }
      if (nextPageSize > totalStudentCountState) {
        setCurrentPageSizeState(totalStudentCountState);
        getSubjectTeacherApiCall({ pageSize: totalStudentCountState });
      } else {
        setCurrentPageSizeState(nextPageSize);
        getSubjectTeacherApiCall({ pageSize: nextPageSize });
      }
      setIsLoadingState(true)
    }
  }
  const handleSubmit = () => {
    const { timeTableInfo } = timeTableDetails;

    const payload = {
      branchId,
      timeTableName: timeTableInfo.timeTableName,
      timeTableType: timeTableInfo.timeTableType,
      academicYearId: timeTableInfo.academicYearId,
      branchCurriculumId: timeTableInfo.curriculumId,
      branchClassId: timeTableInfo.classId,
      sectionId: timeTableInfo.sectionId,
      startDate: timeTableInfo.startDate,
      endDate: timeTableInfo.endDate,
      durationOfPeriod: timeTableInfo.durationOfPeriods,
      firstPeriodStartsAt: convertToFullTimeFormat(timeTableInfo.firstPeriodStartAt),
      daysWeeks: timeTableInfo.periodDaysList.map((day) => (
        {
          weekId: day.weekId,
          dayOfTheWeek: day.name
        }
      )),
      breaks: timeTableInfo.breaks.map((item) => ({
        breakName: item.breakName || "",
        breakType: item.breakType || "",
        startTime: convertToFullTimeFormat(item.startTime) || "",
        endTime: convertToFullTimeFormat(item.endTime) || "",
      })),
      periods: timeTableInfo.periodPerDayList.map((item) => ({
        periodName: item.periodName || "",
        periodType: item.periodType || "",
        startTime: convertToFullTimeFormat(item.periodStartTime) || "",
        endTime: convertToFullTimeFormat(item.periodEndTime) || "",
      })),
      dayWeek: Object.fromEntries(
        timeTable.map((item) => {
          const weekKey = item.periods.find((period) => !period.isBreak)?.weekId;
          const periods = item.periods
            .filter((period) => !period.isBreak)
            .map((period) => ({
              periodId: period.periodName || "",
              subjectId: period.periodSubjectId || "",
              teacherId: period.periodTeacherId || "",
            }));
          return [weekKey, periods];
        })
      )
    }
    dispatch(saveTimetableAct(generateActionPayload("save_timetable", undefined, payload)));
  }

  function resetState() {
    setTotalStudentCountState(0);
    setCurrentPageSizeState(10);
    dispatch(resetSubjectsTeacherAct(undefined));
  }

  useEffect(() => {
    if (branchId) {
      setCurrentPageSizeState(10);
      getSubjectTeacherApiCall({ pageSize: 10 });
      resetState();
    } else {
      dispatch(resetSubjectsTeacherAct(undefined));
      resetState();
    }
  }, [branchId]);


  return (
    <>
      <div className="assign-period-wise-subject">
        <div className="tw-shadow-none tw-mb-0 tw-bg-white tw-rounded-lg">
          <div className="tw-p-0 tw-select-none">
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
              <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-3">
                <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                  <div className="tw-bg-white tw-rounded-lg tw-border tw-shadow-none">
                    <div className="tw-px-4 tw-py-3 tw-border-b">
                      <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">Subjects</h4>
                    </div>

                    <div className="tw-p-4">
                      <div className="search-box">
                        <TextInput
                          name="searchString"
                          formgroupClassName="tw-mb-3"
                          placeHolder="Search..."
                          value={timeTableDetailsFormik.values.searchString}
                          onChange={filterHandler}
                          labelText="Subject"
                          floatingLabel
                        />
                        <i className="ri-search-line tw-absolute tw-left-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400"></i>
                      </div>
                      <div
                        style={{ zIndex: "1", height: "418px", overflowY: "auto", overflowX: "hidden" }}
                        onScroll={handleScroll}
                      >
                        <SubjectsList
                          activeDragSubject={activeDragSubject}
                          subjects={subjectsList}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="tw-col-span-12 lg:tw-col-span-9 xl:tw-col-span-10">
                  <CreateTimeTableGrid
                    timeTable={timeTable}
                    setTimeTable={setTimeTable}
                    periodsList={periodsList}
                    setSelectedCell={setSelectedCell}
                    selectedCell={selectedCell}
                    getEmployees={getEmployees}
                  />
                </div>
              </div>
            </DndContext>

            <div className="tw-mt-4 tw-gap-3 tw-flex tw-items-center tw-justify-end tw-px-3">
              <Button
                variant="previous"
                onClick={handlePrevious}
              >
                Previous
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </div>
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

export default AssignPeriodWiseSubject;

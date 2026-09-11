import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import {
  InputCheckbox,
  SelectInput,
  TextInput,
  TimeInput,
} from "../../../../Components/Common";
import { useEffect, useRef } from "react";
import { numberOfPeriods, numberOfPeriodsDuration, periodType, timeTableType } from "./helper";
import { nanoid } from "nanoid";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import { Label } from "reactstrap";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { resetSectionListAct } from "../../../../store/academic/classroomManagment/classroommanagmentslice";
import { getSectionList } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { addMinutes, format, isWithinInterval, parse } from "date-fns";
import { getBreaksAct, getBreaksTypeAct, getSubjectsTeacherAct } from "../../../../store/academic/timetableManagment/timetableManagmentactions";
import { setBreaksAct } from "../../../../store/academic/timetableManagment/timetableManagmentslice";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowReloadHorizontalIcon } from "@hugeicons-pro/core-stroke-standard";
import Button from "../../../../Components/Common/Button";

const initialValues: any = {
  timeTableName: "",
  timeTableType: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  startDate: "",
  endDate: "",
  periodDay: false,
  periodsPerDay: "1",
  durationOfPeriods: "",
  firstPeriodStartAt: "",
  noOfBreaks: "1",
  periodPerDayList: [
    {
      periodName: "",
      periodType: "",
      periodStartTime: "",
      periodEndTime: "",
      periodId: nanoid(),
    },
  ],
  breaks: [
    {
      breakName: "",
      breakType: "",
      startTime: "",
      endTime: "",
      breakId: nanoid(),
    },
  ],
  periodDaysList: [],
};

const validationSchema = Yup.object().shape({
  timeTableName: Yup.string().required("Time Table Name is required"),
  timeTableType: Yup.string().required("Time Table Type is required"),
  curriculumId: Yup.string().required("Curriculum is required"),
  classId: Yup.string().required("Class is required"),
  sectionId: Yup.string().required("Section is required"),
  periodsPerDay: Yup.string().required("Periods per day is required"),
  durationOfPeriods: Yup.string().required("Duration of Periods is required"),
  firstPeriodStartAt: Yup.string().required("First Period Start Time is required"),
  startDate: Yup.string().required("Start Date is required"),
  endDate: Yup.string()
    .required("End Date is required")
    .test("is-after-start", "End date must be after start date", function (value) {
      if (!value) return false;
      const { startDate } = this.parent;
      return new Date(value) > new Date(startDate);
    }),

});

const TimeTableDetails = ({ updateStepHndlr, timeTableDetails }) => {
  const formikPeriodArrayHelpers = useRef<ArrayHelpers | null>(null);
  const formikBreakArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();

  const {
    academicYearListResp,
    getWeeksResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    branchClassResp,
    sectionListResp,
    brchCurriculumResp,
    getBreaksResp,
    getBreaksTypeResp
  } = useAppSelector(
    ({ timeTableManagement, appData, instAcademics, branchAcademics, classroomManagmentInfo }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      getWeeksResp: timeTableManagement.getWeeksResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getBreaksResp: timeTableManagement.getBreaksResp,
      getBreaksTypeResp: timeTableManagement.getBreaksTypeResp,

    }),
    shallowEqual
  );

  const timeTableDetailsFormik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
    },
  });

  useEffect(() => {
    if (timeTableDetails.timeTableInfo) {
      timeTableDetailsFormik.setValues(timeTableDetails.timeTableInfo);
    }
  }, [timeTableDetails])

  const getBreaksTypeApiCall = (otherProps?: any) => {
    const payload = {
      ...otherProps
    }
    dispatch(getBreaksTypeAct(generateActionPayload("get_breaks_type", undefined, payload)));
  }

  useEffect(() => {
    if (getBreaksResp?.data && getBreaksResp.data.length > 0) {
      const breakDetails = getBreaksResp.data[0]?.detailsResponseDtos || [];

      if (breakDetails.length > 0) {
        const formattedBreaks = breakDetails.map(breakItem => ({
          breakName: breakItem.breakName || "",
          breakType: breakItem.breakType || "",
          startTime: breakItem.startTime ? breakItem.startTime.substring(0, 5) : "",
          endTime: breakItem.endTime ? breakItem.endTime.substring(0, 5) : "",
          breakId: nanoid()
        }));

        timeTableDetailsFormik.setFieldValue("noOfBreaks", formattedBreaks.length);
        timeTableDetailsFormik.setFieldValue("breaks", formattedBreaks);
      }
    }
  }, [getBreaksResp]);

  function onChangeWorkingDay(event: React.ChangeEvent<HTMLInputElement>, index: number) {
    const { checked } = event.target;
    const updatedDays = [...timeTableDetailsFormik.values.periodDaysList];

    updatedDays[index] = {
      ...updatedDays[index],
      checked,
    };

    timeTableDetailsFormik.setFieldValue("periodDaysList", updatedDays);
  }

  function addNewBreakItem(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (formikBreakArrayHelpers.current) {
      formikBreakArrayHelpers.current.push({
        breakName: "",
        breakType: "",
        startTime: "",
        endTime: "",
        breakId: nanoid(),
      });
    }
  }

  const getBreaksApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: timeTableDetailsFormik.values.academicYearId,
      curriculumId: timeTableDetailsFormik.values.curriculumId,
      classId: timeTableDetailsFormik.values.classId,
      searchString: timeTableDetailsFormik.values.searchString,
      ...otherProps
    }
    dispatch(getBreaksAct(generateActionPayload("get_breaks", undefined, payload)));
  }

  function removeBreakItem(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    const rowIndex = event.currentTarget.getAttribute("data-index");

    if (rowIndex !== undefined || rowIndex !== null) {
      formikBreakArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  function handlePeriodsPerChange(value: any) {
    const firstPeriodStart = value ? parse(value, "HH:mm", new Date()) : null;
    const duration = Number(timeTableDetailsFormik.values.durationOfPeriods) || 0;
    const periodsPerDay = Number(timeTableDetailsFormik.values.periodsPerDay) || 0;
    const breaks = timeTableDetailsFormik.values.breaks || [];

    if (!firstPeriodStart || !duration || !periodsPerDay) return;

    let updatedPeriodPerDay: any[] = [];
    let currentTime = firstPeriodStart;

    for (let i = 0; updatedPeriodPerDay.length < periodsPerDay; i++) {
      let periodStartTime = currentTime;
      let periodEndTime = addMinutes(currentTime, duration);

      if (breaks && breaks.length > 0) {
        breaks.forEach((breakObj: any) => {
          const breakStartTime = parse(breakObj.startTime, "HH:mm", new Date());
          const breakEndTime = parse(breakObj.endTime, "HH:mm", new Date());

          const periodOverlapsBreak = (periodStartTime < breakEndTime && periodEndTime > breakStartTime);

          if (periodOverlapsBreak) {
            periodStartTime = addMinutes(breakEndTime, 0);
            periodEndTime = addMinutes(breakEndTime, duration);
          }
        });
      }

      updatedPeriodPerDay.push({
        periodName: `P${i + 1}`,
        periodStartTime: format(periodStartTime, "HH:mm"),
        periodEndTime: format(periodEndTime, "HH:mm"),
        periodId: nanoid(),
      });

      currentTime = periodEndTime;
    }

    timeTableDetailsFormik.setValues((prev: any) => ({
      ...prev,
      firstPeriodStartAt: value,
      periodPerDayList: updatedPeriodPerDay,
    }));
  }

  function handleNoOfBreaksChange(value: number) {
    const existingBreaks = timeTableDetailsFormik.values.breaks || [];

    const updateBreaksList: any[] = Array.from({ length: value }, (_, i) => {
      const existingBreak = existingBreaks[i] || {};

      return {
        breakName: existingBreak.breakName || "",
        breakType: existingBreak.breakType || "",
        startTime: existingBreak.startTime || "",
        endTime: existingBreak.endTime || "",
        breakId: nanoid(),
      };
    });

    timeTableDetailsFormik.setValues((prev: any) => ({
      ...prev,
      noOfBreaks: value,
      breaks: updateBreaksList,
    }));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { instituteId, branchId: branchId, academicYearId: timeTableDetailsFormik.values.academicYearId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    if (payload1.academicYearId) {
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      curriculumId: timeTableDetailsFormik.values.curriculumId,
      academicYearId: timeTableDetailsFormik.values.academicYearId,
      sortBy: "classSequence",
      orderBy: "asc",
      pageNo: 0,
      pageSize: 100,
      ...otherProps
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getSectionListResp = (otherProps?: any) => {
    let payload = { branchClassId: timeTableDetailsFormik.values.classId || null, masterAcademicYearId: timeTableDetailsFormik.values.academicYearId, curriculumId: timeTableDetailsFormik.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  }

  const getSubjectTeacherApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      curriculumId: timeTableDetailsFormik.values.curriculumId,
      academicYearId: timeTableDetailsFormik.values.academicYearId,
      classId: timeTableDetailsFormik.values.classId,
      sectionId: timeTableDetailsFormik.values.sectionId,
      ...otherProps
    };
    if (payload.curriculumId && payload.academicYearId && payload.classId && payload.sectionId) {
      dispatch(getSubjectsTeacherAct(generateActionPayload("get_subjects_teacher", undefined, payload)));
    }
  }

  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    getCurriculumApiCall({ academicYearId: yearId });
    timeTableDetailsFormik.setFieldValue("academicYearId", yearId);
  }, [academicYearListResp]);

  useEffect(() => {
    if (getWeeksResp?.daysInWeekDtos && !timeTableDetails.timeTableInfo) {
      const updatedPeriodDays = getWeeksResp.daysInWeekDtos.map((day: any) => ({
        ...day,
        day: day.shortName,
        checked: true,
      }));
      timeTableDetailsFormik.setFieldValue("periodDaysList", updatedPeriodDays);
    }
  }, [getWeeksResp]);

  useEffect(() => {
    getBreaksTypeApiCall();
    return () => {
      dispatch(setBreaksAct(undefined));
    }
  }, []);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'curriculumId') {
      timeTableDetailsFormik.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", sectionId: "", }));
      dispatch(resetSectionListAct(undefined))

      if (!value) {
        dispatch(resetBrchClassAct(undefined))
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: timeTableDetailsFormik.values.academicYearId });
      }
    }
    else if (name === 'classId') {
      timeTableDetailsFormik.setValues((prev: any) => ({ ...prev, [name]: value, sectionId: "" }));
      getBreaksApiCall({ classId: value });
      if (!value) {
        dispatch(resetSectionListAct(undefined))
      } else {
        getSectionListResp({ branchClassId: value })
      }
    }
    else if (name === 'sectionId') {
      timeTableDetailsFormik.setValues((prev: any) => ({ ...prev, [name]: value }));
      getSubjectTeacherApiCall({ sectionId: value });
    }
    else {
      timeTableDetailsFormik.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      timeTableDetailsFormik.setValues((prev: any) => ({ ...prev, startDate, endDate }));

    }
  }

  const handleNext = (event: any) => {
    if (Object.keys(timeTableDetailsFormik.errors).length === 0) {
      updateStepHndlr("assign-period-wise-subject", timeTableDetailsFormik.values, "timeTableInfo");
    }
    else {
      timeTableDetailsFormik.handleSubmit(event);
    }
  }
  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = branchClassResp || {};

  return (
    <div className="time-table-details-container">
      <div className="tw-hidden">
        <div className="tw-pb-2 tw-border-b">
          <h4 className="tw-mb-0 tw-text-base tw-font-bold tw-block">Time Table Details</h4>
        </div>
      </div>

      <form className="tw-mt-3">
        <div className="tw-grid tw-grid-cols-12 tw-w-full tw-mx-auto tw-items-center tw-mb-4 tw-px-2 tw-gap-4">
          <div className="tw-col-span-12 lg:tw-col-span-6">
            <TextInput
              name="timeTableName"
              labelText="Time Table Name"
              value={timeTableDetailsFormik.values.timeTableName}
              onChange={timeTableDetailsFormik.handleChange}
              labelClass="required"
              invalid={(timeTableDetailsFormik.touched.timeTableName && timeTableDetailsFormik.errors.timeTableName) ? true : false}
              error={(timeTableDetailsFormik.touched.timeTableName && timeTableDetailsFormik.errors.timeTableName) ? timeTableDetailsFormik.errors.timeTableName : ""}
            ></TextInput>
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-6">
            <SelectInput
              name="timeTableType"
              labelText="Time Table Type"
              value={timeTableDetailsFormik.values.timeTableType}
              menuItems={timeTableType}
              onChange={timeTableDetailsFormik.handleChange}
              valueKey="id"
              textKey="name"
              labelClass="required"
              invalid={(timeTableDetailsFormik.touched.timeTableType && timeTableDetailsFormik.errors.timeTableType) ? true : false}
              error={(timeTableDetailsFormik.touched.timeTableType && timeTableDetailsFormik.errors.timeTableType) ? timeTableDetailsFormik.errors.timeTableType : ""}
            ></SelectInput>
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-6">
            <SelectInput
              name="curriculumId"
              labelText="Curriculum"
              value={timeTableDetailsFormik.values.curriculumId}
              menuItems={curriculumTypes}
              onChange={filterHandler}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              labelClass="required"
              invalid={(timeTableDetailsFormik.touched.curriculumId && timeTableDetailsFormik.errors.curriculumId) ? true : false}
              error={(timeTableDetailsFormik.touched.curriculumId && timeTableDetailsFormik.errors.curriculumId) ? timeTableDetailsFormik.errors.curriculumId : ""}
            ></SelectInput>
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-6">
            <SelectInput
              name="classId"
              labelText="Class"
              value={timeTableDetailsFormik.values.classId}
              menuItems={classTypes}
              onChange={filterHandler}
              valueKey="id"
              textKey="shortName"
              labelClass="required"
              invalid={(timeTableDetailsFormik.touched.classId && timeTableDetailsFormik.errors.classId) ? true : false}
              error={(timeTableDetailsFormik.touched.classId && timeTableDetailsFormik.errors.classId) ? timeTableDetailsFormik.errors.classId : ""}
            ></SelectInput>
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-6">
            <SelectInput
              name="sectionId"
              labelText="Section"
              value={timeTableDetailsFormik.values.sectionId}
              menuItems={sectionListResp?.data}
              onChange={filterHandler}
              valueKey="sectionId"
              textKey="sectionName"
              labelClass="required"
              invalid={(timeTableDetailsFormik.touched.sectionId && timeTableDetailsFormik.errors.sectionId) ? true : false}
              error={(timeTableDetailsFormik.touched.sectionId && timeTableDetailsFormik.errors.sectionId) ? timeTableDetailsFormik.errors.sectionId : ""}
            ></SelectInput>
          </div>
          <div className="tw-col-span-12 lg:tw-col-span-6">
            <CustomDatePicker
              name="dateRange"
              startDate={timeTableDetailsFormik.values.startDate}
              endDate={timeTableDetailsFormik.values.endDate}
              onChange={handleDateChange}
              placeholder="Select a Date Range"
              monthsShown={2}
              formgroupClassName="tw-mb-3"
              labelText="Date Range"
              invalid={
                (timeTableDetailsFormik.touched.startDate && timeTableDetailsFormik.errors.startDate) ||
                  (timeTableDetailsFormik.touched.endDate && timeTableDetailsFormik.errors.endDate)
                  ? true
                  : false
              }
              error={
                timeTableDetailsFormik.touched.startDate && timeTableDetailsFormik.errors.startDate
                  ? timeTableDetailsFormik.errors.startDate
                  : timeTableDetailsFormik.touched.endDate && timeTableDetailsFormik.errors.endDate
                    ? timeTableDetailsFormik.errors.endDate
                    : ""
              }
            ></CustomDatePicker>
          </div>

          <div className="tw-col-span-12 lg:tw-col-span-6">
            <div>
              <Label className="tw-text-xs" style={{ fontSize: "10px !important" }}>
                Working Days
              </Label>
            </div>
            <div className="tw-flex tw-gap-2">
              {timeTableDetailsFormik.values.periodDaysList.map((day: any, index: number) => (
                <div key={day.day}>
                  <InputCheckbox
                    name={`periodDaysList[${index}].weekId`}
                    formgroupClassName="tw-mb-0"
                    labelName={day.day}
                    value={day.checked}
                    onChange={(e) => onChangeWorkingDay(e, index)}
                  />
                </div>
              ))}
            </div>

          </div>
        </div>


        <div className="tw-mb-4 tw-px-3">
          <div className="tw-flex tw-items-center tw-mb-2">
            <h5 className="tw-mb-0 tw-mr-2">Breaks</h5>
            <Button
              variant="soft"
              onClick={addNewBreakItem}
              className="!tw-p-1"
            >
              <i className="ri-add-line tw-text-lg"></i>
            </Button>
          </div>

          <div>
            <div className="tw-grid tw-grid-cols-12 tw-mb-3 tw-gap-2 tw-py-2 tw-px-1 tw-bg-gray-100 tw-w-full tw-mx-auto tw-px-3">
              <div className="tw-col-span-3">
                <p className="tw-mb-0 tw-font-semibold">Break Type</p>
              </div>
              <div className="tw-col-span-3">
                <p className="tw-mb-0 tw-font-semibold">Break Name</p>
              </div>
              <div className="tw-col-span-3">
                <p className="tw-mb-0 tw-font-semibold">Start Time</p>
              </div>
              <div className="tw-col-span-3">
                <p className="tw-mb-0 tw-font-semibold">End Time</p>
              </div>
            </div>

            <FormikProvider value={timeTableDetailsFormik}>
              <FieldArray name="breaks">
                {(arrayHelpers: ArrayHelpers) => {
                  if (!formikBreakArrayHelpers.current) {
                    formikBreakArrayHelpers.current = arrayHelpers;
                  }
                  return (
                    <>
                      {timeTableDetailsFormik.values.breaks.length > 0 &&
                        timeTableDetailsFormik.values.breaks.map((item: any, index: number) => (
                          <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-mb-3 tw-items-center" key={index}>
                            <div className="tw-col-span-3">
                              <SelectInput
                                name={`breaks[${index}].breakType`}
                                value={item.breakType}
                                menuItems={getBreaksTypeResp?.data || []}
                                onChange={timeTableDetailsFormik.handleChange}
                                textKey="breakType"
                                valueKey="breakType"
                                formgroupClassName="tw-mb-0"
                              ></SelectInput>
                            </div>
                            <div className="tw-col-span-3">
                              <TextInput
                                name={`breaks[${index}].breakName`}
                                value={item.breakName}
                                onChange={timeTableDetailsFormik.handleChange}
                                inputClassName="tw-bg-gray-100"
                                placeHolder="Break"
                                formgroupClassName="tw-mb-0"
                              ></TextInput>
                            </div>
                            <div className="tw-col-span-3">
                              <TimeInput
                                name={`breaks[${index}].startTime`}
                                value={item.startTime}
                                onChange={timeTableDetailsFormik.handleChange}
                                inputClassName="tw-bg-gray-100"
                                formgroupClassName="tw-mb-0"
                              ></TimeInput>
                            </div>
                            <div className="tw-col-span-2">
                              <TimeInput
                                name={`breaks[${index}].endTime`}
                                value={item.endTime}
                                onChange={timeTableDetailsFormik.handleChange}
                                inputClassName="tw-bg-gray-100"
                                formgroupClassName="tw-mb-0"
                              ></TimeInput>
                            </div>
                            <div className="tw-col-span-1 tw-flex tw-items-center tw-justify-center">
                              {index !== 0 && (
                                <Button
                                  type="button"
                                  data-index={index}
                                  variant="wrong"
                                  onClick={removeBreakItem}
                                >
                                  <i className="ri-delete-bin-5-fill " style={{ fontSize: "16px" }}></i>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                    </>
                  );
                }}
              </FieldArray>
            </FormikProvider>
          </div>
        </div>

        <div className="tw-mb-4 tw-px-3">
          <div className="tw-flex tw-items-center tw-mb-2">
            <h5 className="tw-mb-0 tw-mr-2">Periods</h5>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-my-2 tw-p-2 tw-bg-gray-100 tw-w-full tw-mx-auto">
            <div className="tw-col-span-12 lg:tw-col-span-3">
              <SelectInput
                name="periodsPerDay"
                labelText="Periods Per Day"
                value={timeTableDetailsFormik.values.periodsPerDay}
                menuItems={numberOfPeriods}
                onChange={timeTableDetailsFormik.handleChange}
                valueKey="id"
                textKey="name"
                labelClass="required"
                invalid={(timeTableDetailsFormik.touched.periodsPerDay && timeTableDetailsFormik.errors.periodsPerDay) ? true : false}
                error={(timeTableDetailsFormik.touched.periodsPerDay && timeTableDetailsFormik.errors.periodsPerDay) ? timeTableDetailsFormik.errors.periodsPerDay : ""}
              ></SelectInput>
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-3">
              <SelectInput
                name="durationOfPeriods"
                labelText="Duration of Periods"
                value={timeTableDetailsFormik.values.durationOfPeriods}
                menuItems={numberOfPeriodsDuration}
                onChange={timeTableDetailsFormik.handleChange}
                valueKey="id"
                textKey="name"
                labelClass="required"
                invalid={(timeTableDetailsFormik.touched.durationOfPeriods && timeTableDetailsFormik.errors.durationOfPeriods) ? true : false}
                error={(timeTableDetailsFormik.touched.durationOfPeriods && timeTableDetailsFormik.errors.durationOfPeriods) ? timeTableDetailsFormik.errors.durationOfPeriods : ""}
              ></SelectInput>
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-3">
              <div className="tw-relative">
                <TimeInput
                  name="firstPeriodStartAt"
                  labelText="First Period Starts At"
                  value={timeTableDetailsFormik.values.firstPeriodStartAt}
                  onChange={timeTableDetailsFormik.handleChange}
                  labelClass="required"
                  invalid={(timeTableDetailsFormik.touched.firstPeriodStartAt && timeTableDetailsFormik.errors.firstPeriodStartAt) ? true : false}
                  error={(timeTableDetailsFormik.touched.firstPeriodStartAt && timeTableDetailsFormik.errors.firstPeriodStartAt) ? timeTableDetailsFormik.errors.firstPeriodStartAt : ""}
                ></TimeInput>
              </div>
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-3 tw-flex tw-items-end tw-mb-3">
              <Button
                type="button"
                variant="info"
                onClick={() => handlePeriodsPerChange(timeTableDetailsFormik.values.firstPeriodStartAt)}
              >
                <HugeiconsIcon icon={ArrowReloadHorizontalIcon} size={18} className="tw-mr-2" />
                Update Periods
              </Button>
            </div>
          </div>

          <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-mb-3 tw-py-2 tw-bg-gray-100 tw-w-full tw-mx-auto tw-px-3">
            <div className="tw-col-span-3">
              <p className="tw-mb-0 tw-font-semibold">Period Type</p>
            </div>
            <div className="tw-col-span-3">
              <p className="tw-mb-0 tw-font-semibold">Period</p>
            </div>
            <div className="tw-col-span-3">
              <p className="tw-mb-0 tw-font-semibold">Start Time</p>
            </div>
            <div className="tw-col-span-3">
              <p className="tw-mb-0 tw-font-semibold">End Time</p>
            </div>
          </div>
          <FormikProvider value={timeTableDetailsFormik}>
            <FieldArray name="periodPerDayList">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikPeriodArrayHelpers.current) {
                  formikPeriodArrayHelpers.current = arrayHelpers;
                }
                return (
                  <>
                    {timeTableDetailsFormik.values.periodPerDayList.length > 0 &&
                      timeTableDetailsFormik.values.periodPerDayList.map(
                        (item: any, index: number) => (
                        <div className="tw-grid tw-grid-cols-12 tw-gap-2 tw-mb-3 tw-items-center" key={item.periodId}>
                          <div className="tw-col-span-3">
                            <SelectInput
                              name={`periodPerDayList[${index}].periodType`}
                              value={item.periodType}
                              menuItems={periodType}
                              onChange={timeTableDetailsFormik.handleChange}
                              valueKey="id"
                              textKey="name"
                              formgroupClassName="tw-mb-0"
                            ></SelectInput>
                          </div>
                          <div className="tw-col-span-3">
                            <TextInput
                              name={`periodPerDayList[${index}].periodName`}
                              value={`P${index + 1}`}
                              onChange={() => { }}
                              inputClassName="tw-bg-gray-100"
                              placeHolder="Period Name"
                              formgroupClassName="tw-mb-0"
                            ></TextInput>
                          </div>
                          <div className="tw-col-span-3">
                            <TimeInput
                              name={`periodPerDayList[${index}].periodStartTime`}
                              value={item.periodStartTime}
                              onChange={timeTableDetailsFormik.handleChange}
                              inputClassName="tw-bg-gray-100"
                              formgroupClassName="tw-mb-0"
                            ></TimeInput>
                          </div>
                          <div className="tw-col-span-3">
                            <TimeInput
                              name={`periodPerDayList[${index}].periodEndTime`}
                              value={item.periodEndTime}
                              onChange={timeTableDetailsFormik.handleChange}
                              inputClassName="tw-bg-gray-100"
                              formgroupClassName="tw-mb-0"
                            ></TimeInput>
                          </div>
                        </div>
                      ))}
                  </>
                );
              }}
            </FieldArray>
          </FormikProvider>
        </div>

        <div className="tw-flex tw-justify-end tw-px-3">
          <Button
            variant="primary"
            onClick={handleNext}
            type="submit"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TimeTableDetails;

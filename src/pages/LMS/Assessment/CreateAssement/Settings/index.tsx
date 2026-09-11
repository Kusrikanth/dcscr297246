import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MenuOptions } from "./helper";
import classnames from "classnames";
import ScheduleType from "./ScheduleType";
import AdvanceSettings from "./AdvanceSettings";
import { StepperFormContext, TABS_ACTIONS } from "../helper";
import ResultSettings from "./ResultSettings";
import GradesDistrubition from "./GradesDistrubition";
import Notifcations from "./Notifcations";
import Rules from "./Rules";
import { useFormik } from "formik";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { getAssignStudentsAssessmentByIdAct, getGlobalSettingsBranchIdAct, getGradesDistributionAct, getSettingsAssessmentIdAct, saveAssessmentSettingsStepAct } from "../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import * as Yup from "yup";
import { convertUTCToISTTime, Current_Date_YYYYMMDD, Current_time, getTimeFormat } from "../../../../../utility/dateutility";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Configuration01Icon } from '@hugeicons-pro/core-solid-standard';
import { AllBookmarkIcon, ArrowLeft03Icon, ArrowRight03Icon } from "@hugeicons-pro/core-stroke-standard";

const initialValues = {
  // Schedule Type
  startDate: Current_Date_YYYYMMDD,
  startTime: "",
  gracePeriod: "",
  gracePeriodEndTime: "",
  expiryDate: "",
  expiryTime: "",
  durationMinutes: "",

  // Advanced Settings
  marksPointsMode: "Auto",
  marksForCorrectAnswer: "",
  negativeMarking: false,
  negativeMarkingType: "FIXED",
  negativeMarks: "",
  passPercentage: "",
  shuffleQuestions: false,
  shuffleOptions: false,
  restrictAttempts: false,
  noOfAttempts: "",
  disableFinishButton: false,
  enableQuestionListView: false,
  hideSolutions: false,

  // Grades distribution
  gradesSettingDTOs: [
    {
      id: generateUniqueNumber(),
      grade: "",
      fromMarks: "",
      toMarks: "",
      remarks: "",
      result: "Fail",
      isDeleted: false,
    },
  ],

  // Notifications
  addedToExam: false,
  changedExamDate: false,
  examStarting: false,
  examEnding: false,
  examOngoing: false,
  missedExam: false,
  examResultsReady: false,
  preExamReminder: false,
  preExamReminderHours: "",

  // Rules / Security
  noMouseRightClick: false,
  fullScreenMode: false,
  noExtraScreens: false,
  noDevConsole: false,
  cursorMustStayInsideWindow: false,
  noSessionSwitch: false,
  cameraCapture: false,
  cameraRecording: false,
  disableRightClickCopyPaste: false,
  singleTabOnly: false,
  blockDevTools: false,
  preventSwitchingAppsTabs: false,
  noSecondMonitorAllowed: false,
  serverControlledTimerAutoSubmit: false,
  autoSaveAnswersPeriodically: false,
  logWarnings: false,
  // Result Settings
  showCorrectAnswersAfterSubmission: false,
  resultReleaseMode: "INSTANTLY",
  resultStartDate: "",
  resultStartTime: "",
  releaseDatetime: "",
  // User info
  createdBy: "",
  modifiedBy: "",
};

const validationSchema = Yup.object().shape({
  startDate: Yup.string().required("Start date is required"),


  // startTime: Yup.string()
  //   .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Start time is required")
  //   .required("Start time is required"),

  // .test("not-in-past", "Start time cannot be in the past", function (value) {
  //   const { startDate } = this.parent;
  //   if (!startDate || !value) return true;

  //   const today = format(new Date(), "yyyy-MM-dd");
  //   if (startDate === today) {
  //     const start = toDateTime(startDate, value);
  //     const now = new Date();
  //     return start.getTime() >= now.getTime() - 60 * 1000;
  //   }
  //   return true;
  // }),


  startTime: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "Start time is required")
    .required("Start time is required"),

  expiryTime: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, "End time is required")
    .required("End time is required"),
  // .test("after-start", "End time must be after start time", function (value) {
  //   const { startDate, startTime } = this.parent;
  //   if (!startDate || !startTime || !value) return true;

  //   const start = toDateTime(startDate, startTime);
  //   const end = toDateTime(startDate, value);

  //   return end > start;
  // }),
});

interface SettingsProps {
  id?: string;
  previousStepId?: string;
}

const Settings = (props: SettingsProps) => {
  const history = useHistory();

  const [activeMenuIdx, setActiveMenuIdx] = useState(0);
  const activeMenuId = MenuOptions[activeMenuIdx]?.id || null;
  const globalSettingsFetched = useRef(false);
  const [shouldUseGlobalSettings, setShouldUseGlobalSettings] = useState(false);

  const { desiredTabDetailState } = useContext<any>(StepperFormContext);
  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    saveBasicAssessmentResp,
    getSettingsByAssessmentIdResp,
    getGlobalSettingsBranchIdResp,
  } = useAppSelector(
    ({
      branchAcademics,
      appData,
      lmsAssessment,
    }) => ({
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      saveBasicAssessmentResp: lmsAssessment.saveBasicAssessmentResp,
      getSettingsByAssessmentIdResp: lmsAssessment.getSettingsByAssessmentIdResp,
      getGlobalSettingsBranchIdResp: lmsAssessment.getGlobalSettingsBranchIdResp,
    }),
    shallowEqual
  );

  const settingsFormik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload: any = {
        assessmentId: saveBasicAssessmentResp?.data,
        scheduleType: "FIXED",
        // Schedule settings
        startDate: values.startDate,
        startTime: values.startTime,
        expiryDate: values.startDate,
        expiryTime: values.expiryTime,
        durationMinutes: Number(values.durationMinutes) || 0,
        gracePeriod: Number(values.gracePeriod) || 0,
        gracePeriodEndTime: Number(values.gracePeriodEndTime) || 0,
        // Result settings

        // Advanced settings
        marksPointsMode: values.marksPointsMode,
        marksForCorrectAnswer: Number(values.marksForCorrectAnswer) || 0,
        negativeMarking: !!values.negativeMarking,
        negativeMarkingType: values.negativeMarkingType,
        negativeMarks: Number(values.negativeMarks) || 0,
        passPercentage: Number(values.passPercentage) || 0,
        shuffleQuestions: !!values.shuffleQuestions,
        shuffleOptions: !!values.shuffleOptions,
        restrictAttempts: !!values.restrictAttempts,
        noOfAttempts: Number(values.noOfAttempts) || 0,
        disableFinishButton: !!values.disableFinishButton,
        enableQuestionListView: !!values.enableQuestionListView,
        hideSolutions: !!values.hideSolutions,

        // Grades
        gradesSettingDTOs: values.gradesSettingDTOs.map((grade) => {
          const gradePayload: any = {
            grade: grade.grade,
            fromMarks: Number(grade.fromMarks),
            toMarks: Number(grade.toMarks),
            remarks: grade.remarks,
            result: grade.result,
          };

          // Add id if it exists (for existing records)
          if (grade.id && getSettingsByAssessmentIdResp?.gradesSettingDTOs?.some(apiItem => +apiItem.id === +grade.id)) {
            gradePayload.id = grade.id;
          }

          // Add isDeleted flag if item is marked as deleted
          if (grade.isDeleted) {
            gradePayload.isDeleted = true;
          }

          return gradePayload;
        }),

        // Notifications
        addedToExam: !!values.addedToExam,
        changedExamDate: !!values.changedExamDate,
        examStarting: !!values.examStarting,
        examEnding: !!values.examEnding,
        examOngoing: !!values.examOngoing,
        missedExam: !!values.missedExam,
        examResultsReady: !!values.examResultsReady,
        preExamReminder: !!values.preExamReminder,
        preExamReminderHours: Number(values.preExamReminderHours) || 0,

        // Rules / Security
        fullScreenMode: !!values.fullScreenMode,
        disableRightClickCopyPaste: !!values.disableRightClickCopyPaste,
        singleTabOnly: !!values.singleTabOnly,
        blockDevTools: !!values.blockDevTools,
        cursorMustStayInsideWindow: !!values.cursorMustStayInsideWindow,
        preventSwitchingAppsTabs: !!values.preventSwitchingAppsTabs,
        noSecondMonitorAllowed: !!values.noSecondMonitorAllowed,
        serverControlledTimerAutoSubmit: !!values.serverControlledTimerAutoSubmit,
        autoSaveAnswersPeriodically: !!values.autoSaveAnswersPeriodically,
        logWarnings: !!values.logWarnings,

        // Result settings
        resultReleaseMode: values.resultReleaseMode,
        showCorrectAnswersAfterSubmission: !!values.showCorrectAnswersAfterSubmission,
        releaseDatetime: values.releaseDatetime || null,

        // User info
        createdBy: values.createdBy,
        modifiedBy: values.modifiedBy || null,
      };

      if (getSettingsByAssessmentIdResp) {
        payload.id = getSettingsByAssessmentIdResp?.id
      }

      dispatch(
        saveAssessmentSettingsStepAct(
          generateActionPayload("create_assessemnt_settings_step", undefined, payload)
        )
      );
    }
  });

  function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
      case "schedule-type":
        return <ScheduleType settingsFormik={settingsFormik} />;;
      case "advance-settings":
        return <AdvanceSettings settingsFormik={settingsFormik} />;;
      case "grades-distribution":
        return <GradesDistrubition settingsFormik={settingsFormik} />;;
      case "notifcations":
        return <Notifcations settingsFormik={settingsFormik} />;;
      case "rules":
        return <Rules settingsFormik={settingsFormik} />;;
      case "result-settings":
        return <ResultSettings settingsFormik={settingsFormik} />;;
      default:
        return null;
    }
  }

  const { submitCurrentFormCllbck } = useContext<any>(StepperFormContext);

  const nextSettingStepHndlr = async () => {
    const activeId = MenuOptions[activeMenuIdx]?.id;

    if (activeId === "schedule-type") {
      try {
        await validationSchema.validate(settingsFormik.values, { abortEarly: false });
      } catch (err: any) {
        const errors: Record<string, string> = {};
        err.inner.forEach((e: any) => {
          if (e.path) errors[e.path] = e.message;
        });
        settingsFormik.setErrors(errors);
        settingsFormik.setTouched(
          Object.keys(errors).reduce((acc: any, key) => {
            acc[key] = true;
            return acc;
          }, {})
        );
        return;
      }
    }

    if (activeMenuIdx < MenuOptions.length - 1) {
      setActiveMenuIdx(activeMenuIdx + 1);
    } else {
      submitCurrentFormCllbck("review", TABS_ACTIONS.PARTICULAR_TAB);
      settingsFormik.handleSubmit();
    }
  };

  // const prevSettingsStepHndlr = () => {
  //   if (activeMenuIdx > 0) {
  //     setActiveMenuIdx(activeMenuIdx - 1);
  //   } else {
  //     submitCurrentFormCllbck(["assign"], TABS_ACTIONS.PREVIOUS_TAB);
  //   }
  // };

  useEffect(() => {
    if (props.id) {
      dispatch(
        getSettingsAssessmentIdAct(
          generateActionPayload("get_global_settings_assessment_id", {
            assessmentId: props.id,
          })
        )
      );
    }
  }, [props.id])

  const prevSettingsStepHndlr = useCallback((e: any) => {
    if (activeMenuIdx > 0) {
      setActiveMenuIdx(activeMenuIdx - 1);
    } else {
      submitCurrentFormCllbck(["assign"], TABS_ACTIONS.PREVIOUS_TAB);
    }
    if (saveBasicAssessmentResp?.data) {
      dispatch(getAssignStudentsAssessmentByIdAct(generateActionPayload("get_assign_students_assessment_by_id", { id: saveBasicAssessmentResp?.data }, {})));
    }
  }, [submitCurrentFormCllbck, saveBasicAssessmentResp?.data, dispatch, setActiveMenuIdx, activeMenuIdx]);

  useEffect(() => {
    const activeId = MenuOptions[activeMenuIdx]?.id;
    const isComingFromAssign = props.previousStepId === "assign";

    if (
      activeId === "schedule-type" ||
      activeId === "advance-settings" ||
      activeId === "notifcations" ||
      activeId === "rules" ||
      activeId === "result-settings"
    ) {
      if (branchId && !getSettingsByAssessmentIdResp && isComingFromAssign && !globalSettingsFetched.current) {
        setShouldUseGlobalSettings(true);
        dispatch(
          getGlobalSettingsBranchIdAct(
            generateActionPayload("get_global_settings_branch_id", undefined, {
              branchId,
            })
          )
        );
        globalSettingsFetched.current = true;
      }
    } else if (activeId === "grades-distribution") {
      const payload = { branchId };
      if (branchId && !getSettingsByAssessmentIdResp?.gradesSettingDTOs) {
        dispatch(
          getGradesDistributionAct(
            generateActionPayload("get_grades_distribution", undefined, payload)
          )
        );
      }
    }
  }, [activeMenuIdx, branchId, props.previousStepId, getSettingsByAssessmentIdResp]);

  useEffect(() => {
    const prefillValues = (resp: any) => {
      const updates: any = {
        // Schedule Type
        startDate: resp.startDate || "",
        startTime: resp.startTime ? convertUTCToISTTime(resp.startTime) + ":00" : "",
        expiryTime: resp.expiryTime ? convertUTCToISTTime(resp.expiryTime) + ":00" : "",
        gracePeriod: resp.gracePeriod?.toString() || "",
        gracePeriodEndTime: resp.gracePeriodEndTime?.toString() || "",
        // Result Settings
        resultReleaseMode: resp.resultReleaseMode || "INSTANTLY",
        resultStartDate: resp.resultStartDate || "",
        resultStartTime: resp.resultStartTime || "",
        showCorrectAnswersAfterSubmission: resp.showCorrectAnswersAfterSubmission ?? false,
        releaseDatetime: "",
        durationMinutes: resp.durationMinutes?.toString() || "",

        // Advanced Settings
        marksPointsMode: resp.marksPointsMode || "Auto",
        marksForCorrectAnswer: resp.marksForCorrectAnswer?.toString() || "",
        negativeMarking: resp.negativeMarking ?? false,
        negativeMarkingType: resp.negativeMarkingType || "FIXED",
        negativeMarks: resp.negativeMarks?.toString() || "",
        passPercentage: resp.passPercentage?.toString() || "",
        shuffleQuestions: resp.shuffleQuestions ?? false,
        shuffleOptions: resp.shuffleOptions ?? false,
        restrictAttempts: resp.restrictAttempts ?? false,
        noOfAttempts: resp.noOfAttempts?.toString() || "",
        disableFinishButton: resp.disableFinishButton ?? false,
        enableQuestionListView: resp.enableQuestionListView ?? false,
        hideSolutions: resp.hideSolutions ?? false,

        // Notifications
        addedToExam: resp.addedToExam ?? false,
        changedExamDate: resp.changedExamDate ?? false,
        examStarting: resp.examStarting ?? false,
        examEnding: resp.examEnding ?? false,
        examOngoing: resp.examOngoing ?? false,
        missedExam: resp.missedExam ?? false,
        examResultsReady: resp.examResultsReady ?? false,
        preExamReminder: resp.preExamReminder ?? false,
        preExamReminderHours: resp.preExamReminderHours?.toString() || "",

        // Rules
        fullScreenMode: resp.fullScreenMode ?? false,
        disableRightClickCopyPaste: resp.disableRightClickCopyPaste ?? false,
        singleTabOnly: resp.singleTabOnly ?? false,
        blockDevTools: resp.blockDevTools ?? false,
        cursorMustStayInsideWindow: resp.cursorMustStayInsideWindow ?? false,
        preventSwitchingAppsTabs: resp.preventSwitchingAppsTabs ?? false,
        noSecondMonitorAllowed: resp.noSecondMonitorAllowed ?? false,
        serverControlledTimerAutoSubmit: resp.serverControlledTimerAutoSubmit ?? false,
        autoSaveAnswersPeriodically: resp.autoSaveAnswersPeriodically ?? false,
        logWarnings: resp.logWarnings ?? false,
        gradesSettingDTOs: settingsFormik.values.gradesSettingDTOs,
      };
      if (resp.gradesSettingDTOs && resp.gradesSettingDTOs.length > 0) {
        const mappedGrades = resp.gradesSettingDTOs.map((item: any) => ({
          id: item.id,
          grade: item.grade || "",
          fromMarks: item.fromMarks?.toString() || "",
          toMarks: item.toMarks?.toString() || "",
          remarks: item.remarks?.toString() || "",
          result: item.result === "PASS" ? "Pass" : "Fail",
          isDeleted: false
        }));
        updates.gradesSettingDTOs = mappedGrades;
      }
      settingsFormik.setValues(prev => ({
        ...prev,
        ...updates,
      }));
    };
    const hasAssessmentSettingsData = getSettingsByAssessmentIdResp && (
      getSettingsByAssessmentIdResp.marksPointsMode ||
      getSettingsByAssessmentIdResp.negativeMarking !== null ||
      getSettingsByAssessmentIdResp.passPercentage ||
      getSettingsByAssessmentIdResp.durationMinutes
    );
    if (hasAssessmentSettingsData) {
      prefillValues(getSettingsByAssessmentIdResp);
    } else if (getGlobalSettingsBranchIdResp && shouldUseGlobalSettings) {
      prefillValues(getGlobalSettingsBranchIdResp);
    }
  }, [getGlobalSettingsBranchIdResp, getSettingsByAssessmentIdResp, shouldUseGlobalSettings]);

  return (
    <>
      <div className='card h-100 mb-0' style={{ borderRadius: "10px" }}>
        <div className='card-header' style={{
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          padding: "20px"
        }}>
          <div className='d-flex align-items-center' style={{ gap: "16px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#CBF3EF",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <HugeiconsIcon
                icon={Configuration01Icon}
                size={24}
                color="#0AB39C"
              />
            </div>
            <div className='d-grid'>
              <h4 className='mb-1' style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#333",
                lineHeight: "1.3"
              }}>
                Step 4: Configure Settings
              </h4>
              <span className='text-muted' style={{
                fontSize: "14px",
                color: "#6c757d",
                lineHeight: "1.4"
              }}>
                Define the rules and parameters for this assessment.
              </span>
            </div>
          </div>
        </div>
        <div className='card-body'>

          <div className='row px-3 lms'>
            <div className="row align-items-start master-setup-wrapper">
              <div className="col-3">
                <div
                  style={{ border: "1px solid #D9D9D9", borderRadius: "10px" }}
                >
                  <div className="card-body">
                    <ul className="left-menu-section py-2">
                      {MenuOptions.map((item) => {
                        const isActive = item.id === activeMenuId;
                        return (
                          <li
                            data-id={item.id}
                            key={item.id}
                            className={classnames(
                              "flex items-center cursor-pointer group",
                              { active: isActive }
                            )}
                          >
                            <img
                              src={item.icon}
                              alt={item.labelName}
                              className={classnames("menu-icon transition duration-200", {
                                "filter-green": isActive,
                                "filter-gray group-hover:filter-green": !isActive,
                              })}
                              style={{ width: "18px", height: "18px" }}
                            />
                            <span
                              className={classnames("ms-2 transition duration-200", {
                                "text-[#0AB39C] font-semibold": isActive,
                                "text-[#4B5563] group-hover:text-[#0AB39C]": !isActive,
                              })}
                            >
                              {item.labelName}
                            </span>
                          </li>
                        );
                      })}

                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-9">
                <div style={{ border: "1px solid #D9D9D9", borderRadius: "10px" }}>
                  {MenuOptions.map((item, idx) => {
                    const Component = getActiveMenuComponent(item.id);
                    return (
                      <div
                        key={item.id}
                        style={{ display: idx === activeMenuIdx ? "block" : "none" }}
                        className=" create-admin-assessment"
                      >
                        {Component}
                      </div>
                    );
                  })}
                </div>
                <div className="row my-3">
                  <div className="col-12 d-flex justify-content-between mt-1">
                    <div>
                      <button
                        type="button"
                        style={{ borderRadius: "8px" }}
                        className="btn btn-outline-primary mx-2 px-4 py-2 d-flex align-items-center"
                        onClick={prevSettingsStepHndlr}
                      >
                        <HugeiconsIcon
                          icon={ArrowLeft03Icon}
                          size={20}
                          strokeWidth={1.5}
                          style={{ color: "currentColor" }}
                          className="me-2"
                        />
                        Previous
                      </button>
                    </div>
                    <div className=''>
                      <button type='button' className="btn btn-light px-4 py-2 h-100" onClick={() => { history.push("/assessment-list") }} style={{ borderRadius: "8px" }}>Cancel</button>
                      <button
                        type="button"
                        className="btn btn-success px-4 py-2 ms-3"
                        style={{ borderRadius: "8px" }}
                        onClick={
                          activeMenuId === "result-settings" 
                            ? () => settingsFormik.handleSubmit()
                            : nextSettingStepHndlr
                        }
                      >
                        {activeMenuIdx === 5 ? "Save & Next" : "Next"}
                        <HugeiconsIcon
                          icon={ArrowRight03Icon}
                          size={24}
                          color="#fafafa"
                          className="ms-1"
                        />
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
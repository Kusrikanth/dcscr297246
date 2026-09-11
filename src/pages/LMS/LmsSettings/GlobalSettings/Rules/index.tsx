import React, { useEffect, useRef } from 'react'
import { useFormik } from 'formik'
import { SelectInput, Switch } from '../../../../../Components/Common'
import { generateActionPayload } from '../../../../../utility/reduxutility';
import { getGlobalSettingsBranchIdAct, saveGlobalSettingsAct } from '../../../../../store/lms/lmsAssessment/lmsAssessmentaction';
import { toast } from 'react-toastify';
import { shallowEqual } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../../../../hooks/storehook';

const initialValues = {
  fullScreenMode: true,
  disableRightClickCopyPaste: true,
  singleTabOnly: true,
  blockDevTools: true,
  cursorMustStayInsideWindow: true,
  preventSwitchingAppsTabs: true,
  noSecondMonitorAllowed: true,
  serverControlledTimerAutoSubmit: true,
  autoSaveAnswersPeriodically: true,
  logWarnings: true,
};

const rulessData = [
  {
    id: "fullScreenMode",
    title: "Fullscreen Mode Required",
    status: true,
    description: "Exam must run in fullscreen. Exiting fullscreen shows a warning and may pause the test.",
    icon: "ri-mouse-line"
  },
  {
    id: "disableRightClickCopyPaste",
    title: "Disable Right-Click & Copy-Paste",
    status: true,
    icon: "ri-fullscreen-line",
    description: "Prevents copying questions, pasting answers, or opening context menus."
  },
  {
    id: "singleTabOnly",
    title: "Single Tab Only (No Reload / Back)",
    status: true,
    icon: "ri-device-line",
    description: "Students cannot open multiple tabs, reload, or use the back button."
  },
  {
    id: "blockDevTools",
    title: "Block Dev Tools (F12 / Inspect Element)",
    status: true,
    icon: "ri-terminal-line",
    description: "Stops students from using developer tools to view or change exam content."
  },
  {
    id: "cursorMustStayInsideWindow",
    title: "Cursor Must Stay Inside Window",
    status: true,
    icon: "ri-cursor-line",
    description: "If the mouse leaves the exam window, a warning is issued."
  },
  {
    id: "preventSwitchingAppsTabs",
    title: "Prevent Switching Apps / Tabs",
    status: true,
    icon: "ri-refresh-line",
    description: "Detects Alt+Tab, Cmd+Tab, or switching to another app/tab. Logs a warning."
  },
  {
    id: "noSecondMonitorAllowed",
    title: "No Second Monitor Allowed",
    status: true,
    icon: "ri-camera-line",
    description: "Detects external monitors. Students must use only one screen."
  },
  {
    id: "serverControlledTimerAutoSubmit",
    title: "Server-Controlled Timer + Auto-Submit",
    status: true,
    icon: "ri-video-line",
    description: "Timer is fixed by server. Exam auto-submits when time ends."
  },
  {
    id: "autoSaveAnswersPeriodically",
    title: "Auto-Save Answers Periodically",
    status: true,
    icon: "ri-save-3-line",
    description: "All answers are auto-saved every few seconds to prevent data loss."
  },
  {
    id: "logWarnings",
    title: "Log Warnings (Fullscreen Exit, Switch, Disconnect)",
    status: true,
    icon: "ri-file-list-3-line",
    description: "Each violation (exit fullscreen, window switch, disconnect) is logged with timestamp for teacher review."
  }
];

const Rules = () => {

  const dispatch = useAppDispatch();
  const getQuestionsNoFormatApiCall = () => {
    let payload = {
      branchId,
      marksPointsMode: getGlobalSettingsBranchIdResp.marksPointsMode,
      marksForCorrectAnswer: getGlobalSettingsBranchIdResp.marksForCorrectAnswer,
      negativeMarking: getGlobalSettingsBranchIdResp.negativeMarking,
      negativeMarkingType: getGlobalSettingsBranchIdResp.negativeMarkingType,
      negativeMarks: getGlobalSettingsBranchIdResp.negativeMarks,
      passPercentage: getGlobalSettingsBranchIdResp.passPercentage,
      shuffleQuestions: getGlobalSettingsBranchIdResp.shuffleQuestions,
      shuffleOptions: getGlobalSettingsBranchIdResp.shuffleOptions,
      restrictAttempts: getGlobalSettingsBranchIdResp.restrictAttempts,
      noOfAttempts: getGlobalSettingsBranchIdResp.noOfAttempts,
      disableFinishButton: getGlobalSettingsBranchIdResp.disableFinishButton,
      enableQuestionListView: getGlobalSettingsBranchIdResp.enableQuestionListView,
      hideSolutions: getGlobalSettingsBranchIdResp.hideSolutions,
      addedToExam: getGlobalSettingsBranchIdResp.addedToExam,
      changedExamDate: getGlobalSettingsBranchIdResp.changedExamDate,
      examStarting: getGlobalSettingsBranchIdResp.examStarting,
      examEnding: getGlobalSettingsBranchIdResp.examEnding,
      examOngoing: getGlobalSettingsBranchIdResp.examOngoing,
      missedExam: getGlobalSettingsBranchIdResp.missedExam,
      examResultsReady: getGlobalSettingsBranchIdResp.examResultsReady,
      preExamReminder: getGlobalSettingsBranchIdResp.preExamReminder,
      nofDays: getGlobalSettingsBranchIdResp.nofDays,
      resultReleaseMode: getGlobalSettingsBranchIdResp.resultReleaseMode,
      resultStartDate: getGlobalSettingsBranchIdResp.resultStartDate,
      resultStartTime: getGlobalSettingsBranchIdResp.resultStartTime,
      showCorrectAnswersAfterSubmission: getGlobalSettingsBranchIdResp.showCorrectAnswersAfterSubmission,
    };
    dispatch(getGlobalSettingsBranchIdAct(generateActionPayload("get_global_settings_branch_id", undefined, payload)));
  };

  useEffect(() => {
    getQuestionsNoFormatApiCall();
  }, [])

  const { currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    saveGlobalSettingsResp,
    getGlobalSettingsBranchIdResp,
    lmsAssessmentErrorAct
  } = useAppSelector(
    ({
      appData, lmsAssessment,
    }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      saveGlobalSettingsResp: lmsAssessment.saveGlobalSettingsResp,
      getGlobalSettingsBranchIdResp: lmsAssessment.getGlobalSettingsBranchIdResp,
      lmsAssessmentErrorAct: lmsAssessment.lmsAssessmentErrorAct,
    }),
    shallowEqual
  );

  const instituteRespRef = useRef<any>({
    prevSaveGlobalSettingsResp: saveGlobalSettingsResp,
    prevLmsAssessmentErrorAct: lmsAssessmentErrorAct,
  });

  useEffect(() => {
    const { prevLmsAssessmentErrorAct, prevSaveGlobalSettingsResp, prevSaveAssessemntSettingsStepResp } = instituteRespRef.current;
    if (lmsAssessmentErrorAct && prevLmsAssessmentErrorAct !== lmsAssessmentErrorAct) {
      toast.error(lmsAssessmentErrorAct.details || "Something went wrong.");
    }
    else if (saveGlobalSettingsResp && prevSaveGlobalSettingsResp !== saveGlobalSettingsResp) {
      toast.success("Advance Settings saved successfully.");
    }
    instituteRespRef.current.prevSaveGlobalSettingsResp = saveGlobalSettingsResp;
    instituteRespRef.current.prevLmsAssessmentErrorAct = lmsAssessmentErrorAct;
  }, [lmsAssessmentErrorAct, saveGlobalSettingsResp]);

  useEffect(() => {
    if (getGlobalSettingsBranchIdResp) {
      settingsFormik.setValues({
        fullScreenMode: getGlobalSettingsBranchIdResp.fullScreenMode ?? false,
        disableRightClickCopyPaste: getGlobalSettingsBranchIdResp.disableRightClickCopyPaste ?? false,
        singleTabOnly: getGlobalSettingsBranchIdResp.singleTabOnly ?? false,
        blockDevTools: getGlobalSettingsBranchIdResp.blockDevTools ?? false,
        cursorMustStayInsideWindow: getGlobalSettingsBranchIdResp.cursorMustStayInsideWindow ?? false,
        preventSwitchingAppsTabs: getGlobalSettingsBranchIdResp.preventSwitchingAppsTabs ?? false,
        noSecondMonitorAllowed: getGlobalSettingsBranchIdResp.noSecondMonitorAllowed ?? false,
        serverControlledTimerAutoSubmit: getGlobalSettingsBranchIdResp.serverControlledTimerAutoSubmit ?? false,
        autoSaveAnswersPeriodically: getGlobalSettingsBranchIdResp.autoSaveAnswersPeriodically ?? false,
        logWarnings: getGlobalSettingsBranchIdResp.logWarnings ?? false,
      });
    } else {
      settingsFormik.resetForm({ values: initialValues });
    }
  }, [getGlobalSettingsBranchIdResp]);

  const settingsFormik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const cleanedValues = Object.fromEntries(
        Object.entries(values).filter(
          ([_, v]) => v !== null && v !== undefined
        )
      );
      let payload = {
        instituteId,
        branchId,
        ...cleanedValues,
      };
      dispatch(
        saveGlobalSettingsAct(
          generateActionPayload("save_global_settings", undefined, payload)
        )
      );
    },
  });

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">
                Rules
              </h4>
            </div>
          </div>
        </div>
        <div className='card-body'>
          {rulessData.map((item) => (
            <div className='card-body border-bottom' key={item.id}>
              <div className='row align-items-center'>
                <div className='col-9 d-grid'>
                  <span className='fs-12 fw-bold'>
                    <i className={`${item.icon} me-2`}></i>
                    {item.title}
                  </span>
                  <span className='fs-12 text-muted ms-3 ps-1'>{item.description}</span>
                </div>
                <div className='col-3 d-flex justify-content-center'>
                  <Switch
                    attributeId={item.id}
                    labelName=""
                    checked={settingsFormik.values[item.id]}
                    onChangeHndlr={settingsFormik.handleChange}
                    className="form-switch-sm mb-0 pt-2 pb-2"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="hstack gap-2 justify-content-end mt-3 pb-0">
            <button
              className="btn btn-success px-4"
              type="submit"
              onClick={(event: any) => settingsFormik.handleSubmit(event)}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Rules;

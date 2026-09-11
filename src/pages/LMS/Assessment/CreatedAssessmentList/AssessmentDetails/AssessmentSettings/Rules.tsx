import React, { useEffect } from 'react'
import { useFormik } from 'formik'
import { SelectInput, Switch } from '../../../../../../Components/Common'

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

const Rules = (props: any) => {

    const {data} = props

    const getRuleValue = (ruleId: string) => {
        if (!data) return "No"
        
        switch (ruleId) {
            case "fullScreenMode":
                return data?.fullScreenMode ? "Yes" : "No"
            case "disableRightClickCopyPaste":
                return data?.disableRightClickCopyPaste ? "Yes" : "No"
            case "singleTabOnly":
                return data?.singleTabOnly ? "Yes" : "No"
            case "blockDevTools":
                return data?.blockDevTools ? "Yes" : "No"
            case "cursorMustStayInsideWindow":
                return data?.cursorMustStayInsideWindow ? "Yes" : "No"
            case "preventSwitchingAppsTabs":
                return data?.preventSwitchingAppsTabs ? "Yes" : "No"
            case "noSecondMonitorAllowed":
                return data?.noSecondMonitorAllowed ? "Yes" : "No"
            case "serverControlledTimerAutoSubmit":
                return data?.serverControlledTimerAutoSubmit ? "Yes" : "No"
            case "autoSaveAnswersPeriodically":
                return data?.autoSaveAnswersPeriodically ? "Yes" : "No"
            case "logWarnings":
                return data?.logWarnings ? "Yes" : "No"
            default:
                return "No"
        }
    }

  return (
    <>
    <div className='border'>
        {rulessData?.map((item) => (
          <div className="card-body border-bottom" key={item?.id}>
            <div className="row align-items-center">
              <div className="col-7 d-grid">
                <span className="fs-12 fw-bold">
                  <i className={`${item?.icon} me-2`}></i>
                  {item?.title}
                </span>
                <span className="fs-12 text-muted ms-3 ps-1">{item?.description}</span>
              </div>
              <div className='col-5 text-end'>
                  <span className={`badge ${getRuleValue(item?.id) === "Yes" ? "bg-success" : "bg-secondary"}`}>
                      {getRuleValue(item?.id)}
                  </span>
              </div>
            </div>
          </div>
        ))}
    </div>
    </>
  );
};


export default Rules;

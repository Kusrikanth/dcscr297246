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

const Rules = ({ settingsFormik }) => {

  return (
    <>
      {rulessData.map((item, index) => (
        <div 
          className="card-body border-bottom lms_form_switch" 
          key={item.id}
          style={{ 
            backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
            borderTopLeftRadius: index === 0 ? '10px' : '0',
            borderTopRightRadius: index === 0 ? '10px' : '0',
            borderBottomLeftRadius: index === rulessData.length - 1 ? '10px' : '0',
            borderBottomRightRadius: index === rulessData.length - 1 ? '10px' : '0',
          }}
        >
          <div className="row align-items-center">
            <div className="col-9 d-grid">
              <span className="fw-medium">
                <i className={`${item.icon} me-3`}></i>
                {item.title}
              </span>
              <span className="text-muted ms-4 ps-1">{item.description}</span>
            </div>

            <div className="col-3 d-flex justify-content-center">
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
    </>
  );
};

export default Rules;
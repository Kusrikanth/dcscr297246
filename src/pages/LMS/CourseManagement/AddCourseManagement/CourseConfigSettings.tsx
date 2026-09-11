import React from 'react'
import { useFormik } from 'formik'
import { SelectInput, Switch } from '../../../../Components/Common'

const initialValues = {
  noMouseRightClick: true,
  fullscreenMode: true,
  noExtraScreens: true,
  noDevConsole: true,
  cursorInsideWindow: true,
  noSessionSwitch: true,
  cameraCapture: true,
  cameraRecording: true,
}

const rulessData = [
  {
    id: "noMouseRightClick",
    title: "Enable Resources",
    description: "Teachers can upload teaching materials visible to students.",
    icon: "ri-mouse-line"
  },
  {
    id: "fullscreenMode",
    title: "Enable Assignments",
    description: "Required for tests and exams.",
    icon: "ri-fullscreen-line"
  },
  {
    id: "fullscreenMode",
    title: "Enable Assessments",
    description: "Required for tests and exams.",
    icon: "ri-a-b"
  },
  {
    id: "noExtraScreens",
    title: "Enable Activities",
    description: "Allows project-based, collaborative tasks.",
    icon: "ri-device-line"
  },
  {
    id: "noDevConsole",
    title: "Enable Student Access",
    description: 'Make the course and content visible in student LMS.',
    icon: "ri-terminal-line"
  },
  {
    id: "cursorInsideWindow",
    title: "Enable Question Bank",
    description: "Use pooled questions in assessments, worksheets.",
    icon: "ri-cursor-line"
  },
  {
    id: "noSessionSwitch",
    title: "Enable Timetable View",
    description: "Syncs this course with the daily/weekly class timetable.",
    icon: "ri-refresh-line"
  }
];

const courseConfigSettings = () => {
  const questionSettingsForm = useFormik({
    initialValues,
    onSubmit: (values) => {
    },
  })

  return (
    <>
      <div >
        <div className="pt-2">
          <h4 className="tw-mb-0 fs-16">
            Course Config Settings :
          </h4>
        </div>
        <div className="pt-2 pb-3 mb-2">
          <h4 className="tw-mb-0 fs-14 text-muted fw-medium">
            Set rules, access controls, grading, and configuration options for the course.
          </h4>
        </div>
        {rulessData.map((item) => (
          <div className='card-body border-bottom' key={item.id}>
            <div className='row align-items-center'>
              <div className='col-9 d-grid'>
                <span className='fs-13 fw-bold'>
                  <i className={`${item.icon} me-2`}></i>
                  {item.title}
                </span>
                <span className='fs-13 text-muted ms-3 ps-1'>{item.description}</span>
              </div>
              <div className='col-3 d-flex justify-content-center'>
                <Switch
                  attributeId={item.id}
                  labelName=""
                  checked={questionSettingsForm.values[item.id]}
                  onChangeHndlr={questionSettingsForm.handleChange}
                  className="form-switch-sm mb-0 pt-2 pb-2"
                />
              </div>
            </div>
          </div>
        ))}
        <div className="row my-3 pt-3">
          <div className="col-12 text-center">
            <button className='btn btn-light fs-12 px-5' >Previous</button>
            <button
              type="button"
              className="btn btn-outline-primary mx-2 fs-12 px-5"
            // onClick={previousBtnHndlr}
            >
              Save as Draft
            </button>
            <button type="button" className="btn btn-success fs-12 px-5" >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default courseConfigSettings;

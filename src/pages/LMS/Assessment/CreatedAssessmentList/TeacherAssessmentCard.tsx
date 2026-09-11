import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  AlertCircleIcon,
  DocumentValidationIcon,
  MessageQuestionIcon,
  TimeQuarter02Icon,
  ClockIcon,
  SentIcon,
  LiveStreaming02Icon,
  Appointment01Icon,
  User02Icon,
  UserAdd01Icon,
  ViewIcon,
  Cancel01Icon,
  AnalysisTextLinkIcon,
  Book02Icon,
  FileExportIcon,
  RedoIcon,
  Tick01Icon,
  Download01Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { UncontrolledTooltip } from "reactstrap";
import classnames from "classnames";

import { useHistory } from "react-router-dom";
import React from "react";
import { UserDetails } from "../../../../Components/Common";

const labelType = {
  Scheduled: { colorCode: "bg-warning", icon: Appointment01Icon },
  Completed: { colorCode: "bg-success", icon: CheckmarkCircle02Icon },
  Live: { colorCode: "bg-danger", icon: LiveStreaming02Icon },
};

const gradeStatus = {
  Graded: "bg-success",
  "In Progress": "bg-secondary",
  Pending: "bg-warning",
  "Not Graded": "bg-danger",
};

const actionsList = {
  live: [
    {
      icon: LiveStreaming02Icon,
      title: "Monitor Live",
      id: "monitorLive",
    },
    { icon: ViewIcon, title: "View Live Dashboard", id: "view" },
    { icon: Cancel01Icon, title: "Cancel Exam", id: "cancelExam" },
  ],
  scheduled: [
    { icon: ViewIcon, title: "View schedule", id: "view" },
    { icon: RedoIcon, title: "Request Re-Schedule", id: "requestReSchedule" },
  ],
  completed: [
    {
      icon: Tick01Icon,
      title: "Give Marks",
      id: "giveMarks",
    },
    {
      icon: Download01Icon,
      title: "Download Submissions",
      id: "downloadSubmissions",
    },
    { icon: RedoIcon, title: "Request Re-Schedule", id: "requestReSchedule" },
  ],
};

const TeacherAssessmentCard = ({ assessment, cardListItemsFor }) => {
  const {
    id,
    title,
    questions,
    createdAt,
    endDate,
    marks,
    duration,
    statusLabel,
    bgColor,
    icon,
    subjectName,
    testType,
    evaluationStatus,
  } = assessment;

  const isUpcoming = statusLabel === "Upcoming";
  const hasCompleted = statusLabel === "Completed";

  const history = useHistory();

  function assessmentResult() {
    history.push("/assessement-result");
  }

  function writeAssessment() {
    history.push("/assessment-instructions");
  }

  function assessmentDetails() {
    history.push("/assessment-list/assessment-details");
  }

  return (
    <div className="card border rounded-3 !tw-shadow-none hover:!tw-shadow-[0_1px_2px_rgba(56,65,74,0.15)] mb-0 tw-overflow-hidden">
      <div
        className="position-relative tw-h-[138px] tw-flex tw-items-center tw-justify-center tw-mb-6"
        style={{ backgroundColor: `${bgColor}` }}
      >
        <div className="tw-h-[72px] tw-w-[72px]">{icon}</div>

        <p
          className={classnames(
            `badge position-absolute top-0 end-0 m-2 d-flex align-items-center gap-1 ${labelType[statusLabel].colorCode}`
          )}
        >
          {statusLabel}
          {/* <HugeiconsIcon
            icon={labelType[statusLabel].icon}
            className=""
            size={16}
          /> */}
        </p>

        <div className="tw-absolute tw-flex tw-gap-2 tw-transform tw-right-[1rem] tw-bottom-0 tw-transform tw-translate-y-1/2">
          {actionsList?.[statusLabel.toLowerCase()].map((item, idx) => {
            const tooltipId = `${item.id}-${id}-${idx + 1}`;

            // if (!hasCompleted) return;

            return (
              <React.Fragment key={tooltipId}>
                <div
                  id={tooltipId}
                  className={`tw-cursor-pointer tw-rounded tw-h-10 tw-w-10 tw-rounded-full tw-bg-white tw-flex tw-items-center tw-justify-center tw-shadow`}
                >
                  <HugeiconsIcon icon={item.icon} size={18} />
                </div>
                <UncontrolledTooltip placement="bottom" target={tooltipId}>
                  {item.title}
                </UncontrolledTooltip>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      <div className="card-body">
        <h5
          className="card-title text-truncate mb-2 text-info cursor-pointer"
          onClick={assessmentDetails}
        >
          {title}
        </h5>
        <div className="card-subtitle mb-3 text-muted text-truncate small fw-medium">
          <span className="d-flex align-items-center">
            {subjectName} | Live worksheet
          </span>
        </div>

        <div className="d-flex flex-column gap-2 small text-muted">
          <div className="d-flex justify-content-between">
            <span>
              <HugeiconsIcon icon={Book02Icon} className="me-2" size={16} />
              Class
            </span>
            <span>X-A</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>
              <HugeiconsIcon icon={Calendar03Icon} className="me-2" size={16} />
              Assigned Date
            </span>
            <span>{createdAt}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>
              <HugeiconsIcon icon={Calendar03Icon} className="me-2" size={16} />
              Examination Date
            </span>
            <span>{endDate}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>
              <HugeiconsIcon
                icon={DocumentValidationIcon}
                className="me-2"
                size={16}
              />
              Submissions
            </span>
            <span>0/20</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>
              <HugeiconsIcon
                icon={MessageQuestionIcon}
                className="me-2"
                size={16}
              />
              Total Questions
            </span>
            <span>20</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>
              <HugeiconsIcon
                icon={CheckmarkCircle02Icon}
                className="me-2"
                size={16}
              />
              Total Marks
            </span>
            <span>20</span>
          </div>
        </div>
      </div>
      <div className="card-footer py-3 d-none">
        <div className="d-flex justify-content-center">
          <button className="btn btn-sm btn-outline-secondary">
            View More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherAssessmentCard;

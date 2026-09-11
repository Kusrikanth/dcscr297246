import {
  Calendar03Icon,
  CheckmarkCircle02Icon,
  DocumentValidationIcon,
  MessageQuestionIcon,
  TimeQuarter02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import classnames from "classnames";

import assessementImg from "../../../assets/imagesdps/lms/lms-assessement-img.png";
import { useHistory } from "react-router-dom";

const AssessmentCard = ({ assessment }) => {
  const {
    id,
    title,
    subtitle,
    questions,
    createdAt,
    marks,
    duration,
    statusLabel,
    image,
  } = assessment;

  const isUpcoming = statusLabel === "Upcoming";

  const history = useHistory();

  function assessmentResult() {
    history.push("/assessement-result");
  }

  function writeAssessment() {
    history.push("/assessment-instructions");
  }

  return (
    <div className="card border rounded-3 !tw-shadow-none hover:!tw-shadow-[0_1px_2px_rgba(56,65,74,0.15)]">
      <div className="position-relative m-3">
        <img
          src={assessementImg}
          alt="Assessment"
          className="card-img-top rounded-2"
        />

        <span
          className={classnames(
            "badge position-absolute top-0 end-0 m-2 d-inline-flex align-items-center gap-1",
            {
              "bg-warning": isUpcoming,
              "bg-success": !isUpcoming,
            }
          )}
        >
          {statusLabel}
          <HugeiconsIcon icon={CheckmarkCircle02Icon} className="" size={16} />
        </span>
      </div>

      <div className="card-body">
        <h5 className="card-title text-truncate mb-2">{title}</h5>
        <h6 className="card-subtitle mb-3 text-muted text-truncate small fw-medium">
          {subtitle}
        </h6>

        <div className="d-flex flex-column gap-2 small text-muted">
          <div className="d-flex justify-content-between">
            <span>
              <HugeiconsIcon
                icon={MessageQuestionIcon}
                className="me-2"
                size={16}
              />
              Total Questions
            </span>
            <span>{questions}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>
              <HugeiconsIcon icon={Calendar03Icon} className="me-2" size={16} />
              Created at
            </span>
            <span>{createdAt}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>
              <HugeiconsIcon
                icon={DocumentValidationIcon}
                className="me-2"
                size={16}
              />
              Total Marks
            </span>
            <span>{marks}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span>
              <HugeiconsIcon
                icon={TimeQuarter02Icon}
                className="me-2"
                size={16}
              />
              Duration
            </span>
            <span>{duration}</span>
          </div>
          <div className="d-flex justify-content-end mt-2 tw-border-t pt-3">
            {isUpcoming ? (
              <button className="btn-sm btn-success" onClick={writeAssessment}>
                Attempt
              </button>
            ) : (
              <button
                className="btn fs-12 py-1 px-2 btn-outline-secondary"
                onClick={assessmentResult}
              >
                Check Results
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentCard;

import { UncontrolledTooltip } from "reactstrap";
import { AlertCircleIcon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";

const TotalQuestions = () => {
  return (
    <div className="card border shadow-none questions-card mb-0">
      <div className="card-header">
        <h4 className="card-title mb-0 fs-14">
          Score Summary
          <HugeiconsIcon
            icon={AlertCircleIcon}
            id="score-summary"
            className="ms-2"
            size={16}
          />
          <UncontrolledTooltip placement="bottom" target="score-summary">
            Check your score to measure the level of preparation
          </UncontrolledTooltip>
        </h4>
      </div>
      <div className="card-body py-2 px-3">
        <div className="tw-border-b tw-border-dashed tw-mb-5 tw-pb-2">
          <div className="tw-flex tw-items-baseline tw-mb-3">
            <p className="tw-mb-0 tw-me-2 tw-text-secondary tw-text-xs">
              Your Score
            </p>
            <p className="tw-mb-0 tw-text-lg">
              <span>8/15</span>
            </p>
          </div>

          <div className="tw-flex tw-full tw-rounded tw-overflow-hidden">
            <div className="tw-h-3 tw-w-[50%] tw-bg-[rgba(10,179,156,0.85)]"></div>
            <div className="tw-h-3 tw-w-[28%] tw-bg-[rgba(240,101,72,0.85)]"></div>
            <div className="tw-h-3 tw-w-[22%] tw-bg-[rgba(90,107,165,0.85)]"></div>
          </div>
        </div>
        <div className="row gy-2 justify-content-center">
          <div className="col-auto">
            <p className="mb-0 fs-12 d-flex align-items-center">
              <span className="tw-w-3 tw-h-3 tw-rounded tw-inline-block tw-bg-[rgba(10,179,156,0.85)] tw-me-1"></span>
              <span className="text-muted me-2">Correct : </span>
              <span>8</span>
            </p>
          </div>
          <div className="col-auto">
            <p className="mb-0 fs-12 d-flex align-items-center">
              <span className="tw-w-3 tw-h-3 tw-rounded tw-inline-block tw-bg-[rgba(240,101,72,0.85)] tw-me-1"></span>
              <span className="text-muted me-2">Wrong : </span>
              <span>3</span>
            </p>
          </div>
          <div className="col-auto">
            <p className="mb-0 fs-12 d-flex align-items-center">
              <span className="tw-w-3 tw-h-3 tw-rounded tw-inline-block tw-bg-[rgba(90,107,165,0.85)] tw-me-1"></span>
              <span className="text-muted me-2">Un Attempted : </span>
              <span>4</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalQuestions;

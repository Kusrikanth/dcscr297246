const TotalQuestions = () => {
  return (
    <div className="card questions-card">
      <div className="card-header">
        <h4 className="card-title mb-0">Questions</h4>
      </div>
      <div className="card-body py-2">
        <div className="tw-border-b tw-border-dashed tw-mb-5 tw-pb-2">
          <div className="tw-flex tw-items-baseline tw-mb-3">
            <p className="tw-mb-0 tw-me-2 tw-text-lg">
              <span>8/15</span>
            </p>
            <p className="tw-mb-0 tw-text-secondary tw-text-xs">Your Score</p>
          </div>

          <div className="tw-flex tw-gap-2 tw-full">
            <div className="tw-h-3 tw-w-[50%] tw-rounded tw-bg-[rgba(10,179,156,0.85)]"></div>
            <div className="tw-h-3 tw-w-[28%] tw-rounded tw-bg-[rgba(240,101,72,0.85)]"></div>
            <div className="tw-h-3 tw-w-[22%] tw-rounded tw-bg-[rgba(90,107,165,0.85)]"></div>
          </div>
        </div>
        <div className="row">
          <div className="col-4">
            <p className="mb-0 fs-12">
              <span className="tw-h-4 tw-h-4 tw-rounded-full tw-bg-[rgba(10,179,156,0.85)] tw-me-1"></span>
              <span className="text-muted me-2">Correct : </span>
              <span>8</span>
            </p>
          </div>
          <div className="col-4">
            <p className="mb-0 fs-12">
              <span className="tw-h-4 tw-h-4 tw-rounded-full tw-bg-[rgba(240,101,72,0.85)] tw-me-1"></span>
              <span className="text-muted me-2">Wrong : </span>
              <span>3</span>
            </p>
          </div>
          <div className="col-4">
            <p className="mb-0 fs-12">
              <span className="tw-h-4 tw-h-4 tw-rounded-full tw-bg-[rgba(90,107,165,0.85)] tw-me-1"></span>
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

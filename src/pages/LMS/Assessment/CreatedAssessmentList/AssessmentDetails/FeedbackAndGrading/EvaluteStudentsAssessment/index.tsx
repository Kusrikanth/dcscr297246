import AssessmentSubmissionsTabs from "./AssessmentSubmissionsTabs";
import SelectedStudentAssessment from "./SelectedStudentAssessment";

const EvaluteStudentsAssessment = () => {
  return (
    <>
      <div className="row">
        <div className="col-12 col-xl-4 col-xxl-3">
          <div className="card !tw-sticky !tw-top-[64px]">
            <div className="card-header">
              <div className="row gx-2">
                <div className="col-4">
                  <div className="tw-rounded tw-flex tw-items-center tw-justify-center tw-flex-col tw-text-center tw-bg-[#F0FDF4] tw-p-2 tw-h-full">
                    <h4 className="tw-text-[#16A34A] tw-mb-1">12</h4>
                    <p className="tw-text-xs tw-mb-0 tw-text-[#16A34A]">
                      Graded
                    </p>
                  </div>
                </div>
                <div className="col-4">
                  <div className="tw-rounded tw-flex tw-items-center tw-justify-center tw-flex-col tw-text-center tw-bg-[#EFF6FF] tw-p-2 tw-h-full">
                    <h4 className="tw-text-[#2563EB] tw-mb-1">12</h4>
                    <p className="tw-text-xs tw-mb-0 tw-text-[#2563EB]">
                      Submitted
                    </p>
                  </div>
                </div>
                <div className="col-4">
                  <div className="tw-rounded tw-flex tw-items-center tw-justify-center tw-flex-col tw-text-center tw-bg-[#FEF2F2] tw-p-2 tw-h-full">
                    <h4 className="tw-text-[#DC2C33] tw-mb-1">12</h4>
                    <p className="tw-text-xs tw-mb-0 tw-text-[#DC2C33]">
                      Not Submitted
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <AssessmentSubmissionsTabs students={undefined} onStudentSelect={undefined}></AssessmentSubmissionsTabs>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-8 col-xxl-9">
          <SelectedStudentAssessment></SelectedStudentAssessment>
        </div>
      </div>
    </>
  );
};

export default EvaluteStudentsAssessment;

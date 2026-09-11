import TotalQuestions from "./TotalQuestions";
import TotalExamDuration from "./TotalExamDuration";
import ScoreComparison from "./ScoreComparison";
import AssessmentDetails from "./AssessmentDetails";

const AssessmenetResult = () => {
  return (
    <>
      <div className="py-5">
        <div className="container-fluid assessement-result-container">
          <div className="row w-100 mx-auto px-0 gx-3">
            <div className="col-12 mb-3 text-end">
              <button className="btn btn-success ms-auto">Get Report</button>
            </div>
            <div className="col-12">
              <div className="card">
                <div className="card-header py-2 !tw-bg-[rgba(90,107,165,0.85)]">
                  <h4 className="mb-0 card-title text-white">Maths Test</h4>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">Name:</span>
                      <span className="text-truncate d-inline-block">Arun</span>
                    </div>

                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">ID:</span>
                      <span className="text-truncate d-inline-block">
                        123456
                      </span>
                    </div>

                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">Assessment Name:</span>
                      <span className="text-truncate d-inline-block">
                        Final Exam
                      </span>
                    </div>

                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">Mode:</span>
                      <span className="text-truncate d-inline-block">
                        Online
                      </span>
                    </div>

                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">Started Time:</span>
                      <span className="text-truncate d-inline-block">
                        July 07, 2025 04:25 PM
                      </span>
                    </div>

                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">Finished Time:</span>
                      <span className="text-truncate d-inline-block">
                        July 07, 2025 05:50 PM
                      </span>
                    </div>

                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">Time Spent:</span>
                      <span className="text-truncate d-inline-block">
                        00:23:23
                      </span>
                    </div>

                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">IP Address:</span>
                      <span className="text-truncate d-inline-block">
                        192.168.0.1
                      </span>
                    </div>

                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">Passing Score:</span>
                      <span className="text-truncate d-inline-block">40%</span>
                    </div>

                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">Achieved Score:</span>
                      <span className="text-truncate d-inline-block">65%</span>
                    </div>

                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">Achieved Marks:</span>
                      <span className="text-truncate d-inline-block">65</span>
                    </div>

                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">Grade:</span>
                      <span className="text-truncate d-inline-block">A</span>
                    </div>

                    <div className="col-6 col-lg-4 col-xxl-3 d-flex align-items-center">
                      <span className="me-2 text-muted">Result:</span>
                      <span className="text-truncate d-inline-block">Pass</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6 col-xl-4 d-grid">
              <TotalQuestions></TotalQuestions>
            </div>
            <div className="col-12 col-md-6 col-xl-4 d-grid">
              <TotalExamDuration></TotalExamDuration>
            </div>
            <div className="col-12 col-md-6 col-xl-4 d-grid">
              <ScoreComparison></ScoreComparison>
            </div>
            <div className="col-12">
              <AssessmentDetails></AssessmentDetails>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssessmenetResult;

import { useMemo } from "react";
import logo from "../../../../assets/imagesdps/dps-logo.png";
import StudentPerformanceTable from "../../CbseReports/StudentReportGradeBook/StudentPerformanceTable";

const StudentGradeBook = () => {

  return (
    <>
      <div
        className="card student-grade-book-card mb-0 border-bottom"
        style={{
          borderBottomRightRadius: "0px",
          borderBottomLeftRadius: "0px",
        }}
      >
        <div className="card-header">
          <div className="d-flex align-items-center justify-content-center text-center">
            <div>
              <h4 className="mb-0">Grade Book</h4>
              <div className="d-flex justify-content-center">
                <div className="me-3">
                  <span className="fw-semibold">School Name : </span>
                  <span>Delhi Public School (School Code : 00000)</span>
                </div>

                <div>
                  <span className="fw-semibold">Branch Name : </span>
                  <span>Nacharam</span>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <div className="me-3">
                  <span className="fw-semibold">Academic Year : </span>
                  <span>2024-2025</span>
                </div>

                <div className="me-3">
                  <span className="fw-semibold">Class : </span>
                  <span>10th</span>
                </div>

                <div>
                  <span className="fw-semibold">Curriculum : </span>
                  <span>CBSE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="img-container">
            <img src={logo} alt="logo" className="img-fluid"></img>
          </div>
        </div>

        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-12">
              <p
                className="mb-0 d-flex flex-wrap fs-12 text-muted"
                style={{ columnGap: "4px" }}
              >
                <span className="">A1 - Top 1/8 of the passed candidates</span>|
                <span className="">A2 - Next 1/8 of the passed candidates</span>
                |
                <span className="">D1 - Next 1/8 of the passed candidates</span>
                |
                <span className="">D2 - Last 1/8 of the passed candidates</span>
                |<span className="">E - Failed candidates ABT - ABSENT</span> |
                <span className="">G - GRADE</span> |<span>H - HIGHEST</span> |
                <span className="">M - MARK</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="card overflow-hidden"
        style={{ borderTopRightRadius: "0px", borderTopLeftRadius: "0px" }}
      >
        <div className="card-body p-0">
          <StudentPerformanceTable />
        </div>
      </div>
    </>
  );
};

export default StudentGradeBook;

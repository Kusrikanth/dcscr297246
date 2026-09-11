import { UserDetails } from "../../../../../../Components/Common";

const AssessmentWiseAtRiskStudents = ({ getAssessmentWiseAtRiskStudentsDetailsResp }) => {
  const students = Array.isArray(getAssessmentWiseAtRiskStudentsDetailsResp)
    ? getAssessmentWiseAtRiskStudentsDetailsResp
    : [];

  const topSections = [
    { section: "A", avg: 78, status: "Consistent" },
    { section: "B", avg: 74, status: "Consistent" },
    { section: "D", avg: 72, status: "Stable" },
  ];

  return (
    <div className="card h-100">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4 className="card-title mb-0 flex-grow-1">At-Risk Students</h4>
        <span className="text-muted small">Low score on Easy</span>
      </div>
      <div className="card-body d-flex flex-column">
        <div
          className="overflow-auto pe-2"
          style={{ maxHeight: "200px" }}
        >
          {students.length > 0 ? (
            students.map((student) => (
              <div
                key={student.studentId}
                className="d-flex justify-content-between align-items-center mb-3 fs-13"
              >
                <UserDetails
                  displayName={student.studentName}
                  displayId={"E • Easy 45% • Hard 20%"}
                  size="xs"
                  defaultImgType="student"
                />
                <span className="badge text-uppercase badge-soft-success p-2">
                  Coach
                </span>
              </div>
            ))
          ) : (
            <div className="text-muted text-center">
              No details available for At-Risk Students
            </div>
          )}
        </div>

        <div className="mt-3 border-top pt-3">
          <h6 className="fw-semibold mb-3">Top Sections</h6>
          <ul className="list-unstyled mb-0">
            {topSections.map((item, index) => (
              <li
                key={index}
                className="d-flex justify-content-between mb-2"
              >
                <span>{index + 1}. {item.section}</span>
                <span>Avg {item.avg}% • <b>{item.status}</b></span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AssessmentWiseAtRiskStudents;

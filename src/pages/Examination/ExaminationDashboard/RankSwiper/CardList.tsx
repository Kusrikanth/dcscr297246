import BgCelebration from "../../../../assets/imagesdps/updatedDashboard/BGCebration.png";

export function CardItem({ student }: any) {
  const {
    studentName,
    studentId,
    studentRank,
    studentPercentage,
    bgColor,
    rankBgColor,
    studentImage,
  } = student;
  return (
    <div
      className="card student-rank-card overflow-hidden mb-0 mx-auto"
      style={{ backgroundColor: `${bgColor}`, }}
    >
      <div className="card-body text-center">
        <div className="bg-celebration-container">
          <img src={BgCelebration} alt="bg-celebration img-fluid"></img>
        </div>
        <div className="d-flex flex-column align-items-center justify-content-center mb-2">
          <div
            className="img-container mb-3 overflow-hidden"
            style={{
              borderRadius: "50%",
              border: "3px solid #fff",
              width: "91px",
              height: "91px",
            }}
          >
            <img
              src={studentImage ?? "https://dps-institute-bucket-kendriyavidyalay-3-20.s3.ap-south-1.amazonaws.com/6ad4a6ae-d61e-47e8-b85e-599306a34f63.png"}
              alt="student-image rounded"
              className="img-fluid"
            ></img>
          </div>
          <h4 className="mb-1 text-white">{studentName}</h4>
          <p className="mb-0" style={{ color: "#eee" }}>
            {studentId}
          </p>
        </div>
        <div className="mb-3">
          <h2 className="mb-0 text-white">{studentPercentage}</h2>
        </div>
        <div>
          <h4
            className="mb-0 py-2 px-3 rounded-pill text-white"
            style={{ backgroundColor: `${rankBgColor}` }}
          >
            {studentRank}
          </h4>
        </div>
      </div>
    </div>
  );
}

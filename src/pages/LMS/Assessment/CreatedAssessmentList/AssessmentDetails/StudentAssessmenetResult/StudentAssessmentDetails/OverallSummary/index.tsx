import AssessementAccuracy from "./AssessementAccuracy";
import DifficultWiseAnalysis from "./DifficultWiseAnalysis";
import PeerAnalysis from "./PeerAnalysis";
import ScoreComparison from "./ScoreComparison";
import TotalExamDuration from "./TotalExamDuration";
import TotalQuestions from "./TotalQuestions";

const OverallSummary = () => {
  return (
    <div className="row w-100 mx-auto px-0 gx-3 gy-3">
      <div className="col-12 col-lg-6 d-grid">
        <TotalQuestions></TotalQuestions>
      </div>
      <div className="col-12 col-lg-6 d-grid">
        <TotalExamDuration></TotalExamDuration>
      </div>
      <div className="col-12 col-lg-6 d-grid">
        <ScoreComparison></ScoreComparison>
      </div>
      <div className="col-12 col-lg-6">
        <AssessementAccuracy></AssessementAccuracy>
      </div>
      <div className="col-12 col-lg-6">
        <DifficultWiseAnalysis></DifficultWiseAnalysis>
      </div>
      <div className="col-12 col-lg-6">
        <PeerAnalysis></PeerAnalysis>
      </div>
    </div>
  );
};

export default OverallSummary;

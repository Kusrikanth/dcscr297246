import AssessmentCard from "../AssessmentCard";

const UpcomingAssessment = ({ assessementList }) => {
  return (
    <div className="row">
      {assessementList?.map((assessment) => (
        <div className="col-12 col-md-6 col-lg-4" key={assessment.id}>
          <AssessmentCard assessment={assessment}></AssessmentCard>
        </div>
      ))}
    </div>
  );
};

export default UpcomingAssessment;

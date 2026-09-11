import ReviewCurriculumDetails from "../../DigitalCurriulumSetup/ReviewCurriculumDetails";

const DigitalCurriculumReviewCurriculumDetails = (props: any) => {
  
  return (
    <div className="">
      <ReviewCurriculumDetails toggle={props.toggle} subjectCurriculumId={props.id} getDigitalCurriculumStatsApi={props.getDigitalCurriculumStatsApi} getDigitalCurriculumListApi={props.getDigitalCurriculumListApi} />
    </div>
  );
};

export default DigitalCurriculumReviewCurriculumDetails;
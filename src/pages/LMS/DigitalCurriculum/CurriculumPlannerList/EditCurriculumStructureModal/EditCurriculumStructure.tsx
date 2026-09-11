import CurriculumDetails from "../../DigitalCurriulumSetup/CurriculumDetails";

const EditCurriculumStructure = (props: any) => {

return (
    <div className="">
       <CurriculumDetails
        subjectCurriculumId={props.subjectCurriculumId}
        toggle={props.toggle}
        redirectToReview={true}
      />
    </div>
  );
};

export default EditCurriculumStructure;
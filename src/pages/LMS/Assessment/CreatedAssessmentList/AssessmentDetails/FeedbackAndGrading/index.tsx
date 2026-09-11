import { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../../../Components/Common/UpdatedHorizontalTab";
import StudentsGradeList from "./StudentsGradeList";
import EvaluteStudentsAssessment from "./EvaluteStudentsAssessment";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const FeedbackAndGrading = () => {


  return (
    <>
      <div className="row">
        <StudentsGradeList />
      </div>
    </>
  );
};

export default FeedbackAndGrading;

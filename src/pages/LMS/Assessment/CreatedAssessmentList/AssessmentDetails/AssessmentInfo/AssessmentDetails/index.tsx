import { useMemo, useReducer } from "react";
import TableContainer from "../../../../../../../Components/Common/TableContainer";
import { generateColumns, tableData } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { ViewIcon } from "@hugeicons-pro/core-stroke-standard";
import { useHistory } from "react-router-dom";
import ViewAssessmentQuestionsDetails from "./ViewAssessmentQuestionsDetails";

const AssessmentDetails = () => {
  const history = useHistory();

  const menuOptions = useMemo(
    () => [
      {
        id: "view",
        actionIcon: (
          <HugeiconsIcon icon={ViewIcon} size={18} className="me-2" />
        ),
        actionName: "View",
        onClickHndlr: (event: any) => {
          history.push(`/view-assessment-details`);
        },
      },
    ],
    []
  );

  return (
    <div className="">
      <ViewAssessmentQuestionsDetails></ViewAssessmentQuestionsDetails>
    </div>
  );
};

export default AssessmentDetails;

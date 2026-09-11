import { useMemo, useState } from "react";
import OverallSummary from "./OverallSummary";
import ReviewAsssessment from "./ReviewAsssessment";
import UpdatedHorizontalTab from "../../../../../../../Components/Common/UpdatedHorizontalTab";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const StudentAssessmentDetails = () => {
  const [activeId, setActiveId] = useState<any>("question-wise-summary");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "question-wise-summary",
      labelName: "Question wise Summary",
      customPadding: "0px 6px 6px 6px",
    },
    {
      id: "overall-summary",
      labelName: "Overall Summary",
      customPadding: "0px 6px 6px 6px",
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "overall-summary":
        return OverallSummary;
      case "question-wise-summary":
        return ReviewAsssessment;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent />;
  }, [activeId]);

  return (
    <div className="card">
      <div className="card-header pb-0">
        <UpdatedHorizontalTab
          MenuOptions={MenuOptions}
          clickMenuHandler={clickMenuHandler}
          activeTabId={activeId}
          horizontalClass="overflow-auto student-assessment-details"
        />
      </div>
      <div className="card-body px-2">
        <div>{activeComponent}</div>
      </div>
    </div>
  );
};

export default StudentAssessmentDetails;

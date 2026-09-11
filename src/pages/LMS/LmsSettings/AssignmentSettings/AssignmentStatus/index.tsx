import { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../../Components/Common/UpdatedHorizontalTab";
import AssignmentLifecycleStatuses from "./AssignmentLifecycleStatuses";
import AssignmentProgressStatuses from "./AssignmentProgressStatuses";
import StudentSubmissionStatuses from "./StudentSubmissionStatuses";
import EvaluationStatuses from "./EvaluationStatuses";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

function LifecycleStatuses() {
  return <p>Lifecycle Statuses</p>;
}

const AssignmentStatus = () => {
  const [activeTabId, setActiveTabId] = useState<any>(
    "assignment-lifecycle-statuses"
  );

  const menuOptions: Array<IMenuOptions> = [
    {
      id: "assignment-lifecycle-statuses",
      labelName: "Lifecycle Statuses",
      customPadding: "0px 10px 4px 10px",
    },
    {
      id: "assignment-progress-statuses",
      labelName: "Progress Statuses",
      customPadding: "0px 10px 4px 10px",
    },
    {
      id: "student-submission-statuses",
      labelName: "Student Submission Statuses",
      customPadding: "0px 10px 4px 10px",
    },
    {
      id: "evaluation-statuses",
      labelName: "Evaluation Statuses",
      customPadding: "0px 10px 4px 10px",
    },
  ];

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "assignment-lifecycle-statuses":
        return AssignmentLifecycleStatuses;
      case "assignment-progress-statuses":
        return AssignmentProgressStatuses;
      case "student-submission-statuses":
        return StudentSubmissionStatuses;
      case "evaluation-statuses":
        return EvaluationStatuses;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveTabId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeTabId);
    return <TabComponent />;
  }, [activeTabId]);

  return (
    <>
      <div className="row">
        <div className="col-12 mb-3">
          <UpdatedHorizontalTab
            MenuOptions={menuOptions}
            clickMenuHandler={clickMenuHandler}
            activeTabId={activeTabId}
            horizontalClass=""
          />
        </div>
        <div>{activeComponent}</div>
      </div>
    </>
  );
};

export default AssignmentStatus;

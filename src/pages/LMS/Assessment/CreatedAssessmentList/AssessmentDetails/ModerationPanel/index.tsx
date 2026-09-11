import { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../../../Components/Common/UpdatedHorizontalTab";
import StudentCards from "./StudentCards";
import ManageEvaluatorsWorkload from "./ManageEvaluatorsWorkload";
import EvaluateSubmissions from "./EvaluateSubmissions";
interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}
const ModerationPanel = () => {
  const [activeId, setActiveId] = useState<any>("evaluator");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "evaluator",
      labelName: "Manage Evaluators Workload",
      customPadding: "0px 10px 10px 10px",
    },
    {
      id: "gradingStatus",
      labelName: "Evaluate Submissions",
      customPadding: "0px 10px 10px 10px",
    },
  ];
  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "evaluator":
        return ManageEvaluatorsWorkload;
      case "gradingStatus":
        return EvaluateSubmissions;
    }
  }

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent />;
  }, [activeId]);
  return (
    <>
      <div className="row align-items-center px-3 mb-3">
        <div className="col-12 col-lg-auto px-0">
          <UpdatedHorizontalTab
            MenuOptions={MenuOptions}
            clickMenuHandler={clickMenuHandler}
            activeTabId={activeId}
            horizontalClass="horizontal-menu-updated-style super-admin-tabs"
          />
        </div>
      </div>
      {activeComponent}
    </>
  );
};

export default ModerationPanel;

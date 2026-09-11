import { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../../Components/Common/UpdatedHorizontalTab";
import SolutionAnalysis from "./SolutionAnalysis";
import ToppersAnalysis from "./ToppersAnalysis";
interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}


const AssessmentDetails = () => {
  const [activeId, setActiveId] = useState<any>("solution-analysis");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "solution-analysis",
      labelName: "Solution Analysis",
      customPadding: "0px 6px 6px 6px",
    },
    {
      id: "toppers-analysis",
      labelName: "Toppers Analysis",
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
      case "solution-analysis":
        return SolutionAnalysis;
      case "toppers-analysis":
        return ToppersAnalysis;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent />;
  }, [activeId]);

  return (
    <div>
      <UpdatedHorizontalTab
        MenuOptions={MenuOptions}
        clickMenuHandler={clickMenuHandler}
        activeTabId={activeId}
        horizontalClass="overflow-auto text-nowrap"
      />
      <div>{activeComponent}</div>
    </div>
  );
};

export default AssessmentDetails;

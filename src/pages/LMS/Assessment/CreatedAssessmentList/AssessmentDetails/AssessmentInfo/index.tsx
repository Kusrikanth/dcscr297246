import { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../../../Components/Common/UpdatedHorizontalTab";
import AssessmentDetails from "./AssessmentDetails";
import QuestionWiseDetails from "./QuestionWiseDetails";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
}

const AssessmentInfo = () => {
  const [activeId, setActiveId] = useState<any>("assessmentDeatils");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "assessmentDeatils",
      labelName: "Assessment Preview",
      customPadding: "0px 10px 6px 10px",
    },
    {
      id: "questionWiseDetails",
      labelName: "Queston wise Analysis",
      customPadding: "0px 10px 6px 10px",
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "assessmentDeatils":
        return AssessmentDetails;
      case "questionWiseDetails":
        return QuestionWiseDetails;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);
    return <TabComponent />;
  }, [activeId]);

  return (
    <>
      <div className="row">
        <div className="col-12">
          <UpdatedHorizontalTab
            MenuOptions={MenuOptions}
            clickMenuHandler={clickMenuHandler}
            activeTabId={activeId}
            horizontalClass="horizontal-menu-updated-style tw-w-fit tw-border tw-mb-4"
          />
        </div>

        <div>{activeComponent}</div>
      </div>
    </>
  );
};

export default AssessmentInfo;

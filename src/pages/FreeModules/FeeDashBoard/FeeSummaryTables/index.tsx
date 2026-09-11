import { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import BranchWiseNet from "./BranchWiseNetAmount";
import BranchWiseDueSummary from "./BranchWiseDueSummary";
import ClassWiseNetAmount from "./ClassWiseNetAmount";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const FeeSummaryTables = () => {
  const [activeId, setActiveId] = useState<any>("branchWiseDueSummary");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "branchWiseDueSummary",
      labelName: "Branch wise Due Summary",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "branchWiseNet",
      labelName: "Branch wise Net",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "classWiseNet",
      labelName: "Class wise Net",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
  ];

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId);
  }

  function getActiveMenuComponent(menuId: string) {
    switch (menuId) {
      case "branchWiseDueSummary":
        return BranchWiseDueSummary;
      case "branchWiseNet":
        return BranchWiseNet;
      case "classWiseNet":
        return ClassWiseNetAmount;
      default:
        return null;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);

    return <TabComponent></TabComponent>;
  }, [activeId]);

  return (
    <div className="fee-summary-table-tabs-container">
      <div className="tw-bg-white tw-rounded-md tw-shadow tw-pb-0 tw-mb-3">

        <div className="tw-pb-0 tw-border-b">
          <div className="tw-grid tw-grid-cols-12 tw-items-center tw-gap-y-3">
            <div className="tw-col-span-12">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="tw-pl-0 tw-overflow-auto tw-whitespace-nowrap tw-p-4 tw-pb-0"
              />
            </div>
          </div>
        </div>

        <div className="tw-pb-0 tw-px-0">
          {activeComponent}
        </div>

      </div>
    </div>
  );
};

export default FeeSummaryTables;

import { useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import BranchWiseNetPaidByDate from "../BranhWiseNetPaidByDate";
import BranchWiseDueSummary from "../BranchWiseDueSummary";
import BranchWiseNet from "../BranchWiseNetAmount";

interface IMenuOptions {
  id: string;
  labelName: string;
  customPadding: string;
  Icon: any;
}

const FeeSummaryTables = (props: any) => {
  const [activeId, setActiveId] = useState<any>("branchWiseDueSummary");

  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "branchWiseDueSummary",
      labelName: "Branch wise Due Summary",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "branchWiseNetPaidByDate",
      labelName: "Branch wise Net Paid By Date",
      customPadding: "0px 5px 5px 5px",
      Icon: "",
    },
    {
      id: "branchWiseNet",
      labelName: "Branch wise Net",
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
      case "branchWiseNetPaidByDate":
        return BranchWiseNetPaidByDate;
      case "branchWiseNet":
        return BranchWiseNet;
      default:
        return null;
    }
  }

  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeId);

    return <TabComponent branchIdState={props.branchIdState}></TabComponent>;
  }, [activeId, props.branchIdState]);

  return (
    <div className="fee-summary-table-tabs-container">
      <div className="tw-bg-white tw-rounded-2xl tw-shadow tw-pb-0 tw-mb-3">
        <div className="tw-border-b tw-border-gray-200 tw-mb-4 tw-px-4 tw-pt-4">
          <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-y-3">
            <div className="tw-w-full">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="tw-pl-0 tw-overflow-auto tw-whitespace-nowrap"
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

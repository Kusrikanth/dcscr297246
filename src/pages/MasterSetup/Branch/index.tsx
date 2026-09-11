import React, { useMemo, useState } from 'react'

import BranchAdminList from './BranchAdminList';
import Branches from './Branches';

export const tabsOptions: Array<any> = [
  {
    tabId: "branches",
    tabName: "Branches"
  },
  {
    tabId: "branchAdminList",
    tabName: "Branch Admin List"
  }
]

function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    case "branches":
      return Branches;
    case "branchAdminList":
      return BranchAdminList;
  }
}
const Branch = ({ instituteId }: any) => {
  const [activeTabId, setActiveTabId] = useState<string | null>("branches");
  // const MenuOptions: Array<IMenuOptions> = [
  //   {
  //     id: "branches",
  //     labelName: "Branches",
  //     customPadding: "0px 10px",
  //   },
  //   {
  //     id: "branchAdminList",
  //     labelName: "Branch Admin List",
  //     customPadding: "0px 10px",
  //   },
  // ];
  function tabChangeHndlr(tabId: string) {
    setActiveTabId(tabId);
  }


  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeTabId);
    return <TabComponent instituteId={instituteId} />
  }, [activeTabId, instituteId]);
  return (
    <>
      <div className="tw-bg-white tw-shadow tw-rounded-lg tw-mb-0">
        <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 tw-border-b tw-border-gray-200 tw-rounded-t-lg">
          <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
            Branches
          </h4>
          {/* <Tabs
            activeTabId={activeTabId}
            tabChangeHndlr={tabChangeHndlr}
            tabsList={tabsOptions}
            navContainerClass="card-header-tabs nav-tabs"
          /> */}
        </div>
        {/* <CardBody className="p-0">
          <HorizontalTab
            MenuOptions={MenuOptions}
            getActiveMenuComponent={(menuId: any) =>
              getActiveMenuComponent(menuId)
            }
            activeTabId="branches"
            showBadge={false}
            horizontalClass="px-3 pt-2"
          />
        </CardBody> */}
      </div>
      {activeComponent}
    </>
  )
}

export default Branch

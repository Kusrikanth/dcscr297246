import React, { useState, useEffect, useRef, useMemo } from "react";
//Common Component
import { Tabs } from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch } from "../../../hooks/storehook";

import { tabsOptions } from "./helper";
//Component
import AcademicYearsTab from "./AcademicYearsTab";
import AcademicYearsDate from "./AcademicYearsDate";

function getActiveMenuComponent(menuId: string | null) {
  switch (menuId) {
    case "academic-years":
      return AcademicYearsTab;
    case "academic-year-dates":
      return AcademicYearsDate;
  }
}

export const AcademicYears: React.FC<any> = ({ instituteName, instituteId }) => {
  const [activeTabId, setActiveTabId] = useState<string | null>("academic-years");
  const dispatch = useAppDispatch();
  function tabChangeHndlr(tabId: string) {
    setActiveTabId(tabId);
  }
  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeTabId);
    if (TabComponent)
      return <TabComponent instituteId={instituteId} />
  }, [activeTabId, instituteId]);

  return (
    <React.Fragment>
      <div className="tw-bg-white tw-rounded-lg tw-shadow">
        <div className="tw-px-5 tw-pt-4 tw-rounded-t-lg">
          <Tabs
            activeTabId={activeTabId}
            tabChangeHndlr={tabChangeHndlr}
            tabsList={tabsOptions}
            navContainerClass="card-header-tabs tw-border-b-0 nav-tabs"
          />
        </div>
        <div className="tw-p-5 tw-px-0">
          {activeComponent}
        </div>

      </div>
    </React.Fragment>
  )
}

export default AcademicYears;

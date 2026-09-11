import React, { useState, useEffect, useRef, useMemo } from "react";
//Common Component
import {  Tabs } from "../../../Components/Common";
//Custom Hooks
import { useAppDispatch } from "../../../hooks/storehook";

import { tabsOptions } from "./helper";
//Component
import BasicInfo from "./BasicInfo";
import ContactDetails from "./ContactDetails";

//Generate Action
import { generateActionPayload } from "../../../utility/reduxutility";
import { getInstByIdAct } from "../../../store/mastersettings/instituteinfo/instituteinfoactions";

//Types
import { IInstituteProps } from "./institutetypes";

function getActiveMenuComponent(tabId: string | null) {
  switch (tabId) {
    case "basic-info":
      return BasicInfo;
    case "contactperson-info":
      return ContactDetails;
  }
}

export const InstituteInfo: React.FC<IInstituteProps> = ({ instituteName, instituteId }) => {
  const [activeTabId, setActiveTabId] = useState<string | null>("basic-info");
  const dispatch = useAppDispatch();
  function tabChangeHndlr(tabId: string) {
    setActiveTabId(tabId);
  }

  useEffect(() => {
    if (instituteId) {
      const params = { instituteId };
      dispatch(getInstByIdAct(generateActionPayload("get_inst_details", params)));
    }
  }, [instituteId]);
  const activeComponent = useMemo(() => {
    const TabComponent: any = getActiveMenuComponent(activeTabId);
    return <TabComponent instituteId={instituteId} />
  }, [activeTabId, instituteId]);

  return (
    <React.Fragment>
      <div className="tw-bg-white tw-shadow tw-rounded-lg">
        <div className=" tw-border-gray-200 tw-px-0 tw-py-3">
          <Tabs
            activeTabId={activeTabId}
            tabChangeHndlr={tabChangeHndlr}
            tabsList={tabsOptions}
            navContainerClass="tw-border-b-0 nav-tabs"
          />
        </div>
        <div className="tw-p-4">
          {activeComponent}
        </div>
      </div>
    </React.Fragment>
  )
}

export default InstituteInfo;
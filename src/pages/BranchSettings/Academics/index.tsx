
//Common Component
import React, { useState, useMemo } from "react";
import classnames from "classnames";

import { Tabs } from "../../../Components/Common";
import { tabsOptions } from "./helper";

//Component
import Curriculum from "./Curriculum";
import Sections from "./Sections";
import Subjects from "./Subjects";
import Class from "./Classes";
import StreamGroup from "./StreamGroups";
// import BranchInfo from "./BranchInfo";
// import BranchDetails from "./BankDetails";

function getActiveMenuComponent(tabId: string | null) {
    switch (tabId) {
        case "curriculum":
            return Curriculum;
        case "classes":
            return Class;
        case "section":
            return Sections;
        case "subjects":
            return Subjects;
        case "stream_groups":
            return StreamGroup;
    }
}

export const Academics: React.FC<any> = ({ branchId, instituteId }) => {
    const [activeTabId, setActiveTabId] = useState<string | null>("curriculum");

    function tabChangeHndlr(tabId: string) {
        setActiveTabId(tabId);
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeTabId);
        return <TabComponent branchId={branchId} instituteId={instituteId} />;
    }, [activeTabId, branchId, instituteId]);

    return (
        <React.Fragment>
            <div className="tw-bg-white">

                <div className="tw-border-gray-200 tw-py-3 card-header-tabs tw-px-3">
                    <Tabs
                        activeTabId={activeTabId}
                        tabChangeHndlr={tabChangeHndlr}
                        tabsList={tabsOptions}
                        navContainerClass=" tw-border-b-0 nav-tabs"
                    />
                </div>

                <div className="tw-p-0">
                    {activeComponent}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Academics;
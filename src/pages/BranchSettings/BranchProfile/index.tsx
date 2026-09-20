

//Common Component
import React, { useState, useMemo } from "react";
import classnames from "classnames";

import { Tabs } from "../../../Components/Common";
import { tabsOptions } from "./helper";

//Component
import BranchInfo from "./BranchInfo";
import EmailIntegration from "./EmailIntegration";


function getActiveMenuComponent(tabId: string | null) {
    switch (tabId) {
        case "basic-info":
            return BranchInfo;
        // case "contact-person":
        //     return ContactPerson;
        case "email-integration":
            return EmailIntegration;
    }
}

export const BranchProfile: React.FC<any> = ({ branchId }) => {
    const [activeTabId, setActiveTabId] = useState<string | null>("basic-info");

    function tabChangeHndlr(tabId: string) {
        setActiveTabId(tabId);
    }
    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeTabId);
        return <TabComponent branchId={branchId} />
    }, [activeTabId, branchId]);

    return (
        <React.Fragment>
            <div className="tw-bg-white">

                <div className=" tw-border-gray-200 tw-px-0 tw-py-3 card-header-tabs tw-px-3">
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

export default BranchProfile;
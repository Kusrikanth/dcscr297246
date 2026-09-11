import React, { useMemo, useState } from 'react'
import { Card, CardBody } from 'reactstrap'
//Common Component
import { Tabs } from "../../../Components/Common";

import RoleTypes from './RoleTypes';
import Role from "./Role"
import Administrator from './Administrator';

export const tabsOptions: Array<any> = [
    {
        tabId: "role-type",
        tabName: "Role Type"
    },
    {
        tabId: "role",
        tabName: "Role"
    }
]

function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
        case "role-type":
            return RoleTypes;
        case "role":
            return Role;
        // case "administrators":
        //     return Administrator;
    }
}
const UserManagement = ({ instituteId }: any) => {
    const [activeTabId, setActiveTabId] = useState<string | null>("role-type");
    function tabChangeHndlr(tabId: string) {
        setActiveTabId(tabId);
    }


    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeTabId);
        if (TabComponent)
            return <TabComponent instituteId={instituteId} />
    }, [activeTabId, instituteId]);
    return (
        <>
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
        </>
    )
}

export default UserManagement

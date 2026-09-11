

//Common Component
import React, { useState, useMemo } from "react";
import { Card, CardBody, CardHeader, Form, Row, Col, Input, Label } from "reactstrap";
import classnames from "classnames";

import { Tabs } from "../../../Components/Common";
import { tabsOptions } from "./helper";

//Pages Tab
import FeeDetails from "./FeeDetails";
import FeeDepartment from "./FeeDepartment";
import EmployeeConcession from "./EmployeeConcession";
import FeeTypes from "./FeeTypes";

//Component

function getActiveMenuComponent(tabId: string | null) {
    switch (tabId) {
        case "fee-types":
            return FeeTypes;
        case "fee-department":
            return FeeDepartment;
        case "fee-details":
            return FeeDetails;
        case "employee-concession":
            return EmployeeConcession;
    }
}

export const Fees: React.FC<any> = ({ instituteId }) => {
    const [activeTabId, setActiveTabId] = useState<string | null>("fee-department");

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
            <div className="card">
                <div className="card-header rounded">
                    <Tabs
                        activeTabId={activeTabId}
                        tabChangeHndlr={tabChangeHndlr}
                        tabsList={tabsOptions}
                        navContainerClass="card-header-tabs tw-border-b-0 nav-tabs"
                    />
                </div>
                <div className="tw-p-0">
                    {activeComponent}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Fees;
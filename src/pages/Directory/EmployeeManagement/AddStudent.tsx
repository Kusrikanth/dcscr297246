import React, { useMemo,  useState } from "react";
import { Nav, NavItem, NavLink, } from "reactstrap";
import classnames from "classnames";

import { StudentInfo, ParentGuardian, CommunicationDetails, Documents, Photos } from "./StepInfo";


function getActiveMenuComponent(menuId: any) {
    switch (menuId) {
        case 1:
            return StudentInfo;
        case 2:
            return ParentGuardian;
        case 3:
            return CommunicationDetails;
        case 4:
            return Documents;
        case 5:
            return Photos;
        default:
            return null;

    }
}

function AddStudent(props: any) {
    const [activeTab, setactiveTab] = useState<any>(1);
    const [passedSteps, setPassedSteps] = useState([1]);
    function toggleTab(tab: any) {
        if (activeTab !== tab) {
            var modifiedSteps = [...passedSteps, tab];

            if (tab >= 1 && tab <= 5) {
                setactiveTab(tab);
                setPassedSteps(modifiedSteps);
            }
        }
    }
    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeTab);
        if (TabComponent)
            return <TabComponent />
    }, [activeTab]);

    
    return (
        <div className="step-arrow-nav">
            <Nav
                className="nav-pills nav-justified custom-nav"
                role="tablist"
            >
                <NavItem role="presentation">
                    <NavLink href="#"
                        className={classnames({ active: activeTab === 1, done: (activeTab <= 4 && activeTab >= 0) }, "p-3 text-nowrap")}
                        onClick={() => { toggleTab(1); }}
                    >
                        <i className="ri-user-2-line fs-16 tw-p-2 bg-soft-primary text-primary rounded-circle align-middle tw-me-2"></i>
                        Basic Details
                    </NavLink>
                </NavItem>
                <NavItem role="presentation">
                    <NavLink href="#"
                        className={classnames({ active: activeTab === 2, done: activeTab <= 4 && activeTab > 1 }, "p-3 text-nowrap")}
                        onClick={() => { toggleTab(2); }}
                    >
                        <i className="ri-truck-line fs-16 tw-p-2 bg-soft-primary text-primary rounded-circle align-middle tw-me-2"></i>
                        Designation Details
                    </NavLink>
                </NavItem>
                <NavItem role="presentation">
                    <NavLink href="#"
                        className={classnames({ active: activeTab === 3, done: activeTab <= 4 && activeTab > 2 }, "p-3 text-nowrap")}
                        onClick={() => { toggleTab(3); }}
                    >
                        <i className="ri-bank-card-line fs-16 tw-p-2 bg-soft-primary text-primary rounded-circle align-middle tw-me-2"></i>
                        Bank Details
                    </NavLink>
                </NavItem>
                <NavItem role="presentation">
                    <NavLink href="#"
                        className={classnames({ active: activeTab === 4, done: activeTab <= 4 && activeTab > 3 }, "p-3 text-nowrap")}
                        onClick={() => { toggleTab(4); }}
                    >
                        <i className="ri-checkbox-circle-line fs-16 tw-p-2 bg-soft-primary text-primary rounded-circle align-middle tw-me-2"></i>
                        TDS Details
                    </NavLink>
                </NavItem>
                <NavItem role="presentation">
                    <NavLink href="#"
                        className={classnames({ active: activeTab === 5, done: activeTab <= 5 && activeTab > 4 }, "p-3 text-nowrap")}
                        onClick={() => { toggleTab(5); }}
                    >
                        <i className="ri-checkbox-circle-line fs-16 tw-p-2 bg-soft-primary text-primary rounded-circle align-middle tw-me-2"></i>
                        Photo & Document
                    </NavLink>
                </NavItem>
            </Nav>
            <div className="py-2">
                {/* <CommunicationDetails /> */}
                {activeComponent}
            </div>
        </div>
    )
}


export default AddStudent;

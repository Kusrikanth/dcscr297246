import React, { useMemo, forwardRef, useEffect, useRef, useState, useImperativeHandle } from "react";
import { shallowEqual } from "react-redux";
import { ModalContainer, DateInput, TextInput, SelectInput, PhoneInput } from "../../../Components/Common";
import { toast } from "react-toastify";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";

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
        <div className="tw-w-full">
            {/* Steps */}
            <nav
                role="tablist"
                className="
      tw-flex
      tw-w-full
      tw-border-b
      tw-border-gray-200
      tw-overflow-x-auto
    "
            >
                {[
                    { id: 1, label: "Student Info", icon: "ri-user-2-line" },
                    { id: 2, label: "Parents & Guardian Details", icon: "ri-truck-line" },
                    { id: 3, label: "Communication Details", icon: "ri-bank-card-line" },
                    { id: 4, label: "Documents", icon: "ri-checkbox-circle-line" },
                    { id: 5, label: "Photos", icon: "ri-checkbox-circle-line" },
                ].map((item) => {
                    const isActive = activeTab === item.id;
                    const isDone =
                        item.id < activeTab || (item.id === activeTab && activeTab > 1);

                    return (
                        <button
                            key={item.id}
                            type="button"
                            role="tab"
                            onClick={() => toggleTab(item.id)}
                            className={classnames(
                                `
              tw-flex
              tw-items-center
              tw-justify-center
              tw-gap-2
              tw-flex-1
              tw-p-3
              tw-text-sm
              tw-whitespace-nowrap
              tw-border-b-2
              tw-transition
            `,
                                {
                                    "tw-border-blue-600 tw-text-blue-600 tw-font-semibold":
                                        isActive,
                                    "tw-border-green-500 tw-text-green-600":
                                        isDone && !isActive,
                                    "tw-border-transparent tw-text-gray-500 hover:tw-text-blue-600":
                                        !isActive && !isDone,
                                }
                            )}
                        >
                            <span
                                className={classnames(
                                    `
                tw-flex
                tw-items-center
                tw-justify-center
                tw-rounded-full
                tw-p-2
                tw-text-base
              `,
                                    {
                                        "tw-bg-blue-100 tw-text-blue-600": isActive,
                                        "tw-bg-green-100 tw-text-green-600": isDone && !isActive,
                                        "tw-bg-gray-100 tw-text-gray-500": !isActive && !isDone,
                                    }
                                )}
                            >
                                <i className={item.icon}></i>
                            </span>

                            {item.label}
                        </button>
                    );
                })}
            </nav>

            {/* Content */}
            <div className="tw-py-2">
                {activeComponent}
            </div>
        </div>
    )
}


export default AddStudent;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardBody, Col, Container, Input, Label, Row, Button, CardHeader } from "reactstrap";
import { shallowEqual } from "react-redux";
import classnames from "classnames";
import { useSelector } from "react-redux";

//Common Component
import BreadCrumb from "../../Components/Common/BreadCrumb";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";

//Component
import FeeCategories from "./FeeCategories";
import FeeTypes from "./FeeTypes";
import FeeConfigurationSetup from "./FeeConfigurationSetup";
//Images
import DPSLogoSM from "../../assets/imagesdps/mastersetup/dps_logo.png";
import PGSLogoSM from "../../assets/imagesdps/mastersetup/pgs-logo.png";


//Helpers
import { menuOptions } from "./helper";

//Generate Action
import { generateActionPayload } from "../../utility/reduxutility";
import { getInstByIdAct } from "../../store/mastersettings/instituteinfo/instituteinfoactions";
import PercentageSlabs from "../Examination/CbseSettings/PercentageSlabs";

function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
        case "fee-masters":
            return FeeConfigurationSetup;
        case "fee-categories":
            return FeeCategories;
        case "fee-types":
            return FeeTypes;
        case "examination":
            return PercentageSlabs;
    }
}

const ModulesSettings = () => {
    const [activeMenuState, setActiveMenuState] = useState<any>({
        menuId: "fee-masters",
        activeComponentId: "fee-masters",
    });
    const [backTabIdState, setBackTabIdState] = useState({
        tabId: "",
        backTitle: ""
    });
    const dispatch = useAppDispatch();
    const { currentInstIdResp, instituteValue, instDetailsResp } = useAppSelector(({ appData, Layout, instituteInfo }) => ({
        instituteValue: Layout.instituteValue,
        instDetailsResp: instituteInfo.instDetailsResp,
        currentInstIdResp: appData.currentInstIdResp
    }), shallowEqual);

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
        setActiveMenuState((prevState: any) => ({
            ...prevState, menuId,
            activeComponentId: menuId
        }));
        setBackTabIdState({
            tabId: "",
            backTitle: ""
        });
    }

    useEffect(() => {
        if (currentInstIdResp) {
            const params = { instituteId: currentInstIdResp };
            dispatch(getInstByIdAct(generateActionPayload("get_inst_details", params)));
        }
    }, [currentInstIdResp]);

    const onClickSettingHndlr = useCallback((event: any) => {
        const tabId = event.currentTarget.getAttribute("data-id");
        if (tabId && activeMenuState.menuId) {
            const { labelName, id } = menuOptions.find(item => item.id === activeMenuState.menuId) || {};
            if (id && labelName) {
                setActiveMenuState((prevState: any) => ({
                    ...prevState,
                    activeComponentId: tabId
                }));
                setBackTabIdState({
                    tabId: id,
                    backTitle: labelName
                });
            }
        }
    }, [activeMenuState]);

    const activeComponent = useMemo(() => {
        // if (currentInstIdResp) {
        const TabComponent: any = getActiveMenuComponent(activeMenuState.activeComponentId);
        if (TabComponent)
            return <TabComponent
                activeTabId={activeMenuState}
                instituteName={instDetailsResp?.instituteName}
                instituteId={currentInstIdResp}
                onClickSettingHndlr={onClickSettingHndlr}
            />
        // }
    }, [activeMenuState, instDetailsResp, instituteValue, currentInstIdResp,
        onClickSettingHndlr,
        getActiveMenuComponent]);

    function backClickHndlr() {
        const { tabId } = backTabIdState;
        setActiveMenuState((prevState: any) => ({
            ...prevState, tabId,
            activeComponentId: tabId
        }));
        setBackTabIdState({
            tabId: "",
            backTitle: ""
        });
    }
    return (<React.Fragment>
        <div className="tw-p-6 tw-bg-gray-50 master-setup-wrapper">

            <div className="tw-max-w-full">

                <BreadCrumb title="Master Setup" pageTitle="DPS" />

                <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-3">
                    <div className="tw-py-2 tw-px-4">
                        <div className="tw-flex tw-justify-between tw-items-center tw-relative">

                            <div className="tw-flex tw-items-center">

                                <div className="tw-w-16 tw-h-16 tw-bg-gray-100 tw-rounded-full tw-p-1 tw-mr-3 tw-flex tw-items-center tw-justify-center">
                                    <img
                                        src={instituteValue === "DPS" ? DPSLogoSM : DPSLogoSM}
                                        className="tw-w-full tw-h-full tw-object-contain"
                                        alt="Institute Logo"
                                    />
                                </div>

                                <div className="tw-flex tw-flex-col">
                                    <h5 className="tw-mb-0 tw-text-base tw-font-semibold">
                                        {instDetailsResp?.instituteName}
                                    </h5>
                                    <span className="tw-text-blue-600 tw-text-sm">
                                        {instDetailsResp?.shortName}
                                    </span>
                                </div>

                            </div>

                            {backTabIdState.backTitle && (
                                <div className="tw-absolute tw-bottom-0 tw-right-0 tw-flex tw-items-center tw-text-blue-600">

                                    <i className="ri-arrow-left-circle-line tw-text-xl tw-mr-1" />

                                    <div
                                        onClick={backClickHndlr}
                                        className="tw-text-blue-600 hover:tw-underline tw-bg-transparent tw-border-0 tw-p-0 tw-cursor-pointer"
                                    >
                                        Back to {backTabIdState.backTitle}
                                    </div>

                                </div>
                            )}

                        </div>
                    </div>
                </div>

                <div className="tw-grid tw-grid-cols-12 tw-gap-3">

                    <div className="tw-col-span-12 lg:tw-col-span-4 xl:tw-col-span-3">
                        <div className="tw-bg-white tw-rounded-lg tw-shadow">
                            <div className="tw-p-0">

                                <ul className="left-menu-section tw-divide-y tw-divide-gray-100">
                                    {menuOptions.map((item) => (
                                        <li
                                            data-id={item.id}
                                            onClick={clickMenuHandler}
                                            key={item.id}
                                            className={`
                    tw-cursor-pointer 
                    tw-px-4 tw-py-3 
                    hover:tw-bg-gray-50 
                    ${item.id === activeMenuState.menuId
                                                    ? "tw-bg-[#4051891a] tw-text-[#405189] tw-font-medium" : "hover:tw-bg-gray-50"}
                  `}
                                        >
                                            {item.labelName}
                                        </li>
                                    ))}
                                </ul>

                            </div>
                        </div>
                    </div>

                    <div className="tw-col-span-12 lg:tw-col-span-8 xl:tw-col-span-9">
                        {activeComponent}
                    </div>

                </div>

            </div>
        </div>
    </React.Fragment>)
}

export default ModulesSettings;
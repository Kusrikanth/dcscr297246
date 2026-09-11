import React, { useCallback, useMemo, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import OrganizationDetails from './OrganizationDetails';
import Security from './Security';
import EnquiryForm from './EnquiryForm';
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import DPSLogoSM from "../../../../assets/imagesdps/mastersetup/dps_logo.png";
import { menuOptions } from './helper';
import classnames from "classnames";


const OrganizationProfile = () => {
    const [activeMenuState, setActiveMenuState] = useState<any>({
        menuId: "organization",
        activeComponentId: "organization",
    });

    const { currentInstIdResp, instituteValue, instDetailsResp } =
        useAppSelector(
            ({ appData, Layout, instituteInfo }) => ({
                instituteValue: Layout.instituteValue,
                instDetailsResp: instituteInfo.instDetailsResp,
                currentInstIdResp: appData.currentInstIdResp,
            }),
            shallowEqual
        );

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
        setActiveMenuState((prevState: any) => ({
            ...prevState, menuId,
            activeComponentId: menuId
        }));
    }

    function getActiveMenuComponent(menuId: string | null) {
        switch (menuId) {
            case "organization":
                return OrganizationDetails;
            case "security":
                return Security;
            case "enquiry-form-links":
                return EnquiryForm;
        }
    }

    const onClickSettingHndlr = useCallback((event: any) => {
        const tabId = event.currentTarget.getAttribute("data-id");
        if (tabId && activeMenuState.menuId) {
            const { labelName, id } = menuOptions.find(item => item.id === activeMenuState.menuId) || {};
            if (id && labelName) {
                setActiveMenuState((prevState: any) => ({
                    ...prevState,
                    activeComponentId: tabId
                }));
            }
        }
    }, [activeMenuState]);

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeMenuState.activeComponentId);
        if (TabComponent)
            return <TabComponent
                activeTabId={activeMenuState}
                instituteName={instDetailsResp?.instituteName}
                instituteId={currentInstIdResp}
                onClickSettingHndlr={onClickSettingHndlr}
            />
    }, [activeMenuState, instDetailsResp, instituteValue, currentInstIdResp,onClickSettingHndlr,getActiveMenuComponent]);

    return (
        <>
        <div className="page-content master-setup-wrapper">
            <div className="container-fluid tw-max-w-full">
                <BreadCrumb title="settings" pageTitle="Enquiry Management"  />
                <div className="card tw-mb-3">
                    <div className="card-body tw-py-2">
                        <div className="tw-flex tw-justify-between tw-items-center tw-px-2 tw-relative">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-flex-shrink-0 tw-w-12 tw-h-12 tw-bg-gray-100 tw-rounded-full tw-p-1 tw-mr-3">
                                    <img src={instituteValue === "DPS" ? DPSLogoSM : DPSLogoSM} className="tw-max-w-full tw-h-auto tw-block" alt="Logo" />
                                </div>
                                <div className="tw-flex tw-flex-col">
                                    <h5 className="tw-mb-0 tw-text-xl tw-font-bold">K-innovative Hub Pvt ltd</h5>
                                    <span className="tw-text-blue-500 tw-cursor-pointer">KIH001</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tw-flex tw-flex-wrap tw-gap-x-3">
                    <div className="tw-w-full lg:tw-w-1/3 xl:tw-w-1/4">
                        <div className="card">
                            <div className="card-body tw-py-0 tw-px-0">
                                <ul className="left-menu-section">
                                    {menuOptions.map((item) => <li
                                        data-id={item.id}
                                        onClick={clickMenuHandler}
                                        className={classnames(
                                            "tw-p-3 tw-cursor-pointer hover:tw-bg-gray-100",
                                            { active: item.id === activeMenuState.menuId }
                                        )}
                                        key={item.id}>
                                        {item.labelName}
                                    </li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="tw-flex-1">
                        {activeComponent}
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default OrganizationProfile
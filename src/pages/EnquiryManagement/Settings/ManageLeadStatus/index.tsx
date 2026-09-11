import React, { useCallback, useMemo, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import LeadStatus from './LeadStatus';
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { useAppSelector } from '../../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import DPSLogoSM from "../../../../assets/imagesdps/mastersetup/dps_logo.png";
import { menuOptions } from './helper';
import classnames from "classnames";


const ManageLeadStatus = () => {
  const [activeMenuState, setActiveMenuState] = useState<any>({
    menuId: "lead-status",
    activeComponentId: "lead-status",
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
        case "lead-status":
            return LeadStatus;
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
                    <div className="tw-flex tw-flex-wrap tw-gap-x-3">
                        <div className="tw-w-full lg:tw-w-1/3 xl:tw-w-1/4">
                            <div className="tw-card">
                                <div className="tw-card-body tw-py-0 tw-px-0">
                                    <ul className="tw-left-menu-section">
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

export default ManageLeadStatus
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Col, Container, Input, Label, Button, CardHeader } from "reactstrap";
import { shallowEqual } from "react-redux";
import classnames from "classnames";
import { useSelector } from "react-redux";

//Common Component
import BreadCrumb from "../../Components/Common/BreadCrumb";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";

//Component
import ProfileDetails from "./ProfileDetails";
import ChangePassword from "./ChangePassword";

//Images
import DPSLogoSM from "../../assets/imagesdps/mastersetup/dps_logo.png";
import PGSLogoSM from "../../assets/imagesdps/mastersetup/pgs-logo.png";
//Helpers
import { MenuOptions } from "./helper";
import UserSettings from "./UserSettings";

function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
        case "profile":
            return ProfileDetails;
        case "change-password":
            return ChangePassword;
        case "user-settings":
            return UserSettings;
        case "account":
            return null;
    }
}

const Profile: React.FC<any> = () => {
    const [activeMenuId, setActiveMenuId] = useState<string | null>("profile");

    const dispatch = useAppDispatch();
    const { currentInstIdResp, instituteValue, instDetailsResp } = useAppSelector(({ appData, Layout, instituteInfo }) => ({
        instituteValue: Layout.instituteValue,
        instDetailsResp: instituteInfo.instDetailsResp,
        currentInstIdResp: appData.currentInstIdResp
    }), shallowEqual);

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
        setActiveMenuId(menuId);
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeMenuId);
        if (TabComponent)
            return <TabComponent instituteName={instDetailsResp?.instituteName} instituteId={currentInstIdResp}
            />
    }, [activeMenuId, instDetailsResp, instituteValue, currentInstIdResp, getActiveMenuComponent]);

    return (<React.Fragment>
        <div className="page-content master-setup-wrapper">
            <div className="container-fluid">
                <BreadCrumb title="Profile" pageTitle="DPS" />
                {/* <Card>
                    <CardBody className="py-2">
                        <div className="d-flex justify-content-between align-items-center px-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-shrink-0 avatar-md bg-light rounded-circle p-1 me-3">
                                    <img src={instituteValue === "DPS" ? DPSLogoSM : DPSLogoSM} className="img-fluid d-block" />
                                </div>
                                <div className="d-flex flex-column">
                                    <h5 className="mb-0">{instDetailsResp?.instituteName}</h5>
                                    <span className="text-link">{instDetailsResp?.instituteCode}</span>
                                </div>
                            </div>
                            <a href="#" className="d-flex align-items-center text-info">
                                <span className="fw-medium me-1">Help Vedio</span>
                            </a>
                        </div>
                    </CardBody>
                </Card> */}
                <div className="tw-flex tw-gap-4">
                    <div className="tw-w-full lg:tw-w-1/3 xl:tw-w-1/4">
                        <div className="card">
                            <div className="card-body tw-py-0 tw-px-0">
                                <ul className="left-menu-section">
                                    {MenuOptions.map((item) => <li
                                        data-id={item.id}
                                        onClick={clickMenuHandler}
                                        className={classnames(
                                            { active: item.id === activeMenuId }
                                        )}
                                        key={item.id}>
                                        {item.labelName}
                                    </li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="tw-w-full lg:tw-w-2/3 xl:tw-w-3/4">
                        {/* <div className="card">
                            <div className="card-body">
                                In progress
                            </div>
                        </div> */}
                        {/* <Institute />
                        <Branch /> */}
                        {activeComponent}
                    </div>
                </div>
            </div>
        </div>
    </React.Fragment>)
}

export default Profile;
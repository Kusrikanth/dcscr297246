import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';

import { shallowEqual } from "react-redux";
//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import DefaultUserImg from "../../assets/imagesdps/default-user.png";

//Actions
import { generateActionPayload } from "../../utility/reduxutility";
import { logoutUserAct, setLogoutUserAct } from "../../store/login/loginaction";
import { cleanAppDataStateAct } from "../../store/appdata/appdataslice";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";
import { useHistory } from 'react-router-dom';
import { getLocalStorage, removeLocalStorage } from "../../utility/storageUtility";
import { accessSessionKey, accessTokenKey, instituteIdKey } from "../constants/storageconstants";
import store from '../../store';

const ProfileDropdown = ({ userRole, loginUserDetails }) => {
    const history = useHistory();
    const { user } = useSelector(state => ({
        user: state.Profile.user,
    }));
    const dispatch = useDispatch();
    const { logoutUserResp, loginErrorResp } = useAppSelector(({ login }) => ({
        logoutUserResp: login.logoutUserResp,
        loginErrorResp: login.loginErrorResp
    }), shallowEqual);


    // useEffect(() => {
    //     if (logoutUserResp) {
    //         history.push("/login");
    //     }
    // }, [logoutUserResp]);


    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };

    function logoutHndlr() {
        dispatch(logoutUserAct(generateActionPayload("logout_user",{sessionId : getLocalStorage(accessSessionKey)})));
        setTimeout(() => {
            dispatch(cleanAppDataStateAct({}));
            removeLocalStorage(accessTokenKey);
            removeLocalStorage(accessSessionKey);
            removeLocalStorage(instituteIdKey);
            store.dispatch({ type: "RESET_STATE" });
            dispatch(setLogoutUserAct(undefined));
        }, 100);
    }

    function profileRedirectHandler() {
        history.push({
            pathname: '/profile'
        })
    }
    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn px-0 ms-3">
                    <span className="tw-flex tw-items-center">
                        <img className="rounded-circle border header-profile-user" src={DefaultUserImg}
                            alt="Header Avatar" />
                        <span className="tw-text-start xl:tw-ms-1">
                            <span className="!tw-hidden tw-text-nowrap xl:tw-inline-block tw-ms-1 tw-font-medium user-name-text">{loginUserDetails?.userName || "-"}</span>
                            <span className="!tw-hidden tw-text-nowrap xl:tw-block tw-ms-1 tw-text-xs tw-text-gray-500 tw-capitalize user-name-sub-text">{loginUserDetails?.userRole || "-"}</span>
                        </span>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem onClick={profileRedirectHandler}><i className="mdi mdi-account-circle tw-text-gray-500 tw-text-sm tw-align-middle tw-me-1"></i>
                        <span className="tw-align-middle">Profile</span></DropdownItem>
                    {/* <DropdownItem href="/#"><i
                        className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle">Messages</span></DropdownItem> */}
                    {/* <DropdownItem href="/apps-tasks-kanban"><i
                        className="mdi mdi-calendar-check-outline text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle">Taskboard</span></DropdownItem> */}
                    {/* <DropdownItem href="/#"><i
                        className="mdi mdi-lifebuoy text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle">Help</span></DropdownItem> */}
                    <div className="dropdown-divider"></div>
                    {/* <DropdownItem href="/pages-profile"><i
                        className="mdi mdi-wallet text-muted fs-16 align-middle me-1"></i> <span
                            className="align-middle">Balance : <b>$5971.67</b></span></DropdownItem> */}
                    {/* <DropdownItem href="/pages-profile-settings"><span
                        className="badge bg-soft-success text-success mt-1 float-end">New</span><i
                            className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle">Settings</span></DropdownItem> */}
                    {/* <DropdownItem href="/auth-lockscreen-basic"><i
                        className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Lock screen</span></DropdownItem> */}
                    <DropdownItem onClick={logoutHndlr}><i
                        className="mdi mdi-logout tw-text-gray-500 tw-text-sm tw-align-middle tw-me-1"></i> <span
                            className="tw-align-middle" data-key="t-logout">Logout</span></DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;
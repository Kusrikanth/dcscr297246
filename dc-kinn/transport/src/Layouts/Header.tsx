import React, { useEffect, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Dropdown, DropdownMenu, DropdownToggle, Form, Input } from 'reactstrap';
import { shallowEqual, useSelector } from "react-redux";
//import images
import logoSm from "../assets/images/logo-sm.png";
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";

//import Components
// import LanguageDropdown from '../Components/Common/LanguageDropdown';
import WebAppsDropdown from '../Components/Common/WebAppsDropdown';
import MyCartDropdown from '../Components/Common/MyCartDropdown';
import FullScreenDropdown from '../Components/Common/FullScreenDropdown';
import NotificationDropdown from '../Components/Common/NotificationDropdown';
import ProfileDropdown from '../Components/Common/ProfileDropdown';
// import LightDark from '../Components/Common/LightDark';

//Common Component
import {
    SelectInput, TextIconInput, ProgressIndicator, ModalComponent,
    TextArea
} from "../Components/Common";


//Custom Hooks
import { useAppDispatch, useAppSelector } from "../hooks/storehook";
//Action Generator
import { generateActionPayload } from "../utility/reduxutility";
import { getInstBranchesAct } from "../store/mastersettings/branch/branchactions";
import { setVirtualRoleAct, setCurrentBranchIdAct } from "../store/appdata/appdataslice";
//Utility
import { getMonthDateFormat } from "../utility/dateutility";
//Icons

import { default as ApproveIcon } from "../assets/imagesdps/academics/ApproveSvg.svg?react";
import { getInstAcademicYearAct } from '../store/mastersettings/instacademics/instacademicactions';

interface HeaderProps {
    layoutModeType: string,
    headerClass: string,
    onChangeLayoutMode: Function
}

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }: HeaderProps) => {
    const [search, setSearch] = useState(false);
    const [selectedBranchState, setSelectedBranchState] = useState<string>("");
    const [academicYearName, setAcademicYearName] = useState<string>("");
    const history = useHistory();
    const [confirmModalState, setConfirmModalState] = useState<any>({
        switchModalType: undefined,
        branchId: undefined,
        showModal: false,
        prevSelectedState: undefined,
    });
    const [userDetailsState, setUserDetailsState] = useState({
        userName: "",
        userRole: "",
    });

    const dispatch = useAppDispatch();
    const { userDetails, instituteValue, currentInstIdResp, currentBranchIdResp, branchListResp, academicYearListResp, userMeResp }: any = useAppSelector(({ instituteInfo, Layout,
        appData, Profile, branch, instAcademics, login }) => ({
            userDetails: Profile.userDetails,
            instituteValue: Layout.instituteValue,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            branchListResp: branch.branchListResp,
            academicYearListResp: instAcademics.academicYearListResp,
            userMeResp: login.userMeResp
        }), shallowEqual);

    useEffect(() => {
        const payload = { instituteId: currentInstIdResp, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
        dispatch(
            getInstAcademicYearAct(
                generateActionPayload("get_inst_academic_year", undefined, payload)
            )
        );
    }, [])

    useEffect(() => {
        const { data } = academicYearListResp || {};
        if (Array.isArray(data) && data.length > 0) {
            let yearName = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current").academicYearName;
            setAcademicYearName(yearName)
        }
    }, [academicYearListResp]);

    useEffect(() => {
        if (currentInstIdResp) {
            // const payload = { pageSize: 100, pageNo: 0, instituteId: currentInstIdResp, approvalStatus: "APPROVED" }
            const payload = { pageSize: 100, pageNo: 0, instituteId: currentInstIdResp };
            dispatch(getInstBranchesAct(generateActionPayload("get_inst_branches", undefined, payload, { hideLoader: true })));
        }
    }, [currentInstIdResp]);
    useEffect(() => {
        if (currentBranchIdResp) {
            setSelectedBranchState(currentBranchIdResp);
        }
    }, [currentBranchIdResp]);

    useEffect(() => {
        if (userMeResp) {
            const { role, firstName, } = userMeResp;
            setUserDetailsState({
                userName: firstName && firstName.toString().trim(),
                userRole: role?.name
            });
        }
    }, [userMeResp]);

    const toogleSearch = () => {
        setSearch(!search);
    };


    const toogleMenuBtn = () => {
        var windowSize = document.documentElement.clientWidth;

        if (windowSize > 767)
            document.querySelector(".hamburger-icon")!.classList.toggle('open');

        //For collapse horizontal menu
        if (document.documentElement.getAttribute('data-layout') === "horizontal") {
            document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu");
        }

        //For collapse vertical menu
        if (document.documentElement.getAttribute('data-layout') === "vertical") {
            if (windowSize < 1025 && windowSize > 767) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'sm') ? document.documentElement.setAttribute('data-sidebar-size', '') : document.documentElement.setAttribute('data-sidebar-size', 'sm');
            } else if (windowSize > 1025) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'lg') ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'lg');
            } else if (windowSize <= 767) {
                document.body.classList.add('vertical-sidebar-enable');
                document.documentElement.setAttribute('data-sidebar-size', 'lg');
            }
        }

        //Two column menu
        if (document.documentElement.getAttribute('data-layout') === "twocolumn") {
            document.body.classList.contains('twocolumn-panel') ? document.body.classList.remove('twocolumn-panel') : document.body.classList.add('twocolumn-panel');
        }
    };

    function onChangeBranchHndlr(event: any) {
        const { name, value } = event.target;
        setSelectedBranchState(value);
        setConfirmModalState((prevState: any) => ({
            ...prevState,
            switchModalType: value ? "branch" : "institute",
            branchId: value,
            showModal: true,
            prevSelectedState: selectedBranchState
        }));
    }

    function confirmHandler() {
        const { branchId, switchModalType } = confirmModalState;
        if (switchModalType === "institute") {
            dispatch(setVirtualRoleAct(undefined));
            dispatch(setCurrentBranchIdAct(undefined));
            history.push("/dashboard");
        } else {
            dispatch(setVirtualRoleAct("BRANCH_ADMIN"));
            dispatch(setCurrentBranchIdAct(branchId));
            history.push("/branch-dashboard");
        }
        setConfirmModalState((prevState: any) => ({
            ...prevState,
            showModal: false,
        }));
    }

    function closeModalHndlr() {
        setSelectedBranchState(confirmModalState.prevSelectedState);
        setConfirmModalState((prevState: any) => ({
            switchModalType: undefined,
            branchId: undefined,
            showModal: false,
            prevSelectedState: undefined
        }));
    }

    const { role = "INSTITUTE_ADMIN" }: any = userDetails || {},
        { data: branchList } = branchListResp || {};

    const branchesData = useMemo(() => {
        if (Array.isArray(branchList)) {
            const updatedBranchesList = [...branchList]
            updatedBranchesList.sort((a, b) => a?.branchId - b?.branchId);
            return updatedBranchesList.map((item, index) => ({ ...item, displayName: `${item.branchId}: ${item.shortName} - ${item.branchName}` }))
        }
        return [];
    }, [branchList]);
    return (
        <React.Fragment>
            <header id="page-topbar" className={headerClass}>
                <div className="layout-width">
                    <div className="navbar-header">
                        <div className="d-flex">

                            <div className="navbar-brand-box horizontal-logo">
                                <Link to="/" className="logo logo-dark">
                                    <span className="logo-sm">
                                        <img src={logoSm} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoDark} alt="" height="17" />
                                    </span>
                                </Link>

                                <Link to="/" className="logo logo-light">
                                    <span className="logo-sm">
                                        <img src={logoSm} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoLight} alt="" height="17" />
                                    </span>
                                </Link>
                            </div>

                            <button
                                onClick={toogleMenuBtn}
                                type="button"
                                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                                id="topnav-hamburger-icon">
                                <span className="hamburger-icon">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button>


                            {/* <SearchOption /> */}
                        </div>

                        <div className="d-flex align-items-center">

                            {/* <Dropdown isOpen={search} toggle={toogleSearch} className="d-md-none topbar-head-dropdown header-item">
                                <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                                    <i className="bx bx-search fs-22"></i>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
                                    <Form className="p-3">
                                        <div className="form-group m-0">
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Search ..."
                                                    aria-label="Recipient's username" />
                                                <button className="btn btn-primary" type="submit"><i
                                                    className="mdi mdi-magnify"></i></button>
                                            </div>
                                        </div>
                                    </Form>
                                </DropdownMenu>
                            </Dropdown> */}

                            {(role === "INSTITUTE_ADMIN" || role === "BRANCH_ADMIN") && <div className="d-flex ms-3">
                                <span className="text-dark fw-medium me-1">Academic Year:</span>
                                <span className="text-muted">{academicYearName}</span>
                            </div>}
                            {(role === "INSTITUTE_ADMIN") && <div className="d-flex align-items-center ms-3">
                                <span className="text-dark fw-medium me-1">Campus:</span>
                                <div style={{ width: "120px" }}>
                                    <SelectInput
                                        name="branch"
                                        value={selectedBranchState}
                                        onChange={onChangeBranchHndlr}
                                        menuItems={branchesData || []}
                                        valueKey="branchId"
                                        textKey="displayName"
                                        inputClassName="form-select-sm"
                                        formgroupClassName="mb-0"
                                        defaultSelect="Institute"
                                    // isDisabled={true}
                                    // hideSelectOption={true}
                                    />
                                    {/* <Input
                                        name="product"
                                        type="select"
                                        className="form-select-sm"
                                    >
                                        {campusState.map(item => (
                                            <option key={item.name} value={item.name}>{item.name}</option>
                                        ))}

                                    </Input> */}

                                </div>
                            </div>}
                            <div className="d-flex ms-3 align-items-center">
                                <i className="text-muted ri-calendar-2-fill fs-16 me-1"></i>
                                {/* <span className="text-muted">September 2nd, 2022</span> */}
                                <span className="text-muted">{getMonthDateFormat(new Date())}</span>

                            </div>

                            {/* LanguageDropdown */}
                            {/* <LanguageDropdown /> */}

                            {/* WebAppsDropdown */}
                            {/* <WebAppsDropdown /> */}

                            {/* MyCartDropdwon */}
                            {/* <MyCartDropdown /> */}

                            {/* FullScreenDropdown */}
                            {/* <FullScreenDropdown /> */}

                            {/* Dark/Light Mode set */}
                            {/* <LightDark
                                layoutMode={layoutModeType}
                                onChangeLayoutMode={onChangeLayoutMode}
                            /> */}

                            {/* NotificationDropdown */}
                            {/* <NotificationDropdown /> */}
                            {/* ProfileDropdown */}
                            <ProfileDropdown loginUserDetails={userDetailsState} userRole={role} />
                        </div>
                    </div>
                </div>
            </header>

            <ModalComponent
                id="toggle-view-modal"
                // modalTitle="Change Password"
                hideHeader={true}
                hideFooter={true}
                isOpen={confirmModalState.showModal}
                toggle={closeModalHndlr}
                cancelHndlr={closeModalHndlr}
                modalBodyClass="py-4"
                modalSize="md"
            >
                <div className="d-flex flex-column align-items-center">
                    <div className="d-flex mb-4">
                        <ApproveIcon style={{ height: "70px", width: "70px", fill: "#16A99A" }} />
                    </div>
                    <h5 className="flex-grow-1 mb-2">You want to switch the Account to {(confirmModalState.switchModalType) === "branch" ? "Branch Admin" : "Institute Admin"}?</h5>
                    <span className="flex-grow-1 fw-normal mb-3">
                        You can view the UI for of {(confirmModalState.switchModalType) === "branch" ? "Branch Admin" : "Institute Admin"}.
                    </span>
                    <div className="text-align-center mt-4">
                        <button type="button"
                            className="btn btn-light me-2" onClick={closeModalHndlr}>Cancel</button>
                        <button type="button"
                            className="btn btn-success" onClick={confirmHandler}>Confirm</button>
                    </div>
                </div>
            </ModalComponent>

        </React.Fragment>
    );
};

export default Header;
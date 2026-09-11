import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
import classNames from "classnames";
import HeaderLogoImg from "../../assets/imagesdps/authicon/header-logo.png";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";

import StudentDetais from "./StudentDetails";
import CocurriculurActivity from "./CoCurriculurActivity";
import SiblingDetails from "./SiblingDetails";
import CommunicationDetails from "./Communications";
import ParentGuardian from "./ParentGuardian";
import Documents from "./Documents";
import Submissions from "./Submissions";
//Helper
import { getProfileDataFromSaleInfo, stepInfo, StepperFormContext, TABS_ACTIONS } from "./helper";
import UploadPhotos from "./UploadPhotos";
//Action Generator
import { generateActionPayload } from "../../utility/reduxutility";
import {
    getApplicationSaleByApplicationNoAct
} from "../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import {
    getLoggedInUserRegistrationInfoAct
} from "../../store/FrontDesk/AdmissionRegistration/admissionregistrationaction";
import { logoutUserAct, setLogoutUserAct } from "../../store/login/loginaction";
import { cleanAppDataStateAct } from "../../store/appdata/appdataslice";
import { removeLocalStorage } from "../../utility/storageUtility";
import { accessTokenKey } from "../../Components/constants/storageconstants";
import { getInstituteListAct } from "../../store/mastersettings/instituteinfo/instituteinfoactions";
import { Button } from "../../Components/Common";

function getActiveTabComponent(tabId: string) {
    switch (tabId) {
        case "studentProfile":
            return StudentDetais;
        case "coCurriculumActivity":
            return CocurriculurActivity;
        case "siblingDetails":
            return SiblingDetails;
        case "parentData":
            return ParentGuardian;
        case "communicationDetails":
            return CommunicationDetails;
        case "documents":
            return Documents;
        case "upload":
            return UploadPhotos;
        case "submission":
            return Submissions;
        default:
            return null;
    }
}

export default function NewRegistration() {
    const [activeStepId, setActiveStepId] = useState("");
    const history = useHistory();
    const [isResubmissionState, setIsResubmissionState] = useState(false);
    const [stepInfoState, setStepInfoState] = useState(stepInfo);
    const [tabsSharingData, setTabsSharingData] = useState<any>(null);
    const [activeStepDetails, setActiveStepDetails] = useState({
        stepIndex: 0,
        title: "Student Profile"
    })
    const [activeSubFormKeyState, setActiveSubFormKeyState] = useState<any>([]);
    const [showMobileMenuState, setShowMobileMenuState] = useState(false);
    const desiredTabDetailState = useRef({
        action: "",
        stepId: "",
    });
    const [studentIdState, setStudentIdState] = useState<any>("");
    const [tabsDataState, setTabsDataState] = useState<any>({
        studentProfile: null,
        coCurriculumActivity: null,
        siblingDetails: null,
        parentData: null,
        communicationDetails: null,
        documents: null,
        upload: null,
        submission: null
    });
    const [filledTabState, setFilledTabState] = useState<any>({
        studentProfile: false,
        coCurriculumActivity: false,
        siblingDetails: false,
        parentData: false,
        communicationDetails: false,
        documents: false,
        upload: false,
        submission: false
    });
    const [globalDataState, setGlobalData] = useState({
        isStartClass: false,
        isHigherClass: false,
        districtId: ""
    })

    const dispatch = useAppDispatch();
    const { userMeResp, logoutUserResp, applicationSaleByApplicationNo, loggedInUserRegistrationInfoResp,
        currentInstIdResp: instituteId, currentBranchIdResp: branchId, instituteListResp,
        admissionRegistrationErrorResp, applicationSaleError } = useAppSelector(({ applicationSale,
            admissionRegistration, instituteInfo,
            login, appData }) => ({
                userMeResp: login.userMeResp,
                logoutUserResp: login.logoutUserResp,
                applicationSaleByApplicationNo: applicationSale.applicationSaleByApplicationNo,
                loggedInUserRegistrationInfoResp: admissionRegistration.loggedInUserRegistrationInfoResp,
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                applicationSaleError: applicationSale.applicationSaleError,
                instituteListResp: instituteInfo.instituteListResp,
                admissionRegistrationErrorResp: admissionRegistration.admissionRegistrationErrorResp
            }), shallowEqual);

    const newRegistrationRef = useRef<any>({
        prevLogoutUserResp: logoutUserResp,
        prevLoggedInUserRegistrationInfoResp: loggedInUserRegistrationInfoResp,
        prevApplicationSaleByApplicationNo: applicationSaleByApplicationNo,
        prevApplicationSaleError: applicationSaleError,
        prevAdmissionRegistrationErrorResp: admissionRegistrationErrorResp
    });

    useEffect(() => {
        if (userMeResp) {
            const { username } = userMeResp;
            dispatch(getLoggedInUserRegistrationInfoAct(generateActionPayload("registrationinfo_byusername", {
                userName: username
            })));
        }
    }, [userMeResp]);

    useEffect(() => {
        const params = { instituteGroupId: "1", pageNo: 0, pageSize: 10, };
        dispatch(getInstituteListAct(generateActionPayload("get_institute_list", undefined, params)));
    }, []);

    useEffect(() => {
        function hideMenuOptions() {
            setShowMobileMenuState(false);
        }
        if (showMobileMenuState) {
            window.addEventListener('click', hideMenuOptions);
        } else {
            window.removeEventListener('click', hideMenuOptions);
        }
        return () => {
            window.removeEventListener('click', hideMenuOptions);
        };
    }, [showMobileMenuState]);

    useEffect(() => {
        const { prevLoggedInUserRegistrationInfoResp,
            prevApplicationSaleByApplicationNo,
            prevLogoutUserResp, prevApplicationSaleError, prevAdmissionRegistrationErrorResp } = newRegistrationRef.current;
        if (loggedInUserRegistrationInfoResp && prevLoggedInUserRegistrationInfoResp !== loggedInUserRegistrationInfoResp) {
            const { registrationId, admissionProcess, registrationNo, branchEmail, schoolName, completionStatus, profileStatus, applicationNumber: applicationSaleNumber } = loggedInUserRegistrationInfoResp;
            if (completionStatus?.toString().toLowerCase() === "complete" && admissionProcess !== "DOCUMENTS RESUBMISSION") {
                history.replace(`/thank-you-page`, {
                    registrationId,
                    registrationNo,
                    branchEmail,
                    schoolName
                });
                return;
            }
            if (completionStatus?.toString().toLowerCase() === "complete" && admissionProcess === "DOCUMENTS RESUBMISSION") {
                const updatedStepInfo = stepInfo.map(item => {
                    if (item.id === 'documents' || item.id === 'upload') {
                        return { ...item, isEnabled: true, isFilled: true };
                    }
                    return { ...item, isEnabled: false, isFilled: true };
                });
                const indexOfDocument = updatedStepInfo.findIndex(item => item.id === 'documents'),
                    { id, title, isFilled } = updatedStepInfo[indexOfDocument] || {};
                setActiveStepDetails({
                    stepIndex: indexOfDocument,
                    title: title
                })
                setStepInfoState(updatedStepInfo);
                setActiveStepId(id);
                setIsResubmissionState(true);
            } else {
                setActiveStepId("studentProfile");
            }
            if (registrationId) {
                setStudentIdState(registrationId);
            }
            dispatch(getApplicationSaleByApplicationNoAct(generateActionPayload("application_sale_bynum", {
                applicationNumber: applicationSaleNumber
            }, { branchId })));
        } else if (applicationSaleByApplicationNo && prevApplicationSaleByApplicationNo !== applicationSaleByApplicationNo) {
            const { registrationId } = loggedInUserRegistrationInfoResp;
            if (Array.isArray(applicationSaleByApplicationNo)) {
                if (!registrationId) {
                    const profileData = getProfileDataFromSaleInfo(applicationSaleByApplicationNo[0]);
                    setTabsDataHandler("studentProfile", profileData);
                }
            }
        } else if (logoutUserResp && prevLogoutUserResp !== logoutUserResp) {
            dispatch(setLogoutUserAct(undefined));
            dispatch(cleanAppDataStateAct({}));
            removeLocalStorage(accessTokenKey);
        } else if (admissionRegistrationErrorResp && prevAdmissionRegistrationErrorResp !== admissionRegistrationErrorResp) {
            const { details }: any = admissionRegistrationErrorResp;
            toast.error(details || "Something went wrong.");
        } else if (applicationSaleError && prevApplicationSaleError !== applicationSaleError) {
            const { message, } = applicationSaleError;
            toast.error(message || "Something went wrong.");
        }
        newRegistrationRef.current.prevLoggedInUserRegistrationInfoResp = loggedInUserRegistrationInfoResp;
        newRegistrationRef.current.prevApplicationSaleByApplicationNo = applicationSaleByApplicationNo;
        newRegistrationRef.current.prevLogoutUserResp = logoutUserResp;
        newRegistrationRef.current.prevApplicationSaleError = applicationSaleError;
        newRegistrationRef.current.prevAdmissionRegistrationErrorResp = admissionRegistrationErrorResp;
    }, [logoutUserResp, applicationSaleByApplicationNo,
        loggedInUserRegistrationInfoResp, applicationSaleError, admissionRegistrationErrorResp]);

    const nextStepHndlr = (stepKey: any, updatedTabsData: any) => {
        const { stepId, action } = desiredTabDetailState.current;
        if (action === TABS_ACTIONS.PARTICULAR_TAB) {
            setActiveStepId(stepId);
            const stepIndex = stepInfoState.findIndex(item => item.id === stepId);
            setActiveStepDetails({
                stepIndex: stepIndex,
                title: stepInfoState[stepIndex].title
            })
        } else if (action === TABS_ACTIONS.NEXT_TAB) {
            const indexOfCurrentStep = stepInfoState.findIndex(item => item.id === activeStepId),
                currentStepInfo = stepInfoState[indexOfCurrentStep];
            if (indexOfCurrentStep >= 0) {
                const nextStepInfo = stepInfoState[indexOfCurrentStep + 1];
                setActiveStepId(nextStepInfo.id);
                setActiveStepDetails({
                    stepIndex: indexOfCurrentStep + 1,
                    title: nextStepInfo.title
                });

                //testing
                const updatedStepInfo = [...stepInfoState];
                updatedStepInfo.splice(indexOfCurrentStep, 1, { ...currentStepInfo, isFilled: true });
                setStepInfoState(updatedStepInfo);
            }
        } else if (action === TABS_ACTIONS.PREVIOUS_TAB) {
            const indexOfCurrentStep = stepInfoState.findIndex(item => item.id === activeStepId);
            if (indexOfCurrentStep >= 0) {
                const prevStepInfo = stepInfoState[indexOfCurrentStep - 1];
                setActiveStepId(prevStepInfo.id);
                setActiveStepDetails({
                    stepIndex: indexOfCurrentStep - 1,
                    title: prevStepInfo.title
                })
            }
        }
        setFilledTabState((prevState: any) => ({ ...prevState, [stepKey]: true }));
        setTabsDataState((prevState: any) => ({ ...prevState, [stepKey]: updatedTabsData }));
        desiredTabDetailState.current = {
            action: "",
            stepId: "",
        }
    }

    // function prevStepHndlr() {
    //     const indexOfCurrentStep = stepInfoState.findIndex(item => item.id === activeStepId);
    //     if (indexOfCurrentStep >= 0) {
    //         const prevStepInfo = stepInfoState[indexOfCurrentStep - 1];
    //         setActiveStepId(stepInfoState[indexOfCurrentStep - 1].id);
    //         setActiveStepDetails({
    //             stepIndex: indexOfCurrentStep - 1,
    //             title: prevStepInfo.title
    //         })
    //     }
    // }

    function updateTabsCommonData(data: any) {
        if (Object.keys(data).length > 0) {
            setTabsSharingData((prevState: any) => ({ ...prevState, ...data }));
        }
    }


    function tabClickHandler(event: any) {
        event.preventDefault();
        const tabId = event.currentTarget.getAttribute("data-id"),
            clickedTabStepIndex = stepInfoState.findIndex(item => item.id === tabId),
            activeTabStepIndex = stepInfoState.findIndex(item => item.id === activeStepId),
            currentTabFormsKeys = stepInfoState[activeTabStepIndex];

        // setTimeout(() => {
        //     const stepIndex = stepInfoState.findIndex(item => item.id === tabId);
        //     setActiveStepDetails({
        //         stepIndex: stepIndex,
        //         title: stepInfoState[stepIndex].title
        //     })
        //     setActiveStepId(tabId);
        // }, 500);
        // return
        if (clickedTabStepIndex <= activeTabStepIndex && !filledTabState[activeStepId]) {
            setActiveSubFormKeyState([]);
            setActiveStepId(stepInfoState[clickedTabStepIndex].id);
            setActiveStepDetails({
                stepIndex: clickedTabStepIndex,
                title: stepInfoState[clickedTabStepIndex].title
            })
        } else if (currentTabFormsKeys) {
            // setDesiredTabDetailState((prevState: any) => ({
            //     ...prevState, stepId: tabId, action:
            //         TABS_ACTIONS.PARTICULAR_TAB,
            // }));
            desiredTabDetailState.current = {
                stepId: tabId,
                action: TABS_ACTIONS.PARTICULAR_TAB,
            }
            setActiveSubFormKeyState((prevState: any) => ([...currentTabFormsKeys.multiFormKeys]));
        }
    }


    function submitCurrentFormCllbck(multiformKeys: any, submitActionKey?: any) {
        const indexOfCurrentStep = stepInfoState.findIndex(item => item.id === activeStepId);
        if (submitActionKey === TABS_ACTIONS.PREVIOUS_TAB && !filledTabState[activeStepId]) {
            const prevStepInfo = stepInfoState[indexOfCurrentStep - 1];
            setActiveSubFormKeyState([]);
            setActiveStepId(prevStepInfo.id);
            setActiveStepDetails({
                stepIndex: indexOfCurrentStep - 1,
                title: prevStepInfo.title
            })
        } else if (Array.isArray(multiformKeys)) {
            // setDesiredTabDetailState((prevState: any) => ({
            //     ...prevState, stepId: "", action: submitActionKey
            // }));
            desiredTabDetailState.current = {
                stepId: "",
                action: submitActionKey,
            }
            setActiveSubFormKeyState((prevState: any) => ([...multiformKeys]));
        }
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveTabComponent(activeStepId);
        if (TabComponent)
            return <TabComponent
                branchId={branchId}
                instituteId={instituteId}
                stepId={activeStepId}
            />
    }, [activeStepId, branchId, instituteId]);

    function setTabsDataHandler(stepKey: string, tabData: any) {
        const updateTabData = { ...tabsDataState };
        if (Object.prototype.hasOwnProperty.call(updateTabData, stepKey)) {
            setTabsDataState((prevState: any) => ({ ...prevState, [stepKey]: { ...prevState?.[stepKey], ...tabData } }))
        }
    }

    function menuToggle(event: any) {
        event.stopPropagation();
        setShowMobileMenuState(!showMobileMenuState);
    }

    function logoutHndlr() {
        dispatch(logoutUserAct(generateActionPayload("logout_user")));
        setTimeout(() => {
            dispatch(setLogoutUserAct(undefined));
            dispatch(cleanAppDataStateAct({}));
            removeLocalStorage(accessTokenKey);
            removeLocalStorage(instituteId);
        }, 100);
    }

    const lastActiveStepIndex = useMemo(() => {
        let index = 0,
            totalSteps = stepInfoState.length;
        for (let i = 0; i < stepInfoState.length; i++) {
            if (!stepInfoState[i].isFilled || i === (totalSteps - 1)) {
                index = i;
                break;
            }
        }
        return index;
    }, [stepInfoState]);

    const instituteDetails = useMemo(() => {
        const { data: instituteList } = instituteListResp || {};
        if (Array.isArray(instituteList)) {
            return instituteList?.find(item => item.id === +instituteId);
        }
        return {};
    }, [instituteId, instituteListResp]);

    return (
        <div className="registration-container">
            <div className="tw-px-3 tw-py-2 tw-mb-3 header-container">
                {/* <img src={HeaderLogoImg} alt="header-logo"
                    className="header-logo img-fluid"
                /> */}
                <img src={instituteDetails?.logo} className="header-logo img-fluid"
                    alt="header-logo" style={{ maxWidth: '100%' }} />
                <div className="tw-hidden md:tw-block">
                    <Button  onClick={logoutHndlr} variant="primary">
                        <i className="ri-logout-box-r-line tw-align-bottom tw-me-1"></i> Logout
                    </Button >
                </div>
                <div
                    className={classNames('hamburger-icon', {
                        active: showMobileMenuState,
                    })}
                    // ref={btnToggle}
                    onClick={menuToggle}
                >
                    <span></span>
                </div>
            </div>
            <div className={classNames("mobiletabs-container tw-mb-3", {
                "show-menu": showMobileMenuState
            })}>
                <ul className="mobiletab-items">
                    {
                        stepInfoState.map((item, index) => {
                            return (
                                <li className={classNames("mobiletab-item",
                                    (item.id === activeStepId ? "active" : ""))}
                                    key={item.id}>
                                    <a
                                        onClick={tabClickHandler}
                                        data-id={item?.id}
                                        href="#"
                                        className={classNames("mobiletab-link", {
                                            "active": (item.id === activeStepId && item.isEnabled),
                                            "filled": (item.isFilled && item.isEnabled),
                                        },
                                            (!item.isEnabled || index > lastActiveStepIndex) ? "disabled" : "")}>
                                        <span className={classNames("icon-container tw-me-1")}>
                                            {item.iconImage}
                                        </span>
                                        {item.title}
                                    </a>
                                </li>
                            )
                        })
                    }
                </ul>
                <div className="tw-flex tw-flex-col tw-p-3">
                    {/* <button
                        type="button"
                        className="btn text-nowrap btn-orange w-100 mb-3"
                        onClick={() => { }}
                    >
                        DOWNLOAD PROSPECTUS
                    </button> */}
                    <Button onClick={logoutHndlr} variant="primary">
                        <i className="ri-logout-box-r-line tw-align-bottom tw-me-1"></i> Logout
                    </Button>
                </div>

            </div>
            <div className="tw-w-full tw-px-4">
                <div className="tw-flex tw-justify-center">
                    <div className="tw-w-full lg:tw-w-11/12">
                        <div className="ng-card">
                            <div className="ng-body">
                                <div className="tw-flex tw-flex-wrap tw-gap-2 tw-items-center tw-justify-between tw-mb-2 md:tw-mb-4">
                                    <h4 className="tw-mb-0">REGISTRATION FORM</h4>
                                    {/* <button
                                        type="button"
                                        className="d-none d-md-block btn text-nowrap btn-orange"
                                        onClick={() => { }}
                                    >
                                        DOWNLOAD PROSPECTUS
                                    </button> */}
                                </div>
                                <div className="tw-flex tw-items-end md:tw-hidden tw-mb-2">
                                    <span className="tw-text-[12px] tw-me-1">Step {activeStepDetails?.stepIndex + 1}:</span>
                                    <h5 className="tw-mb-0 tw-text-orange-500 tw-font-normal">{activeStepDetails?.title}</h5>
                                </div>

                                <div className="ngtabs-container tw-mb-3">
                                    <ul className="tab-items">
                                        {
                                            stepInfoState.map((item, index) => {
                                                const isTabFilled = filledTabState[item?.id];
                                                return (
                                                    <li className={classNames("tab-item",
                                                        (item.id === activeStepId ? "active" : ""))}
                                                        key={item.id}>
                                                        <a
                                                            onClick={tabClickHandler}
                                                            data-id={item?.id}
                                                            href="#"
                                                            className={classNames("tab-link",
                                                                {
                                                                    "active": (item.id === activeStepId && item.isEnabled),
                                                                    "filled": (item.isFilled && item.isEnabled),
                                                                },
                                                                (!item.isEnabled || index > lastActiveStepIndex) ? "disabled" : "")}>
                                                            <span className={classNames("icon-container tw-me-1")}>
                                                                {item.iconImage}
                                                            </span>
                                                            {item.title}
                                                            {(index < (stepInfoState?.length - 1)) && <div className={classNames(`triangle-wrapper`,
                                                                (item.id === activeStepId) ? 'tw-block' : 'tw-hidden')}>
                                                                <div className="triangle-border triangle-border-inner"></div>
                                                            </div>}
                                                        </a>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                                <div>
                                    <StepperFormContext.Provider value={{
                                        isResubmission: isResubmissionState,
                                        tabsSharingData: tabsSharingData,
                                        setTabsSharingData: setTabsSharingData,
                                        currentMultiFormKeys: activeSubFormKeyState,
                                        studentId: studentIdState,
                                        setStudentIdHndlr: setStudentIdState,
                                        nextStepHndlr: nextStepHndlr,
                                        submitCurrentFormCllbck: submitCurrentFormCllbck,
                                        tabsData: tabsDataState,
                                        tabsFilledInfo: filledTabState,
                                        instituteDetails: instituteDetails,
                                        setTabsDataHandler: setTabsDataHandler
                                    }}>
                                        {activeComponent}
                                    </StepperFormContext.Provider>
                                </div>

                            </div>
                            <div className="ng-footer">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
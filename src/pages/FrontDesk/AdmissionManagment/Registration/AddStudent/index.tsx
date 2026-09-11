import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
import {
    HorizontalWizard
} from "../../../../../Components/Common";
import classNames from "classnames";
// Common Component
import BreadCrumb, { BreadCrumbUpdated } from "../../../../../Components/Common/BreadCrumb";

//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";

import StudentDetais from "./StudentDetails";
import CocurriculurActivity from "./CoCurriculurActivity";
import SiblingDetails from "./SiblingDetails";
import CommunicationDetails from "./Communications";
import ParentGuardian from "./ParentGuardian";
import Documents from "./Documents";
import Submissions from "./Submissions";
//Helper
import { stepInfo, StepperFormContext, TABS_ACTIONS } from "./helper";
import UploadPhotos from "./UploadPhotos";
//Action Generator

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
    const [activeStepId, setActiveStepId] = useState("studentProfile");
    const [stepInfoState, setStepInfoState] = useState(stepInfo);
    const [isViewModeState, setViewModeState] = useState(false);
    const location = useLocation();
    const [activeSubFormKeyState, setActiveSubFormKeyState] = useState<any>([]);
    const [showMobileMenuState, setShowMobileMenuState] = useState(false);
    const desiredTabDetailState = useRef({
        action: "",
        stepId: "",
    });
    const { pathname, state } = location,
        { registrationId }: any = state || {};
    const [studentIdState, setStudentIdState] = useState<any>(registrationId);
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

    const dispatch = useAppDispatch();
    const { currentInstIdResp: instituteId, currentBranchIdResp: branchId, instituteListResp,
        admissionRegistrationErrorResp, applicationSaleError } = useAppSelector(({ applicationSale,
            admissionRegistration,
            instituteInfo, appData }) => ({
                currentInstIdResp: appData.currentInstIdResp,
                currentBranchIdResp: appData.currentBranchIdResp,
                applicationSaleError: applicationSale.applicationSaleError,
                instituteListResp: instituteInfo.instituteListResp,
                admissionRegistrationErrorResp: admissionRegistration.admissionRegistrationErrorResp
            }), shallowEqual);

    const newRegistrationRef = useRef<any>({
        prevApplicationSaleError: applicationSaleError,
        prevAdmissionRegistrationErrorResp: admissionRegistrationErrorResp
    });

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
        const { prevApplicationSaleError, prevAdmissionRegistrationErrorResp } = newRegistrationRef.current;
        if (admissionRegistrationErrorResp && prevAdmissionRegistrationErrorResp !== admissionRegistrationErrorResp) {
            const { details }: any = admissionRegistrationErrorResp;
            toast.error(details || "Something went wrong.");
        } else if (applicationSaleError && prevApplicationSaleError !== applicationSaleError) {
            const { message, } = applicationSaleError;
            toast.error(message || "Something went wrong.");
        }
        newRegistrationRef.current.prevApplicationSaleError = applicationSaleError;
        newRegistrationRef.current.prevAdmissionRegistrationErrorResp = admissionRegistrationErrorResp;
    }, [applicationSaleError, admissionRegistrationErrorResp]);

    useEffect(() => {
        if (pathname.includes("view-registration")) {
            setViewModeState(true);
        }
    }, [pathname]);
    const nextStepHndlr = (stepKey: any, updatedTabsData: any) => {
        const { stepId, action } = desiredTabDetailState.current;
        if (action === TABS_ACTIONS.PARTICULAR_TAB) {
            setActiveStepId(stepId);
            const stepIndex = stepInfoState.findIndex(item => item.id === stepId);
        } else if (action === TABS_ACTIONS.NEXT_TAB) {
            const indexOfCurrentStep = stepInfoState.findIndex(item => item.id === activeStepId),
                currentStepInfo = stepInfoState[indexOfCurrentStep];
            if (indexOfCurrentStep >= 0) {
                const nextStepInfo = stepInfoState[indexOfCurrentStep + 1];
                setActiveStepId(nextStepInfo.id);
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
            }
        }
        setFilledTabState((prevState: any) => ({ ...prevState, [stepKey]: true }));
        setTabsDataState((prevState: any) => ({ ...prevState, [stepKey]: updatedTabsData }));
        desiredTabDetailState.current = {
            action: "",
            stepId: "",
        }
    }

    function tabClickHandler(tabId: any) {
        const clickedTabStepIndex = stepInfoState.findIndex(item => item.id === tabId),
            activeTabStepIndex = stepInfoState.findIndex(item => item.id === activeStepId),
            currentTabFormsKeys = stepInfoState[activeTabStepIndex];
        if (isViewModeState) {
            setActiveStepId(tabId);
            return;
        }
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
        } else if (currentTabFormsKeys) {
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
                isEditMode={!!registrationId}
            />
    }, [activeStepId, registrationId]);

    function setTabsDataHandler(stepKey: string, tabData: any, reset?: boolean) {
        const updateTabData = { ...tabsDataState };
        if (Object.prototype.hasOwnProperty.call(updateTabData, stepKey)) {
            if (reset) {
                setTabsDataState((prevState: any) => ({ ...prevState, [stepKey]: { ...tabData } }))
            } else {
                setTabsDataState((prevState: any) => ({ ...prevState, [stepKey]: { ...prevState?.[stepKey], ...tabData } }))
            }
        }
    }

    const instituteDetails = useMemo(() => {
        const { data: instituteList } = instituteListResp || {};
        if (Array.isArray(instituteList)) {
            return instituteList?.find(item => item.id === +instituteId);
        }
        return {};
    }, [instituteId, instituteListResp]);

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb pageTitle="Admissions" />

                <div className="tw-flex tw-justify-center tw-mb-5">
                    <div className="tw-w-full">
                        <div className="tw-flex tw-flex-wrap">
                            <div className="tw-w-full">
                                <div className="tw-bg-white tw-rounded-lg tw-shadow">
                                    <div className="tw-p-6">
                                        <HorizontalWizard
                                            updateStepHndlr={tabClickHandler}
                                            stepsList={stepInfoState}
                                            activeStepId={activeStepId}
                                        />

                                        <div className="tw-pt-4 tw-pb-3">
                                            <StepperFormContext.Provider
                                                value={{
                                                    isViewMode: isViewModeState,
                                                    currentMultiFormKeys: activeSubFormKeyState,
                                                    studentId: studentIdState,
                                                    setStudentIdHndlr: setStudentIdState,
                                                    nextStepHndlr: nextStepHndlr,
                                                    submitCurrentFormCllbck: submitCurrentFormCllbck,
                                                    tabsData: tabsDataState,
                                                    tabsFilledInfo: filledTabState,
                                                    instituteDetails: instituteDetails,
                                                    setTabsDataHandler: setTabsDataHandler
                                                }}
                                            >
                                                {activeComponent}
                                            </StepperFormContext.Provider>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

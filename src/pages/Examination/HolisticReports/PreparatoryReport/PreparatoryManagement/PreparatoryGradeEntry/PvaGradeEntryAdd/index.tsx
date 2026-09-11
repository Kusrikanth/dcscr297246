import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { shallowEqual } from "react-redux";
import GeneralInformation from "./GeneralInformation";
import { stepInfo, StepperFormContext, TABS_ACTIONS } from "./helper";
import { useAppDispatch, useAppSelector } from "../../../../../../../hooks/storehook";
import BreadCrumb from "../../../../../../../Components/Common/BreadCrumb";
import { HorizontalWizard } from "../../../../../../../Components/Common";
import DomainAssessment from "./Domain";
import StudentSurroundings from "./StudentSurroundings";
import StudentFeedback from "./StudentFeedback";
import ParentFeedback from "./ParentFeedback";
import Summary from "./Summary";
import { resetGetStudentByIdAct } from "../../../../../../../store/directory/studentmanagement/studentmanagementslice";
import { setPreparatoryGradeEntryListByIdAct, setPreparatorySummaryByIdAct, setSavePreparatoryDomainStudentsAct, setSavePreparatoryGradeEntryListAct, setSavePreparatoryParentFeedbackAct, setSavePreparatoryStudentFeedbackAct, setSavePreparatoryStudentSurroundingAct, setSavePreparatorySummaryAct, setUpdatePreparatoryDomainStudentsAct, setUpdatePreparatoryGradeEntryListAct } from "../../../../../../../store/examination/examinationsettings/examinationsettingsslice";
import { setUploadFamilySurroundingPhotoAct } from "../../../../../../../store/examination/examinationmanagement/examinationmanagementslice";

function getActiveTabComponent(tabId: string) {
    switch (tabId) {
        case "generalInformation":
            return GeneralInformation;
        case "studentSurroundings":
            return StudentSurroundings;
        case "studentFeedback":
            return StudentFeedback;
        case "parentFeedback":
            return ParentFeedback;
        case "domainAssessment":
            return DomainAssessment;
        case "summary":
            return Summary;
        default:
            return null;
    }
}

export default function PrepatoryGraderyEntryAdd() {
    const [activeStepId, setActiveStepId] = useState("generalInformation");
    const [currentStepValidation, setCurrentStepValidation] = useState<(() => Promise<boolean>) | null>(null);
    const [stepInfoState, setStepInfoState] = useState(stepInfo);
    const [isViewModeState, setViewModeState] = useState(false);
    const location = useLocation<any>();
    const [activeSubFormKeyState, setActiveSubFormKeyState] = useState<any>([]);
    const [showMobileMenuState, setShowMobileMenuState] = useState(false);
    const desiredTabDetailState = useRef({
        action: "",
        stepId: "",
    });
    const { pathname, state } = location;
    const [reportIdState, setReportIdState] = useState<any>(null);
    const [tabsDataState, setTabsDataState] = useState<any>({
        generalInformation: null,
        studentSurroundings: null,
    });
    const [filledTabState, setFilledTabState] = useState<any>({
        generalInformation: false,
        studentSurroundings: false,
    });

    const dispatch = useAppDispatch();
    const { currentInstIdResp: instituteId, currentBranchIdResp: branchId, getPreparatoryGradeEntryListByIdResp } = useAppSelector(({ appData, examinationSettings }) => ({
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        getPreparatoryGradeEntryListByIdResp: examinationSettings.getPreparatoryGradeEntryListByIdResp,
    }), shallowEqual);

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
        if (pathname.includes("view-report")) {
            setViewModeState(true);
        }
    }, [pathname]);

    const setValidationMethod = useCallback((validationFn: (() => Promise<boolean>) | null) => {
        setCurrentStepValidation(() => validationFn);
    }, []);

    const nextStepHndlr = (stepKey: any, updatedTabsData: any) => {
        const { stepId, action } = desiredTabDetailState.current;

        if (action === TABS_ACTIONS.PARTICULAR_TAB) {
            setActiveStepId(stepId);
            setFilledTabState((prevState: any) => ({ ...prevState, [stepKey]: true }));
        } else if (action === TABS_ACTIONS.NEXT_TAB) {
            const indexOfCurrentStep = stepInfoState.findIndex(item => item.id === activeStepId);
            const currentStepInfo = stepInfoState[indexOfCurrentStep];

            if (indexOfCurrentStep >= 0 && indexOfCurrentStep < stepInfoState.length - 1) {
                const nextStepInfo = stepInfoState[indexOfCurrentStep + 1];
                setActiveStepId(nextStepInfo.id);

                const updatedStepInfo = [...stepInfoState];
                updatedStepInfo.splice(indexOfCurrentStep, 1, { ...currentStepInfo, isFilled: true });
                setStepInfoState(updatedStepInfo);
            }
        } else if (action === TABS_ACTIONS.PREVIOUS_TAB) {
            const indexOfCurrentStep = stepInfoState.findIndex(item => item.id === activeStepId);

            if (indexOfCurrentStep > 0) {
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

    async function tabClickHandler(tabId: any) {
    }

    function submitCurrentFormCllbck(_: any, submitActionKey?: any) {
        const indexOfCurrentStep = stepInfoState.findIndex(item => item.id === activeStepId);
        if (submitActionKey === TABS_ACTIONS.PREVIOUS_TAB && !filledTabState[activeStepId]) {
            const prevStepInfo = stepInfoState[indexOfCurrentStep - 1];
            setActiveSubFormKeyState([]);
            setActiveStepId(prevStepInfo.id);
        } else {
            desiredTabDetailState.current = {
                stepId: "",
                action: submitActionKey,
            };
        }
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveTabComponent(activeStepId);
        if (TabComponent)
            return <TabComponent
                branchId={branchId}
                instituteId={instituteId}
                stepId={activeStepId}
                isEditMode={!!reportIdState}
                studentId={state?.studentId}
                entryId={state?.entryId}
                termId={state?.termId}
                academicYearId={state?.academicYearId}
            />
    }, [activeStepId, reportIdState, branchId, instituteId, state]);

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

    useEffect(() => {
            return () => {
                dispatch(resetGetStudentByIdAct(undefined))
                dispatch(setSavePreparatoryStudentSurroundingAct(undefined))
                dispatch(setUpdatePreparatoryGradeEntryListAct(undefined))
                dispatch(setPreparatoryGradeEntryListByIdAct(undefined))
                dispatch(setSavePreparatoryGradeEntryListAct(undefined))
                dispatch(setUploadFamilySurroundingPhotoAct(undefined))
                dispatch(setSavePreparatorySummaryAct(undefined))
                dispatch(setPreparatorySummaryByIdAct(undefined))
                dispatch(setUpdatePreparatoryDomainStudentsAct(undefined))
                dispatch(setSavePreparatoryDomainStudentsAct(undefined))
                dispatch(setSavePreparatoryParentFeedbackAct(undefined))
                dispatch(setSavePreparatoryStudentFeedbackAct(undefined))

            }
        }, []);
    

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb pageTitle="Holistic Reports" />
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-md-12 col-xxl-12">
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        <HorizontalWizard
                                            updateStepHndlr={tabClickHandler}
                                            stepsList={stepInfoState}
                                            activeStepId={activeStepId}
                                        />
                                        <div className=" tw-flex tw-content-end tw-justify-end tw-pt-4">
                                            <span className="me-2 fw-bold">Term Name:</span>
                                            <span className="">{getPreparatoryGradeEntryListByIdResp?.termName ?? state?.termName ?? ""}</span>
                                        </div>
                                        <div className="pt-4 pb-3">
                                            <StepperFormContext.Provider value={{
                                                isViewMode: isViewModeState,
                                                reportId: reportIdState,
                                                setReportIdHndlr: setReportIdState,
                                                nextStepHndlr: nextStepHndlr,
                                                submitCurrentFormCllbck: submitCurrentFormCllbck,
                                                tabsData: tabsDataState,
                                                tabsFilledInfo: filledTabState,
                                                setTabsDataHandler: setTabsDataHandler,
                                                validateCurrentStep: currentStepValidation,
                                                setValidationMethod: setValidationMethod,
                                                academicYearId: state?.academicYearId,
                                            }}>
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
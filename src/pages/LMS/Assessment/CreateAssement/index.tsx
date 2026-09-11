import React, { useEffect, useMemo, useRef, useState } from "react";
import BasicDetails from "./BasicDetails";
import { useHistory } from "react-router-dom";
import { stepInfo, StepperFormContext, TABS_ACTIONS } from "./helper";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import Assign from "./Assign";
import Settings from "./Settings";
import AddAssessmentQuestion from "./AddQuestion";
import Review from "./Review";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { resetAssessmentByIdAct, resetAssessmentReviewAct, resetGradeDistrubutionAct, resetQuestionBankAct, resetSaveAssessemntSettingsStepAct, resetSaveBasicAssessmentAct, resetSettingsByAssessmentIdAct } from "../../../../store/lms/lmsAssessment/lmsAssessmentslice";
import UpdatedHorizontalWizard from "../../../../Components/Common/UpdatedHorizontalWizard";

function getActiveMenuComponent(menuId: any) {
    switch (menuId) {
        case "basic_details":
            return BasicDetails;
        case "add_question":
            return AddAssessmentQuestion;
        case "assign":
            return Assign;
        case "settings":
            return Settings;
        case "review":
            return Review;
        default:
            return null;
    }
}

function AddStudent() {
    const [activeStepId, setActiveStepId] = useState("basic_details");
    const dispatch = useAppDispatch();
    interface LocationState {
        id?: string;
        // add other properties if needed
    }
    const history = useHistory<LocationState>();
    const [activeFormState, setActiveFormState] = useState<any>(undefined);
    const [inAddModeState, setInAddModeState] = useState(true);
    const [desiredTabDetailState, setDesiredTabDetailState] = useState({
        action: "",
        stepId: "",
    });
const [previousStepId, setPreviousStepId] = useState("");

    const multiFormKeysToValidate = useRef(new Set());

    const {
        lmsAssessmentErrorAct,
        saveBasicAssessmentResp,
        saveAssessemntSettingsStepResp
    } = useAppSelector(
        ({ lmsAssessment }) => ({
            lmsAssessmentErrorAct: lmsAssessment.lmsAssessmentErrorAct,
            saveBasicAssessmentResp: lmsAssessment.saveBasicAssessmentResp,
            saveAssessemntSettingsStepResp: lmsAssessment.saveAssessemntSettingsStepResp,
        }),
        shallowEqual
    );

    const instituteRespRef = useRef<any>({
        prevLmsAssessmentErrorAct: lmsAssessmentErrorAct,
        prevSaveBasicAssessmentResp: saveBasicAssessmentResp,
        prevSaveAssessemntSettingsStepResp: saveAssessemntSettingsStepResp
        // prevUpdateQuestionBankResp: updateQuestionBankResp
    });

    useEffect(() => {
        const { prevLmsAssessmentErrorAct, prevSaveBasicAssessmentResp, prevSaveAssessemntSettingsStepResp } = instituteRespRef.current;
        if (lmsAssessmentErrorAct && prevLmsAssessmentErrorAct !== lmsAssessmentErrorAct) {
            toast.error(lmsAssessmentErrorAct.details || "Something went wrong.");
        }
        else if (saveBasicAssessmentResp && prevSaveBasicAssessmentResp !== saveBasicAssessmentResp) {
            toast.success("Basic assessment Details saved successfully.");
        }
        // else if (updateQuestionBankResp && prevUpdateQuestionBankResp !== updateQuestionBankResp) {
        //     toast.success("Question bank updated successfully.");
        //     history.push("/question-bank");
        // }
        else if (saveAssessemntSettingsStepResp && prevSaveAssessemntSettingsStepResp !== saveAssessemntSettingsStepResp) {
            toast.success("Assessment Created Successfully");
            // history.push("/assessment-list");
            submitCurrentFormCllbck("review", TABS_ACTIONS.PARTICULAR_TAB);
            
        }

        instituteRespRef.current.prevSaveBasicAssessmentResp = saveBasicAssessmentResp;
        instituteRespRef.current.prevLmsAssessmentErrorAct = lmsAssessmentErrorAct;
        instituteRespRef.current.prevSaveAssessemntSettingsStepResp = saveAssessemntSettingsStepResp;
        // instituteRespRef.current.prevUpdateQuestionBankResp = updateQuestionBankResp;
    }, [lmsAssessmentErrorAct, saveBasicAssessmentResp, saveAssessemntSettingsStepResp]);

        function submitCurrentFormCllbck(stepOrKeys: string | string[], action: string) {
        if (typeof stepOrKeys === "string") {
            setPreviousStepId(activeStepId);
            setActiveStepId(stepOrKeys);

            if (action === "FROM_REVIEW") {
                setDesiredTabDetailState({ action: "FROM_REVIEW", stepId: stepOrKeys });
            }
        } else if (Array.isArray(stepOrKeys)) {
            setActiveFormState([...stepOrKeys]);
            const currentStepIndex = stepInfo.findIndex((item: any) => item.id === activeStepId);

            if (action === TABS_ACTIONS.NEXT_TAB) {
                const { id } = stepInfo[currentStepIndex + 1] || {};
                if (id) {
                    setPreviousStepId(activeStepId);
                    setActiveStepId(id);
                }
            } else if (action === TABS_ACTIONS.PREVIOUS_TAB) {
                const { id } = stepInfo[currentStepIndex - 1] || {};
                if (id) {
                    setPreviousStepId(activeStepId);
                    setActiveStepId(id);
                }
            }
        }
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeStepId);
        if (TabComponent)
            return <TabComponent 
                id={history.location.state?.id} 
                previousStepId={previousStepId}
            />
    }, [activeStepId, previousStepId]);

    function updateStepHndlr(stepId: any) {
        const currentStepIndex = stepInfo.findIndex((item: any) => item.id === activeStepId),
            currentStepInfo = stepInfo[currentStepIndex],
            clickedStepIndex = stepInfo.findIndex((item: any) => item.id === stepId),
            { multiFormKeys } = currentStepInfo || {};
        multiFormKeysToValidate.current.clear();
        if ((inAddModeState && (Number(clickedStepIndex) > Number(currentStepIndex)))) {
            const nextStepIndex = Number(currentStepIndex) + 1;
            if (nextStepIndex >= 0 && Array.isArray(multiFormKeys)) {
                const { id: nextStepId } = stepInfo[nextStepIndex];
                setActiveFormState([...multiFormKeys]);
                setDesiredTabDetailState({
                    action: TABS_ACTIONS.NEXT_TAB,
                    stepId: nextStepId
                });
            }
        } else if (Array.isArray(multiFormKeys)) {
            setActiveFormState([...multiFormKeys]);
            setDesiredTabDetailState({
                action: TABS_ACTIONS.PARTICULAR_TAB,
                stepId: stepId
            });
        } else {
            return;
        }
    }
    useEffect(() => {
        return () => {
            //    addQuestionForm.resetForm();
            dispatch(resetAssessmentByIdAct(undefined));
            dispatch(resetSaveBasicAssessmentAct(undefined));
            dispatch(resetSaveAssessemntSettingsStepAct(undefined));
            dispatch(resetSettingsByAssessmentIdAct(undefined));
            dispatch(resetAssessmentReviewAct(undefined));
            dispatch(resetQuestionBankAct(undefined));
            dispatch(resetGradeDistrubutionAct(undefined));
        }
    }, [])

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb title="Create Assessment" pageTitle="LMS" />
                <div className="card p-3 shadow-lg rounded lms_step_wizard px-5 page-title-box border-0">
                    <UpdatedHorizontalWizard
                        updateStepHndlr={updateStepHndlr}
                        stepsList={stepInfo}
                        activeStepId={activeStepId}
                    />
                </div>
                <div className="row justify-content-center">
                    <div className="col-xs-12 col-md-11 mb-4">
                        <div className="row">
                            <div className="col-12">
                                <div className="lms_step_wizard">
                                    <div className="h-100">
                                        <div className="lms_stepper h-100">
                                            <div className="h-100">
                                                <StepperFormContext.Provider value={{
                                                    submitCurrentFormCllbck,
                                                    desiredTabDetailState
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
        </div>
    )
}


export default AddStudent;

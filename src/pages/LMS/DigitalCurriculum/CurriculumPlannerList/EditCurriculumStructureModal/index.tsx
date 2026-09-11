import { useMemo, useRef, useState } from "react";
import EditCurriculumStructure from "./EditCurriculumStructure";
import DigitalCurriculumReviewCurriculumDetails from "./DigitalCurriculumReviewCurriculumDetails";
import { stepInfo, StepperFormContextRequestChange, TABS_ACTIONS } from "./helper";
import UpdatedHorizontalWizard from "../../../../../Components/Common/UpdatedHorizontalWizard";

function getActiveMenuComponent(menuId: any) {
    switch (menuId) {
        case "curriculum-structure":
            return EditCurriculumStructure;
        case "review-save":
            return DigitalCurriculumReviewCurriculumDetails;
        default:
            return null;
    }
}

const EditCurriculumStructureModal = (props: any) => {

    const [activeStepId, setActiveStepId] = useState("curriculum-structure");
    const [activeFormState, setActiveFormState] = useState<any>(undefined);
    const [inAddModeState, setInAddModeState] = useState();
    const [desiredTabDetailState, setDesiredTabDetailState] = useState({
        action: "",
        stepId: "",
    });
    const [subjectCurriculumId, setSubjectCurriculumId] = useState<number | null>(
        props.id ?? null
    );

    const { toggle } = props;
    const multiFormKeysToValidate = useRef(new Set());

    const navigateToStepDirectly = (stepId: string) => {
        setActiveStepId(stepId);
        setActiveFormState(undefined);
        setDesiredTabDetailState({
            action: TABS_ACTIONS.PARTICULAR_TAB,
            stepId: stepId,
        });
    };

    function updateStepHndlr(stepId: any) {
        const currentStepIndex = stepInfo.findIndex(
            (item: any) => item.id === activeStepId
        ),
            currentStepInfo = stepInfo[currentStepIndex],
            clickedStepIndex = stepInfo.findIndex((item: any) => item.id === stepId),
            { multiFormKeys } = currentStepInfo || {};

        multiFormKeysToValidate.current.clear();

        if (clickedStepIndex < currentStepIndex) {
            navigateToStepDirectly(stepId);
            return;
        }

        if (inAddModeState && clickedStepIndex > currentStepIndex) {
            if (Array.isArray(multiFormKeys) && multiFormKeys.length > 0) {
                setActiveFormState([...multiFormKeys]);
                setDesiredTabDetailState({
                    action: TABS_ACTIONS.PARTICULAR_TAB,
                    stepId: stepId,
                });
            } else {
                navigateToStepDirectly(stepId);
            }
        } else {
            navigateToStepDirectly(stepId);
        }
    }

    const goToNextStep = () => {
        const currentStepIndex = stepInfo.findIndex(
            (item: any) => item.id === activeStepId
        );
        if (currentStepIndex < stepInfo.length - 1) {
            const nextStepId = stepInfo[currentStepIndex + 1].id;
            updateStepHndlr(nextStepId);
        }
    };

    const goToPreviousStep = () => {
        const currentStepIndex = stepInfo.findIndex(
            (item: any) => item.id === activeStepId
        );
        if (currentStepIndex > 0) {
            const prevStepId = stepInfo[currentStepIndex - 1].id;
            updateStepHndlr(prevStepId);
        }
    };

    const goToStep = (stepId: string) => {
        updateStepHndlr(stepId);
    };

    function submitCurrentFormCllbck(
        stepOrKeys: string | string[],
        action: string
    ) {
        if (typeof stepOrKeys === "string") {
            setActiveStepId(stepOrKeys);
            setDesiredTabDetailState({ action, stepId: stepOrKeys });
        } else if (Array.isArray(stepOrKeys)) {
            setActiveFormState([...stepOrKeys]);
            const currentStepIndex = stepInfo.findIndex(
                (item: any) => item.id === activeStepId
            );

            if (action === TABS_ACTIONS.NEXT_TAB) {
                const { id } = stepInfo[currentStepIndex + 1] || {};
                if (id) setActiveStepId(id);
            } else if (action === TABS_ACTIONS.PREVIOUS_TAB) {
                const { id } = stepInfo[currentStepIndex - 1] || {};
                if (id) setActiveStepId(id);
            }
        }
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeStepId);
        if (TabComponent)
            return (
                <TabComponent
                    toggle={toggle}
                    subjectCurriculumId={props.id}
                    getDigitalCurriculumStatsApi={props.getDigitalCurriculumStatsApi}
                    getDigitalCurriculumListApi={props.getDigitalCurriculumListApi}
                />
            );
    }, [activeStepId, toggle, props.id]);

    return (
        <>
            <div className="lms_step_wizard py-3" style={{ pointerEvents: "none", cursor: "default" }}>
                <UpdatedHorizontalWizard
                    updateStepHndlr={(stepId) => {
                        const allowStepClick = false;
                        if (!allowStepClick) return;
                        updateStepHndlr(stepId);
                    }}
                    stepsList={stepInfo}
                    activeStepId={activeStepId}
                />
            </div>
            <div className="tw-flex tw-mt-6 tw-justify-center">
                <div className="tw-w-full md:tw-w-11/12 tw-mb-4">
                    <div className="tw-w-full">
                        <div className="tw-h-full">
                            <div className="lms_stepper tw-h-full">
                                <div className="tw-h-full">
                                    <StepperFormContextRequestChange.Provider
                                        value={{
                                            desiredTabDetailState,
                                            submitCurrentFormCllbck,
                                            navigateToStepDirectly,
                                            goToNextStep,
                                            goToPreviousStep,
                                            goToStep,
                                            currentStep: activeStepId,
                                            isFirstStep: activeStepId === stepInfo[0].id,
                                            isLastStep:
                                                activeStepId === stepInfo[stepInfo.length - 1].id,
                                            subjectCurriculumId,
                                            setSubjectCurriculumId,
                                        }}
                                    >
                                        {activeComponent}
                                    </StepperFormContextRequestChange.Provider>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default EditCurriculumStructureModal;

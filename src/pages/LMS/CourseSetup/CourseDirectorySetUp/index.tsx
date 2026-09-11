import { useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../../Components/Common/BreadCrumb";
import { stepInfo, StepperFormContext, TABS_ACTIONS } from "./helper";
import { HorizontalWizard } from "../../../../Components/Common";
import BasicDetails from "./BasicDetails";
import CurriculumDetails from "./CurriculumDetails";
import ReviewCourseDetails from "./ReviewCourseDetails";

function getActiveMenuComponent(menuId: any) {
  switch (menuId) {
    case "basic_details":
      return BasicDetails;
    case "curriculum":
      return CurriculumDetails;
    case "review":
      return ReviewCourseDetails;
    default:
      return null;
  }
}

const CourseDirectorySetUp = () => {
  const [activeStepId, setActiveStepId] = useState("basic_details");

  const [activeFormState, setActiveFormState] = useState<any>(undefined);
  const [inAddModeState, setInAddModeState] = useState();
  const [desiredTabDetailState, setDesiredTabDetailState] = useState({
    action: "",
    stepId: "",
  });

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
    setActiveStepId(stepId);
    getActiveMenuComponent(stepId);
  }

  // function updateStepHndlr(stepId: any) {
  //   const currentStepIndex = stepInfo.findIndex(
  //       (item: any) => item.id === activeStepId
  //     ),
  //     currentStepInfo = stepInfo[currentStepIndex],
  //     clickedStepIndex = stepInfo.findIndex((item: any) => item.id === stepId),
  //     { multiFormKeys } = currentStepInfo || {};

  //   multiFormKeysToValidate.current.clear();
  //   console.log(stepId);

  //   if (inAddModeState && Number(clickedStepIndex) > Number(currentStepIndex)) {
  //     const nextStepIndex = Number(currentStepIndex) + 1;
  //     if (nextStepIndex >= 0 && Array.isArray(multiFormKeys)) {
  //       const { id: nextStepId } = stepInfo[nextStepIndex];
  //       setActiveFormState([...multiFormKeys]);
  //       setDesiredTabDetailState({
  //         action: TABS_ACTIONS.NEXT_TAB,
  //         stepId: nextStepId,
  //       });
  //     } else if (nextStepIndex >= 0) {
  //       navigateToStepDirectly(stepId);
  //     }
  //   } else if (Array.isArray(multiFormKeys)) {
  //     setActiveFormState([...multiFormKeys]);
  //     setDesiredTabDetailState({
  //       action: TABS_ACTIONS.PARTICULAR_TAB,
  //       stepId: stepId,
  //     });
  //   } else {
  //     console.log("else");
  //     navigateToStepDirectly(stepId);
  //   }
  // }

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
    if (TabComponent) return <TabComponent />;
  }, [activeStepId]);

  return (
    <div className="page-content">
      <div className="container-fluid">
        <BreadCrumb pageTitle="LMS"></BreadCrumb>

        <div className="card">
          <div className="card-header">
            <HorizontalWizard
              updateStepHndlr={updateStepHndlr}
              stepsList={stepInfo}
              activeStepId={activeStepId}
            />
          </div>

          <div className="card-body">
            <StepperFormContext.Provider
              value={{
                desiredTabDetailState,
                submitCurrentFormCllbck,
                navigateToStepDirectly,
              }}
            >
              {activeComponent}
            </StepperFormContext.Provider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDirectorySetUp;

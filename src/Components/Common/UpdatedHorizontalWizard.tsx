import React from "react";
import classnames from "classnames";

interface Step {
  id: string;
  label: string;
}

interface Props {
  stepsList: Step[];
  activeStepId: string;
  updateStepHndlr: (stepId: string) => void;
  formgroupClassName?: string;
}

const UpdatedHorizontalWizard: React.FC<Props> = ({ stepsList, activeStepId, updateStepHndlr, formgroupClassName }) => {
  const activeIndex = stepsList.findIndex((s) => s.id === activeStepId);

  return (
    <div className={classnames( "wizard-container", formgroupClassName ?? "px-5")}>
      {stepsList.map((step, index) => {
        const isActive = step.id === activeStepId;
        const isCompleted = index < activeIndex;

        return (
          <div
            key={step.id}
            className="wizard-step"
            onClick={() => updateStepHndlr(step.id)}
          >
            <div
              className={`wizard-circle ${isActive ? "active" : isCompleted ? "completed" : ""}`}
            >
              {index + 1}
            </div>
            <div className="wizard-info">
              <span className={`wizard-label ${isActive ? "active-label" : ""}`}>
                {step.label}
              </span>
              <div className="wizard-progress">
                <div
                  className={`wizard-progress-bar ${isActive ? "active" : isCompleted ? "completed" : ""
                    }`}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UpdatedHorizontalWizard;

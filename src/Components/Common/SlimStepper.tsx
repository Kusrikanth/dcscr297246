import React, { useEffect, useState } from "react";
import classNames from "classnames";

interface IStepDetails {
  id: string;
  title: string;
  isDisabled?: boolean;
}

interface IHorizontalWizard {
  activeStepId: string;
  updateStepHndlr: (id: string) => void;
  containerClass?: string;
  stepsList: IStepDetails[];
}

export const SlimStepper: React.FC<IHorizontalWizard> = ({
  activeStepId,
  updateStepHndlr,
  containerClass,
  stepsList,
}) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  useEffect(() => {
    const activeStepIndex = stepsList.findIndex(
      (item) => item.id === activeStepId
    );
    setActiveTab(activeStepIndex);
  }, [activeStepId, stepsList]);

  return (
    <div className={classNames("tw-w-full tw-px-4", containerClass)}>
      <div className="tw-relative tw-flex tw-items-center tw-justify-between tw-w-full tw-h-12">

        <div className="tw-absolute tw-top-1/2 tw-left-0 tw-w-full tw-h-[2px] tw-bg-gray-300 tw-z-0" />
        <div
          className="tw-absolute tw-top-1/2 tw-left-0 tw-h-[2px] tw-z-10 tw-transition-all"
          style={{
            width: `${(activeTab / (stepsList.length - 1)) * 100}%`,
            transform: "translateY(-50%)",
            backgroundColor: "#0ab39c"
          }}
        />
        {stepsList.map((step, index) => {
          const isCompleted = index < activeTab;
          const isActive = index === activeTab;

          return (
            <div
              key={step.id}
              onClick={() => !step.isDisabled && updateStepHndlr(step.id)}
              className={classNames(
                "tw-flex tw-flex-col tw-items-center tw-z-20 tw-cursor-pointer tw-w-8",
                { "tw-cursor-not-allowed tw-opacity-50": step.isDisabled }
              )}
            >
              <div
                className={classNames(
                  "tw-w-8 tw-h-8 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-white tw-font-semibold tw-transition-all",
                  {
                    "tw-text-white": isCompleted || isActive,
                    "tw-bg-gray-300 tw-text-gray-600": !isCompleted && !isActive
                  }
                )}
                style={{
                  backgroundColor: isCompleted || isActive ? "#0ab39c" : undefined
                }}
              >
                {isCompleted ? (
                  <svg
                    className="tw-w-4 tw-h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                    style={{
                      backgroundColor: isActive ? "white" : isCompleted ? "white" : undefined,
                      borderRadius: isCompleted ? "20px" : undefined,
                      color: isCompleted ? "#0ab39c" : undefined,
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React, { useEffect, useMemo, useState } from "react";
import classnames from "classnames";

interface IStepDetails {
    id: number;
    title: string;
    iconImage?: any;
}

interface NewStepsContainerPropsType {
    activeStepId: any;
    updateStepHndlr: any;
    containerClass?: any;
    stepsList: Array<IStepDetails>;
}

export const NewStepsContainerV2: React.FC<NewStepsContainerPropsType> = (
    props
) => {
    return (
        <div className={classnames(props.containerClass)}>
            <div className={"stepper-container"}>
                {props.stepsList.map((step: IStepDetails, index: number) => (
                    <div className="step-item" key={index}>
                        <button
                            className={`step-button ${step.id < +props.activeStepId ? "completed" : ""} ${+props.activeStepId == step.id ? "active" : ""}`}
                        // onClick={() => setCurrentStep(index)}
                        >
                            {index + 1}
                        </button>
                        <div className="step-title">{step.title}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

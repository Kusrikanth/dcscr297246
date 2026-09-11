import { useHistory } from "react-router-dom";
import { MathPreview } from "../../../../Components/Common";
import classnames from "classnames";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    ArrowLeft02Icon, ArrowRight02Icon
} from "@hugeicons-pro/core-stroke-standard";

export default function CurrentQuestion({ currentQuestionIdx, questionsList, dispatch }) {
    const currentQuestion = questionsList[currentQuestionIdx];
    const { questionStatus, question, options } = currentQuestion;
    const isLastQut = currentQuestionIdx === questionsList.length - 1;

    const history = useHistory();
    return (
        <div className="card p-3 questions-list">
            <div className="card-body display-questions">
                <h4 className="mb-0 fs-14">
                    <span className="text-secondary">{currentQuestionIdx + 1}</span>/
                    {questionsList.length}
                </h4>
            </div>
            <div className="mb-4">
                <p className="mb-0 fs-12">
                    <span className="text-muted me-2">Question ID :</span>
                    <span className="text-secondary">Q78124</span>
                </p>
            </div>

            <div className="question tw-mb-8">
                <div className="tw-mb-8">
                    <p className="tw-text-lg mb-0" style={{ lineHeight: "2" }}>
                        <MathPreview json={question} />
                    </p>
                </div>
                <div className="ms-4">
                    {options.map((option: any) => {
                        const isAnswered =
                            currentQuestion.answeredOption === option.optionId;

                        return (
                            <div
                                key={option.optionId}
                                className="d-flex align-items-center mb-3 question-option cursor-pointer"
                                onClick={() =>
                                    dispatch({ type: "answered", payload: option.optionId })
                                }
                            >
                                <p
                                    className={classnames(
                                        "mb-0 question-option-id rounded-circle tw-border tw-border-[#e5e7eb] d-flex align-items-center justify-content-center fs-12 me-3 transition-all duration-300",
                                        {
                                            "bg-secondary text-white": isAnswered,
                                            "bg-white": !isAnswered,
                                        }
                                    )}
                                    style={{ width: 32, height: 32 }}
                                >
                                    {option.optionId}
                                </p>

                                <div
                                    className={classnames(
                                        "rounded p-2 ps-4 flex-grow-1 tw-border transition-all duration-300",
                                        {
                                            "tw-border-blue-500 bg-blue-100 font-semibold":
                                                isAnswered,
                                            "tw-border-gray-300 bg-white": !isAnswered,
                                        }
                                    )}
                                >
                                    <p className="mb-0 tw-py-1 fs-15">
                                        <MathPreview json={option?.optionValue} />
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="d-flex gap-3 justify-content-center">
                <button
                    className="btn btn-secondary fs-12 px-3 py-2 disabled:tw-opacity-20 disabled:tw-pointer-events-none"
                    onClick={() => dispatch({ type: "prev-qtion" })}
                    disabled={currentQuestionIdx === 0}
                >
                    <HugeiconsIcon icon={ArrowLeft02Icon} size={16} className="me-2" />
                    Previous
                </button>
                <button
                    className="btn !tw-border-gray-300 hover:!tw-bg-gray-300 fs-12 px-3 py-2 disabled:tw-opacity-20 disabled:tw-pointer-events-none"
                    onClick={() => dispatch({ type: "skip-qtion" })}
                    disabled={isLastQut}
                >
                    Skip (or) Review Later
                </button>
                <button
                    className="btn btn-success fs-12 px-3 py-2"
                    onClick={() => dispatch({ type: "next-qtion" })}
                >
                    {isLastQut ? "Submit" : "Save & Next"}

                    <HugeiconsIcon icon={ArrowRight02Icon} size={16} className="ms-2" />
                </button>
            </div>
        </div>
    );
};

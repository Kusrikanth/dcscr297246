import { HugeiconsIcon } from "@hugeicons/react";
import {
    StopWatchIcon,
} from "@hugeicons-pro/core-stroke-standard";
import { UncontrolledTooltip } from "reactstrap";
import classnames from "classnames";
const optionsStatus = [
    {
        optionType: "Active",
        optionId: "active",
    },
    {
        optionType: "Attempted",
        optionId: "attempted",
    },
    {
        optionType: "Skiped",
        optionId: "not_attempted",
    },
    {
        optionType: "Not Visited",
        optionId: "not_visited",
    },
];
export default function QuestionsListNav({ questionsList }) {
    return (
        <div className="card questions-nav-container">
            <div className="card-header text-center pb-2">
                <p className="text-muted fs-14 mb-0 d-flex align-items-center justify-content-center mb-0">
                    <HugeiconsIcon icon={StopWatchIcon} size={16} className="me-1" />
                    Time Left
                </p>
                <p className="text-secondary fs-16 fw-semibold mb-0">00:19:16</p>
            </div>
            <div className="card-body">
                <div className="row tw-w-full tw-w-xxl-3/4 mx-auto gy-3 pb-3 mb-3 questions-nav-list">
                    {questionsList.map((question, idx) => {
                        const tooltipTargetId = `question-${question.questionId}`;

                        return (
                            <div
                                className="col-2 px-1 d-flex align-items-center justify-content-center nav-question"
                                key={question.questionId}
                                id={tooltipTargetId}
                            >
                                <div
                                    className={classnames(
                                        "rounded-circle d-flex align-items-center justify-content-center cursor-pointer flex-shrink-0 fs-12",
                                        {
                                            "tw-bg-[#cee3ef] tw-border tw-border-[#5da1c8] tw-text-[#5da1c8]":
                                                question.questionStatus === "active",
                                        },
                                        {
                                            "tw-bg-[#eef7e5] tw-border tw-border-[#acd67f] tw-text-[#acd67f]":
                                                question.questionStatus === "attempted",
                                        },
                                        {
                                            "tw-bg-gray-100 tw-border tw-border-gray-400 tw-text-gray-500":
                                                question.questionStatus === "not_visited",
                                        },
                                        {
                                            "tw-bg-[#fef8ed] tw-border tw-border-[#f7b84b] tw-text-[#f7b84b]":
                                                question.questionStatus === "not_attempted",
                                        }
                                    )}
                                    style={{ width: "26px", height: "26px" }}
                                >
                                    {idx + 1}
                                </div>
                                <UncontrolledTooltip
                                    placement="top"
                                    target={tooltipTargetId}
                                    className="!tw-text-sm !tw-px-1 !tw-py-1 fs-12 p-1"
                                    style={{ fontSize: "10px", padding: "2px 4px" }}
                                >
                                    {question.questionStatus
                                        ?.split("_")
                                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(" ")}
                                </UncontrolledTooltip>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="card-footer">
                <div className="d-flex flex-column align-items-center">
                    <div className="row">
                        {optionsStatus.map((type) => (
                            <p
                                className="mb-2 d-flex align-items-center fs-12 col-6"
                                key={type.optionId}
                            >
                                <span
                                    className={classnames(
                                        "rounded-circle me-2 d-inline-block flex-shrink-0",
                                        {
                                            "tw-bg-[#cee3ef] tw-border tw-border-[#5da1c8]":
                                                type.optionId === "active",
                                        },
                                        {
                                            "tw-bg-[#fef8ed] tw-border tw-border-[#f7b84b] tw-text-[#f7b84b]":
                                                type.optionId === "not_attempted",
                                        },
                                        {
                                            "tw-bg-gray-100 tw-border tw-border-gray-400 tw-text-gray-500":
                                                type.optionId === "not_visited",
                                        },
                                        {
                                            "tw-bg-[#eef7e5] tw-border tw-border-[#acd67f]":
                                                type.optionId === "attempted",
                                        }
                                    )}
                                    style={{ width: "12px", height: "12px" }}
                                ></span>
                                <span className="text-muted">{type.optionType}</span>
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

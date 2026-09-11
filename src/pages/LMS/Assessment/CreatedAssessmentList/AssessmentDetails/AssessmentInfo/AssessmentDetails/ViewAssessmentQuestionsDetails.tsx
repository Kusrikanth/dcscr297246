import { HugeiconsIcon } from "@hugeicons/react";

import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CheckmarkBadge01Icon,
  StarIcon,
  Time02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import {
  MathPreview,
  RadioInputContainer,
  Switch,
} from "../../../../../../../Components/Common";
import classnames from "classnames";
import { useReducer, useState } from "react";
import { questions } from "../../../../../AssessmentInstructions/StudentAssessment/helper";

const initialState = {
  currentQuestionIdx: 0,
  questionsList: questions,
  answeredValue: null,
  hasCompleted: false,
  totalPointsGained: 0,
  totalAnsweredQuestions: 0,
  noSkippedQuestion: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "answered": {
      let pointsGained = 0;
      const currentQuestion = state.questionsList[state.currentQuestionIdx];
      const wasPreviouslyAnswered = currentQuestion.answeredOption !== null;

      if (action.payload === currentQuestion.correctOption) {
        pointsGained = currentQuestion.points;
      }

      const updatedList = state.questionsList.map((q, idx) => {
        if (idx === state.currentQuestionIdx) {
          return {
            ...q,
            answeredOption: action.payload,
            questionStatus: "attempted",
          };
        }
        return q;
      });

      return {
        ...state,
        questionsList: updatedList,
        totalPointsGained: state.totalPointsGained + pointsGained,
        totalAnsweredQuestions: wasPreviouslyAnswered
          ? state.totalAnsweredQuestions
          : state.totalAnsweredQuestions + 1,
        // Removed `hasCompleted: isLast` to prevent auto-submit
      };
    }

    case "skip-qtion": {
      const updatedList = state.questionsList.map((q, idx) => {
        if (idx === state.currentQuestionIdx) {
          return {
            ...q,
            answeredOption: null,
            questionStatus: "not_attempted",
          };
        } else if (idx === state.currentQuestionIdx + 1) {
          return { ...q, questionStatus: "active" };
        }
        return q;
      });

      const nextQuestionIdx = state.currentQuestionIdx + 1;
      const isLast = nextQuestionIdx >= state.questionsList.length;

      return {
        ...state,
        currentQuestionIdx: isLast ? state.currentQuestionIdx : nextQuestionIdx,
        questionsList: updatedList,
        hasCompleted: false,
        noSkippedQuestion: state.noSkippedQuestion + 1,
      };
    }

    case "prev-qtion": {
      if (state.currentQuestionIdx === 0) return state;

      const prevQuestionIdx = state.currentQuestionIdx - 1;
      const updatedList = state.questionsList.map((q, idx) => {
        if (idx === state.currentQuestionIdx) {
          return {
            ...q,
            questionStatus: q.answeredOption ? "attempted" : "not_attempted",
          };
        } else if (idx === prevQuestionIdx) {
          return { ...q, questionStatus: "active" };
        }
        return q;
      });

      return {
        ...state,
        currentQuestionIdx: prevQuestionIdx,
        questionsList: updatedList,
        hasCompleted: false,
      };
    }

    case "next-qtion": {
      const nextQuestionIdx = state.currentQuestionIdx + 1;
      const isLast = nextQuestionIdx >= state.questionsList.length;
      const currentQuestion = state.questionsList[state.currentQuestionIdx];
      const wasSkipped = currentQuestion.answeredOption === null;

      if (isLast) {
        const updatedList = state.questionsList.map((q, idx) => {
          if (idx === state.currentQuestionIdx) {
            return {
              ...q,
              questionStatus: q.answeredOption ? "attempted" : "not_attempted",
            };
          }
          return q;
        });

        return {
          ...state,
          questionsList: updatedList,
          hasCompleted: true,
          noSkippedQuestion: wasSkipped
            ? state.noSkippedQuestion + 1
            : state.noSkippedQuestion,
        };
      }

      const updatedList = state.questionsList.map((q, idx) => {
        if (idx === state.currentQuestionIdx) {
          return {
            ...q,
            questionStatus: q.answeredOption ? "attempted" : "not_attempted",
          };
        } else if (idx === nextQuestionIdx) {
          return { ...q, questionStatus: "active" };
        }
        return q;
      });

      return {
        ...state,
        currentQuestionIdx: nextQuestionIdx,
        questionsList: updatedList,
        hasCompleted: false,
        noSkippedQuestion: wasSkipped
          ? state.noSkippedQuestion + 1
          : state.noSkippedQuestion,
      };
    }

    case "jump-to-question": {
      const targetIndex = action.payload;
      if (targetIndex < 0 || targetIndex >= state.questionsList.length) {
        return state;
      }

      const updatedList = state.questionsList.map((q, idx) => {
        if (idx === state.currentQuestionIdx) {
          return {
            ...q,
            questionStatus: q.answeredOption ? "attempted" : "not_attempted",
          };
        } else if (idx === targetIndex) {
          return { ...q, questionStatus: "active" };
        }
        return q;
      });

      return {
        ...state,
        currentQuestionIdx: targetIndex,
        questionsList: updatedList,
        hasCompleted: false,
      };
    }

    case "submit-assessement": {
      let totalCorrect = 0;
      let totalPoints = 0;
      let skipped = 0;
      let answered = 0;

      const updatedList = state.questionsList.map((q) => {
        if (q.answeredOption !== null) {
          answered++;
          if (q.answeredOption === q.correctOption) {
            totalCorrect++;
            totalPoints += q.points;
          }
        } else {
          skipped++;
        }
        return {
          ...q,
          questionStatus: "submitted", // Mark all questions as submitted
        };
      });

      return {
        ...state,
        questionsList: updatedList,
        hasCompleted: true,
        totalPointsGained: totalPoints,
        totalAnsweredQuestions: answered,
        noSkippedQuestion: skipped,
        totalCorrectAnswers: totalCorrect,
        currentQuestionIdx: state.currentQuestionIdx,
      };
    }

    default:
      return state;
  }
}

const ViewQuestionsList = ({ questionsList, currentQuestionIdx, dispatch }) => {
  const [showAnswer, setShowAnswer] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const currentQuestion = questionsList[currentQuestionIdx];
  const { question, options } = currentQuestion;

  const isDisabled = currentQuestionIdx === 0;
  const isLastQut = currentQuestionIdx === questionsList.length - 1;

  const correctOption = currentQuestion.correctOption;

  return (
    <>
      <div className="card assessment_preview_card">
        <div className="card-header">
          <div className="row">
            <div className="col-12 col-lg-6">
              <h4 className="card-title mb-0">Assessment Preview</h4>
            </div>
            <div className="col-12 col-lg-auto ms-auto">
              <div className="tw-flex tw-items-center tw-gap-4">
                <p className="tw-mb-0 tw-flex tw-items-center">
                  <span className="tw-text-gray-500 tw-text-xs tw-me-1">
                    <HugeiconsIcon
                      icon={CheckmarkBadge01Icon}
                      className="tw-me-1"
                      size={18}
                    />
                    Marks :
                  </span>
                  <span className="">20</span>
                </p>
                <p className="tw-mb-0 tw-flex tw-items-center">
                  <span className="tw-text-gray-500 tw-text-xs tw-me-1">
                    <HugeiconsIcon
                      icon={Time02Icon}
                      className="tw-me-1"
                      size={16}
                    />
                    Duration :
                  </span>
                  <span className="">1hr 30mins</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="row w-100 mx-auto">
            <div className="col-12 tw-p-3 tw-flex tw-items-between tw-flex-col">
              <div>
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-6">
                  <p className="tw-mb-0 tw-font-semibold">
                    {`Question ${currentQuestionIdx + 1} / ${
                      questionsList.length
                    }
                    `}
                  </p>
                  <div className="tw-flex tw-items-center">
                    <div className="tw-me-2 tw-flex tw-items-center">
                      <p className="tw-me-1 tw-mb-0 tw-flex-1 tw-text-gray-500 tw-text-xs">
                        Show Explanation :
                      </p>
                      <Switch
                        attributeId="showAnsweres"
                        checked={showExplanation}
                        onChangeHndlr={() =>
                          setShowExplanation((prev) => !prev)
                        }
                        className="form-switch-sm form-check-left"
                      />
                    </div>
                    <div className="tw-me-2 tw-flex tw-items-center">
                      <p className="tw-me-1 tw-mb-0 tw-flex-1 tw-text-gray-500 tw-text-xs">
                        Show Answer :
                      </p>
                      <Switch
                        attributeId="showAnsweres"
                        checked={showAnswer}
                        onChangeHndlr={() => setShowAnswer((prev) => !prev)}
                        className="form-switch-sm form-check-left"
                      />
                    </div>
                    <p className="tw-mb-0 tw-text-gray-500 tw-text-xs tw-flex tw-items-center">
                      <HugeiconsIcon
                        icon={StarIcon}
                        className="tw-me-1 tw-text-[#FFD700]"
                        size={14}
                        fill="#FFD700"
                      />
                      <span className="me-2">Marks:</span>
                      <span>{currentQuestion.points}</span>
                    </p>
                  </div>
                </div>

                <div>
                  <p className="tw-text-base tw-leading-[2]">
                    <MathPreview json={question}></MathPreview>
                  </p>

                  <div>
                    {options.map((option, idx) => {
                      const isAnswered =
                        currentQuestion.answeredOption === option.optionId;
                      const isCorrect =
                        showAnswer && option.optionId === correctOption;

                      return (
                        <div
                          key={option.optionId}
                          className={`tw-border tw-rounded tw-py-2 tw-ps-4 tw-mb-3 transition-all ${
                            isCorrect
                              ? "tw-border-[#0ab39c] tw-bg-[#cef0eb]"
                              : "tw-border-gray-200"
                          }`}
                        >
                          <RadioInputContainer
                            name={`question-option-${option.optionId}`}
                            radioOptions={[
                              {
                                id: option.optionId,
                                name: (
                                  <div className="tw-flex tw-items-center tw-ms-3">
                                    <span className="tw-me-2">{`${String.fromCharCode(
                                      65 + idx
                                    )})`}</span>
                                    <MathPreview
                                      json={option?.optionValue}
                                    ></MathPreview>
                                  </div>
                                ),
                                // itemDisabled: true,
                              },
                            ]}
                            value={isCorrect ? option.optionId : null}
                            onChange={() => {}}
                            radioClassName="tw-mb-0 d-flex align-items-center"
                            formgroupClassName="tw-mb-0"
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {showExplanation && (
                  <div className="tw-border-2 tw-border-dashed tw-rounded tw-p-3 tw-mb-12 tw-bg-[#fef7d7]">
                    <p className="tw-mb-2 tw-text-base tw-font-semibold">
                      Explanation :
                    </p>
                    <div>
                      We solve 2 𝑥 2 − 5 𝑥 − 3 = 0 2x 2 −5x−3=0 using the
                      quadratic formula:
                      <br />
                      𝑥 = − 𝑏 ± 𝑏 2 − 4 𝑎 𝑐 2 𝑎 x= 2a −b± b 2 −4ac ​ ​ , where 𝑎
                      = 2 a=2, 𝑏 = − 5 b=−5, 𝑐 = − 3 c=−3.
                      <br />
                      Substituting: 𝑥 = 5 ± 25 + 24 4 = 5 ± 7 4 x= 4 5± 25+24 ​
                      ​ = 4 5±7 ​ .
                      <br />
                      Thus, 𝑥 = 3 x=3 or 𝑥 = − 1 2 x=− 2 1 ​ .
                    </div>
                  </div>
                )}
              </div>

              <div className="tw-flex tw-justify-center tw-mt-auto tw-gap-3 tw-mb-8 tw-mt-6">
                <button
                  className={classnames(
                    "tw-bg-[#F3F4F6] tw-text-[#374151] tw-text-sm tw-font-medium tw-px-3 tw-py-1.5 tw-rounded tw-shadow-sm hover:!tw-bg-gray-200 tw-flex tw-items-center tw-justify-center",
                    {
                      "tw-opacity-70 tw-cursor-not-allowed": isDisabled,
                    }
                  )}
                  onClick={() => dispatch({ type: "prev-qtion" })}
                  disabled={isDisabled}
                >
                  <HugeiconsIcon
                    icon={ArrowLeft01Icon}
                    className="tw-me-2"
                    size={16}
                  />
                  Previous
                </button>
                <button
                  className={classnames(
                    "tw-bg-[#0ab39c] tw-text-white tw-flex tw-items-center tw-justify-centers tw-font-medium tw-leading-[1.5] tw-text-center tw-no-underline tw-align-middle tw-cursor-pointer tw-select-none tw-py-[0.4065rem] tw-px-[0.9rem] tw-text-sm tw-rounded tw-transition-colors tw-duration-150 tw-ease-in-out hover:tw-bg-[#099885] disabled:tw-opacity-50 disabled:tw-cursor-not-allowed",
                    {
                      "tw-opacity-50 tw-cursor-not-allowed": isLastQut,
                    }
                  )}
                  onClick={() => dispatch({ type: "next-qtion" })}
                  disabled={isLastQut}
                >
                  Next
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="tw-ms-2"
                    size={16}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const ViewAssessmentQuestionsDetails = () => {
  const [
    { currentQuestionIdx, questionsList, answeredValue, hasCompleted },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <ViewQuestionsList
      questionsList={questionsList}
      currentQuestionIdx={currentQuestionIdx}
      dispatch={dispatch}
    ></ViewQuestionsList>
  );
};

export default ViewAssessmentQuestionsDetails;

import {
  AlertCircleIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  AtStrokeStandard,
  Bookmark01Icon,
  CancelCircleIcon,
  CheckmarkCircle03Icon,
  CircleArrowLeft02Icon,
  Delete02Icon,
  SentIcon,
  StarIcon,
  Time02Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MathPreview,
  ModalContainerUpdated,
  UserDetails,
} from "../../../../Components/Common";
import { Progress } from "reactstrap";
import classnames from "classnames";
import { useCountdown } from "../../../../utility/commonutility";
import { saveAutoAssessmentAct, saveQuestionOrderByAttemptIdAct } from "../../../../store/lms/studentAssessment/studentAssessmentActions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { AttemptedQuestionStatus } from "./helper";

const questionIndications = [
  { indicationId: AttemptedQuestionStatus.ANSWERED, indicationLabel: "Answered", className: "tw-bg-green-200" },
  { indicationId: "ACTIVE", indicationLabel: "Current", className: "tw-bg-indigo-600" },
  { indicationId: AttemptedQuestionStatus.MARKED_FOR_REVIEW, indicationLabel: "Marked for Review", className: "tw-bg-purple-200" },
  { indicationId: AttemptedQuestionStatus.NOT_ANSWERED, indicationLabel: "Not Answered", className: "tw-bg-red-200" },
  { indicationId: AttemptedQuestionStatus.NOT_VISITED, indicationLabel: "Not Visited", className: "tw-bg-gray-200" },
];

const statusColor = {
  [AttemptedQuestionStatus.ANSWERED]: "tw-bg-green-200 tw-text-green-800 font-medium",
  [AttemptedQuestionStatus.MARKED_FOR_REVIEW]: "tw-bg-purple-200 tw-text-purple-800 font-medium",
  [AttemptedQuestionStatus.NOT_ANSWERED]: "tw-bg-red-200 tw-text-red-800 font-medium",
  [AttemptedQuestionStatus.NOT_VISITED]: "tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300",
};


const NewAssessment = ({
  questionsList,
  currentQuestionIdx,
  assessmentId,
  sessionId,
  attemptId,
  assessmentDetails,
  studentDetails,
  dispatchBtn,
  assessementSubmissionOpenModal,
  onTimeExpiredChange,
}: {
  questionsList: any;
  currentQuestionIdx: any;
  assessmentId: any;
  sessionId: any;
  attemptId: any;
  assessmentDetails: any;
  studentDetails: any;
  dispatchBtn: any;
  assessementSubmissionOpenModal: any;
  onTimeExpiredChange?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  const {
    assessmentStatus,
    assessmentName,
    startDate,
    expiryDate,
    totalMarks,
    duration,
    startTime,
    expiryTime,
    shuffleQuestions,
  } = assessmentDetails || {};
  const studentId = studentDetails?.childId;
  function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (questionsList?.length > 0 && studentId) {
      const key = `shuffledQuestions_${assessmentId}_${studentId}`;
      const saved = localStorage.getItem(key);
      const currentIds = questionsList.map((q: any) => q.questionId);
      let ids: string[] = [];

      if (!shuffleQuestions) {
        ids = currentIds;
        localStorage.setItem(key, JSON.stringify(ids));
      } else if (saved) {
        const parsed: string[] = JSON.parse(saved);
        const sameSet =
          parsed.length === currentIds.length &&
          parsed.every((id) => currentIds.includes(id));

        if (sameSet) {
          ids = parsed;
        } else {
          ids = shuffleArray(currentIds);
          localStorage.setItem(key, JSON.stringify(ids));
        }
      } else {
        ids = shuffleArray(currentIds);
        localStorage.setItem(key, JSON.stringify(ids));
      }
      setShuffledQuestions(ids);

      if (ids.length > 0 && attemptId) {
        const payload = ids.map((questionId, index) => ({
          questionId,
          questionOrder: index + 1,
        }));
        dispatch(
          saveQuestionOrderByAttemptIdAct(
            generateActionPayload("save_question_order_by_attempt_id", { attemptId }, payload)
          )
        );
      }
    }
  }, [questionsList, shuffleQuestions, assessmentId, studentId, attemptId, dispatch]);

  const currentQuestionId = shuffledQuestions[currentQuestionIdx];
  const currentQuestion = questionsList.find(q => q.questionId === currentQuestionId);
  const { question, options } = currentQuestion ?? {};
  const isAnswered = currentQuestion?.answeredOption != null && currentQuestion?.answeredOption !== '';
  const isOptionSelected = currentQuestion?.selectedOption != null && currentQuestion?.selectedOption !== '';
  const isLastQut = currentQuestionIdx === questionsList.length - 1;
  function formatDuration(minutes: number) {
    if (!minutes || minutes <= 0) return "N/A";

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hrs > 0 && mins > 0) return `${hrs} hr ${mins} min`;
    if (hrs > 0) return `${hrs} hr`;
    return `${mins} min`;
  }


  const { childName, childImageURL, childId, childCode } = studentDetails || {};

  const startDateTime = startDate && startTime ? `${startDate}T${startTime}` : null;
  const endDateTime = expiryDate && expiryTime ? `${expiryDate}T${expiryTime}` : null;

  const { label: originalLabel, timeLeft } = useCountdown(
    startDateTime,
    endDateTime,
    assessmentStatus
  );

  const label = originalLabel === "Ends in" ? "Time Left" : originalLabel;
  const parts = timeLeft.split(":");

  const formatShort = (val: string) => {
    const short = val
      .replace(/Days?/, "d")
      .replace(/Hours?/, "hr")
      .replace(/Minutes?/, "min")
      .replace(/Seconds?/, "sec");

    const parts = short.split(":").map(p => p.trim());

    const filtered = parts
      .map(p => {
        const [value, label] = p.split(" ");
        return { value, label };
      })
      .filter(item => !(item.value === "00" && item.label === "d"));

    return filtered;
  };
  const formatted = formatShort(timeLeft);

  const isTimeExpired = timeLeft === "Expired";
  useEffect(() => {
    onTimeExpiredChange?.(isTimeExpired);
  }, [isTimeExpired, onTimeExpiredChange]);
  useEffect(() => {
    if (isTimeExpired) {
      submitTestHandler();
    }
  }, [isTimeExpired]);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  useEffect(() => {
    if (!endDateTime) return;
    const expiry = new Date(endDateTime).getTime();
    const timer = setInterval(() => {
      if (Date.now() >= expiry) {
        clearInterval(timer);
        setShowSubmissionModal(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endDateTime]);

  const saveCurrentAnswer = (answerStatus: "ANSWERED" | "NOT_ANSWERED" | "MARKED_FOR_REVIEW",
    questionDetails: any
  ) => {
    const requestBody = {
      assessmentId: assessmentId,
      studentId,
      questionDTOList: [
        {
          questionId: questionDetails.questionId,
          selectedOptionId: questionDetails.selectedOptionId,
          answerStatus,
        },
      ]
    };

    dispatch(
      saveAutoAssessmentAct(
        generateActionPayload(
          "save_auto_assessment",
          { attemptId },
          requestBody,
          {
            headers: {
              ExamSessionId: sessionId,
            },
          }
        )
      )
    );
  };

  const handleSaveAndNext = () => {
    saveCurrentAnswer(AttemptedQuestionStatus.ANSWERED, {
      questionId: currentQuestion.questionId,
      selectedOptionId: currentQuestion.selectedOption,
    });
    dispatchBtn({
      type: "answer-question",
      payload: { questionId: currentQuestion.questionId }
    });
  };

  const handleMarkForReview = () => {
    saveCurrentAnswer(AttemptedQuestionStatus.MARKED_FOR_REVIEW, {
      questionId: currentQuestion.questionId,
      selectedOptionId: currentQuestion.selectedOption,
    });
    dispatchBtn({
      type: "markforreview-question",
      payload: { questionId: currentQuestion.questionId }
    });
  };

  const handleSkip = () => {
    saveCurrentAnswer(AttemptedQuestionStatus.NOT_ANSWERED, {
      questionId: currentQuestion.questionId,
      selectedOptionId: '',
    });
    dispatchBtn({
      type: "skip-question",
      payload: { questionId: currentQuestion.questionId }
    });
  };

  const clearAnswerHandler = () => {
    saveCurrentAnswer(AttemptedQuestionStatus.NOT_ANSWERED, {
      questionId: currentQuestion.questionId,
      selectedOptionId: '',
    });
    dispatchBtn({
      type: "clear-question",
      payload: { questionId: currentQuestion.questionId }
    });
  }
  function submitTestHandler() {
    const isAnsweredSelected =
      currentQuestion.selectedOption ?? currentQuestion.answeredOption;
    saveCurrentAnswer(
      isAnsweredSelected
        ? AttemptedQuestionStatus.ANSWERED
        : AttemptedQuestionStatus.NOT_ANSWERED,
      {
        questionId: currentQuestion.questionId,
        selectedOptionId: isAnsweredSelected || '',
      });
    dispatchBtn({
      type: "submit-assessement",
      payload: { questionId: currentQuestion.questionId }
    });
    assessementSubmissionOpenModal();
  }
  const {
    answeredCount,
    notAnsweredCount,
    notVisitedCount,
    markedForReviewCount,
    progressPercentage
  } = useMemo(() => {
    const counts = questionsList.reduce(
      (acc, q) => {
        switch (q.questionStatus) {
          case AttemptedQuestionStatus.ANSWERED:
            acc.answeredCount++;
            break;
          case AttemptedQuestionStatus.NOT_ANSWERED:
            acc.notAnsweredCount++;
            break;
          case AttemptedQuestionStatus.NOT_VISITED:
            acc.notVisitedCount++;
            break;
          case AttemptedQuestionStatus.MARKED_FOR_REVIEW:
            acc.markedForReviewCount++;
            break;
        }
        return acc;
      },
      {
        answeredCount: 0,
        notAnsweredCount: 0,
        notVisitedCount: 0,
        markedForReviewCount: 0,
      }
    );
    const total = questionsList.length;
    const progressPercentage =
      total > 0
        ? Math.floor(
          (questionsList.filter((q: any) => q.answeredOption != null && q.answeredOption !== '').length / total) * 100
        )
        : 0;
    return {
      ...counts,
      progressPercentage,
    };
  }, [questionsList]);

  return (
    <>
      <div className="card !mb-0 tw-w-full !tw-max-w-[95vw] md:!tw-max-w-[90vw] lg:!tw-max-w-[80vw] tw-flex tw-flex-col lg:tw-h-[90vh]">
        <div className="card-header tw-flex tw-flex-col sm:tw-flex-row sm:tw-justify-between sm:tw-items-center tw-gap-4 !tw-bg-[#FFF9DB] !tw-py-3 tw-w-full">
          <div className="tw-border tw-border-[#FECACA] tw-rounded tw-mb-0 d-flex !tw-items-center !tw-justify-center tw-text-[#DC2626] tw-px-2 tw-py-1.5  tw-bg-[#FEF2F2]">
            <HugeiconsIcon icon={Time02Icon} size={14} className="me-2" />
            <div className="!tw-flex !tw-justify-center !tw-items-center">
              <span>
                <span className="me-2">{label}</span>
                {formatted.map((item, idx) => (
                  <span key={idx}>
                    {item.value} {item.label}
                    {idx < formatted.length - 1 ? " : " : ""}
                  </span>
                ))}
              </span>
            </div>
          </div>
          <div className="tw-text-center">
            <p className="tw-mb-0 tw-text-base tw-font-medium">
              {assessmentName}
            </p>
            <div className="tw-flex tw-justify-center tw-gap-x-2">
              <p className="tw-mb-0">
                <span className="tw-text-xs tw-text-[#878A99] me-1">
                  Total Marks:
                </span>
                {totalMarks || "0"}
              </p>
              <p className="tw-mb-0">
                <span className="tw-text-xs tw-text-[#878A99] me-1">
                  Total Duration:
                </span>
                <span>{formatDuration(duration)}</span>
              </p>
            </div>
          </div>
          <div className="tw-w-full sm:tw-w-auto !tw-flex !tw-justify-center !tw-items-center">
            <UserDetails
              displayName={childName}
              displayId={`ID: ${childCode}`}
              size="xs"
              imageUrl={childImageURL || ""}
            />
          </div>
        </div>
        <div className="card-body p-0 tw-flex tw-flex-grow">
          <div className="row w-100 mx-auto tw-flex-grow">
            <div className="col-12 col-lg-9 col-xxl-9 tw-border-r !tw-p-5 tw-flex tw-items-between tw-flex-col">
              <div className="tw-flex-grow">
                <div className="tw-flex tw-justify-between tw-items-center tw-mb-3">
                  <p className="tw-mb-0 tw-font-semibold">
                    {`Question ${currentQuestionIdx + 1} / ${questionsList.length
                      }
                    `}
                  </p>
                  <p className="tw-mb-0 tw-text-gray-500 tw-text-xs tw-flex tw-items-center">
                    <HugeiconsIcon
                      icon={StarIcon}
                      className="tw-me-1 tw-text-[#FFD700]"
                      size={14}
                      fill="#FFD700"
                    />
                    <span className="me-2">Marks:</span>
                    <span>{currentQuestion?.points ?? "-"}</span>
                  </p>
                </div>
                <div>
                  <p className="tw-text-base tw-leading-[2]">
                    <MathPreview json={question}></MathPreview>
                  </p>

                  {options?.length > 0 && options.map((option, idx) => {
                    const isAnswered = currentQuestion?.selectedOption === option.optionId;

                    return (
                      <div
                        key={option.optionId}
                        className={`tw-border tw-rounded tw-py-2 tw-ps-4 tw-mb-3 transition-all cursor-pointer ${isAnswered ? "tw-border-[#4F46E5] tw-bg-[#EFF6FF]" : "tw-border-gray-200"
                          }`}
                        onChange={() =>
                          dispatchBtn({
                            type: "selected-option",
                            payload: { questionId: currentQuestion.questionId, optionId: option.optionId }
                          })
                        }
                      >
                        <div className="form-check !tw-flex !tw-justify-center !tw-items-center">
                          <input
                            className="form-check-input !tw-mr-2"
                            type="radio"
                            name={`question-${currentQuestion?.questionId}`}
                            id={`option-${option.optionId}`}
                            value={option.optionId}
                            checked={isAnswered}
                            readOnly
                          />
                          <label className="form-check-label w-100" htmlFor={`option-${option.optionId}`}>
                            <div className="tw-flex tw-items-center">
                              <span className="tw-me-2">{`${String.fromCharCode(65 + idx)})`}</span>
                              <MathPreview json={option?.optionValue} />
                            </div>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="tw-flex tw-flex-col sm:tw-flex-row sm:tw-flex-wrap sm:tw-justify-center tw-mt-auto tw-gap-3 lg:tw-mb-8">
                <button
                  className={classnames(
                    "tw-bg-[#F3F4F6] tw-text-[#374151] tw-text-sm tw-font-medium tw-px-3 tw-py-1.5 tw-rounded tw-shadow-sm hover:!tw-bg-gray-200 tw-flex tw-items-center tw-justify-center",
                    {
                      "tw-opacity-70 tw-cursor-not-allowed": (currentQuestionIdx === 0),
                    }
                  )}
                  onClick={() => dispatchBtn({
                    type: "previous-question",
                    payload: { questionId: currentQuestion.questionId }
                  })}
                  disabled={isTimeExpired || (currentQuestionIdx === 0)}
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
                    "tw-bg-red-100 tw-text-red-700 tw-inline-block tw-font-medium tw-leading-[1.5] tw-text-center tw-no-underline tw-align-middle tw-cursor-pointer tw-select-none tw-py-[0.4065rem] tw-px-[0.9rem] tw-text-sm tw-rounded tw-transition-colors tw-duration-150 hover:tw-bg-red-200 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                  )}
                  onClick={clearAnswerHandler}
                  disabled={isTimeExpired || !(isAnswered || isOptionSelected)}
                >
                  <HugeiconsIcon icon={Delete02Icon} className="tw-me-2" size={16} />
                  Clear Answer
                </button>
                <button
                  className={classnames(
                    "tw-text-sm tw-font-medium tw-px-3 tw-py-1.5 tw-rounded tw-shadow-sm !tw-bg-[#F3E8FF] tw-text-[#7E22CE] hover:!tw-bg-[#cba7eb] tw-flex tw-items-center tw-justify-center"
                  )}
                  onClick={handleMarkForReview}
                  disabled={isTimeExpired}
                >
                  <HugeiconsIcon icon={Bookmark01Icon} className="tw-me-2" size={16} />
                  Mark for Review
                </button>
                <button
                  className={classnames(
                    "tw-bg-[#0ab39c] tw-text-white tw-inline-block tw-font-medium tw-leading-[1.5] tw-text-center tw-no-underline tw-align-middle tw-cursor-pointer tw-select-none tw-py-[0.4065rem] tw-px-[0.9rem] tw-text-sm tw-rounded tw-transition-colors tw-duration-150 tw-ease-in-out hover:tw-bg-[#099885] disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                  )}
                  onClick={handleSaveAndNext}
                  disabled={isTimeExpired || !(isAnswered || isOptionSelected)}
                >
                  {isLastQut ? "Save" : "Save & Next"}
                  <HugeiconsIcon icon={ArrowRight01Icon} className="tw-ms-2" size={16} />
                </button>

                {isLastQut ? (
                  <button
                    className="tw-bg-[#0ab39c] tw-text-white tw-inline-block tw-font-medium tw-leading-[1.5] tw-text-center tw-no-underline tw-align-middle tw-cursor-pointer tw-select-none tw-py-[0.4065rem] tw-px-[0.9rem] tw-text-sm tw-rounded tw-transition-colors tw-duration-150 tw-ease-in-out hover:tw-bg-[#099885] disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
                    onClick={submitTestHandler}
                  >
                    <HugeiconsIcon
                      icon={SentIcon}
                      className="tw-me-2"
                      size={16}
                    />
                    Submit Test
                  </button>
                ) : (
                  <>
                    <button
                      className={classnames(
                        "tw-bg-red-100 tw-text-red-800 hover:tw-bg-red-200 font-semibold tw-leading-[1.5] tw-text-center tw-no-underline tw-align-middle tw-cursor-pointer tw-select-none tw-py-[0.4065rem] tw-px-[0.9rem] tw-text-sm tw-rounded tw-transition-colors tw-duration-150"
                      )}
                      onClick={handleSkip}
                    >
                      Skip
                      <HugeiconsIcon icon={ArrowRight01Icon} className="tw-ms-2" size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="col-12 col-lg-3 col-xxl-3 p-0 tw-bg-gray-50 tw-flex tw-flex-col">
              <div className="tw-px-4 tw-py-3 tw-border-b">
                <p className="tw-mb-3 tw-font-semibold">Test Progress</p>
                <div className="tw-grid tw-grid-cols-2 tw-gap-3 lg:tw-gap-3 xl:tw-gap-5 tw-mb-4 lg:tw-px-0 lg:tw-py-2 xl:tw-px-6 xl:tw-py-3">
                  <div className="tw-bg-green-100 tw-text-green-700 tw-p-4 md:tw-p-2 xl:tw-p-4 tw-rounded-lg tw-flex tw-flex-col tw-justify-center tw-items-center tw-shadow-md">
                    <HugeiconsIcon icon={CheckmarkCircle03Icon} size={18} className="tw-mb-1" />
                    <p className="tw-text-xs tw-mb-0 tw-text-center">Answered</p>
                    <p className="tw-font-bold tw-text-lg tw-mb-0">{answeredCount}</p>
                  </div>
                  <div className="tw-bg-red-100 tw-text-red-700 tw-p-4 md:tw-p-2 xl:tw-p-4 tw-rounded-lg tw-flex tw-flex-col tw-justify-center tw-items-center tw-shadow-md">
                    <HugeiconsIcon icon={CancelCircleIcon} size={18} className="tw-mb-1" />
                    <p className="tw-text-xs tw-mb-0 tw-text-center">Not Answered</p>
                    <p className="tw-font-bold tw-text-lg tw-mb-0">{notAnsweredCount}</p>
                  </div>
                  <div className="tw-bg-purple-100 tw-text-purple-700 tw-p-4 md:tw-p-2 xl:tw-p-4 tw-rounded-lg tw-flex tw-flex-col tw-justify-center tw-items-center tw-shadow-md">
                    <HugeiconsIcon icon={Bookmark01Icon} size={18} className="tw-mb-1" />
                    <p className="tw-text-xs tw-mb-0 tw-text-center">Mark for Review</p>
                    <p className="tw-font-bold tw-text-lg tw-mb-0">{markedForReviewCount}</p>
                  </div>
                  <div className="tw-bg-yellow-100 tw-text-yellow-700 tw-p-4 md:tw-p-2 xl:tw-p-4 tw-rounded-lg tw-flex tw-flex-col tw-justify-center tw-items-center tw-shadow-md">
                    <HugeiconsIcon icon={AlertCircleIcon} size={18} className="tw-mb-1" />
                    <p className="tw-text-xs tw-mb-0 tw-text-center">Left</p>
                    <p className="tw-font-bold tw-text-lg tw-mb-0">{notVisitedCount}</p>
                  </div>
                </div>
                <div>
                  <div className="tw-flex tw-justify-between tw-items-center tw-mb-1 tw-text-xs tw-text-gray-600 tw-font-medium">
                    <p className="tw-mb-0">Progress</p>
                    <p className="tw-mb-0">{`${Math.round(
                      progressPercentage
                    )}%`}</p>
                  </div>
                  <Progress
                    className="my-2 w-100 !tw-h-2"
                    value={progressPercentage}
                    color="primary"
                  ></Progress>
                </div>
              </div>
              <div className="tw-px-4 tw-py-3">
                <p className="tw-mb-3 tw-font-semibold">Questions</p>
                <div className="tw-grid tw-gap-2 tw-grid-cols-[repeat(auto-fill,_minmax(36px,_1fr))]">
                  {shuffledQuestions.map((questionId, idx) => {
                    const q = questionsList.find(question => question.questionId === questionId);
                    return (
                      <button
                        key={questionId}
                        className={classnames(
                          "tw-w-9 tw-h-9 tw-rounded-md tw-flex tw-items-center tw-justify-center tw-text-sm tw-transition-all tw-duration-200 hover:tw-scale-105",
                          currentQuestionIdx === idx
                            ? "tw-bg-indigo-600 tw-text-white font-semibold tw-ring-2 tw-ring-offset-2 tw-ring-indigo-500"
                            : statusColor[q?.questionStatus]
                        )}
                        onClick={() =>
                          dispatchBtn({
                            type: "jumpto-question",
                            payload: {
                              targetIndex: idx,
                              currentQuestionId: currentQuestion?.questionId
                            }
                          })
                        }
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="tw-px-4 tw-pt-2 tw-pb-3">
                <div className="tw-grid tw-grid-cols-2 tw-gap-x-4 tw-gap-y-2">
                  {questionIndications.map((indicator) => (
                    <div
                      className="tw-flex align-items-center"
                      key={indicator.indicationId}
                    >
                      <span
                        className={`tw-w-4 tw-h-4 tw-rounded-md me-2 tw-inline-block tw-border-0 tw-flex-shrink-0 
                          ${indicator?.className}`}
                      ></span>
                      <span className="tw-text-sm tw-text-gray-600 tw-whitespace-nowrap !tw-text-wrap">{indicator.indicationLabel}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewAssessment;
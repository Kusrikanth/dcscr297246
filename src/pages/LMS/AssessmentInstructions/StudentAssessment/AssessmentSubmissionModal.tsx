import { useEffect, useMemo, useState } from "react";
import { default as RejectSvg } from "../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { AttemptedQuestionStatus } from "./helper";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { submitAssessmentAct } from "../../../../store/lms/studentAssessment/studentAssessmentActions";
import { useOneMinuteCountdown } from "../../../../utility/commonutility";

const AssessmentSubmissionModal = ({
  assessmentId,
  attemptId,
  tabSwitchCount,
  studentId,
  questionsList,
  dispatch,
  sessionId,
  toggle,
  assessmentDetails,
  isTimeExpired,
  autoStartCountdown = false,
}) => {

  const { timeLeft: oneMinLeft, formatted } = useOneMinuteCountdown(autoStartCountdown, 60);

  useEffect(() => {
    if (autoStartCountdown && oneMinLeft === 0) {
      submitExamHandler();
    }
  }, [oneMinLeft, autoStartCountdown]);

  const {
    answeredCount,
    notAnsweredCount,
    notVisitedCount,
    totalQuestions
  } = useMemo(() => {
    const counts = questionsList.reduce(
      (acc, q) => {
        if (
          (q.questionStatus === AttemptedQuestionStatus.ANSWERED) ||
          (q.questionStatus === AttemptedQuestionStatus.MARKED_FOR_REVIEW && q.answeredOption)
        ) {
          acc.answeredCount++;
        } else if (
          (q.questionStatus === AttemptedQuestionStatus.NOT_ANSWERED) ||
          (q.questionStatus === AttemptedQuestionStatus.MARKED_FOR_REVIEW && !q.answeredOption)
        ) {
          acc.notAnsweredCount++;
        } else if (q.questionStatus === AttemptedQuestionStatus.NOT_VISITED) {
          acc.notVisitedCount++;
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
    return ({
      ...counts, totalQuestions: questionsList.length
    })
  }, [questionsList]);

  function submitExamHandler() {
    const requestBody = {
      assessmentId,
      studentId,
      tabsSwitched: tabSwitchCount,
      questionDTOList: questionsList.map((question: any) => ({
        questionId: question.questionId,
        selectedOptionId: question.answeredOption,
        answerStatus: question.questionStatus,
      })),
    };

    dispatch(
      submitAssessmentAct(
        generateActionPayload(
          "submit_assessment",
          { attemptId },
          requestBody,
          { headers: { ExamSessionId: sessionId } }
        )
      )
    );
  }
  const [timeLeft, setTimeLeft] = useState<number>(0);

useEffect(() => {
  if (!assessmentDetails?.expiryDate || !assessmentDetails?.expiryTime) return;

  const expiry = new Date(
    `${assessmentDetails.expiryDate}T${assessmentDetails.expiryTime}Z`
  ).getTime();

  const interval = setInterval(() => {
    const now = Date.now();
    const diff = Math.max(0, Math.floor((expiry - now) / 1000));
    setTimeLeft(diff);
  }, 1000);

  return () => clearInterval(interval);
}, [assessmentDetails?.expiryDate, assessmentDetails?.expiryTime]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };
  const gracePeriod = assessmentDetails?.gracePeriodEndTime;
  const graceThreshold = gracePeriod * 60;

  const canSubmit = timeLeft <= graceThreshold;
  return (
    <>
      <div className="modal-body p-0 pt-2">
        <div className="tw-flex tw-flex-col tw-items-center tw-justify-center p-3 ">
          <div className="mb-3 text-center">
            <div className="tw-flex tw-mb-3 justify-content-center">
              <RejectSvg fill="#f06548" width={"52px"} height="52px" />
            </div>
            <h4 className="mb-0">Are you sure you want to submit the test?</h4>
            <p className="mb-0 text-muted fs-12">
              No changes will be allowed after submission.
            </p>
          </div>
          <div className="tw-flex tw-flex-col tw-gap-y-1">
            <p className="tw-flex tw-items-center tw-mb-0">
              <span
                className={`tw-w-3 tw-h-3 tw-rounded me-3 tw-inline-block tw-border-0 tw-flex-shrink-0 tw-bg-indigo-500`}
              ></span>
              <span className="me-2 tw-text-gray-500">
                Total Number of Questions:
              </span>
              <span className="tw-text-base tw-font-medium">
                {totalQuestions}
              </span>
            </p>
            <p className="tw-flex tw-items-center tw-mb-0">
              <span
                className={`tw-w-3 tw-h-3 tw-rounded me-3 tw-inline-block tw-border-0 tw-flex-shrink-0 tw-bg-green-500`}
              ></span>
              <span className="me-2 tw-text-gray-500">
                No of Questions Answered:
              </span>
              <span className="tw-text-base tw-font-medium">
                {answeredCount}
              </span>
            </p>
            <p className="tw-flex tw-items-center tw-mb-0">
              <span
                className={`tw-w-3 tw-h-3 tw-rounded me-3 tw-inline-block tw-border-0 tw-flex-shrink-0 tw-bg-red-500`}
              ></span>
              <span className="me-2 tw-text-gray-500">
                No of Questions Skipped:
              </span>
              <span className="tw-text-base tw-font-medium">
                {notAnsweredCount}
              </span>
            </p>
            <p className="tw-flex tw-items-center tw-mb-0">
              <span
                className={`tw-w-3 tw-h-3 tw-rounded me-3 tw-inline-block tw-border-0 tw-flex-shrink-0 tw-bg-gray-500`}
              ></span>
              <span className="me-2 tw-text-gray-500">
                Questions Not Visited:
              </span>
              <span className="tw-text-base tw-font-medium">
                {notVisitedCount}
              </span>
            </p>
          </div>
        </div>
        <div className="text-center mt-3">
          {isTimeExpired && autoStartCountdown ? (
            <p className="fw-bold text-danger">
              Auto-submitting in {formatted}
            </p>
          ) : (
            <p className="fw-bold">
               Time Left:{" "}
            <span className={timeLeft <= 60 ? "text-danger" : "text-warning"}>
              {formatTime(timeLeft)}
            </span>
            </p>
          )}
        </div>
        <div className="p-3 tw-border-t">
          <div className="tw-flex tw-justify-center">
            <button
              type="button"
              className="btn btn-success tw-me-3"
              onClick={submitExamHandler}
              disabled={!canSubmit}
            >
              Yes, Submit
            </button>
            <button
              type="button"
              className="btn btn-outline-light !tw-text-gray-700 !tw-border-gray-400 tw-cursor-not-allowed"
              onClick={toggle}
              disabled={canSubmit}
            >
              No, Go Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssessmentSubmissionModal;

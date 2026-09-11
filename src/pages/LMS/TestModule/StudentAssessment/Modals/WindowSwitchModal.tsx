import { useEffect, useRef } from "react";
import { default as RejectSvg } from "../../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { submitAssessmentAct } from "../../../../../store/lms/studentAssessment/studentAssessmentActions";
import { useOneMinuteCountdown } from "../../../../../utility/commonutility";
import { generateActionPayload } from "../../../../../utility/reduxutility";

const WindowSwitchModal = ({
  onBack,
  count,
  enterFullScreen,
  assessmentId,
  attemptId,
  studentId,
  questionsList,
  dispatch,
  sessionId,
}) => {
  const maxSwitches = 3;
  const remainingSwitches = maxSwitches - count;
  const hasExceededLimit = remainingSwitches <= 0;

  const { timeLeft, formatted } = useOneMinuteCountdown(hasExceededLimit, 5);

  function submitExamHandler() {
    const requestBody = {
      assessmentId,
      studentId,
      tabsSwitched: count,
      questionDTOList: questionsList.map((question: any) => ({
        questionId: question.questionId,
        selectedOptionId: question.answeredOption,
        answerStatus: question.questionStatus,
      })),
      // escalateReason: "WINDOW_SWITCH_LIMIT_EXCEEDED",
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

const hasSubmittedRef = useRef(false);

useEffect(() => {
  if (hasExceededLimit && timeLeft === 0 && !hasSubmittedRef.current) {
    hasSubmittedRef.current = true;
    submitExamHandler();
  }
}, [hasExceededLimit, timeLeft]); 
  return (
    <div className="modal-body p-0 pt-2">
      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center p-3">
        <div className="mb-3 text-center">
          <div className="tw-flex tw-mb-3 justify-content-center">
            <RejectSvg width="52px" height="52px" />
          </div>
          <h4 className="mb-2">Window Switch Detected</h4>

          {!hasExceededLimit ? (
            <p className="mt-2 text-danger fw-bold">
               Warning: Only {remainingSwitches} switch{remainingSwitches > 1 ? "es" : ""} left. After that, your Assessment will be auto-submitted.
            </p>
          ) : (
            <p className="mt-2 text-danger fw-bold">
               Assessment locked. Auto-submitting in {formatted}s...
            </p>
          )}
        </div>
      </div>

      <div className="p-3 tw-border-t">
        <div className="tw-flex tw-justify-center">
          {!hasExceededLimit ? (
            <button
              className="btn btn-success"
              onClick={async () => {
                await enterFullScreen();
                onBack();
              }}
            >
              Back to Assessment
            </button>
          ) : (
            <button className="btn btn-secondary" disabled>
             Assessment Locked
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WindowSwitchModal;

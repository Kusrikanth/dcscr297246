import { useEffect, useMemo, useRef, useState } from "react";
import { default as RejectSvg } from "../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { HugeiconsIcon } from "@hugeicons/react";
import { Time02Icon } from "@hugeicons-pro/core-stroke-standard";
import { getCurrentStatusOfAssessmentAct, restartAssessmentAct } from "../../../../store/lms/studentAssessment/studentAssessmentActions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useOneMinuteCountdown } from "../../../../utility/commonutility";

// Countdown hook defined inside component
const ConnectionLostModal = ({ dispatch, assessmentId, toggle, studentDetails }) => {
  // Custom hook for 1-minute countdown
  
  const history = useHistory();
  const { parentChildrensResp, currentStudentId, restartAssessmentResp, getCurrentStatusOfAssessmentResp, studentAssessmentsQuestionsErrorResp } =
    useAppSelector(
      ({
        directoryStudent,
        studentAssessments,
        appData
      }) => ({
        getCurrentStatusOfAssessmentResp:
          studentAssessments.getCurrentStatusOfAssessmentResp,
        parentChildrensResp: directoryStudent.parentChildrensResp,
        currentStudentId: appData.currentStudentId,
        restartAssessmentResp: studentAssessments.restartAssessmentResp,
        studentAssessmentsQuestionsErrorResp: studentAssessments.studentAssessmentsQuestionsErrorResp,
      }),
      shallowEqual
    );
  const StudentAAssessmentRef = useRef({
    prevstudentAssessmentsQuestionsErrorResp: studentAssessmentsQuestionsErrorResp,
    prevRestartAssessmentResp: restartAssessmentResp,
  })
  useEffect(() => {
    const { prevstudentAssessmentsQuestionsErrorResp, prevRestartAssessmentResp } = StudentAAssessmentRef.current || {}
    if (studentAssessmentsQuestionsErrorResp && prevstudentAssessmentsQuestionsErrorResp !== studentAssessmentsQuestionsErrorResp) {
      const { details } = studentAssessmentsQuestionsErrorResp || {}
      toast.error(details || "Something went wrong")
    }
    else if (restartAssessmentResp && prevRestartAssessmentResp !== restartAssessmentResp) {
      toast.success("Assessment Restarted")
      toggle();
      history.push({
        pathname: `/student-assessment`,
        state: {
          assessmentId,
          studentDetails: studentDetails,
          attemptId: getCurrentStatusOfAssessmentResp.attemptId,
          sessionId: getCurrentStatusOfAssessmentResp.sessionId
        },
      })
    }
    StudentAAssessmentRef.current.prevstudentAssessmentsQuestionsErrorResp = studentAssessmentsQuestionsErrorResp;
    StudentAAssessmentRef.current.prevRestartAssessmentResp = restartAssessmentResp;
  }, [studentAssessmentsQuestionsErrorResp, restartAssessmentResp])

  const { timeLeft, formatted } = useOneMinuteCountdown(true, 60);

  const child = studentDetails;

  const fetchCurrentStatusOfAssessmentAttempt = (otherProps?: any) => {
    const payload = {
      assessmentId,
      studentId: currentStudentId,
      ...otherProps
    }

    dispatch(getCurrentStatusOfAssessmentAct(generateActionPayload("get_current_status_of_assessment", undefined, payload)))
  }

  useEffect(() => {
    if (assessmentId && currentStudentId) {
      fetchCurrentStatusOfAssessmentAttempt({ studentId: currentStudentId })
    }
  }, [assessmentId, currentStudentId])
  const resumeTest = () => {
    if (!assessmentId || !child?.childId) return;

    const params = {
      attemptId: getCurrentStatusOfAssessmentResp.attemptId,
    }

    dispatch(restartAssessmentAct(generateActionPayload("restart_assessment", params, undefined, {
      headers: {
        ExamSessionId: getCurrentStatusOfAssessmentResp.sessionId,
      }
    })))
  };
  return (
    <div className="modal-body p-0 pt-2">
      <div className="tw-flex tw-flex-col tw-items-center tw-justify-center pb-0 p-3">
        <div className="mb-3 text-center">
          <div className="tw-flex tw-mb-3 justify-content-center">
            <HugeiconsIcon icon={Time02Icon} size={40} className="me-2" />
          </div>
          <p className="mb-0 fs-20 fw-medium">Resume Test</p>
          <p className="mb-0 text-muted">Your test will resume in</p>
          <span className="fs-20">{formatted}</span>
        </div>
      </div>

      <div className="px-3 pb-4 pt-0">
        <div className="tw-flex tw-justify-center">
          <button
            className="btn btn-success"
            onClick={() => {
              resumeTest();
            }}
            disabled={timeLeft > 0}
          >
            Resume Test
          </button>

        </div>
      </div>
    </div>
  );
};

export default ConnectionLostModal;

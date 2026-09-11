import dpsLogo from "../../../../assets/imagesdps/dps-logo.png";
import {
  UncontrolledAccordion,
  AccordionItem
} from "reactstrap";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import AssessementResult from "./AssessementResult";
import { MathJaxContext } from "better-react-mathjax";
import NewAssessment from "./NewAssessment";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getCurrentStatusOfAssessmentAct, getStudentAssessmentsListByIdAct, getStudentAssessmentsQuestionsAct, saveAutoAssessmentAct } from "../../../../store/lms/studentAssessment/studentAssessmentActions";
import AssessmentHeader from "./AssessmentHeader";
import QuestionsListNav from "./QuestionsListNav";
import CurrentQuestion from "./CurrentQuestion";
import { FullPageLoader, ModalContainerUpdated } from "../../../../Components/Common";
import { AttemptedQuestionStatus, mapApiQuestions, useDisableBackButton } from "./helper";
import { toast } from "react-toastify";
import { useModal } from "../../../../hooks/modalhook";
import AssessmentSubmissionModal from "./AssessmentSubmissionModal";
import SubmissionSuccessModal from "./SubmissionModal";
import ConnectionLostModal from "./ConnectionLostModal";
import WindowSwitchModal from "../../TestModule/StudentAssessment/Modals/WindowSwitchModal";
import FullScreenModal from "./FullScreenModal";


const initialState = {
  currentQuestionIdx: 0,
  questionsList: [],
  answeredValue: null,
  hasCompleted: false,
  totalPointsGained: 0,
  totalAnsweredQuestions: 0,
  noSkippedQuestion: 0,
  noNotAnswered: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "set-questions": {
      const {
        assessmentQuestions,
        attemptedAssessmentQuestions
      } = action.payload;
      const questions = mapApiQuestions(assessmentQuestions, attemptedAssessmentQuestions);
      return {
        ...state,
        questionsList: questions,
      };
    }
    case "selected-option": {
      const { questionId, optionId } = action.payload;
      const updatedList = state.questionsList.map((q: any) => {
        if (q.questionId === questionId) {
          return { ...q, selectedOption: optionId };
        }
        return q;
      });
      return {
        ...state,
        questionsList: updatedList
      };
    }
    case "previous-question": {
      if (state.currentQuestionIdx === 0) return state;

      const { questionId } = action.payload || {};
      const prevQuestionIdx = state.currentQuestionIdx - 1;
      const updatedList = state.questionsList.map((q) => {
        if (q.questionId === questionId) {
          return {
            ...q,
            selectedOption: q.answeredOption ?? undefined,
            questionStatus: (AttemptedQuestionStatus.NOT_VISITED === q.questionStatus) ? AttemptedQuestionStatus.NOT_ANSWERED :
              q.questionStatus,
          };
        }
        return q;
      });

      return {
        ...state,
        currentQuestionIdx: prevQuestionIdx,
        questionsList: updatedList,
      };
    }
    case "answer-question": {
      const { questionId } = action.payload || {};
      const updatedList = state.questionsList.map((q: any) => {
        if (q.questionId === questionId) {
          return {
            ...q,
            answeredOption: q.selectedOption ?? undefined,
            questionStatus: Boolean(q.selectedOption) ? AttemptedQuestionStatus.ANSWERED :
              AttemptedQuestionStatus.NOT_ANSWERED,
          };
        }
        return q;
      });
      const nextQuestionIdx = state.currentQuestionIdx + 1;
      return {
        ...state,
        currentQuestionIdx: nextQuestionIdx >= state.questionsList.length ?
          state.currentQuestionIdx : nextQuestionIdx,
        questionsList: updatedList,
      };
    }
    case "markforreview-question": {
      const { questionId } = action.payload || {};
      const nextQuestionIdx = state.currentQuestionIdx + 1;
      const updatedList = state.questionsList.map((q: any) => {
        if (q.questionId === questionId) {
          return {
            ...q,
            answeredOption: q.selectedOption ?? undefined,
            questionStatus: AttemptedQuestionStatus.MARKED_FOR_REVIEW,
          };
        }
        return q;
      });
      return {
        ...state,
        currentQuestionIdx: nextQuestionIdx >= state.questionsList.length ?
          state.currentQuestionIdx : nextQuestionIdx,
        questionsList: updatedList,
      };
    }
    case "skip-question": {
      const { questionId } = action.payload || {};
      const nextQuestionIdx = state.currentQuestionIdx + 1;

      const updatedList = state.questionsList.map((q: any) => {
        if (q.questionId !== questionId) return q;
        if (q.questionStatus === AttemptedQuestionStatus.ANSWERED) {
          return q;
        }
        if (q.questionStatus === AttemptedQuestionStatus.MARKED_FOR_REVIEW) {
          return q;
        }
        return {
          ...q,
          selectedOption: q.answeredOption ?? undefined,
          questionStatus: AttemptedQuestionStatus.NOT_ANSWERED,
        };
      });
      return {
        ...state,
        currentQuestionIdx: nextQuestionIdx,
        questionsList: updatedList,
      };
    }
    case "jumpto-question": {
      const { targetIndex, currentQuestionId } = action.payload;
      if (targetIndex === state.currentQuestionIdx) {
        return state;
      }
      const updatedList = state.questionsList.map((q) => {
        if (q.questionId === currentQuestionId) {
          return {
            ...q,
            selectedOption: q.answeredOption ?? undefined,
            questionStatus: (AttemptedQuestionStatus.NOT_VISITED === q.questionStatus) ? AttemptedQuestionStatus.NOT_ANSWERED :
              q.questionStatus,
          };
        }
        return q;
      });

      return {
        ...state,
        currentQuestionIdx: targetIndex,
        questionsList: updatedList,
      };
    }
    case "clear-question": {
      const { questionId } = action.payload || {};
      const updatedList = state.questionsList.map((q) => {
        if (q.questionId === questionId) {
          return {
            ...q,
            selectedOption: undefined,
            answeredOption: undefined,
            questionStatus: AttemptedQuestionStatus.NOT_ANSWERED
          }
        }
        return q;
      });

      return {
        ...state,
        questionsList: updatedList,
      };
    }
    case "submit-assessement": {
      const { questionId } = action.payload || {};
      const updatedList = state.questionsList.map((q) => {
        if (q.questionId === questionId) {
          return {
            ...q,
            answeredOption: q.selectedOption ?? q.answeredOption,
            questionStatus: q.selectedOption
              ? AttemptedQuestionStatus.ANSWERED
              : AttemptedQuestionStatus.NOT_ANSWERED,
          };
        }
        return q;
      });

      return {
        ...state,
        questionsList: updatedList,
      };
    }
    case "completed":
      return {
        ...state,
        hasCompleted: true
      };
    default:
      return state;
  }
}

const StudentAssessment = () => {
  const [
    { currentQuestionIdx, questionsList, answeredValue, hasCompleted, totalAnsweredQuestions, noSkippedQuestion, noNotAnswered },
    dispatch,
  ] = useReducer(reducer, initialState);
  const intervalRef = useRef<any>(null);
  const {
    openModal: assessementSubmissionOpenModal,
    closeModal: assessementSubmissionCloseModal,
    modalState: assessementSubmissionModalState,
  } = useModal();
  const {
    openModal: assessementConnectionLostOpenModal,
    closeModal: assessementConnectionLostCloseModal,
    modalState: assessementConnectionLostModalState,
  } = useModal();
  const [isTimeExpired, setIsTimeExpired] = useState(false);
  const { modalState: studentAlertModalState, openModal: openStudentAlertModal, closeModal: closeStudentAlertModal } = useModal();
  const { modalState: fullScreenModalState, openModal: openFullScreenModal, closeModal: closeFullScreenModal } = useModal();
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const location = useLocation<any>()
  const history = useHistory();
  const { assessmentId, studentDetails, sessionId } =
    location.state || {};

  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setTabSwitchCount((prev) => prev + 1);
        handleOpenStudentAlertModal();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!sessionId) {
      history.push("/student-assessments");
    }
  }, [sessionId, history]);

  const { getStudentAssessmentsQuestionsResp, submitAssessmentResp,
    getStudentAssessmentsListByIdResp: assessmentDetails, parentChildrensResp,
    getCurrentStatusOfAssessmentResp, showApiLoader, studentAssessmentsQuestionsErrorResp
  } = useAppSelector(
    ({ studentAssessments, globalData, directoryStudent }) => ({
      getStudentAssessmentsQuestionsResp: studentAssessments.getStudentAssessmentsQuestionsResp,
      getCurrentStatusOfAssessmentResp:
        studentAssessments.getCurrentStatusOfAssessmentResp,
      getStudentAssessmentsListByIdResp:
        studentAssessments.getStudentAssessmentsListByIdResp,
      submitAssessmentResp:
        studentAssessments.submitAssessmentResp,
      studentAssessmentsQuestionsErrorResp: studentAssessments.studentAssessmentsQuestionsErrorResp,
      parentChildrensResp: directoryStudent.parentChildrensResp,
      showApiLoader: globalData.showApiLoader
    }),
    shallowEqual
  );
  const { attemptId, attemptStatus } = getCurrentStatusOfAssessmentResp || {};
  const appDispatch = useAppDispatch();

  const studentAssessmentRef = useRef({
    prevSubmitAssessmentResp: submitAssessmentResp,
    prevstudentAssessmentsQuestionsErrorResp: studentAssessmentsQuestionsErrorResp,
  })

  useEffect(() => {
    const { prevSubmitAssessmentResp, prevstudentAssessmentsQuestionsErrorResp } = studentAssessmentRef.current;
    if (submitAssessmentResp && prevSubmitAssessmentResp !== submitAssessmentResp) {
      toast.success('Assessment submit successfully.');
      dispatch({ type: 'completed' });
      assessementSubmissionCloseModal();
      closeStudentAlertModal();
      clearInterval(intervalRef.current);
    } else if (studentAssessmentsQuestionsErrorResp && prevstudentAssessmentsQuestionsErrorResp !== studentAssessmentsQuestionsErrorResp) {
      const { details } = studentAssessmentsQuestionsErrorResp || {}
      toast.error(details || "Something went wrong")
      // assessementConnectionLostOpenModal();
    }
    studentAssessmentRef.current.prevstudentAssessmentsQuestionsErrorResp = studentAssessmentsQuestionsErrorResp;

    studentAssessmentRef.current.prevSubmitAssessmentResp = submitAssessmentResp;
  }, [submitAssessmentResp, studentAssessmentsQuestionsErrorResp]);

  const totalMarks = useMemo(() => {
    if (!questionsList || questionsList.length === 0) {
      return 0;
    }
    return questionsList.reduce((sum, question) => sum + (question?.points || 0), 0);
  }, [questionsList]);


  const shouldHideAnswers = false;

  useEffect(() => {
    if (assessmentId && studentDetails?.childId) {
      appDispatch(getStudentAssessmentsQuestionsAct(generateActionPayload("get_student_assessments_questions",
        {
          assessmentId
        }, { hideAnswers: shouldHideAnswers, studentId: studentDetails?.childId, })));
      appDispatch(getCurrentStatusOfAssessmentAct(
        generateActionPayload("get_current_status_of_assessment", undefined, {
          assessmentId,
          studentId: studentDetails?.childId,
        })))
      appDispatch(
        getStudentAssessmentsListByIdAct(
          generateActionPayload("get_student_assessment_list_by_id", {
            assessmentId
          })
        )
      );
    }
  }, [assessmentId, studentDetails, appDispatch]);


  useEffect(() => {
    if (studentDetails?.childId && assessmentId && attemptId) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      intervalRef.current = setInterval(() => {
        if (questionsList?.length > 0) {
          const requestBody = {
            assessmentId,
            studentId: studentDetails?.childId,
            questionDTOList: questionsList.map((question: any) => {
              return ({
                questionId: question.questionId,
                selectedOptionId: question.answeredOption,
                answerStatus: question.questionStatus,
              })
            })
          };
          appDispatch(
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
        }
      }, 15000);
    }
    return () => clearInterval(intervalRef.current);
  }, [appDispatch, questionsList, studentDetails?.childId, assessmentId, attemptId]);


  useEffect(() => {
    if (getStudentAssessmentsQuestionsResp?.length) {
      dispatch({
        type: "set-questions",
        payload: {
          assessmentQuestions: getStudentAssessmentsQuestionsResp,
          attemptedAssessmentQuestions: getCurrentStatusOfAssessmentResp
        },
      });
    }
  }, [getStudentAssessmentsQuestionsResp, getCurrentStatusOfAssessmentResp]);

  async function enterFullScreen(): Promise<void> {
    try {
      const elem = document.documentElement; // fullscreen the whole page

      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) { // Safari
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) { // Firefox
        await (elem as any).mozRequestFullScreen();
      } else if ((elem as any).msRequestFullscreen) { // IE/Edge
        await (elem as any).msRequestFullscreen();
      } else {
        console.error("Fullscreen API is not supported by this browser");
      }
    } catch (error) {
      console.error("Enter fullscreen failed:", error);
    }
  }
  useDisableBackButton(true);
  useEffect(() => {
    enterFullScreen();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        console.warn("Fullscreen exited!");
        openFullScreenModal();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [openFullScreenModal]);

  const handleOpenStudentAlertModal = () => {
    closeFullScreenModal();
    openStudentAlertModal();
  };

  const handleCloseFullScreenModal = async () => {
    await enterFullScreen();
    closeFullScreenModal();
  };
  const handleCloseStudentAlertModal = async () => {
    await enterFullScreen();
    closeStudentAlertModal();
  };

  if (!questionsList.length) {
    return <FullPageLoader />
  }

  return (
    <>
      <MathJaxContext config={{ options: { enableMenu: false } }}>
        <div className="page-content student-assessment-container lg:tw-h-screen tw-flex tw-justify-center tw-items-center">
          <div className="container-fluid tw-h-auto">
            {attemptStatus === "EVALUATED" ? (
              <SubmissionSuccessModal
                studentDetails={studentDetails}
                submitAssessmentResp={submitAssessmentResp}
                parentChildrensResp={parentChildrensResp}
              />
            ) : hasCompleted ? (
              <SubmissionSuccessModal
                studentDetails={studentDetails}
                submitAssessmentResp={submitAssessmentResp}
                parentChildrensResp={parentChildrensResp}
              />
            ) : (
              <>
                <div className="tw-flex tw-justify-center tw-items-center">
                  <div className="d-none">
                    <div className="tw-bg-white tw-rounded-sm tw-sticky tw-top-8 tw-z-10 tw-mb-6 tw-py-4 tw-shadow-[rgba(14,63,126,0.04)_0px_0px_0px_1px,rgba(42,51,69,0.04)_0px_1px_1px_-0.5px,rgba(42,51,70,0.04)_0px_3px_3px_-1.5px,rgba(42,51,70,0.04)_0px_6px_6px_-3px,rgba(14,63,126,0.04)_0px_12px_12px_-6px,rgba(14,63,126,0.04)_0px_24px_24px_-12px]">
                      <div className="d-flex align-items-center justify-content-center">
                        <div
                          className="me-4"
                          style={{ width: "76px", height: "76px" }}
                        >
                          <img
                            src={dpsLogo}
                            alt="dpslogo"
                            className="w-100 h-100 object-fit-contain flex-shrink-0"
                          ></img>
                        </div>
                        <div className="text-center">
                          <h4 className="mb-0">DELHI PUBLIC SCHOOL</h4>
                          <p className="mb-0">
                            BEHIND NACHARAM TELEPHONE EXCHANGE, NACHARAM
                          </p>
                          <p className="mb-0">
                            UPPAL(M), MEDCHAL DISTRICT, HYDERABAD - 500076
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <div className="card mb-5">
                          <div className="card-body student-details-container">
                            <UncontrolledAccordion open="assessment-header">
                              <AccordionItem>
                                <AssessmentHeader></AssessmentHeader>
                              </AccordionItem>
                            </UncontrolledAccordion>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="row">
                          <div className="col-lg-8 col-xl-9 d-grid">
                            <CurrentQuestion
                              questionsList={questionsList}
                              currentQuestionIdx={currentQuestionIdx}
                              dispatch={dispatch}
                            ></CurrentQuestion>
                          </div>
                          <div className="col-lg-4 col-xl-3 d-grid ps-0">
                            <QuestionsListNav
                              questionsList={questionsList}
                            ></QuestionsListNav>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <NewAssessment
                    questionsList={questionsList}
                    currentQuestionIdx={currentQuestionIdx}
                    assessmentDetails={assessmentDetails}
                    dispatchBtn={dispatch}
                    assessementSubmissionOpenModal={assessementSubmissionOpenModal}
                    studentDetails={studentDetails}
                    assessmentId={assessmentId}
                    sessionId={sessionId}
                    attemptId={attemptId}
                    onTimeExpiredChange={setIsTimeExpired}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </MathJaxContext>
      {attemptStatus !== "EVALUATED" && (
        <>
          <ModalContainerUpdated
            id="assessment-submission-confirmation"
            isOpen={assessementSubmissionModalState.showModal}
            toggle={() => assessementSubmissionCloseModal()}
            modalSize="md"
            hideHeader
          >
            <AssessmentSubmissionModal
              dispatch={appDispatch}
              assessmentId={assessmentId}
              attemptId={attemptId}
              tabSwitchCount={tabSwitchCount}
              studentId={studentDetails?.childId}
              sessionId={sessionId}
              questionsList={questionsList}
              assessmentDetails={assessmentDetails}
              toggle={assessementSubmissionCloseModal}
              autoStartCountdown={assessementSubmissionModalState.showModal}
              isTimeExpired={isTimeExpired}
            />
          </ModalContainerUpdated>

          <ModalContainerUpdated
            id="assessment-connection-lost"
            isOpen={assessementConnectionLostModalState.showModal}
            toggle={() => assessementConnectionLostOpenModal()}
            modalSize="sm"
            hideHeader
          >
            <ConnectionLostModal
              dispatch={appDispatch}
              assessmentId={assessmentId}
              studentDetails={studentDetails}
              toggle={assessementConnectionLostCloseModal}
            />
          </ModalContainerUpdated>

          <ModalContainerUpdated
            id="student-alert-modal"
            isOpen={studentAlertModalState.showModal}
            toggle={handleCloseStudentAlertModal}
            modalSize="md"
          >
            <WindowSwitchModal
              dispatch={appDispatch}
              onBack={closeStudentAlertModal}
              count={tabSwitchCount}
              enterFullScreen={enterFullScreen}
              assessmentId={assessmentId}
              attemptId={attemptId}
              studentId={studentDetails?.childId}
              sessionId={sessionId}
              questionsList={questionsList}
            />
          </ModalContainerUpdated>
          <ModalContainerUpdated
            id="full-screen-modal"
            isOpen={fullScreenModalState.showModal}
            toggle={handleCloseFullScreenModal}
            modalSize="md"
            modalTitle="Resume Assessment"
          >
            <FullScreenModal
              enterFullScreen={enterFullScreen}
              closeFullScreenModal={handleCloseFullScreenModal}
            />
          </ModalContainerUpdated>
        </>
      )}
    </>
  );
};

export default StudentAssessment;
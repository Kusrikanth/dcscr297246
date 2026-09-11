import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Accordion,
} from "reactstrap";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon, MinusSignIcon, Tick01Icon } from "@hugeicons-pro/core-stroke-standard";
import { useEffect, useRef, useState } from "react";
import { ConfirmationModal, MathPreview, TextInput } from "../../../../../../../../Components/Common";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../../../../hooks/storehook";
import UpdatedHorizontalTab from "../../../../../../../../Components/Common/UpdatedHorizontalTab";
import { default as RejectSvg } from "../../../../../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { saveEvaluateManualMarksAct } from "../../../../../../../../store/lms/studentAssessment/studentAssessmentActions";
import { generateActionPayload } from "../../../../../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { useModal } from "../../../../../../../../hooks/modalhook";

interface IMenuOptions {
  id: string;
  labelName: string;
  count?: number;
  customPadding: string;
  badgeClass?: string;
}

const ReviewAssessment = ({ selectedStudent, getQuestionListApiCall, getResultSummaryApiCall }) => {
  const [markNow, setMarkNow] = useState(false);
  const [questionMarks, setQuestionMarks] = useState({}); // Store marks for each question
  const [openQuestionId, setOpenQuestionId] = useState<string | undefined>("");
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const { closeModal: closeSubmitManualMarksModal, modalState: submitManualMarksModalState, openModal: openSubmitManualMarksModal } = useModal();
  const dispatch = useDispatch();

  const toggleAccordion = (id: string) => {
    setOpenQuestionId((prev) => (prev === id ? "" : id));
  };

  const { showApiLoader, getAssessmentQuestionDetailsAct, saveEvaluateManualMarksResp, studentAssessmentsErrorResp } = useAppSelector(
    ({ studentAssessments, globalData, }) => ({
      showApiLoader: globalData.showApiLoader,
      getAssessmentQuestionDetailsAct: studentAssessments.getAssessmentQuestionDetailsAct,
      saveEvaluateManualMarksResp: studentAssessments.saveEvaluateManualMarksResp,
      studentAssessmentsErrorResp: studentAssessments.studentAssessmentsErrorResp,
    }),
    shallowEqual
  );

  const evaluateManualRef = useRef({
    prevSaveEvaluateManualMarksResp: saveEvaluateManualMarksResp,
    prevStudentAssessmentsListByIdErrorResp: studentAssessmentsErrorResp,
  });

  useEffect(() => {
    const { prevSaveEvaluateManualMarksResp, prevStudentAssessmentsListByIdErrorResp } = evaluateManualRef.current;
    if (saveEvaluateManualMarksResp && prevSaveEvaluateManualMarksResp !== saveEvaluateManualMarksResp) {
      toast.success("Marks Updated Manually.");
      if (selectedStudent?.id) {
        getQuestionListApiCall(selectedStudent.id);
        getResultSummaryApiCall(selectedStudent.id);
      }
      closeSubmitManualMarksModal()
    }
    else if (studentAssessmentsErrorResp && prevStudentAssessmentsListByIdErrorResp !== studentAssessmentsErrorResp) {
      const { details } = studentAssessmentsErrorResp || {}
      toast.error(details || "Something went wrong")
    }

    evaluateManualRef.current.prevSaveEvaluateManualMarksResp = saveEvaluateManualMarksResp;
    evaluateManualRef.current.prevStudentAssessmentsListByIdErrorResp = studentAssessmentsErrorResp;
  }, [saveEvaluateManualMarksResp, studentAssessmentsErrorResp]);

  const {
    resultSummary = null,
    resultSummaryQuestions = [],
  } = getAssessmentQuestionDetailsAct || {};

  const totalQuestions = resultSummary?.totalQuestionCount ?? resultSummaryQuestions.length;

  const summaryMap: Record<number, any> = {};
  (resultSummaryQuestions || []).forEach((q) => {
    summaryMap[q.questionId] = q;
  });

  const questions = (getAssessmentQuestionDetailsAct?.questionDetails || [])
    .map((q: any, index: number) => {
      const summary = summaryMap[q.id];
      const chosenIndex = summary?.selectedOptionId
        ? q.questionOptions.findIndex((opt: any) => opt.optionId === summary.selectedOptionId)
        : -1;
      return {
        id: String(q.id),
        questionNo: q.questionNo || index + 1,
        questionId: q.questionId,
        questionTypeShortName: q.questionTypeShortName,
        text: q.questionTitle,
        description: q.questionDescription,
        status: summary?.evaluationStatus || "UNATTEMPTED",
        evaluationType: summary?.evaluationType,
        answerStatus: summary?.answerStatus || "NOT_ANSWERED",
        studentChosenOptionId: chosenIndex >= 0 ? String.fromCharCode(65 + chosenIndex) : null,
        questionStatus: summary?.evaluationStatus || "UNATTEMPTED",
        chosenOptionId: summary?.selectedOptionId ? String(summary.selectedOptionId) : null,
        correctOptionId: String(
          q.questionOptions.find((opt: any) => opt.isCorrectAnswer)?.optionId
        ),
        options: q.questionOptions.map((opt: any) => {
          let optionJson: any = opt.text ?? "";
          if (opt.optionText) {
            try {
              optionJson = JSON.parse(opt.optionText);
            } catch {
              optionJson = opt.optionText;
            }
          }
          return {
            id: String(opt.optionId),
            text: optionJson,
            isCorrect: opt.isCorrectAnswer,
          };
        }),
        solution: q.textSolution || "No solution provided.",
        pointsEarned: summary?.score || 0,
        pointsTotal: q.assessmentQuestionMarks || 0,
      };
    })
    .sort((a: any, b: any) => a.questionNo - b.questionNo);
  // Build dynamic list of question numbers
  const markedQuestions = questions
    .filter((q) => questionMarks[q.id] !== "" && questionMarks[q.id] !== undefined)
    .sort((a, b) => a.questionNo - b.questionNo)   // ✅ sort by question number
    .map((q) => `Q${q.questionNo}`)
    .join(", ");


  const MenuOptions: Array<IMenuOptions> = [
    {
      id: "all-questions",
      labelName: "All",
      count: totalQuestions,
      badgeClass: "!tw-bg-slate-100 !tw-text-slate-500",
      customPadding: "",
    },
    {
      id: "correct-questions",
      labelName: "Correct",
      count: questions.filter((q) => q.status === "CORRECT").length,
      badgeClass: "!tw-bg-green-100 !tw-text-green-500",
      customPadding: "",
    },
    {
      id: "partial-questions",
      labelName: "Partial",
      count: questions.filter((q) => q.status === "PARTIALLY_CORRECT").length,
      badgeClass: "!tw-bg-yellow-100 !tw-text-yellow-500",
      customPadding: "",
    },
    {
      id: "incorrect-questions",
      labelName: "Wrong",
      count: questions.filter(
        (q) => q.status === "INCORRECT" && q.answerStatus === "ANSWERED"
      ).length,
      badgeClass: "!tw-bg-red-100 !tw-text-red-500",
      customPadding: "",
    },
    {
      id: "un-attempt",
      labelName: "Unattempted",
      count: questions.filter((q) => q.answerStatus !== "ANSWERED").length,
      badgeClass: "!tw-bg-gray-100 !tw-text-gray-500",
      customPadding: "",
    },
  ];

  const filterQuestions = (questions, selectedId) => {
    switch (selectedId) {
      case "correct-questions":
        return questions.filter((q) => q.status === "CORRECT");

      case "incorrect-questions":
        return questions.filter(
          (q) => q.status === "INCORRECT" && q.answerStatus === "ANSWERED"
        );
      case "partial-questions":
        return questions.filter((q) => q.status === "PARTIALLY_CORRECT");

      case "un-attempt":
        return questions.filter((q) => q.answerStatus !== "ANSWERED");

      case "all-questions":
      default:
        return questions;
    }
  };

  const [activeId, setActiveId] = useState("all-questions");
  const filteredQuestions = filterQuestions(questions, activeId);
  useEffect(() => {
    if (filteredQuestions.length > 0 && !openQuestionId) {
      setOpenQuestionId(filteredQuestions[0].id);
    }
  }, [filteredQuestions]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleMarkChange = (id: string, value: string) => {
    const numericValue = parseFloat(value);

    if (isNaN(numericValue)) {
      setQuestionMarks((prev) => ({ ...prev, [id]: "" }));
      setErrors((prev) => ({ ...prev, [id]: "" }));
      return;
    }

    const totalMarks = questions.find((q) => q.id === id)?.pointsTotal || 0;

    if (numericValue > totalMarks) {
      setErrors((prev) => ({
        ...prev,
        [id]: `Please enter marks below or equal to ${totalMarks}`,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [id]: "" }));
    }

    setQuestionMarks((prev) => ({ ...prev, [id]: numericValue }));
  };

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event;
    const menuId = currentTarget.getAttribute("data-id");
    setActiveId(menuId ?? "all-questions");
  }

  const handleMarkNowClick = () => {
    setMarkNow(true);
  };

  const handleSubmitMarks = () => {
    const hasErrors = Object.values(errors).some((msg) => msg !== "");

    if (hasErrors) {
      console.warn("Fix errors before submitting.");
      return;
    }

    if (Object.keys(questionMarks).length === 0) {
      console.warn("No marks entered.");
      toast.error("Please enter marks before submitting.");
      return;
    }

    const questionsMarks = Object.entries(questionMarks)
      .filter(([_, mark]) => mark !== "" && mark !== undefined)
      .map(([questionId, marksProvided]) => {
        const question = questions.find((q) => q.id === questionId);
        return {
          questionId: parseInt(questionId),
          marksProvided: parseFloat(marksProvided as string) || 0,
          correctOptionId: question?.correctOptionId || "",
          assessmentQuestionMarks: question?.pointsTotal || 0,
        };
      });

    const payload = { questionsMarks };
    const id = selectedStudent?.id;

    dispatch(
      saveEvaluateManualMarksAct(
        generateActionPayload("save_evaluated_manual_marks", { attemptId: id }, payload)
      )
    );

    setMarkNow(false);
    setQuestionMarks({});
    setErrors({});
  };

  const handleReset = () => {
    setMarkNow(false);
    setQuestionMarks({});
    setErrors({});
  };
  if (!selectedStudent) {
    return (
      <div className="card tw-overflow-hidden" style={{ borderRadius: "8px" }}>
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-12 col-lg-auto">
              <div className="">
                <h4 className="card-title mb-0 mb-2">
                  Question Details
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="tw-text-center tw-text-gray-500 tw-py-6">
            <div className="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-text-center">
              <RejectSvg className="tw-w-6 tw-h-6 tw-text-red-500" />
              <span>
                No Students submitted the Assessment
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!getAssessmentQuestionDetailsAct || !getAssessmentQuestionDetailsAct.questionDetails) {
    return (
      <div className="card tw-overflow-hidden" style={{ borderRadius: "8px" }}>
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-12 col-lg-auto">
              <div className="">
                <h4 className="card-title mb-0 mb-2">
                  Question Details
                </h4>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="tw-flex tw-items-center tw-justify-center tw-h-[300px] tw-text-gray-500">
            {selectedStudent ? (
              <div className="tw-flex tw-items-center tw-gap-2">
                <RejectSvg className="tw-w-5 tw-h-5" />
                <span>
                  Selected Student is {selectedStudent.attemptStatus ?? "Pending"} for this Assessment
                </span>
              </div>
            ) : (
              <div className="tw-flex tw-items-center tw-gap-2">
                <RejectSvg className="tw-w-5 tw-h-5" />
                <span>Please select a student</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="card tw-overflow-hidden" style={{ borderRadius: "8px" }}>
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-12 col-lg-auto">
              <div className="">
                <h4 className="card-title mb-0 mb-2">
                  Question Details
                </h4>
              </div>
            </div>
            <div className="col-1auto col-lg-auto ms-auto">
              <div className="tw-flex tw-justify-between tw-items-center">
                <div
                  title={markNow && Object.keys(questionMarks).length === 0 ? "Please enter marks" : ""}
                  className="d-inline-block"
                >
                  <button
                    className={`btn btn-sm ${markNow ? "btn-outline-primary" : "btn-success"}`}
                    onClick={!markNow ? handleMarkNowClick : openSubmitManualMarksModal}
                    disabled={markNow && Object.keys(questionMarks).length === 0}
                  >
                    {markNow ? "Submit Marks" : "Mark Now"}
                  </button>

                </div>
                {markNow && (
                  <button className="btn btn-sm btn-secondary ms-2" onClick={handleReset}>
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="col-12">
            <div className="card shadow-none border lg:!tw-sticky lg:!tw-top-8">
              <div className="card-header pb-0 px-0">
                <UpdatedHorizontalTab
                  MenuOptions={MenuOptions}
                  clickMenuHandler={clickMenuHandler}
                  activeTabId={activeId}
                  horizontalClass="overflow-auto text-nowrap"
                  showBadge
                />
              </div>
              <div className="card-body px-0">
                <div className="tw-grid tw-gap-4 tw-w-full tw-mx-auto tw-w-[80%] [grid-template-columns:repeat(auto-fit,32px)] tw-justify-center px-3">
                  {filteredQuestions.map((q) => {
                    let borderClass: "correct-opt" | "wrong-opt" | "partial-opt" | "unattempted" = "unattempted";

                    if (q?.answerStatus === "ANSWERED") {
                      if (q.status === "CORRECT") {
                        borderClass = "correct-opt";
                      } else if (q.status === "INCORRECT") {
                        borderClass = "wrong-opt";
                      } else if (q.status === "PARTIALLY_CORRECT") {
                        borderClass = "partial-opt";
                      }
                    }

                    return (
                      <div key={q.questionNo} className="tw-flex tw-items-center tw-justify-center">
                        <div
                          className={`tw-cursor-pointer tw-w-8 tw-h-8 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-relative
                  ${borderClass === "correct-opt"
                              ? "tw-border-green-500 tw-border tw-bg-green-100 tw-text-green-700"
                              : borderClass === "wrong-opt"
                                ? "tw-border-red-500 tw-border tw-bg-red-100 tw-text-red-700"
                                : borderClass === "partial-opt"
                                  ? "tw-border-yellow-500 tw-border tw-bg-yellow-100 tw-text-yellow-700"
                                  : "tw-border tw-border-gray-400 tw-text-gray-700 tw-bg-gray-100"
                            }`}
                          onClick={() => {
                            if (q) {
                              setOpenQuestionId((prev) =>
                                prev === q.id ? undefined : q.id
                              );
                            }
                          }}
                        >
                          <span
                            className={`tw-flex tw-items-center tw-justify-center tw-absolute tw-bottom-0 tw-right-0 tw-w-4 tw-h-4 tw-inline-block tw-rounded-full tw-translate-x-[40%] tw-translate-y-[15%]
                     ${borderClass === "correct-opt"
                                ? "tw-border-green-500 tw-border tw-bg-[#e7f1f5]"
                                : borderClass === "wrong-opt"
                                  ? "tw-border-red-500 tw-border tw-bg-[#fef0ed]"
                                  : borderClass === "partial-opt"
                                    ? "tw-border-yellow-500 tw-border tw-bg-[#fff8e1]"
                                    : "tw-border tw-border-gray-400 tw-bg-gray-50 tw-hidden"
                              }
`}
                          >
                            <HugeiconsIcon
                              icon={
                                borderClass === "correct-opt"
                                  ? Tick01Icon
                                  : borderClass === "wrong-opt"
                                    ? Cancel01Icon
                                    : borderClass === "partial-opt"
                                      ? MinusSignIcon
                                      : MinusSignIcon
                              }
                              className={
                                borderClass === "correct-opt"
                                  ? "text-success"
                                  : borderClass === "wrong-opt"
                                    ? "text-danger"
                                    : borderClass === "partial-opt"
                                      ? "text-warning"
                                      : ""
                              }
                              size={10}
                            />

                          </span>
                          {q.questionNo}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="questions_list tw-h-[698px] tw-pe-2 tw-overflow-y-auto custom-scrollbar">
            <div className="assessmenet-result">
              <div className="bg-white rounded shadow-none card">
                <div className="card-body p-0">
                  <Accordion open={openQuestionId} toggle={toggleAccordion} stayOpen>
                    {filteredQuestions
                      .slice()
                      .sort((a, b) => a.questionNo - b.questionNo)
                      .map((q) => (
                        <AccordionItem key={q.id}>
                          <AccordionHeader targetId={q.id}>
                            <div className="d-flex justify-content-between align-items-center w-100 pe-4">
                              <div className="tw-flex tw-items-center">
                                <div
                                  className={`tw-h-3 tw-w-3 tw-me-2 tw-rounded-full ${q.answerStatus === "NOT_ANSWERED"
                                      ? "tw-bg-gray-400"
                                      : q.status === "CORRECT"
                                        ? "tw-bg-green-300"
                                        : q.status === "PARTIALLY_CORRECT"
                                          ? "tw-bg-yellow-400"
                                          : "tw-bg-red-400"
                                    }`}
                                />

                                <p className="mb-0 fs-12">{`Q${q.questionNo}`}</p> <p className="badge badge-soft-info px-2 py-1 fs-10 mb-0 ms-2">
                                  {q.questionTypeShortName}
                                </p>
                              </div>
                              <div className="d-flex">
                                <div className="col-auto me-2 align-items-center justify-content-end">
                                  <div className="d-flex align-items-center justify-content-end">
                                    <p className="mb-0 me-2 text-muted fs-12">Evaluation Type :</p>
                                    <p className="mb-0 badge badge-soft-success px-2 py-1">{q.evaluationType}</p>
                                  </div>
                                </div>
                                <div className="tw-text-xs tw-border tw-rounded tw-px-2 tw-py-0.5 tw-font-semibold">
                                  {markNow && questionMarks[q.id] !== undefined
                                    ? `${questionMarks[q.id]} / ${q.pointsTotal}`
                                    : `${q.pointsEarned} / ${q.pointsTotal}`
                                  }
                                </div>
                              </div>
                            </div>
                          </AccordionHeader>
                          <AccordionBody accordionId={q.id} className="p-0">
                            <div className="row w-100 mx-auto p-2 pb-0 d-flex align-items-start justify-content-between">
                              <div className="col-12 col-xxl-8">
                                <div className="d-flex align-items-center">
                                  <p className="mb-2 d-flex jsutify-content-center align-items-center">
                                    <h5 className="mb-0 fs-12">
                                      {q.description ? <MathPreview json={JSON.parse(q.description)} /> : ""}
                                    </h5>
                                  </p>
                                </div>
                              </div>
                              <div className="col-12 col-xxl-4">
                                <div className="tw-flex tw-items-center mb-0 xl:tw-justify-end">
                                  <div className="">
                                    <p className="mb-0 fs-12">
                                      <span className="text-muted me-2">Student Answer :</span>
                                      <span className="fw-semibold">{q.studentChosenOptionId}</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="tw-flex tw-items-center  xl:tw-justify-end">
                                  <div className="d-flex align-items-center mb-0 fs-12 ">
                                    <span className="text-muted me-2">Points :</span>
                                    <div className="d-grid">
                                      {q.questionStatus !== "UNATTEMPTED" && markNow ? (
                                        <div>
                                          <TextInput
                                            name={`markNow_${q.id}`}
                                            value={questionMarks[q.id] || ""}
                                            onChange={(e) => handleMarkChange(q.id, e.target.value)}
                                            placeHolder="0"
                                            formgroupClassName="mb-0 tw-w-[48px] p-0"
                                            inputClassName="px-2 py-1"
                                          />
                                        </div>
                                      ) : (
                                        <span className="fw-semibold">
                                          {q.pointsEarned} / {q.pointsTotal}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-end me-4">
                              <div className="d-flex align-items-center mb-0 fs-14">
                                <div className="d-grid">
                                  {markNow ? (
                                    <div>
                                      <div className="invalid-feedback d-block">
                                        {errors[q.id] && (
                                          <div className="text-danger">{errors[q.id]}</div>
                                        )}
                                      </div>
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="p-3">
                              <div className="mb-3">
                                {q.options.map((opt, i) => {
                                  const isChosen = opt.id === q.chosenOptionId;
                                  const isCorrect = opt.isCorrect;
                                  let borderClass = "border-gray-200";
                                  let badgeClass = "border";
                                  let icon: React.ReactNode = null;
                                  let label: string | null = null;
                                  if (isChosen && isCorrect) {
                                    borderClass = "tw-bg-[rgba(10,179,156,0.15)] border-success";
                                    badgeClass = "bg-success text-white";
                                    icon = <HugeiconsIcon icon={Tick01Icon} className="text-success" size={16} />;
                                    label = "Selected option is correct";
                                  } else if (isChosen && !isCorrect) {
                                    borderClass = "tw-bg-[rgba(240,101,72,0.15)] border-danger";
                                    badgeClass = "bg-danger text-white";
                                    icon = <HugeiconsIcon icon={Cancel01Icon} className="text-danger" size={16} />;
                                    label = "Selected option";
                                  } else if (!isChosen && isCorrect) {
                                    borderClass = "tw-bg-[rgba(10,179,156,0.15)] border-success";
                                    badgeClass = "bg-success text-white";
                                    icon = <HugeiconsIcon icon={Tick01Icon} className="text-success" size={16} />;
                                    label = "Correct option";
                                  }
                                  return (
                                    <div
                                      key={opt.id}
                                      className={`p-2 rounded mb-2 d-flex align-items-center justify-content-between border-2 ${borderClass}`}
                                    >
                                      <span className="tw-flex">
                                        <span
                                          className={`tw-rounded-full tw-me-2 tw-p-1 tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center ${badgeClass}`}
                                        >
                                          {String.fromCharCode(65 + i)}
                                        </span>
                                        <span className="flex-grow"><MathPreview json={opt.text} /></span>
                                      </span>
                                      <div className="tw-flex tw-items-center tw-gap-2">
                                        {icon}
                                        {label && (
                                          <span className="tw-text-xs tw-font-medium tw-text-gray-600">{label}</span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="border rounded p-2 px-3 mt-2 fs-12" style={{ backgroundColor: 'rgb(255 162 0 / 10%)' }}>
                                <div className="fw-bold">Solution:</div>
                                <div>
                                  {(() => {
                                    try {
                                      return <MathPreview json={JSON.parse(q?.solution)} />;
                                    } catch {
                                      return <span>{q?.solution || "-"}</span>;
                                    }
                                  })()}
                                </div>
                              </div>
                            </div>
                          </AccordionBody>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        id="download-report-card-modal"
        isOpen={submitManualMarksModalState.showModal}
        confirmMessage={
          markedQuestions
            ? `Are you sure you want to Submit Manual Marks for ${markedQuestions}?`
            : "Are you sure you want to Submit Manual Marks?"
        }
        cancelHndlr={closeSubmitManualMarksModal}
        confirmHndlr={handleSubmitMarks}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      />
    </>
  );
};

export default ReviewAssessment;

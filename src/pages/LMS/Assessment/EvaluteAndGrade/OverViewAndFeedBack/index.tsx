import {
  LaptopCheckIcon,
} from "@hugeicons-pro/core-stroke-standard";
import {
  SelectInput,
  TextArea,
} from "../../../../../Components/Common";
import dummyStdnt from "../../../../../assets/imagesdps/student-default-img.png";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useRef, useState } from "react";
import { default as RejectSvg } from "../../../../../assets/imagesdps/academics/confirmation-icon.svg?react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { useFormik } from "formik";
import { editFeedbackAct } from "../../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { toast } from "react-toastify";
import { getDateWithTimeFormat, getDisplayDateForTableFormat } from "../../../../../utility/dateutility";
const initialValues = {
  feedBackId: "",
  feedBack: "",
}
function calcMarksPercentage(conductedMarks, scoredMarks) {
  if (!conductedMarks || conductedMarks <= 0) return 0;
  if (scoredMarks == null) return 0;
  return Number(((scoredMarks / conductedMarks) * 100).toFixed(2));
}
function getProgressColor(percent: number) {
  if (percent <= 25) return "tw-bg-[#F06548]";
  if (percent <= 50) return "tw-bg-[#F7B84B]";
  if (percent <= 75) return "tw-bg-[#405189]";
  return "tw-bg-[#0AB39C]";
}

const OverViewAndFeedBack = ({ selectedStudent, students, getResultListApiCall }) => {
  const [feedbackState, setFeedBackState] = useState("auto");
  const dispatch = useAppDispatch();
  const { editFeedbackResp, getAssessmentSummaryResultDetailsAct, getAssessmentQuestionDetailsAct, lmsAssessmentErrorAct } = useAppSelector(
    ({ studentAssessments, lmsAssessment }) => ({
      editFeedbackResp: lmsAssessment.editFeedbackResp,
      getAssessmentSummaryResultDetailsAct: studentAssessments.getAssessmentSummaryResultDetailsAct,
      getAssessmentQuestionDetailsAct: studentAssessments.getAssessmentQuestionDetailsAct,
      lmsAssessmentErrorAct: lmsAssessment.lmsAssessmentErrorAct,
    }),
    shallowEqual
  );
 
  const instituteRespRef = useRef<any>({
    prevLmsAssessmentErrorAct: lmsAssessmentErrorAct,
    prevEditFeedbackResp: editFeedbackResp,
 
  });
 
  useEffect(() => {
    const { prevLmsAssessmentErrorAct, prevEditFeedbackResp } = instituteRespRef.current;
    if (lmsAssessmentErrorAct && prevLmsAssessmentErrorAct !== lmsAssessmentErrorAct) {
      toast.error(lmsAssessmentErrorAct.details || "Something went wrong.");
    }
    else if (editFeedbackResp && prevEditFeedbackResp !== editFeedbackResp) {
      toast.success("Feedback updated successfully.");
      getResultListApiCall();
    }
 
    instituteRespRef.current.prevEditFeedbackResp = prevEditFeedbackResp;
    instituteRespRef.current.prevLmsAssessmentErrorAct = lmsAssessmentErrorAct;
  }, [lmsAssessmentErrorAct, editFeedbackResp]);
 
  const feedBackFormik = useFormik({
    initialValues,
    onSubmit: (values) => {
      const attemptId = getAssessmentSummaryResultDetailsAct?.attemptId;
 
      if (attemptId && values.feedBack) {
        const payload = [
          {
            id: attemptId,
            feedback: values.feedBack,
          },
        ];
 
        dispatch(
          editFeedbackAct(
            generateActionPayload("edit_feedback", undefined, payload)
          )
        );
      } else {
        toast.warning("Please select students with feedback to update.");
      }
    },
  });
 
  const handleFeedBackChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const selectedItem = feedBackData.find(item => String(item.feedBackId) === selectedId);
 
    feedBackFormik.setFieldValue("feedBackId", selectedId);
    feedBackFormik.setFieldValue("feedBack", selectedItem?.content || "");
  };
  const submittedDate = getAssessmentSummaryResultDetailsAct?.submittedDate
    ? new Date(getAssessmentSummaryResultDetailsAct.submittedDate)
    : null;
  const submittedDateStr = submittedDate
    ? submittedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    : "-";
  const submittedTimeStr = submittedDate
    ? submittedDate.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "-";
 
  const scoredMarks = getAssessmentSummaryResultDetailsAct?.resultSummary?.totalScore ?? 0;
  const condectedMarks = getAssessmentSummaryResultDetailsAct?.resultSummary?.totalQuestionMarks ?? 0;
  const summary = getAssessmentSummaryResultDetailsAct?.resultSummary ?? {};
  const questions = getAssessmentSummaryResultDetailsAct?.resultSummaryQuestions ?? [];
 
  const correct = summary.totalCorrect ?? 0;
  const incorrect = summary.totalIncorrect ?? 0;
  const unattempted =
    summary.totalUnattempted ??
    (summary.totalQuestionCount - (correct + incorrect));
 
  const partiallyCorrect = questions.filter(
    (q: any) => q.evaluationStatus === "PARTIALLY_CORRECT"
  ).length;
 
  const total =
    summary.totalQuestionCount ||
    correct + incorrect + unattempted + partiallyCorrect ||
    1;
 
  // Percentages
  const correctPercent = (correct / total) * 100;
  const incorrectPercent = (incorrect / total) * 100;
  const partiallyCorrectPercent = (partiallyCorrect / total) * 100;
  const unattemptedPercent = (unattempted / total) * 100;
  const feedBackData = [
    { feedBackId: 1, content: "Well Done" },
    { feedBackId: 2, content: "Needs Improvement" },
    { feedBackId: 3, content: "Excellent Accuracy" },
    { feedBackId: 4, content: "Incomplete Submission" },
  ];
  const matchedStudent = students.find(
    (stu) => stu.id === getAssessmentSummaryResultDetailsAct?.attemptId
  );
  useEffect(() => {
    if (students?.length && getAssessmentSummaryResultDetailsAct?.attemptId) {
      const matchedStudent = students.find(
        (stu) => stu.id === getAssessmentSummaryResultDetailsAct.attemptId
      );
 
      if (matchedStudent) {
        const matchedFeedBack = feedBackData.find(
          (fb) => fb.content === matchedStudent.feedBack
        );
 
        feedBackFormik.setFieldValue(
          "feedBackId",
          matchedFeedBack?.feedBackId || ""
        );
        feedBackFormik.setFieldValue("feedBack", matchedStudent.feedBack || "");
      }
    }
  }, [students, getAssessmentSummaryResultDetailsAct]);
 
  const timefunction = (utcDateString?: string) => {
    if (!utcDateString) return "-";
    const safeDateString =
      utcDateString.length > 23 ? utcDateString.slice(0, 23) : utcDateString;
    const date = new Date(safeDateString + "Z");
 
    if (isNaN(date.getTime())) return "-";
 
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
      .format(date)
      .replace(",", " /");
  };

  const studentGainedMarksPer = calcMarksPercentage(
  summary?.totalQuestionMarks,
  summary?.totalScore
  );

  const topperGainedMarksPer = calcMarksPercentage(
    summary?.totalQuestionMarks,
    summary?.topperScore
  );

  const classAvgGainedMarksPer = calcMarksPercentage(
    summary?.totalQuestionMarks,
    summary?.classAverageScore
  );

 
  if (!selectedStudent) {
    return (
      <div className="card tw-overflow-hidden" style={{ borderRadius: "8px" }}>
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-12 col-lg-auto">
              <div className="">
                <h4 className="card-title mb-0 mb-2">
                  Student Details
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
  return !getAssessmentSummaryResultDetailsAct ? (
    <div className="card">
      <div className="card-header">
        <div className="row align-items-center">
          <div className="col-12 col-lg-auto">
            <div className="">
              <h4 className="card-title mb-0 mb-2">
                Student Details
              </h4>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body tw-flex tw-items-center tw-justify-center tw-text-gray-500">
        {selectedStudent ? (
          <div className="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-text-center">
            <RejectSvg className="tw-w-6 tw-h-6 tw-text-red-500" />
            <span>
              Selected Student is {selectedStudent.attemptStatus ?? "Pending"} for this Assessment
            </span>
          </div>
        ) : (
          <div className="tw-flex tw-flex-col tw-items-center tw-gap-2 tw-text-center">
            <RejectSvg className="tw-w-6 tw-h-6 tw-text-red-500" />
            <span>Please select a student</span>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div
      className="card 2xl:!tw-sticky 2xl:tw-top-[64px] 2xl:tw-z-10 tw-overflow-hidden"
      style={{ borderRadius: "8px" }}
    >
      <div className="card-header pb-0" style={{ borderBottom: "0px" }}>
        <div className="tw-border tw-rounded tw-rounded-lg">
          <div className="tw-py-4">
            <div className="tw-flex border-bottom tw-items-center tw-pb-3 tw-px-4">
              <div className="tw-w-[62px] tw-h-[62px] tw-shrink-0 tw-rounded-lg tw-me-6">
                <img
                  src={dummyStdnt}
                  alt="dummy-img"
                  className="tw-w-full tw-h-full"
                ></img>
              </div>
              <div className="">
                <p className="tw-mb-0 tw-font-semibold">{getAssessmentSummaryResultDetailsAct?.studentName}</p>
                <p className="tw-text-xs tw-mb-0">{getAssessmentSummaryResultDetailsAct?.studentCode}</p>
              </div>
            </div>
            <div className="tw-rounded tw-pt-4 tw-mx-4">
              <div className="tw-grid tw-gap-y-2">
                <div className="mb-0 tw-flex tw-items-center">
                  <p className="mb-0">
                    <span className="tw-text-gray-500 tw-me-2 tw-text-xs">
                      Class & Section :
                    </span>
                      <span> {getAssessmentSummaryResultDetailsAct?.sectionName}</span>
                    </p>
                  </div>
                  <div className="mb-0 tw-flex tw-items-center">
                    <p className="tw-text-gray-500 tw-me-2 tw-mb-0 tw-text-xs">
                      Submitted On :
                    </p>
                    <p className="tw-mb-0 fs-13">
                      <span>{timefunction(getAssessmentSummaryResultDetailsAct?.submittedDate)}</span>
                    </p>
                  </div>
                  <div className="tw-mb-0 tw-flex tw-items-center tw-gap-4">
                    {/* Status */}
                    <div className="tw-flex tw-items-center">
                      <p className="tw-text-gray-500 tw-me-2 tw-mb-0 tw-text-xs">Status :</p>
                      <div
                        className={`tw-inline-flex tw-rounded-md fs-10 tw-px-2 tw-py-1 tw-text-xs ${getAssessmentSummaryResultDetailsAct?.resultSummary?.resultStatus === "PASS"
                            ? "tw-text-green-700 tw-border tw-border-green-400 tw-bg-green-100"
                            : "tw-text-red-700 tw-border tw-border-red-400 tw-bg-red-100"
                          }`}
                      >
                        {getAssessmentSummaryResultDetailsAct?.resultSummary?.resultStatus}
                      </div>
                    </div>
 
                    {/* Grade */}
                    <div className="tw-flex tw-items-center">
                      <p className="tw-text-gray-500 tw-me-2 tw-mb-0 tw-text-xs">Grade :</p>
                      <p className="mb-0 tw-text-success tw-text-base">
                        {getAssessmentSummaryResultDetailsAct?.resultSummary?.grade}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="card shadow-none border tw-mb-8">
          <div className="card-body">
            {/* <div className="tw-flex tw-items-center tw-gap-3 tw-mb-4">
              <p className="tw-mb-1">
                <span className="tw-me-2 tw-text-gray-500">Auto :</span>
                <span className="tw-text-semibold">25 / 30</span>
              </p>
              <div className="vr"></div>
              <p className="tw-mb-1">
                <span className="tw-me-2 tw-text-gray-500">Manual :</span>
                <span className="tw-text-semibold">20 / 20</span>
              </p>
            </div> */}
            <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
              <div>
                <p className="tw-mb-1 tw-text-gray-500">Score</p>
                <p className="mb-0 tw-font-semibold tw-bg-slate-200 tw-px-2 tw-py-1 tw-rounded tw-inline-flex">
                  Total : {scoredMarks}/{condectedMarks}
                </p>
              </div>
              <div>
                <p className="tw-mb-0">
                  <span className="tw-me-2 tw-text-gray-500 tw-text-xs">
                    Auto :
                  </span>
                  <span className="tw-text-semibold">
                    {getAssessmentQuestionDetailsAct?.autoEvaluation ?? 0}
                  </span>
                </p>
                <p className="tw-mb-0">
                  <span className="tw-me-2 tw-text-gray-500 tw-text-xs">
                    Manual :
                  </span>
                  <span className="tw-text-semibold">{getAssessmentQuestionDetailsAct?.manualEvaluation ?? 0}</span>
                </p>
              </div>
            </div>
            <div className="">
              <div className="tw-border-b tw-border-dashed tw-mb-5 tw-pb-2">
                <div className="tw-flex tw-gap-1 tw-w-full">
                  <div
                    className="tw-h-3 tw-rounded tw-bg-green-500"
                    style={{ width: `${correctPercent}%` }}
                    title={`Correct: ${correct}`}
                  ></div>
                  <div className="tw-h-3 tw-rounded tw-bg-yellow-400"
                    style={{ width: `${partiallyCorrectPercent}%` }}
                    title={`Partially Correct: ${partiallyCorrect}`}>
                  </div>
                  <div
                    className="tw-h-3 tw-rounded tw-bg-red-500"
                    style={{ width: `${incorrectPercent}%` }}
                    title={`Wrong: ${incorrect}`}
                  ></div>
                  <div
                    className="tw-h-3 tw-rounded tw-bg-gray-400"
                    style={{ width: `${unattemptedPercent}%` }}
                    title={`Unattempted: ${unattempted} `}
                  ></div>
                </div>
              </div>
              <div className="tw-flex tw-items-center tw-gap-x-4 tw-flex-wrap tw-gap-y-2">
                <p className="mb-0 fs-12 tw-flex tw-items-center">
                  <span className="me-2 tw-text-green-500">Correct :</span>
                  <span>{correct}</span>
                </p>
                <p className="mb-0 fs-12 tw-flex tw-items-center">
                  <span className="me-2 tw-text-yellow-500">Partial :</span>
                  <span>{partiallyCorrect}</span>
                </p>
 
                <p className="mb-0 fs-12 tw-flex tw-items-center">
                  <span className="me-2 tw-text-red-500">Wrong :</span>
                  <span>{incorrect}</span>
                </p>
 
                <p className="mb-0 fs-12 tw-flex tw-items-center">
                  <span className="me-2 tw-text-gray-500">Un Attempted :</span>
                  <span>{unattempted}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="card shadow-none border tw-mb-8">
          <div className="card-header">
            <h4 className="mb-0 card-title">Rank & Comparative Insights</h4>
          </div>
           <div className="card-body tw-flex tw-gap-y-4 tw-flex-col">
            <div className="tw-flex tw-gap-1 tw-w-full tw-flex-col">
              <p className="tw-mb-0 tw-text-grey-500">{`Your Score : ${summary?.totalScore}`}</p>
              <div className="tw-flex tw-h-3 tw-rounded tw-overflow-hidden" title={`Your's : ${studentGainedMarksPer}%`}>
                <div
                    className={`${getProgressColor(studentGainedMarksPer)} tw-h-full`}
                    style={{ width: `${studentGainedMarksPer}%` }}
                  ></div>
                  <div
                    className="tw-bg-gray-300"
                    style={{ width: `${100 - studentGainedMarksPer}%` }}
                  ></div>
              </div>
            </div>
            <div className="tw-flex tw-gap-1 tw-w-full tw-flex-col">
              <p className="tw-mb-0 tw-text-grey-500">{`Topper Score : ${summary?.topperScore}`}</p>
              <div className="tw-flex tw-h-3 tw-rounded tw-overflow-hidden" title={`Topper's: ${topperGainedMarksPer}%`}>
                <div
                    className={`${getProgressColor(topperGainedMarksPer)} tw-h-full`}
                    style={{ width: `${topperGainedMarksPer}%` }}
                  ></div>
                  <div
                    className="tw-bg-gray-300"
                    style={{ width: `${100 - topperGainedMarksPer}%` }}
                  ></div>
              </div>
            </div>
            <div className="tw-flex tw-gap-1 tw-w-full tw-flex-col">
              <p className="tw-mb-0 tw-text-grey-500">{`Avg Score : ${summary?.classAverageScore?.toFixed() ?? "0"}`}</p>
              <div className="tw-flex tw-h-3 tw-rounded tw-overflow-hidden" title={`Avg: ${classAvgGainedMarksPer}%`}>
                <div
                    className={`${getProgressColor(classAvgGainedMarksPer)} tw-h-full`}
                    style={{ width: `${classAvgGainedMarksPer}%` }}
                  ></div>
                  <div
                    className="tw-bg-gray-300"
                    style={{ width: `${100 - classAvgGainedMarksPer}%` }}
                  ></div>
              </div>
            </div>
           </div>
        </div>
 
        <div className="card shadow-none border mb-0">
          <div className="card-header">
            <h4 className="card-title mb-0">
              Overall Feedback (student-visible)
            </h4>
          </div>
          <div className="card-body">
            {/* <div className="tw-mb-4 tw-flex tw-items-center tw-justify-start">
              <RadioInputContainer
                name="feedback"
                radioClassName="form-radio-green"
                // labelText="Employee of the School ?"
                labelClassName="!tw-hidden !tw-min-w-[0px] !tw-me-0"
                inputContainerClassName="mb-0 tw-w-full"
                formgroupClassName="tw-w-full"
                radioOptions={[
                  {
                    id: "auto",
                    name: "Auto",
                  },
                  {
                    id: "manual",
                    name: "Manal",
                  },
                ]}
                value={feedbackState}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFeedBackState(e.target.value)
                }
              />
            </div> */}
            {/* <div>
              <SelectInput
                name="feedBackId"
                value={feedBackFormik.values.feedBackId}
                onChange={handleFeedBackChange}
                menuItems={feedBackData}
                valueKey="feedBackId"
                textKey="content"
                formgroupClassName=""
              />
            </div> */}
            <div>
              <TextArea
                name="feedBack"
                value={feedBackFormik.values.feedBack}
                onChange={feedBackFormik.handleChange}
                formgroupClassName="mb-0"
                placeHolder="Overall Feedback"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <div className="w-100 tw-justify-center tw-items-center">
          <div className="tw-flex tw-items-center tw-gap-3">
            <button className="btn w-100 btn-sm btn-outline-success" onClick={() => feedBackFormik.handleSubmit()} > Publish </button>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default OverViewAndFeedBack;
 
 
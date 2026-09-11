import { useEffect, useState } from "react";
import OverViewAndFeedBack from "./OverViewAndFeedBack";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getResultListAct } from "../../../../store/lms/lmsAssessment/lmsAssessmentaction";
import { shallowEqual } from "react-redux";
import AssessmentSubmissionsTabs from "../CreatedAssessmentList/AssessmentDetails/FeedbackAndGrading/EvaluteStudentsAssessment/AssessmentSubmissionsTabs";
import { getAssessmentQuestionDetailsAct, getAssessmentResultSummaryDetailsAct } from "../../../../store/lms/studentAssessment/studentAssessmentActions";
import { resetGetAssessmentQuestionsDetailsAct, resetGetAssessmentSummaryResultDetailsAct } from "../../../../store/lms/studentAssessment/studentAssessmentSlice";
import ReviewAssessment from "../CreatedAssessmentList/AssessmentDetails/StudentAssessmenetResult/StudentAssessmentDetails/ReviewAsssessment";

const EvaluteAndGrade = () => {
  const [markNow, setMarkNow] = useState(false);

  const dispatch = useAppDispatch();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const getResultListApiCall = () => {
    const payload = {
      academicYearId: getAssessmentByIdResp.academicYearId,
      branchId,
      pageSize: 500,
      assessmentId: getAssessmentByIdResp.id
    }
    if (payload.branchId) {
      dispatch(getResultListAct(generateActionPayload("get_result_list", undefined, payload)));
    }
  };
  const getQuestionListApiCall = (attemptId: number) => {
    const payload = {
      academicYearId: getAssessmentByIdResp.academicYearId,
      branchId,
      pageSize: 500,
      assessmentId: getAssessmentByIdResp.id,
    };

    if (payload.branchId) {
      dispatch(
        getAssessmentQuestionDetailsAct(
          generateActionPayload(
            "get_assessment_question_details",
            { attemptId },
            undefined
          )
        )
      );
    }
  };

  const getResultSummaryApiCall = (attemptId: number) => {
    const payload = {
      academicYearId: getAssessmentByIdResp.academicYearId,
      branchId,
      pageSize: 500,
      assessmentId: getAssessmentByIdResp.id,
    };

    if (payload.branchId) {
      dispatch(
        getAssessmentResultSummaryDetailsAct(
          generateActionPayload(
            "get_assessment_result_summary_details",
            { attemptId },
            undefined
          )
        )
      );
    }
  };

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getAssessmentByIdResp,
    getStatsByAssessmentResp,
    getResultListResp
  } = useAppSelector(
    ({ lmsAssessment, appData, globalData, studentAssessments }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getAssessmentByIdResp: lmsAssessment.getAssessmentByIdResp,
      getStatsByAssessmentResp: studentAssessments.getStatsByAssessmentResp,
      getResultListResp: lmsAssessment.getResultListResp

    }),
    shallowEqual
  );

  useEffect(() => {
    if (getAssessmentByIdResp.id) {
      getResultListApiCall()
    }
  }, [getAssessmentByIdResp.id]);

  return (
    <>
      <div className="tw-grid tw-gap-3 tw-grid-col-12">
        <div className="card !tw-sticky !tw-top-[8px] !tw-bg-rounded-t-lg tw-overflow-hidden" style={{ borderRadius: "8px" }}>
          <div className="card-header">
            <div className="tw-grid tw-grid-cols-4 tw-gap-3 xl:tw-grid-cols-4">
              <div className="">
                <div className="tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-flex-col tw-text-center tw-border tw-bg-slate-50 tw-p-2 tw-h-full">
                  <h4 className="tw-text-[#DC2C33] tw-mb-1 tw-text-[18px]">{getStatsByAssessmentResp?.totalCount}</h4>
                  <p className="tw-text-xs tw-mb-0 tw-text-gray-500">
                    Assigned
                  </p>
                </div>
              </div>
              <div className="">
                <div className="tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-flex-col tw-text-center tw-border tw-bg-slate-50 tw-p-2 tw-h-full">
                  <h4 className="tw-text-[#16A34A] tw-mb-1 tw-text-[18px]">{getStatsByAssessmentResp?.gradedCount}</h4>
                  <p className="tw-text-xs tw-mb-0 tw-text-gray-500">Graded</p>
                </div>
              </div>
              <div className="">
                <div className="tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-flex-col tw-text-center tw-border tw-bg-slate-50 tw-p-2 tw-h-full">
                  <h4 className="tw-text-[#2563EB] tw-mb-1 tw-text-[18px]">{getStatsByAssessmentResp?.submittedCount}</h4>
                  <p className="tw-text-xs tw-mb-0 tw-text-gray-500">
                    Submitted
                  </p>
                </div>
              </div>
              <div className="">
                <div className="tw-rounded-lg tw-flex tw-items-center tw-justify-center tw-flex-col tw-text-center tw-border tw-bg-slate-50 tw-p-2 tw-h-full">
                  <h4 className="tw-text-gray-500 tw-mb-1 tw-text-[18px]">{getStatsByAssessmentResp?.notGradedCount}</h4>
                  <p className="tw-text-xs tw-mb-0 tw-text-gray-500">
                    Not Graded
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tw-grid tw-gap-3 xl:tw-grid-cols-[262px_1fr_298px] 2xl:tw-grid-cols-[360px_1fr_328px] tw-items-start">
        <div className="xl:!tw-sticky xl:tw-top-[64px] xl:tw-z-10 tw-w-full">
          <div className="card tw-overflow-hidden tw-w-full" style={{ borderRadius: "8px" }}>
            <div className="card-body p-0 tw-w-full">
              <AssessmentSubmissionsTabs
                students={getResultListResp?.content ?? []}
                onStudentSelect={(attemptId: number, student: any) => {
                  setSelectedStudent(student);
                  dispatch(resetGetAssessmentQuestionsDetailsAct(null));
                  dispatch(resetGetAssessmentSummaryResultDetailsAct(null));
                  if (student.attemptStatus !== "ABSENT") {
                    getQuestionListApiCall(attemptId);
                    getResultSummaryApiCall(attemptId);
                  }
                }}
              />
            </div>
          </div>
        </div>
        <ReviewAssessment selectedStudent={selectedStudent} getQuestionListApiCall={getQuestionListApiCall} getResultSummaryApiCall={getResultSummaryApiCall} />
        <OverViewAndFeedBack selectedStudent={selectedStudent} students={getResultListResp?.content ?? []} getResultListApiCall={getResultListApiCall} />
      </div>
    </>
  );
};

export default EvaluteAndGrade;

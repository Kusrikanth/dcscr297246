import {
  EyeIcon,
  Download04Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { useEffect, useRef, useState } from "react";
import InstantResults from "../../../../../ParentDetails/StudentLMS/StudentAssessments/InstantResultsModal";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/storehook";
import { downloadResultReportCardAct, getAssessmentQuestionDetailsAct, getAssessmentResultSummaryDetailsAct } from "../../../../../../store/lms/studentAssessment/studentAssessmentActions";
import { generateActionPayload } from "../../../../../../utility/reduxutility";
import { ConfirmationModal, ModalContainerUpdated, MoreActions } from "../../../../../../Components/Common";
import { useModal } from "../../../../../../hooks/modalhook";
import { getDateWithTimeFormat } from "../../../../../../utility/dateutility";
import { SUBJECT_ICON } from "./helper";

const StudentAssessmentCard = ({ getStudentAssessmentsListResp }) => {
  const {
    assessmentName,
    assessmentType,
    attemptStatus,
    startDate,
    totalMarks,
    totalScore,
    subjectName,
    grade,
    className,
    submissionDate,
    startTime,
    attemptId,
  } = getStudentAssessmentsListResp;

  const { closeModal: closeGradeDistributionModalModal, modalState: gradeDistributionUploadModalState, openModal: gradeDistributionUploadModal } = useModal();
  const dispatch = useAppDispatch();
  const { closeModal: closeDownloadResultReportCardModal, modalState: downloadResultReportCardModalState, openModal: openDownloadResultReportCardModal } = useModal();
  const [resultReportAction, setResultReportAction] = useState<"VIEW" | "DOWNLOAD" | null>(null);

  const {
    showApiLoader,
    getResultReportCardResp,
  } = useAppSelector(
    ({
      globalData, studentAssessments
    }) => ({
      showApiLoader: globalData.showApiLoader,
      getResultReportCardResp: studentAssessments.getResultReportCardResp,
    }),
    shallowEqual
  );

  const evaluateManualRef = useRef({
    prevSaveEvaluateManualMarksResp: getResultReportCardResp,
  });

  useEffect(() => {
    const { prevSaveEvaluateManualMarksResp } = evaluateManualRef.current;
    if (
      resultReportAction === "DOWNLOAD" && downloadResultReportCardModalState.showModal && getResultReportCardResp && prevSaveEvaluateManualMarksResp !== getResultReportCardResp) {
      getResultReportCardResp.text().then((text: string) => {
        const parsed = JSON.parse(text);
        const { fileName, pdfBase64 } = parsed || {};
        if (pdfBase64) {
          const byteArray = Uint8Array.from(atob(pdfBase64), (char) => char.charCodeAt(0));
          const blob = new Blob([byteArray], { type: "application/pdf" });
          const fileURL = URL.createObjectURL(blob);
          convertBlobToReceipt(blob, `${fileName || "Result Report"}.pdf`);
          toast.success("Result Report Downloaded Successfully");
          setTimeout(() => URL.revokeObjectURL(fileURL), 500);
        } else {
          toast.error("No PDF data in response.");
        }
        closeDownloadResultReportCardModal();
        setResultReportAction(null);
      });
    }
    evaluateManualRef.current.prevSaveEvaluateManualMarksResp = getResultReportCardResp;
  }, [getResultReportCardResp, resultReportAction, downloadResultReportCardModalState.showModal]);

  function convertBlobToReceipt(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const actionsList = {
    evaluated: [
      {
        icon: EyeIcon,
        title: "View Result",
        id: "viewResult",
        onClickHndlr: (event: any, attemptId: number) => {
          dispatch(
            getAssessmentResultSummaryDetailsAct(
              generateActionPayload("get_assessment_result_summary_details", { attemptId }, undefined)
            )
          );
          dispatch(
            getAssessmentQuestionDetailsAct(
              generateActionPayload("get_assessment_question_details", { attemptId }, undefined)
            )
          );
          gradeDistributionUploadModal({ attemptId });
        }
      },
      {
        icon: Download04Icon,
        title: "Download Report",
        id: "downloadReport",
        onClickHndlr: (event: any, attemptId: number) => {
          setResultReportAction("DOWNLOAD");
          openDownloadResultReportCardModal()
        },
      },
    ],
  };

  const viewResultReportCardHndlr = (examData: any) => {
    const params = {
      attemptId
    };
    dispatch(downloadResultReportCardAct(generateActionPayload("get_result_report_card", params, undefined, {
      responseType: 'blob'
    })));
  };

  const toInitCaps = (str?: string | null) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const normalizedSubject = subjectName?.trim();
  const iconSubject = SUBJECT_ICON[normalizedSubject] || "📘";

  function canShowMoreActions(submissionDate?: string | null): boolean {
    if (!submissionDate) {
      return false;
    }
    const submittedTime = new Date(submissionDate + "Z").getTime();
    const currentTime = Date.now();
    const fifteenMinutes = 5 * 60 * 1000;
    const result = currentTime >= submittedTime + fifteenMinutes;
    return result;
  }

  const utcStartDate = `${startDate}T${startTime}Z`;

  const gradeStyleMap: Record<string, string> = {
    "A+": "tw-bg-green-100 tw-text-green-700",
    A: "tw-bg-green-100 tw-text-green-700",
    "A-": "tw-bg-green-100 tw-text-green-700",
    "B+": "tw-bg-blue-100 tw-text-blue-700",
    B: "tw-bg-blue-100 tw-text-blue-700",
    "B-": "tw-bg-blue-100 tw-text-blue-700",
    "C+": "tw-bg-yellow-100 tw-text-yellow-700",
    C: "tw-bg-yellow-100 tw-text-yellow-700",
    "C-": "tw-bg-yellow-100 tw-text-yellow-700",
    D: "tw-bg-orange-100 tw-text-orange-700",
    E: "tw-bg-red-100 tw-text-red-600",
    F: "tw-bg-red-200 tw-text-red-700",
    default: "tw-bg-gray-100 tw-text-gray-700",
  };

  const gradeBorderColorMap: Record<string, string> = {
    A: "#DCFCE7",
    "A+": "#BBF7D0",
    B: "#DBEAFE",
    C: "#FEF9C3",
    D: "#FFEDD5",
    E: "#FEE2E2",
    F: "#FECACA",
  };

  return (
    <>
      <div
        className={`tw-relative tw-bg-white tw-border tw-border-slate-200 tw-rounded-2xl tw-p-4 tw-shadow-md tw-overflow-hidden`}
        style={{
          borderTop: `6px solid ${gradeBorderColorMap[grade || ""] ?? "#e5e7eb"
            }`,
        }}
      >
        <div className="card-body p-2">
          <div className="tw-flex tw-mb-1 tw-justify-between tw-items-center">
            <h5 className="card-title text-truncate mb-2 text-dark">
              {assessmentName}
            </h5>
            <span className="tw-flex tw-items-center">
              <p
                className={`tw-inline-flex tw-items-center tw-justify-center tw-rounded-lg tw-px-2.5 tw-py-0.5 tw-text-sm tw-font-semibold tw-transition-all tw-duration-300 ${grade ? gradeStyleMap[grade] || "tw-bg-gray-100 tw-text-gray-600" : "tw-bg-gray-100 tw-text-gray-400"
                  }`}
              >
                {grade || "-"}
              </p>
            </span>
          </div>
          <div className="tw-mb-5">
            <p className="tw-text-slate-500 tw-text-xs tw-font-medium">
              <span className="tw-inline-flex tw-items-center tw-gap-1.5 tw-me-2.5 tw-py-1 tw-px-2.5 tw-rounded-full tw-bg-slate-100 tw-border tw-border-slate-200 tw-font-semibold tw-text-slate-700 tw-mr-1">
                <span className="">{iconSubject}</span>
                <span>{toInitCaps(subjectName)}</span>
              </span>
              {toInitCaps(assessmentType)} | {toInitCaps(className || 'N/A')}
            </p>
          </div>
          <div className="">
            <div className="tw-grid tw-grid-cols-2 tw-gap-x-3.5 tw-text-slate-700 tw-font-medium tw-text-sm">
              <span className="tw-inline-flex tw-items-center tw-gap-2">
                <span>
                  {getDateWithTimeFormat(utcStartDate)}
                </span>
              </span>
              <span className="ms-auto tw-inline-flex tw-items-center tw-gap-2">
                {totalMarks ? `${totalScore ?? 0}/${totalMarks}` : `${totalScore ?? 0}`}
              </span>
            </div>
            <div className="tw-flex tw-items-center tw-justify-between tw-border-t tw-border-gray-200 tw-pt-3 tw-mt-3 tw-gap-3">
              <button
                onClick={(event) => actionsList.evaluated[0].onClickHndlr(event, attemptId)}
                disabled={attemptStatus !== "EVALUATED" || !canShowMoreActions(submissionDate)}
                className="tw-flex tw-items-center tw-justify-center tw-gap-2 tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-w-[80%] tw-py-2 tw-text-gray-800 tw-text-sm tw-font-medium tw-shadow-sm hover:tw-bg-gray-50 hover:tw-shadow-md disabled:tw-opacity-50 disabled:hover:tw-shadow-none tw-transition-all tw-duration-300 tw-ease-in-out"
              >
                <HugeiconsIcon icon={EyeIcon} size={18} />
                <span>View</span>
              </button>
              <button
                onClick={(event) => actionsList.evaluated[1].onClickHndlr(event, attemptId)}
                disabled={attemptStatus !== "EVALUATED" || !canShowMoreActions(submissionDate)}
                className="tw-flex tw-items-center tw-justify-center tw-bg-white tw-border tw-border-gray-200 tw-rounded-lg tw-w-[20%] tw-py-2 tw-text-gray-800 tw-shadow-sm hover:tw-bg-gray-50 hover:tw-shadow-md disabled:tw-opacity-50 disabled:hover:tw-shadow-none tw-transition-all tw-duration-300 tw-ease-in-out"
              >
                <HugeiconsIcon icon={Download04Icon} size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="dummy-success-modal"
        isOpen={gradeDistributionUploadModalState.showModal}
        toggle={closeGradeDistributionModalModal}
        modalTitle="Instant Results"
        modalSize="xl"
        headerClassName="py-2 tw-bg-gradient-to-r tw-from-[#FFB200] tw-to-[#27C26E]"
      >
        <InstantResults
          id={gradeDistributionUploadModalState.modalData?.id}
          isOpen={gradeDistributionUploadModalState.showModal}
          toggle={closeGradeDistributionModalModal}
          scoreData={{ scoredMarks: 10, condectedMarks: 30 }}
        />
      </ModalContainerUpdated>
      <ConfirmationModal
        id="download-report-card-modal"
        isOpen={downloadResultReportCardModalState.showModal}
        confirmMessage={`Are you sure you want to Result Report ?`}
        cancelHndlr={closeDownloadResultReportCardModal}
        confirmHndlr={viewResultReportCardHndlr}
        isDisble={showApiLoader}
        showImgIcon={true}
        iconType="approve"
        btnClassName="btn w-sm btn-success"
      />
    </>
  );
};

export default StudentAssessmentCard;
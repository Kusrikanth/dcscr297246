import {
  MessageQuestionIcon,
  TimeQuarter02Icon,
  Tick01Icon,
  PlayIcon,
  StarIcon,
  EyeIcon,
  Download04Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import classnames from "classnames";
import { useHistory } from "react-router-dom";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCountdown } from "../../../../utility/commonutility";
import { addMinutes, isAfter, isBefore, subMinutes } from "date-fns";
import { useModal } from "../../../../hooks/modalhook";
import { downloadResultReportCardAct, getAssessmentQuestionDetailsAct, getAssessmentResultSummaryDetailsAct } from "../../../../store/lms/studentAssessment/studentAssessmentActions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { ConfirmationModal, ModalContainerUpdated, MoreActions } from "../../../../Components/Common";
import InstantResults from "./InstantResultsModal";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

const StudentAssessmentCard = ({ getStudentAssessmentsListResp }) => {
  const {
    assessmentStatus,
    assessmentName,
    assessmentType,
    attemptStatus,
    startDate,
    expiryDate,
    id,
    gracePeriod,
    endDate,
    totalMarks,
    totalQuestions,
    duration,
    bgColor,
    icon,
    subjectName,
    className,
    assignedDate,
    submissionDate,
    startTime,
    expiryTime,
    attemptId,
    gracePeriodEndTime,
  } = getStudentAssessmentsListResp;

  const { closeModal: closeGradeDistributionModalModal, modalState: gradeDistributionUploadModalState, openModal: gradeDistributionUploadModal } = useModal();
  const dispatch = useAppDispatch();
  const { closeModal: closeDownloadResultReportCardModal, modalState: downloadResultReportCardModalState, openModal: openDownloadResultReportCardModal } = useModal();
  const [resultReportAction, setResultReportAction] = useState<"VIEW" | "DOWNLOAD" | null>(null);

  const history = useHistory();
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

  const startDateTime =
    startDate && startTime ? `${startDate}T${startTime}Z` : null;
  const endDateTime =
    expiryDate && expiryTime ? `${expiryDate}T${expiryTime}Z` : null;

  const { label: originalLabel, timeLeft } = useCountdown(
    startDateTime,
    endDateTime,
    assessmentStatus
  );

  const label = originalLabel === "Ends in" ? "Time Left" : originalLabel;

  function assessmentDetails() {
    history.push({
      pathname: `/assessment-instructions`,
      state: {
        assessmentId: id
      },
    });
  }

  const statusConfigMap: Record<
    string,
    {
      bgColor: string;
      chipBg?: string;
      chipBgColor?: string;
      textColor: string;
      borderColor: string;
      icon: any;
    }
  > = {
    SCHEDULED: {
      bgColor: "#f0f9ff",
      chipBgColor: "#0ea5e9",
      textColor: "text-sky-700",
      borderColor: "border-sky-200",
      icon: Tick01Icon,
    },
    LIVE: {
      bgColor: "#f0fdf4",
      chipBgColor: "#22c55e",
      textColor: "text-green-700",
      borderColor: "border-green-200",
      icon: Tick01Icon,
    },
    RESCHEDULED: {
      bgColor: "#fffbeb",
      chipBgColor: "#f59e0b",
      textColor: "text-amber-800",
      borderColor: "border-amber-200",
      icon: Tick01Icon,
    },
    SUBMITTED: {
      bgColor: "#f5f3ff",
      chipBgColor: "#8b5cf6",
      textColor: "text-violet-700",
      borderColor: "border-violet-200",
      icon: Tick01Icon,
    },
    MISSED: {
      bgColor: "#fff1f2",
      chipBgColor: "#e11d48",
      textColor: "text-rose-700",
      borderColor: "border-rose-200",
      icon: Tick01Icon,
    },
    EXPIRED: {
      bgColor: "#f1f5f9",
      chipBgColor: "#64748b",
      textColor: "text-slate-600",
      borderColor: "border-slate-200",
      icon: Tick01Icon,
    },
    DRAFT: {
      bgColor: "#eef2ff",
      chipBgColor: "#6366f1",
      textColor: "text-indigo-700",
      borderColor: "border-indigo-200",
      icon: Tick01Icon,
    },
    DEFAULT: {
      bgColor: "#f1f5f9",
      chipBgColor: "#64748b",
      textColor: "text-slate-600",
      borderColor: "border-slate-200",
      icon: Tick01Icon,
    },
  };

  const statusKey = attemptStatus?.toLowerCase();

  const actionsList = {
    evaluated: [
      {
        icon: EyeIcon,
        title: "View Result",
        id: "viewResult",
        onClickHndlr: (event: any, attemptId: number) => {
          const tooltip = (window as any).bootstrap?.Tooltip?.getInstance(event.currentTarget);
          tooltip?.hide();
          dispatch(
            getAssessmentResultSummaryDetailsAct(
              generateActionPayload(
                "get_assessment_result_summary_details",
                { attemptId },
                undefined
              )
            )
          );
          dispatch(
            getAssessmentQuestionDetailsAct(
              generateActionPayload(
                "get_assessment_question_details",
                { attemptId },
                undefined
              )
            )
          );
          gradeDistributionUploadModal(attemptId);
        },
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
  const normalizedActions =
    statusKey === "n/a"
      ? actionsList["n/a"] ?? []
      : actionsList[statusKey as keyof typeof actionsList] ?? [];

  const startDateTimeUTC = new Date(`${startDate}T${startTime}Z`);
  const expiryDateTimeUTC = new Date(`${expiryDate}T${expiryTime}Z`);
  const nowUTC = new Date();

  const diffMs = startDateTimeUTC.getTime() - nowUTC.getTime();

  const diffMinutes = diffMs / (1000 * 60);

  const canShowStartButton =
    diffMinutes <= 120 && diffMinutes >= 0;

  const isBetween =
    isAfter(nowUTC, startDateTimeUTC) && isBefore(nowUTC, expiryDateTimeUTC);

  let showStart = false;
  let showResume = false;

  if (
    assessmentStatus?.toLowerCase() === "scheduled" ||
    assessmentStatus?.toLowerCase() === "rescheduled"
  ) {
    if (isBetween) {
      showResume = true;
    } else if (canShowStartButton) {
      showStart = true;
    }
  } else if (assessmentStatus?.toLowerCase() === "inprogress") {
    showResume = true;
  }
  const startDateTimeBtn = new Date(`${startDate}T${startTime}Z`);
  const expiryDateTime = new Date(`${expiryDate}T${expiryTime}Z`);

  const effectiveGrace = gracePeriod && gracePeriod > 0 ? gracePeriod : 5;
  const graceExpiryTime = addMinutes(expiryDateTime, effectiveGrace);

  const now = new Date();
  const rawGraceStart = gracePeriod;

  const grceStartPeriod = rawGraceStart ? Number(rawGraceStart) : 2;
  const { isNotStarted, canStart, canResume, isExpired } = useMemo(() => {
    const normalizedStatus = attemptStatus ?? "NOT_STARTED";
    const currentTime = new Date();

    const startWithGraceBefore = subMinutes(startDateTimeBtn, grceStartPeriod);

    const isNotStarted =
      normalizedStatus === "NOT_STARTED" &&
      isBefore(currentTime, startWithGraceBefore);

    const canStart =
      normalizedStatus === "NOT_STARTED" &&
      isAfter(currentTime, startWithGraceBefore) &&
      isBefore(currentTime, expiryDateTime);

    const canResume =
      normalizedStatus === "IN_PROGRESS" &&
      isAfter(currentTime, startWithGraceBefore) &&
      isBefore(currentTime, expiryDateTime);

    const isExpired =
      (normalizedStatus === "NOT_STARTED") &&
      isAfter(currentTime, expiryDateTime);

    return { isNotStarted, canStart, canResume, isExpired };
  }, [attemptStatus, startDateTimeBtn, expiryDateTime, grceStartPeriod]);

  const toInitCaps = (str?: string | null) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const SUBJECT_ICON: Record<string, string> = {
    Maths: "📐",
    Mathematics: "📐",
    Science: "🔬",
    Physics: "🔭",
    Chemistry: "⚗️",
    Biology: "🧬",
    English: "📖",
    Hindi: "📝",
    "Social Science": "🌐",
    Social: "🌐",
    History: "🏛️",
    Geography: "🌍",
    Civics: "⚖️",
    Economics: "💹",
    "Computer Science": "💻",
    IT: "💻",
    Arts: "🎨",
    "Physical Education": "⚽",
  };
  const formatShort = (val: string) => {
    return val
      .replace(/Days?/, "d")
      .replace(/Hours?/, "hr")
      .replace(/Minutes?/, "min")
      .replace(/Seconds?/, "sec");
  };

  const normalizedSubject = subjectName?.trim();
  const iconSubject = SUBJECT_ICON[normalizedSubject] || "📘";
  const statusConfig =
    statusConfigMap[assessmentStatus as keyof typeof statusConfigMap] ||
    statusConfigMap["DEFAULT"];
  const isDisabled = !(canStart || canResume);

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

  return (
    <>
      <div
        className="tw-relative tw-bg-white tw-border tw-border-slate-200 tw-rounded-2xl tw-p-4 tw-shadow-md"
        style={{
          borderTop: `4px solid ${statusConfigMap[assessmentStatus || "DEFAULT"]?.chipBgColor ?? "#ccc"
            }`,
        }}
      >

        <div className="card-body p-2">
          <div className="tw-flex tw-mb-1 tw-justify-between tw-items-center">
            <h5 className="card-title text-truncate mb-2 text-dark">
              {assessmentName}
            </h5>
            <span className="tw-flex" >
              <p
                className={classnames(
                  "tw-inline-flex tw-items-center tw-whitespace-nowrap tw-h-7 tw-px-2.5 tw-rounded-full tw-font-bold tw-text-xs"
                )}
                style={{
                  backgroundColor:
                    attemptStatus === "SUBMITTED" || attemptStatus === "EVALUATED"
                      ? statusConfigMap["SUBMITTED"].bgColor
                      : statusConfig?.bgColor,
                  border: `1px solid ${attemptStatus === "SUBMITTED" || attemptStatus === "EVALUATED"
                    ? statusConfigMap["SUBMITTED"].borderColor
                    : statusConfig?.borderColor
                    }`,
                  color:
                    attemptStatus === "SUBMITTED" || attemptStatus === "EVALUATED"
                      ? statusConfigMap["SUBMITTED"].textColor
                      : statusConfig?.textColor,
                }}
              >
                {attemptStatus === "SUBMITTED" || attemptStatus === "EVALUATED"
                  ? "Submitted"
                  : assessmentStatus === "COMPLETED"
                    ? attemptStatus === null
                      ? "Not Attended"
                      : attemptStatus === "EVALUATED"
                        ? "Completed"
                        : toInitCaps(attemptStatus)
                    : toInitCaps(assessmentStatus)}
              </p>
              {attemptStatus === "EVALUATED" && canShowMoreActions(submissionDate) && (
                <MoreActions
                  rowId={attemptId}
                  actionOptions={normalizedActions.map(a => ({
                    id: a.id,
                    actionName: a.title,
                    actionIcon: React.createElement(HugeiconsIcon, { icon: a.icon, size: 16, className: "me-2" }),
                    onClickHndlr: (event: any) => a.onClickHndlr(event, attemptId),
                  }))}
                  isHorizontal={true}
                />)}
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
          <div className="tw-pb-5">
            <div className="tw-grid tw-grid-cols-3 tw-gap-x-3.5 tw-text-slate-700 tw-font-medium tw-text-sm">
              <span className="tw-inline-flex tw-items-center tw-gap-2">
                <HugeiconsIcon icon={MessageQuestionIcon} size={16} />{totalQuestions ?? 0} Questions
              </span>
              <span className="tw-inline-flex tw-items-center tw-gap-2">
                <HugeiconsIcon icon={StarIcon} size={16} />{totalMarks ?? 0} Marks
              </span>
              <span className="tw-inline-flex tw-items-center tw-gap-2">
                <HugeiconsIcon icon={TimeQuarter02Icon} size={16} />{duration ?? 0} mins
              </span>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex gap-1 align-items-center">
              <span className="text-muted fs-12">
                <span className="me-2">{label}</span>  {formatShort(timeLeft)}</span>
            </div>
            <div className="d-flex justify-content-center">
              {attemptStatus === "SUBMITTED" || attemptStatus === "EVALUATED" ? (
                <span className="text-success fw-semibold">
                  Assessment already Submitted
                </span>
              ) : (
                <>
                  {isNotStarted && (
                    <span className="text-warning fw-semibold">
                      Assessment Not Started
                    </span>
                  )}
                  {canStart && (
                    <button
                      className="btn btn-sm btn-success d-flex align-items-center justify-content-center"
                      onClick={assessmentDetails}
                      disabled={isDisabled}
                    >
                      <HugeiconsIcon icon={PlayIcon} className="me-1" size={18} />
                      Start Test
                    </button>
                  )}
                  {isExpired && <> {!attemptStatus || attemptStatus === "NOT_STARTED" ? <button
                    className="btn btn-sm btn-success d-flex align-items-center justify-content-center"
                    onClick={assessmentDetails}
                    disabled={true}
                  >
                    <HugeiconsIcon icon={PlayIcon} className="me-1" size={18} />
                    Start Test
                  </button> :
                    <span className="text-warning fw-semibold">Not Submitted</span>}</>}
                  {canResume && (
                    <button
                      className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center"
                      onClick={assessmentDetails}
                      disabled={isDisabled}
                    >
                      Resume Now
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="dummy-success-modal"
        isOpen={gradeDistributionUploadModalState.showModal}
        toggle={() => closeGradeDistributionModalModal()}
        modalTitle="Instant Results"
        modalSize="xl"
        headerClassName="py-2 tw-bg-gradient-to-r tw-from-[#FFB200] tw-to-[#27C26E]"
      >
        <InstantResults
          id={gradeDistributionUploadModalState.modalData}
          isOpen={false}
          toggle={() => closeGradeDistributionModalModal()}
          scoreData={{
            scoredMarks: 10,
            condectedMarks: 30,
          }}
        ></InstantResults>
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
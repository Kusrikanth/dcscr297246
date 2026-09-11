import { CalendarIcon, CheckmarkCircleIcon, StarIcon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getStudentStatsAssessmentsDetailsListAct } from "../../../../../store/lms/studentAssessment/studentAssessmentActions";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { useEffect } from "react";

const StatsCards = () => {
  const dispatch = useAppDispatch();

  const {
    currentStudentId,
    getStudentAssessmentStatsDetailsResp,
  }: any = useAppSelector(
    ({ appData, studentAssessments }) => ({
      currentStudentId: appData.currentStudentId,
      getStudentAssessmentStatsDetailsResp:
        studentAssessments.getStudentAssessmentStatsDetailsResp,
    }),
    shallowEqual
  );

  const assessmentStatsApi = () => {
    if (!currentStudentId) return;
    dispatch(
      getStudentStatsAssessmentsDetailsListAct(
        generateActionPayload("get_student_assessment_stats_details", {
          studentId: currentStudentId,
        })
      )
    );
  };

  useEffect(() => {
    if (currentStudentId) {
      assessmentStatsApi();
    }
  }, [currentStudentId]);

  const stats = getStudentAssessmentStatsDetailsResp || {};
  const totalAssessments = stats.totalAssessments || 0;
  const participated = stats.participatedAssessments || 0;
  const absent = stats.absentAssessments || 0;
  const averagePercentage = stats.averagePercentage?.toFixed(2) || "0.00";
  const overallGrade = stats.overallGrade || "-";

  const gradeStyleMap: Record<string, { bg: string; text: string }> = {
    "A+": { bg: "tw-bg-green-100", text: "tw-text-green-700" },
    A: { bg: "tw-bg-green-100", text: "tw-text-green-700" },
    "A-": { bg: "tw-bg-green-100", text: "tw-text-green-700" },
    "B+": { bg: "tw-bg-blue-100", text: "tw-text-blue-700" },
    B: { bg: "tw-bg-blue-100", text: "tw-text-blue-700" },
    "B-": { bg: "tw-bg-blue-100", text: "tw-text-blue-700" },
    "C+": { bg: "tw-bg-yellow-100", text: "tw-text-yellow-700" },
    C: { bg: "tw-bg-yellow-100", text: "tw-text-yellow-700" },
    "C-": { bg: "tw-bg-yellow-100", text: "tw-text-yellow-700" },
    D: { bg: "tw-bg-orange-100", text: "tw-text-orange-700" },
    E: { bg: "tw-bg-red-100", text: "tw-text-red-600" },
    F: { bg: "tw-bg-red-200", text: "tw-text-red-700" },
    default: { bg: "tw-bg-gray-100", text: "tw-text-gray-700" },
  };

  const gradeClass = gradeStyleMap[overallGrade] || gradeStyleMap.default;

  const cards = [
    {
      value: `${participated} / ${totalAssessments}`,
      label: "Assessment",
      icon: StarIcon,
      iconBg: "tw-bg-indigo-100",
      iconColor: "tw-text-indigo-700",
      textColor: "tw-text-indigo-700",
    },
    {
      value: `${averagePercentage}%`,
      label: "Avg Score",
      icon: StarIcon,
      iconBg: "tw-bg-yellow-100",
      iconColor: "tw-text-yellow-700",
      textColor: "tw-text-yellow-700",
    },
    {
      value: `${absent}`,
      label: "Not Submitted",
      icon: CalendarIcon,
      iconBg: "tw-bg-purple-100",
      iconColor: "tw-text-purple-700",
      textColor: "tw-text-purple-700",
    },
    {
      value: overallGrade,
      label: "Overall Grade",
      icon: CheckmarkCircleIcon,
      iconBg: gradeClass.bg,
      iconColor: gradeClass.text,
      textColor: gradeClass.text,
    },
  ];

  return (
    <div className="tw-grid tw-grid-cols-1 sm:tw-grid-cols-2 lg:tw-grid-cols-4 tw-gap-4 tw-w-full">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="tw-bg-white tw-rounded-2xl tw-shadow-sm tw-p-5 tw-border tw-h-full tw-transition-all tw-duration-300 hover:tw-shadow-md hover:tw-scale-[1.02]"
        >
          <div className="tw-flex tw-items-start tw-gap-4 tw-h-full">
            <div
              className={`tw-w-12 tw-h-12 tw-rounded-xl tw-flex tw-items-center tw-justify-center ${card.iconBg}`}
            >
              <HugeiconsIcon icon={card.icon} size={22} className={card.iconColor} />
            </div>
            <div className="tw-flex-1 tw-space-y-2">
              <p className="tw-text-gray-500 tw-text-sm tw-font-medium tw-m-0">
                {card.label}
              </p>
              <h3 className={`tw-font-extrabold tw-text-2xl ${card.textColor}`}>
                {card.value}
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

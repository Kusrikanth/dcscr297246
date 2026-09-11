import { HugeiconsIcon } from "@hugeicons/react";
import { UserGroupIcon } from "@hugeicons-pro/core-solid-standard";
import { CheckmarkCircle03Icon } from "@hugeicons-pro/core-solid-standard";
import { BarChartHorizontalIcon } from "@hugeicons-pro/core-solid-standard";
import { StarIcon } from "@hugeicons-pro/core-solid-standard";
import { useMemo } from "react";

type StatCardProps = {
  title: string;
  subText: string;
  icon: any;
  value: number | string;
  total?: number | string;
  totalQuestionMarks?: number | string;
  percent?: number;
  tag?: string;
  showProgress?: boolean;
};

const colorConfig: Record<string, any> = {
  Participation: {
    iconBg: "#EEF2FF",
    iconColor: "#405189",
    progressColor: "#405189",
  },
  Passed: {
    iconBg: "#E7F6EC",
    iconColor: "#0AB39C",
    progressColor: "#0AB39C",
  },
  "Average Score": {
    iconBg: "#FFEDD5",
    iconColor: "#EA580C",
    progressColor: "#EA580C",
  },
  "Highest Score": {
    iconBg: "#FEF9C3",
    iconColor: "#CA8A04",
    progressColor: "#FACC15",
  },
};

const StatCard = ({
  title,
  value,
  icon,
  total,
  totalQuestionMarks,
  subText,
  percent = 0,
  tag,
  showProgress = true,
}: StatCardProps) => {
  const colors = colorConfig[title] || {
    iconBg: "#F3F4F6",
    iconColor: "#6B7280",
    progressColor: "#9CA3AF",
  };

  const showMarks =
    title === "Average Score" || title === "Highest Score"
      ? totalQuestionMarks && Number(totalQuestionMarks) > 0
        ? `${value}/${totalQuestionMarks}`
        : `${value}`
      : `${value}/${total ?? 0}`;

  return (
    <div className="tw-bg-white tw-rounded-2xl tw-shadow-sm tw-p-4">
      <div className="tw-flex tw-items-start tw-gap-4 tw-h-full">
        <div
          className="tw-w-12 tw-h-12 tw-rounded-xl tw-flex tw-items-center tw-justify-center"
          style={{ backgroundColor: colors.iconBg }}
        >
          <HugeiconsIcon icon={icon} size={24} color={colors.iconColor} />
        </div>

        <div className="tw-flex-1 tw-space-y-2">
          <p className="tw-text-gray-500 tw-text-sm tw-font-medium tw-m-0">
            {title}
          </p>

          <div className="tw-flex tw-items-center tw-justify-between">
            <span className="tw-text-[#0D0A19] tw-font-extrabold tw-text-2xl">
              {showMarks}
            </span>

            {tag && (
              <span className="tw-rounded-full tw-text-xs tw-font-semibold tw-px-3 tw-py-1">
                {tag}
              </span>
            )}
          </div>
        </div>
      </div>

      {showProgress && (
        <div className="tw-flex-1 tw-space-y-2 tw-mt-5">
          <div className="tw-w-full tw-h-[8px] tw-bg-gray-200 tw-rounded-full tw-overflow-hidden tw-mt-1">
            <div
              className="tw-h-full tw-rounded-full tw-transition-all tw-duration-500"
              style={{
                width: `${percent ?? 0}%`,
                backgroundColor: colors.progressColor,
              }}
            />
          </div>
          <p className="tw-text-gray-500 tw-text-sm fs-12 tw-font-medium tw-m-0">
            {subText}
          </p>
        </div>
      )}
    </div>
  );
};

const SectionWiseAssessmentStats = ({ getStatsByAssessmentResp }: any) => {
  const statsData = getStatsByAssessmentResp || {};

  const {
    participantCount = 0,
    passedCount = 0,
    averageScore = 0,
    highestScore = 0,
    highestScoreStudentCount = 0,
    totalQuestionMarks = 0,
    passRate = 0,
    totalCount = 0,
    percentage = 0,
  } = statsData;

  const total = totalCount || 1;

  const percent = (num: number, den: number) =>
    den > 0 ? Math.round((num / den) * 100) : 0;

  const stats = useMemo(
    () => [
      {
        title: "Participation",
        value: participantCount,
        total,
        icon: UserGroupIcon,
        percent: percent(participantCount, total),
        tag: `${percent(participantCount, total)}%`,
        subText: "Students Who Participated Out Of Total Enrolled",
      },
      {
        title: "Passed",
        value: passedCount,
        total,
        icon: CheckmarkCircle03Icon,
        percent: Math.round(passRate),
        tag: `${Math.round(passRate)}%`,
        subText: "Students Who Cleared The Assessment",
      },
      {
        title: "Average Score",
        value: Math.round(averageScore),
        totalQuestionMarks,
        icon: BarChartHorizontalIcon,
        percent: percent(averageScore, totalQuestionMarks),
        tag: `${Math.round(percentage)}%`,
        subText: "Mean Score Across All Attempts",
      },
      {
        title: "Highest Score",
        value: Math.round(highestScore),
        totalQuestionMarks,
        icon: StarIcon,
        percent: percent(highestScore, totalQuestionMarks),
        tag: `${highestScoreStudentCount} Top Scorers`,
        subText: "Top Score In This Assessment",
      },
    ],
    [
      participantCount,
      passedCount,
      passRate,
      averageScore,
      highestScore,
      highestScoreStudentCount,
      totalQuestionMarks,
      percentage,
      total,
    ]
  );

  return (
    <div className="row g-3 mb-3">
      {stats.map((stat, idx) => (
        <div className="col-12 col-md-6 col-lg-3" key={idx}>
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
};

export default SectionWiseAssessmentStats;

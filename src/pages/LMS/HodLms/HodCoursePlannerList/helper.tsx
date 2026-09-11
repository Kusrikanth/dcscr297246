import { StatusLabel, UserDetails } from "../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
  MoreActions,
} from "../../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";
import React from "react";

const statusStyles: Record<
  string,
  { bg: string; text: string; border: string; dot: string }
> = {
  published: {
    bg: "tw-bg-green-100",
    text: "tw-text-green-800",
    border: "tw-border-green-500",
    dot: "tw-bg-green-500",
  },
  insetup: {
    bg: "tw-bg-yellow-100",
    text: "tw-text-yellow-800",
    border: "tw-border-yellow-500",
    dot: "tw-bg-yellow-500",
  },
  pending: {
    bg: "tw-bg-orange-100",
    text: "tw-text-orange-800",
    border: "tw-border-orange-500",
    dot: "tw-bg-orange-500",
  },
  inreview: {
    bg: "tw-bg-blue-100",
    text: "tw-text-blue-800",
    border: "tw-border-blue-500",
    dot: "tw-bg-blue-500",
  },
  draft: {
    bg: "tw-bg-gray-100",
    text: "tw-text-gray-800",
    border: "tw-border-gray-500",
    dot: "tw-bg-gray-500",
  },
  archived: {
    bg: "tw-bg-red-100",
    text: "tw-text-red-800",
    border: "tw-border-red-500",
    dot: "tw-bg-red-500",
  },
  default: {
    bg: "tw-bg-gray-100",
    text: "tw-text-gray-800",
    border: "tw-border-gray-500",
    dot: "tw-bg-gray-500",
  },
};

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Course",
      accessor: "subjectCurriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Subject",
      accessor: "subjectName",
      disableSortBy: true,
    },
    {
      Header: "Academic year",
      accessor: "academicYearId",
      disableSortBy: true,
    },
    {
      Header: "Units",
      accessor: "unitsCount",
      disableSortBy: true,
    },
    {
      Header: "Chapters",
      accessor: "chaptersCount",
      disableSortBy: true,
    },
    {
      Header: "Topics",
      accessor: "topicsCount",
      disableSortBy: true,
    },
    {
      Header: "Date",
      accessor: "lastModifiedAt",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const [date, time] = original?.lastModifiedAt?.split("T") ?? [];
        return <UserDetails
          displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
          displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
          showAvatar={false}
        ></UserDetails>
      }
    },
    {
      Header: "Curriculum Status",
      accessor: "curriculumStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const style =
          statusStyles[original.curriculumStatus?.toLowerCase().split(" ").join("")] ||
          statusStyles.default;

        return original?.curriculumStatus ? (
          <div
            className={`tw-inline-flex tw-items-center tw-gap-1 tw-px-2 tw-py-1 tw-text-[10px] tw-font-medium tw-rounded-full tw-border-[0.6px] ${style.bg} ${style.text} ${style.border}`}
          >
            <span
              className={`tw-w-2 tw-h-2 tw-rounded-full ${style.dot}`}
            ></span>
            {original.curriculumStatus.toUpperCase()}
          </div>
        ) : (
          <div>-</div>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {

        const mapStatusToStyleKey = (row: any): string => {
          if (row?.buildReviewStatus) {
            switch (row.buildReviewStatus) {
              case "REQUEST_CHANGE":
                return "pending";
              case "APPROVED":
                return "published";
              case "REJECTED":
                return "archived";
              default:
                return "default";
            }
          }
          switch (row?.buildStatus) {
            case "IN_REVIEW":
            case "REVIEWED":
              return "inreview";
            case "IN_PROGRESS":
              return "insetup";
            case "PUBLISHED":
              return "published";
            default:
              return "default";
          }
        };

        const getStatusLabel = (row: any): string => {

          if (row?.buildStatus === "PUBLISHED") {
            return "PUBLISHED";
          }

          if (row?.buildReviewStatus === "PENDING") {
            return "IN REVIEW";
          }
          if (!row?.buildStatus) {
            return "PENDING";
          }
          if (row?.buildReviewStatus) {
            return row.buildReviewStatus.replace(/_/g, " ");
          }
          return row?.buildStatus?.replace(/_/g, " ") ?? "-";
        };

        const styleKey = mapStatusToStyleKey(original);
        const style = statusStyles[styleKey] || statusStyles.default;
        const label = getStatusLabel(original);

        if (!label || label === "-") return <div>-</div>;

        return (
          <div
            className={`tw-inline-flex tw-items-center tw-gap-1 tw-px-2 tw-py-1
          tw-text-[10px] tw-font-medium tw-rounded-full
          tw-border-[0.6px] ${style.bg} ${style.text} ${style.border}`}
          >
            <span className={`tw-w-2 tw-h-2 tw-rounded-full ${style.dot}`} />
            {label}
          </div>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        let updatedActionList: any[] = [];

        const { curriculumStatus, buildReviewStatus, buildStatus } = original;

        if (curriculumStatus === "PUBLISHED") {

          if (buildStatus === "PUBLISHED") {
            updatedActionList = actionsList.filter(
              (a) => a.id === "View"
            );
          }
          else if (buildReviewStatus === "REQUEST_CHANGE") {
            updatedActionList = actionsList.filter(
              (a) => a.id === "buildCurriculum"
            );
          }

          else if (buildReviewStatus === "REJECTED") {
            updatedActionList = [];
          }

          else if (buildReviewStatus === "APPROVED") {
            updatedActionList = actionsList.filter(
              (a) => a.id === "publish"
            );
          }

          else if (buildStatus === "IN_PROGRESS" || !buildStatus) {
            updatedActionList = actionsList.filter(
              (a) => a.id === "buildCurriculum"
            );
          }
        }

        if (!updatedActionList.length) return null;

        return (
          <MoreActions
            actionOptions={updatedActionList}
            rowId={original.id}
            isHorizontal={true}
          />
        );
      }
    },
  ];
}


export interface ISubTreeParentInfo {
  parentFeatureId: string;
  parentFeatureName: string;
}

export interface IWeek {
  weekName?: string;
  weekStartDate?: string;
  weekEndDate?: string;
}

export interface IFeatureMeta {
  termName?: string;
  plannedTeachingHours?: number | string;
  totalSessions?: number | string;
  minPerSession?: number | string;
  weeks?: IWeek[];
}

export interface IFeature {
  id: string;
  description: string;
  indexNumber: string;
  subFeatures: IFeature[];
  meta?: IFeatureMeta;
}

const normalizeWeeks = (weeks: any): IWeek[] => {
  if (!weeks) return [];
  return Array.isArray(weeks) ? weeks : [weeks];
};

export function convertCurriculumToTree(units: any[]): IFeature[] {
  return (units || []).map((unit: any, uIndex: number) => {
    const unitNumber = unit.unitNo || `${uIndex + 1}`;

    return {
      id: String(unit.unitId),
      description: unit.unitName || "Untitled Unit",
      indexNumber: unitNumber,
      meta: {
        termName: unit.termName,
        plannedTeachingHours: unit.plannedTeachingHours,
        weeks: normalizeWeeks(unit.weeks),
      },

      subFeatures: (unit.chaptersBuild || []).map((chapter: any, cIndex: number) => {
        const chapterNumber = chapter.chapterNo || `${unitNumber}.${cIndex + 1}`;

        return {
          id: String(chapter.chapterId),
          description: chapter.chapterName || "Untitled Chapter",
          indexNumber: chapterNumber,
          meta: {
            termName: chapter.termName ?? unit.termName,
            plannedTeachingHours: chapter.plannedTeachingHours,
            weeks: normalizeWeeks(chapter.weeks),
          },

          subFeatures: (chapter.topicsBuild || []).map((topic: any, tIndex: number) => ({
            id: String(topic.topicId),
            description: topic.topicName || "Untitled Topic",
            indexNumber: topic.topicNo || `${chapterNumber}.${tIndex + 1}`,
            meta: {
              weeks: normalizeWeeks(topic.weeks),
              totalSessions: topic.totalSessions,
              minPerSession: topic.minPerSession,
            },
            subFeatures: [],
          })),
        };
      }),
    };
  });
}

type StatusTone = "danger" | "warning" | "success" | "info" | "neutral";
type StatusVariant = "soft" | "outline" | "solid";
type StatusSize = "sm" | "md";


type StatusPillProps = {
  tone?: StatusTone;
  variant?: StatusVariant;
  size?: StatusSize;
  label: string;
  showDot?: boolean;
  className?: string;
  title?: string;
};

const toneStyles: Record<StatusTone, Record<StatusVariant, string> & { dot: string }> = {
  danger: {
    soft: "tw-bg-rose-50 tw-text-rose-800",
    outline: "tw-text-rose-800 tw-ring-1 tw-ring-rose-300",
    solid: "tw-bg-rose-600 tw-text-white",
    dot: "tw-bg-rose-500",
  },
  warning: {
    soft: "tw-bg-amber-50 tw-text-amber-900",
    outline: "tw-text-amber-900 tw-ring-1 tw-ring-amber-300",
    solid: "tw-bg-amber-500 tw-text-white",
    dot: "tw-bg-amber-500",
  },
  success: {
    soft: "tw-bg-emerald-50 tw-text-emerald-900",
    outline: "tw-text-emerald-900 tw-ring-1 tw-ring-emerald-300",
    solid: "tw-bg-emerald-600 tw-text-white",
    dot: "tw-bg-emerald-500",
  },
  info: {
    soft: "tw-bg-sky-50 tw-text-sky-900",
    outline: "tw-text-sky-900 tw-ring-1 tw-ring-sky-300",
    solid: "tw-bg-sky-600 tw-text-white",
    dot: "tw-bg-sky-400",
  },
  neutral: {
    soft: "tw-bg-slate-50 tw-text-slate-800",
    outline: "tw-text-slate-800 tw-ring-1 tw-ring-slate-300",
    solid: "tw-bg-slate-700 tw-text-white",
    dot: "tw-bg-slate-400",
  },
};

const sizeStyles: Record<StatusSize, string> = {
  sm: "tw-text-xs tw-h-6 tw-px-2.5",
  md: "tw-text-sm tw-h-7 tw-px-3",
};

export const StatusPill: React.FC<StatusPillProps> = ({
  tone = "info",
  variant = "soft",
  size = "sm",
  label,
  showDot = true,
  className = "",
  title,
}) => {
  return (
    <span
      role="status"
      title={title ?? label}
      className={`tw-inline-flex tw-items-center tw-gap-2 tw-rounded-full tw-font-semibold ${toneStyles[tone][variant]} ${sizeStyles[size]} ${className}`}
    >
      {showDot && <span className={`tw-w-2 tw-h-2 tw-rounded-full ${toneStyles[tone].dot}`} />}
      <span className="tw-truncate">{label}</span>
    </span>
  );
};

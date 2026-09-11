import { useMemo } from "react";
import TableContainer from "../../../../../../../../Components/Common/TableContainer";
import { generateUniqueNumber } from "../../../../../../../../utility/commonutility";
import { CustomTooltip } from "../../../../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { HelpSquareIcon, NeutralIcon, Sad01Icon, SmileIcon } from "@hugeicons-pro/core-stroke-standard";

export interface DomainData {
  id: number;
  name: string;
  domainIndex?: string;
  curriculumGoals: CurriculumGoal[];
  competencies: Competency[];
  activities: ActivityData[];
  studentDomainId?: number;
}

export interface ActivityOption {
  activityId: string | number;
  title: string;
  questions: string[];
}

export interface ActivityData {
  activityId: string;
  description?: ActivityOption[];
  questions: AssessmentQuestion[];
  teacherFeedback: TeacherFeedback;
  selfResponses: Record<number, string>;
  assessmentRubric?: AssessmentRubric;
}

export interface CurriculumGoal {
  id: string;
  title: string;
  goalIndex?: string;
  selected: boolean;
}

export interface Competency {
  id: string;
  goalId: string;
  title: string;
  competencyIndex?: string;
  selected: boolean;
}

export interface AssessmentActivity {
  description: string;
  activityId: string;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  answer: string;
}

export interface AssessmentRubric {
  awareness: RubricLevel;
  sensitivity: RubricLevel;
  creativity: RubricLevel;
}

export interface RubricLevel {
  level: 'beginner' | 'proficient' | 'advanced';
  notes: string;
}

export interface TeacherFeedback {
  teacherAwarenessStatus: 'beginner' | 'proficient' | 'advanced';
  teacherSensitivityStatus: 'beginner' | 'proficient' | 'advanced';
  teacherCreativityStatus: 'beginner' | 'proficient' | 'advanced';
  teacherFeedback: string;
  challengesFaced: string;
  overComeChallenges: string;
}

export const rubricLevels = [
  {
    id: 'beginner',
    name: 'Beginner',
    description: 'Emerging awareness - Beginning to develop awareness',
    borderColor: 'border-warning',
    backgroundColor: 'tw-bg-[#f7b84b1e]',
    textColor: 'text-warning',
    iconBgColor: 'bg-warning',
    iconBorderColor: 'border-warning'
  },
  {
    id: 'proficient',
    name: 'Proficient',
    description: 'Developing awareness - Developing understanding and skills',
    borderColor: 'border-primary',
    backgroundColor: 'tw-bg-[#5ea3cb1e]',
    textColor: 'text-primary',
    iconBgColor: 'bg-primary',
    iconBorderColor: 'border-primary'
  },
  {
    id: 'advanced',
    name: 'Advanced',
    description: 'Advanced awareness - Advanced mastery and understanding',
    borderColor: 'border-success',
    backgroundColor: 'tw-bg-[#0ab39c1e]',
    textColor: 'text-success',
    iconBgColor: 'bg-success',
    iconBorderColor: 'border-success'
  }
];

export const transformApiDataToDomainData = (apiData: any[]): any[] => {
  return apiData?.map((domain) => {
    const activityOptions =
      domain.activities?.map((a: any) => ({
        activityId: a.id,
        title: a.title || a.name || `Activity ${a.id}`,
        questions: a.questions || [],
      })) || [];

    return {
      id: domain.domainId,
      name: domain.domainName,
      domainIndex: domain.domainIndex,
      curriculumGoals: domain.goals?.map((goal: any) => ({
        id: goal.goalId.toString(),
        title: goal.goalName,
        goalIndex: goal.goalIndex,
        selected: false,
      })) || [],
      competencies:
        domain.goals?.flatMap((goal: any) =>
          goal.competencies?.map((comp: any) => ({
            id: comp.competencyId.toString(),
            goalId: goal.goalId.toString(),
            title: comp.competencyName,
            competencyIndex: comp.competencyIndex,
            selected: false,
          })) || []
        ) || [],
      activities: [
        {
          activityId: "",
          description: activityOptions,
          questions: [
            { id: generateUniqueNumber(), question: "", answer: "" }
          ],
          teacherFeedback: {
            teacherAwarenessStatus: "beginner",
            teacherSensitivityStatus: "beginner",
            teacherCreativityStatus: "beginner",
            teacherFeedback: "",
            challengesFaced: "",
            overComeChallenges: "",
          },
          selfResponses: {},
          assessmentRubric: {
            awareness: { level: "beginner", notes: "" },
            sensitivity: { level: "beginner", notes: "" },
            creativity: { level: "beginner", notes: "" },
          },
        },
      ],
    };
  });
};

export const transformSavedDataToDomainData = (savedData: any[]): any[] => {
  return savedData?.map((savedDomain) => {
    if (!savedDomain) return null;
    const domain = savedDomain;
    const activities =
      savedDomain.activities?.map((activity: any) => {
        const selfResponses: Record<number, string> = {};
        if (activity.selfAssessment) {
          const keys = [
            "followedInstructions",
            "likeDoingWork",
            "askedForHelp",
            "triedMyBest",
            "proudOfWork",
            "wantTodoAgain",
            "likeWorkWithClassmates",
            "theyHelpedMe",
          ];
          keys.forEach((key, index) => {
            if (activity.selfAssessment[key]) {
              selfResponses[index] = activity.selfAssessment[key];
            }
          });
        }

        return {
          activityId: activity.domain?.activities?.[0]?.id?.toString() || "",
          studentDomainId: activity.studentDomainId,
          questions:
            activity.activityQuestions?.map((q: any) => ({
              id: generateUniqueNumber(),
              question: q.question,
              answer: q.answer,
            })) || [],
          teacherFeedback: {
            teacherAwarenessStatus:
              activity.teacherAwarenessStatus?.toLowerCase() || "beginner",
            teacherSensitivityStatus:
              activity.teacherSensitivityStatus?.toLowerCase() || "beginner",
            teacherCreativityStatus:
              activity.teacherCreativityStatus?.toLowerCase() || "beginner",
            teacherFeedback: activity.teacherObservationalNotes || "",
            challengesFaced: activity.learnerChallengeFace || "",
            overComeChallenges: activity.learnerOvercomeChallenges || "",
          },
          selfResponses,
        };
      }) || [];

    return {
      id: domain.domainId,
      name: domain.domainName,
      domainIndex: domain.domainIndex,
      studentDomainId: savedDomain.activities?.[0]?.studentDomainId,
      curriculumGoals:
        domain.goals?.map((goal: any) => ({
          id: goal.goalId.toString(),
          title: goal.goalName,
          goalIndex: goal.goalIndex,
          selected: true,
        })) || [],
      competencies:
        domain.goals?.flatMap((goal: any) =>
          goal.competencies?.map((comp: any) => ({
            id: comp.competencyId.toString(),
            goalId: goal.goalId.toString(),
            title: comp.competencyName,
            competencyIndex: comp.competencyIndex,
            selected: true,
          })) || []
        ) || [],
      activities,
    };
  }).filter(Boolean);
};

export function transformToApiPayload(
  tabData: DomainData[],
  isUpdate: boolean
) {
  if (!tabData) return [];

  return tabData.map((domain) => {
    const selectedGoalIds =
      domain.curriculumGoals
        ?.filter((goal) => goal.selected)
        ?.map((goal) => parseInt(goal.id)) || [];

    const selectedCompetencyIds =
      domain.competencies
        ?.filter((comp) => comp.selected)
        ?.map((comp) => parseInt(comp.id)) || [];

    const activitiesPayload =
      domain.activities?.map((activity) => {
        const validQuestions =
          activity.questions?.filter(
            (q) => q.question?.trim() || q.answer?.trim()
          ) || [];

        const activityQuestions = validQuestions.map((q, index) => ({
          question: q.question || "",
          questionOrderNum: index + 1,
          answer: q.answer || "",
        }));

        const selfAssessment = {
          followedInstructions: activity.selfResponses?.[0] || null,
          likeDoingWork: activity.selfResponses?.[1] || null,
          askedForHelp: activity.selfResponses?.[2] || null,
          triedMyBest: activity.selfResponses?.[3] || null,
          proudOfWork: activity.selfResponses?.[4] || null,
          wantTodoAgain: activity.selfResponses?.[5] || null,
          likeWorkWithClassmates: activity.selfResponses?.[6] || null,
          theyHelpedMe: activity.selfResponses?.[7] || null,
        };

        return {
          activityId: activity.activityId
            ? parseInt(activity.activityId)
            : null,

          activityQuestions,

          teacherAwarenessStatus:
            activity.teacherFeedback?.teacherAwarenessStatus
              ? activity.teacherFeedback.teacherAwarenessStatus.toUpperCase()
              : null,

          teacherSensitivityStatus:
            activity.teacherFeedback?.teacherSensitivityStatus
              ? activity.teacherFeedback.teacherSensitivityStatus.toUpperCase()
              : null,

          teacherCreativityStatus:
            activity.teacherFeedback?.teacherCreativityStatus
              ? activity.teacherFeedback.teacherCreativityStatus.toUpperCase()
              : null,

          teacherObservationalNotes:
            activity.teacherFeedback?.teacherFeedback || null,

          learnerChallengeFace:
            activity.teacherFeedback?.challengesFaced || null,

          learnerOvercomeChallenges:
            activity.teacherFeedback?.overComeChallenges || null,

          selfAssessment,
        };
      }) || [];

    const payload: any = {
      domainId: domain.id,
      curriculumGoalIds: selectedGoalIds,
      competencyIds: selectedCompetencyIds,
      activities: activitiesPayload,
    };

    if (isUpdate && domain.studentDomainId != null) {
      payload.id = Number(domain.studentDomainId);
    }
    
    return payload;
  });
}

export const ParentQuestions = ({
  questions,
  values,
  onChange,
  isViewMode,
  prefix,
}: {
  questions: string[];
  values: Record<number, string>;
  onChange: (index: number, value: string) => void;
  isViewMode: boolean;
  prefix: string;
}) => {
  const options = [
    {
      value: "yes",
      label: "Yes",
      icon: SmileIcon,
      color: "tw-text-green-600",
      border: "tw-border-green-500 tw-bg-green-100",
    },
    {
      value: "no",
      label: "No",
      icon: Sad01Icon,
      color: "tw-text-red-600",
      border: "tw-border-red-500 tw-bg-red-100",
    },
    {
      value: "notSure",
      label: "Not sure",
      icon: HelpSquareIcon,
      color: "tw-text-gray-600",
      border: "tw-border-gray-400 tw-bg-gray-100",
    },
  ];

  const columns = useMemo(() => {
    const baseCols = [
      {
        Header: "Question",
        accessor: "question",
        disableSortBy: true,
        columnClassName: "tw-text-left tw-font-medium tw-text-gray-800 tw-px-4 tw-py-3",
        Cell: ({ row }: any) => (
          <span>{`${row.index + 1}. ${row.original.question}`}</span>
        ),
      },
      ...options.map((opt) => ({
        Header: opt.label,
        accessor: opt.value,
        disableSortBy: true,
        columnClassName: "tw-px-2 tw-py-3",
        Cell: ({ row }: any) => {
          const index = row.index;
          const isSelected = values[index] === opt.value;

          return (
            <div
              className={`tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-border-2 ${isSelected ? opt.border : "tw-border-gray-300"
                }`}
              style={{
                width: "34px",
                height: "34px",
                cursor: isViewMode ? "default" : "pointer",
              }}
              onClick={() => !isViewMode && onChange(index, opt.value)}
              data-tooltip-id={`${prefix}-q${index}-${opt.value}`}
            >
              <HugeiconsIcon
                icon={opt.icon}
                size={22}
                className={isSelected ? opt.color : "tw-text-gray-400"}
              />
              <CustomTooltip
                id={`${prefix}-q${index}-${opt.value}`}
                content={opt.label}
                placement="top"
              />
            </div>
          );
        },
      })),
    ];
    return baseCols;
  }, [options, values, isViewMode, prefix, onChange]);

  const data = useMemo(() => {
    return questions.map((q) => ({ question: q }));
  }, [questions]);

  return (
    <div className="tw-overflow-hidden tw-rounded-lg tw-border tw-border-gray-300 tw-shadow-sm">
      <TableContainer
        columns={columns}
        data={data}
        tableClass="tw-w-full tw-text-sm tw-bg-white tw-border-collapse"
        theadClass="tw-bg-orange-100 tw-text-dark tw-text-start tw-font-semibold"
        alternateRowColor={true}
        divClass="tw-mb-0"
      />
    </div>
  );
};

export const selfQuestions = [
  "I followed my teacher's instructions.",
  "I liked doing this work.",
  "I asked for help if I didn't understand.",
  "I tried my best in this task.",
  "I am proud of my work.",
  "I want to do this task again.",
  "I liked working with my classmate/s.",
  "I could ask my classmates for help, and they helped me."
];

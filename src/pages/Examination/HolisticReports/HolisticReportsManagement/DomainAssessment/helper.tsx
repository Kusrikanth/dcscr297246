import { generateUniqueNumber } from "../../../../../utility/commonutility";

export interface DomainData {
  id: number;
  name: string;
  domainIndex?: string;
  curriculumGoals: CurriculumGoal[];
  competencies: Competency[];
  assessmentActivity: AssessmentActivity;
  activities: ActivityData[];
}

export interface ActivityData {
  activityId: string;
  questions: AssessmentQuestion[];
  assessmentRubric: {
    awareness: RubricLevel;
    sensitivity: RubricLevel;
    creativity: RubricLevel;
  };
  teacherFeedback: TeacherFeedback;
  selfAssessment: SelfAssessment;
  peerAssessment: PeerAssessment;
  parentObservation: ParentObservation;
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
  description: any[];
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
  level: 'stream' | 'mountain' | 'sky';
  notes: string;
}

export interface TeacherFeedback {
  proficiencyLevel: 'stream' | 'mountain' | 'sky';
  notes: string;
}

export interface SelfAssessment {
  likedWork: 'yes' | 'no' | 'dont_know';
  foundEasy: 'yes' | 'no' | 'dont_know';
  neededHelp: string[];
}

export interface PeerAssessment {
  likedWork: 'yes' | 'no' | 'dont_know';
  foundEasy: 'yes' | 'no' | 'dont_know';
  neededHelp: string[];
}

export interface ParentObservation {
  homeResources: HomeResource[];
  notes: string;
  parentOvservationOthers: string;
}

export interface HomeResource {
  id: string;
  name: string;
  selected: boolean;
}

export const rubricLevels = [
  {
    id: 'stream',
    name: 'Stream',
    description: 'Emerging awareness - Beginning to develop awareness',
    borderColor: 'border-warning',
    backgroundColor: 'tw-bg-[#f7b84b1e]',
    textColor: 'text-warning',
    iconBgColor: 'bg-warning',
    iconBorderColor: 'border-warning'
  },
  {
    id: 'mountain',
    name: 'Mountain',
    description: 'Developing awareness - Developing understanding and skills',
    borderColor: 'border-primary',
    backgroundColor: 'tw-bg-[#5ea3cb1e]',
    textColor: 'text-primary',
    iconBgColor: 'bg-primary',
    iconBorderColor: 'border-primary'
  },
  {
    id: 'sky',
    name: 'Sky',
    description: 'Advanced awareness - Advanced mastery and understanding',
    borderColor: 'border-success',
    backgroundColor: 'tw-bg-[#0ab39c1e]',
    textColor: 'text-success',
    iconBgColor: 'bg-success',
    iconBorderColor: 'border-success'
  }
];

export const yesNoOptions = [
  { id: 'yes', name: 'Yes', icon: '✓' },
  { id: 'no', name: 'No', icon: '✗' },
  { id: 'dont_know', name: "Don't know", icon: '?' }
];

export const helpOptions = [
  { id: 'classmate', name: 'Classmate' },
  { id: 'teacher', name: 'Teacher' },
  { id: 'books', name: 'Books' },
  { id: 'computer', name: 'Computer' },
  { id: 'none', name: 'None' }
];

export const transformApiDataToDomainData = (apiData: any[]): any[] => {

  return apiData?.map((domain, index) => {
    const activitiesInfo = domain?.activities?.map((activity: any) => ({
      activityId: activity.id?.toString(),
      title: activity.title || activity.name || `Activity ${activity.id}`,
      questions: activity.questions || [],
      assessmentRubric: activity.assessmentRubric || {} // Store rubric data as well
    })) || [];
    return {
      id: domain.domainId,
      name: domain.domainName,
      domainIndex: domain.domainIndex,
      curriculumGoals: domain.goals?.map((goal: any) => ({
        id: goal.goalId.toString(),
        title: goal.goalName,
        goalIndex: goal.goalIndex,
        selected: false
      })),
      competencies: domain.goals?.flatMap((goal: any) =>
        goal.competencies?.map((comp: any) => ({
          id: comp.competencyId.toString(),
          goalId: goal.goalId.toString(),
          title: comp.competencyName,
          competencyIndex: comp.competencyIndex,
          selected: false
        }))
      ),
      assessmentActivity: {
        description: activitiesInfo, // Store full activity info here
        activityId: "",
        questions: []
      },
      activities: [],
    };
  });
};

const buildHomeResources = (savedArray?: string[]) => [
  { id: 'books_magazines', name: 'Books/Magazines', selected: savedArray?.includes('books_magazines') || false },
  { id: 'newspapers', name: 'Newspapers', selected: savedArray?.includes('newspapers') || false },
  { id: 'toys_games_sports', name: 'Toys/Games/Sports', selected: savedArray?.includes('toys_games_sports') || false },
  { id: 'phone_computer', name: 'Phone/Computer', selected: savedArray?.includes('phone_computer') || false },
  { id: 'internet', name: 'Internet', selected: savedArray?.includes('internet') || false },
  { id: 'public_broadcast_system', name: 'Public Broadcast System', selected: savedArray?.includes('public_broadcast_system') || false },
  { id: 'resources_for_cwsn', name: 'Resources for CWSN', selected: savedArray?.includes('resources_for_cwsn') || false },
];

export const transformSavedDataToDomainData = (savedData: any[]): any[] => {

  return savedData?.map((savedDomain) => {
    if (!savedDomain?.domainId) return null;

    const domainId = savedDomain.domainId.toString();

    const selectedGoalIds: string[] = [];
    const selectedCompetencyIds: string[] = [];

    savedDomain.goals?.forEach((goal: any) => {
      if (goal.competencies && goal.competencies.length > 0) {
        selectedGoalIds.push(goal.goalId.toString());
        goal.competencies.forEach((comp: any) => {
          selectedCompetencyIds.push(comp.competencyId.toString());
        });
      }
    });

    const activitiesInfo = savedDomain.activities?.map((activity: any) => ({
      activityId: activity.activityId?.toString() || activity.id?.toString(),
      title: activity.title || activity.name || `Activity ${activity.activityId || activity.id}`,
      questions: activity.activityQuestions || activity.questions || [],
      assessmentRubric: activity.assessmentRubric || {}
    })) || [];

    const activities = (savedDomain.activities || [])
      .filter((act: any) => {
        return act.activityId ||
          (act.activityQuestions && act.activityQuestions.length > 0) ||
          act.rubicAwarenessStatus ||
          act.teacherObservationalNotes;
      })
      .map((act: any) => ({
        activityId: act.activityId?.toString() || "",

        questions: (act.activityQuestions && act.activityQuestions.length > 0)
          ? act.activityQuestions.map((q: any) => ({
            id: +generateUniqueNumber(),
            question: q.question || "",
            answer: q.answer || ""
          }))
          : [{ id: +generateUniqueNumber(), question: "", answer: "" }],

        assessmentRubric: {
          awareness: {
            level: (act.rubicAwarenessStatus?.toLowerCase() || 'stream') as 'stream' | 'mountain' | 'sky',
            notes: act.rubicAwarenessFeedback || ""
          },
          sensitivity: {
            level: (act.rubicSensitivityStatus?.toLowerCase() || 'stream') as 'stream' | 'mountain' | 'sky',
            notes: act.rubicSensitivityFeedback || ""
          },
          creativity: {
            level: (act.rubicCreativityStatus?.toLowerCase() || 'stream') as 'stream' | 'mountain' | 'sky',
            notes: act.rubicCreativityFeedback || ""
          }
        },

        teacherFeedback: {
          proficiencyLevel: (act.teacherFeedBackStatus?.toLowerCase() || 'stream') as 'stream' | 'mountain' | 'sky',
          notes: act.teacherObservationalNotes || ""
        },

        selfAssessment: {
          likedWork: act.selfAssessment?.likeDoingThisWork || 'dont_know',
          foundEasy: act.selfAssessment?.foundThisWorkEasy || 'dont_know',
          neededHelp: act.selfAssessment?.neededResources || []
        },

        peerAssessment: {
          likedWork: act.peerAssessment?.likeDoingThisWork || 'dont_know',
          foundEasy: act.peerAssessment?.foundThisWorkEasy || 'dont_know',
          neededHelp: act.peerAssessment?.neededResources || []
        },

        parentObservation: {
          homeResources: buildHomeResources(
            Array.isArray(act.parentObservation) ? act.parentObservation : []
          ),
          notes: act.parentRemarks || "",
          parentOvservationOthers: act.parentObservationOther || ""
        }
      }));

    return {
      id: savedDomain.domainId,
      name: savedDomain.domainName,
      domainIndex: savedDomain.domainIndex,
      studentDomainId: savedDomain.activities?.find((a: any) => a.studentDomainId)?.studentDomainId || undefined,
      curriculumGoals: savedDomain.goals?.map((goal: any) => ({
        id: goal.goalId.toString(),
        title: goal.goalName,
        goalIndex: goal.goalIndex,
        selected: selectedGoalIds.includes(goal.goalId.toString())
      })) || [],
      competencies: savedDomain.goals?.flatMap((goal: any) =>
        goal.competencies?.map((comp: any) => ({
          id: comp.competencyId.toString(),
          goalId: goal.goalId.toString(),
          title: comp.competencyName,
          competencyIndex: comp.competencyIndex,
          selected: selectedCompetencyIds.includes(comp.competencyId.toString())
        })) || []
      ) || [],
      assessmentActivity: {
        description: activitiesInfo, 
        activityId: "",
        questions: []
      },
      activities                     
    };
  }).filter(Boolean);            
};

export function transformToApiPayload(tabData: any[]) {
  if (!tabData) return [];

  return tabData?.map((domain) => {
    const selectedGoalIds = domain.curriculumGoals
      .filter((goal: any) => goal.selected)
      .map((goal: any) => parseInt(goal.id));

    const selectedCompetencyIds = domain.competencies
      .filter((comp: any) => comp.selected)
      .map((comp: any) => parseInt(comp.id));

    const activities = domain.activities?.map((activity: ActivityData) => {
      const validQuestions = activity.questions?.filter(
        (q) => q.question || q.answer
      ) || [];

      const activityQuestions = validQuestions.length > 0
        ? validQuestions.map((q, index) => ({
          question: q.question || "",
          questionOrderNum: index + 1,
          answer: q.answer || "",
        }))
        : [];

      const selectedResources = activity.parentObservation.homeResources
        .filter((resource) => resource.selected)
        .map((resource) => resource.id);

      return {
        activityId: activity.activityId ? parseInt(activity.activityId) : null,
        activityQuestions: activityQuestions,
        rubicAwarenessStatus: activity.assessmentRubric.awareness.level.toUpperCase(),
        rubicAwarenessFeedback: activity.assessmentRubric.awareness.notes,
        rubicSensitivityStatus: activity.assessmentRubric.sensitivity.level.toUpperCase(),
        rubicSensitivityFeedback: activity.assessmentRubric.sensitivity.notes,
        rubicCreativityStatus: activity.assessmentRubric.creativity.level.toUpperCase(),
        rubicCreativityFeedback: activity.assessmentRubric.creativity.notes,
        teacherFeedBackStatus: activity.teacherFeedback.proficiencyLevel.toUpperCase(),
        teacherObservationalNotes: activity.teacherFeedback.notes,
        selfAssessment: {
          likeDoingThisWork: activity.selfAssessment.likedWork,
          foundThisWorkEasy: activity.selfAssessment.foundEasy,
          neededResources: activity.selfAssessment.neededHelp,
        },
        peerAssessment: {
          likeDoingThisWork: activity.peerAssessment.likedWork,
          foundThisWorkEasy: activity.peerAssessment.foundEasy,
          neededResources: activity.peerAssessment.neededHelp,
        },
        parentObservation: selectedResources,
        parentObservationOther: activity.parentObservation.parentOvservationOthers,
        parentRemarks: activity.parentObservation.notes,
      };
    }) || [];

    const payload: any = {
      domainId: domain.id,
      curriculumGoalIds: selectedGoalIds,
      competencyIds: selectedCompetencyIds,
      activities: activities
    };

    if (domain.studentDomainId) {
      payload.id = domain.studentDomainId;
    }

    return payload;
  });
}
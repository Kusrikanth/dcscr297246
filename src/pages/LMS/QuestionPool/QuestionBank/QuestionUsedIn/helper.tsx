import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, ChartHistogramIcon, Folder02Icon, InternetAntenna02Icon, LanguageSkillIcon, Search01Icon, StarIcon, Tag01Icon, Target01Icon, TimeQuarter02Icon } from "@hugeicons-pro/core-stroke-standard";
import { IOptionsHrtl, MoreActions } from "../../../../../Components/Common/MenuOptions";
import { StatusLabel } from "../../../../../Components/Common";

export function generateUsedInColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Used In",
      accessor: "usedIn",
    },
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Assigned To",
      accessor: "assignedTo",
    },
    {
      Header: "Date",
      accessor: "date",
    },
  ];
}
export function usedInTableData() {
  return [
    {
      usedIn: "Unit Test 1",
      type: "Test Paper",
      assignedTo: "Class IX – A",
      date: "10 Jul 2025",
      scoreTracked: true,
      viewLabel: "View Results",
    },
    {
      usedIn: "Periodic Assignment",
      type: "Practice Set",
      assignedTo: "Class VIII – B",
      date: "25 Jun 2025",
      scoreTracked: false,
      viewLabel: "View",
    },
    {
      usedIn: "Term 1 Exam",
      type: "Summative Exam",
      assignedTo: "Grade X (All Sec.)",
      date: "10 Apr 2025",
      scoreTracked: true,
      viewLabel: "View Insights",
    },
  ];
}


export const searchInputOptions = [
  { id: 'global', name: 'Global Search' },
  { id: 'questionNo', name: 'Question ID' },
  { id: 'question', name: 'Question' },
  { id: 'type', name: 'Type' },
  { id: 'difficulty	', name: 'Difficulty' },
  { id: 'tags', name: 'Tags' },
]

export const SubjectsOptions = [
  { id: 'physics', name: 'Physics' },
  { id: 'chemistry', name: 'Chemistry' },
  { id: 'mathematics', name: 'Mathematics' },
  { id: 'biology', name: 'Biology' },
  { id: 'english', name: 'English' },
  { id: 'history', name: 'History' },
  { id: 'geography', name: 'Geography' },
  { id: 'computerScience', name: 'Computer Science' },
]

export const ChapterOptions = [
  { id: "gravitation", name: "Gravitation" },
  { id: "lawsOfMotion", name: "Laws of Motion" },
  { id: "atoms", name: "Structure of Atoms" },
  { id: "electricity", name: "Electricity" },
  { id: "light", name: "Light – Reflection and Refraction" },
];

export const QuestionTypeOptions = [
  { id: "mcq", name: "MCQ" },
  { id: "descriptive", name: "Descriptive" },
  { id: "trueFalse", name: "True/False" },
  { id: "matchPair", name: "Match the Following" },
  { id: "fillBlank", name: "Fill in the Blanks" },
];

export const DifficultyOptions = [
  { id: "easy", name: "Easy" },
  { id: "medium", name: "Medium" },
  { id: "hard", name: "Hard" },
];

export const BloomOptions = [
  { id: "remember", name: "Remember" },
  { id: "understand", name: "Understand" },
  { id: "apply", name: "Apply" },
  { id: "analyze", name: "Analyze" },
  { id: "evaluate", name: "Evaluate" },
  { id: "create", name: "Create" },
];

export const StatusOptions = [
  { id: "published", name: "Published" },
  { id: "draft", name: "Draft" },
  { id: "archived", name: "Archived" },
];

export const ignoredKeys = ["searchString", "academicYearId", "curriculumId", "classId"];
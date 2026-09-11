import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, ChartHistogramIcon, LanguageSkillIcon, Search01Icon, StarIcon, Tag01Icon, Target01Icon, TimeQuarter02Icon } from "@hugeicons-pro/core-stroke-standard";
import { IOptionsHrtl, MoreActions } from "../../../../../Components/Common/MenuOptions";
import { StatusLabelWithStepper } from "./StatusLabelWithStepper";
import { MathPreview } from "../../../../../Components/Common";
import { getDateWithTimeFormat } from "../../../../../utility/dateutility";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Q ID#",
      accessor: "questionId",
      disableSortBy: true,
      columnClassName: "sticky-left fs-13",
    },
    // {
    //   Header: "Question Title",
    //   accessor: "questionTitle",
    //   disableSortBy: true,
    //   columnClassName: "w-200px min-w-200px max-w-200px fs-13",
    // },
    // {
    //   Header: "Question Description",
    //   accessor: "questionDescription",
    //   disableSortBy: true,
    //   columnClassName: "w-200px min-w-200px max-w-200px fs-13",



    // },
    {
  Header: "Question Description",
  accessor: "questionDescription",
  disableSortBy: true,
  columnClassName: "w-500px min-w-500px max-w-500px fs-13 ",
  Cell: ({ value }: any) => {
    if (!value) return "";
    return <MathPreview json={JSON.parse(value)} />
  },
},
    {
      Header: "Question Type",
      accessor: "questionTypeName",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px fs-13",
    },
    // {
    //   Header: (
    //     <>
    //       <HugeiconsIcon icon={Book02Icon} size={16} className="text-light me-1" />
    //       Chapter
    //     </>
    //   ),
    //   columnClassName: "w-150px min-w-150px max-w-150px fs-13",
    //   accessor: "chapter",
    //   disableSortBy: true,
    // },
    // {
    //   Header: "Type",
    //   accessor: "type",
    //   disableSortBy: true,
    //   columnClassName: "w-150px min-w-150px max-w-150px fs-13",
    // },
    {
      Header: "Difficulty",
      accessor: "difficulty",
      disableSortBy: true,
      columnClassName: "fs-13",
      Cell: ({row: {original}}: any) => {
        let color = "#28a745"; // Easy = green
      

        return (
          <span className="d-inline-flex align-items-center bg-light text-dark rounded-pill px-2 py-1">
            <span
              className="rounded-circle me-2"
              style={{ width: "10px", height: "10px", backgroundColor: color }}
            ></span>
            {original.difficultyLevelName}
          </span>
        );
      },
    },
    // {
    //   Header: "Created By",
    //   accessor: "createdBy",
    //   disableSortBy: true,
    //   columnClassName: "fs-13",
    // },
    {
      Header: "Date Added",
      accessor: "createdDate",
      disableSortBy: true,
      columnClassName: "w-150px min-w-150px max-w-150px fs-13",
      Cell: ({row: {original}}: any) => {
        return (
          getDateWithTimeFormat(original?.createdDate ? `${original?.createdDate}Z` : '')
        )
      }
    },
    {
      Header: "Bloom’s Level",
      accessor: "bloomTaxonomyNames",
      disableSortBy: true,
      columnClassName: "fs-13",
      Cell:({row: {original}}: any) => {
        return (
          original.bloomTaxonomyNames?.join(", ")
        )
      }
    },
    // {
    //   Header: "Used In",
    //   accessor: "usedAnswered",
    //   disableSortBy: true,
    //   columnClassName: "fs-13",
    // },
    {
      Header: (
        <>
          <HugeiconsIcon icon={Tag01Icon} size={16} className="text-light me-1" />
          Tags
        </>
      ),
      accessor: "tags",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px fs-13",
      Cell: ({row: {original}}: any) => (
        <div className="d-flex flex-wrap">
          {original.tags?.map((tag: any) => (
            <span className="badge badge-soft-primary me-1 mb-1">{tag}</span>
          ))}
        </div>
      ),
    },
    // {
    //   Header: "Status",
    //   accessor: "status",
    //   disableSortBy: true,
    //   Cell: ({ row }: any) => {
    //     const { original, index } = row;
    //     return (
    //       <StatusLabelWithStepper
    //         index={index}
    //         labelName={original.status}
    //         badgeClass={
    //           original.status === "Published"
    //             ? "badge-soft-success"
    //             : original.status === "Draft"
    //               ? "badge-soft-secondary"
    //               : "badge-soft-warning"
    //         }
    //         version="1.0"
    //         createdDate="2024-07-14"
    //         createdBy="System Admin"
    //         modifiedDate="2025-07-12"
    //         modifiedBy="Reviewer Team"
    //       />
    //     );
    //   },
    // },

    {
      Header: "Actions",
      thClass: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <MoreActions actionOptions={actionList} rowId={original.id} isHorizontal={true} />
      ),
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

export function questionTableData() {
  return [
    {
      id: 561,
      questionId: "QCMD000561",
      question: "What is gravity?",
      chapter: "Gravity",
      difficulty: "Easy",
      createdBy: "Admin",
      type: "MCQ",
      date: "06-06-2025",
      bloom: "Remember",
      marks: "90",
      language: "EN",
      usedAnswered: "5",
      tags: ["CBSE", "Physics"],
      status: "Published",
    },
    {
      id: 562,
      questionId: "QCMD000562",
      question: "Explain Newton's Second Law with an example.",
      chapter: "Laws of Motion",
      difficulty: "Medium",
      createdBy: "Teacher A",
      type: "Descriptive",
      date: "08-06-2025",
      bloom: "Understand",
      marks: "100",
      language: "EN",
      usedAnswered: "10",
      tags: ["ICSE", "Laws", "Mechanics"],
      status: "Draft",
    },
    {
      id: 563,
      questionId: "QCMD000563",
      question: "Which of the following is not a prime number?",
      chapter: "Number System",
      difficulty: "Hard",
      createdBy: "Teacher B",
      type: "MCQ",
      date: "06-02-2025",
      bloom: "Apply",
      marks: "60",
      language: "EN",
      usedAnswered: "3",
      tags: ["CBSE", "Numbers"],
      status: "Published",
    },
    {
      id: 564,
      questionId: "QCMD000564",
      question: "Define inertia with real-life examples.",
      chapter: "Laws of Motion",
      difficulty: "Easy",
      createdBy: "Teacher C",
      type: "Short Answer",
      date: "02-03-2025",
      bloom: "Understand",
      marks: "30",
      language: "EN",
      usedAnswered: "6",
      tags: ["CBSE", "Motion"],
      status: "Under Review",
    },
    {
      id: 565,
      questionId: "QCMD000565",
      question: "What is Ohm's law?",
      chapter: "Electricity",
      difficulty: "Medium",
      createdBy: "Teacher D",
      type: "MCQ",
      date: "12-04-2025",
      bloom: "Apply",
      marks: "40",
      language: "EN",
      usedAnswered: "7",
      tags: ["Electricity", "CBSE"],
      status: "Modified",
    },
    {
      id: 566,
      questionId: "QCMD000566",
      question: "Derive the formula for kinetic energy.",
      chapter: "Work, Power and Energy",
      difficulty: "Hard",
      createdBy: "Admin",
      type: "Long Answer",
      date: "20-04-2025",
      bloom: "Analyze",
      marks: "70",
      language: "EN",
      usedAnswered: "2",
      tags: ["Physics", "CBSE", "Energy"],
      status: "Published",
    },
    {
      id: 567,
      questionId: "QCMD000567",
      question: "What is a chemical reaction?",
      chapter: "Chemical Reactions",
      difficulty: "Easy",
      createdBy: "Teacher E",
      type: "MCQ",
      date: "10-05-2025",
      bloom: "Remember",
      marks: "50",
      language: "EN",
      usedAnswered: "9",
      tags: ["Chemistry", "CBSE"],
      status: "Published",
    },
    {
      id: 568,
      questionId: "QCMD000568",
      question: "State and explain the laws of reflection.",
      chapter: "Light",
      difficulty: "Medium",
      createdBy: "Teacher F",
      type: "Short Answer",
      date: "14-05-2025",
      bloom: "Understand",
      marks: "35",
      language: "EN",
      usedAnswered: "4",
      tags: ["Physics", "Reflection"],
      status: "Published",
    },
    {
      id: 569,
      questionId: "QCMD000569",
      question: "Prove that √2 is an irrational number.",
      chapter: "Real Numbers",
      difficulty: "Hard",
      createdBy: "Teacher G",
      type: "Descriptive",
      date: "15-05-2025",
      bloom: "Analyze",
      marks: "80",
      language: "EN",
      usedAnswered: "1",
      tags: ["Mathematics", "Numbers"],
      status: "Draft",
    },
    {
      id: 570,
      questionId: "QCMD000570",
      question: "What is a neutralization reaction?",
      chapter: "Acids, Bases and Salts",
      difficulty: "Medium",
      createdBy: "Teacher H",
      type: "MCQ",
      date: "30-05-2025",
      bloom: "Understand",
      marks: "45",
      language: "EN",
      usedAnswered: "5",
      tags: ["Chemistry", "ICSE"],
      status: "Published",
    },
  ];
}


export const ignoredKeys = ["searchString", "curriculumId"];
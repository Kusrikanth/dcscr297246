import { HugeiconsIcon } from "@hugeicons/react";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../../Components/Common/MenuOptions";
import File from "../../../../../assets/imagesdps/common_icon/folder.svg";
import Book from "../../../../../assets/imagesdps/common_icon/book.svg";
import { StatusLabel } from "../../../../../Components/Common";
import { Book02Icon, Tag01Icon } from "@hugeicons-pro/core-stroke-standard";
import { StatusLabelWithStepper } from "../QuestionBankUpload/StatusLabelWithStepper";
import { getDateWithTimeFormat } from "../../../../../utility/dateutility";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Pool Name",
      accessor: "poolName",
      columnClassName: "w-300px min-w-300px max-w-300px fs-13",
      // Cell: ({ row, value }: any) => (
      //   <div className="d-flex align-items-center">
      //     {!row.original.isSubPool && (
      //       <img
      //         src={Book}
      //         className="img-fluid me-2"
      //         style={{ width: "20px", height: "20px" }}
      //         alt="Book"
      //       />
      //     )}
      //     {row.original.isSubPool && (
      //       <img
      //         src={File}
      //         className="img-fluid me-2"
      //         style={{ width: "20px", height: "20px" }}
      //         alt="Folder"
      //       />
      //     )}
      //     <span>{value}</span>
      //   </div>
      // ),
      // Cell: ({ row : { original } }: any) => (
      //   <div className="d-flex align-items-center">
      //     {!original.isSubPool && (
      //       <HugeiconsIcon icon={Book02Icon} size={16} className="text-light me-1" />
      //     )}
      //     {original.isSubPool && (
      //       <HugeiconsIcon icon={Tag01Icon} size={16} className="text-light me-1" />
      //     )}
      //     <span>{original.poolName}</span>
      //   </div>
      // )
    },
    // {
    //       Header: "Type",
    //       accessor: "type",
    //       disableSortBy: true,
    //       Cell: ({ row: { original } }: any) => {
    //         return (
    //           <StatusLabel
    //             type={original.type}
    //             labelName={original.type}
    //           />
    //         );
    //       },
    //     },
    {
      Header: "Description",
      accessor: "description",
      columnClassName: "w-120px fs-13",
    },
    {
      Header: "Subject",
      accessor: "subjectName",
      columnClassName: "w-120px fs-13",
    },
    {
      Header: "Class Name",
      accessor: "className",
      columnClassName: "w-120px fs-13 text-center",
    },
    {
      Header: "Pool Type",
      accessor: "poolType",
      columnClassName: "w-200px min-w-200px max-w-200px fs-13",
      Cell: ({ value }: any) => (
        <div className="d-flex align-items-center">
          <img
            src={File}
            className="img-fluid me-2"
            style={{ width: "20px", height: "20px" }}
            alt="Folder"
          />
          <span>{questionsPoolTypes.find((item) => item.poolId === value)?.poolName || value}</span>
        </div>
      ),
    },
    {
      Header: "Questions",
      accessor: "totalQuestionsCount",
      columnClassName: "w-100px text-center fs-13",
    },
    {
      Header: "Status",
      accessor: "difficultyLevelCounts",
      disableSortBy: true,
      columnClassName: "fs-13",
      Cell: ({ value }: { value: { [key: string]: number } }) => {
        const counts = value || {};
        const mediumCount = counts.Medium ?? 0;
        const easyCount = counts.Easy ?? 0;
        const hardCount = counts.Hard ?? 0;

        const colors = {
          Medium: "#40538B",
          Easy: "#02A1A0",
          Hard: "#FD6C42",
        };

        return (
          <div className="d-flex align-items-center gap-3">
            <span className="d-inline-flex align-items-center">
              <span
                className="rounded-circle me-2"
                style={{ width: "10px", height: "10px", backgroundColor: colors.Medium }}
              ></span>
              Medium: {mediumCount}
            </span>
            <span className="d-inline-flex align-items-center">
              <span
                className="rounded-circle me-2"
                style={{ width: "10px", height: "10px", backgroundColor: colors.Easy }}
              ></span>
              Easy: {easyCount}
            </span>
            <span className="d-inline-flex align-items-center">
              <span
                className="rounded-circle me-2"
                style={{ width: "10px", height: "10px", backgroundColor: colors.Hard }}
              ></span>
              Hard: {hardCount}
            </span>
          </div>
        );
      },
    },
    // {
    //   Header: "Used In",
    //   accessor: "usedIn",
    //   columnClassName: "w-100px text-center fs-13",
    //   Cell: ({ row: { original } }: { row: { original: any } }) => {
    //     return (
    //       <div
    //         className="text-info cursor-pointer text-decoration-underline"
    //         onClick={() => openUsedInModal(original)}
    //       >
    //         {original.usedIn}
    //       </div>
    //     );
    //   },
    // },
    // {
    //   Header: "Status",
    //   accessor: "result",
    //   disableSortBy: true,
    //   columnClassName: "w-400px min-w-400px max-w-400px",
    //   // Cell: ({ value }: { value: { total: number; approved: number; rejected: number } }) => (
    //   //   <div className="d-flex flex-wrap align-items-center gap-2">
    //   //     <span className="d-inline-flex align-items-center me-3" style={{ width: "20%" }}>
    //   //       <span
    //   //         className="rounded-circle bg-primary me-1"
    //   //         style={{ width: "10px", height: "10px", display: "inline-block" }}
    //   //       ></span>
    //   //       Total: {value.total}
    //   //     </span>
    //   //     <span className="d-inline-flex align-items-center me-3" style={{ width: "25%" }}>
    //   //       <span
    //   //         className="rounded-circle bg-success me-1"
    //   //         style={{ width: "10px", height: "10px", display: "inline-block" }}
    //   //       ></span>
    //   //       Approved: {value.approved}
    //   //     </span>
    //   //     <span className="d-inline-flex align-items-center" style={{ width: "25%" }}>
    //   //       <span
    //   //         className="rounded-circle bg-danger me-1"
    //   //         style={{ width: "10px", height: "10px", display: "inline-block" }}
    //   //       ></span>
    //   //       Rejected: {value.rejected}
    //   //     </span>
    //   //   </div>
    //   // ),
    // },
    {
      Header: "Created By",
      accessor: "createdUserName",
      columnClassName: "w-150px fs-13",
    },
    // {
    //   Header: "Assigned To",
    //   accessor: "assignedTo",
    //   columnClassName: "w-180px fs-13",
    // },
    {
      Header: "Last Modified",
      accessor: "modifiedAt",
      columnClassName: "w-140px fs-13",
      Cell: ({ row: { original } }: any) => {

        return <span>{original.modifiedAt && getDateWithTimeFormat(original.modifiedAt)}</span>;
      },
    },
    {
      Header: "Actions",
      accessor: "actions",
      disableSortBy: true,
      columnClassName: "w-100px text-center fs-13",
      Cell: ({ row: { original } }: any) => (
        <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
      ),
    },
  ];
}


export function generateViewColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Q ID#",
      accessor: "questionId",
      disableSortBy: true,
      columnClassName: "sticky-left fs-13",
    },
    {
      Header: "Question",
      accessor: "question",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px fs-13",
    },
    {
      Header: (
        <>
          <HugeiconsIcon icon={Book02Icon} size={16} className="text-light me-1" />
          Chapter
        </>
      ),
      columnClassName: "w-150px min-w-150px max-w-150px fs-13",
      accessor: "chapter",
      disableSortBy: true,
    },
    {
      Header: "Type",
      accessor: "type",
      disableSortBy: true,
      columnClassName: "w-150px min-w-150px max-w-150px fs-13",
    },
    {
      Header: "Difficulty",
      accessor: "difficulty",
      disableSortBy: true,
      columnClassName: "fs-13",
      Cell: ({ value }: { value: string }) => {
        let color = "#28a745"; // Easy = green
        if (value === "Medium") color = "#fd7e14"; // orange
        else if (value === "Hard") color = "#dc3545"; // red

        return (
          <span className="d-inline-flex align-items-center bg-light text-dark rounded-pill px-2 py-1">
            <span
              className="rounded-circle me-2"
              style={{ width: "10px", height: "10px", backgroundColor: color }}
            ></span>
            {value}
          </span>
        );
      },
    },
    {
      Header: "Created By",
      accessor: "createdBy",
      disableSortBy: true,
      columnClassName: "fs-13",
    },
    {
      Header: "Date Added",
      accessor: "date",
      disableSortBy: true,
      columnClassName: "w-100px min-w-100px max-w-100px fs-13",
    },
    {
      Header: "Bloom’s Level",
      accessor: "bloom",
      disableSortBy: true,
      columnClassName: "fs-13",
    },
    {
      Header: "Used In",
      accessor: "usedAnswered",
      disableSortBy: true,
      columnClassName: "fs-13",
    },
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
      Cell: ({ value }: { value: string[] }) => (
        <div className="d-flex flex-wrap">
          {value.map((tag, index) => (
            <span
              key={index}
              className="badge text-uppercase bg-light text-dark fw-normal p-2 me-1 mb-2"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        const { original, index } = row;
        return (
          <StatusLabelWithStepper
            index={index}
            labelName={original.status}
            badgeClass={
              original.status === "Published"
                ? "badge-soft-success"
                : original.status === "Draft"
                  ? "badge-soft-secondary"
                  : "badge-soft-warning"
            }
            version="1.0"
            createdDate="2024-07-14"
            createdBy="System Admin"
            modifiedDate="2025-07-12"
            modifiedBy="Reviewer Team"
          />
        );
      },
    },

    {
      Header: "Actions",
      thClass: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
      ),
    },
  ];
}

export const questionsPoolTypes = [
  {
    poolId: "assessmentPool",
    poolName: "Assessment Pool",
  },
  {
    poolId: "quizPool",
    poolName: "Quiz Pool",
  },
  {
    poolId: "practicePool",
    poolName: "Practice Pool",
  },
  {
    poolId: "examPrePool",
    poolName: "Exam Prep Pool",
  }
]

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
export const poolData = [
  {
    poolName: "Algebra Mastery Pool",
    subject: "Mathematics",
    class: "Grade 9",
    poolType: "Assessment Pool",
    totalQuestions: 45,
    difficultyMix: "Easy 40% / Medium 40% / Hard 20%",
    createdBy: "Mr. Sharma",
    assignedTo: "9A, 9B",
    lastUpdated: "21-Jul-25",
    usedIn: "2",
    result: { medium: 25, easy: 15, hard: 10 },
  },
  {
    poolName: "Weekly Science Quiz",
    subject: "Science",
    class: "Grade 8",
    poolType: "Quiz Pool",
    totalQuestions: 30,
    difficultyMix: "Easy 50% / Medium 40% / Hard 10%",
    createdBy: "Ms. Verma",
    assignedTo: "8A, 8B",
    lastUpdated: "20-Jul-25",
    usedIn: "1",
    result: { medium: 25, easy: 15, hard: 10 },
  },
  {
    poolName: "Grammar Proficiency Quiz",
    subject: "English",
    class: "Grade 7",
    poolType: "Practice Pool",
    totalQuestions: 25,
    difficultyMix: "Easy 60% / Medium 30% / Hard 10%",
    createdBy: "Mr. Nair",
    assignedTo: "7A, 7B",
    lastUpdated: "18-Jul-25",
    usedIn: "3",
    result: { medium: 10, easy: 10, hard: 0 },
  },
  {
    poolName: "Civics Core Concepts Pool",
    subject: "Social Science",
    class: "Grade 10",
    poolType: "Assignment Pool",
    totalQuestions: 35,
    difficultyMix: "Easy 30% / Medium 50% / Hard 20%",
    createdBy: "Mrs. Roy",
    assignedTo: "10A",
    lastUpdated: "17-Jul-25",
    usedIn: "3",
    result: { medium: 8, easy: 5, hard: 3 },
  },
  {
    poolName: "NTSE Mathematics Practice",
    subject: "Mathematics",
    class: "Grade 10",
    poolType: "Exam Prep Pool",
    totalQuestions: 60,
    difficultyMix: "Easy 20% / Medium 50% / Hard 30%",
    createdBy: "Mr. Sharma",
    assignedTo: "10A, 10B",
    lastUpdated: "15-Jul-25",
    usedIn: "1",
    result: { medium: 30, easy: 20, hard: 10 },
  },
  {
    poolName: "Plant Life Quiz",
    subject: "EVS",
    class: "Grade 5",
    poolType: "Quiz Pool",
    totalQuestions: 20,
    difficultyMix: "Easy 70% / Medium 20% / Hard 10%",
    createdBy: "Ms. Das",
    assignedTo: "5A, 5B",
    lastUpdated: "12-Jul-25",
    usedIn: "2",
    result: { medium: 12, easy: 10, hard: 2 },
  },
  {
    poolName: "Coding Logic Quiz",
    subject: "Computer Science",
    class: "Grade 9",
    poolType: "Quiz Pool",
    totalQuestions: 15,
    difficultyMix: "Easy 40% / Medium 40% / Hard 20%",
    createdBy: "Mr. Nair",
    assignedTo: "9A, 9B",
    lastUpdated: "10-Jul-25",
    usedIn: "8",
    result: { medium: 9, easy: 6, hard: 3 },
  },
  {
    poolName: "Hindi Grammar Practice Pool",
    subject: "Hindi",
    class: "Grade 6",
    poolType: "Practice Pool",
    totalQuestions: 18,
    difficultyMix: "Easy 50% / Medium 30% / Hard 20%",
    createdBy: "Mrs. Joshi",
    assignedTo: "6A, 6B",
    lastUpdated: "8-Jul-25",
    usedIn: "1",
    result: { medium: 20, easy: 18, hard: 2 },
  },
  {
    poolName: "Current Affairs Quiz 2025",
    subject: "General Knowledge",
    class: "Grades 8-10",
    poolType: "Quiz Pool",
    totalQuestions: 25,
    difficultyMix: "Easy 60% / Medium 30% / Hard 10%",
    createdBy: "Mr. Nair",
    assignedTo: "8A, 9B, 10A",
    lastUpdated: "5-Jul-25",
    usedIn: "1",
    result: { medium: 15, easy: 14, hard: 1 },
  },
];




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

export const RoleOptions = [
  { id: 'MODIFY', name: 'Modify' },
  { id: 'READ_ONLY', name: 'Read-Only' },

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
export const teacherListResp = [
  { id: 1, employeeCode: "EMP001", employeeName: "John Doe" },
  { id: 2, employeeCode: "EMP002", employeeName: "Jane Smith" },
  { id: 3, employeeCode: "EMP003", employeeName: "Alice Johnson" },
];


export const groupType = [
];
export function generateUsedInColumns() {
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
export const ignoredKeys = ["searchString", "curriculumId", "classId", "streamGroupId"];
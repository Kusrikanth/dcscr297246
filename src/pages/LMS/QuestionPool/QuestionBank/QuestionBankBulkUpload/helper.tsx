import { HugeiconsIcon } from "@hugeicons/react";
import { Book02Icon, ChartHistogramIcon, Folder02Icon, InternetAntenna02Icon, LanguageSkillIcon, Search01Icon, StarIcon, Tag01Icon, Target01Icon, TimeQuarter02Icon } from "@hugeicons-pro/core-stroke-standard";
import { IOptionsHrtl, MoreActions } from "../../../../../Components/Common/MenuOptions";
import { StatusLabel } from "../../../../../Components/Common";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: (
        <>
          <HugeiconsIcon icon={Folder02Icon} size={16} className="text-light me-1" />
          File Name
        </>
      ),
      accessor: "fileName",
      disableSortBy: true,
      Cell: ({ value }: { value: string }) => (
    <a
      href={`/uploads/${value}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-decoration-underline text-primary"
    >
      {value}
    </a>
  ),
    },
    {
      Header: "Class",
      accessor: "class",
      disableSortBy: true,
    },
    {
      Header: "Subject",
      accessor: "subject",
      disableSortBy: true,
    },
    {
      Header: "Template Type",
      accessor: "templateType",
      disableSortBy: true,
    },
    {
      Header: "Uploaded By",
      accessor: "uploadedBy",
      disableSortBy: true,
    },
    {
      Header: "Uploaded Date",
      accessor: "uploadedDate",
      disableSortBy: true,
    },
    {
       Header: (
        <>
          <HugeiconsIcon icon={InternetAntenna02Icon} size={16} className="text-light me-1" />
          IP Address
        </>
      ),
      accessor: "ipAddress",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.status}
            labelName={original.status}
          />
        );
      },
    },
    {
  Header: "Result",
  accessor: "result",
  disableSortBy: true,
      columnClassName: "w-400px min-w-400px max-w-400px",
  Cell: ({ value }: { value: { total: number; accepted: number; error: number } }) => (
    <div className="d-flex flex-wrap align-items-center gap-2">
      <span className="d-inline-flex align-items-center me-3">
        <span
          className="rounded-circle bg-primary me-1"
          style={{ width: "10px", height: "10px", display: "inline-block" }}
        ></span>
        Total: {value.total}
      </span>

      <span className="d-inline-flex align-items-center me-3">
        <span
          className="rounded-circle bg-success me-1"
          style={{ width: "10px", height: "10px", display: "inline-block" }}
        ></span>
        Accepted: {value.accepted}
      </span>

      <span className="d-inline-flex align-items-center">
        <span
          className="rounded-circle bg-danger me-1"
          style={{ width: "10px", height: "10px", display: "inline-block" }}
        ></span>
        Error: {value.error}
      </span>
    </div>
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
      fileName: "Term1_Class10_Sci.xlsx",
      class: "10",
      subject: "Science",
      templateType: "Standard Template",
      uploadedBy: "Ramesh Kumar",
      uploadedDate: "01 Jul 2025, 10:25 AM",
      ipAddress: "192.168.1.5",
      status: "Success",
      result: { total: 88, accepted: 44, error: 44 },
    },
    {
      fileName: "HalfYearly_9_Maths.xls",
      class: "9",
      subject: "Maths",
      templateType: "Custom Template",
      uploadedBy: "Anita Verma",
      uploadedDate: "01 Jul 2025, 09:55 AM",
      ipAddress: "192.168.1.21",
      status: "Failed",
      result: { total: 88, accepted: 44, error: 44 },
    },
    {
      fileName: "Class8_English_T1.csv",
      class: "8",
      subject: "English",
      templateType: "Standard Template",
      uploadedBy: "Alok Sinha",
      uploadedDate: "30 Jun 2025, 04:10 PM",
      ipAddress: "192.168.1.15",
      status: "Partial",
      result: { total: 88, accepted: 88, error: 0 },
    },
    {
      fileName: "Q1_Geography_11.xlsx",
      class: "11",
      subject: "Geography",
      templateType: "Standard Template",
      uploadedBy: "Admin",
      uploadedDate: "29 Jun 2025, 03:00 PM",
      ipAddress: "10.0.0.12",
      status: "Success",
      result: { total: 88, accepted: 88, error: 0 },
    },
    {
      fileName: "Class7_Hindi_Term2.csv",
      class: "7",
      subject: "Hindi",
      templateType: "Custom Template",
      uploadedBy: "Neha Mehra",
      uploadedDate: "28 Jun 2025, 11:45 AM",
      ipAddress: "172.16.0.45",
      status: "Processing",
      result: { total: 88, accepted: 44, error: 44 },
    },
  ];
}



export const ignoredKeys = ["searchString", "academicYearId", "curriculumId", "classId"];
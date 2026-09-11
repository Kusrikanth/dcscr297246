import { StatusLabel, UserDetails } from "../../../../../Components/Common";

export const assessmentReviewData = {
  basicDetails: {
    name: "Unit Test Algebra",
    code: "00039",
    mode: "Online: Formative",
    curriculum: "CBSE Class VII Subject: Mathematics",
    topics: "-",
    skillTags: "-",
  },
  questions: {
    totalQuestions: 30,
    totalMarks: 50,
    types: "MCQ (Single Choice)",
    shuffle: "Enabled",
    negativeMarking: "No",
  },
  schedule: {
    start: "20-08-2025, 10:30 AM",
    end: "20-08-2025, 11:15 AM",
    gracePeriod: "10 minutes",
  },
   notifications: [
    { id: 'n1', label: "Added to exam", status: "ON" },
    { id: 'n2', label: "Starting soon", status: "ON" },
    { id: 'n3', label: "Results ready", status: "ON" },
    { id: 'n4', label: "Missed exam", status: "ON" },
    { id: 'n5', label: "Ongoing reminder", status: "ON" },
  ],
  assignments: {
    assignedTo: "VI-A, VI-B",
    studentsAssigned: 120,
    status: "READY",
  },
  rulesAndSecurity: {
    fullscreenMode: "On",
    noExtraScreens: "On",
    noDevConsole: "On",
    cursorLock: "On",
    sessionSwitch: "Off",
    cameraCapture: "On",
  },
  resultSettings: {
    publishes: "Manually on 21-08-2025, 10:00 AM",
    showCorrectAnswers: "OFF",
  },
  gradeBands: [
    { grade: "A", range: "90-100" },
    { grade: "B", range: "75-89" },
    { grade: "C", range: "50-74" },
  ],
};

export function generateColumns() {
  return [
    {
      Header: "S.No",
      accessor: "sNo",
      disableSortBy: true,
    },
    {
      Header: "Question",
      accessor: "question",
      disableSortBy: true,
      columnClassName: "w-300px min-w-300px max-w-300px",
    },
    {
      Header: "Difficulty",
      accessor: "difficulty",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.difficulty}
            labelName={original.difficulty}
          />
        );
      },
    },
    {
      Header: "Type",
      accessor: "type",
      disableSortBy: true,
    },
    {
      Header: "Marks",
      accessor: "marks",
      disableSortBy: true,
    },
  ];
}

export function generateColumnsAssignStudent() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              showAvatar
              imageUrl={original.studentImageBase64}
              displayName={original.studentName}
              displayId={original.studentCode}
              size="xs"
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.className}
              displayId={original?.curriculumName}
              showAvatar={false}
            />
          </>
        );
      },
    },
    
    {
      Header: "Roll No.",
      accessor: "rNo",
      disableSortBy: true,
    },
    {
      Header: "Phone No.",
      accessor: "pNo",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortby: true,
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
      Header: "Assigned On",
      accessor: "assignedOn",
      disableSortBy: true,
      columnClassName: "w-100px min-w-100px max-w-100px",
    },
  ];
}

export function generateColumnsgradesDistributionTableData() {
  return [
    {
      Header: "Tittle",
      accessor: "title",
      disableSortBy: true,
    },
    {
      Header: "Between Marks",
      accessor: "btwnMarks",
      disableSortBy: true,
    },
    {
      Header: "Pass/Fail",
      accessor: "passFail",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.passFail}
            labelName={original.passFail}
          />
        );
      },
    },
  ];
}
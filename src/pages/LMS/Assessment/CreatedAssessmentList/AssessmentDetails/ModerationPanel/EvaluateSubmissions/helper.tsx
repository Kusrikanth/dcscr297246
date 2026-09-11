import {
  MoreActions,
  UserDetails,
} from "../../../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../../../Components/Common/MenuOptions";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.studentName}
            displayId={original.studentId}
            size="xs"
          />
        );
      },
    },
    {
      Header: "Attempted",
      accessor: "attempted",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Skipped",
      accessor: "skipped",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Auto Marks",
      accessor: "autoMarks",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Manual Marks",
      accessor: "manualMarks",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Submission Time",
      accessor: "submissionTime",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Total",
      accessor: "totalMarks",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
    },
    {
      Header: "Feedback",
      accessor: "feedback",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MoreActions
            actionOptions={actionList}
            rowId={original.id}
            isHorizontal
          />
        );
      },
    },
  ];
}

export const tableData = [
  {
    id: 1,
    studentName: "Anjali Kumar",
    studentId: "ST-001",
    attempted: "28/30",
    skipped: 2,
    autoMarks: "25/30",
    manualMarks: "20/20",
    submissionTime: "2025-08-10 14:32",
    totalMarks: "45/50",
    status: "Pending",
    feedback: "Draft given",
  },
  {
    id: 2,
    studentName: "Rohit Singh",
    studentId: "ST-002",
    attempted: "20/30",
    skipped: 10,
    autoMarks: "15/30",
    manualMarks: "—",
    submissionTime: "2025-08-11 09:15",
    totalMarks: "—",
    status: "Pending",
    feedback: "—",
  },
  {
    id: 3,
    studentName: "Priya Sharma",
    studentId: "ST-003",
    attempted: "30/30",
    skipped: 0,
    autoMarks: "30/30",
    manualMarks: "18/20",
    submissionTime: "2025-08-09 17:50",
    totalMarks: "48/50",
    status: "Approved",
    feedback: "Good work",
  },
];

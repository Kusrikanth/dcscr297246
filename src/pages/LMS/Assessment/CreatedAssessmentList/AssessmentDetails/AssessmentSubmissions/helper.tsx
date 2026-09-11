import {
  MenuOptionHrtl,
  MoreActions,
  StatusLabel,
  UserDetails,
} from "../../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../../Components/Common/MenuOptions";

const gradingStatusLabels = {
  notsubmitted: "danger",
  submitted: "available",
  inreview: "inprogress",
  graded: "success",
  pending: "warning",
};

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "sticky-left w-200px max-w-200px min-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.studentName}
            size="xs"
          ></UserDetails>
        );
      },
    },
    {
      Header: "Exam Start Time",
      accessor: "examStartTime",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const examDate = original.examStartTime;
        return (
          <UserDetails
            displayName={examDate.split(" ").slice(0, 3).join(" ")}
            displayId={examDate.split(" ").slice(3).join(" ")}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: "Student Start Time",
      accessor: "studentStartTime",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const examDate = original.studentStartTime;
        return (
          <UserDetails
            displayName={examDate.split(" ").slice(0, 3).join(" ")}
            displayId={examDate.split(" ").slice(3).join(" ")}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: "Submission Time",
      accessor: "submissionTime",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const examDate = original.submissionTime;
        return (
          <UserDetails
            displayName={examDate.split(" ").slice(0, 3).join(" ")}
            displayId={examDate.split(" ").slice(3).join(" ")}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: "End Time",
      accessor: "endTime",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const examDate = original.endTime;
        return (
          <UserDetails
            displayName={examDate.split(" ").slice(0, 3).join(" ")}
            displayId={examDate.split(" ").slice(3).join(" ")}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },

    {
      Header: "Score Obtained",
      accessor: "scoreObtained",
      disableSortBy: true,
    },
    {
      Header: "IP Address",
      accessor: "platformIp",
      disableSortBy: true,
    },
    {
      Header: "Browser Type",
      accessor: "browser",
      disableSortBy: true,
    },
    {
      Header: "Grading Status",
      accessor: "gradingStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        console.log(
          gradingStatusLabels[
            original.gradingStatus.toLowerCase().replace(/\s+/g, "")
          ]
        );
        return (
          <StatusLabel
            labelName={original.gradingStatus}
            type={
              gradingStatusLabels[
                original.gradingStatus.toLowerCase().replace(/\s+/g, "")
              ]
            }
          />
        );
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },
  ];
}

export const tableData = [
  {
    id: 1,
    studentName: "Anjali Kumar",
    examStartTime: "15 Aug 2025 09:00 AM",
    studentStartTime: "15 Aug 2025 09:05 AM",
    submissionTime: "15 Aug 2025 10:20 AM",
    endTime: "15 Aug 2025 10:25 AM",
    gradingStatus: "Graded",
    scoreObtained: "45 / 50",
    platformIp: "103.21.45.67",
    browser: "Chrome 115.0.5790.110",
  },
  {
    id: 2,
    studentName: "Rohit Singh",
    examStartTime: "15 Aug 2025 09:00 AM",
    studentStartTime: "15 Aug 2025 09:12 AM",
    submissionTime: "15 Aug 2025 10:45 AM",
    endTime: "—",
    gradingStatus: "Pending",
    scoreObtained: "—",
    platformIp: "192.168.1.101",
    browser: "Edge 116.0.1938.81",
  },
  {
    id: 3,
    studentName: "Priya Sharma",
    examStartTime: "15 Aug 2025 09:00 AM",
    studentStartTime: "—",
    submissionTime: "—",
    endTime: "—",
    gradingStatus: "Not Submitted",
    scoreObtained: "—",
    platformIp: "—",
    browser: "—",
  },
  {
    id: 4,
    studentName: "Amit Patel",
    examStartTime: "15 Aug 2025 09:00 AM",
    studentStartTime: "15 Aug 2025 09:00 AM",
    submissionTime: "15 Aug 2025 11:00 AM",
    endTime: "15 Aug 2025 11:10 AM",
    gradingStatus: "In Review",
    scoreObtained: "38 / 50",
    platformIp: "198.51.100.42",
    browser: "Mozilla Firefox 117.0",
  },
];

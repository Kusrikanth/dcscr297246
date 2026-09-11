import {
  MenuOptionHrtl,
  MoreActions,
  StatusLabel,
  UserDetails,
} from "../../../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../../../Components/Common/MenuOptions";

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
      Header: "Incident Type",
      accessor: "incidentType",
      disableSortBy: true,
    },
    {
      Header: "Details",
      accessor: "details",
      disableSortBy: true,
    },
    {
      Header: "Action Taken",
      accessor: "actionToken",
      disableSortBy: true,
    },
  ];
}

export const tableData = [
  {
    id: 1,
    studentName: "Anjali Kumar",
    examStartTime: "15 Aug 2025 09:00 AM",
    incidentType: "Unauthorized Tab Switch",
    details: "Switched away from assessment window 3 times within 5 minutes.",
    actionToken: "Warning issued, proctor monitoring closely"
  },
  {
    id: 2,
    studentName: "Rohit Singh",
    examStartTime: "15 Aug 2025 09:00 AM",
    incidentType: "Audio Detected",
    details: "Background conversation detected for over 30 seconds.",
    actionToken: "Muted audio; candidate advised to continue in a quiet room"
  },
  {
    id: 3,
    studentName: "Priya Sharma",
    examStartTime: "15 Aug 2025 09:00 AM",
    incidentType: "Face Not Detected",
    details: "Face was not visible to camera for 2 minutes.",
    actionToken: "Paused assessment until candidate reappeared"
  },
  {
    id: 4,
    studentName: "Amit Patel",
    examStartTime: "15 Aug 2025 09:00 AM",
    incidentType: "Multiple People Detected",
    details: "Two different faces detected by camera feed.",
    actionToken: "Assessment terminated; incident reported to admin"
  },
];


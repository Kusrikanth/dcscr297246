import { MenuOptionHrtl, StatusLabel, UserDetails, } from "../../../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../../../Components/Common/MenuOptions";

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
      Header: "Class",
      accessor: "class",
      disableSortBy: true,
      columnClassName: "w-100px min-w-100px max-w-100px text-wrap",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original.class}
              displayId={original.section}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Assessment Start Time",
      accessor: "assessmentStartTime",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const examDate = original.assessmentStartTime;
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
      Header: "Last Activity",
      accessor: "lastActivity",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const examDate = original.lastActivity;
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
      Header: "Questions Attempted",
      accessor: "questionsAttempted",
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
  Header: "Status",
  accessor: "gradingStatus",
  disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
  Cell: ({ row: { original } }: any) => {
    let badgeClass = "";
    let dotColor = "";

    switch (original?.gradingStatus) {
      case "Active":
        badgeClass = "badge-soft-primary";
        dotColor = "#3b82f6";
        break;
      case "Disconnected":
        badgeClass = "badge-soft-warning";
        dotColor = "#facc15";
        break;
      case "Completed":
        badgeClass = "badge-soft-success";
        dotColor = "#22c55e";
        break;
      default:
        badgeClass = "badge-soft-secondary";
        dotColor = "#9ca3af";
    }

    return (
      <span className={`badge text-uppercase ${badgeClass} p-2 d-flex align-items-center`} style={{width: "62%"}}>
        <span
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: dotColor,
            marginRight: "6px",
          }}
        ></span>
        {original?.gradingStatus}
      </span>
    );
  }
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
    curriculum: "IGCSE",
    class: "VII-A",
    assessmentStartTime: "15 Aug 2025 09:00 AM",
    lastActivity: "15 Aug 2025 10:20 AM",
    questionsAttempted: "28/30",
    gradingStatus: "Completed",
    platformIp: "103.21.45.67",
    browser: "Chrome 115.0.5790.110",
  },
  {
    id: 2,
    studentName: "Rohit Singh",
    curriculum: "IGCSE",
    class: "VII-A",
    assessmentStartTime: "15 Aug 2025 09:00 AM",
    lastActivity: "15 Aug 2025 09:45 AM",
    questionsAttempted: "15/30",
    gradingStatus: "Active",
    platformIp: "192.168.1.101",
    browser: "Edge 116.0.1938.81",
  },
  {
    id: 3,
    studentName: "Priya Sharma",
    curriculum: "IGCSE",
    class: "VII-A",
    assessmentStartTime: "15 Aug 2025 09:00 AM",
    lastActivity: "15 Aug 2025 09:30 AM",
    questionsAttempted: "10/30",
    gradingStatus: "Disconnected",
    platformIp: "—",
    browser: "—",
  },
  {
    id: 4,
    studentName: "Amit Patel",
    curriculum: "IGCSE",
    class: "VII-A",
    assessmentStartTime: "15 Aug 2025 09:00 AM",
    lastActivity: "15 Aug 2025 10:10 AM",
    questionsAttempted: "30/30",
    gradingStatus: "Completed",
    platformIp: "198.51.100.42",
    browser: "Mozilla Firefox 117.0",
  }
];


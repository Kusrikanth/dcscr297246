import {
  MenuOptionHrtl,
  StatusLabel,
  UserDetails,
} from "../../../../../../../Components/Common";

export function generateColumns(actionsList: any) {
  return [
    {
      Header: "Assessment Name",
      accessor: "assessmentName",
      disableSortBy: true,
      columnClassName: "sticky-left min-w-200px w-200px max-w-200px tw-z-10",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.assessmentName}
            displayId={original?.assessmentType}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: "Assigned Date",
      accessor: "assignedDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.assignedDate}
            displayId={original?.assignedTime}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: "Created Data",
      accessor: "createdData",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.createdData}
            displayId={original?.createdTime}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: "Due Date",
      accessor: "dueDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.dueDate}
            displayId={original?.dueDateTime}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: "No of Questions",
      accessor: "noOfQuestions",
      disableSortBy: true,
    },
    {
      Header: "Marks",
      accessor: "marks",
      disableSortBy: true,
    },
    {
      Header: "Duration",
      accessor: "duration",
      disableSortBy: true,
    },
    {
      Header: "No Of Submission",
      accessor: "noOfSubmission",
      disableSortBy: true,
    },
    {
      Header: "Evolutor",
      accessor: "evolutor",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.evolutorName}
            displayId={original?.evolutorId}
            size="xs"
          ></UserDetails>
        );
      },
    },
    {
      Header: "Evaluation",
      accessor: "evaluationStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            labelName={original.evaluationStatus}
            type={original.evaluationStatus}
          ></StatusLabel>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export const tableData = [
  {
    id: 1,
    assessmentName: "Mathematics Midterm",
    assessmentType: "Written",
    assignedDate: "2025-08-01",
    assignedTime: "10:00 AM",
    createdData: "2025-07-25",
    createdTime: "09:30 AM",
    dueDate: "2025-08-05",
    dueDateTime: "11:59 PM",
    noOfQuestions: 20,
    marks: 100,
    duration: "1hr 30mins",
    noOfSubmission: 15,
    evolutorName: "Prof. Sharma",
    evolutorId: "EMP201",
    evaluationStatus: "Pending",
  },
];

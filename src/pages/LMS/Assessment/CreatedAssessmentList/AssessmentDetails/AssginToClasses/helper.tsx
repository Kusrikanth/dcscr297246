import {
  MenuOptionHrtl,
  StatusLabel,
  UserDetails,
} from "../../../../../../Components/Common";

export function generateColumns(actionsList: any) {
  return [
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Timezone",
      accessor: "timezone",
      disableSortBy: true,
    },
    {
      Header: "Start Date & Time",
      accessor: "startDateAndTime",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.startDate}
            displayId={original.startTime}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: "End Date & Time",
      accessor: "endDateAndTime",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.endDate}
            displayId={original.endTime}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: "Grace Period (mins)",
      accessor: "gracePeriod",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            labelName={original.status}
            type={original.status}
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
    className: "X-A",
    timezone: "Asia/Kolkata",
    startDate: "15 Aug 2025",
    startTime: "09:00 AM",
    endDate: "15 Aug 2025",
    endTime: "09:45 AM",
    gracePeriod: 5,
    status: "Scheduled",
  },
  {
    id: 2,
    className: "X-B",
    timezone: "Asia/Dubai",
    startDate: "15 Aug 2025",
    startTime: "08:00 AM",
    endDate: "15 Aug 2025",
    endTime: "08:45 AM",
    gracePeriod: 10,
    status: "Scheduled",
  },
  {
    id: 3,
    className: "X-C",
    timezone: "Asia/Kolkata",
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    gracePeriod: null,
    status: "Pending",
  },
];

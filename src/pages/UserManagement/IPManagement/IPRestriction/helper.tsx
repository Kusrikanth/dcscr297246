import { MenuOptionHrtl, UserDetails } from "../../../../Components/Common";
import { getDateWithTimeFormat } from "../../../../utility/dateutility";

export function generateColumns(actionsList: any) {
  return [
    {
          Header: "Name",
          accessor: "name",
          disableSortBy: true,
          columnClassName: "sticky-left tw-min-w-[200px] tw-w-[200px] tw-max-w-[200px]",
          Cell: ({ row: { original } }: any) => {
            const { name, userId } = original;
    
            return (
              <UserDetails
                showAvatar
                displayNameClass="text-truncate"
                displayName={name}
                displayId={userId}
                size="xs"
                defaultImgType="student"
              />
            );
          },
        },
    {
      Header: "Device",
      accessor: "source",
      disableSortBy: true,
    },
    {
      Header: "Ip Address",
      accessor: "ipAddress",
      disableSortBy: true,
    },
    {
      Header: "Reason",
      accessor: "remarks",
      disableSortBy: true,
      columnClassName: "tw-min-w-[200px] tw-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "Blocked Date",
      accessor: "blockedDate",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return original?.blockedDate ? getDateWithTimeFormat(original?.blockedDate + "Z") : "-";
      },
    },
    {
      Header: "Actions",
      filterable: false,
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

export const sourceList = [
  {
    name: "WEB",
    id: "WEB",
  },
  {
    name: "MOBILE",
    id: "MOBILE",
  },
]
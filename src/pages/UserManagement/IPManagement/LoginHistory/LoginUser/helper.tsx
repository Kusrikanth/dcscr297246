import { MenuOptionHrtl, UserDetails } from "../../../../../Components/Common";
import { getDateWithTimeFormat } from "../../../../../utility/dateutility";

export function generateColumns(actionsList: any) {
  return [
    {
      Header: "Name",
      accessor: "name",
      columnClassName: "sticky-left tw-min-w-[200px] tw-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        const { name, userName } = original;

        return (
          <UserDetails
            showAvatar
            displayNameClass="tw-truncate"
            displayName={name}
            displayId={userName}
            size="xs"
            defaultImgType="student"
          />
        );
      },
    },
    {
      Header: "User Type",
      accessor: "userType",
      disableSortBy: true,
      columnClassName: "tw-text-center",

    },
    {
      Header: "OS Browser",
      accessor: "osBrowser",
      disableSortBy: true,
      columnClassName: "tw-text-center",

    },
    {
      Header: "Device",
      accessor: "source",
      disableSortBy: true,
      columnClassName: "tw-text-center",

    },
    {
      Header: "IP Address",
      accessor: "ipAddress",
      disableSortBy: true,
      columnClassName: "tw-min-w-[130px] tw-w-[130px] tw-max-w-[130px] tw-text-wrap tw-text-break tw-text-center",
      
    },
    {
      Header: "Country",
      accessor: "country",
      disableSortBy: true,
      columnClassName: "tw-text-center",

    },
    {
      Header: "City",
      accessor: "city",
      disableSortBy: true,

    },
    {
      Header: "App Version",
      accessor: "appVersion",
      disableSortBy: true,
      columnClassName: "tw-text-center",
    },
    {
      Header: "Session Start",
      accessor: "sessionStartDate",
      disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
                      return original?.sessionStartDate ? getDateWithTimeFormat(original?.sessionStartDate + "Z") : "-";
          },
    },
    {
      Header: "Session End",
      accessor: "sessionEndDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.sessionEndDate ? getDateWithTimeFormat(original?.sessionEndDate + "Z") : "-";
},
    },
    {
      Header: "Duration",
      accessor: "durationTime",
      disableSortBy: true,
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

export const ignoredKeys = ["academicYearId","searchStr","source","osBrowser", "startDate", "endDate"];


export function convertArrayToObjects(arr : any) {
  if(!arr) return [];
  return arr?.map((item : any) => ({ name: item.toUpperCase() }));
}
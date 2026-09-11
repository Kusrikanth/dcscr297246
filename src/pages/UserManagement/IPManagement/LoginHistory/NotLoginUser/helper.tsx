import { MenuOptionHrtl, UserDetails } from "../../../../../Components/Common";
import { getDateWithTimeFormat } from "../../../../../utility/dateutility";

export function generateColumns() {
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
      Header: "Role Type",
      accessor: "roleType",
      disableSortBy: true,

    },
    {
      Header: "Email",
      accessor: "email",
      disableSortBy: true,
    },
    {
      Header: "Mobile Number",
      accessor: "mobile",
      disableSortBy: true,
    },
  ];
}

export const sourceList = [
  {
    name: "INSTITUTE",
    id: "INSTITUTE",
  },
  {
    name: "SYSTEM",
    id: "SYSTEM",
  },
]

export const ignoredKeys = ["academicYearId"]


export function convertArrayToObjects(arr : any) {
  if(!arr) return [];
  return arr?.map((item : any) => ({ name: item.toUpperCase() }));
}
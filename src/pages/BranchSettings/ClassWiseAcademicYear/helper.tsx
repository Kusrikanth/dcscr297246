import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return ([
    {
      Header: "Class",
      accessor: "className",
    },
    {
      Header: "Start Date",
      accessor: "startDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyWithMonthNameFormat(new Date(original.startDate))
      }
    },
    {
      Header: "End Date",
      accessor: "endDate",
      disableSortBy: true,
      columnClassName: "tw-text-nowrap",
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyWithMonthNameFormat(new Date(original.endDate))
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
  ])
}

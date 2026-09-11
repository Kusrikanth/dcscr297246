import { IOptionsHrtl, MenuOptionHrtl } from "../../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Holiday Name",
      accessor: "holidayName",
      disableSortBy: true,
    },
    {
      Header: "Holiday Type",
      accessor: "holidayType",
      disableSortBy: true,
    },
    {
      Header: "Holiday Date",
      accessor: "holidayDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          getDdMmYyyyWithMonthNameFormat(original?.holidayDate ? `${original?.holidayDate}Z` : '')
        )
      }
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

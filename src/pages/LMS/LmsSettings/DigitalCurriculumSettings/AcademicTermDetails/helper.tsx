import { IOptionsHrtl, MenuOptionHrtl } from "../../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      accessor: "serialNo",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        const { index } = row;
        return <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>;
      },
    },
    {
      Header: "Academic Year",
      accessor: "courseAcademicYearName",
      disableSortBy: true,
    },
    {
      Header: "Term Name",
      accessor: "termName",
      disableSortBy: true,
    },
    {
      Header: "Start Date",
      accessor: "startDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          getDdMmYyyyWithMonthNameFormat(original?.startDate ? `${original?.startDate}Z` : '')
        )
      }
    },
    {
      Header: "End Date",
      accessor: "endDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          getDdMmYyyyWithMonthNameFormat(original?.endDate ? `${original?.endDate}Z` : '')
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

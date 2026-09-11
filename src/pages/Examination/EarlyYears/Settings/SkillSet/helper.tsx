
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../../Components/Common/MenuOptions";


export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "curriculum",
      accessor: "branchCurriculumName",
      disableSortBy: true,
    },
    {
      Header: "OverAll Grade",
      accessor: "overAllGrades",
      disableSortBy: true,
    },
    {
      Header: "Grade",
      accessor: "grade",
      disableSortBy: true,
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
    },
    {
      Header: "Action",
      thClass: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
    },
  ];
}

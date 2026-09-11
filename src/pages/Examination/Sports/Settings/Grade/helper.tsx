import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      accessor: "sNo",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return <span>{row.index + 1}</span>;
      },
    },
    {
      Header: "Grade",
      accessor: "grade",
      disableSortBy: true,
    },
    {
      Header: "Label",
      accessor: "label",
      disableSortBy: true,
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
  { id: 1, grade: "A+", label: "Outstanding" },
  { id: 2, grade: "A", label: "Excellent" },
  { id: 3, grade: "A-", label: "Very Good" },
  { id: 4, grade: "B+", label: "Good" },
  { id: 5, grade: "B", label: "Above Average" },
  { id: 6, grade: "B-", label: "Average" },
  { id: 7, grade: "C+", label: "Satisfactory" },
  { id: 8, grade: "C", label: "Pass" },
  { id: 9, grade: "D", label: "Poor" },
  { id: 10, grade: "F", label: "Fail" },
];

import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      accessor: "id",
      disableSortBy: true,
      columnClassName: "tw-[100px] tw-min-[100px] tw-max-[100px]",
      Cell: ({ row }: any) => {
        return row.index + 1;
      },
    },
    {
      Header: "Period Category",
      accessor: "category",
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
  { id: 1, periodCategory: "Assembly" },
  { id: 2, periodCategory: "Lab" },
  { id: 3, periodCategory: "Class" },
  { id: 4, periodCategory: "Library" },
  { id: 5, periodCategory: "Games" },
];

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
      Header: "Sports Name",
      accessor: "sportName",
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
  { id: 1, sportsName: "Cricket" },
  { id: 2, sportsName: "Football" },
  { id: 3, sportsName: "Basketball" },
  { id: 4, sportsName: "Tennis" },
  { id: 5, sportsName: "Badminton" },
  { id: 6, sportsName: "Hockey" },
  { id: 7, sportsName: "Table Tennis" },
  { id: 8, sportsName: "Baseball" },
  { id: 9, sportsName: "Swimming" },
  { id: 10, sportsName: "Volleyball" },
];

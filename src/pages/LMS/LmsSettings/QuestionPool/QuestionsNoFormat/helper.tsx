import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Format Type",
      accessor: "formatType",
      disableSortBy: true,
    },
    {
      Header: "Looks Like",
      accessor: "example",
      disableSortBy: true,
    },
    {
      Header: "Notes",
      accessor: "notes",
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
  {
    id: 1,
    formatType: "Q1.",
    looksLike: "Q1. Q2.",
    notes: "Standard question format",
  },
  {
    id: 2,
    formatType: "1)",
    looksLike: "1) 2) 3)",
    notes: "Common in worksheets",
  },
  {
    id: 3,
    formatType: "Q-001:",
    looksLike: "Q-001:",
    notes: "Good for printed IDs",
  },
  {
    id: 4,
    formatType: "#100)",
    looksLike: "#100)",
    notes: "Useful when continuing long question sets",
  },
];

import { StatusLabel } from "../../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Bloom Level",
      accessor: "bloomLevel",
      disableSortBy: true,
    },
    {
      Header: "Short Name",
      accessor: "shortName",
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
    bloomLevel: "Remembering",
    code: "R",
    status: "Active",
  },
  {
    id: 2,
    bloomLevel: "Understanding",
    code: "U",
    status: "Active",
  },
  {
    id: 3,
    bloomLevel: "Applying",
    code: "A",
    status: "Active",
  },
  {
    id: 4,
    bloomLevel: "Analyzing",
    code: "AN",
    status: "Active",
  },
  {
    id: 5,
    bloomLevel: "Evaluating",
    code: "EV",
    status: "Active",
  },
  {
    id: 6,
    bloomLevel: "Creating",
    code: "C",
    status: "Active",
  },
];

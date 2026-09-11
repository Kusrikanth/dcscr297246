import { StatusLabel } from "../../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Difficulty Level",
      accessor: "difficultyLevel",
      disableSortBy: true,
    },
    {
      Header: "Code",
      accessor: "shortName",
      disableSortBy: true,
    },
    {
      Header: "Color Tag",
      accessor: "colorTag",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="fs-14 badge tw-bg-[#4051891a] px-1 text-dark fw-medium d-inline-flex align-items-center">
            <span
              className="rounded"
              style={{
                width: "12px",
                height: "12px",
                display: "inline-block",
                backgroundColor: `${original.colorCode}`,
              }}
            ></span>
          </div>
        );
      },
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
    difficultyLevel: "Easy",
    code: "E",
    colorTag: "Green",
    status: "Active",
    colorCode: "#0ab39c",
  },
  {
    difficultyLevel: "Medium",
    code: "M",
    colorTag: "Yellow",
    status: "Active",
    colorCode: "#feb019",
  },
  {
    difficultyLevel: "Hard",
    code: "H",
    colorTag: "Red",
    status: "Active",
    colorCode: "#f06548",
  },
];

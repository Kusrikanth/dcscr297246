import { HugeiconsIcon } from "@hugeicons/react";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";
import { Cancel01Icon, Tick01Icon } from "@hugeicons-pro/core-stroke-standard";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Question Type",
      accessor: "questionType",
      disableSortBy: true,
    },
    {
      Header: "Marks",
      accessor: "marks",
      disableSortBy: true,
    },
    {
      Header: "Partial Allowed",
      accessor: "partialAllowed",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div>
            <HugeiconsIcon
              icon={original.partialAllowed ? Tick01Icon : Cancel01Icon}
              className={`${
                original.partialAllowed ? "text-success" : "text-danger"
              }`}
              size={24}
            />
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
    id: 1,
    questionType: "MCQ",
    marks: 1,
    partialAllowed: false,
  },
  {
    id: 2,
    questionType: "SA-I",
    marks: 2,
    partialAllowed: true,
  },
  {
    id: 3,
    questionType: "SA-II",
    marks: 3,
    partialAllowed: true,
  },
  {
    id: 4,
    questionType: "LA",
    marks: 5,
    partialAllowed: true,
  },
];

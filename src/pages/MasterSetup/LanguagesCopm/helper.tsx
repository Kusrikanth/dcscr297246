import { MenuOptionHrtl } from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { ILanguageTableData } from "./languageTypes";

// academics table select filter
export const selectData1 = [
  {
    boardType: "option1",
  },
  {
    boardType: "option1",
  },
  {
    boardType: "option1",
  },
];

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Language Name",
      accessor: "languageName",
    },
    {
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },
  ];
}

export const classData: Array<ILanguageTableData> = [
  {
    id: 1,
    languageName: "English",
    // shortName: "ENG",
  },
  {
    id: 2,
    languageName: "Sanskrit",
    // shortName: "SKT",
  },
  {
    id: 1,
    languageName: "French",
    // shortName: "FRE",
  },
];

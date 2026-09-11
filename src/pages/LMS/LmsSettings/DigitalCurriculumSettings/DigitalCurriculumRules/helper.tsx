import { IOptionsHrtl, MenuOptionHrtl } from "../../../../../Components/Common/MenuOptions";
import { default as CorrectIcon } from "../../../../../assets/imagesdps/common_icon/correct_icon.svg?react";
import { default as WrongIcon } from "../../../../../assets/imagesdps/common_icon/wrong_icon.svg?react";

export const LEVEL_KEY_OPTIONS = [
  { label: "UNIT", value: "UNIT" },
  { label: "CHAPTER", value: "CHAPTER" },
  { label: "TOPIC", value: "TOPIC" },
];

export function generateColumns(
  actionList: Array<IOptionsHrtl>,
) {
  return [
    {
      Header: "Level Key",
      accessor: "levelKey",
      disableSortBy: true,
    },
    {
      Header: "Display Name",
      accessor: "displayName",
      disableSortBy: true,
    },
    {
      Header: "Enable",
      accessor: "isEnabled",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        value ? (
          <CorrectIcon style={{ width: "15px" }} />
        ) : (
          <WrongIcon style={{ width: "13px" }} />
        )
      ),
    },
    {
      Header: "Sample / Notes",
      accessor: "sampleNotes",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionList}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    }
  ];
}
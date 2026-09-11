
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { TextInput } from "../../../../Components/Common";
import { useState } from "react";
import { LibraryPublishersDataTypes } from "./LibraryPublishersTypes";


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Publisher Name",
      accessor: "publisherName",
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
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.publisherId} />
        );
      },
    },
  ];
}
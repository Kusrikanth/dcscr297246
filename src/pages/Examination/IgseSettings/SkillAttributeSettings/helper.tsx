import { original } from "@reduxjs/toolkit";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      accessor: "sNo",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return (
          <span>{row.index <= 9 ? `0${row.index + 1}` : row.index + 1}</span>
        );
      },
    },
    {
      Header: "Skill Name",
      accessor: "skillName",
      disableSortBy: true,
    },
    {
      Header: "Attribute",
      accessor: "attribute",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-center tw-gap-3">
            {original?.attributes?.map((item: any) => (
              <span
                key={item.id}
                className="badge text-uppercase bg-light text-muted"
              >
                {item.attributeName}
              </span>
            ))}
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

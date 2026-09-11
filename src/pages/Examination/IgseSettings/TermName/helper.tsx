import React from "react";
import { MenuOptionHrtl, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export function generateColumns(actionList: Array<IOptionsHrtl>,isInstituteAdmin: boolean) {
  return [
    {
      Header: "Term Name",
      accessor: "termName",
      disableSortBy: true,
    },
    {
      Header: "Short Name",
      accessor: "termShortName",
      disableSortBy: true,
    },
    {
      Header:"Created By",
      accessor:"createdBy",
      disableSortBy:true,
      Cell:({row:{original}}:any)=>{
        return <span>{original.createdBy ? original.createdBy : "-"}</span>
      }
    },
    {
        Header: "Created Date",
        accessor: "createdAt",
        disableSortBy: true,
        Cell:({row:{original}}:any)=>{
            const [date,time] = original?.createdAt?.split("T") ?? [];
            return <UserDetails
            displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
            displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
            showAvatar={false}
            ></UserDetails>
        }
    },
      ...(isInstituteAdmin
    ? [
        {
          Header: "Action",
          thClass: "w-5",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => (
            <MenuOptionHrtl
              actionOptions={actionList}
              rowId={original.termId}
            />
          ),
        },
      ]
    : []),
  ];
}
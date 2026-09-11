import React from "react";
import { InputCheckbox, UserDetails } from '../../../../Components/Common';
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";


export function generateCoscholasticGradeColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      columnClassName: "w-250px min-w-250px max-w-250px",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.className || "-"}
            displayId={original?.curriculumName || "-"}
            showAvatar={false}
          />
        );
      },
    },
    {
      Header: "Subject",
      accessor: "subjectName",
      disableSortBy: true,
    },
    {
      Header: "Skill Area",
      accessor: "skillAreaName",
      disableSortBy: true,
    }, {
      Header: "Grade",
      accessor: "grade",
      disableSortBy: true,
    },
    {
      Header: "Grade Point",
      accessor: "gradePoints",
      disableSortBy: true,
    },
    {
      Header: "Description",
      accessor: "description",
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
    {
      Header: "Action",
      thClass: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
    },
  ];
}

const maxGrades = 5;

export const numberofGrades = Array.from({ length: maxGrades }, (_, i) => ({
  key: (i + 1).toString(),
}));

  export const ignoredKeys = ["searchString",];
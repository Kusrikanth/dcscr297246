import React, { useState } from "react";
import { UserDetails } from '../../../../Components/Common';
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDateWithTimeFormat, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export const subjectType = [
  {
    id: 'SCHOLASTIC',
    name: 'Scholastic',
  },
  {
    id: 'COSCHOLASTIC',
    name: 'Co-Scholastic',
  },
];

export const scholasticSubjects = [
  {
    id: 'CORE',
    name: 'Core',
  },
  {
    id: 'LANGUAGE',
    name: 'Language',
  },
];
export const coScholasticSubjects = [
  {
    id: 'AREA',
    name: 'Area',
  },
  {
    id: 'ACTIVITY',
    name: 'Activity',
  },
];
export function generateColumns( actionList: Array<IOptionsHrtl>) {
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
      Header: "Examination Name",
      accessor: "examinationName",
      disableSortBy: true,
    },
    {
      Header: "No.of Subjects",
      accessor: "subjectsCount",
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
      accessor: "createdDate",
      disableSortBy: true,
      columnClassName: "text-nowrap",
      Cell: ({ row: { original } }: any) => {
        return getDateWithTimeFormat(original?.createdDate ? `${original?.createdDate}Z` : '');
      },
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

export const ignoredKeys = ["searchString","academicYearId","curriculumId"];
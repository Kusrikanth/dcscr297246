import React, { useState } from "react";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import { StudentSubjectDataTypes, } from "./AssignLanguageTypes";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { SelectInput, UserDetails, MenuOptionHrtl } from "../../../../Components/Common";

  export const selectData1 = [
    
    {
      yearType: "2022-23",
    },
    {
      yearType: "2021-22",
    },
    {
      yearType: "2020-21",
    },
  ];
  
  export const selectData3 = [
    {
      classType: "X",
    },
    {
      classType: "IX",
    },
    {
      classType: "VIII",
    },
  ];
  export const selectData6 = [
    {
      languageIIType: "French",
    },
    {
      languageIIType: "English",
    },
    {
      languageIIType: "Hindi",
    },
  ];
  export const selectData7 = [
    {
      languageIIIType: "Telugu",
    },
    {
      languageIIIType: "English",
    },
    {
      languageIIIType: "Hindi",
    },
  ];

export function generateColumns(actionList: Array<IOptionsHrtl>) {
        return [
            {
                Header: "Student Name",
                accessor: "studentName",
                thClass: "w-15",
                disableSortBy: true,
                Cell: ({ row: { original } }: any) => {
                  return (
                    <>
                      <UserDetails
                        imageUrl={original?.studentName?.imgUrl}
                        displayName={original?.studentName?.StudName}
                        displayId={original?.studentName?.dep_id}
                      />
                    </>
                  );
                },
              },
            {
                Header: "Class",
                accessor: "class",
                disableSortBy: true,
            },
            {
                Header: "Section",
                accessor: "section",
                disableSortBy: true,
            },
            {
                Header: "Second Language",
                accessor: "secondLanguage",
                disableSortBy: true,
                
            },
            {
                Header: "Third Language",
                accessor: "thirdLanguage",
                disableSortBy: true,
                
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

export const StudentSubjectTableData: Array<StudentSubjectDataTypes> =
  [
    {
      id: 1,
      studentName: {
        StudName: "User1",
        dep_id: "DCIP000001",
        imgUrl: avatar1,
      },
      class: "X",
      section: "XP",
      secondLanguage: "Hindi",
      thirdLanguage: "English",
      },
      {
        id: 2,
        studentName: {
          StudName: "User2",
          dep_id: "DCIP000002",
          imgUrl: avatar1,
        },
        class: "X",
        section: "XP",
        secondLanguage: "English",
        thirdLanguage: "Hindi",
        },
        {
            id: 3,
            studentName: {
              StudName: "User3",
              dep_id: "DCIP000003",
              imgUrl: avatar1,
            },
            class: "X",
            section: "XP",
            secondLanguage: "Telugu",
            thirdLanguage: "English",
            },
  ];
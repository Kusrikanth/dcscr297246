import React, { useEffect, useMemo, useRef, useState } from "react";
import { InputCheckbox, StatusLabel, TextInput } from '../../../../Components/Common';
import { SelectInput, UserDetails, MenuOptionHrtl } from "../../../../Components/Common";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import { ReportCardDataTypes } from "./ReportCardTypes"
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

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
export const selectData2 = [
  {
    classType: "Class",
  },
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
export const selectData3 = [
  {
    examName: "Examination Name",
  },
  {
    examName: "PT1",
  },
  {
    examName: "PT2",
  },
  {
    examName: "PT3",
  },
];
export const selectData4 = [
  {
    sectionType: "Section1",
  },
  {
    sectionType: "Section2",
  },
  {
    sectionType: "Section3",
  },
  {
    sectionType: "Section4",
  },
];
export const selectData7 = [
  {
    termType: "TermI",
  },
  {
    termType: "TermII",
  },
];
export function generateColumns(actionList: Array<IOptionsHrtl>) {
        return [
            {
                Header: "Student Name",
                accessor: "studentName",
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
                Header: "Roll No.",
                accessor: "rollNo",
                disableSortBy: true,
            },
            {
                Header: "Class",
                accessor: "class",
                disableSortBy: true,
            },
            {
              Header: "Section",
              accessor: "mathematics",
              disableSortBy: true,
          },
          {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return (
                <StatusLabel type={original.status} labelName={original.status} />
              );
            },
        },
        {
          Header: "Actions",
          accessor: "endDateverbalLanguage",
          disableSortBy: true,
          // columnClassName: "w-70",
          Cell: ({ row: { original } }: any) => {
            return (
              <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
            );
          },
          
      },
        ];
}
export const ReportCardTableData: Array<ReportCardDataTypes> = [
  {
    id: 1,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    rollNo: "1",
    class : "V",
    mathematics : "V-A",
    status: "Active",
  },
  {
    id: 2,
    studentName: {
      StudName: "User2",
      dep_id: "DCIP000002",
      imgUrl: avatar1,
    },
    rollNo: "2",
    class : "V",
    mathematics : "V-A",
    status: "Pending",
  },
  {
    id: 3,
    studentName: {
      StudName: "User3",
      dep_id: "DCIP000003",
      imgUrl: avatar1,
    },
    rollNo: "3",
    class : "V",
    mathematics : "V-A",
    status: "Active",
  },
];
import React from "react";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { ExaminationDateDataTypes } from "./AdmitCardTypes";
import { UserDetails } from "../../../../Components/Common";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";

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
    curriculumType: "CBSE",
  },
  {
    curriculumType: "CAMBRIDGE",
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
                Header: "Roll No",
                accessor: "rollNo",
                disableSortBy: true,
            },
            
            {
                Header: "Exam Start Date",
                accessor: "startDate",
                disableSortBy: true,
            },
            {
                Header: "Exam End Date",
                accessor: "endDate",
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
export const ExaminationDateTableData: Array<ExaminationDateDataTypes> = [
  {
    id: 1,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    rollNo: "1",
    startDate: "21 April 2024",
    endDate: "10:00AM",
  },
  {
    id: 2,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    rollNo: "2",
    startDate: "21 April 2024",
    endDate: "10:00AM",
  },
  {
    id: 3,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    rollNo: "3",
    startDate: "21 April 2024",
    endDate: "10:00AM",
  },
];
import { useState } from "react";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../../../Components/Common/MenuOptions";
import { UserDetails } from "../../../../../../Components/Common";


export function generateColumnsStudentsAssingment(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              showAvatar
              imageUrl={original.studentImageBase64}
              displayName={original.studentName}
              displayId={original.studentCode}
              size="xs"
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.className}
              displayId={original?.curriculumName}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Roll No.",
      accessor: "rNo",
      disableSortBy: true,
    },
    {
      Header: "Phone No.",
      accessor: "pNo",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      thClass: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
      ),
    },
  ];
}
export function questionTableDataStudentsAssingment() {
  return [
    {
      id: "1",
      studentName: "Ananya Sharma",
      studentCode: "STU1001",
      className: "I-A",
      curriculumName: "CBSE",
      pNo: "9876543210",
      rNo: "1",
    },
    {
      id: "2",
      studentName: "Rohan Verma",
      studentCode: "STU1002",
      className: "II-A",
      curriculumName: "ICSE",
      pNo: "9123456780",
      rNo: "2",
    },
    {
      id: "3",
      studentName: "Meera Iyer",
      studentCode: "STU1003",
      className: "XI-A",
      curriculumName: "State Board",
      pNo: "9988776655",
      rNo: "3",
    },
  ];
}

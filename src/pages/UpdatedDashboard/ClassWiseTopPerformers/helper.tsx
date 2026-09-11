import { UserDetails } from "../../../Components/Common";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import { IClassWiseTopPerformersTableData } from "./ClassWiseTopPerformersTypes";

export const selectData1 = [
  {
    boardType: "CBSE",
  },
  {
    boardType: "option2",
  },
  {
    boardType: "option3",
  },
];

export const selectData2 = [
  {
    classType: "VI",
  },
  {
    classType: "option2",
  },
  {
    classType: "option3",
  },
];

export function generateColumns() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            imageUrl={original?.studentName?.imgUrl}
            displayName={original?.studentName?.name}
            displayId={original?.studentName?.dep_id}
          />
        );
      },
    },
    {
      Header: "Campus",
      accessor: "campus",
    },
    {
      Header: "Total Marks",
      accessor: "totalMarks",
    },
    {
      Header: "Marks %",
      accessor: "marks",
    },
  ]
}

export const TableData: Array<IClassWiseTopPerformersTableData> = [
  {
    id: 1,
    studentName: {
      name: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    campus: "Nacharam",
    totalMarks: "480 / 500",
    marks: "95 %",
  }
]
import avatar1 from "../../../../../assets/images/users/avatar-1.jpg";
import { StudentSubjectDataTypes, } from "./StudentSubjectTypes";
import { MenuOptionHrtl, UserDetails } from "../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";

export function generateColumns() {
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
            accessor: "class",
            disableSortBy: true,
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
  class: "1",
  },
  {
    id: 2,
    studentName: {
      StudName: "User2",
      dep_id: "DCIP000002",
      imgUrl: avatar1,
    },
    class: "2",
    },
    {
        id: 3,
        studentName: {
          StudName: "User3",
          dep_id: "DCIP000003",
          imgUrl: avatar1,
        },
        class: "3",
        },
];
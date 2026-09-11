import { UserDetails } from "../../../../../Components/Common";
import { CreateStudentTableData } from "../../ManageUserTypes";
import avatar1 from "../../../../../assets/images/users/avatar-1.jpg";

export function generateColumns() {
  return [
    {
      Header: "Name",
      accessor: "name",
      thClass: "w-35",
      Cell: ({ row: { original } }: any) => {
        return (
          <div>
            <UserDetails
              imageUrl={original?.name?.imgUrl}
              displayName={original?.name?.StudName}
              displayId={original?.name?.dep_id}
            />
          </div>
        );
      },
    },
    {
      Header: "Class",
      accessor: "class",
      thClass: "w-30",
    },
    {
      Header: "Section",
      accessor: "section",
      thClass: "w-30",
    },
  ];
}

export const CreateStudentData: Array<CreateStudentTableData> = [
  {
    id: 1,
    name: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    class: "I",
    section: "NUR-A",
  },
];

export const StudentList=[
  {
    id: 1,
    StudName: "User1",
    dep_id: "DCIP000001",
    imgUrl: avatar1,
  },
  {
    id: 2,
    StudName: "User1",
    dep_id: "DCIP000001",
    imgUrl: avatar1,
  },
  {
    id: 3,
    StudName: "User1",
    dep_id: "DCIP000001",
    imgUrl: avatar1,
  }
]

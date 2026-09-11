import { UserDetails } from "../../../../../Components/Common";
import { CreateEmployeeTableData, UserTypeList } from "../../ManageUserTypes";
import avatar1 from "../../../../../assets/images/users/avatar-1.jpg";

export function generateColumns() {
  return [
    {
      Header: "Name",
      accessor: "name",
      Cell: ({ row: { original } }: any) => {
        return (
          <div>
            <UserDetails
              imageUrl={original?.name?.imgUrl}
              displayName={original?.name?.StudName}
              displayId={original?.name?.dep_id}
              defaultImgType="employee"
            />
          </div>
        );
      },
    },
    {
      Header: "Employee Category",
      accessor: "employeeCategory",
    },
  ];
}

export const CreateEmployeeData: Array<CreateEmployeeTableData> = [
  {
    id: 1,
    name: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    employeeCategory: "Teacher",
  },
];

export const UserTypeLists: Array<UserTypeList>  = [{
  id: 1,
  name: "CODE"
},
{
  id: 2,
  name: "EMAIL"
},
{
  id: 3,
  name: "PHONE"
}
]
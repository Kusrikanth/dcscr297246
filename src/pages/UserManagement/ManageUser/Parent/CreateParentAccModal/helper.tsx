import { UserDetails } from "../../../../../Components/Common";
import {
  CreateParentTableData,
  CreateStudentTableData,
  UserTypeList,
} from "../../ManageUserTypes";
import avatar1 from "../../../../../assets/images/users/avatar-1.jpg";

export function generateColumns() {
  return [
    {
      Header: "Parent Name",
      accessor: "name",
      thClass: "tw-w-[50%]",
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
      Header: "Phone No",
      accessor: "phoneNo",
      thClass: "tw-w-[45%]",
    },
  ];
}

export const CreateParentData: Array<CreateParentTableData> = [
  {
    id: 1,
    name: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    phoneNo: "99097168938",
  },
];
export const ParentList = [
  {
    id: 1,
    ParentName: "User1",
    dep_id: "DCIP000001",
    imgUrl: avatar1,
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
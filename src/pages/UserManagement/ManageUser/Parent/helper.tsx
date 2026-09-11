import {
  MoreActions,
  StatusLabel,
  UserDetails,
} from "../../../../Components/Common";
import { EmployeeTableData } from "../ManageUserTypes";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";


function getUserActions(userEnabled: any, actions: any) {
  if (userEnabled) {
    return actions.filter((item: any) => item.id !== "activate-user");
  } else {
    return actions.filter((item: any) => (item.id === "activate-user" || item.id === "delete"));
  }
}
export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Parent Name",
      accessor: "name",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              imageUrl={original.imageUrl}
              displayName={`${original.firstName + " " + original.lastName}`}
              // displayId={original.id}
              size="xs"
              defaultImgType="employee"
            />
          </>
        );
      },
    },
    {
      Header: "User Name",
      accessor: "username",
      disableSortBy: true,
    },
    {
      Header: "Phone Number",
      accessor: "mobile",
      disableSortBy: true,
    },
    {
      Header: "Email",
      accessor: "email",
      disableSortBy: true,
    },
    {
      Header: "Created Date",
      accessor: "createdDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span>{getDdMmYyyyWithMonthNameFormat(original.createdDate)}</span>)
      },
    },
    {
      Header: "Status",
      accessor: "enabled",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        const statusValue = value ? "Active" : "Inactive";
        return (
          <StatusLabel type={statusValue} labelName={statusValue} />
        );
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { enabled } = original, userActions = getUserActions(enabled, actionsList);
        return (
          <MoreActions isHorizontal={true} actionOptions={userActions} rowId={original.id} />
        );
      },
    },
  ];
}

export const ParentData: Array<any> = [
  {
    id: 1,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    phoneNo: "992147892",
    emailId: "test@gmail.com",
    userName: "ENNHOO1",
    createdDate: "June 17,2022",
    status: "Active",
  },
];

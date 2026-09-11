import {
  MoreActions,
  StatusLabel,
  UserDetails,
} from "../../../Components/Common";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import { StudentTableData } from "./ManageUserTypes";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";


export const selectData3 = [
  {
    statusType: "Status",
  },
  {
    statusType: "option2",
  },
  {
    statusType: "option3",
  },
];

export const selectData2 = [
  {
    sectionType: "Section",
  },
  {
    sectionType: "option2",
  },
  {
    sectionType: "option3",
  },
];

export const selectData1 = [
  {
    classType: "Class",
  },
  {
    classType: "option2",
  },
  {
    classType: "option3",
  },
];

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
      Header: "Student Name",
      accessor: "studentName",
      Cell: ({ row: { original } }: any) => {
        const { firstName, lastName, image } = original;
        return (
          <>
            <UserDetails
              imageUrl={image}
              displayName={`${firstName} ${lastName}`}
              // displayId={student?.studentCode}
              size="xs"
              defaultImgType="student"
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
export function generateActivityColumns() {
  return [
    {
      Header: "Name",
      accessor: "name",
      disableSortBy: true
      // Cell: ({ row: { original } }: any) => {
      //   return (
      //     <>
      //       <UserDetails
      //         imageUrl={original?.studentName?.imgUrl}
      //         displayName={original?.studentName?.StudName}
      //         displayId={original?.studentName?.dep_id}
      //       />
      //     </>
      //   );
      // },
    },
    {
      Header: "IP Address",
      accessor: "ipAddress",
      disableSortBy: true
    },
    {
      Header: "Date & Time",
      accessor: "dateTime",
      disableSortBy: true
    },
  ];
}

export const activityLogData = [
  {
    id: 1,
    name: "Crome on Window",
    ipAddress: "255.255.255.255.",
    dateTime: "21 July 2021, 09:30 AM"
  },
  {
    id: 2,
    name: "Crome on Window",
    ipAddress: "255.255.255.255.",
    dateTime: "21 July 2021, 09:30 AM"
  },
  {
    id: 3,
    name: "Crome on Window",
    ipAddress: "255.255.255.255.",
    dateTime: "21 July 2021, 09:30 AM"
  }
]

export const StudentData: Array<StudentTableData> = [
  {
    id: 1,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    class: "I",
    section: "I-D",
    emailId: "test@gmail.com",
    userName: "ENNHOO1",
    createdDate: "June 17,2022",
    status: "Active",
  },
  {
    id: 2,
    studentName: {
      StudName: "User2",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    class: "I",
    section: "I-D",
    emailId: "test@gmail.com",
    userName: "ENNHOO1",
    createdDate: "June 17,2022",
    status: "Active",
  },
  {
    id: 1,
    studentName: {
      StudName: "User3",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    class: "I",
    section: "I-D",
    emailId: "test@gmail.com",
    userName: "ENNHOO1",
    createdDate: "June 17,2022",
    status: "Active",
  },
  {
    id: 1,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      imgUrl: avatar1,
    },
    class: "I",
    section: "I-D",
    emailId: "test@gmail.com",
    userName: "ENNHOO1",
    createdDate: "June 17,2022",
    status: "Active",
  },
];

export function generateColumnsForCreatePassword() {
  return [
    {
      Header: "Name",
      accessor: "name",
      width: 500,
      Cell: ({ row: { original } }: any) => {
        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
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
    },
    {
      Header: "Section",
      accessor: "section",
    },
  ];
}

export const CreateStudentData: Array<any> = [
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

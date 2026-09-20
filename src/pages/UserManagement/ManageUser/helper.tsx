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


// TODO: remove once the manage user APIs are reachable in this environment.
// Lets the user list and the Change Username flows be tested without a backend.
export const USE_SAMPLE_MANAGE_USERS = true;

export const sampleStudentUsers: Array<any> = [
  {
    id: 9001,
    firstName: "Aarav",
    lastName: "Sharma",
    username: "NHST2201",
    mobile: "9885040011",
    email: "aarav.sharma@dpsnacharam.in",
    createdDate: "2026-06-12T10:15:00",
    enabled: true,
    role: { roleType: "STUDENT" },
  },
  {
    id: 9002,
    firstName: "Anaya",
    lastName: "Sharma",
    username: "NHST2202",
    mobile: "9885040012",
    email: "anaya.sharma@dpsnacharam.in",
    createdDate: "2026-06-12T10:20:00",
    enabled: true,
    role: { roleType: "STUDENT" },
  },
  {
    id: 9003,
    firstName: "Ishaan",
    lastName: "Verma",
    username: "NHST2203",
    mobile: "9885040013",
    email: "ishaan.verma@dpssecunderabad.in",
    createdDate: "2026-07-02T09:05:00",
    enabled: true,
    role: { roleType: "STUDENT" },
  },
  {
    id: 9004,
    firstName: "Meera",
    lastName: "Nair",
    username: "NHST2204",
    mobile: "9885040014",
    email: "meera.nair@dpssecunderabad.in",
    createdDate: "2026-07-18T11:40:00",
    enabled: false,
    role: { roleType: "STUDENT" },
  },
];

export const sampleParentUsers: Array<any> = [
  {
    id: 9101,
    firstName: "Rakesh",
    lastName: "Sharma",
    //Shared by 3 siblings - can be split.
    username: "NHPR1001",
    mobile: "9885041001",
    email: "rakesh.sharma@gmail.com",
    createdDate: "2026-06-12T10:15:00",
    enabled: true,
    role: { roleType: "PARENT" },
  },
  {
    id: 9102,
    firstName: "Sunita",
    lastName: "Verma",
    //Shared by 2 siblings - can be split.
    username: "NHPR1002",
    mobile: "9885041002",
    email: "sunita.verma@gmail.com",
    createdDate: "2026-06-20T12:30:00",
    enabled: true,
    role: { roleType: "PARENT" },
  },
  {
    id: 9103,
    firstName: "Mohan",
    lastName: "Nair",
    username: "NHPR1003",
    mobile: "9885041003",
    email: "mohan.nair@gmail.com",
    createdDate: "2026-07-18T11:40:00",
    enabled: true,
    role: { roleType: "PARENT" },
  },
  {
    id: 9104,
    firstName: "Lakshmi",
    lastName: "Rao",
    username: "NHPR1004",
    mobile: "9885041004",
    email: "lakshmi.rao@gmail.com",
    createdDate: "2026-08-05T15:10:00",
    enabled: false,
    role: { roleType: "PARENT" },
  },
];

export const sampleEmployeeUsers: Array<any> = [
  {
    id: 9201,
    firstName: "Attala",
    lastName: "Hemanth Reddy",
    username: "NHAD0488",
    mobile: "9885040018",
    email: "hemanth.reddy@dpsnacharam.in",
    createdDate: "2026-05-02T09:00:00",
    enabled: true,
    role: { roleType: "EMPLOYEE" },
  },
  {
    id: 9202,
    firstName: "Idambi",
    lastName: "Venugopal",
    username: "NHTR0278",
    mobile: "9290901308",
    email: "venugopal@dpssecunderabad.in",
    createdDate: "2026-05-06T09:30:00",
    enabled: true,
    role: { roleType: "EMPLOYEE" },
  },
  {
    id: 9203,
    firstName: "Ingareddy",
    lastName: "Jyothsna",
    username: "NHTR0855",
    mobile: "9866445297",
    email: "jyothsna@dpsnacharam.in",
    createdDate: "2026-05-14T10:45:00",
    enabled: true,
    role: { roleType: "EMPLOYEE" },
  },
  {
    id: 9204,
    firstName: "Perka",
    lastName: "Ashok Kumar",
    username: "NHAD0466",
    mobile: "9492933310",
    email: "perkaashok912@gmail.com",
    createdDate: "2026-06-01T14:20:00",
    enabled: false,
    role: { roleType: "EMPLOYEE" },
  },
];

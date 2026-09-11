import {  StatusLabel } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { IMenuOptions } from "../../../NewAcademics/academicsTypes";

export const MenuOptions: Array<any> = [
    {
      id: "BASICINFO",
      labelName: "Basic Info",
      customPadding: "0px 20px",
    },
    {
      id: "SOCIALMEDIA",
      labelName: "Social Media",
      customPadding: "0px 20px",
    },
  
  ];

  export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
      {
        Header: "ID.No",
        accessor: "idNo",
        disableSortBy: true,
      },
      {
        Header: "Name",
        accessor: "name",
        disableSortBy: true,
      },
      {
        Header: "Created Date",
        accessor: "createdDate",
        disableSortBy: true,
      },
      {
        Header:"Modified Date",
        accessor: "modifiedDate",
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "status",
        disableSortBy: true,
        columnClassName: 'text-center',
        Cell: ({ row: { original } }: any) => {
          return (
            <StatusLabel
              type={original.status}
              labelName={original.status}
            />
          );
        },
   
      },
     {
        Header: "Actions",
        filterable: false,
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return (
            <MenuOptionHrtl
              actionOptions={actionsList}
              rowId={original.studentId}
            />
          );
        },
      },
    ];
  }
  export function generateColumnsManageStaff(actionsList: Array<IOptionsHrtl>) {
    return [
      {
        Header: "Name",
        accessor: "name",
        disableSortBy: true,
      },
      {
        Header: "Email",
        accessor: "email",
        disableSortBy: true,
      },
      {
        Header:"Phone",
        accessor: "phone",
        disableSortBy: true,
      },
      {
        Header: "Designation",
        accessor: "designation",
        disableSortBy: true,
        columnClassName: 'text-center',
      },
      {
        Header: "Role",
        accessor: "role",
        disableSortBy: true,
        columnClassName: 'text-center',
      },
      {
        Header: "Entity",
        accessor: "entity",
        disableSortBy: true,
        columnClassName: 'text-center',
        Cell: ({ row: { original } }: any) => {
          return (
            <StatusLabel
              type={original.entity}
              labelName={original.entity}
            />
          );
        },
      },
      {
        Header: "Institute",
        accessor: "institute",
        disableSortBy: true,
        columnClassName: 'text-center',
        Cell: ({ row: { original } }: any) => {
          return (
            <StatusLabel
              type={original.institute}
              labelName={original.institute}
            />
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        disableSortBy: true,
        columnClassName: 'text-center',
        Cell: ({ row: { original } }: any) => {
          return (
            <StatusLabel
              type={original.status}
              labelName={original.status}
            />
          );
        },
      },
     {
        Header: "Actions",
        filterable: false,
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return (
            <MenuOptionHrtl
              actionOptions={actionsList}
              rowId={original.studentId}
            />
          );
        },
      },
    ];
  }


export const dummyData = [
  {
    id: 1,
    name: "ABC Public School",
    createdDate: "2022-01-01",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "XYZ International",
    createdDate: "2022-01-02",
    status: "INACTIVE",
  },
  {
    id: 3,
    name: "PQR Public School",
    createdDate: "2022-01-03",
    status: "ACTIVE",
  },
  {
    id: 4,
    name: "MNO International",
    createdDate: "2022-01-04",
    status: "INACTIVE",
  },
];


export const dummyDataManageStaff = [
  {
    id: 1,
    name: "Amit Kumar",
    email: "amit.kumar@vidhyarthi.org.in",
    phone: "9876543210",
    designation: "Asst. Professor",
    role: "Teacher",
    entity: "School",
    institute: "ABC Public School",
    status: "ACTIVE",
  },
  {
    id: 2,
    name: "Anil Kumar",
    email: "anil.kumar@vidhyarthi.org.in",
    phone: "9123456789",
    designation: "Professor",
    role: "Teacher",
    entity: "School",
    institute: "XYZ International",
    status: "INACTIVE",
  },
  {
    id: 3,
    name: "Rahul Kumar",
    email: "rahul.kumar@vidhyarthi.org.in",
    phone: "9999999999",
    designation: "Asst. Professor",
    role: "Teacher",
    entity: "School",
    institute: "PQR Public School",
    status: "ACTIVE",
  },
  {
    id: 4,
    name: "Suresh Kumar",
    email: "suresh.kumar@vidhyarthi.org.in",
    phone: "8888888888",
    designation: "Professor",
    role: "Teacher",
    entity: "School",
    institute: "MNO International",
    status: "INACTIVE",
  },
];

export const menuOptions: Array<IMenuOptions> = [
    {
        id: "institute",
        labelName: "Institute"
    },
    {
        id: "manage-staff",
        labelName: "Manage Staff"
    }
];


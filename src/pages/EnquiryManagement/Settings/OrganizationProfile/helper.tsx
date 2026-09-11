import { MoreActions, StatusLabel } from "../../../../Components/Common";
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
        Header: "Status",
        accessor: "status",
        disableSortBy: true,
        columnClassName: 'tw-text-center',
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

export const menuOptions: Array<IMenuOptions> = [
    {
        id: "organization",
        labelName: "Organization Profile"
    },
    {
        id: "security",
        labelName: "Security"
    },
    {
        id: "enquiry-form-links",
        labelName: "Enquiry Form Links"
    }
];
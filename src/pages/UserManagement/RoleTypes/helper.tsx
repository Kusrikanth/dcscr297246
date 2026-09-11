import React from "react";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { default as UserLockSvg } from "../../../assets/imagesdps/academics/UserLockSvg.svg?react";
import Button from "../../../Components/Common/Button";

export function generateColumns(actionsList: Array<IOptionsHrtl>, setPermissionHndlr: any) {
  return [
    {
      Header: "Role Name",
      accessor: "name"
    },
    {
      Header: "User Type",
      accessor: "roleType",
      disableSortBy: true,
    },
    //   {
    //     Header: "Email ID",
    //     accessor: "emailId",
    //   },
    //   {
    //     Header: "User Name",
    //     accessor: "userName",
    //   },
    //   {
    //     Header: "Created Date",
    //     accessor: "createdDate",
    //   },
    //   {
    //     Header: "Status",
    //     accessor: "status",
    //     filterable: false,
    //     Cell: ({ row: { original } }: any) => {
    //       return (
    //         <StatusLabel type={original.status} labelName={original.status} />
    //       );
    //     },
    //   },
    {
      Header: "Actions",
      // filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <>
          <Button
            type="button"
            variant="primary"
            onClick={setPermissionHndlr}
            className="tw-flex tw-items-center"
          >
            <i className="ri-add-line tw-mr-2" />
            Create User
          </Button>
        </>
        // return (
        //   <MenuOptionHrtl
        //     actionOptions={actionsList}
        //     rowId={original.id}
        //     // isHorizontal={true}
        //   />
        // );
      },
    },
  ];
}

// <ul className="list-inline hstack gap-2 mb-0">
// {actionsList.map((item) => (
//   <React.Fragment key={item.id}>
//     <li
//       className="list-inline-item"
//       data-id={item.id}
//       onClick={item.onClickHndlr}
//       id={item.id}
//     >
//       {item.actionIcon}
//     </li>
//   </React.Fragment>
// ))}
// </ul>

export const RoleTypesData = [
  {
    id: 1,
    roleName: "Admin",
    userType: "Employee",
    status: "Active"
  }
]
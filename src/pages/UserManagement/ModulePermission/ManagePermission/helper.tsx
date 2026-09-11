import { useState } from "react";
import { Row } from "reactstrap";
import { InputCheckbox } from "../../../../Components/Common/InputCheckbox";
import { ManagePermissionTableType } from "../ModulePermissionTypes";
import EditableCell from "./EditableCheckbox";
import EditableLabeledCheckboxCell from "./EditableLabeledCheckbox";

export const MenuOptions: Array<any> = [
  {
    id: "branchSettings",
    labelName: "Branch Settings",
  },
  {
    id: "academics",
    labelName: "Academics",
  },
  //   {
  //     id: "module-level",
  //     labelName: "Module Level",
  //   },
  //   {
  //     id: "role-type",
  //     labelName: "Role Type",
  //   },
  //   {
  //     id: "master-fields",
  //     labelName: "Master Fields",
  //   },
  // {
  //     id: "user-fields",
  //     labelName: "User Fields"
  // },
  {
    id: "front-desk",
    labelName: "Front Desk",
  },
  {
    id: "directories",
    labelName: "Directories",
  },
  {
    id: "examination",
    labelName: "Examination",
  },
  {
    id: "fee-managment",
    labelName: "Fee Managment",
  },
  {
    id: "HRMs",
    labelName: "HRMs",
  },
  {
    id: "student-attendance",
    labelName: "Student Attendance",
  },
  {
    id: "user-managment",
    labelName: "User Managment",
  },
];
export const branchSettingPermissionTableData: Array<ManagePermissionTableType> =
  [
    {
      id: 222,
      submodule: "Branch Info",
      create: false,
      edit: true,
      view: true,
      delete: true,
    },
    {
      id: 333,
      submodule: "Branch Area",
      create: true,
      edit: true,
      view: true,
      delete: true,
    },
  ];
export const AcademicsPermissionTableData: Array<ManagePermissionTableType> = [
  {
    id: 222,
    submodule: "Class Managment",
    create: true,
    edit: true,
    view: true,
    delete: true,
  },
];
export const AcademicYesrPermissionTableData: Array<ManagePermissionTableType> =
  [
    {
      id: 222,
      submodule: "Dashboard",
      create: false,
      edit: true,
      view: true,
      delete: false,
    },
  ];
// const updatedData: any = [...BranchSettingPermissionTableData];
// const updateMydata = ({ index, id, value }: any) => {
//   updatedData[index][`${id}`] = value;
// };
export function generateColumns(updateMydata: any, checkAll: any, array: any) {
  return [
    {
      Header: "Submodule",
      accessor: "submodule",
      Cell: (data: any) =>
        EditableLabeledCheckboxCell({ ...data, array, checkAll }),
    },
    {
      Header: "Create",
      accessor: "create",
      Cell: (data: any) => EditableCell({ ...data, array, updateMydata }),
    },
    {
      Header: "Edit",
      accessor: "edit",
      Cell: (data: any) => EditableCell({ ...data, array, updateMydata }),
    },
    {
      Header: "View",
      accessor: "view",
      Cell: (data: any) => EditableCell({ ...data, array, updateMydata }),
    },
    {
      Header: "Delete",
      accessor: "delete",
      Cell: (data: any) => EditableCell({ ...data, array, updateMydata }),
    },
  ];
}

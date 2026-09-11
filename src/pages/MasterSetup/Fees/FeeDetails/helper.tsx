import {
  IOptionsHrtl,
  MoreActions, MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";
import { checkBoxOptionTypes, FeeNameTableData } from "./feeNameTypes";

export const selectData1 = [
  {
    yearType: "2022-23",
  },
  {
    yearType: "option2",
  },
  {
    yearType: "option3",
  },
];

export const selectData2 = [
  {
    departmentType: "Department",
  },
  {
    departmentType: "option2",
  },
  {
    departmentType: "option3",
  },
];

export const selectData3 = [
  {
    boardType: "Curriculum",
  },
  {
    boardType: "option2",
  },
  {
    boardType: "option3",
  },
];

export const selectData4 = [
  {
    id: "true",
    allowRefundType: "Yes",
  },
  {
    id: "false",
    allowRefundType: "No",
  },
];

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Department",
      accessor: "instituteDepartmentName",
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
      disableSortBy: true,
    },
    {
      Header: "Fee Type",
      accessor: "feeTypeName",
      disableSortBy: true,
    },
    {
      Header: "Allow Refunds",
      accessor: "isAllowRefund",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        const allowRefund = value ? "Yes" : "No";
        return (
          <span>{allowRefund}</span>
        );
      },
    },
    {
      Header: "Unform Slab",
      accessor: "uniformSlab",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        const allowRefund = value ? "Yes" : "No";
        return (
          <span>{allowRefund}</span>
        );
      },
    },
    {
      Header: "Allow Student Concessions",
      accessor: "studentConcession",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        const allowRefund = value ? "Yes" : "No";
        return (
          <span>{allowRefund}</span>
        );
      },
    },
    {
      Header: "Allow Employee Concessions",
      accessor: "employeeConcession",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        const allowRefund = value ? "Yes" : "No";
        return (
          <span>{allowRefund}</span>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original?.instituteFeeNameId} />
        );
      },
    },
  ];
}

export const menuItems = [
  {
    value: "Yes",
  },
  {
    value: "No",
  },
];

export const FeeNameData: Array<FeeNameTableData> = [
  {
    id: 1,
    department: "Academics",
    feeName: "Tution Fee1",
    feeType: "One Time Fee",
    allowRefunds: "Yes",
    unformSlab: "Yes",
    allowStudentConcessions: "Yes",
    allowEmployeeConcessions: "Yes",
  },
  {
    id: 2,
    department: "Academics",
    feeName: "Tution Fee2",
    feeType: "One Time Fee",
    allowRefunds: "Yes",
    unformSlab: "Yes",
    allowStudentConcessions: "Yes",
    allowEmployeeConcessions: "Yes",
  },
  {
    id: 3,
    department: "Academics",
    feeName: "Tution Fee3",
    feeType: "One Time Fee",
    allowRefunds: "Yes",
    unformSlab: "Yes",
    allowStudentConcessions: "Yes",
    allowEmployeeConcessions: "Yes",
  },
  {
    id: 4,
    department: "Academics",
    feeName: "Tution Fee4",
    feeType: "One Time Fee",
    allowRefunds: "Yes",
    unformSlab: "Yes",
    allowStudentConcessions: "Yes",
    allowEmployeeConcessions: "Yes",
  },
  {
    id: 5,
    department: "Academics",
    feeName: "Tution Fee5",
    feeType: "One Time Fee",
    allowRefunds: "Yes",
    unformSlab: "Yes",
    allowStudentConcessions: "Yes",
    allowEmployeeConcessions: "Yes",
  },
  {
    id: 6,
    department: "Academics",
    feeName: "Tution Fee6",
    feeType: "One Time Fee",
    allowRefunds: "Yes",
    unformSlab: "Yes",
    allowStudentConcessions: "Yes",
    allowEmployeeConcessions: "Yes",
  },
  {
    id: 7,
    department: "Academics",
    feeName: "Tution Fee7",
    feeType: "One Time Fee",
    allowRefunds: "Yes",
    unformSlab: "Yes",
    allowStudentConcessions: "Yes",
    allowEmployeeConcessions: "Yes",
  },
  {
    id: 8,
    department: "Academics",
    feeName: "Tution Fee8",
    feeType: "One Time Fee",
    allowRefunds: "Yes",
    unformSlab: "Yes",
    allowStudentConcessions: "Yes",
    allowEmployeeConcessions: "Yes",
  },
  {
    id: 9,
    department: "Academics",
    feeName: "Tution Fee9",
    feeType: "One Time Fee",
    allowRefunds: "Yes",
    unformSlab: "Yes",
    allowStudentConcessions: "Yes",
    allowEmployeeConcessions: "Yes",
  },
  {
    id: 10,
    department: "Academics",
    feeName: "Tution Fee10",
    feeType: "One Time Fee",
    allowRefunds: "Yes",
    unformSlab: "Yes",
    allowStudentConcessions: "Yes",
    allowEmployeeConcessions: "Yes",
  },
];

export const allowConcessionOptions: Array<checkBoxOptionTypes> = [
  {
    name: "studentConcession",
    label: "Student Concession",
  },
  {
    name: "employeeConcession",
    label: "Employee Concession",
  },
];

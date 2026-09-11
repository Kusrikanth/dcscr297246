import {
  IOptionsHrtl,
   MenuOptionHrtl,
} from "../../../Components/Common/MenuOptions";
import { checkBoxOptionTypes, FeeNameTableData } from "./feeNameTypes";
import { default as CorrectIcon } from "../../../assets/imagesdps/common_icon/correct_icon.svg?react";
import { default as WrongIcon } from "../../../assets/imagesdps/common_icon/wrong_icon.svg?react";

export const studentCategoryOptions = [
  {
    id: "ALL",
    name: "All"
  },
  {
    id: "OLD",
    name: "Old"
  },
  {
    id: "NEW",
    name: "New"
  }
]

function getFeeParticularActions(actions: any, isFeeParticularAssignToAnyClass: boolean) {
  if (isFeeParticularAssignToAnyClass) {
    return actions.filter((item: any) => item.id !== "delete");
  }
  return actions;
}


export function generateColumns(actionsList: Array<IOptionsHrtl>, offset: any) {
  return [
    {
      Header: "S.No",
      disableSortBy: true,
      Cell: ({ row: { index } }: any) => {
        const sNo = !isNaN(offset) ? (+offset + (index + 1)) : (index + 1);
        return (
          <span>{sNo}</span>
        );
      },
    },
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
    },
    {
      Header: "Fee Particulars",
      accessor: "particularName",
    },
    {
      Header: "Fee Type",
      accessor: "feeType",
      disableSortBy: true,
    },
    {
      Header: "Student Category",
      accessor: "studentCategory",
      disableSortBy: true,
    },
    {
      Header: "Student Concessions",
      accessor: "allowStudentConcession",
      disableSortBy: true,
      columnClassName: 'text-center',
      Cell: ({ value }: any) => {
        const allowedStudentConcession = (value === "YES") ? <CorrectIcon style={{ width: "15px" }} /> : <WrongIcon style={{ width: "13px" }} />;
        return (
          <span>{allowedStudentConcession}</span>
        );
      },
    },
    {
      Header: "Employee Concessions",
      accessor: "allowEmployeeConcession",
      disableSortBy: true,
      columnClassName: 'text-center',
      Cell: ({ value }: any) => {
        const allEmployeeConcession = (value === "YES") ? <CorrectIcon style={{ width: "15px" }} /> : <WrongIcon style={{ width: "13px" }} />;
        return (
          <span>{allEmployeeConcession}</span>
        );
      },
    },
    {
      Header: "Refund",
      accessor: "allowRefunds",
      disableSortBy: true,
      columnClassName: 'text-center',
      Cell: ({ value }: any) => {
        const allowRefund = (value === "YES") ? <CorrectIcon style={{ width: "15px" }} /> : <WrongIcon style={{ width: "13px" }} />;
        return (
          <span>{allowRefund}</span>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { isFeeParticularAssignToAnyClass } = original;
        const feeParticularAction = getFeeParticularActions(actionsList, isFeeParticularAssignToAnyClass);
        return (
          <MenuOptionHrtl actionOptions={feeParticularAction} rowId={original?.id} />
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

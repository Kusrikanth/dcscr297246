import { default as CorrectIcon } from "../../../../assets/imagesdps/common_icon/correct_icon.svg?react";
import { default as WrongIcon } from "../../../../assets/imagesdps/common_icon/wrong_icon.svg?react";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";

export const feeTypeMenu = [
  {
    feeType: "Term Wise Fee",
  },
  {
    feeType: "One Time Fee",
  },
];

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return row.index + 1
      }
    },
    {
      Header: "Fee Particulars",
      accessor: "feeName",
    },
    {
      Header: "Fee Type",
      accessor: "feeType",
      disableSortBy: true,
    },
    {
      Header: "Student Concessions",
      accessor: "isAllowStudentConcession",
      disableSortBy: true,
      columnClassName: 'tw-text-center',
      Cell: ({ value }: any) => {
        const allowedStudentConcession = (value === "YES") ? <CorrectIcon style={{ width: "15px" }} /> : <WrongIcon style={{ width: "13px" }} />;
        return (
          <span>{allowedStudentConcession}</span>
        );
      },
    },
    {
      Header: "Employee Concessions",
      accessor: "isAllowEmployeeConcession",
      disableSortBy: true,
      columnClassName: 'tw-text-center',
      Cell: ({ value }: any) => {
        const allEmployeeConcession = (value === "YES") ? <CorrectIcon style={{ width: "15px" }} /> : <WrongIcon style={{ width: "13px" }} />;
        return (
          <span>{allEmployeeConcession}</span>
        );
      },
    },
    {
      Header: "Refund",
      accessor: "isAllowRefunds",
      disableSortBy: true,
      columnClassName: 'tw-text-center',
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
        return (
          <MenuOptionHrtl actionOptions={actionsList}  rowId={original?.hostelFeeTypeId} />
        );
      },
    },
  ];
}

export const ignoredKeys = ["searchString", "curriculumId", "hostelId"]
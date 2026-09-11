import { default as RupeeSvg } from "../../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { StatusLabel } from "../../../../../Components/Common";
import { NewStudentTableData } from "./newStudentTypes";

export const selectData1 = [
  {
    receiptType: "School",
  },
  {
    receiptType: "option2",
  },
  {
    receiptType: "option3",
  },
];

export const selectData2 = [
  {
    academicYearType: "2022-23",
  },
  {
    academicYearType: "option2",
  },
  {
    academicYearType: "option3",
  },
];

export const selectData3 = [
  {
    curriculumType: "CBSE",
  },
  {
    curriculumType: "option2",
  },
  {
    curriculumType: "option3",
  },
];

export const selectData4 = [
  {
    methodType: "Payment Method",
  },
  {
    methodType: "option2",
  },
  {
    methodType: "option3",
  },
];

export const selectData5 = [
  {
    receiptForType: "Existing Student",
  },
  {
    receiptForType: "option2",
  },
  {
    receiptForType: "option3",
  },
];
export const selectData7 = [
  {
    paymentMode: "Online",
  },
  {
    paymentMode: "Cash",
  },
  {
    paymentMode: "Check",
  },
];

export const selectData6 = [
  {
    classType: "VII",
  },
  {
    classType: "option2",
  },
  {
    classType: "option3",
  },
];

export function generateColumns() {
  return [
    {
      Header: "Academic Year",
      accessor: "academicYear",
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
    },
    {
      Header: "Payable Amount",
      accessor: "payableAmount",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{original?.payableAmount}</span>
          </div>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.status} labelName={original.status} />
        );
      },
    },
    {
      Header: "Amount Due",
      accessor: "amountDue",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{original?.amountDue}</span>
          </div>
        );
      },
    },
  ];
}

export const NewStudentData: Array<NewStudentTableData> = [
  {
    id: 1,
    academicYear: "2022-23",
    feeName: "Tution Fee",
    payableAmount: 14245,
    status: "inactive",
    amountDue: 14245,
  },
];

import { default as RupeeSvg } from "../../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { StatusLabel } from "../../../../../Components/Common";
import { AdjustmentTableDataTypes } from "./refundDetailsType";

export function generateColumns() {
  return [
    {
      Header: "Fee Name",
      accessor: "feeName",
    },
    {
      Header: "Amount Payable",
      accessor: "amountPayable",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill="#999999" />
            <span>{original?.amountPayable}</span>
          </div>
        );
      },
    },
    {
      Header: "Amount Paid",
      accessor: "amountPaid",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill="#999999" />
            <span>{original?.amountPaid}</span>
          </div>
        );
      },
    },
    {
      Header: "Concession",
      accessor: "concession",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill="#999999" />
            <span>{original?.concession}</span>
          </div>
        );
      },
    },
    {
      Header: "Fine",
      accessor: "fine",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill="#999999" />
            <span>{original?.fine}</span>
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
      Header: "Amount to Pay",
      accessor: "amountToPay",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill="#999999" />
            <span>{original?.amountToPay}</span>
          </div>
        );
      },
    },
    {
      Header: "Adjust Amount",
      accessor: "adjustAmount",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="input-group input-group-sm">
            <span className="input-group-text bg-white border-end-0">
              <RupeeSvg width="11px" height="11px" fill="#999999" />
            </span>
            <input type="text" className="form-control border-start-0" />
          </div>
        );
      },
    },
  ];
}

export const AdjustmentTableData: Array<AdjustmentTableDataTypes> = [
  {
    id: 1,
    feeName: "Tuition Fee1",
    amountPayable: 121540,
    amountPaid: 121540,
    concession: 121540,
    fine: 121540,
    status: "Unpaid",
    amountToPay: 121540,
    adjustAmount: "",
  },
  {
    id: 2,
    feeName: "Tuition Fee2",
    amountPayable: 121540,
    amountPaid: 121540,
    concession: 121540,
    fine: 121540,
    status: "Unpaid",
    amountToPay: 121540,
    adjustAmount: "",
  },
];

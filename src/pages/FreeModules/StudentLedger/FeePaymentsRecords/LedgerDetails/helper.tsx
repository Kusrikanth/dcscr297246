import { default as RupeeSvg } from "../../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { StatusLabel } from "../../../../../Components/Common";
import { LedgerDetailsDataTypes } from "./LedgerDetailsTypes";

export function generateColumns() {
  return [
    {
      Header: "Fee Details",
      accessor: "feeDetails",
    },
    {
      Header: "Last Date",
      accessor: "lastDate",
    },
    {
      Header: "Fee Amount (₹)",
      accessor: "feeAmount",
      Cell: ({ row: { original } }: any) => {
        return (
            <span>{original?.feeAmount}</span>
        );
      },
    },
    {
      Header: "Concession (₹)",
      accessor: "concession",
      Cell: ({ row: { original } }: any) => {
        return (
            <span>{original?.concession}</span>
        );
      },
    },
    {
      Header: "Card Charges (₹)",
      accessor: "cardCharges",
      Cell: ({ row: { original } }: any) => {
        return (
            <span>{original?.cardCharges}</span>
         
        );
      },
    },
    {
      Header: "Fine (₹)",
      accessor: "fine",
      Cell: ({ row: { original } }: any) => {
        return (
            <span>{original?.fine}</span>
        );
      },
    },
    {
      Header: "Amount to Pay",
      accessor: "amounttoPay",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{original?.amounttoPay}</span>
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
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{original?.amountPaid}</span>
          </div>
        );
      },
    },
    {
      Header: "Balance Amt",
      accessor: "balanceAmt",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#212529"} />
            <span>{original?.balanceAmt}</span>
          </div>
        );
      },
    },
    {
      Header: "Refund Amt",
      accessor: "refundAmt",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#212529"} />
            <span>{original?.refundAmt}</span>
          </div>
        );
      },
    },
    {
      Header: "Remarks",
      accessor: "remarks",
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
  ];
}

export const LedgerDetailsData: Array<LedgerDetailsDataTypes> = [
  {
    id: 1,
    feeDetails: "Tuition Fee1",
    lastDate: "June 17,2022",
    feeAmount: "46000.00",
    concession: "00.00",
    cardCharges: "00.00",
    fine: "00.00",
    amounttoPay: "46000.00",
    amountPaid: "46000.00",
    balanceAmt: "00.00",
    refundAmt: "00.00",
    remarks: "",
    status: "Active",
  },
  {
    id: 2,
    feeDetails: "Tuition Fee2",
    lastDate: "June 17,2022",
    feeAmount: "46000.00",
    concession: "00.00",
    cardCharges: "00.00",
    fine: "00.00",
    amounttoPay: "46000.00",
    amountPaid: "46000.00",
    balanceAmt: "00.00",
    refundAmt: "00.00",
    remarks: "",
    status: "Active",
  },
  {
    id: 3,
    feeDetails: "Tuition Fee3",
    lastDate: "June 17,2022",
    feeAmount: "46000.00",
    concession: "00.00",
    cardCharges: "00.00",
    fine: "00.00",
    amounttoPay: "46000.00",
    amountPaid: "46000.00",
    balanceAmt: "00.00",
    refundAmt: "00.00",
    remarks: "",
    status: "Active",
  },
  {
    id: 4,
    feeDetails: "Tuition Fee4",
    lastDate: "June 17,2022",
    feeAmount: "46000.00",
    concession: "00.00",
    cardCharges: "00.00",
    fine: "00.00",
    amounttoPay: "46000.00",
    amountPaid: "46000.00",
    balanceAmt: "00.00",
    refundAmt: "00.00",
    remarks: "",
    status: "Active",
  },
  {
    id: 5,
    feeDetails: "Tuition Fee5",
    lastDate: "June 17,2022",
    feeAmount: "46000.00",
    concession: "00.00",
    cardCharges: "00.00",
    fine: "00.00",
    amounttoPay: "46000.00",
    amountPaid: "46000.00",
    balanceAmt: "00.00",
    refundAmt: "00.00",
    remarks: "",
    status: "Active",
  },
  {
    id: 6,
    feeDetails: "Tuition Fee6",
    lastDate: "June 17,2022",
    feeAmount: "46000.00",
    concession: "00.00",
    cardCharges: "00.00",
    fine: "00.00",
    amounttoPay: "46000.00",
    amountPaid: "46000.00",
    balanceAmt: "00.00",
    refundAmt: "00.00",
    remarks: "",
    status: "Active",
  },
  {
    id: 7,
    feeDetails: "Tuition Fee7",
    lastDate: "June 17,2022",
    feeAmount: "46000.00",
    concession: "00.00",
    cardCharges: "00.00",
    fine: "00.00",
    amounttoPay: "46000.00",
    amountPaid: "46000.00",
    balanceAmt: "00.00",
    refundAmt: "00.00",
    remarks: "",
    status: "Active",
  },
  {
    id: 8,
    feeDetails: "Tuition Fee8",
    lastDate: "June 17,2022",
    feeAmount: "46000.00",
    concession: "00.00",
    cardCharges: "00.00",
    fine: "00.00",
    amounttoPay: "46000.00",
    amountPaid: "46000.00",
    balanceAmt: "00.00",
    refundAmt: "00.00",
    remarks: "",
    status: "Active",
  },
  {
    id: 9,
    feeDetails: "Tuition Fee9",
    lastDate: "June 17,2022",
    feeAmount: "46000.00",
    concession: "00.00",
    cardCharges: "00.00",
    fine: "00.00",
    amounttoPay: "46000.00",
    amountPaid: "46000.00",
    balanceAmt: "00.00",
    refundAmt: "00.00",
    remarks: "",
    status: "Active",
  },
  {
    id: 10,
    feeDetails: "Tuition Fee10",
    lastDate: "June 17,2022",
    feeAmount: "46000.00",
    concession: "00.00",
    cardCharges: "00.00",
    fine: "00.00",
    amounttoPay: "46000.00",
    amountPaid: "46000.00",
    balanceAmt: "00.00",
    refundAmt: "00.00",
    remarks: "",
    status: "Active",
  },
];

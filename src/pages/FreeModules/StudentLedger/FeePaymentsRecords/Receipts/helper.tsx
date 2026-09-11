import { default as RupeeSvg } from "../../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { StatusLabel } from "../../../../../Components/Common";
import { ReceiptsDataTypes } from "./LedgerDetailsTypes";

export function generateColumns() {
  return [
    {
      Header: "Date",
      accessor: "date",
    },
    {
      Header: "Receipt No",
      accessor: "receiptNo",
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
    },
    {
      Header: "Payment Mode",
      accessor: "paymentMode",
    },
    {
      Header: "Actual Amount",
      accessor: "actualAmount",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{original?.actualAmount}</span>
          </div>
        );
      },
    },
    {
      Header: "Paid Amount",
      accessor: "paidAmount",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{original?.paidAmount}</span>
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
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{original?.fine}</span>
          </div>
        );
      },
    },
    {
      Header: "Card Charges",
      accessor: "cardCharges",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <RupeeSvg width="11px" height="11px" fill={"#495057"} />
            <span>{original?.cardCharges}</span>
          </div>
        );
      },
    },
    {
      Header: "Refunded Status",
      accessor: "refundedStatus",
    },
    {
      Header: "Reference No",
      accessor: "referenceNo",
    },
    {
      Header: "Cheque Status",
      accessor: "chequeStatus",
    },
    {
      Header: "Receipt Status",
      accessor: "receiptStatus",
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.receiptStatus}
            labelName={original.receiptStatus}
          />
        );
      },
    },
    {
      Header: "Remarks",
      accessor: "remarks",
    },
  ];
}

export const ReceiptsData: Array<ReceiptsDataTypes> = [
  {
    id: 1,
    date: "June 17,2022",
    receiptNo: "456123",
    feeName: "colleage",
    paymentMode: "online",
    actualAmount: "00.00",
    paidAmount: "00.00",
    fine: "46000.00",
    cardCharges: "46000.00",
    refundedStatus: "",
    referenceNo: "110326176664",
    chequeStatus: "",
    receiptStatus: "",
    remarks: "",
  },
  {
    id: 2,
    date: "June 17,2022",
    receiptNo: "456123",
    feeName: "colleage",
    paymentMode: "online",
    actualAmount: "00.00",
    paidAmount: "00.00",
    fine: "46000.00",
    cardCharges: "46000.00",
    refundedStatus: "",
    referenceNo: "110326176664",
    chequeStatus: "",
    receiptStatus: "",
    remarks: "",
  },
  {
    id: 3,
    date: "June 17,2022",
    receiptNo: "456123",
    feeName: "colleage",
    paymentMode: "online",
    actualAmount: "00.00",
    paidAmount: "00.00",
    fine: "46000.00",
    cardCharges: "46000.00",
    refundedStatus: "",
    referenceNo: "110326176664",
    chequeStatus: "",
    receiptStatus: "",
    remarks: "",
  },
  {
    id: 4,
    date: "June 17,2022",
    receiptNo: "456123",
    feeName: "colleage",
    paymentMode: "online",
    actualAmount: "00.00",
    paidAmount: "00.00",
    fine: "46000.00",
    cardCharges: "46000.00",
    refundedStatus: "",
    referenceNo: "110326176664",
    chequeStatus: "",
    receiptStatus: "",
    remarks: "",
  },
  {
    id: 5,
    date: "June 17,2022",
    receiptNo: "456123",
    feeName: "colleage",
    paymentMode: "online",
    actualAmount: "00.00",
    paidAmount: "00.00",
    fine: "46000.00",
    cardCharges: "46000.00",
    refundedStatus: "",
    referenceNo: "110326176664",
    chequeStatus: "",
    receiptStatus: "",
    remarks: "",
  },
  {
    id: 6,
    date: "June 17,2022",
    receiptNo: "456123",
    feeName: "colleage",
    paymentMode: "online",
    actualAmount: "00.00",
    paidAmount: "00.00",
    fine: "46000.00",
    cardCharges: "46000.00",
    refundedStatus: "",
    referenceNo: "110326176664",
    chequeStatus: "",
    receiptStatus: "",
    remarks: "",
  },
  {
    id: 7,
    date: "June 17,2022",
    receiptNo: "456123",
    feeName: "colleage",
    paymentMode: "online",
    actualAmount: "00.00",
    paidAmount: "00.00",
    fine: "46000.00",
    cardCharges: "46000.00",
    refundedStatus: "",
    referenceNo: "110326176664",
    chequeStatus: "",
    receiptStatus: "",
    remarks: "",
  },
  {
    id: 8,
    date: "June 17,2022",
    receiptNo: "456123",
    feeName: "colleage",
    paymentMode: "online",
    actualAmount: "00.00",
    paidAmount: "00.00",
    fine: "46000.00",
    cardCharges: "46000.00",
    refundedStatus: "",
    referenceNo: "110326176664",
    chequeStatus: "",
    receiptStatus: "",
    remarks: "",
  },
  {
    id: 9,
    date: "June 17,2022",
    receiptNo: "456123",
    feeName: "colleage",
    paymentMode: "online",
    actualAmount: "00.00",
    paidAmount: "00.00",
    fine: "46000.00",
    cardCharges: "46000.00",
    refundedStatus: "",
    referenceNo: "110326176664",
    chequeStatus: "",
    receiptStatus: "",
    remarks: "",
  },
  {
    id: 10,
    date: "June 17,2022",
    receiptNo: "456123",
    feeName: "colleage",
    paymentMode: "online",
    actualAmount: "00.00",
    paidAmount: "00.00",
    fine: "46000.00",
    cardCharges: "46000.00",
    refundedStatus: "",
    referenceNo: "110326176664",
    chequeStatus: "",
    receiptStatus: "",
    remarks: "",
  },
];

import { StatusLabel } from "../../../../Components/Common";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import { IOptionsHrtl } from "./StudentLedgerTypes";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
      {
        Header: "Fee Details",
        accessor: "feeDetails",
        disableSortBy: true,
        
      },
      {
        Header: "Last Date",
        accessor: "lastDate",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return <span className="tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.lastDate)}</span>
        },
       
      },
      {
        Header: "Fee Amount (₹)",
        accessor: "feeAmount",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return <span>{getDisplayAmountValue(original?.amountToPay)}</span>
        },
      },
      {
        Header: "Concession (₹)",
        accessor: "totalConcession",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return <span>{getDisplayAmountValue(original?.totalConcession)}</span>
        },
      },
      {
        Header: "Amount to Pay (₹)",
        accessor: "amountToPay",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return <span>{getDisplayAmountValue(original?.netAmount)}</span>
        },
      },
      {
        Header: "Amount Paid (₹)",
        accessor: "amountPaid",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return <span>{getDisplayAmountValue(original?.amountPaid)}</span>
        },
      },
      {
        Header: "Balance Amt (₹)",
        accessor: "netAmount",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return <span>{getDisplayAmountValue(original?.amountToBePaid)}</span>
        },
      },
      {
        Header: "Excess Amt (₹)",
        accessor: "excessAmount",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            return <span>{getDisplayAmountValue(original?.excessAmount)}</span>
        },
      },
      {
        Header: "Refund Amt (₹)",
        accessor: "refundedAmount",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return <span>{getDisplayAmountValue(original?.refundedAmount)}</span>
        },
      },
      {
        Header: "Remarks",
        accessor: "remarks",
        disableSortBy: true,
      },
      {
        Header: "Status",
        accessor: "status",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            return (
              <StatusLabel type={original.paymentStatus} labelName={original.paymentStatus} />
            );
          },
      },
      // {
      //   Header: "Actions",
      //   filterable: false,
      //   disableSortBy: true,
      //   Cell: ({ row: { original } }: any) => {
      //     return (
      //       <MoreActions actionOptions={actionsList} rowId={original.id} isHorizontal={true}/>
      //     );
      //   },
      // },
    ];
  }

  export const StudentLedgerData = [
    {
        feeDetails : "Tuition Fee1",
        lastDate : "June 17,2022",
        feeAmt : "₹ 46000.00",
        concession:"₹ 00.00",
        cardCharges:"₹ 00.00",
        fine:"₹ 00.00",
        amountToPay:"₹ 46000.00",
        amountPaid:"₹ 46000.00",
        balanceAmt:"₹ 00.00",
        refundAmt:"₹ 00.00",
        remarks:"remarks",
        status:"ACTIVE"
    }
  ]

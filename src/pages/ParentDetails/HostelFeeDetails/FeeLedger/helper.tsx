import { StatusLabel } from "../../../../Components/Common";
import { MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { getDisplayDateForTableFormat } from "../../../../utility/dateutility";


export const TermData = [
  {
    type: "Term Wise",
    value: "termWise"
  },
  {
    type: "One Time",
    value: "oneTime"
  }
];


export function generateLedgerColumns() {
  return ([
    {
      Header: "Fee Details",
      accessor: "feeDetails",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px]",
    },
    {
      Header: "Last Date",
      accessor: "lastDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-text-nowrap">{getDisplayDateForTableFormat(original.lastDate)}</span>
      },
    },
    {
      Header: "Fee Amount (₹)",
      accessor: "amountToPay",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountToPay)}</span>
      },
    },
    {
      Header: "Concession (₹)",
      accessor: "totalConcession",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.totalConcession)}</span>
      },
    },
    {
      Header: "Amount To Pay (₹)",
      accessor: "netAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.netAmount)}</span>
      },
    },
    {
      Header: "Amount Paid (₹)",
      accessor: "amountPaid",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountPaid)}</span>
      },
    },
    {
      Header: "Balance (₹)",
      accessor: "balance",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.balance)}</span>
      },
    },
    {
      Header: "Refund Amt (₹)",
      accessor: "refundedAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.refundedAmount)}</span>
      },
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "paymentStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <StatusLabel type={original.paymentStatus} labelName={original.paymentStatus} />
      },
    },
  ])
}

export function generateReceiptColumns(menuOptions: any) {
  return ([
    {
      Header: "Date",
      accessor: "receiptDate",
      disableSortBy: true,
      columnClassName: "tw-w-[120px] tw-min-w-[120px]",
      Cell: ({ row: { original } }: any) => {
        return getDisplayDateForTableFormat(original.receiptDate)
      },
    },
    {
      Header: "Receipt No",
      accessor: "receiptNo",
      disableSortBy: true
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px]",
      Cell: ({ row: { original } }: any) => {
        let abc = ""
        original.feeDetailVOList?.map((fee: any, index: any) => {
          abc = abc + fee.feeDetail + ((index !== (original.feeDetailVOList.length - 1)) ? "," : "")
        })
        return abc;
      }
    },
    {
      Header: "Payment Mode",
      accessor: "paymentMode",
      disableSortBy: true
    },
    {
      Header: "Actual Amount",
      accessor: "netAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(original?.netAmount)}</span>
      },
    },
    {
      Header: "Paid Amount",
      accessor: "paidAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(original?.paidAmount)}</span>
      },
    },
    {
      Header: "Fine",
      accessor: "fineAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(original?.fineAmount)}</span>
      },
    },
    {
      Header: "Card Charges",
      accessor: "cardCharges",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(original?.cardCharges)}</span>
      },
    },
    {
      Header: "Reference No",
      accessor: "transactionId",
      disableSortBy: true,

    },
    {
      Header: "Cheque Status",
      accessor: "chequeStatus",
      disableSortBy: true
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={menuOptions}
            rowId={original.feeReceiptId}
          // isHorizontal={true}
          />
        );
      },
    },
  ])
}
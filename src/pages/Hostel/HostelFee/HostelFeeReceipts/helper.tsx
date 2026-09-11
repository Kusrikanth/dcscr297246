import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import {
  StatusLabel,
  TextInput,
  UserDetails,
} from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../../utility/commonutility";

export const paymentModeOptions = [
  {
    id: "CASH",
    name: "CASH",
    selected: false
  },
  {
    id: "ONLINE",
    name: "ONLINE",
    selected: false
  },
  {
    id: "CARD_PAYMENT",
    name: "CARD PAYMENT",
    selected: false
  },
  {
    id: "UPI",
    name: "UPI",
    selected: false
  },
  {
    id: "CHEQUE",
    name: "CHEQUE",
    selected: false
  },
  {
    id: "DD",
    name: "DD",
    selected: false
  },
  {
    id: "ONLINE_PG",
    name: "ONLINE PG",
    selected: false
  },
  {
    id: "JODO_PAY",
    name: "JODO PAY",
    selected: false
  },
  {
    id: "NO_PAY",
    name: "NO PAY",
    selected: false
  },
  {
    id: "JODO",
    name: "JODO",
    selected: false
  },
  {
    id: "JODO_QR",
    name: "JODO QR",
    selected: false
  },
  {
    id: "JODO_FLEX",
    name: "JODO FLEX",
    selected: false
  },
  {
    id: "JODO_CRED",
    name: "JODO CRED",
    selected: false
  },
  {
    id:"NET_BANKING",
    name:"NET BANKING",
    selected: false
  }
]

export const studentTypeOptions = [
  {
    id:"EXISTING_STUDENT",
    name: "Existing Student"
  },
  {
    id:"NEW_STUDENT",
    name: "New Student"
  }
]

export const receiptTypeOptions = [
  {
    id: "SCHOOL",
    name: "School",
    selected: false,
  },
  {
    id: "BANK",
    name: "Bank",
    selected: false,
  }
]

export function feeDetailsColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "#Previous Receipt No",
      accessor: "previousReceiptNo",
      disableSortBy: true
    },
    {
      Header: "Fee Names",
      accessor: "feeNames",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <TextInput
              name={'receiptNo'}
              value={original?.receiptNo}
              formgroupClassName="tw-mb-0"
              inputClassName="tw-border-0"
              onChange={undefined}
              isDisabled={true}
            />
          </>
        );
      },
    },
    {
      Header: "Amount Payable",
      accessor: "amountPayable",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="tw-flex tw-items-center tw-w-[120px] tw-border tw-border-gray-300 tw-rounded tw-overflow-hidden">
              <span className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-bg-gray-100 tw-border-r">
                <RupeeSvg width="11px" height="11px" fill="#878a99" />
              </span>
              <input
                type="text"
                className="tw-w-full tw-text-sm tw-px-2 tw-py-1 tw-outline-none tw-bg-gray-100"
                value={original.amountPayable} />
            </div>
          </>
        );
      },

    },
    {
      Header: "Amount Paid",
      accessor: "amountPaid",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="tw-flex tw-items-center tw-w-[120px] tw-border tw-border-gray-300 tw-rounded tw-overflow-hidden">
              <span className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-bg-gray-100 tw-border-r">
                <RupeeSvg width="11px" height="11px" fill="#878a99" />
              </span>
              <input
                type="text"
                className="tw-w-full tw-text-sm tw-px-2 tw-py-1 tw-outline-none tw-bg-gray-100" 
                value={original.amountPayable} />
            </div>
          </>
        );
      },
    },
    {
      Header: "Concession",
      accessor: "concession",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="tw-flex tw-items-center tw-w-[120px] tw-border tw-border-gray-300 tw-rounded tw-overflow-hidden">
              <span className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-bg-gray-100 tw-border-r">
                <RupeeSvg width="11px" height="11px" fill="#878a99" />
              </span>
              <input
                type="text"
                className="tw-w-full tw-text-sm tw-px-2 tw-py-1 tw-outline-none tw-bg-gray-100"
                value={original.concession} />
            </div>
          </>
        );
      },
    },
    {
      Header: "Fine",
      accessor: "fine",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="tw-flex tw-items-center tw-w-[120px] tw-border tw-border-gray-300 tw-rounded tw-overflow-hidden">
              <span className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-bg-gray-100 tw-border-r">
                <RupeeSvg width="11px" height="11px" fill="#878a99" />
              </span>
              <input
                type="text"
                className="tw-w-full tw-text-sm tw-px-2 tw-py-1 tw-outline-none tw-bg-gray-100"
                value={original.fine} />
            </div>
          </>
        );
      },
    },
    {
      Header: "Amount to Pay",
      accessor: "amounttoPay",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="tw-flex tw-items-center tw-w-[120px] tw-border tw-border-gray-300 tw-rounded tw-overflow-hidden">
              <span className="tw-flex tw-items-center tw-justify-center tw-px-2 tw-bg-gray-100 tw-border-r">
                <RupeeSvg width="11px" height="11px" fill="#878a99" />
              </span>
              <input
                type="text"
                className="tw-w-full tw-text-sm tw-px-2 tw-py-1 tw-outline-none tw-bg-gray-100"
                value={original.amounttoPay} />
            </div>
          </>
        );
      },
    }
  ];
}
export function generateColumns(
  actionsList: Array<IOptionsHrtl>,
  viewReceiptDetailsHndlr: any
) {
  return [
    {
      Header: "Receipt No.",
      accessor: "receiptNo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div className="tw-text-blue-600 tw-cursor-pointer"
              data-id={original.feeReceiptId}
              onClick={viewReceiptDetailsHndlr}>
              {original.receiptNo}
            </div>
          </>
        );
      },
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        const { studentName,studentCode } = original || {};
        return (
          <>
            <UserDetails
              displayName={studentName}
              showAvatar={false}
              displayId={studentCode}
            />
          </>
        );
      },
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="tw-text-nowrap">{original?.className}</span>)
      },
    },
    {
      Header: "Receipt Date",
      accessor: "receiptDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.receiptDate)}</span>)
      },
    },
    {
      Header: "Total Amount Paid (₹)",
      accessor: "totalPaidAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.totalPaidAmount)}</span>
        );
      },
    },
    {
      Header: "Payment Mode",
      accessor: "paymentMode",
      disableSortBy: true,
    },
    {
      Header: "Settlement UTR",
      accessor: "settlementUtr",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original?.settlementUtr || "-"}</span>
        );
      },
    },
    {
      Header: "Settlement Date",
      accessor: "settlementDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original?.settlementDate ? getDdMmYyyyWithMonthNameFormat(original?.settlementDate) : "-"}</span>
        );
      },
    },
    {
      Header: "Ref No.",
      accessor: "transactionId",
      disableSortBy: true,
    },
    // {
    //   Header: "Cheque Status",
    //   accessor: "chequeStatus",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     const data = original?.chequeStatus?.split(" ")[0]
    //     return (
    //       <StatusLabel type={data} labelName={data} />
    //     );
    //   },
    // },
    {
      Header: "Fine Amount (₹)",
      accessor: "fineAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.fineAmount)}</span>
        );
      },
    },
    // {
    //   Header: "Cashier",
    //   accessor: "cashier",
    //   disableSortBy: true,
    // },
    {
      Header:"Created By",
      accessor:"createdBy",
      disableSortBy:true,
      Cell:({row:{original}}:any)=>{
        return <span>{original.createdBy ? original.createdBy : "-"}</span>
      }
    },
    {
        Header: "Created Date",
        accessor: "createdAt",
        disableSortBy: true,
        Cell:({row:{original}}:any)=>{
            const [date,time] = original?.createdAt?.split("T") ?? [];
            return <UserDetails
            displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
            displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
            showAvatar={false}
            ></UserDetails>
        }
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MoreActions actionOptions={actionsList} rowId={original.feeReceiptId} isHorizontal={true} />
        );
      },
    },
  ];
}

export function generateFeeDetailsModalColumns() {
  return [
    {
      Header: "S.No",
      accessor: "sNo",
      disableSortBy: true,
      Cell: ({ row: { index } }: any) => {
        return (
          <span className="tw-text-nowrap">{(index + 1)}</span>
        )
      }
    },
    {
      Header: "Fee Name",
      accessor: "feeDetail",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">{original?.feeDetail}</span>
        );
      },
    },
    {
      Header: "Amount Payable (₹)",
      accessor: "amountPayable",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.amountPayable)}</span>
        );
      },
    },
    {
      Header: "Concession (₹)",
      accessor: "concession",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.concession)}</span>
        );
      },
    },
    {
      Header: "Net Amount (₹)",
      accessor: "amountToPay",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.amountToPay)}</span>
        );
      },
    },
    {
      Header: "Amount Paid (₹)",
      accessor: "amountPaidOfFeePayments",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.amountPaidOfFeePayments)}</span>
        );
      },
    },
    {
      Header: "Balance (₹)",
      accessor: "amountToBePaid",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.amountToPay - original?.amountPaidOfFeePayments)}</span>
        );
      },
    },
  ];
}


export function generateFeeDetailsColumns() {
  return [
    {
      Header: "Fee Name",
      accessor: "feeName",
    },
    {
      Header: "Last Date",
      accessor: "lastDate",
    },
    {
      Header: "Amount Payable",
      accessor: "amountPayable",
    },
    {
      Header: "Amount Paid",
      accessor: "amountPaid",
    },
    {
      Header: "Concession",
      accessor: "concession",
    },
    {
      Header: "Fine",
      accessor: "fine",
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
    },
  ];
}

export function hasStateChanged(newState:any) {
  let count :any = 0;
  let showState :boolean =false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if(key === "startDate" || key === "paymentMode" ){
        count += 1;
      }
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}
}
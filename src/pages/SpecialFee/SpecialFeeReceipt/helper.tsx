import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import {
  StatusLabel,
  TextInput,
  UserDetails,
} from "../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";
import { getDisplayAmountValue } from "../../../utility/commonutility";

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
]

export const studentTypeOptions = [
  {
    id: "EXISTING_STUDENT",
    name: "Existing Student"
  },
  {
    id: "NEW_STUDENT",
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
            <div className="input-group input-group-sm">
              <span className="input-group-text tw-bg-white tw-border-e-0">
                <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              </span>
              <input type="text" className="form-control tw-border-s-0" value={original.amountPayable} />
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
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              </span>
              <input type="text" className="form-control border-start-0" value={original.amountPayable} />
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
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              </span>
              <input type="text" className="form-control border-start-0" value={original.concession} />
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
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              </span>
              <input type="text" className="form-control border-start-0" value={original.fine} />
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
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <RupeeSvg width="11px" height="11px" fill={"#495057"} />
              </span>
              <input type="text" className="form-control border-start-0" value={original.amounttoPay} />
            </div>
          </>
        );
      },
    }
  ];
}
export function generateColumns(
  actionsList: Array<IOptionsHrtl>,
  printReceiptHndlr: any,
  canCreateAndUpdate : boolean,
) {
  return [
    {
      Header: "Receipt No.",
      accessor: "receiptNumber",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const onClick = (event:any)=>{
          canCreateAndUpdate && printReceiptHndlr(event)
        }
        return (
          <>
            <div className={`${canCreateAndUpdate && "text-info cursor-pointer"}`}
              data-id={original.id}
              onClick={onClick}
              >
              {original.receiptNumber}
            </div>
          </>
        );
      },
    },
    {
      Header: "Student Name",
      accessor: "studentDetail",
      columnClassName: "w-200px min-w-200px",
      Cell: ({  row: { original } }: any) => {
        const { id, studentName, studentCode } = original || {};
        return (
          <>
            <UserDetails
              displayName={studentName}
              displayId={studentCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Curriculum",
      accessor: "branchCurriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "shortName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="text-nowrap">{original?.shortName}</span>)
      },
    },
    {
      Header: "Fee Name",
      accessor: "feeDetail",
      disableSortBy: true,
      columnClassName: "w-250px min-w-250px",
      // Cell: ({ row: { original } }: any) => {
      //   let abc = ""
      //   original?.feeDetailVOList?.map((fee: any, index: number) => {
      //     abc = abc + fee.feeDetail + ((index !== (original?.feeDetailVOList?.length - 1)) ? "," : "")
      //   })
      //   return abc;
      // }
    },
    {
      Header: "Category",
      accessor: "category",
      disableSortBy: true,
    },
    {
      Header: "Receipt Date",
      accessor: "receiptDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.receiptDate)}</span>)
      },
    },
    {
      Header: "Amount Paid (₹)",
      accessor: "amountPaid",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.amountPaid)}</span>
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
    {
      Header: "Cheque Status",
      accessor: "chequeStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const data = original?.chequeStatus?.split(" ")[0]
        return (
          <StatusLabel type={data} labelName={data} />
        );
      },
    },
    {
      Header: "Fine Amount (₹)",
      accessor: "fine",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.fine)}</span>
        );
      },
    },
    {
      Header: "Cashier",
      accessor: "cashier",
      disableSortBy: true,
    },
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
      accessor: 'actions',
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const updatedActions = original.feeDetail === "ID CARD" ? actionsList.filter((item) => item.id !== "fee-reversal") : actionsList;
        return (
          <MoreActions actionOptions={updatedActions} rowId={original.id} isHorizontal={true} />
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
          <span className="text-nowrap">{(index + 1)}</span>
        )
      }
    },
    {
      Header: "Academic Year",
      accessor: "academicYearName",
      columnClassName: "text-nowrap"
    },
    {
      Header: "Fee Name",
      accessor: "feeDetail",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">{original?.feeDetail}</span>
        );
      },
    },
    {
      Header: "Amount To Pay (₹)",
      accessor: "amountToPay",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.amountToPay)}</span>
        );
      },
    },
    {
      Header: "Amount Paid (₹)",
      accessor: "amountPaid",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.amountPaid)}</span>
        );
      },
    },
    {
      Header: "Fine (₹)",
      accessor: "fine",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => getDisplayAmountValue(original?.fine)
    },
    {
      Header: "Balance (₹)",
      accessor: "amountToBePaid",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        const balanceAmount = (original?.amountToPay - original?.amountPaid) || 0
        return (
          <span>{getDisplayAmountValue(balanceAmount)}</span>
        );
      },
    },
  ];
}

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (key === "receiptTypes") {
        if (newValue?.length > 0) {
          const isChanged = newValue?.some((item: any) => item?.selected);
          isChanged && (count += 1);
        }
      } else if (key === "startDate") {
        count += 1;
      } else if (key === "paymentModes" && newValue?.length > 0) {
        count += 1;
      }
    }
  }
  if (count > 0) { return { stateChange: showState, count: count } }
  else { return { stateChange: showState, count: count } }
}
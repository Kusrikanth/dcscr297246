import { compareAsc, differenceInMilliseconds, parseISO } from "date-fns";
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
      Header: "Academic Year",
      accessor: "academicYearName",
      disableSortBy: true,
    },
    {
      Header: "Special Fee Name",
      accessor: "specialFeeName",
      disableSortBy: true,
    },
    {
      Header: "Type Of Fee",
      accessor: "feeName",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px",
    },
    {
      Header: "Last Date",
      accessor: "dueDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="text-nowrap">{getDisplayDateForTableFormat(original.dueDate)}</span>
      },
    },
    {
      Header: "Fee Amount (₹)",
      accessor: "feeAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="text-nowrap">₹ {getDisplayAmountValue(original?.feeAmount)}</span>
      },
    },
    {
      Header: "Amount Paid (₹)",
      accessor: "amountPaid",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="text-nowrap">₹ {getDisplayAmountValue(original?.amountPaid)}</span>
      },
    },
    {
      Header: "Balance (₹)",
      accessor: "balance",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="text-nowrap">₹ {getDisplayAmountValue(original?.balance)}</span>
      },
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
      columnClassName: "w-120px min-w-120px",
      Cell: ({ row: { original } }: any) => {
        return getDisplayDateForTableFormat(original.receiptDate)
      },
    },
    {
      Header: "Receipt No",
      accessor: "receiptNumber",
      disableSortBy: true
    },
    {
      Header: "Fee Name",
      accessor: "feeName",
      disableSortBy: true,
      columnClassName: "w-250px min-w-250px",
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
      accessor: "amountToPay",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="text-nowrap">₹ {getDisplayAmountValue(original?.amountToPay)}</span>
      },
    },
    {
      Header: "Paid Amount",
      accessor: "actualPaidAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="text-nowrap">₹ {getDisplayAmountValue(original?.actualPaidAmount)}</span>
      },
    },
    {
      Header: "Fine",
      accessor: "fine",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="text-nowrap">₹ {getDisplayAmountValue(original?.fine)}</span>
      },
    },
    {
      Header: "Card Charges",
      accessor: "cardCharges",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="text-nowrap">₹ {getDisplayAmountValue(original?.cardCharges)}</span>
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
            rowId={original.id}
          // isHorizontal={true}
          />
        );
      },
    },
  ])
}


export function getSpecialFeesLedgers(specialFees: Array<any>) {
  if (Array.isArray(specialFees)) {
    const feeList: any = [];
    for (let i = 0; i < specialFees.length; i++) {
      const { feeType, monthWiseTerms, oneTimeFee, termWiseFee } = specialFees[i];

      if (feeType === "TERM" && Array.isArray(termWiseFee)) {
        for (let j = 0; j < termWiseFee.length; j++) {
          feeList.push({
            academicYearId: specialFees[i]?.academicYearId,
            academicYearName: specialFees[i]?.academicYearName,
            feeType: specialFees[i]?.feeType,
            feeTypeId: specialFees[i]?.feeTypeId,
            specialFeeId: specialFees[i]?.specialFeeId,
            specialFeeName: specialFees[i]?.specialFeeName,
            dueDate: termWiseFee[j]?.dueDate,
            paymentStatus: termWiseFee[j]?.paymentStatus,
            feeAmount: termWiseFee[j]?.feeAmount,
            amountPaid: termWiseFee[j]?.amountPaid,
            balance: termWiseFee[j]?.balance,
            feeId: termWiseFee[j]?.termId,
            feeName: termWiseFee[j]?.termName,
          });

        }
      } else if (feeType === "ONETIME" && Array.isArray(oneTimeFee)) {
        for (let j = 0; j < oneTimeFee.length; j++) {
          feeList.push({
            academicYearId: specialFees[i]?.academicYearId,
            academicYearName: specialFees[i]?.academicYearName,
            feeType: specialFees[i]?.feeType,
            feeTypeId: specialFees[i]?.feeTypeId,
            specialFeeId: specialFees[i]?.specialFeeId,
            specialFeeName: specialFees[i]?.specialFeeName,
            dueDate: oneTimeFee[j]?.dueDate,
            paymentStatus: oneTimeFee[j]?.paymentStatus,
            feeAmount: oneTimeFee[j]?.feeAmount,
            amountPaid: oneTimeFee[j]?.amountPaid,
            balance: oneTimeFee[j]?.balance,
            feeId: specialFees[i]?.specialFeeId,
            feeName: oneTimeFee[j]?.termName,
          });

        }
      } else if (feeType === "MONTH" && Array.isArray(monthWiseTerms)) {
        for (let j = 0; j < monthWiseTerms.length; j++) {
          feeList.push({
            academicYearId: specialFees[i]?.academicYearId,
            academicYearName: specialFees[i]?.academicYearName,
            feeType: specialFees[i]?.feeType,
            feeTypeId: specialFees[i]?.feeTypeId,
            specialFeeId: specialFees[i]?.specialFeeId,
            specialFeeName: specialFees[i]?.specialFeeName,
            dueDate: monthWiseTerms[j]?.dueDate,
            paymentStatus: monthWiseTerms[j]?.paymentStatus,
            feeAmount: monthWiseTerms[j]?.feeAmount,
            amountPaid: monthWiseTerms[j]?.amountPaid,
            balance: monthWiseTerms[j]?.balance,
            feeId: monthWiseTerms[j]?.termId,
            feeName: monthWiseTerms[j]?.termName,
          });
        }
      }
    }
    feeList.sort((a: any, b: any) => {
      if (a.dueDate === null) return -1;
      if (b.dueDate === null) return 1;
      const dateA = parseISO(a.dueDate);
      const dateB = parseISO(b.dueDate);
      return compareAsc(dateA, dateB);
    });
    return feeList;
  }
  return [];
}
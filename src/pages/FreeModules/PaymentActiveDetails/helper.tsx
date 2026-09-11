import { getDateWithTimeFormat, getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";
import { StatusLabel, UserDetails } from "../../../Components/Common";


export function generateColumns( togglePaymentDetailsModel: any) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px sticky-left",
      Cell: ({ row: { original } }: any) => {
        return (
          <div
            style={{ minWidth: "9rem" }}
            className="text-info cursor-pointer"
            onClick={()=>togglePaymentDetailsModel(original?.id)}
          >
  <UserDetails
    displayName={original?.studentName || "-"}
    displayId={original?.studentCode || "-"}
    showAvatar={false}
  />
</div>
        );
      },
    },
    {
      Header: "Mobile No.",
      accessor: "phone",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.phone || "-"
      }
    },
    {
      Header: "Email",
      accessor: "email",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.email || "-"
      }
    },
    {
      Header: "Is Processed",
      accessor: "isProcessed",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.isProcessed || "-"
      }
    },
    {
      Header: "Created Date",
      accessor: "createdDate",
      disableSortBy: true,
      columnClassName: "text-nowrap",
      Cell: ({ row: { original } }: any) => {
        return getDateWithTimeFormat(original?.createdDate ? `${original?.createdDate}Z` : '');
      },
    },
    {
      Header: "Transaction Date",
      accessor: "transactionDate",
      disableSortBy: true,
      columnClassName: "text-nowrap",
      Cell: ({ row: { original } }: any) => {
        return getDateWithTimeFormat(original?.transactionDate ? `${original?.transactionDate}Z` : '');
      },
    },
    {
      Header: "Settlement",
      accessor: "settlementUtr",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.settlementUtr || "-"
      }
    },
    {
      Header: "Settled",
      accessor: "settledAt",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.settledAt || "-"
      }
    },
    {
      Header: "Amount  (₹)",
      accessor: "amount",
      disableSortBy: true,
    },
    {
      Header: "Payment Option",
      accessor: "paymentOption",
      disableSortBy: true,
    },
    {
      Header: "Transaction For",
      accessor: "transactionFor",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        const formatString = (str: string) => {
          if (!str) return '-';
          return str.split('_').map((word: string) => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
        };
  
        return formatString(original?.transactionFor);
      }
    },
    {
      Header: "Transaction Status",
      accessor: "transactionStatus",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.transactionStatus} labelName={original.transactionStatus} />
        );
      },
    },
    {
      Header: "Source",
      accessor: "source",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.source || "-"
      }
    },
  ];
}
export function generateDetailsColumns() {
  return [
    {
      Header: "Concession Amount",
      accessor: "concessionAmount",
      disableSortBy:true,
    },
    {
      Header: "Amount to Pay",
      accessor: "amountToPay",
      disableSortBy:true,
    },
    {
      Header: "Fee Amount",
      accessor: "feeAmount",
      disableSortBy:true,
    },
    {
      Header: "Fine",
      accessor: "fine",
      disableSortBy:true,
    },
    {
      Header: "Fine Details",
      accessor: "fineDetails",
      disableSortBy:true,
    },
    {
      Header: "Term Type Name",
      accessor: "termTypeName",
      disableSortBy:true,
    },
  ];
}

export const transactionStatus: Array<any> = [
  {
    id: "Paid",
    name: "PAID"
  },
  {
    id: "UnPaid",
    name: "UNPAID"
  }
]
export const paymentOption: Array<any> = [
  {
    id: "EBS",
    name: "EBS"
  },
  {
    id: "Axis",
    name: "axis"
  },
  {
    id: "Kotak",
    name: "Kotak"
  },
  {
    id: "Jodo",
    name: "Jodo"
  },
]
export const transactionFor: Array<any> = [
  {
    id: "ACADEMIC_FEE",
    name: "Academic Fee"
  },
  {
    id: "APPLICATION_SALE_FEE",
    name: "Application Sale Fee"
  },
  {
    id: "SPECIAL_FEE",
    name: "Special Fee"
  },
]
export function hasStateChanged(newState:any) {
  let count :any = 0;
  let showState :boolean =false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if(!(key === "search" || key === "academicYearId" || key === "curriculumId" || key === "classId" || key === "sectionId" || key === "transactionEndDate"))
      count += 1;
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}
}



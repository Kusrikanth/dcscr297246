import { StatusLabel, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../utility/commonutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "w-200px min-w-200px max-w-200px",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.newStudentName}
              displayId={original?.newStudentCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Old Campus",
      accessor: "oldBranchName",
      disableSortBy: true,
    },
    {
      Header: "New Campus",
      accessor: "newBranchName",
      disableSortBy: true,
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "classShortName",
      disableSortBy: true,
    },
    {
      Header: "Contact No",
      accessor: "phoneNo",
      disableSortBy: true,
    },
    {
      Header: "Refundable Amount",
      accessor: "totalRefundAmount",
      disableSortBy: true,
    },
    {
      Header: "Approval Status",
      accessor: "approvedStatus",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.approvedStatus}
            labelName={original.approvedStatus}
          />
        );
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        let rowActions: IOptionsHrtl[] = [];

        if (original?.approvedStatus === "PENDING") {
          rowActions = actionsList.filter(
            (item: any) =>
              item.id === "approve" || item.id === "reject"
          );
        }

        else if (original?.approvedStatus === "APPROVED") {
          rowActions = actionsList.filter(
            (item: any) => item.id === "viewLedger"
          );
        }

        else if (original?.approvedStatus === "REJECTED") {
          rowActions = [];
        }

        return rowActions.length > 0 ? (
          <MenuOptionHrtl
            actionOptions={rowActions}
            rowId={original.id}
          />
        ) : (
          <span>-</span>
        );
      },
    },
  ];
}

export const approvedStatusOptions: Array<any> = [
  {
    id: "APPROVED",
    name: "Approved"
  },
  {
    id: "REJECTED",
    name: "Rejected"
  },
  {
    id: "PENDING",
    name: "Pending"
  },
]

export function generateFeeDetailsModalColumns() {
  return [
    {
      Header: "Academic Year",
      accessor: "academicYear",
      disableSortBy: true,
    },
    {
      Header: "Fee Name",
      accessor: "feeDetails",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">{original?.feeDetails}</span>
        );
      },
    },
    {
      Header: "Amount to Pay (₹)",
      accessor: "amountToPay",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.amountToPay)}</span>
        );
      },
    },
    {
      Header: "Net Amount",
      accessor: "netAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.netAmount)}</span>
        );
      },
    },
    {
      Header: "Paid Amount (₹)",
      accessor: "amountPaid",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.amountPaid)}</span>
        );
      },
    },
    {
      Header: "Adjustment Amount (₹)",
      accessor: "adjustmentAmount",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.adjustmentAmount)}</span>
        );
      },
    },
    {
      Header: "Balance Amount (₹)",
      accessor: "amountToBePaid",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.amountToBePaid)}</span>
        );
      },
    },
    {
      Header: "Excess Amount (₹)",
      accessor: "excessAmount",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original, index } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.excessAmount)}</span>
        );
      },
    },
    {
      Header: "Payment Status",
      accessor: "paymentStatus",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.paymentStatus} labelName={original.paymentStatus} />
        );
      },
    }
  ];
}

export function generateOldCampusFeeDetailsColumns() {
  return [
    {
      Header: "Academic Year",
      accessor: "academicYear",
      disableSortBy: true,
    },
    {
      Header: "Fee Name",
      accessor: "feeDetails",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">{original?.feeDetails}</span>
        );
      },
    },
    {
      Header: "Amount to Pay (₹)",
      accessor: "amountToPay",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.amountToPay)}</span>
        );
      },
    },
    {
      Header: "Net Amount",
      accessor: "netAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.netAmount)}</span>
        );
      },
    },
    {
      Header: "Paid Amount (₹)",
      accessor: "paidAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.amountPaid)}</span>
        );
      },
    },
    {
      Header: "Refunded Amount (₹)",
      accessor: "refundedAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.refundedAmount)}</span>
        );
      },
    },
    {
      Header: "Payment Status",
      accessor: "paymentStatus",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.paymentStatus} labelName={original.paymentStatus} />
        );
      },
    }
  ];
}
import {
  MoreActions,
  StatusLabel,
  UserDetails,
} from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { getAmountValueWithDecimal } from "../../../utility/commonutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    // {
    //   Header: "Class",
    //   accessor: "fromClass",
    //   disableSortBy: true,
    // },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Roll Number",
      accessor: "rollNo",
      disableSortBy: true,
    },
    {
      Header: "From Class",
      accessor: "fromClass",
      disableSortBy: true,
    },
    {
      Header: "Detained/Promoted",
      accessor: "eligibilityStatusDetentionAndPromotion",
      disableSortBy: true,
    },
    {
      Header: "Detained To/Promoted To",
      accessor: "toClass",
      disableSortBy: true,
    },
    {
      Header: "Approve Status",
      accessor: "approvedStatus",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.approvedStatus} labelName={original.approvedStatus} />
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        let updatedActionList: any = []
        actionsList.map((action: any) => original.approvedStatus === "PENDING" ? updatedActionList.push(action) : action.actionName === "View Ledger" && updatedActionList.push(action))
        return (
          <MoreActions
            actionOptions={updatedActionList}
            rowId={original.studentId}
            isHorizontal={true}
          />
        );
        // return (
        //   <MoreActions
        //     actionOptions={actionsList}
        //     rowId={original.studentId}
        //     isHorizontal={true}
        //   />
        // );
      },
    },
  ];
}

export const selectData7 = [
  {
    promotedDetainedId: "PROMOTED",
    promotedDetainedType: "Promote",
  },
  {
    promotedDetainedId: "DETAINED",
    promotedDetainedType: "Detain",
  },
];

export function generateFeeDetailsModalColumns() {
  return [
    {
      Header: "Fee Details",
      accessor: "feeDetails",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">{original?.feeDetails}</span>
        );
      },
    },
    {
      Header: "Amount to Pay (₹)",
      accessor: "amountToPay",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.amountToPay)}</span>
        );
      },
    },
    {
      Header: "Paid Amount (₹)",
      accessor: "paidAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.paidAmount)}</span>
        );
      },
    },
    {
      Header: "Balance Amount (₹)",
      accessor: "balanceAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.balanceAmount)}</span>
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
    }
  }
  if (count > 0) { return { stateChange: showState } }
  else { return { stateChange: showState } }
}
import { InputCheckbox, StatusLabel } from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { UpdatedUserDetails } from "../../../../Components/Common/UpdatedUserDetails";
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../../utility/commonutility";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import { StatusLabelWithStepper } from "../../../NewAcademics/TransferCertificate/StatusLabelWithStepper";



export const requestType = [
  {
    reqType: "Offline",
  },
  {
    reqType: "Online",
  }
]

// generate roll number table select filter
export const statusTypes = [
  {
    statusType: "Yet_to_prepare",
  },
  {
    statusType: "Prepared",
  },
  {
    statusType: "Issued",
  },
];

export const menuItems = [{ id: "true", name: "Yes" }, { id: "false", name: "No" }]

export function generateColumns(singleAcademicLedgerCheckHndlr: any, allAcademicLedgerSelectHndlr: any, allStudentSelected: any, jodoOptedState: boolean) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            isDisabled={jodoOptedState}
            // labelName={shortName}
            value={allStudentSelected}
            onChange={allAcademicLedgerSelectHndlr}
            formgroupClassName="mb-0"
          />
        )
      },
      accessor: "isStudentChecked",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { ledgerId, isEnabled, isChecked } = original;
        return (
          <>
            <InputCheckbox
              name={`fee-${ledgerId}`}
              // labelName={shortName}
              value={isChecked}
              isDisabled={!isEnabled}
              onChange={singleAcademicLedgerCheckHndlr}
              dataId={ledgerId}
              formgroupClassName="mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Academic Year",
      accessor: "academicYearName",
      disableSortBy: true,
    },
    {
      Header: "Fee Details",
      accessor: "feeDetails",
      columnClassName: "text-nowrap",
      disableSortBy: true,
    },
    {
      Header: "Last Date",
      accessor: "lastDate",
      disableSortBy: true,
      columnClassName: "text-nowrap",
      Cell: ({ row: { original } }: any) => {
        return original?.lastDate && getDdMmYyyyWithMonthNameFormat(original?.lastDate);
      }
    },
    {
      Header: "Fee Amount (₹)",
      accessor: "amountToPay",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.amountToPay)}</span>
        );
      },
    },
    {
      Header: "Concession (₹)",
      accessor: "totalConcession",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.totalConcession)}</span>
        );
      },
    },
    {
      Header: "Amount To Pay (₹)",
      accessor: "netAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="text-nowrap">₹ {getDisplayAmountValue(original?.netAmount)}</span>;
      },
    },
    {
      Header: "Amount Paid (₹)",
      accessor: "amountPaid",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.amountPaid)}</span>
        );
      },
    },
    {
      Header: "Balance (₹)",
      accessor: "balance",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.balance)}</span>
        );
      },
    },
    {
      Header: "Fine (₹)",
      accessor: "fineAmount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.fineAmount)}</span>
        );
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

  ];
}

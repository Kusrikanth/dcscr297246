import {
  MenuOptionHrtl,
  StatusLabel,
  TextInputGroup,
  UserDetails,
} from "../../../Components/Common";
import {
  IOptionsHrtl,
  MoreActions,
} from "../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../utility/commonutility";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";

export function generateOldCampusFeeDetailsColumns() {
  return [
    {
      Header: "Academic Year",
      accessor: "academicYear",
      disableSortBy: true,
    },
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
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountToPay)}</span>
        );
      },
    },
    {
      Header: "Employee Concession(₹)",
      accessor: "employeeConcessionAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.employeeConcessionAmount)}</span>
        );
      },
    },
    {
      Header: "Tution Fee Concession (₹)",
      accessor: "tuitionFeeConcession",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.tuitionFeeConcession)}</span>
        );
      },
    },
    {
      Header: "Student Concession (₹)",
      accessor: "studentConcessionAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.studentConcessionAmount)}</span>
        );
      },
    },
    {
      Header: "Paid Amount (₹)",
      accessor: "paidAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountPaid)}</span>
        );
      },
    },
    {
      Header: "Balance Amount (₹)",
      accessor: "balanceAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountToBePaid)}</span>
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

const editConcessionAmountTableCell = ({
  row: { index, original },
  onChangeInputHndlr,
  onBlurInputHndlr, rowDataInfo
}: any) => {
  if (rowDataInfo?.isAcceptanceLedgerSubmit) {
    return (<span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.studentConcessionAmount)}</span>)
  }
  return (<TextInputGroup
    name={`[${index}].studentConcessionAmount`}
    formgroupClassName="mb-0"
    inputgroupClassName="input-group-sm"
    inputClassName="form-control-sm"
    allowedInputRegex="^[0-9]+\.?[0-9]*$"
    inputGroupStart={true}
    value={original.studentConcessionAmount}
    onChange={onChangeInputHndlr}
    onBlur={onBlurInputHndlr}
    maxLength={10}
    isDisabled={original?.isDisabled || false}
    invalid={(original?.touched?.studentConcessionAmount && original?.errors?.studentConcessionAmount) ? true : false}
    error={(original?.touched?.studentConcessionAmount && original?.errors?.studentConcessionAmount) ? original?.errors?.studentConcessionAmount : ""}
  >
    <RupeeSvg width="11px" height="11px" fill={"#495057"} />
  </TextInputGroup>)
}


export function generateFeeDetailsModalColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Academic Year",
      accessor: "academicYear",
      disableSortBy: true,
    },
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
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountToPay)}</span>
        );
      },
    },
    // {
    //   Header: "MaxStudent Concession (₹)",
    //   accessor: "maxStudentConcession",
    //   disableSortBy: true,
    //   columnClassName: "tw-text-center",
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.maxStudentConcession)}</span>
    //     );
    //   },
    // },
    // {
    //   Header: "Balance Amount (₹)",
    //   accessor: "balanceAmountu",
    //   disableSortBy: true,
    //   columnClassName: "tw-text-center",
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.balanceAmount)}</span>
    //     );
    //   },
    // },
    {
      Header: "Employee Concession(₹)",
      accessor: "employeeConcessionAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.employeeConcessionAmount)}</span>
        );
      },
    },
    {
      Header: "Tution Fee Concession (₹)",
      accessor: "tuitionFeeConcession",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.tuitionFeeConcession)}</span>
        );
      },
    },
    {
      Header: "Student Concession (₹)",
      accessor: "studentConcessionAmount",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px]",
      Cell: editConcessionAmountTableCell
    },
    {
      Header: "Paid Amount (₹)",
      accessor: "paidAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.paidAmount)}</span>
        );
      },
    },
    {
      Header: "Balance Amount (₹)",
      accessor: "balanceAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.balanceAmount)}</span>
        );
      },
    },
    {
      Header: "Excess Amount (₹)",
      accessor: "excessAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original, index } }: any) => {
        return (
          <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.excessAmount)}</span>
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
    // {
    //   Header: "Actions",
    //   filterable: false,
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <MenuOptionHrtl
    //         actionOptions={actionsList}
    //         rowId={original.id}
    //       />
    //     );
    //   },
    // },
  ];
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.newStudentCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Campus",
      accessor: "currentCampusName",
      disableSortBy: true,
    },
    {
      Header: "Change Campus",
      accessor: "newCampusName",
      disableSortBy: true,
    },
    {
      Header: "Curriculum",
      accessor: "currentCurriculumName",
      disableSortBy: true,
    },
    {
      Header: "Change Curriculum",
      accessor: "newCurriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "currentClassName",
      disableSortBy: true,
    },
    {
      Header: "Change Class",
      accessor: "newClassName",
      disableSortBy: true,
    },
    {
      Header: "Approval Status",
      accessor: "acceptanceStatus",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.acceptanceStatus}
            labelName={original.acceptanceStatus}
          />
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        // let updatedActions: any = [];
        // if (original?.acceptanceStatus === "APPROVED" || original?.acceptanceStatus === "REJECTED") {
        //   updatedActions = actionsList.filter(item => item.id === "viewLedger");
        // } else {
        //   updatedActions = actionsList;
        // }
        let updatedActions: any = [];
        if (original?.acceptanceStatus === "APPROVED") {
          updatedActions = actionsList.filter(item => item.id === "viewLedger");
        } else if (original?.acceptanceStatus === "PENDING") {
          updatedActions = actionsList.filter(item => item.id !== "viewLedger");
        }
        if (updatedActions.length) {
          return (
            <MoreActions
              actionOptions={updatedActions}
              rowId={original.id}
              isHorizontal={true}
            />
          );
        }
      },
    },
  ];
}

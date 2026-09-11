import {
  MoreActions,
  StatusLabel,
  UserDetails,
} from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../utility/commonutility";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";

export function generateFeeDetailsModalColumns(actionsList: Array<IOptionsHrtl>, resetDeleteHndlr: any) {
  return [
    {
      Header: "Academic Year",
      accessor: "academicYear",
      disableSortBy: true,
    },
    // {
    //   Header: "Curriculum",
    //   accessor: "curriculumName",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <span className="tw-text-nowrap">{original?.feeDetails}</span>
    //     );
    //   },
    // },
    // {
    //   Header: "Class",
    //   accessor: "className",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <span className="tw-text-nowrap">{original?.feeDetails}</span>
    //     );
    //   },
    // },
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
      Header: "Paid Amount (₹)",
      accessor: "amountPaid",
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
      accessor: "amountToBePaid",
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
    },
    {
      Header: "Actions",
      accessor: "actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        if (original?.paymentStatus !== "Paid") {
          if (original?.isDeleted) {
            return (
              <div className="tw-flex tw-gap-2">
                <span className="tw-text-danger">Deleted</span>
                <span data-id={original.id} className="tw-text-link tw-cursor-pointer" onClick={resetDeleteHndlr}>Reset</span>
              </div>
            )
          } else {
            return (
              <MenuOptionHrtl
                actionOptions={actionsList}
                rowId={original.id}
              />
            );
          }
        }
        return "-"
      },
    },
  ];
}

export function generateColumns(actionsList: Array<IOptionsHrtl>, isFeeModule: boolean) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
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
      Header: "Changed Student Id",
      accessor: "changedStudentId",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
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
      Header: "Fee Due Amount (₹)",
      accessor: "feeDueAmount",
      disableSortBy: true,
      columnClassName: "tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">₹ {getDisplayAmountValue(original?.feeDueAmount)}</span>
        );
      },
    },
    {
      Header: "Approval Status",
      accessor: "changeCampusStatus",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.changeCampusStatus} labelName={original.changeCampusStatus} />
        );
      },
    },
    {
      Header: "Acceptance Approval",
      accessor: "acceptanceStatus",
      filterable: false,
      disableSortBy: true,
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
    ...(isFeeModule
      ? [
        {
          Header: "Actions",
          disableSortBy: true,
          filterable: false,
          Cell: ({ row: { original } }: any) => {
            let updatedActions: any = [];

            if (original?.changeCampusStatus === "APPROVED") {
              updatedActions = actionsList.filter(
                (item) => item.id === "viewLedger"
              );
            } else if (original?.changeCampusStatus === "PENDING") {
              updatedActions = actionsList.filter(
                (item) => item.id !== "viewLedger"
              );
            }

            return (
              <MoreActions
                actionOptions={updatedActions}
                rowId={original.id}
                isHorizontal={true}
              />
            );
          },
        },
      ]
      : []),
  ];
}


import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import {  getDisplayAmountValue } from "../../../../utility/commonutility";
import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Receipt No.",
      accessor: "receiptNo",
    },
    {
      Header: "Curriculum",
      accessor: "branchCurriculumName",
      disableSortBy: true,
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              showAvatar={false}
              displayName={original?.studentName}
              displayId={original?.studentCode}
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Actual Paid Amount (₹)",
      accessor: "actualPaidAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(+original?.actualPaidAmount)}</span>
      },
    },
    {
      Header: "Received Date",
      accessor: "receivedDate",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (<span className="tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(value)}</span>)
      },
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      disableSortBy: true,
    },
    {
      Header: "Fee Status",
      accessor: "feeStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <StatusLabel type={original?.feeStatus} labelName={original?.feeStatus} />
      }
    },
    // {
    //   Header: "Actions",
    //   filterable: false,
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <MoreActions actionOptions={actionsList} rowId={original.feeReceiptId} isHorizontal={true} />
    //     );
    //   },
    // },
  ];
}

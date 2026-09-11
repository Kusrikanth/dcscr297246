
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";
import {  getDisplayAmountValue } from "../../../utility/commonutility";
import { MoreActions, StatusLabel, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";

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
      columnClassName: "w-200px min-w-200px max-w-200px",
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
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true
    },
    {
      Header: "Class",
      accessor: "shortName",
      disableSortBy: true,
    },
    {
      Header: "Actual Paid Amount (₹)",
      accessor: "actualPaidAmount",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(+original?.actualPaidAmount)}</span>
      },
    },
    {
      Header: "Received Date",
      accessor: "receivedDate",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (<span className="text-nowrap">{getDdMmYyyyWithMonthNameFormat(value)}</span>)
      },
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      columnClassName: "w-200px min-w-200px max-w-200px",
      disableSortBy: true,
    },
    {
      Header: "Modified By",
      accessor: "modifiedBy",
      columnClassName: "w-200px min-w-200px max-w-200px",
      disableSortBy: true,
      Cell: ({ value }) => value || value === 0 ? value : "-"
    },
    {
      Header: "Last Modified",
      accessor: "lastModifiedAt",
      disableSortBy: true,
      Cell: ({ value }: any) => (
        <span className="text-nowrap">
          {value ? getDdMmYyyyWithMonthNameFormat(value) : "-"}
        </span>
      )
    },
    {
      Header: "Fee Status",
      accessor: "feeStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <StatusLabel type={original?.feeStatus} labelName={original?.feeStatus} />
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

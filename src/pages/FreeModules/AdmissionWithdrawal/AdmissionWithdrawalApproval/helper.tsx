
import { tcApprovalListTableData } from "./TCApprovalListTypes";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { getDisplayDateForTableFormat } from "../../../../utility/dateutility";
import { UserDetails } from "../../../../Components/Common";

export function generateColumns() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
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
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Amount Returned (₹)",
      accessor: "amountReturned",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-text-nowrap">₹ {getDisplayAmountValue(original?.amountReturned)}</span>
      },
    },
    {
      Header: "Payment Mode",
      accessor: "paymentMode",
      disableSortBy: true,
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
    },
    {
      Header: "Approval Date",
      accessor: "createdAt",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (<span className="tw-text-nowrap">{getDisplayDateForTableFormat(value)}</span>)
    },
    },
  ];
}

export const AdmissionWithdrawalApprovalData: Array<tcApprovalListTableData> = [
  {
    id: 1,
    studentName: {
      StudName: "User1",
      dep_id: "DCIP000001",
      // imgUrl: avatar1,
    },
    curriculum: "CBSE",
    class: "I",
    amountReturned: "45,500.00",
    paymentMode: "Cash",
    remarks: "Personal . Child Was Not Offered Sports",
    approvalDate: "June 17,2022",
  },

];

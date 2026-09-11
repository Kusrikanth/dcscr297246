import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { getDisplayDateForTableFormat } from "../../../../utility/dateutility";
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
              showAvatar={false}
              displayName={original?.studentName}
              displayId={original?.studentCode}
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
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Approval Date",
      accessor: "approvalDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDisplayDateForTableFormat(original.approvalDate)
      }
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ value }: any) => <>{value || "-"}</>
    },
    {
      Header: "Exit Approval Status",
      accessor: "exitApprovalStatus",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.exitApprovalStatus} labelName={original.exitApprovalStatus} />
        );
      },
    },
  ];
}

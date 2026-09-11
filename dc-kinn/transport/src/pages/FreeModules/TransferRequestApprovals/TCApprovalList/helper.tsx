import { StatusLabel, UserDetails } from "../../../../Components/Common";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
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
    },
    {
      Header: "Tc Status",
      accessor: "tcRequestStatus",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.tcRequestStatus} labelName={original.tcRequestStatus} />
        );
      },
    },
  ];
}
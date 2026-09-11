import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getDisplayDateForTableFormat } from "../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Academic Year",
      accessor: "academicYearName",
      disableSortBy: true,
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
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.student?.studentName}
              displayId={original?.student?.studentCode}
            />
          </>
        );
      },
    },
    {
      Header: "Request Date",
      accessor: "tcApplicationDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDisplayDateForTableFormat(original.tcApplicationDate);
      }
    },
    {
      Header: "Issuance Date",
      accessor: "issuanceDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDisplayDateForTableFormat(original.issuanceDate);
      }
    },
    {
      Header: "Request Type",
      accessor: "requestType",
      disableSortBy: true,
    },
    {
      Header: "Issue Status",
      accessor: "tcRequestStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.tcRequestStatus} labelName={original.tcRequestStatus} />
        );
      }
    },
    {
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        const { tcRequestStatus } = original;
        if (tcRequestStatus === 'Issued') {
          return (
            <MenuOptionHrtl actionOptions={actionsList} rowId={original.tcId} />
          );
        } else {
          return "-";
        }
      },
    },
  ];
}

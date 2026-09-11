import {
  MenuOptionHrtl,
  StatusLabel,
  UserDetails,
} from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "student",
      disableSortBy:true,
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
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy:true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy:true,
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy:true,
    },
    {
      Header: "TC Request Date",
      accessor: "tcApplicationDate",
      disableSortBy:true,
      Cell:({row:{original}}:any)=>{
        return getDdMmYyyyWithMonthNameFormat(new Date(original.tcApplicationDate))
      }
    },
    {
      Header: "Last Attended Date",
      accessor: "lastAttendanceDate",
      disableSortBy:true,
      Cell:({row:{original}}:any)=>{
        return getDdMmYyyyWithMonthNameFormat(new Date(original.lastAttendanceDate))
      }
    },
    {
      Header: "Approve Status",
      accessor: "deptApprovedStatus",
      filterable: false,
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.deptApprovedStatus} labelName={original.deptApprovedStatus} />
        );
      },
    },
    {
      Header: "Tc Status",
      accessor: "tcRequestStatus",
      disableSortBy:true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.tcRequestStatus} labelName={original.tcRequestStatus} />
        );
      },
    },
    {
      Header: "Fee Clearance status",
      accessor: "feePaidStatus",
      disableSortBy:true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.feePaidStatus} labelName={original.feePaidStatus} />
        );
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.tcRequestId} />
        );
      },
    },
  ];
}

export function generateLibraryTcColumns() {
  return [
    {
      Header: "Library Name",
      accessor: "libraryName",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Book Name",
      accessor: "bookName",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Accession Number",
      accessor: "accessionNumber",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Author Name",
      accessor: "authorName",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Book Price",
      accessor: "bookPrice",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Issuance Date",
      accessor: "issuanceDate",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
    {
      Header: "Return Date",
      accessor: "returnDate",
      disableSortBy: true,
      Cell: ({ value }: any) => value || "-",
    },
  ];
}

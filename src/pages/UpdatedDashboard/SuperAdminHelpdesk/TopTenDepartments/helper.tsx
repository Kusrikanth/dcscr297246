import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

export function generateColumns(openModal: any) {
  return [
    {
      Header: "Department Name",
      accessor: "departmentName",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Total Tickets",
      accessor: "totalTickets",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return <span onClick={() => openModal(original)} className="text-info cursor-pointer">{original?.totalTickets || 0}</span>;
      }
    },
  ];
}

export function generateStudentModalColumns() {
    return (
        [
        {
            Header: "Complaint No",
            accessor: "complaintNo",
            disableSortBy: true,
        },
        {
            Header: "Complaint Subject",
            accessor: "complaintSubject",
            disableSortBy: true,
        },
        {
            Header: "Created Date",
            accessor: "createdDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <>{getDdMmYyyyWithMonthNameFormat(original.createdDate)}</>
                )
            }
        },
        ]
    )
}
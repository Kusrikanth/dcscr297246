import { UserDetails } from "../../../../../Components/Common";

export function generateColumns() {
  return [
    {
      Header: "Student",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              imageUrl={original?.studentImageS3URL}
              size={"xs"}
              defaultImgType="student"
            />
          </>
        );
      },
    },
    {
      Header: "Subject",
      accessor: "subjectName",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Marks",
      accessor: "marks",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Status",
      accessor: "passStatus",
      disableSortBy: true,
      columnClassName: "",
      Cell: ({ row }: any) => {
        return <span className="tw-text-red-500">{row.original.status}</span>;
      },
    },
  ];
}


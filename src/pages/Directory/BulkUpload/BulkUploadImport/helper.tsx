export function generateColums() {
  return [
    {
      Header: "Sr.No",
      accessor: "srNo",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return row.index + 1;
      },
    },
    {
      Header: "Data Import Status",
      accessor: "dataImportStatus",
      disableSortBy: true,
    },
  ];
}

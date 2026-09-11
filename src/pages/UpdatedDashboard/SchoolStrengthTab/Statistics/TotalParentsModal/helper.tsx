export function generateColumns() {
  return [
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
    },
    {
      Header: "Staff Children",
      accessor: "staffChildren",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
    },
    {
      Header: "Elite Parents",
      accessor: "eliteParents",
      disableSortBy: true,
      tdClass: "tw-text-center",
      columnClassName: "tw-text-center",
    },
    {
      Header: "Others",
      accessor: "others",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
    },
    {
      Header: "Total",
      accessor: "total",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
    },
  ];
}
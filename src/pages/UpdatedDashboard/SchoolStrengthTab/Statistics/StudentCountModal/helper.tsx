export function generateColumns() {
  return [
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
    },
    {
      Header: "Cambridge",
      accessor: "cambridge",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
    },
    {
      Header: "CBSE",
      accessor: "cbse",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
    },
    {
      Header: "EYI-EYIII",
      accessor: "earlyYears",
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
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
      Header: "EY1-EY3",
      accessor: "earlyYears",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
    },
  ];
}


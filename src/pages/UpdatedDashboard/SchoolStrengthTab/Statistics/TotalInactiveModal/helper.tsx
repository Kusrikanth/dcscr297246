export function generateColumns() {
  return [
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
    },
    {
      Header: "Total Inactive",
      accessor: "totalInactive",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
    },
    {
      Header: "TC Issued",
      accessor: "tcIssued",
      disableSortBy: true,
      tdClass: "tw-text-center",
      columnClassName: "tw-text-center",
    },
    {
      Header: "Not Reporting",
      accessor: "notReporting",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
    },
    {
      Header: "Campus Transfer",
      accessor: "campusTransfer",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
    },
  ];
}

export const tableData = [
  {
    branchName: "Nacharam",
    tcRequests: 12,
    tcIssued: 79,
    notReporting: 0,
  },
  {
    branchName: "Nadergul",
    tcRequests: 0,
    tcIssued: 7,
    notReporting: 0,
  },
  {
    branchName: "Aerocity",
    tcRequests: 0,
    tcIssued: 9,
    notReporting: 0,
  },
  {
    branchName: "Mahendra Hills",
    tcRequests: 1,
    tcIssued: 4,
    notReporting: 0,
  },
];

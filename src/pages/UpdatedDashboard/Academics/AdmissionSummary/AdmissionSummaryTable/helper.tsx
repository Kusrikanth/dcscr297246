export function generateColumns() {
  return [
    {
      Header: "Admission Process",
      accessor: "admissionProcess",
      disableSortBy: true,
      Footer: "Total",
      columnClassName: "tw-text-center",
    },
    {
      Header: "Total Applications",
      accessor: "totalApplications",
      disableSortBy: true,
      Footer: "32",
      columnClassName: "tw-text-center",
    },
    {
      Header: "Current Status",
      accessor: "currentStatus",
      disableSortBy: true,
      Footer: "1561",
      columnClassName: "tw-text-center",
    },
  ];
}

export const tableData = [
  {
    admissionProcess: "Total Applications",
    currentStatus: 225,
    totalApplications: 1561,
    admissionsRegistred: "",
  },
  {
    admissionProcess: "Registration Completed",
    currentStatus: 68,
    totalApplications: 1336,
    admissionsRegistred: "",
  },
  {
    admissionProcess: "Exam Scheduled",
    currentStatus: 81,
    totalApplications: 1268,
    admissionsRegistred: "",
  },
  {
    admissionProcess: "Observation Completed",
    currentStatus: 54,
    totalApplications: 1187,
    admissionsRegistred: "",
  },
  {
    admissionProcess: "Panel Interview Scheduled",
    currentStatus: 116,
    totalApplications: 1133,
    admissionsRegistred: "",
  },
  {
    admissionProcess: "Cancelled/Rejected",
    currentStatus: 206,
    totalApplications: 1017,
    admissionsRegistred: 2,
  },
  {
    admissionProcess: "Interview result declared",
    currentStatus: 206,
    totalApplications: 1017,
    admissionsRegistred: 2,
  },
  {
    admissionProcess: "Admitted",
    currentStatus: 206,
    totalApplications: 1017,
    admissionsRegistred: 2,
  },
];

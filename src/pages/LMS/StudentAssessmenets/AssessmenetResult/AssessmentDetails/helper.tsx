export function generateColumns() {
  return [
    {
      Header: "Toppers Name",
      accessor: "toppersName",
      disableSortBy: true,
    },
    {
      Header: "Marks",
      accessor: "marks",
      disableSortBy: true,
    },
    {
      Header: "Time",
      accessor: "time",
      disableSortBy: true,
    },
    {
      Header: "Accuracy",
      accessor: "accuracy",
      disableSortBy: true,
    },
    {
      Header: "Q.Attempted",
      accessor: "qutionsAttempted",
      disableSortBy: true,
    },
  ];
}

export const tableData = [
  {
    toppersName: "YOU",
    marks: 2,
    time: "00:02:08",
    accuracy: "0%",
    qutionsAttempted: 3,
  },
  {
    toppersName: "TOPPER 1",
    marks: 17,
    time: "00:04:07",
    accuracy: "46.15%",
    qutionsAttempted: 13,
  },
  {
    toppersName: "TOPPER 2",
    marks: 8,
    time: "00:02:54",
    accuracy: "42.86%",
    qutionsAttempted: 7,
  },
  {
    toppersName: "TOPPER 3",
    marks: 5,
    time: "00:03:06",
    accuracy: "23.33%",
    qutionsAttempted: 30,
  },
  {
    toppersName: "TOPPER 4 (YOU)",
    marks: 2,
    time: "00:02:08",
    accuracy: "33.33%",
    qutionsAttempted: 3,
  },
  {
    toppersName: "TOPPER 5",
    marks: 1,
    time: "00:01:33",
    accuracy: "25%",
    qutionsAttempted: 4,
  },
];

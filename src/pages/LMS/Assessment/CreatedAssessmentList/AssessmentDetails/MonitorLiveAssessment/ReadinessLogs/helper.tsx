import {
  StatusLabel,
  UserDetails,
} from "../../../../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../../../Components/Common/MenuOptions";

const browserStatusObj = {
  WARN: "warning",
  OK: "success",
};

const internetStatusObj = {
  WARN: "warning",
  PASS: "success",
};
const eligilibyStatusObj = {
  NO: "warning",
  OK: "success",
};

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Time",
      accessor: "time",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const dateTime = original.time;
        return (
          <UserDetails
            displayName={dateTime.split(",")[0]}
            displayId={dateTime.split(",")[1]}
            showAvatar={false}
          />
        );
      },
    },
    {
      Header: "Student ID",
      accessor: "studentId",
      disableSortBy: true,
    },
    {
      Header: "Eligible",
      accessor: "eligible",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            labelName={original.eligible}
            type={eligilibyStatusObj?.[original.eligible]}
          ></StatusLabel>
        );
      },
    },
    {
      Header: "Internet",
      accessor: "internet",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            labelName={original.internet}
            type={internetStatusObj?.[original.internet]}
          ></StatusLabel>
        );
      },
    },
    {
      Header: "Browser",
      accessor: "browser",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            labelName={original.browser}
            type={browserStatusObj?.[original.browser]}
          ></StatusLabel>
        );
      },
    },
    {
      Header: "Screen",
      accessor: "screen",
      disableSortBy: true,
    },
    {
      Header: "Speed (Mbps)",
      accessor: "speed",
      disableSortBy: true,
    },
    {
      Header: "PASS/WARN/FAIL",
      accessor: "pws",
      disableSortBy: true,
    },
    {
      Header: "IP",
      accessor: "ip",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },
  ];
}

export const tableData = [
  {
    id: 1,
    time: "20 Aug 2025, 10:05:41",
    studentId: "STU-00045",
    eligible: "OK",
    internet: "PASS",
    browser: "OK",
    screen: "1920×1080",
    speed: "18.4",
    pws: "6 / 1 / 0",
    ip: "103.54.12.19",
  },
  {
    id: 2,
    time: "20 Aug 2025, 10:07:10",
    studentId: "STU-00712",
    eligible: "NO",
    internet: "PASS",
    browser: "WARN",
    screen: "1366×768",
    speed: "3.2",
    pws: "4 / 2 / 1",
    ip: "14.139.110.5",
  },
  {
    id: 3,
    time: "20 Aug 2025, 10:08:02",
    studentId: "STU-00231",
    eligible: "OK",
    internet: "PASS",
    browser: "OK",
    screen: "1600×900",
    speed: "9.6",
    pws: "6 / 1 / 0",
    ip: "49.205.18.76",
  },
  {
    id: 4,
    time: "20 Aug 2025, 10:09:17",
    studentId: "STU-00314",
    eligible: "OK",
    internet: "PASS",
    browser: "OK",
    screen: "1920×1080",
    speed: "22.1",
    pws: "7 / 0 / 0",
    ip: "115.97.11.201",
  },
  {
    id: 5,
    time: "20 Aug 2025, 10:10:33",
    studentId: "STU-00007",
    eligible: "OK",
    internet: "WARN",
    browser: "OK",
    screen: "1536×864",
    speed: "5.0",
    pws: "5 / 2 / 0",
    ip: "223.225.55.9",
  },
  {
    id: 6,
    time: "20 Aug 2025, 10:12:01",
    studentId: "STU-01010",
    eligible: "OK",
    internet: "PASS",
    browser: "OK",
    screen: "1920×1080",
    speed: "12.7",
    pws: "6 / 1 / 0",
    ip: "106.51.44.31",
  },
];

import {
  StatusLabel,
  UserDetails,
} from "../../../../../../../Components/Common";
import {
  MenuOptionHrtl,
  IOptionsHrtl,
} from "../../../../../../../Components/Common/MenuOptions";
import { Progress } from "reactstrap";

const resultModeObj = {
  scheduled: "warning",
  instant: "inprogress",
  released: "success",
};

const riskObj = {
  blocked: "tw-border-red-500 tw-text-red-500",
  ontrack: "tw-border-green-500 tw-text-green-500",
  delayed: "tw-border-yellow-500 tw-text-yellow-500",
};

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Evaluator",
      accessor: "evaluatorName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.evaluatorName}
            displayId={original.evaluatorId}
            size="xs"
          />
        );
      },
    },
    {
      Header: "Submissions",
      accessor: "submissions",
      disableSortBy: true,
      columnClassName: "",
      Cell: ({ row: { original } }: any) => {
        return <span>{`${original.submissions} / ${original.assigned}`}</span>;
      },
    },
    {
      Header: "Auto Graded",
      accessor: "autoGraded",
      disableSortBy: true,
      columnClassName: "w-150px max-w-150px min-w-150px",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-items-center">
            <Progress
              value={original?.autoGraded}
              max={original?.submissions}
              className="tw-flex-1 tw-me-2"
            />
            <p className="mb-0">{` ${original.assigned}%`}</p>
          </div>
        );
      },
    },
    {
      Header: "Pending",
      accessor: "pending",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Exceptions",
      accessor: "exceptions",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Result Mode",
      accessor: "resultMode",
      disableSortBy: true,
      columnClassName: "",
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            labelName={original?.resultMode}
            type={resultModeObj[original?.resultMode.toLowerCase()]}
          ></StatusLabel>
        );
      },
    },
    {
      Header: "Result At",
      accessor: "resultAt",
      disableSortBy: true,
      columnClassName: "",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.resultAt?.split(" ")[0]}
            displayId={original.resultAt?.split(" ")[1]}
            showAvatar={false}
          />
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      columnClassName: "",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex">
            {
              <span
                className={`tw-border ${
                  riskObj[original.status.toLowerCase().replace(/\s+/g, "")]
                } tw-text-xs tw-flex tw-justify-center tw-items-center tw-rounded tw-py-[2px] tw-px-2`}
              >
                {original.status}
              </span>
            }
          </div>
        );
      },
    },
    {
      Header: "Last Update",
      accessor: "lastUpdate",
      disableSortBy: true,
      columnClassName: "",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.lastUpdate?.split(" ")[0]}
            displayId={original.lastUpdate?.split(" ")[1]}
            showAvatar={false}
          />
        );
      },
    },
    // {
    //   Header: "% Complete",
    //   accessor: "percentComplete",
    //   disableSortBy: true,
    //   columnClassName: "",
    //   Cell: ({ row: { original } }: any) => {
    //     return <span>{`${original.percentComplete} %`}</span>;
    //   },
    // },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
    },
  ];
}

export const tableData = [
  {
    id: 1,
    className: "X-A",
    evaluatorName: "Prof. Sharma",
    evaluatorId: "EV-001",
    submissions: 10,
    assigned: 15,
    autoGraded: 8,
    pending: 5,
    exceptions: 2,
    resultMode: "Scheduled",
    resultAt: "2025-08-20 14:30",
    status: "Delayed",
    lastUpdate: "2025-08-21 10:15",
  },
  {
    id: 2,
    className: "X-B",
    evaluatorName: "Dr. Mehta",
    evaluatorId: "EV-002",
    submissions: 7,
    assigned: 13,
    autoGraded: 13,
    pending: 0,
    exceptions: 0,
    resultMode: "Instant",
    resultAt: "2025-08-18 09:00",
    status: "Blocked",
    lastUpdate: "2025-08-19 16:45",
  },
  {
    id: 3,
    className: "X-C",
    evaluatorName: "Ms. Kapoor",
    evaluatorId: "EV-003",
    submissions: 10,
    assigned: 18,
    autoGraded: 12,
    pending: 4,
    exceptions: 2,
    resultMode: "Released",
    resultAt: "2025-08-22 11:00",
    status: "On Track",
    lastUpdate: "2025-08-22 15:20",
  },
];

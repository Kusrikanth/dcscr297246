import {
  Cancel01Icon as Cancel01SolidIcon,
  Tick01Icon as Tick01SolicIcon,
} from "@hugeicons-pro/core-solid-standard";
import {
  MenuOptionHrtl,
  StatusLabel,
  UserDetails,
} from "../../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../../Components/Common/MenuOptions";
import { Progress } from "reactstrap";
import { HugeiconsIcon } from "@hugeicons/react";
import { getFormatteddateddMMMYYYY, getTimeFormatWithTimeZone } from "../../../../../../utility/dateutility";

export const readinessMenu = [
  {
    id: "eligible",
    label: "Eligible",
  },
  {
    id: "notEligible",
    label: "Not Eligible",
  },
];

const browserStatusObj = {
  WARN: "warning",
  OK: "success",
};

const internetStatusObj = {
  good: "tw-bg-green-500",
  warn: "tw-bg-yellow-500",
  poor: "tw-bg-red-500",
};
const riskObj = {
  high: "tw-border-red-500 tw-text-red-500",
  low: "tw-border-green-500 tw-text-green-500",
  medium: "tw-border-yellow-500 tw-text-yellow-500",
};

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student",
      accessor: "studentName",
      columnClassName: "sticky-left",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.studentName}
            displayId={original?.studentCode}
            size="xs"
          />
        );
      },
    },
    // {
    //   Header: "Readiness",
    //   accessor: "readiness",
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <span>
    //         <HugeiconsIcon
    //           className={
    //             original?.readiness ? "tw-text-green-500" : "tw-text-red-500"
    //           }
    //           icon={original?.readiness ? Tick01SolicIcon : Cancel01SolidIcon}
    //           size={18}
    //         />
    //       </span>
    //     );
    //   },
    // },
    {
      Header: "Started At",
      accessor: "startedAt",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="">
            {original.startedAt ? (
              <UserDetails
                displayName={getFormatteddateddMMMYYYY(original.startedAt)}
                displayId={original.startedAt ? getTimeFormatWithTimeZone(original.startedAt + 'Z') : ""}
                showAvatar={false}
              ></UserDetails>
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
    {
      Header: "Last Heartbeat",
      accessor: "lastHeartbeat",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="">
            {original.lastHeartbeat ? (
              <UserDetails
                displayName={getFormatteddateddMMMYYYY(original.lastHeartbeat)}
                displayId={original.lastHeartbeat ? getTimeFormatWithTimeZone(original.lastHeartbeat + 'Z') : ""}
                showAvatar={false}
              ></UserDetails>
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
    {
      Header: "Progress",
      accessor: "progress",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-text-center">
            {original.submittedAnswers && original.totalQuestions ? (
              <div className="tw-flex tw-items-center">
                <Progress
                  value={+original.submittedAnswers}
                  max={+original.totalQuestions}
                  className="tw-flex-1 tw-me-2"
                />
                <p className="mb-0">{original.submittedAnswers + "/" + original.totalQuestions}</p>
              </div>
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
    {
      Header: "Tab Switches",
      accessor: "tabsSwitched",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="">
            {original.progress ? (
              <span>{original.tabsSwitched}</span>
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
    {
      Header: "Full Screen",
      accessor: "fullscreen",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="">
            {original.fullscreen ? (
              <span>{original.fullscreen}</span>
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
    {
      Header: "Network",
      accessor: "network",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="">
            <StatusLabel labelName={original.networkMinSpeed} type={original.networkMinSpeed} />
          </div>
        );
      },
    },
    {
      Header: "Flags",
      accessor: "flags",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="">
            {original.flags ? <span>{original.flags}</span> : <span>-</span>}
          </div>
        );
      },
    },
    {
      Header: "Risk",
      accessor: "risk",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex">
            {original?.risk ? (
              <span
                className={`tw-border ${
                  riskObj[original.risk.toLowerCase()]
                } tw-text-xs tw-flex tw-justify-center tw-items-center tw-rounded tw-py-[2px] tw-px-2`}
              >
                {original.risk}
              </span>
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
     {
      Header: "Submitted At",
      accessor: "submittedAt",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="">
            {original.submittedAt ? (
              <UserDetails
                displayName={getFormatteddateddMMMYYYY(original.submittedAt)}
                displayId={original.submittedAt ? getTimeFormatWithTimeZone(original.submittedAt + 'Z') : ""}
                showAvatar={false}
              ></UserDetails>
            ) : (
              <span>-</span>
            )}
          </div>
        );
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.studentId} />
        );
      },
    },
  ];
}
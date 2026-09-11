import { StatusLabel, UserDetails } from "../../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../../Components/Common/MenuOptions";
import { getAmountValueWithDecimal } from "../../../../../utility/commonutility";
import { getDdMmYyyyWithMonthNameFormat, getDisplayDateForTableFormat } from "../../../../../utility/dateutility";
import { StatusLabelWithStepper } from "../../../../NewAcademics/TransferCertificate/StatusLabelWithStepper";



export const requestType = [
  {
    reqType: "Offline",
  },
  {
    reqType: "Online",
  }
]

// generate roll number table select filter
export const statusTypes = [
  {
    statusType: "Yet_to_prepare",
  },
  {
    statusType: "Prepared",
  },
  {
    statusType: "Issued",
  },
];

export const menuItems = [{ id: "true", name: "Yes" }, { id: "false", name: "No" }]

export function generateColumns(childInfo: any) {
  return [

    {
      Header: "Academic Year",
      accessor: "academicYearName",
      disableSortBy: true,
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              showAvatar={false}
              displayName={original?.studentName}
              displayId={original?.studentCode}
            />
          </>
        );
      },
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      columnClassName: 'tw-text-nowrap',
    },
    {
      Header: "Section",
      accessor: "section",
      disableSortBy: true,
    },
    {
      Header: "Request Type",
      accessor: "transportRequestType",
      disableSortBy: true,
      columnClassName: 'tw-text-nowrap',
    },
    {
      Header: "Request Date",
      accessor: "requestDate",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (<span className="tw-text-nowrap">{getDisplayDateForTableFormat(value)}</span>)
      },
    },
    {
      Header: "Address",
      accessor: "address",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "Request Status",
      accessor: "requestStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.transportRequestStatus} labelName={original.transportRequestStatus} />
        );
      },
    },
  ];
}
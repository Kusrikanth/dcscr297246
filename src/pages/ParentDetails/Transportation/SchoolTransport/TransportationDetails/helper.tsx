import { UserDetails } from "../../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../../Components/Common/MenuOptions";
import { getAmountValueWithDecimal } from "../../../../../utility/commonutility";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../../utility/dateutility";
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

function FeeTermList({ row: { original, id } }: any) {
  const { transportChangeRequestTermsDTOList } = original;
  if (Array.isArray(transportChangeRequestTermsDTOList)) {
    if (transportChangeRequestTermsDTOList.length === 0) {
      return (<span>-</span>);
    } else {
      return (
        <div className="tw-flex tw-flex-wrap">
          {
            transportChangeRequestTermsDTOList.map((item, index) => (<span className="tw-flex badge tw-me-1 tw-tw-text-nowrap tw-uppercase bg-light text-muted tw-p-2 tw-mb-1" key={`index-${id}-${index}`}>
              {item?.termName}
            </span>))
          }
        </div>
      )
    }
  } else {
    return (<span>-</span>);
  }
}

export function generateColumns(childInfo: any, loggedInUserInfo: any) {
  return [
    {
      Header: "Terms",
      accessor: "terms",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: FeeTermList
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
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Father Name",
      accessor: "fatherName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <>{original?.fatherName || "-"}</>;
      },
    },
    {
      Header: "Mobile Number",
      accessor: "mobileNumber",
      disableSortBy: true,
      Cell: () => {
        return <>{loggedInUserInfo?.mobile || "-"}</>;
      },
    },
    {
      Header: "Route",
      accessor: "routeName",
      disableSortBy: true,
      columnClassName: 'tw-text-nowrap',
    },
    {
      Header: "Stop Name",
      accessor: "dropPoint",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "Slabs",
      accessor: "slabName",
      disableSortBy: true,
      columnClassName: 'tw-text-nowrap',
    },
  ];
}
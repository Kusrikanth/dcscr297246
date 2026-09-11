import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { getDisplayDateForTableFormat } from "../../../../utility/dateutility";

function TermsTableCell({ row: { original, id } }: any) {
  const { ledgersData } = original;
  if (Array.isArray(ledgersData)) {
    if (ledgersData.length === 0) {
      return (<span>-</span>);
    } else {
      return (
        <div className="tw-flex tw-flex-col">
          {
            ledgersData.map((item, index) => (<span className="tw-flex badge tw-uppercase tw-bg-gray-100 tw-text-gray-600 tw-font-semibold tw-p-2 tw-mb-1" key={`index-${id}-${index}`}>
              <span className="tw-text-nowrap" style={{ marginRight: '4px' }}>{item?.feeDetails || "-"}{" "}:</span>
              <span className="tw-text-nowrap">₹{getDisplayAmountValue(item?.amountPaid)}</span>
            </span>))
          }
        </div>
      )
    }
  } else {
    return (<span>-</span>);
  }
}


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Academic Year",
      accessor: "academicYearName",
      disableSortBy: true,
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "classShortName",
      disableSortBy: true,
      columnClassName: 'tw-text-nowrap'
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
            />
          </>
        );
      },
    },
    {
      Header: "Request Date",
      accessor: "requestDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span>{getDisplayDateForTableFormat(original.requestDate)}</span>)
      },
    },
    {
      Header: "Claimed By",
      accessor: "claimedBy",
      disableSortBy: true,
    },
    {
      Header: "Term Payments",
      accessor: "termPayments",
      disableSortBy: true,
      Cell: TermsTableCell,
    },
    {
      Header: "Father / Mother Name",
      accessor: "parentName",
      disableSortBy: true,
    },
    {
      Header: "Descriptions",
      accessor: "remarks",
      disableSortBy: true,
    },
    {
      Header: "Approval Status",
      accessor: "approvedStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.approvedStatus} labelName={original.approvedStatus} />
        );
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { approvedStatus } = original;
        if (approvedStatus === 'APPROVED') {
          return (
            <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
          );
        } else {
          return "-";
        }
      },
    },
  ];
}

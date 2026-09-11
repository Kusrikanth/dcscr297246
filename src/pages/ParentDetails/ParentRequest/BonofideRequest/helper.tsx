import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { UpdatedUserDetails } from "../../../../Components/Common/UpdatedUserDetails";
import { getDisplayDateForTableFormat } from "../../../../utility/dateutility";

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
      accessor: "className",
      disableSortBy: true,
      columnClassName: "tw-w-[120px] tw-min-w-[120px]",
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
        return getDisplayDateForTableFormat(original.requestDate)
      },
    },
    {
      Header: "Issuance Date",
      accessor: "issuanceDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDisplayDateForTableFormat(original.issuanceDate)
      },
    },
    {
      Header: "Request Type",
      accessor: "requestType",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div>
            {original.requestType}
          </div>
        );
      },
    },
    {
      Header: "Preparation Status",
      accessor: "preparationStatus",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.preparationStatus} labelName={original.preparationStatus} />
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        const { preparationStatus } = original;
        if (preparationStatus === 'ISSUED') {
          return (
            <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
          );
        } else {
          return "-";
        }
      }
    },
  ];
}

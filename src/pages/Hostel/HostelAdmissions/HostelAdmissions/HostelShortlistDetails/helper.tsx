import { MenuOptionHrtl, StatusLabel, UserDetails } from "../../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../../utility/dateutility";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              showAvatar={false}
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
    },
    {
      Header: "Admission Date",
      accessor: "admissionDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.admissionDate)}</span>)
      },
    },
    {
      Header: "Hostel Fee Type",
      accessor: "hostelFeeType",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "hostelExitStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.hostelExitStatus} labelName={original.hostelExitStatus} />
        );
      },
    },
    {
      Header: "Action",
      thClass: "tw-w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const {hostelExitStatus} = original
        const updatedActions = actionList.filter((action) => {
          if((hostelExitStatus?.toLowerCase() === "active")){
            return action?.id !== "reActivate"
          }else if((hostelExitStatus?.toLowerCase() === "inactive")){
            return action?.id !== "hostel-termination"
          }
          return true
        })
        
        return (
        <MoreActions
            actionOptions={updatedActions}
            rowId={original.id}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}

export const statusMenuOptions = [
  {
    name: "Active",
    id: "ACTIVE",
  },
  {
    name: "In-Active",
    id: "INACTIVE",
  }
]

export const ignoredKeys = ["searchString", "academicYearId", "curriculumId", "classId"];

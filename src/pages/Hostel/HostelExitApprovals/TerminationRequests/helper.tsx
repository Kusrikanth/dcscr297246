import {
  MenuOptionHrtl,
  StatusLabel,
  UserDetails,
} from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "student",
      disableSortBy:true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
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
      disableSortBy:true,
    },
    {
      Header: "Class",
      accessor: "classShortName",
      disableSortBy:true,
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy:true,
    },
    {
      Header: "Request Date",
      accessor: "requestDate",
      disableSortBy:true,
      Cell:({row:{original}}:any)=>{
        return getDdMmYyyyWithMonthNameFormat(original.requestDate)
      }
    },
    {
      Header: "Exit Approval Status",
      accessor: "exitApprovalStatus",
      disableSortBy:true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.exitApprovalStatus} labelName={original.exitApprovalStatus} />
        );
      },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
        );
      },
    },
  ];
}



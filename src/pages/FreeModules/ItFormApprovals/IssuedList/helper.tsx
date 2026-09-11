import { StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import avatar1 from "../../../../assets/images/users/avatar-1.jpg";
import { convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";
import { issuedListTableData } from "./IssuedListTypes";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "w-200px min-w-200px max-w-200px",
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
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      columnClassName: "w-120px min-w-120px",
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Claimed By",
      accessor: "claimedBy",
      disableSortBy: true,
    },
    {
      Header: "Father / Mother Name",
      accessor: "parentName",
      disableSortBy: true,
    },
    {
      Header: "Request Type",
      accessor: "requestType",
      disableSortBy: true,
    },
    {
      Header: "Approval Date",
      accessor: "modifiedDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span>{getDdMmYyyyWithMonthNameFormat(original.modifiedDate)}</span>)
      },
    },
    {
      Header: "Email Status",
      accessor: "emailStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.emailStatus ? <StatusLabel type={original?.emailStatus} labelName={original?.emailStatus} /> : "-"
      }
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy: true,
    },
    {
      Header:"Created By",
      accessor:"createdBy",
      disableSortBy:true,
      Cell:({row:{original}}:any)=>{
        return <span>{original.createdBy ? original.createdBy : "-"}</span>
      }
    },
    {
        Header: "Created Date",
        accessor: "createdAt",
        disableSortBy: true,
        Cell:({row:{original}}:any)=>{
            const [date,time] = original?.createdAt?.split("T") ?? [];
            return <UserDetails
            displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
            displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
            showAvatar={false}
            ></UserDetails>
        }
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

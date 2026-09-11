import { MenuOptionHrtl, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>,toggleViewStudentLedgerModal?:any) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
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
      Header: "Request Date",
      accessor: "requestDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span>{getDdMmYyyyWithMonthNameFormat(original.requestDate)}</span>)
      },
    },
    {
      Header: "Request Description",
      accessor: "requestDescription",
      disableSortBy: true,
    },
    {
      Header: "Terms",
      accessor: "terms",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <button type="button" className="btn btn-text text-info" onClick={()=>toggleViewStudentLedgerModal(original.studentLedgerIds)}>Details</button>
        )
      },
    },
    {
      Header: "Request Type",
      accessor: "requestType",
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
export function generateViewStudentLedgerColumns() {
  return [
    {
      Header: "Fee Name",
      accessor: "feeDetails",
      disableSortBy: true,
    },
    {
      Header: "Amount",
      accessor: "amountPaid",
      disableSortBy: true,
    },
  ];
}

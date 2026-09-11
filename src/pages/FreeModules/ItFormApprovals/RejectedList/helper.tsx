import { UserDetails } from "../../../../Components/Common";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";

export function generateColumns() {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      disableSortBy:true,
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
      Header: "Class",
      accessor: "className",
      disableSortBy:true,
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy:true,
    },
    {
      Header: "Claimed By",
      accessor: "claimedBy",
      disableSortBy:true,
    },
    {
      Header: "Parents Name",
      accessor: "parentName",
      disableSortBy:true,
    },
    {
      Header: "Request Type",
      accessor: "requestType",
      disableSortBy:true,
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy:true,
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
  ];
}
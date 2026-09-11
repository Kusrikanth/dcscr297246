
import { UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";


export const TermData = [
  {
    type: "Term Wise",
    value: "termWise"
  },
  {
    type: "One Time",
    value: "oneTime"
  }
];


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px]",
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
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original.className ? original.className : '-'}</span>
        );
      },
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original.sectionName ? original.sectionName : '-'}</span>
        );
      },
    },
    // {
    //   Header: "Employee Name",
    //   accessor: "employeeName",
    //   disableSortBy: true,
    //   // columnClassName:'text-center',
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <span>{original.employeeName ? original.employeeName : '-'}</span>
    //     );
    //   },
    // },
    // {
    //   Header: "Sibling Name",
    //   accessor: "siblingName",
    //   disableSortBy: true,
    // },
    {
      Header: "Concession Amount (₹)",
      accessor: "concessionAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.concessionAmount)}</span>
        );
      },
    },
    // {
    //   Header: "Type",
    //   accessor: "feetypeName",
    //   disableSortBy: true,
    // },
    {
      Header: "Concession Type",
      accessor: "concessionType",
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

export function generateColumnsForViewDocument() {
  return [
    {
      Header: "File Name",
      accessor: "originalFileName",
      disableSortBy: true,
    },
     {
      Header: "Download",
      accessor: "s3URL",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { s3URL } = original;
        return (
          <>
          <div onClick={()=>window.open(s3URL,"_blank")}><i className="ri-download-line cursor-pointer text-info tw-text-lg"></i></div>
          </>
        );
      },
    },
    
  ];
}


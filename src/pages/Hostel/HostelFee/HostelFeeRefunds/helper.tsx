
import { convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../../utility/dateutility";
import {  getDisplayAmountValue } from "../../../../utility/commonutility";
import { UserDetails } from "../../../../Components/Common";

export function generateColumns() {
  return [
    {
      Header: "Refund Date",
      accessor: "refundDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="tw-text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.refundDate)}</span>)
      },
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      // thClass: "w-10",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px]",
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
      thClass: "tw-w-5",
      disableSortBy: true
    },
    {
      Header: "Class",
      accessor: "classShortName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="tw-text-nowrap">{original?.classShortName}</span>)
      },
    },
    {
      Header: "Refunded Amount (₹)",
      accessor: "refundAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.refundAmount)}</span>
        );
      },
    },
    {
      Header: "Payment Mode",
      accessor: "paymentMode",
      thClass: "tw-w-5",
      disableSortBy: true
    },
    {
      Header: "Transaction Id",
      accessor: "transactionId",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original?.transactionId || "-"}</span>
        );
      },
    },
    {
      Header: "Transaction Date",
      accessor: "transactionDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (<span className="text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.transactionDate)}</span>)
      },
    },
    {
      Header: "Adjustment Amount (₹)",
      accessor: "adjustAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.adjustAmount)}</span>
        );
      }
    },
    {
      Header: "Adjusted to",
      accessor: "adjustedTo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.adjustedStudentName}
              displayId={original?.adjustedStudentCode}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Cash Amount (₹)",
      accessor: "cashAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (<span>{getDisplayAmountValue(original.cashAmount)}</span>)
      },
    },
    {
      Header: "Cheque Amount (₹)",
      accessor: "chequeAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (<span>{getDisplayAmountValue(original.chequeAmount)}</span>)
      },
    },
    {
      Header: "Cheque No",
      accessor: "chequeNumber",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original?.chequeNumber || "n/a"}</span>
        );
      },
    },
    {
      Header: "In the Name Of",
      accessor: "accountPayeeName",
      thClass: "tw-w-10",
      disableSortBy: true
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


export function hasStateChanged(newState:any) {
  let count :any = 0;
  let showState :boolean =false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}}
import {  StatusLabel, UserDetails,} from "../../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../../../utility/commonutility";
import {  convertUTCToISTTimeOnly, getDdMmYyyyFormat, getFormattedDateddMMMYYYY } from "../../../../../utility/dateutility";

export function generateColumns(actionList:Array<IOptionsHrtl>) {
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
      accessor: "classShortName",
      disableSortBy: true,
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Rasied From",
      accessor: "insertedFrom",
      disableSortBy: true,
    },
    {
      Header: "Request Date",
      accessor: "createdDate",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (<span className="tw-text-nowrap">{value && getDdMmYyyyFormat(value)}</span>)
      },
    },
    {
      Header: "Issue Date",
      accessor: "issueDate",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return (<span className="tw-text-nowrap">{value && getDdMmYyyyFormat(value)}</span>)
      },
    },
    {
      Header: "Accounts Dept. Approval",
      accessor: "accountsDeptApproval",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.accountsDeptApproval} labelName={original.accountsDeptApproval} />
        );
      },
    },
    {
      Header: "Hostel Dept. Approval",
      accessor: "hostelDeptApproval",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.hostelDeptApproval} labelName={original.hostelDeptApproval} />
        );
      },
    },
    {
      Header: "Remarks",
      accessor: "reason",
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
      Header : "Action",
      thClass : "tw-w-[5%]",
      disableSortBy:true,
      Cell : ({row : {original}}:any) => {
        const {accountsDeptApproval, hostelDeptApproval} = original
        return (
          <>
          {
            accountsDeptApproval.toLowerCase() === "approved" || hostelDeptApproval.toLowerCase() === "approved" ? "" : <MenuOptionHrtl actionOptions={actionList} rowId={original.id}></MenuOptionHrtl>
          }
          </>
      )
      }
    }
  ];
} 

export function generateLedgerColumns() {
  return ([
    {
        Header: "Fee Details",
        accessor: "feeDetails",
        disableSortBy: true,
        columnClassName: "tw-w-[200px] tw-min-w-[200px]",
    },
    {
        Header: "Last Date",
        accessor: "lastDate",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            return <span className="tw-text-nowrap">{getDdMmYyyyFormat(original.lastDate)}</span>
        },
    },
    {
        Header: "Fee Amount (₹)",
        accessor: "amountToPay",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            return <span>{getDisplayAmountValue(original?.amountToPay)}</span>
        },
    },
    {
        Header: "Amount To Pay (₹)",
        accessor: "netAmount",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            return <span>{getDisplayAmountValue(original?.netAmount)}</span>
        },
    },
    {
        Header: "Amount Paid (₹)",
        accessor: "amountPaid",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            return <span>{getDisplayAmountValue(original?.amountPaid)}</span>
        },
    },
    {
        Header: "Balance (₹)",
        accessor: "balance",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            return <span>{getDisplayAmountValue(original?.balance)}</span>
        },
    },
    {
        Header: "Status",
        accessor: "paymentStatus",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            return <StatusLabel type={original?.paymentStatus} labelName={original?.paymentStatus} />
        },
    },
])
}

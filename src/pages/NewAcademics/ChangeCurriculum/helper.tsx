import { StatusLabel, UserDetails } from "../../../Components/Common";
import {
  IOptionsHrtl,
  MoreActions,
} from "../../../Components/Common/MenuOptions";
import { getAmountValueWithDecimal } from "../../../utility/commonutility";
import { convertUTCToISTTimeOnly, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";

export function generateFeeDetailsModalColumns() {
  return [
    {
      Header: "Fee Details",
      accessor: "feeDetails",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">{original?.feeDetails}</span>
        );
      },
    },
    {
      Header: "Amount to Pay (₹)",
      accessor: "amountToPay",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.amountToPay)}</span>
        );
      },
    },
    {
      Header: "Paid Amount (₹)",
      accessor: "paidAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.paidAmount)}</span>
        );
      },
    },
    {
      Header: "Balance Amount (₹)",
      accessor: "balanceAmount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.balanceAmount)}</span>
        );
      },
    },
    {
      Header: "Payment Status",
      accessor: "paymentStatus",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.paymentStatus} labelName={original.paymentStatus} />
        );
      },
    },
  ];
}
export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCodeNum}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "From Curriculum",
      accessor: "fromCurriculumName",
      disableSortBy: true,
    },
    {
      Header: "From Class",
      accessor: "fromClassName",
      disableSortBy: true,
    },
    {
      Header: "To Curriculum",
      accessor: "toCurriculumName",
      disableSortBy: true,
    },
    {
      Header: "To Class",
      accessor: "toClassName",
      disableSortBy: true,
    },
    {
      Header: "Approval Status",
      accessor: "approvedStatus",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.approvedStatus}
            labelName={original.approvedStatus}
          />
        );
      },
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
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        let updatedActionList:any=[]
        actionsList.map((action:any)=>original.approvedStatus==="PENDING"?updatedActionList.push(action):action.actionName==="View Ledger"&&updatedActionList.push(action))
        return (
          <MoreActions
            actionOptions={updatedActionList}
            rowId={`${original.curriculumChangeDetailsId},${original.studentId}`}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}



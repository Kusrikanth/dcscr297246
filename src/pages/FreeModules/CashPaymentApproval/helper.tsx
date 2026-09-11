import { MoreActions, StatusLabel, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import avatar1 from "../../../assets/images/users/avatar-1.jpg";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../utility/commonutility";
import { getDdMmYyyyFormat, getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";


export const TermData = [
  {
    type: "Term Wise",
    value:"termWise"
  },
  {
    type:"One Time",
    value:"oneTime"
  }
];

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  
  return [
    {
      Header: "Reciept No.",
      accessor: "receiptNumber",
      disableSortBy:true,
    },
    {
      Header: "Reciept Date",
      accessor: "receiptDate",
      disableSortBy:true,
      Cell:({row:{original}}:any)=>{
        return <span>{getDdMmYyyyWithMonthNameFormat(original?.receiptDate) || "N/A"}</span>
      }
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy:true,
    },
    {
      Header: "Student Name",
      accessor: "studentName",
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
    // {
    //   Header: "Section",
    //   accessor: "sectionName",
    //   disableSortBy:true,
    // //   columnClassName:'text-center',
    // //   Cell:({row:{original}}:any)=>{
    // //     return <span>{original.sectionName?original.sectionName:"-"}</span>
    // //   }
    // },
    {
      Header: "Cash Amount Paid (₹)",
      accessor: "currentPaidAmount",
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(original?.currentPaidAmount)}</span>
          // <div className="d-flex align-items-center">
            {/* <RupeeSvg width="11px" height="11px" fill={"#495057"} /> */}
          {/* </div> */}
      },
    },
    {
      Header: "Fine (₹)",
      accessor: "fine",
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return <span>{getDisplayAmountValue(original?.fine)}</span>
          // <div className="d-flex align-items-center">
          //   <RupeeSvg width="11px" height="11px" fill={"#495057"} />
          //   <span>{original?.amountPaid}</span>
          // </div>
      },
    },
    {
      Header: "Approval Status",
      accessor: "status",
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel type={original.status} labelName={original.status} />
        );
      },
    },
    {
      Header: "Remarks",
      accessor: "remarks",
      disableSortBy:true,
      // Cell: ({ row: { original } }: any) => {
      //   return <span>{getAmountValueWithDecimal(original?.amountToBePaid)}</span>
      //     // <div className="d-flex align-items-center">
      //     //   <RupeeSvg width="11px" height="11px" fill={"#495057"} />
      //     //   <span>{original?.amountToBePaid}</span>
      //     // </div>
      // },
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        
      return (original?.status==="PENDING") &&  (
          <MoreActions
            actionOptions={actionsList}
            rowId={original.feeCashId}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}

export const statusItems = [{
  status:"APPROVED"
},{
  status:"PENDING"
},{
  status:"REJECTED"
}]

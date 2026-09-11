import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { UserDetails } from "../../../Components/Common";
import {
  IOptionsHrtl,
  MoreActions,
} from "../../../Components/Common/MenuOptions";
import { getAmountValueWithDecimal, getDisplayAmountValue } from "../../../utility/commonutility";
import { TutionFeeConcessionTableData } from "./tutionFeeConcessionsTypes";

function downloadAll(url:any) {
  window.open(url?.s3URL, '_blank');
}


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "w-180px min-w-180px",
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
      accessor: "className",
      disableSortBy:true,
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy:true,
    },
    {
      Header: "Employee Name",
      accessor: "employeeName",
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            {original.employeeName?<UserDetails
              showAvatar={false}
              displayName={original.employeeName}
              displayId={original?.employeeCode}
            />:'-'}
          </>
        );
      },
    },
    {
      Header: "Sibling Name",
      accessor: "siblingName",
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            {original.siblingName?<UserDetails
              displayName={original?.siblingName}
              displayId={original?.siblingCode}
              showAvatar={false}
            />:'-'}
          </>
        );
      },
    },
    {
      Header: "Concession Amount (₹)",
      accessor: "totalConcessionAmount",
      disableSortBy:true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.totalConcessionAmount)}</span>
        );
      },
    },
    {
      Header: "Concession Type",
      accessor: "concessionType",
      disableSortBy:true,
    },
    // {
    //   Header: "Document",
    //   accessor: "fileInfo",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     const { fileInfo } = original;
    //     return (
    //       <>
    //         {
    //           fileInfo?.length > 0 ? <div onClick={()=>{
    //               for(let i = 0;i<fileInfo?.length;i++){
    //                 downloadAll(fileInfo[i])
    //               }
    //           }} className="text-info cursor-pointer">Download All</div> : "-"
    //         }
    //       </>
    //     );
    //   },
    // },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy:true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MoreActions
            actionOptions={actionsList}
            rowId={original.id}
            isHorizontal={true}
          />
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
           <div onClick={()=>window.open(s3URL,"_blank")}><i className="ri-download-line cursor-pointer text-info fs-20"></i></div>
          </>
        );
      },
    },
    
  ];
}


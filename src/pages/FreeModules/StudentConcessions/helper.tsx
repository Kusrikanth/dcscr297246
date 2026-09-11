import { MoreActions, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import {  getDisplayAmountValue } from "../../../utility/commonutility";


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
      columnClassName: "w-200px min-w-200px",
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
    {
      Header: "Employee Name",
      accessor: "employeeName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{original.employeeName ? original.employeeName : '-'}</span>
        );
      },
    },
    {
      Header: "Sibling Name",
      accessor: "siblingName",
      disableSortBy: true,
    },
    {
      Header: "Concession Amount (₹)",
      accessor: "totalConcessionAmount",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getDisplayAmountValue(original?.totalConcessionAmount)}</span>
        );
      },
    },
    {
      Header: "Type",
      accessor: "feetypeName",
      disableSortBy: true,
    },
    {
      Header: "Concession Type",
      accessor: "concessionType",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
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
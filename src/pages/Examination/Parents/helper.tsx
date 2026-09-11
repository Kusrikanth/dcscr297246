import React from "react";
import { MenuOptionHrtl, StatusLabel } from "../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../Components/Common/MenuOptions";

export function generateColumns(admitCardActions: Array<IOptionsHrtl>, progressCardActions: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Admit Card No",
      accessor: "admitCardNo",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
    },
    {
      Header: "Exam Name",
      accessor: "examinationName",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
    },
    {
      Header: "Curriculum Name",
      accessor: "curriculumName",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
    },
    {
      Header: "Class Name",
      accessor: "className",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
    },
    {
      Header: "Roll No",
      accessor: "rollNo",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
      columnClassName: "tw-w-[160px] tw-min-w-[160px] tw-max-w-[160px]",
    },
    {
      Header: "Status",
      accessor: "admitCardGenerated",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        const statusValue = value ? "GENERATED" : "NOT GENERATED";
        return (
          <StatusLabel type={statusValue} labelName={statusValue} />
        );
      },
    },
    {
      Header: "Admit Card",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        
        const isAdmitCardNoMissing = original.admitCardDownloadAllowed === true && original.admitCardGenerated === true;
        
        return (
          <div style={ !isAdmitCardNoMissing ? { pointerEvents: "none", opacity: 0.5, cursor: "not-allowed !important", } : {} } >
            <MenuOptionHrtl actionOptions={admitCardActions} rowId={`${original.studentId}_${original.examinationId}`} />
          </div>
        );
      },
    }
    // ,
    // {
    //   Header: "Progress Card",
    //   filterable: false,
    //   accessor: "progressCard",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     const isAdmitCardNoMissing = !original.admitCardNo;
    //     return (
    //       <div>
    //         <MenuOptionHrtl actionOptions={progressCardActions} rowId={`${original.studentId}_${original.examinationId}`} />
    //       </div>
    //     );
    //   },
    // },
  ];
}
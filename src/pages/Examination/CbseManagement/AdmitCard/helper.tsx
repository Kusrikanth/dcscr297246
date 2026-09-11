import React from "react";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { ExaminationDateDataTypes } from "./AdmitCardTypes";
import { StatusLabel, UserDetails } from "../../../../Components/Common";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Admit Card No",
      accessor: "admitCardNo",
      disableSortBy: true,
      columnClassName: "w-160px min-w-160px max-w-160px",
    },

    {
      Header: "Student",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "min-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.studentName}
            displayId={original?.studentCode}
            imageUrl={original?.studentImageBase64}
            size="xs"
          />
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
      Header: "Roll No",
      accessor: "rollNo",
      disableSortBy: true,
    },
    {
      Header: "Exam Name",
      accessor: "examinationName",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const status = original.admitCardNo ? "GENERATED" : "NOT GENERATED";
        return <StatusLabel type={status === "GENERATED" ? "generated" : "not eligible"} labelName={status} />;
      },
      columnClassName: "w-160px min-w-160px max-w-160px",
    },
    {
      Header: "Action",
      thClass: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const isAdmitCardNoMissing = !original.admitCardNo;

        const updatedActionList = actionList.map((item) => {         
            return {
              ...item,
              disabled: isAdmitCardNoMissing,
              onClickHndlr: isAdmitCardNoMissing ? undefined : item.onClickHndlr,
              actionIcon: isAdmitCardNoMissing
                ? React.cloneElement(item.actionIcon as React.ReactElement, { fill: "#cccccc", stroke: "#cccccc" })
                : item.actionIcon,
            };   
        });

        return (
          <MenuOptionHrtl actionOptions={updatedActionList} rowId={original.admitCardDetailsId} />
        );
      },
    },
  ];
}

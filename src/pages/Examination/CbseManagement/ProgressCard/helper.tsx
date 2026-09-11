import React, { useEffect, useMemo, useRef, useState } from "react";
import { InputCheckbox, StatusLabel, TextInput } from '../../../../Components/Common';
import { SelectInput, UserDetails, MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyFormat, getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

export const generationType = [
  {
    id: 'term',
    name: 'Term',
  },
  {
    id: 'exam',
    name: 'Exam',
  },
];

export function generateColumns(allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any, actionsList: Array<IOptionsHrtl>, isEarlyYearsManagement: any) {
  return [
    {
      Header: () => (
        <InputCheckbox
          name={"all-student"}
          value={allStudentSelectedState}
          onChange={allStudentCheckHndlr}
          formgroupClassName="mb-0"
        />
      ),
      accessor: "id",
      columnClassName: "w-5 sticky-left z-index-1",
      disableSortBy: true,
      Cell: ({ row: { original } }) => {
        const { studentId, isSelected, progressCardStatus } = original;
        return (
          <InputCheckbox
            name={`student-${studentId}`}
            value={isSelected}
            onChange={singleStudentCheckHndlr}
            dataId={studentId}
            formgroupClassName="mb-0"
          />
        );
      }
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      thClass: "w-15",
      disableSortBy: true,
      Cell: ({ row: { original } }) => (
        <UserDetails
          displayName={original?.studentName || "-"}
          displayId={original?.studentCode || "-"}
          imageUrl={original?.studentThumbImageUrl}
          size={"xs"}
          defaultImgType="student"
        />
      ),
    },
    {
      Header: "Roll No.",
      accessor: "rollNo",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    //   ...(isEarlyYearsManagement ? [
    //     {
    //     Header: "Modified By",
    //     accessor: "userTypeName",
    //     disableSortBy: true,
    //     Cell: ({ row: { original } }) => original.userTypeName || "-",
    //   },
    //   {
    //     Header: "Modified Date",
    //     accessor: "modifiedDate",
    //     disableSortBy: true,
    //     Cell: ({ row: { original } }: any) => {
    //       return (<span className="text-nowrap">{getDdMmYyyyWithMonthNameFormat(original.modifiedDate || "-")}</span>)
    //     },
    //   },
    //   {
    //     Header: "Status",
    //     accessor: "progressCardStatus",
    //     disableSortBy: true,
    //     Cell: ({ row: { original } }) => (
    //       <StatusLabel
    //         type={original.progressCardStatus === "INPROGRESS" ? "INPROGRESS" : original.progressCardStatus || "INPROGRESS"}
    //         labelName={original.progressCardStatus === "INPROGRESS" ? "INPROGRESS" : original.progressCardStatus || "INPROGRESS"}
    //       />
    //     ),
    //   }
    // ] : []),
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }) => {
        const { progressCardStatus, studentId, systemFileId } = original;
        const actionIds =
          progressCardStatus === "INPROGRESS" || progressCardStatus === null
            ? ["space-left", "generate", "space-right"]
            : ["regenerate", "preview", "download"];
        const actionOptions = isEarlyYearsManagement ? ((actionsList ?? [])
          .filter((action) => actionIds.includes(action.id))
          .map((action) => ({
            ...action,
            onClickHndlr: (event: any) => {
              event.currentTarget?.setAttribute("data-studentId", studentId?.toString() || "");
              event.currentTarget?.setAttribute("data-systemFileId", systemFileId?.toString() || "");
              action.onClickHndlr(event);
            },
          }))) : actionsList
        return actionOptions.length ? <MenuOptionHrtl actionOptions={actionOptions} rowId={studentId} /> : null;
      },
    },
  ];
}

export const filterOptions = [{ id: "MARKS", name: "Marks" ,itemDisabled : false}, { id: "GRADES", name: "Grades" ,itemDisabled : false}, { id: "BOTH_MARKS_GRADES", name: "Both",itemDisabled : false }]
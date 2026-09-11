import { useState } from "react";
import { InputCheckbox, MenuOptionHrtl, StatusLabel, UserDetails } from "../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";
import { Today_Date, getDdMmYyyyWithMonthNameFormat } from "../../../../../utility/dateutility";

export function generateColumnsStudentsAssingment(allStudentSelectedState: any, allStudentCheckHndlr: any, singleStudentCheckHndlr: any) {
  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            value={allStudentSelectedState}
            onChange={allStudentCheckHndlr}
            formgroupClassName="mb-0"
          />
        )
      },
      accessor: "isStudentChecked",
      columnClassName: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { studentId, isSelected, isDisabled } = original;

        return (
          <>
            <InputCheckbox
              name={`student-${studentId}`}
              value={isSelected}
              onChange={singleStudentCheckHndlr}
              dataId={studentId}
              formgroupClassName="mb-0"
              isDisabled={isDisabled}
            />
          </>
        )
      }
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              showAvatar
              imageUrl={original.studentImageBase64}
              displayName={original.studentName}
              displayId={original.studentCode}
              size="xs"
            />
          </>
        );
      },
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.sectionName ? original.sectionName : original?.className}
              displayId={original?.curriculumName}
              showAvatar={false}
            />
          </>
        );
      },
    },
    {
      Header: "Roll No.",
      accessor: "rollNo",
      disableSortBy: true,
    },
    {
      Header: "Phone No.",
      accessor: "phoneNumber",
      disableSortBy: true,
    },
  ];
}

export function generateColumns(actionList: Array<IOptionsHrtl>, assignedTo: string) {
  const columns: any[] = [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <UserDetails
          showAvatar
          imageUrl={original.studentImageBase64}
          displayName={original.studentName}
          displayId={original.studentCode}
          size="xs"
        />
      ),
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => (
        <UserDetails
          displayName={original?.sectionName ? original.sectionName : original?.className}
          displayId={original?.curriculumName}
          showAvatar={false}
        />
      ),
    },
    {
      Header: "Roll No.",
      accessor: "rollNo",
      disableSortBy: true,
    },
    {
      Header: "Phone No.",
      accessor: "phoneNumber",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <>{original.phoneNumber ? original.phoneNumber : original.phoneNo ? original.phoneNo : "-"}</>
      ),
    },
    {
      Header: "Assigned On",
      accessor: "assignedOn",
      disableSortBy: true,
      Cell: () => <>{getDdMmYyyyWithMonthNameFormat(Today_Date)}</>,
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <StatusLabel type={original.status || original?.studentStatus} labelName={original.status || original?.studentStatus} />
      ),
    },
  ];

  if (assignedTo === "STUDENT") {
    columns.push({
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <MenuOptionHrtl
          actionOptions={actionList}
          rowId={original.studentId}
        />
      ),
    });
  }

  return columns;
}




export const searchInputOptions = [
  { id: 'global', name: 'Global Search' },
  { id: 'questionNo', name: 'Question ID' },
  { id: 'question', name: 'Question' },
  { id: 'type', name: 'Type' },
  { id: 'difficulty', name: 'Difficulty' },
  { id: 'topic', name: 'Topic' },
]

export const assignedToOptions = [
  // { id: 'CLASS', name: 'Class' },
  { id: 'SECTION', name: 'Section' },
  { id: 'STUDENT', name: 'Students' },
];

export  function renderValueStatus(selectedItems: any) {
      if (Array.isArray(selectedItems)) {
        return (<div className="text-truncate">
          {
            selectedItems.map((item, index) => {
              return item?.sectionName + (index !== (selectedItems.length - 1) ? ', ' : '')
            })
          }
        </div>)
      }
    }

 export function renderOptionsStatus(item: { sectionName: string }): string {
        return item.sectionName;
    }
import React from "react";
import { AoSelectionDataTypes, AoSelectionDataTypesI, } from "./AoSelectionTypes";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../../Components/Common/MenuOptions";
import { InputCheckbox } from "../../../../../Components/Common";


export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      columnClassName: 'w-150px',
    },
    {
      Header: "Subjects",
      accessor: "subjectName",
      disableSortBy: true,
      columnClassName: 'w-200px',
    },
    {
      Header: "Term",
      accessor: "termName",
      disableSortBy: true,
      columnClassName: 'w-150px',
    },
    {
      Header: "Assesment Objectives",
      accessor: "assesmentObjectives",
      disableSortBy: true,
      columnClassName: 'w-400px',
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div>
              {original?.examinationAos?.map((ao: any, index: number) => (
                <div key={ao.aoTermSubjectDetailsId || index}>{index + 1}. {ao.aosDetails}</div>
              ))}
            </div>
          </>
        );
      },
    },
    {
      Header: "Actions",
      thClass: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
    },
  ];
}


export function generateColumnsI(allStudentSelectedState: any, allStudentCheckHndlr: any, singleStudentCheckHndlr: any) {
  return [
{
      Header: () => {
        return (
          <InputCheckbox
            name={"all-student"}
            // labelName={shortName}
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
        const { aoSubjectDetailsId, isSelected } = original;        
        return (
          <>
            <InputCheckbox
              name={`student-${aoSubjectDetailsId}`}
              // labelName={shortName}
              value={isSelected}
              onChange={singleStudentCheckHndlr}
              dataId={aoSubjectDetailsId}
              formgroupClassName="mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Assement Objectives",
      accessor: "aosDetails",
      disableSortBy: true,
    },

  ];
}


export const ignoredKeys = ["searchString", "academicYearId", "curriculumId", "classId"];
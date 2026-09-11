import React from "react";
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
      Header: "Category",
      accessor: "categoryName",
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
      Header: "Sub Category",
      accessor: "subCategories",
      disableSortBy: true,
      columnClassName: 'w-400px',
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div>
              {original?.subCategories?.map((subCategory: any, index: number) => (
                <div key={subCategory?.subCategoryId || index}>{index + 1}. {subCategory?.subCategoryName}</div>
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
        const { subCategoryId, isSelected } = original;
        return (
          <>
            <InputCheckbox
              name={`student-${subCategoryId}`}
              // labelName={shortName}
              value={isSelected}
              onChange={singleStudentCheckHndlr}
              dataId={subCategoryId}
              formgroupClassName="mb-0"
            />
          </>
        )
      }
    },
    {
      Header: "Sub Category",
      accessor: "subCategoryName",
      disableSortBy: true,
    },

  ];
}


export const ignoredKeys = ["searchString", "academicYearId", "curriculumId", "classId"];
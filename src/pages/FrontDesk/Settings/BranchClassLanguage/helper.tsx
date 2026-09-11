import { InputCheckbox, MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [

    {
      Header: "Subject Name",
      accessor: "subjectName",
      disableSortBy: true,
      columnClassName: 'w-200px',
    },
    {
      Header: "Language Name",
      accessor: "languageName",
      disableSortBy: true,
      columnClassName: 'w-200px',
    },
   {
     Header: "Language Type",
     accessor: "languageType",
     disableSortBy: true,
     columnClassName: 'w-200px',
   },
    {
      Header: "Action",
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

export function renderValueSection(selectedItems: any) {
  return `${selectedItems?.subjectName}`;
}

export function renderOptionsEmployee(item: any) {
  return `${item?.subjectName}`;
}

export const ignoredKeys = ["searchString", "academicYearId", "curriculumId", "classId"];

export const languageType = [
  {
    label: "First",
    value: "FIRST"
  },
  {
    label: "Second",
    value: "SECOND"
  },
  {
    label: "Third",
    value: "THIRD"
  }
]

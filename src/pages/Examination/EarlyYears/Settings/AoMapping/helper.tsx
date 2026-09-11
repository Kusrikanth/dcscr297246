import { InputCheckbox, MenuOptionHrtl } from "../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [

    {
      Header: "Subject Name",
      accessor: "subjectName",
      disableSortBy: true,
      columnClassName: 'w-200px',
    },
    {
      Header: "Assesment Objectives",
      accessor: "assesmentObjectives",
      disableSortBy: true,
      columnClassName: 'w-400px',
      Cell: ({ row: { original } }: any) => {
        return (
          <div>
            {original?.examinationAos?.map((ao: any, index: number) => (
              <div key={ao.aoSubjectDetailsId || index}>{index + 1}. {ao.aosDetails}</div>
            ))}
          </div>
        );
      },
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

import { InputCheckbox, MenuOptionHrtl } from "../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Subject Name",
      accessor: "subjectName",
      disableSortBy: true,
      columnClassName: "w-200px",
    },
    {
      Header: "Area of Strength",
      accessor: "areaOfStrengthDescription",
      disableSortBy: true,
      columnClassName: "w-300px text-justify",
      Cell: ({ row: { original } }: any) => {
        return (
          <div>
            {original?.areaOfStrengthDescription?.map((desc: string, index: number) => (
              <div key={index}><span className="fw-bold">{index + 1}</span>. {desc}</div>
            ))}
          </div>
        );
      },
    },
    {
      Header: "Area of Focus",
      accessor: "areaOfFocusDescription",
      disableSortBy: true,
      columnClassName: "w-300px text-justify",
      Cell: ({ row: { original } }: any) => {
        return (
          <div>
            {original?.areaOfFocusDescription?.map((desc: string, index: number) => (
              <div key={index}><span className="fw-bold">{index + 1}</span>. {desc}</div>
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
        return <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />;
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

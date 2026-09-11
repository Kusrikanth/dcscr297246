import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Main Attribute",
      accessor: "attributeName",
      disableSortBy: true,
    },
    {
      Header: "Sports Name",
      accessor: "sportsName",
      disableSortBy: true,
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Term",
      accessor: "termName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "sportsClassName",
      disableSortBy: true,
    },
    {
      Header: "Attribute Names",
      accessor: "subAttributes",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { subAttributes } = original || {};
        return (
          <div className="tw-w-full tw-flex tw-flex-wrap tw-gap-x-2 tw-gap-y-1">
            {subAttributes.map((item) => (
              <div key={item.id} className="badge text-muted tw-bg-[#4051891a]">
                {item.name}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.uniqueId}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export const ignoredKeys = ["searchString", "academicYearId", "curriculumId"];

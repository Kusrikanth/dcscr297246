import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
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
      Header: "Class",
      accessor: "classDetailsDto",
      disableSortBy: true,
      columnClassName: "w-400px min-w-400px max-w-400px",
      Cell: ({ row: { original } }: any) => {
        const { classDetailsDto } = original || {};
        return (
          <div className="tw-w-full tw-flex tw-flex-wrap tw-gap-x-2 tw-gap-y-1">
            {classDetailsDto.map((item) => (
              <div key={item.id} className="badge text-muted tw-bg-[#4051891a]">
                {item.className}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      Header: "Term Name",
      accessor: "termName",
      disableSortBy: true,
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

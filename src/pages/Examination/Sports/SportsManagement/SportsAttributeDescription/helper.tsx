import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(
  actionsList: Array<IOptionsHrtl>,
  getViewSportsDescriptionSubAttributeIdHandlr
) {
  return [
    {
      Header: "Main Attribute",
      accessor: "mainAttributeName",
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
      Header: "Sub Attribute",
      accessor: "subAttributes",
      disableSortBy: true,
      columnClassName: "w-250px min-w-250px max-w-250px",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="tw-flex tw-gap-3 tw-flex-wrap">
            {original.subAttributes.length > 0 ? (
              original.subAttributes.map((item) => (
                <div
                  data-id={original.uniqueId}
                  key={original.subAttributeId}
                  className="text-info text-decoration-underline cursor-pointer"
                  onClick={(e: any) =>
                    getViewSportsDescriptionSubAttributeIdHandlr(
                      e,
                      item.subAttributeId
                    )
                  }
                >
                  {item.subAttributeName}
                </div>
              ))
            ) : (
              <span>-</span>
            )}
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

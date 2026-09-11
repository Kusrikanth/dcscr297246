import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Fee Name",
      accessor: "feeName",
      disableSortBy: true,
    },
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
    },
    {
      Header: "Category",
      accessor: "category",
      disableSortBy: true,
    },
    {
      Header: "Sub Category",
      accessor: "subCategory",
      disableSortBy: true,
    },
    {
      Header: "Created Date",
      accessor: "createdDate",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

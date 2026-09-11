import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
    },
    {
      Header: "Company Name",
      accessor: "companyName",
      disableSortBy: true,
    },
    {
      Header: "Short Name",
      accessor: "shortName",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.companyId}
          />
        );
      },
    },
  ];
}

import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>, showInstituteAdminUI: boolean) {
  return [
    {
      Header: "Index",
      accessor: "domainIndex",
      disableSortBy: true,
    },
    {
      Header: "Domain Name",
      accessor: "name",
      disableSortBy: true,
    },
    {
      Header: "Order",
      accessor: "orderNum",
      disableSortBy: true,
    },
    {
      Header: "CreatedAt",
      accessor: "createdAt",
      disableSortBy: true,
    },
    ...(showInstituteAdminUI
      ? [{
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
        }]
      : []),
  ];
}
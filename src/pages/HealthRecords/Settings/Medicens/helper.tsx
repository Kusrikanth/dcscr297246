import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header:"Medicine",
            accessor:"name",
            disableSortBy: true,
        },
        {
            Header: "Quantity",
            accessor: "quantity",
            disableSortBy: true,
        },
        {
            Header: "Remarks",
            accessor: "remarks",
            disableSortBy: true,
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              return (
              <MenuOptionHrtl actionOptions={actionsList} rowId={original.medicineId}  />
              );
            },
          },
    ];
}

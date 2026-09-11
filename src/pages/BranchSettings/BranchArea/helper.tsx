import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Area Name",
            accessor: "areaName",
        },
        {
            Header: "Pin Code",
            accessor: "pinCode",
            disableSortBy: true
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                );
            },
        },
    ])
}
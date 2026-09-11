import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Class Name",
            accessor: "className",
        },
        {
            Header: "Class Order",
            accessor: "classOrder",
            disableSortBy: true
        },
        {
            Header: "Short Name",
            accessor: "shortName",
            disableSortBy: true
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.instituteClassId} />
                );
            },
        },
    ])
}
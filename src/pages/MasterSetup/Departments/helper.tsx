import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Department Name",
            accessor: "departmentName",
        },
        {
            Header: "Short Code",
            accessor: "shortName",
            disableSortBy: true
        },
        {
            Header: "Actions",
            disableSortBy: true,
            filterable: false,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.departmentId} />
                );
            },
        },
    ])
}


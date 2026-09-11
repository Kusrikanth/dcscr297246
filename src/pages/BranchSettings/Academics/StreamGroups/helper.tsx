import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../../Components/Common";

export interface ITermInfoTableData {
    id: number,
    termName: string,
    shortName: string,
    termType: string,
    startDate: string,
    endDate: string
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Groups",
            accessor: "groupName",
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
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                );
            },
        },
    ])
}

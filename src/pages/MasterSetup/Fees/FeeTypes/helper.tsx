import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../../Components/Common";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Fee Types",
            accessor: "feeType",
        },
        {
            Header: "Actions",
            disableSortBy: true,
            filterable: false,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                );
            },
        },
    ])
}

export const departmentData: Array<any> = [
    {
        id: "1",
        feeType: "One Time"
    },
    {
        id: "2",
        feeType: "Term Wise"
    },
    {
        id: "3",
        feeType: "Monthly"
    },
    {
        id: "4",
        feeType: "Half Yearly"
    }
]


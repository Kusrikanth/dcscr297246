import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Category Name",
            accessor: "departmentName",
            Cell: ({ row: { original } }: any) => {
                const { name } = original;
                return (
                    <span>{name}</span>
                );
            },
        },
        // {
        //     Header: "Short Name",
        //     accessor: "shortName",
        // },
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

export const departmentData: Array<any> = [
    {
        id: "1",
        name: "Academic"
    },
    {
        id: "2",
        name: "Transport"
    },
    {
        id: "2",
        name: "Admissions"
    }
]


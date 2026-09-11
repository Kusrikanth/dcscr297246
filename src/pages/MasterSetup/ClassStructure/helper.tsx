import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";

interface IClassTableData {
    id: number,
    className: string,
    shortName: string,
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Class Name",
            accessor: "className",
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
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original?.instituteClassId} />
                );
            },
        },
    ])
}


export const classData: Array<IClassTableData> = [
    {
        id: 1,
        className: "Preparatory",
        shortName: "PREP"
    }, {
        id: 2,
        className: "Pre-Nursery",
        shortName: "PN"
    },
    {
        id: 3,
        className: "Nursery",
        shortName: "NUR"
    }, {
        id: 4,
        className: "First Class",
        shortName: "I"
    },
    {
        id: 5,
        className: "Second Class",
        shortName: "II"
    }, {
        id: 6,
        className: "Third Class",
        shortName: "III"
    },
    {
        id: 7,
        className: "Fourth Class",
        shortName: "IV"
    }, {
        id: 8,
        className: "Fifth Class",
        shortName: "V"
    }, {
        id: 9,
        className: "Sixth Class",
        shortName: "VI"
    }
]
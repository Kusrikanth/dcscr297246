import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../../Components/Common";

export const subjectTypeOptions: Array<any> = [
    {
        id: "COSCHOLASTIC",
        name: "COSCHOLASTIC"
    },
    {
        id: "SCHOLASTIC",
        name: "SCHOLASTIC"
    },
    {
        id: "INTERNAL",
        name: "INTERNAL"
    }
]

export const coscholasticData: any = [{
    id: "AREA", name: "AREA"
}, {
    id: "ACTIVITY", name: "ACTIVITY"
}]


export const scoscholasticData: Array<any> = [
    {
        id: "CORE",
        name: "Core"
    }, {
        id: "LANGUAGE",
        name: "Language"
    }
]

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Subject Name",
            accessor: "subjectName",
        },
        {
            Header: "Short Name",
            accessor: "shortName",
            disableSortBy: true
        },
        {
            Header: "Subject Type",
            accessor: "subjectType",
            disableSortBy: true
        },
        {
            Header: "Subject Order",
            accessor: "numbering",
            disableSortBy: true
        },
        {
            Header: "Type",
            accessor: "coScholasticType",
            disableSortBy: true,
            Cell : ({ row: { original } }: any) => {
                return original?.coScholasticType || original?.scholasticType
            }
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

export const languageTypeOptions: any = [
    {
        id: "FIRST", name: "First"
    },
    {
        id: "SECOND", name: "Second"
    },
    {
        id: "THIRD", name: "Third"
    }
]
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";

export interface IAcademicTermTableData {
    id: number,
    termName: string,
    shortName: string,
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Term Name",
            accessor: "termName",
            // Cell: ({ value }: any) => {
            //     const { name } = value || {};
            //     return (<span>{name || "n/a"}</span>)
            // }
        },
        {
            Header: "Term Type",
            accessor: "masterTermTypeName",
            disableSortBy:true
            // Cell: ({ value }: any) => {
            //     const { name } = value || {};
            //     return (<span>{name || "n/a"}</span>)
            // }
        },
        {
            Header: "Short Name",
            accessor:"shortName",
            disableSortBy:true
            // Cell: ({ row: { original } }: any) => {
            //     const { masterTermEntity } = original || {},
            //         { shortCode } = masterTermEntity || {};
            //     return (<span>{shortCode || "n/a"}</span>)
            // }
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {                
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.instituteTermId} />
                );
            },
        },
    ])
}
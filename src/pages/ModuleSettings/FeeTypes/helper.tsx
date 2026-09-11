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
            Header: "Fee Type Name",
            accessor: "feeTypeName",
        },
        {
            Header: "Fee Type",
            accessor: "feeType",
        },
        {
            Header: "No. of Terms",
            accessor: "terms",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                const noOfInstallements = Array.isArray(value) ? value.length : 0;
                return (
                    <span className="ms-1">{noOfInstallements}</span>
                );
            },
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.feeTypeId} />
                );
            },
        },
    ])
}


export const academicTermTableData: Array<IAcademicTermTableData> = [
    {
        id: 1,
        termName: "Term I",
        shortName: "T1"
    }, {
        id: 2,
        termName: "Term II",
        shortName: "T2"
    },
    {
        id: 3,
        termName: "Term III",
        shortName: "T3"
    },
]
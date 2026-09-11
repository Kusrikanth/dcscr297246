import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

export interface IPrePrimaryTableData {
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
            Header: "Term Name",
            accessor: "termName",
        },
        // {
        //     Header: "Short Name",
        //     accessor: "shortName",
        // },
        {
            Header: "Class Name",
            accessor: "className",
        },
        {
            Header: "Start Date",
            accessor: "startDate",
            disableSortBy: true,
            columnClassName: "tw-text-nowrap",
            Cell: ({ row: { original } }: any) => {
                return getDdMmYyyyWithMonthNameFormat(new Date(original.startDate))
            }
        },
        {
            Header: "End Date",
            accessor: "endDate",
            disableSortBy: true,
            columnClassName: "tw-text-nowrap",
            Cell: ({ row: { original } }: any) => {
                return getDdMmYyyyWithMonthNameFormat(new Date(original.endDate))
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

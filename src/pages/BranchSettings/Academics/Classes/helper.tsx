import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Class Name",
            accessor: "className",
        },
        {
            Header: "Sequence Number",
            accessor: "classSequence",
            disableSortBy: true,
        },
        {
            Header: "Short Name",
            accessor: "shortName",
            disableSortBy: true,
        },
        {
            Header: "Start Date",
            accessor: "startDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original.startDate ? getDdMmYyyyWithMonthNameFormat(new Date(original.startDate)) : ""
            }
        },
        {
            Header: "End Date",
            accessor: "endDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original.endDate ? getDdMmYyyyWithMonthNameFormat(new Date(original.endDate)) : ""
            }
        },
        {
            Header: "No of Working Days",
            accessor: "totalWorkingDays",
            disableSortBy: true,
            Cell:({row:{original}}:any) => {
                return <span>{original.totalWorkingDays ? original.totalWorkingDays : "-" }</span>
            }
        },
        {
            Header: "JODO Student Id",
            accessor: "classJodoCode",
            disableSortBy: true,
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original?.id} />
                );
            },
        },
    ])
}

export const hostelMenuOptions = [
    {
        key : "YES",
        name : "Yes",
    },
    {
        key : "NO",
        name : "No",
    },
]
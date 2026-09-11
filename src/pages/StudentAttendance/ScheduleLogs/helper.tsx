import { getDateWithTimeFormat } from "../../../utility/dateutility";

export function generateColumns() {
    return [
        {
            Header: "Branch Time",
            accessor: "branchTime",
            disableSortBy: true,
        },
        {
            Header:"Task Name",
            accessor:"taskName",
            disableSortBy: true,
        },
        {
            Header:"Trigger Time1",
            accessor:"triggerTime1",
            disableSortBy: true,
        },
        {
            Header:"Trigger Time2",
            accessor:"triggerTime2",
            disableSortBy: true,
        },
        {
            Header:"Module",
            accessor:"module",
            disableSortBy: true,
        },
        {
            Header:"Sub Module",
            accessor:"subModule",
            disableSortBy: true,
        },
        {
            Header:"Triggered At",
            accessor:"createdAt",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                  getDateWithTimeFormat(original?.createdAt ? `${original?.createdAt}z` : '')
                );
            }
        }
    ];
}

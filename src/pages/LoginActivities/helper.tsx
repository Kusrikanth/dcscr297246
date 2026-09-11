import { getDdMmYyyyWithMonthNameFormat, getDateTime } from "../../utility/dateutility";

export function generateColumns() {
    return [
        {
            Header: "Name",
            accessor: "agentName",
            disableSortBy: true
        },
        {
            Header: "IP Address",
            accessor: "ipAddress",
            disableSortBy: true
        },
        {
            Header: "Date & Time",
            accessor: "dateCreated",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (<span>{getDateTime(original.dateCreated)}</span>)
            },
        },
    ];
}

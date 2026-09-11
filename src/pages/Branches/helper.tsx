import { StatusLabel, UserDetails } from "../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl, } from "../../Components/Common/MenuOptions";
import { getDdMmYyyyFormat } from "../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Branch Name",
            accessor: "branchName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <UserDetails
                        displayId={original.shortCode}
                        displayName={original.branchName}
                        size="xs"
                    />
                );
            },
        },
        {
            Header: "Institute Name",
            accessor: "instituteName",
            disableSortBy: true,
        },
        {
            Header: "Cotact Name",
            accessor: "contactPersonFirstName",
            disableSortBy: true,
        },
        {
            Header: "Email Id",
            accessor: "branchEmail",
            disableSortBy: true,
        },
        {
            Header: "Phone Number",
            accessor: "contactPersonNo",
            disableSortBy: true,
        },
        {
            Header: "Modified Date",
            accessor: "lastModifiedAt",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return (<span>{getDdMmYyyyFormat(value)}</span>)
            }
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            filterable: false,
            Cell: ({ row: { original } }: any) => {
                return (
                    <StatusLabel type={original.status} labelName={original.status} />
                );
            },
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.branchId} />
                );
            },
        },
    ])
}
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { StatusLabel, MenuOptionHrtl } from "../../../../Components/Common";

export interface IRoleTypesTableData {
    id: number,
    yearName: string,
    startDate: string,
    endDate: string,
    // eslint-disable-next-line no-restricted-globals
    status: string,
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Bank Name",
            accessor: "bankName"
        },
        {
            Header: "Bank Account No.",
            accessor: "bankAccountNumber",
            disableSortBy: true
        },
        {
            Header: "Account Branch",
            accessor: "bankBranchName",
            disableSortBy: true
        },
        {
            Header: "IFSC Code",
            accessor: "ifscCode",
            disableSortBy: true
        },
        {
            Header: "Account Type",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const value = original.isDefault ? "Default" : "Not Default";
                return (
                    <StatusLabel type={value} labelName={value} />
                );
            },
        },
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

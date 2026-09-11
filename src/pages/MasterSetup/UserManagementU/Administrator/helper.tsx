import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { MenuOptionHrtl, MoreActions, StatusLabel } from "../../../../Components/Common";


function getUserActions(userEnabled: any, actions: any) {
    if (userEnabled) {
        return actions.filter((item: any) => item.id !== "activate-user");
    } else {
        return actions.filter((item: any) => (item.id === "activate-user" || item.id === "delete"));
    }
}

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Name",
            accessor: "name",
            Cell: ({ row: { original } }: any) => {
                const { firstName, lastName } = original || {};
                return (
                    <span>{firstName} {lastName}</span>
                );
            },
        },
        {
            Header: "User Name",
            accessor: "username",
            disableSortBy: true
        },
        {
            Header: "Email Id",
            accessor: "email",
            disableSortBy: true
        },
        {
            Header: "Role",
            accessor: "role",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                const { name } = value || {};
                return (
                    <span>{name}</span>
                );
            },
        },
        {
            Header: "Branch",
            accessor: "branchName",
            disableSortBy: true
        },
        {
            Header: "Status",
            accessor: "enabled",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                const statusValue = value ? "Active" : "Inactive";
                return (
                    <StatusLabel type={statusValue} labelName={statusValue} />
                );
            },
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { enabled } = original, userActions = getUserActions(enabled, actionsList);
                return (
                    <MoreActions isHorizontal={true} actionOptions={userActions} rowId={original.id} />
                );
            },
        },
    ])
}
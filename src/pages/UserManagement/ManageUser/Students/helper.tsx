import {
    MoreActions,
    StatusLabel,
    UserDetails,
} from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";


function getUserActions(userEnabled: any, actions: any) {
    if (userEnabled) {
        return actions.filter((item: any) => item.id !== "activate-user");
    } else {
        return actions.filter((item: any) => (item.id === "activate-user" || item.id === "delete"));
    }
}
export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Student Name",
            accessor: "name",
            Cell: ({ row: { original } }: any) => {
                const { firstName, lastName, image } = original;
                return (
                    <>
                        <UserDetails
                            imageUrl={image}
                            displayName={`${firstName} ${lastName}`}
                            // displayId={student?.studentCode}
                            size="xs"
                            defaultImgType="student"
                        />
                    </>
                );
            },
        },
        {
            Header: "User Name",
            accessor: "username",
            disableSortBy: true,
        },
        {
            Header: "Phone Number",
            accessor: "mobile",
            disableSortBy: true,
        },
        {
            Header: "Email",
            accessor: "email",
            disableSortBy: true,
        },
        {
            Header: "Created Date",
            accessor: "createdDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (<span>{getDdMmYyyyWithMonthNameFormat(original.createdDate)}</span>)
            },
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
    ];
}
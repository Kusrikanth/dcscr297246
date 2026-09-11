import {
    MoreActions,
    StatusLabel,
    UserDetails,
} from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Family Name",
            accessor: "name",
            disableSortBy: true,
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
            Header: "Class-Section",
            accessor: "class",
            disableSortBy: true,
        },
        {
            Header: "Login Device",
            accessor: "loginDevice",
            disableSortBy: true,
        },
        {
            Header: "I.P. Address",
            accessor: "ipAddress",
            disableSortBy: true,
        },
        {
            Header: "Date & Time",
            accessor: "createdDate",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (<span>{getDdMmYyyyWithMonthNameFormat(original.createdDate)}</span>)
            },
        },
    ];
}
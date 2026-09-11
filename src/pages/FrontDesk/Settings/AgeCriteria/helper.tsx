import { MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Class",
            accessor: "classShortName",
            disableSortBy: true,
            columnClassName:"tw-w-[20%]"
        },
        {
            Header: "Age Limit",
            accessor: "ageLimit",
            disableSortBy: true,
            columnClassName:"tw-w-[20%]",
            Cell: ({ row: { original } }: any) => {
                return getDdMmYyyyWithMonthNameFormat(new Date(original?.ageLimit));
            },
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            columnClassName:"tw-w-[10%]",
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl
                        actionOptions={actionsList}
                        rowId={original.id}
                    />
                );
            },
        },
    ];
}
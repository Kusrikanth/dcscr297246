import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header:"Type of Work",
            accessor:"workTypeName",
            disableSortBy: true,
        },

        {
            Header:"Created Date",
            accessor:"createdAt",
            disableSortBy: true,
            Cell: ({ value }: any) => {
                return <span className="tw-text-nowrap">{value ? getDdMmYyyyWithMonthNameFormat(value) : "-"}</span>
            },
        },
        {
            Header: "Actions",
            filterable: false,
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.examinationWorkId} />
                );
            },
        },
    ];
}
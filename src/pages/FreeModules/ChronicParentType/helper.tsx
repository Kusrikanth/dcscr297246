import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";

// TODO: remove once the chronic-parent-types API is available. Lets the UI be reviewed without a backend.
export const USE_SAMPLE_CHRONIC_PARENT_TYPES = true;
export const sampleChronicParentTypes: Array<any> = [
    { id: 1, chronicParentTypeName: "Repeated Late Payment", createdAt: "2026-09-01T10:00:00" },
    { id: 2, chronicParentTypeName: "Cheque Bounce History", createdAt: "2026-09-03T10:00:00" },
    { id: 3, chronicParentTypeName: "Unresponsive to Follow-Ups", createdAt: "2026-09-05T10:00:00" },
    { id: 4, chronicParentTypeName: "Disputes Fee Amount", createdAt: "2026-09-08T10:00:00" },
];

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: "Chronic Parent Type",
            accessor: "chronicParentTypeName",
            disableSortBy: true,
        },
        {
            Header: "Created Date",
            accessor: "createdAt",
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
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                );
            },
        },
    ];
}

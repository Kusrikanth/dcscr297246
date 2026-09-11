import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import { MenuOptionHrtl } from "../../../Components/Common";

export const typeMenu = [
{ key: "LOGO_COLOR", label: "School Full Logo" },
{ key: "EMBLEM_WHITE", label: "School Emblem" },
];

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return ([
        {
            Header: "Display Name",
            accessor: "displayName",
        },
        {
            Header: "Document",
            accessor: "fileInfo",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                const { systemFile } = original || {};
                const { s3URL, originalFileName } = systemFile || {};

                return s3URL ? (
                    <a
                        href={s3URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tw-text-blue-600 tw-cursor-pointer"
                    >
                        {originalFileName}
                    </a>
                ) : (
                    "-"
                );
            },
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl actionOptions={actionsList} rowId={original.id} />
                );
            },
        },
    ])
}
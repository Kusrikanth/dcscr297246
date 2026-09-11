import { FileInfoCell } from "../AllFilesStorage/FileInfoCell";
import { getDateWithTimeFormat } from "../../../../utility/dateutility";
import { MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
    return [
        {
            Header: 'File',
            accessor: 'originalFileName',
            //   disableSortBy: true,

            Cell: ({ row: { original } }: any) => (
                <FileInfoCell
                    file={original}
                    showFolderPath
                    folderPath={original?.folderPath}
                />
            ),
        },
        {
            Header: "Owner",
            accessor: "createdByName",
            disableSortBy: true,
            Cell: ({ value }: any) => (
                <span className="tw-whitespace-nowrap">
                    {value || "-"}
                </span>
            ),
        },
        {
            Header: "Created At",
            accessor: "createdAt",
            //   disableSortBy: true,
            Cell: ({ value }: any) => (
                <span className="tw-whitespace-nowrap">
                    {value ? getDateWithTimeFormat(`${value}Z`) : "-"}
                </span>
            ),
        },
        {
            Header: "Size",
            accessor: "sizeFormatted",
            //   disableSortBy: true,
            Cell: ({ value }: any) => (
                <span>{value || "0 KB"}</span>
            ),
        },
        {
            Header: 'Actions',
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <MenuOptionHrtl
                        actionOptions={actionsList}
                        rowId={original.id}
                    ></MenuOptionHrtl>
                );
            },
        },
    ];
}

export const largeFileSizeMbOptions = [
    {
        id: "0",
        name: "All Sizes",
    },
    {
        id: "1",
        name: "Greater than 1 MB",
    },
    {
        id: "5",
        name: "Greater than 5 MB",
    },
    {
        id: "10",
        name: "Greater than 10 MB",
    },
    {
        id: "25",
        name: "Greater than 25 MB",
    },
    {
        id: "50",
        name: "Greater than 50 MB",
    },
    {
        id: "100",
        name: "Greater than 100 MB",
    },
    {
        id: "500",
        name: "Greater than 500 MB",
    },
    {
        id: "1024",
        name: "Greater than 1 GB",
    },
];

export const monthOptions = [
    {
        id: "0",
        name: "All",
    },
    {
        id: "1",
        name: "Older than 1 Month",
    },
    {
        id: "3",
        name: "Older than 3 Months",
    },
    {
        id: "6",
        name: "Older than 6 Months",
    },
    {
        id: "12",
        name: "Older than 12 Months",
    },
    {
        id: "24",
        name: "Older than 24 Months",
    },
    {
        id: "36",
        name: "Older than 36 Months",
    },
];
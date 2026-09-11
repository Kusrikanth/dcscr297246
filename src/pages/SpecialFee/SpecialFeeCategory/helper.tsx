
export function generateColumns() {
    return [
        {
            Header: "S.No",
            // accessor: "sNo",
            disableSortBy: true,
            columnClassName: "tw-w-[20%]",
            Cell: ({ row }: any) => {
                return row.index + 1
            }
        },
        {
            Header: "Category",
            accessor: "categoryName",
            disableSortBy: true,
        },
    ];
}



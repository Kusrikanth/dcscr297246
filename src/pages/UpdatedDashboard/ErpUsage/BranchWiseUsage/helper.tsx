
export function generateColumns() {
    return [
        {
            Header: "Branch",
            accessor: "branchName",
            disableSortBy: true,
            Footer: "Total",
        },
        {
            Header: "WEB",
            accessor: "web",
            disableSortBy: true,
            footerClassName: "tw-text-center",
            tdClass: "tw-text-center",
            columnClassName: "tw-text-center",
            Footer: (ele: any) => {
                const total = ele.rows.reduce(
                    (sum: number, row: any) => sum + (row.values.web || 0),
                    0
                );
                return <strong>{total}</strong>;
            },
        },
        {
            Header: "ANDROID",
            accessor: "android",
            disableSortBy: true,
            footerClassName: "tw-text-center",
            tdClass: "tw-text-center",
            columnClassName: "tw-text-center",
            Footer: (ele: any) => {
                const total = ele.rows.reduce(
                    (sum: number, row: any) => sum + (row.values.android || 0),
                    0
                );
                return <strong>{total}</strong>;
            },
        },
        {
            Header: "IOS",
            accessor: "ios",
            disableSortBy: true,
            footerClassName: "tw-text-center",
            tdClass: "tw-text-center",
            columnClassName: "tw-text-center",
            Footer: (ele: any) => {
                const total = ele.rows.reduce(
                    (sum: number, row: any) => sum + (row.values.ios || 0),
                    0
                );
                return <strong>{total}</strong>;
            },
        },
        {
            Header: "Total Count",
            accessor: "totalCount",
            disableSortBy: true,
            footerClassName: "tw-text-center",
            tdClass: "tw-text-center",
            columnClassName: "tw-text-center",
            Footer: (ele: any) => {
                const total = ele.rows.reduce(
                    (sum: number, row: any) => sum + (row.values.totalCount || 0),
                    0
                );
                return <strong>{total}</strong>;
            },
        },
        // {
        //     Header: "NOT LOGGED USERS",
        //     accessor: "notLoggedUsers",
        //     disableSortBy: true,
        //     footerClassName: "tw-text-center",
        //     columnClassName: "tw-text-center",
        //     Footer: (ele: any) => {
        //         const total = ele.rows.reduce(
        //             (sum: number, row: any) => sum + (row.values.notLoggedUsers || 0),
        //             0
        //         );
        //         return <strong>{total}</strong>;
        //     },
        // },
    ]
}


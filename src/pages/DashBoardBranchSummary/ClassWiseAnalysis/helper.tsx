
const generateGenderColumns = () => {
    return [
        {
            Header: "Total",
            accessor: "total",
            columnClassName: "tw-text-center",
            footerClassName: "tw-text-center",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.total || 0;
            },
        },
        {
            Header: "Male",
            accessor: "male",
            columnClassName: "tw-text-center",
            footerClassName: "tw-text-center",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.male || 0;
            },
        },
        {
            Header: "Female",
            accessor: "female",
            columnClassName: "tw-text-center",
            footerClassName: "tw-text-center",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.female || 0;
            },
        },
        {
            Header: "Others",
            accessor: "others",
            columnClassName: "tw-text-center",
            footerClassName: "tw-text-center",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return original?.others || 0;
            },
        }
    ];
};

export function generateColumns() {
    return [
        {
            id: "expander",
            disableSortBy: true,
            Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
                <span
                    {...getToggleAllRowsExpandedProps()}
                    className={`expander-btn fs-18 fw-normal ${isAllRowsExpanded ? "tw-bg-red-600" : "tw-bg-emerald-600"
                        }`}
                >
                    {isAllRowsExpanded ? "-" : "+"}
                </span>
            ),
            rowSpan: 2,
            columnClassName: "sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
            footerClassName: "bg-light sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
            Footer: "",
            columns: [
                {
                    Header: "Hidden",
                    displayNone: true,
                    disableSortBy: true,
                    columnClassName: "tw-sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
                    footerClassName: "bg-light sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
                    Footer: "",
                    Cell: ({ row }: any) =>
                        row.canExpand ? (
                            <span
                                {...row.getToggleRowExpandedProps({
                                    style: {
                                        paddingLeft: `${row.depth * 2}rem`,
                                    },
                                })}
                                className={`expander-btn fs-18 ${row.isExpanded ? "tw-bg-red-600" : "tw-bg-emerald-600"
                                    }`}
                            >
                                {row.isExpanded ? "-" : "+"}
                            </span>
                        ) : null,
                },
            ],
        },
        {
            Header: "Curriculum Name",
            accessor: "hiddenCurriculumName",
            disableSortBy: true,
            rowSpan: 2,
            columnClassName:
                "tw-text-nowrap tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
            footerClassName:
                "tw-text-nowrap tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
            Footer: "",
            columns: [
                {
                    Header: "hidden",
                    displayNone: true,
                    accessor: "curriculumName",
                    disableSortBy: true,
                    columnClassName:
                        "tw-text-nowrap tw-p-0 tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
                    footerClassName:
                        "tw-text-nowrap tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] bg-light",
                    Footer: "Total",
                    Cell: ({ row }: any) => {
                        const { curriculumName, showName } = row.original || {};
                        const displayName = row.depth === 0 && showName === "Total" ? curriculumName : "";

                        return (
                            <div
                                className="tw-flex tw-items-center tw-text-center tw-justify-center"
                                style={{
                                    padding: "0.4rem 0.7rem",
                                }}
                            >
                                <span>{displayName}</span>
                            </div>
                        );
                    },
                },
            ],
        },
        {
            Header: "Classes",
            accessor: "",
            disableSortBy: true,
            rowSpan: 2,
            columnClassName: "tw-text-center",
            footerClassName: "tw-text-white tw-font-bold",
            Footer: "",
            columns: [
                {
                    Header: "Class",
                    displayNone: true,
                    accessor: "showName",
                    columnClassName: "tw-text-center",
                    disableSortBy: true,
                    Footer: "",
                    footerClassName: "tw-text-white tw-font-bold",
                },
            ],
        },
        {
            Header: "Gender Analysis",
            accessor: "",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            footerClassName: "tw-text-white tw-font-bold",
            Footer: "",
            columns: [...generateGenderColumns()],
        },
    ];
}

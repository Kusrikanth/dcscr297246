

const generateDynamicColumns = (languageResp: any, type: 'second' | 'third') => {
    const seen = new Set();
    const prefix = type === 'second' ? 'sec' : 'third';
    return (Array.isArray(languageResp) && languageResp.length > 0)
        ? languageResp?.map((sub: any, index: any) => {
            const baseKey = sub?.languageName?.toLowerCase()?.replace(/\s+/g, '') || `lang-${index}`;
            let accessor = `${prefix}_${baseKey}`;
            let suffix = 1;

            // Ensure uniqueness within the group
            while (seen.has(accessor)) {
                accessor = `${prefix}_${baseKey}_${suffix++}`;
            }
            seen.add(accessor);
            return ({
                Header: (
                    <div title={sub?.languageName} className="text-truncate-two-lines">
                        {sub?.languageName}
                    </div>
                ),
                accessor,
                columnClassName: "tw-text-center",
                footerClassName: "tw-text-center",
                disableSortBy: true,
                Cell: ({ row: { original } }: any) => {
                    return original?.[`${type}-${sub?.languageName}`] || 0
                },
            })
        })
        : []
}

export function generateColumns(secondlangResp: any, thirdLangResp: any) {
    return [
        {
            id: "expander",
            disableSortBy: true,
            Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
                <span
                    {...getToggleAllRowsExpandedProps()}
                    className={`expander-btn fs-18 fw-normal ${isAllRowsExpanded ? "bg-danger" : "bg-success"
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
                    columnClassName: "sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
                    footerClassName:
                        "bg-light sticky-left tw-w-[100px] tw-min-w-[100px] tw-max-w-[100px]",
                    Footer: "",
                    Cell: ({ row }: any) =>
                        row.canExpand ? (
                            <span
                                {...row.getToggleRowExpandedProps({
                                    style: {
                                        paddingLeft: `${row.depth * 2}rem`,
                                    },
                                })}
                                className={`expander-btn fs-18 ${row.isExpanded ? "bg-danger" : "bg-success"
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
                        const { curriculumName, cellBgColor } = row.original || {};

                        return (
                            <>
                                <div
                                    className="tw-flex tw-items-center tw-text-center tw-justify-center"
                                    style={{
                                        padding: "0.4rem 0.7rem",
                                    }}
                                >
                                    <span>{curriculumName}</span>
                                </div>
                            </>
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
            footerClassName: "text-white fw-bold",
            Footer: "",
            columns: [
                {
                    Header: "Class",
                    displayNone: true,
                    accessor: "showName",
                    columnClassName: "tw-text-center",
                    disableSortBy: true,
                    Footer: "",
                    footerClassName: "text-white fw-bold",
                },
            ],
        },
        {
            Header: "Second Language",
            accessor: "",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            footerClassName: "text-white fw-bold",
            Footer: "",
            columns: [...generateDynamicColumns(secondlangResp, "second")],
        },
        {
            Header: "Third Languge",
            accessor: "",
            disableSortBy: true,
            columnClassName: "tw-text-center",
            footerClassName: "text-white fw-bold",
            Footer: "",
            columns: [...generateDynamicColumns(thirdLangResp, "third")],
        },
    ];
}



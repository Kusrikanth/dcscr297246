

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
                columnClassName: "text-center",
                footerClassName: "text-center",
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
            columnClassName: "sticky-left w-100px min-w-100px max-w-100px",
            footerClassName: "bg-light sticky-left w-100px min-w-100px max-w-100px",
            Footer: "",
            columns: [
                {
                    Header: "Hidden",
                    displayNone: true,
                    disableSortBy: true,
                    columnClassName: "sticky-left w-100px min-w-100px max-w-100px",
                    footerClassName:
                        "bg-light sticky-left w-100px min-w-100px max-w-100px",
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
                "text-nowrap text-center sticky-second-left w-200px min-w-200px max-w-200px",
            footerClassName:
                "text-nowrap text-center sticky-second-left w-200px min-w-200px max-w-200px",
            Footer: "",

            columns: [
                {
                    Header: "hidden",
                    displayNone: true,
                    accessor: "curriculumName",
                    disableSortBy: true,
                    columnClassName:
                        "text-nowrap p-0 text-center sticky-second-left w-200px min-w-200px max-w-200px",
                    footerClassName:
                        "text-nowrap text-center sticky-second-left w-200px min-w-200px max-w-200px bg-light",
                    Footer: "Total",
                    Cell: ({ row }: any) => {
                        const { curriculumName, cellBgColor } = row.original || {};

                        return (
                            <>
                                <div
                                    className="d-flex align-items-center text-center justify-content-center"
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
            columnClassName: "text-center",
            footerClassName: "text-white fw-bold",
            Footer: "",
            columns: [
                {
                    Header: "Class",
                    displayNone: true,
                    accessor: "showName",
                    columnClassName: "text-center",
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
            columnClassName: "text-center",
            footerClassName: "text-white fw-bold",
            Footer: "",
            columns: [...generateDynamicColumns(secondlangResp, "second")],
        },
        {
            Header: "Third Languge",
            accessor: "",
            disableSortBy: true,
            columnClassName: "text-center",
            footerClassName: "text-white fw-bold",
            Footer: "",
            columns: [...generateDynamicColumns(thirdLangResp, "third")],
        },
    ];
}



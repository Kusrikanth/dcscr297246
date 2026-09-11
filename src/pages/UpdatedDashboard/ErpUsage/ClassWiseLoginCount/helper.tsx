export function generateColumns() {
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
      Header: "Branch Name",
      accessor: "hiddenBranchName",
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
          accessor: "branchName",
          disableSortBy: true,
          columnClassName:
            "text-nowrap p-0 text-center sticky-second-left w-200px min-w-200px max-w-200px",
          footerClassName:
            "text-nowrap text-center sticky-second-left w-200px min-w-200px max-w-200px bg-light",
          Footer: "Total",
          Cell: ({ row: { original, ...otherValues } }: any) => {
            const { branchName, cellBgColor } = original || {};

            const { isExpanded } = otherValues || {};
            return (
              <div
                className="d-flex align-items-center text-center justify-content-center"
                style={{
                  padding: "0.4rem 0.7rem",
                }}
              >
                <span>{branchName}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      Header: "Curriculum",
      accessor: "",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "text-center",
      footerClassName: "text-white fw-bold",
      Footer: "",
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "curriculumType",
          columnClassName: "text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white fw-bold",
        },
      ],
    },
    {
      Header: "LOGGED IN",
      accessor: "loggedInCount",
      disableSortBy: true,
      columnClassName: "text-center",
      rowSpan: 2,
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "loggedInCount",
          columnClassName: "text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white fw-bold",
          Cell: ({ row: { original } }: any) => (+original?.loggedInCount || 0)
        },
      ],
    },
    {
      Header: "NOT LOGGED IN",
      accessor: "notLoggedInCount",
      disableSortBy: true,
      columnClassName: "text-center",
      rowSpan: 2,
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "notLoggedInCount",
          columnClassName: "text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white fw-bold",
          Cell: ({ row: { original } }: any) => (+original?.notLoggedInCount || 0),
        },
      ],
    },
    {
      Header: "TOTAL COUNT",
      accessor: "academicYear24Ios",
      disableSortBy: true,
      columnClassName: "text-center",
      rowSpan: 2,
      columns: [
        {
          Header: "",
          displayNone: true,
          accessor: "academicYear24Ios",
          columnClassName: "text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "text-white fw-bold",
          Cell: ({ row: { original } }: any) => (+original?.loggedInCount || 0) + (+original?.notLoggedInCount || 0),
        },
      ],
    },
  ];
}
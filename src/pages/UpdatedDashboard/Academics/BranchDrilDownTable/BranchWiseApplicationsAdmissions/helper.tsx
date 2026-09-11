
const generateDynamicColumns = (tableColumns: any) =>
  (Array.isArray(tableColumns) && tableColumns.length > 0)
    ? tableColumns?.map((item: any, index: any) => {
      const { academicYear } = item || {}
      return ({
        Header: academicYear ? `${academicYear}` : index,
        accessor: `${academicYear?.toLowerCase()?.split('-')?.join('')}`,
        disableSortBy: true,
        columnClassName: "tw-text-center",
        footerClassName: "tw-text-center",
        Footer: "",
        columns: [
          {
            Header: "Applications",
            accessor: `academicYear${academicYear}Applications`,
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => <span>{original?.[`academicYear${academicYear}Applications`] || 0}</span>,
          },
          {
            Header: "Admissions",
            accessor: `academicYear${academicYear}Admissions`,
            disableSortBy: true,
            columnClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => <span>{original?.[`academicYear${academicYear}Admissions`] || 0}</span>,
          },
        ],
      })
    })
    : [];

export function generateColumns(tableColumns: any) {
  return [
    {
      id: "expander",
      disableSortBy: true,
      Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }: any) => (
        <span
          {...getToggleAllRowsExpandedProps()}
          className={`expander-btn tw-font-normal ${isAllRowsExpanded ? "tw-bg-red-400" : "tw-bg-emerald-500"
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
                className={`expander-btn  ${row.isExpanded ? "tw-bg-red-400" : "tw-bg-emerald-500"
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
        "tw-text-nowrap tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      footerClassName:
        "tw-text-nowrap tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Footer: "",

      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "branchName",
          disableSortBy: true,
          columnClassName:
            "tw-text-nowrap tw-p-0 tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
          footerClassName:
            "tw-text-nowrap tw-text-center sticky-second-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px] bg-light",
          Footer: "Total",
          Cell: ({ row: { original, ...otherValues } }: any) => {
            const { branchName, cellBgColor } = original || {};

            const { isExpanded } = otherValues || {};
            return (
              <div
                className="tw-flex tw-items-center tw-text-center tw-justify-center"
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
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-white tw-font-bold",
      Footer: "",
      columns: [
        {
          Header: "Curriculum Type",
          displayNone: true,
          accessor: "curriculumType",
          columnClassName: "tw-text-center",
          disableSortBy: true,
          Footer: "",
          footerClassName: "tw-text-white tw-font-bold",
        },
      ],
    },
    ...generateDynamicColumns(tableColumns),
  ];
}

export const curriculumTypes = [
  {
    id : "CAMBRIDGE INTERNATIONAL",
    name : "CAMBRIDGE INTERNATIONAL"
  },
  {
    id : "CBSE",
    name : "CBSE"
  }
]
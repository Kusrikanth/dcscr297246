
const generateDynamicColumns = (tableColumns: any) =>
  (Array.isArray(tableColumns) && tableColumns.length > 0)
    ? tableColumns?.map((item: any, index: any) => {
      const { academicYearName } = item || {}
      return ({
        Header: academicYearName ? `${academicYearName}` : index,
        accessor: `${academicYearName?.toLowerCase()?.split('-')?.join('')}`,
        disableSortBy: true,
        columnClassName: "tw-text-center",
        tdClass: "tw-text-center",
        footerClassName: "tw-text-center",
        Footer: (rowsData: any) => {
          const { data } = rowsData || {}
          return (
            <span>
              {data.reduce((sum: any, row: any) => sum + (row?.[`${academicYearName}Admissions`] || 0), 0)}
            </span>
          );
        },
        Cell: ({ row: { original } }: any) => <div>
          {original?.[`${academicYearName}Admissions`] || "0"}
        </div>,
      })
    })
    : [];

export function generateColumns(tableCol: any) {
  return [
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
      Footer: "Total",
    },
    ...generateDynamicColumns(tableCol),
  ];
}


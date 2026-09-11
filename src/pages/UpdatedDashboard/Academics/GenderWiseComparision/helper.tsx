const findTotalStudents = (data: any, accessor: string) => {
  let totalStudents = 0
  if (Array.isArray(data) && data.length > 0) {
    data.map((original: any) => {
      totalStudents += (+(original)?.[accessor] || 0)
    })
  }
  return totalStudents || 0
}

const generateDynamicColumns = (totalBranches: any, openModal: any) =>
  (Array.isArray(totalBranches) && totalBranches.length > 0)
    ? totalBranches?.map((item: any, index: any) => {
      const { branchName: sub, branchId } = item || {}
      return ({
        Header: sub,
        accessor: `${sub?.toLowerCase()?.split(' ')?.join('')}`,
        disableSortBy: true,
        columnClassName: "tw-text-center",
        footerClassName: "tw-text-center",
        Footer: "",
        columns: [
          {
            Header: `Boys`,
            accessor: `${sub?.toLowerCase()?.split(' ')?.join('')}Boys`,
            disableSortBy: true,
            columnClassName: "tw-text-center",
            footerClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => {
              return <span>{original?.[`${sub?.toLowerCase()?.split(' ')?.join('')}Boys`] || 0}</span>;
            },
            Footer: (rowsData: any) => {
              const { data } = rowsData || {}
              return findTotalStudents(data, `${sub?.toLowerCase()?.split(' ')?.join('')}Boys`)
            }
          },
          {
            Header: "Girls",
            accessor: `${sub?.toLowerCase()?.split(' ')?.join('')}Girls`,
            disableSortBy: true,
            columnClassName: "tw-text-center",
            footerClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => {
              return <span>{original?.[`${sub?.toLowerCase()?.split(' ')?.join('')}Girls`] || 0}</span>;
            },
            Footer: (rowsData: any) => {
              const { data } = rowsData || {}
              return findTotalStudents(data, `${sub?.toLowerCase()?.split(' ')?.join('')}Girls`)
            }
          },
          {
            Header: "Others",
            accessor: `${sub?.toLowerCase()?.split(' ')?.join('')}Others`,
            disableSortBy: true,
            columnClassName: "tw-text-center",
            footerClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => {
              return <span>{original?.[`${sub?.toLowerCase()?.split(' ')?.join('')}Others`] || 0}</span>;
            },
            Footer: (rowsData: any) => {
              const { data } = rowsData || {}
              return findTotalStudents(data, `${sub?.toLowerCase()?.split(' ')?.join('')}Others`)
            }
          },
          {
            Header: "Total",
            accessor: `${sub?.toLowerCase()?.split(' ')?.join('')}Total`,
            disableSortBy: true,
            columnClassName: "tw-text-center tw-font-bold",
            footerClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => {
              const { className } = original || {}
              const key = original?.[`${sub?.toLowerCase()?.split(' ')?.join('')}Total`]
              return <span onClick={() => key && openModal({ branchId, classShortName: className, type: "TOTAL STUDENTS" })} className="text-info cursor-pointer">{key || 0}</span>;
            },
            Footer: (rowsData: any) => {
              const { data } = rowsData || {}
              return findTotalStudents(data, `${sub?.toLowerCase()?.split(' ')?.join('')}Total`)
            }
          },
        ],
      })
    })
    : [];

export function generateColumns(totalBranches: any,openModal: any) {
  return [
    {
      Header: "Class",
      accessor: "hiddenClassName",
      columnClassName:
        "tw-w-[150px] tw-min-w-[150px] tw-max-w-[150px] tw-text-center sticky-left",
      disableSortBy: true,
      rowSpan: 2,
      Footer: "",
      footerClassName: "tw-text-center sticky-left tw-bg-gray-100",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "className",
          columnClassName: "tw-text-center sticky-left",
          footerClassName: "tw-text-center sticky-left tw-bg-gray-100",
          disableSortBy: true,
          Footer: "TOTAL",
        },
      ],
    },
    ...generateDynamicColumns(totalBranches, openModal),
  ];
}

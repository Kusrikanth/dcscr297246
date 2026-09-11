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
            Header: `CBSE`,
            accessor: `${sub?.toLowerCase()?.split(' ')?.join('')}CBSE`,
            disableSortBy: true,
            columnClassName: "tw-text-center",
            footerClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => {
              return <span>{original?.[`${sub?.toLowerCase()?.split(' ')?.join('')}CBSE`] || 0}</span>;
            },
            Footer: (rowsData: any) => {
              const { data } = rowsData || {}
              return findTotalStudents(data, `${sub?.toLowerCase()?.split(' ')?.join('')}CBSE`)
            }
          },
          {
            Header: "IGCSE",
            accessor: `${sub?.toLowerCase()?.split(' ')?.join('')}IGCSE`,
            disableSortBy: true,
            columnClassName: "tw-text-center",
            footerClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => {
              return <span>{original?.[`${sub?.toLowerCase()?.split(' ')?.join('')}IGCSE`] || 0}</span>;
            },
            Footer: (rowsData: any) => {
              const { data } = rowsData || {}
              return findTotalStudents(data, `${sub?.toLowerCase()?.split(' ')?.join('')}IGCSE`)
            }
          },
          {
            Header: "EY",
            accessor: `${sub?.toLowerCase()?.split(' ')?.join('')}EY`,
            disableSortBy: true,
            columnClassName: "tw-text-center",
            footerClassName: "tw-text-center",
            Cell: ({ row: { original } }: any) => {
              return <span>{original?.[`${sub?.toLowerCase()?.split(' ')?.join('')}EY`] || 0}</span>;
            },
            Footer: (rowsData: any) => {
              const { data } = rowsData || {}
              return findTotalStudents(data, `${sub?.toLowerCase()?.split(' ')?.join('')}EY`)
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
              return <span onClick={() => key && openModal({ branchId, classShortName: className, type: "PROMOTION STATUS" })} className="text-info cursor-pointer">{key || 0}</span>;
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
      footerClassName: "tw-text-center sticky-left bg-light",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "className",
          columnClassName: "tw-text-center sticky-left",
          footerClassName: "tw-text-center sticky-left bg-light",
          disableSortBy: true,
          Footer: "TOTAL",
        },
      ],
    },
    ...generateDynamicColumns(totalBranches,openModal),
  ];
}

export const transformClassBranchData = (rawData: any[]) => {
  const groupedByClass = rawData?.reduce((acc, curr) => {
    const classKey = curr?.classShortName?.trim();
    const branchKey = curr?.branchName?.toLowerCase()?.replace(/\s+/g, '');

    if (!acc[classKey]) {
      acc[classKey] = { className: classKey };
    }

    const promotedKey = `${branchKey}Promoted`;
    const notPromotedKey = `${branchKey}NotPromoted`;
    const totalKey = `${branchKey}Total`;

    acc[classKey][promotedKey] = (acc[classKey][promotedKey] || 0) + curr?.promotedStudents;
    acc[classKey][notPromotedKey] = (acc[classKey][notPromotedKey] || 0) + curr?.notPromotedStudents;
    acc[classKey][totalKey] = acc[classKey][promotedKey] + acc[classKey][notPromotedKey];

    return acc;
  }, {} as Record<string, any>);

  return Object.values(groupedByClass);
};
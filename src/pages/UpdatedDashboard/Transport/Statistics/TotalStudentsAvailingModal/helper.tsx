export function generateColumns() {
  return [
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
      Footer : "Total",
    },
    {
      Header: "Term-I",
      accessor: "term1",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (+curr.term1 || 0), 0)
      },
    },
    {
      Header: "Term-II",
      accessor: "term2",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (+curr.term2 || 0), 0)
      },
    },
    {
      Header: "Term-III",
      accessor: "term3",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (+curr.term3 || 0), 0)
      },
    },
  ];
}


export function generateColumns() {
  return [
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
      Footer : "Total",
    },
    {
      Header: "Pre Primary",
      accessor: "studentCountPrePrimary",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
      footerClassName: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (+curr.studentCountPrePrimary || 0), 0)
      },
    },
    {
      Header: "Class I-XII",
      accessor: "studentCountGrade",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
      footerClassName: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (+curr.studentCountGrade || 0), 0)
      },
    },
    {
      Header: "Staff",
      accessor: "staffCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
      footerClassName: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (+curr.staffCount || 0), 0)
      },
    },
    {
      Header: "Total",
      accessor: "total",
      disableSortBy: true,
      columnClassName: "tw-text-center tw-font-semibold",
      tdClass: "tw-text-center",
      footerClassName: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (+curr.total || 0), 0)
      },
    },
  ];
}

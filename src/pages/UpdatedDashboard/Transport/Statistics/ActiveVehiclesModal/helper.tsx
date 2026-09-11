export function generateColumns() {
  return [
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: true,
      Footer: "Total",
    },
    {
      Header: "Total Vehicles",
      accessor: "totalVehiclesCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (+curr.totalVehiclesCount || 0), 0)
      },
    },
    {
      Header: "Active Vehicles",
      accessor: "activeVehiclesCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (+curr.activeVehiclesCount || 0), 0)
      },
    },
    {
      Header: "Total Drivers",
      accessor: "driversCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (+curr.driversCount || 0), 0)
      },
    },
    {
      Header: "Total Attendants",
      accessor: "attendersCount",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      tdClass: "tw-text-center",
      Footer: (rowsData: any) => {
        const { data = [] } = rowsData || {}
        return data?.reduce((acc: any, curr: any) => acc + (+curr.attendersCount || 0), 0)
      },
    },
  ];
}

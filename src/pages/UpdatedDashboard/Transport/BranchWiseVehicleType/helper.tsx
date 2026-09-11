const findTotalVehicle = (resp: any, type: any) => {
  const totalVehicles = resp?.reduce((acc: any, cur: any) => acc + +(cur?.[type] || 0), 0);
  return totalVehicles
}

const generateDynamicColumns = (totalVehicleTypes: any) =>
  (Array.isArray(totalVehicleTypes) && totalVehicleTypes.length > 0)
    ? totalVehicleTypes?.map((sub: any, index: any) => ({
      Header: (
        <div title={sub?.vehicleType} className="text-truncate-two-lines">
          {sub?.vehicleType}
        </div>
      ),
      accessor: sub?.vehicleType?.toLowerCase()?.split(' ')?.join('') || `${sub?.vehicleType}-${index}`,
      columnClassName: "tw-text-center",
      tdClass: "tw-text-center",
      footerClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return original?.[sub?.vehicleType] || 0
      },
      Footer: (rowsData: any) => {
        const { data } = rowsData || {}
        return findTotalVehicle(data, sub?.vehicleType)
      }
    }))
    : [];

export function generateColumns(totalVehicleTypes: any) {
  return [
    {
      Header: "Branch Name",
      accessor: "branchName",
      Footer: "Total",
    },
    ...generateDynamicColumns(totalVehicleTypes),
    {
      Header: "TOTAL",
      accessor: "total",
      // columnClassName: "tw-text-center",
      // footerClassName: "tw-text-center",
      Cell: ({ row: { original } }: any) => {
        return original?.total
      },
      Footer: (rowsData: any) => {
        const { data } = rowsData || {}
        return findTotalVehicle(data, 'total')
      }
    },
  ];
}

export const statusOptions = [
  {
    id: "ACTIVE",
    name: "Active",
  }, {
    id: "INACTIVE",
    name: "Inactive",
  }
]

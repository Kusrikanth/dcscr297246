export const menuData = [
  {
    id: "morning",
    name: "Morning",
  },
  {
    id: "afternoon",
    name: "Afternoon",
  },
  {
    id: "evening",
    name: "Evening",
  },
];


export function routeOccupancySummaryRowData(response: any) {
  const borderColors = ["#D8D4FE", "#BCE3FF", "#C4F4E4"]; 
  
  return response?.map((route: any, index: any) => ({
    routeName: route?.routeName || "Unknown Route",
    noOfStudents: route?.studentCount || 0,
    noOfStaff: route?.employeeCount || 0,
    seatingCapacity: route?.seatingCapacity || 0,
    occupiedCapacity: route?.capacityOccupied || 0,
    occupancy: (route?.occupancyPercentage || 0),
    borderColor: borderColors[index % borderColors.length],
  }));
}
const borderColors = ["#D8D4FE", "#BCE3FF", "#C4F4E4"]; 


export function generateColumns() {
  return [
    {
      Header: "Route Name",
      accessor: "routeName",
      disableSortBy: false,
      footerClassName: "fw-bold",
      columnClassName: "tw-min-w-[140px]",
      Cell: ({ row: { index, original } }: any) => {
        const borderColor = borderColors[index % borderColors.length];
        return (
          <div
            className="tw-flex tw-items-center  tw-ps-2"
            style={{ borderLeft: `4px solid ${borderColor}` }}
          >
            <i
              className="ri-map-pin-line tw-text-lg tw-me-2"
              style={{ color: borderColor }}
            ></i>
            <span className="text-truncate tw-text-nowrap" title={original.routeName}>             
              {original.routeName || "Unknown Route"}
            </span>
          </div>
        );
      },
      Footer: "Total",
    },
    {
      Header: "No of Students",
      accessor: "studentCount",
      disableSortBy: false,
      columnClassName: "tw-text-center tw-min-w-[140px]",
      footerClassName: "tw-text-center fw-bold",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {original.studentCount || 0}
          </span>
        );
      },
      Footer: ({ rows }: any) => {
        return (
          <span>
            {rows.reduce((sum: any, row: any) => sum + row.values.studentCount, 0)}
          </span>
        );
      }
    },
    {
      Header: "No of Staff",
      accessor: "employeeCount",
      disableSortBy: false,
      columnClassName: "tw-text-center tw-min-w-[120px]",
      footerClassName: "tw-text-center tw-font-bold",

      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {original.employeeCount || 0}
          </span>
        );
      },

      Footer: ({ rows }: any) => {
        return (
          <span>
            {rows.reduce((sum: any, row: any) => sum + row.values.employeeCount, 0)}
          </span>
        );
      }
    },
    {
      Header: "Seating Capacity",
      accessor: "seatingCapacity",
      disableSortBy: false,
      columnClassName: "tw-text-center tw-min-w-[150px]",
      footerClassName: "tw-text-center tw-font-bold",

      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {original.seatingCapacity || 0}
          </span>
        );
      },

      Footer: ({ rows }: any) => {
        return (
          <span>
            {rows.reduce((sum: any, row: any) => sum + row.values.seatingCapacity, 0)}
          </span>
        );
      }
    },
    {
      Header: "Capacity Occupied",
      accessor: "capacityOccupied",
      disableSortBy: false,
      columnClassName: "tw-text-center tw-min-w-[160px]",
      footerClassName: "tw-text-center tw-font-bold",

      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {original.capacityOccupied || 0}
          </span>
        );
      },

      Footer: ({ rows }: any) => {
        return (
          <span>
            {rows.reduce((sum: any, row: any) => sum + row.values.capacityOccupied, 0)}
          </span>
        );
      }
    },
    {
      Header: "Occupancy (%)",
      accessor: "occupancyPercentage",
      disableSortBy: false,
      columnClassName: "tw-text-center tw-min-w-[130px]",
      footerClassName: "tw-text-center tw-font-bold",
      Cell: ({ row: { original } }: any) => {
        return (
          <span className={`tw-text-nowrap ${
            original.occupancyPercentage < 50
              ? "tw-text-danger"
              : original.occupancyPercentage < 75
                ? "tw-text-warning"
                : "tw-text-success"
          }`}>
            {(original?.occupancyPercentage || 0).toFixed(2)}%
          </span>
        );
      },
      Footer: ({ rows }: any) => {
        return (
          <span>
            {(
              isNaN(rows.reduce((sum: any, row: any) => sum + row.values.occupancyPercentage, 0) / rows.length)
                ? 0
                : rows.reduce((sum: any, row: any) => sum + row.values.occupancyPercentage, 0) / rows.length
            ).toFixed(2)}%

          </span>
        );
      }
    },
  ];
}
export function generateColumnsSlabs() {
  return [
    {
      Header: "Slab Name",
      accessor: "slabName",
      disableSortBy: false,
      footerClassName: "fw-bold",
      columnClassName: "tw-min-w-[140px]",
      Cell: ({ row: { index, original } }: any) => {
        const borderColor = borderColors[index % borderColors.length];
        return (
          <div
            className="tw-flex tw-items-center  tw-ps-2"
            style={{ borderLeft: `4px solid ${borderColor}` }}
          >
            <i
              className="ri-map-pin-line tw-text-base tw-me-2"
              style={{ color: borderColor }}
            ></i>
            <span className="text-truncate text-nowrap" title={original.slabName}>
              {original.slabName || "Unknown Route"}
            </span>
          </div>
        );
      },
      Footer: "Total",
    },
    {
      Header: "No of Students",
      accessor: "studentCount",
      disableSortBy: false,
      columnClassName: " tw-min-w-[140px]",
      footerClassName: " fw-bold",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {original.studentCount || 0}
          </span>
        );
      },
      Footer: ({ rows }: any) => {
        return (
          <span>
            {rows.reduce((sum: any, row: any) => sum + row.values.studentCount, 0)}
          </span>
        );
      }
    },
    {
      Header: "No of Staff",
      accessor: "employeeCount",
      disableSortBy: false,
      columnClassName: "tw-min-w-[120px]",
      footerClassName: "fw-bold",

      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {original.employeeCount || 0}
          </span>
        );
      },

      Footer: ({ rows }: any) => {
        return (
          <span>
            {rows.reduce((sum: any, row: any) => sum + row.values.employeeCount, 0)}
          </span>
        );
      }
    }
  ];
}
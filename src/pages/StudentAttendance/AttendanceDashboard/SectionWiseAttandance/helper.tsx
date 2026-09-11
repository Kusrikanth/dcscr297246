const borderColors = ["#D8D4FE", "#BCE3FF", "#C4F4E4"]; 

export function generateColumns() {
  return [
    {
      Header: "Section Name",
      accessor: "label",
      disableSortBy: false,
      footerClassName: "fw-bold",
      columnClassName: "min-w-140px sticky-left",
      Cell: ({ row: {  original } }: any) => {
        return (
          <div
            className="tw-flex tw-items-center  tw-ps-2"
            style={{ borderLeft: `4px solid ${original.borderColor}` }}
          >
            <i
              className="ri-map-pin-line tw-text-lg tw-me-2"
              style={{ color: original.borderColor }}
            ></i>
            <span className="text-truncate tw-text-nowrap" title={original.label}>             
              {original.label || "Unknown Section"}
            </span>
          </div>
        );
      },
      Footer: "Total",
    },
    {
      Header: "Present",
      accessor: "present",
      disableSortBy: false,
      columnClassName: "text-truncate ",
      footerClassName: "tw-font-bold",
      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {original.present || 0}
          </span>
        );
      },
      Footer: ({ rows }: any) => {
        return (
          <span>
            {rows.reduce((sum: any, row: any) => sum + row.values.present, 0)}
          </span>
        );
      }
    },
    {
      Header: "Absent",
      accessor: "absents",
      disableSortBy: false,
      columnClassName: " tw-text-truncate ",
      footerClassName: " tw-font-bold",

      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {original.absents || 0}
          </span>
        );
      },

      Footer: ({ rows }: any) => {
        return (
          <span>
            {rows.reduce((sum: any, row: any) => sum + row.values.absents, 0)}
          </span>
        );
      }
    },
    {
      Header: "Holiday",
      accessor: "holiday",
      disableSortBy: false,
      columnClassName: " tw-text-truncate ",
      footerClassName: " tw-font-bold",

      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {original.holiday || 0}
          </span>
        );
      },

      Footer: ({ rows }: any) => {
        return (
          <span>
            {rows.reduce((sum: any, row: any) => sum + row.values.holiday, 0)}
          </span>
        );
      }
    },
    {
      Header: "Not Marked",
      accessor: "notMarked",
      disableSortBy: false,
      columnClassName: " tw-text-truncate ",
      footerClassName: " tw-font-bold",

      Cell: ({ row: { original } }: any) => {
        return (
          <span>
            {original.notMarked || 0}
          </span>
        );
      },

      Footer: ({ rows }: any) => {
        return (
          <span>
            {rows.reduce((sum: any, row: any) => sum + row.values.notMarked, 0)}
          </span>
        );
      }
    },
  ];
}
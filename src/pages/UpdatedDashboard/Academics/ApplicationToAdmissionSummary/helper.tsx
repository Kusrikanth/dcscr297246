
export const formatCamelCase = (str: string): string => str
.replace(/([A-Z])/g, ' $1')       // insert space before capital letters
.replace(/^./, (s) => s.toUpperCase()); // capitalize the first letter

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

const getStyledCell = (row: any, value: any) => {
  // 0 : green, 1-5:yellow, above 5 red
  const cellColor = value === 0 ? "#b6e8e1" : value <= 5 ? "#fdeac9" : "#fbd1c8";

  return (
    <div className="fw-semibold" style={{ padding: "0.4rem 0.7rem" }}>
      <span
        className="px-2 py-1 rounded"
        style={{ backgroundColor: `${cellColor}` }}
      >
        {value}
      </span>
    </div>
  );
};


const generateDynamicColumns = (totalCol?: any) =>
  totalCol
    ? totalCol?.map((sub: any, index: any) => ({
      Header: sub?.branchName,
      accessor: `${sub?.branchName}`,
      disableSortBy: true,
      columnClassName: "text-center p-0",
      Cell: ({ row, value }: any) => {
        return getStyledCell(row, value)
      },
    }))
    : [];


export function generateColumns(totalCol: any) {
  return [
    {
      Header: "Application Stage",
      accessor: "show",
      disableSortBy: true,
      columnClassName: "text-center",
    },
    ...generateDynamicColumns(totalCol),
    {
      Header: "Total",
      accessor: "total",
      disableSortBy: true,
      columnClassName: "fw-bold text-center",
      Cell: ({ row: { original } }: any) => {
        const val = totalCol?.reduce((acc: any, curr: any) => acc + (original[curr.branchName] || 0), 0)
        return <span>{val}</span>
      },
    },
  ];
}


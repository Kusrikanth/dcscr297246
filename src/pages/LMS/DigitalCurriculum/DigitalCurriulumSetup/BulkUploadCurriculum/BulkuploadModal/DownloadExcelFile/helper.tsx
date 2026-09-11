export function generateColumns() {
  return [
    {
      Header: "Column",
      accessor: "column",
      disableSortBy: true,
    },
    {
      Header: "Required",
      accessor: "required",
      disableSortBy: true,
    },
    {
      Header: "Example",
      accessor: "example",
      disableSortBy: true,
    },
  ];
}

export const downloadFileData = [
  {
    column: "Unit Name",
    required: "Yes",
    example: "Number Systems",
  },
  {
    column: "Unit Order",
    required: "No",
    example: "1",
  },
  {
    column: "Chapter Name",
    required: "Yes",
    example: "Rational Numbers",
  },
  {
    column: "Chapter Order",
    required: "No",
    example: "1",
  },
  {
    column: "Topic Name",
    required: "Yes",
    example: "Number Line",
  },
  {
    column: "Topic Order",
    required: "No",
    example: "1",
  },
];

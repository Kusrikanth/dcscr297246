export function generateColumns() {
  return [
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "shortName",
      disableSortBy: true,
      columnClassName: "tw-text-center"
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
      columnClassName: "tw-text-center"
    },
    {
      Header: "Total Students",
      accessor: "totalStudents",
      disableSortBy: true,
      columnClassName: "tw-text-center"
    },
    {
      Header: "Transport Opted Students",
      accessor: "transportOptedStudents",
      disableSortBy: true,
      columnClassName: "tw-text-center"
    },
    {
      Header: "Boys",
      accessor: "boysOpted",
      disableSortBy: true,
      columnClassName: "tw-text-center"
    },
    {
      Header: "Girls",
      accessor: "girlsOpted",
      disableSortBy: true,
      columnClassName: "tw-text-center"
    },
  ];
}

import { StatusLabel } from "../../../../../../../Components/Common";

export function generateColumns() {
  return [
    {
      Header: "Row #",
      accessor: "rowNumber",
      disableSortBy: true,
    },
    {
      Header: "Unit",
      accessor: "unitName",
      disableSortBy: true,
    },
    {
      Header: "Chapter",
      accessor: "chapterName",
      disableSortBy: true,
    },
    {
      Header: "Topic",
      accessor: "topicName",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <StatusLabel
          type={original?.status}
          labelName={original?.status || "—"}
        />
      )
    },
    {
      Header: "Message",
      accessor: "message",
      disableSortBy: true,
      Cell: ({ value }) => value || "—",
    },
  ];
}

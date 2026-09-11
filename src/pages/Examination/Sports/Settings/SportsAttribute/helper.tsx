import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      accessor: "sNo",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        return <span>{row.index + 1}</span>;
      },
    },
    {
      Header: "Attribute Name",
      accessor: "attributeName",
      disableSortBy: true,
    },
     {
      Header: "Table HeaderColor",
      accessor: "colorTag",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="fs-14 badge tw-bg-[#4051891a] px-1 text-dark fw-medium d-inline-flex align-items-center !tw-justify-center">
            <span
              className="rounded"
              style={{
                width: "20px",
                height: "12px",
                display: "inline-block",
                backgroundColor: `${original.tableHeaderColor}`,
              }}
            ></span>
          </div>
        );
      },
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export const tableData = [
  { id: 1, attributeName: "Cricket" },
  { id: 2, attributeName: "Football" },
  { id: 3, attributeName: "Basketball" },
  { id: 4, attributeName: "Tennis" },
  { id: 5, attributeName: "Badminton" },
  { id: 6, attributeName: "Hockey" },
  { id: 7, attributeName: "Table Tennis" },
  { id: 8, attributeName: "Baseball" },
  { id: 9, attributeName: "Swimming" },
  { id: 10, attributeName: "Volleyball" },
];

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
      Header: "Domain",
      accessor: "domainName",
      disableSortBy: true,
    },
     {
      Header: "Table HeaderColor",
      accessor: "color",
      disableSortBy: true,
      columnClassName: "",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="fs-14 badge tw-bg-[#4051891a] px-1 text-dark fw-medium d-inline-flex align-items-center !tw-justify-center">
            <span
              className="rounded"
              style={{
                width: "20px",
                height: "12px",
                display: "inline-block",
                backgroundColor: `${original.color}`,
              }}
            ></span>
          </div>
        );
      },
    },
    {
      Header: "Created By",
      accessor: "createdByName",
      disableSortBy: true,
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
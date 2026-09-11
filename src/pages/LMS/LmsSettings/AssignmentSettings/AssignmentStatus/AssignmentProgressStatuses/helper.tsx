import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex align-items-center">
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "6px",
                display: "block",
                flexShrink: 0,
                backgroundColor: `${original.color}`,
              }}
              className={`me-2`}
            ></span>
            <span>{original.status}</span>
          </div>
        );
      },
    },
    {
      Header: "Description",
      accessor: "description",
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

export const tableData = [
  {
    status: "Assigned",
    description: "Pushed to students but not yet started",
    color: "#FFD54F",
  },
  {
    status: "In Progress",
    description: "Some students have not submitted yet",
    color: "#4FC3F7",
  },
  {
    status: "Partially Completed",
    description: "Some students submitted, others pending",
    color: "#81C784",
  },
  {
    status: "Completed (All)",
    description: "All students submitted before the due date",
    color: "#388E3C",
  },
  {
    status: "Partially Evaluated",
    description: "Some submissions marked",
    color: "#BA68C8",
  },
  {
    status: "Fully Evaluated",
    description: "All submissions marked and finalized",
    color: "#6A1B9A",
  },
];

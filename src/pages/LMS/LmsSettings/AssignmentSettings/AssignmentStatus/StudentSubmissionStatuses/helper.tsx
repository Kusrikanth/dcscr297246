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
    id: 1,
    status: "Assigned",
    description: "Assignment visible, not yet submitted",
    color: "#0d6efd",
  },
  {
    id: 1,
    status: "Completed",
    description: "The assignment was completed before the due date.",
    color: "#28a745",
  },
  {
    id: 2,
    status: "Late",
    description: "The assignment was completed after the due date.",
    color: "#ffc107",
  },
  {
    id: 3,
    status: "In Progress",
    description:
      "The assignment has not been completed and the due date has not passed.",
    color: "#6A1B9A",
  },
  {
    id: 4,
    status: "Missed",
    description:
      "The assignment has not been completed and the due date has passed.",
    color: "#dc3545",
  },
];

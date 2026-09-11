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
              className={`bg-${original.color} me-2`}
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
    status: "Draft",
    description: "Assignment created but not published",
    color: "secondary",
    hex: "#6c757d",
  },
  {
    id: 2,
    status: "Published",
    description: "Visible to students; ready to track",
    color: "success",
    hex: "#198754",
  },
  {
    id: 3,
    status: "Assigned",
    description: "Students can view the assignment",
    color: "primary",
    hex: "#0d6efd",
  },
  {
    id: 4,
    status: "Archived",
    description: "Hidden from students, preserved for record",
    color: "warning",
    hex: "#ffc107",
  },
  {
    id: 5,
    status: "Deleted",
    description: "Permanently removed",
    color: "danger",
    hex: "#dc3545",
  },
];

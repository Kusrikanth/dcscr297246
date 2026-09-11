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
    status: "Not Marked",
    description: "Submission pending evaluation",
    color: "#dc3545",
  },
  {
    id: 2,
    status: "Marked / Graded",
    description: "Submission evaluated",
    color: "#198754",
  },
  {
    id: 3,
    status: "Feedback Returned",
    description: "Student received marks + feedback",
    color: "#ffc107",
  },
];

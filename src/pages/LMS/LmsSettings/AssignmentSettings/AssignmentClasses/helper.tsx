import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Classes",
      accessor: "classes",
      disableSortBy: true,
      columnClassName: "w-250px min-w-250px max-w-250px",
      Cell: ({ row: { original } }: any) => {
        const { classes } = original;
        return (
          <div className="d-flex flex-wrap gap-1">
            {Array.isArray(classes) &&
              classes.map((item) => (
                <span
                  className="badge text-muted p-2"
                  key={item.classId}
                  style={{ backgroundColor: "#4051891a" }}
                >
                  {item.className}
                </span>
              ))}
          </div>
        );
      },
    },
    {
      Header: "Common Assignment Types",
      accessor: "commonAssignmentTypes",
      disableSortBy: true,
      columnClassName: "w-350px min-w-350px max-w-350px",
      Cell: ({ row: { original } }: any) => {
        const { commonAssignmentTypes } = original;
        return (
          <div className="d-flex flex-wrap gap-1">
            {Array.isArray(commonAssignmentTypes) &&
              commonAssignmentTypes.map((item) => (
                <span
                  className="badge text-muted p-2"
                  key={item.assignmentId}
                  style={{ backgroundColor: "#4051891a" }}
                >
                  {item.assignmentName}
                </span>
              ))}
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
  {
    id: 1,
    classes: [
      { classId: 1, className: "Class 1" },
      { classId: 2, className: "Class 2" },
      { classId: 3, className: "Class 3" },
      { classId: 4, className: "Class 4" },
      { classId: 5, className: "Class 5" },
    ],
    commonAssignmentTypes: [
      { assignmentId: 1, assignmentName: "Worksheet" },
      { assignmentId: 2, assignmentName: "Assignment Sheet" },
      { assignmentId: 3, assignmentName: "Quiz" },
      { assignmentId: 4, assignmentName: "Concept Map" },
      { assignmentId: 5, assignmentName: "Formula Drill" },
    ],
  },
  {
    id: 2,
    classes: [
      { classId: 6, className: "Class 6" },
      { classId: 7, className: "Class 7" },
      { classId: 8, className: "Class 8" },
    ],
    commonAssignmentTypes: [
      { assignmentId: 1, assignmentName: "Worksheet" },
      { assignmentId: 2, assignmentName: "NCERT Exercise" },
      { assignmentId: 3, assignmentName: "Quiz" },
      { assignmentId: 4, assignmentName: "Project" },
      { assignmentId: 5, assignmentName: "Lab Activity" },
      { assignmentId: 6, assignmentName: "Error Analysis" },
      { assignmentId: 7, assignmentName: "Competency Test" },
    ],
  },
  {
    id: 3,
    classes: [
      { classId: 9, className: "Class 9" },
      { classId: 10, className: "Class 10" },
    ],
    commonAssignmentTypes: [
      { assignmentId: 1, assignmentName: "Board Pattern Practice" },
      { assignmentId: 2, assignmentName: "Timed Test" },
      { assignmentId: 3, assignmentName: "Project" },
      { assignmentId: 4, assignmentName: "Lab Activity" },
      { assignmentId: 5, assignmentName: "Error Analysis" },
      { assignmentId: 6, assignmentName: "Formula Drill" },
    ],
  },
  {
    id: 4,
    classes: [
      { classId: 11, className: "Class 11" },
      { classId: 12, className: "Class 12" },
    ],
    commonAssignmentTypes: [
      { assignmentId: 1, assignmentName: "NCERT Exercise" },
      { assignmentId: 2, assignmentName: "Timed Test" },
      { assignmentId: 3, assignmentName: "Board Pattern Practice" },
      { assignmentId: 4, assignmentName: "Quiz" },
      { assignmentId: 5, assignmentName: "Project" },
      { assignmentId: 6, assignmentName: "Custom Assignment" },
    ],
  },
];


export const assignmentOptions = [
  { assignmentId: 1, assignmentName: "Worksheet" },
  { assignmentId: 2, assignmentName: "Quiz" },
  { assignmentId: 3, assignmentName: "Project" },
  { assignmentId: 4, assignmentName: "Lab Activity" },
];
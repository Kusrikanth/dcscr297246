import {
  MenuOptionHrtl,
  StatusLabel,
  UserDetails,
} from "../../../../../../../Components/Common";

export function generateColumns(actionsList: any) {
  return [
    {
      Header: "Q.Id",
      accessor: "questionId",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Question Title",
      accessor: "questionTitle",
      disableSortBy: true,
    },
    {
      Header: "Marks",
      accessor: "marks",
      disableSortBy: true,
    },
    {
      Header: "Difficulty",
      accessor: "difficulty",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="fs-14 badge tw-bg-[#4051891a] tw-p-1.5 text-dark fw-medium d-inline-flex align-items-center">
            <span
              className="rounded me-2"
              style={{
                width: "12px",
                height: "12px",
                display: "inline-block",
                backgroundColor: `${original.difficultyColorCode}`,
              }}
            ></span>
            {original.difficulty}
          </div>
        );
      },
    },
    {
      Header: "Boolm's",
      accessor: "boolms",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <span className="tw-bg-[#4051891a] px-2 py-1 tw-rounded">{original.boolms}</span>;
      },
    },
    {
      Header: "Type",
      accessor: "questionType",
      disableSortBy: true,
      // Cell: ({ row: { original } }: any) => {
      //   return (
      //     <StatusLabel
      //       labelName={original.questionType}
      //       type={original.questionType}
      //     ></StatusLabel>
      //   );
      // },
    },
    // {
    //   Header: "Status",
    //   accessor: "status",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     return (
    //       <span className="tw-bg-green-50 tw-text-green-500 tw-py-0.5 tw-px-2 tw-rounded tw-border tw-border-green-200">
    //         Active
    //       </span>
    //     );
    //   },
    // },
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
    questionId: "Q-001",
    questionTitle: "Solve 2x² − 5x − 3 = 0 using the quadratic formula.",
    marks: 5,
    questionType: "MCQ",
    difficulty: "Medium",
    difficultyColorCode: "#feb019",
    boolms: "Apply",
  },
  {
    id: 2,
    questionId: "Q-002",
    questionTitle: "Find the derivative of f(x) = 3x³ − 4x² + x − 7.",
    marks: 4,
    questionType: "Short Answer",
    difficulty: "Easy",
    difficultyColorCode: "#0ab39c",
    boolms: "Understand",
  },
  {
    id: 3,
    questionId: "Q-003",
    questionTitle: "Evaluate ∫₀² (x² + 1) dx.",
    marks: 6,
    questionType: "Numerical",
    difficulty: "Medium",
    difficultyColorCode: "#feb019",
    boolms: "Analyze",
  },
  {
    id: 4,
    questionId: "Q-004",
    questionTitle: "State and prove the Pythagoras Theorem.",
    marks: 8,
    questionType: "Descriptive",
    difficulty: "Hard",
    difficultyColorCode: "#f06548",
    boolms: "Evaluate",
  },
  {
    id: 5,
    questionId: "Q-005",
    questionTitle: "What is the capital of France?",
    marks: 2,
    questionType: "MCQ",
    difficulty: "Easy",
    difficultyColorCode: "#0ab39c",
    boolms: "Remember",
  },
];

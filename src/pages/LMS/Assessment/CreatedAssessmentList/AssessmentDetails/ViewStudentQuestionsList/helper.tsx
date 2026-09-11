import { HugeiconsIcon } from "@hugeicons/react";
import { MenuOptionHrtl } from "../../../../../../Components/Common";
import { IOptionsHrtl } from "../../../../../../Components/Common/MenuOptions";
import { Cancel01Icon, Tick01Icon } from "@hugeicons-pro/core-stroke-standard";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "#",
      accessor: "srNo",
      disableSortBy: true,
    },
    {
      Header: "QID",
      accessor: "qid",
      disableSortBy: true,
    },
    {
      Header: "Summary",
      accessor: "summary",
      disableSortBy: true,
    },
    {
      Header: "Type",
      accessor: "type",
      disableSortBy: true,
    },
    {
      Header: "Max",
      accessor: "maxMarks",
      disableSortBy: true,
    },
    {
      Header: "Student Answer",
      accessor: "studentAnswer",
      disableSortBy: true,
    },
    {
      Header: "Key / Correct",
      accessor: "keyExpectation",
      disableSortBy: true,
    },
    {
      Header: "Auto Status",
      accessor: "autoStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div>
            <HugeiconsIcon
              icon={
                original.autoStatus === "Correct" ? Tick01Icon : Cancel01Icon
              }
              size={22}
              className={`${
                original.autoStatus === "Correct"
                  ? "tw-text-green-500"
                  : "tw-text-red-500"
              }`}
            />
          </div>
        );
      },
    },
    {
      Header: "Auto Marks",
      accessor: "autoMarks",
      disableSortBy: true,
    },
    {
      Header: "Final Marks",
      accessor: "finalMarks",
      disableSortBy: true,
    },
    {
      Header: "Manual Marks",
      accessor: "manualMarks",
      disableSortBy: true,
    },
    {
      Header: "Comments",
      accessor: "comments",
      disableSortBy: true,
    },
    {
      Header: "Flags",
      accessor: "flags",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
    },
  ];
}
export const tableData = [
  {
    id: 1,
    srNo: 1,
    qid: "QID-MATH-001",
    summary: "Solve: 2x + 3 = 9",
    type: "MCQ",
    maxMarks: 1,
    studentAnswer: "B",
    keyExpectation: "B",
    autoStatus: "Correct",
    autoMarks: 1,
    manualMarks: "—",
    comments: "—",
    flags: "—",
  },
  {
    id: 2,
    srNo: 2,
    qid: "QID-MATH-002",
    summary: "Identify prime: 21",
    type: "MCQ",
    maxMarks: 1,
    studentAnswer: "C",
    keyExpectation: "B",
    autoStatus: "Wrong",
    autoMarks: 0,
    manualMarks: "—",
    comments: "—",
    flags: "—",
  },
  {
    id: 3,
    srNo: 3,
    qid: "QID-MATH-003",
    summary: "Find perimeter of square",
    type: "Short",
    maxMarks: 2,
    studentAnswer: "12 cm",
    keyExpectation: "12 cm ± 0.5",
    autoStatus: "Correct",
    autoMarks: 2,
    manualMarks: "—",
    comments: "—",
    flags: "—",
  },
  {
    id: 4,
    srNo: 4,
    qid: "QID-MATH-004",
    summary: "Prove Pythagoras Thm",
    type: "Subjective",
    maxMarks: 8,
    studentAnswer: "Proof by contradiction…",
    keyExpectation: "State theorem, steps…",
    autoStatus: "—",
    autoMarks: "—",
    manualMarks: 6,
    comments: "Good structure",
    flags: "—",
  },
  {
    id: 5,
    srNo: 5,
    qid: "QID-MATH-005",
    summary: "Draw supply-demand curve",
    type: "Upload",
    maxMarks: 12,
    studentAnswer: "q5_chart.pdf",
    keyExpectation: "Graph + derivation",
    autoStatus: "—",
    autoMarks: "—",
    manualMarks: 12,
    comments: "Accurate",
    flags: "—",
  },
  {
    id: 6,
    srNo: 6,
    qid: "QID-MATH-006",
    summary: "Simplify: (x² – y²) / (x – y)",
    type: "MCQ",
    maxMarks: 1,
    studentAnswer: "D",
    keyExpectation: "C",
    autoStatus: "—",
    autoMarks: 0,
    manualMarks: "—",
    comments: "Skipped",
    flags: "Skipped",
  },
  {
    id: 7,
    srNo: 7,
    qid: "QID-MATH-007",
    summary: "Implement factorial()",
    type: "Code",
    maxMarks: 5,
    studentAnswer: "Run passed 7/10 tests",
    keyExpectation: "All tests pass",
    autoStatus: "—",
    autoMarks: "—",
    manualMarks: 4,
    comments: "Fails edge case",
    flags: "—",
  },
  {
    id: 8,
    srNo: 8,
    qid: "QID-MATH-008",
    summary: "Calculate area of triangle",
    type: "Short",
    maxMarks: 3,
    studentAnswer: "15 cm²",
    keyExpectation: "15 cm² ± 0.2",
    autoStatus: "Correct",
    autoMarks: 3,
    manualMarks: "—",
    comments: "—",
    flags: "—",
  },
  {
    id: 9,
    srNo: 9,
    qid: "QID-MATH-009",
    summary: "Solve for y: 3y - 5 = 10",
    type: "MCQ",
    maxMarks: 1,
    studentAnswer: "A",
    keyExpectation: "A",
    autoStatus: "Correct",
    autoMarks: 1,
    manualMarks: "—",
    comments: "—",
    flags: "—",
  },
  {
    id: 10,
    srNo: 10,
    qid: "QID-MATH-010",
    summary: "Explain derivative concept",
    type: "Subjective",
    maxMarks: 6,
    studentAnswer: "Rate of change explanation…",
    keyExpectation: "Definition, examples, notation",
    autoStatus: "—",
    autoMarks: "—",
    manualMarks: 5,
    comments: "Good but missing example",
    flags: "—",
  },
];

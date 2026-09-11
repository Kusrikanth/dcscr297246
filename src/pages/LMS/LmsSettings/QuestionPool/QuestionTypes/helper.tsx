import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.No",
      accessor: "serialNo",
      disableSortBy: true,
      Cell: ({ row }: any) => {
        const { index } = row;
        return <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>;
      },
    },
    {
      Header: "Question Type",
      accessor: "questionType",
      disableSortBy: true,
    },
    {
      Header: "Short Name",
      accessor: "shortName",
      disableSortBy: true,
    },
    {
      Header: "Typical Marks",
      accessor: "typicalMarks",
      disableSortBy: true,
    },
    {
      Header: "Format / style",
      accessor: "formatStyle",
      disableSortBy: true,
      columnClassName: "w-350px min-w-350px max-w-350px",
    },
    // {
    //   Header: "Tags",
    //   accessor: "questionTags",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     const { tags } = original;
    //     return (
    //       <div className="d-flex flex-wrap gap-1">
    //         {(tags ?? '').split(',').map((tag: string) => (
    //           <span
    //             className="badge text-muted p-2"
    //             style={{ backgroundColor: "#4051891a" }}
    //             key={tag}
    //           >
    //             {tag.trim()}
    //           </span>
    //         ))}
    //       </div>
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
    questionType: "Very Short Answer",
    shortName: "VSA",
    typicalMarks: "1-2 Marks",
    questionFormat: "One-line or brief sentence answers",
    questionTags: [
      { id: 1, tagName: "Quick Response" },
      { id: 2, tagName: "Short" },
    ],
  },
  {
    id: 2,
    questionType: "Short Answer Type – I",
    shortName: "SA-I",
    typicalMarks: "2-3 Marks",
    questionFormat: "Short paragraph responses",
    questionTags: [
      { id: 1, tagName: "Short Paragraph" },
      { id: 2, tagName: "Concise" },
    ],
  },
  {
    id: 3,
    questionType: "Short Answer Type – II",
    shortName: "SA-II",
    typicalMarks: "3-4 Marks",
    questionFormat: "Slightly more detailed answers",
    questionTags: [
      { id: 1, tagName: "Medium Depth" },
      { id: 2, tagName: "Detailed" },
    ],
  },
  {
    id: 4,
    questionType: "Long Answer",
    shortName: "LA",
    typicalMarks: "5-6 Marks",
    questionFormat: "Descriptive with multiple points",
    questionTags: [{ id: 1, tagName: "Descriptive" }],
  },
  {
    id: 5,
    questionType: "Case-Based / Source-Based",
    shortName: "CBQ/SBQ",
    typicalMarks: "4-6 Marks",
    questionFormat: "Based on paragraph/image/graph",
    questionTags: [
      { id: 1, tagName: "Comprehension" },
      { id: 2, tagName: "Interpretation" },
    ],
  },
  {
    id: 6,
    questionType: "Assertion & Reasoning",
    shortName: "AR",
    typicalMarks: "1-2 Marks",
    questionFormat: "Conceptual & logical reasoning",
    questionTags: [
      { id: 1, tagName: "Logic Based" },
      { id: 2, tagName: "Reasoning" },
    ],
  },
  {
    id: 7,
    questionType: "Multiple Choice Questions",
    shortName: "MCQ",
    typicalMarks: "2-3 Marks",
    questionFormat: "One correct option from choices",
    questionTags: [
      { id: 1, tagName: "Single Choice" },
      { id: 2, tagName: "Objective" },
    ],
  },
  {
    id: 8,
    questionType: "HOTS (Higher Order Thinking)",
    shortName: "HOTS",
    typicalMarks: "1 Marks",
    questionFormat: "Real-world, skill-based scenarios",
    questionTags: [
      { id: 1, tagName: "Critical Thinking" },
      { id: 2, tagName: "Analytical" },
    ],
  },
  {
    id: 9,
    questionType: "Match the Following",
    shortName: "MATCH",
    typicalMarks: "2-6 Marks",
    questionFormat: "Evaluative & analytical questions",
    questionTags: [
      { id: 1, tagName: "Match Pair" },
      { id: 2, tagName: "Association" },
      { id: 3, tagName: "Binary" },
    ],
  },
  {
    id: 10,
    questionType: "Fill in the Blanks",
    shortName: "FIB",
    typicalMarks: "1 Marks",
    questionFormat: "Matching column A to column B",
    questionTags: [
      { id: 1, tagName: "Fill Missing" },
      { id: 2, tagName: "Completion" },
    ],
  },
];

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
      Header: "Assignment Type",
      accessor: "assignmentType",
      disableSortBy: true,
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
    assignmentType: "Homework",
    description: "Regular homework assignment",
  },
  {
    id: 2,
    assignmentType: "Project",
    description: "Collaborative project work",
  },
  {
    id: 3,
    assignmentType: "Quiz",
    description: "Short quiz on recent topics",
  },
  {
    id: 4,
    assignmentType: "Essay",
    description: "Essay writing assignment",
  },
  {
    id: 5,
    assignmentType: "Lab Work",
    description: "Lab experiment report",
  },
  {
    id: 6,
    assignmentType: "Presentation",
    description: "Prepare and deliver a presentation",
  },
  {
    id: 7,
    assignmentType: "Worksheet",
    description: "Complete the provided worksheet",
  },
  {
    id: 8,
    assignmentType: "Field Trip Report",
    description: "Write a report on the field trip",
  },
  {
    id: 9,
    assignmentType: "Book Review",
    description: "Submit a review of a selected book",
  },
  {
    id: 10,
    assignmentType: "Group Discussion",
    description: "Participate in a group discussion",
  },
];

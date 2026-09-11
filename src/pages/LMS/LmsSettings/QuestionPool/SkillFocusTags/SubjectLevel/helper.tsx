import { StatusLabel } from "../../../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../../Components/Common/MenuOptions";

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Skill Name",
      accessor: "skillName",
      disableSortBy: true,
    },
    {
      Header: "Subject Category",
      accessor: "subjectCategory",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            type={original.status}
            labelName={original.status}
          ></StatusLabel>
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
    skillName: "Conceptual",
    skillCode: "CONC",
    subjectCategory: "All",
    description:
      "Understanding core ideas, definitions, relationships between concepts",
    status: "Active",
  },
  {
    id: 2,
    skillName: "Numerical",
    skillCode: "NUM",
    subjectCategory: "Maths",
    description: "Ability to solve mathematical/calculative problems",
    status: "Active",
  },
  {
    id: 3,
    skillName: "Grammar",
    skillCode: "GRAM",
    subjectCategory: "English",
    description: "Understanding grammar rules, syntax, and language structure",
    status: "Active",
  },
  {
    id: 4,
    skillName: "Application",
    skillCode: "APP",
    subjectCategory: "Science",
    description: "Hands-on or practical observation, lab-based learning",
    status: "Active",
  },
  {
    id: 5,
    skillName: "Reflective",
    skillCode: "REFL",
    subjectCategory: "All",
    description:
      "Analyzing and thinking critically, drawing personal inferences",
    status: "Active",
  },
  {
    id: 6,
    skillName: "Creative",
    skillCode: "CREA",
    subjectCategory: "All",
    description: "Original thinking, innovation, art integration, expression",
    status: "Active",
  },
];

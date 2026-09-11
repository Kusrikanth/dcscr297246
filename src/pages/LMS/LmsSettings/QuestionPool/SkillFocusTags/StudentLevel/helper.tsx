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
    skillName: "Conceptual",
    skillCode: "CONC",
    description:
      "Understanding core ideas, definitions, relationships between concepts",
  },
  {
    id: 2,
    skillName: "Numerical",
    skillCode: "NUM",
    description: "Ability to solve mathematical/calculative problems",
  },
  {
    id: 3,
    skillName: "Grammar",
    skillCode: "GRAM",
    description: "Understanding grammar rules, syntax, and language structure",
  },
  {
    id: 4,
    skillName: "Application",
    skillCode: "APP",
    description: "Hands-on or practical observation, lab-based learning",
  },
  {
    id: 5,
    skillName: "Reflective",
    skillCode: "REFL",
    description:
      "Analyzing and thinking critically, drawing personal inferences",
  },
  {
    id: 6,
    skillName: "Creative",
    skillCode: "CREA",
    description: "Original thinking, innovation, art integration, expression",
  },
];

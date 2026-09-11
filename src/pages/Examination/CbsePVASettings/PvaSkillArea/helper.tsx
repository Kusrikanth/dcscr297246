import { MenuOptionHrtl } from "../../../../Components/Common";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "PVA Subject",
      accessor: "pvaSubjectName",
      disableSortBy: true,
    },
    {
      Header: "Skill Name",
      id: "skillNameList",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <ul className="mb-0 ps-3">
          {original.skillAreas?.map((skill: any, index: number) => (
            <li key={index}>{`${index + 1}. ${skill.name}`}</li>
          ))}
        </ul>
      ),
    },
    {
      Header: "Description",
      id: "skillDescriptionList",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <ul className="mb-0 ps-3">
          {original.skillAreas?.map((skill: any, index: number) => (
            <li key={index}>{`${index + 1}. ${skill.description}`}</li>
          ))}
        </ul>
      ),
    },
    {
      Header: "Action",
      id: "actionMenu",
      thClass: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <MenuOptionHrtl
          actionOptions={actionList}
          rowId={original.pvaSubjectId} // ✅ use correct identifier
        />
      ),
    },
  ];
}


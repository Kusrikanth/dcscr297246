import { InputCheckbox } from "../../../../../../Components/Common";

export function generateColumns() {
  return [
    {
      Header: "Module",
      accessor: "module",
      disableSortBy: true,
    },
    {
      Header: "Uses Subject Skill Tags",
      accessor: "usesSubjectSkillTags",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex justify-content-center">
            <InputCheckbox
              name="usesSubjectSkillTags"
              value={original.usesSubjectSkillTags}
              onChange={() => {}}
              formgroupClassName="mb-0"
            ></InputCheckbox>
          </div>
        );
      },
    },
    {
      Header: "Uses Student Skill Tags",
      accessor: "usesStudentSkillTags",
      disableSortBy: true,
      columnClassName: "text-center",
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="d-flex justify-content-center">
            <InputCheckbox
              name="usesStudentSkillTags"
              value={original.usesStudentSkillTags}
              onChange={() => {}}
              formgroupClassName="mb-0"
            ></InputCheckbox>
          </div>
        );
      },
    },
  ];
}

export const tableData = [
  {
    id: "1",
    module: "Lesson Plan",
    usesSubjectSkillTags: true,
    usesStudentSkillTags: false,
  },
  {
    id: "2",
    module: "Question Builder",
    usesSubjectSkillTags: true,
    usesStudentSkillTags: false,
  },
  {
    id: "3",
    module: "Worksheets / Projects",
    usesSubjectSkillTags: true,
    usesStudentSkillTags: true,
  },
  {
    id: "4",
    module: "AI Feedback Engine",
    usesSubjectSkillTags: false,
    usesStudentSkillTags: true,
  },
  {
    id: "5",
    module: "Skill Reports",
    usesSubjectSkillTags: false,
    usesStudentSkillTags: true,
  },
  {
    id: "6",
    module: "Report Cards",
    usesSubjectSkillTags: false,
    usesStudentSkillTags: true,
  },
];

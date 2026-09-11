import { Header } from "ketcher-react";
import { SelectInput, UserDetails, InputCheckbox } from "../../../../../Components/Common";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../../../Components/Common/MenuOptions";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit02Icon } from "@hugeicons-pro/core-stroke-standard";

export function generateColumns(actionsList: Array<IOptionsHrtl>, sportsAttributes: any[], sportsGradesList: any[] = [], handleGradeChange: (studentId: any, attributeId: any, value: any) => void, allStudentCheckHndlr?: any, singleStudentCheckHndlr?: any, allStudentSelectedState?: boolean, handleBmiModalOpen?: any,handleSchoolCompetitionModalOpen?: any,handleStateCompetitionModalOpen?: any) {
  const dynamicColumns = sportsAttributes.map((attribute) => {
    
    return {
      Header: attribute.mainAttributeName,
      accessor: attribute.mainAttributeName,
      disableSortBy: true,
      columnClassName: "!tw-border-none w-350px min-w-350px max-w-350px text-center !tw-whitespace-normal !tw-break-words",
      columns: [
        {
          Header: attribute.subAttributeNames,
          accessor: `${attribute.id}_subAttributes`,
          disableSortBy: true,
          columnClassName: "w-300px min-w-300px max-w-300px text-center !tw-break-words !tw-whitespace-break-spaces",
          Cell: ({ row: { original } }: any) => {
            const names = attribute.subAttributes.map((s: any) => s.subAttributeName).join(", ");

            const selectedGradeId = original.gradeValues?.[attribute.id] || "";

            return (
              <SelectInput
                name={`${attribute.id}_subAttributes`}
                value={selectedGradeId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleGradeChange(original.studentId, attribute.id, e.target.value)}
                menuItems={sportsGradesList || []}
                valueKey="id"
                textKey="displayLabel"
                isDisabled={!original.isSelected}
              />
            );
          },
        },
      ],
    };
  });

  return [
    {
      Header: () => {
        return (
          <InputCheckbox
            name="all-student"
            value={allStudentSelectedState || false}
            onChange={allStudentCheckHndlr}
            formgroupClassName="mb-0"
          />
        )
      },
      accessor: "id",
      columnClassName: "w-5 sticky-left z-index-1",
      disableSortBy: true,
      rowSpan: 2,
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "isStudentChecked",
          columnClassName: "sticky-left w-5 z-index-1",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            const { id, isSelected, studentId } = original;
            return (
              <InputCheckbox
                name={`student-${studentId}`}
                value={isSelected}
                onChange={singleStudentCheckHndlr}
                dataId={studentId}
                formgroupClassName="mb-0"
                isDisabled={false}
              />
            )
          },
          Footer: "",
          footerClassName: "text-white fw-bold",
        },
      ],
    },
    {
      Header: "Student Name",
      accessor: "hiddenStudentName",
      disableSortBy: true,
      columnClassName: "sticky-left-checkbox min-w-200px w-200px max-w-200px z-index-1",
      rowSpan: 2,
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "studentName",
          columnClassName: "sticky-left-checkbox min-w-200px w-200px max-w-200px z-index-1",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            return (
              <UserDetails
                imageUrl={original.studentImageURL}
                displayName={original.studentName}
                displayId={original.studentCode}
                size="xs"
              ></UserDetails>
            );
          },
        },
      ],
    },
    {
      Header: "Roll no",
      accessor: "hiddenRollNo",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "w-150px min-w-150px w-200px max-w-150px",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "rollNo",
          disableSortBy: true,
        },
      ],
    },
    ...dynamicColumns,
    {
      Header: "Final Grade",
      accessor: "hiddenfinalGrade",
      disableSortBy: true,
      columnClassName: "w-250px min-w-250px max-w-250px",
      rowSpan: 2,
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "finalGrade",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            return (
              <SelectInput
                name="finalGrade"
                value={original.gradeValues?.finalGrade || ""}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleGradeChange(original.studentId, 'finalGrade', e.target.value)}
                textKey="displayLabel"
                valueKey="id"
                menuItems={sportsGradesList || []}
                isDisabled={!original.isSelected}
              ></SelectInput>
            );
          },
        },
      ],
    },
    {
      Header: "BMI Details",
      accessor: "hiddenbmiDetails",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "w-200px min-w-200px max-w-200px",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "bmiDetails",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            return (
              <button
                className="text-info cursor-pointer text-decoration-underline btn btn-sm btn-link"
                onClick={() => handleBmiModalOpen?.(original.studentId)}
                disabled={!original.isSelected}
              >
                BMI Details
              </button>
            );
          },
        },
      ],
    },
    {
      Header: "School Competition",
      accessor: "hiddenSchoolCompetition",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "w-200px min-w-200px max-w-200px",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "schoolCompetition",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            return (
              <button
                className="text-info cursor-pointer text-decoration-underline btn btn-sm btn-link"
                onClick={() => handleSchoolCompetitionModalOpen?.(original.studentId)}
                disabled={!original.isSelected}
              >
                School Competition
              </button>
            );
          },
        },
      ],
    },
    {
      Header: "State Competition",
      accessor: "hiddenStateCompetition",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "w-200px min-w-200px max-w-200px",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "stateCompetition",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => {
            return (
              <button
                className="text-info cursor-pointer text-decoration-underline btn btn-sm btn-link"
                onClick={() => handleStateCompetitionModalOpen?.(original.studentId)}
                disabled={!original.isSelected}
              >
                State Competition
              </button>
            );
          },
        },
      ],
    },
  ];
}


export const schoolLevelOptions = [
 {
    id: 'Intra School',
    labelName:"Intra School"
  },
  {
    id: 'Inter School',
    labelName:"Inter School"
  },
]

export const stateLevelOptions = [
 {
    id: 'international',
    labelName:"International"
  },
  {
    id: 'national',
    labelName:"National"
  },
  {
    id: 'district',
    labelName:"District"
  },
  {
    id: 'state',
    labelName:"State"
  },
]

export const resultOptions = [
  {
    id: '1st Place',
    labelName:"1st Place"
  },
  {
    id: '2nd place',
    labelName:"2nd place"
  },
  {
    id: '3rd place',
    labelName:"3rd place"
  },
  {
    id: '4th place',
    labelName:"4th place"
  },
  {
    id: '5th place',
    labelName:"5th place"
  },
]

export const housesOptions = [
  {
    id: 'Emerald',
    labelName:"Emerald"
  },
  {
    id: 'Topaz',
    labelName:"Topaz"
  },
  {
    id: 'Ruby',
    labelName:"Ruby"
  },
  {
    id: 'Sapphire',
    labelName:"Sapphire"
  },
  {
    id: 'GODAVARI',
    labelName: "Godavari"
  },
  {
    id: 'KRISHNA',
    labelName: "Krishna"
  },
  {
    id: 'CAUVERY',
    labelName: "Cauvery"
  },
  {
    id: 'GANGA',
    labelName: "Ganga"
  }
]
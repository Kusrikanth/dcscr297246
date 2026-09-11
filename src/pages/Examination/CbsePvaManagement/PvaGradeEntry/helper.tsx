import { useState } from "react";
import { InputCheckbox, UserDetails } from "../../../../Components/Common";

export function generateColumns(
  allStudentCheckHndlr: any,
  singleStudentCheckHndlr: any,
  allStudentSelectedState: any,
  isEy: boolean,
  isIgcse: boolean,
  objectivesData: any[],
  handleStarChange: any,
  handleSchoolCompetitionModalOpen?: any,
  handleStateCompetitionModalOpen?: any
) {
  const dynamicColumns = generateDynamicColumns(objectivesData, handleStarChange);
  const hasSkillData = Array.isArray(dynamicColumns) && dynamicColumns.length > 0;
  return [
    {
      Header: () => (
        <InputCheckbox
          name="all-student"
          value={allStudentSelectedState}
          onChange={allStudentCheckHndlr}
          formgroupClassName="mb-0"
        />
      ),
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
            const { studentId, isSelected } = original;
            return (
              <InputCheckbox
                name={`student-${studentId}`}
                value={isSelected}
                onChange={singleStudentCheckHndlr}
                dataId={studentId}
                formgroupClassName="mb-0"
              />
            );
          },
          Footer: "",
          footerClassName: "text-white fw-bold",
        },
      ],
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "sticky-left-checkbox min-w-200px w-200px max-w-200px z-index-1",
      columns: [
        {
          Header: "Student Name",
          displayNone: true,
          accessor: "studentName",
          columnClassName: "sticky-left-checkbox min-w-200px w-200px max-w-200px z-index-1",
          disableSortBy: true,
          Cell: ({ row: { original } }: any) => (
            <UserDetails
              showAvatar
              imageUrl={original.studentImageBase64}
              displayName={original.studentName}
              displayId={original.studentCode}
              size="xs"
            />
          ),
          Footer: "",
          footerClassName: "text-white fw-bold",
        },
      ],
      rowSpan: 2,
    },
    {
      Header: "Skill Area",
      accessor: "skillArea",
      disableSortBy: true,
      columnClassName: "text-center",
      columns: dynamicColumns,
    },
    ...(hasSkillData
      ? [
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
              Cell: ({ row: { original } }: any) => (
                <button
                  className="text-info cursor-pointer text-decoration-underline btn btn-sm btn-link"
                  onClick={() =>
                    handleSchoolCompetitionModalOpen?.(original.studentId)
                  }
                  disabled={!original.isSelected}
                >
                  School Competition
                </button>
              ),
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
              Cell: ({ row: { original } }: any) => (
                <button
                  className="text-info cursor-pointer text-decoration-underline btn btn-sm btn-link"
                  onClick={() =>
                    handleStateCompetitionModalOpen?.(original.studentId)
                  }
                  disabled={!original.isSelected}
                >
                  State Competition
                </button>
              ),
            },
          ],
        },
      ]
      : []),
    {
      Header: "Total",
      accessor: "total",
      columnClassName: "text-center",
      disableSortBy: true,
      Cell: ({ row }: any) => <TotalStars row={row} />,
      footerClassName: "text-center fw-bold",
    },
  ];
}

export function generateDynamicColumns(objectivesData: any[], handleStarChange: any) {
  const uniqueObjectives = Array.from(
    new Map(objectivesData.map((obj) => [obj.id, obj])).values()
  );
 
  return uniqueObjectives.map((objective, index) => ({
    Header: objective.title,
    accessor: `objective_${objective.id}_${index}`,
    columnClassName: "text-center min-w-200px",
    disableSortBy: true,
    Cell: ({ row: { original } }: any) => (
      <StarSelection
        studentId={original.studentId}
        objectiveId={objective.id}
        value={original[`objective_${objective.id}`] || 0}
        isEnabled={original.isSelected}
        onChange={handleStarChange}
      />
    ),
    Footer: "",
    footerClassName: "text-center",
  }));
}

export const StarSelection = ({ studentId, objectiveId, value = 0, isEnabled, onChange }: any) => {
  const handleClick = (starIndex: number) => {
    if (!isEnabled) return;
    onChange(studentId, objectiveId, starIndex);
  };
  return (
    <div className="d-flex justify-content-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          onClick={() => handleClick(i)}
          style={{
            fontSize: "20px",
            cursor: isEnabled ? "pointer" : "not-allowed",
            color: i <= value ? "#ffc107" : "#dee2e6",
            opacity: isEnabled ? 1 : 0.6,
            transition: "color 0.2s ease",
            marginRight: i < 5 ? 2 : 0,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export const TotalStars = ({ row }: any) => {
  let total = 0;

  Object.keys(row.original).forEach((key) => {
    if (key.startsWith("objective_")) {
      total += Number(row.original[key]) || 0;
    }
  });
  return (
    <div className="text-center">
      <span className="ms-1">
        {total} <span style={{ color: "#ffc107", fontSize: "18px" }}>★</span> Selected
      </span>
    </div>
  );
};

export function getTotalColumn() {
  return {
    Header: "Total",
    accessor: "total",
    columnClassName: "text-center",
    disableSortBy: true,
    Cell: ({ row }: any) => <TotalStars row={row} />,
    Footer: "",
    footerClassName: "text-center fw-bold",
  };
}

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

export const medalLevelOptions = [
 {
    id: 'gold',
    labelName:"Gold"
  },
  {
    id: 'silver',
    labelName:"Silver"
  },
  {
    id: 'bronze',
    labelName:"Bronze"
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
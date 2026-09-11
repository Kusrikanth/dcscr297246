import { HugeiconsIcon } from "@hugeicons/react";
import { SchoolIcon } from "@hugeicons-pro/core-stroke-standard";



export function generateColumns(subjects) {
  const fixedColumns = [
    {
      id: "expander",
      disableSortBy: true,
      Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
        <span
          {...getToggleAllRowsExpandedProps()}
          className={`expander-btn fs-18 fw-normal ${
            isAllRowsExpanded ? "bg-danger" : "bg-success"
          }`}
        >
          {isAllRowsExpanded ? "-" : "+"}
        </span>
      ),
      rowSpan: 2,
      columnClassName: "",
      Footer: "",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          disableSortBy: true,
          columnClassName: "cell-highlight",
          Footer: "",
          Cell: ({ row }) =>
            row.canExpand ? (
              <span
                {...row.getToggleRowExpandedProps({
                  style: {
                    paddingLeft: `${row.depth * 2}rem`,
                  },
                })}
                className={`expander-btn tw-text-lg ${
                  row.isExpanded ? "bg-danger" : "bg-success"
                }`}
              >
                {row.isExpanded ? "-" : "+"}
              </span>
            ) : null,
        },
      ],
    },
    {
      Header: () => (
        <div className="tw-flex tw-items-center tw-justify-center">
          <HugeiconsIcon icon={SchoolIcon} size={20} className="me-2" />
          <span>Branch Name</span>
        </div>
      ),
      accessor: "hiddenBranchName",
      disableSortBy: true,
      rowSpan: 2,
      columnClassName: "tw-text-nowrap tw-text-center",
      Footer: "",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "branchName",
          disableSortBy: true,
          columnClassName: "tw-text-nowrap cell-highlight tw-p-0 tw-text-center",
          Footer: "Total",
          Cell: ({ row: { original } }) => {
            const { branchName } = original || {};
            return (
              <div
                className="tw-flex tw-items-center tw-text-center tw-justify-center"
                style={{
                  padding: "0.4rem 0.7rem",
                }}
              >
                <span>{branchName}</span>
              </div>
            );
          },
        },
      ],
    },
    {
      Header: "Grades",
      accessor: "",
      columnClassName: "tw-text-center",
      disableSortBy: true,
      rowSpan: 2,
      Footer: "",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "grades",
          columnClassName: "tw-text-center",
          disableSortBy: true,
          Footer: "",
          Cell: ({ row: { original } }) => {
            return (
              <span className="tw-text-center">{original.grades?.name}</span>
            );
          },
        },
      ],
    },
  ];

  const dynamicColumns = subjects?.map((subject, idx) => {
    const subjectName = subject?.name;
    const cleanSubjectName = subjectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
    const subjectAccessor = `${cleanSubjectName}_${idx}`;

    return {
      key: `gradewisesubject_${idx}`,
      Header: subjectName,
      accessor: subjectAccessor,
      columnClassName: "tw-text-center tw-px-2 tw-py-3",
      footerClassName: "tw-text-center",
      disableSortBy: true,
      Footer: "",
      columns: [
        {
          Header: "Count",
          accessor: `${subjectAccessor}_count`,
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell: ({ row: { original } }) => {
            const subjectData = original?.subjectAndAverageMarks?.[subjectName];
            const gradeData = subjectData?.[original?.grades?.name];
            
            return (
              <div className="tw-flex tw-items-center tw-justify-center">
                <span className="tw-px-2 tw-py-1 tw-rounded tw-flex tw-items-center tw-justify-center">
                  {gradeData?.count || 0}
                </span>
              </div>
            );
          },
        },
        {
          Header: "%",
          accessor: `${subjectAccessor}_percentage`,
          disableSortBy: true,
          columnClassName: "tw-text-center",
          Cell: ({ row: { original } }) => {
            const subjectData = original?.subjectAndAverageMarks?.[subjectName];
            const gradeData = subjectData?.[original?.grades?.name];
            
            return (
              <div className="tw-flex tw-items-center tw-justify-center">
                <span className="tw-px-2 tw-py-1 tw-rounded tw-flex tw-items-center tw-justify-center">
                  {gradeData?.percentage ? gradeData?.percentage.toFixed(2) : "0.00"}%
                </span>
              </div>
            );
          },
        },
      ],
    };
  });

  return [...fixedColumns, ...(dynamicColumns || [])];
}

export function transformTableData(branchWiseSubjectAndAvgMarks) {
  const transformedData: any = [];

  branchWiseSubjectAndAvgMarks?.forEach((branch) => {
    const branchRow = {
      branchName: branch.branchName,
      studentsCount: branch.studentsCount,
      subjectAndAverageMarks: branch.subjectAndAverageMarks,
      grades: { name: "TOTAL" },
      subRows: [] as any[],
    };

  
    const sortedGrades = branch.grades
    ?.filter(grade => grade.name !== "TOTAL")
    ?.sort((a, b) => {
      
      if (a.name === "Absent") return 1;
      if (b.name === "Absent") return -1;

      if (a.name === "" || a.name === " ") return 1;
      if (b.name === "" || b.name === " ") return -1;

      
      return customGradeSort(a.name, b.name);
    });


    sortedGrades?.forEach((grade) => {
      branchRow.subRows.push({
        studentsCount: branch.studentsCount,
        subjectAndAverageMarks: branch.subjectAndAverageMarks,
        grades: grade,
      });
    });

    transformedData.push(branchRow);
  });

  return transformedData;
}


const customGradeSort = (a: string, b: string) => {
  const fixedGrades = ["Absent", "TOTAL"];
  const specialGrades = ['PR', 'ABS', 'NO EXAMINATION', 'ML', 'AB', 'PA'];

  if (fixedGrades.includes(a)) return -1;
  if (fixedGrades.includes(b)) return 1;

  const isSpecialA = specialGrades.includes(a);
  const isSpecialB = specialGrades.includes(b);
  
  if (isSpecialA && isSpecialB) {
    return a.localeCompare(b);
  }
  
  if (isSpecialA) {
    return 1;
  }
  
  if (isSpecialB) {
    return -1;
  }

  const stripBase = (grade: string) => grade.replace(/[^a-zA-Z]/g, "");
  const getSuffix = (grade: string) => grade.replace(/[a-zA-Z]/g, "");

  const baseA = stripBase(a);
  const baseB = stripBase(b);

  if (baseA === baseB) {
    const suffixA = getSuffix(a);
    const suffixB = getSuffix(b);

    if (suffixA === "") return 1;
    if (suffixB === "") return -1;

    return suffixA.localeCompare(suffixB, undefined, { numeric: true });
  }

  return baseA.localeCompare(baseB);
};

import { UserDetails } from "../../../../Components/Common";
  
export const selectData1 = [
    
  {
    yearType: "2022-23",
  },
  {
    yearType: "2021-22",
  },
  {
    yearType: "2020-21",
  },
];

export function generateSubjectColumns(data: Record<string, any>, rawData: any[]) {
  if (!data || Object.keys(data).length === 0) return [];
  const subjectMap = new Map();
  rawData.forEach((student) => {
    if (student.subjects && Array.isArray(student.subjects)) {
      student.subjects.forEach((subject) => {
        const subjectKey = subject.subjectName?.trim().toLowerCase().replace(/\s+/g, "_");
        if (subjectKey) {
          const uniqueKey = `${subject.subjectId}_${subjectKey}`;
          
          if (!subjectMap.has(uniqueKey)) {
            subjectMap.set(uniqueKey, {
              key: subjectKey,
              subjectId: subject.subjectId,
              gradeBookOrder: subject.gradeBookOrder ?? 999,
              displayName: subject.subjectName?.trim() || subjectKey.replace(/_/g, " ").toUpperCase()
            });
          }
        }
      });
    }
  });

  const sortedSubjects = Array.from(subjectMap.values())
    .sort((a, b) => {
      if (a.gradeBookOrder !== b.gradeBookOrder) {
        return a.gradeBookOrder - b.gradeBookOrder;
      }
      return a.subjectId - b.subjectId;
    })

  return sortedSubjects.map((subjectInfo) => ({
    Header: subjectInfo.displayName,
    id: subjectInfo.key.replace(/\s+/g, "_").toLowerCase(),
    disableSortBy: true,
    columnClassName: "text-center",
    columns: [
      {
        Header: "M",
        accessor: `${subjectInfo.key}_marks`,
        disableSortBy: true,
        columnClassName: "text-center",
        Cell: ({ value }: any) => value ?? "-",
      },
      {
        Header: "G",
        accessor: `${subjectInfo.key}_grade`,
        disableSortBy: true,
        columnClassName: "text-center",
        Cell: ({ value }: any) => value ?? "-",
      },
    ],
  }));
}

export function generateColumns(data: any[], rawData: any[]) {
  const pathname = window.location.pathname;
  
  return [
    {
      Header: "Student Profile",
      accessor: "studentProfile",
      disableSortBy: true,
      columnClassName: "sticky-left min-w-600px w-600px max-w-600px zIndex",
      columns: [
        {
          Header: "Name",
          accessor: "nameAndRollNo",
          disableSortBy: true,
          columnClassName: "sticky-left min-w-600px w-600px max-w-600px",
          Cell: ({ row: { original } }: any) => {
            return (
              <UserDetails
                showAvatar
                imageUrl={original.studentImageBase64}
                displayName={original.studentName}
                displayId={original.studentCode}
                size="xs"
              />
            );
          },
        },
      ],
    },
    {
      Header: "Roll No.",
      accessor: "rollNo",
      disableSortBy: true,
      columnClassName: "text-center",
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
      columnClassName: "text-center",
    },
    ...generateSubjectColumns(data, rawData),
    {
      Header: "Result",
      accessor: "result",
      disableSortBy: true,
      columnClassName: "text-center",
      columns: [
        {
          Header: "Total",
          accessor: "totalMarks",
          disableSortBy: true,
          columnClassName: "text-center",
        },
        {
          Header: "%",
          accessor: "averageMarks",
          disableSortBy: true,
          columnClassName: "text-center",
        },
        {
          Header: "Grade",
          accessor: "totalGrade",
          disableSortBy: true,
          columnClassName: "text-center",
        },
        {
          Header: "Result",
          accessor: "result",
          disableSortBy: true,
          columnClassName: "text-center",
          Cell: ({ row: { original } }: any) => {
            const { result } = original;
            const resultLower = result?.toLowerCase();
            const getClass = () => {
              if (resultLower === "pass") return "text-success";
              if (resultLower === "fail") return "text-danger";
              if (resultLower === "absent") return "text-muted";
              return "";
            };
            return (
              <span className={`${getClass()} fw-bold`}>
                {result}
              </span>
            );
          },
        }
      ],
    },
  ];
}

export const ignoredKeys = ["searchString","academicYearId", "curriculumId", "classId", "examinationId"];
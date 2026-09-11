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

export function getGradeRowClass(grade) {
  const gradePrefix = grade[0].toUpperCase();
  const gradeClasses = {
    A: 'tw-bg-[#b6e8e1] ',
    B: 'tw-bg-[#ffdfa3] ',
    C: 'tw-bg-[#ffdfa3] ',
    D: 'tw-bg-[#fbd1c8] ',
    E: 'tw-bg-[#fbd1c8] ',
    F: 'tw-bg-[#fbd1c8] ',
    Absent: 'tw-bg-gray-50 '
  };

  return gradeClasses[gradePrefix] || 'tw-bg-gray-50 ';
}

// unique subject key
function generateUniqueSubjectKey(subjectName, index) {

  let cleanName = subjectName.trim().toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ''); 
  
  // If name is empty so use index
  if (!cleanName || cleanName.length < 2) {
    cleanName = `subject${index}`;
  }
  
  return cleanName;
}


export function transformTableData(data) {
  if (!data || !data.grades || !data.subjects) {
    return [];
  }

  const transformedData: any = [];
  
  // Sort grades
  const sortedGrades = data.grades
    .filter(grade => grade.name && grade.name.trim() !== "")
    .sort((a, b) => customGradeSort(a.name, b.name));

  // Create unique subject keys to avoid duplicates
  const uniqueSubjects: any = [];
  const seenKeys = new Set();
  
  data.subjects.forEach((subject, index) => {
    const subjectName = subject.name.trim();
    let subjectKey = generateUniqueSubjectKey(subjectName, index);
    

    let counter = 1;
    const originalKey = subjectKey;
    while (seenKeys.has(subjectKey)) {
      subjectKey = `${originalKey}${counter}`;
      counter++;
    }
    
    seenKeys.add(subjectKey);
    uniqueSubjects.push({
      ...subject,
      originalName: subjectName,
      uniqueKey: subjectKey
    });
  });


  sortedGrades.forEach((grade) => {
    const row = {
      grade: grade.name,
      gradeId: grade.name
    };

    uniqueSubjects.forEach((subject) => {
      const subjectName = subject.originalName;
      const subjectKey = subject.uniqueKey;
      
      const subjectData = data.subjectAndCountPercentage[subjectName];
      const gradeData = subjectData && subjectData[grade.name];
      
      row[`${subjectKey}Count`] = gradeData ? gradeData.count : 0;
      row[`${subjectKey}Per`] = gradeData ? gradeData.percentage.toFixed(2) : '0.00';
    });

    transformedData.push(row);
  });

  return transformedData;
}

export function generateColumns(data) {
  if (!data || !data.subjects) {
    return [];
  }

  const columns: any = [
    {
      Header: "Grades",
      accessor: "hiddenGrade",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      rowSpan: 2,
      Footer: "",
      columns: [
        {
          Header: "hidden",
          displayNone: true,
          accessor: "grade",
          columnClassName: "tw-text-center",
          footerClassName: "tw-text-center",
          disableSortBy: true,
          Footer: "GRAND TOTAL",
          Cell: ({ row: { original } }) => {
            return (
              <div className="tw-font-semibold tw-text-center" style={{ padding: "0.4rem 0.7rem" }}>
                <span
                  className={`tw-px-2 tw-py-1 tw-rounded tw-inline-block`}
                  style={{ minWidth: '60px' }}
                >
                  {original.grade}
                </span>
              </div>
            );
          },
        },
      ],
    }
  ];

  const uniqueSubjects: any = [];
  const seenKeys = new Set();
  
  data.subjects.forEach((subject, index) => {
    const subjectName = subject.name.trim();
    let subjectKey = generateUniqueSubjectKey(subjectName, index);
    
  
    let counter = 1;
    const originalKey = subjectKey;
    while (seenKeys.has(subjectKey)) {
      subjectKey = `${originalKey}${counter}`;
      counter++;
    }
    
    seenKeys.add(subjectKey);
    uniqueSubjects.push({
      ...subject,
      originalName: subjectName,
      uniqueKey: subjectKey
    });
  });


  uniqueSubjects.forEach((subject) => {
    const subjectName = subject.originalName;
    const subjectKey = subject.uniqueKey;
    
    
    const totalCount: any = Object.values(data.subjectAndCountPercentage[subjectName] || {})
      .reduce((sum: any, gradeData: any) => sum + (gradeData.count || 0), 0);

    // const totalPercentage: number = Object.values(data.subjectAndCountPercentage[subjectName] || {})
    //   .reduce((sum: number, gradeData: any) => sum + (gradeData.percentage || 0), 0);

    // const averagePercentage: number = totalPercentage / Object.keys(data.subjectAndCountPercentage[subjectName] || {}).length || 0;

    const subjectColumn = {
      Header: subjectName,
      accessor: `hidden${subjectKey}`,
      columnClassName: "tw-text-center",
      footerClassName: "tw-text-center",
      disableSortBy: true,
      Footer: "",
      columns: [
        {
          Header: "Count",
          accessor: `${subjectKey}Count`,
          columnClassName: "tw-text-center tw-p-0",
          footerClassName: "tw-text-center",
          disableSortBy: true,
          Footer: totalCount.toString(),
          Cell: ({ row: { original } }) => {
            const count = original[`${subjectKey}Count`];
            return (
              <div className="tw-font-semibold" style={{ padding: "0.4rem 0.7rem" }}>
                <span
                  className={`tw-px-2 tw-py-1 tw-rounded tw-inline-block  ${getGradeRowClass(
                    original.grade
                  )}`}
                >
                  {count}
                </span>
              </div>
            );
          },
        },
        {
          Header: "%",
          accessor: `${subjectKey}Per`,
          columnClassName: "tw-text-center",
          footerClassName: "tw-text-center",
          disableSortBy: true,
          // Footer: averagePercentage.toFixed(2) + "%",
          Footer: "",
          Cell: ({ value }) => {
            return <span>{value}%</span>;
          },
        },
      ],
    };

    columns.push(subjectColumn);
  });

  return columns;
}

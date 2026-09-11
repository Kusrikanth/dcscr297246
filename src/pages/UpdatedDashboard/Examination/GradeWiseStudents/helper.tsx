// export const getGradeKeys = (gradesObj: any) => {
//     return Object.keys(gradesObj);
//   };
  // const gradeOrder = ["A+", "A", "B+", "B", "C+", "C", "D", "E", "F"];

//   export const getSortedGradeCategories = (
//     gradeData: Record<string, number> = {}
//   ): string[] => {
//     return gradeOrder.filter((grade) => gradeData[grade] > 0);
//   };
  
export const getGradeKeys = (gradesObj: any) => {
  if (!gradesObj) return [];
  return Object.keys(gradesObj);
};

export const getSortedGradeCategories = (
  gradeData: Record<string, number> = {}
): string[] => {
  // Get all grades that have students
  const availableGrades = Object.keys(gradeData).filter(grade => gradeData[grade] > 0);
  
  const specialGrades = ['PR', 'ABS', 'NO EXAMINATION', 'ML', 'AB', 'PA'];
  
  const regularGrades = availableGrades.filter(grade => !specialGrades.includes(grade));
  const specialGradesList = availableGrades.filter(grade => specialGrades.includes(grade));
  
  const sortedRegularGrades = regularGrades.sort((a, b) => {
    // Extract the letter part (A, B, C, etc.)
    const letterA = a.charAt(0);
    const letterB = b.charAt(0);
    
    if (letterA !== letterB) {
      // Sort by letter first (A, B, C...)
      return letterA.localeCompare(letterB);
    } else {
      // If letters are the same, compare based on what follows
      const restA = a.substring(1);
      const restB = b.substring(1);
      
      // Special case: A (without suffix) should come after A1, A2, etc.
      if (restA === "" && restB !== "") return 1; // "A" comes after "A1"
      if (restB === "" && restA !== "") return -1; // "A1" comes before "A"
      
      // For numeric suffixes, use numeric comparison
      if (!isNaN(Number(restA)) && !isNaN(Number(restB))) {
        return Number(restA) - Number(restB);
      }
      
      // For + suffix
      if (restA === "+" && restB !== "+") return -1;
      if (restB === "+" && restA !== "+") return 1;
      
      // Fall back to string comparison
      return restA.localeCompare(restB);
    }
  });
  
  const sortedSpecialGrades = specialGradesList.sort((a, b) => a.localeCompare(b));
  
  return [...sortedRegularGrades, ...sortedSpecialGrades];
};


export const generateGradeSeries = (gradeWiseData, categories) => {
  if (!gradeWiseData) return [];

  const allGradesSet = new Set();

  categories.forEach(subject => {
    const grades = gradeWiseData[subject];
    if (grades) {
      Object.keys(grades).forEach(grade => {
        allGradesSet.add(grade);
      });
    }
  });

  const allGrades = Array.from(allGradesSet);

  const specialGrades = ['PR', 'ABS', 'NO EXAMINATION', 'ML', 'AB', 'PA'];

  // Custom comparator: puts 'A1', 'A+' before 'A'
  const customSort = (a, b) => {
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
    
    const stripSpecial = grade => grade.replace(/[^a-zA-Z]/g, '');
    const getSuffix = grade => grade.replace(/[a-zA-Z]/g, '');

    const baseA = stripSpecial(a);
    const baseB = stripSpecial(b);

    if (baseA === baseB) {
      // If base grade same (e.g., A vs A1 vs A+)
      const suffixA = getSuffix(a);
      const suffixB = getSuffix(b);

      // Suffix empty string is considered lower priority
      if (suffixA === '') return 1;
      if (suffixB === '') return -1;

      return suffixA.localeCompare(suffixB, undefined, { numeric: true });
    }

    return baseA.localeCompare(baseB);
  };

  const sortedGrades = allGrades.sort(customSort);

  return sortedGrades.map((grade: any) => {
    const seriesData = {
      name: grade,
      data: categories.map(subject => gradeWiseData[subject]?.[grade] ?? 0),
    };

    const hasData = seriesData.data.some(count => count > 0);
    return hasData ? seriesData : null;
  }).filter(Boolean);
};



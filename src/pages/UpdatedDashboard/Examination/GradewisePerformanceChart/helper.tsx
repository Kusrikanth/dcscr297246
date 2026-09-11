export const customSort = (a: string, b: string) => {
    const specialGrades = ['PR', 'ABS', 'NO EXAMINATION', 'ML', 'AB', 'PA'];
    
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
    
    const stripSpecial = (grade: string) => grade.replace(/[^a-zA-Z]/g, '');
    const getSuffix = (grade: string) => grade.replace(/[a-zA-Z]/g, '');

    const baseA = stripSpecial(a);
    const baseB = stripSpecial(b);

    if (baseA === baseB) {
      
      const suffixA = getSuffix(a);
      const suffixB = getSuffix(b);

      if (suffixA === '') return 1;
      if (suffixB === '') return -1;

      return suffixA.localeCompare(suffixB, undefined, { numeric: true });
    }

    return baseA.localeCompare(baseB);
  };
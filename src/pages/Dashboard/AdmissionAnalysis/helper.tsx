
export const collectionsAppliactionData = (academicYears: string[], response: Record<string, any>) => {
  return academicYears?.map((year) => response[year] || 0);
};


export function getSortedAcademicYearNames(data: any) {
  const sortedData = [...data].sort((a: any, b: any) => a.academicYearId - b.academicYearId);
  const academicYearNames = sortedData.map((item: any) => item.academicYearName);
  return academicYearNames;
}
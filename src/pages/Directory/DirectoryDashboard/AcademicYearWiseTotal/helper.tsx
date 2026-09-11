

export function getSortedAcademicYearNames(data: any) {
  const sortedData = [...data].sort((a: any, b: any) => a.academicYearId - b.academicYearId);

  const academicYearNames = sortedData.map((item: any) => item.academicYearName);

  return academicYearNames;
}
interface ApiResponse {
  others: Record<string, number>;
  male: Record<string, number>;
  totalStudents: Record<string, number>;
  newAdmissions: Record<string, { OLD_ADMISSION?: number; NEW_ADMISSION: number }>;
  tcTaken: Record<string, number>;
  female: Record<string, number>;
}

export interface TransformedData {
  [year: string]: {
      others: number;
      male: number;
      totalStudents: number;
      newAdmissions: number;
      tcTaken: number;
      female: number;
  };
}

export function transformApiResponse(response: ApiResponse): TransformedData {
  if(!response) return {};
  const transformedData: TransformedData = {};

  Object.keys(response?.totalStudents).forEach((year) => {
      transformedData[year] = {
          others: response?.others[year] || 0,
          male: response?.male[year] || 0,
          totalStudents: response?.totalStudents[year] || 0,
          newAdmissions: response?.newAdmissions[year]?.NEW_ADMISSION || 0,
          tcTaken: response?.tcTaken[year] || 0,
          female: response?.female[year] || 0,
      };
  });

  return transformedData;
}

export const getActiveId = (id:string)=>{
  switch (id) {
    case "academicYearWiseAllTotal":
      return "school_strength_all";
    case "academicYearCurrrentPreTotal":
      return "school_strength_currentVsPs";
    case "academicYearWiseClassTotal":
      return "school_strength_class";
    default:
      return "school_strength_all";
  }
}
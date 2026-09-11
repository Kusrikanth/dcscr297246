export type ResponseData = {
    [key: string]: {
      MALE?: number;
      FEMALE?: number;
      OTHER?: number;
      TOTAL: number;
    };
  };
  
export type RowData = {
    label: string;
    boys: number;
    girls: number;
    total: number;
    borderColor: string;
  };

export type InitialValueType = {
    academicYearId?: string;
    curriculumId?: string;
}
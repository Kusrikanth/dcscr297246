export interface Location {
    address: string;
    lat: number;
    long: number;
  }

export interface FileDto {
    originalFileName: string;
  }

export interface CurriculumItem {
  curriculumId?: string;
  isSelected: boolean;
  classes: Class[];
}
  
export  interface Class {
  classId?: string;
  isSelected: boolean;
  sections: Section[];
}
  
export  interface Section {
  sectionId?: string;
  isSelected: boolean;
}

export interface Student {
  id: string;
}

export interface Employee {
  id: string;
}
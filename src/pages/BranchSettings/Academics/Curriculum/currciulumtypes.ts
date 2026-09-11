export interface ICurriculumProps {
    instituteName: string,
    instituteId: string,
}


//Modal
export interface ICurriculumInfo {
    curriculumId: string,
    schoolCode: string,
    affiliationNo: string,
    uniqueId: string,
}

export interface IAddCurriculumInfo {
    curriculums: ICurriculumInfo[],
    academicYearId: string,
}
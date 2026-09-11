interface IAddTermInfo {
    uniqueId: string,
    instituteTermId: string,
    startDate: string,
    endDate: string,
    shortCode: string,
}
export interface IAddTermInfoState {
    academicYearId: string,
    termTypeId: string,
    academicTerms: IAddTermInfo[]
}
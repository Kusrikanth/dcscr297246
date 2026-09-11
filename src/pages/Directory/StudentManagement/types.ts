
export interface IFilterState {
    branchId: string | undefined;
    studentIds: string | undefined;
    academicYearId: string | undefined;
    status: string | undefined;
};

export interface IAdvanceFilterState {
    classId: string | undefined;
    sectionId: string | undefined;
    curriculumId: string | undefined;
    admissionType: string | undefined;
    studentType: string | undefined;
    sectionAllocation: string | undefined;
    startDate: any;
    endDate: any;
};

export type IFilterPayload = IFilterState & IAdvanceFilterState
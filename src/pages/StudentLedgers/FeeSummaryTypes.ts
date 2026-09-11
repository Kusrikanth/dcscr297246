// student concession table filter
export interface StudentConcessionFilterhProps {
    searchString: string;
    academicYearId: string;
    classId: string;
    curriculumId: string;
    sectionId: string,
    type: string;
}

interface studentDetailsProps {
    StudName?: string;
    dep_id?: string;
    imgUrl?: string;
}

// student concession table data type
export interface FeeSummaryDataTypes {
    id: number;
    studentName: studentDetailsProps;
    curriculum: string;
    class: string;
    section: string;
    totalAmount: string;
    paidAmount: string;
    balanceAmt: string;
}
export interface IStudentConcessionModal {
    showModal: boolean;
    branchId: string;
}

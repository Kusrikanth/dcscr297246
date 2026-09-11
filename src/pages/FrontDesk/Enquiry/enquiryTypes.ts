

export interface EnquiryFilterhProps {
    search: string;
    academicYearId:string;
    classId: string;
    curriculumId:string;
    requestType?: string;
    enqStatus: string;
    startDate:string;
    endDate:string;
    date: string;
    isAdmissionEligible ?:string;
  }

  
export interface EnquiryModalProps {
    isOpen: boolean;
    toggle: any;
    modalTitle: string;
    instituteId: string;
    instituteName: string;
    branchId: string;
    editBranchDetails: string | undefined;
    editCertificateDetails?:any,
    tcId?:any
  }
  
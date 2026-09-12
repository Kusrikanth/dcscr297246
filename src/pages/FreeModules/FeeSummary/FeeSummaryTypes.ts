// student concession table filter
export interface StudentConcessionFilterhProps {
  searchString: string;
  academicYearId: string;
  branchId: string;
  classId: string;
  curriculumId: string;
  type: string;
  feeDueStatus: string;
  recentFollowupRemarksStartDate: string;
  recentFollowupRemarksEndDate: string;
  nextFollowupRemarksStartDate: string;
  nextFollowupRemarksEndDate: string;
  jodoOptedStatuses: Array<any>;
  termIds: Array<any>;
  isEliteParent: string;
  chronicParentTypeIds: Array<any>;
}

interface studentDetailsProps {
  StudName?: string;
  dep_id?: string;
  imgUrl?: string;
}

export interface IStudentConcessionModal {
  showModal: boolean;
  branchId: string;
}


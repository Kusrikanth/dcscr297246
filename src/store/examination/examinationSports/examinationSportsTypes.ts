export interface ExaminationSportsTypes {
  // settings
  getSportsNamesResp: any;
  getSportsNameByIdResp: any;
  saveSportsNameItemResp: any;
  editSportsNameItemResp: any;
  delSportsNameItemResp: any;

  getSportsAttributesListResp: any;
  getSportsAttributeByIdResp: any;
  saveSportsAttributeItemResp: any;
  editSportsAttributeItemResp: any;
  delSportsAttributeItemResp: any;

  getSportsGradesListResp: any;
  getSportsGradeByIdResp: any;
  saveSportsGradeItemResp: any;
  editSportsGradeItemResp: any;
  delSportsGradeItemResp: any;

  // management
  getSportsClassMappingListResp: any;
  getSportsClassMappingByIdResp: any;
  saveSportsClassMappingItemResp: any;
  editSportsClassMappingItemResp: any;
  deleteSportsClassMappingResp: any;
  
  getSportsSubAttributeListResp: any;
  getSportsSubAttributeItemByIdResp: any;
  saveSportsSubAttributeItemResp: any;
  editSportsSubAttributeItemResp: any;
  delSportsSubAttributeItemResp: any;
  getSportsClassesListResp:any;
  getSportsClassesListByIdResp:any;

  getSubAttributesItemsListResp:any;
  getSubAttributesCommonListResp:any;

  getAssignSportsToStudentsListResp:any;
  getAssignSportsToStudentItemByIdResp:any;
  saveAssignSportsToStudentsResp:any;
  editAssignSportsToStudentsResp:any;

  getNotAssignedStudentsListResp:any;

  getSportsDiscriptionsListResp:any;
  saveSportsDiscriptionsListResp:any;
  delSportsDiscriptionsItemResp:any;
  getSportsunAssignedClassesResp:any;

  
  getExaminationSportsErrResp: any;
  
    // Grade Entry
    getStudentSportsGradeEntryResp : any;
    getStudentSportsGradeEntryByIdResp : any;
    editStudentSportsGradeEntryResp : any;
    saveStudentSportsGradeEntryResp : any;
    getSportsMainAttributesWithSubAttributesResp : any;

  // BMI Details
  saveStudentBmiDetailsResp: any;

  // sports teacher
  getSportsTeacherListResp: any;
  getSportsTeacherByIdResp: any;
  saveSportsTeacherResp: any;
  editSportsTeacherResp: any;
  unAssignSportsTeacherResp: any;

  // Sports Progress Card
  getSportsProgressCardListResp: any;
  downloadSportsProgressCardResp: any;

  getOtherProgressCardAccessResp: any;
}

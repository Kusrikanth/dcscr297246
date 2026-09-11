export const subjectlistofteacherUrl = {
  // get_inst_details: ({ instituteId }: any) => `${settingsUrl}/settings-service/api/v1/institutes/${instituteId}`,
  get_subject_list_of_teacher:`/academic/api/v1/subject/teacher-subjects`,
  assign_subject_to_teacher: ({ teacherId, academicYearId,branchCurriculumId }: any) =>
    `/academic/api/v1/subject/assign-teacher?teacherId=${teacherId}&academicYearId=${academicYearId}&branchCurriculumId=${branchCurriculumId}`,
  update_assigned_subject_to_teacher: ({ teacherId, academicYearId, oldSubjectId }: any) =>
    `/academic/api/v1/subject/edit-teacher-subject?academicYearId=${academicYearId}&teacherId=${teacherId}&oldSubjectId=${oldSubjectId}`,
  delete_subject_of_teacher: ({teacherId,subjectId,branchClassId,academicYearId,languageId }:any)=>`/academic/api/v1/subject/teacher-subjects?teacherId=${teacherId}&subjectId=${subjectId}&branchClassId=${branchClassId}&academicYearId=${academicYearId}&languageId=${languageId}`,
};

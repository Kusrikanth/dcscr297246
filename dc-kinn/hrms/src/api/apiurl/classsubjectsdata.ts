export const classsubjectsUrl = {
  // get_inst_details: ({ instituteId }: any) => `${settingsUrl}/settings-service/api/v1/institutes/${instituteId}`,

  update_class_subject_list: ({ classId,academicYearId,curriculumId }: any) =>
    `/academic/api/v1/subject/class/${classId}/subjects?academicYearId=${academicYearId}&curriculumId=${curriculumId}`,
  delete_class_subject_list: ({ subjectId,branchClassId,academicYearId,curriculumId }: any) =>
    `/academic/api/v1/subject/class/subject/${subjectId}?branchClassId=${branchClassId}&curriculumId=${curriculumId}&academicYearId=${academicYearId}`,

  get_section_teacher_list: () => `/academic/api/academic-service/v1/subject/section-teachers`,
  save_subject_teacher: () => `/academic/api/academic-service/v1/subject`
};


export const groupstudentUrl = {
  // get_inst_details: ({ instituteId }: any) => `/settings-service/api/v1/institutes/${instituteId}`,
  get_group_student_list: `/academic/api/v1/branch-class-student-stream`,
  get_unassigned_group_student_list: `/academic/api/v1/branch-class-student-stream/unassigned`,
  get_academic_details: () => `/academic-service/academics/v1`,
  get_class_details: ({ academicId }: any) =>
    `/academic-service/academic-class/v1/classes?academicId=${academicId}`,
  get_stream_list: `/academic/api/v1/branch-stream-group/all`,
  get_stream_by_id: ({ stream_id }: any) =>
    `/academic/api/v1/branch-stream-group/${stream_id}`,
  assigned_student_to_group: `/academic/api/v1/branch-class-student-stream`,
  remove_student_from_group: ({ studentId }: any) => `/academic/api/v1/branch-class-student-stream/${studentId}`,
  delete_student_to_section: ({ academicClassSectionId, studentId }: any) => `/academic/api/class-section/v1/delete-section-student?studentId=${studentId}&academicClassSectionId=${academicClassSectionId}`,
  get_class_subject_list: `/academic/api/v1/subject/all`,
  get_assigned_class_subject_list: `/academic/api/v1/subject/academic-subjects`,
  get_exam_subject_list: `/admission/api/admission-service/exam-marks/exam-subjects`,

  get_student_allocatedsubjects: `/academic/api/academic-service/subjects-allocation/all`,
  assign_subject_tostudent: `/academic/api/academic-service/subjects-allocation`,
  copy_previous_subject: `/academic/api/academic-service/subjects-allocation/copy-subjects`,
  delete_student_allocatedsubjects: ({ allocationId }: any) => `/academic/api/academic-service/subjects-allocation/${allocationId}`,

  save_branch_class_languages : `/academic/api/class-section/v1/languages`,
  delete_branch_class_languages :({ id }: any) => `/academic/api/class-section/v1/languages?ids=${id}`,
};

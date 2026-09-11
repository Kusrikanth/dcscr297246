export const lmsSettings = {
    //question no format
    get_question_no_format: "/question-bank/api/question-bank/v1/question-no-format/all",
    save_question_no_format: "/question-bank/api/question-bank/v1/question-no-format",
    update_question_no_format: ({ id }: any) => `/question-bank/api/question-bank/v1/question-no-format/${id}`,
    delete_question_no_format: ({ id }: any) => `/question-bank/api/question-bank/v1/question-no-format/${id}`,

    //question-types
    get_question_types: "/question-bank/api/question-bank/v1/question-types",
    save_question_types: "/question-bank/api/question-bank/v1/question-types",
    get_question_types_by_id: ({ id }: any) => `/question-bank/api/question-bank/v1/question-types/${id}`,
    update_question_types: ({ id }: any) => `/question-bank/api/question-bank/v1/question-types/${id}`,
    delete_question_types: ({ id }: any) => `/question-bank/api/question-bank/v1/question-types/${id}`,

    //Difficulty-levels
    get_difficulty_levels: "/question-bank/api/question-bank/v1/question-difficulty-level",
    save_difficulty_levels: "/question-bank/api/question-bank/v1/question-difficulty-level",
    get_difficulty_levels_by_id: ({ id }: any) => `/question-bank/api/question-bank/v1/question-difficulty-level/${id}`,
    update_difficulty_levels: ({ id }: any) => `/question-bank/api/question-bank/v1/question-difficulty-level/${id}`,
    delete_difficulty_levels: ({ id }: any) => `/question-bank/api/question-bank/v1/question-difficulty-level/${id}`,

    //Bloom-taxonomy
    get_bloom_taxonomy: "/question-bank/api/question-bank/v1/bloom-taxonomy",
    save_bloom_taxonomy: "/question-bank/api/question-bank/v1/bloom-taxonomy",
    update_bloom_taxonomy: ({ id }: any) => `/question-bank/api/question-bank/v1/bloom-taxonomy/${id}`,
    delete_bloom_taxonomy: ({ id }: any) => `/question-bank/api/question-bank/v1/bloom-taxonomy/${id}`,

    //All-Assessments
    get_all_assessment: "/assessment/api/assessment-service/assessment",

    
    // Academic Details
    get_academic_details_list: `/course/api/course-service/school-academic`,
    save_academic_details: `/course/api/course-service/school-academic`,
    get_academic_details_by_id: ({ id }: any) => `/course/api/course-service/school-academic/${id}`,
    delete_academic_details_by_id: ({ id }: any) => `/course/api/course-service/school-academic/${id}`,
    
    //Academic Term Details
    get_academic_term_details_list: `/course/api/course-service/school-academic/term-details`,
    save_academic_term_details: `/course/api/course-service/school-academic/term-details`,
    get_academic_term_details_by_id: ({ id }: any) => `/course/api/course-service/school-academic/term-details/${id}`,
    delete_academic_term_details_by_id: ({ id }: any) => `/course/api/course-service/school-academic/term-details/${id}`,

    //School Period Details
    get_school_period_details_list: `/course/api/course-service/school-academic/period-details`,
    save_school_period_details: `/course/api/course-service/school-academic/period-details`,
    get_school_period_details_by_id: ({ id }: any) => `/course/api/course-service/school-academic/period-details/${id}`,
    delete_school_period_details_by_id: ({ id }: any) => `/course/api/course-service/school-academic/period-details/${id}`,

    //School Holidays
    get_school_holidays_list: `/course/api/course-service/school-academic/holidays`,
    save_school_holidays: `/course/api/course-service/school-academic/holidays`,
    get_school_holidays_by_id: ({ id }: any) => `/course/api/course-service/school-academic/holidays/${id}`,
    delete_school_holidays_by_id: ({ id }: any) => `/course/api/course-service/school-academic/holidays/${id}`,

    //Digital Curriculum Validation's
    get_digital_curriculum_validation_list: `/course/api/course-service/curriculum-validations`,
    save_digital_curriculum_validation: `/course/api/course-service/curriculum-validations`,

    //Digital Curriculum Rule's
    get_digital_curriculum_rules_list: `/course/api/course-service/curriculum-rules`,
    save_digital_curriculum_rules: `/course/api/course-service/curriculum-rules`,
}

export const lmsAssessment = {
    get_question_bank_repository: "/question-bank/api/question-bank-service/question-bank",
    save_question_bank_repository: "/question-bank/api/question-bank-service/question-bank",
    get_question_bank_repository_by_id: ({ id }: any) => `/question-bank/api/question-bank-service/question-bank/${id}`,
    update_question_bank_repository: ({ id }: any) => `/question-bank/api/question-bank-service/question-bank/${id}`,
    delete_question_bank_repository: ({ id }: any) => `/question-bank/api/question-bank-service/question-bank/${id}`,

    //Question Pool
    get_question_pool_library: "/question-bank/api/question-bank-service/question-pool/all",
    save_question_pool_library: "/question-bank/api/question-bank-service/question-pool",
    edit_question_pool_library: ({ id }: any) => `/question-bank/api/question-bank-service/question-pool/${id}`,
    get_question_pool_library_by_id: ({ id }: any) => `/question-bank/api/question-bank-service/question-pool/${id}`,
    delete_question_pool_library: ({ id }: any) => `/question-bank/api/question-bank-service/question-pool/${id}`,

    //Create Assessment
    save_basic_assessment: "/assessment/api/assessment-service/assessment",
    get_assessment_code: "/assessment/api/assessment-service/assessment/assessment-code",
    get_assessment_by_id: ({ id }: any) => `/assessment/api/assessment-service/assessment/${id}`,
    save_assessment_questions: ({ id }: any) => `/assessment/api/assessment-service/assessment/${id}/questions`,
    get_assessment_questions_by_id: ({ id }: any) => `/assessment/api/assessment-service/assessment/${id}/questions`,
    save_assign_students_assessment: ({ id }: any) => `/assessment/api/assessment-service/assessment/${id}/assignedDetails`,
    get_assign_students_assessment_by_id: ({ id }: any) => `/assessment/api/assessment-service/assessment/${id}/assignedDetails`,
    create_assessemnt_settings_step: `/assessment/api/assessment-service/assessment/settings`,
    get_published_assessment: ({ id }: any) => `/assessment/api/assessment-service/assessment/${id}/publish`,
    save_reschedule_assessment: ({ id }: any) => `/assessment/api/assessment-service/assessment/${id}/reschedule`,
    get_assessment_stats: `/assessment/api/assessment-service/assessment/stats`,

    //Global Settings
    get_global_settings_assessment_id: ({ assessmentId }: any) => `/assessment/api/assessment-service/assessment/settings/${assessmentId}`,
    get_global_settings_branch_id: "/assessment/api/assessment-service/assessment/global-settings",
    save_global_settings: "/assessment/api/assessment-service/assessment/global-settings",

    //Grades Distribution
    get_grades_distribution: "/assessment/api/assessment-service/assessment/grades",
    save_grades_distribution: "/assessment/api/assessment-service/assessment/grades",
    update_grades_distribution: ({ id }: any) => `/assessment/api/assessment-service/assessment/grades/${id}`,
    delete_grades_distribution: ({ id }: any) => `/assessment/api/assessment-service/assessment/grades/${id}`,
    get_grades_distribution_by_id: ({ id }: any) => `/assessment/api/assessment-service/assessment/grades/${id}`,

    //review
    get_assessment_review: ({ id }: any) => `/assessment/api/assessment-service/assessment/review/${id}`,

    //view assessment details
    get_result_list: `/assessment/api/assessment-service/assessment-attempt/all`,
    export_student_result_list: `/assessment/api/assessment-service/assessment-attempt/export`,
    edit_feedback:`assessment/api/assessment-service/assessment-attempt/update-feedback`,
    get_live_monitor: ({ id }: any) => `/assessment/api/assessment-service/assessment/${id}/readiness-logs`,
}

export const lmsStudentAssessments = {
    get_student_assessments_list: `/assessment/api/assessment-service/assessment/student-assessments`,
    get_student_assessment_list_by_id: ({ assessmentId }: any) => `/assessment/api/assessment-service/assessment/${assessmentId}`,
    get_student_assessments_questions: ({ assessmentId }: any) => `/assessment/api/assessment-service/assessment/${assessmentId}/questions`,

    validate_student_readiness: ({ assessmentId }: any) => `/assessment/api/assessment-service/assessment/${assessmentId}/validate-readiness`,

    get_current_status_of_assessment: `/assessment/api/assessment-service/assessment-attempt/current-status`,
    //API to Start Assessment
    get_start_assessment_details: ({ assessmentId, studentId }: any) => `/assessment/api/assessment-service/assessment-attempt/start-assessment?assessmentId=${assessmentId}&studentId=${studentId}`,
    restart_assessment: ({ attemptId }) => `/assessment/api/assessment-service/assessment-attempt/re-attempt/${attemptId}`,
    save_question_order_by_attempt_id: ({ attemptId }) => `/assessment/api/assessment-service/assessment-attempt/${attemptId}/questions-order`,

    //Auto Save Assessment
    save_auto_assessment: ({ attemptId }: any) => `/assessment/api/assessment-service/assessment-attempt/${attemptId}/answers/auto-save`,

    //Submit Assessment Test
    submit_assessment: ({ attemptId }: any) => `/assessment/api/assessment-service/assessment-attempt/${attemptId}/submit`,
    get_assessment_result_summary_details: ({ attemptId }: any) => `/assessment/api/assessment-service/assessment-attempt-result/${attemptId}/result-summary`,
    get_assessment_question_details: ({ attemptId }: any) => `/assessment/api/assessment-service/assessment-attempt-result/${attemptId}/question-summary`,
    save_evaluated_manual_marks: ({ attemptId }: any) => `/assessment/api/assessment-service/assessment-attempt/${attemptId}/manual-evaluate`,
    get_result_report_card: ({ attemptId }: any) => `/assessment/api/assessment-service/assessment-attempt-result/${attemptId}/download-report`,

    //Dashboard
    get_assessment_question_section_heatmap: ({ assessmentId }: any) => `/assessment/api/assessment-service/assessment/dashboard/section-question-analysis/${assessmentId}`,
    get_stats_by_assessment: ({ assessmentId, sectionId }: any) => `/assessment/api/assessment-service/assessment/dashboard/stats/${assessmentId}?sectionId=${sectionId}`,
    get_assessment_wise_top_students_details: ({ assessmentId, sectionId }: any) => `/assessment/api/assessment-service/assessment/dashboard/top-students/${assessmentId}?sectionId=${sectionId}`,
    get_assessment_section_grade_summary_details: ({ assessmentId }: any) => `/assessment/api/assessment-service/assessment/dashboard/grade-distribution/${assessmentId}`,
    get_assessment_section_wise_outcome_details: ({ assessmentId, sectionId }: any) => `/assessment/api/assessment-service/assessment/dashboard/result-counts/${assessmentId}?sectionId=${sectionId}`,
    get_assessment_section_wise_marks_outcome_details: ({ assessmentId, sectionId }: any) => `/assessment/api/assessment-service/assessment/dashboard/section-summary/${assessmentId}`,
    get_student_assessment_stats_details: ({ studentId }: any) => `/assessment/api/assessment-service/student-assessment-summary/stats/${studentId}`,
}

export const lmsDigitalCurriculum = {

    //Digital-Curriculum
    get_digital_curriculum_stats: `/course/api/course-service/subject-curriculum/stats`,
    get_digital_curriculum_list: `/course/api/course-service/subject-curriculum`,
    save_basic_digital_curriculum: `/course/api/course-service/subject-curriculum`,
    get_digital_curriculum_basic_details_by_id: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum/${subjectCurriculumId}`, 
    save_digital_curriculum_bulk_upload_excel: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum/upload/${subjectCurriculumId}/validate-and-save`,
    save_header_map_digital_curriculum: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum/upload/${subjectCurriculumId}/map-and-save`,
    get_digital_curriculum_bulk_upload_excel_preview: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum/upload/${subjectCurriculumId}/preview`,
    save_digital_curriculum_bulk_upload: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum/upload/${subjectCurriculumId}/finalize`, 
    get_digital_curriculum_manual_upload_by_id: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum/${subjectCurriculumId}/builder-preview`, 
    save_digital_curriculum_manual_upload: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum/${subjectCurriculumId}/curriculum-details`, 
    preview_digital_curriculum_details: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum/${subjectCurriculumId}/review`,
    submit_digital_curriculum_review: ({ subjectCurriculumId, isConfirmed, comment }: any) => `/course/api/course-service/subject-curriculum/${subjectCurriculumId}/submit-for-review?isConfirmed=${isConfirmed}&comment=${comment}`,
    publish_digital_curriculum: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum/${subjectCurriculumId}/publish`,

    //Course Planner - Builder
    get_curriculum_structure: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum-build/${subjectCurriculumId}/curriculum-details`,
    get_inline_builder_grid: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum-build/${subjectCurriculumId}`,
    get_weeks_list: `/course/api/course-service/subject-curriculum-build/week-details`,
    save_subject_curriculum_builder: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum-build/${subjectCurriculumId}`,
    send_build_review: ({ subjectCurriculumId, isConfirmed, comment  }: any) => `/course/api/course-service/subject-curriculum-build/${subjectCurriculumId}/submit-for-builder-review?isConfirmed=${isConfirmed}&comment=${comment}`,
    save_build_publish: ({ subjectCurriculumId }: any) => `/course/api/course-service/builder-reviews/${subjectCurriculumId}/publish`,
    digital_curriculum_download_report: ({ subjectCurriculumId }: any) => `/course/api/course-service/subject-curriculum/${subjectCurriculumId}/download-report`,

    //HOD Digital-Curriculum Review
    hod_review_digital_curriculum_details_by_id: ({ subjectCurriculumId }: any) => `/course/api/course-service/reviews/${subjectCurriculumId}/hod-review`,
    submit_hod_review_digital_curriculum_details_by_id: ({ subjectCurriculumId }: any) => `/course/api/course-service/reviews/${subjectCurriculumId}/submit-review`,
    hod_feedback_history_details_by_id: ({ subjectCurriculumId }: any) => `/course/api/course-service/reviews/${subjectCurriculumId}`,

    //HOD Course Planner Review
    hod_review_course_planner_details_by_id: ({ subjectCurriculumBuildId }: any) => `/course/api/course-service/builder-reviews/${subjectCurriculumBuildId}/builder-hod-review`,
    submit_hod_review_course_planner_details_by_id: ({ subjectCurriculumBuildFeedbackId }: any) => `/course/api/course-service/builder-reviews/${subjectCurriculumBuildFeedbackId}/submit-builder-review`,
    hod_feedback_history_course_planner_details_by_id: ({ subjectCurriculumBuildId }: any) => `/course/api/course-service/builder-reviews/${subjectCurriculumBuildId}`,

    // zoom meeting
    get_all_section_meeting_link : "/conference/api/v1/meeting-links/all",
    save_class_meeting_link_by_class:"/conference/api/v1/meeting-links",

    // meeting schedules
    get_scheduled_meetings_list:"/conference/api/v1/meetings/all",
    get_scheduled_meeting_item_by_id: ({id}) =>  `/conference/api/v1/meetings/${id}`,
    save_scheduled_meeting_item:"/conference/api/v1/meetings",
    cancel_scheduled_meetings_item_by_id: ({id}:any) => `/conference/api/v1/meetings/${id}/cancel`,
    edit_scheduled_meetings_item_by_id:({id}:any) => `/conference/api/v1/meetings/${id}/update`,
    reSchedule_scheduled_meetings_item_by_id:({id}:any) => `/conference/api/v1/meetings/${id}/reschedule`,
    get_scheduled_meetings_stats:`/conference/api/v1/meetings/stats`,
    start_scheduled_meeting_item_by_id: ({ id }: any) =>
    `/conference/api/v1/meetings/${id}/start`,

    restart_scheduled_meeting_item_by_id: ({ id }: any) =>
    `/conference/api/v1/meetings/${id}/restart`,

    end_scheduled_meeting_item_by_id: ({ id }: any) =>
    `/conference/api/v1/meetings/${id}/end`,

    join_scheduled_meeting_item_by_id: ({ id }: any) =>
    `/conference/api/v1/meetings/attendance/${id}/join`,
    get_zoom_meeting_join_token: ({ sectionId }: any) =>
    `/conference/api/v1/meetings/zoom/${sectionId}/join-token`,

    leave_scheduled_meeting_item_by_id: ({ id }: any) =>
    `/conference/api/v1/meetings/attendance/${id}/leave`,
}
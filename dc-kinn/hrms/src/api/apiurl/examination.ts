export const examinationSettings = {
    //cbse settings

    //Examination-Tab
    get_cbse_examination_list: `/examination/api/v2/examination/cbse-examination/all`,
    get_examination_term_list: ({ instituteId, termTypeName }: any) => `/examination/api/v2/examination/cbse-examination/terms/${termTypeName}?instituteId=${instituteId}`,
    get_cbse_examination_details_list_by_id: ({ id }: any) => `/examination/api/v2/examination/cbse-examination/${id}`,
    edit_cbse_examination_list: ({ id }: any) => `/examination/api/v2/examination/cbse-examination/update/${id}`,
    save_cbse_examination: `/examination/api/v2/examination/cbse-examination/save`,
    delete_cbse_examination_list: ({ id }: any) => `/examination/api/v2/examination/cbse-examination/delete/${id}`,
    change_display_order_examination: `/examination/api/v2/examination/cbse-examination/auto-update-order`,
    get_exam_category: `/examination/api/v2/examination/category/all`,

    //Examination-Weightage
    get_cbse_weightage_list: `/examination/api/v2/examination/cbse-examination-weightage/getAll`,
    get_cbse_weightage_details_list_by_id: ({ id }: any) => `/examination/api/v2/examination/cbse-examination-weightage/${id}`,
    edit_cbse_weightage_list: ({ id }: any) => `/examination/api/v2/examination/cbse-examination-weightage/update/${id}`,
    save_cbse_weightage: `/examination/api/v2/examination/cbse-examination-weightage/save`,
    delete_cbse_weightage_list: ({ id }: any) => `/examination/api/v2/examination/cbse-examination-weightage/delete/${id}`,
    // OverAllGrades
    get_cbse_examination_over_all_grades: `/examination/api/v2/examination-grades/fetch`,
    get_cbse_examination_over_all_grades_by_id: ({ id }: any) => `/examination/api/v2/examination-grades/${id}`,
    save_cbse_examination_over_all_grades: `/examination/api/v2/examination-grades/save`,
    edit_cbse_examination_over_all_grades_by_id: ({ id }: any) => `/examination/api/v2/examination-grades/update/${id}`,
    delete_cbse_examination_over_all_grades_by_id: ({ id }: any) => `/examination/api/v2/examination-grades/delete/${id}`,
    copy_cbse_examination_over_all_grades: `/examination/api/v2/examination-grades/copy`,
    get_overall_grade_color_list: `/examination/api/v2/examination-grades/fetch-grade-colors`,
    save_overall_grade_color: `/examination/api/v2/examination-grades/update-grade-colors`,

    //Examination-Subjects
    get_cbse_examination_subject_list: `/examination/api/v2/examination/cbse-examination-subjects/all`,
    change_display_order_examination_subject_list: `/examination/api/v2/examination/cbse-examination-subjects/set-grade-order`,
    get_subject_list: `/examination/api/v2/examination/cbse-examination-subjects/subjects/all`,
    get_cbse_examination_subject_details_list_by_id: ({ id }: any) => `/examination/api/v2/examination/cbse-examination-subjects/${id}`,
    edit_cbse_examination_subject_list: ({ id }: any) => `/examination/api/v2/examination/cbse-examination-subjects/update/${id}`,
    save_cbse_examination_subject: `/examination/api/v2/examination/cbse-examination-subjects/save`,
    delete_cbse_examination_subject_list: ({ id }: any) => `/examination/api/v2/examination/cbse-examination-subjects/delete/${id}`,

    //Examination-Coscholastic-Grades
    get_cbse_examination_coscholastic_grades_list: `/examination/api/v2/examination-coscholastic-grades/fetch`,
    get_coscholastic_subjects_list: `/examination/api/v2/examination/cbse-examination-subjects/fetch-subjects-skills`,
    get_cbse_examination_coscholastic_grades_details_list_by_id: ({ id }: any) => `/examination/api/v2/examination-coscholastic-grades/fetch/${id}`,
    edit_cbse_examination_coscholastic_grades_list: ({ id }: any) => `/examination/api/v2/examination-coscholastic-grades/update/${id}`,
    save_cbse_examination_coscholastic_grades: `/examination/api/v2/examination-coscholastic-grades/save`,
    delete_cbse_examination_coscholastic_grades_list: ({ id }: any) => `/examination/api/v2/examination-coscholastic-grades/delete/${id}`,
    copy_cbse_examination_coscholastic_grades: `/examination/api/v2/examination-coscholastic-grades/copy`,

    //Examination Marks
    get_cbse_examination_marks_list: `/examination/api/v2/examination-marks/fetch`,
    get_cbse_examination_marks_details_by_id: ({ id }: any) => `/examination/api/v2/examination-marks/fetch/${id}`,
    edit_cbse_examination_marks: ({ id }: any) => `/examination/api/v2/examination-marks/update/${id}`,
    save_cbse_examination_marks: `/examination/api/v2/examination-marks/save`,
    delete_cbse_examination_marks: ({ id }: any) => `/examination/api/v2/examination-marks/delete/${id}`,

    //Subject order
    get_cbse_examination_subject_order: `/examination/api/v2/cbse-examination-management/subjects-order/all-master-subjects`,
    get_cbse_all_subjects_order: `/examination/api/v2/cbse-examination-management/subjects-order/all`,
    save_cbse_examination_subject_order: `/examination/api/v2/cbse-examination-management/subjects-order/save-update`,

    //Add Multiple Exam Marks
    get_cbse_examination_multiple_exam_marks: `/examination/api/v2/examination/cbse-examination-multiple-exam-marks/all`,
    get_cbse_examiantion_mutltiple_exam_marks_by_id: ({ id }: any) => `/examination/api/v2/examination/cbse-examination-multiple-exam-marks/getById/${id}`,
    save_cbse_examiantion_multiple_exam_marks: `/examination/api/v2/examination/cbse-examination-multiple-exam-marks/save`,
    edit_cbse_examiantion_multiple_exam_marks_by_id: ({ id }: any) => `/examination/api/v2/examination/cbse-examination-multiple-exam-marks/update/${id}`,
    delete_cbse_examiantion_multiple_exam_marks_by_id: ({ id }: any) => `/examination/api/v2/examination/cbse-examination-multiple-exam-marks/${id}`,

    //Skill Entry
    get_skill_entry_list: `/examination/api/v2/examination-skills/all`,
    delete_skill_entry: ({ id }: any) => `/examination/api/v2/examination-skills/delete/${id}`,
    save_skill_entry: `/examination/api/v2/examination-skills/save`,
    get_skill_entry_by_id: ({ id }: any) => `/examination/api/v2/examination-skills/${id}`,
    update_skill_entry: ({ id }: any) => `/examination/api/v2/examination-skills/update/${id}`,


    //Ao's Mapping
    get_ao_subject_list: `/academic/api/v1/subject/all`,
    get_ao_mapping_subjects: `/examination/api/v2/examination/settings/aos/aos-subjects/all`,
    save_ao_mapping_subjects: `/examination/api/v2/examination/settings/aos/aos-subjects`,
    delete_ao_mapping_subjects: ({ id }: any) => `/examination/api/v2/examination/settings/aos/aos-subjects/${id}`,
    update_ao_mapping_subjects: ({ id }: any) => `/examination/api/v2/examination/settings/aos/aos-subjects/${id}`,
    get_ao_mapping_subjects_by_id: ({ id }: any) => `/examination/api/v2/examination/settings/aos/aos-subjects/${id}`,

    //Signature
    get_signature_list: `/examination/api/v2/examination/signature/class-wise-signature`,
    save_signature: `/examination/api/v2/examination/signature/save`,
    update_signature: `/examination/api/v2/examination/signature/update`,
    delete_signature: ({ id }: any) => `/examination/api/v2/examination/signature/delete/${id}`,

    //IGSE Settings
    //Term Name
    get_igse_term_name_list: `/examination/api/v2/examination/igcse/terms/all`,
    get_copy_igse_term_name_list: `/examination/api/v2/examination/igcse/terms/all`,
    save_igse_term_name: `/examination/api/v2/examination/igcse/terms`,
    get_igse_term_name_by_id: ({ termId }: any) => `/examination/api/v2/examination/igcse/terms/${termId}`,
    update_igse_term_name_by_id: ({ termId }: any) => `/examination/api/v2/examination/igcse/terms/${termId}`,
    delete_igse_term_name: ({ termId }: any) => `/examination/api/v2/examination/igcse/terms/${termId}`,

    //Term Details
    get_igse_term_details_list: `/examination/api/v2/examination/igcse/terms/term-details/all`,
    save_igse_term_details: `/examination/api/v2/examination/igcse/terms/term-details`,
    get_igse_term_details_by_id: ({ id }: any) => `/examination/api/v2/examination/igcse/terms/term-details/${id}`,
    update_igse_term_details_by_id: ({ id }: any) => `/examination/api/v2/examination/igcse/terms/term-details/${id}`,
    delete_igse_term_details: ({ id }: any) => `/examination/api/v2/examination/igcse/terms/term-details/${id}`,

    // Internal Subject Grades
    get_cbse_internal_subjects_grades_list: `/examination/api/v2/examination/internal-subject/all`,
    save_cbse_internal_subjects_grades_list: `/examination/api/v2/examination/internal-subject`,
    copy_cbse_internal_subjects_grades_list: `/examination/api/v2/examination/internal-subject/copy`,
    get_cbse_internal_subjects_grades_list_by_id: ({ id }: any) => `/examination/api/v2/examination/internal-subject/${id}`,
    edit_cbse_internal_subjects_grades_list: ({ id }: any) => `/examination/api/v2/examination/internal-subject/${id}`,
    delete_cbse_internal_subjects_grades_list: ({ id }: any) => `/examination/api/v2/examination/internal-subject/${id}`,

    // Report Card Settings
    get_report_card_settings: '/examination/api/v2/examination/progress-card/config/all',
    report_card_config: `/examination/api/v2/examination/progress-card/config`,
    save_report_card_settings: `/examination/api/v2/examination/progress-card/config`,
    delete_report_card_settings: ({ id }: any) => `/examination/api/v2/examination/progress-card/config/${id}`,
    parent_progresscard_download: `/examination/api/v2/examination/reports-generation/get-progress-card-for-student`,
    //percentage slabs
    get_percentage_slabs_list: `/examination/api/v2/examination/percentage-slab/all`,
    save_percentage_slabs_list: `/examination/api/v2/examination/percentage-slab`,
    update_percentage_slabs_list: `/examination/api/v2/examination/percentage-slab`,

    //Area Strength Focus
    get_area_strength_focus: `/examination/api/v2/examination/settings/area-details/sf-subjects`,
    save_area_strength_focus: `/examination/api/v2/examination/settings/area-details/sf-subjects`,
    get_area_strength_focus_by_id: ({ id }: any) => `/examination/api/v2/examination/settings/area-details/sf-subjects/${id}`,
    update_area_strength_focus_by_id: ({ id }: any) => `/examination/api/v2/examination/settings/area-details/sf-subjects/${id}`,


    //Holistic domain
    get_holistic_domain: `/examination/api/examination-service/holistic/domains`,
    save_holistic_domain: `/examination/api/examination-service/holistic/domains`,
    update_holistic_domain: ({ id }: any) => `/examination/api/examination-service/holistic/domains/${id}`,
    save_domain_order: `/examination/api/examination-service/holistic/domains/order`,
    delete_holistic_domain: ({ id }: any) => `/examination/api/examination-service/holistic/domains/${id}`,

    //holistic Activity
    get_holistic_activity: `/examination/api/examination-service/holistic/activities`,
    save_holistic_activity: `/examination/api/examination-service/holistic/activities`,
    update_holistic_activity: ({ id }: any) => `/examination/api/examination-service/holistic/activities/${id}`,
    delete_holistic_activity: ({ id }: any) => `/examination/api/examination-service/holistic/activities/${id}`,
    get_class_institute_id: `/academic/api/v1/branchClass/institute-class-details`,
    get_activity_branch: `/examination/api/examination-service/holistic/activities/branches`,
    get_activity_class: `/examination/api/examination-service/holistic/classes`,
    get_holistic_activity_by_id: ({ id }: any) => `/examination/api/examination-service/holistic/activities/${id}`,
    get_institute_class: `/examination/api/examination-service/holistic/classes`,
    get_classes_by_stage: `/examination/api/examination-service/holistic/classes/all`,
    get_copy_classes_by_stage: `/examination/api/examination-service/holistic/classes/all`,
    copy_activity: ({ id }: any) => `/examination/api/examination-service/holistic/activities/${id}/copy`,
    copy_preparatory_activity: ({ id }: any) => `/examination/api/examination-service/holistic-ps/activities/${id}/copy`,


    //holistic Domain Activity
    get_holistic_domain_activity: `/examination/api/examination-service/holistic/domain/activities`,
    save_holistic_domain_activity: `/examination/api/examination-service/holistic/domain/activities`,
    delete_holistic_domain_activity: ({ id }: any) => `/examination/api/examination-service/holistic/domain/activities/${id}`,

    //holistic Curriculum Goals
    save_holistic_curriculum_goals: `/examination/api/examination-service/holistic/curriculum-goals`,
    get_holistic_curriculum_goals: `/examination/api/examination-service/holistic/curriculum-goals/domain`,
    update_holistic_curriculum_goals: ({ id }: any) => `/examination/api/examination-service/holistic/curriculum-goals/${id}`,
    get_domain_details_students: `/examination/api/examination-service/holistic/student-entry/domain-details`,
    save_student_domain_details: ({ id }: any) => `/examination/api/examination-service/holistic/student-entry/${id}/domains`,
    save_domain_summary: ({ id }: any) => `/examination/api/examination-service/holistic/student-entry/${id}/domains-summary`,
    export_foundation_stage_grade_entry: `/examination/api/examination-service/holistic/student-entry/profiles/export`,
    export_preparatory_stage_grade_entry: `/examination/api/examination-service/holistic-ps/student-entry/profiles-ps/export`, 

    // -----Preparatory-----

    //Preparatory domain
    get_preparatory_domain:`/examination/api/examination-service/holistic/ps-domains`,
    save_preparatory_domain:`/examination/api/examination-service/holistic/ps-domains`,
    update_preparatory_domain:({id}:any) => `/examination/api/examination-service/holistic/ps-domains/${id}`,
    save_preparatory_domain_order:`/examination/api/examination-service/holistic/ps-domains/order`,
    delete_preparatory_domain:({id}:any) => `/examination/api/examination-service/holistic/ps-domains/${id}`,

    //preparatory Curriculum Goals
    get_preparatory_curriculum_goals: `/examination/api/examination-service/holistic/ps-curriculum-goals/domain`,
    save_preparatory_curriculum_goals: `/examination/api/examination-service/holistic/ps-curriculum-goals`,
    update_preparatory_curriculum_goals: ({ id }: any) => `/examination/api/examination-service/holistic/ps-curriculum-goals/${id}`,

    // IGSE Skill Attribute Settings
    get_skill_attribute_settings_list: `/examination/api/examination-service/skill-entries`,
    get_skill_entry_attribute_list_by_id: ({ id }: any) => `/examination/api/examination-service/skill-entries/skill/${id}`,
    save_skill_entry_attribute: `/examination/api/examination-service/skill-entries`,
    update_skill_entry_attribute: ({ id }: any) => `/examination/api/examination-service/skill-entries/${id}`,
    delete_skill_entry_attribute: ({ id }: any) => `/examination/api/examination-service/skill-entries/${id}`,
    save_set_skill_order: `/examination/api/examination-service/skill-entries/skill-order-sequence`,
    save_set_skill_attribute_order: `/examination/api/examination-service/skill-entries/attribute-order-sequence`,
}           
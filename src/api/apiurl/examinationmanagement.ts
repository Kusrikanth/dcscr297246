export const examinationManagamentUrl = {

    // Admit Card Details

    get_cbse_admit_card_details: `/examination/api/v2/examination/admit-card/all`,
    generate_admit_card : `/examination/api/v2/examination/admit-card`,
    download_admit_card : `/examination/api/v2/examination/admit-card/get-base64`,

    // Admit card - Fetch Exam Details For Parent

    get_admit_card_exam_details: ({studentId, academicYearId} : any)=> `/examination/api/v2/examination/admit-card/fetch-student-examination?studentId=${studentId}&academicYearId=${academicYearId}`,

    //Change Student Subjects
    get_change_student_subjects: `/examination/api/v2/cbse-examination-management/change-student-subjects/all`,
    save_change_student_subjects: `/examination/api/v2/cbse-examination-management/change-student-subjects`,
    update_change_student_subjects: ({id} : any)=> `/examination/api/v2/cbse-examination-management/change-student-subjects/${id}`,
    get_change_student_subjects_by_id: ({id} : any)=> `/examination/api/v2/cbse-examination-management/change-student-subjects/${id}`,
    delete_change_student_subjects : ({id} : any)=> `/examination/api/v2/cbse-examination-management/change-student-subjects/${id}`,
    delete_saved_change_student_subjects : ({id} : any)=> `/examination/api/v2/cbse-examination-management/change-student-subjects/subject-details/${id}`,

    //mark entry
    get_student_details: `/examination/api/v2/cbse-examination-management/examination-marks/students`,
    get_examination_classes: `/examination/api/v2/examination/cbse-examination/examination-classes`,
    get_examination_class_subjects: `/examination/api/v2/cbse-examination-management/examination-marks/subjects`,
    save_examination_marks: `/examination/api/v2/cbse-examination-management/examination-marks`,
    get_coscholastic_grades_list: `/examination/api/v2/examination-coscholastic-grades/fetch`,
    download_marks_entry: `/examination/api/v2/cbse-examination-management/examination-marks/download`,
    upload_marks_entry: `examination/api/v2/cbse-examination-management/examination-marks/bulk/upload`,

    //student-remarks
    get_student_remarks : `/examination/api/v2/examination-remarks/all`,
    get_examination_institute_terms : `/examination/api/v2/examination/institute-term/all`,
    get_student_remarks_description : `/examination/api/v2/examination-remarks/content/all`,
    get_student_remarks_details_list_by_id : ({id} : any)=> `/examination/api/v2/examination-remarks/${id}`,
    edit_student_remarks_list : ({remarkId, newRemarks} : any)=> `/examination/api/v2/examination-remarks/update-remarks/${remarkId}?newRemarks=${encodeURIComponent(newRemarks)}`,
    save_student_remarks :  `/examination/api/v2/examination-remarks/save`,
    delete_student_remarks_list : ({remarkId} : any)=> `/examination/api/v2/examination-remarks/delete/${remarkId}`,


    //Ao's Selection
    get_ao_term_subjects: `/examination/api/v2/examination/settings/aos/aos-term-subjects/all`,
    save_ao_term_subjects: `/examination/api/v2/examination/settings/aos/aos-term-subjects`,
    get_ao_term_subjects_by_id: ({id} : any) => `/examination/api/v2/examination/settings/aos/aos-term-subjects/${id}`,
    delete_ao_term_subjects: ({id} : any) => `/examination/api/v2/examination/settings/aos/aos-term-subjects/${id}`,
    update_ao_term_subjects: ({id} : any) => `examination/api/v2/examination/settings/aos/aos-term-subjects/${id}`,    

    // Ao Grade Entry
    get_ao_grade_entry_list: `/examination/api/examination/aoGradeEntry/fetch-all`,
    save_ao_grade_entry: `/examination/api/examination/aoGradeEntry`,

    //Languages_api
    get_examinations_languages_list: `/academic/api/v1/subject/academic-subjects/user`,

    //Ey Grade Entry
    get_ey_grade_list: `/examination/api/v2/examination/ey-grade-entry`,
    get_entry_learner_skill_list: `/examination/api/v2/examination-skills/entry-learner`,
    save_ey_grade_list: `/examination/api/v2/examination/ey-grade-entry/save`,

    //Progress Card
    get_progress_card_list: `/examination/api/v2/progress-card/generate/all`,
    generate_progress_card: `/examination/api/v2/progress-card/generate`,
        //Ey
    download_all_progress_cards: `/examination/api/v2/examination/zip-file/download-zip`,
    download_progress_card_by_system_file_id: ({id} : any) => `/examination/api/v2/examination/reports-generation/download/${id}`,
    preview_progress_card_by_system_file_id: ({id} : any) => `/examination/api/v2/examination/reports-generation/get-base64/${id}`,
        //cbse
    download_cbse_progress_cards: `/examination/api/v2/examination/reports-generation/download/generate-base-64`,
    get_cbse_progress_card_filter_list: `/examination/api/v2/examination/reports-card-filter/all`,
    get_cbse_progress_card_student: `/examination/api/v2/examination/reports-generation/get-progress-card-for-student`,

    //Internal Subjects Marks Entry
    get_internal_subjects_marks_list: `/examination/api/v2/examination/cbse-examination/co-scholastic-grade-entry/fetch-all`,
    save_internal_subjects_marks: `/examination/api/v2/examination/cbse-examination/co-scholastic-grade-entry`,
    get_subjects_for_internal_marks : `/examination/api/v2/examination/cbse-examination/co-scholastic-grade-entry/subjects`,

    //student_grade_book
    get_student_grade_report_book: `/examination/api/v2/examination/student-grade-book/report`,
    export_student_grade_report_book: `/examination/api/v2/examination/student-grade-book/export`,
    export_section_wise_analysis: `/examination/api/v2/report/subject-wise-excel`,

    //marks entry report
    get_marks_entry_report_list: `/examination/api/v2/cbse-examination-management/examination-marks/marks-entry-status`,
    export_marks_entry_report:  `/examination/api/v2/report/marks-entry-status/export`,

    get_classTeacher_list: `/academic/api/class-section/v1/teacher-sections`,

    // igcse student skills attributes details
    get_igcse_student_skills_attributes_details: ({skillEntryId,branchId,academicYearId,classId,sectionId,curriculumId,termId,searchString}: any) =>
    `examination/api/v2/examination/igcse/student-grade-entry?skillEntryId=${skillEntryId}&branchId=${branchId}&academicYearId=${academicYearId}&classId=${classId}&sectionId=${sectionId}&curriculumId=${curriculumId}&termId=${termId}&searchString=${searchString}`,
    save_igcse_student_skills_attributes_details: `examination/api/v2/examination/igcse/student-grade-entry`,
}

export const examinationHolisticUrls  = {
    // student domains
    get_foundation_students_profiles_list : `/examination/api/examination-service/holistic/student-entry/profiles`,
    get_log_activity_status : ({id} : any) => `/examination/api/examination-service/holistic/profiles/log-activities/${id}`,
    save_parent_collected_status: ({id}: any) => `/examination/api/examination-service/holistic/profiles/${id}/parentCollection`,
    copy_foundation_grade_entry_student_details: `/examination/api/examination-service/holistic/student-entry/copy`,

    //holstice report
    save_general_information: `/examination/api/examination-service/holistic/student-entry`,
    save_general_student_photo: `/examination/api/examination-service/holistic/student-entry/upload`,
    get_general_information_by_id: ({id} : any) => `/examination/api/examination-service/holistic/student-entry/${id}`,
    update_general_information: ({id} : any) => `/examination/api/examination-service/holistic/student-entry/${id}/general-info`,
    save_student_surrounding: ({id}: any) => `/examination/api/examination-service/holistic/student-entry/${id}/surroundings`,
    upload_student_surrounding_photo: ({branchId}: any) => `/examination/api/examination-service/holistic/upload-holistic-file?branchId=${branchId}`,
    get_student_summary_by_id: ({id} : any) => `/examination/api/examination-service/holistic/student-entry/${id}/domains`,

    //holistic progress card
    get_holistic_progress_card: `/examination/api/examination-service/holistic/student-entry/progress-cards`,
    get_preparatory_status:({id} : any) => `/examination/api/examination-service/holistic-ps/profiles/log-activities/${id}`,
    save_preparatory_parent_collected_status: ({id}: any) => `/examination/api/examination-service/holistic-ps/student-entry/${id}/parent-collection`,

    //holistic preparatory 
    get_preparatory_list: `/examination/api/examination-service/holistic-ps/student-entry/profiles`,
    save_preparatory_garde_entry: `/examination/api/examination-service/holistic-ps/student-entry`,
    get_preparatory_grade_entry_by_id: ({id} : any) => `/examination/api/examination-service/holistic-ps/student-entry/${id}`,
    update_preparatory_grade_entry: ({id} : any) => `/examination/api/examination-service/holistic-ps/student-entry/${id}/general-info`,
    copy_preparatory_grade_entry_student_details: `/examination/api/examination-service/holistic-ps/student-entry/copy`,

    //preparatory student surrounding
    save_preparatory_student_surrounding: ({id}: any) => `/examination/api/examination-service/holistic-ps/student-entry/${id}/part-a-2`,
    save_preparatory_student_feedback: ({id}: any) => `/examination/api/examination-service/holistic-ps/student-entry/${id}/part-a-3`,
    save_preparatory_parent_feedback: ({id}: any) => `/examination/api/examination-service/holistic-ps/student-entry/${id}/part-a-parent-feedback`,

    //preparatory domain assessment
    get_preparatory_domain_students: `/examination/api/examination-service/holistic-ps/student-entry/domain-details`,
    save_preparatory_domain_students: ({id}: any) => `/examination/api/examination-service/holistic-ps/student-entry/${id}/domains`,
    get_preparatory_summary_by_id: ({id} : any) => `/examination/api/examination-service/holistic-ps/student-entry/${id}/domains`,
    save_preparatory_summary: ({id}: any) => `/examination/api/examination-service/holistic-ps/student-entry/${id}/domains-summary`,

    //preparatory activity
    get_preparatory_activity_list: `/examination/api/examination-service/holistic-ps/activities`,
    save_preparatory_activity: `/examination/api/examination-service/holistic-ps/activities`,
    update_preparatory_activity: ({id} : any) => `/examination/api/examination-service/holistic-ps/activities/${id}`,
    delete_preparatory_activity: ({id} : any) => `/examination/api/examination-service/holistic-ps/activities/${id}`,
    get_preparatory_activity_by_id: ({id} : any) => `/examination/api/examination-service/holistic-ps/activities/${id}`,
  
}
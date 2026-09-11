export const admissionUrl = {
    age_criteria_list: "/admission/api/admission-service/settings/age-criteria",
    age_criteria_by_id: ({ id }: any) => `/admission/api/admission-service/settings/age-criteria/${id}`,
    generate_age_criteria: "/admission/api/admission-service/settings/age-criteria",
    edit_age_criteria: ({ id }: any) => `/admission/api/admission-service/settings/age-criteria/${id}`,
    exam_subjects_list: "/admission/api/admission-service/settings/admission-subjects/all",
    add_exam_subjects: `/admission/api/admission-service/settings/admission-subjects`,
    edit_exam_subjects: ({ id }: any) => `/admission/api/admission-service/settings/admission-subjects/${id}`,
    exam_subjects_stream_list: `/admission/api/admission-service/settings/admission-subjects/all-stream-groups`,
    all_subjects_by_class: `/admission/api/admission-service/settings/admission-subjects/all-subjects`,
    exam_subjects_by_id: ({ id }: any) => `/admission/api/admission-service/settings/admission-subjects/${id}`,
    panel_members_list: `/admission/api/admission-service/settings/panel-members/all`,
    export_panel_members_list: `/admission/api/admission-service/settings/panel-members/export`,
    panel_employees_list: `/admission/api/admission-service/settings/panel-members/all-employees`,
    add_panel_member_list: `/admission/api/admission-service/settings/panel-members`,
    get_panel_member_by_id: ({ id }: any) => `/admission/api/admission-service/settings/panel-members/${id}`,
    edit_panel_member_by_id: ({ id }: any) => `/admission/api/admission-service/settings/panel-members/${id}`,
    admission_availability_class_list: `/admission/api/admission-service/settings/admission-availability/all-classes`,
    edit_admission_availability_class: ({ id }: any) => `/admission/api/admission-service/settings/admission-availability/?id=${id}`,
    get_admission_availability_by_id: ({ id }: any) => `/admission/api/admission-service/settings/admission-availability/${id}`,
    evaluation_process_list: `/admission/api/admission-service/settings/evaluation-process/all`,
    institute_evaluations_list: `/admission/api/admission-service/settings/evaluation-process/institute-evaluations`,
    classes_evaluations_list: `/admission/api/admission-service/settings/evaluation-process/evaluation-classes`,
    add_evaluation_process: `/admission/api/admission-service/settings/evaluation-process`,
    transport_availability_status: `/transport/api/transport-service/slabs/slab-distance`,
    classes_for_add_evaluation: `/admission/api/admission-service/settings/evaluation-process/all-classes`,
    get_evaluation_process_by_id: ({ id }: any) => `/admission/api/admission-service/settings/evaluation-process/${id}`,
    edit_evaluation_process_by_id: ({ id }: any) => `/admission/api/admission-service/settings/evaluation-process/?id=${id}`,
    generate_token_for_user: `/auth-service/api/auth/sta/generate-token`,
    validate_student_tc_request : `/academic/api/academic-service/tc-download`,
    verify_tc_request_otp : `/academic/api/academic-service/tc-download/verify-otp-and-download`,
    save_download_tc_logs :({tcRequestId}:any) => `/academic/api/academic-service/tc-download/save-log?tcRequestId=${tcRequestId}`,

    //Master Document
    get_master_document_list: `/admission/api/admission-service/master-document/all`,
    get_master_document_by_id: ({ id }: any) => `/admission/api/admission-service/master-document/${id}`,
    save_master_document_list: `/admission/api/admission-service/master-document`,
    edit_master_document_by_id: ({ id }: any) => `/admission/api/admission-service/master-document/${id}`,
    delete_master_document: ({ id }: any) => `/admission/api/admission-service/master-document/${id}`,

    //Class Wise Document
    get_class_wise_document_list: `/admission/api/admission-service/documents/all`,
    get_class_wise_document_list_by_id: ({ id }: any) => `/admission/api/admission-service/documents/assigned-documents/${id}`,
    get_unassign_doc_class_list: ({ classId }: any) => `/admission/api/admission-service/documents/unassigned-document/${classId}`,
    edit_class_wise_document_by_id: ({ id, isRequired }: any) => `/admission/api/admission-service/documents/${id}?isRequired=${isRequired}`,
    get_class_list_by_doc: ({ id }: any) => `/admission/api/admission-service/documents/document/${id}`,
    save_class_wise_document_list: `/admission/api/admission-service/documents/save`,
    delete_class_wise_document: ({ id }: any) => `/admission/api/admission-service/documents/class-document/?documentIds=${id}`,

    // Admission Facility
    get_admission_facility_list: `/admission/api/admission-service/settings/admission-facility`,
    get_admission_facility_by_id: ({ id }: any) => `/admission/api/admission-service/settings/admission-facility/${id}`,
    save_admission_facility: `/admission/api/admission-service/settings/admission-facility`,
    edit_admission_facility_by_id: ({ id }: any) => `/admission/api/admission-service/settings/admission-facility/${id}`,
    delete_admission_facility: ({ id }: any) => `/admission/api/admission-service/settings/admission-facility/${id}`,

    // application-sale
    get_registration_isntruction: `/admission/api/admission-service/registration/instructions`,
    get_all_registration_isntruction: `/admission/api/admission-service/registration/instructions/all`,
    update_registration_instruction: ({ id }: any) => `/admission/api/admission-service/registration/instructions/update/${id}`,
    save_registration_instruction:({instituteId,branchId,curriculumId}:any) => `/admission/api/admission-service/registration/instructions/save?instituteId=${instituteId}&branchId=${branchId}&curriculumId=${curriculumId}`,
    get_registration_instruction_html_by_id: ({ id }: any) => `/admission/api/admission-service/registration/instructions/${id}`,
    delete_registration_instruction: ({ id }: any) => `/admission/api/admission-service/registration/instructions/${id}`,
    get_application_details_by_curriculum: ({ curriculumId }: any) => `/academic/api/academic-service/curriculum/${curriculumId}`,

    get_stu_app_tracker_list: ({ searchString }: any) => `/admission/api/admission-service/admission-tracker-report/${searchString}/application-tracker`,
    get_stu_list_for_app_tracker : ({ searchString }: any) => `/admission/api/admission-service/admission-tracker-report/${searchString}/all-records`,
    get_otp_setting_key : ({ searchString }: any) => `/admission/api/admission-service/setting/fetch/${searchString}`,

    //branch class language
    get_branch_class_language: `/academic/api/v1/branchClass/languages`,
    save_branch_class_language: `/academic/api/v1/branchClass/languages`,
    delete_branch_class_language: ({ id }: any) => `/academic/api/v1/branchClass/languages/${id}`,

    // jodo-registration
    jodo_registration: `/admission/api/admission-service/interview-result/jodoRegister`,

    // admission-dashboard
    get_class_wise_analysis: `/admission/api/admission-service/admission-dashboard/class-analysis`,
    get_source_wise_analysis: `/admission/api/admission-service/admission-dashboard/source`,
    get_admission_summary: `/admission/api/admission-service/admission-dashboard/summary`,
    get_admission_analysis: `/admission/api/admission-service/admission-dashboard/admission-analysis`,
    get_admission_summary_report: `/admission/api/admission-service/admission-dashboard/report`,
    admission_stats: `/admission/api/admission-service/admission-dashboard/stats`,
    gender_master: `/academic/api/v1/master/global-records-with-search-filter`,
    lead_conversion_status:`/admission/api/admission-service/admission-dashboard/lead-conversion-status`,
    class_list: `/admission/api/admission-service/admission-dashboard/class-sequence-group`,
    admission_stats_hyperlink: `/admission/api/admission-service/admission-dashboard/branch-wise/stats`,

    //Application-Banner
    get_banner_img: ({ branchId, attributeKey }: any) => `/admission/api/admission-service/settings/admission-banners/banner/${branchId}/${attributeKey}`,
    upload_banner_img: `/admission/api/admission-service/settings/admission-banners/upload-banner`,

    //Signature Configuration Admission
    get_admission_signature_list: `/academic/api/academic-service/signature/class-wise-signature`,
    save_admission_signature: `/academic/api/academic-service/signature/save`,
    update_admission_signature: `/academic/api/academic-service/signature/update`,
    get_admission_signature_by_id: ({ id }: any) => `/academic/api/academic-service/signature/${id}`,
    delete_admission_signature: ({ id }: any) => `/academic/api/academic-service/signature/delete/${id}`,
}


export const admissionRegistrationUrl = {
    registrationinfo_byusername: ({ userName }: any) => `/admission/api/admission-service/pre-admissions/users/${userName}`,
    admission_category: "/admission/api/admission-service/admission-category",
    contribute_stakeholder: "/admission/api/admission-service/contribute-stake",
    upload_activity_file: ({ fileId }: any) => `/admission/api/admission-service/pre-admissions/upload-admission-file?fileId=${fileId}`,
    get_register_students: "/admission/api/admission-service/pre-admissions/students",
    register_link_activate: ({ id }: any) => `/admission/api/admission-service/pre-admissions/applicationSale/${id}/shareLoginDetails`,
    print_applicationform: ({ studentRegNo }: any) => `/admission//api/admission-service/pre-admissions/registration/${studentRegNo}/generateFullAdmissionForm-preview`,
    register_student: "/admission/api/admission-service/pre-admissions/registration",
    update_register_student: ({ studentId }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentId}/update-profile`,
    get_register_student_byid: ({ studentId }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentId}/fetch-profile`,
    add_cocurriculur_activity: ({ studentId, removedIds }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentId}/update-co-curricular-activities?idsToDelete=${removedIds}`,

    get_cocurriculur_byregno: ({ studentId }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentId}/co-curricular-activities`,

    add_parent_details: ({ studentId }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentId}/update-parent-details`,
    get_parent_detailsbyid: ({ studentRegNo }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentRegNo}/fetch-parent-details`,

    add_sibling_details: ({ studentId }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentId}/update-sibling-details`,
    sibling_details_byreno: ({ studentId }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentId}/fetch-sibling-details`,
    get_document_byid: ({ studentId, classId }: any) => `/admission/api/admission-service/pre-admissions/class-documents?studentRegId=${studentId}&classId=${classId}`,
    upload_reg_document: ({ studentId }: any) => `/admission/api/admission-service/pre-admissions/${studentId}/documents`,
    add_academic_results: ({ studentId }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentId}/update-last-year-results`,
    academic_results_byregno: ({ studentId }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentId}/fetch-last-year-details`,

    upload_photos: ({ studentId }: any) => `/admission/api/admission-service/pre-admissions/${studentId}/uploadImages`,
    cancel_admission: ({ studentRegNo }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentRegNo}/cancel-admission`,
    consolidated_admission: ({ studentRegNo }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentRegNo}/get-consolidated-preregistration-view`,
    request_registrationotp: ({ studentRegNo }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentRegNo}/generate-otp`,
    verify_registrationotp: ({ studentRegNo, otp }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentRegNo}/verify-otp?otp=${otp}`,
    submit_registrationform: ({ studentRegNo }: any) => `/admission//api/admission-service/pre-admissions/${studentRegNo}/final-submission`,
    get_registration_submission: ({ studentRegNo }: any) => `/admission//api/admission-service/pre-admissions/${studentRegNo}/final-submission`,

    communication_byregNo: ({ studentRegNo }: any) => `/admission/api/admission-service/pre-admissions/${studentRegNo}/fetch-communication-details`,
    addcommunication_byregNo: ({ studentRegNo }: any) => `/admission/api/admission-service/pre-admissions/registration/${studentRegNo}/update-communication-details`,

    get_siblings_registration: `/admission//api/admission-service/pre-admissions/fetch-siblings`,
    get_siblings_registration_update: `/admission/api/admission-service/pre-admissions/fetch-latest-siblings-data`,
    get_registration_lang: `/admission/api/admission-service/application-sale/languages`,
    get_preadmission_byregNo: `/admission/api/admission-service/pre-admissions/change-students`,
    send_reg_incomplete_form: ({instituteId,branchId,ids,isRegistrationScreen}:any) => `/admission/api/admission-service/application-sale/send-reminders?instituteId=${instituteId}&branchId=${branchId}&ids=${ids}&isRegistrationScreen=${isRegistrationScreen}`,
}

export const admissionWithdrawalUrl = {
    get_admission_withdrawal: `/fee/api/fee-service/admissionWithdrawl`,
    get_admission_withdrawal_byid: `/fee/api/fee-service/admissionWithdrawl/getById`,
    search_student_admissionwith: `/fee/api/fee-service/admissionWithdrawl/student-details`,
    create_admissionwith: `/fee/api/fee-service/admissionWithdrawl/save`,
    udpate_admissionwithdrawal: ({ admissionWithdrawalId }: any) => `/fee/api/fee-service/admissionWithdrawl/update?admissionWithdrawalId=${admissionWithdrawalId}`,
    delete_admissionwithdrawal: ({ admissionWithdrawalId }: any) => `/fee/api/fee-service/admissionWithdrawl/delete?admissionWithdrawalId=${admissionWithdrawalId}`,

    create_fee_admissionwithdrawal: ({ admissionWithdrawalId }: any) => `/fee/api/fee-service/admissionWithdrawl/approve/${admissionWithdrawalId}`,
    get_approved_admissionwithdrawal: `/fee/api/fee-service/admissionWithdrawl/approvals`,

    get_optional_subjects_list:`/admission/api/admission-service/optional-subjects`,
    get_optional_subject_item_by_id:({id}:any) => `/admission/api/admission-service/optional-subjects/${id}`,
    save_optional_subject_item:`/admission/api/admission-service/optional-subjects`,
    edit_optional_subject_item:({id}:any) => `/admission/api/admission-service/optional-subjects/${id}`,
    del_optional_subject_item:({id}:any) => `/admission/api/admission-service/optional-subjects/${id}`
}
export const assignLanguagesUrl = {

    assign_language_list: `/academic/api/academic-service/academicLanguages/all/students`,
    update_assign_languages : ({academicYearId}:any)=> `/academic/api/academic-service/academicLanguages/update/languages?academicYearId=${academicYearId}`,
    copy_assign_language : `/academic/api/academic-service/academicLanguages/copyStudents`,
    export_assign_language : `/academic/api/academic-service/academicLanguages/export`
}

export const notReportingStuUrl = {

    get_not_reporting_stu_list : `/academic/api/v1/not-reporting-student-details`,
    save_not_report_stu : `/academic/api/v1/not-reporting-student-details`,
    get_by_id_not_report_stu : ({id}:any)=> `/academic/api/v1/not-reporting-student-details/${id}`,
    edit_not_report_stu : ({id}:any)=> `/academic/api/v1/not-reporting-student-details/${id}`,
    delete_not_report_stu : ({id}:any)=> `/academic/api/v1/not-reporting-student-details/${id}`,
    export_not_report_stu : `/academic//api/v1/not-reporting-student-details/export`,

    //Id-Card
    get_id_card_list : `/academic/api/academic-service/idCards/all`,
    approve_stu_id_card : ({idCadrNo}:any)=> `/academic/api/academic-service/idCards/${idCadrNo}/status`,
    pay_stu_id_card : ({idCadrNo}:any)=> `/academic/api/academic-service/idCards/${idCadrNo}/pay/offline`,
    get_stu_id_card_log : ({idCadrNo}:any)=> `/academic/api/academic-service/id-cards-logs/${idCadrNo}`,
    send_id_card_notifaction : ({idCadrNo}:any)=> `/academic/api/academic-service/idCards/${idCadrNo}/email`,
    preview_issued_id_card : ({idCadrNo}:any)=> `/academic/api/academic-service/idCards/preview/${idCadrNo}`,
    get_student_details_id_card :  `/academic/api/academic-service/idCards/eligible-students`,
    id_card_collected_by_parent : ({idCadrNo, tcParentCollectedStatus }:any)=> `/academic/api/academic-service/id-cards-logs/update-parent-collected-status/${idCadrNo}/?tcParentCollectedStatus=${tcParentCollectedStatus}`,
    get_id_card_amount : `/fee/api/fee/fee-settings/all`,
    export_student_id_card_list: `/academic/api/academic-service/idCards/download-images/export`,
    download_student_id_card_zip: `/academic/api/academic-service/idCards/download-images`,
    request_reupload_id_card: `/academic/api/academic-service/idCards/re-upload/photo`,

    save_validate_student_status : `/academic/api/academic/student-status-validator`,
}
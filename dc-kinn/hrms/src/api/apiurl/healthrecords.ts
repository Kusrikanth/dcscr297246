export const healthRecordsUrl = {

    // Health Records
    
    get_health_records_list : `/academic/api/academic-service/health-records/aliments/all`,
    get_stu_health_details : `/academic/api/academic-service/health-records/aliments/student-details`,
    get_emp_health_details : `/academic/api/academic-service/health-records/aliments/employee-details`,
    get_stu_aliment_list : `/academic/api/academic-service/health-records/aliments`,
    save_health_records_list : `/academic/api/academic-service/health-records/aliments/save`,
    edit_health_records_list :({id} : any)=> `/academic/api/academic-service/health-records/aliments/${id}`,
    get_health_records_list_by_id :({id} : any)=> `/academic/api/academic-service/health-records/aliments/${id}`,
    export_health_records: `/academic/api/academic-service/health-records/aliments/export`,
    export_emp_health_records: `/academic/api/academic-service/health-records/aliments/employee-details/export`,
    // MI Rooms

    get_mi_room_list : `/academic/api/academic-service/healthrecords/mirooms`,
    get_mi_room_list_by_id : ({id} : any)=> `/academic/api/academic-service/healthrecords/mirooms/${id}`,
    edit_mi_room_list : ({id} : any)=> `/academic/api/academic-service/healthrecords/mirooms/${id}`,
    save_mi_room_list : `/academic/api/academic-service/healthrecords/mirooms`,
    delete_mi_room_list : ({id} : any)=> `/academic/api/academic-service/healthrecords/mirooms/${id}`,

    get_stu_health_issues : `/academic/api/academic-service/health-records/aliments/student-health-issues`,
    export_stu_health_issues : `/academic/api/academic-service/health-records/aliments/student-health-issues/export`,
    get_registration_health_issues : `/admission/api/admission-service/settings/admission-facility/medical-student-details`,

    //settings
    //comman-aliments
    get_comman_alingments_list : `/academic/api/academic-service/health-records/common-aliments/all`,
    save_comman_alingments_list : `/academic/api/academic-service/health-records/common-aliments`,

    //manage-aliments
    get_sub_alingments_list : `/academic/api/academic-service/health-records/aliments/all-search`,
    save_sub_alingments_list : `/academic/api/academic-service/health-records/aliments`,
    edit_sub_alingments_list : `/academic/api/academic-service/health-records/aliments`,
    delete_sub_alingments_list : ({id} : any)=> `/academic/api/academic-service/health-records/common-aliments/${id}`,
    save_alingments_list : `/academic/api/academic-service/health-records/common-aliments`,

    //medicens
    get_medicen_list : `/academic/api/v1/medicines/all`,
    get_medicen_list_by_id : ({medicineId} : any)=> `/academic/api/v1/medicines/${medicineId}`,
    edit_medicen_list : ({medicineId} : any)=> `/academic/api/v1/medicines/${medicineId}`,
    save_medicen_list : `/academic/api/v1/medicines`,
    delete_medicen_list : ({medicineId} : any)=> `/academic/api/v1/medicines/${medicineId}`,
}
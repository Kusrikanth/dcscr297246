
export const pvaReports = {
    //Settings

    //PVA Subjects
    get_pva_subjects: `/examination/api/examination-service/pva/subjects`,
    get_pva_grade_entry_subjects: `/examination/api/examination-service/pva/subjects/subjects-by-class`,
    save_pva_subjects: `/examination/api/examination-service/pva/subjects`,
    update_pva_subjects: ({ id }: any) => `/examination/api/examination-service/pva/subjects/${id}`,
    get_pva_subjects_by_id: ({ id }: any) => `/examination/api/examination-service/pva/subjects/${id}`,
    delete_pva_subjects: ({ id }: any) => `/examination/api/examination-service/pva/subjects/${id}`,

    //PVA Skill Attributes
    get_pva_skill_attributes: `/examination/api/examination-service/pva/skill-area`,
    save_update_pva_skill_attributes: ({ id }: any) => `/examination/api/examination-service/pva/${id}/skill-area`,
    get_pva_skill_attributes_by_id: ({ id }: any) => `/examination/api/examination-service/pva/${id}/skill-area`,
    delete_pva_skill_attributes: ({ id }: any) => `/examination/api/examination-service/pva/skill-area/${id}`,

    //PVA Grades
    get_pva_grades: `/examination/api/examination-service/pva/pva-grades`,
    save_pva_grades: `/examination/api/examination-service/pva/pva-grades`,
    update_pva_grades: ({ id }: any) => `/examination/api/examination-service/pva/pva-grades/${id}`,
    get_pva_grades_by_id: ({ id }: any) => `/examination/api/examination-service/pva/pva-grades/${id}`,
    delete_pva_grades: ({ id }: any) => `/examination/api/examination-service/pva/pva-grades/${id}`,

    //PVA Subject to Class Mapping
    get_pva_subjects_classes_mapping: `/examination/api/examination-service/pva/pva-classes`,
    save_pva_subjects_classes_mapping: `/examination/api/examination-service/pva/pva-classes`,
    update_pva_subjects_classes_mapping: ({ id }: any) => `/examination/api/examination-service/pva/pva-classes/${id}`,
    get_pva_subjects_classes_mapping_by_id: ({ id }: any) => `/examination/api/examination-service/pva/pva-classes/${id}`,
    delete_pva_subjects_classes_mapping: ({ id }: any) => `/examination/api/examination-service/pva/pva-classes/${id}`,

    //Management

    //Grade Entry
    get_pva_students_grade_entry_list: `/examination/api/examination-service/pva/skill-grade-entry`,
    save_pva_grade_entry: `/examination/api/examination-service/pva/skill-grade-entry`,

    // Green Report Card grade config
    get_green_report_card_grade_config_list: `/examination/api/v2/examination/green-report-card/grades`,
    get_green_report_card_grade_config_by_id: ({ id }: any) => `/examination/api/v2/examination/green-report-card/grades/${id}`,
    save_green_report_card_grade_config: `/examination/api/v2/examination/green-report-card/grades`,
    delete_green_report_card_grade_config: ({ id }: any) => `/examination/api/v2/examination/green-report-card/grades/${id}`,

    // Green Report Card Category
    get_green_report_card_category_list: `/examination/api/v2/examination/green-report-card/fetch`,
    get_green_report_card_category_by_id: ({ id }: any) => `/examination/api/v2/examination/green-report-card/${id}`,
    save_green_report_card_category_item: `/examination/api/v2/examination/green-report-card`,
    update_green_report_card_category_item: `/examination/api/v2/examination/green-report-card/update`,
    delete_green_report_card_category_item: ({ id }: any) => `/examination/api/v2/examination/green-report-card/${id}`,

    // Green Report card Management
    get_category_selection_list: `/examination/api/v2/examination/green-report-card/category/all`,
    save_category_selection: `/examination/api/v2/examination/green-report-card/category/save`,
    get_category_selection_by_id: ({ id }: any) => `/examination/api/v2/examination/green-report-card/category/${id}`,
    update_category_selection: ({ id }: any) => `/examination/api/v2/examination/green-report-card/category/update/${id}`,
    delete_category_selection: ({ id }: any) => `/examination/api/v2/examination/green-report-card/category/${id}`,

    // Grade Entry
    get_all_green_report_grade_entry_stnts_list_resp : "/examination/api/v2/examination/green-report-card/grade-entry",
    get_green_report_grade_entry_stnt_by_id_resp : ({id}:any) => `/examination/api/v2/examination/green-report-card/grade-entry/${id}`,
    save_green_report_grade_resp : "/examination/api/v2/examination/green-report-card/grade-entry",

    
    // --->>> DISCIPLE <<<---
    // Domains
    get_discipline_settings_domains : "/examination/api/examination/discipline/domains/all",
    get_discipline_settings_domain_item_by_id : ({id}:any) => `/examination/api/examination/discipline/domains/${id}`,
    save_discipline_settings_domain_item_by_id : "/examination/api/examination/discipline/domains",
    update_discipline_settings_domain_item_by_id : ({id}:any) => `/examination/api/examination/discipline/domains/${id}`,
    del_discipline_settings_domain_item_by_id : ({id}:any) => `/examination/api/examination/discipline/domains/${id}`,

    // Sub Domains
    get_sub_discipline_settings_domains : "/examination/api/examination/discipline/sub-domains/all",
    get_sub_discipline_settings_domain_item_by_id : ({id}:any) => `/examination/api/examination/discipline/sub-domains/${id}`,
    save_sub_discipline_settings_domain_item_by_id : "/examination/api/examination/discipline/sub-domains",
    update_sub_discipline_settings_domain_item_by_id : ({id}:any) => `/examination/api/examination/discipline/sub-domains/${id}`,
    del_sub_discipline_settings_domain_item_by_id : ({id}:any) => `/examination/api/examination/discipline/sub-domains/${id}`,

    // discipline grade config
    get_discipline_grade_config_list : "/examination/api/examination-service/discipline/grades",
    save_discipline_grade_config_list : `/examination/api/examination-service/discipline/grades`,
    del_discipline_grade_config_list : ({id}:any) =>  `/examination/api/examination-service/discipline/grades/${id}`,

}
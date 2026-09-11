export const dashboardUrl = {

    // Fee Dashboard 

    fee_dashboard_stats: `/fee/api/fee-service/dashboard/stats`,
    fee_dashboard_jodo_payment_mode_status_stats: `/fee/api/fee-service/dashboard/jodo-payment-mode-status/stats`,
    fee_dashboard_transaction_summary : `/fee/api/fee-service/dashboard/transaction-summary`,
    fee_dashboard_collection_stats : `/fee/api/fee-service/dashboard/fee/collection`,
    fee_revenue_dashboard : `/fee/api/fee-service/dashboard/fee-revenue`,
    fee_dashboard_concession_type : `/fee/api/fee-concession-report`,
    fee_dashboard_payment_mode : `/fee/api/fee-service/dashboard/payment-mode`,
    fee_dashboard_fee_collection : `/fee/api/fee-service/dashboard/fee-collection/terms`,
    fee_dashboard_due_summary_export : `/fee/api/fee-service/dashboard/branch/net-amount/percent/export`,
    fee_dashboard_net_paid_by_date_export : `/fee/api/fee-service/dashboard/branch/net-paid/date/export`,
    fee_dashboard_net_amt_export : `/fee/api/fee-service/dashboard/branch/net-amount/export`,

    // Transport Dashboard

    transport_dashboard_stats: `/transport/api/transport-service/transport-dashboard/stats`,
    transport_dashboard_vehicle_category : `/transport/api/transport-service/transport-dashboard/vehicle-category`,
    transport_route_occupancy_summary: `/transport/api/transport-service/transport-dashboard/route-occupancy-summary`,
    transport_slab_occupancy_summary: `/transport/api/transport-service/transport-dashboard/slab-occupancy-summary`,
    transport_license_renewal: `/transport/api/transport-service/transport-dashboard/license-renewal`,
    transport_insurance_renewal: `/transport/api/transport-service/transport-dashboard/insurance-renewal`,
    transport_vehicle_reg_renewal: `/transport/api/transport-service/transport-dashboard/vehicle-registration-renewal`,
    transport_permit_renewal: `/transport/api/transport-service/transport-dashboard/permit-renewal`,
    transport_pollution_renewal: `/transport/api/transport-service/transport-dashboard/pollution-renewal`,
    transport_fitness_renewal: `/transport/api/transport-service/transport-dashboard/fitness-renewal`,
    transport_opted: `/transport/api/transport-service/transport-dashboard/transport-opted`,
    export_transport_opted: `/transport/api/transport-service/transport-dashboard/transport-opted/export`,
    export_route_occupancy_summary: `/transport/api/transport-service/transport-dashboard/route-occupancy-summary/export`,
    export_slab_occupancy_summary: `/transport/api/transport-service/transport-dashboard/slab-occupancy-summary/export`,
    export_unpaid_reports:({ academicYearId, branchId, dueAmount }: any) => `/transport/api/transport-service/transport-dashboard/unpaid-report/export?academicYearId=${academicYearId}&branchId=${branchId}&dueAmount=${dueAmount}`,


    // Library Dashboard

    library_dashboard_data: `/library/api/v1/library-service/library-dashboard/data`,

    // Attendance Dashboard
    attendance_dashboard_data: `/attendance/api/attendance-service/dashboard/fetch`,
    export_most_absentees_data: `/attendance/api/attendance-service/dashboard/export/most-absentees`,
    section_analysis_data: `/attendance/api/attendance-service/dashboard/section`,

    // Super Admin Fee Dashboard

    net_paid_fee_by_branch : `/fee/api/fee-service/dashboard/institute/transaction-summary`,
    branch_wise_due_summary : `/fee/api/fee-service/dashboard/branch/due-summary`,
    get_unpaid_student_count : `/fee/api/fee-service/dashboard/unpaid/students`,
    branch_wise_net_paid_by_date : `/fee/api/fee-service/dashboard/branch/net-paid/date`,
    branch_wise_net_amount : `/fee/api/fee-service/dashboard/branch/net-amount`,
    class_section_wise_net_amount : `/fee/api/fee-service/dashboard/class-section-wise/net-amount`,
    export_class_section_wise_net_amount : `/fee/api/fee-service/dashboard/class-section-wise/net-amount/export`,

    // Super Admin Transport Dashboard

    get_vehicle_type_list_dashboard : `/transport/api/transport-service/transport-dashboard/branch/vehicle-types`,
    export_vehicle_type_list_dashboard : `/transport/api/transport-service/transport-dashboard/branch/vehicle-types/export`,
    get_transport_fee_term_wise : `/transport/api/transport-service/transport-dashboard/branch/transport-term-wise-summary`,
    export_transport_fee_term_wise : `/transport/api/transport-service/transport-dashboard/branch/transport-term-wise-summary/export`,
    get_active_vehicles_list : `/transport/api/transport-service/transport-dashboard/branch/vehicles-summary`,
    get_stu_avail_list : `/transport/api/transport-service/transport-dashboard/branch/transport-terms`,
    get_transport_opted_list : `/transport/api/transport-service/transport-dashboard/branch/transport-opted`,
    get_pending_req_list : `/transport/api/transport-service/transport-dashboard/branch/transport-requests`,

    // School Strength

    get_school_strength_stats : `/academic/api/v1/school-strength/stats`,
    get_school_strength_stats_count : `/academic/api/v1/school-strength/branch/stats`,
    get_class_wise_strength : `/academic/api/v1/school-strength/class-wise-strength`,
    get_class_by_branch_status : `/academic/api/v1/school-strength/class-branch-status`,
    export_class_by_branch_status : `/academic/api/v1/school-strength/class-branch-status/export`,
    export_class_wise_strength : `/academic/api/v1/school-strength/class-wise-strength/export`,

    // ERP Usage

    get_platform_stats_login_count : `/auth-service/api/auth/erp-usage-dashboard/plat-form-stats-login-counts`,
    get_branch_wise_usage_for_super_admin : `/auth-service/api/auth/erp-usage-dashboard/branch-wise-usage`,
    get_erp_usage_stats:`/auth-service/api/auth/erp-usage-dashboard/stats`,
    get_erp_usage_stats_hyperlink:`/auth-service/api/auth/erp-usage-dashboard/branch/stats`,

    // examination dashboard
    get_examination_dashboard_data: `/examination/api/v2/examination/examination-dashboard/get`,
    get_branch_wise_marks_range : `/examination/api/v2/examination/examination-dashboard/branch-wise-analysis`,
    get_class_by_branch_status_students : `/academic/api/v1/school-strength/students`,
    get_examination_list_of_dashboard : `/examination/api/v2/examination/cbse-examination/get-institute-wise-exams`,
    get_subject_grade_wise_analysis : `/examination/api/v2/examination/examination-dashboard/subject-grade-wise-analysis`,
    get_class_grade_wise_analysis : `/examination/api/v2/examination/examination-dashboard/class-grade-wise-analysis`,
    get_class_analysis_report : `/examination/api/v2/examination/examination-class-analysis-report/download/generate-base-64`,

    // Admission Dashboard
    get_branch_wise_adm_analysis : `/admission/api/admission-service/admission-dashboard/branch-wise-admission-analysis`,
    export_branch_wise_adm_analysis_new : `/admission/api/admission-service/admission-dashboard/branch-wise-admission-analysis/admission-targets/export`,
    export_branch_wise_adm_analysis : `/admission/api/admission-service/admission-dashboard/branch-wise-admission-analysis/applications-to-admissions/export`,
    get_admissions_year_wise : `/admission/api/admission-service/admission-dashboard/admissions-year-wise`,
    export_admissions_year_wise : `/admission/api/admission-service/admission-dashboard/academic-year-wise/export`,
    get_class_wise_login_count :`/auth-service/api/auth/erp-usage-dashboard/class-wise-logins`,
    export_class_wise_login_count :`/auth-service/api/auth/erp-usage-dashboard/export-class-wise-login`,
    get_class_wise_adm_analysis : `/admission/api/admission-service/admission-dashboard/class-wise-analysis`,
    export_class_wise_adm_analysis : `/admission/api/admission-service/admission-dashboard/class-wise-analysis/export`,
    get_applications_to_admissions : `/admission/api/admission-service/admission-dashboard/applications-to-admissions`,
    export_applications_to_admissions : `/admission/api/admission-service/admission-dashboard/applications-to-admissions/export`,
    get_date_wise_login_count : `/auth-service/api/auth/erp-usage-dashboard/date-wise-logins`,
    get_app_to_adm_summary : `/admission/api/admission-service/admission-dashboard/application-to-admission-summary`,
    export_app_to_adm_summary : `/admission/api/admission-service/admission-dashboard/application-to-admission-summary/export`,


    //helpdesk dashboard
    get_helpdesk_dashboard_stats: `/concern/api/complaint-service/dashboard/stats`,
    get_request_type : `/concern/api/complaint-service/dashboard/request-type`,
    get_department : `/concern/api/complaint-service/dashboard/departments`,
    get_month_wise_tickets : `/concern/api/complaint-service/dashboard/month-wise`,
    get_top_ten_tickets : `/concern/api/complaint-service/dashboard/top10-departments`,
    get_top_ten_departments_model : `/concern/api/complaint-service/dashboard/top10-departments/details`,
    get_department_analysis : `/concern/api/complaint-service/dashboard/department-analysis`,
    export_open_tickets_details : `/concern/api/complaint-service/dashboard//open-ticket-details/export`,
}
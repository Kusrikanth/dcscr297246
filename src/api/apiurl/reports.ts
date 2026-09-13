export const reportsUrl = {
    example_url: `/admission/api/admission-service/settings/admission-availability/all`,
    mapping_keys: `/admission/api/admission-service/consolidated-report/get-consolidated-report-key-values`,
    consolidated_reports: `/admission/api/admission-service/consolidated-report/get-admission-consolidated-report`,


    consolidater_report_mappingkeys_new: `/admission/api/admission-service/consolidated-report/get-new-consolidated-report-key-value`,
    consolidated_report_new: `/admission/api/admission-service/consolidated-report/get-new-admission-consolidated-report`,
    consolidated_newreport_admission: `/admission/api/admission-service/consolidated-report/get-consolidated-report-data-new`,
    donwload_admission_consolidated_report: `/admission/api/admission-service/consolidated-report/generate-excel-sheet-admission-consolidated-report`,


    consolidated_report_oldmappingkeys: `/admission/api/admission-service/consolidated-report/get-old-consolidated-report-key-value`,
    consolidated_report_old: `/admission/api/admission-service/consolidated-report/get-old-admission-consolidated-report`,
    consolidated_oldreport_admission: `/admission/api/admission-service/consolidated-report/get-old-consolidated-report-data`,
    donwload_consolidated_oldreport: ({ branchId, curriculumId,
        academicYearId, fromDate, toDate, searchString, status, pageNo, pageSize
    }: any) => `/admission/api/admission-service/consolidated-report/generate-old-data-excel-sheet?branchId=${branchId}&curriculumId=${curriculumId}&academicYearId=${academicYearId}&fromDate=${fromDate}&toDate=${toDate}&searchString=${searchString}&status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`,

    donwload_consolidated_report_old: `/admission/api/admission-service/consolidated-report/generate-excel-sheet-admission-consolidated-report`,


    admission_process_reports: `/admission/api/admission-service/consolidated-report/get-consolidated-report-data`,
    download_process_reports: ({ branchId, curriculumId,
        academicYearId, fromDate, toDate, searchString, status, pageNo, pageSize
    }: any) => `/admission/api/admission-service/consolidated-report/generate-data-excel-sheet?branchId=${branchId}&curriculumId=${curriculumId}&academicYearId=${academicYearId}&fromDate=${fromDate}&toDate=${toDate}&searchString=${searchString}&status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`,
    download_process_newreports: ({ branchId, curriculumId,
        academicYearId, fromDate, toDate, searchString, status, pageNo, pageSize
    }: any) => `/admission/api/admission-service/consolidated-report/generate-new-data-excel-sheet?branchId=${branchId}&curriculumId=${curriculumId}&academicYearId=${academicYearId}&fromDate=${fromDate}&toDate=${toDate}&searchString=${searchString}&status=${status}&pageNo=${pageNo}&pageSize=${pageSize}`,

    get_fee_sum_amount: `/fee/api/fee-service/v1/reports/fee-report/payment-modes`,
    get_fee_type_wise_sum: `/fee/api/fee-service/v1/reports/fee-report/fee-structure`,

    fee_status_report: `/fee/api/fee-status-report`,
    fee_received_report: `/fee/api/fee-status-report/all`,
    get_feename_byfeetype: `/fee/api/studentFeeLedgers/fee-names`,

    get_feeterm_bytype: `/fee/api/fee-service/v1/reports/fee-report/fetch-feeTerms`,
    get_feename_bytype: `/fee/api/fee-service/v1/reports/fee-report/fetch-feeNames`,
    get_feecollection: `/fee/api/fee-service/v1/reports/fee-report/fee-collection-report`,
    export_feecollection: `/fee/api/fee-service/v1/reports/fee-report/export-fee-collection-report`,
    // fee calling report (fee due follow-up remark outcomes)
    get_fee_calling_report: `/fee/api/fee-remarks/calling-report`,
    get_fee_calling_report_summary: `/fee/api/fee-remarks/calling-report/summary`,
    export_fee_calling_report: `/fee/api/fee-remarks/calling-report/export`,
    // class-wise outstanding summary (student-wise unpaid report rolled up by class and academic year)
    get_class_wise_fee_summary: `/fee/api/fee-service/v1/reports/fee-report/class-wise-outstanding-summary`,
    export_class_wise_fee_summary: `/fee/api/fee-service/v1/reports/fee-report/class-wise-outstanding-summary/export`,
    get_class_wise_fee_summary_students: `/fee/api/fee-service/v1/reports/fee-report/class-wise-outstanding-summary/students`,

    get_unpaid_list: `/admission/api/admission-service/unpaid-admissions/get-report`,
    export_unpaid_list: `/admission/api/admission-service/unpaid-admissions/export`,
    send_sms_email_unpaid_list: `/admission/api/admission-service/unpaid-admissions`,
    fill_feedback_form: `/admission/api/admission-service/unpaid-admissions/feedback-form`,
    get_feedback_by_id: ({ id }: any) => `/admission/api/admission-service/unpaid-admissions/feedback/${id}`,
    // admission_tracker_report: `/admission/api/admission-service/admission-tracker-report`,
    admission_tracker_report: `/admission/api/admission-service/admission-tracker-report/new-report`,
    admission_tracker_report_export: `/admission/api/admission-service/admission-tracker-report/export`,

    full_employee_concession: ({ id, branchId }: any) => `/admission/api/admission-service/interview-result/create-employee-concession/${id}?branchId=${branchId}`,

    get_cbse_verify_list: `/academic/api/academic-service/cbse/all`,
    download_cbse_verify_list: `/academic/api/academic-service/cbse/download-all-pdf`,
    export_cbse_verification: `/academic/api/academic-service/cbse/generate-export`,
}
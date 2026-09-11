
export const masterDataUrl = {
  get_branch_types: `/academic/api/v1/master/branch-types`,
  get_master_academic_year: `/settings-service/api/v1/master/master-academicYear`,
  get_master_academic_terms: `/settings-service/api/v1/master/master-terms`,
  get_master_unassigned_academic_terms: `/academic/api/v1/term/term-types`,
  get_master_term_types: `/academic/api/v1/term/master-termTypes`,
  get_master_modules: `/settings-service/api/v1/master/modules`,
  get_master_inst_groups: `/settings-service/api/v1/institute-groups`,
  get_master_user_role: `/settings-service/api/v1/master/master-roles`,
  get_master_inst_forms: `/academic/api/v1/branchForm/master-form-types`,
  get_master_subjets: `/settings-service/api/v1/master/subject-type`,
  academic_curriculum: `/academic-service/academics/v1`,
  get_master_curriculum: `/academic/api/v1/master/curriculum-list`,
  get_master_classes: `/academic/api/v1/master/master-classes`,
  get_master_class_stream_group: `/academic/api/v1/settings/class-groups`,


  get_global_records: ({ categoryName }: any) =>
    `/academic/api/v1/master/global-records`,
  get_global_records_by_search_string: `/academic/api/v1/master/global-records-with-search-filter`,
  get_master_income: `/academic/api/v1/master/income`,
  get_sub_caste: `/academic/api/sub-caste`,

  get_countries: `/academic/api/v1/master/country`,
  get_country_state: ({ countryId }: any) => `/academic/api/v1/master/state?countryId=${countryId}`,
  get_stateby_countryname: ({ countryName }: any) => `/academic/api/v1/master/state?countryName=${countryName}`,

  get_state_city: ({ stateId }: any) => `/academic/api/v1/master/city?stateId=${stateId}`,
  get_cityby_statename: ({ stateName }: any) => `/academic/api/v1/master/city?stateName=${stateName}`,
  
  get_state_district: `/admission/api/admission-service/application-sale/districts`,

  get_master_trust: `/academic/api/v1/master/trust`,

  get_numbering_series_data: `/academic/api/v1/branch/?pageNo=0&pageSize=20&sortBy=lastModifiedAt&status=&orderBy=desc&instituteId=`,
  get_branch_data: `/academic/api/v1/branch/?pageNo=0&pageSize=20&sortBy=lastModifiedAt&status=&orderBy=desc&instituteId=`,
  get_numbering_series_list_by_branchId: ({ branchId }: any) =>
    `/academic/api/v1/settings/numberingSeries?branchId=${branchId}`,

  get_academic_language_data: `/academic/api/v1/settings/languages`,
  add_academic_language: ({ intituteId }: any) =>
    `/academic/api/v1/settings/languages?instituteId=${intituteId}`,
  update_academic_language: ({ intituteId, languageId }: any) =>
    `/academic/api/v1/settings/languages/${languageId}?instituteId=${intituteId}`,
  remove_academic_language: ({ instituteId, languageId }: any) =>
    `/academic/api/v1/settings/languages/${languageId}?instituteId=${instituteId}`,


  get_master_feetypes: `/academic/api/fee-master/v1/master-fee-types`,

  get_master_banks: `/academic/api/v1/bank/master`,
  get_bank_details: `/academic/api/v1/bank/fetch-bank-details`,
  get_employee_categories: `/academic/api/v1/master/employee-category`,
  get_employee_status: `/academic/api/v1/employees/status-list`,
  get_employee_specialization: `/academic/api/v1/master/employee-specialization`,
  get_hod_employee: `/academic/api/v1/master/employee-hod`,
  get_reporting_head: `/academic/api/v1/master/employee-reportingHead`,
  get_hrm_department: `/academic/api/v1/master/hrm-department`,
  get_house_details: `/academic/api/v1/master/house-details`,

  validate_export_password: `/notification/exports/validate`,
  export_remarks: `/notification/exports/logActivity`,

  get_payment_gateways_list: `/fee/api/fee-service/pgs`,
  get_payment_gateways_branches_list:`/fee/api/fee-service/payment-gateway`,
  save_payment_gateways:`/fee/api/fee-service/payment-gateway`
};

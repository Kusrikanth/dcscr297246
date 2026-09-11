
export const institute = {
  create_inst: `/settings-service/api/v1/institutes`,
  get_institute_list: `/academic/api/v1/institutes`,
  get_inst_details: ({ instituteId }: any) => `/academic/api/v1/institutes/${instituteId}`,
  update_inst_details: `/academic/api/v1/institutes`,
  apprv_reject_inst_branch: `/settings-service/api/v1/institutes/approve-or-reject`,
  delete_inst_by_id: ({ instituteId }: any) => `/settings-service/api/v1/institutes/${instituteId}`,
  upload_inst_logo: ({ instituteId, isTemporaryFile }: any) => `/settings-service/api/v1/institutes/${instituteId}/upload/logo?isTemporaryFile=${isTemporaryFile}`,

  get_inst_departments: `/academic/api/v1/institute-departments/department`,
  add_inst_departments: ({ instituteId }: any) => `/academic/api/v1/institute-departments/department?instituteId=${instituteId}&isFeeDepartment=false`,
  update_inst_department: ({ departmentId, instituteId }: any) => `/academic/api/v1/institute-departments/department/${departmentId}?instituteId=${instituteId}&isFeeDepartment=false`,
  delete_inst_department: ({ departmentId }: any) => `/academic/api/v1/institute-departments/department/${departmentId}`,
  get_inst_master_fields: `/settings-service/api/v1/master/category-values?status=value`,


  // get_inst_role_type: `/academic/api/v1/roles/institute-roles`,
  get_inst_role_type: ({ roleType }: any) => `/auth-service/api/auth/role/${roleType}`,
  get_inst_role_type_v2: `/auth-service/v2/roles/type`,
  add_inst_role_type_v2: `/auth-service/v2/roles/type`,
  update_inst_role_type_v2: `/auth-service/v2/roles/type`,
  delete_inst_role_type_v2: ({ instituteId, roleId }: any) => `/auth-service/v2/roles/${instituteId}/role/${roleId}`,
  get_inst_role_v2: `/auth-service/v2/roles`,
  add_inst_role_v2: `/auth-service/v2/roles`,
  update_inst_role_v2: `/auth-service/v2/roles`,
  delete_inst_role_v2: `/auth-service/v2/roles`,
  add_inst_role_type: `/auth-service/api/auth/role/createRoles`,
  update_inst_role_type: ({ roleType, roleId, roleName }: any) => `/auth-service/api/auth/role/${roleType}/updateRoleName/${roleId}?roleName=${roleName}`,
  delete_inst_role_type: ({ roleType, roleId }: any) => `/auth-service/api/auth/role/${roleType}/${roleId}`,
  // add_inst_role_type: ({ instituteId }: any) => `/academic/api/v1/roles/institute-roles?instituteId=${instituteId}`,
  // update_inst_role_type: ({ roleId, instituteId }: any) => `/academic/api/v1/roles/institute-roles/${roleId}?instituteId=${instituteId}`,
  // delete_inst_role: ({ roleId }: any) => `/academic/api/v1/roles/institute-roles/${roleId}`,

  //institute-subjects
  save_inst_subjects: `/academic/api/v1/institute-subject`,
  update_inst_subjects: `/academic/api/v1/institute-subject`,
  get_inst_subjects_by_id: ({ subjectId }: any) => `/academic/api/v1/institute-subject/${subjectId}`,

  // get_assigned_forms: ({ instituteId }: any) => `/settings-service/v1/branchForm/fetch-branch-forms/${instituteId}`,
  // assign_form_to_branch: ({ branchId }: any) => `/settings-service/v1/branchForm/create?branchId=${branchId}`,
  // update_form_to_branch: `/settings-service/v1/branchForm/update`,
  // delete_form_to_branch: ({ formId }: any) => `/settings-service/v1/branchForm/${formId}`,

  get_assigned_forms: `/academic/api/v1/branchForm/fetch`,
  assign_form_to_branch: `/academic/api/v1/branchForm/create`,
  update_form_to_branch: `/academic/api/v1/branchForm/update`,
  delete_form_to_branch: ({ formId }: any) => `/academic/api/v1/branchForm/delete/${formId}`,


  get_inst_global_records: `/academic/api/v1/master/global-records-with-search-filter`,
  get_inst_global_records_by_search_string: ({ category, search_string }: any) =>
    `/academic/api/v1/master/global-records-with-search-filter?categoryName=${category}&searchString=${search_string}&pageNo=0&pageSize=10&sortBy=createdAt&orderBy=desc `,

  get_inst_document_type: `/academic/api/v1/students/document-types`
}

export const branchInstUrl = {
  get_inst_branches: ({ intituteId }: any) => `/academic/api/v1/branch`,
  add_inst_branch: `/academic/api/v1/branch`,
  get_branch_byid: ({ branchId }: any) => `/academic/api/v1/branch/branch/${branchId}`,
  delete_branch: ({ branchId }: any) => `/academic/api/v1/branch/${branchId}`,
  update_main_branch: ({ instituteId, branchId }: any) => `/academic/api/v1/branch/${instituteId}/${branchId}`,
  add_branch_admin: `/auth-service/api/auth/user/BRANCH`,
  approve_brnch: `/settings-service/api/v1/branch/approve-or-reject`
}

export const branchModuleUrl = {
  get_branch_modules: ({ instituteId }: any) => `/settings-service/api/v1/branchmodule/branches-modules/${instituteId}`,
  update_branch_module: `/settings-service/api/v1/branchmodule`
}

// export const academicYearUrl = {
//   get_inst_academic_year: `/academic-service/academic-year/v1/institute-academic-years`,
//   add_inst_academic_year: ({ instituteId }: any) => `/academic-service/academic-year/v1/institute-academic-year?instituteId=${instituteId}`,
//   update_inst_academic_year: ({ academicYearId }: any) => `/academic-service/academic-year/v1/institute-academic-year/${academicYearId}`,
//   del_inst_academic_year: ({ academicYearId }: any) => `/academic-service/academic-year/v1/institute-academic-year/${academicYearId}`
// }
export const academicYearUrl = {
  get_inst_academic_year: `/academic/api/academic-year/v1/institute-master-academic-years`,
  get_inst_academic_years_date: `/academic/api/academic-year/v1/institute-academic-years`,
  add_inst_academic_year: ({ instituteId }: any) => `/academic/api/academic-year/v1/institute-academic-year?instituteId=${instituteId}`,
  update_inst_academic_year: `/academic/api/academic-year/v1/institute-academic-year`,
  del_inst_academic_year: ({ instituteAcademicYearId }: any) =>
    `/academic/api/academic-year/v1/institute-academic-year/${instituteAcademicYearId}`,
};
export const academicTermUrl = {
  get_inst_term: `/academic/api/v1/term/institute-terms`,
  get_unassigned_inst_term: `/academic/api/v1/term/unassigned-institute-terms`,
  add_inst_term: ({ instituteId, masterTermTypeId }: any) => `/academic/api/v1/term/institute-terms?instituteId=${instituteId}&masterTermTypeId=${masterTermTypeId}`,
  get_unassigned_term_types: ({ instituteId }: any) => `/academic/api/v1/term/term-types?instituteId=${instituteId}`,
  add_inst_academic_term: ({ instituteId, academicYearId, masterTermTypeId }: any) => `/academic/api/v1/term/institute-academic-terms?instituteId=${instituteId}&academicYearId=${academicYearId}&masterTermTypeId=${masterTermTypeId}`,
  del_inst_term: ({ termId }: any) => `/academic/api/v1/term/institute-term/${termId}`,
  get_inst_academic_term: `/academic/api/v1/term/institute-academic-terms`,
  get_inst_add_academic_term: `/academic/api/v1/term/unassigned-institute-terms`,
  update_inst_academic_term: () => `/academic/api/v1/term/institute-academic-term`,
  update_inst_term: () => `/academic/api/v1/term/institute-term`,
  del_inst_academic_term: ({ academicTermId }: any) => `/academic/api/v1/term/institute-academic-term/${academicTermId}`,

  get_inst_curriculum: `/academic/api/curriculum/v1/institute-curriculum`,
  add_inst_curriculum: ({ instituteId }: any) => `/academic/api/curriculum/v1/institute-curriculum?instituteId=${instituteId}`,
  update_inst_curriculum: `/academic/api/curriculum/v1/institute-curriculum`,
  delete_inst_curriculum: ({ curriculumId }: any) => `/academic/api/curriculum/v1/institute-curriculum/${curriculumId}`,

  get_inst_class: `/academic/api/class/v1/institute-class`,
  get_inst_class_for_branch: `/academic/api/class/v1/institute-class-for-branch`,
  get_class_inst: `/academic/api/v1/branchClass/class-sequence-group`,
  add_inst_class: ({ instituteId }: any) => `/academic/api/class/v1/institute-class?instituteId=${instituteId}`,
  update_inst_class: `/academic/api/class/v1/institute-class`,
  delete_inst_class: ({ classId }: any) => `/academic/api/class/v1/institute-class/${classId}`,


  get_class_structure: `/academic/api/curriculum-class/v1/institute-curriculum-class/classes`,
  add_class_structure: ({ instituteId }: any) => `/academic/api/curriculum-class/v1/institute-curriculum-class/assign-classes?instituteId=${instituteId}`,
  delete_class_structure: ({ curriculumId, classId }: any) => `/academic/api/curriculum-class/v1/institute-curriculum-class/delete?instituteCurriculumId=${curriculumId}&instituteClassId=${classId}`,
  get_modules_list: ({ branchId }: any) => `/academic/api/v1/branchmodule/${branchId}`,
  update_module: () => `/academic/api/v1/branchmodule`,
  get_unassigned_classes: "/academic/api/v1/branchClass/unassigned-class",
}

export const feeSettinsUrl = {

  get_inst_fee_dept: `/academic/api/v1/institute-departments/department`,
  add_inst_fee_dept: ({ instituteId }: any) => `/academic/api/v1/institute-departments/department?instituteId=${instituteId}&isFeeDepartment=true`,
  update_inst_fee_dept: ({ departmentId, instituteId }: any) => `/academic/api/v1/institute-departments/department/${departmentId}?instituteId=${instituteId}&isFeeDepartment=true`,
  del_inst_fee_dept: ({ departmentId }: any) => `/academic/api/v1/institute-departments/department/${departmentId}`,


  get_inst_fee_names: `/academic/api/fee-master/v1/fee-names`,
  add_inst_fee_names: ({ instituteId }: any) => `/academic/api/fee-master/v1/fee-name?instituteId=${instituteId}`,
  update_inst_fee_name: `/academic/api/fee-master/v1/fee-name`,
  delete_inst_fee_name: ({ feeNameId }: any) => `/academic/api/fee-master/v1/fee-name/${feeNameId}`,

  get_concession_dept: `/academic/api/fee-master/v1/fee-departments-for-employee-concession`,
  get_inst_employee_concession: () => `/academic/api/fee-master/v1/employee-concession`,
  get_inst_fee_name_by_dept: ({ departments }: any) => {
    let str = ""
    departments.map((id: number) => {
      str = str + `&instituteDepartments=${id}`
    })
    return `/academic/api/fee-master/v1/fee-names-by-department?${str.slice(1)}`
  },

  del_inst_employee_concession_dept: ({ employeeId }: any) => `/academic/api/fee-master/v1/employee-concession/${employeeId}`,
  add_inst_employee_concession_dept: ({ instituteId }: any) => `/academic/api/fee-master/v1/employee-concession?instituteId=${instituteId}`,
  update_inst_employee_concession_dept: () => `/academic/api/fee-master/v1/employee-concession`
}

export const admissionSetting = {
  get_admission_availability: `/admission/api/admission-service/settings/admission-availability/all`,
  get_proposed_admission: `/admission/api/admission-service/settings/admission-availability/all`,
  edit_proposed_admission: ({ id, count }: any) => `/admission/api/admission-service/settings/admission-availability/proposedAdmissionCount?id=${id}&count=${count}`,
  save_admission_availability: `/admission/api/admission-service/settings/admission-availability`
}


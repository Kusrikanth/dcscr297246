import { bonafideCerificateList } from "../../store/academic/classroomManagment/classroommanagmentactions";

export const academicUrl = {
  // get_inst_details: ({ instituteId }: any) => `/settings-service/api/v1/institutes/${instituteId}`,
  get_branch_curriculum_list: ({ branchId }: any) =>
    `/settings-service/api/v1/settings/branch-curriculums?branchId=${branchId}`,
  get_academic_class_list: ({ academicId }: any) =>
    `/academic-service/academic-class/v1/classes?academicId=${academicId}`,
  get_stream_class_list: `/academic/api/v1/branch-class-student-stream/fetch-stream-classes`,
  get_campus_transfer_request_list: '/academic-service/section/v1/campus-transfer',
  get_section_list: ({ pageNo, classId }: any) =>
    `/academic/api/class-section/v1/fetch-academic-sections`,
  delete_section_list:({sectionId, academicYearId}: any)=>  `/academic/api/class-section/v1?sectionId=${sectionId}&academicYearId=${academicYearId}`,
  get_section_list_with_search: ({ pageNo, classId, searchString }: any) =>
    `/academic-service/section/v1/class/${classId}?searchString=${searchString}&pageNo=0&pageSize=10&sortBy=createdAt&orderBy=desc`,

  get_section_details_by_id: ({ id }: any) =>
    `/academic/api/class-section/v1/get-section-details/${id}`,

  update_classroom: `/academic/api/class-section/v1/assign-room-to-section`,
  update_classroom_teacher: ({ branchId }: { branchId: string }) =>
    `/academic/api/class-section/v1/assign-teacher-to-section`,
  assign_student_to_section: ({ academicClassSectionId }: any) => `/academic/api/class-section/v1/assign-students-to-section?academicClassSectionId=${academicClassSectionId}`,
  get_classroom_list: ({ branchId }: { branchId: string }) =>
    `/academic-service/section/v1/rooms/master?branchId=${branchId}&status=ALLOCATED`,
  get_student_list_by_section: ({ section_id }: { section_id: string }) => {
    return `/academic/api/class-section/v1/fetch-section-students`;
  },

  get_teacher_list: `/directory-service/api/v1/employees/filter?department=6271ef10-56aa-449b-8a92-d35ff7f9aad5&status=false&pageNo=0&pageSize=10&orderBy&sortBy`,

  get_unassigned_student_list: `/academic/api/class-section/v1/fetch-section-unassigned-students`,

  get_student_list: `/academic-service/section/v1/rooms/master?searchString=se&branchId=54a42c4d-47aa-40b7-bd6b-284702aaebb8&status=UNALLOCATED`,

  get_generate_roll_no: `/academic/api/v1/student-roll-no`,

  get_generate_roll_no_list: `/academic/api/v1/student-roll-no/generate-number`,

  update_generate_roll_no_list: ({ id, rollNo }: any) => `/academic/api/v1/student-roll-no/${id}?rollNo=${rollNo}`,

  get_generate_id_status: `/academic/api/v1/student-roll-no/is-rollNo-generated`,

  assign_student_roll_no: `/academic/api/v1/student-roll-no`,

  get_higher_class_student_list: `/academic/api/v1/student-Higher-class-eligibility`,

  export_higher_class_student_list: `/academic/api/v1/student-Higher-class-eligibility/download-export`,

  export_detention_promotion_list: `/academic/api/promotion-detention/download-export/promotion-detention`,

  revert_promotion: `/academic/api/v1/student-Higher-class-eligibility/revertPromotion`,

  delete_student: ({ studentId, academicYearId }: any) => `/academic/api/v1/student-Higher-class-eligibility/deleteStudent?studentId=${studentId}&academicYearId=${academicYearId}`,

  get_non_eligible_higher_class_student_list: `/academic/api/v1/student-Higher-class-eligibility/non-eligible`,

  assign_student_for_higher_class: `/academic/api/v1/student-Higher-class-eligibility`,

  get_stream_change_request_list: `/academic/api/change-request/v1/stream-change-request-list`,

  get_stream_change_student_list: `/academic/api/change-request/v1/fetch-students-for-stream-change`,

  raise_stream_change_request: "/academic/api/change-request/v1/stream-change-request",

  approve_reject_stream_change_req: "/academic/api/change-request/v1/certify-stream-change-request",

  get_change_curriculum_req: "/academic/api/change-request/v1/curriculum-change-request-list",

  get_classes_for_student_stream_change: "/academic/api/change-request/v1/fetch-classes-for-stream-change",

  get_curriculum_student_list_res: "/academic/api/change-request/v1/fetch-students-for-curriculum-change",

  raise_change_curriculum_req: "/academic/api/change-request/v1/curriculum-change-request",

  approve_reject_change_curriculum_req: "/academic/api/change-request/v1/certify-curriculum-change-request",

  promoted_student_list: "/academic/api/promotedStudents",

  export_promoted_student_list: "/academic/api/download-export",

  higher_class_student_for_promotion: "/academic/api/v1/student-Higher-class-eligibility/for-promotion",

  promote_higher_class_student: "/academic/api/promote-students",

  section_subject_details: "/academic/api/class-section/v1/fetch-section-subjects",

  promoted_class_list: "/academic/api/nextClass",

  promotion_detention_students: "/academic/api/promotion-detention/fetchStudents/Promotion-Detention",

  ledger_of_detention_promtion: ({ academicYearId, classId, studentId }: any) => `/fee/api/studentFeeLedgers/promotion-detention/ledgers?academicYearId=${academicYearId}&classId=${classId}&studentId=${studentId}`,

  not_promotion_detention_students: "/academic/api/promotion-detention/fetchStudents/notInPromotion-Detention",

  promoted_or_detained_class_list: "/academic/api/promotion-detention/fetchClasses",

  promote_or_detaine_student: "/academic/api/promotion-detention",

  approve_reject_promotion_detention_req: "/academic/api/promotion-detention/approveOrReject",

  tc_request_list: "/academic/api/academic-service/transfer-certificate",
  tc_request_bydept: "/academic/api/academic-service/transfer-certificate/all-by-deptName",
  export_tc_req_list: "/academic/api/academic-service/transfer-certificate/approval-list/export",
  approve_tc_request: ({ tcReqId }: any) => `/academic/api/academic-service/transfer-certificate/${tcReqId}/updatestatus`,
  student_ledger_tc: ({ studentId }: any) => `fee/api/studentFeeLedgers/student/all-ledgers/${studentId}`,

  tc_request_by_id: ({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/${tcRequestId}`,
  tc_request_notification: ({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/send-tc-notification/${tcRequestId}`,
  department_tc_approval: ({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/department-approval?tcRequestId=${tcRequestId}`,

  tc_consolidated_view:({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/preview-tc-consolidated-view/${tcRequestId}`,
  
  export_tc_certificate_list: `/academic/api/academic-service/transfer-certificate/export`,
  student_list_for_tc_req: "/academic/api/academic-service/transfer-certificate/students",
  student_details_fortc: ({ studentId }: any) => `/academic/api/v1/students/student/${studentId}/classes`,


  student_list_for_bonafide_certificate: "/academic/api/academic-service/bonafide/students",

  add_tc_req: "/academic/api/academic-service/transfer-certificate/initiate",

  edit_tc_req: ({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/update/${tcRequestId}`,

  add_bonafide_certificate_req: "/academic/api/academic-service/bonafide/save-request",

  // Health Form 

  save_health_form: "/academic/api/academic-service/health-form",
  get_health_form_list: "/academic/api/academic-service/health-form/list",
  update_helath_form_status: "/academic/api/academic-service/health-form/update-status",
  get_stu_health_form: "/academic/api/academic-service/health-form/get-student-details",
  download_static_health_form: "/academic/api/academic-service/health-form/schoolform/download",

  get_tc_req_log: ({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/log-activity/${tcRequestId}`,

  get_change_campus_student: `/academic/api/change-request/v1/fetch-students-for-campus-change`,
  get_change_campus: `/academic/api/change-request/v1/campus-change-request-list`,
  export_change_campus: `/academic/api/change-request/v1/export-campus-change-as-csv`,
  add_change_campus: `/academic/api/change-request/v1/student-campus-change-request`,
  add_change_campus_dps: `/academic/api/change-request/v2/student-campus-change-request`,
  appr_rej_campus: ({ changeCampusId, isCurrentCampus }: any) => `/academic/api/change-request/v1/approve-change-campus-request/${changeCampusId}?isCurrentCampus=${isCurrentCampus}`,
  del_fee_ledgers_changecampus: ({ ids }: any) => `/fee/api/studentFeeLedgers/delete-ledgers?ids=${ids}`,
  submit_oldcampus_ledgers: ({ campusId, ledgerIds }: any) => `/academic/api/change-request/v1/submit-ledgers?id=${campusId}&ledgerIds=${ledgerIds}`,
  newcampus_feeledgers: `/fee/api/studentFeeLedgers/get-new-ledgers-campus-change`,
  submit_newcampus_ledgers: ({ campusId, excessAmount }: any) =>
    `/academic/api/change-request/v1/submit-final-acceptance-ledgers?id=${campusId}&excessAmount=${excessAmount}`,
  get_initial_tc_issuance: ({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/issuance-init/${tcRequestId}`,
  get_tcissuance_byid: ({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/issuance/${tcRequestId}`,

  set_tc_issuance_form: ({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/issuance/${tcRequestId}`,
  update_tcissuance: ({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/issuance/${tcRequestId}`,
  cancel_tc_request: ({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/cancel/${tcRequestId}`,
  tc_approval_list: ({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/${tcRequestId}/approvals`,
  issue_tc_req: ({ tcRequestId, updatedBy }: any) => `/academic/api/academic-service/transfer-certificate/issue-tc/${tcRequestId}?updatedBy=${updatedBy}`,
  bonafide_certificate_list: `/academic/api/academic-service/bonafide/list`,
  study_cum_bonafide: ({ tcRequestId, digitalSign }: any) => `/academic/api/academic-service/transfer-certificate/preview-study-cum-bonafide/${tcRequestId}?isDisplay=${digitalSign}`,
  tc_certi_preview: ({ tcRequestId, digitalSign }: any) => `/academic/api/academic-service/transfer-certificate/preview-tc/${tcRequestId}?isDisplay=${digitalSign}`,
  tc_custom_certi_preview: ({ digitalSign}: any) => `/academic/api/academic-service/transfer-certificate/download-link?isDisplay=${digitalSign}`,
  tc_request: ({ tcRequestId }: any) => `/academic/api/academic-service/transfer-certificate/preview-tc/${tcRequestId}`,
  parent_collected_status: ({ tcRequestId, request }: any) => `/academic/api/academic-service/transfer-certificate/update-parent-collected-status/${tcRequestId}?request=${request}`,
  bonafide_certi_preview: ({ bonafideRequestId, digitalSign }: any) => `/academic/api/academic-service/transfer-certificate/preview-bonafide/${bonafideRequestId}?isDisplay=${digitalSign}`,
  bonafide_request_by_id: ({ bonafideRequestId }: any) => `/academic/api/academic-service/bonafide/${bonafideRequestId}`,
  update_bonafide_details: ({ bonafideRequestId }: any) => `/academic/api/academic-service/bonafide/${bonafideRequestId}`,
  issue_bonafide_certificate: ({ bonafideRequestId }: any) => `/academic/api/academic-service/bonafide/${bonafideRequestId}/issue`,
  export_bonafide_certificate_list: `/academic/api/academic-service/bonafide/export`,
  get_pay_fee_details: `/fee/api/studentFeeLedgers/studentFeeLedgers`,
  get_special_pay_fee_details: `/fee/api/fee/special/fetch-special-fee-for-student`,
  bonafide_send_email :({bonafideRequestId}:any)=> `/academic/api/academic-service/transfer-certificate/send-bonafide-notification/${bonafideRequestId}`,
  fetch_student_academic_year: (({ studentId }: any) => `/academic/api/v1/students/student/${studentId}/academic-data`),

  update_jodopayment_toerp: `/fee/api/fee/receipt/updateJodoPayments`,
  update_jodo_discount: `/fee/api/studentFeeLedgers/update-discount-jodo`,
  create_jodo_id: `/fee/api/studentFeeLedgers/ledger/create-jodo-id`,
  update_erpreceipt_tojodo: ({ receiptId }: any) => `/fee/api/fee/receipt/update-details-jodo/${receiptId}`,

  fee_summary_list: `/fee/api/studentFeeLedgers/students/feeSummary`,
  export_fee_summary_list: `/fee/api/studentFeeLedgers/export`,
  download_due_amount_student_list: `/fee/api/fee-service/feeCash/due-amount-pdf`,
  delete_ledger_details: ({ id }: any) => `/fee/api/studentFeeLedgers/delete/${id}`,
  ledger_details: `/fee/api/studentFeeLedgers/studentFeeLedgers`,
  student_fee_details: ({ studentId }: any) => `/fee/api/studentFeeLedgers/${studentId}/studentFeeDetails`,
  student_schedule_details: ({ studentId }: any) => `/fee/api/studentFeeLedgers/${studentId}/schedules`,
  fee_receipt_details: `/fee/api/fee/receipt/all`,
  fee_refund_details: ({ pageNo, pageSize }: any) => `/fee/api/fee/refund/all?pageNo=${pageNo}&pageSize=${pageSize}&sortBy=&orderBy=`,
  add_new_student_concession: ({ branchId, instituteId, academicYearId }: any) => `/fee/api/fee-service/studentFeeConcessions?branchId=${branchId}&InstituteId=${instituteId}&academicYearId=${academicYearId}`,
  edit_student_concession: ({ studentLedgerId }: any) => `/fee/api/fee-service/studentFeeConcessions/${studentLedgerId}`,
  student_concession_by_id: ({ id }: any) => `/fee/api/fee-service/studentFeeConcessions/${id}`,
  delete_student_concession: ({ concessionId }: any) => `/fee/api/fee-service/studentFeeConcessions/${concessionId}`,
  print_student_ledger_details: ({ studentId }: any) => `/fee/api/studentFeeLedgers/print/${studentId}`,
  get_by_id_fee_due_follow_up_remarks: `/fee/api/fee-remarks/follow-up`,
  save_fee_due_follow_up_remarks: ({ studentId, academicYearId }: any) =>  `/fee/api/fee-remarks/follow-up?studentId=${studentId}&academicYearId=${academicYearId}`,
  // chronic parent types (config master for the fee follow-up remarks modal)
  get_chronic_parent_types_list: `/fee/api/fee-remarks/chronic-parent-types/all`,
  add_chronic_parent_types: `/fee/api/fee-remarks/chronic-parent-types`,
  get_chronic_parent_type_by_id: ({ id }: any) => `/fee/api/fee-remarks/chronic-parent-types/${id}`,
  update_chronic_parent_type: ({ id }: any) => `/fee/api/fee-remarks/chronic-parent-types/${id}`,
  delete_chronic_parent_type: ({ id }: any) => `/fee/api/fee-remarks/chronic-parent-types/${id}`,
  
  get_previous_ledger_balance: `/fee/api/studentFeeLedgers/previous-year-balance-ledgers`,
  feeledger_concession: `/fee/api/studentFeeLedgers/eligibleFullConcession`,

  student_concession_list: ({ pageNo, pageSize }: any) => `/fee/api/fee-service/studentFeeConcessions/all?pageNo=${pageNo}&pageSize=${pageSize}`,
  export_stu_concession: `/fee/api/fee-service/studentFeeConcessions/export`,
  export_tution_fee_concession: `/fee/api/fee-service/tuitionFeeConcessions/export`,
  get_student_concession_for_fee: `/fee/api/studentFeeLedgers/all/concessions`,
  bulk_upload_concession: ({ branchId, academicYearId, feeType }: any) => `/fee/api/fee-service/studentFeeConcessions/bulk/upload?academicYearId=${academicYearId}&branchId=${branchId}&feeType=${feeType}`,

  stu_concession_list_v2 : ({ pageNo, pageSize }: any) => `/fee/api/fee-service/studentFeeConcessions/new-all?pageNo=${pageNo}&pageSize=${pageSize}`,
  delete_stu_concession_v2: ({ concessionId }: any) => `/fee/api/fee-service/studentFeeConcessions/new-delete/${concessionId}`,
  stu_concession_v2_by_id: ({ concessionId }: any) => `/fee/api/fee-service/studentFeeConcessions/new/${concessionId}`,
  save_stu_concession_v2: ({ academicYearId,instituteId, branchId }: any) => `/fee/api/fee-service/studentFeeConcessions/new-save?branchId=${branchId}&InstituteId=${instituteId}&academicYearId=${academicYearId}`,
  edit_student_concession_v2: ({ id }: any) => `/fee/api/fee-service/studentFeeConcessions/new-update/${id}`,
  export_stu_concession_v2 : `/fee/api/fee-service/studentFeeConcessions/new/export`,
  bulk_upload_concession_v2 : ({ branchId, academicYearId, feeType }: any) => `/fee/api/fee-service/studentFeeConcessions/new-bulk/upload?academicYearId=${academicYearId}&branchId=${branchId}&feeType=${feeType}`,

  get_alamanac_list: `/academic/api/academic-service/almanac/list`,
  save_alamanac: `/academic/api/academic-service/almanac`,
  del_alamanac: ({ alamanacId }: any) => `/academic/api/academic-service/almanac/${alamanacId}`,

  //student id card
  get_students_idcard: `/academic/api/academic-service/idCards/all`,
  update_idcard: `/academic/api/academic-service/idCards/upload/photo`,
  preview_idcard: ({ studentId }: any) => `/academic/api/academic-service/idCards/preview/${studentId}`,
  get_upload_documents_list: `/academic/api/academic-service/uploads/list`,
  get_section_by_multiple_class: `/academic/api/academic-service/uploads/fetch-sections`,
  add_upload_documents: `/academic/api/academic-service/uploads`,
  delete_upload_documents: ({ uploadId }: any) => `/academic/api/academic-service/uploads/${uploadId}`,
  upload_doc_preview: ({ systemFileId }: any) => `/academic/api/academic-service/uploads/preview/${systemFileId}`,
  export_upload_document_list: `/academic/api/academic-service/uploads/export`,

  get_url_download_file:({ id }: any) => `/academic/api/academic-service/uploads/url-download/${id}`,

  get_work_types_list: `/academic/api/academic-service/uploads/all`,
  add_work_types_list: `/academic/api/academic-service/uploads/workTypes`,
  update_work_type: ({ id }: any) => `/academic/api/academic-service/uploads/work-types/${id}`,
  get_work_type_by_id: ({ id }: any) => `/academic/api/academic-service/uploads/work-types/${id}`,
  delete_work_type: ({ id }: any) => `/academic/api/academic-service/uploads/work-types/${id}`,

  payment_active_details: `/payment/api/payment-service/online-payments/all`,
  get_payment_active_details_by_id : ({ id }: any)=> `/payment/api/payment-service/online-payments/${id}`,
  export_active_payment_details : `/payment/api/payment-service/online-payments/all-export`,
  web_hook_logs : `fee/api/fee-service/webhook-logs`,
  web_hook_logs_category_details : `fee/api/fee-service/webhook-logs/category`,
  update_status_details : `/fee/api/fee-service/webhook-logs/update-failed-rules`,

  get_payment_reconciliation_details:({ branchId }: any)=> `/payment/api/payment-service/v2/payment-gateway-order/orders/${branchId}`,
  get_payment_reconciliation_details_by_id:({ branchId, orderRef }: any)=> `payment/api/payment-service/v2/payment-gateway-order/order/${branchId}/${orderRef}`,

  //branch dashboard
  get_branch_dashboard_stats: `/academic/api/v1/branch-dashboard/stats`,
  get_section_analysis : `/academic/api/v1/branch-dashboard/section-analysis`,
  get_school_strength : `/academic/api/v1/branch-dashboard/school-strength`,
  get_master_section : `/academic/api/v1/branch-dashboard/section-sequence-group`,
  get_attendance_tracker_report : `/academic/api/v1/branch-dashboard/attendance-report`,
  get_birthday_anniversary : `/academic/api/v1/branch-dashboard/employee-birthday-and-anniversary`,
  get_student_birthday: `/academic/api/v1/branch-dashboard/student-birthday`,
  export_student_birthday_report: `/academic/api/v1/branch-dashboard/student-birthday/export`,
  get_app_usage_stats: `/auth-service/api/auth/login-activity-counts`,
  get_os_list : `/auth-service/api/auth/login-counts`,
  get_quick_link: `/academic/api/academic-service/quick-links/all`,
  save_quick_link: `/academic/api/academic-service/quick-links`,
  export_school_strength: `/academic/api/v1/branch-dashboard/export`,
  export_attendance_tracker_report: `/attendance//api/attendance-service/daily-attendance/export`,
  get_section_wise_language: `/academic/api/v1/branch-dashboard/language-analysis`,
  export_section_wise_language : `/academic/api/v1/branch-dashboard/language-analysis/export`,
  get_all_language_list : `/academic/api/academic-service/academicLanguages/languages-by-type`,
  get_class_wise_gender_analysis : `/academic/api/v1/branch-dashboard/class-gender-analysis`,
};

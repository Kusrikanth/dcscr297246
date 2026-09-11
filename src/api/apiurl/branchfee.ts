export const branchFeeSettings = {
    get_fee_particulars: `/fee/api/fee/particulars/all`,
    get_fee_particular_byid: ({ feeParticularId }: any) => `/fee/api/fee/particulars/${feeParticularId}`,
    add_fee_particular: `/fee/api/fee/particulars`,
    update_fee_particular: ({ feeParticularId }: any) => `/fee/api/fee/particulars/${feeParticularId}`,
    delete_fee_particular: ({ feeParticularId }: any) => `/fee/api/fee/particulars/${feeParticularId}`,

    get_special_fees: `/fee/api/fee/special/all`,
    get_special_fee_byid: ({ feeParticularId }: any) => `/fee/api/fee/particulars/${feeParticularId}`,
    add_special_fee: `/fee/api/fee/special`,
    update_special_fee: ({ specialFeeId }: any) => `/fee/api/fee/special/${specialFeeId}`,
    delete_special_fee: ({ specialFeeId }: any) => `/fee/api/fee/special/${specialFeeId}`,
    update_status_special_fee: ({ specialFeeId }: any) => `/fee/api/fee/special/${specialFeeId}/status`,

    get_special_fee_Names:`/fee/api/fee-service/specialFee/feeNames`,
    get_special_fee_name_by_id:({feeNameId}:any) =>  `/fee/api/fee-service/specialFee/feeNames/${feeNameId}`,
    add_special_fee_names:`/fee/api/fee-service/specialFee/feeNames`,
    update_special_fee_name_item:({feeNameId}:any) =>  `/fee/api/fee-service/specialFee/feeNames/${feeNameId}`,
    del_special_fee_name_item:({feeNameId}:any) =>  `/fee/api/fee-service/specialFee/feeNames/${feeNameId}`,
    bulk_upload_special_fee:`/fee/api/fee/special/bulk-upload`,

    get_fee_concession: `/fee/api/fee-service/feeConcession/all`,
    add_fee_concession: ({ instituteId, branchId }: any) => `/fee/api/fee-service/feeConcession?branchId=${branchId}&InstituteId=${instituteId}`,
    update_fee_concession: ({ feeConcessionId }: any) => `/fee/api/fee-service/feeConcession/${feeConcessionId}`,
    delete_fee_concession: ({ feeConcessionId }: any) => `/fee/api/fee-service/feeConcession/${feeConcessionId}`,

    get_transport_fee_concession: `/fee/api/fee-service/transport-employee-concession/all`,
    add_transport_fee_concession: ({ instituteId, branchId }: any) => `/fee/api/fee-service/transport-employee-concession?branchId=${branchId}&InstituteId=${instituteId}`,
    update_transport_fee_concession: ({ feeConcessionId }: any) => `/fee/api/fee-service/transport-employee-concession/${feeConcessionId}`,
    delete_transport_fee_concession: ({ feeConcessionId }: any) => `/fee/api/fee-service/transport-employee-concession/${feeConcessionId}`,

    add_fee_concession_type: `/fee/api/fee/fee-concession-types`,
    get_fee_concession_type: `/fee/api/fee/fee-concession-types`,
    update_fee_concession_type: ({ id }: any) => `/fee/api/fee/fee-concession-types/${id}`,
    delete_fee_concession_type: ({ id }: any) => `/fee/api/fee/fee-concession-types/${id}`,
    

    get_fee_fines: `/fee/api/fee/fines`,
    add_fee_fine: ({ instituteId, branchId, academicYearId }: any) =>
        `/fee/api/fee/fines?instituteId=${instituteId}&branchId=${branchId}&academicYearId=${academicYearId}`,
    update_fee_fine: ({ feeFineId }: any) => `/fee/api/fee/fines/${feeFineId}`,
    delete_fee_fine: ({ feeFineId }: any) => `/fee/api/fee/fines/${feeFineId}`,

    get_fee_structure: `/fee/api/fee-service/feeStructure/all`,
    get_fee_structure_byid: ({ feeStructureId }: any) => `/fee/api/fee-service/feeStructure/${feeStructureId}`,
    get_fee_structure_forclass: `/fee/api/fee-service/feeStructure/fee-for-classes`,
    add_fee_structure: `/fee/api/fee-service/feeStructure`,
    update_fee_structure: ({ feeStructureId }: any) => `/fee/api/fee-service/feeStructure/${feeStructureId}`,
    delete_fee_structure: ({ feeStructureId }: any) => `/fee/api/fee-service/feeStructure/${feeStructureId}`,
    get_jodo_fee_structure: `/fee/api/fee-service/branch-jodo-components`,

    get_fee_refunds: ({ pageNo, pageSize, orderBy, sortBy }: any) => `/fee/api/fee/refund/all?pageNo=${pageNo}&pageSize=${pageSize}&orderBy=${orderBy}&sortBy=${sortBy}`,
    add_fee_refund: `/fee/api/fee/refund`,
    update_fee_refund: ({ feeFineId }: any) => `/fee/api/fee/fines/${feeFineId}`,
    delete_fee_refund: ({ feeFineId }: any) => `/fee/api/fee/fines/${feeFineId}`,
    get_student_refund_ledger: `/fee/api/studentFeeLedgers/for/refund`,
    export_fee_refund: `/fee/api/fee/refund/all/export`,
    // get_student_refund_ledger: ({ studentId, academicYearId }: any) => `/fee/api/studentFeeLedgers/for/refund?studentDetailId=${studentId}&academicYearId=${academicYearId}`,

    get_fee_receipts: ({ pageNo, pageSize, orderBy, sortBy }: any) => `/fee/api/fee/receipt/all?pageNo=${pageNo}&pageSize=${pageSize}&orderBy=${orderBy}&sortBy=${sortBy}`,
    get_special_fee_receipts: ({ pageNo, pageSize, orderBy, sortBy }: any) => `/fee/api/fee/receipt/special-fee/all?pageNo=${pageNo}&pageSize=${pageSize}&orderBy=${orderBy}&sortBy=${sortBy}`,
    export_special_fee_receipts: `/fee/api/fee/receipt/special-fee/export`,
    fee_receipts_fee_names: `/fee/api/fee/receipt/fee-names`,
    spl_fee_receipts_fee_names: `/fee/api/fee/receipt/special-fee/fee-names`,
    add_existing_student_fee_receipt: `/fee/api/fee/receipt`,
    add_new_student_fee_receipt: `/fee/api/fee/receipt/for/new/student`,
    update_fee_receipt: ({ receiptId }: any) => `/fee/api/fee/receipt/${receiptId}`,
    preview_receipt: ({ receiptId }: any) => `/fee/api/fee/receipt/viewPreview/${receiptId}`,
    download_receipt: ({ receiptId }: any) => `/fee/api/fee/receipt/generatePdf/${receiptId}`,
    fee_payment: `/payment/api/payment-service/v1/payment-request`,
    ccavenue_fee_payment: `/payment/api/payment-service/v2/payment-gateway/initiate`,
    process_ccavenue_dummy_payment: ({ branchId }: any) => `/payment/api/payment-service/v2/payment-gateway/process-payment-dummy/${branchId}`,
    ccavenue_payment_status: ({ branchId, orderRef }: any) => `payment/api/payment-service/v2/payment-gateway-order/order/${branchId}/${orderRef}`,
    export_fee_receipt: `/fee/api/fee/receipt/export`,
    send_email_fee_reciept: ({ receiptId }: any) => `/fee/api/fee/receipt/send-fee-receipt/${receiptId}`,
    create_credentials: `/fee/api/fee/receipt/create-credentials`,
    create_credentials_stu_fee_ledger_academic: ({ academicYearId }: any) => `/fee/api/studentFeeLedgers/create-credentials?academicYearId=${academicYearId}`,
    create_credentials_stu_fee_ledger: `/fee/api/studentFeeLedgers/create-credentials`,
    notify_duepayment: `/fee/api/fee-service/feeCash/send-sms-for-due-date-passed`,
    export_notify_duepayment: ({ academicYearId, branchId, dueAmount }: any) => `/fee/api/fee-service/feeCash/due-amount-export?academicYearId=${academicYearId}&branchId=${branchId}&dueAmount=${dueAmount}`,
    export_fee_follow_up_remarks: `/fee/api/fee-service/feeCash/student-followUp/export`,



    create_fee_reversal: ({ receiptId }: any) => `/fee/api/fee/receipt/fee-reversal/${receiptId}`,
    create_special_fee_reversal: ({ receiptId }: any) => `/fee/api/fee/special/special-fee-reversal/${receiptId}`,
    get_fee_reversal: `/fee/api/fee/receipt/reversal/all`,
    export_fee_reversal: `/fee/api/fee/receipt/reversal/export`,

    get_receipt_no: `/fee/api/fee/receipt/receiptNo`,
    update_itform: ({ itFormId }: any) => `/fee/api/fee-service/itform/${itFormId}`,
    get_itform: `/fee/api/fee-service/itform`,
    get_itform_bystudentid: ({ studentId }: any) => `fee/api/fee-service/itform/students/${studentId}`,
    get_itform_count: `/fee/api/fee-service/itform/countList`,
    get_students_it_form: `/academic/api/v1/student-Higher-class-eligibility/fetch-students/IT-Form`,
    get_student_fees_list: `/fee/api/studentFeeLedgers/giveFeeDetails/ForITForm`,
    get_student_ledger_it_form: ({ ledgerId }: any) => `/fee/api/studentFeeLedgers/paymentDetails/ITForm/${ledgerId}`,
    approve_reject_it_form: `/fee/api/fee-service/itform/approveOrReject`,
    download_it_form: ({ itFormId }: any) => `/fee/api/fee-service/itform/generatePdf/${itFormId}`,
    preview_it_form: ({ itFormId }: any) => `/fee/api/fee-service/itform/getPreview/${itFormId}`,
    sent_it_form: ({ itFormId }: any) => `/fee/api/fee-service/itform/sendEmail/${itFormId}`,

    tution_fee_concession: ({ pageNo, pageSize, orderBy, sortBy }: any) => `/fee/api/fee-service/tuitionFeeConcessions/all?pageNo=${pageNo}&pageSize=${pageSize}&orderBy=${orderBy}&sortBy=${sortBy}`,
    add_tution_fee_concession: ({ branchId, academicYearId }: any) => `/fee/api/fee-service/tuitionFeeConcessions?branchId=${branchId}&academicYearId=${academicYearId}`,
    edit_tution_fee_concession: ({ concessionId }: any) => `/fee/api/fee-service/tuitionFeeConcessions/${concessionId}`,
    tution_fee_concession_by_id: ({ concessionId }: any) => `/fee/api/fee-service/tuitionFeeConcessions/${concessionId}`,
    delete_tutuion_fee_concession: ({ concessionId }: any) => `/fee/api/fee-service/tuitionFeeConcessions/${concessionId}`,

    // get_admission_withdrawal: `/fee/api/fee-service/admissionWithdrawl/fetch`,
    // add_admission_withdrawal: `/fee/api/fee-service/admissionWithdrawl`,

    get_cheque_history: `/fee/api/fee-service/feeCheque/fetch-fee-cheque`,
    get_special_fee_cheque_history: `/fee/api/v1/fee-service/specialFeeCheque/fetch-all`,
    approve_reject_cheque: ({ chequeId, status }: any) => `/fee/api/fee-service/feeCheque/certify-fee-cheque/${chequeId}?status=${status}`,
    special_fee_approve_reject_cheque: ({ chequeId, status }: any) => `/fee/api/v1/fee-service/specialFeeCheque/certify-cheque/${chequeId}?status=${status}`,
    export_special_fee_cheque_history: `/fee/api/v1/fee-service/specialFeeCheque/export`,

    get_student_ledgers: `/fee/api/studentFeeLedgers/studentFeeLedgers`,
    get_stu_for_fee_adjust: `/fee/api/fee/refund/adjustment/students`,
    get_ledgers_fee_adjust: ({ id }: any) => `/fee/api/studentFeeLedgers/refund-adjustments/studentLedgers/${id}`,
    get_student_ledgers_fee_adjust_excess_amount: ({ id }: any) => `/fee/api/studentFeeLedgers/refund-adjustments-campus-transfer/studentLedgers/${id}`,
    get_campus_transfer_student_refund_amount: `/fee/api/fee/refund/campus-transfer-refund`,
    save_process_student_refund_amount: `/fee/api/fee/refund/approve-campus-transfer-refund`,

    get_fee_cash_payments: `/fee/api/fee-service/feeCash`,
    approve_fee_cash_payments: ({ actionId, actionStatus, remarks }: any) => `/fee/api/fee-service/feeCash/action/${actionId}?status=${actionStatus}&remarks=${remarks}`,

    export_fee_cheque: `/fee/api/fee-service/feeCheque/fetch-fee-cheque/export`,

    get_special_fee_payment_list: `/fee/api/fee/special/fetch-special-fee-payments`,
    get_special_fee_category_list: `/fee/api/fee/special/special-fee-category`,

    cc_avenue_order_stats: (({ branchId }: any) => `/payment/api/payment-service/v2/payment-gateway-order/orders/${branchId}/overview`),

    //concession-dashboard
    fee_concession_dashboard_data: `/fee/api/fee-concession-report`,
    student_fee_concession_details: `/fee/api/fee-concession-report/student-details`,
    student_fee_concession_details_export: `/fee/api/fee-concession-report/student-details/export`

}
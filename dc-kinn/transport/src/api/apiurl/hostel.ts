export const hostelSettingsUrl = {

    get_hostel_eligibility: `/hostel/api/v1/hostel-service/hostelRequest/hostelClass`,
    edit_hostel_eligibility: `/hostel/api/v1/hostel-service/hostelRequest/hostelAvailability`,

    get_hostel_fee_structure: '/hostel/api/v1/hostel-service/feeStructure',
    get_hostel_fee_structure_by_id: ({ id }: any) => `/hostel/api/v1/hostel-service/feeStructure/${id}`,
    edit_hostel_fee_structure: ({ id }: any) => `/hostel/api/v1/hostel-service/feeStructure/${id}`,
    delete_hostel_fee_structure: ({ id }: any) => `/hostel/api/v1/hostel-service/feeStructure/${id}`,
    get_hostel_fee_terms: '/hostel/api/v1/hostel-service/feeStructure/fetch-ledgers',
    save_hostel_fee_structure: `/hostel/api/v1/hostel-service/feeStructure`,

    get_hostel_room_types: `/hostel/api/hostel-service/settings/roomTypes`,
    get_hostel_fee_names: `/hostel/api/hostel-service/settings/feeNames`,

    //hostel details
    get_hostel_details: `/hostel/api/hostel-service/settings/hostelDetails`,
    save_hostel_details: `/hostel/api/hostel-service/settings/hostelDetails`,
    get_Hostel_details_list_by_id: ({ hostelId }: any) => `/hostel/api/hostel-service/settings/hostelDetails/${hostelId}`,
    edit_hostel_details_list: ({ hostelId }: any) => `/hostel/api/hostel-service/settings/hostelDetails/${hostelId}`,
    delete_hostel_details_list: ({ hostelId }: any) => `/hostel/api/hostel-service/settings/hostelDetails/${hostelId}`,

    //hostel building
    get_hostel_building: `/hostel/api/hostel-service/settings/buildings/all`,
    save_hostel_building: `/hostel/api/hostel-service/settings/buildings`,
    get_Hostel_building_list_by_id: ({ id }: any) => `/hostel/api/hostel-service/settings/buildings/${id}`,
    edit_hostel_building_list: ({ id }: any) => `/hostel/api/hostel-service/settings/buildings/${id}`,
    delete_hostel_building_list: ({ id }: any) => `/hostel/api/hostel-service/settings/buildings/${id}`,

    //hostel floor
    get_hostel_floor: `/hostel/api/hostel-service/settings/buildingFloors/all`,
    save_hostel_floor: `/hostel/api/hostel-service/settings/buildingFloors`,
    get_Hostel_floor_list_by_id: ({ floorId }: any) => `/hostel/api/hostel-service/settings/buildingFloors/${floorId}`,
    edit_hostel_floor_list: ({ floorId }: any) => `/hostel/api/hostel-service/settings/buildingFloors/${floorId}`,
    delete_hostel_floor_list: ({ floorId }: any) => `/hostel/api/hostel-service/settings/buildingFloors/${floorId}`,

    //hostel room-type
    get_hostel_room_type: `/hostel/api/hostel-service/settings/roomType/all`,
    save_hostel_room_type: `/hostel/api/hostel-service/settings/roomType`,
    get_Hostel_room_type_list_by_id: ({ roomTypeId }: any) => `/hostel/api/hostel-service/settings/roomType/${roomTypeId}`,
    edit_hostel_room_type_list: ({ roomTypeId }: any) => `/hostel/api/hostel-service/settings/roomType/${roomTypeId}`,
    delete_hostel_room_type_list: ({ roomTypeId }: any) => `/hostel/api/hostel-service/settings/roomType/${roomTypeId}`,

    //hostel building
    get_hostel_room_details: `/hostel/api/hostel-service/settings/room/all`,
    save_hostel_room_details: `/hostel/api/hostel-service/settings/room`,
    get_Hostel_room_details_list_by_id: ({ id }: any) => `/hostel/api/hostel-service/settings/room/${id}`,
    edit_hostel_room_details_list: ({ id }: any) => `/hostel/api/hostel-service/settings/room/${id}`,
    delete_hostel_room_details_list: ({ id }: any) => `/hostel/api/hostel-service/settings/room/${id}`,

    //Fee particular
    get_hostel_fee_particulars: `/hostel/api/hostel-service/settings/feeNames/all`,
    save_hostel_fee_particulars: `/hostel/api/hostel-service/settings/feeNames`,
    edit_hostel_fee_particulars: ({ hostelFeeTypeId }: any) => `/hostel/api/hostel-service/settings/feeNames/${hostelFeeTypeId}`,
    get_hostel_fee_particulars_by_id: ({ hostelFeeTypeId }: any) => `/hostel/api/hostel-service/settings/feeNames/id/${hostelFeeTypeId}`,
    delete_hostel_fee_particulars: ({ hostelFeeTypeId }: any) => `/hostel/api/hostel-service/settings/feeNames/${hostelFeeTypeId}`,
}

export const hostelFeeUrl = {

    get_hostel_stu_ledger: `/hostel/api/v1/hostel-service/studentledgers/hostelFeeSummaryList`,
    notify_hostel_fee_due_ledge: `/hostel/api/v1/hostel-service/studentledgers/send-sms-for-due-date-passed`,
    export_hostel_due_fee_payment: `/hostel/api/v1/hostel-service/studentledgers/due-amount-export`,
    hostel_stu_ledger_details: `/hostel/api/v1/hostel-service/studentledgers/hostelFeeStudentFeeLedgers`,
    hostel_payfee_details: ({ studentId }: { studentId: string }) => `/hostel/api/v1/hostel-service/studentledgers/refund-adjustments/studentLedgers/${studentId}`,
    hostel_fee_reversal: `/hostel/api/v1/hostel-service/feeReceipts/feeReversal`,
    hostel_cheque_clearance: `/hostel/api/hostel-service/chequeClearance/all`,
    hostel_approve_reject_cheque: ({ chequeId, status, remarks }: any) => `/hostel/api/hostel-service/chequeClearance/approve?chequeId=${chequeId}&status=${status}&remarks=${remarks}`,
    get_hostel_fee_receipts: `/hostel/api/v1/hostel-service/feeReceipts/all`,
    send_email_hostel_fee_reciept: ({ receiptId }: any) => `/hostel/api/v1/hostel-service/feeReceipts/send-hostel-fee-receipt/${receiptId}`,
    create_hostel_fee_revercal: ({ receiptId }: any) => `/hostel/api/v1/hostel-service/feeReceipts/fee-reversal/${receiptId}/cancel`,
    get_hostel_concession: `/hostel/api/v1/hostel-service/concessions/all`,
    get_hostel_concession_by_id: ({ id }: any) => `/hostel/api/v1/hostel-service/concessions/${id}`,
    edit_hostel_concession: ({ id }: any) => `/hostel/api/v1/hostel-service/concessions/${id}`,
    update_hostel_fee_receipt: `/hostel/api/v1/hostel-service/feeReceipts`,
    save_hostel_fee_receipt: `/hostel/api/v1/hostel-service/feeReceipts`,
    preview_hostel_fee_receipt: ({ id }: any) => `/hostel/api/v1/hostel-service/feeReceipts/viewPreview/${id}`,
    download_hostel_fee_receipt: ({ id }: any) => `/hostel/api/v1/hostel-service/feeReceipts/generate-fee-receipt/${id}`,
    create_hostel_concession: `hostel/api/v1/hostel-service/concessions`,
    get_hostel_fee_receipt_no: `/hostel/api/v1/hostel-service/feeReceipts/receipt`,
    export_hostel_concession: `/hostel/api/v1/hostel-service/concessions/concession/export`,
    delete_hostel_concession: ({ id }: any) => `/hostel/api/v1/hostel-service/concessions/${id}`,
    export_hostel_fee_receipt: `/hostel/api/v1/hostel-service/feeReceipts/export`,
    hostel_notopted_students: `/hostel/api/v1/hostel-service/hostelRequest/students`,
    hostel_opted_students: `/hostel/api/v1/hostel-service/hostelRequest/hostelShortlisted`,
    save_hostelrequest_students: `/hostel/api/v1/hostel-service/hostelRequest`,
    del_hospital_admissions: `/hostel/api/v1/hostel-service/hostelRequest`,
    export_hostel_stu_ledger: `/hostel//api/v1/hostel-service/studentledgers/export`,
    export_hostel_cheque_clearance: `/hostel/api/hostel-service/chequeClearance/all-export`,
    export_hostel_fee_reversal: `/hostel/api/v1/hostel-service/feeReceipts/feeReversal/export`,
    export_hostelrequest_students: `/hostel/api/v1/hostel-service/hostelRequest/hostelShortlisted/export`,
    re_activate_hostel_shortlist_by_id: ({ admissionShortListId }: any) => `/hostel/api/v1/hostel-service/hostelRequest/re-activate/${admissionShortListId}`,

    // hostel fee refund

    get_hostel_fee_refund_list: `/hostel/api/v1/hostel-service/refunds/all`,
    export_hostel_fee_refund_list: `/hostel/api/v1/hostel-service/refunds/all/export`,
    add_hostel_fee_refund: `/hostel/api/v1/hostel-service/refunds`,
    update_hostel_fee_refund: ({ feeFineId }: any) => `/fee/api/fee/fines/${feeFineId}`,
    delete_hostel_fee_refund: ({ feeFineId }: any) => `/fee/api/fee/fines/${feeFineId}`,
    get_student_hostel_refund_ledger: `/hostel/api/v1/hostel-service/studentledgers/for/refund`,
    get_stu_for_hostel_fee_adjust: `/hostel/api/v1/hostel-service/refunds/adjustment/students`,
    get_ledgers_hostel_fee_adjust: ({ id }: any) => `/hostel/api/v1/hostel-service/studentledgers/refund-adjustments/studentLedgers/${id}`,

    //hostel fee fine

    get_hostel_fee_fine_list: `/hostel/api/hostel-service/hostel-fee-fine/all`,
    get_hostel_fee_fine_names: `/hostel/api/v1/hostel-service/studentledgers/fetch/fee-details`,
    add_hostel_fee_fine: `/hostel/api/hostel-service/hostel-fee-fine`,
    delete_hostel_fee_fine: ({ id }: any) => `/hostel/api/hostel-service/hostel-fee-fine/${id}`,
    update_hostel_fee_fine: ({ id }: any) => `/hostel/api/hostel-service/hostel-fee-fine/${id}`,
}

export const hostelRequestUrl = {

    get_hostel_promote_stu_list: `/hostel/api/v1/hostel-service/promote-students`,
    get_save_hostel_promote_stu_list: `/hostel/api/v1/hostel-service/higher-class-eligible/promote-for`,
    save_hostel_promote_stu: `/hostel/api/v1/hostel-service/promote-students/save-students-with-promotionStatus`,

    get_eligible_student_forpromote: ``,
    get_hosteleligible_forpromote: `/hostel/api/v1/hostel-service/higher-class-eligible/eligibility-for-promote`,
    get_hostel_higherclasselibility: `/hostel/api/v1/hostel-service/higher-class-eligible`,
    save_hostel_higherclass_eligibility: `/hostel/api/v1/hostel-service/higher-class-eligible/promote-eligible-students`,
    revert_remove_hostel_promotion: ({ higherClassEligibleId }: any) => `/hostel/api/v1/hostel-service/higher-class-eligible/${higherClassEligibleId}`,

    get_hostel_bed_allocation_list: `/hostel/api/v1/hostel-service/bed-allocations`,
    deallocate_hostel_bed: `/hostel/api/v1/hostel-service/bed-allocations`,
    get_stu_list_for_allocate_bed: `/hostel/api/v1/hostel-service/bed-allocations/students`,
    get_not_allocated_bed_list: `/hostel/api/v1/hostel-service/bed-allocations/beds`,
    add_hostel_bed_allocation: `/hostel/api/v1/hostel-service/bed-allocations`,
    export_hostel_bed_allocation: `/hostel/api/v1/hostel-service/bed-allocations/export`,

    // Hostel Termination
    get_hostel_termination_list: `/hostel/api/v1/hostel-service/hostelRequest/terminations`,
    save_hostel_termination_list: `/hostel/api/v1/hostel-service/hostelRequest/terminate`,
    get_termination_stu_ledgers: ({ studentId, willEffectDate }: any) => `/hostel/api/v1/hostel-service/hostelRequest/ledgers-termination/${studentId}?willEffectDate=${willEffectDate}`,
    revert_hostel_termination_by_id: ({ terminationId }: any) => `/hostel/api/v1/hostel-service/hostelRequest/revert/termination/${terminationId}`,
    // /hostel/api/v1/hostel-service/hostelRequest/revert/termination/:terminationId

    // Hostel Transfer Request
    get_hostel_transfer_request: `/hostel/api/v1/hostel-service/hostelRequest/fetch/termination-approvals`,
    approve_hostel_transfer_request: `/hostel/api/v1/hostel-service/hostelRequest/termination/approve`,
    get_hostel_ledger_tc: ({ studentId }: any) => `/hostel/api/v1/hostel-service/studentledgers/student/all-ledgers/${studentId}`,

    //Hostel Student Info
    get_hostel_student_availability: ({ studentId }: any) => `/hostel/api/v1/hostel-service/hostelRequest/${studentId}/student`,
}

export const directoryStdntMgnmntUrl = {
    get_students_stats: `/academic/api/v1/students/student-management-stats`,
    get_students: `/academic/api/v1/students/branch/students`,
    get_students_byregNo: `/admission/api/admission-service/pre-admissions/students`,
    upload_student_document: `/academic/api/v1/students/upload-docs`,
    classwise_document_list: `/academic/api/v1/students/class-wise-documents`,
    get_students_by_id: ({ studentId }: any) => `/academic/api/v1/students/${studentId}/all`,
    delete_doc_by_id: ({ id }: any) => `/academic/api/v1/students/delete-document/${id}`,
    download_document_by_id: ({ documentId }: any) => `/academic/api/v1/students/document/download?documentId=${documentId}`,
    update_students_by_id: ({ studentRequest }: any) => {
        return `/academic/api/v1/students`
    },
    get_student_attendance: () => `/attendance/api/attendance-service/reports/complete-attendance-directory`,

    get_students_by_name: `/academic/api/v1/students/student-name`,
    add_student: `/academic/api/v1/students`,
    delete_student: ({ studentIds }: any) => `/academic/api/v1/students/delete?studentIds=${studentIds}`,
    export_student_data: `/academic/api/v1/students/export-csv`,
    export_student_registration_data: `/admission/api/admission-service/pre-admissions/export-registration-details`,

    get_parent_childrens: ({ parentId, instituteId }: any) => `/academic/api/v1/parent/parent/students`,
    get_all_parents: `/academic/api/v1/parent/all`,
    export_all_parents: `/academic/api/v1/parent/download-export`,
    send_credentials_parent: `/academic/api/v1/parent/create-credentials-for-parent`,

    get_parentdetails_byid: ({ parentId }: any) => `/academic/api/v1/parent/parent/${parentId}`,
    get_parents_stats: `/academic/api/v1/parent/parent-management-stats`,
    update_primary_contact: `/academic/api/v1/students/update/primary/contact`,
    update_student_details: `/academic/api/v1/students/update-profile`,
    update_whatsappnumber: `/academic/api/v1/students/add-whatsapp-number`
}


export const directoryEmployeeMgnmntUrl = {
    get_employees_stats: `/academic/api/v1/employees/stats`,
    get_employees: `/academic/api/v1/employees/branch/fetch-employees`,
    get_other_employees: `/academic/api/v1/employees/employees`,
    add_employee: `/academic/api/v1/employees`,
    upload_employee_document: `/academic/api/v1/employees/upload-docs`,
    download_employee_document_by_id: ({ documentId }: any) => `/academic/api/v1/employees/document/download?documentId=${documentId}`,
    get_employee_byid: ({ employeeId }: any) => `/academic/api/v1/employees/${employeeId}`,
    get_employee_document_type: `/academic/api/v1/employees/document-types`,

    get_employee_by_name: ({ searchString }: any) => `/academic/api/v1/employees/${searchString}/employee-name`,
    get_employee_by_name_search: `/academic/api/v1/employees/employee-name`,
    get_reporting_head: `/academic/api/v1/master/employee-reportingHead`,
    get_hod_employee: `/academic/api/v1/master/employee-hod`,
    export_employee_data: `/academic/api/v1/employees/export-csv`,
    export_other_employee_data: `/academic/api/v1/employees/export-other-employees`,

    get_all_complanies: `/academic/api/companies/all`,
    get_company_details_list_by_id : ({id} : any)=> `/academic/api/companies/${id}`,
    edit_company_details_list : ({id} : any)=> `/academic/api/companies/${id}`,
    save_company_details :  `/academic/api/companies`,
    delete_company_details_list : ({id} : any)=> `/academic/api/companies/${id}`,
}

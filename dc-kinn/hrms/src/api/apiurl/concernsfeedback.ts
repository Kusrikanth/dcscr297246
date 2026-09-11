export const concernsFeedbackUrl = {
    get_concern_feedback_list: "/concern/api/complaint-service/complaints/all",
    get_concern_feedback_list_by_id: ({ id }: any) => `/concern/api/complaint-service/complaints/details/${id}`,
    get_comment_list: ({ id }: any) => `/concern/api/complaint-service/complaints/${id}`,
    edit_comment_list: ({ id }: any) => `/concern/api/complaint-service/comments/${id}`,
    delete_comment_list: ({ id }: any) => `/concern/api/complaint-service/comments/${id}`,
    delete_concern_file: ({ id }: any) => `/concern/api/complaint-service/complaints/attachments/${id}`,
    add_comment_list: `/concern/api/complaint-service/comments/save`,
    add_concern_file: ({ id }: any) => `/concern/api/complaint-service/complaints/attachments/complaints/${id}`,
    get_concern_stats: "/concern/api/complaint-service/complaints/stats",
    edit_concern_feedback_list: ({ id }: any) => `/concern/api/complaint-service/complaints/${id}`,
    add_concern_feedback_list: `/concern/api/complaint-service/complaints/save`,
    assignee_list_concern: `/concern/api/complaint-service/complaints/assignee/complaints`,
    get_concerns_user_list: `/auth-service/api/auth/search`,
    export_concern_list: "/concern/api/complaint-service/complaints/all-complaints/export",
    get_all_modules_list: `/concern/api/complaint-service/complaints/modules`,

    // concern to parent 

    get_concerns_to_parent_list: `/concern/api/complaint-service/complaints-parent/all`,
    get_concerns_to_parent_by_id:({id}:any)=> `/concern/api/complaint-service/complaints-parent/${id}`,
    save_concerns_to_parent_list: `/concern/api/complaint-service/complaints-parent/save`,
    get_concerns_to_parent_section_list: `/academic/api/class-section/v1/sections`,
}

export const complaintDepartmentUrl = {
    get_complaint_dept_list: "/concern/api/complaint-service/complaintsDepartments/all/ComplaintsDepartments",
    add_complaints_department: "/concern/api/complaint-service/complaintsDepartments/create/complaintDepartment",
    edit_complaints_department: `/concern/api/complaint-service/complaintsDepartments/update/ComplaintsDepartments/`,
    delete_complaints_department: ({ id }: any) => `/concern/api/complaint-service/complaintsDepartments/delete/complaintDepartment/${id}`,

    get_concern_dept_head: ({ userId }: any) => `/concern/api/complaint-service/complaintsDepartments//departments/user/${userId}`,

    get_master_complaint_dept_list: "/concern/api/complaint-service/complaintsDepartments/all/departments",
    get_master_complaint_dept_list_all: "/concern/api/complaint-service/complaintsDepartments",
    save_master_dept_list: "/concern/api/complaint-service/complaintsDepartments/save/department",
    save_master_dept_list_update:  `/concern/api/complaint-service/complaintsDepartments`,
}
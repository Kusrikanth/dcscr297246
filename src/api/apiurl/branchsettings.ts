
export const branchInfoUrl = {
    get_branch_banks: `/academic/api/v1/bank/all`,
    add_branch_bank: `/academic/api/v1/bank`,
    delete_branch_bank: ({ bankDetailId }: any) => `/academic/api/v1/bank/${bankDetailId}`,


    get_branch_area: ({ branchId }: any) => `/academic/api/v1/branchArea/${branchId}`,
    add_branch_area: `/academic/api/v1/branchArea`,
    delete_branch_are: ({ branchAreaId }: any) => `/academic/api/v1/branchArea/${branchAreaId}`,

    get_contact_persons: `/settings-service/api/v1/settings/fetch-contact-person`,
    add_contact_person: ({ branchId }: any) => `/settings-service/api/v1/settings/add-contact-person?branchId=${branchId}`,
    update_contact_person: ({ contactId }: any) => `/settings-service/api/v1/settings/edit-contact-person/${contactId}`,
    delete_contact_person: ({ contactId }: any) => `/settings-service/api/v1/settings/delete-contact-person/${contactId}`,

    get_brch_departments: `/settings-service/api/v1/branch-departments/departments`,
    add_brch_department: ({ branchId }: any) => `/settings-service/api/v1/branch-departments?branchId=${branchId}`,
    delete_brch_department: ({ departmentId }: any) => `/settings-service/api/v1/branch-departments/${departmentId}`,

    //Logo's
    get_brch_logo: ({ branchId }: any) => `/academic/api/v1/branch/${branchId}/logos`,
    add_brch_logo: ({ branchId, type,isTemporary }: any) => `/academic/api/v1/branch/${branchId}/logos?type=${type}&isTemporary=${isTemporary}`,
    delete_brch_logo: ({ branchId }: any) => `/academic/api/v1/branchForm/delete/${branchId}`,

}

export const branchAcademicsUrl = {
    get_brch_curriculum: `/academic/api/curriculum/v1/branch-curriculums`,
    get_academic_language_list: `/academic/api/academic-service/academicLanguages/all-languages`,
    add_brch_curriculum: ({ branchId }: any) => `/academic/api/curriculum/v1/branch-curriculums?branchId=${branchId}`,
    delete_brch_curriculum: ({ branchId, curriculumId , academicYearId }: any) => `/academic/api/curriculum/v1/branch-curriculum/${curriculumId}?academicYearId=${academicYearId}`,

    get_brch_academic_year: `/academic-service/academic-year/v1/branch-academic-years`,
    add_brch_academic_year: ({ branchId }: any) => `/academic-service/academic-year/v1/branch-academic-year?branchId=${branchId}`,
    update_brch_academic_year: ({ academicYearId }: any) => `/academic-service/academic-year/v1/branch-academic-year/${academicYearId}`,
    delete_brch_academic_year: ({ academicYearId }: any) => `/academic-service/academic-year/v1/branch-academic-year/${academicYearId}`,

    get_brch_term_info: `/settings-service/api/v1/term-branch`,
    add_brch_term_info: ({ branchId }: any) => `/settings-service/api/v1/term-branch?branchId=${branchId}`,
    update_brch_term_info: ({ academicYearId }: any) => `/academic-service/academic-year/v1/branch-academic-year/${academicYearId}`,
    delete_brch_term_info: ({ academicYearId }: any) => `/academic-service/academic-year/v1/branch-academic-year/${academicYearId}`,

    get_brch_sections: `/academic/api/class-section/v1/fetch-class-sections`,
    add_brch_section: ({ branchId }: any) => `/academic/api/class-section/v1/create-sections?branchId=${branchId}`,
    update_brch_section: ({ branchClassId, academicYearId }: any) => `/academic/api/class-section/v1/update-sections?branchClassId=${branchClassId}&academicYearId=${academicYearId}`,
    delete_brch_section: ({ branchClassId }: any) => `/academic/api/class-section/v1/delete-sections?branchClassId=${branchClassId}`,

    get_brch_subjects: `/academic/api/v1/subject/all`,
    get_inst_subject_name: `/academic/api/academic-service/master-subjects`,
    add_brch_subject: `/academic/api/v1/subject`,
    update_brch_subject: `/academic/api/v1/subject`,
    delete_brch_subject: ({ subjectId }: any) => `/academic/api/v1/subject/${subjectId}`,


    get_stream_groups: `/academic/api/v1/branch-stream-group/all`,
    add_stream_group: `/academic/api/v1/branch-stream-group`,
    update_stream_group: `/academic/api/v1/branch-stream-group`,
    delete_stream_group: ({ streamGroupId }: any) => `/academic/api/v1/branch-stream-group/${streamGroupId}`,


    get_brch_curriculum_class: `/academic/api/v1/branchClass/all`,
    get_curriculum_wise_class: `/academic/api/v1/branchClass/class-details`,
    add_brch_curriculum_class: `/academic/api/v1/branchClass`,
    del_brch_curriculum_class: ({ classId,academicYearId }: any) => `/academic/api/v1/branchClass/${classId}?academicYearId=${academicYearId}`,


    get_brnch_curriclum_class_mapping: ({ branchId }: any) => `/academic/api/v1/branchClass/curriculum-with-class/${branchId}`,
    get_class_wise_terms_date: `/academic/api/v1/branch-class-academic-term/all`,
    del_class_wise_terms_date: ({ termId }: any) => `/academic/api/v1/branch-class-academic-term/${termId}`,
    add_class_wise_terms_date: `/academic/api/v1/branch-class-academic-term`,
    update_class_wise_terms_date: `/academic/api/v1/branch-class-academic-term`,


    get_branch_academic_class_date: `/academic/api/v1/branch-academic-class/all`,
    add_save_branch_academic_class_date: `/academic/api/v1/branch-academic-class`,
    update_save_branch_academic_class_date: `/academic/api/v1/branch-academic-class`,
    del_branch_academic_class_date: ({ classId }: any) => `/academic/api/v1/branch-academic-class/${classId}`,
}
export const examinationSportsUrls = {
  // sports names
  get_sports_names: "/examination/api/v2/examination/ps/sports",
  get_sports_name_by_id: ({ id }: any) =>
    `/examination/api/v2/examination/ps/sports/${id}`,
  save_sports_name_item: "/examination/api/v2/examination/ps/sports",
  edit_sports_name_item: ({ id }: any) =>
    `/examination/api/v2/examination/ps/sports/${id}`,
  del_sports_name_item: ({ id }: any) =>
    `/examination/api/v2/examination/ps/sports/${id}`,

  // sports attributes
  get_sports_attributes_list:
    "/examination/api/v2/examination/sports/attributes",
  get_sports_attribute_by_id: ({ id }: any) =>
    `/examination/api/v2/examination/sports/attributes/${id}`,
  save_sports_attribute_item:
    "/examination/api/v2/examination/sports/attributes",
  edit_sports_attribute_item: ({ id }: any) =>
    `/examination/api/v2/examination/sports/attributes/${id}`,
  del_sports_attribute_item: ({ id }: any) =>
    `/examination/api/v2/examination/sports/attributes/${id}`,

  // sports grades
  get_sports_grades_list: "/examination/api/v2/examination/ps/grades",
  get_sports_grade_by_id: ({ id }: any) =>
    `/examination/api/v2/examination/ps/grades/${id}`,
  save_sports_grade_item: "/examination/api/v2/examination/ps/grades",
  edit_sports_grade_item: ({ id }: any) =>
    `/examination/api/v2/examination/ps/grades/${id}`,
  del_sports_grade_item: ({ id }: any) =>
    `/examination/api/v2/examination/ps/grades/${id}`,

  // sports management
  get_sports_class_mapping_list:
    "/examination/api/v2/examination/ps/sports-class/fetch-all",
  get_sports_class_mapping_item_by_id: ({ id }: any) =>
    `/examination/api/v2/examination/ps/sports-class/${id}`,
  save_sports_class_mapping_item:
    "/examination/api/v2/examination/ps/sports-class/save",
  edit_sports_class_mapping_item: `/examination/api/v2/examination/ps/sports-class/update`,
  delete_sports_class_mapping_item: ({ academicYearId, branchId, curriculumId, termId, sportId }: any) => `/examination/api/v2/examination/ps/sports-class/delete?academicYearId=${academicYearId}&&branchId=${branchId}&curriculumId=${curriculumId}&termId=${termId}&sportId=${sportId}`,

  get_sports_sub_attribute_list:
    "/examination/api/v2/examination/ps/sports-sub-attributes/all",
  get_sports_sub_attribute_item_by_id: ({ id }: any) =>
    `/examination/api/v2/examination/ps/sports-sub-attributes/${id}`,
  save_sports_sub_attribute_items:
    "/examination/api/v2/examination/ps/sports-sub-attributes/save",
  edit_sports_sub_attribute_item:
    "/examination/api/v2/examination/ps/sports-sub-attributes/update",
  del_sports_sub_attribute_item:({attributeId,sportsClassId}) => `/examination/api/v2/examination/ps/sports-sub-attributes/delete?sportsClassId=${sportsClassId}&attributeId=${attributeId}`,

  get_sports_discriptions_list:
    "/examination/api/v2/examination/ps/attribute-description-sports/all",
  save_sports_discriptions_items:
    "/examination/api/v2/examination/ps/attribute-description-sports/save",
  del_sports_discriptions_items:({sportsClassId,mainAttributeId}) => `/examination/api/v2/examination/ps/attribute-description-sports?sportsClassId=${sportsClassId}&mainAttributeId=${mainAttributeId}`,

  get_sports_classes_list: "/examination/api/v2/examination/ps/sports-class",
  
  // Grade Entry
  get_student_sports_grade_entry: ({ id }: any) =>
    `/examination/api/v2/examination/ps/sports-grades/all`,  
  get_student_sports_grade_entry_by_id: ({ id }: any) =>
    `/examination/api/v2/examination/ps/sports-grades/${id}`,
  edit_student_sports_grade_entry: ({ id }: any) =>
    `/examination/api/v2/examination/ps/sports-grades/update/${id}`,
  save_student_sports_grade_entry:
    "/examination/api/v2/examination/ps/sports-grades/save",

    // Main Attributes With List Of Sub Attributes
    get_sports_main_attributes_with_sub_attributes:
    "/examination/api/v2/examination/ps/sports-sub-attributes/attributes",
  get_sub_attribute_items_list:
    "/examination/api/v2/examination/ps/sports-sub-attributes",
  get_sub_attributes_common_list:`examination/api/v2/examination/ps/sports-sub-attributes/common-sub-attributes`,

  // BMI Details
  save_student_bmi_details:
    "/examination/api/v2/examination/sports/bmi/calculate-bmi",

  // assign sports to students
  get_asssign_sports_to_students_list:
    "/examination/api/examination/ps-sports-assign-students",
  get_assign_sports_to_student_item_by_id: ({ id }: any) =>
    `/examination/api/examination/ps-sports-assign-students/${id}`,
  save_assign_sports_to_students:
    "/examination/api/examination/ps-sports-assign-students",
  edit_assign_sports_to_students:
    `/examination/api/examination/ps-sports-assign-students`,
  get_not_assigned_students_list: `/examination/api/examination/ps-sports-assign-students/ids`,

  // Sports Teacher
  get_sports_teacher_list: "/examination/api/v2/examination/ps/sports/assign-teacher/all",
  get_sports_teacher_by_id: ({ id }: any) =>
    `/examination//api/v2/examination/ps/sports/assign-teacher/${id}`,
  save_sports_teacher_item: "/examination//api/v2/examination/ps/sports/assign-teacher/save",
  edit_sports_teacher_item: "/examination//api/v2/examination/ps/sports/assign-teacher",
  unassign_sports_teacher:
    `/examination/api/v2/examination/ps/sports/assign-teacher`,

  // Sports Progress Card
  get_sports_progress_card_list: "/examination/api/v2/examination/ps/sports-grades/report-card",
  download_sports_progress_card: "/examination/api/v2/examination/reports-generation/sports/download",

  get_sports_unAssigned_classes : `/examination/api/v2/examination/ps/sports-class/not-assigned-classes`,
  get_other_progress_card_access: `/examination/api/examination-service/pva/pva-classes/other-progress-card-access`
};

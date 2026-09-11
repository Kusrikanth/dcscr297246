export const timetableUrl = {
    //Period Category
    get_period_category: `/timetable/api/timetable-service/categories`,
    delete_period_category: ({ id }: any) => `/timetable/api/timetable-service/categories/${id}`,
    save_period_category: `/timetable/api/timetable-service/categories`,
    update_period_category: `/timetable/api/timetable-service/categories`,

    //Breaks Type
    get_breaks_type: `/timetable/api/timetable-service/breakTypes`,
    save_breaks_type: `/timetable/api/timetable-service/breakTypes`,
    delete_breaks_type: ({ id }: any) => `/timetable/api/timetable-service/breakTypes/${id}`,
    update_breaks_type: `/timetable/api/timetable-service/breakTypes`,

    //create timetable
    get_weeks: `/timetable/api/timetable-service/timetable/week/days`,
    get_subjects_teacher: `/academic/api/academic-service/v1/subject/all`,
    save_timetable: `/timetable/api/timetable-service/timetable`,
    get_timetable: `/timetable/api/timetable-service/timetable/all`,
    view_timetable: ({ id }: any) => `/timetable/api/timetable-service/timetable/timetable/${id}`,
    view_parent_timetable: `/timetable/api/timetable-service/timetable/parent`,
    view_teacher_timetable: ({ id }: any) => `/timetable/api/timetable-service/timetable/teacher/${id}`,

    //Breaks
    get_breaks: `/timetable/api/timetable-service/breaks`,
    save_breaks: `timetable/api/timetable-service/breaks`,
    delete_breaks: ({ id }: any) => `/timetable/api/timetable-service/breaks/delete/${id}`,
}
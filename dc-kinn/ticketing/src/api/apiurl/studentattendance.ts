export const dailyAttendanceUrl = {
    get_daily_att_list: `/attendance/api/attendance-service/daily-attendance/all`,
    update_stu_att_list: `/attendance/api/attendance-service/daily-attendance`,
    date_range_stu_att: `/academic/api/v1/branch-academic-class/all`,
    attendance_report_list: `/attendance/api/attendance-service/reports/attendance-report`,
    get_month_for_branch_and_class : `/academic/api/v1/branch-academic-class/fetch-months`,
    export_attendance_report: `/attendance/api/attendance-service/reports/export-csv`,
    total_working_days_report: `/attendance/api/attendance-service/reports/new-report-for-working-days`,
    export_total_working_days_report: `/attendance/api/attendance-service/reports/total-working-days/export`
}

export const studentHolidayDetailsUrl = {
    get_holiday_details_list: `/attendance/api/attendance-service/holiday-details/class-wise`,
    get_holidays: `/attendance/api/attendance-service/holiday-details/all`,
    export_holidays: `/attendance/api/attendance-service/holiday-details/export`,

    delete_holiday: ({ holidayId }: { holidayId: string }) => `/attendance/api/attendance-service/holiday-details/${holidayId}`,
    add_holiday: `/attendance/api/attendance-service/holiday-details`,
    update_holiday: ({ holidayId }: { holidayId: string }) => `/attendance/api/attendance-service/holiday-details/${holidayId}`,
    get_brch_curriculum_class_holidays:`/academic/api/v1/branch-academic-class/fetch-classes`,
}

export const studentLongLeavesUel = {
    get_long_leave_list: `/attendance/api/attendance-service/student-long-leaves/all`,
    save_long_leaves: `/attendance/api/attendance-service/student-long-leaves`,
    delete_long_leaves: ({ id }: any) => `/attendance/api/attendance-service/student-long-leaves/${id}`,
    edit_long_leaves: ({ id }: any) => `/attendance/api/attendance-service/student-long-leaves/${id}`,
    get_long_leave_by_id: ({ id }: any) => `/attendance/api/attendance-service/student-long-leaves/${id}`,
    approve_reject_long_leaves: ({ id }: any) => `/attendance/api/attendance-service/student-long-leaves/approve-request/${id}`,
    get_monthly_attendance: `/attendance/api/attendance-service/month-wise-attendance/all`,
    update_monthly_attendance: `/attendance/api/attendance-service/month-wise-attendance`,
    search_long_leaves: `/attendance/api/attendance-service/student-long-leaves/students`,
    save_trigger_attendance: ({ branchId, date }: { branchId: any, date: any }) => `/attendance/api/attendance-service/daily-attendance/save-monthly-attendance?branchId=${branchId}&date=${date}`,
}

export const scheduleTaskUrl = {
    get_schedule_list: `/attendance/api/attendance-service/scheduled-tasks/all`,
    add_schedule_task: `/attendance/api/attendance-service/scheduled-tasks`,
    delete_schedule_task: ({ id }: any) => `/attendance/api/attendance-service/scheduled-tasks/${id}`,
    edit_schedule_task: ({ id }: any) => `/attendance/api/attendance-service/scheduled-tasks/${id}`,
    update_status_schedule_task: ({ id }: any) => `/attendance/api/attendance-service/scheduled-tasks/active-task/${id}`,
}

export const scheduleLogsUrl = {
    get_schedule_logs: `/notification/api/notification-service/scheduler-logs/fetch`,
}
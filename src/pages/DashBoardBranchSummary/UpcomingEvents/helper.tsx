import { calculateRemainingDays, getFormattedDateForTable } from "../../../utility/dateutility";
import { StaffAnniversary } from "./UpcomingEventsTypes";

export const selectData1 = [
    {
      userType: "Student",
    },
    {
      userType: "Staff",
    },
  ];

export const transformAnniversaryData = (content: any): StaffAnniversary[] => {
  if (!content) return [];
  return content
    .filter((item: any) => item.yearsCompleted > 0) 
    .map((item: any) => ({
      employeeName: item.employeeName,
      period: `${getFormattedDateForTable(item.doj)} in ${item.yearsCompleted} Year${item.yearsCompleted > 1 ? "s" : ""} Completed`,
      schoolDetails: {
        role: item.employeeCode,
      },
      imageUrl: item.employeeImageUrl
    }));
};

export function transformEmployeeData(content: any) {
  if (!content) return [];
  const borderColors = ["#d1f7c4", "#ffe69c", "#f9c1b6"]; 
  return content.map((item: any, index: any) => ({
    employeeName: item.employeeName,
    date: getFormattedDateForTable(item.dateOfBirth),
    borderColor: borderColors[index % borderColors.length], 
    schoolDetails: {
      staffId: item.employeeCode,
      role: item.employeeCode, 
    },
    status: item.status,
    imageUrl: item.employeeImageUrl,
    days: calculateRemainingDays(item.dateOfBirth)
  }));
}

export const formatStudentBirthdays = (students: any) => {
  if (!students) return [];
  const borderColors = ["#d1f7c4", "#ffe69c", "#f9c1b6"]; 
  return students.map((student: any, index: any) => ({
    employeeName: student.studentName,
    date: getFormattedDateForTable(student.dob),
    borderColor: borderColors[index % borderColors.length],
    schoolDetails: {
      section: student.sectionName, 
      role: student.studentCode,
    },
    status: student.status,
    imageUrl: student.studentImageUrl,
    days: calculateRemainingDays(student.dob)
  }));
};
import { parse } from "date-fns";

const formatTime = (time: string) => {
  if (!time) return "";
  const [hours, minutes] = time.split(":")?.map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
};
export const generateTimeTable = (timeTableInfo: any) => {
  const { periodDaysList, periodPerDayList, breaks = [] } = timeTableInfo;  

  if (!periodDaysList || !periodPerDayList) return [];

  // Filter out breaks with empty essential fields
  const validBreaks = breaks.filter(
    (breakItem) => breakItem.startTime && breakItem.endTime
  );

  // Combine valid periods and valid breaks into a single timeline
  const allEvents = [...periodPerDayList, ...validBreaks]?.map((event) => ({
    ...event,
    startTime: event.periodStartTime || event.startTime,
    endTime: event.periodEndTime || event.endTime,
    isBreak: !!event.breakType,
    periodName: event.periodName || event.breakName || "",
    periodId: event.periodId || event.breakId || "",
  }));
  
  allEvents.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
  
  // Generate timetable for each selected day
  return periodDaysList
    .filter((day: any) => day.checked) 
    ?.map((day: any) => ({
      dayName: day.name,
      dayId: `09-02-2025-${day.shortName.toLowerCase()}`,
      periods: allEvents?.map((event, index) => ({
        periodTime: `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`,
        periodSubjectName: event.isBreak ? (event.breakName || "") : event.periodType || "",
        periodSubjectTeacher: "",
        periodSubjectTeacherEmpCode: "",
        periodSubtituteTeacherName: "",
        periodSubtituteTeacherEmpCode: "",
        weekId: day.weekId,
        periodName: event.periodName || `P${index + 1}`,
        periodId: `${day.shortName.toLowerCase()}-p${index + 1}`,
        isBreak: event.isBreak,
        ...(event.isBreak
          ? {
              periodTextColor: "#D97706",
              periodBorderColor: "#FACC15",
              periodBgColor: "#FACC151A",
            }
          : {}),
      })),
    }));
};


export const generatePeriodsList = (timeTableInfo) => {
  const { periodPerDayList, breaks = [] } = timeTableInfo;

  const parseTime = (timeStr) => {
    return parse(timeStr, "h:mm a", new Date());
  };

  // Filter out breaks with empty essential fields
  const validBreaks = breaks.filter(
    (breakItem) => breakItem.startTime && breakItem.endTime
  );

  const allEvents = [...periodPerDayList, ...validBreaks].map((event) => ({
    periodName: event.periodName || event.breakName || "",
    periodTime: `${formatTime(event.periodStartTime || event.startTime)} - ${formatTime(event.periodEndTime || event.endTime)}`,
    isBreak: !!event.breakType,
    startTime: parseTime(formatTime(event.periodStartTime || event.startTime)).getTime(), 
  }));

  allEvents.sort((a, b) => a.startTime - b.startTime);

  return allEvents;
};
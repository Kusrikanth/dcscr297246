import { formatTimeInput } from "../../../utility/dateutility";

export function transformApiResponse(apiResponse) {
  const result: any = [];
  const colorSets = [
    {
      periodTextColor: "#BE123C",
      periodBorderColor: "#F43F5E",
      periodBgColor: "#FFE4E6"
    },
    {
      periodTextColor: "#B45309",
      periodBorderColor: "#D97706",
      periodBgColor: "#D977061A"
    },
    {
      periodTextColor: "#047857",
      periodBorderColor: "#10B981",
      periodBgColor: "#10B9811A"
    },
    {
      periodTextColor: "#9333EA",
      periodBorderColor: "#C084FC",
      periodBgColor: "#C084FC1A"
    }
  ];

  const getRandomColorSet = () => {
    const randomIndex = Math.floor(Math.random() * colorSets.length);
    return colorSets[randomIndex];
  };

  const timeToDate = (timeString: string) => {
    const [time, modifier] = timeString.split(' ');
    const [hours, minutes] = time.split(':');
    const date = new Date();
    const hour = modifier === "PM" && hours !== "12" ? parseInt(hours) + 12 : parseInt(hours);
    date.setHours(hour);
    date.setMinutes(parseInt(minutes));
    date.setSeconds(0);
    return date;
  };

  const daysWeeks = apiResponse?.daysWeeks;
  const breaks = apiResponse?.breaks || [];
  const periodTimes = apiResponse?.periods?.map(p => ({
    name: p.periodName,
    startTime: formatTimeInput(p.startTime),
    endTime: formatTimeInput(p.endTime)
  }));

  if (Array.isArray(daysWeeks)) {
    daysWeeks.forEach((dayObj, index) => {
      const weekKey = dayObj.weekId;
      const dayOfWeek = dayObj.dayOfTheWeek;

      const periodList = apiResponse?.dayWeek?.[weekKey] || [];

      const periods = periodList.map((periodItem, i) => {
        const time = periodTimes[i] || {};
        const color = getRandomColorSet();
        return {
          periodTime: `${time.startTime} - ${time.endTime}`,
          startTime: time.startTime,
          endTime: time.endTime,
          periodSubjectName: periodItem.subjectName,
          periodSubjectTeacher: periodItem.teacherName,
          periodName: `P${i + 1}`,
          periodId: periodItem.periodId,
          type: 'period',
          ...color
        };
      });

      const dayBreaks = breaks.map((brk, i) => ({
        periodTime: `${formatTimeInput(brk.startTime)} - ${formatTimeInput(brk.endTime)}`,
        startTime: formatTimeInput(brk.startTime),
        endTime: formatTimeInput(brk.endTime),
        periodSubjectName: brk.breakType,
        periodSubjectTeacher: '',
        periodName: brk.breakName,
        periodId: brk.id,
        type: 'break'
      }));


      const allItems = [...periods, ...dayBreaks].sort((a, b) => {
        const timeA = timeToDate(a.startTime);  
        const timeB = timeToDate(b.startTime);
        return timeA.getTime() - timeB.getTime(); 
      });

      const day = {
        dayName: dayOfWeek,
        dayId: `05-${11 + index}-2025-${dayOfWeek.substring(0, 3).toLowerCase()}`,
        periods: allItems
      };

      result.push(day);
    });
  }

  return result;
}

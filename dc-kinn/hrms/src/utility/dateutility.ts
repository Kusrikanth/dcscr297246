import {
    format, isValid, addMinutes, parse, parseISO,
    isBefore,
    subYears, differenceInDays, intervalToDuration, isAfter, addDays, isEqual,
    endOfMonth,
    eachDayOfInterval,
    getDay,
    setYear,
    differenceInMilliseconds,
    subDays,
    addMilliseconds
} from 'date-fns';

export const monthNames: Array<string> = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const nth = function (d: number) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
}

// export function getMaxDateByYear(year: string) {
//     return getYyyyMmDdFormat(new Date(year).getTime()- (24*60*60*1000));
// }
// export function getMinDateByYear(year: string) {
//     return getYyyyMmDdFormat(new Date(year));
// }



//Month 2nd, 2022
export function getMonthDateFormat(inputDate: Date): any {
    if (inputDate instanceof Date && !isNaN(inputDate.valueOf())) {
        return `${monthNames[inputDate.getMonth()]} ${inputDate.getDate()}${nth(inputDate.getDate())}, ${inputDate.getFullYear()}`
    } else {
        return inputDate;
    }
}
export function getDateMonthYearFormat(inputDate: Date): any {
    if (inputDate instanceof Date && !isNaN(inputDate.valueOf())) {
        return `${inputDate.getDate()} ${monthNames[inputDate.getMonth()]} ${inputDate.getFullYear()}`
    } else {
        return inputDate;
    }
}
export function getUpdatedMonthDateFormat(inputDate: Date): any {
    if (inputDate instanceof Date && !isNaN(inputDate.valueOf())) {
        return `${inputDate.getDate()}-${monthNames[inputDate.getMonth()].substring(0, 3)}-${inputDate.getFullYear()}`
    } else {
        return inputDate;
    }
}
export function getDdMmYyyyFormat(inputDate: any) {
    const dateValue = new Date(inputDate)
    if (isValid(dateValue)) {
        return format(dateValue, "dd-MM-yyyy");
    } else {
        return inputDate;
    }
}

export function getDdMmYyyyFormatFromString(inputDate: string) {
    if (!inputDate) {
        return "n/a";
    }
    const dateValue = parse(inputDate, "dd/MM/yyyy", new Date());
    if (isValid(dateValue)) {
        return format(dateValue, "dd-MM-yyyy");
    } else {
        return inputDate;
    }
}
export function getDdMmYyyyWithMonthNameFormat(inputDate: any) {
    if (!inputDate) {
        return "n/a";
    }
    const dateValue = new Date(inputDate)
    if (isValid(dateValue)) {
        return format(dateValue, "dd-MMM-yyyy");
    } else {
        return inputDate;
    }
}

export function getDateWithTimeFormat(inputDate: any, inTimeZone?: boolean) {
    if (!inputDate) {
        return "-";
    }
    const dateValue = new Date(inputDate);
    if (isValid(dateValue)) {
        if (inTimeZone) {
            const utcDate = new Date(inputDate);
            const timeZoneOffset = utcDate.getTimezoneOffset();
            const localDate = addMinutes(utcDate, timeZoneOffset);
            return format(localDate, "dd-MMM-yyyy, hh:mm aa");
        } else {
            return format(dateValue, "dd-MMM-yyyy, hh:mm aa");
        }
    } else {
        return inputDate;
    }
}
export function getTimeFormatWithTimeZone(inputDate: any, inTimeZone?: boolean) {
    if (!inputDate) {
        return "-";
    }
    const dateValue = new Date(inputDate);
    if (isValid(dateValue)) {
        if (inTimeZone) {
            const utcDate = new Date(inputDate);
            const timeZoneOffset = utcDate.getTimezoneOffset();
            const localDate = addMinutes(utcDate, timeZoneOffset);
            return format(localDate, "hh:mm aa");
        } else {
            return format(dateValue, "hh:mm aa");
        }
    } else {
        return inputDate;
    }
}
export function getDisplayMMMYYYYFormat(inputDate: any) {
    if (!inputDate) {
        return "-";
    }
    return format(parseISO(inputDate), "MMM - yyyy");
}

export function getDisplayDateForTableFormat(inputDate: any) {
    if (!inputDate) {
        return "-";
    }
    const dateValue = new Date(inputDate)
    if (isValid(dateValue)) {
        return format(dateValue, "dd-MMM-yyyy");
    } else {
        return inputDate;
    }
}
export function getFormattedDateForTable(inputDate: any) {
    if (!inputDate) {
        return "-";
    }
    const dateValue = new Date(inputDate)
    if (isValid(dateValue)) {
        return format(dateValue, "MMM dd");
    } else {
        return inputDate;
    }
}

export function getFormattedDateddMMMYYYY(inputDate: any) {
    if (!inputDate) {
        return "-";
    }
    const dateValue = new Date(inputDate)
    if (isValid(dateValue)) {
        return format(dateValue, "dd MMM yyyy");
    } else {
        return inputDate;
    }
}
export function getFormatteddateddMMMYYYY(inputDate: any) {
    if (!inputDate) {
        return "-";
    }
    const dateValue = new Date(inputDate)
    if (isValid(dateValue)) {
        return format(dateValue, "dd MMM, yyyy");
    } else {
        return inputDate;
    }
}
export function calculateRemainingDays(dateOfBirth: string): number {
    // Parse the input DOB and get the current date
    const dob = parseISO(dateOfBirth);
    const currentDate = new Date();

    // Update DOB year to match the current year
    const dobThisYear = setYear(dob, currentDate.getFullYear());

    const remainingDays = differenceInDays(dobThisYear, currentDate);

    return remainingDays + 1;
}



export function formatTimeInput(input: string): string {

    if (!input) {
        return '';
    }
    let date;

    // Case 1: ISO format (with T and time)
    if (input.includes('T')) {
        date = parseISO(input);
    } else {
        // Case 2: Only time string, assume today's date
        const today = new Date();
        date = parse(input, 'HH:mm', today);
    }

    // Check validity
    if (!isValid(date)) {
        return 'Invalid date';
    }

    return format(date, 'hh:mm a'); // returns in 12-hour format with AM/PM
}

export const parseAndFormatDate = (date: string) => {
    if (!date) {
        return "";
    }
    const parsedDate = parseISO(date);
    if (isNaN(parsedDate.getTime())) {
        throw new Error(`Invalid date format: ${date}`);
    }
    return format(parsedDate, "yyyy-MM-dd'T'HH:mm");
};

export function getTimeFormat(inputDate: string) {
    const dateValue = parseISO(inputDate);
    if (isValid(dateValue)) {
        return format(dateValue, "hh:mm aa");
    } else {
        return inputDate;
    }
}

export const Current_time = format(new Date(), "HH:mm");
export function getYyyyMmDdFormat(inputDate: any) {
    if (!inputDate) {
        return "-";
    }
    const dateValue = new Date(inputDate)
    if (isValid(dateValue)) {
        return format(dateValue, "yyyy-MM-dd");
    } else {
        return inputDate;
    }
}

export function getFormYyyyMmDdFormat(inputDate: any) {
    const dateValue = new Date(inputDate)
    if (isValid(dateValue)) {
        return format(dateValue, "yyyy-MM-dd");
    } else {
        return null;
    }
}

export function getCurrentTimezoneYyyyMmDdFormat(inputDate: any) {
    if (!inputDate) {
        return "-";
    }
    const dateValue = new Date(inputDate)
    if (isValid(dateValue)) {
        const isoDate = parseISO(inputDate);
        return format(isoDate, 'dd-MMM-yyyy');
    } else {
        return null;
    }
}

export function subtractYearYyyyMmDdFormat(inputDate: any) {
    const dateValue = new Date(inputDate);
    if (isValid(dateValue)) {
        const updatedDate = subYears(dateValue, 1);
        return format(updatedDate, "yyyy-MM-dd");
    } else {
        return null;
    }
}

export function getDateDdMMFormat(inputDate: any) {
    if (!inputDate) {
        return "-";
    }
    const dateValue = new Date(inputDate)
    if (isValid(dateValue)) {
        return format(dateValue, "do MMM");
    } else {
        return inputDate;
    }
}

export function getTimeHHMMSSFormat(inputDate: any) {
    if (!inputDate) {
        return "-";
    }
    const dateValue = new Date(inputDate)
    if (isValid(dateValue)) {
        return format(dateValue, "hh:mm aa");
    } else {
        return inputDate;
    }
}

export const formatToTimeWithPeriod = (timeStr: string): string => {
    if (!timeStr) return '';
    const parsedDate = parse(timeStr, 'HH:mm:ss', new Date());
    return format(parsedDate, 'hh:mm a');
};

export function convertToFullTimeFormat(timeStr: string): string {
    if (!timeStr) return '';
    const parsedDate = parse(timeStr, 'HH:mm', new Date());
    return format(parsedDate, 'HH:mm:ss');
}

export const convertUTCToISTTimeOnly = (utcTime: string): string => {
    if (!utcTime) return "";

    try {
        let [hours, minutes] = utcTime.split(":").map(Number);

        // Add IST offset (5 hours 30 minutes)
        hours += 5;
        minutes += 30;

        // Adjust overflow of minutes
        if (minutes >= 60) {
            minutes -= 60;
            hours += 1;
        }

        // Adjust overflow of hours
        if (hours >= 24) {
            hours -= 24; // next day
        }

        // Convert to 12-hour format
        const suffix = hours >= 12 ? "PM" : "AM";
        const twelveHour = hours % 12 === 0 ? 12 : hours % 12;

        // Format with leading zeros
        const hh = String(twelveHour).padStart(2, "0");
        const mm = String(minutes).padStart(2, "0");

        return `${hh}:${mm} ${suffix}`;
    } catch (error) {
        console.error("Error converting UTC to IST time:", error);
        return "";
    }
};
export const convertUTCToISTTime = (utcTime: string): string => {
    if (!utcTime) return "";

    try {
        let [hours, minutes, seconds] = utcTime.split(":").map(Number);

        // Add IST offset (5 hours 30 minutes)
        let totalMinutes = hours * 60 + minutes + 330; // 330 = 5h30m

        // Handle overflow (next day wrap-around)
        totalMinutes = totalMinutes % (24 * 60);

        const istHours = Math.floor(totalMinutes / 60);
        const istMinutes = totalMinutes % 60;

        // Format with leading zeros
        const hh = String(istHours).padStart(2, "0");
        const mm = String(istMinutes).padStart(2, "0");

        return `${hh}:${mm}`;
    } catch (error) {
        console.error("Error converting UTC to IST time:", error);
        return "";
    }
};

export function getAcademicYears(endYear: any, startYear: any = 1960, buffer: any = 1, order: string = 'desc') {
    let years: any = [];
    if (order === "asc") {
        let y = +startYear;
        while (y !== +endYear + +buffer) {
            years.push({ year: y });
            y++;
        }
    }
    else {
        let y = +endYear + +buffer;
        while (y !== +startYear) {
            years.push({ year: y });
            y--;
        }
    }
    return years;
}
export function convertToFullTime(dateString: string): string | null {
    const parsedDate = parseISO(dateString)
    if (isValid(parsedDate)) {
        return format(parsedDate, "yyyy-MM-dd'T'HH:mm:ss")
    }
    else {
        return null
    }
}
export function convertFullTime(dateString: string): string | null {
    const parsedDate = parseISO(dateString)
    if (isValid(parsedDate)) {
        return format(parsedDate, "yyyy-MM-dd' 'HH:mm:ss")
    }
    else {
        return null
    }
}
export function convertToFullTimeWithPeriod(dateString: string): string | null {
    const parsedDate = parseISO(dateString)
    if (isValid(parsedDate)) {
        return format(parsedDate, "yyyy-MM-dd'T'23:59:59")
    }
    else {
        return null
    }
}

export const dateFormatter = (date: string): string => {
    if (!date) {
        return "";
    }
    else {
        const currentDate = new Date();
        const time = format(currentDate, "HH:mm:ss");
        const formattedDate = format(new Date(parseISO(date)), "yyyy-MM-dd");
        return `${formattedDate}T${time}Z`;
    }
};

export function getDateByYear(year: string, type?: string) {
    return getYyyyMmDdFormat(new Date(year).getTime() - (24 * 60 * 60 * 1000));
}
export function getMaxDateByYear(year: string) {
    return getYyyyMmDdFormat(new Date(year).getTime() - (24 * 60 * 60 * 1000));
}
export function getMinDateByYear(year: string) {
    return getYyyyMmDdFormat(new Date(year));
}
export function getGapedYear(gap: number) {
    return getYyyyMmDdFormat(new Date(`${(+(new Date().getFullYear()) - gap)}`));
}


export function getYearGapCurrentDate(yearGap: number) {
    if (!isNaN(yearGap)) {
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() - yearGap);
        return currentDate;
    } else {
        return new Date();
    }
}


export const getDateTime = (dateTime: string | null): string => {
    if (!dateTime) {
        return "-";
    }
    const dateObject = new Date(dateTime);
    const date = getDdMmYyyyWithMonthNameFormat(dateObject);

    const time = dateObject.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
    return `${date}, ${time}`;
};


export function getParticularFormatDate(inputDate: any, outputFormat: ("yyyy-MM-dd" | "dd-MM-yyyy" | "MM-dd-yyyy")) {
    if (!inputDate) {
        return "-";
    }
    const dateValue = new Date(inputDate)
    if (isValid(dateValue)) {
        return format(dateValue, outputFormat);
    } else {
        return undefined;
    }
}

export function getValidDate(inputString: string | null | undefined) {
    if (!inputString) {
        return null;
    }
    const dateValue = new Date(inputString);
    if (isValid(dateValue)) {
        return dateValue;
    } else {
        return null;
    }
}

export const convertTo24HourFormat = (time12: any) => {
    const parsedTime = parse(time12, 'hh:mm a', new Date());
    const parse24Time = parse(time12, 'HH:mm', new Date());
    if (isValid(parsedTime) && time12 && ((time12?.includes("AM")) || ((time12?.includes("PM"))))) {
        const time24 = format(parse(time12, 'h:mm aa', new Date()), 'HH:mm');
        return time24;
    }
    else if (isValid(parse24Time) && time12) {
        return time12;
    }

    return;
};

export const convertTo12HourFormat = (time24: any) => {
    if (time24 && (!(time24?.includes("AM")) || (!(time24?.includes("PM"))))) {
        const time12 = format(parse(time24, 'HH:mm', new Date()), 'h:mm aa');
        return time12;
    }
    return;
};

export const convertTo12HourFormatWith2DigitTime = (time24: any) => {
    if (!time24) return
    if (time24 && (!(time24?.includes("AM")) || (!(time24?.includes("PM"))))) {
        const time12 = format(parse(time24, 'HH:mm', new Date()), 'hh:mm aa');
        return time12;
    }
    return;
};



export function getDurationBetweenDates(startDate: any, endDate: any) {
    if (!isValid(new Date(startDate)) || !isValid(new Date(endDate))) {
        return "Invalid Date";
    }
    if (isAfter(new Date(startDate), new Date(endDate))) {
        return "0 years";
    }
    const duration = intervalToDuration({ start: new Date(startDate), end: new Date(endDate) });
    return Object.keys(duration).reduce((durationInString, item) => {
        if ((item === "years" || item === "months" || item === "days") && duration[item]) {
            durationInString += `${duration[item]} ${item} `;
        }
        return durationInString;
    }, "");
}

export function getDateAfterCurrentDay(days: number) {
    const today = new Date();
    const futureDate = addDays(today, +days);
    return format(futureDate, 'yyyy-MM-dd');
}

export function getDateDifferenceInDays(endDate: any, startDate: any) {
    if (!startDate || !endDate || !isValid(new Date(startDate)) || !isValid(new Date(endDate))) {
        return "-";
    }
    const dateDiff = differenceInDays(new Date(endDate), new Date(startDate));
    return dateDiff < 0 ? '-' : dateDiff === 0 ? '01' : dateDiff.toString().padStart(2, '0');
}

export function isSmallerThanCompareDate(date: any, compareDate: any) {
    if (!date || !compareDate || !isValid(new Date(date)) || !isValid(new Date(compareDate))) {
        return true;
    }
    return isBefore(new Date(date), new Date(compareDate)) || isEqual(new Date(date), new Date(compareDate));
}

export function isGreaterThanCompareDate(date: any, compareDate: any) {
    if (!date || !compareDate || !isValid(new Date(date)) || !isValid(new Date(compareDate))) {
        return true;
    }
    return isAfter(new Date(date), new Date(compareDate)) || isEqual(new Date(date), new Date(compareDate));
}

export function getDatesForMonth(year: number, month: number) {
    if (year && month) {
        const startOfSpecifiedMonth = new Date(year, month - 1, 1);
        const endOfSpecifiedMonth = endOfMonth(startOfSpecifiedMonth);

        const daysInMonth = eachDayOfInterval({
            start: startOfSpecifiedMonth,
            end: endOfSpecifiedMonth
        });

        return daysInMonth.map(date => format(date, 'yyyy-MM-dd'));
    } else {
        return []
    }
}

export const getDayOfWeek = (dateString: string) => {
    const date = parseISO(dateString);
    if (isValid(date)) {
        const date = new Date(dateString);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return daysOfWeek[getDay(date)];
    }
    return "";
};


export const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? date : "";
};

export const getDayOfMonth = (dateString: string) => {
    const date = parseISO(dateString);
    if (isValid(date)) {
        return format(date, 'dd');
    }
    return "";
};

export const getFormattedDate = (date: Date | string | number) => {
    if (date) {
        return format(new Date(date), 'yyyy-MM-dd');
    }
    return "";
};
const monthMap: { [key: string]: number } = {
    JANUARY: 1,
    FEBRUARY: 2,
    MARCH: 3,
    APRIL: 4,
    MAY: 5,
    JUNE: 6,
    JULY: 7,
    AUGUST: 8,
    SEPTEMBER: 9,
    OCTOBER: 10,
    NOVEMBER: 11,
    DECEMBER: 12,
};

export const getShortMonth = (monthName: string) => {
    const monthMap: { [key: string]: string } = {
        'January': 'Jan',
        'February': 'Feb',
        'March': 'Mar',
        'April': 'Apr',
        'May': 'May',
        'June': 'Jun',
        'July': 'Jul',
        'August': 'Aug',
        'September': 'Sep',
        'October': 'Oct',
        'November': 'Nov',
        'December': 'Dec'
    };
    return monthMap[monthName] || monthName;
};
export const getFilteredDates = (year: number, selectedMonth: string, startDate: string, endDate: string) => {
    if (year && selectedMonth && startDate && endDate) {
        const allDates = getDatesForMonth(year, monthMap[selectedMonth?.toUpperCase()]);

        const start = parseDate(startDate);
        const end = parseDate(endDate);

        const dateList = allDates.filter(date => {
            const currentDate = parseDate(date);
            return currentDate >= start && currentDate <= end;
        });

        return dateList;
    }
    return [];
}

export function formatCustomDate(date: Date): string {
    if (date) {
        return format(date, "MMMM dd,yyyy");
    }
    return "";
}
export function formatCustomTime(date: Date): string {
    if (date) {
        return format(date, "hh:mm:ss a");
    }
    return "";
}
export const generateWeekLabel = (weekStartDate: string, weekEndDate: string) => {
    if (isValid(parseISO(weekStartDate)) && isValid(parseISO(weekEndDate))) {
        const start = parseISO(weekStartDate);
        const end = parseISO(weekEndDate);

        return `${format(start, "d MMM")} - ${format(end, "d MMM, yyyy")}`;
    }
    return '';
};

export const calculateAge = (dobString: string) => {
    const dob = new Date(dobString);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    if (
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
    ) {
        age--;
    }

    return age;
}

export const getPreviousDateFromToday = (days: number) => {
    return format(subDays(new Date(), days), "yyyy-MM-dd");
};



export function getAssessmentDuration(startDateStr: string, endDateStr: string) {
    // Use date-fns isValid
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    if (!isValid(startDate) || !isValid(endDate)) return null;
    
    let msDiff = differenceInMilliseconds(endDate, startDate);
    if (msDiff < 0) msDiff = 0;
    const days = Math.floor(msDiff / (1000 * 60 * 60 * 24));
    const remainderMs = msDiff % (1000 * 60 * 60 * 24);
    const duration = intervalToDuration({
        start: startDate,
        end: addMilliseconds(startDate, remainderMs),
    });

    return {
        days,
        hours: duration.hours,
        minutes: duration.minutes,
        seconds: duration.seconds,
    };
}


export const Min_Date = "01-01-1970";
export const Min_Date_Employee = "01-01-1940";
export const MinDateEmployee_Calendar = "1940-01-01";
export const MinDate_Calendar = "1970-01-01";
export const MinDate_YYYYMMDD = "1970-01-01";
export const MinEmployee_YYYYMMDD = "1940-01-01";

export const Min_Date_EMPLOYEE = "01-01-1950";
export const MinDate_YYYYMMDD_EMPLOYEE = "1950-01-01";


export const Max_Date = "31-12-2099";
export const MaxDate_Calendar = "2099-01-01";
export const Current_Date = getYyyyMmDdFormat(new Date());
export const Current_Month_UpperCase = format(new Date(), 'LLLL').toUpperCase()
export const Current_Year = new Date().getFullYear();
export const Current_Date_DDMMYYYY = getDdMmYyyyFormat(new Date());
export const Current_Date_YYYYMMDD = getYyyyMmDdFormat(new Date());
export const Today_Date = new Date()

export const getDifferenceInHours = (startTime: any, endTime: any) => {
    if (!startTime || !endTime) {
        return 0;
    }
    // The logic is based on swapping the times for calculation
    const start = new Date(`1970-01-01T${endTime}`);
    const end = new Date(`1970-01-01T${startTime}`);
    const diff = end.getTime() - start.getTime();
    return diff / (1000 * 60 * 60);
}

export const getMinutesLabel = (minutes?: number | null) => {
  if (!minutes || minutes <= 0) return '-';

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hrs && mins) return `${hrs} hr${hrs > 1 ? 's' : ''} ${mins} min${mins > 1 ? 's' : ''}`;
  if (hrs) return `${hrs} hr${hrs > 1 ? 's' : ''}`;
  return `${mins} min${mins > 1 ? 's' : ''}`;
};
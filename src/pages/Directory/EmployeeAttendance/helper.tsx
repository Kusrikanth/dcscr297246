import { eachMonthOfInterval, format, isSunday } from "date-fns";
import { UserDetails } from "../../../Components/Common";
import { getDayOfMonth, getDayOfWeek, getFilteredDates, getFormattedDate } from "../../../utility/dateutility";
import { default as PresentMark } from "../../../assets/imagesdps/attendence/PresentMark.svg?react";
import { default as AbsentMark } from "../../../assets/imagesdps/attendence/AbsentMark.svg?react";  
import { default as HolidayMark } from "../../../assets/imagesdps/attendence/HolidayMark.svg?react";



const generateDynamicColumns = (selectedMonth: string, year: number,startDate: string, endDate: string, openPreviewModalHndlr: any) => {
    
    // let dateList = getFilteredDates(year,selectedMonth,startDate,endDate);
    let dateList = ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07', '2024-01-08', '2024-01-09', '2024-01-10', '2024-01-11', '2024-01-12', '2024-01-13', '2024-01-14', '2024-01-15', '2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19', '2024-01-20', '2024-01-21', '2024-01-22', '2024-01-23', '2024-01-24', '2024-01-25', '2024-01-26', '2024-01-27', '2024-01-28', '2024-01-29', '2024-01-30', '2024-01-31']
    

    return dateList.map((item, index) => {
        const dayOfWeek = getDayOfWeek(item);
        const dayOfMonth = getDayOfMonth(item);
    
        return {
            Header: () => (
                <div className="d-flex flex-column">
                    <span>{dayOfMonth}</span>
                    <span>{dayOfWeek.slice(0, 3)}</span>
                </div>
            ),
            accessor: `${item}-${index}`,
            disableSortBy: true,
            Cell: ({ row: { original }, rowDataInfo }: any) => {
                const isHoliday = rowDataInfo?.some((record: any) => {
                    const recordDate = getFormattedDate(record.holidayDate);
                    return recordDate === item;
                });
    
                const attendanceRecord = original.dateWiseAttendanceRecords?.find((record: any) => {
                    const recordDate = format(new Date(record.attendanceDate), 'yyyy-MM-dd');
                    return recordDate === item;
                });
    
                if (isHoliday || isSunday(new Date(item))) {
                    return <HolidayMark key={`${item}-${index}-${original?.studentCode}`} />;
                } else if (attendanceRecord) {
                    const handleClick = () => {
                        openPreviewModalHndlr({
                            date: item,
                            attendance: attendanceRecord.attendance,
                            day: getDayOfWeek(item),
                            studentCode: original?.studentCode,
                        });
                    };
    
                    if (attendanceRecord.attendance === "PRESENT") {
                        return (
                            <div onClick={handleClick} style={{ cursor: "pointer" }}>
                                <PresentMark key={`${item}-${index}-${original?.studentCode}`} />
                            </div>
                        );
                    } else if (attendanceRecord.attendance === "ABSENT") {
                        return (
                            <div onClick={handleClick} style={{ cursor: "pointer" }}>
                                <AbsentMark key={`${item}-${index}-${original?.studentCode}`} />
                            </div>
                        );
                    } else if (attendanceRecord.attendance === "HOLIDAY") {
                        return <HolidayMark key={`${item}-${index}-${original?.studentCode}`} />;
                    } else if (attendanceRecord.attendance === "NOT_MARKED") {
                        return "-";
                    }
                }
    
                return "-";
            },
        };
    });
    
};


export function generateColumns(selectedMonth: string, year: any, startDate: string, endDate: string,openPreviewModalHndlr: any) {

    return [
        {
            Header: "Employee Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "sticky-left w-200px min-w-200px max-w-200px",
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            displayName={original?.studentName}
                            displayId={original?.studentCode}
                            size={"xs"}
                            defaultImgType="student"
                        //   contentNotCenter={true}
                        //   paddingTop={"pt-2"}
                        />
                    </>
                );
            },
        },
        {
            Header: "Employee Code",
            accessor: "rollNumber",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                  <>
                    <span>{original?.rollNo || "N/A"}</span>
                  </>
                );
              },
        },
        ...generateDynamicColumns(selectedMonth, year, startDate, endDate,openPreviewModalHndlr),
        {
            Header: "Total",
            accessor: "total",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                let dateList = getFilteredDates(year,selectedMonth,startDate,endDate);
                
                const totalDaysInMonth = dateList.length;
                const presentDays = original.dateWiseAttendanceRecords?.reduce((count: number,record: any) => {
                    const isPresent  = record.attendance === "PRESENT";
                    if (isPresent) {    
                        count++;
                    }
                    return count;
                },0) || 0;

                return (
                    <span>{`${presentDays}/${totalDaysInMonth}`}</span>
                );
                
            }
        },
        
    ];
}

export const formatAcademicYearDates = (academicYearData: any, academicYearId: string) => {
    if(academicYearData && academicYearId){
        const selectedYear = academicYearData.find((year: any) => +year.academicYearId === +academicYearId);
        if (selectedYear) {
          const { startDate, endDate } = selectedYear;
          const months = eachMonthOfInterval({
            start: new Date(startDate),
            end: new Date(endDate)
          });
          return months.map(month => ({
            id: `${format(month, 'MMMM')}-${format(month, 'yyyy')}`,
            name: format(month, 'MMM - yyyy').toUpperCase(), 
          }));
        }
    }
    return [];
  };
  
export const calculateWorkingDays = (selectedMonth: string, year: any, rowDataInfo: any, startDate: string, endDate: string) => {
    let dateList = getFilteredDates(year,selectedMonth,startDate,endDate);

    const totalDaysInMonth = dateList.length;

    const holidays = dateList.filter((item) => {
        const dayOfMonth = getDayOfMonth(item);
        
        const isHoliday = rowDataInfo && rowDataInfo?.some((record: any) => {
            const recordDate = getFormattedDate(record.holidayDate);
            return recordDate === item;
        });

        const sunday = isSunday(new Date(item))

        return isHoliday || sunday;
    });

    const workingDays = totalDaysInMonth - holidays.length;
    
    return {
        holidays: holidays.length,
        workingDays,
    };
};

export const dummmyData = Array.from({ length: 10 }).map((_, index) => ({
    studentName: `Employee ${index + 1}`,
    studentCode: `E00${index + 1}`,
    rollNo: `1234${index + 1}`,
    dateWiseAttendanceRecords: [
        { attendanceDate: "2024-01-10", attendance: "PRESENT" },
        { attendanceDate: "2024-01-11", attendance: "ABSENT" },
        { attendanceDate: "2024-01-12", attendance: "HOLIDAY" },
        { attendanceDate: "2024-01-13", attendance: "NOT_MARKED" },
        { attendanceDate: "2024-01-14", attendance: "PRESENT" },
        { attendanceDate: "2024-01-15", attendance: "ABSENT" },
        { attendanceDate: "2024-01-16", attendance: "HOLIDAY" },
        { attendanceDate: "2024-01-17", attendance: "NOT_MARKED" },
        { attendanceDate: "2024-01-18", attendance: "PRESENT" },
        { attendanceDate: "2024-01-19", attendance: "ABSENT" },
        { attendanceDate: "2024-01-20", attendance: "HOLIDAY" },
        { attendanceDate: "2024-01-21", attendance: "NOT_MARKED" },
        { attendanceDate: "2024-01-22", attendance: "PRESENT" },
        { attendanceDate: "2024-01-23", attendance: "ABSENT" },
        { attendanceDate: "2024-01-24", attendance: "HOLIDAY" },
        { attendanceDate: "2024-01-25", attendance: "NOT_MARKED" },
        { attendanceDate: "2024-01-26", attendance: "PRESENT" },
        { attendanceDate: "2024-01-27", attendance: "ABSENT" },
        { attendanceDate: "2024-01-28", attendance: "HOLIDAY" },
        { attendanceDate: "2024-01-29", attendance: "NOT_MARKED" },
        { attendanceDate: "2024-01-30", attendance: "PRESENT" },
        { attendanceDate: "2024-01-31", attendance: "ABSENT" },
    ],
}));


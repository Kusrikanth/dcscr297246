import { Button } from "reactstrap";
import { InputCheckbox, StatusLabel, TextInput, UserDetails } from "../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl } from "../../../Components/Common/MenuOptions";
import { default as ApproveSvg } from "../../../assets/imagesdps/academics/ApproveSvg.svg?react";
import { eachMonthOfInterval, format, getDaysInMonth, isSunday, isWeekend } from "date-fns";
import { getDatesForMonth, getDayOfMonth, getDayOfWeek, getFilteredDates, getFormattedDate, getYyyyMmDdFormat, parseDate, Today_Date } from "../../../utility/dateutility";
import React, { useEffect, useMemo, useState } from "react";


export const PresentMark = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 28 28">
            <g id="checkmark-circle_1_" data-name="checkmark-circle (1)" transform="translate(0.278 -1.214)">
                <path id="Path_1081" data-name="Path 1081" d="M22.75,28H5.25A5.25,5.25,0,0,1,0,22.75V5.25A5.25,5.25,0,0,1,5.25,0h17.5A5.25,5.25,0,0,1,28,5.25v17.5A5.25,5.25,0,0,1,22.75,28Z" transform="translate(-0.278 1.214)" fill="#9ae99a" opacity="0.75" />
                <path id="Path_1082" data-name="Path 1082" d="M16.574,18.539a1.789,1.789,0,0,1-2.531,0L11.508,16a1.79,1.79,0,1,1,2.531-2.531l1.27,1.27,3.506-3.506a6.528,6.528,0,1,0,2.016,3.044Z" transform="translate(-0.841 -1.016)" fill="#46d846" />
                <path id="Path_1083" data-name="Path 1083" d="M15.8,17.94a.593.593,0,0,1-.421-.175L12.843,15.23a.6.6,0,1,1,.844-.844L15.8,16.5l5.991-5.991a.6.6,0,0,1,.844.844l-6.414,6.414A.6.6,0,0,1,15.8,17.94Z" transform="translate(-1.331 -1.086)" fill="#46d846" />
            </g>
        </svg>

    )
}

export const AbsentMark = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 28 28">
            <g id="Group_6368" data-name="Group 6368" transform="translate(-814.541 -647.621)">
                <path id="Path_1081" data-name="Path 1081" d="M22.75,28H5.25A5.25,5.25,0,0,1,0,22.75V5.25A5.25,5.25,0,0,1,5.25,0h17.5A5.25,5.25,0,0,1,28,5.25v17.5A5.25,5.25,0,0,1,22.75,28Z" transform="translate(814.541 647.621)" fill="#fadbd3" opacity="0.75" />
                <path id="Path_1082" data-name="Path 1082" d="M17.086,19.068a1.9,1.9,0,0,1-2.682,0l-2.687-2.687A1.9,1.9,0,1,1,14.4,13.7l1.346,1.346L19.46,11.33A6.918,6.918,0,1,0,21.6,14.556Z" transform="translate(813.587 645)" fill="#fd7553" />
                <path id="Path_1083" data-name="Path 1083" d="M15.986,18.394a.629.629,0,0,1-.447-.185l-2.687-2.687a.632.632,0,0,1,.894-.894l2.24,2.24,6.349-6.349a.632.632,0,0,1,.894.894l-6.8,6.8A.637.637,0,0,1,15.986,18.394Z" transform="translate(813.345 644.965)" fill="#fd7553" />
            </g>
        </svg>

    )
}

export const HolidayMark = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 28 28">
        <g id="checkmark-circle_1_" data-name="checkmark-circle (1)" transform="translate(-0.458 -2.03)">
          <path id="Path_1081" data-name="Path 1081" d="M22.75,28H5.25A5.25,5.25,0,0,1,0,22.75V5.25A5.25,5.25,0,0,1,5.25,0h17.5A5.25,5.25,0,0,1,28,5.25v17.5A5.25,5.25,0,0,1,22.75,28Z" transform="translate(0.458 2.03)" fill="#eef0ee"/>
          <path id="Path_1082" data-name="Path 1082" d="M17.034,19.015a1.885,1.885,0,0,1-2.667,0L11.7,16.344a1.886,1.886,0,1,1,2.667-2.667L15.7,15.015,19.4,11.321a6.878,6.878,0,1,0,2.124,3.208Z" transform="translate(-0.457 -0.552)" fill="#bfc3bf"/>
          <path id="Path_1083" data-name="Path 1083" d="M15.967,18.348a.625.625,0,0,1-.444-.184l-2.671-2.671a.629.629,0,1,1,.889-.889l2.227,2.227,6.313-6.313a.629.629,0,1,1,.889.889l-6.758,6.758A.634.634,0,0,1,15.967,18.348Z" transform="translate(-0.723 -0.59)" fill="#bfc3bf"/>
        </g>
      </svg>
      
    )
}



const generateDynamicColumns = (selectedMonth: string, year: number,startDate: string, endDate: string) => {
    
    let dateList = getFilteredDates(year,selectedMonth,startDate,endDate);
    

    return dateList.map((item , index) => {
        const dayOfWeek = getDayOfWeek(item);
        const dayOfMonth = getDayOfMonth(item);
        
        return {
            Header: () => (
                <div className="tw-flex tw-flex-col">
                    <span>{dayOfMonth}</span>
                    <span>{dayOfWeek.slice(0, 3)}</span>
                </div>
            ),
            accessor: `${item}-${index}`,
            disableSortBy: true,
            Cell: ({ row: { original } , rowDataInfo }: any) => {

                const isHoliday = rowDataInfo && rowDataInfo?.some((record: any) => {
                    const recordDate = getFormattedDate(record.holidayDate);                    
                    return recordDate === item;
                });
                
                const attendanceRecord = original.dateWiseAttendanceRecords?.find((record: any) => {
                    const recordDate = format(new Date(record.attendanceDate), 'dd');
                    return recordDate === dayOfMonth;
                });
                if (isHoliday || isSunday(new Date(item))) {
                    return <HolidayMark key={`${item}-${index}-${original?.studentCode}`} />;
                }
                else if (attendanceRecord) {
                    if (attendanceRecord.attendance === "PRESENT") {
                        return <PresentMark key={`${item}-${index}-${original?.studentCode}`} />;
                    } else if (attendanceRecord.attendance === "ABSENT") {
                        return <AbsentMark key={`${item}-${index}-${original?.studentCode}`} />;
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


const RenderAttendanceCell = ({ row: { original, index }, column, rowDataInfo, onChangeInputHndlr }: any) => {
    const { item } = column || {};
    const date = format(new Date(item), 'yyyy-MM-dd')
    const attendanceRecord = useMemo(() => {
        return original.dateWiseAttendanceRecords.find((record: any) =>{
            const attendanceDate = format(new Date(record.attendanceDate), 'yyyy-MM-dd');
            return attendanceDate === date;
         });
    }, [original.dateWiseAttendanceRecords, item]);

    const isPresent = attendanceRecord?.attendance === "PRESENT";
    const matchId = attendanceRecord?.matchId;
    
    const isHoliday = useMemo(() => {
        return rowDataInfo?.some((record: any) =>{
            const recordDate = getFormattedDate(record.holidayDate);
            return recordDate === date;
          });
    }, [rowDataInfo, item]);

    const isCheckedInit = isPresent || false;
    const [isChecked, setIsChecked] = useState(isCheckedInit);


    const currentDate = parseDate(date);
    const isFutureDate = currentDate > Today_Date;

    const lastAttendedDate = original?.lastAttendedDate
        ? parseDate(format(new Date(original.lastAttendedDate), 'yyyy-MM-dd'))
        : null;

    const isDisabledByLastAttendedDate =
        lastAttendedDate ? currentDate > lastAttendedDate : false;

    if (isFutureDate) {
        return "-";
    }

    if (isHoliday || isSunday(new Date(date))) {
        return <HolidayMark key={`${date}-${index}-${original?.studentCode}`} />;
    }

    if (!attendanceRecord) {
        onChangeInputHndlr(original.studentId, matchId, date, false, null);
    }

    if (attendanceRecord?.attendance === "NOT_MARKED") { 
        onChangeInputHndlr(original.studentId, matchId, date, false, null); 
    }

    const handleCheckboxChange = (event: any) => {
        setIsChecked(event.target.checked);
        onChangeInputHndlr(original.studentId, matchId, date, event.target.checked, event);
    };
    
    

    return (
        <InputCheckbox
            name={`${date}-${index}-${original?.studentCode}`}
            value={isChecked}
            isDisabled={
                !original.isSelected ||          
                isDisabledByLastAttendedDate   
            }
            onChange={handleCheckboxChange}
        />
    );
};

const generateDynamicColumnsForAdd = (selectedMonth: string, year: number, startDate: string, endDate: string ) => {
    let dateList = getFilteredDates(year,selectedMonth,startDate,endDate);

    return dateList.map((item, index) => {
        const dayOfWeek = getDayOfWeek(item);
        const dayOfMonth = getDayOfMonth(item);
        
        return {
            Header: () => (
                <div className="tw-flex tw-flex-col">
                    <span>{dayOfMonth}</span>
                    <span>{dayOfWeek.slice(0, 3)}</span>
                </div>
            ),
            accessor: `${item}-${index}`,
            disableSortBy: true,
            item:item,
            Cell : RenderAttendanceCell,
        };
    });
};


export function generateColumns( selectedMonth: string , year: any, startDate: string, endDate: string) {
    return [
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-sticky-left tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
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
            Header: "Roll Number",
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
        ...generateDynamicColumns(selectedMonth, year, startDate, endDate),
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


export function generateColumnsForAdd( selectedMonth: string , year: any, startDate: string, endDate: string, allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any) {
    return [
        {
            Header: () => {
              return (
                <InputCheckbox
                  name={"all-student"}
                  // labelName={shortName}
                  value={allStudentSelectedState}
                  onChange={allStudentCheckHndlr}
                  formgroupClassName="tw-mb-0"
                />
              )
            },
            accessor: "isStudentChecked",
            columnClassName: "tw-w-5",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              const { studentId, isSelected } = original;
              return (
                <>
                  <InputCheckbox
                    name={`student-${studentId}`}
                    // labelName={shortName}
                    value={isSelected}
                    onChange={singleStudentCheckHndlr}
                    dataId={studentId}
                    formgroupClassName="tw-mb-0"
                  />
                </>
              )
            }
          },
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
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
            Header: "Roll Number",
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
        ...generateDynamicColumnsForAdd(selectedMonth, year, startDate, endDate),
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
export const exportAttendanceToExcel = (
  data,
  selectedMonth,
  selectedYear,
  holidayDetails,
  startDate,
  endDate
) => {
  // Generate date list for the month
  const dateList = getFilteredDates(selectedYear, selectedMonth, startDate, endDate);
  const totalDaysInMonth = dateList.length;
  
  // Calculate total working days (excluding holidays and sundays)
  const totalWorkingDays = dateList.filter(date => {
    const isHoliday = holidayDetails?.some(record => {
      const recordDate = getFormattedDate(record.holidayDate);
      return recordDate === date;
    });
    const isSundayDate = isSunday(new Date(date));
    return !isHoliday && !isSundayDate;
  }).length;
  
  // Create table HTML
  let tableHTML = `
    <table border="1">
      <thead>
        <tr style="background-color: #f0f0f0; font-weight: bold;">
          <th>Student Name</th>
          <th>Student Code</th>
          <th>Roll Number</th>
  `;
  
  // Add date headers with dates and day names in same row
  dateList.forEach(date => {
    const dayOfMonth = getDayOfMonth(date);
    const dayOfWeek = getDayOfWeek(date).slice(0, 3);
    tableHTML += `<th>${dayOfMonth}<br/>${dayOfWeek}</th>`;
  });
  
  tableHTML += `<th>Total</th></tr></thead><tbody>`;
  
  // Add student rows
  data.forEach(student => {
    tableHTML += `
      <tr>
        <td>${student.studentName || 'N/A'}</td>
        <td>${student.studentCode || 'N/A'}</td>
        <td>${student.rollNo || 'N/A'}</td>
    `;
    
    let presentCount = 0;
    
    // Add attendance for each date
    dateList.forEach((date, index) => {
      const dayOfMonth = getDayOfMonth(date);
      
      // Check if it's a holiday
      const isHoliday = holidayDetails?.some(record => {
        const recordDate = getFormattedDate(record.holidayDate);
        return recordDate === date;
      });
      
      // Check if it's Sunday
      const isSundayDate = isSunday(new Date(date));
      
      // Find attendance record for this date
      const attendanceRecord = student.dateWiseAttendanceRecords?.find(record => {
        const recordDate = format(new Date(record.attendanceDate), 'dd');
        return recordDate === dayOfMonth;
      });
      
      let cellContent = '-';
      let cellStyle = '';
      
      if (isHoliday || isSundayDate) {
        cellContent = 'H';
        cellStyle = 'background-color: #eef0ee;';
      } else if (attendanceRecord) {
        if (attendanceRecord.attendance === 'PRESENT') {
          cellContent = 'P';
          cellStyle = 'background-color: #9ae99a;';
          presentCount++;
        } else if (attendanceRecord.attendance === 'ABSENT') {
          cellContent = 'A';
          cellStyle = 'background-color: #fadbd3;';
        } else if (attendanceRecord.attendance === 'HOLIDAY') {
          cellContent = 'H';
          cellStyle = 'background-color: #eef0ee;';
        }
      }
      
      tableHTML += `<td style="${cellStyle}">${cellContent}</td>`;
    });
        
    tableHTML += `<td style="mso-number-format:'\\@';">${presentCount}/${totalDaysInMonth}</td></tr>`;
  });
  
  tableHTML += `</tbody></table>`;
  

  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:x="urn:schemas-microsoft-com:office:excel" 
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Attendance Report</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body>
        ${tableHTML}
      </body>
    </html>
  `;
  

  const blob = new Blob([excelContent], {
    type: 'application/vnd.ms-excel'
  });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Attendance_${selectedMonth}_${selectedYear}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

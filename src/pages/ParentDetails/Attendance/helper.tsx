import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";
import { default as RightIcon } from "../../../assets/imagesdps/attendence/RightIcon.svg?react";
import { default as WrongIcon } from "../../../assets/imagesdps/attendence/WrongIcon.svg?react";
import { default as LeaveIcon } from "../../../assets/imagesdps/attendence/LeaveIcon.svg?react";

const MonthWiseAttendanceDataNew: any = [];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

for (const month of months) {
  const monthDataNew: any = {
    monthName: month,
  };

  for (let day = 1; day <= 31; day++) {
    const accessor = `present_${day}`;
    const attendanceStatus = getAttendanceStatus();
    monthDataNew[accessor] = attendanceStatus;
  }

  MonthWiseAttendanceDataNew.push(monthDataNew);
}
export const MonthWiseAttendanceData = MonthWiseAttendanceDataNew

function getAttendanceStatus() {
  return Math.random() < 0.3 ? "present" : Math.random() < 0.6 ? "absent" : "holiday";
}

interface MonthItem {
  date: number;
  name: string;
  accessor: string;
}

const monthData: MonthItem[] = [];

for (let date = 1; date <= 31; date++) {
    monthData.push({
        date,
        name: getDayName(date), 
        accessor: `present_${date}`,
    });
}

export const month_Data = monthData;

function getDayName(date: any) {
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayIndex = new Date(new Date().getFullYear(), new Date().getMonth(), date).getDay();
  return dayNames[dayIndex];
}

const generateDynamicColumns = () =>
  month_Data
    ? month_Data.map((sub: any, index: any) => ({
      Header: () => {
        return (
          <div className="d-flex flex-column">
            <span>{sub.date}</span>
            <span>{sub.name}</span>
          </div>
        )
      },
      accessor: sub.accessor.toLowerCase().split(' ').join(''),
      disableSortBy: true,
      sub: sub,
      //   columnClassName: 'w-180px min-w-180px',
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="my-2">
            {original[sub.accessor] === "present" ? <span className='svg-icon' ><RightIcon /></span> : original[sub.accessor] === "absent" ? <span className='svg-icon-2' > <WrongIcon /></span> : original[sub.accessor] === "holiday" ? <span className='svg-icon-2' ><LeaveIcon /></span> : ""}
          </div>
        );
      },
    }))
    : [];

export function generateColumns() {
  return [
    {
      Header: "Employee Name",
      accessor: "monthName",
      columnClassName: "tw-w-[200px] tw-min-w-[200px]",
      disableSortBy: true,
    },
    ...generateDynamicColumns(),

  ];
}


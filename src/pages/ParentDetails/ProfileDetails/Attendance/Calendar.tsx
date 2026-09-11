import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import "./attendance_calender.scss";

interface CalendarProps {
  initialDate: string;
  data: any;
}

const Calendar: React.FC<CalendarProps> = ({ initialDate, data }) => {
  const dayCellContent = (info: any) => {
    const year = info.date.getFullYear();
    const month = (info.date.getMonth() + 1).toString().padStart(2, "0");
    const day = info.date.getDate().toString().padStart(2, "0");

    const dateKey = `${year}-${month}-${day}`;

    if (info.date.getDay() === 0) {
      return (
        <div className="calendar-cell-content tw-border tw-border-gray tw-rounded-full tw-flex tw-items-center tw-justify-center">
          <span>{info.date.getDate()}</span>
        </div>
      );
    }

    const borderColor =
      data[dateKey] === "PRESENT"
        ? "border-green"
        : data[dateKey] === "ABSENT"
        ? "border-red"
        : data[dateKey] === "HOLIDAY"
        ? "border-gray"
        : data[dateKey] === "LEAVE"
        ? "border-yellow"
        : "border-white";

    return (
      <div
        className={`calendar-cell-content border ${borderColor} tw-rounded-full tw-flex tw-items-center tw-justify-center`}
      >
        <span>{info.date.getDate()}</span>
      </div>
    );
  };

  return (
    <div>
      <FullCalendar
        key={initialDate}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        fixedWeekCount={true}
        dayMaxEventRows={true}
        initialDate={initialDate}
        headerToolbar={{
          start: "title",
          center: "",
          end: "",
        }}
        titleFormat={{
          month: "long",
          year : "numeric",
        }}
        height={330}
        scrollTime="00:00:00"
        nowIndicator={false}
        dayCellContent={dayCellContent}
      />
    </div>
  );
};

export default Calendar;

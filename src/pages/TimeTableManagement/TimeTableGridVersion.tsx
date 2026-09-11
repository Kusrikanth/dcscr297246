import React, { useState } from "react";
import classnames from "classnames";
import { useModal } from "../../hooks/modalhook";

const timeTableData = [
  {
    dayName: "Monday",
    dayId: "09-02-2025-mon",
    periods: [
      {
        periodTime: "08:00 - 08:15 AM",
        periodSubjectName: "Assembly",
        periodSubjectTeacher: "",
        periodName: "Assembly",
        periodId: "mon-p1",
      },
      {
        periodTime: "08:15 - 09:00 AM",
        periodSubjectName: "Math",
        periodSubjectTeacher: "Suresh",
        periodName: "P2",
        periodId: "mon-p2",
        periodTextColor: "#D97706",
        periodBorderColor: "#FACC15",
        periodBgColor: "#FACC151A",
      },
      {
        periodTime: "09:00 - 09:45 AM",
        periodSubjectName: "English",
        periodSubjectTeacher: "Anita",
        periodName: "P3",
        periodId: "mon-p3",
        periodTextColor: "#9333EA",
        periodBorderColor: "#C084FC",
        periodBgColor: "#C084FC1A",
      },
      {
        periodTime: "09:45 - 10:30 AM",
        periodSubjectName: "Science",
        periodSubjectTeacher: "Rajesh",
        periodName: "P4",
        periodId: "mon-p4",
        periodTextColor: "#BE123C",
        periodBorderColor: "#F43F5E",
        periodBgColor: "#FFE4E6",
      },
      {
        periodTime: "10:30 - 10:45 AM",
        periodSubjectName: "Break",
        periodName: "Break",
        periodId: "mon-p5",
      },
      {
        periodTime: "10:45 - 11:30 AM",
        periodSubjectName: "History",
        periodSubjectTeacher: "Sunita",
        periodName: "P6",
        periodId: "mon-p6",
        periodTextColor: "#15803D",
        periodBorderColor: "#34D399",
        periodBgColor: "#34D3991A",
      },
      {
        periodTime: "11:30 - 12:15 PM",
        periodSubjectName: "Geography",
        periodSubjectTeacher: "Deepak",
        periodName: "P7",
        periodId: "mon-p7",
        periodTextColor: "#0E7490",
        periodBorderColor: "#22D3EE",
        periodBgColor: "#22D3EE1A",
      },
      {
        periodTime: "12:15 - 01:00 PM",
        periodSubjectName: "Lunch",
        periodName: "Lunch",
        periodId: "mon-p8",
      },
      {
        periodTime: "01:00 - 01:45 PM",
        periodSubjectName: "Physics",
        periodSubjectTeacher: "Kiran",
        periodName: "P9",
        periodId: "mon-p9",
        periodTextColor: "#8B5CF6",
        periodBorderColor: "#A78BFA",
        periodBgColor: "#A78BFA1A",
      },
      {
        periodTime: "01:45 - 02:30 PM",
        periodSubjectName: "Chemistry",
        periodSubjectTeacher: "Meera",
        periodName: "P10",
        periodId: "mon-p10",
        periodTextColor: "#BE123C",
        periodBorderColor: "#F43F5E",
        periodBgColor: "#FFE4E6",
      },
      {
        periodTime: "02:30 - 03:15 PM",
        periodSubjectName: "Computer Science",
        periodSubjectTeacher: "Arjun",
        periodName: "P11",
        periodId: "mon-p11",
        periodTextColor: "#CA8A04",
        periodBorderColor: "#FCD34D",
        periodBgColor: "#FCD34D1A",
      },
      {
        periodTime: "03:15 - 04:00 PM",
        periodSubjectName: "Physical Education",
        periodSubjectTeacher: "Rahul",
        periodName: "P12",
        periodId: "mon-p12",
        periodTextColor: "#047857",
        periodBorderColor: "#10B981",
        periodBgColor: "#10B9811A",
      },
      {
        periodTime: "04:00 - 04:30 PM",
        periodSubjectName: "Diary Work",
        periodSubjectTeacher: "Priya",
        periodName: "P13",
        periodId: "mon-p13",
        periodTextColor: "#4338CA",
        periodBorderColor: "#6366F1",
        periodBgColor: "#6366F11A",
      },
    ],
  },
  {
    dayName: "Tuesday",
    dayId: "09-03-2025-tue",
    periods: [
      {
        periodTime: "08:00 - 08:15 AM",
        periodSubjectName: "Assembly",
        periodSubjectTeacher: "",
        periodName: "Assembly",
        periodId: "tue-p1",
      },
      {
        periodTime: "08:15 - 09:00 AM",
        periodSubjectName: "Biology",
        periodSubjectTeacher: "Amit",
        periodName: "P2",
        periodId: "tue-p2",
        periodTextColor: "#2563EB",
        periodBorderColor: "#60A5FA",
        periodBgColor: "#60A5FA1A",
      },
      {
        periodTime: "09:00 - 09:45 AM",
        periodSubjectName: "Chemistry",
        periodSubjectTeacher: "Meera",
        periodName: "P3",
        periodId: "tue-p3",
        periodTextColor: "#9D174D",
        periodBorderColor: "#F43F5E",
        periodBgColor: "#F43F5E1A",
      },
      {
        periodTime: "09:45 - 10:30 AM",
        periodSubjectName: "Math",
        periodSubjectTeacher: "Suresh",
        periodName: "P4",
        periodId: "tue-p4",
        periodTextColor: "#047857",
        periodBorderColor: "#10B981",
        periodBgColor: "#10B9811A",
      },
      {
        periodTime: "10:30 - 10:45 AM",
        periodSubjectName: "Break",
        periodName: "Break",
        periodId: "tue-p5",
      },
      {
        periodTime: "10:45 - 11:30 AM",
        periodSubjectName: "English",
        periodSubjectTeacher: "Anita",
        periodName: "P6",
        periodId: "tue-p6",
        periodTextColor: "#B45309",
        periodBorderColor: "#F59E0B",
        periodBgColor: "#F59E0B1A",
      },
      {
        periodTime: "11:30 - 12:15 PM",
        periodSubjectName: "Computer Science",
        periodSubjectTeacher: "Arjun",
        periodName: "P7",
        periodId: "tue-p7",
        periodTextColor: "#1E3A8A",
        periodBorderColor: "#3B82F6",
        periodBgColor: "#3B82F61A",
      },
      {
        periodTime: "12:15 - 01:00 PM",
        periodSubjectName: "Lunch",
        periodName: "Lunch",
        periodId: "tue-p8",
      },
      {
        periodTime: "01:00 - 01:45 PM",
        periodSubjectName: "Physics",
        periodSubjectTeacher: "Kiran",
        periodName: "P9",
        periodId: "tue-p9",
        periodTextColor: "#8B5CF6",
        periodBorderColor: "#A78BFA",
        periodBgColor: "#A78BFA1A",
      },
      {
        periodTime: "01:45 - 02:30 PM",
        periodSubjectName: "Geography",
        periodSubjectTeacher: "Deepak",
        periodName: "P10",
        periodId: "tue-p10",
        periodTextColor: "#0E7490",
        periodBorderColor: "#22D3EE",
        periodBgColor: "#22D3EE1A",
      },
      {
        periodTime: "02:30 - 03:15 PM",
        periodSubjectName: "History",
        periodSubjectTeacher: "Sunita",
        periodName: "P11",
        periodId: "tue-p11",
        periodTextColor: "#15803D",
        periodBorderColor: "#34D399",
        periodBgColor: "#34D3991A",
      },
      {
        periodTime: "03:15 - 04:00 PM",
        periodSubjectName: "Physical Education",
        periodSubjectTeacher: "Rahul",
        periodName: "P12",
        periodId: "tue-p12",
        periodTextColor: "#047857",
        periodBorderColor: "#10B981",
        periodBgColor: "#10B9811A",
      },
      {
        periodTime: "04:00 - 04:30 PM",
        periodSubjectName: "Diary Work",
        periodSubjectTeacher: "Priya",
        periodName: "P13",
        periodId: "tue-p13",
        periodTextColor: "#4338CA",
        periodBorderColor: "#6366F1",
        periodBgColor: "#6366F11A",
      },
    ],
  },
  {
    dayName: "Wednesday",
    dayId: "09-04-2025-wed",
    periods: [
      {
        periodTime: "08:00 - 08:15 AM",
        periodSubjectName: "Assembly",
        periodSubjectTeacher: "",
        periodName: "Assembly",
        periodId: "wed-p1",
      },
      {
        periodTime: "08:15 - 09:00 AM",
        periodSubjectName: "Math",
        periodSubjectTeacher: "Suresh",
        periodName: "P2",
        periodId: "wed-p2",
        periodTextColor: "#D97706",
        periodBorderColor: "#FACC15",
        periodBgColor: "#FACC151A",
      },
      {
        periodTime: "09:00 - 09:45 AM",
        periodSubjectName: "English",
        periodSubjectTeacher: "Anita",
        periodName: "P3",
        periodId: "wed-p3",
        periodTextColor: "#9333EA",
        periodBorderColor: "#C084FC",
        periodBgColor: "#C084FC1A",
      },
      {
        periodTime: "09:45 - 10:30 AM",
        periodSubjectName: "Science",
        periodSubjectTeacher: "Rajesh",
        periodName: "P4",
        periodId: "wed-p4",
        periodTextColor: "#BE123C",
        periodBorderColor: "#F43F5E",
        periodBgColor: "#FFE4E6",
      },
      {
        periodTime: "10:30 - 10:45 AM",
        periodSubjectName: "Break",
        periodName: "Break",
        periodId: "wed-p5",
      },
      {
        periodTime: "10:45 - 11:30 AM",
        periodSubjectName: "History",
        periodSubjectTeacher: "Sunita",
        periodName: "P6",
        periodId: "wed-p6",
        periodTextColor: "#15803D",
        periodBorderColor: "#34D399",
        periodBgColor: "#34D3991A",
      },
      {
        periodTime: "11:30 - 12:15 PM",
        periodSubjectName: "Geography",
        periodSubjectTeacher: "Deepak",
        periodName: "P7",
        periodId: "wed-p7",
        periodTextColor: "#0E7490",
        periodBorderColor: "#22D3EE",
        periodBgColor: "#22D3EE1A",
      },
      {
        periodTime: "12:15 - 01:00 PM",
        periodSubjectName: "Lunch",
        periodName: "Lunch",
        periodId: "wed-p8",
      },
      {
        periodTime: "01:00 - 01:45 PM",
        periodSubjectName: "Physics",
        periodSubjectTeacher: "Kiran",
        periodName: "P9",
        periodId: "wed-p9",
        periodTextColor: "#8B5CF6",
        periodBorderColor: "#A78BFA",
        periodBgColor: "#A78BFA1A",
      },
      {
        periodTime: "01:45 - 02:30 PM",
        periodSubjectName: "Chemistry",
        periodSubjectTeacher: "Meera",
        periodName: "P10",
        periodId: "wed-p10",
        periodTextColor: "#BE123C",
        periodBorderColor: "#F43F5E",
        periodBgColor: "#FFE4E6",
      },
      {
        periodTime: "02:30 - 03:15 PM",
        periodSubjectName: "Computer Science",
        periodSubjectTeacher: "Arjun",
        periodName: "P11",
        periodId: "wed-p11",
        periodTextColor: "#CA8A04",
        periodBorderColor: "#FCD34D",
        periodBgColor: "#FCD34D1A",
      },
      {
        periodTime: "03:15 - 04:00 PM",
        periodSubjectName: "Physical Education",
        periodSubjectTeacher: "Rahul",
        periodName: "P12",
        periodId: "wed-p12",
        periodTextColor: "#047857",
        periodBorderColor: "#10B981",
        periodBgColor: "#10B9811A",
      },
      {
        periodTime: "04:00 - 04:30 PM",
        periodSubjectName: "Diary Work",
        periodSubjectTeacher: "Priya",
        periodName: "P13",
        periodId: "wed-p13",
        periodTextColor: "#4338CA",
        periodBorderColor: "#6366F1",
        periodBgColor: "#6366F11A",
      },
    ],
  },
  {
    dayName: "Thursday",
    dayId: "09-05-2025-thu",
    periods: [
      {
        periodTime: "08:00 - 08:15 AM",
        periodSubjectName: "Assembly",
        periodSubjectTeacher: "",
        periodName: "Assembly",
        periodId: "thu-p1",
      },
      {
        periodTime: "08:15 - 09:00 AM",
        periodSubjectName: "Geography",
        periodSubjectTeacher: "Deepak",
        periodName: "P2",
        periodId: "thu-p2",
        periodTextColor: "#9D174D",
        periodBorderColor: "#DB2777",
        periodBgColor: "#DB27771A",
      },
      {
        periodTime: "09:00 - 09:45 AM",
        periodSubjectName: "Physics",
        periodSubjectTeacher: "Kiran",
        periodName: "P3",
        periodId: "thu-p3",
        periodTextColor: "#4C1D95",
        periodBorderColor: "#7C3AED",
        periodBgColor: "#7C3AED1A",
      },
      {
        periodTime: "09:45 - 10:30 AM",
        periodSubjectName: "Math",
        periodSubjectTeacher: "Suresh",
        periodName: "P4",
        periodId: "thu-p4",
        periodTextColor: "#065F46",
        periodBorderColor: "#059669",
        periodBgColor: "#0596691A",
      },
      {
        periodTime: "10:30 - 10:45 AM",
        periodSubjectName: "Break",
        periodName: "Break",
        periodId: "thu-p5",
      },
      {
        periodTime: "10:45 - 11:30 AM",
        periodSubjectName: "Chemistry",
        periodSubjectTeacher: "Meera",
        periodName: "P6",
        periodId: "thu-p6",
        periodTextColor: "#A16207",
        periodBorderColor: "#EAB308",
        periodBgColor: "#EAB3081A",
      },
      {
        periodTime: "11:30 - 12:15 PM",
        periodSubjectName: "History",
        periodSubjectTeacher: "Sunita",
        periodName: "P7",
        periodId: "thu-p7",
        periodTextColor: "#0F766E",
        periodBorderColor: "#14B8A6",
        periodBgColor: "#14B8A61A",
      },
      {
        periodTime: "12:15 - 01:00 PM",
        periodSubjectName: "Lunch",
        periodName: "Lunch",
        periodId: "thu-p8",
      },
      {
        periodTime: "01:00 - 01:45 PM",
        periodSubjectName: "Computer Science",
        periodSubjectTeacher: "Arjun",
        periodName: "P9",
        periodId: "thu-p9",
        periodTextColor: "#9D174D",
        periodBorderColor: "#DB2777",
        periodBgColor: "#DB27771A",
      },
      {
        periodTime: "01:45 - 02:30 PM",
        periodSubjectName: "English",
        periodSubjectTeacher: "Anita",
        periodName: "P10",
        periodId: "thu-p10",
        periodTextColor: "#4C1D95",
        periodBorderColor: "#7C3AED",
        periodBgColor: "#7C3AED1A",
      },
      {
        periodTime: "02:30 - 03:15 PM",
        periodSubjectName: "Physical Education",
        periodSubjectTeacher: "Rahul",
        periodName: "P11",
        periodId: "thu-p11",
        periodTextColor: "#065F46",
        periodBorderColor: "#059669",
        periodBgColor: "#0596691A",
      },
      {
        periodTime: "03:15 - 04:00 PM",
        periodSubjectName: "Biology",
        periodSubjectTeacher: "Amit",
        periodName: "P12",
        periodId: "thu-p12",
        periodTextColor: "#A16207",
        periodBorderColor: "#EAB308",
        periodBgColor: "#EAB3081A",
      },
      {
        periodTime: "04:00 - 04:30 PM",
        periodSubjectName: "Diary Work",
        periodSubjectTeacher: "Priya",
        periodName: "P13",
        periodId: "thu-p13",
        periodTextColor: "#0F766E",
        periodBorderColor: "#14B8A6",
        periodBgColor: "#14B8A61A",
      },
    ],
  },
  {
    dayName: "Friday",
    dayId: "09-06-2025-fri",
    periods: [
      {
        periodTime: "08:00 - 08:15 AM",
        periodSubjectName: "Assembly",
        periodSubjectTeacher: "",
        periodName: "Assembly",
        periodId: "fri-p1",
      },
      {
        periodTime: "08:15 - 09:00 AM",
        periodSubjectName: "Math",
        periodSubjectTeacher: "Suresh",
        periodName: "P2",
        periodId: "fri-p2",
        periodTextColor: "#B45309",
        periodBorderColor: "#D97706",
        periodBgColor: "#D977061A",
      },
      {
        periodTime: "09:00 - 09:45 AM",
        periodSubjectName: "English",
        periodSubjectTeacher: "Anita",
        periodName: "P3",
        periodId: "fri-p3",
        periodTextColor: "#6B21A8",
        periodBorderColor: "#9333EA",
        periodBgColor: "#9333EA1A",
      },
      {
        periodTime: "09:45 - 10:30 AM",
        periodSubjectName: "Physics",
        periodSubjectTeacher: "Kiran",
        periodName: "P4",
        periodId: "fri-p4",
        periodTextColor: "#065F46",
        periodBorderColor: "#059669",
        periodBgColor: "#0596691A",
      },
      {
        periodTime: "10:30 - 10:45 AM",
        periodSubjectName: "Break",
        periodName: "Break",
        periodId: "fri-p5",
      },
      {
        periodTime: "10:45 - 11:30 AM",
        periodSubjectName: "History",
        periodSubjectTeacher: "Sunita",
        periodName: "P6",
        periodId: "fri-p6",
        periodTextColor: "#9D174D",
        periodBorderColor: "#DB2777",
        periodBgColor: "#DB27771A",
      },
      {
        periodTime: "11:30 - 12:15 PM",
        periodSubjectName: "Computer Science",
        periodSubjectTeacher: "Arjun",
        periodName: "P7",
        periodId: "fri-p7",
        periodTextColor: "#0F766E",
        periodBorderColor: "#14B8A6",
        periodBgColor: "#14B8A61A",
      },
      {
        periodTime: "12:15 - 01:00 PM",
        periodSubjectName: "Lunch",
        periodName: "Lunch",
        periodId: "fri-p8",
      },
      {
        periodTime: "01:00 - 01:45 PM",
        periodSubjectName: "Biology",
        periodSubjectTeacher: "Amit",
        periodName: "P9",
        periodId: "fri-p9",
        periodTextColor: "#B45309",
        periodBorderColor: "#D97706",
        periodBgColor: "#D977061A",
      },
      {
        periodTime: "01:45 - 02:30 PM",
        periodSubjectName: "Chemistry",
        periodSubjectTeacher: "Meera",
        periodName: "P10",
        periodId: "fri-p10",
        periodTextColor: "#6B21A8",
        periodBorderColor: "#9333EA",
        periodBgColor: "#9333EA1A",
      },
      {
        periodTime: "02:30 - 03:15 PM",
        periodSubjectName: "Geography",
        periodSubjectTeacher: "Deepak",
        periodName: "P11",
        periodId: "fri-p11",
        periodTextColor: "#065F46",
        periodBorderColor: "#059669",
        periodBgColor: "#0596691A",
      },
      {
        periodTime: "03:15 - 04:00 PM",
        periodSubjectName: "Physical Education",
        periodSubjectTeacher: "Rahul",
        periodName: "P12",
        periodId: "fri-p12",
        periodTextColor: "#9D174D",
        periodBorderColor: "#DB2777",
        periodBgColor: "#DB27771A",
      },
      {
        periodTime: "04:00 - 04:30 PM",
        periodSubjectName: "Diary Work",
        periodSubjectTeacher: "Priya",
        periodName: "P13",
        periodId: "fri-p13",
        periodTextColor: "#0F766E",
        periodBorderColor: "#14B8A6",
        periodBgColor: "#14B8A61A",
      },
    ],
  },
  {
    dayName: "Saturday",
    dayId: "09-07-2025-sat",
    periods: [
      {
        periodTime: "08:00 - 08:15 AM",
        periodSubjectName: "Assembly",
        periodSubjectTeacher: "",
        periodName: "Assembly",
        periodId: "sat-p1",
      },
      {
        periodTime: "08:15 - 09:00 AM",
        periodSubjectName: "English",
        periodSubjectTeacher: "Anita",
        periodName: "P2",
        periodId: "sat-p2",
        periodTextColor: "#4A044E",
        periodBorderColor: "#86198F",
        periodBgColor: "#86198F1A",
      },
      {
        periodTime: "09:00 - 09:45 AM",
        periodSubjectName: "Math",
        periodSubjectTeacher: "Suresh",
        periodName: "P3",
        periodId: "sat-p3",
        periodTextColor: "#B45309",
        periodBorderColor: "#D97706",
        periodBgColor: "#D977061A",
      },
      {
        periodTime: "09:45 - 10:30 AM",
        periodSubjectName: "Science",
        periodSubjectTeacher: "Kiran",
        periodName: "P4",
        periodId: "sat-p4",
        periodTextColor: "#065F46",
        periodBorderColor: "#059669",
        periodBgColor: "#0596691A",
      },
      {
        periodTime: "10:30 - 10:45 AM",
        periodSubjectName: "Break",
        periodName: "Break",
        periodId: "sat-p5",
      },
      {
        periodTime: "10:45 - 11:30 AM",
        periodSubjectName: "Computer Science",
        periodSubjectTeacher: "Arjun",
        periodName: "P6",
        periodId: "sat-p6",
        periodTextColor: "#0F766E",
        periodBorderColor: "#14B8A6",
        periodBgColor: "#14B8A61A",
      },
      {
        periodTime: "11:30 - 12:15 PM",
        periodSubjectName: "General Knowledge",
        periodSubjectTeacher: "Sunita",
        periodName: "P7",
        periodId: "sat-p7",
        periodTextColor: "#9D174D",
        periodBorderColor: "#DB2777",
        periodBgColor: "#DB27771A",
      },
      {
        periodTime: "12:15 - 01:00 PM",
        periodSubjectName: "Lunch",
        periodName: "Lunch",
        periodId: "sat-p8",
      },
      {
        periodTime: "01:00 - 01:45 PM",
        periodSubjectName: "Art & Craft",
        periodSubjectTeacher: "Meera",
        periodName: "P9",
        periodId: "sat-p9",
        periodTextColor: "#6B21A8",
        periodBorderColor: "#9333EA",
        periodBgColor: "#9333EA1A",
      },
      {
        periodTime: "01:45 - 02:30 PM",
        periodSubjectName: "Physical Education",
        periodSubjectTeacher: "Rahul",
        periodName: "P10",
        periodId: "sat-p10",
        periodTextColor: "#B45309",
        periodBorderColor: "#D97706",
        periodBgColor: "#D977061A",
      },
      {
        periodTime: "02:30 - 03:15 PM",
        periodSubjectName: "Library",
        periodSubjectTeacher: "Priya",
        periodName: "P11",
        periodId: "sat-p11",
        periodTextColor: "#4A044E",
        periodBorderColor: "#86198F",
        periodBgColor: "#86198F1A",
      },
      {
        periodTime: "03:15 - 04:00 PM",
        periodSubjectName: "",
        periodSubjectTeacher: "Deepak",
        periodName: "P12",
        periodId: "sat-p12",
        periodTextColor: "#065F46",
        periodBorderColor: "#059669",
        periodBgColor: "#0596691A",
      },
      {
        periodTime: "04:00 - 04:30 PM",
        periodSubjectName: "Diary Work",
        periodSubjectTeacher: "Anita",
        periodName: "P13",
        periodId: "sat-p13",
        periodTextColor: "#0F766E",
        periodBorderColor: "#14B8A6",
        periodBgColor: "#14B8A61A",
      },
    ],
  },
];

const TimeTableGridVersion = () => {
  const [timeTable, setTimeTable] = useState(timeTableData);
  const uniquePeriods = timeTable[0].periods;

  const {
    closeModal: addEditCloseModal,
    openModal: addEditOpenModal,
    modalState: addEditModalState,
  } = useModal();

  return (
    <div>
      <div className="time-table-grid-container">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title mb-0">Time Table</h4>
          </div>

          <div className="card-body">
            <div
              className="time-table-grid"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${uniquePeriods.length + 1}, 1fr)`,
              }}
            >
              <div className="grid-item header d-flex align-items-center border bg-light rounded justify-content-center fw-bold">
                Days
              </div>
              {uniquePeriods.map((period) => (
                <div
                  className="grid-item header text-center place-content-center d-flex align-items-center justify-content-center flex-column border bg-light rounded fw-bold"
                  key={period.periodId}
                >
                  <p className="mb-0">{period.periodName}</p>
                  <p className="mb-0 text-muted fs-14">({period.periodTime})</p>
                </div>
              ))}

              {timeTable.map((day, dayIndex) => (
                <React.Fragment key={day.dayName}>
                  <div className="grid-item day-name text-center d-flex align-items-center border bg-light rounded justify-content-center fw-bold">
                    {day.dayName}
                  </div>
                  {day.periods.map((period, periodIndex) => {
                    if (
                      period.periodSubjectName === "Lunch" ||
                      period.periodSubjectName === "Assembly" ||
                      period.periodSubjectName === "Break"
                    ) {
                      if (dayIndex === 0) {
                        const cellColor =
                          period.periodSubjectName === "Lunch"
                            ? "#0EA5E91A"
                            : period.periodSubjectName === "Assembly"
                            ? "#10B9811A"
                            : period.periodSubjectName === "Break"
                            ? "#8B5CF61A"
                            : "";

                        return (
                          <div
                            className="grid-item text-center card mb-3 d-flex align-items-center justify-content-center h-auto shadow-none border"
                            style={{
                              gridRow: `2 / ${timeTable.length + 2}`,
                              gridColumn: `${periodIndex + 2}/${
                                periodIndex + 3
                              }`,
                              writingMode: "vertical-lr",
                              transform: "rotate(180deg)",
                              backgroundColor: `${cellColor}`,
                            }}
                            key={`${period.periodId}`}
                          >
                            <h3 className="mb-0">{period.periodSubjectName}</h3>
                          </div>
                        );
                      } else {
                        return (
                          <React.Fragment
                            key={`${period.periodId}`}
                          ></React.Fragment>
                        );
                      }
                    } else {
                      const isEmptyPeriod = period.periodSubjectName;
                      return isEmptyPeriod ? (
                        <div
                          className={classnames(
                            "grid-item text-center card mb-0 d-flex align-items-center justify-content-center",
                            { "bg-light": !isEmptyPeriod }
                          )}
                          style={{
                            borderLeft: `4px solid ${period.periodBorderColor}`,
                            backgroundColor: `${period.periodBgColor}`,
                          }}
                          key={`${period.periodId}`}
                        >
                          <div>
                            <p
                              className="mb-0 fw-semibold"
                              style={{ color: `${period.periodTextColor}` }}
                            >
                              {period.periodSubjectName}
                            </p>
                            <p
                              className="mb-0 fs-14"
                              style={{ color: `${period.periodTextColor}` }}
                            >
                              {period.periodSubjectTeacher}
                            </p>
                          </div>
                          <div className="hover-edit-icon d-flex align-items-center justify-content-center">
                            <i
                              className="ri-pencil-line"
                              style={{ color: `${period.periodTextColor}` }}
                            ></i>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={classnames(
                            "grid-item text-center card mb-0 d-flex align-items-center justify-content-center",
                            { "bg-danger": !isEmptyPeriod }
                          )}
                          key={`${period.periodId}`}
                        >
                          <div className="d-flex align-items-center">
                            <div className="hover-add-icon d-flex align-items-center justify-content-center">
                              <i className="ri-add-line fs-22"></i>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTableGridVersion;

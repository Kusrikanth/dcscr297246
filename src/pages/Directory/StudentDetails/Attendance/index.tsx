import React, { useState, useEffect, useMemo } from "react";
import { SelectInput } from "../../../../Components/Common";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import Calendar from "./Calendar";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getStudentAttendanceAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import { dateRangeDailyAttAct } from "../../../../store/StudentAttendance/DailyAttendance/dailyattendanceaction";
import { formatAcademicYearDates } from "./helper";
import { getFormattedDate } from "../../../../utility/dateutility";
import { toast } from "react-toastify";

const initialValues = {
  search: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  type: "",
  status: "",
};

const Attendance = () => {
  const [eventData, setEventData] = useState({});
  const [studentConcessionFilterState, setStudentConcessionFilterState] =
    useState<any>(initialValues);

  const params = useParams<any>();
  const dispatch = useDispatch();

  const getStudentAttendance = (
    studentId: string,
    academicYearId: string,
    classId: string,
    curriculumId: string,
    sectionId: string
  ) => {
    let params1 = {
      branchId: branchId,
      searchString: "",
      academicYearId: academicYearId,
      studentId: studentId,
      classId: classId,
      curriculumId: curriculumId,
      sectionId: sectionId,
    };
    dispatch(
      getStudentAttendanceAct(
        generateActionPayload("get_student_attendance", undefined, params1)
      )
    );
  };

  const fetchDateRangeApi = (
    academicYearId: string,
    curriculumId: string,
    classId: string
  ) => {
    const params = {
      branchId: branchId,
      academicYearId: academicYearId,
      classId: classId,
      curriculumId: curriculumId,
    };

    if (params.academicYearId && params.curriculumId && params.classId) {
      dispatch(
        dateRangeDailyAttAct(
          generateActionPayload("date_range_stu_att", undefined, params)
        )
      );
    }
  };

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getStudentByIdResp,
    getStudentAttendanceResp,
    dateRangeDailyAttResp,
  } = useAppSelector(
    ({ directoryStudent, instAcademics, appData, dailyAttendance }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getStudentByIdResp: directoryStudent.getStudentByIdResp,
      dateRangeDailyAttResp: dailyAttendance.dateRangeDailyAttResp,
      getStudentAttendanceResp: directoryStudent.getStudentAttendanceResp,
    }),
    shallowEqual
  );

  // const filterHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const { name, value } = event.target;
  //   setStudentConcessionFilterState((prev: any) => ({
  //     ...prev,
  //     [name]: value,
  //   }));

  //   getStudentAttendance(
  //     getStudentByIdResp?.studentDetails?.id,
  //     value,
  //     getStudentByIdResp?.studentAcademicDetails?.classId,
  //     getStudentByIdResp?.studentAcademicDetails?.curriculumId,
  //     getStudentByIdResp?.studentAcademicDetails?.sectionId
  //   );

  //   fetchDateRangeApi(
  //     value,
  //     getStudentByIdResp?.studentAcademicDetails?.curriculumId,
  //     getStudentByIdResp?.studentAcademicDetails?.classId
  //   );
  // };

  useEffect(() => {
    setStudentConcessionFilterState((prev: any) => ({
      ...prev,
      academicYearId: params?.academicYearId || "",
    }));
  }, []);

  useEffect(() => {
    if(getStudentByIdResp?.studentAcademicDetails?.sectionId){
      getStudentAttendance(
        getStudentByIdResp?.studentDetails?.id,
        params?.academicYearId,
        getStudentByIdResp?.studentAcademicDetails?.classId,
        getStudentByIdResp?.studentAcademicDetails?.curriculumId,
        getStudentByIdResp?.studentAcademicDetails?.sectionId
      );
      fetchDateRangeApi(
        params?.academicYearId,
        getStudentByIdResp?.studentAcademicDetails?.curriculumId,
        getStudentByIdResp?.studentAcademicDetails?.classId
      );
    }
    else{
      toast.error("Please assign section");
    }
  }, []);

  const getBadgeStyle = (
    background: string,
    color?: string
  ): React.CSSProperties => ({
    background,
    width: "36px",
    height: "35px",
    borderRadius: "4px",
    textAlign: "center",
    padding: "4px",
    justifyContent: "center",
    alignItems: "center",
    color: color || "#fff",
  });

  useEffect(() => {
    const studentAttendanceData = getStudentAttendanceResp || [];

    const attendanceData = studentAttendanceData?.attendanceData;
    const holidayData = studentAttendanceData?.holidayData;
    const leaveData = studentAttendanceData?.leaveData;

    if (!attendanceData && !holidayData && !leaveData) {
      return;
    }

    const attendanceByDate: { [key: string]: string } = {};

    attendanceData.forEach((yearData: any) => {
      const monthWiseStudentData = yearData.monthWiseStudentData;
      if (monthWiseStudentData) {
        Object.keys(monthWiseStudentData).forEach((month: string) => {
          const monthlyData = monthWiseStudentData[month];
          monthlyData.forEach((attendanceItem: any) => {
            const date1 = attendanceItem.attendanceDate;
            const date = getFormattedDate(date1);
            const status = attendanceItem.attendance;
            attendanceByDate[date] = status;
          });
        });
      }
    });

    if (holidayData) {
      Object.keys(holidayData).forEach((month: string) => {
        const monthlyData = holidayData[month];
        monthlyData.forEach((holidayItem: any) => {
          const date = holidayItem.holidayDate;
          const status = holidayItem.holidayType.toUpperCase();

          if (attendanceByDate[date]) {
            attendanceByDate[date] = `${attendanceByDate[date]} / ${status}`;
          } else {
            attendanceByDate[date] = status;
          }
        });
      });
    }

    if (leaveData) {
      Object.keys(leaveData).forEach((month: string) => {
        const monthlyData = leaveData[month];
        monthlyData.forEach((leaveItem: any) => {
          const date1 = leaveItem;
          const date = getFormattedDate(date1);
          const status = "LEAVE";
          if (attendanceByDate[date]) {
            attendanceByDate[date] = `${attendanceByDate[date]} / ${status}`;
          } else {
            attendanceByDate[date] = status;
          }
        });
      });
    }

    setEventData(attendanceByDate);
  }, [getStudentAttendanceResp]);

  const { data: academicYearList } = academicYearListResp || {};

  const result = useMemo(
    () =>
      formatAcademicYearDates(
        dateRangeDailyAttResp?.content[0]?.startDate,
        dateRangeDailyAttResp?.content[0]?.endDate
      ),
    [dateRangeDailyAttResp]
  );

  return (
    <div className="tw-rounded-b-lg tw-bg-white" >

      {/* Attendance Header */}
      <div className="tw-mx-2">
        <div className=" tw-text-white tw-rounded-lg tw-py-4 tw-px-4 tw-flex tw-flex-wrap tw-items-center tw-justify-between" style={{ background: "#3D3B56" }}>

          {/* Left: Total Working Days */}
          <div className="tw-w-1/3 tw-text-left tw-mb-2 md:tw-mb-0">
            Total Working Days: <span className="tw-font-semibold">{getStudentAttendanceResp?.noOfWorkingDays}</span>
          </div>

          {/* Center: Attendance Percentage */}
          <div className="tw-w-1/3 tw-text-center tw-mb-2 md:tw-mb-0">
            Attendance Percentage: <span className="tw-font-semibold">{getStudentAttendanceResp?.attendancePercentage.toFixed(2)}%</span>
          </div>

          {/* Right: Badges */}
          <div className="tw-w-1/3 tw-flex tw-justify-end tw-items-center tw-gap-2">
            <div className="tw-bg-green-600 tw-px-2 tw-py-1 tw-rounded tw-font-semibold">{getStudentAttendanceResp?.presentCount}</div>
            <div>Present</div>

            <div className="tw-bg-red-600 tw-px-2 tw-py-1 tw-rounded tw-font-semibold">{getStudentAttendanceResp?.absentCount}</div>
            <div>Absent</div>

            <div className="tw-bg-gray-400 tw-px-2 tw-py-1 tw-rounded tw-font-semibold">{getStudentAttendanceResp?.holidaysCount}</div>
            <div>Holiday</div>

            <div className="!tw-bg-yellow-600 tw-px-2 tw-py-1 tw-rounded tw-font-semibold" style={{backgroundColor: "#FDD835" }}>{getStudentAttendanceResp?.studentLeavesCount}</div>
            <div>Leave</div>
          </div>

        </div>

      </div>

      {/* Calendar Grid */}
      <div className="tw-mx-4 tw-my-3">
        <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-3">
          {result.map((year: { year: number; months: string[] }) => {
            if (!year?.months || !year?.year) {
              console.error("Invalid year or months data:", year);
              return null;
            }

            return year.months.map((month: string) => {
              const initialDate = studentConcessionFilterState.academicYearId
                ? `${year.year}-${month}-01`
                : "2023-01-01";

              return (
                <div key={`${year.year}-${month}`} className="tw-w-full">
                  <Calendar initialDate={initialDate} data={eventData} />
                </div>
              );
            });
          })}
        </div>
      </div>

    </div>
  );
};

export default Attendance;

import { TextInput } from "../../../../../Components/Common";


export const interestOptions = [
    "Reading",
    "Music", 
    "Sports",
    "Creative_Writing",
    "Gardening",
    "Yoga",
    "Art",
    "Craft",
    "Chores",
    "Others",
];

export const selectedInterests = [
    "Reading", 
];

export const areaTypeOptions = [
    { id: "URBAN", name: "Urban" },
    { id: "RURAL", name: "Rural" }
];

export const getInitialFormData = () => ({
    studentName: "",
    studentCode: "",
    rollNumber: "",
    admissionNumber: "",
    curriculum: "",
    class: "",
    section: "",
        dateOfBirth: "",
        age: "",
        motherTongue: "",
        mediumOfInstruction: "",
        studentPhotograph: null,
        studentPhoto: null,
        studentPhotoFile: "",
        studentPhotoPreviewUrl: null,
        grade: "",
    
    fullAddress: "",
    villageCity: "",
    state: "",
    pinCode: "",
    phoneNumber: "",
    areaType: "URBAN",
    
    udiseCode: "",
    apaarId: "",
    brc: "",
    crc: "",
    timesFallenIll: "",
    siblingsAge: "",
    numberOfSiblings: "",

    fatherName: "",
    fatherEducation: "",
    fatherOccupation: "",
    motherName: "",
    motherEducation: "",
    motherOccupation: "",
    guardianName: "",
    guardianEducation: "",
    guardianOccupation: "",

    attendanceRecord: [],
    lowAttendanceReason: "",
    overallAttendance: 0,
    totalWorkingDays: 0,
    totalDaysPresent: 0,
    attendanceStatus: "",
    
    interests: [...selectedInterests],
    otherInterest: "",
});


 const EditableLowAttendanceReason = ({ row: { original }, onChangeInputHndlr }: any) => (
  <div className="mb-0 w-100 d-flex align-items-center tw-justify-center">
    <TextInput
      name="lowAttendanceReason"
      value={original?.lowAttendanceReason || ""}
      onChange={(event: any) => onChangeInputHndlr(event, original?.id, "lowAttendanceReason")}
      formgroupClassName="mb-0"
      inputClassName="text-center"
      placeHolder="Enter reason"
    />
  </div>
);


 export function attendanceColumns() {
 return [
    {
      Header: "Month",
      accessor: "month",
      disableSortBy: true,
      thClass: "text-center fw-semibold",
      columnClassName: "text-center",
    },
    {
      Header: "Working Days",
      accessor: "workingDays",
      disableSortBy: true,
      thClass: "text-center fw-semibold",
      columnClassName: "text-center",
    },
    {
      Header: "Days Present",
      accessor: "daysPresent",
      disableSortBy: true,
      thClass: "text-center fw-semibold",
      columnClassName: "text-center",
    },
    {
      Header: "% Attendance",
      accessor: "attendancePercent",
      disableSortBy: true,
      thClass: "text-center fw-semibold",
      columnClassName: "text-center",
      Cell: ({ value }: any) => (
        <span
          className={`fw-bold ${value >= 75 ? "text-success" : "text-danger"}`}
        >
          {value}%
        </span>
      ),
    },
    // {
    //   Header: "Low Attendance Reason",
    //   accessor: "lowAttendanceReason",
    //   disableSortBy: true,
    //   // thClass: "text-center fw-semibold",
    //   columnClassName: "text-center",
    //   Cell: EditableLowAttendanceReason,
    // },
  ]}

export const acceptedImageFile = ["image/jpeg", "image/jpg", "image/png"];

export const transformAttendanceData = (apiResponse: any) => {
  if (!apiResponse || !apiResponse.monthWiseAttendance) return [];
  const monthWiseAttendance = apiResponse?.monthWiseAttendance;

  const result: any[] = [];
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); 

  const monthNameToNumber: { [key: string]: number } = {
    JANUARY: 0, FEBRUARY: 1, MARCH: 2, APRIL: 3,
    MAY: 4, JUNE: 5, JULY: 6, AUGUST: 7,
    SEPTEMBER: 8, OCTOBER: 9, NOVEMBER: 10, DECEMBER: 11
  };


  Object.entries(monthWiseAttendance).forEach(([year, monthsArray]: any) => {
    monthsArray.forEach((monthObj: any) => {
    
      const [monthKey, monthDataRaw] = Object.entries(monthObj)[0];
      const monthData = monthDataRaw as {
        workingDaysMonthCount: number;
        presentCount: number;
        attendancePercentage: number | string;
      };
      
      const yearNum = parseInt(year);
      const monthNum = monthNameToNumber[monthKey.toUpperCase()];
      

      const isFutureMonth = (yearNum > currentYear) || 
                           (yearNum === currentYear && monthNum > currentMonth);
  
      if (!isFutureMonth) {
        result.push({
          month: `${monthKey.charAt(0) + monthKey.slice(1).toLowerCase()} ${year}`,
          workingDays: monthData.workingDaysMonthCount,
          daysPresent: monthData.presentCount,
          attendancePercent: monthData.attendancePercentage === "NaN"
            ? 0
            : Number(monthData.attendancePercentage).toFixed(2),
          // lowAttendanceReason: ""
        });
      }
    });
  });

  return result;
};



export const transformAttendanceDataForEdit = (
  apiResponse: any,
  existingAttendance: any[]
) => {
  if (!apiResponse || !apiResponse.monthWiseAttendance) return [];

  const monthWiseAttendance = apiResponse.monthWiseAttendance;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNameToNumber: { [key: string]: number } = {
    JANUARY: 0, FEBRUARY: 1, MARCH: 2, APRIL: 3,
    MAY: 4, JUNE: 5, JULY: 6, AUGUST: 7,
    SEPTEMBER: 8, OCTOBER: 9, NOVEMBER: 10, DECEMBER: 11
  };

  const result: any[] = [];

  Object.entries(monthWiseAttendance).forEach(([year, monthsArray]: any) => {
    monthsArray.forEach((monthObj: any) => {
      const [monthKey, monthDataRaw] = Object.entries(monthObj)[0];
      const monthData = monthDataRaw as {
        workingDaysMonthCount: number;
        presentCount: number;
        attendancePercentage: number | string;
      };

      const yearNum = parseInt(year);
      const monthNum = monthNameToNumber[monthKey.toUpperCase()];
      const isFutureMonth =
        yearNum > currentYear ||
        (yearNum === currentYear && monthNum > currentMonth);

      if (!isFutureMonth) {
        const monthFullName =
          monthKey.charAt(0) + monthKey.slice(1).toLowerCase() + " " + year;

        const existing = existingAttendance?.find(
          (item) => item.monthName?.toLowerCase() === monthFullName.toLowerCase()
        );

        result.push({
          id: result.length,
          month: monthFullName,
          workingDays: monthData.workingDaysMonthCount,
          daysPresent: monthData.presentCount,
          attendancePercent:
            monthData.attendancePercentage === "NaN"
              ? 0
              : Number(monthData.attendancePercentage).toFixed(2),
          // lowAttendanceReason: existing?.lowAttendanceReason || "",
          studentAttendanceId: existing?.studentAttendanceId || null,
          isEdit: false,
        });
      }
    });
  });

  return result;
};


export const formatInterestLabel = (interest: string) => {
  return interest
    .split("_") 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
    .join(" "); 
};


export const normalizeInterest = (value: string) => {
  return value
    .toLowerCase()
    .split("_")  
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("_"); 
};
import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { MoreActions, InputCheckbox, TextInput, TimeInput, SelectInput, AvatarGroupUpdated, UserDetails } from "../../../../Components/Common";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { getDdMmYyyyFormat, getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

function getUserActions(isExaminationScheduledOrCancelled: any, admissionCancel: any, isSelected: any, actions: any,addExam?:any,isEditAccess?:any) {
  if (admissionCancel && admissionCancel?.toLowerCase() === "yes") {
    return actions.filter((item: any) => item.id === "revertCancel");
} 
// else if (isInterviewScheduledOrCancelled) {
//     return actions.filter((item: any) => (item.id !== "schedule"));
// } 
else if((isEditAccess || addExam)) {
    return actions.filter((item: any) => item.id === "cancelled");
}
}

const physicalDistrictName = ["Hyderabad", "Rangareddy"];

const validResults:Array<string> = [
  "PANEL INTERVIEW RESULT : RECOMMENDED",
  "PANEL INTERVIEW RESULT : NORMAL_ADMISSION",
  "PANEL INTERVIEW RESULT : CONDITIONAL_ADMISSION",
  "PANEL INTERVIEW RESULT : REJECTED",
  "PANEL INTERVIEW RESULT : ON_HOLD",
  "OBSERVATION AND INTERVIEW REPORT : RECOMMENDED",
  "OBSERVATION AND INTERVIEW REPORT : REOBSERVATION",
  "OBSERVATION AND INTERVIEW REPORT : REJECTED",
  "OBSERVATION AND INTERVIEW REPORT : ABSENT",
  "ADMISSION CANCELLED",
  "PANEL INTERVIEW RESULT ADMISSION CANCELLED",
  "PANEL INTERVIEW RESCHEDULED",
  "PANEL INTERVIEW SCHEDULED",
  "EXAM MARKS - SAVE EXAM MARKS",
  "EXAM MARKS RESULT - ABSENT",
  "EXAM MARKS RESULT-PASS",
  "EXAM MARKS RESULT-FAIL",
];

export const isEditAccess = (adminssionProcess:any)=>{
  return !validResults.includes(adminssionProcess);
}

const MeetingLinkInputComponent = ({
    row: { index, original },
    onChangeInputHndlr,
  }: any) => {
    useEffect(()=>{
        setState(original?.meetingLink)
    },[original?.meetingLink])
    
    const [state,setState] = useState(original?.meetingLink)
    function onBlur(event:any){
        onChangeInputHndlr(event,original?.studentRegId,"meetingLink")  
    }
    return (
        <TextInput
        name={`meetingLink-${index}`}
        maxLength={1000}
        customWidth={"10rem"}
        value={state}
        isDisabled={(!(original?.scheduleMode === "VIRTUAL") || original?.admissionCancel?.toLowerCase() === "yes") && true}
          onChange={(event:any)=>setState(event.target.value)}
        onBlur={onBlur}
    />
    )
  }
const MeetingIdInputComponent = ({
    row: { index, original },
    onChangeInputHndlr,
  }: any) => {
    useEffect(()=>{
        setState(original?.meetingId)
    },[original?.meetingId])
    const [state,setState] = useState(original?.meetingId)
    function onBlur(event:any){
        onChangeInputHndlr(event,original?.studentRegId,"meetingId")
    }
    return (
        <TextInput
        name={`meetingId-${index}`}
        customWidth={"10rem"}
        value={state}
         isDisabled={(!(original?.scheduleMode === "VIRTUAL") || original?.admissionCancel?.toLowerCase() === "yes") && true}
         onChange={(event:any)=>setState(event.target.value)}
        onBlur={onBlur}
    />
    )
  }
const MeetingPasswordInputComponent = ({
    row: { index, original },
    onChangeInputHndlr,
  }: any) => {
    useEffect(()=>{
        setState(original?.meetingPassword)
    },[original?.meetingPassword])
    const [state,setState] = useState(original?.meetingPassword)
    function onBlur(event:any){
        onChangeInputHndlr(event,original?.studentRegId,"meetingPassword")
    }
    return (
        <TextInput
        name={`meetingPassword-${index}`}
        customWidth={"10rem"}
        value={state}
         isDisabled={(!(original?.scheduleMode === "VIRTUAL") || original?.admissionCancel?.toLowerCase() === "yes") && true}
        onChange={(event:any)=>setState(event.target.value)}
        onBlur={onBlur}
    />
    )
  }
const TimeInputComponent = ({
    row: { index, original },
    onChangeInputHndlr,
  }: any) => {
    useEffect(()=>{
        setState(original?.timeSlot)
    },[original?.timeSlot])
    const [state,setState] = useState(original?.timeSlot)
    function onBlur(event:any){
        onChangeInputHndlr(event,original?.studentRegId,"timeSlot")
    }
    return (
        <TimeInput
        name={`timeSlot-${index}`}
        value={state}
        isDisabled={original?.admissionCancel?.toLowerCase() === "yes" && true}
        onChange={(event:any)=>setState(event.target.value)}
        onBlur={onBlur}
    />
    )
  }

  export function generateColumnsForAbsentStuExamDetails() {
    return [
    { 
      Header: "Registration ID",
      accessor: "studentRegNo",
      disableSortBy: true,
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
          return (
              <>
                  <UserDetails
                      displayName={original?.studentName}
                      displayId={original?.studentId}
                      showAvatar={false}
                  />
              </>
          );
      },
  },
  {
      Header: "Group Name",
      accessor: "groupShortName",
      disableSortBy: true,
  },
  {
      Header: "Father Name",
      accessor: "fatherName",
      disableSortBy: true,
  },
  {
      Header: "Admission Type",
      accessor: "admissionType",
      disableSortBy: true,
  },
  {
      Header: "Phone Number",
      accessor: "mobileNumber",
      disableSortBy: true,
  },
  {
      Header: "Email",
      accessor: "email",
      disableSortBy: true,
  },

  {
      Header: "Communication Address",
      accessor: "communicationAddress",
      disableSortBy: true,
  },
  {
      Header: "Schedule Mode",
      accessor: "scheduleMode",
      disableSortBy: true,
  },
  {
    Header: "Meeting Link",
    accessor: "meetingLink",
    disableSortBy: true,
},
{
    Header: "Meeting Id",
    accessor: "meetingId",
    disableSortBy: true,
},
{
    Header: "Meeting Password",
    accessor: "meetingPassword",
    disableSortBy: true,
},
{
    Header: "At Time",
    accessor: "timeSlot",
    disableSortBy: true,
},
{
  Header: "Cancel Admission",
  accessor: "admissionCancel",
  disableSortBy: true,
  Cell: ({ row: { original } }: any) => {
      return (
          <>
             {original?.admissionCancel ? original?.admissionCancel : "NO"}
          </>
      );
  },
},
{
  Header: "Rescheduled",
  accessor: "rescheduled",
  disableSortBy: true,
  Cell: ({ row: { original } }: any) => {
     return (
         <div>{original?.rescheduled === true ? "YES"  : "NO"}</div>
     )
  },
},
      
    ];
  }

export function generateColumns(actionsList: Array<IOptionsHrtl>, scheduleInterviewHandler: any,allStudentSelectedState:any,allStudentCheckHndlr:any,singleStudentCheckHndlr:any,ChangeScheduleModeHndler:any) {
    return [
        {
            Header: () => {
                return (
                    <InputCheckbox
                        name={"all-student"}
                        // labelName={shortName}
                        value={allStudentSelectedState}
                        onChange={allStudentCheckHndlr}
                        formgroupClassName="mb-0"
                    />
                )
            },
            accessor: "studentRegId",
            columnClassName: "w-5",
            disableSortBy: true,
            Cell: ({ row: { original, index } }: any) => {
                const { studentRegId, isSelected } = original;
                return (
                    <>
                        <InputCheckbox
                            name={`student-feeledger-${index}`}
                            // labelName={shortName}
                            value={isSelected}
                            isDisabled={!original?.addExam && !original?.isEditAccess}
                            onChange={singleStudentCheckHndlr}
                            dataId={studentRegId}
                            formgroupClassName="mb-0"
                        />
                    </>
                )
            }
        },
        {
            Header: "Registration ID",
            accessor: "studentRegistrationNo",
            disableSortBy: true,
        },
        {
            Header: "Student Name",
            accessor: "studentName",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            displayName={original?.studentName}
                            displayId={original?.studentId}
                            showAvatar={false}
                        />
                    </>
                );
            },
        },
        {
            Header: "Group Name",
            accessor: "groupShortName",
            disableSortBy: true,
        },
        {
            Header: "Father Name",
            accessor: "fatherName",
            disableSortBy: true,
        },
        {
            Header: "Admission Type",
            accessor: "admissionType",
            disableSortBy: true,
        },
        {
            Header: "Phone Number",
            accessor: "mobileNumber",
            disableSortBy: true,
        },
        {
            Header: "Email",
            accessor: "email",
            disableSortBy: true,
        },

        {
            Header: "Communication Address",
            accessor: "communicationAddress",
            disableSortBy: true,
        },
        {
            Header: "Schedule Mode",
            accessor: "scheduleMode",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return <SelectInput
                    name="scheduleMode"
                    // labelText="Class"
                    value={original?.scheduleMode}
                    onChange={(event: any) => ChangeScheduleModeHndler(event,original?.studentRegId)}
                    // onBlur={filterForm.handleBlur}
                    menuItems={scheduleModeOptions}
                    valueKey="id"
                    textKey="name"
                    customWidth={'10rem'}
                    inputClassName=""
                    isDisabled={original?.admissionCancel?.toLowerCase() === "yes" && true}
                />
            }
        },
        {
            Header: "Meeting Link",
            accessor: "meetingLink",
            disableSortBy: true,
            Cell: MeetingLinkInputComponent
        },
        {
            Header: "Meeting Id",
            accessor: "meetingId",
            disableSortBy: true,
            Cell: MeetingIdInputComponent
        },
        {
            Header: "Meeting Password",
            accessor: "meetingPassword",
            disableSortBy: true,
            Cell: MeetingPasswordInputComponent
        },
        {
            Header: "At Time",
            accessor: "timeSlot",
            disableSortBy: true,
            Cell: TimeInputComponent
        },
        {
            Header: "Cancel Admission",
            accessor: "admissionCancel",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                       {original?.admissionCancel ? original?.admissionCancel : "NO"}
                    </>
                );
            },
        },
        {
            Header: "Rescheduled",
            accessor: "rescheduled",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
               return (
                   <div>{original?.rescheduled === true ? "YES"  : "NO"}</div>
               )
            },
        },
      {
        Header: "Actions",
        filterable: false,
        disableSortBy: true,
        columnClassName:
          "sticky-right !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(249_250_251/var(--tw-bg-opacity))]",
        tdClass: "sticky-right !tw-z-10",
        Cell: ({ row: { original } }: any) => {
          const { isExaminationScheduledOrCancelled, isSelected, admissionCancel, addExam, isEditAccess } = original,
            userActions = getUserActions(isExaminationScheduledOrCancelled, admissionCancel,
              isSelected, actionsList, addExam, isEditAccess);
          if (userActions?.length) {
            return (
              <MoreActions actionOptions={userActions} rowId={original.studentRegId} isHorizontal={true} />
            );
          }

        },
        },
    ];
}

export function generateColumnsForExamDetails() {
    return [
      {
        Header: "Student Name",
        accessor: "studentName",
        disableSortBy: true,
      }, 
      {
        Header: "Registration Number",
        accessor: "studentRegNo",
        disableSortBy: true,
      },
      {
        Header: "Group",
        accessor: "streamGroupShortName",
        disableSortBy: true,
      },
      {
        Header: "Admission Cancel",
        accessor: "cancelAdmission",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
                return (
                    <>
                       {original?.cancelAdmission ? original?.cancelAdmission : "NO"}
                    </>
                );
            },
      },
      {
        Header: "Admission Type",
        accessor: "admissionType",
        disableSortBy: true,
      },
      {
        Header: "Schedule Mode",
        accessor: "scheduleMode",
        disableSortBy: true,
      },
      {
        Header: "Meeting Link ID",
        accessor: "meetingId",
        disableSortBy: true,
      },
      {
        Header: "Password",
        accessor: "passCode",
        disableSortBy: true,
      },
      {
        Header: "Time",
        accessor: "timeSlot",
        disableSortBy: true,
      },
      
    ];
  }


export const scheduleModeOptions = [
    { id: "PHYSICAL", name: "Physical" }, { id: "VIRTUAL", name: "Virtual" }
];

export const physicalScheduleModeOptions = [
  { id: "PHYSICAL", name: "Physical" }
]

export const registrationTypeOptions =
    [{ id: "OFFLINE", name: "Offline" }, { id: "ONLINE", name: "Online" }];

export const sendNotificationOptions = [
    {
        id: "sms", name: "SMS"
    },
    {
        id: "email", name: "Email"
    }
]

export const scheduledModeOptions = [{ id: "ALL", name: "All" },
{ id: "PHYSICAL", name: "Physical" },
{ id: "VIRTUAL", name: "Virtual" }];

export const initialFilterState = {
    academicYearId: "",
    curriculumId: null,
    classId: null,
    examStartDate: null,
    examEndDate: null,
    search: null,
    registrationType: null,
    reSchedule:false,
    scheduleType: null
};

export const computeSubmitButtonError = (examStudentState:any)=>{
    let submitErr = true ;
    if(examStudentState?.length){
        examStudentState?.map((item:any)=>{
          if(item?.isEditAccess || item?.addExam){
            if(item?.isSelected && ((item?.scheduleMode && item?.timeSlot) || item?.admissionCancel?.toLowerCase() === "yes")){
                    submitErr = false
            }
          }
        })
    }
    if(submitErr) return true
    else return false
}

export function generateColumnsForExamination(actionsList: Array<IOptionsHrtl>,toggleStudentExamDetailModal:any,toggleAllStudentExamDetailModal:any) {

    return [
      {
        Header: "Examination Date & Time",
        accessor: "",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return (
            <>
              <div>{getDdMmYyyyFormat(new Date(original?.examDetails?.examDate))} , {original?.examDetails?.timeSlot}</div>
            </>
          );
        },
      },
      {
        Header: "Curriculum",
        accessor: "curriculumName",
        disableSortBy: true,
      },
      {
        Header: "Class",
        accessor: "classShortName",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          const areAllSameGroup = original?.studentsList?.map((item:any) => +item?.streamGroupId)?.every((groupId:any, index:any, array:any) => +groupId === +array[0]);
          return (
            <UserDetails
                displayName={original?.classShortName}
                displayId={areAllSameGroup && original?.studentsList?.length > 0 ? (original?.studentsList[0]?.streamGroupShortName || "") : ""}
                showAvatar={false}
              />
          )
        }
      },
      {
        Header: "Meeting Details",
        accessor: "",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return (
            <>
             <div>
                <span>Link : {original?.orientation?.meetingLink}</span>
             </div>
             <div>
                <span>Id : {original?.orientation?.meetingId}</span>
             </div>
             <div>
                <span>Passcode : {original?.orientation?.passCode}</span>
             </div>
            </>
          );
        },
      },
      {
        Header: "Student Details",
        accessor: "",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            const newList = original?.studentsList?.filter((item:any)=>{
                return !item?.absent
            })
          return (
            <>
             <AvatarGroupUpdated
                avatars={newList || []}
                imageKey="studentImgUrl"
                tooltipKey="studentName"
                numberOfAvatarToShow={4}
                dataId={original?.examScheduleId}
                showLimitedAvatar={true}
                uniqueAvatarKey="studentRegId"
                onClickHandler={(event:any)=>toggleStudentExamDetailModal(event,false,original?.examScheduleId)}
                onClickMoreAvatarHndlr={(event:any)=>toggleAllStudentExamDetailModal(event,false,original?.examScheduleId)}
                            />
            </>
          );
        },
      },
      {
        Header: "Absentees Details",
        accessor: "",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            const newList = original?.studentsList?.filter((item:any)=>{
                return item?.absent
            })
          return (
            <>
              <AvatarGroupUpdated
                avatars={newList||[]}
                imageKey="studentImgUrl"
                tooltipKey="studentName"
                numberOfAvatarToShow={4}
                dataId={original?.examScheduleId}
                showLimitedAvatar={true}
                uniqueAvatarKey="id"
                onClickHandler={(event:any)=>toggleStudentExamDetailModal(event,true,original?.examScheduleId)}
                onClickMoreAvatarHndlr={(event:any)=>toggleAllStudentExamDetailModal(event,true,original?.examScheduleId)}
                            />
            </>
          );
        },
      },
      {
        Header: "Actions",
        filterable: false,
        disableSortBy: true,
        columnClassName:
          "sticky-right !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(249_250_251/var(--tw-bg-opacity))]",
        tdClass: "sticky-right !tw-z-10",
        Cell: ({ row: { original } }: any) => {
          return (
            <MenuOptionHrtl actionOptions={actionsList} rowId={original?.examScheduleId} />
          );
        },
      },
    ];
  }

  export function hasStateChanged(newState:any) {
    let count :any = 0;
    let showState :boolean =false;
    for (const key in newState) {
      const newValue = newState[key];
      if (newValue) {
        showState = true;
        if(!(key === "search" || key === "academicYearId" || key === "classId" || key==="curriculumId" || key === "reSchedule" || key === "examStartDate"))
        count += 1;
      }
    }
    if(count>0) {return {stateChange : showState , count : count}}
    else {return {stateChange : showState , count : count}}
  }

  export const MenuOptions: Array<any> = [
    {
      id: "examinationSchedule",
      labelName: "Examination Schedule",
      customPadding: "0px 20px",
    },
    {
      id: "examinationReschedule",
      labelName: "Examination Reschedule",
      customPadding: "0px 20px",
    },
  
  ];
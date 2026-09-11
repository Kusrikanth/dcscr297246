import { IOptionsHrtl, MenuOptionHrtl } from "../../../../Components/Common/MenuOptions";
import { MoreActions, InputCheckbox, TextInput, SelectInput, TimeInput, AvatarGroupUpdated, UserDetails } from "../../../../Components/Common";
import classNames from "classnames";
import { useEffect, useState } from "react";
import { getDdMmYyyyFormat, getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";

function getUserActions(isInterviewScheduledOrCancelled: any, admissionCancel: any, isSelected: any, actions: any,addPanelInterview?:any,isEditAccess?:any) {
    if (admissionCancel && admissionCancel?.toLowerCase() === "yes") {
        return actions.filter((item: any) => item.id === "revertCancel");
    } 
    // else if (isInterviewScheduledOrCancelled) {
    //     return actions.filter((item: any) => (item.id !== "schedule"));
    // } 
    else if((isEditAccess || addPanelInterview)) {
        return actions.filter((item: any) => item.id === "cancelled");
    }
}

export const scheduleModeOptions = [
    { id: "PHYSICAL", name: "Physical" }, { id: "VIRTUAL", name: "Virtual" }
];

export const physicalScheduleModeOptions = [
  { id: "PHYSICAL", name: "Physical" }
]

const physicalDistrictName = ["Hyderabad", "Rangareddy"];

const validResults :Array<string> = [
  "PANEL INTERVIEW RESULT : RECOMMENDED",
  "PANEL INTERVIEW RESULT : NORMAL_ADMISSION",
  "PANEL INTERVIEW RESULT : CONDITIONAL_ADMISSION",
  "PANEL INTERVIEW RESULT : REJECTED",
  "PANEL INTERVIEW RESULT : ON_HOLD",
  "PANEL INTERVIEW RESULT ADMISSION CANCELLED",
  // "PANEL INTERVIEW SCHEDULE ADMISSION CANCELLED",
  "OBSERVATION AND INTERVIEW REPORT : RECOMMENDED",
  "OBSERVATION AND INTERVIEW REPORT : REOBSERVATION",
  "OBSERVATION AND INTERVIEW REPORT : REJECTED",
  "OBSERVATION AND INTERVIEW REPORT : ABSENT",
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
        customWidth={"10rem"}
        value={state}
        maxLength={1000}
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

export function generateColumns(actionsList: Array<IOptionsHrtl>, scheduleInterviewHandler: any,
    isAllSelected: any, allStudentSelectedHndlr: any, studentCheckHandler: any,ChangeScheduleModeHndler:any,
) {
    return [
        {
            Header: () => {
              return (
                <InputCheckbox
                  name={"all-student"}
                  // labelName={shortName}
                  value={isAllSelected}
                  onChange={allStudentSelectedHndlr}
                  formgroupClassName="mb-0"
                />
              )
            },
            accessor: "isStudentChecked",
            columnClassName: "w-5",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              const { studentRegId, isSelected } = original;
              return (
                <>
                  <InputCheckbox
                    name={`student-${studentRegId}`}
                    // labelName={shortName}
                    isDisabled={!original?.addPanelInterview && !original?.isEditAccess}
                    value={isSelected}
                    onChange={studentCheckHandler}
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
            Cell: ({ row: { original } }: any) => {
                return (
                    <>
                        <UserDetails
                            displayName={original?.fatherName}
                            displayId={original?.email}
                            showAvatar={false}
                        />
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
            Header: "Phone Number",
            accessor: "phoneNo",
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
            Header: "Reschedule",
            accessor: "isReschedule",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
               return (
                   <div>{original?.isReschedule?.toLowerCase() === "yes" ? "YES" : "NO"}</div>
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
          const { isInterviewScheduledOrCancelled, isSelected, admissionCancel, isEditAccess, addPanelInterview } = original,
            userActions = getUserActions(isInterviewScheduledOrCancelled, admissionCancel,
              isSelected, actionsList, addPanelInterview, isEditAccess);
          return (
            userActions?.length > 0 && <MoreActions actionOptions={userActions} rowId={original.studentRegId} isHorizontal={true} />
          );
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
        accessor: "groupShortName",
        disableSortBy: true,
      },
      {
        Header: "Admission Cancel",
        accessor: "admissionCancel",
        disableSortBy: true,
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
        accessor: "meetingPassword",
        disableSortBy: true,
      },
      {
        Header: "Time",
        accessor: "timeSlot",
        disableSortBy: true,
      },
      
    ];
  }

export function generateColumnsForPanelInterivew(actionsList: Array<IOptionsHrtl>,toggleStudentExamDetailModal:any,toggleAllStudentExamDetailModal:any) {

    return [
      {
        Header: "Examination Date & Time",
        accessor: "",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return (
            <>
              <div>{getDdMmYyyyWithMonthNameFormat(new Date(original?.interviewDate))} , {original?.timeSlot}</div>
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
            const areAllSameGroup = original?.admissionPanelInterviewScheduleDetailsDTOS?.map((item:any) => item?.groupShortName)?.every((groupId:any, index:any, array:any) => groupId === array[0]);
            return (
              <UserDetails
                  displayName={original?.classShortName}
                  displayId={areAllSameGroup && original?.admissionPanelInterviewScheduleDetailsDTOS?.length > 0 ? (original?.admissionPanelInterviewScheduleDetailsDTOS[0]?.groupShortName || "") : ""}
                  showAvatar={false}
                />
            )
          }
        },
      {
        Header: "Admission Source",
        accessor: "admissionSource",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => (
          <span>
            {original.admissionSource
              ? original.admissionSource
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/\b\w/g, (c: string) => c.toUpperCase())
              : "-"}
          </span>
        ),
      },
      {
        Header: "Meeting Details",
        accessor: "",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
          return (
            <>
             <div>
                <span>Link : {original?.meetingLink}</span>
             </div>
             <div>
                <span>Id : {original?.meetingId}</span>
             </div>
             <div>
                <span>Passcode : {original?.meetingPassword}</span>
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
            const newList = original?.admissionPanelInterviewScheduleDetailsDTOS?.filter((item:any)=>{
                return item?.isAbsent?.toLowerCase() === "no"
            })
          return (
            <>
              <AvatarGroupUpdated
                avatars={newList || []}
                imageKey="studentImageS3URL"
                tooltipKey="studentName"
                numberOfAvatarToShow={4}
                dataId={original?.id}
                showLimitedAvatar={true}
                uniqueAvatarKey="studentRegId"
                onClickHandler={(event:any)=>toggleStudentExamDetailModal(event,"no",original?.id)}
                onClickMoreAvatarHndlr={(event:any)=>toggleAllStudentExamDetailModal(event,"no",original?.id,"student")}
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
            const newList = original?.admissionPanelInterviewScheduleDetailsDTOS?.filter((item:any)=>{
                return item?.isAbsent?.toLowerCase() === "yes" 
            })
          return (
            <>
              <AvatarGroupUpdated
                avatars={newList||[]}
                imageKey="studentImageS3URL"
                tooltipKey="studentName"
                numberOfAvatarToShow={4}
                dataId={original?.id}
                showLimitedAvatar={true}
                uniqueAvatarKey="id"
                onClickHandler={(event:any)=>toggleStudentExamDetailModal(event,"yes",original?.id)}
                onClickMoreAvatarHndlr={(event:any)=>toggleAllStudentExamDetailModal(event,"yes",original?.id,"absent")}
                            />
            </>
          );
        },
      },
      {
        Header: "Reobservation",
        accessor: "",
        disableSortBy: true,
        Cell: ({ row: { original } }: any) => {
            const newList = original?.admissionPanelInterviewScheduleDetailsDTOS?.filter((item:any)=>{
                return  item?.reobservation?.toLowerCase() === "yes"
            })
          return (
            <>
              <AvatarGroupUpdated
                avatars={newList||[]}
                imageKey="studentImageS3URL"
                tooltipKey="studentName"
                numberOfAvatarToShow={4}
                dataId={original?.id}
                showLimitedAvatar={true}
                uniqueAvatarKey="id"
                onClickHandler={(event:any)=>toggleStudentExamDetailModal(event,"yes",original?.id)}
                onClickMoreAvatarHndlr={(event:any)=>toggleAllStudentExamDetailModal(event,"yes",original?.id,"reobservation")}
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
        "sticky-right !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[#f3f6f9]",
        tdClass: "sticky-right !tw-z-10",
        Cell: ({ row: { original } }: any) => {
          return (
            <MenuOptionHrtl actionOptions={actionsList} rowId={original?.id} />
          );
        },
      },
    ];
  }


export const computeSubmitButtonError = (interviewStudentState:any)=>{
    if(interviewStudentState?.length){
        let submitErr :any = true;
        interviewStudentState?.map((item:any)=>{
          if(item?.isEditAccess || item?.addPanelInterview){
            if(item?.isSelected && ((item?.scheduleMode && item?.timeSlot) || item?.admissionCancel?.toLowerCase() === "yes")){
                submitErr = false
             }
          }
        })
        if(submitErr) return true
        else return false
    }
}
export function hasStateChanged(newState:any) {
  let count :any = 0;
  let showState :boolean =false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if(!(key === "searchString" || key === "academicYearId" || key === "classId" || key==="curriculumId" || key === "startDate"))
      count += 1;
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}
}


export const MenuOptions: Array<any> = [
  {
    id: "panelInterviewSchedule",
    labelName: "Panel Interview Schedule",
    customPadding: "0px 20px",
  },
  {
    id: "panelInterviewReschedule",
    labelName: "Panel Interview Reschedule",
    customPadding: "0px 20px",
  },

];
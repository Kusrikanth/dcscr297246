import { InputCheckbox, StatusLabel } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { UserDetails } from "../../../../Components/Common";
import { getDateWithTimeFormat, getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import { HugeiconsIcon } from "@hugeicons/react";
import { MessagePreview01Icon } from "@hugeicons-pro/core-stroke-standard";

export const searchInputOptions = [
  { id: 'global', name: 'Global Search' },
  { id: 'applicationID', name: 'Application ID' },
  { id: 'registrationId', name: 'Registration ID' },
  { id: 'studentName', name: 'Student Name ' },
  { id: 'smsPriorityNo', name: 'SMS Priority Number' },
  { id: 'whatsAppNumber', name: 'whatsApp Number' },
  { id: 'emailId', name: 'Email Id' },
  { id: 'fatherMobile', name: 'Father Mobile' },
  { id: 'motherMobile', name: 'Mother Mobile' },
  { id: 'guardianMobile', name: 'Guardian Mobile' },
  { id: 'fatherName', name: 'Father Name' },
  { id: 'motherName', name: 'Mother Name' },
  { id: 'guardianName', name: 'Guardian Name' },
]

export function generateColumns(viewRegistrationHndlr: any, actionsList: Array<IOptionsHrtl>,allStudentsSelectedState:any,allStudentsCheckHndlr:any,singleStudentCheckHndlr:any,completionStatus:any, handleReviewRemarks: any) {

  const isInComplete = String(completionStatus ?? "").toLowerCase().trim() === "incomplete"

  return [
    ...(isInComplete
      ? [
          {
            Header: () => {
              return (
                <InputCheckbox
                  name="all-student"
                  value={allStudentsSelectedState}
                  onChange={allStudentsCheckHndlr}
                  formgroupClassName="mb-0"
                ></InputCheckbox>
              );
            },
            accessor: "isStudentsChecked",
            columnClassName: "w-5",
            disableSortBy: true,
            Cell: ({ row: { original } }: any) => {
              const { registrationId, isSelected } = original;
              return (
                <>
                  <InputCheckbox
                    name={`student-${registrationId}`}
                    value={isSelected}
                    onChange={singleStudentCheckHndlr}
                    dataId={registrationId}
                    formgroupClassName="mb-0"
                  ></InputCheckbox>
                </>
              );
            },
          },
        ]
      : []),
    {
      Header: "Registration ID",
      accessor: "registrationNo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div
              className="text-info cursor-pointer"
              data-id={original?.registrationId}
              onClick={viewRegistrationHndlr}
            >
              {original?.registrationNo}
            </div>
          </>
        );
      },
    },
    {
      Header: "Last Update Date",
      accessor: "registrationDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="text-nowrap">
            {getDdMmYyyyWithMonthNameFormat(original.registrationDate)}
          </span>
        );
      },
    },
    {
      Header: "Curriculum",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "min-w-200px max-w-200px ",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              imageUrl={original?.studentImageUrl}
              displayName={original?.studentName}
              displayId={original?.applicationNo}
              size="xs"
              defaultImgType="student"
            />
          </>
        );
      },
    },
    {
      Header: "Contact Person Name",
      accessor: "contactPersonName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.fatherFirstName}
              displayId={original?.priorityEmailId}
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
      Header: "Admission for",
      accessor: "admissionSoughtShortName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.admissionSoughtShortName}
            displayId={original?.streamGroupShortName}
            showAvatar={false}
          />
        );
      },
    },
    // {
    //   Header: "Group",
    //   accessor: "streamGroupShortName",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     return <span  className="d-flex" style={{minWidth:"4rem"}}>{original?.streamGroupShortName || "-"}</span>;
    //   }
    // },
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
      Header: "Phone",
      accessor: "smsPriorityNo",
      disableSortBy: true,
    },
    {
      Header: "Whatsapp No",
      accessor: "whatsappNo",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { whatsappNo } = original;
        return <span>{whatsappNo || "-"}</span>;
      },
    },
    {
      Header: "Follow up Remarks",
      accessor: "reviewRemarks",
      disableSortBy: true,
      columnClassName: "w-150px min-w-150px max-w-150px",
      Cell: ({ row: { original } }: any) => {
        return (
          <span
            className="tw-text-primary tw-cursor-pointer tw-underline text-muted"
            onClick={() => handleReviewRemarks(original?.registrationId)}
          >
            <HugeiconsIcon icon={MessagePreview01Icon} size={16} /> Comments
          </span>
        );
      },
    },
    {
      Header: "Next Action date",
      accessor: "nextFollowupRemarksDate",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return original?.nextFollowupRemarksDate
          ? getDdMmYyyyWithMonthNameFormat(
            `${original?.nextFollowupRemarksDate}Z`
          )
          : "-";
      },
    },
    {
      Header: "Recent Follow-Up date",
      accessor: "recentFollowupRemarksDate",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return original?.recentFollowupRemarksDate
          ? getDateWithTimeFormat(
            `${original?.recentFollowupRemarksDate}Z`
          )
          : "-";
      },
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const status = original?.completionStatus;
        return <StatusLabel type={status} labelName={status} />;
      },
    },
    {
      Header: "Current Status",
      accessor: "currentStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.admissionProcess ? (
          <span className="badge text-uppercase bg-light text-muted p-2">
            {" "}
            {original?.admissionProcess}{" "}
          </span>
        ) : (
          <span className="ms-2">-</span>
        );
      },
    },
    {
      Header: "Cancellation Reason",
      accessor: "admissionCancelReason",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.admissionCancelReason || "-";
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
        let updatedActionsList = actionsList.filter((act: any) => {
          if (
            original?.admissionProcess?.toLowerCase() === "admission cancelled"
          ) {
            if (act.actionName === "Print") {
              return act;
            }
          } else {
            if (act.actionName === "Cancel Admission") {
              if (original?.completionStatus?.toLowerCase() === "incomplete") {
                return act;
              }
            }
            // else if (act.actionName === "Edit") {
            //   if (!(original?.completionStatus?.toLowerCase() === "incomplete")) {
            //     return act;
            //   }
            // }
            else if (
              original?.completionStatus?.toLowerCase() === "cancelled" &&
              act.actionName === "Print"
            ) {
              return act;
            } else if (
              original?.completionStatus?.toLowerCase() !== "cancelled"
            ) {
              return act;
            }
          }
        });
        return (
          <MoreActions
            actionOptions={updatedActionsList}
            rowId={original.registrationId}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}

export const isShowSendNotificationButton = (registrationsState:any) => {
  return !(registrationsState && registrationsState.some((row) => row.isSelected))
}

export const completionStatusData: Array<any> = [
  {
    id: "Incomplete",
    name: "Incomplete"
  },
  {
    id: "Complete",
    name: "Complete"
  },
  {
    id: "Cancelled",
    name: "Cancelled"
  }
]

export const AdmissionTypeMenuOptions = [
  {
    id: "Residential",
    value: "Residential"
  },
  {
    id: "Non-Residential",
    value: "Non-Residential"
  },

]

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (!(key === "searchString" || key === "academicYearId" || key === "completionStatus" || key === "startDate"))
        count += 1;
    }
  }
  if (count > 0) { return { stateChange: showState, count: count } }
  else { return { stateChange: showState, count: count } }
}

export const currentStatusOptions = [

  // Application Sale
  {
    id:"ADMISSION PROCESS INCOMPLETE"
  },  

  // Registration 
  {
    id:"REGISTRATION FORM INCOMPLETE"
  },
  {
    id:"REGISTRATION FORM COMPLETED"
  },

  // Preliminary Scrutiny
  {
    id:"DOCUMENTS RESUBMISSION"
  },
  {
    id:"DOCUMENTS RESUBMITTED"
  },
  {
    id: "DOCUMENT APPROVED"
  },
  {
    id:"ON HOLD PROFILE APPROVAL PENDING"
  },
  {
    id: "ON HOLD RECOMMENDED TO OTHER CAMPUS"
  },
  {
    id:"PROFILE APPROVAL REJECTED"
  },
  {
    id:"PROFILE APPROVED"
  },
  {
    id:"HEAD DEPT APPROVAL ON HOLD"
  },
  {
    id: "HEAD DEPT APPROVAL REJECTED"
  },
  {
    id:"HEAD DEPT APPROVED"
  },

  // Exam Schedule
  {
    id: "EXAM SCHEDULE - EXAM SCHEDULED"
  },
  {
    id:"EXAM SCHEDULE - HEAD OF THE DEPARTMENT APPROVED"
  },
  {
    id:"EXAM SCHEDULE - ADMISSION CANCELED"
  },

  // Examination Marks
  {
    id: "EXAM MARKS RESULT-PASS"
  },
  {
    id: "EXAM MARKS RESULT-FAIL"
  },
  {
    id:"EXAM MARKS RESULT - ABSENT"
  },

  // Panel Interview
  {
    id:"PANEL INTERVIEW SCHEDULED"
  },
  {
    id:"PANEL INTERVIEW RESCHEDULED"
  },
  {
    id:"PANEL INTERVIEW SCHEDULE ADMISSION CANCELLED"
  },

  // Observation and interview result
  {
    id:"OBSERVATION AND INTERVIEW REPORT : RECOMMENDED"
  },
  {
    id:"OBSERVATION AND INTERVIEW REPORT : REOBSERVATION"
  },
  {
    id:"OBSERVATION AND INTERVIEW REPORT : ABSENT"
  },

  // Panel Interview Result
  {
    id:"PANEL INTERVIEW RESULT : ON_HOLD"
  },
  {
    id : "PANEL INTERVIEW RESULT : NORMAL_ADMISSION"
  },
  {
    id:"PANEL INTERVIEW RESULT : CONDITIONAL_ADMISSION"
  },
  {
    id: "PANEL INTERVIEW RESULT : RECOMMENDED"
  },
  {
    id:"PANEL INTERVIEW RESULT : REJECTED"
  },

  // Admission Cancelled
  {
    id:"ADMISSION CANCELLED"
  },
]

export const pallaviStatusOptions = [
  // Application sale
  {
    id:"ADMISSION PROCESS INCOMPLETE"
  },
 
  // Registration
  {
    id:"REGISTRATION FORM INCOMPLETE"
  },
  {
    id:"REGISTRATION FORM COMPLETED"
  },

  // Preliminary Scrutiny
  {
    id:"DOCUMENTS RESUBMISSION"
  },
  {
    id:"DOCUMENTS RESUBMITTED"
  },
  {
    id:"DOCUMENT APPROVED"
  },
  {
    id:"ON HOLD PROFILE APPROVAL PENDING"
  },
  {
    id:"ON HOLD RECOMMENDED TO OTHER CAMPUS"
  },
  {
    id:"PROFILE APPROVAL REJECTED"
  },
  {
    id:"PROFILE APPROVED"
  },
  {
    id:"HEAD DEPT APPROVAL ON HOLD"
  },
  {
    id:"HEAD DEPT APPROVAL REJECTED"
  },
  {
    id:"HEAD DEPT APPROVED"
  },
]


export const mainApplicationStatus: Array<any> = [
  {
    id: "AdmissionDone",
    name: "Admission Completed"
  },
  {
    id: "InTransit",
    name: "In Transit"
  },
  {
    id: "Cancelled",
    name: "Cancelled"
  },
]
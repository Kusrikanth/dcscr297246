import { MessagePreview01Icon } from "@hugeicons-pro/core-stroke-standard";
import { InputCheckbox, StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import { getDateWithTimeFormat, getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import { HugeiconsIcon } from "@hugeicons/react";

export const applicationData = [
  "EXAM SCHEDULE - ADMISSION CANCELED",
  "PANEL INTERVIEW SCHEDULE ADMISSION CANCELLED",
  "PANEL INTERVIEW RESULT ADMISSION CANCELLED",
  "ADMISSION CANCELLED",
]


export const searchInputOptions = [
  { id: 'global', name: 'Global Search' },
  { id: 'applicationNo', name: 'Application ID' },
  { id: 'studentName', name: 'Student Name' },
  { id: 'parentName', name: 'Parent Name' },
  { id: 'contactNumber', name: 'Contact Number' },
  { id: 'registrationNo', name: 'Registration Number' },
  { id: 'emailId', name: 'Email' },
]

export const admissionSourceOptions = [
  { id: 'OLD_ADMISSION', name: 'Old Admission' },
  { id: 'NEW_ADMISSION', name: 'New Admission' },
]

export function generateColumns(actionsList: Array<IOptionsHrtl>, academicYearStatus: any,allStudentsSelectedState:any,allStudentsCheckHndlr:any,singleStudentCheckHndlr:any,completionStatus:any, handleReviewRemarks: any) {

  const isInComplete = completionStatus === "Not-LoggedIn" || completionStatus === "Incomplete";

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
                  const { id, isSelected } = original;
                  const disableCheckBox = applicationData?.includes(original?.admissionProcess) || original?.admissionCancel?.toLowerCase() === "yes"
                  return (
                    <>
                      <InputCheckbox
                        name={`student-${id}`}
                        value={isSelected}
                        onChange={singleStudentCheckHndlr}
                        dataId={id}
                        formgroupClassName="mb-0"
                        isDisabled={disableCheckBox}
                      ></InputCheckbox>
                    </>
                  );
                },
              },
            ]
          : []),
    {
      Header: "Application ID",
      accessor: "applicationNumber",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.applicationNumber}
            displayId={original?.curriculumName}
            showAvatar={false}
          />
        );
      },
    },
    {
      Header: "Application Date",
      accessor: "applicationSaleDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyWithMonthNameFormat(
          new Date(original?.applicationSaleDate)
        );
      },
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original?.studentName}
            displayId={original?.registrationNo}
            showAvatar={false}
          />
        );
      },
    },
    {
      Header: "Admission for",
      accessor: "admissionClassName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            showAvatar={false}
            displayName={original?.admissionClassName}
            displayId={original?.groupShortName}
          />
        )
      }
    },
    {
      Header: "Gender",
      accessor: "gender",
      disableSortBy: true,
    },
    {
      Header: "Contact Person Name",
      accessor: "contactPersonaName",
      disableSortBy: true,
      columnClassName: "w-200px min-w-200px max-w-200px",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              showAvatar={false}
              displayName={original?.contactPersonaName}
              displayId={original?.emailId}
            />
          </>
        );
      },
    },
    {
      Header: "Phone",
      accessor: "contactNumber",
      disableSortBy: true,
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
            onClick={() => handleReviewRemarks(original?.id)}
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
      Header: "Registration Status",
      accessor: "completionStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <StatusLabel type={original?.completionStatus || "Not Started"} labelName={original?.completionStatus || "Not Started"} />
      }
    },
    {
      Header: "Cancellation Reason",
      accessor: "admissionCancelReason",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.admissionCancelReason || "-"
      }
    },
    {
      Header: "Current Status",
      accessor: "currentStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.admissionProcess ? <span className="badge text-uppercase bg-light text-muted p-2"> {original?.admissionProcess} </span> : <span className="ms-2">-</span>
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
      Header: "Amount (₹)",
      accessor: "amount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDisplayAmountValue(original.amount);
      }
    },
    {
      Header: "Mode",
      accessor: "mode",
      disableSortBy: true,
    },
    {
      Header: "Application Status",
      accessor: "applicationStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        if (applicationData?.includes(original?.admissionProcess) || original?.admissionCancel?.toLowerCase() === "yes") {
          return <StatusLabel type={"Cancelled"} labelName={"Cancelled"} />
        } else {
          return <StatusLabel type={"Active"} labelName={"Active"} />
        }
      }
    },
    {
      Header: "Payment Status",
      accessor: "paid",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <StatusLabel type={original?.paymentStatus} labelName={original?.paymentStatus} />
      }
    },
    {
      Header: "Payment Mode",
      accessor: "paymentMode",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <div>{original?.paymentMode && original?.paymentMode?.split('_')?.join(' ')}</div>
      }
    },
    {
      Header: "Transaction Id",
      accessor: "transactionId",
      disableSortBy: true,
    },
    {
      Header: "UTR No.",
      accessor: "settlementUtr",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return <span>{value || "-"}</span>
      },
    },
    {
      Header: "Settled Date",
      accessor: "settledAt",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        return <span className="text-nowrap">{value ? getDdMmYyyyWithMonthNameFormat(value) : "-"}</span>
      },
    },
    {
      Header: "Password",
      accessor: "password",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      accessor: 'actions',
      filterable: false,
      disableSortBy: true,
      columnClassName:
        "sticky-right !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(249_250_251/var(--tw-bg-opacity))]",
      tdClass: "sticky-right !tw-z-10",
      Cell: ({ row: { original } }: any) => {
        let updatedActionsList = actionsList.filter((act: any) => {
          if (applicationData?.includes(original?.admissionProcess) || original?.admissionCancel?.toLowerCase() === "yes") {
            if (act.actionName === "Print") {
              return act;
            }
          } else {
            if (act.actionName === "Print") {
              if (original?.paymentStatus?.toLowerCase() === "paid") {
                return act;
              }
            }
            else if (act.actionName === "Generate Receipt") {
              if (original?.paymentStatus?.toLowerCase() !== "paid") {
                return act
              }
            }
            else if (act.actionName === "Send Notification") {
              if (original?.paymentStatus?.toLowerCase() === "paid" && original?.admissionCancel?.toLowerCase() === "no") {
                return act
              }
            }
            else if (act.actionName === "Send Payment Link") {
              if (original?.paymentStatus?.toLowerCase() !== "paid") {
                return act;
              }
            }
            else if (act.actionName === "Activate link") {
              if (original?.paymentStatus?.toLowerCase() === "paid" && original?.admissionCancel?.toLowerCase() === "no") {
                return act;
              }
            }
            else if (act.actionName === "Cancel Admission") {
              if (original?.completionStatus?.toLowerCase() === "not-loggedin" && original?.admissionCancel?.toLowerCase() === "no") {
                return act;
              }
            }
            else if (act.actionName === "Edit") {
              if (!(original?.completionStatus?.toLowerCase() === "complete") && original?.admissionCancel?.toLowerCase() === "no") {
                return act;
              }
            }
            else {
              return act;
            }
          }
        })
        return (
          (academicYearStatus !== "OLD") && <MoreActions actionOptions={updatedActionsList} rowId={original.id} isHorizontal={true} />
        );
      },
    },
  ];
}
export const isShowSendNotificationButton = (applicationSaleState:any) => {
  return !(applicationSaleState && applicationSaleState.some((row) => row.isSelected))
}

export const genderList = [
  {
    id: "MALE",
    value: "Male"
  },
  {
    id: "FEMALE",
    value: "Female"
  }
]

export const SourceTypes = [
  {
    id: "Website",
    value: "Website"
  },
  {
    id: "Existing Parent",
    value: "Existing Parent"
  },
  {
    id: "Alumni",
    value: "Alumni"
  },
  {
    id: "Social Media",
    value: "Social Media"
  },
  {
    id: "Edustoke",
    value: "Edustoke"
  },
  {
    id: "Any Other",
    value: "Any Other"
  },
]

export const admissionTypesForDps: Array<any> = [
  {
    id: "Non-Residential",
    name: "Non Residential"
  },
  {
    id: "Residential",
    name: "Residential"
  }
]

export const paymentStatus: Array<any> = [
  {
    id: "PAID",
    name: "Paid"
  },
  {
    id: "UNPAID",
    name: "Unpaid"
  }
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
export const completionStatus: Array<any> = [
  {
    id: "Complete",
    name: "Complete"
  },
  {
    id: "Incomplete",
    name: "Incomplete"
  },
  {
    id: "Not-LoggedIn",
    name: "Not-LoggedIn"
  }
]
export const modeOptions: Array<any> = [
  {
    id: "Online",
    name: "Online"
  },
  {
    id: "Offline",
    name: "Offline"
  }
]

export const admissionTypesForOthers: Array<any> = [
  {
    id: "Non-Residential",
    name: "Non Residential"
  }
]
export const paymentType: Array<any> = [
  {
    id: "PAY",
    name: "Pay"
  },
  {
    id: "NO_PAY",
    name: "No Pay"
  }
]
export const paymentMode: Array<any> = [
  {
    id: "CASH",
    name: "Cash"
  },
  {
    id: "CARD_PAYMENT",
    name: "Card"
  },
  {
    id: "UPI",
    name: "UPI"
  },
]
export const isEmployeeOption = [
  {
    id: 'yes',
    name: 'Yes'
  },
  {
    id: 'no',
    name: 'No'
  }
]

export const currentStatusOptions = [

  // Application sale
  {
    id: "ADMISSION PROCESS INCOMPLETE"
  },

  // Registration
  {
    id: "REGISTRATION FORM INCOMPLETE"
  },
  {
    id: "REGISTRATION FORM COMPLETED"
  },

  // Preliminary Scrutiny
  {
    id: "DOCUMENTS RESUBMISSION"
  },
  {
    id: "DOCUMENTS RESUBMITTED"
  },
  {
    id: "DOCUMENT APPROVED"
  },
  {
    id: "ON HOLD PROFILE APPROVAL PENDING"
  },
  {
    id: "ON HOLD RECOMMENDED TO OTHER CAMPUS"
  },
  {
    id: "PROFILE APPROVAL REJECTED"
  },
  {
    id: "PROFILE APPROVED"
  },
  {
    id: "HEAD DEPT APPROVAL ON HOLD"
  },
  {
    id: "HEAD DEPT APPROVAL REJECTED"
  },
  {
    id: "HEAD DEPT APPROVED"
  },

  // Exam Schedule
  {
    id: "EXAM SCHEDULE - HEAD OF THE DEPARTMENT APPROVED"
  },
  {
    id: "EXAM SCHEDULE - EXAM SCHEDULED"
  },
  {
    id: "EXAM SCHEDULE - ADMISSION CANCELED"
  },

  // Examination Marks
  {
    id: "EXAM MARKS RESULT-PASS"
  },
  {
    id: "EXAM MARKS RESULT-FAIL"
  },
  {
    id: "EXAM MARKS RESULT - ABSENT"
  },

  // Panel Interview
  {
    id: "PANEL INTERVIEW SCHEDULED"
  },
  {
    id: "PANEL INTERVIEW RESCHEDULED"
  },
  {
    id: "PANEL INTERVIEW SCHEDULE ADMISSION CANCELLED"
  },

  // Observation and interview result
  {
    id: "OBSERVATION AND INTERVIEW REPORT : REOBSERVATION"
  },
  {
    id: "OBSERVATION AND INTERVIEW REPORT : RECOMMENDED"
  },
  {
    id: "OBSERVATION AND INTERVIEW REPORT : ABSENT"
  },

  // panel interview result
  {
    id: "PANEL INTERVIEW RESULT : ON_HOLD"
  },
  {
    id: "PANEL INTERVIEW RESULT : NORMAL_ADMISSION"
  },
  {
    id: "PANEL INTERVIEW RESULT : CONDITIONAL_ADMISSION"
  },
  {
    id: "PANEL INTERVIEW RESULT : RECOMMENDED"
  },
  {
    id: "PANEL INTERVIEW RESULT : REJECTED"
  },
  {
    id: "PANEL INTERVIEW RESULT ADMISSION CANCELLED"
  },

  // Admission Cancellation
  {
    id: "ADMISSION CANCELLED"
  },
]

export const pallaviStatusOptions = [
  // Application sale
  {
    id: "ADMISSION PROCESS INCOMPLETE"
  },

  // Registration
  {
    id: "REGISTRATION FORM INCOMPLETE"
  },
  {
    id: "REGISTRATION FORM COMPLETED"
  },

  // Preliminary Scrutiny
  {
    id: "DOCUMENTS RESUBMISSION"
  },
  {
    id: "DOCUMENTS RESUBMITTED"
  },
  {
    id: "DOCUMENT APPROVED"
  },
  {
    id: "ON HOLD PROFILE APPROVAL PENDING"
  },
  {
    id: "ON HOLD RECOMMENDED TO OTHER CAMPUS"
  },
  {
    id: "PROFILE APPROVAL REJECTED"
  },
  {
    id: "PROFILE APPROVED"
  },
  {
    id: "HEAD DEPT APPROVAL ON HOLD"
  },
  {
    id: "HEAD DEPT APPROVAL REJECTED"
  },
  {
    id: "HEAD DEPT APPROVED"
  },
]

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if(!(key === "search" || key === "academicYearId" || key === "paymentStatus" || key === "startDate"))
      count += 1;
    }
  }
  if (count > 0) { return { stateChange: showState, count: count } }
  else { return { stateChange: showState, count: count } }
}
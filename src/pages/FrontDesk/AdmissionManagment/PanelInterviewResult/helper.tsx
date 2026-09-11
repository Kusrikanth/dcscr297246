import { HugeiconsIcon } from "@hugeicons/react";
import { InputCheckbox, StatusLabel, UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";
import { getDateWithTimeFormat, getDdMmYyyyWithMonthNameFormat } from "../../../../utility/dateutility";
import { MessagePreview01Icon } from "@hugeicons-pro/core-stroke-standard";

function getStatusShow(status: any) {
  switch (status) {
    case "Normal_Admission":
      return "Normal Admission";
    case "Absent":
      return "Absent";
    case "Recommended":
      return "Recommended";
    case "Conditional_Admission":
      return "Conditional Admission";
    case "On_Hold":
      return "On Hold";
    case "Rejected":
      return "Rejected";
    case "Reobservation":
      return "Reobservation";
    default:
      return "Unknown Status";
  }
}


export function generateColumns(actionsList: Array<IOptionsHrtl>, allStudentCheckHndlr: any, singleStudentCheckHndlr: any, allStudentSelectedState: any, handleReviewRemarks: any) {
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
              value={isSelected}
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
      accessor: "registrationNo",
      disableSortBy: true,
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
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div style={{ minWidth: "3.5rem" }}>
            <UserDetails
              displayName={original?.className}
              displayId={original?.groupShortName}
              showAvatar={false}
            />
          </div>
        )
      }
    },
    {
      Header: "Admission Type",
      accessor: "registrationType",
      disableSortBy: true,
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
      Header: "Phone No / Email",
      accessor: "contactNumber",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <>
          <div>{original?.contactNumber}</div>
          <div className="mt-1">{original?.emailId}</div>
        </>
      }
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
            onClick={() => handleReviewRemarks(original?.studentRegId)}
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
      Header: "Date",
      accessor: "submittedDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <div style={{ minWidth: "5rem" }}>{original?.submittedDate ? getDdMmYyyyWithMonthNameFormat(new Date(original?.submittedDate)) : '-'}</div>
          </>
        );
      },
    },
    {
      Header: "Interviewed By",
      accessor: "interviewdBy",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <>
          {original?.employeeDetailsDTO?.recommendedBy ? <UserDetails
            showAvatar={false}
            displayName={original?.employeeDetailsDTO?.recommendedBy}
            displayId={original?.employeeDetailsDTO?.employeeCode}
          /> : "-"}
        </>
      }
    },
    {
      Header: "Recommended By",
      accessor: "recommendedBy",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <>
          <div>{original?.recommendedBy || "-"}</div>
        </>
      }
    },
    {
      Header: "Referenced By",
      accessor: "referenceBy",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <>
          <div>{original?.referenceBy || "-"}</div>
        </>
      }
    },
    {
      Header: "Admission Cancelled",
      accessor: "admissionCancelled",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <div>{original?.admissionCancelled ? original?.admissionCancelled : "No"}</div>
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
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <StatusLabel type={original.status} labelName={original.status} />;
      }
    },
    {
      Header: "JODO Registered",
      accessor: "jodoRegistered",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div>{original?.jodoStudentId ? "YES" : "NO"}</div>
        )
      }
    },
    {
      Header: "JODO Registration Id",
      accessor: "jodoRegistrationId",
      disableSortBy: true,
    },
    {
      Header: "JODO Student Id",
      accessor: "jodoStudentId",
      disableSortBy: true,
    },
    {
      Header: "Payment Status",
      accessor: "jodoPaymentMethod",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { jodoPaymentMethod } = original,
          paymentStatus = jodoPaymentMethod ? jodoPaymentMethod : 'Unpaid';
        return <StatusLabel type={paymentStatus} labelName={paymentStatus} />;
      }
    },
    {
      Header: "Actions",
      accessor: "actions",
      filterable: false,
      disableSortBy: true,
      columnClassName:
        "sticky-right !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[#f3f6f9]",
      tdClass: "sticky-right !tw-z-10",
      Cell: ({ row: { original } }: any) => {
        const updatedMenuOptions = actionsList.filter(item => {
          if (item?.id === "payment-details") {
            if(!original?.jodoStudentId || !original?.jodoPaymentMethod){
              return false;
            }
            return true
          } else if (item?.id === "delete") {
            if (original?.status?.toLowerCase() === "cancelled" || original?.jodoPaymentMethod?.toLowerCase() === "paid") {
              return false;
            }
            return true;
          } else if (item?.id === "jodo-register") {
            if (!!original?.jodoStudentId && !!original?.jodoRegistrationId) {
              return false;
            }
            return true;
          }
          else if(item?.id === "edit"){
            if(original?.jodoPaymentMethod?.toLowerCase() === "paid"){
              return false
            }
          }
          return true;
        });
        if (!updatedMenuOptions.length) {
          return null;
        }
        return (
          <MoreActions actionOptions={updatedMenuOptions} rowId={original.id} isHorizontal={true} />
        );
      },
    },
  ];
}

export function generatePaymentDetailsColumns() {
  return [
    {
      Header: "Fee Name",
      accessor: "fee_component",
      disableSortBy: true,
    },
    {
      Header: "Amount (₹)",
      accessor: "amount",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span>{getAmountValueWithDecimal(original?.amount)}</span>
        );
      },
    }
  ];
}


export const sendNotificationDisabled = (panelIntResData: any) => {
  if (panelIntResData?.length) {
    let findErr: any = true;
    panelIntResData?.map((item: any) => {
      if (item?.isSelected) findErr = false;
    })
    if (findErr) return true
    else return false;
  } else {
    return true
  }
}

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (!(key === "searchString" || key === "academicYearId" || key === "classId" || key === "curriculumId" || key === "startDate"))
        count += 1;
    }
  }
  if (count > 0) { return { stateChange: showState, count: count } }
  else { return { stateChange: showState, count: count } }
}

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

export const AdmissionStatusMenuOptions = [
  {
    id: "Normal Admission",
    value: "Normal_Admission"
  },
  {
    id: "Conditional Admission",
    value: "Conditional_Admission"
  },
  {
    id: "Recommended",
    value: "Recommended"
  },
  {
    id: "Reobservation",
    value: "Reobservation"
  },
  {
    id: "Rejected",
    value: "Rejected"
  },
  // {
  //   id: "Absent",
  //   value: "Absent"
  // },
  {
    id: "On Hold",
    value: "On_Hold"
  },
  { 
    id :"Admission With Undertaking",
    value : "Admission_With_Undertaking"
  }
]

export const jodoRegisteredOptions = [
  {
    id: "YES",
    name: "Yes"
  }, {
    id: "NO",
    name: "No"
  }
]
export const paidStatusOptions = [
  {
    id: "PAID",
    name: "Paid"
  },
  {
    id: "UNPAID",
    name: "Unpaid"
  },
  {
    id: "FLEX",
    name: "Flex"
  },
  {
    id: "CRED",
    name: "Cred"
  },
  {
    id: "PAY",
    name: "Pay"
  },
  {
    id: "NO_PAY",
    name: "No Pay"
  },

]

export function renderValueEmployee(selectedItems: any, removeItemHandler: any) {
  if (Array.isArray(selectedItems)) {
    return (<div className="selected-container">
      {
        selectedItems.map((item, index) => {
          return (<div key={`item-${item?.employeeId}`} className="selectedoption-item">
            <span>{item?.employeeName}</span>
            <span data-id={item?.employeeId} onClick={removeItemHandler} className="remove-icon">
              <i className="ri-close-line"></i>
            </span>

          </div>)
        })
      }
    </div>)
  }
}

export function renderOptionsEmployee(item: any) {
  return `${item?.employeeName} - ${item?.employeeCode}`;
}

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
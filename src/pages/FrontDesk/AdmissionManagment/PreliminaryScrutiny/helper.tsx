import { Button } from "reactstrap";
import {  UserDetails } from "../../../../Components/Common";
import { IOptionsHrtl, MoreActions } from "../../../../Components/Common/MenuOptions";
import { StatusLabelWithStepper } from "./StatusLabelWithStepper";

export function generateColumns(actionsList: Array<IOptionsHrtl>,instituteCode:any) {
  return [
    {
      Header: "Registration ID",
      accessor: "studentRegistrationNo",
      disableSortBy: true,
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      columnClassName: "w-200px min-w-200px max-w-200px",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              imageUrl={original?.studentImageS3URL}
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
      Header: "Curriculum Name",
      accessor: "curriculumName",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "classShortName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
              displayName={original?.classShortName}
              displayId={original?.groupShortName}
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
      Header: "Phone",
      accessor: "contactNo",
      disableSortBy: true,
    },
    {
      Header: "Area Name",
      accessor: "areaName",
      disableSortBy: true,
    },
    {
      Header: "Mode",
      accessor: "mode",
      disableSortBy: true,
    },
    {
      Header: "Admission Type",
      accessor: "admissionType",
      disableSortBy: true,
    },
    {
      Header: "Total Points",
      accessor: "totalPoints",
      disableSortBy: true,
      Cell: ({ row: { original,index } }: any) => {
        return (
           <div data-bs-toggle="tooltip" data-bs-placement="top" title={original?.pointsDescription} style={{cursor:"pointer"}}>{original?.totalPoints}</div>
        );
      },
    },
    // {
    //   Header: "Points Description",
    //   accessor: "pointsDescription",
    //   disableSortBy: true,
    // },
    // {
    //   Header: "Remarks",
    //   accessor: "remarks",
    //   disableSortBy: true,
    // },
    {
      Header: "Status",
      accessor: "scrutinyStatus",
      disableSortBy: true,
      Cell: ({ row: { original,index } }: any) => {
        return (
            <StatusLabelWithStepper index={index} id={`${original?.scrutinyId}`} studentRegistrationId={original?.studentRegistrationId} type={original?.scrutinyStatus} labelName={original?.scrutinyStatus} />
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
        const updatedAction = actionsList.filter((action: any) => {
          if(!(original?.admissionCancel?.toLowerCase === "yes")){   
            if (action.actionName === "Consolidated View") {
              return action;
            }
            else if(action.actionName === "Cancel Admission"){
              if (original?.scrutinyStatus?.toLowerCase() !== "accepted") {
                return action;
              }
            }
            else if (action.actionName === "Document Verification" && original.documentApproveStatus !== "APPROVED") {
              return action;
            }
            else if (action.actionName === "Profile Verification" && original.documentApproveStatus === "APPROVED" && original.academicsApproveStatus !== "APPROVED") {
              return action;
            }
            else if (action.actionName === "Scrutiny Verification" && original.academicsApproveStatus === "APPROVED" && original.headDeptApproveStatus !== "APPROVED" ) {
              return action;
            }else if(action.actionName === "Send Reminder" && original?.scrutinyStatus?.toLowerCase()?.includes("document")){
              return action;
            }
          }
        })
        return (
          updatedAction?.length && <MoreActions actionOptions={updatedAction} rowId={`${original.studentRegistrationId},${original.scrutinyId}`} isHorizontal={true} />
        );
      },
    },
  ];
}
export function generateColumnsShowDocument(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Document Name",
      accessor: "documentName",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MoreActions actionOptions={actionsList} rowId={`${original?.systemFile?.s3URL}`} isHorizontal={true} />
        );
      },
    },
  ];
}


export const StatusLabelsOptions = [
  {
    id: "ON_HOLD",
    value: "On Hold"
  },
  {
    id: "APPROVED",
    value: "Approved"
  },
  {
    id: "REJECTED",
    value: "Rejected"
  }
]
export const ScritinyPrevStatus = [
  {
    id: "RECOMMENDED_FOR_OTHER_CAMPUS",
    value: "Reommended for other campus"
  },
  {
    id: "OTHER",
    value: "Other"
  },

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

export const ScrutinyStatus = [
  // {
  //   id: "DOCUMENT_APPROVAL_PENDING",
  //   value: "Document Approval Pending"
  // },
  {
    id: "DOCUMENT_APPROVED",
    value: "Document Approved"
  },
  {
    id: "DOCUMENT_RESUBMISSION_PENDING",
    value: "Document Resubmission Pending"
  },
  {
    id: "DOCUMENTS_RESUBMITTED",
    value: "Document Resubmitted"
  },
  // {
  //   id: "PROFILE_APPROVAL_PENDING",
  //   value: "Profile Approval Pending"
  // },
  {
    id: "PROFILE_APPROVAL_ON_HOLD",
    value: "Profile Approval On Hold"
  },
  {
    id: "PROFILE_APPROVAL_REJECTED",
    value: "Profile Approval Rejected"
  },
  {
    id: "PROFILE_APPROVED",
    value: "Profile Approved"
  },
  // {
  //   id: "HEAD_DEPT_APPROVAL_PENDING",
  //   value: "Head Dept Approval Pending"
  // },
  {
    id: "HEAD_DEPT_APPROVAL_ON_HOLD",
    value: "Head Dept Approval On Hold"
  },
  {
    id: "HEAD_DEPT_APPROVAL_REJECTED",
    value: "Head Dept Approval Rejected"
  },
  {
    id: "INPROGRESS",
    value: "Inprogress"
  },
  {
    id: "ACCEPTED",
    value: "Accepted"
  },
  // {
  //   id: "REJECTED",
  //   value: "Rejected"
  // },
  // {
  //   id: "ON_HOLD",
  //   value: "On Hold"
  // }

]

function downloadExcelFile(a: any) {
  const link = document.createElement('a');
  link.href = a;
  link.setAttribute('download', "abc");
  link.setAttribute('target', '_blank');
  document.body.appendChild(link);
  link.click();
  link.remove();
}


export function generateColumnsApproveDocument(actionsList: Array<IOptionsHrtl>, updateDocumentStatus: any) {
  return [
    {
      Header: "S.No.",
      accessor: "id",
      disableSortBy: true,
      Cell: ({ row: { original, index } }: any) => {
        return index + 1;
      }
    },
    {
      Header: "Document Name",
      accessor: "documentName",
      disableSortBy: true,
    },
    {
      Header: "Document Type",
      accessor: "documentType",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      filterable: false,
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <div className="text-decoration-underline" style={{ color: "#25A0E2", cursor: "pointer" }} onClick={() => downloadExcelFile(original?.systemFile?.s3URL)}>Download</div>
        );
      },
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return <div className="d-flex">

          {original.approvalStatus === "APPROVED" || original.approvalStatus === "RESUBMISSION" ? <span className={`badge text-uppercase ${original.approvalStatus === "RESUBMISSION" ? 'badge-soft-warning' : 'badge-soft-success'} p-2`}>{original.approvalStatus}</span> : original?.status ? <><span className={`badge text-uppercase me-3 text-center ${original?.status === "approve" ? 'badge-soft-success' : 'badge-soft-warning'} p-2`}>{original?.status === "approve" ? "APPROVED" : "RESUBMISSION"}</span><span className={`text-info cursor-pointer`} onClick={() => updateDocumentStatus(original.documentId, null)}>Reset</span></>
            : <>
              <Button onClick={() => updateDocumentStatus(original.documentId, "approve")} data-bs-toggle="tooltip" data-bs-placement="top" title={"Approve"} color="outline-primary me-3" className="btn-sm btn-icon" data-id={original.documentId}><i className="ri-check-line fs-24" /></Button>
              <Button onClick={() => updateDocumentStatus(original.documentId, "reject")} data-bs-toggle="tooltip" data-bs-placement="top" title={"Reject"} color={original.approvalStatus === "RESUBMISSION" ? "danger" : "outline-danger"} className="btn-sm btn-icon me-3" data-id={original.documentId}><i className="ri-close-fill fs-24" /></Button>
            </>}
        </div>
      }
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
      if(!(key === "searchString" || key === "academicYearId" || key === "scrutinyStatus" || key === "startDate"))
      count += 1;
    }
  }
  if(count>0) {return {stateChange : showState , count : count}}
  else {return {stateChange : showState , count : count}}
}
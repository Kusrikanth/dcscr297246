import { StatusLabel, UserDetails } from "../../../Components/Common";
import {
  IOptionsHrtl,
  MoreActions,
} from "../../../Components/Common/MenuOptions";
import { convertUTCToISTTimeOnly, getDdMmYyyyWithMonthNameFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";
import { StatusLabelWithStepper } from "./StatusLabelWithStepper";
import { TransferCertificateTableData } from "./transferCertificateTypes";

export const requestType = [
  {
    reqType: "Offline",
  },
  {
    reqType: "Online",
  }
]

// generate roll number table select filter
export const statusTypes = [
  {
    statusName: "Yet to prepare",
    statusType: "Yet_to_prepare",
  },
  {
    statusName: "Prepared",
    statusType: "Prepared",
  },
  {
    statusName: "Issued",
    statusType: "Issued",
  },
  {
    statusName: "Cancelled",
    statusType: "Cancelled",
  },
];

export const advanceFilterKeys = ["tcRequestStatus", "tcApplicationStartDt"];

export const menuItems = [{ id: "true", name: "Yes" }, { id: "false", name: "No" }]

export function generateColumns(actionsList: Array<IOptionsHrtl>, toggleApprovalStatusModal: any) {
  return [
    {
      Header: "TC No.",
      accessor: "tcNumber",
      disableSortBy: true,
      Cell: ({ value }: any) => <>{value || '-'}</>
    },
    {
      Header: "TC Application Date",
      accessor: "tcApplicationDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyWithMonthNameFormat(new Date(original.tcApplicationDate));
      }
    },
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.student?.studentName}
              displayId={original?.student?.studentCode}
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
    },
    {
      Header: "Section",
      accessor: "sectionName",
      disableSortBy: true,
    },
    {
      Header: "Request Type",
      accessor: "requestType",
      disableSortBy: true,
    },
    {
      Header: "Last Attendance Date",
      accessor: "lastAttendanceDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyWithMonthNameFormat(new Date(original.lastAttendanceDate));
      }
    },
    {
      Header: "Approval Status",
      accessor: "deptApprovedStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <p className="tw-text-info tw-cursor-pointer tw-m-0" onClick={() => toggleApprovalStatusModal(original.tcId)}>
            View
          </p>
        );
      },
    },
    {
      Header: "TC Status",
      accessor: "tcRequestStatus",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabelWithStepper id={`${original.tcId}`} type={original.tcRequestStatus} labelName={original.tcRequestStatus} />
        );
      },
    },
    {
      Header: "Hostel Exist Status",
      accessor: "hostelExitStatus",
      disableSortBy: true,
      Cell: ({ value }: any) => {
        const status = value ? "Yes" : "No"
        return (
          <StatusLabel type={status} labelName={status} />
        );
      },
    },
    {
      Header: "Cancel Remarks",
      accessor: "cancelRemarks",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
      Cell: ({ value }: any) => <>{value || '-'}</>
    },
    {
      Header:"Created By",
      accessor:"createdBy",
      disableSortBy:true,
      Cell:({row:{original}}:any)=>{
        return <span>{original.createdBy ? original.createdBy : "-"}</span>
      }
    },
    {
      Header: "Created Date",
      accessor: "createdAt",
      disableSortBy: true,
      Cell:({row:{original}}:any)=>{
          const [date,time] = original?.createdAt?.split("T") ?? [];
          return <UserDetails
          displayName={date ? getFormattedDateddMMMYYYY(date) : "-"}
          displayId={time ? convertUTCToISTTimeOnly(time) : "-"}
          showAvatar={false}
          ></UserDetails>
      }
    },
    {
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        let updatedActionList: any = [];
        if (original.tcRequestStatus === "Yet to prepare") {
          actionsList.forEach((action: any) => {
            (action.id === "consolidatedView" ||
              action.id === "edit" || action.id === "cancel" || action.id === "prepareCertificate" || action.id === "tcConsolidated" || action.id === "tcDepartmentApproval")
              &&
              updatedActionList.push(action)
          })
        }
        else if (original.tcRequestStatus === "Prepared") {
          actionsList.forEach((action: any) => {
            if (action.id === "consolidatedView" || action.id === "edit" || action.id === "editIssuanceCertificate" || action.id === "print tc" ||
              action.id === "issue" || action.id === "cancel" || action.id === "tcConsolidated" || action.id === "tcDepartmentApproval") { updatedActionList.push(action) }
            else if (action.id === "print" && original?.isStudyBonafiedRequired) {
              updatedActionList.push(action)
            }
          })
        }
        else if (original.tcRequestStatus === "Issued") {
          actionsList.forEach((action: any) => {
            if (action.id === "sms" || action.id === "email" ||
              action.id === "edit" || action.id === "editIssuanceCertificate" ||
              action.id === "print tc" || action.id === "cancel"|| action.id === "tcConsolidated" || action.id === "tcDepartmentApproval") {
              updatedActionList.push(action)
            } else if (action.id === "print" && original?.isStudyBonafiedRequired) {
              updatedActionList.push(action)
            }
          })
        }
        return (
          original.tcRequestStatus !== "Cancelled" && <MoreActions
            actionOptions={updatedActionList}
            rowId={original.tcId}
            isHorizontal={true}
          />
        );
      },
    },
  ];
}

export const acceptedImageFile = ["image/jpeg", "image/jpg", "image/png"];

export function uploadFileErrorHndlr(fileSize: any, fileType: string) {
  if (!acceptedImageFile.includes(fileType)) {
    return `Upload file should be of format ${acceptedImageFile.join(',')}`;
  }
  if (!isNaN(fileSize) && (Math.ceil(fileSize / (1024 * 1024)) > 1)) {
    return "Upload file should be less than 1Mb.";
  }
  return "";
}

export function validateDimension(height: number, width: number) {
  if (height > 230 || width > 200) {
    return `Max dimension for uploading photo should be 200 x 230 size.`;
  }
  return "";
}


export const classCompletionOptions = [
  {
    id: "Completed",
    name: "Completed"
  },
  {
    id: "Not Completed",
    name: "Not Completed"
  }
]  
// TODO: remove once the "revert TC to previous academic year" API is available on the backend.
// The attendance check before preparing a TC and the password authentication that follows are
// UI only for now, so the password is validated against this sample value.
export const USE_SAMPLE_TC_REVERT_AUTH = true;

export const SAMPLE_TC_REVERT_PASSWORD = "Admin@123";

export const SAMPLE_TC_REVERT_LEDGER_COUNT = 6;


import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { StatusLabel, UserDetails } from "../../../Components/Common";
import { convertUTCToISTTimeOnly, getDdMmYyyyFormat, getFormattedDateddMMMYYYY } from "../../../utility/dateutility";
import { StatusLabelWithStepper } from "./StatusLabelWithStepper";


export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Student Name",
      accessor: "studentName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              displayName={original?.studentName}
              displayId={original?.studentCode}
              imageUrl={original?.studentImage}
              size={"xs"}
              defaultImgType="student"
            />
          </>
        );
      },
    },
    {
      Header: "Curriculum",
      accessor: "curriculum",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Date of Birth",
      accessor: "dob",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.dob ? getDdMmYyyyFormat(new Date(original?.dob)) : "-";
      },
    },
    {
      Header: "Created Date",
      accessor: "idCardIssueDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return getDdMmYyyyFormat(new Date(original?.idCardIssueDate))
      },
    },
    {
      Header: "Approval Status",
      accessor: "idCardStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const { idCardStatus } = original;
        return idCardStatus ? (
          <StatusLabelWithStepper id={`${original.idCadrNo}`} type={original.idCardStatus} labelName={original.idCardStatus} idCardStatus={original.idCardStatus} />
        ) : (
          "-"
        );
      },
    },
    {
      Header: "Remarks",
      accessor: "cancelRemarks",
      disableSortBy: true,
      columnClassName: "tw-w-[300px] tw-min-w-[300px] tw-max-w-[300px]",
      Cell:({row:{original}}:any)=>{
        return <span>{original.cancelRemarks ? original.cancelRemarks : "-"}</span>
      }
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
        if (original.idCardStatus === "PAYMENT_PENDING") {
          updatedActionList.push(
            actionsList.find((action: any) => action.id === "pay-now")
          );
        }
        if (original.idCardStatus === "YET_TO_PREPARE") {
          updatedActionList.push(
            actionsList.find((action: any) => action.id === "prepare-id-card")
          );
        }
        if (original.idCardStatus === "PREPARED") {
          updatedActionList.push(
            actionsList.find((action: any) => action.id === "issue-certificate"),
            actionsList.find((action: any) => action.id === "send-notification")
          );
        }
        
        if (original.idCardStatus === "CANCELLED") {
          updatedActionList.push(
            actionsList.find((action: any) => action.id === "send-notification"),
            actionsList.find((action: any) => action.id === "request-reupload"),
          );
        }
        if (original.idCardStatus === "REQUEST_REUPLOAD") {
          updatedActionList.push(
            actionsList.find((action: any) => action.id === "reupload-student-image"),
          );
        }
        if (original.idCardStatus === "ISSUED" || original.idCardStatus === "PAYMENT_PENDING") {
          updatedActionList.push(
            actionsList.find((action: any) => action.id === "preview-idcard")
          );
        }
  
        const cancelOption = actionsList.find((action: any) => action.id === "cancel");
        if (
          original.idCardStatus !== "CANCELLED" && 
          original.idCardStatus !== "ISSUED" && 
          !updatedActionList.includes(cancelOption)
        ) {
          updatedActionList.push(cancelOption);
        }
        const actionOptions = updatedActionList
          .filter(Boolean)
          .map((action: any) => ({
            ...action,
            onClickHndlr: (event: any) => {
              event.currentTarget.setAttribute("data-idCadrNo", original.idCadrNo);
              action.onClickHndlr(event);
            },
          }));

        return (
          
            <MoreActions
              actionOptions={actionOptions}
              rowId={original.idCadrNo}
              isHorizontal={true}
            />
          
        );
      },
    }
  ];
}


export const paymentModeType = [
  {
    id: "CASH",
    name: "CASH"
  },
  {
    id: "CARD",
    name: "CARD"
  },
  {
    id: "UPI",
    name: "UPI"
  },
]

export const idCardStatusType = [
  {
    id: "PREPARED",
    name: "Prepared"
  },
  {
    id: "ISSUED",
    name: "Issued"
  },
  {
    id: "YET_TO_PREPARE",
    name: "Yet to Prepare"
  },
  {
    id: "PAYMENT_PENDING",
    name: "PAYMENT PENDING"
  },
  {
    id: "CANCELLED",
    name: "Cancelled"
  },
]

export const transactionStateStatusType = [
  {
    id: "SUCCESS",
    name: "SUCCESS"
  },
  {
    id: "FAILED",
    name: "FAILED"
  },
]

export const ignoredKeys = ["searchString", "academicYearId", "curriculumId", "classId", "idCardStatus"];

export const acceptedImageFile = ["image/jpeg", "image/jpg", "image/png"];

export function validateDimension(height: number, width: number) {
  if (height !== 264 || width !== 208) {
    return `Max dimension for uploading photo should be 208 x 264 size.`;
  }
  return "";
}

export function uploadFileErrorHndlr(fileSize: any, fileType: string) {
  const MAX_FILE_SIZE = 1024 * 1024;
  if (!acceptedImageFile.includes(fileType)) {
    return `Upload file should be of format ${acceptedImageFile.join(',')}`;
  }
  if (!isNaN(fileSize) && fileSize > MAX_FILE_SIZE) {
    return "Upload file should be 1 MB or less.";
  }
  return "";
}
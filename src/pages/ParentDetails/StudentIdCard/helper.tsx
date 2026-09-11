import { IOptionsHrtl, MenuOptionHrtl, MoreActions } from "../../../Components/Common/MenuOptions";
import { StatusLabel, UserDetails } from "../../../Components/Common";
import { getDdMmYyyyFormat } from "../../../utility/dateutility";

export const acceptedImageFile = ["image/jpeg", "image/jpg", "image/png"];

export function validateDimension(height: number, width: number) {
  if (height > 200 || width > 200) {
    return `Max dimension for uploading photo should be 200 x 200 size.`;
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

export function generateColumns(actionsList: any[]) {
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
              displayId={original?.idCadrNo}
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
    // {
    //   Header: "Approval Status",
    //   accessor: "idCardStatus",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     const { idCardStatus } = original;

    //     return idCardStatus ? (
    //       <StatusLabel type={idCardStatus} labelName={idCardStatus} />
    //     ) : (
    //       "-"
    //     );
    //   },
    // },
    // {
    //   Header: "Payment Status",
    //   accessor: "paymentDetails",
    //   disableSortBy: true,
    //   Cell: ({ row: { original } }: any) => {
    //     const { paymentDetails } = original;
    //     return paymentDetails?.transactionState ? (
    //       <StatusLabel type={paymentDetails?.transactionState} labelName={"PAID"} />
    //     ) : (
    //       <StatusLabel type={"failed"} labelName="NOT PAID" />
    //     );
    //   }
    // },
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
      Header: "Actions",
      disableSortBy: true,
      filterable: false,
      Cell: ({ row: { original } }: any) => {
        const { idCardStatus } = original;
        let filteredActions: any[] = [];
        if (
          idCardStatus?.toLowerCase() === "issued" ||
          idCardStatus === "PAYMENT_PENDING"
        ) {
          filteredActions = actionsList.filter(
            (action: any) => action.id === "prepare-id-card"
          );
        }
        else if (idCardStatus === "REQUEST_REUPLOAD") {
          filteredActions = actionsList.filter(
            (action: any) => action.id === "reupload-student-image"
          );
        }

        return filteredActions.length > 0 ? (
          <MenuOptionHrtl
            actionOptions={filteredActions}
            rowId={original.idCadrNo}
          />
        ) : (
          "-"
        );
      },
    },
  ];
}

export const idCardStatusType = [
  {
    id: "INPROGRESS",
    name: "INPROGRESS"
  },
  {
    id: "APPROVED",
    name: "APPROVED"
  },
  {
    id: "REJECTED",
    name: "REJECTED"
  }
]

// export const ignoredKeys = ["searchString", "academicYearId", "curriculumId", "classId", "idCardStatus"];

export function createPaymentPayload(otherProps: any) {
  return (
    {
      branchId: otherProps?.branchId,
      academicYearId: otherProps?.academicYearId,
      curriculumId: otherProps?.curriculumId,
      classId: otherProps?.classId,
      name: otherProps?.childName,
      phone: otherProps?.smsPriorityNo,
      email: otherProps?.emailId,
      paymentType: "GENERAL_FEE",
      subPaymentType: "ID_CARD",
      identifier: otherProps?.childCode,
      studentId: otherProps?.studentId,
      fineAmount: 0,
      concessionAmount: 0,
      actualAmount: Number(otherProps?.amount),
      details: [
        {
          component_type: "Payable Amount",
          amount: Number(import.meta.env.VITE_ENVIRONMENT === "dev" ? "1.0" : otherProps?.amount)
        }
      ],
      source: "WEB",
      gateWayType: otherProps?.gateWayType,
      callback_url: `${import.meta.env.VITE_APPLICATION_URL}/studentidcardsuccess/${otherProps?.id}`
    }
  )
}
import React from "react";
import { StatusLabel, UserDetails } from "../../../Components/Common";
import { getDdMmYyyyWithMonthNameFormat } from "../../../utility/dateutility";

export const completionStatusData: Array<any> = [
  {
    id: "Incomplete",
    name: "Incomplete",
  },
  {
    id: "Complete",
    name: "Complete",
  },
  {
    id: "Cancelled",
    name: "Cancelled",
  },
];

export const admissionTypeData = [
  { id: 1, name: "Residential" },
  { id: 2, name: "Non-Residential" },
];

export const AdmissionTypeMenuOptions = [
  { id: 1, value: "Residential" },
  { id: 2, value: "Non-Residential" },
];

export const currentStatusOptions = [
  {
    id: "ADMISSION PROCESS INCOMPLETE",
  },

  {
    id: "REGISTRATION FORM INCOMPLETE",
  },
  {
    id: "REGISTRATION FORM COMPLETED",
  },

  {
    id: "DOCUMENTS RESUBMISSION",
  },
  {
    id: "DOCUMENTS RESUBMITTED",
  },
  {
    id: "DOCUMENT APPROVED",
  },
  {
    id: "ON HOLD PROFILE APPROVAL PENDING",
  },
  {
    id: "ON HOLD RECOMMENDED TO OTHER CAMPUS",
  },
  {
    id: "PROFILE APPROVAL REJECTED",
  },
  {
    id: "PROFILE APPROVED",
  },
  {
    id: "HEAD DEPT APPROVAL ON HOLD",
  },
  {
    id: "HEAD DEPT APPROVAL REJECTED",
  },
  {
    id: "HEAD DEPT APPROVED",
  },

  {
    id: "EXAM SCHEDULE - EXAM SCHEDULED",
  },
  {
    id: "EXAM SCHEDULE - HEAD OF THE DEPARTMENT APPROVED",
  },
  {
    id: "EXAM SCHEDULE - ADMISSION CANCELED",
  },

  {
    id: "EXAM MARKS RESULT-PASS",
  },
  {
    id: "EXAM MARKS RESULT-FAIL",
  },
  {
    id: "EXAM MARKS RESULT - ABSENT",
  },

  {
    id: "PANEL INTERVIEW SCHEDULED",
  },
  {
    id: "PANEL INTERVIEW RESCHEDULED",
  },
  {
    id: "PANEL INTERVIEW COMPLETED",
  },
  {
    id: "PANEL INTERVIEW - ABSENT",
  },

  {
    id: "SELECTED",
  },
  {
    id: "WAIT LISTED",
  },
  {
    id: "NOT SELECTED",
  },

  {
    id: "ADMISSION CONFIRMED",
  },
  {
    id: "ADMISSION CANCELLED",
  },
  {
    id: "ADMISSION DEFERRED",
  },

  {
    id: "TRANSPORT REGISTRATION PENDING",
  },
  {
    id: "TRANSPORT REGISTRATION COMPLETED",
  },
  {
    id: "TRANSPORT APPROVED",
  },
  {
    id: "TRANSPORT REJECTED",
  },
  {
    id: "TRANSPORT CANCELLED",
  },
];

export const searchInputOptions = [
  { id: "global", name: "Global Search" },
  { id: "registrationNo", name: "Registration No" },
  { id: "studentName", name: "Student Name" },
  { id: "applicationSaleNo", name: "Application Sale No" },
  { id: "aadharNo", name: "Aadhar No" },
  { id: "smsPriorityNo", name: "SMS Priority No" },
  { id: "whatsappNo", name: "WhatsApp No" },
];

export function hasStateChanged(newState: any) {
  let count: any = 0;
  let showState: boolean = false;
  for (const key in newState) {
    const newValue = newState[key];
    if (newValue) {
      showState = true;
      if (
        !(
          key === "searchString" ||
          key === "academicYearId" ||
          key === "completionStatus" ||
          key === "startDate"
        )
      )
        count += 1;
    }
  }
  if (count > 0) {
    return { stateChange: showState, count: count };
  } else {
    return { stateChange: showState, count: count };
  }
}

export const generateTransportColumns = (redirectHandler: any) => {
  return [
    {
      Header: "Registration ID",
      accessor: "registrationNo",
      disableSortBy: true,
      columnClassName: "sticky-left",
      // Cell: ({ row: { original } }: any) => {
      //   return (
      //     <>
      //       <div
      //         className="text-info cursor-pointer"
      //         data-id={original?.registrationId}
      //         onClick={redirectHandler}
      //       >
      //         {original?.registrationNo}
      //       </div>
      //     </>
      //   );
      // },
    },
    {
      Header: "Registration Date",
      accessor: "registrationDate",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <span className="tw-text-nowrap">
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
      Cell: ({ row: { original } }: any) => {
        return (
          <>
            <UserDetails
              imageUrl={original?.studentImageUrl}
              displayName={original?.studentName}
              displayId={original?.applicationSaleNo}
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
              displayId={original?.fatherMailId}
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
          <span className="badge text-uppercase bg-light text-muted tw-p-2">
            {" "}
            {original?.admissionProcess}{" "}
          </span>
        ) : (
          <span className="tw-ms-2">-</span>
        );
      },
    },
    {
      Header: "latitute",
      accessor: "latitude",
      disableSortBy: true,
    },
    {
      Header: "longitude",
      accessor: "longitude",
      disableSortBy: true,
    },
    {
      Header: "Cancellation Reason",
      accessor: "admissionCancelReason",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return original?.admissionCancelReason || "-";
      },
    },
  ];
};

import React, { useState } from "react";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { MenuOptionHrtl, StatusLabel } from "../../../../Components/Common";
import { WhatsAppDataTypes } from "./WhatsAppDataTypes";

function getClasses(options: (Array<any> | null)) {
  if (Array.isArray(options) && options.length > 0) {
    return (
      <div className="tw-flex tw-flex-wrap tw-gap-1">
        {options.map((item, index) => {
          return (
            <span key={item.classId}  className="badge tw-uppercase bg-light text-muted tw-p-2">{item.classShortName}</span>
          )
        })}
      </div>
    )
  }
}

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "S.no",
      accessor: "sno",
      disableSortBy: true,
      Cell: ({ row: { original,index } }: any) => {
        return (<span>{index+1}</span>)
      },
    },
    {
      Header: "Template Name",
      accessor: "templateName",
      disableSortBy: true,
    },
    {
      Header: "Feature Name",
      accessor: "featureName",
      disableSortBy: true,
    },
    {
      Header: "Description",
      accessor: "description",
      disableSortBy: true,
      columnClassName: "tw-min-w-[300px]",
    },
    {
      Header: "Send Type",
      accessor: "sendType",
      disableSortBy: true,
    },
    {
      Header: "Classes",
      accessor: "classes",
      disableSortBy: true,
      columnClassName: "tw-min-w-[300px]",
      Cell: ({ row }: any) => {
        const { original } = row,
          { classes } = original;
        return (
          getClasses(classes)
        );
      },
    },
    {
      Header: "Action",
      thClass: "w-5",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl actionOptions={actionList} rowId={original.id} />
        );
      },
    },
  ];

}

  export const ExaminationWeightageTableData: Array<WhatsAppDataTypes> =
    [
      {
        id: 1,
        sno: "1",
        templateName: "Live Lecture Scheduled",
        alertName: "LIVE LECTURE SCHEDULED ALERT",
        dtlTemplateId: "",
        subject: "Live Lecture Scheduled",
        recipientName: "STUDENT",
        templateFormate: "Dear STUDENT",
        status: "Pending",
      },
      {
        id: 2,
        sno: "2",
        templateName: "Live Lecture Start",
        templateFormate: "Dear Parent, performance sheet of your ward in . Regards Principal DPS",
        alertName: "LIVE LECTURE START ALERT",
        dtlTemplateId: "",
        subject: "Live Lecture Started",
        recipientName: "PARENT",
        status: "Pending",
      },
      {
        id: 3,
        sno: "3",
        templateName: "Exit Confirm Alert for Staff",
        templateFormate: "Dear Staff, Greetings! As per gadget policy, School intends to provide laptops to staff members as per your preference.",
        alertName: "Exit Confirm Alert for Staff",
        dtlTemplateId: "",
        subject: "Exit Confirm Alert",
        recipientName: "STAFF",
        status: "Pending",
      },
      {
        id: 4,
        sno: "4",
        templateName: "NextLab Course Invitation",
        templateFormate: "Dear Employee, Greetings! As per gadget policy, School intends to provide laptops to staff members as per your preference and the cost incurred will be recovered in Equated Monthly Instalments starting from the month of issue of the gadget.",
        alertName: "NEXTLAB USER REGISTRATION INVITATION ALERT",
        dtlTemplateId: "Alert",
        subject: "NextLab Course Invitation",
        recipientName: "Employee",
        status: "Pending",
      },
    ];

    export const sendTypeOptions = [
      {
        id:"INSTITUTE",
        name:"INSTITUTE"
      },
      {
        id:"BRANCH",
        name:"BRANCH" 
      },
      {
        id:"CLASS",
        name:"CLASS"
      }
   ]
   
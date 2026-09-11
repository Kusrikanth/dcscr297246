import React, { useState } from "react";
import { IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { MenuOptionHrtl, StatusLabel } from "../../../../Components/Common";
import { CommunicationReportsDataTypes } from "./CommunicationReportsDataTypes";

export function generateColumns(actionList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Batch Id",
      accessor: "sno",
      disableSortBy: true,
    },
    {
      Header: "Subject",
      accessor: "templateName",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "Message",
      accessor: "templateFormate",
      disableSortBy: true,
      columnClassName: "tw-w-[400px] tw-min-w-[400px] tw-max-w-[400px]",
    },
    {
      Header: "Contact Type",
      accessor: "contactType",
      disableSortBy: true,
    },
    {
      Header: "Total",
      accessor: "total",
      disableSortBy: true,
    },
    {
      Header: "Delivered",
      accessor: "delivered",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
    },
    {
      Header: "Not Delivered",
      accessor: "notDelivered",
      disableSortBy: true,
      columnClassName: "tw-w-[250px] tw-min-w-[250px] tw-max-w-[250px]",
    },
    {
      Header: "Delivery %",
      accessor: "deliveryPercent",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "Sent By",
      accessor: "sentBy",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
    {
      Header: "Sent (Date & Time)",
      accessor: "sent",
      disableSortBy: true,
      columnClassName: "tw-w-[200px] tw-min-w-[200px] tw-max-w-[200px]",
    },
  ];
}

  export const ExaminationWeightageTableData: Array<CommunicationReportsDataTypes> =
    [
      {
        id: 1,
        sno: "1",
        templateName: "Live Lecture Scheduled",
        delivered: "1",
        deliveryPercent: "100",
        notDelivered: "0",
        total: "1",
        sentBy: "User",
        contactType: "STUDENT",
        templateFormate: "Dear STUDENT",
        sent: "23-02-2024, 01:00",
      },
      {
        id: 2,
        sno: "2",
        templateName: "Live Lecture Start",
        templateFormate: "Dear Parent, performance sheet of your ward in . Regards Principal DPS",
        delivered: "2",
        deliveryPercent: "100",
        notDelivered: "0",
        total: "2",
        sentBy: "System Generated",
        contactType: "PARENT",
        sent: "20-07-2024, 12:00",
      },
      {
        id: 3,
        sno: "3",
        templateName: "Exit Confirm Alert for Staff",
        templateFormate: "Dear Staff, Greetings! As per gadget policy, School intends to provide laptops to staff members as per your preference.",
        delivered: "8",
        notDelivered: "0",
        total: "8",
        deliveryPercent: "100",
        sentBy: "User",
        contactType: "STAFF",
        sent: "23-09-2024, 16:00",
      },
      {
        id: 4,
        sno: "4",
        templateName: "NextLab Course Invitation",
        templateFormate: "Dear Employee, Greetings! As per gadget policy, School intends to provide laptops to staff members as per your preference and the cost incurred will be recovered in Equated Monthly Instalments starting from the month of issue of the gadget.",
        delivered: "6",
        deliveryPercent: "100",
        notDelivered: "0",
        total: "6",
        sentBy: "System Generated",
        contactType: "Employee",
        sent: "03-03-2024, 16:00",
      },
    ];
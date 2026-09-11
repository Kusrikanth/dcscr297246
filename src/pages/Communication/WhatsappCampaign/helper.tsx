import { original } from "@reduxjs/toolkit";
import {
  IOptionsHrtl,
  MenuOptionHrtl,
} from "../../../Components/Common/MenuOptions";
import { StatusLabel, UserDetails } from "../../../Components/Common";

const statusTypes = {
  scheduled: "inprogress",
  sent: "success",
  draft: "warning",
  failed: "failed",
};

const recipientsTypes = {
  delivered: "inprogress",
  read: "success",
  failed: "failed",
};

export function generateColumns(actionsList: Array<IOptionsHrtl>) {
  return [
    {
      Header: "Name",
      accessor: "campaignName",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.campaignName}
            displayId={original.campaignId}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: "Type",
      accessor: "campaignType",
      disableSortBy: true,
    },
    {
      Header: "Target",
      accessor: "campaignTarget",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <UserDetails
            displayName={original.campaignTarget}
            displayId={original.campaignTargetCount}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: "Scheduled",
      accessor: "campaignScheduled",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        const [date, time] = original.campaignScheduled.split(", ");
        return (
          <UserDetails
            displayName={date}
            displayId={time}
            showAvatar={false}
          ></UserDetails>
        );
      },
    },
    {
      Header: "Status",
      accessor: "campaignStatus",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            labelName={original.campaignStatus}
            type={statusTypes[original.campaignStatus.toLowerCase()]}
          ></StatusLabel>
        );
      },
    },
    {
      Header: "Delivery",
      accessor: "campaignDelivery",
      disableSortBy: true,
    },
    {
      Header: "Actions",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <MenuOptionHrtl
            actionOptions={actionsList}
            rowId={original.id}
          ></MenuOptionHrtl>
        );
      },
    },
  ];
}

export const tableData = [
  {
    id: "1",
    campaignName: "Diwali Greetings",
    campaignId: "CAMP001",
    campaignType: "WhatsApp",
    campaignTarget: "Parents",
    campaignTargetCount: "1250",
    campaignScheduled: "02-Nov-2025, 10:00 AM",
    campaignStatus: "Scheduled",
    campaignDelivery: "Pending",
  },
  {
    id: "2",
    campaignName: "Fee Reminder - Term 2",
    campaignId: "CAMP002",
    campaignType: "WhatsApp",
    campaignTarget: "Parents",
    campaignTargetCount: "980",
    campaignScheduled: "15-Oct-2025, 09:30 AM",
    campaignStatus: "Sent",
    campaignDelivery: "96%",
  },
  {
    id: "3",
    campaignName: "PTM Schedule Announcement",
    campaignId: "CAMP003",
    campaignType: "Email",
    campaignTarget: "Parents",
    campaignTargetCount: "1435",
    campaignScheduled: "18-Oct-2025, 06:00 PM",
    campaignStatus: "Sent",
    campaignDelivery: "93%",
  },
  {
    id: "4",
    campaignName: "Exam Timetable - Grade 10",
    campaignId: "CAMP004",
    campaignType: "App",
    campaignTarget: "Students",
    campaignTargetCount: "420",
    campaignScheduled: "22-Oct-2025, 08:00 AM",
    campaignStatus: "Sent",
    campaignDelivery: "99%",
  },
  {
    id: "5",
    campaignName: "Staff Meeting Reminder",
    campaignId: "CAMP005",
    campaignType: "SMS",
    campaignTarget: "Staff",
    campaignTargetCount: "85",
    campaignScheduled: "20-Oct-2025, 04:30 PM",
    campaignStatus: "Scheduled",
    campaignDelivery: "Pending",
  },
  {
    id: "6",
    campaignName: "Holiday Notice - Winter Break",
    campaignId: "CAMP006",
    campaignType: "WhatsApp",
    campaignTarget: "All",
    campaignTargetCount: "2150",
    campaignScheduled: "01-Dec-2025, 11:00 AM",
    campaignStatus: "Draft",
    campaignDelivery: "—",
  },
  {
    id: "7",
    campaignName: "Library Book Due Reminder",
    campaignId: "CAMP007",
    campaignType: "SMS",
    campaignTarget: "Students",
    campaignTargetCount: "610",
    campaignScheduled: "25-Oct-2025, 05:15 PM",
    campaignStatus: "Sent",
    campaignDelivery: "90%",
  },
  {
    id: "8",
    campaignName: "New Canteen Menu Update",
    campaignId: "CAMP008",
    campaignType: "App",
    campaignTarget: "Students",
    campaignTargetCount: "1250",
    campaignScheduled: "28-Oct-2025, 12:00 PM",
    campaignStatus: "Sent",
    campaignDelivery: "98%",
  },
  {
    id: "9",
    campaignName: "Teacher Training Workshop",
    campaignId: "CAMP009",
    campaignType: "Email",
    campaignTarget: "Teachers",
    campaignTargetCount: "110",
    campaignScheduled: "05-Nov-2025, 03:00 PM",
    campaignStatus: "Scheduled",
    campaignDelivery: "Pending",
  },
  {
    id: "10",
    campaignName: "Transport Route Change Alert",
    campaignId: "CAMP010",
    campaignType: "WhatsApp",
    campaignTarget: "Parents",
    campaignTargetCount: "560",
    campaignScheduled: "12-Nov-2025, 07:30 AM",
    campaignStatus: "Failed",
    campaignDelivery: "0% (Bounced)",
  },
];

export const typeOptions = [
  { label: "WhatsApp", value: "whatsapp" },
  { label: "SMS", value: "sms" },
  { label: "Email", value: "email" },
  { label: "App Notification", value: "app" },
];

export const statusOptions = [
  { label: "Scheduled", value: "scheduled" },
  { label: "Sent", value: "sent" },
  { label: "Draft", value: "draft" },
  { label: "Failed", value: "failed" },
];

export const audienceOptions = [
  { label: "Parents", value: "parents" },
  { label: "Students", value: "students" },
  { label: "Staff", value: "staff" },
  { label: "All", value: "all" },
];

export const branchOptions = [
  { label: "Nacharam", value: "nacharam" },
  { label: "Nadergul", value: "nadergul" },
  { label: "Aerocity", value: "aerocity" },
];

export function recipientsGenerateColumns() {
  return [
    {
      Header: "Name",
      accessor: "name",
      disableSortBy: true,
    },
    {
      Header: "Class",
      accessor: "className",
      disableSortBy: true,
    },
    {
      Header: "Phone",
      accessor: "phone",
      disableSortBy: true,
    },
    {
      Header: "Status",
      accessor: "status",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => {
        return (
          <StatusLabel
            labelName={original.status}
            type={recipientsTypes[original.status.toLowerCase()]}
          ></StatusLabel>
        );
      },
    },
    {
      Header: "Timestamp",
      accessor: "timestamp",
      disableSortBy: true,
    },
  ];
}

export const recipientsTableData = [
  {
    id: "1",
    name: "Parent - A Kumar",
    className: "10-A",
    phone: "+91 98XX XX10",
    status: "Delivered",
    timestamp: "2025-10-15 18:20",
  },
  {
    id: "2",
    name: "Parent - S Iyer",
    className: "10-B",
    phone: "+91 98XX XX11",
    status: "Read",
    timestamp: "2025-10-15 18:21",
  },
  {
    id: "3",
    name: "Parent - R Kaur",
    className: "10-C",
    phone: "+91 98XX XX12",
    status: "Failed",
    timestamp: "2025-10-15 18:22",
  },
  {
    id: "4",
    name: "Parent - A Kumar",
    className: "10-A",
    phone: "+91 98XX XX13",
    status: "Delivered",
    timestamp: "2025-10-15 18:23",
  },
  {
    id: "5",
    name: "Parent - S Iyer",
    className: "10-B",
    phone: "+91 98XX XX14",
    status: "Read",
    timestamp: "2025-10-15 18:24",
  },
];

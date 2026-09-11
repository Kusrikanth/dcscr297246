import { StatusLabel } from "../../../../Components/Common";

export function generateColumns() {
  return [
    {
      Header: "Complaint No",
      accessor: "complaintNo",
      disableSortBy: true,
      columnClassName: "sticky tw-left-0 tw-min-w-[200px] tw-w-[200px] tw-max-w-[200px] tw-relative tw-z-10",
    },
    {
      Header: "Branch Name",
      accessor: "branchName",
      disableSortBy: false,
      columnClassName: "",
    },
    {
      Header: "Request Type",
      accessor: "requestType",
      disableSortBy: false,
      columnClassName: "",
    },
    {
      Header: "Complaint Subject",
      accessor: "complaintSubject",
      disableSortBy: true,
      columnClassName: "tw-min-w-[300px] tw-w-[300px] tw-max-w-[300px]",
    },
    {
      Header: "Open From (Days)",
      accessor: "openFromDays",
      disableSortBy: false,
      columnClassName: "",
    },
    {
      Header: "Department Name",
      accessor: "departmentName",
      disableSortBy: true,
      columnClassName: "",
    },
    {
      Header: "Complaint Satus",
      accessor: "complaintStatus",
      disableSortBy: true,
      columnClassName: "tw-text-center",
      Cell : ({ row: { original } }: any) => {
        return <StatusLabel type={original.complaintStatus} labelName={original.complaintStatus} />
      }
    },
  ];
}

export const tableData = [
  {
    complaintNo: "CFNH0094",
    branchName: "Nacharam",
    requestType: "NEW_IMPLEMENTATION",
    complaintSubject: "Request you to add few details in fee Concession",
    openFromDays: 58,
  },
  {
    complaintNo: "CFNH0154",
    branchName: "Nadergul",
    requestType: "ISSUE",
    complaintSubject: "Need to send some info to the CCAvenue portal",
    openFromDays: 57,
  },
  {
    complaintNo: "CFNH0164",
    branchName: "Aerocity",
    requestType: "CHANGE_REQUEST",
    complaintSubject: "Helpdesk Module Concern to parents has issue",
    openFromDays: 56,
  },
  {
    complaintNo: "CFNH0198",
    branchName: "Mahendra Hills",
    requestType: "NEW_IMPLEMENTATION",
    complaintSubject: "Access to download previous year TC certificate",
    openFromDays: 50,
  },
  {
    complaintNo: "CFNH0206",
    branchName: "Santhosh Nagar",
    requestType: "NEW_IMPLEMENTATION",
    complaintSubject: "Include languages counts in dashboard and export",
    openFromDays: 49,
  },
  {
    complaintNo: "CFNH0242",
    branchName: "Nacharam",
    requestType: "NEW_IMPLEMENTATION",
    complaintSubject: "notification logs screen for each branch",
    openFromDays: 44,
  },
  {
    complaintNo: "CFNH0250",
    branchName: "Nadergul",
    requestType: "ISSUE",
    complaintSubject: "Studease data not available in Digital Campus",
    openFromDays: 44,
  },
  {
    complaintNo: "CFNH0272",
    branchName: "Aerocity",
    requestType: "NEW_IMPLEMENTATION",
    complaintSubject: "Complete registration details in export - registra",
    openFromDays: 42,
  },
  {
    complaintNo: "CFNH0274",
    branchName: "Mahendra Hills",
    requestType: "CHANGE_REQUEST",
    complaintSubject: "inactive concession showing in concessions screen",
    openFromDays: 42,
  },
  {
    complaintNo: "CFA10050",
    branchName: "Santhosh Nagar",
    requestType: "CHANGE_REQUEST",
    complaintSubject: "Admission Number column in Student Ledger",
    openFromDays: 40,
  },
];

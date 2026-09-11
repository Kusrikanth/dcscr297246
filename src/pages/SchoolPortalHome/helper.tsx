import { HugeiconsIcon } from "@hugeicons/react";
import {
  getDateDdMMFormat,
  getTimeFormatWithTimeZone,
} from "../../utility/dateutility";
import {
  Book02Icon,
  File01Icon,
  UserGroupIcon,
} from "@hugeicons-pro/core-stroke-standard";

export interface IPortalEmployee {
  id: string;
  name: string;
  title: string;
  department: string;
}

export interface IApprovalRequest {
  id: number;
  type: string;
  person: string;
  detail: string;
  range: string;
  submitted: string;
  priority: string;
  requirement: "mandatory" | "acknowledgement";
}

export interface ITaskComment {
  id: number;
  text: string;
  author: string;
  createdAt: string;
}

export interface IPortalTask {
  id: string;
  title: string;
  owner: string;
  assignee: string;
  createdAt: string;
  deadline: string;
  source: string;
  status: "open" | "completed";
  completedDate?: string;
  closedAt?: string;
  remarks?: string;
  comments?: Array<ITaskComment>;
  previousAssignee?: string;
  reassignmentRemarks?: string;
}

export const currentUser = {
  name: "K. Srikanth",
  role: "Branch Admin",
  canApprove: true,
};

export const campusOptions = [
  { key: "NH", name: "NH - Nacharam" },
  { key: "KP", name: "KP - Kompally" },
  { key: "MH", name: "MH - Mahendra Hills" },
];

export const calendarEmployees: Array<IPortalEmployee> = [
  {
    id: "EMP-1008",
    name: "K. Srikanth",
    title: "Branch Administrator",
    department: "Administration",
  },
  {
    id: "EMP-1094",
    name: "Neha Kapoor",
    title: "Senior Administrator",
    department: "Administration",
  },
  {
    id: "EMP-1021",
    name: "Kavitha Rao",
    title: "Accounts Manager",
    department: "Accounts",
  },
  {
    id: "EMP-1048",
    name: "Joseph Mathew",
    title: "IT Administrator",
    department: "Information Technology",
  },
  {
    id: "EMP-1086",
    name: "Preeti Sharma",
    title: "Admissions Head",
    department: "Admissions",
  },
];

export const initialApprovals: Array<IApprovalRequest> = [
  {
    id: 1,
    type: "Leave request",
    person: "Aarav Mehta",
    detail: "Class IX-A · Medical leave",
    range: "18–20 Aug",
    submitted: "Today, 9:12 AM",
    priority: "Urgent",
    requirement: "mandatory",
  },
  {
    id: 2,
    type: "Fee concession",
    person: "Meera Nair",
    detail: "Class VII-C · Sibling concession",
    range: "2026–27",
    submitted: "Yesterday",
    priority: "Normal",
    requirement: "mandatory",
  },
  {
    id: 3,
    type: "Purchase request",
    person: "R. Prakash",
    detail: "Science Department · Lab supplies",
    range: "₹18,450",
    submitted: "15 Aug",
    priority: "Normal",
    requirement: "mandatory",
  },
  {
    id: 4,
    type: "TC request acknowledgement",
    person: "Nisha Kapoor",
    detail: "Class X-B · IT clearance notification",
    range: "TC-2026-184",
    submitted: "14 Aug",
    priority: "Normal",
    requirement: "acknowledgement",
  },
];

export const approvalTypeOptions = [
  { key: "All requests", name: "All requests" },
  { key: "Leave request", name: "Leave request" },
  { key: "Fee concession", name: "Fee concession" },
  { key: "Purchase request", name: "Purchase request" },
  { key: "Event permission", name: "Event permission" },
];

export const initialTasks: Array<IPortalTask> = [
  {
    id: "ACT-201",
    title: "Verify pending TC documents",
    owner: "K. Srikanth",
    assignee: "Neha Kapoor",
    createdAt: "2026-08-14T09:10",
    deadline: "2026-08-17T04:00",
    source: "TC Request",
    status: "open",
  },
  {
    id: "ACT-202",
    title: "Reconcile concession approval receipts",
    owner: "Kavitha Rao",
    assignee: "K. Srikanth",
    createdAt: "2026-08-15T11:25",
    deadline: "2026-08-18T12:30",
    source: "Fee Concession",
    status: "open",
  },
  {
    id: "ACT-198",
    title: "Publish updated bus route list",
    owner: "Joseph Mathew",
    assignee: "K. Srikanth",
    createdAt: "2026-08-12T10:00",
    deadline: "2026-08-15T03:00",
    source: "Transport",
    status: "completed",
    completedDate: "2026-08-16T09:20",
    closedAt: "16 Aug, 9:20 AM",
    remarks: "Updated route list published to the parent app.",
  },
];

export const taskDateTypeOptions = [
  { key: "deadline", name: "Due date" },
  { key: "createdAt", name: "Created date" },
  { key: "completedDate", name: "Completed date" },
];

export const feedItems = [
  {
    icon: File01Icon,
    title: "Term I examination schedule published",
    meta: "Examination Office · 24 minutes ago",
    tag: "Academic",
  },
  {
    icon: UserGroupIcon,
    title: "Class IX parent-teacher meeting",
    meta: "Saturday, 22 August · Auditorium",
    tag: "Notice",
  },
  {
    icon: Book02Icon,
    title: "Updated library circulation policy",
    meta: "Library · Yesterday",
    tag: "Policy",
  },
];

export const eventItems = [
  {
    day: "18",
    month: "AUG",
    title: "Inter-house quiz",
    time: "10:00 AM",
    place: "Main auditorium",
  },
  {
    day: "20",
    month: "AUG",
    title: "Faculty development workshop",
    time: "2:30 PM",
    place: "Seminar hall",
  },
  {
    day: "22",
    month: "AUG",
    title: "Parent-teacher meeting",
    time: "9:00 AM",
    place: "Classrooms",
  },
];

export const birthdays = [
  { initials: "AK", name: "Ananya Krishnan", role: "Student · VIII-B" },
  { initials: "VS", name: "Vikram Singh", role: "Faculty · Mathematics" },
  { initials: "RM", name: "Riya Malhotra", role: "Student · X-A" },
];

export const fixedHolidays: Record<string, string> = {
  "2026-08-15": "Independence Day",
  "2026-09-05": "Teachers' Day",
};

export const punchRecords: Record<string, Array<string>> = {
  "2026-08-01": ["08:42 AM", "04:36 PM"],
  "2026-08-03": ["08:51 AM", "04:42 PM"],
  "2026-08-04": ["08:47 AM", "04:39 PM"],
  "2026-08-05": ["08:55 AM", "04:48 PM"],
  "2026-08-06": ["08:44 AM", "04:35 PM"],
  "2026-08-07": ["08:49 AM", "04:51 PM"],
  "2026-08-08": ["08:52 AM", "01:18 PM"],
  "2026-08-10": ["08:41 AM", "04:46 PM"],
  "2026-08-11": ["08:58 AM", "04:40 PM"],
  "2026-08-12": ["08:45 AM", "04:54 PM"],
  "2026-08-13": ["08:48 AM", "04:44 PM"],
  "2026-08-14": ["08:43 AM", "04:31 PM"],
};

export const initialEmployeeNotes: Record<string, Record<string, string>> = {
  "EMP-1094": {
    "2026-08-05":
      "Admissions review — completed the document verification review for 18 applicants.",
  },
  "EMP-1021": {
    "2026-08-11":
      "Fee reconciliation — reconciled online receipts and shared exceptions with Finance.",
  },
  "EMP-1048": {
    "2026-08-07":
      "Network maintenance — updated access points in the senior school block.",
  },
};

export const homeworkRecords = [
  {
    id: 1,
    title: "Light and Reflection - Practice Questions",
    kind: "Homework",
    datetime: "2026-08-16T11:20:00",
    curriculum: "CBSE",
    targets: ["VIII-B", "VIII-C"],
  },
  {
    id: 2,
    title: "Quadratic Equations Worksheet.pdf",
    kind: "File",
    datetime: "2026-08-16T10:05:00",
    curriculum: "CBSE",
    targets: ["X-A", "X-B"],
  },
  {
    id: 3,
    title: "The Last Leaf - Reading Assignment",
    kind: "Homework",
    datetime: "2026-08-16T09:35:00",
    curriculum: "CBSE",
    targets: ["IX-A", "IX-C"],
  },
  {
    id: 4,
    title: "भारत की खोज - Chapter Notes.pdf",
    kind: "File",
    datetime: "2026-08-16T08:50:00",
    curriculum: "CBSE",
    targets: ["VII-A", "VII-B", "VII-C"],
  },
  {
    id: 5,
    title: "Plant Transport Lab Observation",
    kind: "Homework",
    datetime: "2026-08-15T02:10:00",
    curriculum: "Cambridge",
    targets: ["VI-A", "VI-B"],
  },
  {
    id: 6,
    title: "Indian Constitution Reference Notes.pdf",
    kind: "File",
    datetime: "2026-08-14T12:30:00",
    curriculum: "State Board",
    targets: ["IX-B"],
  },
];

export const curriculumOptions = ["CBSE", "Cambridge", "State Board"].map(
  (name) => ({ id: name, name })
);
export const classOptions = ["VI", "VII", "VIII", "IX", "X"].map((name) => ({
  id: name,
  name,
}));
export const sectionOptions = ["A", "B", "C", "D"].map((name) => ({
  id: name,
  name,
}));

export const communications: Record<string, Array<any>> = {
  whatsapp: [
    {
      id: "wa-1",
      title: "PTM reminder",
      audience: "Class IX parents",
      time: "10:15 AM",
      message:
        "Dear Parent, the Class IX Parent-Teacher Meeting is scheduled for Saturday, 22 August from 9:00 AM. Please confirm your attendance.",
      sent: 128,
      engaged: 109,
    },
    {
      id: "wa-2",
      title: "Fee due reminder",
      audience: "Pending fee accounts",
      time: "Yesterday",
      message:
        "This is a reminder that the Term I fee payment is due by 20 August. Please ignore this message if payment has already been completed.",
      sent: 74,
      engaged: 61,
    },
  ],
  app: [
    {
      id: "app-1",
      title: "Homework published",
      audience: "Class VIII-B",
      time: "11:20 AM",
      message:
        "Science homework on Light and Reflection has been published. Submission is due on 18 August.",
      sent: 46,
      engaged: 33,
    },
    {
      id: "app-2",
      title: "School bus update",
      audience: "Route 12 users",
      time: "9:05 AM",
      message:
        "Route 12 is delayed by approximately 15 minutes due to traffic near Tarnaka.",
      sent: 82,
      engaged: 68,
    },
  ],
};

export function generateHomeworkColumns() {
  return [
    {
      Header: "Title",
      accessor: "title",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <div className="tw-flex tw-items-center tw-gap-2">
          <span
            className={`tw-flex tw-items-center tw-justify-center tw-rounded-md tw-w-8 tw-h-8 tw-flex-shrink-0 ${original?.kind === "File"
                ? "tw-bg-blue-50 tw-text-blue-600"
                : "tw-bg-teal-50 tw-text-teal-600"
              }`}
          >
            <HugeiconsIcon
              icon={original?.kind === "File" ? File01Icon : Book02Icon}
              size={15}
            />
          </span>
          <span className="tw-flex tw-flex-col tw-min-w-0">
            <strong className="tw-text-sm">{original?.title}</strong>
            <small className="tw-text-gray-500">
              {original?.kind} · {original?.curriculum}
            </small>
          </span>
        </div>
      ),
    },
    {
      Header: "Date & time",
      accessor: "datetime",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <span className="tw-flex tw-flex-col">
          <span>{getDateDdMMFormat(original?.datetime)}</span>
          <small className="tw-text-gray-500">
            {getTimeFormatWithTimeZone(original?.datetime)}
          </small>
        </span>
      ),
    },
    {
      Header: "Classes",
      accessor: "targets",
      disableSortBy: true,
      Cell: ({ row: { original } }: any) => (
        <div className="tw-flex tw-flex-wrap tw-gap-1">
          {(original?.targets || []).map((target: string) => (
            <span key={target} className="badge badge-soft-secondary">
              {target}
            </span>
          ))}
        </div>
      ),
    },
  ];
}

export const searchableEmployees = calendarEmployees.map((employee) => ({
  ...employee,
  searchLabel: `${employee.name} ${employee.id} ${employee.title} ${employee.department}`,
}));

export function findEmployeeById(id?: string) {
  return calendarEmployees.find((employee) => employee.id === id);
}

export function findEmployeeByName(name?: string) {
  return calendarEmployees.find((employee) => employee.name === name);
}

export function renderEmployeeOption(item: IPortalEmployee) {
  return `${item?.name} - ${item?.id}`
}

export function renderEmployeeValue(item: IPortalEmployee) {
  if (!item) return null;
  return `${item?.name} - ${item?.id}`
}

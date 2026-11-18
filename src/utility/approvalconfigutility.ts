import { useEffect, useState } from "react";
import { getSessionStorage, setSessionStorage } from "./storageUtility";

// TODO: replace with the approval-configuration APIs once they are available on the backend.
// Until then the configuration lives in session storage so Branch Settings > Approval
// Configuration and the Transfer Request Approvals screens stay in sync without a live backend.
export const APPROVAL_CONFIG_STORAGE_KEY = "approvalActivityConfigurations";

export const TC_REQUEST_ACTIVITY_ID = "tc-request";

export interface IApprovalEmployee {
  id: string;
  name: string;
  title: string;
  department: string;
}

export interface IApplicableClass {
  classId?: string;
  /** Class short name as the approval screens display it (e.g. "V", "II"). */
  className: string;
  curriculumName?: string;
}

export interface IActivityParticipant {
  employeeId: string;
  /** Kept on the participant so names resolve even for employees outside the sample list. */
  employeeName?: string;
  department: string;
  role: "mandatory" | "acknowledgement";
  /**
   * Classes this participant may approve for. Empty or missing means every
   * class — e.g. an accountant or the principal approves for all classes,
   * while a vice principal may be limited to a couple of classes.
   */
  applicableClasses?: Array<IApplicableClass>;
  /**
   * TC Request only: whether this approver requires the TC retention form.
   * Asked when the person is added; defaults to no.
   */
  tcRetentionFormEnabled?: boolean;
}

export interface IApprovalActivity {
  id: string;
  name: string;
  description: string;
  active: boolean;
  participants: Array<IActivityParticipant>;
}

export const approvalEmployees: Array<IApprovalEmployee> = [
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
    id: "EMP-1002",
    name: "Dr. Anjali Menon",
    title: "Principal",
    department: "School Leadership",
  },
  {
    id: "EMP-1094",
    name: "Neha Kapoor",
    title: "Senior Administrator",
    department: "Administration",
  },
  {
    id: "EMP-1127",
    name: "Rakesh Iyer",
    title: "Records Officer",
    department: "Student Records",
  },
  {
    id: "EMP-1017",
    name: "Suresh Nair",
    title: "Finance Controller",
    department: "Accounts",
  },
  {
    id: "EMP-1163",
    name: "Meera Pillai",
    title: "Librarian",
    department: "Library",
  },
  {
    id: "EMP-1058",
    name: "Rohan Das",
    title: "Vice Principal",
    department: "School Leadership",
  },
  {
    id: "EMP-1086",
    name: "Preeti Sharma",
    title: "Admissions Head",
    department: "Admissions",
  },
  {
    id: "EMP-1142",
    name: "Manoj Reddy",
    title: "Admissions Executive",
    department: "Admissions",
  },
];

export const starterActivities: Array<IApprovalActivity> = [
  {
    id: TC_REQUEST_ACTIVITY_ID,
    name: "TC Request",
    description: "Transfer certificate issue workflow",
    active: true,
    participants: [
      {
        employeeId: "EMP-1021",
        employeeName: "Kavitha Rao",
        department: "Accounts",
        role: "mandatory",
      },
      {
        employeeId: "EMP-1058",
        employeeName: "Rohan Das",
        department: "Accounts",
        role: "mandatory",
        applicableClasses: [
          { className: "IV" },
          { className: "V" },
        ],
      },
      {
        employeeId: "EMP-1163",
        employeeName: "Meera Pillai",
        department: "Library",
        role: "mandatory",
      },
      {
        employeeId: "EMP-1048",
        employeeName: "Joseph Mathew",
        department: "Information Technology",
        role: "acknowledgement",
      },
      {
        employeeId: "EMP-1002",
        employeeName: "Dr. Anjali Menon",
        department: "Principal",
        role: "mandatory",
      },
      {
        employeeId: "EMP-1094",
        employeeName: "Neha Kapoor",
        department: "Administration",
        role: "mandatory",
      },
      {
        employeeId: "EMP-1127",
        employeeName: "Rakesh Iyer",
        department: "Student Records",
        role: "acknowledgement",
      },
    ],
  },
  {
    id: "concession-approval",
    name: "Concession Approval",
    description: "Student fee concession approval",
    active: true,
    participants: [
      {
        employeeId: "EMP-1017",
        employeeName: "Suresh Nair",
        department: "Accounts",
        role: "mandatory",
      },
    ],
  },
  {
    id: "admission-cancellation",
    name: "Admission Cancellation",
    description: "Admission withdrawal and account closure",
    active: true,
    participants: [
      {
        employeeId: "EMP-1017",
        employeeName: "Suresh Nair",
        department: "Accounts",
        role: "mandatory",
      },
      {
        employeeId: "EMP-1086",
        employeeName: "Preeti Sharma",
        department: "Admissions",
        role: "mandatory",
      },
    ],
  },
];

export interface IApprovalScreen {
  /** Stable id — screens look their configuration up by this id. */
  id: string;
  name: string;
  description: string;
  /** Module the screen lives under in the side menu. */
  module: string;
}

/**
 * Catalog of the screens across the application where approvals apply.
 * The Approval Configuration "Add activity" picker offers these, so every
 * approval screen can be brought under employee-dependent approval. Ids are
 * stable: a screen reads its approvers via the activity with the same id.
 */
export const approvalScreenCatalog: Array<IApprovalScreen> = [
  {
    id: TC_REQUEST_ACTIVITY_ID,
    name: "TC Request",
    description:
      "Transfer certificate approvals — Fee (Accounts) and Library Transfer Request Approvals screens",
    module: "Transfer Certificate",
  },
  {
    id: "campus-transfer-fee-refund",
    name: "Campus Transfer Fee Refund",
    description: "Fee > Approvals > Campus Transfer Fee Refund Approvals",
    module: "Fee",
  },
  {
    id: "change-campus",
    name: "Change Campus",
    description: "Fee > Approvals > Change Campus",
    module: "Fee",
  },
  {
    id: "admission-withdrawal",
    name: "Admission Withdrawal",
    description: "Fee > Approvals > Admission Withdrawal",
    module: "Fee",
  },
  {
    id: "it-form-approval",
    name: "IT Form Approval",
    description: "Fee > Approvals > IT Form Approvals",
    module: "Fee",
  },
  {
    id: "cash-payment-approval",
    name: "Cash Payment Approval",
    description: "Fee > Approvals > Cash Payment Approvals",
    module: "Fee",
  },
  {
    id: "fee-refund",
    name: "Fee Refund",
    description: "Fee > Fee Refunds",
    module: "Fee",
  },
  {
    id: "concession-approval",
    name: "Concession Approval",
    description: "Student fee concession approval (Academic / Fee Concessions)",
    module: "Fee",
  },
  {
    id: "admission-cancellation",
    name: "Admission Cancellation",
    description: "Admission withdrawal and account closure",
    module: "Admissions",
  },
  {
    id: "hostel-exit",
    name: "Hostel Exit",
    description: "Hostel > Approvals > Hostel Exit Approvals",
    module: "Hostel",
  },
  {
    id: "hostel-fee-exit",
    name: "Hostel Fee Exit",
    description: "Hostel > Approvals > Hostel Fee Exit Approvals",
    module: "Hostel",
  },
  {
    id: "transport-tc-request",
    name: "Transportation TC Request",
    description: "Transportation > TC Request approvals",
    module: "Transportation",
  },
  {
    id: "crm-tracker-approval",
    name: "CRM Tracker Approval",
    description: "CRM > Tracker > My Approvals",
    module: "CRM",
  },
];

/** Module group an activity belongs to in the Approval Configuration screen. */
export function getApprovalScreenModule(activityId: string) {
  return (
    approvalScreenCatalog.find((screen) => screen.id === activityId)?.module ||
    "Custom"
  );
}

export function createActivityFromScreen(
  screen: IApprovalScreen
): IApprovalActivity {
  return {
    id: screen.id,
    name: screen.name,
    description: screen.description,
    active: true,
    participants: [],
  };
}

type ApprovalConfigListener = (activities: Array<IApprovalActivity>) => void;

const approvalConfigListeners = new Set<ApprovalConfigListener>();

export function getApprovalActivities(): Array<IApprovalActivity> {
  try {
    const activities = getSessionStorage(APPROVAL_CONFIG_STORAGE_KEY);
    return Array.isArray(activities) && activities.length
      ? activities
      : starterActivities;
  } catch {
    return starterActivities;
  }
}

function notifyApprovalConfigListeners(activities: Array<IApprovalActivity>) {
  approvalConfigListeners.forEach((listener) => listener(activities));
}

export function saveApprovalActivities(activities: Array<IApprovalActivity>) {
  setSessionStorage(APPROVAL_CONFIG_STORAGE_KEY, activities);
  notifyApprovalConfigListeners(activities);
}

export function subscribeToApprovalActivities(listener: ApprovalConfigListener) {
  approvalConfigListeners.add(listener);
  return () => {
    approvalConfigListeners.delete(listener);
  };
}

/** Keeps a component re-rendering whenever the approval configuration is saved in this session. */
export function useApprovalActivities() {
  const [activities, setActivities] = useState<Array<IApprovalActivity>>(
    getApprovalActivities
  );

  useEffect(() => {
    setActivities(getApprovalActivities());
    return subscribeToApprovalActivities(setActivities);
  }, []);

  return activities;
}

export function getLoggedInUserName(userMeResp: any) {
  const { firstName = "", lastName = "" } = userMeResp || {};
  return `${firstName || ""} ${lastName || ""}`.trim();
}

function getLoggedInUserIds(userMeResp: any) {
  return [userMeResp?.id, userMeResp?.loggedInUserInformation?.id]
    .filter((id) => id !== undefined && id !== null && `${id}`.length)
    .map((id) => `${id}`);
}

/**
 * The approval configuration dropdown also offers the logged-in user, so an
 * administrator can designate themselves while the employee APIs are pending.
 */
export function getApprovalEmployeeOptions(
  userMeResp: any
): Array<IApprovalEmployee> {
  const userName = getLoggedInUserName(userMeResp);
  const [userId] = getLoggedInUserIds(userMeResp);
  if (!userName || !userId) {
    return approvalEmployees;
  }
  return [
    {
      id: userId,
      name: `${userName} (You)`,
      title: userMeResp?.role?.name || "Logged-in user",
      department: "Accounts",
    },
    ...approvalEmployees.filter((employee) => employee.id !== userId),
  ];
}

const DEPARTMENT_MATCHERS: Record<string, RegExp> = {
  ACCOUNTS: /account|fee|finance/i,
  LIBRARY: /librar/i,
};

function participantBelongsToDepartment(
  participant: IActivityParticipant,
  departmentName: string
) {
  const matcher = DEPARTMENT_MATCHERS[departmentName];
  return matcher ? matcher.test(participant?.department || "") : false;
}

function isLoggedInUserParticipant(
  participant: IActivityParticipant,
  userMeResp: any
) {
  if (getLoggedInUserIds(userMeResp).includes(`${participant?.employeeId}`)) {
    return true;
  }
  // Name fallback keeps the demo working when the configuration was saved from
  // another session where the user id differed.
  const userName = getLoggedInUserName(userMeResp).toLowerCase();
  const participantName = `${participant?.employeeName || ""}`
    .replace(/\s*\(you\)\s*$/i, "")
    .trim()
    .toLowerCase();
  return !!userName && !!participantName && userName === participantName;
}

/**
 * True when the participant may approve for the given class (empty scope = all
 * classes). Scopes can span curriculums, so when both sides know the
 * curriculum it must match too — the same short name can exist in several
 * curriculums.
 */
export function participantCoversClass(
  participant: IActivityParticipant | undefined,
  className?: string,
  curriculumName?: string
) {
  const applicableClasses = participant?.applicableClasses || [];
  if (!applicableClasses.length) {
    return true;
  }
  const target = `${className || ""}`.trim().toLowerCase();
  const targetCurriculum = `${curriculumName || ""}`.trim().toLowerCase();
  return (
    !!target &&
    applicableClasses.some((item) => {
      const itemCurriculum = `${item?.curriculumName || ""}`.trim().toLowerCase();
      return (
        `${item?.className || ""}`.trim().toLowerCase() === target &&
        (!itemCurriculum || !targetCurriculum || itemCurriculum === targetCurriculum)
      );
    })
  );
}

export function getClassScopeLabel(participant?: IActivityParticipant) {
  const applicableClasses = participant?.applicableClasses || [];
  return applicableClasses.length
    ? applicableClasses.map((item) => item.className).join(", ")
    : "All classes";
}

export interface ITcApprovalAccess {
  /** false means no approver is configured for the department, so the screen keeps its legacy open access. */
  restricted: boolean;
  /** True when the user can approve at least some classes. */
  canApprove: boolean;
  /** Row-level check: may the logged-in user approve a request of this class? */
  canApproveClass: (className?: string, curriculumName?: string) => boolean;
  /** Mandatory approvers configured for the department. */
  approvers: Array<IActivityParticipant>;
  approverNames: Array<string>;
  currentApprover?: IActivityParticipant;
  /** Classes the logged-in approver is limited to; empty means all classes. */
  currentApproverClassNames: Array<string>;
  /**
   * Acknowledgement participants for the department. They are informed but do
   * not approve — requests proceed without any action from them.
   */
  acknowledgers: Array<IActivityParticipant>;
  /** True when the logged-in user is an acknowledgement participant (and not an approver). */
  isAcknowledger: boolean;
}

/**
 * Employee-dependent approval check for the Transfer Request Approvals screens.
 * Only the employees configured as mandatory approvers of the "TC Request"
 * activity (for the matching department) may approve or reject; everyone else
 * with screen access is view-only. When nothing is configured for a department
 * the screen falls back to the earlier screen-based behaviour.
 */
export function getTcApprovalAccess(
  activities: Array<IApprovalActivity>,
  departmentName: string,
  userMeResp: any
): ITcApprovalAccess {
  const tcActivity = (activities || []).find(
    (activity) => activity?.id === TC_REQUEST_ACTIVITY_ID
  );
  const departmentParticipants =
    tcActivity && tcActivity.active
      ? (tcActivity.participants || []).filter(
          (participant) =>
            participant?.employeeId &&
            participantBelongsToDepartment(participant, departmentName)
        )
      : [];
  const approvers = departmentParticipants.filter(
    (participant) => participant?.role === "mandatory"
  );
  const acknowledgers = departmentParticipants.filter(
    (participant) => participant?.role === "acknowledgement"
  );
  const restricted = approvers.length > 0;
  const currentApprover = approvers.find((participant) =>
    isLoggedInUserParticipant(participant, userMeResp)
  );
  const approverNames = approvers.map((participant) => {
    const name =
      `${participant?.employeeName || ""}`.replace(/\s*\(you\)\s*$/i, "").trim() ||
      `Employee ${participant?.employeeId}`;
    const applicableClasses = participant?.applicableClasses || [];
    return applicableClasses.length
      ? `${name} (classes ${getClassScopeLabel(participant)})`
      : name;
  });

  return {
    restricted,
    canApprove: !restricted || !!currentApprover,
    canApproveClass: (className?: string, curriculumName?: string) =>
      !restricted ||
      (!!currentApprover &&
        participantCoversClass(currentApprover, className, curriculumName)),
    approvers,
    approverNames,
    currentApprover,
    currentApproverClassNames: (currentApprover?.applicableClasses || []).map(
      (item) => item.className
    ),
    acknowledgers,
    isAcknowledger:
      !currentApprover &&
      acknowledgers.some((participant) =>
        isLoggedInUserParticipant(participant, userMeResp)
      ),
  };
}

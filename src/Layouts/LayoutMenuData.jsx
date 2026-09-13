//Institute Icon
import { default as DashboardSvg } from "../assets/imagesdps/menuicon/institute-icon/new-dashboard.svg?react";
import { default as ReportsSvg } from "../assets/imagesdps/menuicon/institute-icon/reports.svg?react";

//Branch Icon
import { default as BrchAcademicSvg } from "../assets/imagesdps/menuicon/branch-icon/new-academics.svg?react";
import { default as BrchDirectorySvg } from "../assets/imagesdps/menuicon/branch-icon/new-directory.svg?react";
import { default as BrchExaminationSvg } from "../assets/imagesdps/menuicon/branch-icon/examination.svg?react";
import { default as BrchStuAttSvg } from "../assets/imagesdps/menuicon/branch-icon/new-student-attendance.svg?react";
import { default as BrchFeeSvg } from "../assets/imagesdps/menuicon/branch-icon/new-fee.svg?react";
import { default as BrchFrontDeskSvg } from "../assets/imagesdps/menuicon/branch-icon/admissions.svg?react";
import { default as BrchHrmsSvg } from "../assets/imagesdps/menuicon/branch-icon/hrms.svg?react";
import { default as BrchTransportationSvg } from "../assets/imagesdps/menuicon/branch-icon/transportation.svg?react";
import { default as BrchUserMangmntSvg } from "../assets/imagesdps/menuicon/branch-icon/user-management.svg?react";
import { default as BrchNewExaminationSvg } from "../assets/imagesdps/menuicon/branch-icon/latest-examination.svg?react";
import { default as BrchHostelSvg } from "../assets/imagesdps/menuicon/branch-icon/latest-hostel.svg?react";
import { default as BrchLibrarySvg } from "../assets/imagesdps/menuicon/branch-icon/latest-library.svg?react";
import { default as ConcernFeedbakSvg } from "../assets/imagesdps/menuicon/branch-icon/concern-feedback.svg?react";
import { default as BrchNewHrmsSvg } from "../assets/imagesdps/menuicon/branch-icon/latest-hrms.svg?react";
import { default as BrchHealthRecordsSvg } from "../assets/imagesdps/menuicon/branch-icon/latest-health-records.svg?react";
import { default as BrchNewUserManagementSvg } from "../assets/imagesdps/menuicon/branch-icon/latest-user-management.svg?react";
import { default as BrchUploadSvg } from "../assets/imagesdps/menuicon/branch-icon/new-upload.svg?react";
import { default as BrchParentUploadSvg } from "../assets/imagesdps/menuicon/branch-icon/parentupload.svg?react";
import { default as BrchNewCommunicationSvg } from "../assets/imagesdps/menuicon/branch-icon/latest-communication.svg?react";

//Admin Icon
import { default as AdmnBillingPaymentSvg } from "../assets/imagesdps/menuicon/admin-icon/billing-payment.svg?react";
import { default as AdmnEmployeesSvg } from "../assets/imagesdps/menuicon/admin-icon/employees.svg?react";
import { default as AdmnInstituteSvg } from "../assets/imagesdps/menuicon/admin-icon/institute.svg?react";
import { default as AdmnLogoutSvg } from "../assets/imagesdps/menuicon/admin-icon/latest-logout.svg?react";

//Parent Login Icons

import { default as ParentFeeSvg } from "../assets/imagesdps/ParentDetails/ParentFee.svg?react";
import { default as ProfileDetailsSvg } from "../assets/imagesdps/ParentDetails/ProfileDetails.svg?react";
import { default as RequestSvg } from "../assets/imagesdps/ParentDetails/Request.svg?react";
import { default as TransportationSvg } from "../assets/imagesdps/ParentDetails/Latest-Transportation.svg?react";

import { pallaviHiddneFeatures } from "../Components/constants/common";
import { HugeiconsIcon } from "@hugeicons/react";
import { Building03Icon, Calendar03Icon, FileManagementIcon, HeadsetIcon, HelpCircleIcon, PaintBoardIcon, PlayCircleIcon, SecurityCheckIcon, Settings01Icon } from "@hugeicons-pro/core-stroke-standard";

export function generateMenuOptions(instituteCode) {
  return ([
    {
      id: "dashboard",
      menuName: "Dashboards",
      iconImage: <DashboardSvg />,
      link: "/dashboard",
      allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
      permissions: [""],
    },
    {
      id: "branch-dashboard",
      menuName: "Dashboards",
      iconImage: <DashboardSvg />,
      link: "/branch-dashboard",
      allowedRoles: ["BRANCH_ADMIN"],
      permissions: [""]
    },
    {
      id: "school-portal-dashboard",
      menuName: "School Dashboard",
      iconImage: <DashboardSvg />,
      link: "/school-portal-dashboard",
      allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "EMPLOYEE"],
      permissions: [""],
    },
    {
      id: "institute-institutions",
      menuName: "Institutions",
      iconImage: <AdmnInstituteSvg />,
      link: "/institute-institution",
      allowedRoles: ["INSTITUTE_ADMIN"],
      permissions: [""],
    },
    {
      id: "admin-institutions",
      menuName: "Institutions",
      // icon: "bx bxs-bank",
      iconImage: <AdmnInstituteSvg />,
      link: "/#",
      allowedRoles: ["SUPER_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/institute-list", "/branch-list"],
      childMenu: [
        {
          id: "institute-list",
          menuName: "Institute List",
          link: "/institute-list",
          parentId: "institutions",
          permissions: [""],
        },
        {
          id: "branch-list",
          menuName: "Branch List",
          link: "/branch-list",
          parentId: "institutions",
          permissions: [""],
        },
      ],
    },
    {
      id: "billing_and_payments",
      menuName: "Billing & Payments",
      // icon: "las la-wallet",
      iconImage: <AdmnBillingPaymentSvg />,
      link: "/billing-payments",
      allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
      permissions: [""],
    },
    {
      id: "communication",
      menuName: "Communication",
      // icon: "las la-headset",
      iconImage: <HugeiconsIcon icon={HeadsetIcon} size={20} className="hugeicons-icon" />,

      link: "/communication",
      allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
      permissions: [""],
    },
    {
      id: "reports",
      menuName: "Reports",
      // icon: "bx bxs-report",
      iconImage: <ReportsSvg />,
      link: "/reports",
      allowedRoles: ["INSTITUTE_ADMIN"],
      permissions: [""],
    },
    {
      id: "academics",
      menuName: "Academics",
      iconImage: <BrchAcademicSvg />,
      link: "/#",
      allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
      permissions: [],
      childRoutes: ["/section-management", "/assign-group", "/generate-roll-number",
        "/class-subject", "/student-subject-allocation", "/subject-teacher", "/change-student-subject",
        "/higher-class-eligibility", "/promote-student", "/detention-promotion", "/assign-languages", "/not-reporting-students", "/manage-languages"],
      hasChildMenu: true,
      childMenu: [
        {
          id: "classroom-managment-list",
          menuName: "Classroom Managment",
          parentId: "academics",
          link: "/#",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/section-management", "/assign-group", "/generate-roll-number"],
          childMenu: [
            {
              id: "section-management-list",
              menuName: "Section Managment",
              link: "/section-management",
              parentId: "academics",
              permissions: [""],
            },
            {
              id: "assign-group-list",
              menuName: "Assign Group",
              link: "/assign-group",
              parentId: "academics",
              permissions: [""],
            },
            {
              id: "generate-roll-number-list",
              menuName: "Generate Roll Numbers",
              link: "/generate-roll-number",
              parentId: "academics",
              permissions: [""],
            },
          ]
        },
        {
          id: "subject-managment-list",
          menuName: "Subject Managment",
          parentId: "academics",
          link: "/#",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/class-subject", "/student-subject-allocation", "/subject-teacher", "/change-student-subject", "/manage-languages"],
          childMenu: [
            {
              id: "class-subject-list",
              menuName: "Class Subjects",
              link: "/class-subject",
              parentId: "academics",
              permissions: [""],
            },
            {
              id: "manage-languages",
              menuName: "Manage Languages",
              link: "/manage-languages",
              parentId: "academics",
              permissions: [""],
            },
            {
              id: "student-subject-allocation",
              menuName: "Student Subject Allocation",
              link: "/student-subject-allocation",
              parentId: "academics",
              permissions: [""],
            },
            {
              id: "subject-teacher-list",
              menuName: "Subject Teacher",
              link: "/subject-teacher",
              parentId: "academics",
              permissions: [""],
            },
            {
              id: "change-student-subject",
              menuName: "Change Student Subject",
              link: "/change-student-subject",
              parentId: "academics",
              permissions: [""],
            }
          ]
        },
        {
          id: "detentions-promotions",
          menuName: "Detentions & Promotions",
          parentId: "academics",
          link: "/#",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/higher-class-eligibility", "/promote-student", "/detention-promotion",],
          childMenu: [
            {
              id: "higher-class-eligibility-list",
              menuName: "Higher Class Eligibility",
              link: "/higher-class-eligibility",
              parentId: "academics",
              permissions: [""],
            },
            {
              id: "promote-students-list",
              menuName: "Promote Students",
              link: "/promote-student",
              parentId: "academics",
              permissions: [""],
            },
            {
              id: "detention-promotion-list",
              menuName: "Detention Or Promotion",
              link: "/detention-promotion",
              parentId: "academics",
              permissions: [""],
            },
          ]
        },
        {
          id: "assign-languages",
          menuName: "Assign Languages",
          parentId: "academic",
          link: "/assign-languages",
          permissions: [""],
          hasChildMenu: false,
        },
        {
          id: "not-reporting-students",
          menuName: "Not Reporting Students",
          parentId: "academic",
          link: "/not-reporting-students",
          permissions: [""],
          hasChildMenu: false,
        },
      ],
    },
    {
      id: "lms",
      menuName: "LMS",
      iconImage: <HugeiconsIcon icon={FileManagementIcon} size={22} className="hugeicons-icon" />,
      link: "/lms",
      allowedRoles: ["BRANCH_ADMIN", "LMS", "TEACHER"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/create-course", "/question-bank", "/create-assessment", "/lms-settings", "/student-assessments", "/created-assessments", "/assessment-list", "/teacher-created-assessments", "/lms-dashboard", "/course-directory", "/course-planner", "/digital-curriculum", "/meeting-schedules", "/meeting-links", "/live-classes"],
      childMenu: [
        {
          id: "lms-dashboard",
          menuName: "Dashboard",
          link: "/lms-dashboard",
          permissions: [""],
          parentId: "lms",
          hasChildMenu: false,
        },
        {
          id: "course-management",
          menuName: "Course Management",
          link: "/course-management",
          permissions: [""],
          parentId: "lms",
          hasChildMenu: true,
          childRoutes: ["/create-course"],
          childMenu: [
            {
              id: "create-course",
              menuName: "Create Course",
              link: "/create-course",
              parentId: "course-management",
              permissions: [""],
            },
          ]
        },
        {
          id: "question-Pool",
          menuName: "Question Pool",
          link: "/question-Pool",
          permissions: [""],
          parentId: "lms",
          hasChildMenu: true,
          childRoutes: ["/question-bank"],
          childMenu: [
            {
              id: "question-bank",
              menuName: "Question Bank",
              link: "/question-bank",
              parentId: "question-Pool",
              permissions: [""],
            },
          ]
        },
        {
          id: "assemessnt-engine",
          menuName: "Assessment",
          link: "/assemessnt-engine",
          permissions: [""],
          parentId: "lms",
          hasChildMenu: true,
          childRoutes: ["/create-assessment", "/created-assessments", "/assessment-list", "/teacher-created-assessments"],
          childMenu: [
            // {
            //   id: "assessment/create-assessment",
            //   menuName: "Create Assement",
            //   link: "/create-assessment",
            //   parentId: "assemessnt-engine",
            //   permissions: [""],
            // },
            {
              id: "assessment-list",
              menuName: "Admin Assessments",
              link: "/assessment-list",
              parentId: "assemessnt-engine",
              permissions: [""],
            },
            // {
            //   id:"created-assessments",
            //   menuName:"Created Assessments",
            //   link:"/created-assessments",
            //   parentId: "lms",
            //   permissions: [""],
            // }
            // },
            {
              id: "teacher-created-assessments",
              menuName: "Teacher Assessments",
              link: "/teacher-created-assessments",
              parentId: "lms",
              permissions: [""],
            },
            {
              id: "student-created-assessments",
              menuName: "Student Assessments",
              link: "/student-created-assessments",
              parentId: "lms",
              permissions: [""],
            }
          ]
        },
        {
          id: "course-directory",
          menuName: "Course Directory",
          link: "/course-directory",
          permissions: [""],
          parentId: "lms",
        },
        {
          id: "digital-curriculum",
          menuName: "Digital Curriculum",
          link: "/digital-curriculum",
          permissions: [""],
          parentId: "lms",
        },
        {
          id: "course-planner",
          menuName: "Course Planner",
          link: "/course-planner",
          permissions: [""],
          parentId: "lms",
        },
        {
          id: "lms-settings",
          menuName: "Settings",
          link: "/lms-settings",
          permissions: [""],
          parentId: "lms",
        },
        {
          id: "student-assessments",
          menuName: "Student Assessments",
          link: "/student-assessments",
          permissions: [""],
          parentId: "lms",
        },
        {
          id: "lms-meetings",
          menuName: "Meetings",
          link: "/#",
          parentId: "lms",
          hasChildMenu: true,
          childRoutes: ["/meeting-schedules", "/meeting-links", "/live-classes"],
          childMenu: [
            {
              id: "meeting-schedules",
              menuName: "Schedules",
              link: "/meeting-schedules",
              parentId: "lms",
              permissions: [""],
            },
            {
              id: "live-classes",
              menuName: "Live Classes",
              link: "/live-classes",
              parentId: "lms",
              permissions: [""],
            },
            {
              id: "meeting-settings",
              menuName: "Settings",
              link: "/#",
              parentId: "lms",
              permissions: [""],
              hasChildMenu: true,
              childRoutes: ["/meeting-schedules", "/meeting-links"],
              childMenu: [
                {
                  id: "meeting-links",
                  menuName: "Meeting Links",
                  link: "/meeting-links",
                  parentId: "lms",
                  permissions: [""],
                }
              ]
            }
          ],
        },
      ],
    },
    {
      id: "institute-branch-storage",
      menuName: "File Manager",
      iconImage: <HugeiconsIcon
        icon={Building03Icon}
        size={22}
        className="hugeicons-icon"
      />,
      link: "/#",
      allowedRoles: ["INSTITUTE_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/institute-storage-settings"],
      childMenu: [
        {
          id: "institute-storage-settings",
          menuName: "Settings",
          link: "/institute-storage-settings",
          parentId: "institute-branch-storage",
          permissions: [""]
        }
      ],
    },
    {
      id: "branch-storage-branch",
      menuName: "File Manager",
      iconImage: <HugeiconsIcon
        icon={Building03Icon}
        size={22}
        className="hugeicons-icon"
      />,
      link: "/#",
      allowedRoles: ["BRANCH_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/storage-management-dashboard", "/all-files", "/rooms", "/trash-files", "/branch-storage-settings", "/recent-files", "/favorite-files"],
      childMenu: [
        {
          id: "storage-management-dashboard",
          menuName: "Management",
          link: "/storage-management-dashboard",
          parentId: "branch-storage-branch",
          permissions: [""]
        },
        {
          id: "all-files",
          menuName: "Files",
          link: "/all-files",
          parentId: "branch-storage-branch",
          permissions: [""]
        },
        {
          id: "recent-files",
          menuName: "Recent Files",
          link: "/recent-files",
          parentId: "branch-storage-branch",
          permissions: [""]
        },
        {
          id: "favorite-files",
          menuName: "Favorite Files",
          link: "/favorite-files",
          parentId: "branch-storage-branch",
          permissions: [""]
        },
        // {
        //   id: "rooms",
        //   menuName: "Rooms",
        //   link: "/rooms",
        //   parentId: "branch-storage-branch",
        //   permissions: [""]
        // },
        {
          id: "trash-files",
          menuName: "Trash Files",
          link: "/trash-files",
          parentId: "branch-storage-branch",
          permissions: [""]
        },
        {
          id: "branch-storage-settings",
          menuName: "Settings",
          link: "/branch-storage-settings",
          parentId: "branch-storage-branch",
          permissions: [""]
        }
      ],
    },
    {
      id: "uploads",
      menuName: "Uploads",
      iconImage: <BrchUploadSvg />,
      link: "/#",
      allowedRoles: ["BRANCH_ADMIN", "TEACHER", "PA", "PRINCIPAL", "VICE_PRINCIPAL"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/almanac-uploaded",
        "/upload-documents", "/type-of-work"],
      childMenu: [
        {
          id: "almanac-uploaded",
          menuName: "Almanac Upload",
          link: "/almanac-uploaded",
          parentId: "uploads",
          permissions: [""],
        },
        {
          id: "upload-documents",
          menuName: "Upload Documents",
          parentId: "uploads",
          link: "/upload-documents",
          permissions: [""],
        },
        {
          id: "type-of-work",
          menuName: "Type of Work",
          parentId: "uploads",
          link: "/type-of-work",
          permissions: [""],
        },
      ],
    },
    {
      id: "userManagement",
      menuName: "User Management",
      iconImage: <BrchNewUserManagementSvg />,
      link: "/#",
      allowedRoles: ["BRANCH_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/manage-user", "/login-info",
        "/role-types", "/login-history", "/ip-restriction"],
      childMenu: [
        {
          id: "user-management-list",
          menuName: "Manage Users",
          link: "/manage-user",
          parentId: "userManagement",
          permissions: [""],
        },
        {
          id: "login-info-list",
          menuName: "Login Info",
          link: "/login-info",
          parentId: "userManagement",
          permissions: [""],
        },
        {
          id: "role-types",
          menuName: "Role Types",
          link: "/role-types",
          parentId: "userManagement",
          permissions: [""],
        },
        {
          id: "ip-management",
          menuName: "IP Management",
          link: "/#",
          allowedRoles: ["BRANCH_ADMIN"],
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/login-history", "/ip-restriction"],
          childMenu: [
            {
              id: "login-history",
              menuName: "Login History",
              link: "/login-history",
              parentId: "userManagement",
              permissions: [""],
            },
            {
              id: "ip-restriction",
              menuName: "IP Restriction",
              link: "/ip-restriction",
              parentId: "userManagement",
              permissions: [""],
            }
          ]
        },
      ],
    },
    {
      id: "directory",
      menuName: "Directory",
      // icon: "las la-cog",
      iconImage: <BrchDirectorySvg />,
      link: "/#",
      allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
        "ACCOUNT", "ACCOUNT_HEAD",
        "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN", "GRIEVANCE", "INSTITUTE_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/student-management", "/parent-management", "/directory-dashboard"],
      childMenu: [
        {
          id: "directory-dashboard",
          menuName: "Dashboard",
          link: "/directory-dashboard",
          parentId: "directory",
          permissions: [""],
        },
        {
          id: "student-management",
          menuName: "Student Management",
          link: "/student-management",
          parentId: "directory",
          permissions: [""],
        },
        {
          id: "parent-management",
          menuName: "Parent Management",
          link: "/parent-management",
          parentId: "directory",
          permissions: [""],
        },
        {
          id: "power-bireport-directory",
          menuName: "Power BI Reports - Directory",
          externalLink: "https://digitalcampus.k-innovative.com/dps/School-Strength",
          parentId: "directory",
          permissions: [""],
          target: "_blank"
        }
      ],
    },
    // {
    //   id: "parent-dashboard",
    //   menuName: "Parent Dashboard",
    //   iconImage: <DashboardSvg />,
    //   link: "/parent-dashboard",
    //   allowedRoles: ["PARENT_ROLE"],
    //   permissions: [""],
    // },
    {
      id: "profile-details",
      menuName: "Student Profile",
      iconImage: <ProfileDetailsSvg />,
      link: "/student-profile-details",
      allowedRoles: ["PARENT_ROLE"],
      permissions: [""],
    },
    {
      id: "download-documents",
      menuName: "Download Documents",
      iconImage: <BrchParentUploadSvg />,
      link: "/download-documents",
      allowedRoles: ["PARENT_ROLE"],
      permissions: [""],
    },
    // {
    //   id: "attendance",
    //   menuName: "Attendance",
    //   iconImage: <ProfileDetailsSvg />,
    //   link: "/attendance",
    //   allowedRoles: ["PARENT_ROLE"],
    //   permissions: [""],
    // },
    {
      id: "parent-request",
      menuName: "Request",
      link: "/parent-request",
      allowedRoles: ["PARENT_ROLE"],
      permissions: [""],
      iconImage: <RequestSvg />,
      hasChildMenu: true,
      childRoutes: ["/parent-it-form-request", "bonafide-request", "tc-request"],
      childMenu: [
        {
          id: "parent-it-form-request",
          menuName: "IT Form Request",
          link: "/parent-it-form-request",
          parentId: "parent-requests",
          permissions: [""],
        },
        {
          id: "bonafide-request",
          menuName: "Bonafide Request",
          link: "/bonafide-request",
          parentId: "parent-requests",
          permissions: [""],
        },
        {
          id: "tc-request",
          menuName: "TC Request",
          link: "/tc-request",
          parentId: "parent-requests",
          permissions: [""],
        },
      ]
    },
    {
      id: "parent-feepayment",
      menuName: "Fee",
      link: "/#",
      allowedRoles: ["PARENT_ROLE"],
      permissions: [""],
      iconImage: <ParentFeeSvg />,
      hasChildMenu: true,
      childRoutes: ["/academic-fee", "/hostel-fee", "/other-fee"],
      childMenu: [
        {
          id: "academic-fee",
          menuName: "Academic Fee",
          link: "/academic-fee",
          parentId: "parent-feepayment",
          permissions: [""],
        },
        {
          id: "hostel-fee",
          menuName: "Hostel Fee",
          link: "/hostel-fee",
          parentId: "parent-feepayment",
          permissions: [""],
        }, {
          id: "other-fee",
          menuName: "Other Fee",
          link: "/other-fee",
          parentId: "parent-feepayment",
          permissions: [""],
        }
      ]
    },
    {
      id: "parent-transport",
      menuName: "Transport",
      link: "/transport",
      iconImage: <TransportationSvg />,
      allowedRoles: ["PARENT_ROLE"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/school-transport"],
      childMenu: [
        {
          id: "school-transport",
          menuName: "School Transport",
          link: "/school-transport",
          parentId: "parent-transport",
          permissions: [""],
        },
      ]
    },
    {
      id: "lms",
      menuName: "LMS",
      iconImage: (
        <HugeiconsIcon
          icon={FileManagementIcon}
          size={22}
          className="hugeicons-icon"
        />
      ),
      link: "/lms",
      allowedRoles: ["PARENT_ROLE"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/assessment"],
      childMenu: [
        {
          id: "assessment",
          menuName: "Assessment",
          link: "/assessment",
          permissions: [""],
          parentId: "lms",
          hasChildMenu: true,
          childRoutes: ["/student-assessment-dashboard", "/student-assessments"],
          childMenu: [
            {
              id: "student-assessment-dashboard",
              menuName: "Dashboard",
              link: "/student-assessment-dashboard",
              permissions: [""],
              parentId: "assessment",
            },
            {
              id: "my-assessments",
              menuName: "My Assessments",
              link: "/student-assessments",
              permissions: [""],
              parentId: "assessment",
            },
          ],
        },
        {
          id: "lms-meetings",
          menuName: "Meetings",
          link: "/#",
          parentId: "lms",
          hasChildMenu: true,
          childRoutes: ["/live-classes"],
          childMenu: [
            {
              id: "live-classes",
              menuName: "Live Classes",
              link: "/live-classes",
              parentId: "lms",
              permissions: [""],
            }
          ],
        },
      ],
    },
    {
      id: "health-form",
      menuName: "Health Form",
      link: "/health-form",
      allowedRoles: ["PARENT_ROLE"],
      permissions: [""],
      iconImage: <RequestSvg />,
    },
    {
      id: "student-almanac",
      menuName: "Student Almanac",
      link: "/student-almanac",
      allowedRoles: ["PARENT_ROLE"],
      permissions: [""],
      iconImage: <RequestSvg />,
    },


    //End of Parent Menu
    {
      id: "fee",
      menuName: "Fee",
      // icon: "las la-cog",
      link: "/#",
      iconImage: <BrchFeeSvg />,
      allowedRoles: ["PRINCIPAL", "VICE_PRINCIPAL", "TRANSPORT", "TRANSPORT_HEAD",
        "ACCOUNT", "ACCOUNT_HEAD",
        "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN", "INSTITUTE_ADMIN"],
      permissions: [""],
      childRoutes: [
        "/fee-dashboard",
        "fee-summary", "/fee-payments-records", "/fee-receipts",
        "/student-ledger", "/cheque-history", "/challan", "/fee-refunds",
        "/fee-payments-records", "/fee-receipts",
        "/student-ledger", "/challan", "/fee-refunds",
        "/academic-concessions",
        "/tution-fee-concessions",
        "/employee-concession",
        "/it-form-approvals", "/campus-transfer-fee-refund-approvals", "/transfer-request-approvals",
        "/fee-change-campus", "/fee-particulars", "/fee-structure",
        "/special-fee", "/fee-concession", "/fines", "/fee-reversal",
        "/admission-reports", "/fee-report", "/payment-activities",
        "/special-fee-payments", "/special-fee-category", "/special-fee-reciepts", "/special-fee-reversal",
        "/online-payment-details", "/webhook-logs", "/student-fee-ledger", "/fee-concession-report",
        "/special-fee-cheque-history", "/admission-withdrawal", "/cash-payment-approvals", "/transport-fee-concession",
        "/fee-payment-report", "/payment-reconciliation", "/ccavenue-daily-collection-report", "/id-card", "/fee-concession-type",
        "/chronic-parent-type", "/fee-calling-report", "/class-wise-outstanding-summary"
      ],
      hasChildMenu: true,
      childMenu: [
        {
          id: "dashboard-list",
          menuName: "Dashboard",
          link: "/fee-dashboard",
          parentId: "fee",
          permissions: [""],
        },
        {
          id: "fee-summary",
          menuName: "Student Fee Ledger",
          link: "/student-fee-ledger",
          parentId: "fee",
          permissions: [""],
        },
        {
          id: "student-fee-collections",
          menuName: "Student Fee Collections",
          link: "/#",
          parentId: "fee",
          permissions: [""],
          childRoutes: ["/fee-payments-records", "/fee-receipts",
            "/student-ledger", "/cheque-history", "/challan", "/fee-refunds", "/fee-reversal",],
          hasChildMenu: true,
          childMenu: [
            // {
            //   id: "fee-payments-records-list",
            //   menuName: "Fee Payments Records",
            //   link: "/fee-payments-records",
            //   parentId: "student-fee-collections",
            //   permissions: [""],
            // },
            {
              id: "fee-receipts-list",
              menuName: "Fee Receipts",
              link: "/fee-receipts",
              parentId: "student-fee-collections",
              permissions: [""],
            },
            // {
            //   id: "student-ledger-list",
            //   menuName: "Student Ledger",
            //   link: "/student-ledger",
            //   parentId: "student-fee-collections",
            //   permissions: [""],
            // },
            {
              id: "cheque-history",
              menuName: "Cheque History",
              link: "/cheque-history",
              parentId: "student-fee-collections",
              permissions: [""],
            },
            // {
            //   id: "/challan",
            //   menuName: "Challan",
            //   link: "/challan",
            //   parentId: "student-fee-collections",
            //   permissions: [""],
            // },
            {
              id: "fee-refunds-list",
              menuName: "Fee Refunds",
              link: "/fee-refunds",
              parentId: "student-fee-collections",
              permissions: [""],
            },
            {
              id: "fee-reversal",
              menuName: "Fee Reversals",
              link: "/fee-reversal",
              parentId: "student-fee-collections",
              permissions: [""],
            },
          ]
        },
        {
          id: "special-fee-payments",
          menuName: "Special Fee",
          link: "/#",
          parentId: "fee",
          permissions: [""],
          childRoutes: [
            "/special-fee-payments", "/special-fee-category", "/special-fee-reciepts", "/special-fee-reversal", "/special-fee-cheque-history"
          ],
          hasChildMenu: true,
          childMenu: [
            {
              id: "special-fee-payment",
              menuName: "Fee Payments",
              link: "/special-fee-payments",
              parentId: "special-fee-payments",
              permissions: [""],
            },
            {
              id: "special-fee-receipts",
              menuName: "Receipts",
              link: "/special-fee-reciepts",
              parentId: "special-fee-payments",
              permissions: [""],
            },
            {
              id: "special-fee-category",
              menuName: "Category",
              link: "/special-fee-category",
              parentId: "special-fee-payments",
              permissions: [""],
            },
            {
              id: "special-fee-reversal",
              menuName: "Fee Reversal",
              link: "/special-fee-reversal",
              parentId: "special-fee-payments",
              permissions: [""],
            },
            {
              id: "special-fee-cheque-history",
              menuName: "Cheque History",
              link: "/special-fee-cheque-history",
              parentId: "special-fee-payments",
              permissions: [""],
            },
          ],
        },
        {
          id: "concessions",
          menuName: "Concessions",
          link: "/#",
          parentId: "fee",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/academic-concessions",
          ],
          childMenu: [
            {
              id: "student-concessions-list",
              menuName: "Academic Concessions",
              link: "/academic-concessions",
              parentId: "fee",
              permissions: [""],
            },
            // {
            //   id: "tution-fee-concessions-list",
            //   menuName: "Tution Fee Concessions",
            //   link: "/tution-fee-concessions",
            //   parentId: "fee",
            //   permissions: [""],
            // },
            //  {
            //   id: "employee-concession",
            //   menuName: "Employee Concession",
            //   link: "/employee-concession",
            //   parentId: "fee",
            //   permissions: [""],
            // },
          ]
        },
        {
          id: "feeapprovals",
          menuName: "Approvals",
          link: "/#",
          parentId: "fee",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/it-form-approvals", "/campus-transfer-fee-refund-approvals", "/transfer-request-approvals", "/fee-change-campus", "/admission-withdrawal", "/cash-payment-approvals"],
          childMenu: [
            {
              id: "campus-transfer-fee-refund-approvals-list",
              menuName: "Campus Transfer Fee Refund Approvals",
              link: "/campus-transfer-fee-refund-approvals",
              parentId: "fee",
              permissions: [""],
            },
            {
              id: "transfer-request-approvals-list",
              menuName: "Transfer Request Approvals",
              link: "/transfer-request-approvals",
              parentId: "fee",
              permissions: [""],
            },
            {
              id: "fee-change-campus-list",
              menuName: "Change Campus",
              link: "/fee-change-campus",
              parentId: "fee",
              permissions: [""],
            },
            {
              id: "admission-withdrawal",
              menuName: "Admission Withdrawal",
              link: "/admission-withdrawal",
              parentId: "fee",
              permissions: [""],
            },
            {
              id: "it-form-approvals-list",
              menuName: "IT Form Approvals",
              link: "/it-form-approvals",
              parentId: "fee",
              permissions: [""],
            },
            {
              id: "cash-payment-approvals",
              menuName: "Cash Payment Approvals",
              link: "/cash-payment-approvals",
              parentId: "fee",
              permissions: [""],
            },
            // {
            //   id: "hostelfee-exit-approvals",
            //   menuName: "Hostel Fee Exit Approvals",
            //   link: "/hostelfee-exit-approvals",
            //   parentId: "fee",
            //   permissions: [""],
            // },
          ]
        },
        {
          id: "settings",
          menuName: "Settings",
          link: "/#",
          parentId: "fee",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/fee-particulars", "/fee-structure",
            "/special-fee", "/fee-concession", "/fines", "/fee-concession-type", "/transport-fee-concession", "/chronic-parent-type",],
          childMenu: [
            {
              id: "fee-name-list",
              menuName: "Fee Particulars",
              link: "/fee-particulars",
              parentId: "settings",
              permissions: [""],
            },
            {
              id: "fee-structure-list",
              menuName: "Fee Structure",
              link: "/fee-structure",
              parentId: "settings",
              permissions: [""],
            },
            {
              id: "special-fee-list",
              menuName: "Special Fee",
              link: "/special-fee",
              parentId: "settings",
              permissions: [""],
            },
            {
              id: "fee-concession",
              menuName: "Fee Concession",
              link: "/fee-concession",
              parentId: "settings",
              permissions: [""],
            },
            {
              id: "transport-fee-concession",
              menuName: "Transport Fee Concession",
              link: "/transport-fee-concession",
              parentId: "settings",
              permissions: [""],
            },
            {
              id: "fee-concession-type",
              menuName: "Fee Concession Type",
              link: "/fee-concession-type",
              parentId: "settings",
              permissions: [""],
            },
            {
              id: "fines",
              menuName: "Fines",
              link: "/fines",
              parentId: "settings",
              permissions: [""],
            },
            {
              id: "chronic-parent-type",
              menuName: "Chronic Parent Type",
              link: "/chronic-parent-type",
              parentId: "settings",
              permissions: [""],
            },
          ]
        },
        {
          id: "fee-reports",
          menuName: "Reports",
          link: "/#",
          parentId: "fee",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/fee-report", "/fee-concession-report", "/fee-payment-report", "/ccavenue-daily-collection-report",
            "/fee-calling-report", "/class-wise-outstanding-summary",
          ],
          childMenu: [
            // {
            //   id: "fee-report",
            //   menuName: "Fee Report",
            //   link: "/fee-report",
            //   parentId: "front-desk",
            //   permissions: [""],
            // }, 
            {
              id: "fee-status-report",
              menuName: "Fee Status Report",
              link: "/fee-status-report",
              parentId: "front-desk",
              permissions: [""],
            }, {
              id: "fee-concession-report",
              menuName: "Fee Concession Report",
              link: "/fee-concession-report",
              parentId: "fee",
              permissions: [""],
            }, {
              id: "fee-payment-report",
              menuName: "Fee Collection Report",
              link: "/fee-payment-report",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "fee-calling-report",
              menuName: "Fee Calling Report",
              link: "/fee-calling-report",
              parentId: "fee",
              permissions: [""],
            },
            {
              id: "class-wise-outstanding-summary",
              menuName: "Class-wise Outstanding Summary",
              link: "/class-wise-outstanding-summary",
              parentId: "fee",
              permissions: [""],
            },
            // {
            //   id: "ccavenue-daily-collection-report",
            //   menuName: "CCAvenue Report",
            //   link: "/ccavenue-daily-collection-report",
            //   parentId: "front-desk",
            //   permissions: [""],
            // },

          ]
        },
        {
          id: "id-card",
          menuName: "Id Card",
          parentId: "academic",
          link: "/id-card",
          permissions: [""],
          hasChildMenu: false,
        },
        {
          id: "power-bireport-fee",
          menuName: "Power BI Reports - Fee",
          externalLink: "https://digitalcampus.k-innovative.com/dps/fee-outstanding",
          parentId: "fee",
          permissions: [""],
        },
        {
          id: "payment-activities",
          menuName: "Payment Activities",
          link: "/#",
          parentId: "fee",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/online-payment-details", "/webhook-logs", "/payment-reconciliation"
          ],
          childMenu: [

            {
              id: "payment-reconciliation",
              menuName: "Payment Reconciliation",
              link: "/payment-reconciliation",
              parentId: "fee",
              permissions: [""]
            },
            {
              id: "online-payments",
              menuName: "Online Payments",
              link: "/online-payment-details",
              parentId: "fee",
              permissions: [""],
            },
            {
              id: "webhook-logs",
              menuName: "Webhook Logs",
              link: "/webhook-logs",
              parentId: "fee",
              permissions: [""]
            }
          ]
        },
      ],
    },

    {
      id: "employees",
      menuName: "Employees",
      // icon: "las la-users",
      iconImage: <AdmnEmployeesSvg />,
      link: "/employees",
      allowedRoles: ["SUPER_ADMIN"],
      permissions: [""],
    },
    {
      id: "security",
      menuName: "Security",
      // icon: "las la-shield-alt",
      iconImage: <HugeiconsIcon icon={SecurityCheckIcon} size={20} className="hugeicons-icon" />,
      link: "/security",
      allowedRoles: ["SUPER_ADMIN"],
      permissions: [""],
    },


    {
      id: "master_setup",
      menuName: "Master Setup",
      // icon: "las la-cog",
      iconImage: <HugeiconsIcon icon={Settings01Icon} size={20} className="hugeicons-icon" />,
      link: "/master-setup",
      allowedRoles: ["INSTITUTE_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/general-settings", "module-settings"],
      childMenu: [
        {
          id: "general-settings",
          menuName: "General Settings",
          link: "/general-settings",
          parentId: "master_setup",
          permissions: [""],
        },
        {
          id: "module-settings",
          menuName: "Module Settings",
          link: "/modules-settings",
          parentId: "master_setup",
          permissions: [""],
        },
      ]
    },

    {
      id: "front-desk",
      menuName: "Admissions",
      // icon: "las la-cog",
      iconImage: <BrchFrontDeskSvg />,
      link: "/front-desk",
      allowedRoles: ["ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/admission-dashboard",
        "/admission-management", "/sibling-verification", "/change-student",
        "/admission-settings", "/admission-reports", "/student-details", "/parent-details",
        "/transfer-certificate", "/bonafide-certificate",
        "/change-stream", "/change-curriculum", "/change-campus", "/campus-transfer-requests",
        "/class-wise-documents", "/master-documents", "/exam-subjects", "/unpaid-report", "/admission-availability", "/panel-member", "/evaluation-process", "/consolidated-viewold", "/consolidated-viewnew", "/admission-tracker-report", "/cbse-verification-report", "/enquiry", "/optional-subjects", "/configuration-settings", "/signature-configuration", "/branch-class-language"
      ],
      childMenu: [
        {
          id: "admission-dashboard",
          menuName: "Dashboard",
          link: "/admission-dashboard",
          parentId: "transportation",
          permissions: [""],
        },
        {
          id: "enquiry",
          menuName: "Enquiry",
          link: "/enquiry",
          parentId: "front-desk",
          permissions: [""],
        },
        {
          id: "admission-management",
          menuName: "Admission Management",
          link: "/admission-management",
          parentId: "transportation",
          permissions: [""],
        },
        {
          id: "sibling-verification",
          menuName: "Sibling Verification",
          link: "/sibling-verification",
          parentId: "transportation",
          permissions: [""],
        },
        {
          id: "change-student-details",
          menuName: "Change Student Details",
          link: "/change-student",
          parentId: "transportation",
          permissions: [""],
        },
        {
          id: "change-transfer-request",
          menuName: "Recommended Campus",
          link: "/recommended-campus",
          parentId: "front-desk",
          permissions: [""],
        },
        // {
        //   id: "student-details",
        //   menuName: "Student Details",
        //   link: "/student-details",
        //   parentId: "front-desk",
        //   permissions: [""],
        // },
        // {
        //   id: "parent-details",
        //   menuName: "Parent Details",
        //   link: "/parent-details",
        //   parentId: "front-desk",
        //   permissions: [""],
        // },
        // {
        //   id: "student-details",
        //   menuName: "Student Details",
        //   link: "/student-management",
        //   parentId: "front-desk",
        //   permissions: [""],
        // },
        {
          id: "facilities",
          menuName: "Facilities",
          link: "/#",
          parentId: "front-desk",
          permissions: [""],
          childRoutes: ["/mess-registration"],
          hasChildMenu: true,
          childMenu: [
            {
              id: "mess-registration",
              menuName: "Mess Registration",
              link: "/mess-registration",
              parentId: "front-desk",
              permissions: [""],
            }
          ]
        },
        {
          id: "admission-settings",
          menuName: "Settings",
          link: "/admission-settings",
          parentId: "transportation",
          permissions: [""],
          childRoutes: ["/admission-availability", "/class-wise-documents", "/master-documents", "/exam-subjects", "/panel-member", "/evaluation-process", "/optional-subjects", "/configuration-settings", "/signature-configuration", "/branch-class-language"],
          hasChildMenu: true,
          childMenu: [
            {
              id: "admission-availability",
              menuName: "Admission Availability",
              link: "/admission-availability",
              parentId: "front-desk",
              permissions: [""],
            },
            // {
            //   id: "proposed-admission",
            //   menuName: "Proposed Admission",
            //   link: "/proposed-admission",
            //   parentId: "front-desk",
            //   permissions: [""],
            // },
            // {
            //   id: "age-criteria",
            //   menuName: "Age Criteria",
            //   link: "/age-criteria",
            //   parentId: "front-desk",
            //   permissions: [""],
            // },
            {
              id: "exam-subjects",
              menuName: "Exam Subjects",
              link: "/exam-subjects",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "panel-member",
              menuName: "Panel Member",
              link: "/panel-member",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "evaluation-process",
              menuName: "Evaluation Process",
              link: "/evaluation-process",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "branch-class-language",
              menuName: "Branch Class Language",
              link: "/branch-class-language",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "master-documents",
              menuName: "Master Documents",
              link: "/master-documents",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "class-wise-documents",
              menuName: "Class Wise Documents",
              link: "/class-wise-documents",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "admission-facility",
              menuName: "Admission Facility",
              link: "/admission-facility",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "optional-subjects",
              menuName: "Optional Subjects",
              link: "/optional-subjects",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "configuration-settings",
              menuName: "Admission Configuration",
              link: "/configuration-settings",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "signature-configuration",
              menuName: "Signature Configuration",
              link: "/signature-configuration",
              parentId: "front-desk",
              permissions: [""],
            },
          ]
        },
        {
          id: "admission-reports",
          menuName: "Reports",
          link: "/#",
          parentId: "front-desk",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/consolidated-view", "/unpaid-report", "/consolidated-viewold", "/consolidated-viewnew", "/admission-tracker-report", "/cbse-verification-report",
          ],

          childMenu: [
            {
              id: "consolidated-viewold",
              menuName: "Consolidated View - Studease",
              link: "/consolidated-viewold",
              parentId: "front-desk",
              permissions: [""],
            },
            // {
            //   id: "consolidated-view",
            //   menuName: "Consolidated View",
            //   link: "/consolidated-view",
            //   parentId: "front-desk",
            //   permissions: [""],
            // },
            {
              id: "consolidated-viewnew",
              menuName: "Consolidated View - New",
              link: "/consolidated-viewnew",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "unpaid-report",
              menuName: "Unpaid Report",
              link: "/unpaid-report",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "admission-tracker-report",
              menuName: "Tracker Report",
              link: "/admission-tracker-report",
              parentId: "front-desk",
              permissions: [""],
            },
            {
              id: "cbse-verification-report",
              menuName: "CBSE Verification",
              link: "/cbse-verification-report",
              parentId: "front-desk",
              permissions: [""],
            },
          ]
        },
        {
          id: "certificates-list",
          menuName: "Certificates",
          parentId: "academics",
          link: "/#",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/transfer-certificate", "/bonafide-certificate"],
          childMenu: [
            {
              id: "transfer-certificate-list",
              menuName: "Transfer Certificate",
              link: "/transfer-certificate",
              parentId: "academics",
              permissions: [""],
            },
            {
              id: "bonafide-certificate-list",
              menuName: "Bonafide Certificate",
              link: "/bonafide-certificate",
              parentId: "academics",
              permissions: [""],
            },
          ]
        },
        {
          id: "requests",
          menuName: "Requests",
          parentId: "academics",
          link: "/#",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/change-stream", "/change-curriculum", "/change-campus", "/campus-transfer-requests"],
          childMenu: [
            {
              id: "change-stream-list",
              menuName: "Change Stream",
              link: "/change-stream",
              parentId: "academics",
              permissions: [""],
            },
            {
              id: "change-curriculum-list",
              menuName: "Change Curriculum",
              link: "/change-curriculum",
              parentId: "academics",
              permissions: [""],
            },
            {
              id: "change-campus-list",
              menuName: "Change Campus",
              link: "/change-campus",
              parentId: "academics",
            },
            {
              id: "campus-transfer-list",
              menuName: "Campus Transfer Requests",
              link: "/campus-transfer-requests",
              parentId: "academics",
              permissions: [""],
            },
            {
              id: "admission-withdrawal-details",
              menuName: "Admission Withdrawal",
              link: "/admission-withdrawal-details",
              parentId: "academics",
              permissions: [""],
            },
          ]
        },
        {
          id: "power-bireport-admissions",
          menuName: "Power BI Reports - Admissions",
          externalLink: "https://digitalcampus.k-innovative.com/dps/application-admission",
          parentId: "admissions",
          permissions: [""],
        }
      ],
    },
    {
      id: "student-attendance",
      menuName: "Student Attendance",
      // icon: "las la-cog",
      iconImage: <BrchStuAttSvg />,
      link: "/student-attendance",
      allowedRoles: ["TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "BRANCH_ADMIN", "PARENT_ROLE"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/class-wise-attendance-dashboard", "/daily-attendance", "/month-wise-attendance", "/student-long-leaves", "/student-holiday-details", "/attendance-report", "/total-noof-working-holidays", "/schedule-task", "/schedule-log"],
      childMenu: [
        {
          id: "class-wise-attendance-dashboard",
          menuName: "Dashboard",
          link: "/class-wise-attendance-dashboard",
          parentId: "student-attendance",
          permissions: [""],
        },
        {
          id: "daily-attendance",
          menuName: "Daily Attendance",
          link: "/daily-attendance",
          parentId: "student-attendance",
          permissions: [""],
        },
        {
          id: "month-wise-attendance",
          menuName: "Month Wise Attendance",
          link: "/month-wise-attendance",
          parentId: "student-attendance",
          permissions: [""],
        },
        {
          id: "student-long-leaves",
          menuName: "Student Long Leaves",
          link: "/student-long-leaves",
          parentId: "student-attendance",
          permissions: [""],
        },
        {
          id: "student-holiday-details",
          menuName: "Student Holiday Details",
          link: "/student-holiday-details",
          parentId: "student-attendance",
          permissions: [""],
        },
        {
          id: "schedule-task",
          menuName: "Schedule Task",
          link: "/schedule-task",
          parentId: "student-attendance",
          permissions: [""],
        },
        {
          id: "schedule-log",
          menuName: "Schedule Logs",
          link: "/schedule-log",
          parentId: "student-attendance",
          permissions: [""],
        },
        {
          id: "student-ateendance-reports",
          menuName: "Reports",
          link: "/#",
          parentId: "student-attendance",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/attendance-report", "/total-noof-working-holidays"
          ],
          childMenu: [
            {
              id: "attendance-report",
              menuName: "Attendance Report",
              link: "/attendance-report",
              parentId: "student-ateendance-reports",
              permissions: [""],
            },
            {
              id: "total-noof-working-holidays",
              menuName: "Total Working Days & Holidays",
              link: "/total-noof-working-holidays",
              parentId: "student-ateendance-reports",
              permissions: [""],
            },

          ]
        },
        {
          id: "power-bireport-attendance",
          menuName: "Power BI Reports - Attendance",
          externalLink: (instituteCode === "DPS") ?
            "https://digitalcampus.k-innovative.com/dps/Attendance" :
            "https://digitalcampus.k-innovative.com/pgos/Attendance",
          parentId: "student-attendance",
          permissions: [""],
        }
      ],
    },
    {
      id: "transportation",
      menuName: "Transportation",
      iconImage: <BrchTransportationSvg />,
      link: "/#",
      allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/transportation-dashboard",
        "/transportation-settings", "/live-tracking", "/transport-concession", "/transportation-management",
        "/transportation-records", "/transportation-employee"],
      childMenu: [
        {
          id: "transportation-dashboard",
          menuName: "Dashboard",
          link: "/transportation-dashboard",
          parentId: "transportation",
          permissions: [""],
        },
        {
          id: "settings",
          menuName: "Settings",
          link: "/transportation-settings",
          parentId: "transportation",
          permissions: [""],
        },
        // {
        //   id: "live-tracking",
        //   menuName: "Live Tracking",
        //   link: "/live-tracking",
        //   parentId: "transportation",
        //   permissions: [""],
        // },
        {
          id: "transportation-management",
          menuName: "Transport Management",
          link: "/transportation-management",
          parentId: "transportation",
          permissions: [""],
        },
        {
          id: "transport-concession",
          menuName: "Transport Concession",
          link: "/transport-concession",
          parentId: "transportation",
          permissions: [""],
        },
        {
          id: "transportation-records",
          menuName: "Transportation Records",
          link: "/transportation-records",
          parentId: "transportation",
          permissions: [""],
        },
        {
          id: "transportation-employee",
          menuName: "Temporary Employee Management",
          link: "/transportation-employee",
          parentId: "transportation",
          permissions: [""],
        },
        {
          id: "transport-registration",
          menuName: "Transport Registration",
          link: "/transport-registration",
          parentId: "transportation",
          permissions: [""],
        },
        {
          id: "power-bireport-transport",
          menuName: "Power BI Reports - Transport",
          externalLink: " https://digitalcampus.k-innovative.com/dps/transport",
          parentId: "transportation",
          permissions: [""],
        }
        // ,
        // {
        //   id: "transportation-tcapproval",
        //   menuName: "TC Request Approval",
        //   link: "/transportation-tcapproval",
        //   parentId: "transportation",
        //   permissions: [""],
        // }
      ],
    },
    {
      id: "examination",
      menuName: "Examination",
      iconImage: <BrchNewExaminationSvg />,
      link: "/#",
      allowedRoles: ["BRANCH_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/examination-dashboard", "/examination-dashboard", "/cbse-management", "/cbse-settings", "/student-performance-metrics", "/igcse-settings", "/igcse-management", "/early-years-management", "/early-years-settings", "/sports-settings", "/sports-management", "/holistic-management", "/preparatory-management", "/other-pva-management", "/other-pva-settings", "/holistic-settings", "/preparatory-settings", "/green-report-card-settings", "/green-report-card-management", "/discipline-report-card-settings"],
      childMenu: [
        {
          id: "examination-dashboard",
          menuName: "Dashboard",
          link: "/examination-dashboard",
          parentId: "examination",
          permissions: [""],
        },
        {
          id: "cbse-examination",
          menuName: "CBSE",
          link: "/#",
          parentId: "examination",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/cbse-management", "/cbse-settings", "/cbse-reports", "/student-performance-metrics", "/holistic-management", "/preparatory-management", "/holistic-settings", "/preparatory-settings"],
          childMenu: [
            {
              id: "cbse-management",
              menuName: "Management",
              link: "/cbse-management",
              parentId: "examination",
              permissions: [""],
            },
            {
              id: "cbse-settings",
              menuName: "Settings",
              link: "/cbse-settings",
              parentId: "examination",
              permissions: [""],
            },
            {
              id: "cbse-reports",
              menuName: "Reports",
              link: "/#",
              parentId: "examination",
              permissions: [""],
              hasChildMenu: true,
              childRoutes: ["/student-performance-metrics"],
              childMenu: [
                {
                  id: "student-performance-metrics",
                  menuName: "Student Grade Book",
                  link: "/student-performance-metrics",
                  parentId: "examination",
                  permissions: [""],
                },
                // {
                //   id: "marks-entry-report",
                //   menuName: "Marks Entry Report",
                //   link: "/marks-entry-report",
                //   parentId: "examination",
                //   permissions: [""],
                // }
              ]
            },

            {
              id: "holistic-reports",
              menuName: "Holistic Reports",
              link: "/#",
              parentId: "examination",
              permissions: [""],
              hasChildMenu: true,
              childRoutes: ["/holistic-management", "/holistic-settings", "/preparatory-management", "/preparatory-settings"],
              childMenu: [
                {
                  id: "reports",
                  menuName: "Foundation Stage",
                  link: "/holistic-management",
                  parentId: "examination",
                  permissions: [""],
                  hasChildMenu: true,
                  childRoutes: ["/holistic-management", "/holistic-settings"],
                  childMenu: [
                    {
                      id: "holistic-management",
                      menuName: "Management",
                      link: "/holistic-management",
                      parentId: "examination",
                      permissions: [""],
                      hasChildMenu: false,
                    },
                    {
                      id: "holistic-settings",
                      menuName: "Settings",
                      link: "/holistic-settings",
                      parentId: "examination",
                      permissions: [""],
                    },
                  ]
                },
                {
                  id: "preparatory-management",
                  menuName: "Preparatory Stage",
                  link: "/preparatory-management",
                  parentId: "examination",
                  permissions: [""],
                  hasChildMenu: true,
                  childRoutes: ["/preparatory-management", "/preparatory-settings"],
                  childMenu: [
                    {
                      id: "preparatory-management",
                      menuName: "Management",
                      link: "/preparatory-management",
                      parentId: "examination",
                      permissions: [""],
                      hasChildMenu: false,
                    },
                    {
                      id: "preparatory-settings",
                      menuName: "Settings",
                      link: "/preparatory-settings",
                      parentId: "examination",
                      permissions: [""],
                      hasChildMenu: false,
                    }
                  ]
                },
              ]
            },

          ]
        },
        {
          id: "early-years-examination",
          menuName: "EY1-EY3",
          link: "/#",
          parentId: "examination",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/early-years-management", "/early-years-settings"],
          childMenu: [
            {
              id: "early-years-management",
              menuName: "Management",
              link: "/early-years-management",
              parentId: "examination",
              permissions: [""],
            },
            {
              id: "early-years-settings",
              menuName: "Settings",
              link: "/early-years-settings",
              parentId: "examination",
              permissions: [""],
            },
          ]
        },
        {
          id: "igse-examination",
          menuName: "IGCSE",
          link: "/#",
          parentId: "examination",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/igcse-management", "/igcse-settings"],
          childMenu: [

            {
              id: "igse-management",
              menuName: "Management",
              link: "/igcse-management",
              parentId: "examination",
              permissions: [""],
            },
            {
              id: "igse-settings",
              menuName: "Settings",
              link: "/igcse-settings",
              parentId: "examination",
              permissions: [""],
            },
          ]
        },
        {
          id: "other-reports",
          menuName: "Other Reports",
          link: "/#",
          parentId: "examination",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/other-pva-management", "/other-pva-settings", "/sports-settings", "/sports-management", "/green-report-card-settings", "/green-report-card-management", "/discipline-report-card-settings"],
          childMenu: [
            {
              id: "pva-reports",
              menuName: "PVA Reports",
              link: "/#",
              parentId: "examination",
              permissions: [""],
              hasChildMenu: true,
              childRoutes: ["/other-pva-management", "/other-pva-settings"],
              childMenu: [
                {
                  id: "cbse-pva-management",
                  menuName: "Management",
                  link: "/other-pva-management",
                  parentId: "examination",
                  permissions: [""],
                  hasChildMenu: false,
                },
                {
                  id: "pva-settings",
                  menuName: "Settings",
                  link: "/other-pva-settings",
                  parentId: "examination",
                  permissions: [""],
                },
              ]
            },
            {
              id: "sports",
              menuName: "Sports",
              link: "/#",
              parentId: "examination",
              permissions: [""],
              hasChildMenu: true,
              childRoutes: ["/sports-settings", "/sports-management"],
              childMenu: [
                {
                  id: "sports-management",
                  menuName: "Management",
                  link: "/sports-management",
                  parentId: "examination",
                  permissions: [""],
                  hasChildMenu: false,
                },
                {
                  id: "sports-settings",
                  menuName: "Settings",
                  link: "/sports-settings",
                  parentId: "examination",
                  permissions: [""],
                },
              ]
            },
            {
              id: "green-report-card",
              menuName: "Green Reports",
              link: "/#",
              parentId: "examination",
              permissions: [""],
              hasChildMenu: true,
              childRoutes: ["/green-report-card-settings", "/green-report-card-management"],
              childMenu: [
                {
                  id: "green-report-card-management",
                  menuName: "Management",
                  link: "/green-report-card-management",
                  parentId: "examination",
                  permissions: [""],
                  hasChildMenu: false,
                },
                {
                  id: "green-report-card-settings",
                  menuName: "Settings",
                  link: "/green-report-card-settings",
                  parentId: "examination",
                  permissions: [""],
                },
              ]
            },
            {
              id: "discipline-report-card",
              menuName: "Discipline Reports",
              link: "/#",
              parentId: "examination",
              permissions: [""],
              hasChildMenu: true,
              childRoutes: ["/discipline-report-card-settings"],
              childMenu: [
                {
                  id: "discipline-report-card-settings",
                  menuName: "Settings",
                  link: "/discipline-report-card-settings",
                  parentId: "examination",
                  permissions: [""],
                },
              ]
            },
          ]
        }
      ],
    },
    {
      id: "examination-institute",
      menuName: "Examination",
      iconImage: <BrchNewExaminationSvg />,
      link: "/#",
      allowedRoles: ["INSTITUTE_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/holistic-settings", "/holistic-activity-management", "/examination-settings", "/preparatory-activity-management", "/preparatory-settings"],
      childMenu: [
        {
          id: "holistic-reports",
          menuName: "Holistic Reports",
          link: "/#",
          parentId: "examination-institute",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/holistic-settings", "/holistic-activity-management", "/preparatory-activity-management", "/preparatory-settings"],
          childMenu: [
            {
              id: "institute-holistic-foundation",
              menuName: "Foundation Stage",
              link: "/#",
              parentId: "examination-institute",
              permissions: [""],
              hasChildMenu: true,
              childRoutes: ["/holistic-settings", "/holistic-activity-management"],
              childMenu: [
                {
                  id: "holistic-management",
                  menuName: "Management",
                  link: "/holistic-activity-management",
                  parentId: "examination-institute",
                  permissions: [""],
                },
                {
                  id: "holistic-settings",
                  menuName: "Settings",
                  link: "/holistic-settings",
                  parentId: "examination-institute",
                  permissions: [""],
                },
              ]
            },
            {
              id: "preparatory-management",
              menuName: "Preparatory Stage",
              link: "/preparatory-activity-management",
              parentId: "examination",
              permissions: [""],
              hasChildMenu: true,
              childRoutes: ["/preparatory-activity-management", "/preparatory-settings"],
              childMenu: [
                {
                  id: "preparatory-management",
                  menuName: "Management",
                  link: "/preparatory-activity-management",
                  parentId: "examination",
                  permissions: [""],
                  hasChildMenu: false,
                },
                {
                  id: "preparatory-settings",
                  menuName: "Settings",
                  link: "/preparatory-settings",
                  parentId: "examination",
                  permissions: [""],
                  hasChildMenu: false,
                }
              ]
            },
          ]
        },
        {
          id: "examination-settings",
          menuName: "Settings",
          link: "/examination-settings",
          parentId: "examination-institute",
          permissions: [""],
          childRoutes: ["/term-name", "/term-details"],
          hasChildMenu: false,
        }
      ]

    },
    {
      id: "examiantion-parent",
      menuName: "Examination",
      iconImage: <BrchNewExaminationSvg />,
      link: "/#",
      allowedRoles: ["PARENT_ROLE"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/examination-admitcard", "/examination-progresscard"],
      childMenu: [
        {
          id: "examination-admitcard",
          menuName: "Admit Card",
          link: "/examination-admitcard",
          parentId: "examiantion-parent",
          permissions: [""],
          hasChildMenu: false,
        },
        {
          id: "examination-progresscard",
          menuName: "Progress Card",
          link: "/examination-progresscard",
          parentId: "examiantion-parent",
          permissions: [""],
          hasChildMenu: false,
        }
      ]
    },
    {
      id: "communication",
      menuName: "Comunication",
      iconImage: <BrchNewCommunicationSvg />,
      link: "/#",
      allowedRoles: ["BRANCH_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/communication-settings", "/manage-notifications", "//communication-report", "/communication-reports", "/feeds", "/events", "/notifications-history", "/whatsapp-campaign", "/whatsapp-notifications", "/whatsapp-settings"],
      childMenu: [

        {
          id: "manage-notifications",
          menuName: "Manage Notifications",
          link: "/manage-notifications",
          parentId: "communication",
          permissions: [""],
        },
        {
          id: "whatsapp",
          menuName: "Whatsapp",
          link: "/#",
          parentId: "communication",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/whatsapp-notifications", "/whatsapp-settings"],
          childMenu: [
            {
              id: "whatsapp-notifications",
              menuName: "Whatsapp Notifications",
              link: "/whatsapp-notifications",
              parentId: "communication",
              permissions: [""],
            },
            {
              id: "whatsapp-settings",
              menuName: "Settings",
              link: "/whatsapp-settings",
              parentId: "communication",
              permissions: [""],
            },
          ]
        },
        {
          id: "notifications-history",
          menuName: "Notifications History",
          link: "/notifications-history",
          parentId: "communication",
          permissions: [""],
        },
        {
          id: "communication-report",
          menuName: "Reports",
          link: "/communication-report",
          permissions: [""],
          parentId: "library",
          hasChildMenu: true,
          childRoutes: ["/communication-reports"],
          childMenu: [
            {
              id: "communication-reports",
              menuName: "Communication Batch Report",
              link: "/communication-reports",
              parentId: "communication-report",
              permissions: [""],
            },
          ]
        },
        {
          id: "communication-feeds",
          menuName: "Feeds",
          link: "/feeds",
          parentId: "communication",
          permissions: [""],
        },
        {
          id: "communication-events",
          menuName: "Events",
          link: "/events",
          parentId: "communication",
          permissions: [""],
        },
        {
          id: "gallery",
          menuName: "Gallery",
          link: "/#",
          parentId: "communication",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: [],
          childMenu: [
            {
              id: "gallery-management",
              menuName: "Gallery Management",
              link: "/gallery-management",
              parentId: "communication",
              permissions: [""],
            }
          ]
        },
        {
          id: "communication-settings",
          menuName: "Settings",
          link: "/communication-settings",
          parentId: "communication",
          permissions: [""],
        },
        {
          id: "whatsapp-campaign",
          menuName: "Whatsapp Campaign",
          link: "/whatsapp-campaign",
          parentId: "communication",
          permissions: [""],
        },
      ],
    },
    {
      id: "school-calendar",
      menuName: "School Calendar",
      iconImage: <AdmnLogoutSvg />,
      link: "/#",
      allowedRoles: ["BRANCH_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/calendar-summary", "/calendar-settings"],
      childMenu: [
        {
          id: "calendar-summary",
          menuName: "Calendar Summary",
          link: "/calendar-summary",
          parentId: "school-calendar",
          permissions: [""],
        },
        {
          id: "calendar-settings",
          menuName: "Settings",
          link: "/calendar-settings",
          parentId: "school-calendar",
          permissions: [""],
        }
      ]
    },
    {
      id: "hostel",
      menuName: "Hostel",
      iconImage: <BrchHostelSvg />,
      link: "/#",
      allowedRoles: ["BRANCH_ADMIN", "HOSTEL"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/hostel-admissions", "/eligibility-promote", "/promote-students", "/hostel-bed-allocation", "/hostel-setup", "/hostel-transfer-approvals", "/hostel-exit-approvals", "/hostel-student-ledger", "/hostel-concession", "/hostel-fee-receipt", "/cheque-clearance", "/hostel-fee-reversal", "/hostel-fee-refund", "/hostel-fee-fine", "/hostel-class-eligibility", "/hostel-fee-particulars", "/hostel-fee-structure", "/hostelfee-exit-approvals", "/hostel-whatsapp-notifications"],
      childMenu: [
        {
          id: "hostel-admission",
          menuName: "Hostel Admission",
          link: "/#",
          parentId: "hostel",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/hostel-admissions", "/eligibility-promote", "/promote-students", "/hostel-bed-allocation"],
          childMenu: [
            {
              id: "hostel-admissions",
              menuName: "Hostel Admission",
              link: "/hostel-admissions",
              parentId: "hostel",
              permissions: [""],
            },
            {
              id: "eligibility-promote",
              menuName: "Eligibility For Promote",
              link: "/eligibility-promote",
              parentId: "hostel",
              permissions: [""],
            },
            {
              id: "promote-students",
              menuName: "Promote Students",
              link: "/promote-students",
              parentId: "hostel",
              permissions: [""],
            },
            {
              id: "hostel-bed-allocation",
              menuName: "Bed Allocation",
              link: "/hostel-bed-allocation",
              parentId: "hostel",
              permissions: [""],
            },
          ]
        },
        {
          id: "hostel-fee",
          menuName: "Hostel Fee",
          link: "/hostel-fee",
          parentId: "hostel",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/hostel-student-ledger", "/hostel-concession", "/hostel-fee-receipt", "/cheque-clearance", "/hostel-fee-reversal", "/hostel-fee-refund", "/hostel-fee-fine"],
          childMenu: [
            {
              id: "hostel-student-ledger",
              menuName: "Hostel Student Ledger",
              link: "/hostel-student-ledger",
              parentId: "hostel",
              permissions: [""],
            },
            {
              id: "hostel-concession",
              menuName: "Hostel Concessions",
              link: "/hostel-concession",
              parentId: "hostel",
              permissions: [""],
            },
            {
              id: "hostel-fee-receipt",
              menuName: "Hostel Fee Receipts",
              link: "/hostel-fee-receipt",
              parentId: "hostel",
              permissions: [""],
            },
            {
              id: "cheque-clearance",
              menuName: "Cheque Clearance",
              link: "/cheque-clearance",
              parentId: "hostel",
              permissions: [""],
            },
            // {
            //   id: "caution-fee-concessions",
            //   menuName: "Caution Fee Concessions",
            //   link: "/caution-fee-concessions",
            //   parentId: "hostel",
            //   permissions: [""],
            // },
            {
              id: "hostel-fee-reversal",
              menuName: "Fee Reversal",
              link: "/hostel-fee-reversal",
              parentId: "hostel",
              permissions: [""],
            },
            {
              id: "hostel-fee-refund",
              menuName: "Fee Refund",
              link: "/hostel-fee-refund",
              parentId: "hostel",
              permissions: [""],
            },
            {
              id: "hostel-fee-fine",
              menuName: "Fee Fine",
              link: "/hostel-fee-fine",
              parentId: "hostel",
              permissions: [""],
            },
          ]
        },
        {
          id: "approvals",
          menuName: "Approvals",
          link: "/#",
          parentId: "hostel",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/hostel-exit-approvals", "/hostelfee-exit-approvals"],
          childMenu: [
            {
              id: "hostel-exit-approvals",
              menuName: "Hostel Exit Approvals",
              link: "/hostel-exit-approvals",
              parentId: "hostel",
              permissions: [""],
            },
            {
              id: "hostelfee-exit-approvals",
              menuName: "Hostel Fee Exit Approvals",
              link: "/hostelfee-exit-approvals",
              parentId: "hostel",
              permissions: [""],
            },
          ]
        },
        {
          id: "whatsapp",
          menuName: "Whatsapp",
          link: "/#",
          parentId: "hostel",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/hostel-whatsapp-notifications"],
          childMenu: [
            {
              id: "hostel-whatsapp-notifications",
              menuName: "Whatsapp Notifications",
              link: "/hostel-whatsapp-notifications",
              parentId: "hostel",
              permissions: [""],
            }
          ]
        },
        {
          id: "hostel-settings",
          menuName: "Settings",
          link: "/hostel-settings",
          parentId: "hostel",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/hostel-class-eligibility", "/hostel-fee-particulars", "/hostel-fee-structure", "/hostel-setup"],
          childMenu: [
            {
              id: "hostel-class-eligibility",
              menuName: "Hostel Class Eligibility",
              link: "/hostel-class-eligibility",
              parentId: "hostel",
              permissions: [""],
            },
            {
              id: "hostel-fee-structure",
              menuName: "Fee Structure",
              link: "/hostel-fee-structure",
              parentId: "hostel",
              permissions: [""],
            },
            {
              id: "hostel-fee-particulars",
              menuName: "Fee Particulars",
              link: "/hostel-fee-particulars",
              parentId: "hostel",
              permissions: [""],
            },
            {
              id: "hostel-setup",
              menuName: "Hostel Setup",
              link: "/hostel-setup",
              parentId: "hostel",
              permissions: [""],
            },
          ]
        },
      ],
    },
    {
      id: "library",
      menuName: "Library",
      iconImage: <BrchLibrarySvg />,
      link: "/library",
      allowedRoles: ["BRANCH_ADMIN", "LIBRARY"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/library-reports", "/library-dashboard", "/library-settings", "/library-book-issuance", "/library-book-collection", "/library-book-return", "/library-book-renewal", "/specimen-book-issuance", "/specimen-book-return", "/library-transfer-request-approvals", "/library-stock", "/library-stock-report", "/library-book-overdue", "/library-book-overdue"],
      childMenu: [
        {
          id: "library-dashboard",
          menuName: "Dashboard",
          link: "/library-dashboard",
          parentId: "library",
          permissions: [""],
          hasChildMenu: false,
        },
        {
          id: "library-book-collection",
          menuName: "Book Collection",
          link: "/library-book-collection",
          parentId: "library",
          permissions: [""],
          hasChildMenu: false,
        },
        {
          id: "library-book-issuance",
          menuName: "Book Issuances",
          link: "/library-book-issuance",
          parentId: "library",
          permissions: [""],
          hasChildMenu: false,
        },
        {
          id: "library-book-return",
          menuName: "Book Returns",
          link: "/library-book-return",
          parentId: "library",
          permissions: [""],
          hasChildMenu: false,
        },
        // {
        //   id: "library-book-renewal",
        //   menuName: "Book Renewal",
        //   link: "/library-book-renewal",
        //   parentId: "library",
        //   permissions: [""],
        //   hasChildMenu: false,
        // },
        // {
        //   id: "specimen-book-issuance",
        //   menuName: "Specimen Book Issuances",
        //   link: "/specimen-book-issuance",
        //   parentId: "library",
        //   permissions: [""],
        //   hasChildMenu: false,
        // },
        // {
        //   id: "specimen-book-return",
        //   menuName: "Specimen Book Returns",
        //   link: "/specimen-book-return",
        //   parentId: "library",
        //   permissions: [""],
        //   hasChildMenu: false,
        // },
        {
          id: "approvals",
          menuName: "Approvals",
          link: "/#",
          parentId: "library",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/library-transfer-request-approvals"],
          childMenu: [
            {
              id: "library-transfer-request-approvals",
              menuName: "Transfer Request Details",
              link: "/library-transfer-request-approvals",
              parentId: "library",
              permissions: [""],
              hasChildMenu: false,
            },
          ]
        },
        {
          id: "library-stock",
          menuName: "Stock Verification",
          link: "/library-stock",
          parentId: "library",
          permissions: [""],
          hasChildMenu: false,
        },
        {
          id: "library-reports",
          menuName: "Reports",
          link: "/library-reports",
          permissions: [""],
          parentId: "library",
          hasChildMenu: true,
          childRoutes: ["/library-stock-report", "/library-book-overdue", "/library-book-overdue"],
          childMenu: [
            {
              id: "library-stock-report",
              menuName: "Stock Verification Report",
              link: "/library-stock-report",
              parentId: "library-reports",
              permissions: [""],
            },
            {
              id: "library-book-overdue",
              menuName: "Over Due Reports",
              link: "/library-book-overdue",
              parentId: "library-reports",
              permissions: [""],
            },
            {
              id: "borrowed-library-books",
              menuName: "Borrowed Library Books",
              link: "/borrowed-library-books",
              parentId: "library-reports",
              permissions: [""],
            },
          ]
        },
        {
          id: "library-settings",
          menuName: "Settings",
          link: "/library-settings",
          parentId: "library",
          permissions: [""],
          hasChildMenu: false,
        },
      ],
    },
    {
      id: "time-table",
      menuName: "Time Table",
      iconImage: <HugeiconsIcon icon={Calendar03Icon} size={22} className="hugeicons-icon" />,
      link: "/timeTable",
      allowedRoles: ["BRANCH_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/time-table", "/time-table-settings"],
      childMenu: [
        {
          id: "time-table",
          menuName: "Time Table Management",
          link: "/time-table",
          parentId: "time-table",
          permissions: [""]
        },
        {
          id: "time-table-settings",
          menuName: "Settings",
          link: "/time-table-settings",
          parentId: "time-table",
          permissions: [""]
        }
      ],
    },
    {
      id: "health-records",
      menuName: "Health Records",
      iconImage: <BrchHealthRecordsSvg />,
      link: "",
      allowedRoles: ["BRANCH_ADMIN", "MEDICAL"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/health-records", "/student-health-issues", "/health-form-verification-list"
        , "/settings-health-records"
      ],
      childMenu: [
        {
          id: "health-records-details",
          menuName: "Health Records",
          link: "/health-records",
          parentId: "health-records",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "student-health-issues",
          menuName: "Student Health Issues",
          link: "/student-health-issues",
          parentId: "health-records",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "health-form-verification-list",
          menuName: "Health Form Verification",
          parentId: "health-records",
          link: "/health-form-verification-list",
          permissions: [""],
          hasChildMenu: false,
        },
        {
          id: "settings-health-records",
          menuName: "Settings",
          link: "/settings-health-records",
          allowedRoles: ["BRANCH_ADMIN"],
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/mi-room", "/manage-ailments", "/manage-ailments"],
          childMenu: [
            // {
            //   id: "/common-aliments",
            //   menuName: "Common Aliments",
            //   link: "/settings/common-aliments",
            //   parentId: "health-records",
            //   permissions: [""],
            //   hasChildMenu: false,
            // },

            {
              id: "/mi-room",
              menuName: "MI Room",
              link: "/mi-room",
              parentId: "health-records",
              permissions: [],
              hasChildMenu: false,
            },
            {
              id: "/manage-ailments",
              menuName: "Manage Ailments",
              link: "/manage-ailments",
              parentId: "health-records",
              permissions: [""],
              hasChildMenu: false,
            },
            {
              id: "/medicine-details",
              menuName: "Medicines",
              link: "/medicine-details",
              parentId: "health-records",
              permissions: [""],
              hasChildMenu: false,
            }
          ]
        }
      ]
    },
    {
      id: "concern-feedback",
      menuName: "Helpdesk",
      iconImage: <ConcernFeedbakSvg />,
      link: "",
      allowedRoles: ["BRANCH_ADMIN", "GRIEVANCE"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/concerns-feedback", "/complaint-department", "/master-department", "/concerns-to-parent", "/feedbacks-rating"],
      childMenu: [
        {
          id: "admin-concerns-feedback",
          menuName: "Tickets/Feedback list",
          link: "/concerns-feedback",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "complaint-department",
          menuName: "Complaint Department",
          link: "/complaint-department",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "concerns-to-parent-for-admin",
          menuName: "Tickets to Parents",
          link: "/concerns-to-parent",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "/dc-erp-issues-for-admin",
          menuName: "DC ERP Issues",
          link: "/dc-erp-issues",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "feedbacks-rating",
          menuName: "Ratings",
          link: "/feedbacks-rating",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "complaint-settings",
          menuName: "Settings",
          link: "/#",
          parentId: "concern-feedback",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/master-department"],
          childMenu: [
            {
              id: "master-department",
              menuName: "Departments",
              link: "/master-department",
              parentId: "complaint-settings",
              permissions: [""],
            },

          ]
        }
      ],
    },
    {
      id: "concern-feedback",
      menuName: "Helpdesk",
      iconImage: <ConcernFeedbakSvg />,
      link: "",
      allowedRoles: ["PARENT_ROLE"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/concerns-feedback"],
      childMenu: [
        {
          id: "concerns-feedback",
          menuName: "Tickets/Feedback list",
          link: "/concerns-feedback",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "concerns-from-school",
          menuName: "Tickets From School",
          link: "/concerns-from-school",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
      ],
    },
    {
      id: "concern-feedback",
      menuName: "Helpdesk",
      iconImage: <ConcernFeedbakSvg />,
      link: "",
      allowedRoles: ["TEACHER", "ACCOUNT", "MEDICAL", "LIBRARY", "ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD", "CO ORDINATOR", "Driver", "EMPLOYEE", "HOSTEL", "HOD", "HOSTEL", "HR", "HR_HEAD", "PA", "PRINCIPAL", "TEACHER-ADMIN", "TRANSPORT", "TRANSPORT_HEAD", "VICE_PRINCIPAL"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/my-concerns-feedback", "/my-concerns", "/concerns-feedback", "/concerns-to-parent"],
      childMenu: [
        {
          id: "my-concerns-feedback",
          menuName: "My Assignees",
          link: "/my-concerns-feedback",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "my-concerns",
          menuName: "My Tickets",
          link: "/my-concerns",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "concerns-feedback",
          menuName: "Tickets/Feedback list",
          link: "/concerns-feedback",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        }, {
          id: "concerns-to-parent",
          menuName: "Tickets to Parents",
          link: "/concerns-to-parent",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
      ],
    },
    {
      id: "student-dashboard",
      menuName: "Student Dashboard",
      iconImage: <DashboardSvg />,
      link: "/student-dashboard",
      allowedRoles: ["STUDENT_ROLE"],
      permissions: [""],
    },
    {
      id: "hrms",
      menuName: "HRMS",
      iconImage: <BrchNewHrmsSvg />,
      link: "/hrms",
      allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN", "HR", "HR_HEAD"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/employee-management", "/other-employee", "/company-details", "/employee-monthly-attendance"],
      childMenu: [
        {
          id: "employee-management",
          menuName: "Employee Management",
          link: "/employee-management",
          parentId: "directory",
          permissions: [""],
        },
        {
          id: "employee-attendance",
          menuName: "Employee Attendance",
          link: "/#",
          parentId: "hrms",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/employee-monthly-attendance"],
          childMenu: [
            {
              id: "employee-monthly-attendance",
              menuName: "Monthly Attendance",
              link: "/employee-monthly-attendance",
              parentId: "hrms",
              permissions: [""],
            }
          ]
        },
        {
          id: "data-import",
          menuName: "Data Import",
          link: "/#",
          parentId: "hrms",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/bulk-upload"],
          childMenu: [
            {
              id: "bulk-upload",
              menuName: "Bulk Upload",
              link: "/bulk-upload",
              parentId: "hrms",
              permissions: [""],
            }
          ]
        },
        {
          id: "other-employee",
          menuName: "Other Employees",
          link: "/other-employee",
          parentId: "directory",
          permissions: [""],
        },
        {
          id: "company-details",
          menuName: "Company Details",
          link: "/company-details",
          parentId: "directory",
          permissions: [""],
        }
      ],
    },
    {
      id: "cbse-verification-form",
      menuName: "CBSE Verification Form",
      iconImage: <RequestSvg />,
      link: "/cbse-verification-form",
      allowedRoles: ["PARENT_ROLE"],
      permissions: [""],
    },
    {
      id: "student-id-card",
      menuName: "ID Card",
      iconImage: <BrchHrmsSvg />,
      link: "/student-id-card",
      allowedRoles: ["PARENT_ROLE"],
      permissions: [""],
    },
    {
      id: "teacher-time-table",
      menuName: "Time Table",
      iconImage: <HugeiconsIcon icon={Calendar03Icon} size={22} className="hugeicons-icon" />,
      link: "/teacher-time-table",
      allowedRoles: ["TEACHER"],
      permissions: [""],
    },
    {
      id: "all-transportation-records",
      menuName: "Transportation Records",
      iconImage: <BrchTransportationSvg />,
      link: "/all-transportation-records",
      allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "TEACHER", "ADM_CONS", "PA",
        "ADM_HEAD", "GRIEVANCE"],
      permissions: [""],
    },
    {
      id: "all-ledgers",
      menuName: "Student Fee Ledgers",
      iconImage: <BrchFeeSvg />,
      link: "/all-ledgers",
      allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "TEACHER", "PA",
        "ADM_CONS", "ADM_HEAD", "GRIEVANCE"],
      permissions: [""],
    },

    {
      id: "employee-branch-storage-branch",
      menuName: "File Manager",
      iconImage: <HugeiconsIcon
        icon={Building03Icon}
        size={22}
        className="hugeicons-icon"
      />,
      link: "/#",
      allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "TEACHER", "PA",
        "ADM_CONS", "ADM_HEAD", "GRIEVANCE"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/employee-all-files", "/shared-with-me", "/trash-files", "/recent-files", "/favorite-files"],
      childMenu: [
        {
          id: "employee-all-files",
          menuName: "Files",
          link: "/employee-all-files",
          parentId: "employee-branch-storage-branch",
          permissions: [""]
        },
        {
          id: "recent-files",
          menuName: "Recent Files",
          link: "/recent-files",
          parentId: "branch-storage-branch",
          permissions: [""]
        },
        {
          id: "favorite-files",
          menuName: "Favorite Files",
          link: "/favorite-files",
          parentId: "branch-storage-branch",
          permissions: [""]
        },
        // {
        //   id: "shared-with-me",
        //   menuName: "Shared With Me",
        //   link: "/shared-with-me",
        //   parentId: "employee-branch-storage-branch",
        //   permissions: [""]
        // },
        {
          id: "trash-files",
          menuName: "Trash Files",
          link: "/trash-files",
          parentId: "employee-branch-storage-branch",
          permissions: [""]
        },
      ],
    },
    {
      id: "branch-settings",
      menuName: "Settings",
      // icon: "las la-cog",
      iconImage: <HugeiconsIcon icon={Settings01Icon} size={20} className="hugeicons-icon" />,
      link: "/branch-settings",
      allowedRoles: ["BRANCH_ADMIN"],
      permissions: [""],
    },
    {
      id: "concern-feedback",
      menuName: "Helpdesk",
      iconImage: <ConcernFeedbakSvg />,
      link: "",
      allowedRoles: ["SUPER_ADMIN", "INSTITUTE_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/concerns-feedback", "/concerns-from-app", "/dc-erp-issues"],
      childMenu: [
        {
          id: "admin-concerns-feedback",
          menuName: "Tickets/Feedback list",
          link: "/concerns-feedback",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "admin-concerns-from-app",
          menuName: "Tickets From App",
          link: "/concerns-from-app",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "dc-erp-issues",
          menuName: "DC ERP Issues",
          link: "/dc-erp-issues",
          parentId: "concern-feedback",
          permissions: [],
          hasChildMenu: false,
        },
        {
          id: "complaint-settings",
          menuName: "Settings",
          link: "/#",
          parentId: "concern-feedback",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: ["/master-department"],
          childMenu: [
            {
              id: "master-department",
              menuName: "Departments",
              link: "/master-department",
              parentId: "complaint-settings",
              permissions: [""],
            },

          ]
        }
      ],
    },
    {
      id: "enquiry-management",
      menuName: "Enquiry Management",
      // icon:"las la-cog",
      iconImage: <HugeiconsIcon icon={FileManagementIcon} size={20} className="hugeicons-icon" />,
      link: "",
      allowedRoles: ["INSTITUTE_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: ["/manage-leads", "/enquiry-settings"],
      childMenu: [
        {
          id: "dashboard",
          menuName: "Dashboard",
          link: "/enquiry-dashboard",
          parentId: "enquiry-management",
          permissions: [],
        },
        {
          id: "manage-leads",
          menuName: "Manage Leads",
          link: "/manage-leads",
          parentId: "enquiry-management",
          permissions: [],
        },
        {
          id: "enquiry-settings",
          menuName: "Settings",
          link: "/enquiry-settings",
          parentId: "enquiry-management",
          permissions: [],
        }
      ],
    },
    {
      id: "crm",
      menuName: "CRM",
      iconImage: <HugeiconsIcon icon={FileManagementIcon} size={20} className="hugeicons-icon" />,
      link: "",
      allowedRoles: ["INSTITUTE_ADMIN"],
      permissions: [""],
      hasChildMenu: true,
      childRoutes: [
        "/crm-dashboard",
        "/crm-leads",
        "/crm-bulk-actions",
        "/crm-tracker",
        "/crm-reports",
        "/crm-whatsapp-inbox",
        "/crm-whatsapp-templates",
        "/crm-automations",
        "/crm-payments",
        "/crm-user-management",
        "/crm-templates",
        "/business-units",
        "/integrations"
      ],
      childMenu: [
        {
          id: "crm-dashboard",
          menuName: "Dashboard",
          link: "/crm-dashboard",
          parentId: "crm",
          permissions: [""]
        },
        {
          id: "crm-leads",
          menuName: "Leads",
          link: "/crm-leads",
          parentId: "crm",
          permissions: [""],
          childRoutes: ["/crm-whatsapp-inbox"]
        },
        {
          id: "crm-tracker",
          menuName: "Tracker",
          link: "/crm-tracker",
          parentId: "crm",
          permissions: [""]
        },
        {
          id: "crm-bulk-actions",
          menuName: "Bulk Actions",
          link: "/crm-bulk-actions",
          parentId: "crm",
          permissions: [""]
        },

        {
          id: "crm-reports",
          menuName: "Reports",
          link: "/crm-reports",
          parentId: "crm",
          permissions: [""]
        },
        {
          id: "crm-automations",
          menuName: "Automations",
          link: "/crm-automations",
          parentId: "crm",
          permissions: [""]
        },
        {
          id: "crm-payments",
          menuName: "Payments",
          link: "/crm-payments",
          parentId: "crm",
          permissions: [""]
        },
        {
          id: "crm-user-management",
          menuName: "User Management",
          link: "/crm-user-management",
          parentId: "crm",
          permissions: [""]
        },
        {
          id: "crm-templates",
          menuName: "Templates",
          link: "/crm-templates",
          parentId: "crm",
          permissions: [""],
          childRoutes: [
            "/crm-whatsapp-templates"
          ]
        },
        {
          id: "crm-settings",
          menuName: "Settings",
          link: "/#",
          parentId: "crm",
          permissions: [""],
          hasChildMenu: true,
          childRoutes: [
            "/business-units",
            "/integrations"
          ],
          childMenu: [
            {
              id: "crm-settings-business-units",
              menuName: "Business Units",
              link: "/business-units",
              parentId: "crm-settings",
              permissions: [""]
            },
            {
              id: "crm-settings-integrations",
              menuName: "Integrations",
              link: "/integrations",
              parentId: "crm-settings",
              permissions: [""]
            }
          ]
        },
      ]
    },
  ]
  )
}

export function filterRoutesHndlr(userRoleId, instituteCode) {
  const menuOptions = generateMenuOptions(instituteCode);
  if (instituteCode === "DPS") {
    return menuOptions.filter(item => Array.isArray(item.allowedRoles) && item.allowedRoles.includes(userRoleId));
  } else {
    return menuOptions.filter(item => {
      if (!pallaviHiddneFeatures.includes(item.id)) {
        return Array.isArray(item.allowedRoles) && item.allowedRoles.includes(userRoleId)
      }
      return false;
    });
  }
}

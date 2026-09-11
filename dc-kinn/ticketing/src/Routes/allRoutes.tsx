import React from "react";
import { Redirect } from "react-router-dom";

const ConcernsAndFeedback = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernsFeedbackList')
)
const MyConcernsAndFeedback = React.lazy(
  () => import('../pages/ConcernsFeedback/MyConcernFeedbaclList/index')
)
const AddConcernsAndFeedback = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernsFeedbackList/AddConcernFeedback')
)
const ViewConcernFeedback = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernsFeedbackList/ViewConcernFeedback')
)
const ComplaintDepartment = React.lazy(
  () => import('../pages/ConcernsFeedback/ComplaintDepartment')
)
const MasterDepartmentSetting = React.lazy(
  () => import('../pages/ConcernsFeedback/Settings/MasterDepartments/index')
)
const ConcernToParent = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernToParent')
)
const FeedbackRating = React.lazy(() => import("../pages/ConcernsFeedback/FeedbackRating"))
const AddConcernToParent = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernToParent/AddConcernToParent')
)
const ViewConcernToParent = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernToParent/ViewConcernToParent')
)
const ConcernFromSchool = React.lazy(
  () => import('../pages/ConcernsFeedback/ConcernToParent')
)
const FeedBackForm = React.lazy(() => import('../pages/FrontDesk/Reports/UnpaidReport/FeedBackForm'));
const FeedbackThankYouPage = React.lazy(() => import('../pages/FrontDesk/Reports/UnpaidReport/ThankYouPage'));
const ProfileDetails = React.lazy(() => import("../pages/Profile"));
const LoginV1 = React.lazy(() => import("../pages/AuthV1/Login"))
const ForgotPasswordV1 = React.lazy(() => import("../pages/AuthV1/ForgotPassword"))
const ValidateOtpV1 = React.lazy(() => import("../pages/AuthV1/ValidateOtp"))
const ResetPasswordV1 = React.lazy(() => import("../pages/AuthV1/ResetPassword"))

const authProtectedRoutes: any = [
  {
    path: "/my-concerns",
    component: ConcernsAndFeedback,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE",
      "PARENT_ROLE", "TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "EMPLOYEE", "HOSTEL", "MEDICAL", "LIBRARY",
    ]
  },
  {
    path: "/concerns-feedback",
    component: ConcernsAndFeedback,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE",
      "PARENT_ROLE", "TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "EMPLOYEE", "HOSTEL", "MEDICAL", "LIBRARY",
    ]
  },
  {
    path: "/dc-erp-issues",
    component: ConcernsAndFeedback,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/concerns-from-app",
    component: ConcernsAndFeedback,
    allowedRoles: ["INSTITUTE_ADMIN"]
  },
  {
    path: "/my-concerns-feedback",
    component: MyConcernsAndFeedback,
    allowedRoles: ["TEACHER", "ACCOUNT", "ACCOUNT_HEAD", "ADM_CONS", "ADM_HEAD",
      "CO ORDINATOR", "Driver", "GRIEVANCE", "HOD", "HOSTEL",
      "HR", "HR_HEAD", "PA", "PRINCIPAL", "TEACHER-ADMIN", "TRANSPORT", "TRANSPORT_HEAD", "VICE_PRINCIPAL",
      "EMPLOYEE", "HOSTEL", "MEDICAL", "LIBRARY",]
  },
  {
    path: ["/concerns-feedback/add-concerns-feedback",
      "/my-concerns-feedback/add-concerns-feedback",
      "/my-concerns/add-concerns-feedback"
    ],
    component: AddConcernsAndFeedback,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE",
      "PARENT_ROLE", "TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "EMPLOYEE", "HOSTEL", "MEDICAL", "LIBRARY",
    ]
  },
  {
    path: ["/concerns-feedback/view-concerns-feedback",
      "/my-concerns-feedback/view-concerns-feedback",
      "/my-concerns/view-concerns-feedback",
      "/dc-erp-issues/view-concerns-feedback",
      "/concerns-from-app/view-concerns-feedback",
    ],
    component: ViewConcernFeedback,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE",
      "PARENT_ROLE", "TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "TRANSPORT", "TRANSPORT_HEAD",
      "ACCOUNT", "ACCOUNT_HEAD",
      "ADM_CONS", "ADM_HEAD", "HR", "HR_HEAD", "EMPLOYEE", "HOSTEL", "MEDICAL", "LIBRARY",
    ]
  },
  {
    path: "/complaint-department",
    component: ComplaintDepartment,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE"]
  },
  {
    path: "/master-department",
    component: MasterDepartmentSetting,
    allowedRoles: ["INSTITUTE_ADMIN", "BRANCH_ADMIN", "GRIEVANCE"]
  },
  {
    path: "/concerns-to-parent",
    component: ConcernToParent,
    allowedRoles: ["TEACHER", "BRANCH_ADMIN",]
  },
  {
    path: "/feedbacks-rating",
    component: FeedbackRating,
    allowedRoles: ["TEACHER", "BRANCH_ADMIN",]
  },
  {
    path: "/concerns-to-parent/add-concern-to-parent",
    component: AddConcernToParent,
    allowedRoles: ["TEACHER",]
  },
  {
    path: "/concerns-to-parent/view-concern-to-parent",
    component: ViewConcernToParent,
    allowedRoles: ["TEACHER", "BRANCH_ADMIN"]
  },
  {
    path: "/concerns-from-school",
    component: ConcernFromSchool,
    allowedRoles: ["PARENT_ROLE",]
  },
  {
    path: "/concerns-from-school/view-concern-from-school",
    component: ViewConcernToParent,
    allowedRoles: ["PARENT_ROLE",]
  },
  {
    path: "/profile", component: ProfileDetails,
    allowedRoles: ["BRANCH_ADMIN", "PARENT_ROLE", "INSTITUTE_ADMIN", "ACCOUNT", "ADM_CONS", "ACCOUNT_HEAD",
      "TRANSPORT_HEAD", "ADM_HEAD", "TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "HR", "HR_HEAD", "GRIEVANCE",
      "EMPLOYEE", "HOSTEL", "LIBRARY", "MEDICAL"]
  },
  {
    path: "/helpdesk",
    component: () => <Redirect to="/concerns-feedback" />,
    allowedRoles: ["INSTITUTE_ADMIN","BRANCH_ADMIN","GRIEVANCE","PARENT_ROLE","TEACHER","PRINCIPAL","VICE_PRINCIPAL","PA","TRANSPORT","TRANSPORT_HEAD","ACCOUNT","ACCOUNT_HEAD","ADM_CONS","ADM_HEAD","HR","HR_HEAD","EMPLOYEE","HOSTEL","MEDICAL","LIBRARY","CO ORDINATOR","Driver","HOD","TEACHER-ADMIN"]
  }
];

const publicRoutes = [
  { path: "/feedback-form", component: FeedBackForm },
  { path: "/feedback-thank-you-page", component: FeedbackThankYouPage }
];

const authRoutesV1 = [
  { path: "/login", component: LoginV1 },
  { path: "/forgotpassword", component: ForgotPasswordV1 },
  { path: "/validateotp", component: ValidateOtpV1 },
  { path: "/resetpassword", component: ResetPasswordV1 }
];

const authRoutes = [

];

const authRoutesBlankLayout = [

];

const authProtectedBlankLayout = [

];

export { authProtectedRoutes, authProtectedBlankLayout, authRoutesBlankLayout, publicRoutes, authRoutes, authRoutesV1 };

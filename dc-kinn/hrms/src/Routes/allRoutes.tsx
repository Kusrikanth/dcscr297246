import React from "react";
import { Redirect } from "react-router-dom";

const BulkUpload = React.lazy(() => import("../pages/Directory/BulkUpload"))
const RawDataTable = React.lazy(() => import("../pages/UpdatedDashboard/Examination/BranchWiseStudentsMarksList"))
const EmployeeManagement = React.lazy(() => import("../pages/Directory/EmployeeManagement"));
const OtherEmployeeManagement = React.lazy(() => import("../pages/Directory/EmployeeManagement/OtherEmployees"));
const AddEmployee = React.lazy(() => import("../pages/Directory/AddEmployee"));
const EmployeeDetails = React.lazy(() => import("../pages/Directory/EmployeeDetails"));
const CompanyDetails = React.lazy(() => import("../pages/Directory/CompanyDetails"));
const ProfileDetails = React.lazy(() => import("../pages/Profile"));
const EmployeeMonthlyAttendance = React.lazy(() => import("../pages/Directory/EmployeeAttendance"));
const LoginV1 = React.lazy(() => import("../pages/AuthV1/Login"))
const ForgotPasswordV1 = React.lazy(() => import("../pages/AuthV1/ForgotPassword"))
const ValidateOtpV1 = React.lazy(() => import("../pages/AuthV1/ValidateOtp"))
const ResetPasswordV1 = React.lazy(() => import("../pages/AuthV1/ResetPassword"))

const authProtectedRoutes: any = [
  {
    path: "/bulk-upload",
    component: BulkUpload,
    allowedRoles: ["BRANCH_ADMIN", "INSTITUTE_ADMIN"]
  },
  {
    path: "/bulk-upload/raw-data",
    component: RawDataTable,
    allowedRoles: ["BRANCH_ADMIN"]
  },
  {
    path: "/employee-management/add-employee", component: AddEmployee,
    allowedRoles: ["HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/employee-management/edit-employee/:employeeId", component: EmployeeDetails,
    allowedRoles: ["HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/employee-monthly-attendance", component: EmployeeMonthlyAttendance,
    allowedRoles: ["HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/other-employee/add-other-employee", component: AddEmployee,
    allowedRoles: ["HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/other-employee/edit-employee/:employeeId", component: EmployeeDetails,
    allowedRoles: ["HR", "HR_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/employee-management", component: EmployeeManagement,
    allowedRoles: ["HR", "HR_HEAD", "INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },
  {
    path: "/other-employee", component: OtherEmployeeManagement,
    allowedRoles: ["HR", "HR_HEAD", "INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },
  {
    path: "/company-details", component: CompanyDetails,
    allowedRoles: ["HR", "HR_HEAD", "INSTITUTE_ADMIN", "BRANCH_ADMIN"]
  },
  {
    path: "/profile", component: ProfileDetails,
    allowedRoles: ["BRANCH_ADMIN", "PARENT_ROLE", "INSTITUTE_ADMIN", "ACCOUNT", "ADM_CONS", "ACCOUNT_HEAD",
      "TRANSPORT_HEAD", "ADM_HEAD", "TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "HR", "HR_HEAD", "GRIEVANCE",
      "EMPLOYEE", "HOSTEL", "LIBRARY", "MEDICAL"]
  },
  {
    path: "/hrms",
    component: () => <Redirect to="/employee-management" />,
    allowedRoles: ["BRANCH_ADMIN","INSTITUTE_ADMIN","HR","HR_HEAD","PARENT_ROLE","ACCOUNT","ADM_CONS","ACCOUNT_HEAD","TRANSPORT_HEAD","ADM_HEAD","TEACHER","PRINCIPAL","VICE_PRINCIPAL","PA","GRIEVANCE","EMPLOYEE","HOSTEL","LIBRARY","MEDICAL"]
  }
];

const publicRoutes = [

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

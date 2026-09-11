import React from "react";
import { Redirect } from "react-router-dom";

const TransportationDashboard = React.lazy(
  () => import("../pages/Transportation/Dashboard")
);
const TransportationSettings = React.lazy(
  () => import("../pages/Transportation/Settings")
);
const LiveTracking = React.lazy(
  () => import("../pages/Transportation/LiveTracking")
);
const TransportationRecords = React.lazy(
  () => import("../pages/Transportation/TransportationRecords")
);
const TransportionEmployee = React.lazy(
  () => import("../pages/Transportation/TransportationEmployee")
);
const TransportRegistration = React.lazy(
  () => import("../pages/Transportation/TransportRegistration")
);
const AddEditTransportionEmployee = React.lazy(
  () => import("../pages/Transportation/TransportationEmployee/AddTransportEmployee")
);
const AllTransportationRecords = React.lazy(
  () => import("../pages/AllTransportationRecords")
);
const TransportationTCRequest = React.lazy(
  () => import("../pages/Transportation/TransportationTCRequest")
);
const NewChangeRequest = React.lazy(
  () =>
    import(
      "../pages/Transportation/TransportationRecords/ChangeRequests/NewChangeRequest"
    )
);
const NewTerminationRequest = React.lazy(
  () =>
    import(
      "../pages/Transportation/TransportationRecords/Termination/NewTerminationRequest"
    )
);
const AddNewRequest = React.lazy(
  () =>
    import(
      "../pages/Transportation/TransportationRecords/NewRequests/AddNewRequests"
    )
);
const TransportConcession = React.lazy(
  () => import("../pages/Transportation/TransportConcession")
);
const NewTransportConcession = React.lazy(
  () =>
    import("../pages/Transportation/TransportConcession/NewTransportConcession")
);
const RoutesTab = React.lazy(
  () => import("../pages/Transportation/Settings/RoutesTab")
);
const CreateStopPage = React.lazy(
  () => import("../pages/Transportation/Settings/CreateStopPage")
);
const AllStopCreateStopPage = React.lazy(
  () => import("../pages/Transportation/Settings/AllStops/CreateStopPage")
);
const AllStops = React.lazy(
  () => import("../pages/Transportation/Settings/AllStops")
);
const Slabs = React.lazy(
  () => import("../pages/Transportation/Settings/Slabs")
);
const VehiclesType = React.lazy(
  () => import("../pages/Transportation/Settings/VehicalsType")
);
const VehicleDetails = React.lazy(
  () => import("../pages/Transportation/Settings/VehicleDetails")
);
const VehicleManufacture = React.lazy(
  () => import("../pages/Transportation/Settings/VehicleManufacture")
);
const AssignEmployee = React.lazy(
  () => import("../pages/Transportation/Settings/AssignEmployee")
);
const SlabsTerms = React.lazy(
  () => import("../pages/Transportation/Settings/SlabsTerms")
);
const TransportManagement = React.lazy(
  () => import("../pages/Transportation/TransportManagement")
);
const ProfileDetails = React.lazy(() => import("../pages/Profile"));
const LoginV1 = React.lazy(() => import("../pages/AuthV1/Login"))
const ForgotPasswordV1 = React.lazy(() => import("../pages/AuthV1/ForgotPassword"))
const ValidateOtpV1 = React.lazy(() => import("../pages/AuthV1/ValidateOtp"))
const ResetPasswordV1 = React.lazy(() => import("../pages/AuthV1/ResetPassword"))

const authProtectedRoutes: any = [
  {
    path: "/transportation-dashboard",
    component: TransportationDashboard,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings",
    component: TransportationSettings,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/live-tracking",
    component: LiveTracking,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/create-stop",
    component: CreateStopPage,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/all-stops/create-stop",
    component: AllStopCreateStopPage,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transport-concession",
    component: TransportConcession,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transport-concession/create-transport-concession",
    component: NewTransportConcession,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transport-concession/edit-transport-concession",
    component: NewTransportConcession,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-records",
    component: TransportationRecords,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-employee",
    component: TransportionEmployee,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transport-registration",
    component: TransportRegistration,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-employee/add",
    component: AddEditTransportionEmployee,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-employee/edit/:employeeId",
    component: AddEditTransportionEmployee,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/all-transportation-records",
    component: AllTransportationRecords,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "TEACHER", "PA",
      "ADM_CONS", "ADM_HEAD", "BRANCH_ADMIN", "GRIEVANCE"]
  },
  {
    path: "/transportation-tcapproval",
    component: TransportationTCRequest,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/create-change-request",
    component: NewChangeRequest,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/create-termination-request",
    component: NewTerminationRequest,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/create-new-request/:transportRequestId?",
    component: AddNewRequest,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/create-change-request/:transportRequestId?",
    component: NewChangeRequest,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/routes-tab",
    component: RoutesTab,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/all-stops",
    component: AllStops,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/slabs",
    component: Slabs,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/create-stop",
    component: CreateStopPage,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/vehicles-types",
    component: VehiclesType,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/vehicles-details",
    component: VehicleDetails,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/vehicles-manufacture",
    component: VehicleManufacture,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/assign-employee",
    component: AssignEmployee,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-settings/slabs-terms",
    component: SlabsTerms,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/transportation-management",
    component: TransportManagement,
    allowedRoles: ["TRANSPORT", "TRANSPORT_HEAD", "ACCOUNT", "ACCOUNT_HEAD", "BRANCH_ADMIN"]
  },
  {
    path: "/profile", component: ProfileDetails,
    allowedRoles: ["BRANCH_ADMIN", "PARENT_ROLE", "INSTITUTE_ADMIN", "ACCOUNT", "ADM_CONS", "ACCOUNT_HEAD",
      "TRANSPORT_HEAD", "ADM_HEAD", "TEACHER", "PRINCIPAL", "VICE_PRINCIPAL", "PA", "HR", "HR_HEAD", "GRIEVANCE",
      "EMPLOYEE", "HOSTEL", "LIBRARY", "MEDICAL"]
  },
  {
    path: "/transport",
    component: () => <Redirect to="/transportation-dashboard" />,
    allowedRoles: ["TRANSPORT","TRANSPORT_HEAD","ACCOUNT","ACCOUNT_HEAD","BRANCH_ADMIN","TEACHER","PA","ADM_CONS","ADM_HEAD","GRIEVANCE","PARENT_ROLE","INSTITUTE_ADMIN","PRINCIPAL","VICE_PRINCIPAL","HR","HR_HEAD","EMPLOYEE","HOSTEL","LIBRARY","MEDICAL"]
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

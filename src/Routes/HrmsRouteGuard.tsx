import React from "react";
import { Redirect, useLocation } from "react-router-dom";

const HRMS_ROUTES = [
  "/hrms",
  "/employee-management",
  "/employee-monthly-attendance",
  "/bulk-upload",
  "/other-employee",
  "/company-details",
  "/employee-management/add-employee",
  "/employee-management/edit-employee/:employeeId",
  "/other-employee/add-other-employee",
  "/other-employee/edit-employee/:employeeId",
  
];

const HRMS_USER = "nacharam";

const HrmsRouteGuard = ({ children, userName }) => {
  const location = useLocation();

  // Only restrict the HRMS user
  if (userName !== HRMS_USER) {
    return children;
  }

  const isHrmsRoute = HRMS_ROUTES.some(
    (route) =>
      location.pathname === route ||
      location.pathname.startsWith(`${route}/`)
  );

  // HRMS user can access HRMS routes
  if (isHrmsRoute) {
    return children;
  }

  // Everything else goes to HRMS
  return <Redirect to="/hrms" />;
};

export default HrmsRouteGuard;
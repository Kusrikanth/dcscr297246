import { default as BrchNewHrmsSvg } from "../assets/imagesdps/menuicon/branch-icon/latest-hrms.svg?react";
import { pallaviHiddneFeatures } from "../Components/constants/common";


export function generateMenuOptions(instituteCode) {
  return ([
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
    }
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

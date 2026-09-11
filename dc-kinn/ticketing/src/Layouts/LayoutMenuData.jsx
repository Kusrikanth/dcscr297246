import { default as ConcernFeedbakSvg } from "../assets/imagesdps/menuicon/branch-icon/concern-feedback.svg?react";
import { pallaviHiddneFeatures } from "../Components/constants/common";


export function generateMenuOptions(instituteCode) {
  return ([
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

import { default as BrchTransportationSvg } from "../assets/imagesdps/menuicon/branch-icon/transportation.svg?react";
import { pallaviHiddneFeatures } from "../Components/constants/common";


export function generateMenuOptions(instituteCode) {
  return ([
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

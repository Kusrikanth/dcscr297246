import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//Institute Icon
import { default as ReportsSvg } from "../assets/imagesdps/menuicon/institute-icon/reports.svg?react"
import { default as DashboardSvg } from "../assets/imagesdps/menuicon/institute-icon/dashboard.svg?react";

//Branch Icon
import { default as BrchAcademicSvg } from "../assets/imagesdps/menuicon/branch-icon/academics.svg?react";
import { default as BrchDirectorySvg } from "../assets/imagesdps/menuicon/branch-icon/directory.svg?react";
import { default as BrchExaminationSvg } from "../assets/imagesdps/menuicon/branch-icon/examination.svg?react";
import { default as BrchFeeSvg } from "../assets/imagesdps/menuicon/branch-icon/fee.svg?react";
import { default as BrchFrontDeskSvg } from "../assets/imagesdps/menuicon/branch-icon/front-desk.svg?react";
import { default as BrchHrmsSvg } from "../assets/imagesdps/menuicon/branch-icon/hrms.svg?react";
import { default as BrchTransportationSvg } from "../assets/imagesdps/menuicon/branch-icon/transportation.svg?react";
import { default as BrchUserMangmntSvg } from "../assets/imagesdps/menuicon/branch-icon/user-management.svg?react";

//Admin Icon
import { default as AdmnBillingPaymentSvg } from "../assets/imagesdps/menuicon/admin-icon/billing-payment.svg?react";
import { default as AdmnEmployeesSvg } from "../assets/imagesdps/menuicon/admin-icon/employees.svg?react";
import { default as AdmnInstituteSvg } from "../assets/imagesdps/menuicon/admin-icon/institute.svg?react";

const Navdata = () => {
    const history = useHistory();
    //state data
    const [iscurrentState, setIscurrentState] = useState("Dashboard");
    const [isInstitute, setIsInstitute] = useState(false);
    const [isAcademics, setIsAcademics] = useState(false);

    const [isNewAcademics, setIsNewAcademics] = useState(false);
    const [isFee, setIsFee] = useState(false);
    const [isTransportation, setIsTransportation] = useState(false);
    const [isDirectory, setIsDirectory] = useState(false);
    const [isUserManagement, setIsUserManagement] = useState(false);

    //Sub menu fee collection
    const [isStudentFeeCollection, setIsStudentFeeCollection] = useState(false);
    const [isConcession, setIsConcession] = useState(false);
    const [isApprovals, setIsApprovals] = useState(false);
    const [isFeeSettings, setIsFeeSettings] = useState(false);
    const [isClassroomManagement, setIsClassroomManagement] = useState(false);
    const [isSubjectManagement, setIsSubjectManagement] = useState(false);
    const [isCertificate, setIsCertificate] = useState(false);
    const [isDetentionsPromotions, setIsDetentionsPromotions] = useState(false);
    const [isRequest, setIsRequest] = useState(false);

    function updateIconSidebar(e) {
        if (e && e.target && e.target.getAttribute("subitems")) {
            const ul = document.getElementById("two-column-menu");
            const iconItems = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("subitems");
                if (document.getElementById(id))
                    document.getElementById(id).classList.remove("show");
            });
        }
    }

    const menuItems = [
        {
            id: "dashboard",
            label: "Dashboards",
            // icon: "las la-tachometer-alt",
            iconImage: <DashboardSvg />,
            link: "/dashboard",
            roleName: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("Dashboard");
            },
        },
        {
            id: "branch-dashboard",
            label: "Dashboards",
            icon: "las la-tachometer-alt",
            link: "/branch-dashboard",
            roleName: ["BRANCH_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("UpdatedDashboard");
            },
        },
        {
            id: "academics",
            label: "Academics",
            icon: "las la-cog",
            iconImage: <BrchAcademicSvg />,
            link: "/#",
            stateVariables: isNewAcademics,
            roleName: ["BRANCH_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIsNewAcademics(!isNewAcademics);
                setIscurrentState("Academics");
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "classroom-managment-list",
                    label: "Classroom Managment",
                    parentId: "academics",
                    link: "/#",
                    isChildItem: true,
                    stateVariables: isClassroomManagement,
                    click: function (e) {
                        e.preventDefault();
                        setIsClassroomManagement(!isClassroomManagement);
                    },
                    childItems: [
                        {
                            id: "section-management-list",
                            label: "Section Managment",
                            link: "/academics",
                            parentId: "academics",
                        },
                        {
                            id: "assign-group-list",
                            label: "Assign Group",
                            link: "/assign-group",
                            parentId: "academics",
                        },
                        {
                            id: "generate-roll-number-list",
                            label: "Generate Roll Numbers",
                            link: "/generate-roll-number",
                            parentId: "academics",
                        },
                    ]
                },
                {
                    id: "subject-managment-list",
                    label: "Subject Managment",
                    parentId: "academics",
                    link: "/#",
                    isChildItem: true,
                    stateVariables: isSubjectManagement,
                    click: function (e) {
                        e.preventDefault();
                        setIsSubjectManagement(!isSubjectManagement);
                    },
                    childItems: [
                        // {
                        //   id: "language-list",
                        //   label: "Languages",
                        //   link: "/languages",
                        //   parentId: "academics",
                        // },
                        {
                            id: "class-subject-list",
                            label: "Class Subjects",
                            link: "/class-subject",
                            parentId: "academics",
                        },
                        {
                            id: "subject-teacher-list",
                            label: "Subject Teacher",
                            link: "/subject-teacher",
                            parentId: "academics",
                        }
                    ]
                },
                {
                    id: "certificates-list",
                    label: "Certificates",
                    parentId: "academics",
                    link: "/#",
                    isChildItem: true,
                    stateVariables: isCertificate,
                    click: function (e) {
                        e.preventDefault();
                        setIsCertificate(!isCertificate);
                    },
                    childItems: [
                        {
                            id: "transfer-certificate-list",
                            label: "Transfer Certificate",
                            link: "/transfer-certificate",
                            parentId: "academics",
                        },
                        {
                            id: "bonafide-certificate-list",
                            label: "Bonafide Certificate",
                            link: "/bonafide-certificate",
                            parentId: "academics",
                        },
                    ]
                },
                {
                    id: "detentions-promotions",
                    label: "Detentions & Promotions",
                    parentId: "academics",
                    link: "/#",
                    isChildItem: true,
                    stateVariables: isDetentionsPromotions,
                    click: function (e) {
                        e.preventDefault();
                        setIsDetentionsPromotions(!isDetentionsPromotions);
                    },
                    childItems: [
                        {
                            id: "higher-class-eligibility-list",
                            label: "Higher Class Eligibility",
                            link: "/higher-class-eligibility",
                            parentId: "academics",
                        },
                        {
                            id: "promote-students-list",
                            label: "Promote Students",
                            link: "/promote-student",
                            parentId: "academics",
                        },
                        {
                            id: "detention-promotion-list",
                            label: "Detention Or Promotion",
                            link: "/detention-promotion",
                            parentId: "academics",
                        },
                    ]
                },
                {
                    id: "requests",
                    label: "Requests",
                    parentId: "academics",
                    link: "/#",
                    isChildItem: true,
                    stateVariables: isRequest,
                    click: function (e) {
                        e.preventDefault();
                        setIsRequest(!isRequest);
                    },
                    childItems: [
                        {
                            id: "change-stream-list",
                            label: "Change Stream",
                            link: "/change-stream",
                            parentId: "academics",
                        },
                        {
                            id: "change-curriculum-list",
                            label: "Change Curriculum",
                            link: "/change-curriculum",
                            parentId: "academics",
                        },
                        {
                            id: "change-campus-list",
                            label: "Change Campus",
                            link: "/change-campus",
                            parentId: "academics",
                        },
                        {
                            id: "campus-transfer-list",
                            label: "Campus Transfer Requests",
                            link: "/campus-transfer-requests",
                            parentId: "academics",
                        },
                    ]
                },
            ],
        },

        {
            id: "fee",
            label: "Fee",
            // icon: "las la-cog",
            iconImage: <BrchFeeSvg />,
            link: "/#",
            stateVariables: isFee,
            roleName: ["BRANCH_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIsFee(!isFee);
                setIscurrentState("Fee");
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "dashboard-list",
                    label: "Dashboard",
                    link: "/fee-dashboard",
                    parentId: "fee",
                },
                {
                    id: "student-fee-collections",
                    label: "Student Fee Collections",
                    link: "/#",
                    isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsStudentFeeCollection(!isStudentFeeCollection);
                    },
                    parentId: "fee",
                    stateVariables: isStudentFeeCollection,
                    childItems: [
                        {
                            id: "fee-payments-records-list",
                            label: "Fee Payments Records",
                            link: "/fee-payments-records",
                            parentId: "fee",
                        },
                        {
                            id: "fee-receipts-list",
                            label: "Fee Receipts",
                            link: "/fee-receipts",
                            parentId: "fee",
                        },
                        {
                            id: "student-ledger-list",
                            label: "Student Ledger",
                            link: "/student-ledger",
                            parentId: "fee",
                        },
                        {
                            id: "cheque-history",
                            label: "Cheque History",
                            link: "/cheque-history",
                            parentId: "fee",
                        }, {
                            id: "/challan",
                            label: "Challan",
                            link: "/challan",
                            parentId: "fee",
                        },
                        {
                            id: "fee-refunds-list",
                            label: "Fee Refunds",
                            link: "/fee-refunds",
                            parentId: "fee",
                        },
                    ]
                },
                {
                    id: "concessions",
                    label: "Concessions",
                    link: "/#",
                    isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsConcession(!isConcession);
                    },
                    parentId: "fee",
                    stateVariables: isConcession,
                    childItems: [
                        {
                            id: "student-concessions-list",
                            label: "Student Concessions",
                            link: "/student-concessions",
                            parentId: "fee",
                        },
                        {
                            id: "tution-fee-concessions-list",
                            label: "Tution Fee Concessions",
                            link: "/tution-fee-concessions",
                            parentId: "fee",
                        }, {
                            id: "employee-concession",
                            label: "Employee Concession",
                            link: "/employee-concession",
                            parentId: "fee",
                        },
                    ]
                },
                {
                    id: "approvals",
                    label: "Approvals",
                    link: "/#",
                    isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsApprovals(!isApprovals);
                    },
                    parentId: "fee",
                    stateVariables: isApprovals,
                    childItems: [
                        {
                            id: "it-form-approvals-list",
                            label: "IT Form Approvals",
                            link: "/it-form-approvals",
                            parentId: "fee",
                        }, {
                            id: "transfer-request-approvals-list",
                            label: "Transfer Request Approvals",
                            link: "/transfer-request-approvals",
                            parentId: "fee",
                        }, {
                            id: "/hostel-exit-approvals-list",
                            label: "Hostel Exit Approvals",
                            link: "/hostel-exit-approvals",
                            parentId: "fee",
                        },
                    ]
                },
                {
                    id: "settings",
                    label: "Settings",
                    link: "/#",
                    isChildItem: true,
                    click: function (e) {
                        e.preventDefault();
                        setIsFeeSettings(!isFeeSettings);
                    },
                    parentId: "fee",
                    stateVariables: isFeeSettings,
                    childItems: [
                        {
                            id: "fee-name-list",
                            label: "Fee Name",
                            link: "/fee-name",
                            parentId: "fee",
                        },
                        {
                            id: "fee-structure-list",
                            label: "Fee Structure",
                            link: "/fee-structure",
                            parentId: "fee",
                        },
                        {
                            id: "special-fee-list",
                            label: "Special Fee",
                            link: "/special-fee",
                            parentId: "fee",
                        },
                        {
                            id: "fines",
                            label: "Fines",
                            link: "/fines",
                            parentId: "fee",
                        },
                    ]
                }
            ],
        },
        {
            id: "institute-institutions",
            label: "Institutions",
            // icon: "bx bxs-bank",
            iconImage: <AdmnInstituteSvg />,
            link: "/institute-institution",
            roleName: ["INSTITUTE_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("Institutions");
            },
        },
        {
            id: "admin-institutions",
            label: "Institutions",
            // icon: "bx bxs-bank",
            iconImage: <AdmnInstituteSvg />,
            link: "/#",
            stateVariables: isInstitute,
            roleName: ["SUPER_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIsInstitute(!isInstitute);
                setIscurrentState("Institutions");
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "institute-list",
                    label: "Institute List",
                    link: "/institute-list",
                    parentId: "institutions",
                },
                {
                    id: "branch-list",
                    label: "Branch List",
                    link: "/branch-list",
                    parentId: "institutions",
                },
            ],
        },
        // {
        //   id: "academics",
        //   label: "Academics",
        //   icon: "bx bxs-bank",
        //   link: "/#",
        //   stateVariables: isAcademics,
        //   roleName: ["BRANCH_ADMIN"],
        //   click: function (e) {
        //     e.preventDefault();
        //     setIsAcademics(!isAcademics);
        //     setIscurrentState("Academics");
        //     updateIconSidebar(e);
        //   },
        //   subItems: [
        //     {
        //       id: "classroom-management",
        //       label: "Classroom Management",
        //       link: "/classroom-management",
        //       parentId: "academics",
        //     },
        //     {
        //       id: "subject-management",
        //       label: "Subject Management",
        //       link: "/subject-management",
        //       parentId: "academics",
        //     },
        //   ],
        // },
        {
            id: "billing_and_payments",
            label: "Billing & Payments",
            // icon: "las la-wallet",
            iconImage: <AdmnBillingPaymentSvg />,

            link: "/billing-payments",
            roleName: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("Billing & Payments");
            },
        },
        {
            id: "communication",
            label: "Communication",
            icon: "las la-headset",
            // iconImage: <HelpSvg />,

            link: "/communication",
            roleName: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("Communication");
            },
        },
        {
            id: "employees",
            label: "Employees",
            // icon: "las la-users",
            iconImage: <AdmnEmployeesSvg />,
            link: "/employees",
            roleName: ["SUPER_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("Employees");
            },
        },
        {
            id: "security",
            label: "Security",
            icon: "las la-shield-alt",
            // iconImage: <AdmnSecuritySvg />,
            link: "/security",
            roleName: ["SUPER_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("Security");
            },
        },
        {
            id: "reports",
            label: "Reports",
            // icon: "bx bxs-report",
            iconImage: <ReportsSvg />,
            link: "/reports",
            roleName: ["INSTITUTE_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("Reports");
            },
        },
        {
            id: "helpdesk",
            label: "Helpdesk",
            icon: "las la-question-circle",
            // iconImage: <HelpSvg />,
            link: "/helpdesk",
            roleName: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("Helpdesk");
            },
        },
        {
            id: "master_setup",
            label: "Master Setup",
            icon: "las la-cog",
            // iconImage: <SettingSvg />,
            link: "/master-setup",
            roleName: ["INSTITUTE_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("Master Setup");
            },
        },
        {
            id: "front-desk",
            label: "Front Desk",
            // icon: "las la-cog",
            iconImage: <BrchFrontDeskSvg />,
            link: "/front-desk",
            roleName: ["BRANCH_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("Front Desk");
            },
        },
        {
            id: "directory",
            label: "Directory",
            // icon: "las la-cog",
            iconImage: <BrchDirectorySvg />,
            link: "/#",
            stateVariables: isDirectory,
            roleName: ["BRANCH_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIsDirectory(!isDirectory);
                setIscurrentState("Directory");
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "student-management",
                    label: "Student Management",
                    link: "/student-management",
                    parentId: "directory",
                },
                {
                    id: "parent-management",
                    label: "Parent Management",
                    link: "/parent-management",
                    parentId: "directory",
                },
                {
                    id: "employee-management",
                    label: "Employee Management",
                    link: "/employee-management",
                    parentId: "directory",
                }
            ],
        },
        {
            id: "userManagement",
            label: "User Management",
            iconImage: <BrchUserMangmntSvg />,
            link: "/#",
            stateVariables: isUserManagement,
            roleName: ["BRANCH_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIsUserManagement(!isUserManagement);
                setIscurrentState("userManagement");
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "user-management-list",
                    label: "Manage Users",
                    link: "/manage-user",
                    parentId: "userManagement",
                },
                // {
                //   id: "module-permissions",
                //   label: "Module Permission",
                //   link: "/module-permission",
                //   parentId: "userManagement",
                // },
                {
                    id: "role-types",
                    label: "Role Types",
                    link: "/role-types",
                    parentId: "userManagement",
                },
            ],
        },
        {
            id: "transportation",
            label: "Transportation",
            icon: "las la-bus",
            iconImage: <BrchTransportationSvg />,
            link: "/#",
            stateVariables: isTransportation,
            roleName: ["BRANCH_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIsTransportation(!isTransportation);
                setIscurrentState("Transportation");
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "transportation-dashboard",
                    label: "Dashboard",
                    link: "/transportation-dashboard",
                    parentId: "transportation",
                },
                {
                    id: "settings",
                    label: "Settings",
                    link: "/transportation-settings",
                    parentId: "transportation",
                },
                {
                    id: "live-tracking",
                    label: "Live Tracking",
                    link: "/live-tracking",
                    parentId: "transportation",
                },
                {
                    id: "transport-concession",
                    label: "Transport Concession",
                    link: "/transport-concession",
                    parentId: "transportation",
                },
                {
                    id: "transportation-records",
                    label: "Transportation Records",
                    link: "/transportation-records",
                    parentId: "transportation",
                },
            ],
        },
        // {
        //   id: "fee-management",
        //   label: "Fee Management",
        //   // icon: "las la-cog",
        //   iconImage: <BrchFeeSvg />,
        //   link: "/fee-management",
        //   roleName: ["BRANCH_ADMIN"],
        //   click: function (e) {
        //     e.preventDefault();
        //     setIscurrentState("Fee Management");
        //   },
        // },
        {
            id: "examination",
            label: "Examination",
            // icon: "las la-cog",
            iconImage: <BrchExaminationSvg />,
            link: "/examination",
            roleName: ["BRANCH_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("Examination");
            },
        },
        {
            id: "student-dashboard",
            label: "Student Dashboard",
            // icon: "las la-cog",
            iconImage: <DashboardSvg />,
            link: "/student-dashboard",
            roleName: ["STUDENT_ROLE"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("StudentDashboard");
            },
        },
        {
            id: "parent-dashboard",
            label: "Parent Dashboard",
            // icon: "las la-cog",
            iconImage: <DashboardSvg />,
            link: "/parent-dashboard",
            roleName: ["PARENT_ROLE"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("ParentDashboard");
            },
        },
        {
            id: "hrms",
            label: "HRMS",
            // icon: "las la-cog",
            iconImage: <BrchHrmsSvg />,
            link: "/hrms",
            roleName: ["BRANCH_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("HRMS");
            },
        },
        {
            id: "branch-settings",
            label: "Settings",
            icon: "las la-cog",
            // iconImage: <BrchHrmsSvg />,
            link: "/branch-settings",
            roleName: ["BRANCH_ADMIN"],
            click: function (e) {
                e.preventDefault();
                setIscurrentState("BRANCH-SETTINGS");
            },
        },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;


export const menuOptions = [
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
        id: "academics",
        menuName: "Academics",
        iconImage: <BrchAcademicSvg />,
        link: "/#",
        allowedRoles: ["BRANCH_ADMIN"],
        permissions: [""],
        hasChildMenu: true,
        childMenu: [
            {
                id: "classroom-managment-list",
                menuName: "Classroom Managment",
                parentId: "academics",
                link: "/#",
                permissions: [""],
                isChildItem: true,
                childMenu: [
                    {
                        id: "section-management-list",
                        menuName: "Section Managment",
                        link: "/academics",
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
                childMenu: [
                    {
                        id: "class-subject-list",
                        menuName: "Class Subjects",
                        link: "/class-subject",
                        parentId: "academics",
                        permissions: [""],
                    },
                    {
                        id: "subject-teacher-list",
                        menuName: "Subject Teacher",
                        link: "/subject-teacher",
                        parentId: "academics",
                        permissions: [""],
                    }
                ]
            },
            {
                id: "certificates-list",
                menuName: "Certificates",
                parentId: "academics",
                link: "/#",
                permissions: [""],
                hasChildMenu: true,
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
                id: "detentions-promotions",
                menuName: "Detentions & Promotions",
                parentId: "academics",
                link: "/#",
                permissions: [""],
                hasChildMenu: true,
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
                id: "requests",
                menuName: "Requests",
                parentId: "academics",
                link: "/#",
                permissions: [""],
                hasChildMenu: true,
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
                ]
            },
        ],
    },

    {
        id: "fee",
        menuName: "Fee",
        // icon: "las la-cog",
        iconImage: <BrchFeeSvg />,
        allowedRoles: ["BRANCH_ADMIN"],
        permissions: [""],
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
                id: "student-fee-collections",
                menuName: "Student Fee Collections",
                link: "/#",
                parentId: "fee",
                permissions: [""],
                hasChildMenu: true,
                childMenu: [
                    {
                        id: "fee-payments-records-list",
                        menuName: "Fee Payments Records",
                        link: "/fee-payments-records",
                        parentId: "fee",
                        permissions: [""],
                    },
                    {
                        id: "fee-receipts-list",
                        menuName: "Fee Receipts",
                        link: "/fee-receipts",
                        parentId: "fee",
                        permissions: [""],
                    },
                    {
                        id: "student-ledger-list",
                        menuName: "Student Ledger",
                        link: "/student-ledger",
                        parentId: "fee",
                        permissions: [""],
                    },
                    {
                        id: "cheque-history",
                        menuName: "Cheque History",
                        link: "/cheque-history",
                        parentId: "fee",
                        permissions: [""],
                    }, {
                        id: "/challan",
                        menuName: "Challan",
                        link: "/challan",
                        parentId: "fee",
                        permissions: [""],
                    },
                    {
                        id: "fee-refunds-list",
                        menuName: "Fee Refunds",
                        link: "/fee-refunds",
                        parentId: "fee",
                        permissions: [""],
                    },
                ]
            },
            {
                id: "concessions",
                menuName: "Concessions",
                link: "/#",
                parentId: "fee",
                permissions: [""],
                hasChildMenu: true,
                childMenu: [
                    {
                        id: "student-concessions-list",
                        menuName: "Student Concessions",
                        link: "/student-concessions",
                        parentId: "fee",
                        permissions: [""],
                    },
                    {
                        id: "tution-fee-concessions-list",
                        menuName: "Tution Fee Concessions",
                        link: "/tution-fee-concessions",
                        parentId: "fee",
                        permissions: [""],
                    }, {
                        id: "employee-concession",
                        menuName: "Employee Concession",
                        link: "/employee-concession",
                        parentId: "fee",
                        permissions: [""],
                    },
                ]
            },
            {
                id: "approvals",
                menuName: "Approvals",
                link: "/#",
                parentId: "fee",
                permissions: [""],
                hasChildMenu: true,
                childMenu: [
                    {
                        id: "it-form-approvals-list",
                        menuName: "IT Form Approvals",
                        link: "/it-form-approvals",
                        parentId: "fee",
                        permissions: [""],
                    }, {
                        id: "transfer-request-approvals-list",
                        menuName: "Transfer Request Approvals",
                        link: "/transfer-request-approvals",
                        parentId: "fee",
                        permissions: [""],
                    }, {
                        id: "/hostel-exit-approvals-list",
                        menuName: "Hostel Exit Approvals",
                        link: "/hostel-exit-approvals",
                        parentId: "fee",
                        permissions: [""],
                    },
                ]
            },
            {
                id: "settings",
                menuName: "Settings",
                link: "/#",
                parentId: "fee",
                permissions: [""],
                hasChildMenu: true,
                childMenu: [
                    {
                        id: "fee-name-list",
                        menuName: "Fee Name",
                        link: "/fee-name",
                        parentId: "fee",
                        permissions: [""],
                    },
                    {
                        id: "fee-structure-list",
                        menuName: "Fee Structure",
                        link: "/fee-structure",
                        parentId: "fee",
                        permissions: [""],
                    },
                    {
                        id: "special-fee-list",
                        menuName: "Special Fee",
                        link: "/special-fee",
                        parentId: "fee",
                        permissions: [""],
                    },
                    {
                        id: "fines",
                        menuName: "Fines",
                        link: "/fines",
                        parentId: "fee",
                        permissions: [""],
                    },
                ]
            }
        ],
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
        icon: "las la-headset",
        // iconImage: <HelpSvg />,

        link: "/communication",
        allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
        permissions: [""],
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
        icon: "las la-shield-alt",
        // iconImage: <AdmnSecuritySvg />,
        link: "/security",
        allowedRoles: ["SUPER_ADMIN"],
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
        id: "helpdesk",
        menuName: "Helpdesk",
        icon: "las la-question-circle",
        // iconImage: <HelpSvg />,
        link: "/helpdesk",
        allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
        permissions: [""],
    },
    {
        id: "master_setup",
        menuName: "Master Setup",
        icon: "las la-cog",
        // iconImage: <SettingSvg />,
        link: "/master-setup",
        allowedRoles: ["INSTITUTE_ADMIN"],
        permissions: [""],
    },
    {
        id: "front-desk",
        menuName: "Front Desk",
        // icon: "las la-cog",
        iconImage: <BrchFrontDeskSvg />,
        link: "/front-desk",
        allowedRoles: ["BRANCH_ADMIN"],
        permissions: [""],
    },
    {
        id: "directory",
        menuName: "Directory",
        // icon: "las la-cog",
        iconImage: <BrchDirectorySvg />,
        link: "/#",
        allowedRoles: ["BRANCH_ADMIN"],
        permissions: [""],
        hasChildMenu: true,
        childMenu: [
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
                id: "employee-management",
                menuName: "Employee Management",
                link: "/employee-management",
                parentId: "directory",
                permissions: [""],
            }
        ],
    },
    {
        id: "userManagement",
        menuName: "User Management",
        iconImage: <BrchUserMangmntSvg />,
        link: "/#",
        allowedRoles: ["BRANCH_ADMIN"],
        permissions: [""],
        hasChildMenu: true,
        childMenu: [
            {
                id: "user-management-list",
                menuName: "Manage Users",
                link: "/manage-user",
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
        ],
    },
    {
        id: "transportation",
        menuName: "Transportation",
        iconImage: <BrchTransportationSvg />,
        link: "/#",
        allowedRoles: ["BRANCH_ADMIN"],
        permissions: [""],
        hasChildMenu: true,
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
            {
                id: "live-tracking",
                menuName: "Live Tracking",
                link: "/live-tracking",
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
        ],
    },
    {
        id: "examination",
        menuName: "Examination",
        iconImage: <BrchExaminationSvg />,
        link: "/examination",
        allowedRoles: ["BRANCH_ADMIN"],
        permissions: [""],
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
        id: "parent-dashboard",
        menuName: "Parent Dashboard",
        iconImage: <DashboardSvg />,
        link: "/parent-dashboard",
        allowedRoles: ["PARENT_ROLE"],
        permissions: [""],
    },
    {
        id: "hrms",
        menuName: "HRMS",
        iconImage: <BrchHrmsSvg />,
        link: "/hrms",
        allowedRoles: ["BRANCH_ADMIN"],
        permissions: [""],
    },
    {
        id: "branch-settings",
        menuName: "Settings",
        icon: "las la-cog",
        link: "/branch-settings",
        allowedRoles: ["BRANCH_ADMIN"],
        permissions: [""],
    },
];

// export const menuOptions = [
//   {
//     id: "institute-dashboard",
//     menuName: "Dashboard",
//     iconImage: <DashboardSvg />,
//     link: "/dashboard",
//     allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
//     permissions: [""],
//   },
//   {
//     id: "directory",
//     menuName: "Directory",
//     iconImage: <DashboardSvg />,
//     link: "/#",
//     allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
//     permissions: [""],
//     childMenu: [
//       {
//         id: "student-management",
//         menuName: "Student Management",
//         link: "/student-management",
//         allowedRoles: ["BRANCH_ADMIN"],
//         permissions: [""],
//       }
//     ]
//   },
//   {
//     id: "academics",
//     menuName: "Academics",
//     iconImage: <BrchAcademicSvg />,
//     link: "/#",
//     allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
//     permissions: [""],
//     childMenu: [
//       {
//         id: "classroom-managment-list",
//         menuName: "Classroom Managment",
//         link: "/#",
//         allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
//         permissions: [""],
//         childMenu: [
//           {
//             id: "section-managment-list",
//             menuName: "Section Managment",
//             link: "/academics",
//             allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
//             permissions: [""],
//           },
//           {
//             id: "assign-group-list",
//             menuName: "Assign Group",
//             link: "/assign-group",
//             allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
//             permissions: [""],
//           },
//         ]
//       },
//       {
//         id: "classroom-managment-list-1",
//         menuName: "Classroom Managment 1",
//         link: "/#",
//         allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
//         permissions: [""],
//         childMenu: [
//           {
//             id: "section-managment-list-1",
//             menuName: "Section Managment 1",
//             link: "/academics",
//             allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
//             permissions: [""],
//           },
//           {
//             id: "assign-group-list-1",
//             menuName: "Assign Group 1",
//             link: "/assign-group",
//             allowedRoles: ["INSTITUTE_ADMIN", "SUPER_ADMIN"],
//             permissions: [""],
//           },
//         ]
//       },
//     ],
//   },

// ]
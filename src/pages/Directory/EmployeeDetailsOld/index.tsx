
import React, { useState } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import StudentImage from "../../../assets/imagesdps/directory/student_image.png";

import QuizBadge from "../../../assets/imagesdps/directory/quiz_badge.png";
import SportsBadge from "../../../assets/imagesdps/directory/sports_badge.png";

import { Tabs } from "../../../Components/Common";
import { tabsOptions } from "./helper";
//Assets

import StudentInfo from "./StudentInfo";

export default function StudentDetails() {
    const [activeTabId, setActiveTabId] = useState<string | null>("overview");

    function tabChangeHndlr(tabId: string) {
        setActiveTabId(tabId);
    }
    const [customActiveTab, setcustomActiveTab] = useState("1");
    const toggleCustom = (tab: any) => {
        if (customActiveTab !== tab) {
            setcustomActiveTab(tab);
        }
    };
    return (
        <div className="page-content student-detail-container">
            <div className="container-fluid">
                <BreadCrumb title="Student Details" pageTitle="Directory" />
                <div className="tw-grid tw-grid-cols-12">
                    <div className="tw-col-span-12">
                        <div className="tw-bg-white tw-shadow tw-rounded-lg tw-mb-3">
                            <div className="tw-p-0">
                                <div
                                    className="tw-px-4 tw-flex tw-items-center tw-rounded-t-lg"
                                    style={{ backgroundColor: "#405367" }}
                                >
                                    <div className="tw-relative tw-flex tw-items-center tw-top-[14px]">
                                        <div className="tw-flex tw-items-center">
                                            <div className="tw-w-16 tw-h-16 tw-bg-white tw-flex-shrink-0 tw-rounded-full tw-p-1 tw-mr-2 tw-shadow">
                                                <img
                                                    src={StudentImage}
                                                    className="tw-w-full tw-h-full tw-object-cover tw-rounded-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="tw-flex tw-flex-col tw-text-white">
                                            <h5 className="tw-text-white tw-mb-0 tw-font-normal">
                                                Shanmukha Chandra Aelugani
                                            </h5>
                                            <span>
                                                <span className="tw-mr-1">Admission Number:</span>
                                                <span>DPS202101</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="tw-flex tw-bg-white tw-rounded-b-lg tw-px-4 tw-py-3">
                                    <div className="tw-flex tw-flex-wrap tw-flex-grow tw-mr-2">

                                        <span className="tw-flex tw-items-center tw-mr-4">
                                            <span className="tw-text-base tw-mr-1 tw-font-bold">Role:</span>
                                            <span>Student</span>
                                        </span>

                                        <span className="tw-flex tw-items-center tw-mr-4">
                                            <span className="tw-text-base tw-mr-1 tw-font-bold">Class:</span>
                                            <span>VI</span>
                                        </span>

                                        <span className="tw-flex tw-items-center tw-mr-4">
                                            <span className="tw-text-base tw-mr-1 tw-font-bold tw-whitespace-nowrap">
                                                Roll Number:
                                            </span>
                                            <span>VI</span>
                                        </span>

                                        <span className="tw-flex tw-items-center tw-mr-4">
                                            <span className="tw-text-base tw-mr-1 tw-font-bold tw-whitespace-nowrap">
                                                Date Of Birth:
                                            </span>
                                            <span className="tw-whitespace-nowrap">22 Oct 2015</span>
                                        </span>
                                    </div>

                                    <div className="tw-flex tw-justify-end tw-flex-shrink-0">
                                        <img className="tw-h-10 tw-w-auto tw-mr-3" src={QuizBadge} />
                                        <img className="tw-h-10 tw-w-auto" src={SportsBadge} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tw-grid tw-grid-cols-12">
                    <div className="tw-col-span-12">
                        <Tabs
                            activeTabId={activeTabId}
                            tabChangeHndlr={tabChangeHndlr}
                            tabsList={tabsOptions}
                            navContainerClass="nav-tabs tw-mb-2"
                        />
                    </div>
                </div>
                <StudentInfo />
            </div>
        </div>
    )
}

// export default function StudentDetails() {
    // const [customActiveTab, setcustomActiveTab] = useState("1");
    // const toggleCustom = (tab:any) => {
    //     if (customActiveTab !== tab) {
    //         setcustomActiveTab(tab);
    //     }
    // };
//     return (
//         <div className="page-content student-detail-container">
//             <div className="container-fluid">
//                 <BreadCrumb title="Student Details" pageTitle="Directory" />
//                 <div className="row">
//                     <div className="col-12">
//                         <div className="card">
//                             <div className="card-body p-0">
//                                 <div className="px-4 d-flex align-items-center rounded-top" style={{ backgroundColor: "#405367" }}>
//                                     <div style={{ top: "14px" }} className="position-relative d-flex align-items-center">
//                                         <div className="d-flex align-items-center">
//                                             <div
//                                                 className="avatar-md bg-white flex-shrink-0 avatar-shadow rounded-circle p-1 me-2">
//                                                 <img
//                                                     src={StudentImage}
//                                                     className="img-fluid d-block rounded-circle"
//                                                 />
//                                             </div>
//                                         </div>
//                                         <div className="d-flex flex-column text-white">
//                                             <h5 className="text-white mb-0 fw-normal">Shanmukha Chandra Aelugani</h5>
//                                             <span>
//                                                 <span className="me-1">Admission Number:</span>
//                                                 <span>DPS202101</span>
//                                             </span>
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="d-flex bg-white rounded-bottom px-4 py-3">
//                                     <div className="d-flex flex-wrap flex-grow-1 me-2">
//                                         <span className="d-flex align-items-center me-4">
//                                             <span className="fs-15 me-1 fw-bold">Role:</span>
//                                             <span>Student</span>
//                                         </span>
//                                         <span className="d-flex align-items-center me-4">
//                                             <span className="fs-15 me-1 fw-bold">Class:</span>
//                                             <span>VI</span>
//                                         </span>
//                                         <span className="d-flex align-items-center me-4">
//                                             <span className="fs-15 me-1 fw-bold text-nowrap">Roll Number:</span>
//                                             <span>VI</span>
//                                         </span>
//                                         <span className="d-flex align-items-center me-4">
//                                             <span className="fs-15 me-1 fw-bold text-nowrap">Date Of Birth:</span>
//                                             <span className="text-nowrap">22 Oct 2015</span>
//                                         </span>
//                                     </div>
//                                     <div className="d-flex justify-content-end flex-shrink-0">
//                                         <img className="img-fluid me-3 badge-img" src={QuizBadge} />
//                                         <img className="img-fluid badge-img" src={SportsBadge} />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="row">
//                     <div className="col-12">
                        // <Nav tabs className="nav nav-tabs nav-tabs-custom nav-success nav-justified mb-3">
                        //     <NavItem>
                        //         <NavLink
                        //             style={{ cursor: "pointer" }}
                        //             className={classnames({
                        //                 active: customActiveTab === "1",
                        //             })}
                        //             onClick={() => {
                        //                 toggleCustom("1");
                        //             }}
                        //         >
                        //             Home
                        //         </NavLink>
                        //     </NavItem>
                        //     <NavItem>
                        //         <NavLink
                        //             style={{ cursor: "pointer" }}
                        //             className={classnames({
                        //                 active: customActiveTab === "2",
                        //             })}
                        //             onClick={() => {
                        //                 toggleCustom("2");
                        //             }}
                        //         >
                        //             Profile
                        //         </NavLink>
                        //     </NavItem>
                        //     <NavItem>
                        //         <NavLink
                        //             style={{ cursor: "pointer" }}
                        //             className={classnames({
                        //                 active: customActiveTab === "3",
                        //             })}
                        //             onClick={() => {
                        //                 toggleCustom("3");
                        //             }}
                        //         >
                        //             Messages
                        //         </NavLink>
                        //     </NavItem>
                        //     <NavItem>
                        //         <NavLink
                        //             style={{ cursor: "pointer" }}
                        //             className={classnames({
                        //                 active: customActiveTab === "4",
                        //             })}
                        //             onClick={() => {
                        //                 toggleCustom("4");
                        //             }}
                        //         >
                        //             Settings
                        //         </NavLink>
                        //     </NavItem>
                        // </Nav>

//                     </div>
//                 </div>
//                 <StudentInfo />
//             </div>
//         </div>
//     )
// }
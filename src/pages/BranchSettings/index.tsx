import React, { useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Card, CardBody, Col, Container, Input, Label, Row, Button, CardHeader } from "reactstrap";
import classnames from "classnames";
import { useSelector, shallowEqual } from "react-redux";
//Custom Hooks
import { useAppDispatch, useAppSelector } from "../../hooks/storehook";

//Common Component
import BreadCrumb from "../../Components/Common/BreadCrumb";

//Component
import BranchProfile from "./BranchProfile";
import BranchArea from "./BranchArea";
import AcademicTerms from "./AcademicTerms";
import Academics from "./Academics";
import ClassWiseAcademicYear from "./ClassWiseAcademicYear";

//Images
import DPSLogoSM from "../../assets/imagesdps/mastersetup/dps_logo.png";
import PGSLogoSM from "../../assets/imagesdps/mastersetup/pgs-logo.png";


//Helpers
import { MenuOptions } from "./helper";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlayCircleIcon } from "@hugeicons-pro/core-stroke-standard";
import BranchLogo from "./BranchLogo";
import ApprovalConfiguration from "./ApprovalConfiguration";



function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
        case "branch-profile":
            return BranchProfile;
        case "branch-area":
            return BranchArea;
        case "branch-logo":
            return BranchLogo;
        // case "departments":
        //     return Department;
        // case "academic-years":
        //     return AcademicYear;
        case "academic-terms":
            return AcademicTerms;
        case "academics":
            return Academics;
        case "class-wise-academic-year":
            return ClassWiseAcademicYear;
        case "approval-configuration":
            return ApprovalConfiguration;
    }
}

const BranchSettings = () => {
    const [activeMenuId, setActiveMenuId] = useState<string | null>("branch-profile");
    const location :any = useLocation();
    const branchId = location?.state?.branchId

    const { currentInstIdResp, branchbyIdResp, currentBranchIdResp, instituteValue } = useAppSelector(({ Layout, branch, appData }) => ({
        branchbyIdResp: branch.branchbyIdResp,
        instituteValue: Layout.instituteValue,
        currentInstIdResp: appData.currentInstIdResp,
        currentBranchIdResp: appData.currentBranchIdResp
    }), shallowEqual);

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
        setActiveMenuId(menuId);
    }

    const activeComponent = useMemo(() => {
        const TabComponent: any = getActiveMenuComponent(activeMenuId);
        return <TabComponent instituteId={currentInstIdResp}
            instituteName={instituteValue} branchId={branchId || currentBranchIdResp} />
    }, [activeMenuId, currentInstIdResp, currentBranchIdResp, instituteValue, branchId, getActiveMenuComponent]);

    return (
        <React.Fragment>
            <div className="page-content master-setup-wrapper">
                <div className="tw-w-full tw-px-4 tw-mx-auto">
                    <BreadCrumb pageTitle="Master Setup" title="Branch Settings" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-mb-4">
                        <div className="tw-py-2 tw-px-4">
                            <div className="tw-flex tw-justify-between tw-items-center tw-px-2">

                                <div className="tw-flex tw-items-center">
                                    <div className="tw-w-16 tw-h-16 tw-flex-shrink-0 tw-bg-gray-100 tw-rounded-full tw-p-1 tw-mr-3">
                                        <img
                                            src={branchbyIdResp?.logo || DPSLogoSM}
                                            className="tw-w-full tw-h-full tw-object-cover tw-rounded-full"
                                            alt="Branch Logo"
                                        />
                                    </div>

                                    <div className="tw-flex tw-flex-col">
                                        <h5 className="tw-mb-0 tw-text-lg tw-font-semibold">
                                            {branchbyIdResp?.branchName || "Branch Name"}
                                        </h5>
                                        <span className="tw-text-blue-600">
                                            {branchbyIdResp?.shortName || "Branch Code"}
                                        </span>
                                    </div>
                                </div>

                                <a
                                    href="#"
                                    className="tw-flex tw-items-center tw-text-cyan-600 hover:tw-underline"
                                >
                                    <span className="tw-font-medium tw-mr-1">
                                        Help Video
                                    </span>
                                    <HugeiconsIcon
                                        icon={PlayCircleIcon}
                                        className="tw-ml-1 tw-text-cyan-600"
                                        size={20}
                                    />
                                </a>

                            </div>
                        </div>
                    </div>

                    <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-4 tw-mt-8">

                        <div className="lg:tw-col-span-4 xl:tw-col-span-3">
                            <div className="tw-bg-white tw-rounded-lg tw-shadow-sm">
                                <div className="tw-p-0">
                                    <ul className="tw-list-none tw-p-0 tw-m-0">
                                        {MenuOptions.map((item) => (
                                            <li
                                                data-id={item.id}
                                                onClick={clickMenuHandler}
                                                key={item.id}
                                                className={`
                                                    tw-text-[14px]
                                                    tw-px-4 
                                                    tw-py-2 
                                                    tw-cursor-pointer 
                                                    tw-border-b 
                                                    tw-border-gray-100
                                                    ${item.id === activeMenuId
                                                        ? "tw-bg-[#4051891a] tw-text-[#405189] tw-font-medium"
                                                        : "hover:tw-bg-gray-50"}
                                                `}
                                            >
                                                {item.labelName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="lg:tw-col-span-8 xl:tw-col-span-9">
                            {activeComponent}
                        </div>

                    </div>
                </div>
            </div>
        </React.Fragment>)
}

export default BranchSettings;
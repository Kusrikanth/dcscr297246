import React from "react";
import { Link } from "react-router-dom";
import StudentImage from "../../../../assets/imagesdps/student-default-img.png";
import { Row, Col, Card, CardBody, CardHeader, UncontrolledDropdown, DropdownToggle, DropdownItem, DropdownMenu, Input, Label } from "reactstrap";

import { default as Message } from "../../../../assets/imagesdps/attendence/Message.svg?react";
import { default as WhatsApp } from "../../../../assets/imagesdps/attendence/WhastApp.svg?react";
import DPSLogo from "../../../../assets/imagesdps/mastersetup/dps_logo.png";

//Common Utility

import { MoreActions } from "../../../../Components/Common/MenuOptions";
import Pagination from "../../../../Components/Common/Pagination";
import { StatusLabel } from "../../../../Components/Common";
import classNames from "classnames";
import { ColorList, ParentGuardianList } from "./helper";
import { IOptionsHrtl } from "./ParentGuardianTypes";
import NoDataComp from "../../../../Components/Common/NoDataComp";
//Types & Interface


interface IBranchCardProps {
    branchDetails: any,
    updateMainBranchHndlr: any,
    menuOptions: any
}

export const ParentGuardianCard: React.FC<any> = ({ branchDetails, updateMainBranchHndlr, ParentGuardianData, menuOptions,index }: any) => {

    function generateRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';

        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }

        return color;
    }

    const editBranchHndlr = () => { }

    return (
        <div className="tw-col-span-12 md:tw-col-span-4 tw-gap-4">
            <div className="tw-bg-white tw-rounded-lg tw-shadow parent-box">
                <div
                    className="parent-cover tw-h-32 tw-rounded-t-lg"
                    style={{ background: `${ColorList[index]?.color}` }}
                >
                    
                </div>

                <div className="tw-p-4">
                    <div className="tw-flex tw-flex-wrap tw-items-center team-row">

                        {/* Settings / Actions */}
                        <div className="tw-w-full tw-flex tw-justify-end team-settings tw-mb-3">
                            <MoreActions
                                actionOptions={menuOptions}
                                rowId={"1"}
                                menuIconClassName="text-white"
                            />
                        </div>

                        {/* Profile Image + Name */}
                        <div className="tw-w-full tw-md:tw-w-1/3 parent-profile-img tw-flex tw-items-center tw-gap-3">
                            <div className="tw-bg-white tw-rounded-full tw-p-1 tw-shadow flex-shrink-0 tw-w-20 tw-h-20 " style={{zIndex: 1}}>
                                <img
                                    src={
                                        ParentGuardianData?.imageBase64
                                            ? `data:image/jpeg;base64, ${ParentGuardianData?.imageBase64}`
                                            : StudentImage
                                    }
                                    alt="parent-logo"
                                    className="tw-w-full tw-h-full tw-rounded-full tw-object-cover"
                                />
                            </div>

                            <div className="parent-content">
                                <a href="#" onClick={() => { }}>
                                    <h5 className="tw-text-base tw-font-semibold tw-mb-1">
                                        {ParentGuardianData?.name || "-"}
                                    </h5>
                                </a>
                                <p className="tw-text-gray-500 tw-mb-0">
                                    {ParentGuardianData?.relationType || "-"}
                                </p>
                            </div>
                        </div>

                        {/* Message + WhatsApp */}
                        <div className="tw-w-full tw-md:tw-w-1/6 tw-flex tw-items-center tw-justify-center tw-mb-3 tw-gap-3">
                            <Message />
                            <div className="tw-rounded tw-px-2 tw-py-1" style={{ background: "rgba(10,179,156,0.18)" }}>
                                <WhatsApp />
                            </div>
                        </div>

                        {/* Mobile */}
                        <div className="tw-w-full tw-md:tw-w-1/3 tw-flex tw-items-center tw-gap-2 tw-mt-2">
                            <div className="tw-text-gray-500">Mobile</div>
                            <div className="tw-font-bold tw-text-gray-700">{ParentGuardianData?.contactNo}</div>
                        </div>

                        {/* Email */}
                        <div className="tw-w-full tw-flex tw-items-center tw-gap-2 tw-mt-2">
                            <div className="tw-text-gray-500">Email</div>
                            <div className="tw-font-bold tw-text-gray-700">{ParentGuardianData?.emailId}</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
};

export interface IBranchesCardContainer {
    branchesList?: any,
    updateMainBranchHndlr?: any,
    menuOptions?: IOptionsHrtl[],
    callbackPaginationHndlr?: any,
    totalPages?: number,
    totalRecords?: number,
    currentPageNumber?: number,
    assignAdminHndlr?: any;
}

const ParentGuardianContainer: React.FC<IBranchesCardContainer> = ({ menuOptions,branchesList }) => {

    return (
        <React.Fragment>
            <div className="tw-grid tw-grid-cols-12 parent-branches-card-list grid-view-filter tw-pb-4 tw-pt-1 tw-mb-2 gap-4">
                {(Array.isArray(branchesList) && branchesList?.length > 0) ?  branchesList.map((item: any, index: any) => (
                    <ParentGuardianCard
                        key={index}
                        index={index}
                        // updateMainBranchHndlr={updateMainBranchHndlr}
                        menuOptions={menuOptions}
                        ParentGuardianData={item}
                    />
                )) : <NoDataComp />}
            </div>
            {/* <Pagination
                paginationContainerClass="mb-4"
                callbackPaginationHndlr={paginationProps.callbackPaginationHndlr}
                totalPages={paginationProps.totalPages}
                totalRecords={paginationProps.totalRecords || 0}
                currentPageNumber={paginationProps.currentPageNumber}
            /> */}
        </React.Fragment>
    )
}



export default ParentGuardianContainer;
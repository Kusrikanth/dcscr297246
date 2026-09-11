import React from "react";
import { Link } from "react-router-dom";
import { StatusLabel, MoreActions } from "../../../Components/Common";
import Pagination from "../../../Components/Common/Pagination";

import DPSLogo from "../../../assets/imagesdps/mastersetup/dps_logo.png";

import classnames from "classnames";
//Common Utility
//Types & Interface
import { IOptionsHrtl } from "../../../Components/Common/MenuOptions";

interface IBranchCardProps {
    branchDetails: any,
    updateMainBranchHndlr: any,
    menuOptions: IOptionsHrtl[]
}

export const BranchCard: React.FC<any> = ({ branchDetails, updateMainBranchHndlr, menuOptions }: any) => {
    return (
        <div className="tw-col-span-1">
            <div className="tw-bg-white tw-shadow tw-rounded-lg  team-box">
                <div className="team-cover">
                    {/* <img src={""} alt="" className="img-fluid" /> */}
                </div>
                <div className="tw-p-4 ">
                    <div className="tw-flex tw-flex-wrap tw-items-center tw-flex-col team-row">
                        <div className="team-settings tw-flex-1 tw-w-full">
                            <div className="tw-flex tw-justify-between tw-flex-row">
                                <div className="tw-w-full">
                                    <button
                                        type="button"
                                        data-id={branchDetails.branchId}
                                        onClick={updateMainBranchHndlr}
                                        className={classnames("btn nav-btn main-branch-btn tw-p-0 tw-me-2", {
                                            "active": branchDetails.isMainBranch
                                        })}
                                    >
                                        <i className="fs-18 ri-star-fill"></i>
                                    </button>

                                </div>
                                <div className="tw-text-end tw-w-full">
                                    <MoreActions actionOptions={menuOptions} rowId={branchDetails.branchId}
                                        menuIconClassName="text-white" />
                                </div>
                                {/* <UncontrolledDropdown direction='start' className="col text-end">
                                    <DropdownToggle tag="a" id="dropdownMenuLink2" role="button">
                                        <i className="ri-more-fill fs-17"></i>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem><i className="ri-pencil-fill me-2 align-middle" />Edit</DropdownItem>
                                        <DropdownItem><i className="ri-delete-bin-5-fill me-2 align-middle" />Delete</DropdownItem>
                                        <DropdownItem onClick={() => { }}><i className="ri-settings-5-fill me-2 align-middle" />Configuration</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown> */}
                            </div>
                        </div>
                        <div className="tw-w-full ">
                            <div className="team-profile-img">
                                <div className="avatar-lg avatar-shadow tw-p-1 tw-bg-white tw-rounded-full tw-flex-shrink-0 tw-z-10">
                                    <img src={branchDetails.logo || DPSLogo} alt="branch-logo" className="img-fluid !tw-h-full tw-block tw-rounded-full" />

                                    {/* {branchDetails?.logo ?
                                        <img src={branchDetails.logo} alt="branch-logo" className="img-fluid h-100 d-block rounded-circle" /> :
                                        <div className={"avatar-title rounded-circle bg-soft-info text-success"}>
                                            {getUserImgIcon(branchDetails.branchName)}
                                        </div>
                                    } */}
                                </div>
                                <div className="team-content">
                                    <Link to="#" onClick={() => { }}>
                                        <h5 className="tw-text-base tw-mb-1">{branchDetails.branchName}</h5></Link>
                                    <p className="tw-text-gray-300 tw-mb-0">{branchDetails.shortName}</p>
                                </div>
                            </div>
                        </div>
                        <div className="tw-w-full  tw-flex tw-justify-center">
                            <StatusLabel type={branchDetails.status} labelName={branchDetails.status} />
                        </div>
                        <div  className="tw-w-full ">
                            <div className="tw-text-end">
                                <Link to={`/master-setup/branch-setting/${branchDetails.branchId}`} className="btn btn-light view-btn">View Profile</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export interface IBranchesCardContainer {
    branchesList: any,
    updateMainBranchHndlr: any,
    menuOptions: IOptionsHrtl[],
    callbackPaginationHndlr?: any,
    totalPages?: number,
    totalRecords?: number,
    currentPageNumber?: number,
    assignAdminHndlr: any;
}

const BranchesCardContainer: React.FC<IBranchesCardContainer> = ({ branchesList,
    updateMainBranchHndlr, menuOptions, ...paginationProps }) => {
    return (
        <React.Fragment>
            <div className="tw-grid tw-grid-cols-3 tw-gap-4 branches-card-list grid-view-filter py-4 mb-2">
                {Array.isArray(branchesList) && branchesList.map((item: any, index: any) => (
                    <BranchCard branchDetails={item} key={index}
                        updateMainBranchHndlr={updateMainBranchHndlr}
                        menuOptions={menuOptions}
                    />
                ))}
            </div>
            <Pagination
                paginationContainerClass="mb-4"
                callbackPaginationHndlr={paginationProps.callbackPaginationHndlr}
                totalPages={paginationProps.totalPages}
                totalRecords={paginationProps.totalRecords || 0}
                currentPageNumber={paginationProps.currentPageNumber}
            />
        </React.Fragment>
    )
}



export default BranchesCardContainer;
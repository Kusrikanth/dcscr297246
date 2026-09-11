import React, { useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import HorizontalTab from "../../../Components/Common/HorizontalTab";
import TCApprovalList from "./TCApproved";
import TcRequests from "./TCRequest";
// Tabbar menu types
export interface IMenuOptions {
    id: string;
    labelName: string;
    customPadding: string;
}

const MenuOptions: Array<IMenuOptions> = [
    {
        id: "tcRequests",
        labelName: "TC Requests",
        customPadding: "0px 10px",
    },
    {
        id: "tcApprovalList",
        labelName: "TC Approval List",
        customPadding: "0px 10px",
    },
];

function getActiveMenuComponent(menuId: string | null) {
    switch (menuId) {
        case "tcRequests":
            return TcRequests;
        case "tcApprovalList":
            return TCApprovalList;
    }
}

const TransferRequestApprovals = () => {
    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Transfer Request Approvals" pageTitle="Transportation" />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200 tw-mt-4">

                        <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-w-full md:tw-w-1/2">
                                    <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-mb-0">
                                        Transfer Request Details List
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className="tw-px-4 tw-pt-3">
                            <HorizontalTab
                                MenuOptions={MenuOptions}
                                getActiveMenuComponent={(menuId: any) =>
                                    getActiveMenuComponent(menuId)
                                }
                                showBadge={false}
                                activeTabId="tcRequests"
                                horizontalClass="tw-px-3 tw-pt-2"
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default TransferRequestApprovals;

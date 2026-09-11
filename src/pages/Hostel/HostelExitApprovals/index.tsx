import { shallowEqual } from "react-redux";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useAppSelector } from "../../../hooks/storehook";
import TerminationApprovals from "./TerminationApprovals";
import TerminationRequests from "./TerminationRequests";
import classNames from "classnames";
import { useMemo, useState } from "react";

const tabOptions = [
    {
        id: "terminationRequest",
        labelName: "Termiation Requests List",
        customPadding: "0px 10px",
    },
    {
        id: "terminationApproval",
        labelName: "Termination Approval List",
        customPadding: "0px 10px",
    },
];

const HostelExitApprovals = ({ parentModule }: any) => {
    const [activeMenuId, setActiveMenuId] = useState("terminationRequest");
    
    const {
        currentBranchIdResp: branchId,
        currentInstIdResp: instituteId,
    } = useAppSelector(
        ({ appData, }) => ({
            currentBranchIdResp: appData.currentBranchIdResp,
            currentInstIdResp: appData.currentInstIdResp,
        }),
        shallowEqual
    );

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            menuId = currentTarget.getAttribute("data-id");
        setActiveMenuId(menuId || "");
    }

    const activeComponent = useMemo(() => {
        if (activeMenuId === "terminationRequest") {
            return (<TerminationRequests parentModule={parentModule} />)
        } else if (activeMenuId === "terminationApproval") {
            return (<TerminationApprovals parentModule={parentModule} />)
        } else {
            return null;
        }
    }, [activeMenuId, branchId, instituteId, parentModule]);

    return (
        <>
            <div className="page-content free_payment_record_wrapper">
                <div className="container-fluid">
                    <BreadCrumb title="Transfer Request Approvals" pageTitle={`${parentModule === "HOSTEL" ? "Hostel" : (parentModule === "ACCOUNTS" ? "Hostel" : "")}`} />

                    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
                        <div className="tw-border-b tw-px-4 tw-py-3">
                            <div className="tw-flex tw-items-center">
                                <div className="tw-w-1/2">
                                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                        {parentModule === "HOSTEL" &&
                                            "Hostel Termination Details List"}
                                        {parentModule === "ACCOUNTS" &&
                                            "Hostel Fee Termination Details List"}
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className="tw-flex tw-items-center tw-mb-2 tw-px-3 tw-pt-2 horizontal_tab_wrapper">
                            {tabOptions.map((item) => (
                                <div
                                    key={item.id}
                                    data-id={item.id}
                                    onClick={clickMenuHandler}
                                    className={`
                                    tab_name_wrapper
                                    tw-cursor-pointer
                                    ${classNames({
                                        active: item.id === activeMenuId,
                                        })}`}
                                    style={{
                                        padding: item?.customPadding || "0px 26px",
                                    }}
                                >
                                    <span className="tw-mr-2">{item.labelName}</span>
                                </div>
                            ))}
                        </div>

                        <div className="tw-px-4 tw-pb-4">
                            {activeComponent}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default HostelExitApprovals;

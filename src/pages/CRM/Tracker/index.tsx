import { useMemo, useState, type MouseEvent } from "react";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { Button } from "../../../Components/Common";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";
import ActionItemsTab from "./ActionItemsTab";
import MomRecordsTab from "./MomRecordsTab";
import MyApprovalsTab from "./MyApprovalsTab";
import {
    actionItemRecords as sampleRecords,
    approvalRecords as sampleApprovals,
    momSessions as sampleSessions,
    type ActionItemRecord,
    type ApprovalRecord,
    type MomSession,
} from "./helper";
import { toast } from "react-toastify";

const Tracker = () => {
    const [activeId, setActiveId] = useState<string>("actionItems");
    const [records, setRecords] =
        useState<Array<ActionItemRecord>>(sampleRecords);
    const [approvals, setApprovals] =
        useState<Array<ApprovalRecord>>(sampleApprovals);
    const [sessions, setSessions] =
        useState<Array<MomSession>>(sampleSessions);

    const pendingApprovalCount = useMemo(
        () => approvals.filter(item => item.decision === "pending").length,
        [approvals],
    );

    const menuOptions = useMemo(
        () => [
            {
                id: "actionItems",
                labelName: "Action Items",
                customPadding: "0px 10px 0px 10px",
                count: records.length,
            },
            {
                id: "momRecords",
                labelName: "MOM Records",
                customPadding: "0px 10px 0px 10px",
                count: sessions.length,
            },
            {
                id: "myApprovals",
                labelName: "My Approvals",
                customPadding: "0px 10px 0px 10px",
                count: pendingApprovalCount,
            },
        ],
        [pendingApprovalCount, records.length, sessions.length],
    );

    const clickMenuHandler = (event: MouseEvent<HTMLElement>) => {
        const menuId = event.currentTarget.getAttribute("data-id");

        if (menuId) {
            setActiveId(menuId);
        }
    };

    const refreshHandler = () => {
        setRecords(sampleRecords);
        setApprovals(sampleApprovals);
        setSessions(sampleSessions);
        toast.success("Tracker records refreshed");
    };

    return (
        <div className="page-content">
            <div className="container-fluid">
                <BreadCrumb pageTitle="CRM" />

                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                    <div className="tw-flex-1">
                        <UpdatedHorizontalTab
                            MenuOptions={menuOptions}
                            clickMenuHandler={clickMenuHandler}
                            activeTabId={activeId}
                            showBadge
                            horizontalClass=""
                        />
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50 tw-flex-shrink-0"
                        title="Refresh tracker records"
                        aria-label="Refresh tracker records"
                        onClick={refreshHandler}
                    >
                        <i className="ri-refresh-line"></i>
                    </Button>
                </div>

                <div className="tw-mt-3">
                    {activeId === "actionItems" && (
                        <ActionItemsTab
                            records={records}
                            onRecordsChange={setRecords}
                            approvals={approvals}
                            onApprovalsChange={setApprovals}
                        />
                    )}

                    {activeId === "momRecords" && (
                        <MomRecordsTab
                            sessions={sessions}
                            onSessionsChange={setSessions}
                        />
                    )}

                    {activeId === "myApprovals" && (
                        <MyApprovalsTab
                            approvals={approvals}
                            onApprovalsChange={setApprovals}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tracker;

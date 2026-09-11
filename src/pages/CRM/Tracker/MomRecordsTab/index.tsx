import { useState } from "react";

import {
    Button,
    ModalContainerUpdated
} from "../../../../Components/Common";
import NoDataComp from "../../../../Components/Common/NoDataComp";
import { useModal } from "../../../../hooks/modalhook";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import MomSessionModal, {
    type MomSessionDraft,
} from "./MomSessionModal";
import SessionActionItemsModal from "./SessionActionItemsModal";
import {
    estimateInHours,
    formatDateTime,
    stripHtml,
    trackerUsers,
    trackerWorkflows,
    type MomPoint,
    type MomSession,
} from "../helper";
import { toast } from "react-toastify";

interface MomRecordsTabProps {
    sessions: Array<MomSession>;
    onSessionsChange: (sessions: Array<MomSession>) => void;
}

const MomRecordsTab = ({
    sessions,
    onSessionsChange,
}: MomRecordsTabProps) => {
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: "",
    });

    const {
        openModal: sessionOpenModal,
        closeModal: sessionCloseModal,
        modalState: sessionModalState,
    } = useModal();
    const {
        openModal: itemsOpenModal,
        closeModal: itemsCloseModal,
        modalState: itemsModalState,
    } = useModal();

    const saveSessionHandler = (
        draft: MomSessionDraft,
        session?: MomSession,
    ) => {
        const savedAt = new Date().toISOString();

        const points: Array<MomPoint> = draft.items.map((item, index) => {
            const owner = trackerUsers.find(
                user => user.employeeId === item.ownerEmployeeId,
            );
            const approver = trackerUsers.find(
                user => user.userId === item.approverUserId,
            );

            return {
                id: `point-${savedAt}-${index}`,
                operationRecordId: `record-${savedAt}-${index}`,
                recordNumber: `MOM-SCHO-${String(index + 1).padStart(6, "0")}`,
                actionItem: item.title.trim(),
                owner: owner?.name || "Unassigned",
                dueAt: item.dueAt,
                estimatedHours: estimateInHours(
                    item.estimatedValue,
                    item.estimateUnit,
                ),
                minutesSpent: 0,
                statusKey: "open",
                approvalRequired: Boolean(item.approverUserId),
                approvalStatus: item.approverUserId ? "pending" : "",
                approvers: approver?.name || "",
                approvalDetails: approver
                    ? [
                        {
                            id: `approval-${savedAt}-${index}`,
                            approver: approver.name,
                            decision: "pending",
                            comments: "",
                        },
                    ]
                    : [],
                description: "",
                notes: "",
            };
        });

        if (session) {
            onSessionsChange(
                sessions.map(item =>
                    item.id === session.id
                        ? {
                            ...item,
                            notes: draft.notes,
                            points: [...item.points, ...points],
                            actionItemCount:
                                item.actionItemCount + points.length,
                        }
                        : item,
                ),
            );
        } else {
            onSessionsChange([
                {
                    id: `m-${savedAt}`,
                    sessionNumber: `MOM-SESSION-SCHO-${Date.now()}`,
                    createdBy: "SRIKANTH KUNCHALA",
                    endedAt: savedAt,
                    notes: draft.notes,
                    actionItemCount: points.length,
                    points,
                },
                ...sessions,
            ]);
        }

        toast.success(session ? "Saved to MOM session" : "MOM session saved");
    };

    return (
        <>
            <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-end tw-justify-between tw-gap-3">
                <p className="tw-mb-0 tw-text-sm tw-text-gray-600">
                    {sessions.length} session
                    {sessions.length === 1 ? "" : "s"} recorded
                </p>

                <div className="tw-flex tw-flex-wrap tw-items-end tw-gap-2">
                    <div style={{ minWidth: "240px" }}>
                        <CustomDatePicker
                            name="momDateRange"
                            labelText="Recorded Date"
                            startDate={dateRange.startDate}
                            endDate={dateRange.endDate}
                            onChange={(dates: {
                                startDate: string;
                                endDate: string;
                            }) => setDateRange(dates)}
                            placeholder="Select date range"
                            monthsShown={2}
                            formgroupClassName="tw-mb-0"
                            portalId="mom-records-date-filter"
                            floatingLabel
                        />
                    </div>

                    <Button
                        type="button"
                        variant="primary"
                        disabled={!trackerWorkflows.length}
                        onClick={() => sessionOpenModal()}
                    >
                        <i className="ri-add-fill tw-me-1"></i>
                        Start New Session
                    </Button>
                </div>
            </div>

            {!trackerWorkflows.length && (
                <p className="tw-mb-3 tw-text-xs tw-text-danger">
                    Configure at least one Tracker status before starting a MOM
                    session.
                </p>
            )}

            {sessions.length === 0 ? (
                <div className="tw-card">
                    <div className="tw-card-body">
                        <NoDataComp
                            title="No MOM records yet"
                            helperText="Record meeting notes and assign action items in one go."
                        />
                    </div>
                </div>
            ) : (
                <div className="tw-space-y-3">
                    {sessions.map(session => (
                        <div className="tw-card" key={session.id}>
                            <div className="tw-card-body">
                                <div className="tw-flex tw-flex-col tw-gap-3 lg:tw-flex-row lg:tw-items-start lg:tw-justify-between">
                                    <div className="tw-min-w-0">
                                        <h4 className="tw-card-title tw-break-all">
                                            {session.sessionNumber}
                                        </h4>
                                        <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-500">
                                            {session.createdBy}
                                            {session.endedAt &&
                                                ` · ${formatDateTime(session.endedAt)}`}
                                        </p>
                                    </div>

                                    <div className="tw-flex tw-flex-shrink-0 tw-items-center tw-gap-2">
                                        {session.actionItemCount > 0 ? (
                                            <Button
                                                type="button"
                                                variant="hoverInfo"
                                                title="View the action items raised in this session"
                                                onClick={() =>
                                                    itemsOpenModal(session)
                                                }
                                            >
                                                {session.actionItemCount} action{" "}
                                                {session.actionItemCount === 1
                                                    ? "item"
                                                    : "items"}
                                            </Button>
                                        ) : (
                                            <span className="badge badge-soft-secondary tw-p-2">
                                                No action items
                                            </span>
                                        )}

                                        <Button
                                            type="button"
                                            variant="primary"
                                            onClick={() =>
                                                sessionOpenModal(session)
                                            }
                                        >
                                            Add to session
                                        </Button>
                                    </div>
                                </div>

                                {session.notes && (
                                    <>
                                        <div className="tw-my-3 tw-border-t tw-border-gray-200"></div>
                                        <p className="tw-mb-0 tw-line-clamp-3 tw-text-sm tw-leading-6 tw-text-gray-600">
                                            {stripHtml(session.notes)}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ModalContainerUpdated
                id="mom-session-modal"
                isOpen={sessionModalState.showModal}
                toggle={sessionCloseModal}
                modalTitle={
                    sessionModalState.modalData
                        ? "Add to MOM Session"
                        : "New MOM Session"
                }
                modalSize="xl"
            >
                <MomSessionModal
                    session={sessionModalState.modalData}
                    toggle={sessionCloseModal}
                    onSave={saveSessionHandler}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="mom-session-action-items"
                isOpen={itemsModalState.showModal}
                toggle={itemsCloseModal}
                modalTitle="Session Action Items"
                modalSize="lg"
            >
                <SessionActionItemsModal
                    session={itemsModalState.modalData}
                    toggle={itemsCloseModal}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default MomRecordsTab;

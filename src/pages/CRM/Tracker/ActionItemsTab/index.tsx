import {
    useCallback,
    useMemo,
    useState,
    type ChangeEvent,
    type MouseEvent,
} from "react";

import {
    Button,
    ModalContainerUpdated,
    SelectInput,
    TextIconInput,
} from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { type IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../hooks/modalhook";
import TrackerStats from "../TrackerStats";
import BoardView from "./BoardView";
import CalendarView from "./CalendarView";
import EditActionItemModal from "./EditActionItemModal";
import ViewActionItemModal from "./ViewActionItemModal";
import NotificationSettingsModal, {
    type TrackerNotificationSettings,
} from "./NotificationSettingsModal";
import ApproveApprovalModal from "../MyApprovalsTab/ApproveApprovalModal";
import RejectApprovalModal from "../MyApprovalsTab/RejectApprovalModal";
import {
    approvalChipClass,
    approvalChipIcon,
    generateActionItemColumns,
} from "./helper";
import {
    approvalFilterOptions,
    deadlineFilterOptions,
    taskViewOptions,
    trackerStages,
    trackerWorkflows,
    type ActionItemRecord,
    type ApprovalRecord,
} from "../helper";
import { toast } from "react-toastify";

interface ActionItemsTabProps {
    records: Array<ActionItemRecord>;
    onRecordsChange: (records: Array<ActionItemRecord>) => void;
    approvals: Array<ApprovalRecord>;
    onApprovalsChange: (approvals: Array<ApprovalRecord>) => void;
}

interface FilterState {
    searchString: string;
    workflowId: string;
    stageId: string;
    owner: string;
    deadline: string;
    approval: string;
}

interface PaginationState {
    pageNo: number;
    pageSize: number;
}

const initialPagination: PaginationState = { pageNo: 0, pageSize: 10 };

const defaultWorkflowId =
    trackerWorkflows.find(item => item.isDefault)?.id ||
    trackerWorkflows[0]?.id ||
    "";

const initialFilterState: FilterState = {
    searchString: "",
    workflowId: defaultWorkflowId,
    stageId: "",
    owner: "",
    deadline: "",
    approval: "",
};

const initialNotificationSettings: TrackerNotificationSettings = {
    isEnabled: false,
    integrationId: "",
    actionItemTemplate: "",
    approvalTemplate: "",
};

const ActionItemsTab = ({
    records,
    onRecordsChange,
    approvals,
    onApprovalsChange,
}: ActionItemsTabProps) => {
    const [filterState, setFilterState] =
        useState<FilterState>(initialFilterState);
    const [taskView, setTaskView] = useState<string>("list");
    const [pagination, setPagination] =
        useState<PaginationState>(initialPagination);
    const [notificationSettings, setNotificationSettings] =
        useState<TrackerNotificationSettings>(initialNotificationSettings);

    const {
        openModal: viewOpenModal,
        closeModal: viewCloseModal,
        modalState: viewModalState,
    } = useModal();
    const {
        openModal: editOpenModal,
        closeModal: editCloseModal,
        modalState: editModalState,
    } = useModal();
    const {
        openModal: approvalOpenModal,
        closeModal: approvalCloseModal,
        modalState: approvalModalState,
    } = useModal();
    const {
        openModal: notifyOpenModal,
        closeModal: notifyCloseModal,
        modalState: notifyModalState,
    } = useModal();
    const {
        openModal: approveOpenModal,
        closeModal: approveCloseModal,
        modalState: approveModalState,
    } = useModal();
    const {
        openModal: rejectOpenModal,
        closeModal: rejectCloseModal,
        modalState: rejectModalState,
    } = useModal();

    const stages = useMemo(
        () =>
            trackerStages.filter(
                stage =>
                    !filterState.workflowId ||
                    String(stage.workflowId) ===
                    String(filterState.workflowId),
            ),
        [filterState.workflowId],
    );

    const terminalStageIds = useMemo(
        () =>
            new Set(
                trackerStages
                    .filter(stage =>
                        ["completed", "cancelled"].includes(stage.stageType),
                    )
                    .map(stage => String(stage.id)),
            ),
        [],
    );

    const ownerOptions = useMemo(
        () =>
            [
                ...new Set(
                    records.map(record => record.owner || "Unassigned"),
                ),
            ]
                .sort((left, right) => left.localeCompare(right))
                .map(owner => ({ id: owner, name: owner })),
        [records],
    );

    const overdueRecords = useMemo(
        () =>
            records
                .filter(
                    record =>
                        record.dueAt &&
                        new Date(record.dueAt) < new Date() &&
                        !terminalStageIds.has(String(record.stageId)),
                )
                .sort(
                    (left, right) =>
                        new Date(left.dueAt).getTime() -
                        new Date(right.dueAt).getTime(),
                ),
        [records, terminalStageIds],
    );

    const pendingActionCount = useMemo(
        () =>
            records.filter(
                record => !terminalStageIds.has(String(record.stageId)),
            ).length,
        [records, terminalStageIds],
    );

    const paginatedRecords = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return records.slice(start, start + pagination.pageSize);
    }, [pagination, records]);

    const findRecord = useCallback(
        (recordId: string | null) =>
            records.find(item => item.id === recordId),
        [records],
    );

    const filterChangeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setFilterState(prevState => ({
            ...prevState,
            [name]: value,
            ...(name === "workflowId" ? { stageId: "" } : null),
        }));
    };

    const actionableApproval = (recordId: string, approver: string) =>
        approvals.find(
            item =>
                item.recordId === recordId &&
                item.approver === approver &&
                item.decision === "pending",
        );

    const decideHandler = (
        record: ApprovalRecord,
        decision: "approved" | "rejected",
        remarks: string,
    ) => {
        onApprovalsChange(
            approvals.map(item =>
                item.id === record.id
                    ? {
                        ...item,
                        decision,
                        remarks,
                        decisionLogin: "SRIKANTH KUNCHALA",
                        decidedAt: new Date().toISOString(),
                    }
                    : item,
            ),
        );

        onRecordsChange(
            records.map(item =>
                item.id === record.recordId
                    ? {
                        ...item,
                        approvalStatus: decision,
                        approvals: item.approvals.map(entry =>
                            entry.approver === record.approver
                                ? { ...entry, decision, remarks }
                                : entry,
                        ),
                    }
                    : item,
            ),
        );

        toast.success(`Action item ${decision}`);
    };

    const stageChangeHandler = (
        record: ActionItemRecord,
        stageId: string,
    ) => {
        if (!stageId || String(stageId) === String(record.stageId)) {
            return;
        }

        onRecordsChange(
            records.map(item =>
                item.id === record.id ? { ...item, stageId } : item,
            ),
        );
        toast.success("Action status updated");
    };

    const saveRecordHandler = (updated: ActionItemRecord) => {
        onRecordsChange(
            records.map(item => (item.id === updated.id ? updated : item)),
        );
        toast.success("Action item updated");
    };

    const exportHandler = () => {
    };

    const menuOptions: Array<IOptionsHrtl> = useMemo(
        () => [
            {
                id: "view",
                actionIcon: <i className="ri-eye-line tw-text-gray-500"></i>,
                actionName: "View",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const record = findRecord(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (record) {
                        viewOpenModal(record);
                    }
                },
            },
            {
                id: "edit",
                actionIcon: <i className="ri-pencil-line tw-text-gray-500"></i>,
                actionName: "Edit",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const record = findRecord(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (record) {
                        editOpenModal(record);
                    }
                },
            },
        ],
        [editOpenModal, findRecord, viewOpenModal],
    );

    const tableColumns = useMemo(
        () =>
            generateActionItemColumns(
                menuOptions,
                trackerStages,
                terminalStageIds,
                record => approvalOpenModal(record),
            ),
        [approvalOpenModal, menuOptions, terminalStageIds],
    );

    return (
        <>
            <TrackerStats
                actionItemCount={records.length}
                pendingActionCount={pendingActionCount}
                overdueCount={overdueRecords.length}
                pendingApprovalCount={
                    records.filter(
                        record => record.approvalStatus === "pending",
                    ).length
                }
            />

            <div className="tw-card tw-mb-4">
                <div className="tw-card-body">
                    <div className="row tw-items-end tw-gap-y-3">
                        <div className="col-12 col-md-6 col-xl-3">
                            <TextIconInput
                                formgroupClassName="search-box tw-mb-0"
                                name="searchString"
                                labelText="Search"
                                value={filterState.searchString}
                                onChange={filterChangeHandler}
                                placeHolder="Search action items…"
                                floatingLabel
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
                        </div>

                        {trackerWorkflows.length > 1 && (
                            <div className="col-12 col-md-6 col-xl-2">
                                <SelectInput
                                    name="workflowId"
                                    labelText="Tracker"
                                    value={filterState.workflowId}
                                    onChange={filterChangeHandler}
                                    menuItems={trackerWorkflows}
                                    valueKey="id"
                                    textKey="displayName"
                                    hideSelectOption
                                    formgroupClassName="tw-mb-0"
                                    floatingLabel
                                />
                            </div>
                        )}

                        <div className="col-12 col-md-6 col-xl-2">
                            <SelectInput
                                name="stageId"
                                labelText="Status"
                                defaultSelect="All statuses"
                                value={filterState.stageId}
                                onChange={filterChangeHandler}
                                menuItems={stages}
                                valueKey="id"
                                textKey="displayName"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-2">
                            <SelectInput
                                name="owner"
                                labelText="Owner"
                                defaultSelect="All owners"
                                value={filterState.owner}
                                onChange={filterChangeHandler}
                                menuItems={ownerOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-3">
                            <div className="row tw-gap-y-3">
                                <div className="col-6">
                                    <SelectInput
                                        name="deadline"
                                        labelText="Deadline"
                                        defaultSelect="All deadlines"
                                        value={filterState.deadline}
                                        onChange={filterChangeHandler}
                                        menuItems={deadlineFilterOptions}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                    />
                                </div>
                                <div className="col-6">
                                    <SelectInput
                                        name="approval"
                                        labelText="Approval"
                                        defaultSelect="All approvals"
                                        value={filterState.approval}
                                        onChange={filterChangeHandler}
                                        menuItems={approvalFilterOptions}
                                        valueKey="id"
                                        textKey="name"
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tw-mt-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                        <Button
                            type="button"
                            variant="hoverInfo"
                            title="Action item notifications"
                            onClick={() => notifyOpenModal()}
                        >
                            <i className="ri-notification-3-line tw-me-1"></i>
                            Notifications
                        </Button>

                        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                            <div
                                className="tw-flex tw-gap-1"
                                aria-label="Tracker view"
                            >
                                {taskViewOptions.map(option => (
                                    <Button
                                        key={option.id}
                                        type="button"
                                        variant={
                                            taskView === option.id
                                                ? "previous"
                                                : "secondary"
                                        }
                                        className={`!tw-h-8 !tw-w-8 !tw-p-0 tw-border ${taskView === option.id
                                            ? "tw-border-[#1bb3a6]"
                                            : "tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                            }`}
                                        title={`${option.name} view`}
                                        aria-label={`${option.name} view`}
                                        onClick={() => setTaskView(option.id)}
                                    >
                                        <i className={option.icon}></i>
                                    </Button>
                                ))}
                            </div>

                            <Button
                                type="button"
                                variant="secondary"
                                className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                title="Export filtered action items"
                                aria-label="Export filtered action items"
                                disabled={!records.length}
                                onClick={exportHandler}
                            >
                                <i className="ri-download-2-line"></i>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {taskView === "list" && (
                <div className="tw-card">
                    <div className="tw-card-body !tw-p-0">
                        <TableContainer
                            columns={tableColumns}
                            data={paginatedRecords}
                            tableClass="mb-0"
                            divClass="table-responsive mb-3"
                            theadClass="table-light text-muted align-middle"
                            showPagination
                            totalPages={Math.ceil(
                                records.length / pagination.pageSize,
                            )}
                            totalRecords={records.length}
                            currentPageNumber={pagination.pageNo}
                            pageSize={pagination.pageSize}
                            callbackPaginationHndlr={setPagination}
                        />
                    </div>
                </div>
            )}

            {taskView === "board" && (
                <BoardView
                    records={records}
                    stages={stages}
                    terminalStageIds={terminalStageIds}
                    onView={record => viewOpenModal(record)}
                    onStageChange={stageChangeHandler}
                />
            )}

            {taskView === "calendar" && (
                <CalendarView
                    records={records}
                    stages={stages}
                    terminalStageIds={terminalStageIds}
                    overdueRecords={overdueRecords}
                />
            )}

            <ModalContainerUpdated
                id="tracker-action-item-view"
                isOpen={viewModalState.showModal}
                toggle={viewCloseModal}
                modalTitle="Action Item Details"
                modalSize="lg"
            >
                <ViewActionItemModal
                    data={viewModalState.modalData}
                    stages={trackerStages}
                    toggle={viewCloseModal}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="tracker-action-item-edit"
                isOpen={editModalState.showModal}
                toggle={editCloseModal}
                modalTitle="Edit Action Item"
                modalSize="lg"
            >
                <EditActionItemModal
                    data={editModalState.modalData}
                    stages={stages}
                    toggle={editCloseModal}
                    onSave={saveRecordHandler}
                />
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="tracker-action-item-approval"
                isOpen={approvalModalState.showModal}
                toggle={approvalCloseModal}
                modalTitle="Approval Details"
                modalSize="md"
            >
                <div className="tw-p-4">
                    <p className="tw-mb-3 tw-text-sm tw-text-gray-600">
                        {approvalModalState.modalData?.title}
                    </p>

                    {(approvalModalState.modalData?.approvals || []).length ===
                        0 ? (
                        <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                            No approvers assigned.
                        </p>
                    ) : (
                        (approvalModalState.modalData?.approvals || []).map(
                            (approval: {
                                id: string;
                                approver: string;
                                decision: string;
                            }) => {
                                const pendingApproval = actionableApproval(
                                    approvalModalState.modalData.id,
                                    approval.approver,
                                );

                                return (
                                    <div
                                        key={approval.id}
                                        className="tw-mb-2 tw-flex tw-items-center tw-gap-3 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-3"
                                    >
                                        <span
                                            className={`tw-grid tw-h-9 tw-w-9 tw-flex-shrink-0 tw-place-items-center tw-rounded-full tw-border ${approvalChipClass(approval.decision)}`}
                                        >
                                            <i
                                                className={approvalChipIcon(
                                                    approval.decision,
                                                )}
                                            ></i>
                                        </span>

                                        <div className="tw-min-w-0 tw-flex-1">
                                            <p className="tw-mb-0 tw-truncate tw-text-sm tw-font-medium tw-text-gray-800">
                                                {approval.approver}
                                            </p>
                                            <p className="tw-mb-0 tw-text-xs tw-capitalize tw-text-gray-500">
                                                {approval.decision.replace(
                                                    /_/g,
                                                    " ",
                                                )}
                                            </p>
                                        </div>

                                        {pendingApproval && (
                                            <div className="tw-flex tw-flex-shrink-0 tw-gap-2">
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    title="Approve"
                                                    aria-label={`Approve ${approvalModalState.modalData.title}`}
                                                    className="!tw-h-8 !tw-w-8 !tw-p-0"
                                                    onClick={() => {
                                                        approvalCloseModal();
                                                        approveOpenModal(
                                                            pendingApproval,
                                                        );
                                                    }}
                                                >
                                                    <i className="ri-check-line"></i>
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="wrong"
                                                    title="Reject"
                                                    aria-label={`Reject ${approvalModalState.modalData.title}`}
                                                    className="!tw-h-8 !tw-w-8 !tw-p-0"
                                                    onClick={() => {
                                                        approvalCloseModal();
                                                        rejectOpenModal(
                                                            pendingApproval,
                                                        );
                                                    }}
                                                >
                                                    <i className="ri-close-line"></i>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                );
                            },
                        )
                    )}

                    <div className="tw-mt-3 tw-flex tw-justify-end tw-border-t tw-border-gray-200 tw-pt-3">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={approvalCloseModal}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="tracker-action-item-approve"
                isOpen={approveModalState.showModal}
                toggle={approveCloseModal}
                modalTitle="Approve Action Item"
                modalSize="md"
            >
                {approveModalState.showModal && approveModalState.modalData && (
                    <ApproveApprovalModal
                        toggle={approveCloseModal}
                        data={approveModalState.modalData}
                        onConfirm={remarks =>
                            decideHandler(
                                approveModalState.modalData,
                                "approved",
                                remarks,
                            )
                        }
                    />
                )}
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="tracker-action-item-reject"
                isOpen={rejectModalState.showModal}
                toggle={rejectCloseModal}
                modalTitle="Reject Action Item"
                modalSize="md"
            >
                {rejectModalState.showModal && rejectModalState.modalData && (
                    <RejectApprovalModal
                        toggle={rejectCloseModal}
                        data={rejectModalState.modalData}
                        onConfirm={remarks =>
                            decideHandler(
                                rejectModalState.modalData,
                                "rejected",
                                remarks,
                            )
                        }
                    />
                )}
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="tracker-notification-settings"
                isOpen={notifyModalState.showModal}
                toggle={notifyCloseModal}
                modalTitle="Action Item Notifications"
                modalSize="md"
            >
                <NotificationSettingsModal
                    settings={notificationSettings}
                    toggle={notifyCloseModal}
                    onSave={settings => {
                        setNotificationSettings(settings);
                        toast.success("Tracker notifications saved");
                    }}
                />
            </ModalContainerUpdated>
        </>
    );
};

export default ActionItemsTab;

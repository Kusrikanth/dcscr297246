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
import NoDataComp from "../../../../Components/Common/NoDataComp";
import { type IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../hooks/modalhook";
import { CustomDatePicker } from "../../../DashBoardBranchSummary/CustomDatePicker";
import { generateColumns } from "./helper";
import ApproveApprovalModal from "./ApproveApprovalModal";
import RejectApprovalModal from "./RejectApprovalModal";
import ViewApprovalModal from "./ViewApprovalModal";
import {
    approvalStatusOptions,
    type ApprovalRecord,
} from "../helper";
import { toast } from "react-toastify";

interface MyApprovalsTabProps {
    approvals: Array<ApprovalRecord>;
    onApprovalsChange: (approvals: Array<ApprovalRecord>) => void;
}

interface FilterState {
    searchString: string;
    status: string;
    approver: string;
    decisionLogin: string;
    startDate: string;
    endDate: string;
}

interface PaginationState {
    pageNo: number;
    pageSize: number;
}

const initialFilterState: FilterState = {
    searchString: "",
    status: "",
    approver: "",
    decisionLogin: "",
    startDate: "",
    endDate: "",
};

const initialPagination: PaginationState = { pageNo: 0, pageSize: 10 };

const MyApprovalsTab = ({
    approvals,
    onApprovalsChange,
}: MyApprovalsTabProps) => {
    const [filterState, setFilterState] =
        useState<FilterState>(initialFilterState);
    const [pagination, setPagination] =
        useState<PaginationState>(initialPagination);

    const {
        openModal: viewOpenModal,
        closeModal: viewCloseModal,
        modalState: viewModalState,
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

    const findApproval = useCallback(
        (approvalId: string | null) =>
            approvals.find(item => item.id === approvalId),
        [approvals],
    );

    const approverOptions = useMemo(
        () =>
            [...new Set(approvals.map(item => item.approver).filter(Boolean))]
                .sort()
                .map(name => ({ id: name, name })),
        [approvals],
    );

    const decisionLoginOptions = useMemo(
        () =>
            [
                ...new Set(
                    approvals.map(item => item.decisionLogin).filter(Boolean),
                ),
            ]
                .sort()
                .map(name => ({ id: name, name })),
        [approvals],
    );

    const paginatedApprovals = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return approvals.slice(start, start + pagination.pageSize);
    }, [approvals, pagination]);

    const pendingCount = useMemo(
        () => approvals.filter(item => item.decision === "pending").length,
        [approvals],
    );

    const filterChangeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setFilterState(prevState => ({ ...prevState, [name]: value }));
    };

    const dateRangeChangeHandler = (dates: {
        startDate: string;
        endDate: string;
    }) => {
        setFilterState(prevState => ({
            ...prevState,
            startDate: dates.startDate,
            endDate: dates.endDate,
        }));
    };

    const resetFilterHandler = () => {
        setFilterState(initialFilterState);
    };

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
        toast.success(`Action item ${decision}`);
    };

    const exportHandler = () => {
    };

    const actionOptions: Array<IOptionsHrtl> = useMemo(
        () => [
            {
                id: "view",
                actionIcon: (
                    <i className="ri-eye-line text-success fs-16"></i>
                ),
                actionName: "View",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const record = findApproval(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (record) {
                        viewOpenModal(record);
                    }
                },
            },
            {
                id: "approve",
                actionIcon: (
                    <i className="ri-check-line text-success fs-16"></i>
                ),
                actionName: "Approve",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const record = findApproval(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (record) {
                        approveOpenModal(record);
                    }
                },
            },
            {
                id: "reject",
                actionIcon: (
                    <i className="ri-close-line text-danger fs-16"></i>
                ),
                actionName: "Reject",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const record = findApproval(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (record) {
                        rejectOpenModal(record);
                    }
                },
            },
        ],
        [approveOpenModal, findApproval, rejectOpenModal, viewOpenModal],
    );

    const tableColumns = useMemo(
        () => generateColumns(actionOptions),
        [actionOptions],
    );

    if (!approvals.length) {
        return (
            <div className="tw-card">
                <div className="tw-card-body">
                    <NoDataComp
                        title="My Approvals"
                        helperText="No approvals assigned to you."
                    />
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="tw-card">
                <div className="tw-card-header">
                    <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                        <p className="tw-mb-0 tw-text-sm tw-text-gray-600">
                            {approvals.length} assigned approval
                            {approvals.length === 1 ? "" : "s"}
                        </p>

                        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
                            <span className="badge badge-soft-warning tw-p-2">
                                {pendingCount} pending
                            </span>

                            <Button
                                type="button"
                                variant="hoverInfo"
                                disabled={!approvals.length}
                                onClick={exportHandler}
                            >
                                <i className="ri-download-2-line tw-me-1"></i>
                                Export
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                title="Clear approval filters"
                                aria-label="Clear approval filters"
                                onClick={resetFilterHandler}
                            >
                                <i className="ri-refresh-line"></i>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="tw-border-b tw-border-gray-200 tw-p-3">
                    <div className="row tw-items-end tw-gap-y-3">
                        <div className="col-12 col-md-6 col-xl-3">
                            <TextIconInput
                                formgroupClassName="search-box tw-mb-0"
                                name="searchString"
                                labelText="Search"
                                value={filterState.searchString}
                                onChange={filterChangeHandler}
                                placeHolder="Search action or record…"
                                floatingLabel
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
                        </div>

                        <div className="col-12 col-md-6 col-xl-2">
                            <SelectInput
                                name="status"
                                labelText="Status"
                                defaultSelect="All statuses"
                                value={filterState.status}
                                onChange={filterChangeHandler}
                                menuItems={approvalStatusOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-2">
                            <SelectInput
                                name="approver"
                                labelText="Approver"
                                defaultSelect="All approvers"
                                value={filterState.approver}
                                onChange={filterChangeHandler}
                                menuItems={approverOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-2">
                            <SelectInput
                                name="decisionLogin"
                                labelText="Decision Login"
                                defaultSelect="All decision logins"
                                value={filterState.decisionLogin}
                                onChange={filterChangeHandler}
                                menuItems={decisionLoginOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-3">
                            <CustomDatePicker
                                name="requestDateRange"
                                labelText="Request Date"
                                startDate={filterState.startDate}
                                endDate={filterState.endDate}
                                onChange={dateRangeChangeHandler}
                                placeholder="Select date range"
                                monthsShown={2}
                                formgroupClassName="tw-mb-0"
                                portalId="my-approvals-date-filter"
                                floatingLabel
                            />
                        </div>
                    </div>
                </div>

                <div className="tw-card-body !tw-p-0">
                    <TableContainer
                        columns={tableColumns}
                        data={paginatedApprovals}
                        tableClass="mb-0"
                        divClass="table-responsive mb-3"
                        theadClass="table-light text-muted align-middle"
                        showPagination
                        totalPages={Math.ceil(
                            approvals.length / pagination.pageSize,
                        )}
                        totalRecords={approvals.length}
                        currentPageNumber={pagination.pageNo}
                        pageSize={pagination.pageSize}
                        callbackPaginationHndlr={setPagination}
                    />
                </div>
            </div>

            <ModalContainerUpdated
                id="view-approval-modal"
                isOpen={viewModalState.showModal}
                toggle={viewCloseModal}
                modalTitle="Approval Details"
                modalSize="md"
            >
                {viewModalState.showModal && viewModalState.modalData && (
                    <ViewApprovalModal
                        toggle={viewCloseModal}
                        data={viewModalState.modalData}
                    />
                )}
            </ModalContainerUpdated>

            <ModalContainerUpdated
                id="approve-approval-modal"
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
                id="reject-approval-modal"
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
        </>
    );
};

export default MyApprovalsTab;

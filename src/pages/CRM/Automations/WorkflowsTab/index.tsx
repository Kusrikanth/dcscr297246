import {
    useCallback,
    useMemo,
    useState,
    type ChangeEvent,
    type MouseEvent,
} from "react";

import {
    ConfirmationModal,
    TextIconInput,
} from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { type IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../hooks/modalhook";
import { generateWorkflowColumns } from "./helper";
import { type AutomationWorkflow } from "../helper";

interface WorkflowsTabProps {
    workflows: Array<AutomationWorkflow>;
    onEdit: (workflow: AutomationWorkflow) => void;
    onToggleStatus: (workflow: AutomationWorkflow) => void;
    onRunNow: (workflow: AutomationWorkflow) => void;
    onDelete: (workflow: AutomationWorkflow) => void;
}

interface PaginationState {
    pageNo: number;
    pageSize: number;
}

const initialPagination: PaginationState = { pageNo: 0, pageSize: 10 };

const WorkflowsTab = ({
    workflows,
    onEdit,
    onToggleStatus,
    onRunNow,
    onDelete,
}: WorkflowsTabProps) => {
    const [searchString, setSearchString] = useState<string>("");
    const [pagination, setPagination] =
        useState<PaginationState>(initialPagination);

    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const findWorkflow = useCallback(
        (workflowId: string | null) =>
            workflows.find(item => item.id === workflowId),
        [workflows],
    );

    const paginatedWorkflows = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return workflows.slice(start, start + pagination.pageSize);
    }, [workflows, pagination]);

    const statusChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const workflow = findWorkflow(
            event.target.getAttribute("data-id"),
        );

        if (workflow) {
            onToggleStatus(workflow);
        }
    };

    const menuOptions: Array<IOptionsHrtl> = useMemo(
        () => [
            {
                id: "run",
                actionIcon: (
                    <i className="ri-play-circle-line tw-text-gray-500"></i>
                ),
                actionName: "Run Now",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const workflow = findWorkflow(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (workflow) {
                        onRunNow(workflow);
                    }
                },
            },
            {
                id: "edit",
                actionIcon: <i className="ri-pencil-line tw-text-gray-500"></i>,
                actionName: "Edit",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const workflow = findWorkflow(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (workflow) {
                        onEdit(workflow);
                    }
                },
            },
            {
                id: "delete",
                actionIcon: (
                    <i className="ri-delete-bin-line tw-text-danger"></i>
                ),
                actionName: "Delete",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const workflow = findWorkflow(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (workflow) {
                        deleteOpenModal(workflow);
                    }
                },
            },
        ],
        [deleteOpenModal, findWorkflow, onEdit, onRunNow],
    );

    const tableColumns = useMemo(
        () => generateWorkflowColumns(menuOptions, statusChangeHandler),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [menuOptions, workflows],
    );

    const deleteHandler = () => {
        onDelete(deleteModalState.modalData as AutomationWorkflow);
        deleteCloseModal();
    };

    return (
        <div className="tw-card">
            <div className="tw-card-header">
                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                    <div className="tw-w-full md:tw-w-96">
                        <TextIconInput
                            formgroupClassName="search-box tw-mb-0"
                            name="workflowSearch"
                            labelText="Search"
                            value={searchString}
                            onChange={(
                                event: ChangeEvent<HTMLInputElement>,
                            ) => setSearchString(event.target.value)}
                            placeHolder="Search workflows"
                            floatingLabel
                        >
                            <i className="ri-search-line search-icon"></i>
                        </TextIconInput>
                    </div>

                    <span className="tw-text-sm tw-text-gray-500">
                        {workflows.length} workflow
                        {workflows.length === 1 ? "" : "s"}
                    </span>
                </div>
            </div>

            <div className="tw-card-body !tw-p-0">
                <TableContainer
                    columns={tableColumns}
                    data={paginatedWorkflows}
                    tableClass="mb-0"
                    divClass="table-responsive mb-3"
                    theadClass="table-light text-muted align-middle"
                    showPagination
                    totalPages={Math.ceil(
                        workflows.length / pagination.pageSize,
                    )}
                    totalRecords={workflows.length}
                    currentPageNumber={pagination.pageNo}
                    pageSize={pagination.pageSize}
                    callbackPaginationHndlr={setPagination}
                />
            </div>

            <ConfirmationModal
                id="crm-automation-workflow-delete"
                isOpen={deleteModalState.showModal}
                iconType="reject"
                confirmTitle="Delete workflow?"
                confirmMessage={`"${deleteModalState.modalData?.name || ""}" and its schedule will be removed.`}
                noteMessage="This action cannot be undone."
                confirmBtnText="Delete"
                cancelHndlr={deleteCloseModal}
                confirmHndlr={deleteHandler}
            />
        </div>
    );
};

export default WorkflowsTab;

import { useCallback, useMemo, type MouseEvent } from "react";

import { ConfirmationModal } from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { type IOptionsHrtl } from "../../../../Components/Common/MenuOptions";
import { useModal } from "../../../../hooks/modalhook";
import { generateAssignmentRuleColumns } from "./helper";
import { type AssignmentRule } from "../helper";

interface AssignmentRulesTabProps {
    rules: Array<AssignmentRule>;
    onEdit: (rule: AssignmentRule) => void;
    onToggleStatus: (rule: AssignmentRule) => void;
    onDelete: (rule: AssignmentRule) => void;
}

const AssignmentRulesTab = ({
    rules,
    onEdit,
    onToggleStatus,
    onDelete,
}: AssignmentRulesTabProps) => {
    const {
        openModal: deleteOpenModal,
        closeModal: deleteCloseModal,
        modalState: deleteModalState,
    } = useModal();

    const findRule = useCallback(
        (ruleId: string | null) => rules.find(item => item.id === ruleId),
        [rules],
    );

    const menuOptions: Array<IOptionsHrtl> = useMemo(
        () => [
            {
                id: "edit",
                actionIcon: <i className="ri-pencil-line tw-text-gray-500"></i>,
                actionName: "Edit Rule",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const rule = findRule(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (rule) {
                        onEdit(rule);
                    }
                },
            },
            {
                id: "status",
                actionIcon: (
                    <i className="ri-shut-down-line tw-text-gray-500"></i>
                ),
                actionName: "Toggle Status",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const rule = findRule(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (rule) {
                        onToggleStatus(rule);
                    }
                },
            },
            {
                id: "delete",
                actionIcon: (
                    <i className="ri-delete-bin-line tw-text-danger"></i>
                ),
                actionName: "Delete Rule",
                onClickHndlr: (event: MouseEvent<HTMLElement>) => {
                    const rule = findRule(
                        event.currentTarget.getAttribute("data-id"),
                    );

                    if (rule) {
                        deleteOpenModal(rule);
                    }
                },
            },
        ],
        [deleteOpenModal, findRule, onEdit, onToggleStatus],
    );

    const tableColumns = useMemo(
        () => generateAssignmentRuleColumns(menuOptions),
        [menuOptions],
    );

    const deleteHandler = () => {
        onDelete(deleteModalState.modalData as AssignmentRule);
        deleteCloseModal();
    };

    return (
        <div className="tw-card">
            <div className="tw-card-header">
                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                    <p className="tw-mb-0 tw-max-w-2xl tw-text-sm tw-text-gray-600">
                        Route incoming leads to the right counsellors
                        automatically. A lead is matched against every active
                        rule's branch and source before it is assigned.
                    </p>

                    <span className="tw-text-sm tw-text-gray-500">
                        {rules.length} rule{rules.length === 1 ? "" : "s"}
                    </span>
                </div>
            </div>

            <div className="tw-card-body !tw-p-0">
                <TableContainer
                    columns={tableColumns}
                    data={rules}
                    tableClass="mb-0"
                    divClass="table-responsive mb-3"
                    theadClass="table-light text-muted align-middle"
                />
            </div>

            <ConfirmationModal
                id="crm-automation-rule-delete"
                isOpen={deleteModalState.showModal}
                iconType="reject"
                confirmTitle="Delete assignment rule?"
                confirmMessage={`"${deleteModalState.modalData?.name || ""}" will no longer route incoming leads.`}
                noteMessage="This action cannot be undone."
                confirmBtnText="Delete"
                cancelHndlr={deleteCloseModal}
                confirmHndlr={deleteHandler}
            />
        </div>
    );
};

export default AssignmentRulesTab;

import { useMemo, useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import {
    Button,
    ConfirmationModal,
    InputCheckbox,
    SelectInput,
    TextIconInput,
} from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import { useModal } from "../../../../hooks/modalhook";
import { formatDateTime, settingsBranches } from "../../Settings/helper";
import { crmUsers } from "../../Settings/Users/helper";
import { configForUnit } from "../../Settings/businessunitconfig";
import { metaRouting } from "../../Settings/MetaLeadAds/helper";
import { pendingMetaLeads, type PendingMetaLead } from "./helper";

const emptyAssignment = {
    pipelineId: "",
    stageId: "",
    substageId: "",
    ownerEmployeeId: "",
    branchId: "",
};

const MetaLeadReviewTab = () => {
    const [rows, setRows] = useState<Array<PendingMetaLead>>(pendingMetaLeads);
    const [filters, setFilters] = useState({ searchString: "", formId: "" });
    const [selectedIds, setSelectedIds] = useState<Array<string>>([]);
    const [expandedId, setExpandedId] = useState<string>("");
    const [isAssignmentOpen, setIsAssignmentOpen] = useState<boolean>(false);
    const [assignment, setAssignment] = useState(emptyAssignment);
    const [pagination, setPagination] = useState({ pageNo: 0, pageSize: 10 });

    const {
        openModal: openDiscardConfirm,
        closeModal: closeDiscardConfirm,
        modalState: discardConfirmState,
    } = useModal();

    const unitConfig = useMemo(
        () => configForUnit(metaRouting.defaultBusinessUnitId),
        [],
    );

    const stageOptions = useMemo(
        () =>
            unitConfig.pipelineStages
                .filter(
                    stage =>
                        !assignment.pipelineId ||
                        stage.pipelineId === assignment.pipelineId,
                )
                .map(stage => ({ id: stage.id, name: stage.displayName })),
        [unitConfig.pipelineStages, assignment.pipelineId],
    );

    const substageOptions = useMemo(
        () =>
            unitConfig.leadSubstages
                .filter(item => item.stageId === assignment.stageId)
                .map(item => ({ id: item.id, name: item.displayName })),
        [unitConfig.leadSubstages, assignment.stageId],
    );

    const formOptions = useMemo(() => {
        const seen = new Map<string, string>();

        rows.forEach(row => seen.set(row.formId, row.formName || row.formId));

        return [...seen.entries()].map(([id, name]) => ({ id, name }));
    }, [rows]);

    const visibleRows = useMemo(() => {
        const term = filters.searchString.trim().toLowerCase();

        return rows.filter(
            row =>
                (!filters.formId || row.formId === filters.formId) &&
                (!term ||
                    [
                        row.studentName,
                        row.phone,
                        row.email,
                        row.leadgenId,
                        row.formName,
                        ...row.answers.map(answer => answer.answer),
                    ].some(value =>
                        String(value || "")
                            .toLowerCase()
                            .includes(term),
                    )),
        );
    }, [rows, filters]);

    const paginatedRows = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return visibleRows.slice(start, start + pagination.pageSize);
    }, [visibleRows, pagination]);

    const isFiltered = visibleRows.length !== rows.length;

    const assignmentSummary = [
        unitConfig.leadPipelines.find(
            item => item.id === assignment.pipelineId,
        )?.displayName,
        unitConfig.pipelineStages.find(item => item.id === assignment.stageId)
            ?.displayName,
        crmUsers.find(user => user.id === assignment.ownerEmployeeId)?.name,
        settingsBranches.find(branch => branch.id === assignment.branchId)
            ?.name,
    ]
        .filter(Boolean)
        .join(" · ");

    const filterChangeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setFilters(current => ({ ...current, [name]: value }));
        setPagination(current => ({ ...current, pageNo: 0 }));
    };

    const clearFiltersHandler = () =>
        setFilters({ searchString: "", formId: "" });

    const toggleSelectAllHandler = () =>
        setSelectedIds(current =>
            visibleRows.every(row => current.includes(row.leadgenId))
                ? current.filter(
                    id => !visibleRows.some(row => row.leadgenId === id),
                )
                : [
                    ...new Set([
                        ...current,
                        ...visibleRows.map(row => row.leadgenId),
                    ]),
                ],
        );

    const toggleSelectHandler = (leadgenId: string) =>
        setSelectedIds(current =>
            current.includes(leadgenId)
                ? current.filter(id => id !== leadgenId)
                : [...current, leadgenId],
        );

    const approveHandler = (ids: Array<string>) => {
        setRows(current =>
            current.filter(row => !ids.includes(row.leadgenId)),
        );
        setSelectedIds(current => current.filter(id => !ids.includes(id)));
        toast.success(
            ids.length === 1
                ? "Lead added to the CRM"
                : `${ids.length} added · 0 already in the CRM · 0 could not be added`,
        );
    };

    const discardHandler = () => {
        const ids = discardConfirmState.modalData as Array<string>;

        setRows(current =>
            current.filter(row => !ids.includes(row.leadgenId)),
        );
        setSelectedIds(current => current.filter(id => !ids.includes(id)));
        closeDiscardConfirm();
        toast.success(
            `${ids.length} lead${ids.length === 1 ? "" : "s"} discarded`,
        );
    };

    const exportHandler = () => {
    };

    const columns = [
        {
            Header: () => (
                <InputCheckbox
                    name="selectAllPendingLeads"
                    formgroupClassName="tw-mb-0"
                    value={
                        visibleRows.length > 0 &&
                        visibleRows.every(row =>
                            selectedIds.includes(row.leadgenId),
                        )
                    }
                    onChange={toggleSelectAllHandler}
                />
            ),
            id: "select",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: PendingMetaLead };
            }) => (
                <InputCheckbox
                    name={`select-${original.leadgenId}`}
                    formgroupClassName="tw-mb-0"
                    value={selectedIds.includes(original.leadgenId)}
                    onChange={() => toggleSelectHandler(original.leadgenId)}
                />
            ),
        },
        {
            Header: "Lead",
            accessor: "studentName",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: PendingMetaLead };
            }) => (
                <div>
                    <p
                        className={`tw-mb-0 tw-text-sm tw-font-medium ${original.studentName
                            ? "tw-text-gray-800"
                            : "tw-text-danger"
                            }`}
                    >
                        {original.studentName || "No name mapped"}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {original.email || original.leadgenId}
                    </p>
                </div>
            ),
        },
        {
            Header: "Phone",
            accessor: "phone",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: PendingMetaLead };
            }) => (
                <span
                    className={`tw-text-sm ${original.phone ? "tw-text-gray-800" : "tw-text-danger"}`}
                >
                    {original.phone || "not mapped"}
                </span>
            ),
        },
        {
            Header: "Form",
            accessor: "formName",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: PendingMetaLead };
            }) => (
                <div>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-800">
                        {original.formName || original.formId}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {original.pageName || original.pageId}
                    </p>
                </div>
            ),
        },
        {
            Header: "Received",
            accessor: "receivedAt",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: PendingMetaLead };
            }) => (
                <span className="tw-whitespace-nowrap tw-text-xs tw-text-gray-500">
                    {formatDateTime(original.receivedAt)}
                </span>
            ),
        },
        {
            Header: "Actions",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: PendingMetaLead };
            }) => (
                <div className="tw-flex tw-flex-wrap tw-gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        title={
                            expandedId === original.leadgenId
                                ? "Hide answers"
                                : "Show answers"
                        }
                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                        onClick={() =>
                            setExpandedId(
                                expandedId === original.leadgenId
                                    ? ""
                                    : original.leadgenId,
                            )
                        }
                    >
                        <i
                            className={
                                expandedId === original.leadgenId
                                    ? "ri-arrow-up-s-line"
                                    : "ri-arrow-down-s-line"
                            }
                        ></i>
                    </Button>

                    <Button
                        type="button"
                        variant="hoverInfo"
                        title={`Add ${original.studentName || original.leadgenId} to the CRM`}
                        onClick={() => approveHandler([original.leadgenId])}
                    >
                        Add to CRM
                    </Button>

                    <Button
                        type="button"
                        variant="wrong"
                        title={`Discard ${original.studentName || original.leadgenId}`}
                        onClick={() =>
                            openDiscardConfirm([original.leadgenId])
                        }
                    >
                        Discard
                    </Button>
                </div>
            ),
        },
    ];

    const expandedRow = rows.find(row => row.leadgenId === expandedId);

    return (
        <div className="tw-card">
            <div className="tw-card-body">
                <div className="tw-mb-1 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                    <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                        Review Meta leads ({rows.length})
                    </p>

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={!visibleRows.length}
                        title={
                            visibleRows.length
                                ? "Download this list as CSV"
                                : "Nothing to export"
                        }
                        onClick={exportHandler}
                    >
                        <i className="ri-download-2-line"></i>
                        Export
                    </Button>
                </div>

                <p className="tw-mb-3 tw-text-xs tw-text-gray-500">
                    {rows.length
                        ? "Leads collected from Meta, not yet in the CRM. Open a row to see the questions and answers exactly as Meta sent them."
                        : "Nothing waiting. Leads collected from Meta appear here before they become CRM leads."}
                </p>

                {rows.length > 0 && (
                    <div className="row tw-items-end tw-gap-y-3">
                        <div className="col-12 col-md-6 col-xl-4">
                            <TextIconInput
                                formgroupClassName="search-box tw-mb-0"
                                name="searchString"
                                value={filters.searchString}
                                onChange={filterChangeHandler}
                                placeHolder="Search name, phone, email or answer…"
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
                        </div>

                        <div className="col-12 col-md-6 col-xl-3">
                            <SelectInput
                                name="formId"
                                labelText="Form"
                                defaultSelect="All forms"
                                value={filters.formId}
                                onChange={filterChangeHandler}
                                menuItems={formOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        {isFiltered && (
                            <div className="col-12 col-xl-3">
                                <div className="tw-flex tw-items-center tw-gap-2">
                                    <span className="tw-text-xs tw-text-gray-500">
                                        {visibleRows.length} of {rows.length}
                                    </span>

                                    <Button
                                        type="button"
                                        variant="linkBtn"
                                        className="tw-p-0"
                                        title="Clear filters"
                                        onClick={clearFiltersHandler}
                                    >
                                        Clear filters
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {visibleRows.length > 0 && (
                    <div className="tw-mt-3 tw-rounded tw-border tw-border-gray-200">
                        <Button
                            type="button"
                            variant="sidebarMenu"
                            className="!tw-w-full !tw-justify-start tw-gap-2 tw-px-3 tw-py-2 tw-text-sm tw-font-semibold tw-text-gray-700"
                            onClick={() =>
                                setIsAssignmentOpen(current => !current)
                            }
                        >
                            <i
                                className={`ri-arrow-${isAssignmentOpen ? "down" : "right"}-s-line`}
                            ></i>
                            Where added leads go
                            <span className="tw-ms-2 tw-text-xs tw-font-normal tw-text-gray-500">
                                {assignmentSummary ||
                                    "Using each form's own routing"}
                            </span>
                        </Button>

                        {isAssignmentOpen && (
                            <div className="tw-border-t tw-border-gray-200 tw-p-3">
                                <div className="row tw-items-end tw-gap-y-3">
                                    <div className="col-12 col-md-6 col-xl-3">
                                        <SelectInput
                                            name="pipelineId"
                                            labelText="Pipeline"
                                            defaultSelect="Form default"
                                            value={assignment.pipelineId}
                                            onChange={(
                                                event: ChangeEvent<HTMLSelectElement>,
                                            ) =>
                                                setAssignment(current => ({
                                                    ...current,
                                                    pipelineId:
                                                        event.target.value,
                                                    stageId: "",
                                                    substageId: "",
                                                }))
                                            }
                                            menuItems={unitConfig.leadPipelines.map(
                                                item => ({
                                                    id: item.id,
                                                    name: item.displayName,
                                                }),
                                            )}
                                            valueKey="id"
                                            textKey="name"
                                            formgroupClassName="tw-mb-0"
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 col-xl-3">
                                        <SelectInput
                                            name="stageId"
                                            labelText="Stage"
                                            defaultSelect="Form default"
                                            value={assignment.stageId}
                                            onChange={(
                                                event: ChangeEvent<HTMLSelectElement>,
                                            ) =>
                                                setAssignment(current => ({
                                                    ...current,
                                                    stageId: event.target.value,
                                                    substageId: "",
                                                }))
                                            }
                                            menuItems={stageOptions}
                                            valueKey="id"
                                            textKey="name"
                                            formgroupClassName="tw-mb-0"
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 col-xl-3">
                                        <SelectInput
                                            name="substageId"
                                            labelText="Sub-stage"
                                            defaultSelect={
                                                assignment.stageId
                                                    ? "Form default"
                                                    : "Choose a stage first"
                                            }
                                            value={assignment.substageId}
                                            isDisabled={!assignment.stageId}
                                            onChange={(
                                                event: ChangeEvent<HTMLSelectElement>,
                                            ) =>
                                                setAssignment(current => ({
                                                    ...current,
                                                    substageId:
                                                        event.target.value,
                                                }))
                                            }
                                            menuItems={substageOptions}
                                            valueKey="id"
                                            textKey="name"
                                            formgroupClassName="tw-mb-0"
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 col-xl-3">
                                        <SelectInput
                                            name="ownerEmployeeId"
                                            labelText="Lead Owner"
                                            defaultSelect="Form default"
                                            value={assignment.ownerEmployeeId}
                                            onChange={(
                                                event: ChangeEvent<HTMLSelectElement>,
                                            ) =>
                                                setAssignment(current => ({
                                                    ...current,
                                                    ownerEmployeeId:
                                                        event.target.value,
                                                }))
                                            }
                                            menuItems={crmUsers}
                                            valueKey="id"
                                            textKey="name"
                                            formgroupClassName="tw-mb-0"
                                        />
                                    </div>

                                    <div className="col-12 col-md-6 col-xl-3">
                                        <SelectInput
                                            name="branchId"
                                            labelText="Branch"
                                            defaultSelect="Form default"
                                            value={assignment.branchId}
                                            onChange={(
                                                event: ChangeEvent<HTMLSelectElement>,
                                            ) =>
                                                setAssignment(current => ({
                                                    ...current,
                                                    branchId:
                                                        event.target.value,
                                                }))
                                            }
                                            menuItems={settingsBranches}
                                            valueKey="id"
                                            textKey="name"
                                            formgroupClassName="tw-mb-0"
                                        />
                                    </div>

                                    {assignmentSummary && (
                                        <div className="col-12 col-md-6 col-xl-3">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() =>
                                                    setAssignment(
                                                        emptyAssignment,
                                                    )
                                                }
                                            >
                                                Clear
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {selectedIds.length > 0 && (
                    <div className="tw-mt-3 tw-flex tw-flex-wrap tw-items-center tw-gap-2 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-px-3 tw-py-2">
                        <span className="tw-text-sm tw-font-semibold tw-text-gray-800">
                            {selectedIds.length} selected
                        </span>

                        <Button
                            type="button"
                            variant="linkBtn"
                            className="tw-p-0"
                            onClick={() => setSelectedIds([])}
                        >
                            Clear
                        </Button>

                        <div className="tw-ms-auto tw-flex tw-flex-wrap tw-gap-2">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => approveHandler(selectedIds)}
                            >
                                Add {selectedIds.length} to CRM
                            </Button>

                            <Button
                                type="button"
                                variant="wrong"
                                onClick={() =>
                                    openDiscardConfirm(selectedIds)
                                }
                            >
                                Discard {selectedIds.length}
                            </Button>
                        </div>
                    </div>
                )}

                {!rows.length ? (
                    <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                        No leads waiting.
                    </p>
                ) : !visibleRows.length ? (
                    <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                        No leads match these filters.
                    </p>
                ) : (
                    <div className="tw-mt-3">
                        <TableContainer
                            columns={columns}
                            data={paginatedRows}
                            tableClass="mb-0"
                            divClass="table-responsive mb-3"
                            theadClass="table-light text-muted align-middle"
                            showPagination
                            totalPages={Math.ceil(
                                visibleRows.length / pagination.pageSize,
                            )}
                            totalRecords={visibleRows.length}
                            currentPageNumber={pagination.pageNo}
                            pageSize={pagination.pageSize}
                            callbackPaginationHndlr={(state: {
                                pageNo: number;
                                pageSize: number;
                            }) => setPagination(state)}
                        />
                    </div>
                )}

                {expandedRow && (
                    <div className="tw-mt-2 tw-rounded tw-border tw-border-gray-200 tw-p-3">
                        <div className="tw-mb-2 tw-flex tw-flex-wrap tw-gap-3">
                            <span className="tw-text-xs tw-text-gray-700">
                                Name:{" "}
                                <strong
                                    className={
                                        expandedRow.studentName
                                            ? ""
                                            : "tw-text-danger"
                                    }
                                >
                                    {expandedRow.studentName || "not mapped"}
                                </strong>
                            </span>

                            <span className="tw-text-xs tw-text-gray-700">
                                Phone:{" "}
                                <strong
                                    className={
                                        expandedRow.phone
                                            ? ""
                                            : "tw-text-danger"
                                    }
                                >
                                    {expandedRow.phone || "not mapped"}
                                </strong>
                            </span>

                            {expandedRow.email && (
                                <span className="tw-text-xs tw-text-gray-700">
                                    Email: <strong>{expandedRow.email}</strong>
                                </span>
                            )}

                            {expandedRow.unmappedCount > 0 && (
                                <span className="tw-text-xs tw-text-danger">
                                    {expandedRow.unmappedCount} unmapped question
                                    {expandedRow.unmappedCount === 1 ? "" : "s"}
                                </span>
                            )}
                        </div>

                        <div className="table-responsive">
                            <table className="table table-sm align-middle mb-0">
                                <thead className="table-light text-muted">
                                    <tr>
                                        <th>Question</th>
                                        <th>Answer</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {expandedRow.answers.map(
                                        (answer, index) => (
                                            <tr
                                                key={`${answer.question}-${index}`}
                                            >
                                                <td className="tw-text-sm tw-text-gray-700">
                                                    {answer.question}
                                                </td>
                                                <td className="tw-text-sm tw-text-gray-800">
                                                    {answer.answer || (
                                                        <em className="tw-text-gray-400">
                                                            blank
                                                        </em>
                                                    )}
                                                </td>
                                            </tr>
                                        ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            <ConfirmationModal
                id="crm-automations-meta-review-discard"
                isOpen={discardConfirmState.showModal}
                iconType="reject"
                confirmTitle="Discard Meta leads"
                confirmMessage={
                    discardConfirmState.modalData
                        ? `Leave ${(discardConfirmState.modalData as Array<string>).length} lead(s) out of the CRM?`
                        : ""
                }
                confirmBtnText="Discard"
                cancelHndlr={closeDiscardConfirm}
                confirmHndlr={discardHandler}
            />
        </div>
    );
};

export default MetaLeadReviewTab;

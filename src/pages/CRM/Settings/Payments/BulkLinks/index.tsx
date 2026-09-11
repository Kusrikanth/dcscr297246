import { useMemo, useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import {
    Button,
    ConfirmationModal,
    ModalContainerUpdated,
    SelectInput,
    StatusLabel,
    TextIconInput,
} from "../../../../../Components/Common";
import { useModal } from "../../../../../hooks/modalhook";
import { CustomDatePicker } from "../../../../DashBoardBranchSummary/CustomDatePicker";
import { formatDateTime, settingsBranches } from "../../helper";
import NewUploadModal from "./NewUploadModal";
import {
    batchStatusTone,
    bulkLinkBatches,
    bulkLinkStatusOptions,
    moneyText,
    rowStatusTone,
    type BulkLinkBatch,
} from "./helper";

const emptyFilters = {
    searchString: "",
    status: "",
    branchId: "",
    fromDate: "",
    toDate: "",
};

const BulkLinks = () => {
    const [batches, setBatches] =
        useState<Array<BulkLinkBatch>>(bulkLinkBatches);
    const [filters, setFilters] = useState(emptyFilters);
    const [openBatchId, setOpenBatchId] = useState<string>("");

    const { openModal, closeModal, modalState } = useModal();
    const {
        openModal: openCancelConfirm,
        closeModal: closeCancelConfirm,
        modalState: cancelConfirmState,
    } = useModal();

    const visibleBatches = useMemo(() => {
        const term = filters.searchString.trim().toLowerCase();

        return batches.filter(batch => {
            const day = (batch.createdAt || "").slice(0, 10);

            return (
                (!term ||
                    `${batch.fileName} ${batch.branchName} ${batch.createdBy}`
                        .toLowerCase()
                        .includes(term)) &&
                (!filters.status || batch.status === filters.status) &&
                (!filters.branchId || batch.branchId === filters.branchId) &&
                (!filters.fromDate || day >= filters.fromDate) &&
                (!filters.toDate || day <= filters.toDate)
            );
        });
    }, [batches, filters]);

    const totals = useMemo(
        () =>
            visibleBatches.reduce(
                (sum, batch) => ({
                    uploads: sum.uploads + 1,
                    sent: sum.sent + batch.totalRows,
                    amount: sum.amount + batch.totalAmount,
                    collected: sum.collected + batch.paidAmount,
                }),
                { uploads: 0, sent: 0, amount: 0, collected: 0 },
            ),
        [visibleBatches],
    );

    const isFiltered = Boolean(
        filters.searchString ||
        filters.status ||
        filters.branchId ||
        filters.fromDate ||
        filters.toDate,
    );

    const stats = [
        { id: "uploads", label: "Uploads", value: String(totals.uploads) },
        { id: "sent", label: "Links sent", value: String(totals.sent) },
        { id: "amount", label: "Value", value: moneyText(totals.amount) },
        {
            id: "collected",
            label: "Collected",
            value: moneyText(totals.collected),
            tone: "tw-text-emerald-700",
        },
    ];

    const filterChangeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setFilters(current => ({ ...current, [name]: value }));
    };

    const dateRangeChangeHandler = (dates: {
        startDate: string;
        endDate: string;
    }) =>
        setFilters(current => ({
            ...current,
            fromDate: dates.startDate,
            toDate: dates.endDate,
        }));

    const clearFiltersHandler = () => setFilters(emptyFilters);

    const queueHandler = (payload: {
        fileName: string;
        branchId: string;
        templateId: string;
        rowCount: number;
        totalAmount: number;
    }) => {
        setBatches(current => [
            {
                id: `batch-${Date.now()}`,
                fileName: payload.fileName || "upload.csv",
                branchId: payload.branchId,
                branchName:
                    settingsBranches.find(
                        branch => branch.id === payload.branchId,
                    )?.name || "",
                templateName: payload.templateId ? "fee_reminder_link" : "",
                createdBy: "ARJUN",
                createdAt: new Date().toISOString(),
                totalRows: payload.rowCount,
                totalAmount: payload.totalAmount,
                paidRows: 0,
                paidAmount: 0,
                status: "queued",
                rows: [],
            },
            ...current,
        ]);

        toast.success(`${payload.rowCount} payment links queued`);
    };

    const cancelHandler = () => {
        const batch = cancelConfirmState.modalData as BulkLinkBatch;

        setBatches(current =>
            current.map(item =>
                item.id === batch.id ? { ...item, status: "cancelled" } : item,
            ),
        );

        closeCancelConfirm();
        toast.success("Upload cancelled. Links already sent are unaffected.");
    };

    const exportHandler = () => {
    };

    return (
        <>
            <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                <div>
                    <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                        Bulk payment links
                    </p>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                        Raise a payment link for every mobile number in an
                        uploaded file, and send each one on WhatsApp.
                    </p>
                </div>

                <div className="tw-flex tw-flex-wrap tw-gap-2">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => toast.success("Upload history refreshed")}
                    >
                        <i className="ri-refresh-line"></i>
                        Refresh
                    </Button>

                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => openModal()}
                    >
                        <i className="ri-add-line"></i>
                        New Upload
                    </Button>
                </div>
            </div>

            <div className="row tw-mb-3 tw-gap-y-3">
                {stats.map(stat => (
                    <div key={stat.id} className="col-6 col-md-3">
                        <div className="tw-card tw-h-full">
                            <div className="tw-card-body">
                                <p
                                    className={`tw-mb-0 tw-text-xl tw-font-semibold ${stat.tone || "tw-text-gray-800"}`}
                                >
                                    {stat.value}
                                </p>
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    {stat.label}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="tw-card">
                <div className="tw-card-body">
                    <div className="row tw-items-end tw-gap-y-3">
                        <div className="col-12 col-md-6 col-xl-3">
                            <TextIconInput
                                formgroupClassName="search-box tw-mb-0"
                                name="searchString"
                                value={filters.searchString}
                                onChange={filterChangeHandler}
                                placeHolder="Search file, branch or who uploaded"
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
                        </div>

                        <div className="col-12 col-md-6 col-xl-2">
                            <SelectInput
                                name="status"
                                labelText="Status"
                                defaultSelect="Any status"
                                value={filters.status}
                                onChange={filterChangeHandler}
                                menuItems={bulkLinkStatusOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-2">
                            <SelectInput
                                name="branchId"
                                labelText="Branch"
                                defaultSelect="All branches"
                                value={filters.branchId}
                                onChange={filterChangeHandler}
                                menuItems={settingsBranches}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-3">
                            <CustomDatePicker
                                name="uploadedRange"
                                labelText="Uploaded"
                                startDate={filters.fromDate}
                                endDate={filters.toDate}
                                onChange={dateRangeChangeHandler}
                                placeholder="Select date range"
                                monthsShown={2}
                                formgroupClassName="tw-mb-0"
                                portalId="crm-bulk-links-date-filter"
                                floatingLabel
                            />
                            <div id="crm-bulk-links-date-filter"></div>
                        </div>

                        <div className="col-12 col-md-6 col-xl-2">
                            <div className="tw-flex tw-flex-wrap tw-gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={!visibleBatches.length}
                                    title={
                                        visibleBatches.length
                                            ? "Download this list as CSV"
                                            : "Nothing to export"
                                    }
                                    onClick={exportHandler}
                                >
                                    <i className="ri-download-2-line"></i>
                                    Export
                                </Button>

                                {isFiltered && (
                                    <Button
                                        type="button"
                                        variant="reject"
                                        onClick={clearFiltersHandler}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {!visibleBatches.length ? (
                        <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                            {batches.length
                                ? "No uploads match these filters."
                                : "No uploads yet. Use New Upload to raise links in bulk."}
                        </p>
                    ) : (
                        <div className="tw-mt-3 table-responsive">
                            <table className="table table-sm align-middle mb-0">
                                <thead className="table-light text-muted">
                                    <tr>
                                        <th></th>
                                        <th>File</th>
                                        <th>Branch</th>
                                        <th>Uploaded</th>
                                        <th>Sent</th>
                                        <th>Value</th>
                                        <th>Collected</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {visibleBatches.map(batch => (
                                        <>
                                            <tr key={batch.id}>
                                                <td>
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        title={
                                                            openBatchId ===
                                                                batch.id
                                                                ? "Hide rows"
                                                                : "Show rows"
                                                        }
                                                        className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                                        onClick={() =>
                                                            setOpenBatchId(
                                                                openBatchId ===
                                                                    batch.id
                                                                    ? ""
                                                                    : batch.id,
                                                            )
                                                        }
                                                    >
                                                        <i
                                                            className={
                                                                openBatchId ===
                                                                    batch.id
                                                                    ? "ri-arrow-up-s-line"
                                                                    : "ri-arrow-down-s-line"
                                                            }
                                                        ></i>
                                                    </Button>
                                                </td>

                                                <td>
                                                    <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                        {batch.fileName}
                                                    </p>
                                                    {batch.templateName && (
                                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                            {batch.templateName}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="tw-text-sm tw-text-gray-700">
                                                    {batch.branchName || "—"}
                                                </td>

                                                <td>
                                                    <p className="tw-mb-0 tw-whitespace-nowrap tw-text-xs tw-text-gray-500">
                                                        {formatDateTime(
                                                            batch.createdAt,
                                                        )}
                                                    </p>
                                                    {batch.createdBy && (
                                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                            {batch.createdBy}
                                                        </p>
                                                    )}
                                                </td>

                                                <td className="tw-text-sm tw-text-gray-800">
                                                    {batch.totalRows}
                                                </td>

                                                <td className="tw-whitespace-nowrap tw-text-sm tw-text-gray-800">
                                                    {moneyText(batch.totalAmount)}
                                                </td>

                                                <td>
                                                    <p
                                                        className={`tw-mb-0 tw-whitespace-nowrap tw-text-sm ${batch.paidRows > 0
                                                            ? "tw-font-semibold tw-text-emerald-700"
                                                            : "tw-text-gray-800"
                                                            }`}
                                                    >
                                                        {moneyText(
                                                            batch.paidAmount,
                                                        )}
                                                    </p>
                                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                        {batch.paidRows} of{" "}
                                                        {batch.totalRows} paid
                                                    </p>
                                                </td>

                                                <td>
                                                    <StatusLabel
                                                        type={batchStatusTone(
                                                            batch.status,
                                                        )}
                                                        labelName={batch.status}
                                                    />
                                                </td>

                                                <td>
                                                    <div className="tw-flex tw-flex-wrap tw-gap-2">
                                                        <Button
                                                            type="button"
                                                            variant="hoverInfo"
                                                            title="Export these rows as CSV"
                                                            onClick={
                                                                exportHandler
                                                            }
                                                        >
                                                            Export
                                                        </Button>

                                                        {[
                                                            "queued",
                                                            "running",
                                                        ].includes(
                                                            batch.status,
                                                        ) && (
                                                                <Button
                                                                    type="button"
                                                                    variant="wrong"
                                                                    title="Cancel what has not been sent"
                                                                    onClick={() =>
                                                                        openCancelConfirm(
                                                                            batch,
                                                                        )
                                                                    }
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            )}
                                                    </div>
                                                </td>
                                            </tr>

                                            {openBatchId === batch.id && (
                                                <tr key={`${batch.id}-detail`}>
                                                    <td colSpan={9}>
                                                        {batch.rows.length ? (
                                                            <div className="table-responsive">
                                                                <table className="table table-sm align-middle mb-0">
                                                                    <thead className="table-light text-muted">
                                                                        <tr>
                                                                            <th>#</th>
                                                                            <th>Mobile</th>
                                                                            <th>Name</th>
                                                                            <th>Amount</th>
                                                                            <th>Lead</th>
                                                                            <th>Status</th>
                                                                            <th>Detail</th>
                                                                        </tr>
                                                                    </thead>

                                                                    <tbody>
                                                                        {batch.rows.map(
                                                                            row => (
                                                                                <tr
                                                                                    key={
                                                                                        row.id
                                                                                    }
                                                                                >
                                                                                    <td className="tw-text-xs tw-text-gray-500">
                                                                                        {
                                                                                            row.rowNumber
                                                                                        }
                                                                                    </td>
                                                                                    <td className="tw-text-sm tw-text-gray-800">
                                                                                        {
                                                                                            row.phone
                                                                                        }
                                                                                    </td>
                                                                                    <td className="tw-text-sm tw-text-gray-700">
                                                                                        {row.name || (
                                                                                            <span className="tw-text-gray-400">
                                                                                                From
                                                                                                the
                                                                                                lead
                                                                                            </span>
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="tw-whitespace-nowrap tw-text-sm tw-text-gray-800">
                                                                                        {moneyText(
                                                                                            row.amount,
                                                                                        )}
                                                                                    </td>
                                                                                    <td className="tw-font-mono tw-text-xs tw-text-[#405189]">
                                                                                        {row.leadNumber ||
                                                                                            "—"}
                                                                                    </td>
                                                                                    <td>
                                                                                        <StatusLabel
                                                                                            type={rowStatusTone(
                                                                                                row.status,
                                                                                            )}
                                                                                            labelName={
                                                                                                row.status
                                                                                            }
                                                                                        />
                                                                                    </td>
                                                                                    <td>
                                                                                        {row.error ? (
                                                                                            <span className="tw-text-xs tw-text-danger">
                                                                                                {
                                                                                                    row.error
                                                                                                }
                                                                                            </span>
                                                                                        ) : (
                                                                                            <span className="tw-text-xs tw-text-gray-500">
                                                                                                {row.paymentStatus ||
                                                                                                    "—"}
                                                                                            </span>
                                                                                        )}
                                                                                    </td>
                                                                                </tr>
                                                                            ),
                                                                        )}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <p className="tw-mb-0 tw-py-2 tw-text-center tw-text-sm tw-text-gray-500">
                                                                No rows recorded for
                                                                this upload yet.
                                                            </p>
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <ModalContainerUpdated
                id="crm-settings-bulk-links-upload"
                isOpen={modalState.showModal}
                toggle={closeModal}
                modalTitle="New bulk upload"
                modalSize="xl"
            >
                <NewUploadModal toggle={closeModal} onQueue={queueHandler} />
            </ModalContainerUpdated>

            <ConfirmationModal
                id="crm-settings-bulk-links-cancel"
                isOpen={cancelConfirmState.showModal}
                iconType="reject"
                confirmTitle="Cancel upload"
                confirmMessage={
                    cancelConfirmState.modalData
                        ? `Cancel "${(cancelConfirmState.modalData as BulkLinkBatch).fileName}"?`
                        : ""
                }
                noteMessage="Links already sent are unaffected."
                confirmBtnText="Cancel upload"
                cancelHndlr={closeCancelConfirm}
                confirmHndlr={cancelHandler}
            />
        </>
    );
};

export default BulkLinks;

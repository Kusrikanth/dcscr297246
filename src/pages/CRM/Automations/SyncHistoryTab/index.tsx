import { useMemo, useState, type ChangeEvent } from "react";
import { toast } from "react-toastify";

import {
    Button,
    SelectInput,
    StatusLabel,
    TextIconInput,
} from "../../../../Components/Common";
import { formatDateTime } from "../../Settings/helper";
import {
    remarketingSyncLogs,
    syncLogStatusOptions,
} from "../RemarketingTab/helper";

const SyncHistoryTab = () => {
    const [filters, setFilters] = useState({ searchString: "", status: "" });

    const visibleLogs = useMemo(() => {
        const term = filters.searchString.trim().toLowerCase();

        return remarketingSyncLogs.filter(
            log =>
                (!term ||
                    `${log.audienceName} ${log.metaAudienceId}`
                        .toLowerCase()
                        .includes(term)) &&
                (!filters.status || log.status === filters.status),
        );
    }, [filters]);

    const isFiltered = visibleLogs.length !== remarketingSyncLogs.length;

    const filterChangeHandler = (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;

        setFilters(current => ({ ...current, [name]: value }));
    };

    const clearFiltersHandler = () =>
        setFilters({ searchString: "", status: "" });

    const statusTone = (status: string) => {
        if (status === "completed") {
            return "active";
        }

        if (status === "failed") {
            return "failed";
        }

        if (status === "partial") {
            return "pending";
        }

        return "new";
    };

    const exportHandler = () => {
    };

    return (
        <div className="tw-card">
            <div className="tw-card-body">
                <div className="tw-mb-1 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                    <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                        Sync history ({remarketingSyncLogs.length})
                    </p>

                    <div className="tw-flex tw-flex-wrap tw-gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={!visibleLogs.length}
                            title={
                                visibleLogs.length
                                    ? "Download this list as CSV"
                                    : "Nothing to export"
                            }
                            onClick={exportHandler}
                        >
                            <i className="ri-download-2-line"></i>
                            Export
                        </Button>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => toast.success("Sync history refreshed")}
                        >
                            <i className="ri-refresh-line"></i>
                            Refresh
                        </Button>
                    </div>
                </div>

                <div className="row tw-items-end tw-gap-y-3">
                    <div className="col-12 col-md-6 col-xl-4">
                        <TextIconInput
                            formgroupClassName="search-box tw-mb-0"
                            name="searchString"
                            value={filters.searchString}
                            onChange={filterChangeHandler}
                            placeHolder="Search audience or Meta ID…"
                        >
                            <i className="ri-search-line search-icon"></i>
                        </TextIconInput>
                    </div>

                    <div className="col-12 col-md-6 col-xl-3">
                        <SelectInput
                            name="status"
                            labelText="Status"
                            defaultSelect="Any status"
                            value={filters.status}
                            onChange={filterChangeHandler}
                            menuItems={syncLogStatusOptions}
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
                                    {visibleLogs.length} of{" "}
                                    {remarketingSyncLogs.length}
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

                {!visibleLogs.length ? (
                    <p className="tw-mb-0 tw-py-4 tw-text-center tw-text-sm tw-text-gray-500">
                        {remarketingSyncLogs.length
                            ? "No runs match these filters."
                            : "No syncs have run yet."}
                    </p>
                ) : (
                    <div className="tw-mt-3 table-responsive">
                        <table className="table table-sm align-middle mb-0">
                            <thead className="table-light text-muted">
                                <tr>
                                    <th>Audience</th>
                                    <th>Action</th>
                                    <th>Status</th>
                                    <th>Started</th>
                                    <th>Completed</th>
                                    <th>Considered</th>
                                    <th>Added</th>
                                    <th>Removed</th>
                                    <th>Failed</th>
                                    <th>Triggered by</th>
                                </tr>
                            </thead>

                            <tbody>
                                {visibleLogs.map(log => (
                                    <tr key={log.id}>
                                        <td>
                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                {log.audienceName}
                                            </p>
                                            <p className="tw-mb-0 tw-font-mono tw-text-xs tw-text-gray-500">
                                                {log.metaAudienceId ||
                                                    "not created at Meta"}
                                            </p>
                                            {log.errorMessage && (
                                                <p
                                                    className="tw-mb-0 tw-text-xs tw-text-danger"
                                                    title={log.errorMessage}
                                                >
                                                    {log.errorMessage}
                                                </p>
                                            )}
                                        </td>

                                        <td className="tw-text-xs tw-text-gray-700">
                                            {log.action}
                                        </td>

                                        <td>
                                            <StatusLabel
                                                type={statusTone(log.status)}
                                                labelName={log.status}
                                            />
                                        </td>

                                        <td className="tw-whitespace-nowrap tw-text-xs tw-text-gray-500">
                                            {formatDateTime(log.startedAt)}
                                        </td>

                                        <td className="tw-whitespace-nowrap tw-text-xs tw-text-gray-500">
                                            {formatDateTime(log.completedAt) ||
                                                "—"}
                                        </td>

                                        <td className="tw-text-sm tw-text-gray-800">
                                            {log.leadsConsidered}
                                        </td>

                                        <td className="tw-text-sm tw-text-gray-800">
                                            {log.leadsAdded}
                                        </td>

                                        <td className="tw-text-sm tw-text-gray-800">
                                            {log.leadsRemoved}
                                        </td>

                                        <td className="tw-text-sm tw-text-gray-800">
                                            {log.leadsFailed}
                                        </td>

                                        <td className="tw-text-xs tw-text-gray-700">
                                            {log.triggeredBy}
                                            {log.triggeredByUser
                                                ? ` · ${log.triggeredByUser}`
                                                : ""}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SyncHistoryTab;

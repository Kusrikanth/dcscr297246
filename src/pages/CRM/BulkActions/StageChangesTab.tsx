import {
    useCallback,
    useMemo,
    useState,
    type MouseEvent,
} from "react";

import TableContainer from "../../../Components/Common/TableContainer";
import { type IOptionsHrtl } from "../../../Components/Common/MenuOptions";
import {
    actionsColumn,
    formatDateTime,
    initialPagination,
    type BulkOperationRecord,
} from "./helper";
import { StatusBadge } from "./StatusBadge";

interface StageChangesTabProps {
    operations: BulkOperationRecord[];
}

const generateColumns = (
    actionOptions: Array<IOptionsHrtl>,
) => [
        {
            Header: "Operation",
            accessor: "type",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: BulkOperationRecord };
            }) => (
                <div className="tw-max-w-sm">
                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                        {original.type}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {original.description ||
                            "Lead stage updated"}
                    </p>
                </div>
            ),
        },
        {
            Header: "Status",
            accessor: "status",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: BulkOperationRecord };
            }) => <StatusBadge status={original.status} />,
        },
        {
            Header: "Total records",
            accessor: "affectedCount",
            disableSortBy: true,
        },
        {
            Header: "Successful",
            accessor: "successfulCount",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: BulkOperationRecord };
            }) => (
                <span className="tw-font-semibold tw-text-emerald-600">
                    {original.successfulCount}
                </span>
            ),
        },
        {
            Header: "Failed",
            accessor: "failureCount",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: BulkOperationRecord };
            }) => (
                <span
                    className={
                        original.failureCount
                            ? "tw-font-semibold tw-text-red-600"
                            : ""
                    }
                >
                    {original.failureCount}
                </span>
            ),
        },
        {
            Header: "Changed to",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: BulkOperationRecord };
            }) => (
                <span>
                    {[
                        original.stageName,
                        original.substageName,
                    ]
                        .filter(Boolean)
                        .join(" / ") || "—"}
                </span>
            ),
        },
        {
            Header: "Changed on",
            accessor: "createdAt",
            disableSortBy: true,
            Cell: ({
                row: { original },
            }: {
                row: { original: BulkOperationRecord };
            }) => (
                <div>
                    <p className="tw-mb-0 tw-text-sm tw-text-gray-800">
                        {formatDateTime(original.createdAt)}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {original.createdBy || "—"}
                    </p>
                </div>
            ),
        },
        actionsColumn(actionOptions),
    ];

const StageChangesTab = ({
    operations,
}: StageChangesTabProps) => {
    const [pagination, setPagination] = useState(
        initialPagination,
    );

    const paginatedOperations = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return operations.slice(
            start,
            start + pagination.pageSize,
        );
    }, [operations, pagination]);

    const findOperation = useCallback(
        (operationId: string | null) =>
            operations.find(item => item.id === operationId),
        [operations],
    );

    const downloadHandler = useCallback(() => {
    }, []);

    const actionOptions: Array<IOptionsHrtl> = useMemo(
        () => [
            {
                id: "download",
                actionIcon: (
                    <i className="ri-download-2-line text-primary fs-16"></i>
                ),
                actionName: "Download affected leads",
                onClickHndlr: (
                    event: MouseEvent<HTMLElement>,
                ) => {
                    const record = findOperation(
                        event.currentTarget.getAttribute(
                            "data-id",
                        ),
                    );

                    if (record) {
                        downloadHandler();
                    }
                },
            },
        ],
        [downloadHandler, findOperation],
    );

    const tableColumns = useMemo(
        () => generateColumns(actionOptions),
        [actionOptions],
    );

    return (
        <div className="tw-card-body !tw-p-0">
            <TableContainer
                columns={tableColumns}
                data={paginatedOperations}
                tableClass="mb-0"
                divClass="table-responsive mb-3"
                theadClass="table-light text-muted align-middle"
                showPagination
                totalPages={Math.ceil(
                    operations.length / pagination.pageSize,
                )}
                totalRecords={operations.length}
                currentPageNumber={pagination.pageNo}
                pageSize={pagination.pageSize}
                callbackPaginationHndlr={setPagination}
            />
        </div>
    );
};

export default StageChangesTab;

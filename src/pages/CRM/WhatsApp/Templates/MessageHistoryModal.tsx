import { useMemo, useState, type ChangeEvent } from "react";

import {
    Button,
    DateInput,
    SelectInput,
    StatusLabel,
    TextIconInput,
} from "../../../../Components/Common";
import TableContainer from "../../../../Components/Common/TableContainer";
import {
    formatDateTime,
    getStatusLabelType,
    messageHistoryRecords,
    messageStatusOptions,
    recentDaysRange,
    type MessageHistoryRecord,
} from "../helper";

interface HistoryRow {
    row: { original: MessageHistoryRecord };
}

interface PaginationState {
    pageNo: number;
    pageSize: number;
}

const initialPagination: PaginationState = { pageNo: 0, pageSize: 10 };

const historyColumns = [
    {
        Header: "Date",
        accessor: "sentAt",
        disableSortBy: true,

        Cell: ({ row: { original } }: HistoryRow) => (
            <span className="tw-whitespace-nowrap tw-text-sm tw-text-gray-700">
                {formatDateTime(original.sentAt)}
            </span>
        ),
    },
    {
        Header: "Account",
        accessor: "integrationName",
        disableSortBy: true,

        Cell: ({ row: { original } }: HistoryRow) => (
            <span className="tw-text-sm tw-text-gray-700">
                {original.integrationName || "—"}
            </span>
        ),
    },
    {
        Header: "Template",
        accessor: "templateName",
        disableSortBy: true,

        Cell: ({ row: { original } }: HistoryRow) => (
            <span className="tw-text-sm tw-text-gray-700">
                {original.templateName || "Custom message"}
            </span>
        ),
    },
    {
        Header: "Recipient",
        accessor: "phoneNumber",
        disableSortBy: true,

        Cell: ({ row: { original } }: HistoryRow) => (
            <span className="tw-text-sm tw-text-gray-700">
                {original.phoneNumber || "—"}
            </span>
        ),
    },
    {
        Header: "Status",
        accessor: "status",
        disableSortBy: true,

        Cell: ({ row: { original } }: HistoryRow) => (
            <StatusLabel
                type={getStatusLabelType(original.status)}
                labelName={original.status}
            />
        ),
    },
    {
        Header: "Failure Reason",
        accessor: "failureReason",
        disableSortBy: true,

        Cell: ({ row: { original } }: HistoryRow) => (
            <span className="tw-text-sm tw-text-gray-700">
                {original.failureReason || "—"}
            </span>
        ),
    },
];

const MessageHistoryModal = () => {
    const [searchString, setSearchString] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [dateRange, setDateRange] = useState(() => recentDaysRange(7));
    const [pagination, setPagination] =
        useState<PaginationState>(initialPagination);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const filteredRecords = useMemo(() => {
        const searchText = searchString.trim().toLowerCase();

        return messageHistoryRecords.filter(record => {
            const matchesSearch =
                !searchText ||
                [
                    record.phoneNumber,
                    record.templateName,
                    record.integrationName,
                ].some(value =>
                    String(value || "")
                        .toLowerCase()
                        .includes(searchText),
                );

            const matchesStatus = !status || record.status === status;

            const sentOn = record.sentAt ? record.sentAt.slice(0, 10) : "";
            const matchesFrom =
                !dateRange.startDate || sentOn >= dateRange.startDate;
            const matchesTo =
                !dateRange.endDate || sentOn <= dateRange.endDate;

            return (
                matchesSearch && matchesStatus && matchesFrom && matchesTo
            );
        });
    }, [dateRange, searchString, status]);

    const paginatedRecords = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return filteredRecords.slice(start, start + pagination.pageSize);
    }, [filteredRecords, pagination]);

    const dateChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setDateRange(prevState => ({ ...prevState, [name]: value }));
        setPagination(initialPagination);
    };

    const refreshHandler = () => {
        setIsRefreshing(true);
        window.setTimeout(() => setIsRefreshing(false), 400);
    };

    const exportHandler = () => {
    };

    return (
        <div className="tw-p-4">
            <div className="row tw-items-end tw-gap-y-3">
                <div className="col-12 col-md-6 col-xl-3">
                    <TextIconInput
                        formgroupClassName="search-box tw-mb-0"
                        name="historySearch"
                        value={searchString}
                        onChange={(event: ChangeEvent<HTMLInputElement>) => {
                            setSearchString(event.target.value);
                            setPagination(initialPagination);
                        }}
                        placeHolder="Search number or template"
                    >
                        <i className="ri-search-line search-icon"></i>
                    </TextIconInput>
                </div>

                <div className="col-12 col-md-6 col-xl-2">
                    <SelectInput
                        name="historyStatus"
                        defaultSelect="All statuses"
                        value={status}
                        onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                            setStatus(event.target.value);
                            setPagination(initialPagination);
                        }}
                        menuItems={messageStatusOptions}
                        valueKey="id"
                        textKey="name"
                        formgroupClassName="tw-mb-0"
                    />
                </div>

                <div className="col-12 col-md-6 col-xl-2">
                    <DateInput
                        name="startDate"
                        labelText="From"
                        value={dateRange.startDate}
                        onChange={dateChangeHandler}
                        maxDate={dateRange.endDate || undefined}
                        formgroupClassName="tw-mb-0"
                    />
                </div>

                <div className="col-12 col-md-6 col-xl-2">
                    <DateInput
                        name="endDate"
                        labelText="To"
                        value={dateRange.endDate}
                        onChange={dateChangeHandler}
                        minDate={dateRange.startDate || undefined}
                        formgroupClassName="tw-mb-0"
                    />
                </div>

                <div className="col-12 col-xl-3">
                    <div className="tw-flex tw-gap-2">
                        <Button
                            type="button"
                            variant="hoverInfo"
                            onClick={refreshHandler}
                            disabled={isRefreshing}
                        >
                            <i
                                className={`ri-refresh-line tw-me-1 ${isRefreshing ? "tw-animate-spin" : ""}`}
                            ></i>
                            Refresh
                        </Button>

                        <Button
                            type="button"
                            variant="hoverInfo"
                            onClick={exportHandler}
                            disabled={!filteredRecords.length}
                        >
                            <i className="ri-download-2-line tw-me-1"></i>
                            Export
                        </Button>
                    </div>
                </div>
            </div>

            <div className="tw-mt-3">
                <TableContainer
                    columns={historyColumns}
                    data={paginatedRecords}
                    tableClass="mb-0"
                    divClass="table-responsive mb-3"
                    theadClass="table-light text-muted align-middle"
                    isDataLoading={isRefreshing}
                    showPagination
                    totalPages={Math.ceil(
                        filteredRecords.length / pagination.pageSize,
                    )}
                    totalRecords={filteredRecords.length}
                    currentPageNumber={pagination.pageNo}
                    pageSize={pagination.pageSize}
                    callbackPaginationHndlr={setPagination}
                />
            </div>
        </div>
    );
};

export default MessageHistoryModal;

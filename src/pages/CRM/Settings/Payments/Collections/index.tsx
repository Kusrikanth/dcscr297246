import { useMemo, useState } from "react";

import {
    Button,
    DateInput,
    SelectInput,
    TextIconInput,
} from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import {
    formatMoney,
    settingsBranches,
    todayInputValue,
    type FieldChangeEvent,
} from "../../helper";
import {
    collectionSourceOptions,
    collectionStatusOptions,
    collectionStatusTone,
    generateCollectionColumns,
    paymentCollections as sampleCollections,
} from "./helper";

interface FilterState {
    searchString: string;
    status: string;
    source: string;
    branchId: string;
    fromDate: string;
    toDate: string;
}

interface PaginationState {
    pageNo: number;
    pageSize: number;
}

const initialFilterState: FilterState = {
    searchString: "",
    status: "",
    source: "",
    branchId: "",
    fromDate: "",
    toDate: todayInputValue(),
};

const initialPagination: PaginationState = { pageNo: 0, pageSize: 10 };

const Collections = () => {
    const [filterState, setFilterState] =
        useState<FilterState>(initialFilterState);
    const [pagination, setPagination] =
        useState<PaginationState>(initialPagination);

    const summary = useMemo(() => {
        const collected = sampleCollections.filter(
            record => collectionStatusTone(record.status) === "paid",
        );

        return {
            count: sampleCollections.length,
            total: sampleCollections.reduce(
                (sum, record) => sum + record.amount,
                0,
            ),
            collectedCount: collected.length,
            collectedAmount: collected.reduce(
                (sum, record) => sum + record.amount,
                0,
            ),
        };
    }, []);

    const paginatedCollections = useMemo(() => {
        const start = pagination.pageNo * pagination.pageSize;

        return sampleCollections.slice(start, start + pagination.pageSize);
    }, [pagination]);

    const tableColumns = useMemo(() => generateCollectionColumns(), []);

    const filterChangeHandler = (event: FieldChangeEvent) => {
        const { name, value } = event.target;

        setFilterState(prevState => ({ ...prevState, [name]: value }));
    };

    const exportHandler = () => {
    };

    const stats = [
        { id: "count", label: "Records", value: summary.count, isMoney: false },
        { id: "total", label: "Expected", value: summary.total, isMoney: true },
        {
            id: "collectedCount",
            label: "Collected",
            value: summary.collectedCount,
            isMoney: false,
        },
        {
            id: "collectedAmount",
            label: "Collected amount",
            value: summary.collectedAmount,
            isMoney: true,
            tone: "tw-text-emerald-700",
        },
    ];

    return (
        <>
            <div className="tw-mb-3 tw-flex tw-flex-wrap tw-items-center tw-justify-end tw-gap-2">
                <Button
                    type="button"
                    variant="primary"
                    disabled={!sampleCollections.length}
                    onClick={exportHandler}
                >
                    <i className="ri-download-2-line tw-me-1"></i>
                    Export CSV
                </Button>
            </div>

            <div className="row tw-mb-4 tw-gap-y-3">
                {stats.map(stat => (
                    <div key={stat.id} className="col-6 col-xl-3">
                        <div className="tw-card tw-h-full">
                            <div className="tw-card-body">
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    {stat.label}
                                </p>
                                <p
                                    className={`tw-mb-0 tw-text-xl tw-font-semibold ${stat.tone || "tw-text-gray-800"
                                        }`}
                                >
                                    {stat.isMoney
                                        ? formatMoney(stat.value)
                                        : stat.value}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

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
                                placeHolder="Order, transaction, payer, lead or form…"
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
                                menuItems={collectionStatusOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-2">
                            <SelectInput
                                name="source"
                                labelText="Source"
                                defaultSelect="All sources"
                                value={filterState.source}
                                onChange={filterChangeHandler}
                                menuItems={collectionSourceOptions}
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
                                value={filterState.branchId}
                                onChange={filterChangeHandler}
                                menuItems={settingsBranches}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-xl-3">
                            <div className="row tw-gap-y-2">
                                <div className="col-6">
                                    <DateInput
                                        name="fromDate"
                                        labelText="From"
                                        value={filterState.fromDate}
                                        onChange={filterChangeHandler}
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                    />
                                </div>

                                <div className="col-6">
                                    <DateInput
                                        name="toDate"
                                        labelText="To"
                                        value={filterState.toDate}
                                        onChange={filterChangeHandler}
                                        formgroupClassName="tw-mb-0"
                                        floatingLabel
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="tw-mt-3 tw-flex tw-justify-end">
                        <Button
                            type="button"
                            variant="reject"
                            onClick={() =>
                                setFilterState(initialFilterState)
                            }
                        >
                            Reset
                        </Button>
                    </div>
                </div>
            </div>

            <div className="tw-card">
                <div className="tw-card-body !tw-p-0">
                    <TableContainer
                        columns={tableColumns}
                        data={paginatedCollections}
                        tableClass="mb-0"
                        divClass="table-responsive mb-3"
                        theadClass="table-light text-muted align-middle"
                        showPagination
                        totalPages={Math.ceil(
                            sampleCollections.length / pagination.pageSize,
                        )}
                        totalRecords={sampleCollections.length}
                        currentPageNumber={pagination.pageNo}
                        pageSize={pagination.pageSize}
                        callbackPaginationHndlr={setPagination}
                    />
                </div>
            </div>
        </>
    );
};

export default Collections;

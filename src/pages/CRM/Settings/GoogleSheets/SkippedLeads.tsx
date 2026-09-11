import { useMemo, useState } from "react";

import {
    Button,
    DateInput,
    SelectInput,
    TextIconInput,
} from "../../../../Components/Common";
import {
    formatDateTime,
    settingsBranches,
    type FieldChangeEvent,
} from "../helper";
import {
    branchNameFor,
    skipReasonOptions,
    skippedLeads as sampleSkipped,
} from "./helper";

interface SkippedLeadsProps {
    onBack: () => void;
}

interface FilterState {
    searchString: string;
    branchId: string;
    sheetName: string;
    reason: string;
    fromDate: string;
    toDate: string;
}

const initialFilterState: FilterState = {
    searchString: "",
    branchId: "",
    sheetName: "",
    reason: "",
    fromDate: "",
    toDate: "",
};

const SkippedLeads = ({ onBack }: SkippedLeadsProps) => {
    const [filterState, setFilterState] =
        useState<FilterState>(initialFilterState);

    const sheetOptions = useMemo(
        () =>
            [...new Set(sampleSkipped.map(record => record.sheetName))]
                .sort()
                .map(name => ({ id: name, name })),
        [],
    );

    const affectedBranchCount = useMemo(
        () => new Set(sampleSkipped.map(record => record.branchId)).size,
        [],
    );

    const filterChangeHandler = (event: FieldChangeEvent) => {
        const { name, value } = event.target;

        setFilterState(prevState => ({ ...prevState, [name]: value }));
    };

    const exportHandler = () => {
    };

    const stats = [
        { id: "total", label: "Total skipped rows", value: sampleSkipped.length },
        {
            id: "branches",
            label: "Affected branches",
            value: affectedBranchCount,
        },
    ];

    return (
        <>
            <div className="tw-card tw-mb-4">
                <div className="tw-card-body">
                    <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                        <div className="tw-flex tw-min-w-0 tw-items-center tw-gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                                title="Back to sheet sources"
                                aria-label="Back to sheet sources"
                                onClick={onBack}
                            >
                                <i className="ri-arrow-left-line"></i>
                            </Button>

                            <div className="tw-min-w-0">
                                <p className="tw-mb-0 tw-text-base tw-font-semibold tw-text-gray-800">
                                    Skipped Leads
                                </p>
                                <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                    Rows that were read but not imported, and their
                                    exact reason.
                                </p>
                            </div>
                        </div>

                        <Button
                            type="button"
                            variant="primary"
                            disabled={!sampleSkipped.length}
                            onClick={exportHandler}
                        >
                            <i className="ri-download-2-line tw-me-1"></i>
                            Export CSV
                        </Button>
                    </div>
                </div>
            </div>

            <div className="row tw-mb-4 tw-gap-y-3">
                {stats.map(stat => (
                    <div key={stat.id} className="col-12 col-md-4">
                        <div className="tw-card tw-h-full">
                            <div className="tw-card-body">
                                <p className="tw-mb-0 tw-text-xl tw-font-semibold tw-text-gray-800">
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
                                placeHolder="Student, phone, lead or reason…"
                                floatingLabel
                            >
                                <i className="ri-search-line search-icon"></i>
                            </TextIconInput>
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

                        <div className="col-12 col-md-6 col-xl-2">
                            <SelectInput
                                name="sheetName"
                                labelText="Sheet"
                                defaultSelect="All sheets"
                                value={filterState.sheetName}
                                onChange={filterChangeHandler}
                                menuItems={sheetOptions}
                                valueKey="id"
                                textKey="name"
                                formgroupClassName="tw-mb-0"
                                floatingLabel
                            />
                        </div>

                        <div className="col-12 col-md-6 col-xl-2">
                            <SelectInput
                                name="reason"
                                labelText="Reason"
                                defaultSelect="All reasons"
                                value={filterState.reason}
                                onChange={filterChangeHandler}
                                menuItems={skipReasonOptions}
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
                            onClick={() => setFilterState(initialFilterState)}
                        >
                            Clear Filters
                        </Button>
                    </div>
                </div>
            </div>

            <div className="tw-card">
                <div className="tw-card-body !tw-p-0">
                    {!sampleSkipped.length ? (
                        <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-sm tw-text-gray-500">
                            No skipped rows found.
                        </p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table align-middle mb-0">
                                <thead className="table-light text-muted">
                                    <tr>
                                        <th>Last attempted</th>
                                        <th>Branch / Sheet</th>
                                        <th>Row</th>
                                        <th>Student</th>
                                        <th>Phone</th>
                                        <th>Reason</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sampleSkipped.map(record => (
                                        <tr key={record.id}>
                                            <td className="tw-whitespace-nowrap tw-text-sm">
                                                {formatDateTime(record.lastSeenAt)}
                                            </td>

                                            <td>
                                                <p className="tw-mb-0 tw-text-sm tw-text-gray-800">
                                                    {branchNameFor(record.branchId)}
                                                </p>
                                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                    {record.sheetName}
                                                </p>
                                            </td>

                                            <td className="tw-text-sm">
                                                {record.rowNumber}
                                            </td>

                                            <td className="tw-text-sm">
                                                {record.studentName || "—"}
                                            </td>

                                            <td className="tw-text-sm">
                                                {record.phone || "—"}
                                            </td>

                                            <td>
                                                <p className="tw-mb-0 tw-text-sm tw-text-gray-700">
                                                    {record.reason}
                                                </p>

                                                {record.existingLeadNumber && (
                                                    <p className="tw-mb-0 tw-font-mono tw-text-xs tw-text-[#405189]">
                                                        {record.existingLeadNumber}
                                                    </p>
                                                )}

                                                {record.occurrenceCount > 1 && (
                                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                        Skipped{" "}
                                                        {record.occurrenceCount} times
                                                    </p>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SkippedLeads;

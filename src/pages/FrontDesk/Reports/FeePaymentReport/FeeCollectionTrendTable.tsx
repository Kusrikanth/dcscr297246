import React, { useMemo } from "react";

import { getFeeAmountDisplayValue } from "../../../../utility/commonutility";
import { feeTrendColors, getFeeCollectionTrendTotals, IFeeTrendBucket } from "./helper";

interface Props {
    buckets: Array<IFeeTrendBucket>;
    totals: ReturnType<typeof getFeeCollectionTrendTotals>;
}

interface ITrendRow {
    key: string;
    label: string;
    color: string;
    percentKey: "academicPercent" | "transportPercent" | "totalPercent";
    collectedKey: "academicCollected" | "transportCollected" | "totalCollected";
    receivableKey: "academicReceivable" | "transportReceivable" | "totalReceivable";
}

const trendRows: Array<ITrendRow> = [
    {
        key: "academic",
        label: "Academic Fee",
        color: feeTrendColors.academic,
        percentKey: "academicPercent",
        collectedKey: "academicCollected",
        receivableKey: "academicReceivable",
    },
    {
        key: "transport",
        label: "Transport Fee",
        color: feeTrendColors.transport,
        percentKey: "transportPercent",
        collectedKey: "transportCollected",
        receivableKey: "transportReceivable",
    },
    {
        key: "total",
        label: "Total Collection",
        color: feeTrendColors.overall,
        percentKey: "totalPercent",
        collectedKey: "totalCollected",
        receivableKey: "totalReceivable",
    },
];

// Bootstrap's `.table > :not(caption) > * > *` sets the cell background at a higher
// specificity than a plain Tailwind class, so the frozen columns force theirs with `!`.
// Without it the scrolled-under columns show through the header and the labels.
const stickyFirstHeadClass = "sticky-left !tw-bg-gray-100 tw-text-nowrap tw-z-20 tw-border-r tw-border-gray-200 tw-w-[170px] tw-min-w-[170px]";
const stickyFirstCellClass = "sticky-left !tw-bg-white tw-text-nowrap tw-z-10 tw-border-r tw-border-gray-200 tw-w-[170px] tw-min-w-[170px]";
const stickyTotalHeadClass = "sticky-right !tw-bg-gray-100 tw-text-center tw-text-nowrap tw-z-20 tw-border-l tw-border-gray-200";
const stickyTotalCellClass = "sticky-right !tw-bg-gray-50 tw-text-center tw-text-nowrap tw-z-10 tw-border-l tw-border-gray-200";

export default function FeeCollectionTrendTable({ buckets, totals }: Props) {

    const rowsWithCells = useMemo(() => trendRows.map((row) => ({
        ...row,
        cells: buckets.map((bucket) => ({
            key: bucket.date,
            percent: bucket[row.percentKey],
            collected: bucket[row.collectedKey],
            receivable: bucket[row.receivableKey],
        })),
        totalPercent: totals[row.percentKey],
        totalCollected: totals[row.collectedKey],
        totalReceivable: totals[row.receivableKey],
    })), [buckets, totals]);

    return (
        <div className="tw-overflow-x-auto tw-px-4 tw-pb-4">
            <table className="table table-hover align-middle tw-mb-0">
                <thead className="tw-bg-gray-100 tw-text-gray-500 tw-align-middle">
                    <tr>
                        <th className={stickyFirstHeadClass}>Fee Type</th>
                        {buckets.map((bucket) => (
                            <th
                                key={bucket.date}
                                className="tw-text-center tw-text-nowrap"
                                title={bucket.rangeLabel}
                            >
                                {bucket.label}
                            </th>
                        ))}
                        <th className={stickyTotalHeadClass}>Total</th>
                    </tr>
                </thead>

                <tbody>
                    {rowsWithCells.map((row) => (
                        <tr key={row.key}>
                            <td className={stickyFirstCellClass}>
                                <span
                                    className="tw-pl-2 tw-font-medium"
                                    style={{ borderLeft: `3px solid ${row.color}` }}
                                >
                                    {row.label}
                                </span>
                            </td>

                            {row.cells.map((cell) => (
                                <td key={cell.key} className="tw-text-center tw-text-nowrap">
                                    <div style={{ color: "#495057", fontWeight: 600 }}>
                                        {cell.percent}%
                                    </div>
                                    <div className="tw-text-[11px] tw-text-gray-500">
                                        ₹ {getFeeAmountDisplayValue(cell.collected)} / ₹ {getFeeAmountDisplayValue(cell.receivable)}
                                    </div>
                                </td>
                            ))}

                            <td className={stickyTotalCellClass}>
                                <div style={{ color: row.color, fontWeight: 650 }}>
                                    {row.totalPercent}%
                                </div>
                                <div className="tw-text-[11px] tw-text-gray-500">
                                    ₹ {getFeeAmountDisplayValue(row.totalCollected)} / ₹ {getFeeAmountDisplayValue(row.totalReceivable)}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="tw-text-[11px] tw-text-gray-500 tw-mt-2 tw-mb-0">
                Each cell shows the collection % of the receivable, with collected / receivable amounts below.
            </p>
        </div>
    );
}

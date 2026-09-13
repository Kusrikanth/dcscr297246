import React, { useEffect, useMemo, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons-pro/core-stroke-standard";
import TableContainer from "../../../../Components/Common/TableContainer";
import { buildMatrixRows, formatAmount, IDrillDownCell, IMatrixRow } from "./helper";

interface IClassWiseMatrixTable {
    /** { academicYears, data: [{ className, studentCount, yearWise, grandTotal, sections }] } */
    report: any;
    /** Academic year columns to render, already narrowed by the "empty years" toggle. */
    years: string[];
    /** "CLASS" or "CLASS_SECTION" */
    groupBy: string;
    /** Year the report was run for; its column is highlighted as the running year. */
    currentYearName?: string;
    /** Actions for the header's right edge (Export). */
    headerActions?: React.ReactNode;
    /** Report filters and their Clear / Get Report buttons, rendered as their own row under the title. */
    filterBar?: React.ReactNode;
    /** View controls (grouping, empty-year toggle) applied without re-fetching. */
    viewControls?: React.ReactNode;
    /** Opens the student drill-down for an amount cell. */
    onCellClick?: (cell: IDrillDownCell) => void;
    /** Note about what the applied filters narrowed the amounts to, e.g. a single fee type. */
    scopeNote?: string;
}

const TOTAL_ROW_CLASS = "tw-font-semibold tw-text-gray-900";

export default function ClassWiseMatrixTable({ report, years, groupBy, currentYearName, headerActions, filterBar, viewControls, onCellClick, scopeNote }: IClassWiseMatrixTable) {
    const [expandedClassIds, setExpandedClassIds] = useState<string[]>([]);

    // Section rows only exist while grouping by section; collapse everything when the grouping changes.
    useEffect(() => { setExpandedClassIds([]); }, [groupBy, report]);

    const rows = useMemo(
        () => buildMatrixRows(report, years, groupBy, expandedClassIds),
        [report, years, groupBy, expandedClassIds]
    );

    const grandTotal = useMemo(() => rows.find((row) => row.rowType === "total")?.grandTotal || 0, [rows]);

    const toggleClass = (classId: string) =>
        setExpandedClassIds((prev) => prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]);

    const columns = useMemo(() => {
        const rowClass = (row: IMatrixRow) => row.rowType === "total" ? TOTAL_ROW_CLASS : "";

        /** Amounts drill into the students behind them; the Total row spans every class, so it stays static. */
        const amountCell = (row: IMatrixRow, amount: number, year: string | null) => {
            if (!amount) return <span className="tw-block tw-text-right tw-text-gray-300">–</span>;
            const text = formatAmount(amount);
            if (!onCellClick || row.rowType === "total") {
                return <span className={`tw-block tw-text-right tw-text-nowrap ${rowClass(row)}`}>{text}</span>;
            }
            return (
                <button
                    type="button"
                    onClick={() => onCellClick({
                        classId: row.classId,
                        className: row.className,
                        sectionId: row.sectionId,
                        sectionName: row.sectionName,
                        year,
                        amount,
                    })}
                    title="View students with these dues"
                    className="tw-block tw-w-full tw-text-right tw-text-nowrap tw-text-[#1bb3a6] hover:tw-underline"
                >
                    {text}
                </button>
            );
        };

        return [
            {
                Header: "Class",
                accessor: "label",
                disableSortBy: true,
                columnClassName: "w-200px min-w-200px sticky-left !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(243_244_246/var(--tw-bg-opacity))]",
                tdClass: "sticky-left !tw-z-10",
                Cell: ({ row: { original } }: any) => {
                    const item: IMatrixRow = original;
                    if (item.rowType === "section") {
                        return <span className="tw-text-nowrap tw-text-gray-600 tw-pl-7">{item.label}</span>;
                    }
                    if (item.rowType === "total") {
                        return <span className={`tw-text-nowrap ${TOTAL_ROW_CLASS}`}>{item.label}</span>;
                    }
                    return (
                        <div className="tw-flex tw-items-center tw-gap-1">
                            {item.hasSections ? (
                                <button
                                    type="button"
                                    onClick={() => toggleClass(item.id.replace("class-", ""))}
                                    className="tw-shrink-0 tw-text-gray-500 hover:tw-text-gray-800"
                                    title={expandedClassIds.includes(item.id.replace("class-", "")) ? "Hide sections" : "Show sections"}
                                >
                                    <HugeiconsIcon
                                        icon={expandedClassIds.includes(item.id.replace("class-", "")) ? ArrowDown01Icon : ArrowRight01Icon}
                                        size={16}
                                    />
                                </button>
                            ) : (
                                <span className="tw-w-4 tw-shrink-0" />
                            )}
                            <div className="tw-flex tw-flex-col tw-overflow-hidden">
                                <span className="tw-text-nowrap tw-font-medium tw-text-gray-800">{item.label}</span>
                                {item.subLabel && <span className="tw-text-xs tw-text-gray-500 tw-truncate">{item.subLabel}</span>}
                            </div>
                        </div>
                    );
                },
            },
            {
                Header: "Students",
                accessor: "studentCount",
                disableSortBy: true,
                columnClassName: "tw-text-center",
                Cell: ({ row: { original } }: any) => (
                    <span className={`tw-block tw-text-center ${rowClass(original)}`}>{original.studentCount || 0}</span>
                ),
            },
            ...years.map((year) => ({
                Header: () => (
                    <div className="tw-text-right tw-text-nowrap">
                        {year}
                        {year === currentYearName && <span className="tw-block tw-text-[10px] tw-font-normal tw-text-[#1bb3a6]">Current</span>}
                    </div>
                ),
                id: `year-${year}`,
                accessor: (row: IMatrixRow) => row.yearWise?.[year] || 0,
                disableSortBy: true,
                columnClassName: `tw-text-right min-w-[130px] ${year === currentYearName ? "!tw-bg-[#eefaf9]" : ""}`,
                tdClass: year === currentYearName ? "!tw-bg-[#f7fdfc]" : "",
                Cell: ({ row: { original } }: any) => amountCell(original, original.yearWise?.[year] || 0, year),
            })),
            {
                Header: () => <div className="tw-text-right tw-text-nowrap">Grand Total</div>,
                accessor: "grandTotal",
                disableSortBy: true,
                columnClassName: "tw-text-right min-w-[150px] sticky-right !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(243_244_246/var(--tw-bg-opacity))]",
                tdClass: "sticky-right !tw-z-10",
                Cell: ({ row: { original } }: any) => {
                    const item: IMatrixRow = original;
                    const share = grandTotal ? Math.round((item.grandTotal * 100) / grandTotal) : 0;
                    const isDrillable = Boolean(onCellClick) && item.rowType !== "total" && item.grandTotal > 0;
                    return (
                        <div className="tw-text-right">
                            {isDrillable ? (
                                <button
                                    type="button"
                                    onClick={() => onCellClick?.({
                                        classId: item.classId,
                                        className: item.className,
                                        sectionId: item.sectionId,
                                        sectionName: item.sectionName,
                                        year: null,
                                        amount: item.grandTotal,
                                    })}
                                    title="View students with these dues"
                                    className="tw-block tw-w-full tw-text-right tw-text-nowrap tw-font-semibold tw-text-[#1bb3a6] hover:tw-underline"
                                >
                                    {formatAmount(item.grandTotal)}
                                </button>
                            ) : (
                                <span className="tw-text-nowrap tw-font-semibold tw-text-gray-900">{formatAmount(item.grandTotal)}</span>
                            )}
                            {item.rowType === "class" && item.grandTotal > 0 && (
                                <span className="tw-block tw-text-[11px] tw-text-gray-500">{share}% of total</span>
                            )}
                        </div>
                    );
                },
            },
        ];
    }, [years, currentYearName, expandedClassIds, grandTotal, onCellClick]);

    return (
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-6">
            <div className="tw-border-b tw-px-4 tw-py-3 tw-flex tw-flex-wrap tw-items-start tw-justify-between tw-gap-2">
                <div>
                    <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-0">
                        Class-wise Outstanding by Academic Year
                        {scopeNote && <span className="tw-ml-2 tw-text-xs tw-font-medium tw-text-[#1bb3a6]">{scopeNote}</span>}
                    </h4>
                    <p className="tw-text-xs tw-text-gray-500 tw-mb-0">
                        Amounts in ₹. A student&apos;s dues sit in the academic year they were raised, under the class the student is in today.
                        {groupBy === "CLASS_SECTION" ? " Expand a class to see its sections." : ""}
                        {onCellClick ? " Click an amount to see the students behind it." : ""}
                    </p>
                </div>
                {headerActions}
            </div>
            {filterBar && <div className="tw-border-b tw-px-4 tw-py-4">{filterBar}</div>}
            {viewControls && <div className="tw-px-4 tw-py-3">{viewControls}</div>}
            <TableContainer
                columns={columns}
                data={rows}
                divClass="tw-overflow-x-auto tw-mb-0"
                theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                showPagination={false}
            />
        </div>
    );
}

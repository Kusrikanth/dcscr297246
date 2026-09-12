import { useEffect, useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { DndContext, closestCenter, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HugeiconsIcon } from "@hugeicons/react";
import { DragDropVerticalIcon } from "@hugeicons-pro/core-stroke-standard";
import TableContainer from "../../../../Components/Common/TableContainer";

interface ICallerWiseTable {
    /** yyyy-MM-dd inclusive bounds the counts are computed for */
    startDate: string;
    endDate: string;
    /** [{ employeeId, employeeName, outcomes: [{ statusName, count }], totalCalls }] from the summary API */
    data: Array<any>;
    /** Outcome headings, sourced from the Call Outcome dropdown */
    outcomeNames: Array<string>;
}

const TOTAL_ROW_ID = "__total__";
const ORDER_STORAGE_KEY = "feeCallingReport.callerWiseOutcomeOrder";

function loadSavedOrder(): string[] {
    try {
        const raw = localStorage.getItem(ORDER_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed.filter((n) => typeof n === "string") : [];
    } catch {
        return [];
    }
}

function saveOrder(order: string[]) {
    try { localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order)); } catch { /* ignore */ }
}

/** Keeps the saved arrangement for headings that still exist and appends any new ones at the end. */
function mergeOrder(saved: string[], available: string[]) {
    const kept = saved.filter((n) => available.includes(n));
    const added = available.filter((n) => !kept.includes(n));
    return [...kept, ...added];
}

function DraggableHeader({ id, label }: { id: string; label: string }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = { transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.6 : 1 };
    return (
        <div
            ref={setNodeRef}
            style={style}
            className="tw-flex tw-items-center tw-justify-center tw-gap-1 tw-select-none tw-cursor-grab active:tw-cursor-grabbing"
            title="Drag to rearrange"
            {...attributes}
            {...listeners}
        >
            <HugeiconsIcon icon={DragDropVerticalIcon} size={14} className="tw-text-gray-400 tw-shrink-0" />
            <span>{label}</span>
        </div>
    );
}

export default function CallerWiseTable({ startDate, endDate, data, outcomeNames }: ICallerWiseTable) {
    const rows = Array.isArray(data) ? data : [];
    const headings = useMemo(() => {
        const fromProps = Array.isArray(outcomeNames) ? outcomeNames.filter(Boolean) : [];
        if (fromProps.length > 0) return fromProps;
        // Fallback: whatever outcomes actually appear in the data, so the table never renders without columns.
        const seen: string[] = [];
        rows.forEach((row) => (row?.outcomes || []).forEach((o: any) => {
            if (o?.statusName && !seen.includes(o.statusName)) seen.push(o.statusName);
        }));
        return seen;
    }, [outcomeNames, rows]);

    const [order, setOrder] = useState<string[]>(() => mergeOrder(loadSavedOrder(), headings));
    useEffect(() => {
        setOrder((prev) => mergeOrder(prev.length ? prev : loadSavedOrder(), headings));
    }, [headings]);

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        setOrder((prev) => {
            const next = arrayMove(prev, prev.indexOf(String(active.id)), prev.indexOf(String(over.id)));
            saveOrder(next);
            return next;
        });
    };

    const tableData = useMemo(() => {
        const flat = rows.map((row) => {
            const counts: Record<string, number> = {};
            (row?.outcomes || []).forEach((o: any) => { if (o?.statusName) counts[o.statusName] = Number(o.count) || 0; });
            const total = Number(row?.totalCalls) || order.reduce((acc, name) => acc + (counts[name] || 0), 0);
            return { id: row?.employeeId ?? row?.employeeName, employeeName: row?.employeeName || "-", counts, total };
        });
        if (flat.length === 0) return flat;
        const totalCounts: Record<string, number> = {};
        order.forEach((name) => { totalCounts[name] = flat.reduce((acc, r) => acc + (r.counts[name] || 0), 0); });
        flat.push({ id: TOTAL_ROW_ID, employeeName: "Total", counts: totalCounts, total: flat.reduce((acc, r) => acc + r.total, 0) });
        return flat;
    }, [rows, order]);

    const columns = useMemo(() => {
        const bold = (original: any) => original?.id === TOTAL_ROW_ID ? "tw-font-semibold" : "";
        return [
            {
                Header: "Caller",
                accessor: "employeeName",
                disableSortBy: true,
                columnClassName: "w-200px min-w-200px",
                Cell: ({ row: { original } }: any) => <span className={`tw-text-nowrap ${bold(original)}`}>{original.employeeName}</span>,
            },
            ...order.map((name) => ({
                Header: () => <DraggableHeader id={name} label={name} />,
                id: `outcome-${name}`,
                accessor: (row: any) => row.counts?.[name] || 0,
                disableSortBy: true,
                columnClassName: "tw-text-center min-w-[140px]",
                Cell: ({ row: { original } }: any) => <span className={`tw-block tw-text-center ${bold(original)}`}>{original.counts?.[name] || 0}</span>,
            })),
            {
                Header: "Total Calls",
                accessor: "total",
                disableSortBy: true,
                columnClassName: "tw-text-center sticky-right !tw-z-10 [--tw-bg-opacity:1] !tw-bg-[rgb(243_244_246/var(--tw-bg-opacity))]",
                tdClass: "sticky-right !tw-z-10",
                Cell: ({ row: { original } }: any) => <span className="tw-block tw-text-center tw-font-semibold">{original.total}</span>,
            },
        ];
    }, [order]);

    const rangeLabel = (() => {
        try { return `${format(parseISO(startDate), "d MMM yyyy")} – ${format(parseISO(endDate), "d MMM yyyy")}`; } catch { return ""; }
    })();

    return (
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
            <div className="tw-border-b tw-px-4 tw-py-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                <div>
                    <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-0">Caller-wise Calls by Outcome</h4>
                    <p className="tw-text-xs tw-text-gray-500 tw-mb-0">{rangeLabel}</p>
                </div>
                <p className="tw-text-xs tw-text-gray-500 tw-mb-0">Drag an outcome heading to rearrange columns</p>
            </div>
            {tableData.length === 0 ? (
                <p className="tw-text-sm tw-text-gray-500 tw-p-4 tw-mb-0">No calls recorded for the selected period.</p>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                    <SortableContext items={order} strategy={horizontalListSortingStrategy}>
                        <TableContainer
                            columns={columns}
                            data={tableData}
                            divClass="tw-overflow-x-auto tw-mb-0"
                            theadClass="tw-bg-gray-100 tw-text-gray-600 tw-align-middle"
                            showPagination={false}
                        />
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}

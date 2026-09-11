import { useMemo, useState } from "react";

import {
    dateKey,
    DUE_TONE_CLASS,
    formatDate,
    formatTime,
    getDueStatus,
    monthWeeks,
    WEEKDAY_LABELS,
    type ActionItemRecord,
    type TrackerStage,
} from "../helper";
import Button from "../../../../Components/Common/Button";

interface CalendarViewProps {
    records: Array<ActionItemRecord>;
    stages: Array<TrackerStage>;
    terminalStageIds: Set<string>;
    overdueRecords: Array<ActionItemRecord>;
}

const CalendarView = ({
    records,
    stages,
    terminalStageIds,
    overdueRecords,
}: CalendarViewProps) => {
    const [cursor, setCursor] = useState<Date>(
        () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    );
    const [selectedDay, setSelectedDay] = useState<string>("");

    const { byDay, unscheduledCount } = useMemo(() => {
        const map = new Map<string, Array<ActionItemRecord>>();
        let unscheduled = 0;

        records.forEach(record => {
            const key = record.dueAt ? dateKey(record.dueAt) : "";

            if (!key) {
                unscheduled += 1;
                return;
            }

            if (!map.has(key)) {
                map.set(key, []);
            }

            map.get(key)?.push(record);
        });

        map.forEach(list =>
            list.sort(
                (left, right) =>
                    new Date(left.dueAt).getTime() -
                    new Date(right.dueAt).getTime(),
            ),
        );

        return { byDay: map, unscheduledCount: unscheduled };
    }, [records]);

    const weeks = useMemo(() => monthWeeks(cursor), [cursor]);
    const month = cursor.getMonth();
    const year = cursor.getFullYear();
    const todayKey = dateKey(new Date());

    const inMonthCount = useMemo(
        () =>
            [...byDay.entries()]
                .filter(
                    ([key]) =>
                        Number(key.slice(5, 7)) - 1 === month &&
                        Number(key.slice(0, 4)) === year,
                )
                .reduce((total, [, list]) => total + list.length, 0),
        [byDay, month, year],
    );

    const chipClass = (record: ActionItemRecord) => {
        const isDone = terminalStageIds.has(String(record.stageId));

        if (isDone) {
            return "tw-bg-gray-100 tw-text-gray-500 tw-line-through";
        }

        const status = getDueStatus(record.dueAt, false);

        if (status?.overdue) {
            return "tw-bg-red-100 tw-text-red-700";
        }

        if (status?.tone === "warning") {
            return "tw-bg-amber-100 tw-text-amber-800";
        }

        return "tw-bg-[#d1f4f1] tw-text-[#0b6d63]";
    };

    const selectedRecords = selectedDay ? byDay.get(selectedDay) || [] : [];

    return (
        <div className="tw-card">
            <div className="tw-card-header">
                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                    <div>
                        <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                            Calendar View
                        </p>
                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                            {cursor.toLocaleDateString("en-IN", {
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>

                    <div className="tw-flex tw-gap-2">
                        <Button
                            type="button"
                            variant="hoverInfo"
                            onClick={() =>
                                setCursor(
                                    new Date(
                                        new Date().getFullYear(),
                                        new Date().getMonth(),
                                        1,
                                    ),
                                )
                            }
                        >
                            Today
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                            aria-label="Previous month"
                            onClick={() =>
                                setCursor(
                                    current =>
                                        new Date(
                                            current.getFullYear(),
                                            current.getMonth() - 1,
                                            1,
                                        ),
                                )
                            }
                        >
                            <i className="ri-arrow-left-s-line"></i>
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                            aria-label="Next month"
                            onClick={() =>
                                setCursor(
                                    current =>
                                        new Date(
                                            current.getFullYear(),
                                            current.getMonth() + 1,
                                            1,
                                        ),
                                )
                            }
                        >
                            <i className="ri-arrow-right-s-line"></i>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="tw-card-body">
                <div className="row tw-gap-y-3">
                    <div className="col-12 col-xl-8">
                        <div className="tw-grid tw-grid-cols-7">
                            {WEEKDAY_LABELS.map(day => (
                                <div
                                    key={day}
                                    className="tw-px-2 tw-py-1.5 tw-text-center tw-text-[11px] tw-font-bold tw-uppercase tw-tracking-wide tw-text-gray-500"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="tw-grid tw-grid-cols-7 tw-gap-px tw-overflow-hidden tw-rounded tw-border tw-border-gray-200 tw-bg-gray-200">
                            {weeks.flat().map(day => {
                                const key = dateKey(day);
                                const items = byDay.get(key) || [];
                                const isOutside = day.getMonth() !== month;
                                const isToday = key === todayKey;
                                const isSelected = key === selectedDay;

                                return (
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        key={key}
                                        aria-label={`${day.toDateString()}, ${items.length} action item${items.length === 1 ? "" : "s"}`}
                                        onClick={() =>
                                            setSelectedDay(current =>
                                                current === key ? "" : key,
                                            )
                                        }
                                        className={`tw-min-h-24 !tw-flex-col !tw-items-start !tw-justify-start !tw-gap-0 !tw-p-1.5 !tw-rounded-none !tw-shadow-none tw-text-start ${isOutside
                                            ? "!tw-bg-gray-50"
                                            : "!tw-bg-white hover:!tw-bg-gray-50"
                                            } ${isSelected
                                                ? "tw-ring-2 tw-ring-inset tw-ring-[#1bb3a6]"
                                                : ""
                                            }`}
                                    >
                                        <span
                                            className={`tw-mb-1 tw-inline-grid tw-h-6 tw-w-6 tw-place-items-center tw-rounded-full tw-text-[11px] tw-font-semibold ${isToday
                                                ? "tw-bg-[#1bb3a6] tw-text-white"
                                                : isOutside
                                                    ? "tw-text-gray-300"
                                                    : "tw-text-gray-600"
                                                }`}
                                        >
                                            {day.getDate()}
                                        </span>

                                        <span className="tw-w-full tw-space-y-0.5">
                                            {items.slice(0, 3).map(record => (
                                                <span
                                                    key={record.id}
                                                    title={`${record.title} · ${record.owner || "Unassigned"}`}
                                                    className={`tw-block tw-truncate tw-rounded tw-px-1.5 tw-py-0.5 tw-text-[10px] tw-font-semibold ${chipClass(record)}`}
                                                >
                                                    {record.title}
                                                </span>
                                            ))}
                                            {items.length > 3 && (
                                                <span className="tw-block tw-px-1.5 tw-text-[10px] tw-font-semibold tw-text-gray-500">
                                                    +{items.length - 3} more
                                                </span>
                                            )}
                                        </span>
                                    </Button>
                                );
                            })}
                        </div>

                        <div className="tw-mt-2 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2 tw-text-xs tw-text-gray-600">
                            <span>
                                {inMonthCount} action item
                                {inMonthCount === 1 ? "" : "s"} due in{" "}
                                {cursor.toLocaleDateString("en-IN", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </span>

                            {unscheduledCount > 0 && (
                                <span className="tw-text-gray-500">
                                    {unscheduledCount} unscheduled item
                                    {unscheduledCount === 1 ? "" : "s"} not
                                    shown
                                </span>
                            )}
                        </div>

                        {selectedDay && (
                            <div className="tw-mt-3 tw-border-t tw-border-gray-200 tw-pt-3">
                                <div className="tw-mb-2 tw-flex tw-items-center tw-justify-between tw-gap-2">
                                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                        {new Date(
                                            selectedDay,
                                        ).toLocaleDateString("en-IN", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="linkBtn" className="tw-px-0 tw-text-xs tw-text-decoration-none"
                                        onClick={() => setSelectedDay("")}
                                    >
                                        Clear
                                    </Button>
                                </div>

                                {selectedRecords.length === 0 ? (
                                    <p className="tw-mb-0 tw-py-2 tw-text-sm tw-text-gray-500">
                                        Nothing due on this day.
                                    </p>
                                ) : (
                                    <div className="tw-space-y-2">
                                        {selectedRecords.map(record => {
                                            const isDone =
                                                terminalStageIds.has(
                                                    String(record.stageId),
                                                );
                                            const status = getDueStatus(
                                                record.dueAt,
                                                isDone,
                                            );

                                            return (
                                                <div
                                                    key={record.id}
                                                    className="tw-flex tw-items-start tw-justify-between tw-gap-2 tw-rounded tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-2"
                                                >
                                                    <div className="tw-min-w-0">
                                                        <p className="tw-mb-0 tw-font-mono tw-text-[11px] tw-text-[#405189]">
                                                            {
                                                                record.recordNumber
                                                            }
                                                        </p>
                                                        <p className="tw-mb-0 tw-truncate tw-text-sm tw-font-medium tw-text-gray-800">
                                                            {record.title}
                                                        </p>
                                                        <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                                            {record.owner ||
                                                                "Unassigned"}{" "}
                                                            ·{" "}
                                                            {formatTime(
                                                                record.dueAt,
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="tw-flex tw-flex-shrink-0 tw-items-center tw-gap-1">
                                                        {status && (
                                                            <span
                                                                className={`tw-rounded-full tw-px-2 tw-py-0.5 tw-text-[10px] tw-font-semibold ${DUE_TONE_CLASS[status.tone]}`}
                                                            >
                                                                {status.label}
                                                            </span>
                                                        )}
                                                        <span className="badge badge-soft-primary">
                                                            {
                                                                stages.find(
                                                                    stage =>
                                                                        String(
                                                                            stage.id,
                                                                        ) ===
                                                                        String(
                                                                            record.stageId,
                                                                        ),
                                                                )?.displayName
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="col-12 col-xl-4">
                        <div className="tw-overflow-hidden tw-rounded tw-border tw-border-gray-200">
                            <div className="tw-flex tw-items-center tw-gap-2 tw-border-b tw-border-gray-200 tw-bg-red-50 tw-px-3 tw-py-2">
                                <i className="ri-calendar-close-line tw-text-red-600"></i>
                                <span className="tw-text-sm tw-font-semibold tw-text-red-700">
                                    Overdue
                                </span>
                                <span className="tw-ms-auto tw-rounded-full tw-bg-red-100 tw-px-2 tw-py-0.5 tw-text-[11px] tw-font-bold tw-text-red-700">
                                    {overdueRecords.length}
                                </span>
                            </div>

                            {overdueRecords.length === 0 ? (
                                <p className="tw-mb-0 tw-px-3 tw-py-5 tw-text-center tw-text-sm tw-text-gray-500">
                                    Nothing overdue.
                                </p>
                            ) : (
                                <div
                                    className="tw-overflow-y-auto"
                                    style={{ maxHeight: "520px" }}
                                >
                                    {overdueRecords.map(record => {
                                        const status = getDueStatus(
                                            record.dueAt,
                                            false,
                                        );

                                        return (
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                key={record.id}
                                                onClick={() => {
                                                    const due = new Date(
                                                        record.dueAt,
                                                    );
                                                    setCursor(
                                                        new Date(
                                                            due.getFullYear(),
                                                            due.getMonth(),
                                                            1,
                                                        ),
                                                    );
                                                    setSelectedDay(
                                                        dateKey(record.dueAt),
                                                    );
                                                }}
                                                className="tw-w-full !tw-flex-col !tw-items-start !tw-justify-start !tw-gap-0 !tw-rounded-none !tw-shadow-none !tw-bg-white tw-border-b tw-border-gray-100 !tw-px-3 !tw-py-2 tw-text-start last:tw-border-b-0 hover:!tw-bg-gray-50"
                                            >
                                                <span className="tw-block tw-font-mono tw-text-[10px] tw-text-[#405189]">
                                                    {record.recordNumber}
                                                </span>
                                                <span className="tw-block tw-truncate tw-text-[13px] tw-font-medium tw-text-gray-800">
                                                    {record.title}
                                                </span>
                                                <span className="tw-block tw-truncate tw-text-[11px] tw-text-gray-500">
                                                    {record.owner ||
                                                        "Unassigned"}
                                                </span>
                                                <span className="tw-mt-1 tw-flex tw-flex-wrap tw-items-center tw-gap-1">
                                                    <span className="tw-rounded tw-bg-red-100 tw-px-1.5 tw-py-0.5 tw-text-[10px] tw-font-bold tw-text-red-700">
                                                        {status?.label ||
                                                            "overdue"}
                                                    </span>
                                                    <span className="tw-text-[10px] tw-text-gray-500">
                                                        due{" "}
                                                        {formatDate(
                                                            record.dueAt,
                                                        )}
                                                    </span>
                                                </span>
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;

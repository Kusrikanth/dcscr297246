import { useRef, type ChangeEvent } from "react";

import { Button, SelectInput } from "../../../../Components/Common";
import NoDataComp from "../../../../Components/Common/NoDataComp";
import {
    DUE_TONE_CLASS,
    formatDate,
    getDueStatus,
    type ActionItemRecord,
    type TrackerStage,
} from "../helper";

interface BoardViewProps {
    records: Array<ActionItemRecord>;
    stages: Array<TrackerStage>;
    terminalStageIds: Set<string>;
    onView: (record: ActionItemRecord) => void;
    onStageChange: (record: ActionItemRecord, stageId: string) => void;
}

const BoardView = ({
    records,
    stages,
    terminalStageIds,
    onView,
    onStageChange,
}: BoardViewProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollBoard = (direction: number) => {
        const board = scrollRef.current;

        if (!board) {
            return;
        }

        const column = board.querySelector<HTMLElement>(
            "[data-board-column]",
        );
        const distance = (column?.getBoundingClientRect().width || 320) + 16;

        board.scrollBy({ left: direction * distance, behavior: "smooth" });
    };

    if (!stages.length) {
        return (
            <div className="tw-card">
                <div className="tw-card-body">
                    <NoDataComp
                        title="No Tracker statuses configured"
                        helperText="Add statuses from Settings → Business Units → Tracker."
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="tw-card">
            <div className="tw-card-header">
                <div className="tw-flex tw-items-center tw-justify-between tw-gap-2">
                    <span className="tw-text-sm tw-font-semibold tw-text-gray-700">
                        Process stages
                    </span>

                    <div className="tw-flex tw-gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                            title="Scroll board left"
                            aria-label="Scroll board left"
                            onClick={() => scrollBoard(-1)}
                        >
                            <i className="ri-arrow-left-s-line"></i>
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                            title="Scroll board right"
                            aria-label="Scroll board right"
                            onClick={() => scrollBoard(1)}
                        >
                            <i className="ri-arrow-right-s-line"></i>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="tw-card-body">
                <div
                    ref={scrollRef}
                    className="tw-flex tw-gap-3 tw-overflow-x-auto tw-pb-2"
                >
                    {stages.map(stage => {
                        const stageRecords = records.filter(
                            record =>
                                String(record.stageId) === String(stage.id),
                        );

                        return (
                            <div
                                key={stage.id}
                                data-board-column
                                className="tw-w-80 tw-flex-shrink-0 tw-rounded tw-border tw-border-gray-200 tw-bg-white"
                            >
                                <div
                                    className="tw-rounded-t tw-border-b tw-border-gray-200 tw-px-3 tw-py-2"
                                    style={{
                                        borderTop: `4px solid ${stage.color}`,
                                    }}
                                >
                                    <p className="tw-mb-0 tw-text-sm tw-font-semibold tw-text-gray-800">
                                        {stage.displayName}
                                    </p>
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        {stageRecords.length} item
                                        {stageRecords.length === 1 ? "" : "s"}
                                    </p>
                                </div>

                                <div
                                    className="tw-space-y-2 tw-overflow-y-auto tw-p-3"
                                    style={{ maxHeight: "520px" }}
                                >
                                    {stageRecords.length === 0 ? (
                                        <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-xs tw-text-gray-500">
                                            No items
                                        </p>
                                    ) : (
                                        stageRecords.map(record => {
                                            const isDone =
                                                terminalStageIds.has(
                                                    String(record.stageId),
                                                );
                                            const status = getDueStatus(
                                                record.dueAt,
                                                isDone,
                                            );
                                            const isOverdue = Boolean(
                                                status?.overdue,
                                            );

                                            return (
                                                <div
                                                    key={record.id}
                                                    className={`tw-rounded tw-border tw-border-gray-200 tw-p-3 ${isOverdue
                                                        ? "tw-bg-red-50"
                                                        : "tw-bg-gray-50"
                                                        }`}
                                                >
                                                    <div className="tw-flex tw-items-start tw-justify-between tw-gap-2">
                                                        <div className="tw-min-w-0 tw-flex-1">
                                                            <p className="tw-mb-0 tw-font-mono tw-text-[11px] tw-text-[#405189]">
                                                                {
                                                                    record.recordNumber
                                                                }
                                                            </p>
                                                            <p className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-800">
                                                                {record.title}
                                                            </p>
                                                            <p className="tw-mb-0 tw-line-clamp-2 tw-text-xs tw-text-gray-500">
                                                                {record.description ||
                                                                    "No description"}
                                                            </p>
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            className="!tw-h-8 !tw-w-8 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50 tw-flex-shrink-0"
                                                            title="View action item"
                                                            aria-label={`View ${record.title}`}
                                                            onClick={() =>
                                                                onView(record)
                                                            }
                                                        >
                                                            <i className="ri-eye-line"></i>
                                                        </Button>
                                                    </div>

                                                    <div className="tw-mt-2 tw-space-y-1 tw-text-xs tw-text-gray-600">
                                                        <div className="tw-flex tw-items-center tw-gap-1">
                                                            <i className="ri-user-3-line"></i>
                                                            <span>
                                                                {record.owner ||
                                                                    "Unassigned"}
                                                            </span>
                                                        </div>

                                                        {record.dueAt && (
                                                            <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-1">
                                                                <i className="ri-calendar-event-line"></i>
                                                                <span>
                                                                    {formatDate(
                                                                        record.dueAt,
                                                                    )}
                                                                </span>
                                                                {status && (
                                                                    <span
                                                                        className={`tw-rounded tw-px-1.5 tw-py-0.5 tw-text-[10px] tw-font-semibold ${DUE_TONE_CLASS[status.tone]}`}
                                                                    >
                                                                        {
                                                                            status.label
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}

                                                        {record.estimatedHours >
                                                            0 && (
                                                                <div className="tw-flex tw-items-center tw-gap-1">
                                                                    <i className="ri-time-line"></i>
                                                                    <span>
                                                                        {
                                                                            record.estimatedHours
                                                                        }
                                                                        h estimated
                                                                    </span>
                                                                </div>
                                                            )}
                                                    </div>

                                                    {record.approvalRequired && (
                                                        <span
                                                            className={`tw-mt-2 tw-inline-flex tw-items-center tw-gap-1 tw-rounded tw-px-2 tw-py-1 tw-text-[11px] tw-font-semibold tw-capitalize ${record.approvalStatus ===
                                                                "approved"
                                                                ? "tw-bg-emerald-100 tw-text-emerald-700"
                                                                : record.approvalStatus ===
                                                                    "rejected"
                                                                    ? "tw-bg-red-100 tw-text-red-700"
                                                                    : "tw-bg-amber-100 tw-text-amber-800"
                                                                }`}
                                                        >
                                                            <i className="ri-shield-check-line"></i>
                                                            {record.approvalStatus.replace(
                                                                /_/g,
                                                                " ",
                                                            )}
                                                        </span>
                                                    )}

                                                    <div className="tw-mt-2">
                                                        <label className="tw-mb-1 tw-block tw-text-[11px] tw-font-semibold tw-text-gray-500">
                                                            Status
                                                        </label>
                                                        <SelectInput
                                                            name={`${record.id}-stage`}
                                                            value={
                                                                record.stageId
                                                            }
                                                            onChange={(
                                                                event: ChangeEvent<HTMLSelectElement>,
                                                            ) =>
                                                                onStageChange(
                                                                    record,
                                                                    event.target
                                                                        .value,
                                                                )
                                                            }
                                                            menuItems={stages}
                                                            valueKey="id"
                                                            textKey="displayName"
                                                            hideSelectOption
                                                            inputClassName="form-select-sm"
                                                            formgroupClassName="tw-mb-0"
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BoardView;

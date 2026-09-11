import { useMemo, useState } from "react";

import {
    Button,
    ModalContainerUpdated,
} from "../../../../Components/Common";
import { useModal } from "../../../../hooks/modalhook";
import type { DashboardLead } from "../helper";

interface CurriculumStageWidgetProps {
    leads: DashboardLead[];
    stages: string[];
}

type DimensionKey = "branch" | "curriculum" | "applyingClass";

interface DimensionOption {
    key: DimensionKey;
    label: string;
    pluralLabel: string;
    icon: string;
    value: (lead: DashboardLead) => string;
}

interface DistributionRow {
    key: string;
    label: string;
    counts: Record<string, number>;
    total: number;
    leadingStage: string;
}

const dimensions: DimensionOption[] = [
    {
        key: "branch",
        label: "Branch",
        pluralLabel: "branches",
        icon: "ri-building-2-line",
        value: lead => lead.branch || "Not specified",
    },
    {
        key: "curriculum",
        label: "Curriculum",
        pluralLabel: "curricula",
        icon: "ri-book-open-line",
        value: lead => lead.curriculum || "Not specified",
    },
    {
        key: "applyingClass",
        label: "Class",
        pluralLabel: "classes",
        icon: "ri-graduation-cap-line",
        value: lead => lead.applyingClass || "Not specified",
    },
];

const stageColors = [
    "#64748b",
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#0f9d7a",
    "#22a06b",
    "#db5a6b",
    "#5261b5",
];

const percentageLabel = (value: number, total: number) =>
    total ? `${Math.round((value / total) * 100)}%` : "0%";

const CurriculumStageWidget = ({
    leads,
    stages,
}: CurriculumStageWidgetProps) => {
    const [groupBy, setGroupBy] =
        useState<DimensionKey>("branch");

    const {
        openModal: fullscreenOpen,
        closeModal: fullscreenClose,
        modalState: fullscreenState,
    } = useModal();

    const activeDimension =
        dimensions.find(option => option.key === groupBy) ||
        dimensions[0];

    const stageNames = useMemo(
        () => [
            ...new Set([
                ...stages.filter(Boolean),
                ...leads.map(lead => lead.stage).filter(Boolean),
            ]),
        ],
        [leads, stages],
    );

    const stageTotals = useMemo(
        () =>
            Object.fromEntries(
                stageNames.map(stage => [
                    stage,
                    leads.filter(lead => lead.stage === stage)
                        .length,
                ]),
            ) as Record<string, number>,
        [leads, stageNames],
    );

    const rows = useMemo<DistributionRow[]>(() => {
        const dimension =
            dimensions.find(option => option.key === groupBy) ||
            dimensions[0];
        const groups = new Map<string, DashboardLead[]>();

        leads.forEach(lead => {
            const label = dimension.value(lead);

            if (!groups.has(label)) {
                groups.set(label, []);
            }

            groups.get(label)?.push(lead);
        });

        return [...groups.entries()]
            .map(([label, groupLeads]) => {
                const counts = Object.fromEntries(
                    stageNames.map(stage => [
                        stage,
                        groupLeads.filter(
                            lead => lead.stage === stage,
                        ).length,
                    ]),
                ) as Record<string, number>;
                const leadingStage = stageNames.reduce(
                    (current, stage) =>
                        Number(counts[stage] || 0) >
                        Number(counts[current] || 0)
                            ? stage
                            : current,
                    stageNames[0] || "",
                );

                return {
                    key: `${groupBy}:${label}`,
                    label,
                    counts,
                    total: groupLeads.length,
                    leadingStage,
                };
            })
            .sort(
                (left, right) =>
                    right.total - left.total ||
                    left.label.localeCompare(right.label),
            );
    }, [groupBy, leads, stageNames]);

    const totalLeads = leads.length;
    const leadingGroup = rows[0];
    const admittedStage =
        stageNames.find(
            stage => stage.toLowerCase() === "admitted",
        ) || "";
    const admittedTotal = admittedStage
        ? stageTotals[admittedStage] || 0
        : 0;

    const stageColorFor = (stage: string) => {
        const index = Math.max(0, stageNames.indexOf(stage));

        return stageColors[index % stageColors.length];
    };

    const renderControls = (showFullscreen = true) => (
        <div className="tw-flex tw-flex-wrap tw-items-center tw-gap-2">
            <div
                className="tw-flex tw-overflow-x-auto tw-rounded-md tw-border tw-border-gray-200 tw-bg-gray-50 tw-p-1"
                role="tablist"
                aria-label="Group leads by"
            >
                {dimensions.map(option => {
                    const isActive = groupBy === option.key;

                    return (
                        <Button
                            key={option.key}
                            type="button"
                            role="tab"
                            variant={isActive ? "info" : "secondary"}
                            aria-selected={isActive}
                            className={`!tw-min-w-[104px] !tw-whitespace-nowrap !tw-px-3 !tw-py-1.5 !tw-shadow-none ${
                                isActive
                                    ? ""
                                    : "!tw-bg-transparent !tw-text-gray-600 hover:!tw-bg-white"
                            }`}
                            onClick={() => setGroupBy(option.key)}
                        >
                            <i className={option.icon}></i>
                            {option.label}
                        </Button>
                    );
                })}
            </div>

            {showFullscreen && (
                <Button
                    type="button"
                    variant="secondary"
                    className="!tw-h-9 !tw-w-9 !tw-p-0 tw-border tw-border-gray-200 !tw-bg-white hover:!tw-bg-gray-50"
                    title="View full screen"
                    aria-label="View lead distribution full screen"
                    onClick={() => fullscreenOpen(true)}
                >
                    <i className="ri-fullscreen-line"></i>
                </Button>
            )}
        </div>
    );

    const renderSummary = () => (
        <div className="tw-flex tw-overflow-x-auto tw-divide-x tw-divide-gray-200 tw-border-b tw-border-gray-200 tw-bg-gray-50">
            <div className="tw-flex tw-min-w-[180px] tw-flex-1 tw-items-center tw-gap-3 tw-px-4 tw-py-3">
                <span className="tw-grid tw-h-9 tw-w-9 tw-flex-shrink-0 tw-place-items-center tw-rounded tw-bg-cyan-50 tw-text-cyan-700">
                    <i className="ri-contacts-line"></i>
                </span>
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        Total leads
                    </p>
                    <p className="tw-mb-0 tw-text-lg tw-font-semibold tw-text-gray-900">
                        {totalLeads.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="tw-flex tw-min-w-[180px] tw-flex-1 tw-items-center tw-gap-3 tw-px-4 tw-py-3">
                <span className="tw-grid tw-h-9 tw-w-9 tw-flex-shrink-0 tw-place-items-center tw-rounded tw-bg-blue-50 tw-text-blue-700">
                    <i className={activeDimension.icon}></i>
                </span>
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {activeDimension.label} coverage
                    </p>
                    <p className="tw-mb-0 tw-text-lg tw-font-semibold tw-text-gray-900">
                        {rows.length}{" "}
                        <span className="tw-text-sm tw-font-normal tw-text-gray-500">
                            {activeDimension.pluralLabel}
                        </span>
                    </p>
                </div>
            </div>

            <div className="tw-flex tw-min-w-[220px] tw-flex-1 tw-items-center tw-gap-3 tw-px-4 tw-py-3">
                <span className="tw-grid tw-h-9 tw-w-9 tw-flex-shrink-0 tw-place-items-center tw-rounded tw-bg-amber-50 tw-text-amber-700">
                    <i className="ri-bar-chart-box-line"></i>
                </span>
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        Largest segment
                    </p>
                    <p
                        className="tw-mb-0 tw-truncate tw-text-sm tw-font-semibold tw-text-gray-900"
                        title={leadingGroup?.label}
                    >
                        {leadingGroup?.label || "No data"}
                    </p>
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        {leadingGroup?.total || 0} leads
                    </p>
                </div>
            </div>

            <div className="tw-flex tw-min-w-[180px] tw-flex-1 tw-items-center tw-gap-3 tw-px-4 tw-py-3">
                <span className="tw-grid tw-h-9 tw-w-9 tw-flex-shrink-0 tw-place-items-center tw-rounded tw-bg-emerald-50 tw-text-emerald-700">
                    <i className="ri-checkbox-circle-line"></i>
                </span>
                <div className="tw-min-w-0">
                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                        Admitted rate
                    </p>
                    <p className="tw-mb-0 tw-text-lg tw-font-semibold tw-text-gray-900">
                        {percentageLabel(admittedTotal, totalLeads)}
                        <span className="tw-ms-1 tw-text-xs tw-font-normal tw-text-gray-500">
                            ({admittedTotal})
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );

    const renderDistribution = () => (
        <>
            {renderSummary()}

            <div className="tw-flex tw-overflow-x-auto tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                <div className="tw-flex tw-min-w-max tw-items-center tw-gap-5">
                    <span className="tw-text-xs tw-font-medium tw-text-gray-500">
                        Stage totals
                    </span>
                    {stageNames.map(stage => (
                        <div
                            key={stage}
                            className="tw-flex tw-items-center tw-gap-2 tw-whitespace-nowrap"
                        >
                            <span
                                className="tw-h-2.5 tw-w-2.5 tw-rounded-full"
                                style={{
                                    backgroundColor: stageColorFor(stage),
                                }}
                            ></span>
                            <span className="tw-text-xs tw-text-gray-600">
                                {stage}
                            </span>
                            <strong className="tw-text-xs tw-text-gray-900">
                                {stageTotals[stage] || 0}
                            </strong>
                        </div>
                    ))}
                </div>
            </div>

            <div className="table-responsive">
                <table className="table table-hover align-middle tw-mb-0 tw-min-w-[1020px]">
                    <thead className="table-light text-muted">
                        <tr>
                            <th className="tw-w-[220px] tw-whitespace-nowrap tw-px-4">
                                {activeDimension.label}
                            </th>
                            <th className="tw-w-[260px] tw-whitespace-nowrap">
                                Stage mix
                            </th>
                            {stageNames.map(stage => (
                                <th
                                    key={stage}
                                    className="tw-whitespace-nowrap tw-text-end"
                                >
                                    {stage}
                                </th>
                            ))}
                            <th className="tw-whitespace-nowrap tw-pe-4 tw-text-end">
                                Total
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={row.key}>
                                <td className="tw-px-4">
                                    <div className="tw-flex tw-min-w-0 tw-items-center tw-gap-2.5">
                                        <span className="tw-grid tw-h-8 tw-w-8 tw-flex-shrink-0 tw-place-items-center tw-rounded tw-bg-gray-100 tw-text-gray-600">
                                            <i className={activeDimension.icon}></i>
                                        </span>
                                        <div className="tw-min-w-0">
                                            <div className="tw-flex tw-items-center tw-gap-2">
                                                <span
                                                    className="tw-truncate tw-text-sm tw-font-semibold tw-text-gray-800"
                                                    title={row.label}
                                                >
                                                    {row.label}
                                                </span>
                                                {index === 0 && rows.length > 1 && (
                                                    <span className="badge badge-soft-success">
                                                        Highest
                                                    </span>
                                                )}
                                            </div>
                                            <span className="tw-text-xs tw-text-gray-500">
                                                {percentageLabel(
                                                    row.total,
                                                    totalLeads,
                                                )}{" "}
                                                of all leads
                                            </span>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <div
                                        className="tw-flex tw-h-2.5 tw-w-full tw-overflow-hidden tw-rounded-full tw-bg-gray-100"
                                        aria-label={`${row.label} stage distribution`}
                                    >
                                        {stageNames.map(stage => {
                                            const count =
                                                row.counts[stage] || 0;

                                            return (
                                                <span
                                                    key={stage}
                                                    title={`${stage}: ${count} (${percentageLabel(
                                                        count,
                                                        row.total,
                                                    )})`}
                                                    style={{
                                                        width: `${
                                                            row.total
                                                                ? (count /
                                                                      row.total) *
                                                                  100
                                                                : 0
                                                        }%`,
                                                        backgroundColor:
                                                            stageColorFor(
                                                                stage,
                                                            ),
                                                    }}
                                                ></span>
                                            );
                                        })}
                                    </div>
                                    <div className="tw-mt-1.5 tw-flex tw-items-center tw-justify-between tw-gap-2 tw-text-xs tw-text-gray-500">
                                        <span>Leading stage</span>
                                        <span className="tw-font-medium tw-text-gray-700">
                                            {row.leadingStage || "No stage"}
                                        </span>
                                    </div>
                                </td>

                                {stageNames.map(stage => {
                                    const count = row.counts[stage] || 0;

                                    return (
                                        <td
                                            key={stage}
                                            className="tw-text-end"
                                        >
                                            <strong
                                                className={
                                                    count
                                                        ? "tw-text-gray-800"
                                                        : "tw-text-gray-300"
                                                }
                                            >
                                                {count}
                                            </strong>
                                            <span className="tw-block tw-text-xs tw-text-gray-400">
                                                {percentageLabel(
                                                    count,
                                                    row.total,
                                                )}
                                            </span>
                                        </td>
                                    );
                                })}

                                <td className="tw-pe-4 tw-text-end">
                                    <strong className="tw-text-base tw-text-gray-900">
                                        {row.total}
                                    </strong>
                                </td>
                            </tr>
                        ))}

                        {!rows.length && (
                            <tr>
                                <td
                                    colSpan={stageNames.length + 3}
                                    className="tw-py-10 tw-text-center"
                                >
                                    <i className="ri-bar-chart-horizontal-line tw-text-3xl tw-text-gray-300"></i>
                                    <p className="tw-mb-0 tw-mt-2 tw-text-sm tw-font-medium tw-text-gray-700">
                                        No lead distribution available
                                    </p>
                                    <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                        Adjust the dashboard filters to include
                                        more leads.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>

                    {rows.length > 0 && (
                        <tfoot className="table-light">
                            <tr>
                                <td className="tw-px-4 tw-font-semibold tw-text-gray-800">
                                    All {activeDimension.pluralLabel}
                                </td>
                                <td>
                                    <span className="tw-text-xs tw-text-gray-500">
                                        Selected dashboard filters
                                    </span>
                                </td>
                                {stageNames.map(stage => (
                                    <td
                                        key={stage}
                                        className="tw-text-end"
                                    >
                                        <strong className="tw-text-gray-900">
                                            {stageTotals[stage] || 0}
                                        </strong>
                                    </td>
                                ))}
                                <td className="tw-pe-4 tw-text-end">
                                    <strong className="tw-text-base tw-text-gray-900">
                                        {totalLeads}
                                    </strong>
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </>
    );

    return (
        <>
            <div className="tw-card tw-mb-0 tw-h-full">
                <div className="tw-card-header">
                    <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-3">
                        <div className="tw-min-w-0">
                            <h4 className="tw-card-title tw-mb-0">
                                Leads by Branch, Curriculum, Class and Stage
                            </h4>
                            <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                                Compare lead volume and admission-stage mix
                                across each segment.
                            </p>
                        </div>

                        {renderControls()}
                    </div>
                </div>

                <div className="tw-card-body !tw-p-0">
                    {renderDistribution()}
                </div>
            </div>

            <ModalContainerUpdated
                id="crm-dashboard-curriculum-stage-fullscreen"
                isOpen={fullscreenState.showModal}
                toggle={fullscreenClose}
                modalTitle="Leads by Branch, Curriculum, Class and Stage"
                modalSize="xl"
            >
                <div className="tw-p-4">
                    <div className="tw-mb-3 tw-flex tw-justify-end">
                        {renderControls(false)}
                    </div>
                    <div className="tw-overflow-hidden tw-rounded tw-border tw-border-gray-200">
                        {renderDistribution()}
                    </div>
                </div>
            </ModalContainerUpdated>
        </>
    );
};

export default CurriculumStageWidget;

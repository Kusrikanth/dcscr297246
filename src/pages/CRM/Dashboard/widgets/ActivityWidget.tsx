import { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { Button } from "../../../../Components/Common";
import {
    formatDayLabel,
    formatHours,
    type ActivityPoint,
} from "../helper";

interface ActivityWidgetProps {
    trends: ActivityPoint[];
}

const series = {
    crmHours: {
        key: "crmHours" as const,
        label: "CRM Usage",
        color: "#405189",
    },
    leads: {
        key: "leads" as const,
        label: "Lead",
        color: "#4e8bd8",
    },
};

const ActivityWidget = ({ trends }: ActivityWidgetProps) => {
    const [seriesKey, setSeriesKey] =
        useState<keyof typeof series>("crmHours");

    const active = series[seriesKey];
    const isHours = seriesKey === "crmHours";

    const values = useMemo(
        () =>
            trends.map(point =>
                Math.max(0, Number(point[active.key]) || 0),
            ),
        [trends, active.key],
    );

    const total = values.reduce(
        (sum, value) => sum + value,
        0,
    );

    const chartOptions = useMemo(
        () => ({
            chart: {
                type: "line" as const,
                toolbar: { show: false },
                fontFamily: "inherit",
            },
            colors: [active.color],
            stroke: {
                curve: "smooth" as const,
                width: 3,
            },
            markers: { size: 4, strokeWidth: 3 },
            dataLabels: { enabled: false },
            grid: { borderColor: "#eef0f5" },
            xaxis: {
                categories: trends.map(point =>
                    formatDayLabel(point.day),
                ),
                tickAmount: Math.min(8, trends.length || 1),
                labels: { style: { colors: "#878a99" } },
            },
            yaxis: {
                labels: {
                    style: { colors: "#878a99" },
                    formatter: (value: number) =>
                        isHours
                            ? formatHours(value)
                            : String(Math.round(value)),
                },
            },
            tooltip: {
                y: {
                    formatter: (value: number) =>
                        isHours
                            ? formatHours(value)
                            : String(Math.round(value)),
                },
            },
        }),
        [active.color, isHours, trends],
    );

    const periodLabel = trends.length
        ? `${formatDayLabel(trends[0].day)} – ${formatDayLabel(
            trends[trends.length - 1].day,
        )} · ${isHours ? "signed-in user" : "selected filters"}`
        : `No dates selected · ${isHours ? "signed-in user" : "selected filters"}`;

    return (
        <div className="tw-card tw-mb-0 tw-h-full">
            <div className="tw-card-header">
                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                    <div>
                        <h4 className="tw-card-title tw-mb-0">
                            My Daily CRM Activity
                        </h4>
                        <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                            {periodLabel}
                        </p>
                    </div>

                    <div
                        className="btn-group btn-group-sm tw-flex tw-gap-2"
                        role="tablist"
                        aria-label="Select activity report"
                    >
                        {Object.values(series).map(option => (
                            <Button
                                key={option.key}
                                type="button"
                                role="tab"
                                variant={
                                    seriesKey === option.key
                                        ? "primary"
                                        : "hoverInfo"
                                }
                                aria-selected={
                                    seriesKey === option.key
                                }
                                onClick={() =>
                                    setSeriesKey(option.key)
                                }
                            >
                                {option.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="tw-card-body">
                {trends.length ? (
                    <ReactApexChart
                        options={chartOptions}
                        series={[
                            {
                                name: active.label,
                                data: values,
                            },
                        ]}
                        type="line"
                        height={300}
                    />
                ) : (
                    <p className="tw-mb-0 tw-py-10 tw-text-center tw-text-sm tw-text-gray-500">
                        No days fall in the selected range.
                    </p>
                )}

                <div className="tw-mt-2 tw-flex tw-items-center tw-justify-center tw-gap-2 tw-text-sm">
                    <span
                        className="tw-inline-block tw-h-2.5 tw-w-2.5 tw-rounded-full"
                        style={{ backgroundColor: active.color }}
                    ></span>
                    <span className="tw-text-gray-600">
                        {active.label}
                    </span>
                    <strong className="tw-text-gray-900">
                        {isHours
                            ? formatHours(total)
                            : total.toLocaleString()}{" "}
                        total
                    </strong>
                </div>
            </div>
        </div>
    );
};

export default ActivityWidget;

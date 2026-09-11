import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

import type { FunnelSlice } from "../helper";

interface FunnelWidgetProps {
    funnel: FunnelSlice[];
}

const FunnelWidget = ({ funnel }: FunnelWidgetProps) => {
    const values = useMemo(
        () =>
            funnel.map(item =>
                Math.max(0, Number(item.value) || 0),
            ),
        [funnel],
    );

    const total = values.reduce(
        (sum, value) => sum + value,
        0,
    );

    const series = useMemo(
        () => [{ name: "Leads", data: values }],
        [values],
    );

    const options: ApexCharts.ApexOptions = useMemo(
        () => ({
            chart: {
                type: "bar",
                toolbar: { show: false },
                fontFamily: "inherit",
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                    distributed: true,
                    borderRadius: 4,
                    barHeight: "60%",
                    dataLabels: { position: "top" },
                },
            },
            colors: funnel.map(item => item.color),
            dataLabels: {
                enabled: true,
                offsetX: 28,
                style: {
                    fontSize: "12px",
                    colors: ["#495057"],
                },
                formatter: (value: number) =>
                    total
                        ? `${value} (${Math.round((value / total) * 100)}%)`
                        : String(value),
            },
            xaxis: {
                categories: funnel.map(item => item.label),
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: { style: { colors: "#878a99" } },
            },
            yaxis: {
                labels: { style: { colors: "#878a99" } },
            },
            legend: { show: false },
            grid: { borderColor: "#eef0f5" },
            tooltip: {
                y: {
                    formatter: (value: number) =>
                        total
                            ? `${value} lead${value === 1 ? "" : "s"} (${Math.round((value / total) * 100)}%)`
                            : `${value} leads`,
                    title: { formatter: () => "" },
                },
            },
        }),
        [funnel, total],
    );

    return (
        <div className="tw-card tw-mb-0 tw-h-full">
            <div className="tw-card-header">
                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                    <div>
                        <h4 className="tw-card-title tw-mb-0">
                            Admissions view
                        </h4>
                        <p className="tw-mb-0 tw-text-sm tw-text-gray-500">
                            Lead movement this academic year
                        </p>
                    </div>
                    <span className="badge badge-soft-success">
                        Live
                    </span>
                </div>
            </div>

            <div className="tw-card-body">
                {funnel.length ? (
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="bar"
                        height={Math.max(
                            240,
                            funnel.length * 46,
                        )}
                    />
                ) : (
                    <p className="tw-mb-0 tw-py-10 tw-text-center tw-text-sm tw-text-gray-500">
                        No leads fall in the selected filters.
                    </p>
                )}

                <div className="tw-flex tw-items-center tw-justify-between tw-border-t tw-border-gray-200 tw-pt-3">
                    <span className="tw-text-sm tw-font-semibold tw-text-gray-800">
                        Total Leads
                    </span>
                    <strong className="tw-text-gray-900">
                        {total.toLocaleString()}
                    </strong>
                </div>
            </div>
        </div>
    );
};

export default FunnelWidget;

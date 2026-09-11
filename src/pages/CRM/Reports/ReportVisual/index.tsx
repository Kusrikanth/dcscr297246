import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

import {
    formatReportValue,
    reportMeasureFormat,
    reportPalette,
    type PivotData,
    type PivotRow,
    type ReportDefinition,
    type ReportRecord,
    type ReportValue,
} from "../helper";
import PivotTable from "./PivotTable";
import MapReport from "./MapReport";

interface ReportVisualProps {
    report: Partial<ReportDefinition>;
    data?: PivotData | null;
    compact?: boolean;
    leads?: Array<ReportRecord>;
}

function buildStackedSeries(data: PivotData) {
    const categories = (data.rows || []).map((row: PivotRow) => row.label);

    const series = (data.columnNames || []).map((columnName, columnIndex) => ({
        name: columnName === "Value" ? data.measures?.[0]?.label || "Value" : columnName,
        data: (data.rows || []).map(row => Number(row.measureCells?.[0]?.[columnIndex]) || 0),
    }));

    return { categories, series };
}

const ReportVisual = ({ report, data, compact = false, leads = [] }: ReportVisualProps) => {
    const valueFormat = reportMeasureFormat(report);
    const formatValue = (value: ReportValue) => formatReportValue(value, valueFormat);

    const values = useMemo(
        () =>
            (data?.funnel || [])
                .filter(item => !report?.stages?.length || report.stages.includes(item.label))
                .map((item, index) => ({
                    ...item,
                    value: Number(item.value || 0),
                    color: item.color || reportPalette[index % reportPalette.length],
                })),
        [data, report]
    );

    const total = values.reduce((sum, item) => sum + item.value, 0) || 1;
    const showLabels = report.showLabels !== false;
    const chartHeight = compact ? 240 : 340;

    if (report.type === "map") {
        return <MapReport report={report} leads={leads} compact={compact} />;
    }

    if (report.type === "table") {
        return data ? <PivotTable report={report} data={data} /> : null;
    }

    if (!values.length) {
        return (
            <p className="tw-mb-0 tw-py-6 tw-text-center tw-text-sm tw-text-gray-500">
                No data matches these filters.
            </p>
        );
    }

    if (report.type === "cards") {
        const columns = Math.min(4, Math.max(1, Number(report.cardColumns || (compact ? 2 : 4))));
        const columnClass =
            { 1: "col-12", 2: "col-6", 3: "col-12 col-md-4", 4: "col-6 col-md-3" }[columns] ||
            "col-6 col-md-3";

        return (
            <div className="row">
                {values.map(item => (
                    <div className={columnClass} key={item.label}>
                        <div className="tw-mb-3 tw-rounded-lg tw-border tw-border-gray-200 tw-p-3">
                            <div className="tw-flex tw-items-center tw-gap-2">
                                <span
                                    className="tw-h-2 tw-w-2 tw-rounded-full"
                                    style={{ backgroundColor: item.color }}
                                ></span>
                                <span className="tw-truncate tw-text-xs tw-text-gray-500">
                                    {item.label}
                                </span>
                            </div>

                            <h4 className="tw-mb-0 tw-mt-1 tw-text-xl tw-font-semibold">
                                {formatValue(item.value)}
                            </h4>

                            {showLabels && (
                                <p className="tw-mb-0 tw-text-xs tw-text-gray-500">
                                    {((item.value / total) * 100).toFixed(1)}% of total
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (report.type === "funnel") {
        const widest = Math.max(...values.map(item => item.value)) || 1;

        return (
            <div>
                {values.map(item => (
                    <div className="tw-mb-2" key={item.label}>
                        <div className="tw-mb-1 tw-flex tw-items-center tw-justify-between tw-text-xs">
                            <span className="tw-text-gray-600">{item.label}</span>
                            {showLabels && (
                                <span className="tw-font-medium tw-text-gray-800">
                                    {formatValue(item.value)}
                                </span>
                            )}
                        </div>

                        <div className="tw-h-6 tw-w-full tw-rounded tw-bg-gray-100">
                            <div
                                className="tw-flex tw-h-6 tw-items-center tw-justify-end tw-rounded tw-px-2 tw-text-xs tw-text-white"
                                style={{
                                    width: `${Math.max(4, (item.value / widest) * 100)}%`,
                                    backgroundColor: item.color,
                                }}
                            >
                                {showLabels && `${((item.value / total) * 100).toFixed(1)}%`}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (report.type === "pie" || report.type === "donut") {
        return (
            <ReactApexChart
                type={report.type}
                height={chartHeight}
                series={values.map(item => item.value)}
                options={{
                    chart: { toolbar: { show: false } },
                    labels: values.map(item => item.label),
                    colors: values.map(item => item.color),
                    legend: { position: "bottom", show: !compact },
                    dataLabels: { enabled: showLabels },
                    tooltip: { y: { formatter: (value: number) => formatValue(value) } },
                    stroke: { width: 1 },
                }}
            />
        );
    }

    if (report.type === "line") {
        return (
            <ReactApexChart
                type="line"
                height={chartHeight}
                series={[
                    {
                        name: data?.measures?.[0]?.label || "Value",
                        data: values.map(item => item.value),
                    },
                ]}
                options={{
                    chart: { toolbar: { show: false } },
                    colors: [reportPalette[0]],
                    stroke: { curve: "smooth", width: 3 },
                    markers: { size: 4 },
                    dataLabels: {
                        enabled: showLabels,
                        formatter: (value: number) => formatValue(value),
                    },
                    xaxis: { categories: values.map(item => item.label) },
                    yaxis: { labels: { formatter: (value: number) => formatValue(value) } },
                    tooltip: { y: { formatter: (value: number) => formatValue(value) } },
                    grid: { borderColor: "#eff2f7" },
                }}
            />
        );
    }

    if (report.type === "stacked-column" || report.type === "stacked-bar") {
        const { categories, series } = buildStackedSeries(data as PivotData);

        return (
            <ReactApexChart
                type="bar"
                height={chartHeight}
                series={series}
                options={{
                    chart: { stacked: true, toolbar: { show: false } },
                    colors: reportPalette,
                    plotOptions: {
                        bar: {
                            horizontal: report.type === "stacked-bar",
                            borderRadius: 3,
                            columnWidth: "55%",
                        },
                    },
                    dataLabels: {
                        enabled: showLabels,
                        formatter: (value: number) => formatValue(value),
                    },
                    xaxis: { categories },
                    yaxis: { labels: { formatter: (value: number) => formatValue(value) } },
                    legend: { position: "bottom", show: !compact },
                    tooltip: { y: { formatter: (value: number) => formatValue(value) } },
                    grid: { borderColor: "#eff2f7" },
                }}
            />
        );
    }

    return <PivotTable report={report} data={data as PivotData} />;
};

export default ReportVisual;

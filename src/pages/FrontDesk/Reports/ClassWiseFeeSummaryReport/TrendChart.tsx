import { useMemo } from "react";
import LineChart from "../../../../Components/Common/LineChart";
import { getFeeAmountDisplayValue } from "../../../../utility/commonutility";
import { formatAmount, ITrendPoint } from "./helper";

interface ITrendChart {
    /** One point per category, in report order. */
    data: ITrendPoint[];
    /** Counts plot as plain numbers, amounts as rupees. */
    valueType: "count" | "amount";
    /** Line under the heading saying what the series covers. */
    caption: string;
    /** Prefixes the category in the tooltip, e.g. "Class ". */
    categoryPrefix?: string;
    /** Category to call out on the line — the running academic year, say. */
    highlightLabel?: string;
    /** Inside a modal the card chrome and heading come from the modal itself. */
    inModal?: boolean;
    /** Heading, used only outside a modal. */
    title?: string;
}

const PRIMARY = "#1bb3a6";

/**
 * The one chart every summary card opens: same line, labels, axes and tooltip shape whether it is plotting
 * students or rupees, classes or academic years.
 */
export default function TrendChart({ data, valueType, caption, categoryPrefix = "", highlightLabel, inModal, title }: ITrendChart) {
    const isAmount = valueType === "amount";
    const display = (value: number) => isAmount ? `₹ ${formatAmount(value)}` : `${value}`;

    const { categories, values, points, total, peak } = useMemo(() => {
        const rows = Array.isArray(data) ? data : [];
        const categories = rows.map((item) => item.label);
        const values = rows.map((item) => Number(item.value) || 0);
        const total = values.reduce((acc, value) => acc + value, 0);
        const peakIdx = values.length ? values.indexOf(Math.max(...values)) : -1;
        return { categories, values, points: rows, total, peak: peakIdx >= 0 ? { label: categories[peakIdx], value: values[peakIdx] } : null };
    }, [data]);

    const series = useMemo(() => [{ name: isAmount ? "Outstanding" : "Students", data: values }], [values, isAmount]);

    const options: any = useMemo(() => {
        const highlightIdx = highlightLabel ? categories.indexOf(highlightLabel) : -1;
        return {
            chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "inherit" },
            colors: [PRIMARY],
            stroke: { curve: "smooth", width: 2 },
            markers: {
                size: 4,
                strokeWidth: 2,
                strokeColors: "#ffffff",
                hover: { size: 6 },
                // The highlighted category keeps a larger, filled marker so it reads at a glance.
                discrete: highlightIdx >= 0
                    ? [{ seriesIndex: 0, dataPointIndex: highlightIdx, fillColor: PRIMARY, strokeColor: "#ffffff", size: 7 }]
                    : [],
            },
            dataLabels: {
                enabled: true,
                offsetY: -8,
                formatter: (value: number) => value ? (isAmount ? getFeeAmountDisplayValue(value) : `${value}`) : "",
                // With a background, ApexCharts uses style.colors as the pill fill and background.foreColor as the text colour.
                style: { fontSize: "11px", fontWeight: 600, colors: ["#ffffff"] },
                background: { enabled: true, foreColor: "#374151", borderRadius: 3, padding: 4, borderWidth: 1, borderColor: "#e5e7eb", opacity: 1 },
                dropShadow: { enabled: false },
            },
            grid: { borderColor: "#eef0f2", strokeDashArray: 3, xaxis: { lines: { show: false } }, padding: { left: 8, right: 8, top: 16 } },
            xaxis: {
                categories,
                tickPlacement: "on",
                axisBorder: { show: false },
                axisTicks: { show: false },
                labels: { rotate: -45, rotateAlways: categories.length > 8, hideOverlappingLabels: false, style: { colors: "#6b7280", fontSize: "11px" } },
                crosshairs: { show: true, stroke: { color: "#cbd5e1", width: 1, dashArray: 0 } },
                tooltip: { enabled: false },
            },
            yaxis: {
                min: 0,
                forceNiceScale: true,
                labels: {
                    style: { colors: "#6b7280", fontSize: "12px" },
                    formatter: (value: number) => isAmount ? getFeeAmountDisplayValue(value) : `${Math.round(value)}`,
                },
            },
            tooltip: {
                shared: true,
                intersect: false,
                x: { formatter: (_: any, { dataPointIndex }: any) => `${categoryPrefix}${categories[dataPointIndex]}` },
                y: {
                    // The other half of the picture — students behind an amount, or the amount behind a count.
                    formatter: (value: number, { dataPointIndex }: any) => {
                        const point = points[dataPointIndex] || {};
                        if (isAmount) {
                            const students = Number(point.studentCount) || 0;
                            return students ? `₹ ${formatAmount(value)} · ${students} student${students === 1 ? "" : "s"}` : `₹ ${formatAmount(value)}`;
                        }
                        const outstanding = Number(point.outstanding) || 0;
                        return `${value} student${value === 1 ? "" : "s"}${outstanding ? ` · ₹ ${formatAmount(outstanding)} outstanding` : ""}`;
                    },
                    title: { formatter: () => "" },
                },
                marker: { show: true },
            },
            legend: { show: false },
        };
    }, [categories, points, isAmount, categoryPrefix, highlightLabel]);

    return (
        <div className={inModal ? "" : "tw-bg-white tw-rounded-lg tw-shadow tw-mb-4"}>
            <div className={`tw-px-4 tw-py-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2${inModal ? "" : " tw-border-b"}`}>
                <div>
                    {!inModal && title && <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-0">{title}</h4>}
                    <p className="tw-text-xs tw-text-gray-500 tw-mb-0">{caption}</p>
                </div>
                <div className="tw-flex tw-items-center tw-gap-6 tw-text-sm">
                    <div>
                        <span className="tw-text-gray-500">Total</span>{" "}
                        <span className="tw-font-semibold tw-text-gray-900">{display(total)}</span>
                    </div>
                    {peak && peak.value > 0 && (
                        <div>
                            <span className="tw-text-gray-500">Highest</span>{" "}
                            <span className="tw-font-semibold tw-text-gray-900">{display(peak.value)}</span>{" "}
                            <span className="tw-text-gray-500">in {peak.label}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="tw-px-2 tw-pt-2">
                {categories.length === 0 ? (
                    <p className="tw-text-sm tw-text-gray-500 tw-p-4 tw-mb-0">Nothing to plot for the selected filters.</p>
                ) : (
                    <LineChart options={options} series={series} height={300} />
                )}
            </div>
        </div>
    );
}

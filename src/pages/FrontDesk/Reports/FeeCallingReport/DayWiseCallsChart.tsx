import { useMemo } from "react";
import { eachDayOfInterval, format, parseISO } from "date-fns";
import LineChart from "../../../../Components/Common/LineChart";

interface IDayWiseCallsChart {
    /** yyyy-MM-dd inclusive bounds of the plotted window */
    startDate: string;
    endDate: string;
    /** [{ date: 'yyyy-MM-dd', count }] from the summary API; gaps are filled with 0 */
    data: Array<{ date: string; count: number }>;
}

const PRIMARY = "#1bb3a6";

export default function DayWiseCallsChart({ startDate, endDate, data }: IDayWiseCallsChart) {
    const { categories, counts, total, peak } = useMemo(() => {
        const byDate = new Map<string, number>();
        (Array.isArray(data) ? data : []).forEach((item) => {
            if (item?.date) byDate.set(item.date.slice(0, 10), Number(item.count) || 0);
        });
        let days: Date[] = [];
        try {
            days = eachDayOfInterval({ start: parseISO(startDate), end: parseISO(endDate) });
        } catch {
            days = [];
        }
        const categories = days.map((d) => format(d, "yyyy-MM-dd"));
        const counts = categories.map((key) => byDate.get(key) || 0);
        const total = counts.reduce((a, b) => a + b, 0);
        const peakIdx = counts.length ? counts.indexOf(Math.max(...counts)) : -1;
        return { categories, counts, total, peak: peakIdx >= 0 ? { date: categories[peakIdx], count: counts[peakIdx] } : null };
    }, [startDate, endDate, data]);

    const series = useMemo(() => [{ name: "Calls", data: counts }], [counts]);

    const options: any = useMemo(() => ({
        chart: { type: "line", toolbar: { show: false }, zoom: { enabled: false }, fontFamily: "inherit" },
        colors: [PRIMARY],
        stroke: { curve: "smooth", width: 2 },
        markers: { size: 4, strokeWidth: 2, strokeColors: "#ffffff", hover: { size: 6 } },
        dataLabels: {
            enabled: true,
            offsetY: -8,
            formatter: (v: number) => `${v}`,
            // With a background, ApexCharts uses style.colors as the pill fill and background.foreColor as the text colour.
            style: { fontSize: "11px", fontWeight: 600, colors: ["#ffffff"] },
            background: { enabled: true, foreColor: "#374151", borderRadius: 3, padding: 4, borderWidth: 1, borderColor: "#e5e7eb", opacity: 1 },
            dropShadow: { enabled: false },
        },
        grid: { borderColor: "#eef0f2", strokeDashArray: 3, xaxis: { lines: { show: false } }, padding: { left: 8, right: 8, top: 12 } },
        xaxis: {
            categories,
            tickPlacement: "on",
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                rotate: 0,
                hideOverlappingLabels: true,
                style: { colors: "#6b7280", fontSize: "12px" },
                formatter: (value: string) => {
                    try { return format(parseISO(value), categories.length > 14 ? "d MMM" : "EEE d MMM"); } catch { return value; }
                },
            },
            crosshairs: { show: true, stroke: { color: "#cbd5e1", width: 1, dashArray: 0 } },
            tooltip: { enabled: false },
        },
        yaxis: {
            min: 0,
            forceNiceScale: true,
            labels: { style: { colors: "#6b7280", fontSize: "12px" }, formatter: (v: number) => `${Math.round(v)}` },
        },
        tooltip: {
            shared: true,
            intersect: false,
            x: { formatter: (_: any, { dataPointIndex }: any) => {
                const key = categories[dataPointIndex];
                try { return format(parseISO(key), "EEEE, d MMM yyyy"); } catch { return key; }
            } },
            y: { formatter: (v: number) => `${v} call${v === 1 ? "" : "s"}`, title: { formatter: () => "" } },
            marker: { show: true },
        },
        legend: { show: false },
    }), [categories]);

    const rangeLabel = (() => {
        try { return `${format(parseISO(startDate), "d MMM yyyy")} – ${format(parseISO(endDate), "d MMM yyyy")}`; } catch { return ""; }
    })();

    return (
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
            <div className="tw-border-b tw-px-4 tw-py-3 tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
                <div>
                    <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-0">Day-wise Calls</h4>
                    <p className="tw-text-xs tw-text-gray-500 tw-mb-0">{rangeLabel}</p>
                </div>
                <div className="tw-flex tw-items-center tw-gap-6 tw-text-sm">
                    <div>
                        <span className="tw-text-gray-500">Total</span>{" "}
                        <span className="tw-font-semibold tw-text-gray-900">{total}</span>
                    </div>
                    {peak && peak.count > 0 && (
                        <div>
                            <span className="tw-text-gray-500">Peak</span>{" "}
                            <span className="tw-font-semibold tw-text-gray-900">{peak.count}</span>{" "}
                            <span className="tw-text-gray-500">on {format(parseISO(peak.date), "d MMM")}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="tw-px-2 tw-pt-2">
                {categories.length === 0 ? (
                    <p className="tw-text-sm tw-text-gray-500 tw-p-4 tw-mb-0">Select a valid date range to see day-wise calls.</p>
                ) : (
                    <LineChart options={options} series={series} height={260} />
                )}
            </div>
        </div>
    );
}

import React, { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import classNames from "classnames";

import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { SelectInput, TextInput } from "../../../../Components/Common";
import FeeCollectionTrendTable from "./FeeCollectionTrendTable";
import { getDisplayAmountValue } from "../../../../utility/commonutility";
import {
    aggregateFeeCollectionTrend,
    buildSampleFeeCollectionTrend,
    clampFeeTrendCount,
    feeTrendColors,
    feeTrendDefaultCount,
    feeTrendMaxCount,
    feeTrendPeriodOptions,
    feeTrendPeriodUnitLabel,
    getFeeCollectionTrendRange,
    getFeeCollectionTrendTotals,
    IFeeTrendBucket,
    IFeeTrendDailyRow,
    IFeeTrendPeriodId,
    USE_SAMPLE_FEE_COLLECTION_TREND,
} from "./helper";

interface Props {
    academicYearList?: Array<any>;
    // Daily receivable/collected rows once an API supplies them; falls back to fixtures.
    trendData?: Array<IFeeTrendDailyRow>;
}

const periodSubTitle: Record<IFeeTrendPeriodId, string> = {
    DAY: "Day wise",
    WEEK: "Week wise",
    MONTH: "Month wise",
};

type IFeeTrendViewMode = "CHART" | "TABLE";

const viewModeOptions: Array<{ id: IFeeTrendViewMode; title: string; iconClass: string }> = [
    { id: "CHART", title: "Chart view", iconClass: "ri-bar-chart-grouped-line" },
    { id: "TABLE", title: "Table view", iconClass: "ri-table-line" },
];

export default function FeeCollectionTrendChart({ academicYearList, trendData }: Props) {
    const [activePeriod, setActivePeriod] = useState<IFeeTrendPeriodId>("DAY");
    const [viewMode, setViewMode] = useState<IFeeTrendViewMode>("CHART");
    // Each granularity remembers its own count, so switching tabs keeps a sensible window.
    const [periodCountState, setPeriodCountState] = useState<Record<IFeeTrendPeriodId, number>>({
        ...feeTrendDefaultCount,
    });
    // Kept separate from the committed count so the field can be cleared while typing.
    const [countInputState, setCountInputState] = useState<string>(`${feeTrendDefaultCount.DAY}`);
    const [academicYearIdState, setAcademicYearIdState] = useState<string>("");

    const academicYearMenuItems = useMemo(
        () => (Array.isArray(academicYearList) ? academicYearList : []),
        [academicYearList]
    );

    const selectedAcademicYear = useMemo(() => {
        if (academicYearMenuItems.length === 0) {
            return null;
        }
        const selectedYear = academicYearIdState && academicYearMenuItems.find(
            (year: any) => `${year?.academicYearId}` === academicYearIdState
        );
        // Falls back to the running year, so a stale selection never leaves the select blank.
        return selectedYear || academicYearMenuItems.find(
            (year: any) => `${year?.yearStatus}`.toLowerCase() === "current"
        ) || academicYearMenuItems[0];
    }, [academicYearMenuItems, academicYearIdState]);

    const activeCount = periodCountState[activePeriod];

    function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
        const { currentTarget } = event,
            periodId: IFeeTrendPeriodId = (currentTarget.getAttribute("data-id") as IFeeTrendPeriodId) || "DAY";
        setActivePeriod(periodId);
        setCountInputState(`${periodCountState[periodId]}`);
    }

    function academicYearChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        setAcademicYearIdState(event.target.value);
    }

    function countChangeHndlr(event: React.ChangeEvent<HTMLInputElement>) {
        const { value } = event.target;
        setCountInputState(value);
        if (value !== "" && !isNaN(Number(value))) {
            setPeriodCountState(prevState => ({
                ...prevState,
                [activePeriod]: clampFeeTrendCount(activePeriod, value)
            }));
        }
    }

    // An empty or out-of-range entry snaps back to what the chart is actually showing.
    function countBlurHndlr() {
        setCountInputState(`${periodCountState[activePeriod]}`);
    }

    const buckets: Array<IFeeTrendBucket> = useMemo(() => {
        const { fromDate, toDate, bucketCount, isEmptyRange } = getFeeCollectionTrendRange(
            activePeriod, activeCount, selectedAcademicYear?.startDate, selectedAcademicYear?.endDate
        );
        if (isEmptyRange) {
            return [];
        }
        let dailyRows: Array<IFeeTrendDailyRow> = [];
        if (Array.isArray(trendData) && trendData.length > 0) {
            dailyRows = trendData.filter((row) => {
                const rowDate = new Date(row?.date);
                return !isNaN(rowDate.getTime()) && rowDate >= fromDate && rowDate <= toDate;
            });
        } else if (USE_SAMPLE_FEE_COLLECTION_TREND) {
            dailyRows = buildSampleFeeCollectionTrend(fromDate, toDate);
        }
        return aggregateFeeCollectionTrend(dailyRows, activePeriod, bucketCount);
    }, [activePeriod, activeCount, selectedAcademicYear, trendData]);

    const totals = useMemo(() => getFeeCollectionTrendTotals(buckets), [buckets]);

    const plottedRangeLabel = useMemo(() => {
        if (buckets.length === 0) {
            return "";
        }
        const firstLabel = buckets[0]?.rangeLabel?.split(" - ")?.[0] || "";
        const lastLabel = buckets[buckets.length - 1]?.rangeLabel?.split(" - ")?.pop() || "";
        return buckets.length === 1 ? lastLabel : `${firstLabel} to ${lastLabel}`;
    }, [buckets]);

    const series = useMemo(() => ([
        {
            name: "Academic Fee",
            type: "column",
            data: buckets.map((bucket) => bucket.academicPercent),
        },
        {
            name: "Transport Fee",
            type: "column",
            data: buckets.map((bucket) => bucket.transportPercent),
        },
        {
            name: "Total Collection %",
            type: "line",
            data: buckets.map((bucket) => bucket.totalPercent),
        },
    ]), [buckets]);

    const options: ApexCharts.ApexOptions = useMemo(() => {
        const maxPercent = buckets.reduce((max, bucket) => Math.max(
            max, bucket.academicPercent, bucket.transportPercent, bucket.totalPercent
        ), 0);
        return {
            chart: {
                type: "line",
                stacked: false,
                toolbar: { show: false },
                fontFamily: "inherit",
            },
            colors: [feeTrendColors.academic, feeTrendColors.transport, feeTrendColors.overall],
            stroke: {
                width: [0, 0, 3],
                curve: "smooth",
            },
            plotOptions: {
                bar: {
                    columnWidth: buckets.length > 20 ? "80%" : "55%",
                    borderRadius: 3,
                    borderRadiusApplication: "end",
                },
            },
            markers: {
                size: [0, 0, 4],
                strokeWidth: 2,
                hover: { size: 6 },
            },
            dataLabels: { enabled: false },
            grid: {
                borderColor: "#e9ebec",
                strokeDashArray: 4,
                padding: { left: 10, right: 10 },
            },
            xaxis: {
                categories: buckets.map((bucket) => bucket.label),
                tickPlacement: "on",
                labels: {
                    rotate: -45,
                    rotateAlways: buckets.length > 12,
                    hideOverlappingLabels: true,
                    style: { fontSize: "11px", colors: "#878a99" },
                },
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
            yaxis: {
                min: 0,
                max: Math.min(100, Math.max(20, Math.ceil((maxPercent + 10) / 10) * 10)),
                tickAmount: 5,
                title: {
                    text: "Collection % of receivable",
                    style: { fontSize: "12px", fontWeight: 500, color: "#878a99" },
                },
                labels: {
                    formatter: (value: number) => `${Math.round(value)}%`,
                    style: { fontSize: "11px", colors: "#878a99" },
                },
            },
            legend: {
                position: "top",
                horizontalAlign: "right",
                markers: { shape: "circle", size: 6 },
                itemMargin: { horizontal: 8 },
            },
            tooltip: {
                shared: true,
                intersect: false,
                x: {
                    formatter: (value: any, opts?: any) =>
                        buckets[opts?.dataPointIndex]?.rangeLabel || value,
                },
                y: {
                    formatter: (value: number, opts?: any) => {
                        const bucket = buckets[opts?.dataPointIndex];
                        const percent = `${Number(value || 0).toFixed(1)}%`;
                        if (!bucket) {
                            return percent;
                        }
                        const seriesIndex = opts?.seriesIndex;
                        const collected = seriesIndex === 0 ? bucket.academicCollected
                            : seriesIndex === 1 ? bucket.transportCollected
                                : bucket.totalCollected;
                        const receivable = seriesIndex === 0 ? bucket.academicReceivable
                            : seriesIndex === 1 ? bucket.transportReceivable
                                : bucket.totalReceivable;
                        return `${percent} — ₹ ${getDisplayAmountValue(collected)} of ₹ ${getDisplayAmountValue(receivable)}`;
                    },
                },
            },
            responsive: [
                {
                    breakpoint: 767,
                    options: {
                        yaxis: { title: { text: "" } },
                        legend: { horizontalAlign: "left" },
                    },
                },
            ],
        };
    }, [buckets]);

    return (
        <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4">
            <div className="tw-border-b tw-px-4 tw-py-3 horizontal_tab_fee">
                <div className="tw-grid tw-grid-cols-12 tw-items-center">
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                            Fee Collection vs Receivable
                        </h4>
                        <p className="tw-text-xs tw-text-gray-500 tw-mb-0">
                            {periodSubTitle[activePeriod]} collection % of the actual receivable
                            {plottedRangeLabel ? ` · ${plottedRangeLabel}` : ""}
                        </p>
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6 tw-pt-3 md:tw-pt-0 tw-flex tw-items-center tw-gap-3 md:tw-justify-end">
                        <UpdatedHorizontalTab
                            MenuOptions={feeTrendPeriodOptions}
                            clickMenuHandler={clickMenuHandler}
                            activeTabId={activePeriod}
                            horizontalClass="tw-pl-0"
                        />

                        <div className="tw-flex tw-items-center tw-bg-gray-100 tw-rounded-full tw-p-1">
                            {viewModeOptions.map((option) => (
                                <button
                                    key={option.id}
                                    type="button"
                                    title={option.title}
                                    aria-label={option.title}
                                    aria-pressed={viewMode === option.id}
                                    onClick={() => setViewMode(option.id)}
                                    className={classNames(
                                        "tw-border-0 tw-rounded-full tw-px-3 tw-py-1 tw-text-base tw-leading-none",
                                        viewMode === option.id
                                            ? "tw-bg-white tw-text-gray-700 tw-shadow"
                                            : "tw-bg-transparent tw-text-gray-500"
                                    )}
                                >
                                    <i className={option.iconClass} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="tw-px-4 tw-py-3 tw-border-b tw-flex tw-flex-wrap tw-items-center tw-gap-4">
                <div className="tw-w-full sm:tw-w-56">
                    <SelectInput
                        name="feeTrendAcademicYear"
                        formgroupClassName="tw-mb-0"
                        labelText="Academic Year"
                        labelClass="tw-text-xs tw-text-gray-500 tw-mb-1"
                        value={`${selectedAcademicYear?.academicYearId || ""}`}
                        onChange={academicYearChangeHndlr}
                        menuItems={academicYearMenuItems}
                        valueKey="academicYearId"
                        textKey="academicYearName"
                        defaultSelect="Academic Year"
                        hideSelectOption={academicYearMenuItems.length > 0}
                    />
                </div>

                <div>
                    <p className="tw-text-xs tw-text-gray-500 tw-mb-1">Show period</p>
                    <div className="tw-flex tw-items-center tw-gap-2">
                        <span className="tw-text-sm tw-text-gray-700">Last</span>
                        <TextInput
                            name="feeTrendCount"
                            inputType="number"
                            formgroupClassName="tw-mb-0"
                            inputClassName="tw-text-center"
                            customWidth="76px"
                            value={countInputState}
                            onChange={countChangeHndlr}
                            onBlur={countBlurHndlr}
                        />
                        <span className="tw-text-sm tw-text-gray-700 tw-text-nowrap">
                            {feeTrendPeriodUnitLabel[activePeriod]}
                        </span>
                        <span className="tw-text-xs tw-text-gray-400 tw-text-nowrap">
                            (max {feeTrendMaxCount[activePeriod]})
                        </span>
                    </div>
                </div>
            </div>

            {buckets.length > 0 ? (
                <React.Fragment>
                    <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-px-4 tw-pt-4">
                        <div className="tw-col-span-6 lg:tw-col-span-3">
                            <p className="tw-text-xs tw-text-gray-500 tw-mb-1">Total Receivable</p>
                            <h5 className="tw-text-base tw-mb-0" style={{ color: "#495057", fontWeight: 650 }}>
                                ₹ {getDisplayAmountValue(totals.totalReceivable)}
                            </h5>
                        </div>
                        <div className="tw-col-span-6 lg:tw-col-span-3">
                            <p className="tw-text-xs tw-text-gray-500 tw-mb-1">Total Collected</p>
                            <h5 className="tw-text-base tw-mb-0" style={{ color: "#495057", fontWeight: 650 }}>
                                ₹ {getDisplayAmountValue(totals.totalCollected)}
                            </h5>
                        </div>
                        <div className="tw-col-span-6 lg:tw-col-span-3">
                            <p className="tw-text-xs tw-text-gray-500 tw-mb-1">Academic / Transport %</p>
                            <h5 className="tw-text-base tw-mb-0" style={{ color: "#495057", fontWeight: 650 }}>
                                {totals.academicPercent}% / {totals.transportPercent}%
                            </h5>
                        </div>
                        <div className="tw-col-span-6 lg:tw-col-span-3">
                            <p className="tw-text-xs tw-text-gray-500 tw-mb-1">Overall Collection %</p>
                            <h5 className="tw-text-base tw-mb-0" style={{ color: feeTrendColors.overall, fontWeight: 650 }}>
                                {totals.totalPercent}%
                            </h5>
                        </div>
                    </div>

                    {viewMode === "CHART" ? (
                        <div className="tw-px-2 tw-pb-2">
                            <ReactApexChart
                                type="line"
                                options={options}
                                series={series}
                                height={340}
                            />
                        </div>
                    ) : (
                        <div className="tw-pt-4">
                            <FeeCollectionTrendTable buckets={buckets} totals={totals} />
                        </div>
                    )}
                </React.Fragment>
            ) : (
                <div className="tw-px-4 tw-py-10 tw-text-center tw-text-sm tw-text-gray-500">
                    No fee collection data available for the selected academic year and period.
                </div>
            )}
        </div>
    );
}

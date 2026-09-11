import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { formatNumber } from "../../../../utility/commonutility";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getDateWiseLoginCountAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { generateWeekLabel } from "../../../../utility/dateutility";

type ITabDataId = "DAYS" | "WEEKS" | "MONTHS"

type ITabData = {
    id: ITabDataId;
    tabName: string;
    className: string;
}

const tabData: Array<ITabData> = [
    {
        id: "DAYS",
        tabName: "Days",
        className: "tw-p-2 tw-rounded-l-md tw-cursor-pointer",
    },
    {
        id: "WEEKS",
        tabName: "Weeks",
        className: "tw-p-2 tw-cursor-pointer",
    },
    {
        id: "MONTHS",
        tabName: "Months",
        className: "tw-p-2 tw-rounded-r-md tw-cursor-pointer",
    }
]

const BranchWiseLoginCount = (props: any) => {
    const { branchId, academicYearId, startDate, endDate, roleType } = props || {};

    const dispatch = useAppDispatch();
    const [chartData, setChartData] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<ITabDataId>("DAYS");

    const {
        academicYearListResp, currentInstIdResp: instituteId, currentBranchIdResp, getDateWiseLoginCountResp, } =
        useAppSelector(({ appData, instAcademics, reports }) => ({
            academicYearListResp: instAcademics.academicYearListResp,
            currentInstIdResp: appData.currentInstIdResp,
            currentBranchIdResp: appData.currentBranchIdResp,
            getDateWiseLoginCountResp: reports.getDateWiseLoginCountResp,
        }), shallowEqual);

    const getTransactionSummaryApiCall = (otherProps?: any) => {
        const payload = {
            instituteId, academicYearId, type: activeTab, ...otherProps
        }
        dispatch(getDateWiseLoginCountAct(generateActionPayload("get_date_wise_login_count", undefined, payload)))
    }

    useEffect(() => {
        if (instituteId && academicYearId) {
            getTransactionSummaryApiCall({ academicYearId })
        }
    }, [academicYearId])

    useEffect(() => {
        if (Array.isArray(getDateWiseLoginCountResp) && getDateWiseLoginCountResp.length > 0) {
            const modifiedData = getDateWiseLoginCountResp?.reduce((acc: any[], curr: any) => {
                const label = activeTab === "DAYS" ? curr?.date : activeTab === "WEEKS" ? generateWeekLabel(curr?.weekStartDate, curr?.weekEndDate) : curr?.monthName?.slice(0, 3) + "-" + String(curr?.year).slice(-2);
                const findIndex = acc?.findIndex((item: any) => item?.label === label);
                const name = curr?.source?.toLowerCase() === "total logins" ? "totalLoggedIn" : curr?.source?.toLowerCase()
                if (findIndex > -1) {
                    acc[findIndex][name] = curr?.totalLoggedIn
                } else {
                    acc.push({
                        label,
                        web: name === 'web' ? curr.totalLoggedIn : 0,
                        android: name === 'android' ? curr.totalLoggedIn : 0,
                        ios: name === 'ios' ? curr.totalLoggedIn : 0,
                        totalLoggedIn: name === "total logins" ? curr.totalLoggedIn : 0
                    })
                }
                return acc
            }, [])
            setChartData(modifiedData)
        }
        else {
            setChartData([])
        }
    }, [getDateWiseLoginCountResp])

    const series: ApexAxisChartSeries | ApexNonAxisChartSeries = useMemo(() => [
        {
            id: "web-logins",
            name: "WEB",
            type: "column",
            data: chartData.map((item) => item?.web || 0),
            color: "#0AB39C",
        },
        {
            id: "android-logins",
            name: "ANDROID",
            type: "column",
            data: chartData.map((item) => item?.android),
            color: "#405189",
        },
        {
            id: "ios-logins",
            name: "IOS",
            type: "column",
            data: chartData.map((item) => item?.ios),
            color: "#f06548",
        },
        {
            id: "total-logins",
            name: "Total Logins",
            type: "area",
            data: chartData.map((item) => item?.totalLoggedIn),
            color: "#FAC364",
            fill: {
                type: "gradient",
                gradient: {
                    shade: "light",
                    type: "vertical",
                    shadeIntensity: 0.5,
                    gradientToColors: ["#CED4DC"],
                    inverseColors: false,
                    opacityFrom: 0.6,
                    opacityTo: 0.8,
                    stops: [0, 100],
                },
            },
        },
    ], [chartData])

    const options: ApexCharts.ApexOptions = useMemo(() => ({
        chart: {
            height: 350,
            type: "line",
            stacked: false,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                columnWidth: chartData.length <= 5 ? "30px" : "50%",
                barHeight: "70%",
                dataLabels: {
                    position: "top",
                },
            },
        },
        dataLabels: {
            enabled: true,
            position: "top",
            offsetY: -20,
            style: {
                fontSize: "10px",
                colors: ["#000"],
                fontWeight: 500,
            },
            formatter: function (val: any, { seriesIndex }: any) {
                const hiddenSeries = [3];
                return hiddenSeries.includes(seriesIndex) ? "" : val;
            },
        },
        stroke: {
            width: [0, 0, 0, 1],
            dashArray: [0, 0, 0, 3],
            curve: "smooth",
        },
        fill: {
            opacity: [1, 1, 1, 0.3],
            gradient: {
                opacityFrom: 0.6,
                opacityTo: 0.8,
            },
        },
        markers: {
            size: [0, 0, 0, 4],
            hover: {
                size: 4,
            },
        },

        xaxis: {
            categories: chartData.map((item) => item?.label || ""),
        },
        grid: {
            show: true,
            xaxis: {
                lines: {
                    show: true,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
            padding: {
                top: 0,
                right: -2,
                bottom: 15,
                left: 10,
            },
        },
        yaxis: [
            {
                axisTicks: {
                    show: true,
                },
                axisBorder: {
                    show: true,
                },
                tickAmount: 6,
                labels: {
                    show: true,
                    formatter: (value: number) => {
                        return `${formatNumber(value)}`;
                    },
                },
                title: {
                    text: "Total Login Counts",
                    style: {
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#495057",
                    },
                },
            },
        ],

        legend: {
            show: true,
            horizontalAlign: "center",
            offsetX: 0,
            offsetY: -5,
            itemMargin: {
                horizontal: 10,
                vertical: 0,
            },
        },
    }), [chartData])

    const tabHandler = (tab: ITabDataId) => {
        setActiveTab(tab);
        getTransactionSummaryApiCall({ type: tab });
    };

    const totals = useMemo(() => chartData.reduce(
        (acc, curr) => {
            acc.web += curr?.web || 0;
            acc.android += curr?.android || 0;
            acc.ios += curr?.ios || 0;
            acc.totalLoggedIn += curr?.totalLoggedIn || 0
            return acc;
        },
        { web: 0, android: 0, ios: 0, totalLoggedIn: 0 }
    ), [chartData]);

    const totalWebCount = formatNumber(totals.web);
    const totalAndroidCount = formatNumber(totals.android);
    const totalIosCount = formatNumber(totals.ios);
    const totalLoginCount = formatNumber(totals.totalLoggedIn);

    return (
        <div className="card transaction-apexchart-area_wrapper !tw-shadow-sm !tw-rounded-2xl">
            <div className="card-header!tw-rounded-t-2xl !tw-p-0" style={{ borderBottom: "0" }}>
                <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-p-3 tw-gap-3">
                    <div>
                        <h4 className="card-title !tw-mb-0 ">Date Wise Login Count</h4>
                    </div>
                    <div className="tw-mt-2 md:tw-mt-0">
                        <div className="tw-pt-2">
                            <span className="tw-p-2 tw-rounded-l-md tw-bg-[#3577F119] tw-text-[#3577F1]">Last 12</span> &nbsp; &nbsp;
                            {tabData.map((item) => (
                                <span
                                    className={item.className}
                                    key={item.id}
                                    style={{
                                        backgroundColor: `${activeTab === item.id ? "#3577F119" : "#40518919"
                                            }`,
                                        color: `${activeTab === item.id ? "#3577F1" : "#405189"}`,
                                    }}
                                    onClick={() => tabHandler(item.id)}
                                >
                                    {item.tabName}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-4 tw-text-center tw-border-t tw-border-b tw-border-dashed">
                    <div className="tw-p-3">
                        <h5 className="tw-mb-1">
                            <span className="counter-value tw-ml-1" data-target="9851">
                                {totalLoginCount}
                            </span>
                        </h5>
                        <p className="tw-text-gray-500 tw-mb-0">Total Logins</p>
                    </div>

                    <div className="tw-p-3 md:tw-border-l md:tw-border-dashed">
                        <h5 className="tw-mb-1">
                            <span className="counter-value tw-ml-1" data-target="1026">
                                {totalWebCount}
                            </span>
                        </h5>
                        <p className="tw-text-gray-500 tw-mb-0">WEB</p>
                    </div>

                    <div className="tw-p-3 lg:tw-border-l lg:tw-border-dashed">
                        <h5 className="tw-mb-1">
                            <span className="counter-value tw-ml-1" data-target="228.89">
                                {totalAndroidCount}
                            </span>
                        </h5>
                        <p className="tw-text-gray-500 tw-mb-0">ANDROID</p>
                    </div>

                    <div className="tw-p-3 md:tw-border-l md:tw-border-dashed">
                        <h5 className="tw-mb-1">
                            <span className="counter-value tw-ml-1" data-target="228.89">
                                {totalIosCount}
                            </span>
                        </h5>
                        <p className="tw-text-gray-500 tw-mb-0">IOS</p>
                    </div>

                </div>
            </div>
            <div className="card-body">
                <div className="transation-summary-chart-container">
                    <div className="transation-summary-chart">
                        <ReactApexChart
                            options={options}
                            series={series}
                            type="bar"
                            height={350}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BranchWiseLoginCount;
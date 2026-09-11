import React from "react";
import ReactApexChart from "react-apexcharts";
import { getDisplayAmountValue, getFeeAmountDisplayValue } from "../../../../utility/commonutility";

export function DonutChart({ donutColor = ['#0AB39C', '#E7E7E7'], seriesData = [], title = "" }) {
    const chartOptions = {
        labels: ["Amount Paid", "Amount Unpaid"],
        colors: donutColor,
        plotOptions: {
            pie: {
                startAngle: -90,
                endAngle: 90,
                offsetY: 10,
                donut: {
                    labels: {
                        show: true,
                        name: {
                            show: false,
                        },
                        value: {
                            show: true,
                            offsetY: -5,
                            fontSize: '16px',
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total',
                            formatter: function (w: any) {
                                const [paid, unpaid] = w.globals.seriesTotals,
                                    percentage = Number((paid / (paid + unpaid)) * 100 || 0).toFixed(2);
                                return `${percentage}%`;
                            },
                        },
                    },
                },
            }
        },
        tooltip: {
            enabled: true,
            fillSeriesColor: false,
            theme: 'light',
            y: {
                formatter: (value: any) => `${getFeeAmountDisplayValue(value)}`, // Format the tooltip value
            },
        },
        grid: {
            padding: {
                bottom: -90
            }
        },
        marker: {
            show: true,

        },
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        // title: {
        //     show: true,
        //     text: title,
        //     align: "center" as const,
        //     cssClass: "text-truncate",
        //     style: {
        //         fontSize: '14px',
        //         fontWeight: 'bold',
        //         fontFamily: 'inherit',
        //         color: '#212529',
        //     }
        // },
    };

    return (
        <div className="donut-chart">
            <ReactApexChart options={chartOptions} series={seriesData}
                height={200}
                type="donut" />
            <div className="chart-title">
                <span >{title}</span>
            </div>
        </div>
    );

}
export default function TermwisePaid({ reportData }: any) {
    const cautionIntallement = reportData?.["Tution/Caution/Installment 1 Fee"]?.[0] || {},
        termI = reportData?.["Term-1"]?.[0] || {},
        termII = reportData?.["Term-2"]?.[0] || {},
        termIII = reportData?.["Term-3"]?.[0] || {};


    const cautionChartData: any = [Math.ceil(cautionIntallement?.totalAmountPaid || 0), Math.ceil(cautionIntallement?.totalAmountToBePaid || 0)],
        termIChartData: any = [Math.ceil(termI?.totalAmountPaid || 0), Math.ceil(termI?.totalAmountToBePaid || 0)],
        termIIChartData: any = [Math.ceil(termII?.totalAmountPaid || 0), Math.ceil(termII?.totalAmountToBePaid || 0)],
        termIIIChartData: any = [Math.ceil(termIII?.totalAmountPaid || 0), Math.ceil(termIII?.totalAmountToBePaid || 0)];

    const totalPaidChartData: any = [
        cautionChartData[0] + termIChartData[0] + termIIChartData[0] + termIIIChartData[0],
        cautionChartData[1] + termIChartData[1] + termIIChartData[1] + termIIIChartData[1]
    ];
    return (
        <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-md tw-mb-3 tw-shadow-sm">
            <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Term Wise paid %
                </h4>
            </div>

            <div className="tw-p-4">
                <div className="termwisepaid-chartcontainer tw-flex tw-flex-wrap">
                    <div className="donutchart-container tw-border-r tw-border-gray-200 tw-px-3">
                        <DonutChart
                            donutColor={['#F06548', '#E7E7E7']}
                            title="Tution / Caution / Installment 1 Fee"
                            seriesData={cautionChartData}
                        />
                    </div>

                    <div className="donutchart-container tw-border-r tw-border-gray-200 tw-px-3">
                        <DonutChart
                            donutColor={['#0AB39C', '#E7E7E7']}
                            title="Term I"
                            seriesData={termIChartData}
                        />
                    </div>

                    <div className="donutchart-container tw-border-r tw-border-gray-200 tw-px-3">
                        <DonutChart
                            donutColor={['#405189', '#E7E7E7']}
                            title="Term II"
                            seriesData={termIIChartData}
                        />
                    </div>

                    <div className="donutchart-container tw-border-r tw-border-gray-200 tw-px-3">
                        <DonutChart
                            donutColor={['#F7B84B', '#E7E7E7']}
                            title="Term III"
                            seriesData={termIIIChartData}
                        />
                    </div>

                    <div className="donutchart-container tw-px-3">
                        <DonutChart
                            donutColor={['#4b0082', '#E7E7E7']}
                            title="Total Paid"
                            seriesData={totalPaidChartData}
                        />
                    </div>
                </div>
            </div>
        </div>

    )
}
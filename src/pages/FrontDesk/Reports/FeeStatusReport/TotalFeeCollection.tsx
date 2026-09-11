import React, { useMemo, useRef } from "react";
import ReactApexChart from "react-apexcharts";
import { getFeeAmountDisplayValue } from "../../../../utility/commonutility";
import { generateClasswiseFeesData } from "./helper";

export default function TotalFeeCollection({ reportData }: any) {
    const installmentData = reportData?.["Tution/Caution/Installment 1 Fee"], termIData = reportData?.["Term-1"],
        termIIData = reportData?.["Term-2"],
        termIIIData = reportData?.["Term-3"];
    const { chartData = [], xAxisLabel = [] }: any = generateClasswiseFeesData({
        installmentData,
        termIData, termIIData, termIIIData
    })
    let options: any = {
        plotOptions: {
            bar: {
                columnWidth: "60px",
            },
        },
        chart: {
            type: "bar",
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: true,
            position: 'bottom'
        },
        xaxis: {
            position: 'bottom',
            axisBorder: {
                show: true
            },
            title: {
                text: "Class",
                offsetX: 0,
                offsetY: 200
            },
            categories: xAxisLabel,
        },
        yaxis: {
            show: true,
            title: {
                text: "₹ (Lakhs)",
            },
            labels: {
                formatter: function (val: any) {
                    let lakhs = val / 1e5;
                    return isNaN(lakhs) ? val : Math.round(lakhs);
                }
            }
        },
        grid: {
            show: true,
        },
        fill: {
            opacity: 1,

        },
        // colors: ["#405189", "#0AB39C", "#F7B84B", "#ff4560"],

        colors: ["#F06548", "#0AB39C", "#405189", "#F7B84B", "#4b0082"],
        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            y: {
                formatter: (value: any) => `${getFeeAmountDisplayValue(value)}`, // Format the tooltip value
            },
        },
        // legend: {
        //     show: true,
        // },
    };

    return (
        <div className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-md tw-mb-3 tw-shadow-sm">
            <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                    Total Fee Collected by Class
                </h4>
            </div>

            <div className="tw-p-4">
                <ReactApexChart
                    options={options}
                    series={chartData}
                    type="bar"
                    height={400}
                />
            </div>
        </div>
    )
}
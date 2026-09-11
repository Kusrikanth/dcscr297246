import React from 'react'
import { Card, CardBody, CardHeader } from 'reactstrap'
import DonutChart from '../../../Components/Common/DonutChart'
import { default as UpArrow } from '../../../assets/imagesdps/academics/UpArrowGreen.svg?react'


const performanceSummary = [
    {
        id: 1,
        name: "GPA",
        rating: "0.5",
        graphRating: "3.1"
    },
    {
        id: 2,
        name: "Class Rank",
        rating: "0.5",
        graphRating: "3.1"
    },
    {
        id: 3,
        name: "Average",
        rating: "0.5",
        graphRating: "3.1"
    }
];
const options1 = {
    chart: {
        // offsetX: -50,
        width: "80px"
    },
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    value: {
                        show: true,
                        fontSize: "12px",
                        fontWeight: 600,
                        fontFamily: "Roboto",
                        offsetY: 4
                    },
                    name: {
                        show: false,
                    },
                    total: {
                        show: true,
                        color: "black",
                        fontSize: "8px",
                        fontWeight: 'normal',
                        showAlways: true,
                        formatter: function (w: any) {
                            return `${3.1}`;
                        },
                    },
                    // total: {
                    //     show: true,
                    //     showAlways: true,
                    //     label: "Total"
                    // }
                }
            }
        }
    },
    responsive: [{
        breakpoint: 480,
        options: {
            chart: {
                width: 200
            },
            legend: {
                position: 'bottom'
            }
        }
    }],
    fill: {
        colors: ["#CFCFCF", "#0AB39C"]
    },
    legend: {
        show: false
    },
    // legend: {
    //     // customLegendItems: ['Completed', 'Pending'],
    //     offsetX: 0,
    //     offsetY: -10,
    //     // fontSize: '40px',
    //     position: "bottom",
    //     // padding:10,
    //     markers: {
    //         fillColors: ["#F06548", "#0AB39C", "#FFB81F"],
    //         // offsetX: -10
    //     },
    //     itemMargin: {
    //         horizontal: 10,
    //         vertical: 7
    //     },
    //     formatter: function (name: any, object: any) {

    //         return `${object.w.config.series[object.seriesIndex]}%`
    //     }
    // },
    dataLabels: {
        enabled: false
    },
    tooltip: {
        enabled: false
    },
    markers: {
        strokeWidth: 3
    },
    stroke: {
        show: false
    }
};
const PerformanceSummary = () => {
    return (
        <div className="tw-w-full">
            <div className="tw-bg-white fee_collection_analysis_wrap tw-rounded-xl tw-shadow-sm tw-overflow-hidden">
                <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                        Performance Summary
                    </h4>
                </div>

                <div className="tw-p-0">

                    {performanceSummary.map((per: any, index: number) => (
                        <div
                            key={index}
                            className="tw-flex tw-items-center tw-justify-between tw-py-4 tw-px-4 tw-border-b tw-border-gray-200 last:tw-border-b-0"
                        >

                            <div className="tw-w-1/2">
                                <p className="tw-text-sm tw-font-medium tw-m-0">
                                    {per.name}
                                </p>
                            </div>

                            <div className="tw-w-1/4 tw-flex tw-items-center">
                                <UpArrow />
                                <p className="tw-ml-2 tw-text-sm tw-font-semibold tw-m-0">
                                    {per.rating}
                                </p>
                            </div>

                            <div className="tw-w-1/4 tw-flex tw-justify-end">
                                <DonutChart
                                    options={options1}
                                    series={[20, 80]}
                                    height={"80px"}
                                />
                            </div>

                        </div>
                    ))}

                </div>
            </div>
        </div>
    )
}

export default PerformanceSummary

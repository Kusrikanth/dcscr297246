import React, { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const MonthlyAttandanceAnalysis = (props: any) => {
    const [chartData, setChartData] = useState([]);

    const categories = useMemo(() => {
        return props.getAttendanceDashboardResp?.monthlyAttendanceSummaries.map((item: any) => (item.month).substring(0,3) + "-" + item.year);
    }, [props.getAttendanceDashboardResp]);

    useEffect(() => {
        if (props.getAttendanceDashboardResp) {
          const modifiedData = props.getAttendanceDashboardResp?.monthlyAttendanceSummaries.reduce((acc: any[], curr: any) => {
            const label = (curr?.month ? curr.month.substring(0, 3) : "") + "-" + (curr?.year ?? "");

            acc.push({
                label,
                present: curr?.presentDays,
                absent: curr?.absentDays,
                notMarked: curr?.notMarkedDays
            })
            return acc
          },[])     
          setChartData(modifiedData)
        }
      }, [props.getAttendanceDashboardResp])

    
    const series = [
        {
            name: 'Present',
            type: 'column',
            data: chartData?.map((item: any) => item?.present),
        },
        {
            name: 'Absent',
            type: 'column',
            data: chartData?.map((item: any) => item?.absent),
        },
        {
            name: 'Not Marked',
            type: 'column',
            data: chartData?.map((item: any) => item?.notMarked),
        },
    ];

    const options: ApexCharts.ApexOptions = useMemo(() => ({
        chart: {
            type: 'bar',
            stacked: false,
            toolbar: {
                show: false,
            },
            offsetX: 10
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '24px',
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            offsetY: 7,
        },
        xaxis: {
            categories,
           
        },
        yaxis: {
            title: {
                text: 'No.of Student',
            },
        },
        colors: ['#0AB39C', '#f06548', '#405189',],
        fill: {
            opacity: [1, 1, 1],
        },
        responsive: [
            {
                breakpoint: 1350,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "20px",
                        },
                    },
                    xaxis: {
                        labels: {
                            style: {
                                fontSize: '11px'
                            }
                        }
                    },
                },
            },
            {
                breakpoint: 1220,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "15px",
                        },
                    },  
                },
            },
            {
                breakpoint: 990,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "12px",
                        },
                    },
                },
            },
            {
                breakpoint: 875,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "10px",
                        },
                    },
                },
            },
            {
                breakpoint: 768,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "12px",
                        },
                    },
                    xaxis: {
                        labels: {
                            style: {
                                fontSize: '10px'
                            }
                        }
                    },
                },
            },
            {
                breakpoint: 625,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "10px",
                        },
                    },
                },
            },
            {
                breakpoint: 550,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "8px",
                        },
                    },
                },
            },
            {
                breakpoint: 450,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "6px",
                        },
                    },
                },
            },
        ]
    }), [chartData, categories]);

    return (
        <>
            <div className="tw-border tw-rounded-lg tw-bg-white fee_revenue_summary_wrapper">
                {/* Header */}
                <div className="tw-border-b tw-px-4 tw-py-3">
                    <div className="tw-grid tw-grid-cols-12 tw-items-center">
                        {/* Title */}
                        <div className="tw-col-span-12 md:tw-col-span-8 tw-mb-2 md:tw-mb-0">
                            <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                                Monthly Attendance Analysis
                            </h4>
                        </div>

                        {/* Month Badge */}
                        <div className="tw-col-span-12 md:tw-col-span-4 tw-flex md:tw-justify-end tw-mt-2 md:tw-mt-0">
                            <span
                                className="tw-px-3 tw-py-1 tw-rounded-md tw-cursor-pointer"
                                style={{
                                    backgroundColor: "#3577F119",
                                    color: "#3577F1",
                                }}
                            >
                                Month
                            </span>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="tw-pt-0 tw-ps-1 tw-pr-4 tw-pb-4">
                    <ReactApexChart
                        options={options}
                        series={series}
                        type="bar"
                        height={350}
                    />
                </div>
            </div>
        </>
    );
};

export default MonthlyAttandanceAnalysis;

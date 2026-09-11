import React, { useEffect, useMemo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useAppDispatch, useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';
import { generateActionPayload } from '../../../utility/reduxutility';
import { getBookCirculationAnalysisAct } from '../../../store/library/bookcollection/bookcollectionaction';
import { generateWeekLabel, getDdMmYyyyFormat, getDisplayMMMYYYYFormat } from '../../../utility/dateutility';

type ITabDataId = "days" | "weeks" | "months"

type ITabData = {
  id: ITabDataId;
  tabName: string;
  className: string;
}

const tabData: Array<ITabData> = [
  {
    id: "days",
    tabName: "Days",
    className: "tw-p-2 tw-rounded-start tw-cursor-pointer",
  },
  {
    id: "weeks",
    tabName: "Weeks",
    className: "tw-p-2 tw-cursor-pointer",
  },
  {
    id: "months",
    tabName: "Months",
    className: "tw-p-2 tw-rounded-end tw-cursor-pointer",
  }
]

const BookCirculationAnalysis = () => {
    const [activeTab, setActiveTab] = useState('days');
  const [chartData, setChartData] = useState<any[]>([]);


    const dispatch = useAppDispatch();

    const getBookCirculationAnalysisApiCall = (type: ITabDataId, yearId?: string) => {
        const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
        const payload = {
            branchId,
            academicYearId: yearId || academicYearId, 
            instituteId,
            dateType: type
        }
        dispatch(getBookCirculationAnalysisAct(generateActionPayload("library_dashboard_data", undefined, payload)))
      }
    

    const {
        academicYearListResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
        getBookCirculationAnalysisResp } =
        useAppSelector(({ appData, instAcademics, feeReport, libraryBookCollection }) => ({
          academicYearListResp: instAcademics.academicYearListResp,
          currentInstIdResp: appData.currentInstIdResp,
          currentBranchIdResp: appData.currentBranchIdResp,
          getFeeDashboardTransactionSummaryResp: feeReport.getFeeDashboardTransactionSummaryResp,
          getBookCirculationAnalysisResp: libraryBookCollection.getBookCirculationAnalysisResp,  
        }), shallowEqual);


    useEffect(() => {
        if (Array.isArray(academicYearListResp?.data)) {
          const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
          getBookCirculationAnalysisApiCall("days", academicYearId)
        }
      }, [academicYearListResp,branchId,instituteId,])

      useEffect(() => {
        if (getBookCirculationAnalysisResp) {
          const modifiedData = getBookCirculationAnalysisResp?.bookCirculationAnalysis.reduce((acc: any[], curr: any) => {
            // Creating label
            const label = activeTab === "days" ? getDdMmYyyyFormat(curr?.DayStartDate) : activeTab === "weeks" ? generateWeekLabel(curr?.WeekStartDate, curr?.WeekEndDate) : getDisplayMMMYYYYFormat(curr?.MonthStartDate) 
            // Find data with existing labels
            acc.push({
                label,
                ISSUED: curr?.ISSUED,
                RETURNED: curr?.RETURNED,
                OVERDUE: curr?.OVERDUE
            })
            return acc
          },[])     
          setChartData(modifiedData)
        }
      }, [getBookCirculationAnalysisResp])
    const series = useMemo(() => [
        {
            name: 'Issued',
            type: 'column',
            data:  chartData.map((item) => item?.ISSUED),
        },
        {
            name: 'Returned',
            type: 'column',
            data:  chartData.map((item) => item?.RETURNED),
        },
        {
            name: 'Books Due',
            type: 'column',
            data:  chartData.map((item) => item?.OVERDUE),
        },
    ], [chartData]);

    const options: ApexCharts.ApexOptions = useMemo(() => ( {
        chart: {
            height: 350,
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
                columnWidth: "24px",
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            offsetY: 7,
        },
        xaxis: {
            categories: chartData.map((item) => item?.label),
        },
        yaxis: {
            title: {
                text: 'No. of Books',
            },
        },
        colors: ['#405189', '#0AB39C', '#f06548'],
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
                breakpoint: 1150,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "15px",
                        },
                    },  
                },
            },
            {
                breakpoint: 940,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "12px",
                        },
                    },
                },
            },
            {
                breakpoint: 845,
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
                breakpoint: 575,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "10px",
                        },
                    },
                },
            },
            {
                breakpoint: 490,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "8px",
                        },
                    },
                },
            },
            {
                breakpoint: 408,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: "6px",
                        },
                    },
                },
            },
        ]
    }), [chartData])

    const tabHandler = (activeTab: ITabDataId) => {
        setActiveTab(activeTab);
        getBookCirculationAnalysisApiCall(activeTab);
    };

    return (
        <>
            <div className="tw-bg-white tw-pb-3 tw-rounded-lg tw-overflow-hidden fee_revenue_summary_wrapper">
                <div className="tw-border-b tw-px-4 tw-py-3">
                    <div className="tw-flex tw-items-center tw-justify-between">
                        <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                            Book Circulation Analysis
                        </h4>
                        <div className="tw-flex tw-items-center tw-gap-2">
                            <span
                                className="tw-px-3 tw-py-1.5 tw-rounded-l-md tw-text-sm"
                                style={{ backgroundColor: "#3577F119", color: "#3577F1" }}
                            >
                                Last 12
                            </span>
                            {tabData?.map((item) => (
                                <span
                                    key={item.id}
                                    className="tw-px-3 tw-py-1.5 tw-rounded-md tw-cursor-pointer tw-text-sm"
                                    style={{
                                        backgroundColor:
                                            activeTab === item.id ? "#3577F119" : "#40518919",
                                        color: activeTab === item.id ? "#3577F1" : "#405189",
                                    }}
                                    onClick={() => tabHandler(item.id)}
                                >
                                    {item.tabName}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="tw-pt-0 tw-px-3 tw-pl-1">
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

export default BookCirculationAnalysis;

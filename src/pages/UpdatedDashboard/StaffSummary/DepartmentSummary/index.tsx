import React, { useEffect, useRef, useState } from 'react'
import ReactApexChart from 'react-apexcharts'

const DepartmentSummary = () => {

    const ref = useRef<any>();
    const [data, setData] = useState<any>([]);
    const [label, setLabel] = useState<any>(["SECURITY", "ACADEMICS", "HR", "ACCOUNTS", "AYAH", "ADMINISTRATION"]);
    const [series, setSeries] = useState<any>([20, 10, 10, 20, 20, 10]);

    useEffect(() => {
    ref.current && setData(ref.current.chart.theme.colors);
  }, [ref.current]);

  const chartOptions: any = {
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 1206,
        options: {
          chart: {
            width: 260,
            height: 260,
          },
        },
      },
      {
        breakpoint: 767,
        options: {
          chart: {
            width: 230,
            height: 230,
          },
        },
      },
    ],
    legend: {
      show: false,
    },
    chart: {
      type: "area",
    },
    labels: label,
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
  };

  return (
    <>
        <div className="card department_summary_wrapper">
            <div className="card-header">
                <div className="tw-flex tw-items-center">
                    <div className="tw-flex-1">
                        <h4 className="tw-card-title tw-mb-0 tw-flex-grow">Department Summary</h4>
                    </div>
                </div>
            </div>

            <div className="tw-card-body">
                <div className="tw-grid tw-grid-cols-12 tw-gap-4">
                    <div className="tw-col-span-12 md:tw-col-span-6">
                        <div className="tw-flex tw-justify-center tw-w-full tw-mb-3">
                            <ReactApexChart
                                type="donut"
                                options={chartOptions}
                                series={series ? series : []}
                                width={200}
                                height={200}
                                ref={ref}
                            />
                        </div>
                    </div>

                    <div className="tw-col-span-12 md:tw-col-span-6">
                        {series.map((s: any, index: number) => (
                            <div className='tw-flex tw-mb-2' key={index}>
                                  <div className='tw-flex tw-items-center'>
                                      <div className='tw-inline-block tw-mr-1' style={{minHeight: "14px", minWidth: "25px", backgroundColor: `${data[index]}`, borderRadius: "4px"}} />
                                      <span className='tw-text-[13px] tw-text-gray-500'>{label[index]}</span>
                                  </div>
                                    <span className='tw-text-[13px] tw-ml-auto'>{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default DepartmentSummary

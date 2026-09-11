import React, { useEffect, useMemo, useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import { useAppSelector } from '../../../hooks/storehook';
import { shallowEqual } from 'react-redux';

const color = ["#0AB39C", "#FEB019", "#f06548"]

const LoginCounts = () => {
  const [chartData, setChartData] = useState<any[]>([]);

  const {
    getAppUsageStatsResp,

  } = useAppSelector(
    ({ academicRequest }) => ({
      getAppUsageStatsResp: academicRequest.getAppUsageStatsResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (Array.isArray(getAppUsageStatsResp) && getAppUsageStatsResp.length > 0) {
      setChartData(getAppUsageStatsResp.filter((item: any) => item?.loginSource !== "OTHERS" && item?.loginSource !== "TOTAL LOGINS"))
    }
  }, [getAppUsageStatsResp])

  const options: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      type: 'donut',
    },
    labels: chartData?.map((item: any) => item?.loginSource),
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
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            value: {
              show: true,
              fontSize: "16px",
            },
            name: {
              show: true,
              formatter: function () {
                return "Total";
              },
            },
            total: {
              show: true,
              color: "black",
              fontSize: "16px",
              showAlways: true,
              formatter: function () {
                const findTotal = getAppUsageStatsResp?.find((item:any)=>item?.loginSource === "TOTAL LOGINS")?.loginCount;
                return findTotal?.toString()
              },
            },
          },
        },
      },
    },
    colors: color,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
          return `${val.toFixed(0)}%`;
        },
        style: {
          fontSize: "10px",
          colors: ["#FFFFFF"],
        },
    },
  }), [chartData]);

  const series = useMemo(() => {
    return Array.isArray(chartData) && chartData.length > 0
      ? chartData.map((item: any) => item?.loginCount)
      : []
  }, [chartData])

  return (
    <>

      <div className="tw-flex tw-flex-wrap">

        <div className="tw-w-full tw-mt-3">
          <div className="tw-flex tw-justify-center">
            {series && Array.isArray(series) && series?.length > 0 && (
              <ReactApexChart
                options={options}
                series={series}
                type="donut"
                width={200}
                height={200}
              />
            )}
          </div>
        </div>

        <div className="tw-w-full tw-px-4">
          <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-center tw-mt-3">

            {Array.isArray(chartData) &&
              chartData.length > 0 &&
              chartData.map((item: any, index: number) => (
                <div
                  key={index}
                  className="tw-flex tw-items-center tw-justify-center tw-mb-3 tw-w-1/3"
                >
                  <div
                    className="tw-flex tw-pl-3"
                    style={{
                      borderLeft: `3px solid ${color[index]}`,
                    }}
                  >
                    <div>
                      <h6 className="tw-text-gray-500 tw-text-[12px] tw-font-normal">
                        {item?.loginSource}
                      </h6>

                      <div className="tw-flex tw-items-center">
                        <i className="ri-group-line tw-text-[16px] tw-text-gray-500"></i>
                        <span className="tw-text-[12px] tw-ml-1 tw-mr-2">
                          {item?.loginCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

          </div>
        </div>
      </div>

    </>
  )
}

export default LoginCounts
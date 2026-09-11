import React, { useState, useMemo, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';

const buttonOptions = [
  { id: 'one_month', label: '1M' },
  { id: 'six_months', label: '6M' },
  { id: 'one_year', label: '1Y' },
  { id: 'ytd', label: 'YTD' },
  { id: 'all', label: 'ALL' },
];

const FeeArea = () => {
  const [selection, setSelection] = useState('one_month');
  const generateDayWiseTimeSeries = (baseTime: number, count: number, yrange: { min: number; max: number }) => {
    let series: [number, number][] = [];
    let x = baseTime;
    let y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
  
    for (let i = 0; i < count; i++) {
      series.push([x, y * 100000]);
      x += 86400000;
      y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
    }
  
    return series;
  };
  

const [series] = useState([
  {
    name: 'Academic Fee',
    data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, { min: 10, max: 60 }),
  },
  {
    name: 'Transport Fee',
    data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, { min: 10, max: 20 }),
    color: "#0AB39C"
  },
  {
    name: 'Total Fee',
    data: generateDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 20, { min: 10, max: 15 }),
    color: "#FAC364"
  }
]);


  const options: any = useMemo(() => ({
    chart: {
      type: 'area',
      height: 350,
      stacked: true,
      events: {
        selection: (chart: any, e: { xaxis: { min: string | number | Date } }) => {
          console.log(new Date(e.xaxis.min));
        }
      },
      toolbar: {
        show: false,
      },
    },
    colors: ['#008FFB', '#00E396', '#CED4DC'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    fill: {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      markers: {
        width: 12,
        height: 12,
        radius: 12,
      },
      itemMargin: {
        horizontal: 5,
        vertical: 0,
      },
      containerMargin: {
        top: 8,
      }
    },
    xaxis: {
      type: 'datetime',
      labels: {
        show: true,
      }
    },
    yaxis: {
      min: 0,
      max: 10000000,
      tickAmount: 5,
      labels: {
        show: true,
        formatter: (value: number) => {
          return `${value / 100000}L`;
        }
      }
    }
  }), []);
  

  const updateData = (timeline: string) => {
    setSelection(timeline);

    const zoomOptions: any = {
      one_month: [new Date('28 Jan 2013').getTime(), new Date('27 Feb 2013').getTime()],
      six_months: [new Date('27 Sep 2012').getTime(), new Date('27 Feb 2013').getTime()],
      one_year: [new Date('27 Feb 2012').getTime(), new Date('27 Feb 2013').getTime()],
      ytd: [new Date('01 Jan 2013').getTime(), new Date('27 Feb 2013').getTime()],
      all: [new Date('23 Jan 2012').getTime(), new Date('27 Feb 2013').getTime()],
    };

    if (zoomOptions[timeline]) {
      ApexCharts.exec(
        'area-datetime',
        'zoomX',
        zoomOptions[timeline][0],
        zoomOptions[timeline][1]
      );
    }
  };

  useEffect(() => {
    updateData("all");
  }, [])

  return (
    <div className="card transaction-apexchart-area_wrapper" >
      <div className="card-header">
        <div className="tw-flex tw-flex-wrap tw-items-center">
          <div className="tw-w-full md:tw-w-1/2">
            <h4 className="card-title tw-mb-0 tw-flex-grow">
              Transaction Summary
            </h4>
          </div>
          <div className="tw-w-auto tw-ml-auto tw-mt-2 md:tw-mt-0">
            <div className="toolbar tw-flex tw-justify-end">
              <div className='filter-bt'>
                {buttonOptions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => updateData(item.id)}
                    className={`tw-mr-1 ${selection === item.id ? 'active' : 'inActive'} tw-bg-gray-100 tw-border-none tw-rounded tw-text-gray-500`}
                  >
                    {item.label.replace('_', ' ').toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='card-body'>
        <div id="chart">

          <div id="chart-timeline">
            <ReactApexChart options={options} series={series} type="area" height={350} />
          </div>
        </div>
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default FeeArea;

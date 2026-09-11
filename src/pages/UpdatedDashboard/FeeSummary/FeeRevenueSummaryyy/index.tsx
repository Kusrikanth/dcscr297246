import React from 'react'
import ReactApexChart from 'react-apexcharts'

const FeeRevenueSummaryyy = () => {


  let series = [
    {
      name: "Expected",
      data: [
        100, 90, 55
      ],
    },
    {
      name: "Received",
      data: [
        20, 40, 10
      ],
    },
  ];
  let options: any = {
    plotOptions: {
      bar: {
        columnWidth: "60px",
      },
    },
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],

    xaxis: {
      categories: [
        "Nacharam",
        "Mahendra Hills",
        "Nadergul",
      ],
    },
    yaxis: {
        labels: {
         formatter: (value:any) => { return value + "k" },
      },
    },
    colors:["#F0F0F0", "#0AB39C"],
    // fill: {
    //   opacity: 1,
    //   colors: ["#0AB39C", "#F0F0F0"],
    // },
    // legend: {
    //   show: true,
    //    labels: {
    //       colors: ["#0AB39C", "#F0F0F0"],
    //       useSeriesColors: ["#0AB39C", "#F0F0F0"]
    //   },
    // },
  };

  return (
    <>
    <div className="card fee_revenue_summaryyy_wrapper">
        <div className="card-header">
          <div className="tw-grid tw-grid-cols-12 tw-items-center">
            <div className="tw-col-span-12 lg:tw-col-span-6">
              <h4 className="card-title tw-mb-0 tw-flex-grow">
                Fee Revenue Summary
              </h4>
            </div>
            
          </div>
        </div>

        <div className="card-body tw-pt-0 tw-ps-1">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    
    </>
  )
}

export default FeeRevenueSummaryyy
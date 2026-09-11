import React from "react";
import ReactApexChart from "react-apexcharts";

let series: any = [76, 67, 61, 90];

let options: any = {
  chart: {
    height: 390,
    type: "radialBar",
  },
  plotOptions: {
    radialBar: {
      offsetY: 0,
      startAngle: 0,
      endAngle: 270,
      hollow: {
        margin: 5,
        size: "30%",
        background: "transparent",
        image: undefined,
      },
      dataLabels: {
        name: {
          show: false,
        },
        value: {
          show: false,
        },
      },
    },
  },
  colors: ["#1ab7ea", "#0084ff", "#39539E", "#0077B5"],
  labels: ["Vimeo", "Messenger", "Facebook", "LinkedIn"],
  legend: {
    show: true,
    floating: true,
    fontSize: "16px",
    position: "left",
    offsetX: 70,
    offsetY: 0,
    labels: {
      useSeriesColors: true,
    },
    markers: {
      size: 0,
    },
    formatter: function (seriesName: any, opts: any) {
      return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
    },
    itemMargin: {
      vertical: 3,
    },
  },
  responsive: [
    {
      breakpoint: 1700,
      options: {
        legend: {
          show: true,
          offsetX: 30,
        },
      },
    },

    {
      breakpoint: 1500,
      options: {
        legend: {
          show: true,
          offsetX: 0,
        },
      },
    },

    {
      breakpoint: 1300,
      options: {
        legend: {
          show: true,
          offsetX: -30,
        },
      },
    },

    {
      breakpoint: 998,
      options: {
        legend: {
          show: true,
          offsetX: 130,
        },
      },
    },

    {
      breakpoint: 893,
      options: {
        legend: {
          show: true,
          offsetX: 100,
        },
      },
    },

    {
      breakpoint: 836,
      options: {
        legend: {
          show: true,
          offsetX: 70,
        },
      },
    },

    // {
    //   breakpoint: 774,
    //   options: {
    //     legend: {
    //       show: true,
    //       offsetX: 170,
    //     },
    //   },
    // },

    {
      breakpoint: 774,
      options: {
        legend: {
          show: true,
          floating: false,
          offsetX: 0,
        },
      },
    },

    // {
    //   breakpoint: 734,
    //   options: {
    //     legend: {
    //       show: true,
    //       floating: false,
    //       offsetX: 0,
    //     },
    //   },
    // },
  ],
};

const VehicleStatus = () => {
  return (
    <>
      <div className="card vehicle_status_card">
        <div className="card-header">
          <div className="row align-items-center">
            <h4 className="card-title mb-0 flex-grow-1">Vehicle Status</h4>
          </div>
        </div>

        <div className="card-body p-4">
          <ReactApexChart
            options={options}
            series={series}
            type="radialBar"
            height={260}
          />
        </div>
      </div>
    </>
  );
};

export default VehicleStatus;

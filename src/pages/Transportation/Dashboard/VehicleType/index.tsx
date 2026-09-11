import React from "react";
import ReactApexChart from "react-apexcharts";

let series: any = [
  {
    name: "Inflation",
    data: [2.3, 3.1, 4.0, 10.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2],
  },
];

let options: any = {
  chart: {
    height: 350,
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      //   borderRadius: 10,
      borderRadius: 0,
      dataLabels: {
        position: "top", // top, center, bottom
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: any) {
      return val + "%";
    },
    offsetY: -20,
    style: {
      fontSize: "12px",
      colors: ["#ADB5BD"],
    },
  },

  xaxis: {
    categories: [
      "BUS",
      "Omini",
      "Mini Bus",
      "SUV",
      "Other",
      "BUS 1",
      "BUS 2",
      "BUS 3",
      "BUS 4",
      "BUS 5",
      "BUS 6",
      "BUS 7",
    ],
    position: "bottom",
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      fill: {
        type: "gradient",
        gradient: {
          colorFrom: "#D8E3F0",
          colorTo: "#BED1E6",
          stops: [0, 100],
          opacityFrom: 0.4,
          opacityTo: 0.5,
        },
      },
    },
    tooltip: {
      enabled: true,
    },
  },
  yaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      show: false,
      formatter: function (val: any) {
        return val + "%";
      },
    },
  },
  colors: ["#0AB39C"],
};

const VehicleType = () => {
  return (
    <>
      <div className="card vehicle_type_card">
        <div className="card-header">
          <div className="row align-items-center">
            <h4 className="card-title mb-0 flex-grow-1">Vehicle Type</h4>
          </div>
        </div>

        <div className="card-body p-4">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={250}
          />
        </div>
      </div>
    </>
  );
};

export default VehicleType;

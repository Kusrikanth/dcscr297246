import React from "react";
import ReactApexChart from "react-apexcharts";

let series: any = [44, 55, 41, 17];

let options: any = {
  chart: {
    type: "donut",
  },
  legend: {
    position: "bottom",
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: "11px",
    },
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          value: {
            show: true,
          },
          name: {
            show: true,
            formatter: function () {
              return "Stops";
            },
          },
          total: {
            show: true,
            color: "black",
            // fontSize: "29px",
            showAlways: true,
            formatter: function (w: any) {
              let total = w.globals.seriesTotals.reduce((a: any, b: any) => {
                return a + b;
              }, 0);
              return total;
            },
          },
        },
      },
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
      },
    },
  ],
};

const RouteWiseStatus = () => {
  return (
    <>
      <div className="card route_wise_status_card">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-6">
              <h4 className="card-title mb-0 flex-grow-1">Route Wise Status</h4>
            </div>

            <div className="col-auto ms-auto">
              <select className="sort_selection">
                <option value="1">Route 1</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            height={260}
          />
        </div>
      </div>
    </>
  );
};

export default RouteWiseStatus;

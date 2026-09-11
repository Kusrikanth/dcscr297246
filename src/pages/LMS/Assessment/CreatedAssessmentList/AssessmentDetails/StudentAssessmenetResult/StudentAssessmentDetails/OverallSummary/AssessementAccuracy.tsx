import ReactApexChart from "react-apexcharts";
import { UncontrolledTooltip } from "reactstrap";
import { AlertCircleIcon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";

const colorOptions = ["#0AB39CD9", "#F27E6AD9", "#5A6BA5D9"];

const AssessementAccuracy = () => {
  const series = [52, 78];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      height: 200,
    },
    labels: ["Correct", "Wrong"],
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 10,
        donut: {
          size: "86%",
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
              offsetY: -5,
              fontSize: "14px",
            },
            total: {
              show: true,
              showAlways: true,
              label: "Correct",
              formatter: function (w: any) {
                const correct = w.globals.series[0];
                return `${correct} %`;
              },
            },
          },
        },
      },
    },
    colors: colorOptions,
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false,
      y: {
        formatter: function (val: number) {
          return `${val}`;
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      padding: {
        bottom: -90,
      },
    },
    responsive: [
      {
        breakpoint: 1206,
        options: {
          chart: {
            width: 200,
            height: 200,
          },
        },
      },
      {
        breakpoint: 767,
        options: {
          chart: {
            width: 180,
            height: 180,
          },
        },
      },
    ],
  };

  return (
    <div className="card border shadow-none questions-card mb-0">
      <div className="card-header">
        <h4 className="card-title mb-0 fs-14">
          Accuracy
          <HugeiconsIcon
            icon={AlertCircleIcon}
            id="accuracy"
            className="ms-2"
            size={16}
          />
          <UncontrolledTooltip placement="bottom" target="accuracy">
            Shows percentage of questions answered correctly
          </UncontrolledTooltip>
        </h4>
      </div>
      <div className="card-body py-2 d-flex justify-content-center flex-column align-items-center">
        <ReactApexChart
          options={options}
          series={series}
          type="donut"
          height={200}
        />
        <div className="row justify-content-center">
          {Array.isArray(series) &&
            series.length > 0 &&
            series.map((ele: any, idx: number) => (
              <div key={idx} className="d-flex mb-2 col-6 align-items-center">
                <span
                  className="tw-h-3 tw-w-3 tw-rounded me-2 tw-shrink-0"
                  style={{ backgroundColor: colorOptions[idx] }}
                ></span>
                <span className="text-muted fs-12 me-2">
                  {options.labels?.[idx]}
                </span>
                <span>{series?.[idx]}%</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AssessementAccuracy;

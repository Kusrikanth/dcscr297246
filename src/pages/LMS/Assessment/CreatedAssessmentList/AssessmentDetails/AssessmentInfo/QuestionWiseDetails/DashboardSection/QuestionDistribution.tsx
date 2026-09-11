import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

const QuestionDistribution = () => {
  const categories = ["Easy", "Medium", "High","Total"];
  const values = [44, 55, 13];
  const colors = ["#33b2df", "#405189D9", "#0AB39CD9","#F06548D9"];

  const series = useMemo(() => values, [values]);

  const totalQuestions = useMemo(
    () => values.reduce((acc, val) => acc + val, 0),
    [values]
  );

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
      },
      labels: categories,
      colors,
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: { show: false },
              value: {
                show: true,
                fontSize: "22px",
                fontWeight: "bold",
                formatter: () => `${totalQuestions}`,
              },
              total: {
                show: true,
                label: "",
                formatter: () => `${totalQuestions}`,
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val: number) => `${val.toFixed(0)}%`,
        style: {
          fontSize: "10px",
          colors: ["#FFFFFF"],
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val}`,
        },
      },
    }),
    [categories, colors, totalQuestions]
  );

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title mb-0">Question Distribution</h4>
      </div>
      <div className="card-body">
        <div className="">
          <div className="tw-flex tw-items-center tw-justify-center">
            <ReactApexChart
              type="donut"
              options={options}
              series={series}
              width={180}
              height={180}
            />
          </div>
          <div className="tw-flex tw-gap-6 tw-p-3 tw-items-center tw-justify-center">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="d-flex align-items-center "
                style={{
                  borderLeft: `3px solid ${colors[idx]}`,
                  paddingLeft: "8px",
                }}
              >
                <span className="me-1">{cat}</span>
                <span>{values[idx]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDistribution;

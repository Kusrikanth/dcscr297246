import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { yearResults } from "./helper";

const PerformanceTrendChart: React.FC = () => {
  const categories = useMemo(
    () => yearResults.map((item) => item.year),
    []
  );

  const series = useMemo(
    () => [
      {
        name: "Student",
        data: yearResults.map((item) => item.score),
      },
      {
        name: "Class average",
        data: yearResults.map((item) => item.classAverage),
      },
    ],
    []
  );

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "line",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "smooth",
        width: [3, 2],
        dashArray: [0, 4],
      },
      markers: {
        size: 5,
        hover: {
          size: 7,
        },
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        offsetY: -6,
        formatter: (value: number) => `${value}%`,
        background: {
          enabled: false,
        },
        style: {
          fontSize: "11px",
          fontWeight: 600,
          colors: ["#111827"],
        },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        markers: {
          size: 6,
          shape: "circle",
        },
      },
      grid: {
        borderColor: "#e5e7eb",
      },
      xaxis: {
        categories,
      },
      yaxis: {
        min: 70,
        max: 95,
        tickAmount: 5,
        labels: {
          formatter: (value: number) => `${value}%`,
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${value}%`,
        },
      },
      colors: ["#1bb3a6", "#405189"],
    }),
    [categories]
  );

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      height={300}
    />
  );
};

export default React.memo(PerformanceTrendChart);

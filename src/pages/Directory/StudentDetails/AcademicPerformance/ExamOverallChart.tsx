import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { IExamPerformanceRow } from "./helper";

const ExamOverallChart = ({ rows }:any) => {
  const categories = useMemo(() => rows.map((row) => row.exam), [rows]);

  const series = useMemo(
    () => [
      {
        name: "Overall",
        data: rows.map((row) => Number(row.overall || 0)),
      },
    ],
    [rows]
  );

  const range = useMemo(() => {
    const values = rows.map((row) => Number(row.overall || 0));
    const lowest = values.length ? Math.min(...values) : 0;
    const highest = values.length ? Math.max(...values) : 100;
    return {
      min: Math.max(0, Math.floor((lowest - 8) / 5) * 5),
      max: Math.min(100, Math.ceil((highest + 8) / 5) * 5),
    };
  }, [rows]);

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "area",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        curve: "smooth",
        width: 2,
      },
      fill: {
        type: "gradient",
        gradient: {
          opacityFrom: 0.35,
          opacityTo: 0.02,
        },
      },
      markers: {
        size: 4,
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },
      dataLabels: {
        enabled: true,
        offsetY: -6,
        formatter: (value: number) => value.toFixed(1),
        background: {
          enabled: false,
        },
        style: {
          fontSize: "10px",
          fontWeight: 600,
          colors: ["#111827"],
        },
      },
      legend: {
        show: false,
      },
      grid: {
        borderColor: "#e5e7eb",
      },
      xaxis: {
        categories,
      },
      yaxis: {
        min: range.min,
        max: range.max,
        tickAmount: 5,
        labels: {
          formatter: (value: number) => `${Math.round(value)}%`,
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${value.toFixed(1)}%`,
        },
      },
      colors: ["#1bb3a6"],
    }),
    [categories, range]
  );

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={320}
    />
  );
};

export default React.memo(ExamOverallChart);

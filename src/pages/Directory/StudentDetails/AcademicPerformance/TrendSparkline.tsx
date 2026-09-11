import React from "react";
import ReactApexChart from "react-apexcharts";


const TrendSparkline = ({ trend, color }:any) => {
  const options: any = {
    chart: {
      type: "line",
      sparkline: { enabled: true },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    markers: {
      size: 0,
      discrete: trend.length
        ? [
            {
              seriesIndex: 0,
              dataPointIndex: trend.length - 1,
              size: 3,
              fillColor: color,
              strokeColor: color,
            },
          ]
        : [],
    },
    tooltip: {
      enabled: false,
    },
    colors: [color],
  };

  return (
    <ReactApexChart
      options={options}
      series={[{ name: "Trend", data: trend }]}
      type="line"
      height={36}
      width={80}
    />
  );
};

export default React.memo(TrendSparkline);

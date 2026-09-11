import React from "react";
import ReactApexChart from "react-apexcharts";

const DonutChart = (props: any) => {
  return (
    <ReactApexChart
      options={props.options}
      series={props.series}
      type="donut"
      height={props.height}
    />
  );
};

export default DonutChart;

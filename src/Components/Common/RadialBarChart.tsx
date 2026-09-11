import React from "react";
import ReactApexChart from "react-apexcharts";

const RadialBarChart = (props: any) => {
  return (
    <ReactApexChart
      options={props.options}
      series={props.series}
      type="radialBar"
      height={props.height}
    />
  );
};

export default RadialBarChart;

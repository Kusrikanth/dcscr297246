import React from "react";
import ReactApexChart from "react-apexcharts";

const LineChart = (props: any) => {
  return (
    <ReactApexChart
      options={props.options}
      series={props.series}
      // type="line"
      height={props.height}
    />
  );
};

export default LineChart;

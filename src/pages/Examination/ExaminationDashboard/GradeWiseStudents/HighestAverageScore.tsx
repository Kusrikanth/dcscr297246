import React from "react";
import ReactApexChart from "react-apexcharts";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";

const HighestAverageScore = () => {
  const seriesData = [{
    name: 'Highest',
    data: [76, 85, 99, 98, 87, 99]
  }, {
    name: 'Average',
    data: [44, 55, 57, 56, 61, 58]
  }];

  const chartOptions: any = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 2,
        borderRadiusApplication: 'end'
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    legend: {
      position: 'bottom',
    },
    xaxis: {
      categories: ['English Core', 'Mathematics', 'Physics', 'Chemistry',
        'Biology', 'Physical Education'
      ],
    },
    yaxis: {
      title: {
        text: 'Marks'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val: string) {
          return "$ " + val + "marks"
        }
      }
    },
    colors: ["#0AB39C", "#405189"],
  };

  return (
    <>
      <div>
        <ReactApexChart
          options={chartOptions}
          series={seriesData}
          height={350}
          type="bar"
        />
      </div>
    </>
  );
};

export default HighestAverageScore;

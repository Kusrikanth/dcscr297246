import React from "react";
import ReactApexChart from "react-apexcharts";

const RangeWiseStudents = () => {
  const series = [
    {
      name: "Marks",
      data: [76, 62, 33, 58, 70, 76, 62, 33],
    },
  ];

  const options: any = {
    chart: {
      height: 350,
      type: "bar",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        endingShape: "flat",
        distributed: true,
        dataLabels: {
            position: 'top',
        },
        borderRadius: 2,
        borderRadiusApplication: 'end'
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#878a99"],
      },
      formatter: (val: number) => `${val}`,
    },
    xaxis: {
      categories: [
        "90-100", "80-89", "70-79", "60-69", "50-59", 
        "40-49", "30-39", "0-29",
      ],
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
          colors: ["#405189", "#0AB39C", "#FEB019", "#f06548", "#2A9D8F", "#E9C46A", "#F4A261"],
        },
      },
    },
    yaxis: {
      title: {
        text: "No.of Students",
      },
    },
    colors: ["#405189", "#0AB39C", "#FEB019", "#f06548", "#6C757D", "#405189", "#0AB39C", "#FEB019"],
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'bottom',
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val} books`,
      },
    },
  };
  

  return (
    <div
      className=""
    >
       <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
    </div>
  );
};

export default RangeWiseStudents;

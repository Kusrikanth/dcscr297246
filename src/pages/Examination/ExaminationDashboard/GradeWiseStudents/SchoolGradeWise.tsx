import React from "react";
import ReactApexChart from "react-apexcharts";

const SchoolGradeWise = () => {
  const series = [
    {
      name: "Marks",
      data: [21, 22, 10, 28, 16, 21, 18],
    },
  ];

  const options: any = {
    chart: {
      height: 350,
      type: "bar",
      toolbar: {
        show: false,
      },
      events: {
        click: function (chart: any, w: any, e: any) {
        },
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
    colors: ["#405189", "#0AB39C", "#FEB019", "#f06548", "#6C757D", "#2A9D8F", "#E9C46A", "#F4A261"],
    plotOptions: {
      bar: {
        columnWidth: "40%",
        distributed: true,
        dataLabels: {
            position: 'top',
        },
        borderRadius: 2,
        borderRadiusApplication: 'end'
      },
    },
    yaxis: {
      title: {
        text: "No.of Students",
      },
    },
    legend: {
      position: 'bottom',
    },
    xaxis: {
      categories: [
        "A1",
        "A2",
        "C1",
        "C2",
        "D1",
        "D2", 
        "E"
      ],
      labels: {
        style: {
          colors: ["#405189", "#0AB39C", "#FEB019", "#f06548", "#6C757D", "#2A9D8F", "#E9C46A", "#F4A261"],
          fontSize: "12px",
        },
      },
    },
  };

  return (
    <div className="">
      <ReactApexChart options={options} series={series} type="bar" height={350} />
    </div>
  );
};

export default SchoolGradeWise;

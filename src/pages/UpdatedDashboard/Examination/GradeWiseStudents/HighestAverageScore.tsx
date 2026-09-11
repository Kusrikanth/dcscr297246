import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { getGradeKeys } from "./helper";

const RangeWiseStudents = (props: any) => {

  const categories = useMemo(() => {
    return Object.keys(props?.data?.marksRange?.[0]?.slabCounts).sort((a, b) => {
      const startA = parseInt(a.split("-")[0], 10);
      const startB = parseInt(b.split("-")[0], 10);
      return startA - startB;
    })
  }, [props?.data]);

  const series = useMemo(() => {
    const slabCounts = props?.data?.marksRange?.[0]?.slabCounts || {};
    const data = categories?.map(
      (slab) => slabCounts[slab] || 0
    );
  
    return [
      {
        name: "Students",
        data,
      },
    ];
  }, [categories, props?.data]);


  const options: ApexCharts.ApexOptions = {
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
        columnWidth: categories.length < 9 ? '35px' : '50%',
        distributed: true,
        dataLabels: {
          position: "top",
        },
        borderRadius: 2,
        borderRadiusApplication: "end",
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
      categories,
      labels: {
        rotate: -45,
        style: {
          fontSize: "12px",
          colors: [
            "#405189",
            "#0AB39C",
            "#FEB019",
            "#f06548",
            "#2A9D8F",
            "#E9C46A",
            "#F4A261",
          ],
        },
      },
    },
    yaxis: {
      title: {
        text: "No.of Students",
      },
      max: Math.max(...series[0].data) + 3,
      min: 0,
    },
    colors: [
      "#405189",
      "#0AB39C",
      "#FEB019",
      "#f06548",
      "#6C757D",
      "#E9C46A",
      "#F4A261",
      "#f55555",
    ],
    fill: {
      opacity: 1,
    },
    legend: {
      position: "bottom",
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}`,
      },
    },
  };

  return (
    <div className="">
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

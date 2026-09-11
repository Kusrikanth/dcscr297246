import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { getSortedGradeCategories } from "./helper";

const SchoolGradeWise = (props: any) => {

  const categories = useMemo(() => {
    return getSortedGradeCategories(props?.data?.gradeWiseNoOfStudents);
  }, [props.data]);


  const series = useMemo(() => {
    const gradeData = props?.data?.gradeWiseNoOfStudents || {};
    const data = categories.map((grade) => gradeData[grade] ?? 0);
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
      toolbar: {
        show: false,
      }
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
    colors: [
      "#405189",
      "#0AB39C",
      "#FEB019",
      "#f06548",
      "#6C757D",
      "#2A9D8F",
      "#E9C46A",
      "#F4A261",
    ],
    plotOptions: {
      bar: {
        columnWidth: categories.length < 9 ? '35px' : '50%',
        distributed: true,
        dataLabels: {
          position: "top",
        },
        borderRadius: 2,
        borderRadiusApplication: "end",
      },
    },
    yaxis: {
      title: {
        text: "No.of Students",
      },
      max: Math.max(...series[0].data) + 3,
      min: 0,
    },
    legend: {
      position: "bottom",
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: [
            "#405189",
            "#0AB39C",
            "#FEB019",
            "#f06548",
            "#6C757D",
            "#2A9D8F",
            "#E9C46A",
            "#F4A261",
          ],
          fontSize: "12px",
        },
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

export default SchoolGradeWise;

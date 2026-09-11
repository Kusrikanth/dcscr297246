import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { generateGradeSeries, getGradeKeys } from "./helper";

const GradeWiseStudents = (props: any) => {

  const categories = useMemo(() => {
    return getGradeKeys(props?.data?.gradeWise);
  }, [props.data]);

  const series: any = useMemo(() => {
    return generateGradeSeries(props?.data?.gradeWise, categories);
  }, [props.data, categories]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 1300,
        options:{
          xaxis: {
            labels: {
                style: {
                    fontSize: '9px'
                }
            }
          },
        }
      },
      {
        breakpoint: 850,
        options: {
          xaxis: {
            labels: {
                style: {
                    fontSize: '8px'
                }
            }
        },
        },
      },
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
          xaxis: {
            labels: {
                style: {
                    fontSize: '7px'
                }
            }
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: categories.length < 9 ? '35px' : '50%',
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              // fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "10px",
        },
      }
    },
    legend: {
      position: "bottom",
    },
    fill: {
      opacity: 1,
    },
    colors: [
      "#405189",
      "#0AB39C",
      "#FEB019",
      "#f06548",
      "#2A9D8F",
      "#E9C46A",
      "#F4A261",
    ],
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default GradeWiseStudents;
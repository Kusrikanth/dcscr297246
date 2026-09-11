import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { getGradeKeys } from "./helper";

const HighestAverageScore = (props: any) => {

  const categories = useMemo(() => {
    return getGradeKeys(props?.data?.subjectWise || {});
  }, [props.data]);

  const seriesData = useMemo(() => {
    const subjectWise = props?.data?.subjectWise || {};

    const highest = categories.map((subject) => {
      const subjectData = subjectWise[subject]?.[0];
      return parseFloat(subjectData?.highestMarks?.toFixed(2) ?? 0);
    });

    const average = categories.map((subject) => {
      const subjectData = subjectWise[subject]?.[0];
      return parseFloat(subjectData?.averageMarks?.toFixed(2) ?? 0);
    });

    const lowest = categories.map((subject) => {
      const subjectData = subjectWise[subject]?.[0];
      return parseFloat(subjectData?.lowestMarks?.toFixed(2) ?? 0);
    });

    
    return [
      { name: "Highest", data: highest },
      { name: "Lowest", data: lowest },
      { name: "Average", data: average },
    ];
  }, [categories, props.data]);

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth:  categories.length < 9 ? '35px' : '50%',
        borderRadius: 2,
        borderRadiusApplication: "end",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#000"],
        fontWeight: 500,
      },
    },
    responsive: [
      {
        breakpoint: 1845,
        options:{
          xaxis: {
            labels: {
              rotate: -40,
              style: {
                fontSize: '11px'
              }
            }
          }
        }
      },
      {
        breakpoint: 1350,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "35px",
            },
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '11px'
              }
            }
          },
        },
      },
      {
        breakpoint: 1150,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "25px",
            },
          },
        },
      },
      {
        breakpoint: 940,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "22px",
            },
          },
        },
      },
      {
        breakpoint: 845,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "20px",
            },
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "22px",
            },
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          },
        },
      },
      {
        breakpoint: 580,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "18px",
            },
          },
        },
      },
      {
        breakpoint: 510,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "12px",
            },
          },
          xaxis: {
            labels: {
              rotate: 270,
            }
          },
        },
      },
      
      {
        breakpoint: 408,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "6px",
            },
          },
        },
      },
    ],
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    legend: {
      position: "bottom",
    },
    xaxis: {
      categories,
      // offsetY: 10,
      labels: {
        style: {
          fontSize: "10px",
        },
      }
    },
    yaxis: {
      title: {
        text: "Marks",
      },
    },
    fill: {
      opacity: 1,
    },

    colors: ["#0AB39C", "#405189", "rgb(254, 176, 25)"],
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

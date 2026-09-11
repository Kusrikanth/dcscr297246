import React, { useRef } from "react";
import ReactApexChart from "react-apexcharts";

const GradeWiseAnalysis = (props: any) => {

  const selectedSubject = props?.filterStateForm?.subject;
  const subjectData = props?.data?.gradeWise?.[selectedSubject];

const customGradeSort = (a: string, b: string) => {
  const specialGrades = ['PR', 'ABS', 'NO EXAMINATION', 'ML', 'AB', 'PA'];
  
  const isSpecialA = specialGrades.includes(a);
  const isSpecialB = specialGrades.includes(b);
  
  if (isSpecialA && isSpecialB) {
    return a.localeCompare(b);
  }
  
  if (isSpecialA) {
    return 1;
  }
  
  if (isSpecialB) {
    return -1;
  }
  
  const stripBase = (grade: string) => grade.replace(/[^a-zA-Z]/g, "");
  const getSuffix = (grade: string) => grade.replace(/[a-zA-Z]/g, "");
  
  const baseA = stripBase(a);
  const baseB = stripBase(b);

  
  if (baseA === baseB) {
    const suffixA = getSuffix(a);
    const suffixB = getSuffix(b);
    
    if (suffixA === "") return 1;
    if (suffixB === "") return -1;

    return suffixA.localeCompare(suffixB, undefined, { numeric: true });
  }

  return baseA.localeCompare(baseB);
};

const labels: string[] = subjectData && Object.keys(subjectData).length > 0
  ? Object.keys(subjectData).sort(customGradeSort)
  : [];

const series: number[] = labels.map(label => subjectData[label] ?? 0);

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      height: 350,
      width: "100%",
      type: "bar",
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#878a99"],
      },
      formatter: function (val: number) {
        return val.toFixed(2) + "%";
      },
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
        columnWidth: labels.length < 9 ? '35px' : '50%',
        distributed: true,
        dataLabels: {
          position: 'top',
        },   
        borderRadius: 2,
        borderRadiusApplication: 'end',
      },
    },
    yaxis: {
      title: {
        text: 'No. of Students',
      },
      labels: {
        formatter: function (val: number) {
          return val.toFixed(2) ;
        },
        style: {
          fontSize: "12px",
        }
      }
    },
    legend: {
      position: "bottom",
      fontSize: "12px",
    },
    xaxis: {
      categories: labels,
      labels: {
        style: {
          fontSize: "12px",
        }
      }
    },
    
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toFixed(2) + "%";
        },
      },
    },
 
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250,
          },
          plotOptions: {
            bar: {
              columnWidth: '70%',
            }
          }
        },
      },
    ],
  };

  const chartSeries = [{
    name: 'Students',
    data: series
  }];

  return (
    <>
        {series.length > 0 ? (
        <div className="w-100 mb-0">
            <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                // width={400}
                height={350}
            />
        </div>
        ) : (
          <div className="tw-text-center tw-justify-center tw-flex tw-items-center">No record found</div>
        )}
    </>
  );
};

export default GradeWiseAnalysis;
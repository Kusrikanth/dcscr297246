import React, { useRef } from "react";
import ReactApexChart from "react-apexcharts";

const SubjectGradeWiseAnalysis = (props: any) => {

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

  const chartOptions: any = {
    chart: {
      type: "donut",
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
    labels: labels.map((lbl, index) => `${lbl}`),
    legend: {
      position: "bottom",
      fontSize: "12px",
      formatter: function (label: string, opts: any) {
        const seriesIndex = opts.seriesIndex;
        const value = opts.w.globals.series[seriesIndex];
        return `${label} - ${value.toFixed(2)}`;
      },

    },
    plotOptions: {
      pie: {
        donut: {
          size: "0%",
        },
      },
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return val.toFixed(2);
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      formatter: function (val: number) {
        return Math.round(val) + "%";
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 250,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <>
      <div className="tw-flex tw-justify-center tw-w-full tw-mb-0">
        {series.length > 0 ? (
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="donut"
            width={300}
            height={290}
          />
        ) : (
          <div className="tw-text-center tw-justify-center tw-flex tw-items-center">No record found</div>
        )}
      </div>
    </>
  );
};

export default SubjectGradeWiseAnalysis;

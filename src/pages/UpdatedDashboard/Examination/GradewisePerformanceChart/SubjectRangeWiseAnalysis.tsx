import React, { useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useFormik } from "formik";


const SubjectRangeWiseAnalysis = (props: any) => {

  const selectedSubject = props?.filterStateForm?.subject;
  const subjectData = props?.data?.rangeWiseSubjectAnalysis?.[selectedSubject];


  const chartRef = useRef(null);

  const customGradeSort = (a: string, b: string) => {
   const startA = parseInt(a.split("-")[0], 10);
      const startB = parseInt(b.split("-")[0], 10);
      return startA - startB;
};
  

  const label: string[] = subjectData && Object.keys(subjectData).length > 0
  ? Object.keys(subjectData).sort(customGradeSort)
  : [];

const series: number[] = label.map(label => subjectData[label] ?? 0);

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
      "#E9C46A",
      "#F4A261",
      "#f55555",
    ],
    labels: label.map((lbl, index) => `${lbl} - ${series[index] || 0}`),
    legend: {
      position: "bottom",
      fontSize: "12px",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "0%",
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
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
        <ReactApexChart
          options={chartOptions}
          series={series}
          type="donut"
          width={300}
          height={300}
          ref={chartRef}
        />
      </div>
    </>
  );
};

export default SubjectRangeWiseAnalysis;

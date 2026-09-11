import React, { useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useFormik } from "formik";

const initialValues = {
  subject: "",
  curriculumId: "",
};

const SubjectRangeWiseAnalysis = () => {
  const [filterState, setFilterState] = useState(initialValues);
  const filterStateForm = useFormik({
    enableReinitialize: true,
    initialValues: filterState,
    onSubmit: (values) => { },
  });
  const chartRef = useRef(null);
  const [label, setLabel] = useState<string[]>([
    "90-100", "80-89", "70-79", "60-69", "50-59",
    "40-49", "30-39", "0-29",
  ]);

  const series = [10, 20, 30, 8, 10, 12, 10,];

  const chartOptions: any = {
    chart: {
      type: "donut",
    },
    colors: ["#405189", "#0AB39C", "#FEB019", "#f06548", "#6C757D", "#2A9D8F", "#E9C46A", "#F4A261"],
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
      <div className="d-flex justify-content-center w-100 mb-0">
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

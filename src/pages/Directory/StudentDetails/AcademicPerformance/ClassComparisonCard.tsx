import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import NoDataComp from "../../../../Components/Common/NoDataComp";
import { ISubjectResult, subjectAverage } from "./helper";

const ClassComparisonCard= ({
  subjects,
}:any) => {
  const categories = useMemo(
    () => subjects.map((row) => row.subject),
    [subjects]
  );

  const series = useMemo(
    () => [
      {
        name: "Student",
        data: subjects.map((row) => subjectAverage(row)),
      },
      {
        name: "Class average",
        data: subjects.map((row) => row.classAverage),
      },
    ],
    [subjects]
  );

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: "60%",
          borderRadius: 3,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: 26,
        formatter: (value: number) => `${value}%`,
        background: {
          enabled: false,
        },
        style: {
          fontSize: "11px",
          fontWeight: 600,
          colors: ["#111827"],
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
        markers: {
          size: 6,
          shape: "circle",
        },
      },
      grid: {
        borderColor: "#e5e7eb",
      },
      xaxis: {
        categories,
        min: 0,
        max: 100,
        tickAmount: 5,
        labels: {
          formatter: (value: string) => `${Math.round(Number(value))}%`,
        },
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${value}%`,
        },
      },
      colors: ["#1bb3a6", "#405189"],
    }),
    [categories]
  );

  return (
    <div className="tw-card tw-mb-0 tw-h-full">
      <div className="tw-card-header">
        <h4 className="tw-card-title">Student vs class average</h4>
        <p className="tw-card-subTitle">
          Current academic year subject comparison
        </p>
      </div>

      <div className="tw-card-body">
        {subjects.length ? (
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={Math.max(200, subjects.length * 56)}
          />
        ) : (
          <NoDataComp
            title="No subjects to compare"
            helperText="Clear the subject filter to see the full comparison."
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(ClassComparisonCard);

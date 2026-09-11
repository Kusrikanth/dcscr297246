import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

interface SectionData {
  sectionId: number;
  sectionName: string;
  totalStudents: number;
  topperMarks: number;
  topperCount: number;
  averageMarks: number;
  averageCount: number;
  leastMarks: number;
  leastCount: number;
}

interface Props {
  getAssessmentSectionWiseMarksOutcomeDetailsGenAct?: SectionData[];
}

const GradeWiseAnalysis = ({
  getAssessmentSectionWiseMarksOutcomeDetailsGenAct = [],
}: Props) => {
  const sortedData = useMemo(
    () =>
      [...getAssessmentSectionWiseMarksOutcomeDetailsGenAct].sort((a, b) =>
        a.sectionName.localeCompare(b.sectionName)
      ),
    [getAssessmentSectionWiseMarksOutcomeDetailsGenAct]
  );

  const categories = useMemo(
    () => sortedData.map((s) => s.sectionName),
    [sortedData]
  );

  const series = useMemo(
    () => [
      {
        name: "Highest Marks",
        type: "column",
        data: sortedData.map((s) => s.topperMarks),
        color: "#0AB39C",
      },
      {
        name: "Average Marks",
        type: "column",
        data: sortedData.map((s) => s.averageMarks),
        color: "#405189",
      },
      {
        name: "Lowest Marks",
        type: "column",
        data: sortedData.map((s) => s.leastMarks),
        color: "#F06548",
      },
      {
        name: "Total Students",
        type: "area",
        data: sortedData.map((s) => s.totalStudents),
        color: "#FAC364",
      },
    ],
    [sortedData]
  );

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "line",
        height: 350,
        stacked: false,
        toolbar: { show: false },
      },
      stroke: {
        width: [0, 0, 0, 1],
        curve: "smooth",
        dashArray: [0, 0, 0, 5],
      },
      plotOptions: {
        bar: {
          columnWidth: "25%",
          borderRadius: 3,
          endingShape: "rounded",
          dataLabels: { position: "top" },
          distributed: false,
        },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories,
        tickPlacement: "on",
        labels: { style: { fontWeight: 500 } },
        axisTicks: { show: false },
        axisBorder: { show: false },
      },
      yaxis: {
        title: { text: "No of Marks ", style: { fontWeight: 600 } },
        labels: {
          formatter: (val) => Math.round(val).toString(),
        },
      },

      fill: {
        type: ["solid", "solid", "solid", "gradient"],
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.4,
          gradientToColors: ["#FAC364", "#FFF2CC"],
          inverseColors: false,
          opacityFrom: 0.6,
          opacityTo: 0.1,
          stops: [0, 90, 100],
        },
      },
      markers: {
        size: [0, 0, 0, 5],
        colors: ["#FAC364"],
        strokeWidth: 2,
        hover: { size: 7 },
      },
      legend: {
        position: "bottom",
        horizontalAlign: "center",
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (val) => {
            if (val === null || val === undefined) return "";
            const num = Number(val);
            if (Number.isNaN(num)) return "";
            return Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(2)).toString();
          },
        },
      },
      grid: {
        borderColor: "#E9ECEF",
        strokeDashArray: 4,
        padding: { left: 30, right: 30 },
      },
    }),
    [categories]
  );

  return (
    <div className="card h-100 mb-3">
      <div className="card-header">
        <h4 className="card-title mb-0">Grades Summary</h4>
      </div>
      <div className="card-body h-100">
        <ReactApexChart
          options={options}
          series={series}
          height={350}
          type="line"
        />
      </div>
    </div>
  );
};

export default GradeWiseAnalysis;
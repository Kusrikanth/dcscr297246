import ReactApexChart from "react-apexcharts";
import { customSort } from "./helper";
import { useMemo } from "react";

const ExamWiseAnalysis = (props: any) => {
  const selectedSubject = props.filterStateForm?.subject;

  const categories = useMemo(() => (
    props.data?.examinationWise?.examinations?.map((item: any) => item.name)
  ), [props.data?.examinationWise]);

  const series = useMemo(() => {
    const grades = props.data?.examinationWise?.grades || [];
    const subjectWiseExamGradeData = props.data?.examinationWise?.subjectWiseExamGradeData || {};
    
    const selectedSubjectData = subjectWiseExamGradeData[selectedSubject] || {};

    return grades
      .filter((grade: any) => grade.name !== "total")
      .sort((a: any, b: any) => customSort(a.name, b.name)) 
      .map((grade: any) => ({
        name: grade.name,
        data: categories?.map((examName: string) => {
          return selectedSubjectData[examName]?.[grade.name] || 0;
        }) || []
      }));
  }, [props.data, categories, selectedSubject]);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      height: 328,
      toolbar: { show: false },
      zoom: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: categories.length < 9 ? '35px' : '45%',
        borderRadius: 2,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
            },
          },
        },
      },
    },
    xaxis: {
      categories: categories || [],
      labels: {
        style: {
          fontSize: "10px",
        },
        rotate: -45,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "11px",
        },
      },
    },
    legend: {
      position: "bottom",
      fontSize: "13px",
    },
    fill: {
      opacity: 1,
    },
    colors: [
      "#405189",
      "#0AB39C",
      "#FEB019",
      "#F06548",
      "#2A9D8F",
      "#E9C46A",
      "#F4A261",
      "#6C757D",
    ],
    tooltip: {
      shared: false,
      intersect: true,
    },
  };

  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={328}
      />
    </div>
  );
};

export default ExamWiseAnalysis;
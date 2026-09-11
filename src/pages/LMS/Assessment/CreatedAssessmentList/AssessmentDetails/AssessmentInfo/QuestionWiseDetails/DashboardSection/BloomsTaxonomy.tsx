import ReactApexChart from "react-apexcharts";
import { useMemo } from "react";

const BloomsTaxonomyChart = () => {
  const categories = [
    "Remembering",
    "Understanding",
    "Applying",
    "Analyzing",
    "Evaluating",
    "Creating",
  ];

  const values = [400, 430, 448, 470, 540, 580];

  const series = useMemo(
    () => [
      {
        data: values,
      },
    ],
    [values]
  );

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
          barHeight: "50%",
        },
      },
      colors: [
        "#33b2df",
        "#405189D9",
        "#0AB39CD9",
        "#F7B84BD9",
        "#F06548D9",
        "#212529D9",
      ],
      dataLabels: {
        enabled: false,
        formatter: (val, opts) => `${categories[opts.dataPointIndex]}: ${val}`,
        style: {
          colors: ["#fff"],
        },
        textAnchor: "start",
        offsetX: 10,
      },
      xaxis: {
        categories,
        labels: {
          show: true,
        },
      },
      yaxis: {
        labels: { show: false },
      },
      grid: {
        show: false,
      },
      legend: {
        show: true,
        position: "right",
        itemMargin: {
          horizontal: 0,
          vertical: 10,
        },
        fontSize: "14px",
        offsetY: 10,
        formatter: (seriesName: string, opts: any) => {
          const seriesIndex = opts.seriesIndex;
          const value = opts.w.globals.series[0][seriesIndex];
          return `${seriesName}: ${value}`;
        },
      },
      tooltip: {
        y: {
          formatter: (val) => val.toString(),
        },
      },
    }),
    [categories]
  );

  return (
    <div className="card">
      <div className="card-header">
        <h4 className="card-title mb-0">BloomsTaxonomy</h4>
      </div>
      <div className="card-body p-0">
        <div className="w-100">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={292}
          />
        </div>
      </div>
    </div>
  );
};

export default BloomsTaxonomyChart;

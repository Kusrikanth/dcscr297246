import ReactApexChart from "react-apexcharts";

const colorOptions = ["#0AB39CD9", "#F27E6AD9", "#13C4DED9"];

const ResultChart = ({
  answeredCount = 0,
  notAnsweredCount = 0,
  totalQuestions
}) => {
  const series = [answeredCount, notAnsweredCount];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Attempted", "Not Attemtepted"],
    responsive: [
      {
        breakpoint: 1206,
        options: {
          chart: {
            width: 178,
            height: 178,
          },
        },
      },
      {
        breakpoint: 767,
        options: {
          chart: {
            width: 142,
            height: 142,
          },
        },
      },
    ],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: false,
            },
            value: {
              show: true,
            },
            total: {
              show: true,
              color: "black",
              fontSize: "12px",
              showAlways: true,
              formatter: function (w: any) {
                const total = w.globals.seriesTotals.reduce(
                  (a: any, b: any) => a + b,
                  0
                );
                return `${+total}Q`;
              },
            },
          },
        },
      },
    },
    colors: colorOptions,
    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return ` ${val}`;
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (_val: number, opts: any) {
        return `${opts.w.config.series[opts.seriesIndex]}`
      },
      style: {
        fontSize: "10px",
        colors: ["#FFFFFF"],
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      width={178}
    />
  );
};

export default ResultChart;

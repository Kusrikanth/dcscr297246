import ReactApexChart from "react-apexcharts";

const ChartPercentage = ({ seriesData }: any) => {
  const series = [seriesData];

  let color = "#0AB39C";
  if (seriesData < 50) {
    color = "#F06548";
  } else if (seriesData < 75) {
    color = "#F7B84B";
  }

  const options: any = {
    chart: {
      type: "radialBar",
      width: 42,
      height: 42,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "65%",
        },
        track: {
          margin: 1,
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: "10px",
            fontWeight: 500,
            color: "#000",
            offsetY: 3,
            offsetX: 2,
            formatter: function (val: number) {
              return `${Math.round(val)}%`;
            },
          },
        },
      },
    },
    colors: [color],
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <ReactApexChart
      dir="ltr"
      options={options}
      series={series}
      type="radialBar"
      height={65}
      width={65}
      className="apex-charts"
    />
  );
};

export default ChartPercentage;

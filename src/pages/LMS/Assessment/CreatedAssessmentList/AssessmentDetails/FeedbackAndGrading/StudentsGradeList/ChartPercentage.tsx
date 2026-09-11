import ReactApexChart from "react-apexcharts";

const ChartPercentage = ({
  value,
  total,
}: {
  value: number;
  total: number;
}) => {
  const percentage = (value / total) * 100; // convert to %
  const series = [percentage];

  let color = "#0AB39C";
  if (percentage < 50) {
    color = "#F06548";
  } else if (percentage < 75) {
    color = "#F7B84B";
  }

  const lighterColor = color + "40";

  const options: any = {
    chart: {
      type: "radialBar",
      sparkline: { enabled: true },
    },
    plotOptions: {
      radialBar: {
        startAngle: 0,
        endAngle: 360,
        hollow: {
          margin: 0,
          size: "65%",
        },
        track: {
          background: lighterColor,
          strokeWidth: "75%",
          margin: 0,
        },
        dataLabels: {
          show: true,
          name: { show: false },
          value: {
            show: true,
            fontSize: "10px",
            fontWeight: 400,
            color: "#000",
            offsetY: 3,
            formatter: function () {
              return `${value}/${total}`; // <-- show value/total
            },
          },
        },
      },
    },
    colors: [color],
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="radialBar"
      height={50}
      width={50}
    />
  );
};

export default ChartPercentage;

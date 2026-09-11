import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";

const CurriculumWiseStrengthBarView = () => {
  const series = useMemo(() => {
    return [
      {
        name: "CBSE",
        type: "column",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94, 76, 85, 101, 98, 87, 105],
        color: "#0AB39C",
      },
      {
        name: "IGCSE",
        type: "column",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66, 35, 41, 36, 26, 45, 48],
        color: "#405189",
      },
      {
        name: "Total",
        type: "area",
        data: [56, 75, 91, 88, 97, 125, 71, 144, 74, 96, 115, 111, 88, 107, 95],
        color: "#FAC364",
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical",
            shadeIntensity: 0.5,
            gradientToColors: ["#CED4DC"],
            inverseColors: false,
            opacityFrom: 0.6,
            opacityTo: 0.8,
            stops: [0, 100],
          },
        },
      },
    ];
  }, []);

  const options: any = useMemo(
    () => ({
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadiusApplication: "end",
          borderRadius: 2,
          dataLabels: {
            enabled: false,
            position: "bottom",
          },
        },
      },
      dataLabels: {
        enabled: false,
        position: "bottom",
        offsetY: 10,
        style: {
          fontSize: "12px",
          colors: ["#fff"],
          fontWeight: 500,
        },
        formatter: function (val: any, { seriesIndex }: any) {
          const hiddenSeries = [2];
          return hiddenSeries.includes(seriesIndex) ? "" : val;
        },
      },
      stroke: {
        width: [0, 0, 1],
        dashArray: [0, 0, 3],
        curve: "smooth",
      },
      fill: {
        opacity: [1, 1, 0.3],
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.8,
        },
      },
      markers: {
        size: [0, 0, 6],
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },
      xaxis: {
        categories: [
          "EY-1",
          "EY-2",
          "EY-3",
          "I",
          "II",
          "III",
          "IV",
          "V",
          "VI",
          "VII",
          "VIII",
          "IX",
          "X",
          "XI",
          "XII",
        ],
      },
      yaxis: [
        {
          seriesName: "Male",
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#008FFB",
          },
          labels: {
            style: {
              colors: "#008FFB",
            },
          },

          min: 0,
          tooltip: {
            enabled: true,
          },
        },
      ],
      legend: {
        show: true,
        horizontalAlign: "center",
        offsetX: 0,
        offsetY: 5,
        markers: {
          width: 9,
          height: 9,
          radius: 6,
        },
        itemMargin: {
          horizontal: 10,
          vertical: 0,
        },
      },
    }),
    []
  );

  return (
    <>
      <div className="curriculum-wise-strength-bar-container">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </div>
    </>
  );
};

export default CurriculumWiseStrengthBarView;

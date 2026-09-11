import ReactApexChart from "react-apexcharts";

const colorOptions = ["#0AB39CD9", "#F27E6AD9", "#5A6BA5D9"];

const ScoreChart = () => {
  const series = [52];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "radialBar",
    },
    labels: ["Your's"],
    responsive: [
      {
        breakpoint: 1206,
        options: {
          chart: {
            width: 128,
            height: 128,
          },
        },
      },
      {
        breakpoint: 767,
        options: {
          chart: {
            width: 158,
            height: 158,
          },
        },
      },
    ],
    plotOptions: {
      radialBar: {
        hollow: {
          size: "60%",
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            show: true,
            fontSize: "12px",
            fontWeight: 500,
            formatter: function (val: number) {
              return `${val} / 100`;
            },
          },
          total: {
            show: false,
          },
        },
      },
    },
    colors: colorOptions,
    legend: {
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
  };

  return (
    <div className="card questions-card">
      <div className="card-header">
        <h4 className="card-title mb-0">Total Score</h4>
      </div>
      <div className="card-body py-2">
        <div className="row align-items-center justify-content-between">
          <div className="col-12 d-flex align-items-center justify-content-center">
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              width={128}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreChart;

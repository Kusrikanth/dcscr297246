import ReactApexChart from "react-apexcharts";

const colorOptions = ["#0AB39CD9", "#F27E6AD9", "#5A6BA5D9"];

const TotalExamDuration = () => {
  const series = [43, 12, 5];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Mins Correct", "Mins Wrong", "Mins Others"],
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
              fontSize: "6px !important",
              showAlways: true,
              formatter: function (w: any) {
                const correct = w.globals.series[0];
                const total = w.globals.seriesTotals.reduce(
                  (a: any, b: any) => a + b,
                  0
                );
                return `${correct} / ${total}`;
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
      enabled: false,
      y: {
        formatter: function (val: number) {
          return ` ${val}`;
        },
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (val: number) {
        return `${val.toFixed(0)}%`;
      },
      style: {
        fontSize: "10px",
        colors: ["#FFFFFF"],
      },
    },
  };

  return (
    <div className="card questions-card">
      <div className="card-header">
        <h4 className="card-title mb-0">Exam Duration</h4>
      </div>
      <div className="card-body py-2">
        <div className="row align-items-center justify-content-between">
          <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
            <ReactApexChart
              options={options}
              series={series}
              type="donut"
              width={128}
            />
          </div>
          <div className="col-12 col-md-6">
            <div className="row d-flex justify-content-center">
              {Array.isArray(series) &&
                series.length > 0 &&
                series.map((ele: any, idx: number) => (
                  <div key={idx} className="d-flex flex-column mb-2 col-12">
                    <div
                      className="d-flex align-items-center ps-2"
                      style={{
                        borderLeft: `2px solid ${colorOptions[idx]}`,
                      }}
                    >
                      <p className="mb-0 me-2">{series?.[idx]} : </p>
                      <p className="text-muted fw-normal mb-0 fs-12">
                        {options.labels?.[idx]}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalExamDuration;

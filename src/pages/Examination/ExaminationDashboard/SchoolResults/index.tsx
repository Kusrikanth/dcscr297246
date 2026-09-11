import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";

const SchoolResults = () => {
  const seriesData = [90, 4, 4, 2];
  const [labels, setLabel] = useState<string[]>([
    "Pass",
    "Compartment",
    "Essential Repeat",
    "Fail",
  ]);
  const donutColors = ["#0AB39C", "#405189", "#FEB019", "#f06548"];
  const chartOptions: any = {
    labels,
    colors: donutColors,
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 10,
        donut: {
          size: "60%",
          labels: {
            show: true,
            name: { show: true, fontSize: "14px", offsetY: 10 },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              color: "#333",
              formatter: (value: number) => `${value}%`,
            },
            total: {
              show: false,
              showAlways: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: 700,
              formatter: (w: any) => `${w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)}%`,
            },
          },
        },
      },
    },
    annotations: {
      position: "front",
      texts: [
        {
          text: `${seriesData.reduce((a, b) => a + b, 0)}%`,
          x: "50%",
          y: "70%",
          textAnchor: "middle",
          fontSize: "18px",
          fontWeight: 700,
          color: "#000",
          textAlign: "center",
        },
        {
          text: "Total",
          x: "50%",
          y: "85%",
          textAnchor: "middle",
          fontSize: "14px",
          fontWeight: 600,
          color: "#555",
          textAlign: "center",
        },
      ],
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return `${val.toFixed(0)}%`;
      },
      dropShadow: { enabled: false },
    },
    grid: { padding: { bottom: -120 } },
    legend: { show: false },
  };

  return (
    <>
      <div className="card">
        <div className="card-header horizontal_tab_fee py-2">
          <div className="row align-items-center">
            <div className="col">
              <h4 className="card-title mb-0 flex-grow-1">
                School Average Aggregate Percentage
              </h4>
            </div>
            <div className="col-auto">
              <div className="d-flex align-items-center">
                <button
                  id="export-btn"
                  className="btn btn-icon btn-rounded btn-soft-info p-2"
                >
                  <img src={ExportIcon} className="img-fluid h-100" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row align-items-center h-100">
            <div className="col-12">
              <div className="d-flex justify-content-center w-100 mb-5">
                <ReactApexChart
                  options={chartOptions}
                  series={seriesData}
                  height={248}
                  type="donut"
                />
              </div>
              <div className="d-grid gap-3 mt-3">
                {labels.map((lbl, index) => {
                  const totalStudents = 1500;
                  const percentage = seriesData[index];
                  const actualCount = Math.round((percentage / 100) * totalStudents);
                  return (
                    <div key={index} className="row d-flex align-items-center justify-content-between w-100 mx-auto">
                      <div className="col-7">
                        <span
                          className="legend-color me-2"
                          style={{
                            width: 12,
                            height: 12,
                            backgroundColor: donutColors[index],
                            display: "inline-block",
                            borderRadius: "50%",
                          }}
                        ></span>
                        <span className="legend-text">{`${lbl}`}</span></div>
                      <div className="col-4"><span className="legend-text">{`${percentage}% (${actualCount})`}</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolResults;

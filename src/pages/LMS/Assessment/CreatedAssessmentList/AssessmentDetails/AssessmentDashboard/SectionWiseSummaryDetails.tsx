import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const SectionWiseSummaryDetails = ({ getSectionWiseSummarydetailsResp }) => {
  if (!getSectionWiseSummarydetailsResp || getSectionWiseSummarydetailsResp.length === 0) {
    return <p>No data available</p>;
  }

  const sortedSections = [...getSectionWiseSummarydetailsResp].sort((a, b) =>
    a.sectionName.localeCompare(b.sectionName)
  );

  const getChartColor = (avg: number) => {
    if (avg >= 0 && avg < 25) return "#f06548";
    if (avg >= 25 && avg < 50) return "#FEB019";
    if (avg >= 50 && avg < 75) return "#405189";
    return "#0AB39C";
  };

  return (
    <div
      className="d-flex gap-3"
      style={{
        overflowX: "auto",
        whiteSpace: "nowrap",
        paddingBottom: "8px",
      }}
    >
      {sortedSections.map((section) => {
        const avg = section.avgAccuracyPercentage;
        const pass = section.passPercentage.toFixed(1);
        const topper = `${section.topperMarks}/${section.totalMarks}`;
        const passCount = Math.round((section.passPercentage / 100) * section.totalStudents);
        const failCount = section.totalStudents - passCount;
        const failPercentage = ((failCount / section.totalStudents) * 100).toFixed(1);

        const chartOptions: ApexOptions = {
          chart: {
            type: "radialBar",
            sparkline: { enabled: true },
          },
          plotOptions: {
            radialBar: {
              hollow: { size: "55%" },
              track: { background: "#f2f2f2" },
              dataLabels: {
                show: true,
                name: { show: false },
                value: {
                  fontSize: "14px",
                  fontWeight: 600,
                  offsetY: 5,
                  formatter: () => `${avg.toFixed(1)}%`,
                },
              },
            },
          },
          colors: [getChartColor(avg)],
        };

        return (
          <div
            key={section.sectionId}
            style={{
              flex: "0 0 auto",
              width: "280px",
            }}
          >
            <div className="card d-grid h-100 p-3 shadow-sm rounded text-start">
              <div className="d-flex justify-content-between align-items-center mt-2">
                <h6 className="fw-bold mb-0">{section.sectionName}</h6>
                <span style={{ fontSize: "13px", color: "#666" }}>
                  {section.totalStudents} {section.totalStudents === 1 ? "student" : "students"}
                </span>
              </div>
              <div className="row d-flex align-items-center">
                <div className="col-12 col-md-6">
                  <ReactApexChart
                    options={chartOptions}
                    series={[avg]}
                    type="radialBar"
                    height={120}
                    width={120}
                  />
                </div>
                <div className="col-12 col-md-6">
                  <div style={{ fontSize: "14px", color: "#555" }}>
                    <div className="row mb-1">
                      <div className="col-7">Avg</div>
                      <div className="col-5 text-end text-primary"><b>{avg.toFixed(1)}%</b></div>
                    </div>
                    <div className="row mb-1">
                      <div className="col-7">Pass</div>
                      <div className="col-5 text-end text-success"><b>{pass}%</b></div>
                    </div>
                    <div className="row mb-1">
                      <div className="col-7">Fail</div>
                      <div className="col-5 text-end text-danger"><b>{failPercentage}%</b></div>
                    </div>
                    <div className="row mb-1">
                      <div className="col-7">Topper</div>
                      <div className="col-5 text-end text-secondary"><b>{topper}</b></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SectionWiseSummaryDetails;

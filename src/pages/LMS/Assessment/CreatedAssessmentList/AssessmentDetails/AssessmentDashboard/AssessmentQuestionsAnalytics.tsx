import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";

const AssessmentSectionProgress = ({ getAssessmentSectionWiseDetailsDetailsResp }: any) => {
  const [color] = useState(["#0AB39C", "#F06548", "#FEB019", "#6C757D"]);
  const [series, setSeries] = useState<number[]>([0, 0, 0, 0]);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    if (getAssessmentSectionWiseDetailsDetailsResp) {
      const { passCount = 0, failCount = 0, absentCount = 0, notSubmittedCount = 0 } = getAssessmentSectionWiseDetailsDetailsResp;
      const newSeries = [passCount, failCount, absentCount, notSubmittedCount];
      setSeries(newSeries);
      setTotalCount(passCount + failCount + absentCount + notSubmittedCount);
    }
  }, [getAssessmentSectionWiseDetailsDetailsResp]);

  const chartOptions: ApexCharts.ApexOptions = useMemo(() => ({
    chart: { type: "donut" },
    labels: ["Passed", "Failed", "Absent", "Not Submitted"],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => `${totalCount}`,
            },
          },
        },
      },
    },
    colors: color,
    legend: { show: false },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)} %`,
      style: { fontSize: "10px", colors: ["#fff"] },
    },
  }), [color, totalCount]);

  return (
    <div className="card h-100">
      <div className="card-header">
        <h4 className="card-title mb-0 fs-15">Outcome</h4>
      </div>
      <div className="card-body align-content-center px-0" style={{ paddingBottom: "0.6rem" }}>
        {totalCount === 0 ? (
          <div className="h-100 w-100 text-center d-flex align-items-center justify-content-center" style={{ minHeight: "250px" }}>
            <p>No Record Found</p>
          </div>
        ) : (
          <div className="d-flex justify-content-center">
            <ReactApexChart
              type="donut"
              options={chartOptions}
              series={series}
              height={210}
              width={210}
            />
          </div>
        )}
        <div className="row d-flex align-items-center justify-content-center mt-3 px-4 mb-4 pb-2">
          {series.map((item, index) => (
            <div className="d-flex mb-3 col-6" key={index}>
              <div className="d-flex ps-2" style={{ borderLeft: `3px solid ${color[index]}` }}>
                <div>
                  <h6 className="text-muted fs-12 fw-normal">{chartOptions.labels?.[index]}</h6>
                  <div className="d-flex align-items-center">
                    <span className="fs-12 mb-0 ms-1 me-2">{item}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssessmentSectionProgress;
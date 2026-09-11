import { AlertCircleIcon } from "@hugeicons-pro/core-stroke-standard";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { UncontrolledTooltip } from "reactstrap";

const PeerAnalysis = () => {
  const series = [
    {
      name: "You",
      data: [32, 32, 14, 4, 45],
    },
    {
      name: "Average",
      data: [30, 30, 12, 6, 40],
    },
    {
      name: "Topper",
      data: [48, 48, 18, 1, 55],
    },
  ];

  const options: ApexCharts.ApexOptions = useMemo(() => {
    return {
      chart: {
        type: "bar",
        height: 292,
        stacked: true,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
          borderRadiusApplication: "end",
          borderRadiusWhenStacked: "last",
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: "10px",
                fontWeight: 600,
              },
            },
          },
        },
      },
      xaxis: {
        categories: [
          "Score",
          "Accuracy",
          "Correct",
          "In Correct",
          "Time Spent",
        ],
      },
      legend: {
        position: "bottom",
      },
      fill: {
        opacity: 1,
      },
      colors: ["#0AB39CD9", "#F27E6AD9", "#5A6BA5D9"],
    };
  }, []);

  return (
    <div className="card border shadow-none questions-card mb-0">
      <div className="card-header">
        <h4 className="card-title mb-0 fs-14">
          Peer Analysis
          <HugeiconsIcon
            icon={AlertCircleIcon}
            id="peer-analysis"
            className="ms-2"
            size={16}
          />
          <UncontrolledTooltip placement="bottom" target="peer-analysis">
            Peer wise analysis shows how well you performed with resepect to your peers
          </UncontrolledTooltip>
        </h4>
      </div>

      <div className="card-body p-0">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={292}
        />
      </div>
    </div>
  );
};

export default PeerAnalysis;

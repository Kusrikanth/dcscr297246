import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import { getAmountValueWithDecimal } from "../../../../utility/commonutility";

const TermwiseConcession = () => {
  const [activeTab, setActiveTab] = useState("students");
  const chartRef = useRef(null);

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    getConcessionDashboardDataListResp, masterFeeSettingsErrorResp
  } = useAppSelector(
    ({ instAcademics, appData, masterFeeSettings }) => ({
      masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getConcessionDashboardDataListResp: masterFeeSettings.getConcessionDashboardDataListResp
    }),
    shallowEqual
  );

  const feeConcessionDashboardRef = useRef({
    prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp
  });

  useEffect(() => {
    const { prevMasterFeeSettingsErrorResp } = feeConcessionDashboardRef.current;
    if (masterFeeSettingsErrorResp && masterFeeSettingsErrorResp !== prevMasterFeeSettingsErrorResp) {
      const { details }: any = masterFeeSettingsErrorResp;
      toast.error(details || "Something went wrong.");
    }

    feeConcessionDashboardRef.current.prevMasterFeeSettingsErrorResp = masterFeeSettingsErrorResp;
  }, [masterFeeSettingsErrorResp]);

  const chartOptions: any = {
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: { show: true },
            value: {
              show: true,
              fontSize: "16px",
              formatter: (value: number, { seriesIndex, w }: any) => {
                const seriesValue = w.config.series[seriesIndex];
  
                if (activeTab === "students" && seriesValue <= 10) return ""; // Hide if <= 10
                if (activeTab === "amount" && seriesValue <= 500000) return ""; // Hide if <= 5L
                if (activeTab === "average" && seriesValue <= 5) return ""; // Hide if <= 5%
  
                if (activeTab === "amount") return `₹${formatNumberToLakh(seriesValue)}`;
                if (activeTab === "average") return `${seriesValue.toFixed(2)}%`;
                return seriesValue;
              },
            },
            total: {
              show: true,
              color: "black",
              fontSize: "20px",
              showAlways: true,
              formatter: (w: any) => {
                const total = w.globals.seriesTotals.reduce((a: any, b: any) => a + b, 0);
                switch (activeTab) {
                  case "students":
                    return `${getConcessionDashboardDataListResp?.concessionDetails?.concessionEligibleStudentCount ?? 0}`;
                  case "average":
                    return `${(getConcessionDashboardDataListResp?.concessionDetails?.getTotalConcessionPercentage ?? 0).toFixed(2)}%`;
                  case "amount":
                    return `₹${Math.floor(getConcessionDashboardDataListResp?.concessionDetails?.totalConcessionAmount ?? 0).toLocaleString()}`;
                  default:
                    return total;
                }
              },
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        colors: ["#fff"],
      },
      formatter: (value: number, { seriesIndex, w }: any) => {
        const seriesValue = w.config.series[seriesIndex];
  
        if (activeTab === "students" && seriesValue <= 10) return ""; // Hide if <= 10
        if (activeTab === "amount" && seriesValue <= 500000) return ""; // Hide if <= 5L
        if (activeTab === "average" && seriesValue <= 5) return ""; // Hide if <= 5%
  
        if (activeTab === "amount") return `₹${formatNumberToLakh(seriesValue)}`;
        if (activeTab === "average") return `${seriesValue.toFixed(2)}%`;
        return seriesValue;
      },
    },
    tooltip: {
      y: {
        formatter: (value: number) => {
          if (activeTab === "amount") return `₹${formatNumberToLakh(value)}`;
          if (activeTab === "average") return `${value.toFixed(2)}%`;
          return value;
        },
      },
    },
    responsive: [
      {
        breakpoint: 1206,
        options: { chart: { width: 260, height: 260 } },
      },
      {
        breakpoint: 767,
        options: { chart: { width: 230, height: 230 } },
      },
    ],
    legend: { show: false },
    chart: { type: "donut" },
    labels: [],
    stroke: { curve: "smooth" },
    colors: ["#405189D9", "#0AB39CD9", "#F7B84BD9", "#F06548D9", "#212529D9", "#299CDBD9"],
  };

  const tabHandler = (tab: string) => setActiveTab(tab);

  const sortedChartData = [...getConcessionDashboardDataListResp?.termWiseConcessionDTO || []]
    .sort((a, b) => {
      const termOrder = ["Tution Fee", "Term-1", "Term-2", "Term-3"];
      return termOrder.indexOf(a.feeName) - termOrder.indexOf(b.feeName);
    });

  const labels = sortedChartData.map((item) => item.feeName);

  const seriesMap: any = {
    students: sortedChartData.map((item) => item.concessionEligibleStudentCount || 0),
    average: sortedChartData.map((item) => item.getTotalConcessionPercentage || 0),
    amount: sortedChartData.map((item) => item.totalConcessionAmount || 0),
  };

  const colorSequence = ["#405189D9", "#0AB39CD9", "#F7B84BD9", "#F06548D9", "#212529D9", "#299CDBD9"];

  const formatNumberToLakh = (num: number): string => {
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
    return num.toString();
  };
  chartOptions.labels = labels;

  return (
    <div className="tw-bg-white tw-rounded-lg tw-shadow tw-pb-4">
      <div className="tw-border-b tw-px-4 tw-py-3">
        <div className="tw-flex tw-flex-col lg:tw-flex-row tw-items-center">
          <h4 className="tw-text-lg tw-font-semibold tw-text-gray-800 tw-flex-grow">
            Term wise Concession
          </h4>

          <div className="tw-flex tw-mt-3 lg:tw-mt-0 tw-rounded-md tw-overflow-hidden">
            {["students", "average", "amount"].map((tab, index) => (
              <span
                key={tab}
                onClick={() => tabHandler(tab)}
                className={`
               tw-px-4 tw-py-2 tw-cursor-pointer 
            ${index === 0 ? 'tw-rounded-l' : ''} 
            ${index === 2 ? 'tw-rounded-r' : ''} 
            ${activeTab === tab ? 'tw-bg-blue-100 tw-text-blue-600' : 'tw-bg-gray-200 tw-text-gray-700'}
            `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="tw-p-4">
        <div className="tw-flex tw-justify-center tw-w-full tw-pb-3 tw-mb-3">
          <ReactApexChart
            options={chartOptions}
            series={seriesMap[activeTab]}
            type="donut"
            width={250}
            height={250}
            ref={chartRef}
          />
        </div>

        <div className="tw-grid tw-grid-cols-2 tw-gap-y-4 tw-gap-x-3 tw-mb-4">
          {seriesMap[activeTab]?.map((count, index) => (
            <div
              key={index}
              className="tw-flex tw-items-center tw-justify-between tw-w-full"
            >
              <div className="tw-flex tw-items-center tw-gap-2 tw-w-3/4 tw-truncate">
                <span
                  className="tw-h-4 tw-border-l-4"
                  style={{
                    borderColor:
                      colorSequence[index % colorSequence.length],
                  }}
                />
                <span
                  className="tw-text-xs tw-text-gray-500 tw-truncate"
                  title={labels[index]}
                >
                  {labels[index].length > 19
                    ? `${labels[index].slice(0, 19)}...`
                    : labels[index]}
                  :
                </span>
              </div>

              <span className="tw-text-xs tw-text-gray-500">
                {activeTab === "average"
                  ? `${Math.round(count)}%`
                  : activeTab === "amount"
                    ? formatNumberToLakh(count)
                    : count}
              </span>
            </div>
          ))}
        </div>

        <div className="tw-w-full tw-mt-3">
          <div className="tw-flex tw-justify-between tw-bg-gray-100 tw-rounded-md tw-px-6 tw-py-4">
            {[
              {
                label: "Total Fee",
                value: Math.floor(
                  getConcessionDashboardDataListResp?.concessionDetails
                    ?.totalActualAmount ?? 0
                ).toLocaleString(),
                showIcon: true,
              },
              {
                label: "Concession Fee",
                value: Math.floor(
                  getConcessionDashboardDataListResp?.concessionDetails
                    ?.totalConcessionAmount ?? 0
                ).toLocaleString(),
                showIcon: true,
              },
              {
                label: "Concession ( % )",
                value: `${(
                  Math.round(
                    (getConcessionDashboardDataListResp?.concessionDetails
                      ?.getTotalConcessionPercentage ?? 0) * 100
                  ) / 100
                ).toFixed(2)}%`,
                showIcon: false,
              },
            ].map(({ label, value, showIcon }) => (
              <div
                key={label}
                className="tw-flex tw-flex-col tw-items-center"
              >
                <h4 className="tw-text-base tw-font-normal tw-text-gray-800 tw-flex tw-items-center tw-gap-1 tw-mb-1">
                  {showIcon && (
                    <RupeeSvg width="13px" height="13px" fill="#495057" />
                  )}
                  {value}
                </h4>
                <span className="tw-text-sm tw-text-gray-500">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

  )
}

export default TermwiseConcession
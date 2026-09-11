import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

interface ClassWiseConcessionProps {
  feeType: string;
}

const ClassWiseConcession = ({ feeType }: ClassWiseConcessionProps) => {
  const [activeTab, setActiveTab] = useState("students");

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getConcessionDashboardDataListResp,
    masterFeeSettingsErrorResp,
  } = useAppSelector(
    ({ instAcademics, appData, masterFeeSettings }) => ({
      masterFeeSettingsErrorResp: masterFeeSettings.masterFeeSettingsErrorResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getConcessionDashboardDataListResp:
        masterFeeSettings.getConcessionDashboardDataListResp,
    }),
    shallowEqual
  );

  const feeConcessionDashboardRef = useRef({
    prevMasterFeeSettingsErrorResp: masterFeeSettingsErrorResp,
  });

  useEffect(() => {
    const { prevMasterFeeSettingsErrorResp } =
      feeConcessionDashboardRef.current;
    if (
      masterFeeSettingsErrorResp &&
      masterFeeSettingsErrorResp !== prevMasterFeeSettingsErrorResp
    ) {
      const { details }: any = masterFeeSettingsErrorResp;
      toast.error(details || "Something went wrong.");
    }
    feeConcessionDashboardRef.current.prevMasterFeeSettingsErrorResp =
      masterFeeSettingsErrorResp;
  }, [masterFeeSettingsErrorResp]);

  const generateChartData = (activeTab: string) => {
    const classWiseConcessionDTO =
      getConcessionDashboardDataListResp?.classWiseConcessionDTO || {};

    const xaxisCategories: string[] = [];
    const academicsData: number[] = [];
    const totalData: number[] = [];
    const transportData: number[] = [];
    const selectedFeeType = feeType;

    const feeTypes = selectedFeeType
      ? [selectedFeeType]
      : Object.keys(classWiseConcessionDTO);
    feeTypes.forEach((feeType) => {
      const feeData = classWiseConcessionDTO[feeType] || {};
      Object.keys(feeData).forEach((classId) => {
        const feeClass = feeData[classId][0];

        if (!xaxisCategories.includes(feeClass.classShortName)) {
          xaxisCategories.push(feeClass.classShortName);
        }
        if (feeType === "FEE STRUCTURE") {
          if (activeTab === "students") {
            academicsData.push(feeClass.concessionEligibleStudentCount);
          } else if (activeTab === "average") {
            academicsData.push(feeClass.getTotalConcessionPercentage);
          } else if (activeTab === "amount") {
            academicsData.push(feeClass.totalConcessionAmount);
          }
        } else if (feeType === "TRANSPORT FEE") {
          if (activeTab === "students") {
            transportData.push(feeClass.concessionEligibleStudentCount);
          } else if (activeTab === "average") {
            transportData.push(feeClass.getTotalConcessionPercentage);
          } else if (activeTab === "amount") {
            transportData.push(feeClass.totalConcessionAmount);
          }
        }
      });
    });
    if (!selectedFeeType) {
      xaxisCategories.forEach((_, index) => {
        const academicValue = academicsData[index] || 0;
        const transportValue = transportData[index] || 0;
        totalData[index] = academicValue + transportValue;
      });
    }
    const series = [
      { name: "Academics", data: academicsData, color: "#f06548" },
    ];
    if (!selectedFeeType) {
      series.push({ name: "Total", data: totalData, color: "#405189" });
    }
    series.push({ name: "Transport", data: transportData, color: "#0AB39C" });
    return {
      xaxisCategories,
      series,
    };
  };

  const { xaxisCategories, series } = generateChartData(activeTab);

  const chartOptions: any = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: xaxisCategories,
    },
    yaxis: {
      title: {
        text: activeTab === "students" ? "Count" : activeTab === "average" ? "Percentage" : "Amount",
      },
      labels: {
        formatter: function (val: number) {
          if (activeTab === "students") {
            return Math.round(val);
          } else if (activeTab === "average") {
            return `${Math.round(val)}%`;
          } else if (activeTab === "amount") {
            return `${(val / 100000).toFixed(0)}L`;
          }
          return val;
        },
      },
    },
    colors: ["#F06548", "#405189", "#0AB39C"],
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          if (activeTab === "students") {
            return Math.round(val);
          } else if (activeTab === "average") {
            return `${Math.round(val)}%`;
          } else if (activeTab === "amount") {
            return `${(val / 100000).toFixed(2)}L`;
          }
          return val;
        },
      },
    },
  };

  const tabHandler = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="tw-bg-white tw-rounded-lg tw-shadow tw-mb-4 fee_summary_wapper">
        {/* Card Header */}
        <div className="tw-px-4 tw-pt-4 tw-pb-2 tw-border-b">
          <div className="tw-flex tw-items-center tw-justify-between tw-flex-wrap">
            <h4 className="tw-text-lg tw-font-semibold tw-mb-3 lg:tw-mb-0">
              Class wise concession
            </h4>

            {/* Tabs */}
            <div className="tw-flex tw-gap-1 tw-mt-3 lg:tw-mt-0">
              {["students", "average", "amount"].map((tab) => {
                const isActive = activeTab === tab;
                const colors = {
                  students: "#3577F1",
                  average: "#3577F1",
                  amount: "#3577F1",
                };
                const bgColor = isActive ? `${colors[tab]}19` : "#40518919";
                const textColor = isActive ? colors[tab] : "#405189";

                return (
                  <span
                    key={tab}
                    className={`tw-px-3 tw-py-1 tw-cursor-pointer ${tab === "students" ? "tw-rounded-l-md" : ""} ${tab === "amount" ? "tw-rounded-r-md" : ""
                      }`}
                    style={{
                      backgroundColor: bgColor,
                      color: textColor,
                    }}
                    onClick={() => tabHandler(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="tw-px-4 tw-pt-2 tw-pb-4 tw-overflow-x-auto">
          <ReactApexChart
            options={chartOptions}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
    </>
  );
};

export default ClassWiseConcession;

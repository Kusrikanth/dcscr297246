import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { toast } from "react-toastify";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { formatText, getFeeAmountDisplayValue } from "../../../../utility/commonutility";

export default function ConcessionChart({ feeType, reportData }: any) {

  const [activeTab, setActiveTab] = useState("students");

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

  const getFilteredChartData = () => {
    if (!getConcessionDashboardDataListResp?.feeConcessionTypeDetails) {
      return [];
    }

    if (feeType === "FEE STRUCTURE" || feeType === "TRANSPORT FEE") {
      const feeConcessionDetails = getConcessionDashboardDataListResp.feeConcessionTypeDetails;
      return Object.keys(feeConcessionDetails).map((key) => feeConcessionDetails[key]).flat();
    } else {
      return getConcessionDashboardDataListResp.feeConcessionTypeDetails.Total || [];
    }
  };

  const chartData = getFilteredChartData();
  const studentCountSeries = chartData.map((item: any) => item.studentCount);

  const amountCountSeries = chartData.map((item: any) => Math.trunc(item.concessionAmount));

  const totalConcessionAmount =
    feeType === "FEE STRUCTURE" || feeType === "TRANSPORT FEE"
      ? chartData.reduce((sum: any, item: any) => sum + (item.concessionAmount || 0), 0)
      : getConcessionDashboardDataListResp?.concessionDetails?.totalConcessionAmount || 0;

  const averageCountSeries = chartData.map((item: any) => {
    const averagePercentage = totalConcessionAmount
      ? (item.concessionAmount / totalConcessionAmount) * 100
      : 0;
    return averagePercentage;
  });

  const categories = useMemo(() => {
    const totalList =
      getConcessionDashboardDataListResp?.feeConcessionTypeDetails?.Total || [];
    const concessionTypes = totalList.map((item: { concessionType: string }) =>
      formatText(item.concessionType)
    );
    return concessionTypes;
  }, [getConcessionDashboardDataListResp]);
  
  const createChartOptions = (title: string, valueFormatter: (val: number) => string): ApexCharts.ApexOptions => {
    const isStudentsTab = activeTab === "students";
    const isAverageTab = activeTab === "average";
    const isAmountTab = activeTab === "amount";
  
      let maxSeriesValue = 0;
      if (isStudentsTab) {
          maxSeriesValue = Math.max(...studentCountSeries, 0);
      } else if (isAverageTab) {
          maxSeriesValue = Math.max(...averageCountSeries, 0);
      } else if (isAmountTab) {
          maxSeriesValue = Math.max(...amountCountSeries, 0);
      }

      let maxXAxisValue = maxSeriesValue;
      if (isAmountTab) {
          const scaledValue = Math.ceil(maxSeriesValue / 100000);
          const buffer = 25;
          maxXAxisValue = (scaledValue + buffer) * 100000;
      } else if (isStudentsTab) {
          maxXAxisValue += 200;
      } else if (isAverageTab) {
          maxXAxisValue = Math.ceil(maxSeriesValue);
          maxXAxisValue += 20;
      }

      const formatter = (val: number): string => {
        if (isAverageTab) {
          return `${val.toFixed(2)}%`;
        } else if (isAmountTab) {
          if (val >= 10000000) {
            return `${(val / 10000000).toFixed(2)} Cr`;
          } else if (val >= 100000) {
            return `${(val / 100000).toFixed(1)} L`;
          } else if (val >= 1000) {
            return `${(val / 1000).toFixed(1)} K`;
          } else {
            return `${val.toLocaleString("en-US")}`;
          }
        }
        return valueFormatter(val);
      };      
    return {
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          distributed: true,
          dataLabels: { position: "top" },
        },
      },
      chart: {
        type: "bar",
        height: 380,
        toolbar: { show: false },
      },
      colors: [
        "#405189D9",
        "#0AB39CD9",
        "#F7B84BD9",
        "#F06548D9",
        "#212529D9",
        "#299CDBD9",
      ],
      dataLabels: {
        enabled: true,
        offsetX: 32,
        formatter: function (val: number) {
          return formatter(val);
        },
        style: {
          fontSize: "14px",
          fontWeight: 400,
          colors: ["#adb5bd"],
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return formatter(val);
          },
          title: {
            formatter: function () {
              return "";
            },
          },
        },
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: categories,
        max: maxXAxisValue,
        min: 0,
        tickAmount: 5,
        labels: {
          formatter: function (value: string) {
            const numericValue = parseFloat(value);
            if (isAmountTab) {
              return getFeeAmountDisplayValue(numericValue);
            } else if (isAverageTab) {
              return `${numericValue}%`;
            }
            return `${numericValue}`;
          },
        },
        tickPlacement: "on",
      },
      responsive: [
        {
          breakpoint: 1206,
          options: {
            dataLabels: {
              enabled: false,
            },
          },
        },
        {
          breakpoint: 991,
          options: {
            dataLabels: {
              enabled: true,
            },
          },
        },
      ],
    };
  };
  
  const options1: ApexCharts.ApexOptions = createChartOptions(
    "Students Benefited for Each Concession Type",
    (val: number) => `₹ ${val.toLocaleString()}`
  );
  
  const options2: ApexCharts.ApexOptions = createChartOptions(
    "Amount for Each Concession Type",
    (val: number) => `${val}`
  );
  
  const options3: ApexCharts.ApexOptions = createChartOptions(
    "Students Benefited for Each Concession Type",
    (val: number) => val.toString()
  );
  
  const tabHandler = (tab: string) => {
    setActiveTab(tab);
  };

  const titles = [
    {
      titleId: "students",
      titleValue: "Students Benefited for Each Concession Type",
    },
    { titleId: "average", titleValue: "Concession % by Concession Type" },
    {
      titleId: "amount",
      titleValue: "Concession Amount by Concession Type (₹)",
    },
  ];

  const activeTitle = titles?.find((title) => title.titleId === activeTab);

  return (
    <div className="tw-bg-white tw-rounded-lg tw-shadow">
      {/* Card Header */}
      <div className="tw-flex tw-flex-col lg:tw-flex-row tw-items-center tw-justify-between tw-py-3 tw-px-4 tw-border-b">
        <h4 className="tw-text-lg tw-font-semibold tw-text-gray-900 mb-3 lg:mb-0">
          Concession Type
        </h4>

        <div className="tw-flex tw-rounded tw-overflow-hidden">
          {['students', 'average', 'amount'].map((tab, idx) => (
            <span
              key={tab}
              className={`
            tw-px-4 tw-py-2 tw-cursor-pointer 
            ${idx === 0 ? 'tw-rounded-l' : ''} 
            ${idx === 2 ? 'tw-rounded-r' : ''} 
            ${activeTab === tab ? 'tw-bg-blue-100 tw-text-blue-600' : 'tw-bg-gray-200 tw-text-gray-700'}
          `}
              onClick={() => tabHandler(tab)}
            >
              {tab === 'students' ? 'Students' : tab === 'average' ? 'Average' : 'Amount'}
            </span>
          ))}
        </div>
      </div>

      {/* Card Body */}
      <div className="tw-p-4 tw-pb-2">
        <div className="tw-text-gray-500 tw-text-sm tw-mb-2">{activeTitle?.titleValue}</div>
        <div className="tw-p-2">
          {activeTab === 'students' && (
            <ReactApexChart
              options={options2}
              series={[{ name: 'Students', data: studentCountSeries }]}
              type="bar"
              height={500}
            />
          )}
          {activeTab === 'average' && (
            <ReactApexChart
              options={options1}
              series={[{ name: 'Average', data: averageCountSeries }]}
              type="bar"
              height={500}
            />
          )}
          {activeTab === 'amount' && (
            <ReactApexChart
              options={options3}
              series={[{ name: 'Amount', data: amountCountSeries }]}
              type="bar"
              height={500}
            />
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getFeeDashboardPaymentModeAct } from "../../../../store/fee/feereport/feereportactions";
import { colorsList } from "./helper";
import { formatNumber } from "../helper";

type ITabDataId = "DAYS" | "WEEKS" | "MONTHS"

type ITabData = {
  id: ITabDataId;
  tabName: string;
  className: string;
}

const tabData: Array<ITabData> = [
  {
    id: "DAYS",
    tabName: "Days",
    className: "p-2 rounded-start cursor-pointer",
  },
  {
    id: "WEEKS",
    tabName: "Weeks",
    className: "p-2 cursor-pointer",
  },
  {
    id: "MONTHS",
    tabName: "Months",
    className: "p-2 rounded-end cursor-pointer",
  }
]

const PaymentMode = () => {
  const dispatch = useAppDispatch();
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<ITabDataId>("DAYS");

  const {
    academicYearListResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    getFeeDashboardPaymentModeResp } =
    useAppSelector(({ appData, instAcademics, feeReport, branchAcademics }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getFeeDashboardPaymentModeResp: feeReport.getFeeDashboardPaymentModeResp,
    }), shallowEqual);

  useEffect(() => {
    if (branchId) {
      getPaymentModeApiCall("DAYS")
    }
  }, [branchId])

  useEffect(() => {
    if (Array.isArray(getFeeDashboardPaymentModeResp) && getFeeDashboardPaymentModeResp.length > 0) {
      const data = getFeeDashboardPaymentModeResp.map((item:any)=>({
        paymentMode : item?.paymentMode,
        sumOfAmountsPaid : item?.sumOfPaidAmounts,
      }))?.filter((item: any) => item.paymentMode)
      setChartData(data);
    } else {
      setChartData([]);
    }
  }, [getFeeDashboardPaymentModeResp])

  const getPaymentModeApiCall = (dateType: ITabDataId) => {
    dispatch(getFeeDashboardPaymentModeAct(generateActionPayload("fee_dashboard_payment_mode", undefined, { branchId, dateType })))
  }

  const series = useMemo(() => [
    {
      name: "Amount Paid",
      data: chartData.map((item: any) => item.sumOfAmountsPaid),
    },
  ], [chartData, activeTab])

  const maxValue = Math.max(...chartData.map((item: any) => item.sumOfAmountsPaid));
  const defaultBarHeight = 30; 
  const maxVisibleBars = 5; 
  const calculatedBarHeight = chartData.length > maxVisibleBars ? defaultBarHeight - (chartData.length - maxVisibleBars) * 1 : defaultBarHeight; 
  const minBarHeight = 5; 

  const total = useMemo(() => {
    return getFeeDashboardPaymentModeResp?.reduce((acc:any,cur:any) => acc + cur.sumOfPaidAmounts ,0) || 0;
    },[activeTab,getFeeDashboardPaymentModeResp])

  const options: ApexCharts.ApexOptions = useMemo(() => {
    return {
      chart: {
        type: "bar",
        toolbar: {
          show: false,
        },
        stacked: false,
        offsetX: -24,
        height: Math.max(chartData.length * calculatedBarHeight, 380),
      },
      plotOptions: {
        bar: {
          barHeight: `${Math.max(minBarHeight, calculatedBarHeight)}px`,
          columnWidth: "30px",
          distributed: true,
          horizontal: true,
          dataLabels: {
            position: "bottom",
          },
        },
      },
      colors: colorsList,
      dataLabels: {
        enabled: true,
        textAnchor: "start",
        style: {
          fontSize: '12px',
          colors: chartData.map((value: any) => {
            const chartDataItem = value as any;
            return chartDataItem.sumOfAmountsPaid < maxValue * 0.2 ? '#000000' : '#FFFFFF';
          }),
        },
        formatter: function (val: any,opt:any) {
          const label = opt.w.globals.labels[opt.dataPointIndex];
          const labelPercentage = ((+val / +total) * 100)
            return `${label} : ₹ ${formatNumber(val)} (${labelPercentage.toFixed(2)}%)`
        },
        offsetX: 0,
        dropShadow: {
          enabled: false,
        },
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"],
      },
      xaxis: {
        position: "bottom",
        axisBorder: {
          show: true,
        },
        title: {
          text: "Class",
          offsetX: 0,
          offsetY: 200,
        },
        labels: {
          show: true,
          formatter: function (val: string) {
            return `₹ ${formatNumber(+val)}`
          },
        },
        categories: chartData.map((item: any) => item?.paymentMode?.split("_")?.join(" ")),
      },
      yaxis: {
        labels: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function (val: number) {
            return `₹ ${formatNumber(val)}`
          },
        },
      },
      responsive: [
        {
          breakpoint: 1200,
          options: {
            dataLabels: {
              enabled: true,
            },
          },
        },
        {
          breakpoint: 992,
          options: {
            dataLabels: {
              enabled: true,
              offsetX: 10,        
            },
          },
        },
      ],
    }
  }, [chartData, activeTab])

  const tabHandler = (tab: ITabDataId) => {
    setActiveTab(tab);
    getPaymentModeApiCall(tab)
  };

  const labelNames = useMemo(() => {
    return chartData.map((item: any, index: number) => ({
      labelName: item?.paymentMode?.split("_")?.join(" "),
      seriesData: item?.sumOfAmountsPaid,
      colorName: colorsList[index],
    }))
  }, [activeTab, chartData])

  return (
    <div className="tw-bg-white tw-rounded-md tw-shadow tw-h-full term_wise_fee_wrapper payment-mode-card">
      {/* Header */}
      <div className="tw-flex tw-items-center tw-px-4 tw-py-3 tw-border-b">
        <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
          Payment Mode
        </h4>

        <div className="tw-flex tw-items-center tw-ml-auto tw-mt-2 md:tw-mt-0">
          <div className="tw-flex tw-items-center tw-pr-3 ">
            <span
              className="tw-p-2 tw-rounded-l tw-mr-4"
              style={{ backgroundColor: "#3577F119", color: "#3577F1" }}
            >
              Last 12
            </span>

            {tabData.map((item) => (
              <span
                key={item.id}
                className={item.className}
                style={{
                  backgroundColor:
                    activeTab === item.id ? "#3577F119" : "#40518919",
                  color: activeTab === item.id ? "#3577F1" : "#405189",
                }}
                onClick={() => tabHandler(item.id)}
              >
                {item.tabName}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="tw-pt-0 tw-pb-0 tw-px-4">
        <div className="tw-grid tw-grid-cols-12">
          {/* Chart */}
          <div className="tw-col-span-12">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={Math.max(chartData.length * calculatedBarHeight, 400)}
            />
          </div>

          {/* Legend (hidden on purpose, kept for logic parity) */}
          <div className="tw-col-span-4 tw-hidden lg:tw-flex tw-flex-col tw-mt-4 tw-pt-3 tw-items-end tw-pl-0">
            <div className="tw-hidden">
              {labelNames.map((label: any, index: number) => (
                <div
                  key={`${label?.labelName}-${index}`}
                  className="tw-mb-2 tw-pb-1 tw-flex tw-items-center"
                >
                  <div
                    className="tw-mr-3"
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: label.colorName,
                      borderRadius: "2px",
                      flexShrink: 0,
                    }}
                  />
                  <p className="tw-text-muted tw-text-[12px] tw-mb-0">
                    {`${label?.labelName} : ₹ ${formatNumber(
                      label.seriesData
                    )}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMode;

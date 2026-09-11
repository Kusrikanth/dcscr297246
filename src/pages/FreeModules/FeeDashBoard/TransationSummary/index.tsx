import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getFeeDashboardTransactionSummaryAct } from "../../../../store/fee/feereport/feereportactions";
import { formatNumber } from "../helper";
import { generateWeekLabel, getDdMmYyyyFormat } from "../../../../utility/dateutility";

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
    className: "tw-p-2 tw-rounded-start tw-cursor-pointer",
  },
  {
    id: "WEEKS",
    tabName: "Weeks",
    className: "tw-p-2 tw-cursor-pointer",
  },
  {
    id: "MONTHS",
    tabName: "Months",
    className: "tw-p-2 tw-rounded-end tw-cursor-pointer",
  }
]

const TransationSummary = () => {
  const dispatch = useAppDispatch();
  const [chartData, setChartData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<ITabDataId>("DAYS");

  const {
    academicYearListResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    getFeeDashboardTransactionSummaryResp } =
    useAppSelector(({ appData, instAcademics, feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getFeeDashboardTransactionSummaryResp: feeReport.getFeeDashboardTransactionSummaryResp,
    }), shallowEqual);

  useEffect(() => {
    if (Array.isArray(academicYearListResp?.data)) {
      const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      getTransactionSummaryApiCall("DAYS", academicYearId)
    }
  }, [academicYearListResp])

  useEffect(() => {
    if (getFeeDashboardTransactionSummaryResp && Array.isArray(getFeeDashboardTransactionSummaryResp)) {
      const modifiedData = getFeeDashboardTransactionSummaryResp.reduce((acc: any[], curr: any) => {
        // Creating label
        const label = activeTab === "DAYS" ? getDdMmYyyyFormat(curr?.transactionDate) : activeTab === "WEEKS" ? generateWeekLabel(curr?.weekStartDate, curr?.weekEndDate) : curr?.monthName?.slice(0, 3) + "-" + String(curr?.year).slice(-2);
        // Find data with existing labels
        const findIndex = acc?.findIndex((item: any) => item?.label === label);
        // Differentiting Academic Fee and Transport Fee
        const name = curr?.feeType === "ACADEMIC FEE" ? "academicFee" : curr?.feeType === "TRANSPORT FEE" ? "transportFee" : "otherFee";
        if (findIndex > -1) {
          acc[findIndex][name] = curr?.totalAmount
        } else {
          acc.push({
            label,
            [name]: curr?.totalAmount,
            studentCount: curr?.studentCount,
          })
        }
        return acc
      }, []).map((item: any) => ({
        ...item,
        academicFee: item?.academicFee || 0,
        transportFee: item?.transportFee || 0,
        totalAmount: (item?.academicFee || 0) + (item?.transportFee || 0) + (item?.otherFee || 0)
      }))
      setChartData(modifiedData)
    }
  }, [getFeeDashboardTransactionSummaryResp])

  const getTransactionSummaryApiCall = (type: ITabDataId, yearId?: string) => {
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
    const payload = {
      branchId, academicYearId: yearId || academicYearId, type
    }
    dispatch(getFeeDashboardTransactionSummaryAct(generateActionPayload("fee_dashboard_transaction_summary", undefined, payload)))
  }

  const series = useMemo(() => [
    {
      id: "academic-fee",
      name: "Academic Fee",
      type: "column",
      data: chartData.map((item) => item?.academicFee),
      color: "#0AB39C",
    },
    {
      id: "transport-fee",
      name: "Transport Fee",
      type: "column",
      data: chartData.map((item) => item?.transportFee),
      color: "#405189",
    },
    {
      id: "total-fee",
      name: "Total Fee",
      type: "area",
      data: chartData.map((item) => item?.totalAmount),
      color: "#FAC364",
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: ["#CED4DC"],
          inverseColors: false,
          opacityFrom: 0.6,
          opacityTo: 0.8,
          stops: [0, 100],
        },
      },
    },
  ], [chartData])


  const options: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      height: 350,
      type: "line",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: chartData.length < 5 ? "30px" : "50%",
        barHeight: "70%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [0, 0, 1],
      dashArray: [0, 0, 3],
      curve: "smooth",
    },
    fill: {
      opacity: [1, 1, 0.3],
      gradient: {
        opacityFrom: 0.6,
        opacityTo: 0.8,
      },
    },
    markers: {
      size: [0, 0, 4],
      // strokeWidth: 2,
      // shape: "line",
      hover: {
        size: 4,
      },
    },

    xaxis: {
      categories: chartData.map((item) => item?.label),
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 15,
        left: 10,
      },
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        tickAmount: 6,
        labels: {
          show: true,
          formatter: (value: number) => {
            return `₹ ${formatNumber(value)}`;
          },
        },
      },
    ],
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: -5,
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
  }), [chartData])

  const tabHandler = (tab: ITabDataId) => {
    setActiveTab(tab);
    getTransactionSummaryApiCall(tab)
  };
  const totals = useMemo(() => chartData.reduce(
    (acc, curr) => {
      acc.totalFeeCollected += curr?.totalAmount || 0;
      acc.totalAcademicFee += curr?.academicFee || 0;
      acc.totalTransportFee += curr?.transportFee || 0;
      acc.studentCount = curr?.studentCount || 0;
      return acc;
    },
    { totalFeeCollected: 0, totalAcademicFee: 0, totalTransportFee: 0, studentCount: 0 }
  ), [chartData]);

  const totalFeeCollected = formatNumber(totals.totalFeeCollected);
  const totalAcademicFee = formatNumber(totals.totalAcademicFee);
  const totalTransportFee = formatNumber(totals.totalTransportFee);
  const studentCount = formatNumber(totals.studentCount);

  return (
    <div className="tw-bg-white tw-rounded-md tw-shadow transaction-apexchart-area_wrapper">
      <div className="tw-p-0 tw-border-b-0">
        <div className="tw-grid tw-grid-cols-12 tw-items-center tw-p-3">
          <div className="tw-col-span-12 md:tw-col-span-6">
            <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
              Transaction Summary
            </h4>
          </div>

          <div className="tw-col-span-12 md:tw-col-span-6 tw-mt-2 md:tw-mt-0 tw-flex tw-justify-end">
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

        <div className="tw-grid tw-grid-cols-12 tw-text-center tw-px-0">
          <div className="tw-col-span-6 sm:tw-col-span-3">
            <div className="tw-p-3 tw-border tw-border-dashed tw-border-l-0">
              <h5 className="tw-mb-1 tw-text-green-600">
                <span>{totalFeeCollected}</span>
              </h5>
              <p className="tw-text-muted tw-mb-0">Total Fee Collected</p>
            </div>
          </div>

          <div className="tw-col-span-6 sm:tw-col-span-3">
            <div className="tw-p-3 tw-border tw-border-dashed tw-border-l-0">
              <h5 className="tw-mb-1">
                <span>{totalAcademicFee}</span>
              </h5>
              <p className="tw-text-muted tw-mb-0">Academic Fee</p>
            </div>
          </div>

          <div className="tw-col-span-6 sm:tw-col-span-3">
            <div className="tw-p-3 tw-border tw-border-dashed tw-border-l-0">
              <h5 className="tw-mb-1">
                <span>{totalTransportFee}</span>
              </h5>
              <p className="tw-text-muted tw-mb-0">Transportation Fee</p>
            </div>
          </div>

          <div className="tw-col-span-6 sm:tw-col-span-3">
            <div className="tw-p-3 tw-border tw-border-dashed tw-border-l-0">
              <h5 className="tw-mb-1">
                <span>{studentCount}</span>
              </h5>
              <p className="tw-text-muted tw-mb-0">
                Number of Students Paid
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="tw-p-4">
        <div className="transation-summary-chart-container">
          <div className="transation-summary-chart">
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={350}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransationSummary;

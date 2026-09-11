import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { getNetPaidFeeByBranchAct } from "../../../store/fee/feereport/feereportactions";
import { formatNumber } from "../../../utility/commonutility";
import { Current_Date, getPreviousDateFromToday } from "../../../utility/dateutility";
import { generateActionPayload } from "../../../utility/reduxutility";
import { CustomDatePicker } from "../../DashBoardBranchSummary/CustomDatePicker";

const initialValues = {
  startDate: getPreviousDateFromToday(6),
  endDate: Current_Date,
}

const NetPaidByBranch = () => {

  const dispatch = useAppDispatch();
  const [filterState, setFilterState] = useState(initialValues);
  const [chartData, setChartData] = useState<any[]>([]);

  const {
    academicYearListResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId, getNetPaidFeeByBranchResp, } =
    useAppSelector(({ appData, instAcademics, feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getNetPaidFeeByBranchResp: feeReport.getNetPaidFeeByBranchResp,
    }), shallowEqual);

  const getTransactionSummaryApiCall = (otherProps?: any) => {
    const payload = {
      ...filterState, instituteId, ...otherProps
    }
    dispatch(getNetPaidFeeByBranchAct(generateActionPayload("net_paid_fee_by_branch", undefined, payload)))
  }

  useEffect(() => {
    if (instituteId) {
      getTransactionSummaryApiCall()
    }
  }, [instituteId])

  useEffect(() => {
    if (Array.isArray(getNetPaidFeeByBranchResp?.branchWiseNetPaidDTOS) && getNetPaidFeeByBranchResp?.branchWiseNetPaidDTOS?.length > 0) {
      const modifiedData = getNetPaidFeeByBranchResp?.branchWiseNetPaidDTOS?.reduce((acc: any[], curr: any) => {
        const label = curr?.branchName
        const findIndex = acc?.findIndex((item: any) => item?.label === label);
        const name = curr?.feeType === "ACADEMIC FEE" ? "academicFee" : curr?.feeType === "TRANSPORT FEE" ? "transportFee" : "otherFee";
        if (findIndex > -1) {
          acc[findIndex][name] = curr?.totalAmount
        } else {
          acc.push({
            label,
            [name]: curr?.totalAmount,
          })
        }
        return acc
      }, [])?.map((item: any) => ({
        ...item,
        academicFee: item?.academicFee || 0,
        transportFee: item?.transportFee || 0,
        totalAmount: (item?.academicFee || 0) + (item?.transportFee || 0) + (item?.otherFee || 0)
      }))
      setChartData(modifiedData)
    }
    else if (Array.isArray(getNetPaidFeeByBranchResp?.branchWiseNetPaidDTOS) && getNetPaidFeeByBranchResp?.branchWiseNetPaidDTOS?.length === 0) {
      setChartData([])
    }
  }, [getNetPaidFeeByBranchResp])

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
        columnWidth: chartData.length <= 5 ? "30px" : "50%",
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
        title: {
          text: "Sum of Net amount Paid (₹)",
          style: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "#495057",
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

  const handleDateChange = ({ startDate, endDate }: any) => {
    if (startDate && endDate) {
      setFilterState((prev) => ({ ...prev, startDate, endDate }));
      getTransactionSummaryApiCall({ startDate, endDate });
    }
  }

  const totals = useMemo(() => chartData.reduce(
    (acc, curr) => {
      acc.totalAcademicFee += curr?.academicFee || 0;
      acc.totalTransportFee += curr?.transportFee || 0;
      acc.totalOtherFee += curr?.otherFee || 0;
      acc.totalFee += (curr?.academicFee || 0) + (curr?.transportFee || 0) + (curr?.otherFee || 0)
      return acc;
    },
    { totalOtherFee: 0, totalAcademicFee: 0, totalTransportFee: 0, totalFee: 0 }
  ), [chartData]);

  const totalOtherFee = formatNumber(totals.totalOtherFee);
  const totalAcademicFee = formatNumber(totals.totalAcademicFee);
  const totalTransportFee = formatNumber(totals.totalTransportFee);
  const totalFee = formatNumber(totals.totalFee);

  return (
    <div className="tw-rounded-2xl tw-border tw-bg-white tw-shadow-sm transaction-apexchart-area_wrapper">
      <div className="tw-border-b-0 tw-p-0">
        <div className="tw-flex tw-flex-col lg:tw-flex-row tw-gap-y-3 tw-items-start lg:tw-items-center tw-p-3">
          <div className="tw-w-full lg:tw-w-4/12">
            <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 mb-0 tw-flex-grow">Fee Collection by Branch</h4>
          </div>
          <div className="tw-w-full lg:tw-w-8/12 tw-ml-auto">
            <div className="tw-flex tw-justify-end">
              <div className="tw-w-6/12 xl:tw-w-4/12">
                <CustomDatePicker
                  name="dateRange"
                  startDate={filterState.startDate}
                  endDate={filterState.endDate}
                  onChange={handleDateChange}
                  placeholder="Select a Date Range"
                  monthsShown={2}
                  formgroupClassName="mb-0"
                  labelText="Date Range"
                  floatingLabel
                  placement="bottom-start"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="status-card-container tw-px-0 tw-text-center tw-grid tw-grid-cols-2 md:tw-grid-cols-3 xl:tw-grid-cols-5">
          <div className="card-container !tw-p-0">
            <div className="tw-p-3 tw-border tw-border-dashed tw-border-l-0">
              <h5 className="tw-mb-1">
                ₹<span className="counter-value tw-ml-1" data-target="9851">{totalAcademicFee}</span>
              </h5>
              <p className="tw-text-gray-500 tw-mb-0">Academic Fee</p>
            </div>
          </div>

          <div className="card-container !tw-p-0">
            <div className="tw-p-3 tw-border tw-border-dashed tw-border-l-0">
              <h5 className="tw-mb-1">
                ₹<span className="counter-value tw-ml-1" data-target="1026">{totalTransportFee}</span>
              </h5>
              <p className="tw-text-gray-500 tw-mb-0">Transport Fee</p>
            </div>
          </div>

          <div className="card-container !tw-p-0">
            <div className="tw-p-3 tw-border tw-border-dashed tw-border-l-0">
              <h5 className="tw-mb-1">
                ₹<span className="counter-value tw-ml-1" data-target="228.89">{totalOtherFee}</span>
              </h5>
              <p className="tw-text-gray-500 tw-mb-0">Other Fee</p>
            </div>
          </div>

          <div className="card-container !tw-p-0">
            <div className="tw-p-3 tw-border tw-border-dashed tw-border-l-0">
              <h5 className="tw-mb-1">
                <span className="counter-value tw-ml-1" data-target="228.89">₹{totalFee}</span>
              </h5>
              <p className="tw-text-gray-500 tw-mb-0">Total Fee</p>
            </div>
          </div>

          <div className="card-container !tw-p-0">
            <div className="tw-p-3 tw-border tw-border-dashed tw-border-l-0 lg:tw-border-r-0">
              <h5 className="tw-mb-1">
                <span className="counter-value tw-ml-1" data-target="228.89">{getNetPaidFeeByBranchResp?.paidStudentsCount || 0}</span>
              </h5>
              <p className="tw-text-gray-500 tw-mb-0">Number of Students Paid</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body tw-p-4">
        <div className="transation-summary-chart-container">
          <div className="transation-summary-chart">
            <ReactApexChart options={options} series={series} type="bar" height={350} />
          </div>
        </div>
      </div>
    </div>

    // <div className="card transaction-apexchart-area_wrapper">
    //   <div className="card-header p-0" style={{ borderBottom: "0" }}>
    //     <div className="row align-items-center p-3 gy-3">
    //       <div className="col-12 col-lg-4">
    //         <h4 className="card-title mb-0 flex-grow-1">Fee Collection by Branch</h4>
    //       </div>
    //       <div className="col-12 col-lg-8 ms-auto">
    //         <div className="row justify-content-end">
    //           <div className="col-6 col-xl-4">
    //             <CustomDatePicker
    //               name="dateRange"
    //               startDate={filterState.startDate}
    //               endDate={filterState.endDate}
    //               onChange={handleDateChange}
    //               placeholder="Select a Date Range"
    //               monthsShown={2}
    //               formgroupClassName="mb-0"
    //               labelText="Date Range"
    //               floatingLabel
    //               placement="bottom-start"
    //             ></CustomDatePicker>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //     <div className="status-card-container g-0 text-center px-0">
    //       <div className="card-container p-0">
    //         <div className="p-3 border border-dashed border-start-0">
    //           <h5 className="mb-1">
    //             ₹
    //             <span className="counter-value ms-1" data-target="9851">
    //               {totalAcademicFee}
    //             </span>
    //           </h5>
    //           <p className="text-muted mb-0">Academic Fee</p>
    //         </div>
    //       </div>

    //       <div className="card-container p-0">
    //         <div className="p-3 border border-dashed border-start-0">
    //           <h5 className="mb-1">
    //             ₹
    //             <span className="counter-value ms-1" data-target="1026">
    //               {totalTransportFee}
    //             </span>
    //           </h5>
    //           <p className="text-muted mb-0">Transport Fee</p>
    //         </div>
    //       </div>

    //       <div className="card-container p-0">
    //         <div className="p-3 border border-dashed border-start-0">
    //           <h5 className="mb-1">
    //             ₹
    //             <span className="counter-value ms-1" data-target="228.89">
    //               {totalOtherFee}
    //             </span>
    //           </h5>
    //           <p className="text-muted mb-0">Other Fee</p>
    //         </div>
    //       </div>

    //       <div className="card-container p-0">
    //         <div className="p-3 border border-dashed border-start-0">
    //           <h5 className="mb-1">
    //             <span className="counter-value ms-1" data-target="228.89">
    //             ₹
    //               {totalFee}
    //             </span>
    //           </h5>
    //           <p className="text-muted mb-0">Total Fee</p>
    //         </div>
    //       </div>

    //       <div className="card-container p-0">
    //         <div className="p-3 border border-dashed border-start-0 border-end-0">
    //           <h5 className="mb-1">
    //             <span className="counter-value ms-1" data-target="228.89">
    //               {getNetPaidFeeByBranchResp?.paidStudentsCount || 0}
    //             </span>
    //           </h5>
    //           <p className="text-muted mb-0">Number of Students Paid</p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="card-body">
    //     <div className="transation-summary-chart-container">
    //       <div className="transation-summary-chart">
    //         <ReactApexChart
    //           options={options}
    //           series={series}
    //           type="bar"
    //           height={350}
    //         />
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default NetPaidByBranch;

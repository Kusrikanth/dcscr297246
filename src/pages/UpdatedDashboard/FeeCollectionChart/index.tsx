import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { default as RupeeSvg } from "../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getFeeCollectionDashboardAct } from "../../../store/fee/feereport/feereportactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { formatNumber } from "../../../utility/commonutility";
import { colorOptions, IMenuOptionsId, MenuOptions } from "./helper";
import UpdatedHorizontalTab from "../../../Components/Common/UpdatedHorizontalTab";

const FeeCollectionChart = (props: any) => {
  const [activeId, setActiveId] = useState<IMenuOptionsId>("all");
  const [totalFeeData, setTotalFeeData] = useState({
    totalAmt: 0,
    lable: ""
  })
  const { branchIdState, academicYearId = "" } = props || {};
  const dispatch = useAppDispatch();

  function clickMenuHandler(event: React.MouseEvent<HTMLElement>) {
    const { currentTarget } = event,
      menuId: IMenuOptionsId = currentTarget.getAttribute("data-id") as IMenuOptionsId || "all";
    setActiveId(menuId);
    getFeeCollectionApiCall(menuId);
  }

  const {
    academicYearListResp, currentInstIdResp: instituteId, currentBranchIdResp: branchId,
    getFeeCollectionDashboardResp } =
    useAppSelector(({ appData, instAcademics, feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getFeeCollectionDashboardResp: feeReport.getFeeCollectionDashboardResp,
    }), shallowEqual)

  useEffect(() => {
    if (academicYearId) {
      getFeeCollectionApiCall("all")
    }
  }, [instituteId, academicYearId, branchIdState])

  useEffect(() => {
    if (getFeeCollectionDashboardResp) {
      const totalAmt = getFeeCollectionDashboardResp?.reduce((acc: number, cur: any) => acc + cur?.amountPaid, 0);
      setTotalFeeData({ lable: "Total Fee Amount", totalAmt: +totalAmt });
    }
  }, [getFeeCollectionDashboardResp])

  const getFeeCollectionApiCall = (tabId: IMenuOptionsId) => {
    const feeType = tabId === "all" ? "" : tabId === "academic" ? "FEE STRUCTURE" : "TRANSPORT FEE";
    const payload = {
      instituteId, branchId: branchIdState, academicYearId, feeType
    }
    dispatch(getFeeCollectionDashboardAct(generateActionPayload("fee_dashboard_fee_collection", undefined, payload)))
  }

  const options: ApexCharts.ApexOptions = useMemo(() => {
    return {
      chart: {
        type: "donut",
      },
      labels: Array.isArray(getFeeCollectionDashboardResp) && getFeeCollectionDashboardResp.length > 0 ? getFeeCollectionDashboardResp.map((item: any) => item?.termName) : [],
      responsive: [
        {
          breakpoint: 1206,
          options: {
            chart: {
              width: 260,
              height: 260,
            },
          },
        },
        {
          breakpoint: 767,
          options: {
            chart: {
              width: 230,
              height: 230,
            },
          },
        },
      ],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: false,
              },
              value: {
                show: true,
              },
              total: {
                show: true,
                color: "black",
                fontSize: "29px",
                showAlways: true,
                formatter: function (w: any) {
                  const total = w.globals.seriesTotals.reduce(
                    (a: any, b: any) => a + b,
                    0
                  );
                  return `₹ ${formatNumber(+total)}`;
                },
              },
            },
          },
        },
      },
      colors: colorOptions,
      legend: {
        show: false,
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function (val: number) {
            return `₹ ${formatNumber(val)}`;
          },
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: number) {
          return `${val.toFixed(0)}%`;
        },
        style: {
          fontSize: "10px",
          colors: ["#FFFFFF"],
        },
      },

    }
  }, [getFeeCollectionDashboardResp]);

  const series = useMemo(() => {
    return Array.isArray(getFeeCollectionDashboardResp) && getFeeCollectionDashboardResp.length > 0
      ? getFeeCollectionDashboardResp.map((item: any) => item?.amountPaid)
      : []
  }, [getFeeCollectionDashboardResp])

  const seriesSum = useMemo(() => series?.reduce((acc: any, cur: number) => acc + cur, 0), [series])

  const seriesPercentage = useMemo(() => series?.map((ele: any) => (ele / seriesSum) * 100), [series, seriesSum])

  return (
    <div className="tw-rounded-2xl tw-shadow-sm tw-border tw-border-gray-200 tw-bg-white">
      {/* Header */}
      <div className="tw-border-b tw-py-2 tw-px-4 tw-bg-white tw-shadow-sm horizontal_tab_fee tw-rounded-t-2xl">
        <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-items-center tw-gap-y-2 tw-py-2">
          <div className="tw-flex-1">
            <h4 className="tw-text-base tw-font-semibold tw-text-gray-800">Fee Collection</h4>
          </div>
          <div className="tw-w-full md:tw-w-8/12 tw-pt-3 md:tw-pt-0 tw-px-4 md:tw-px-0 tw-flex tw-justify-center md:tw-justify-end">
            <UpdatedHorizontalTab
              MenuOptions={MenuOptions}
              clickMenuHandler={clickMenuHandler}
              activeTabId={activeId}
              horizontalClass="tw-ps-0"
            />
          </div>
        </div>
      </div>


      {/* Body */}
      <div className="tw-p-4 tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
        {/* Donut Chart */}
        <div className="tw-flex tw-items-center tw-justify-center">
          {series?.length > 0 && (
            <ReactApexChart
              type="donut"
              options={options}
              series={series}
              width={200}
              height={200}
            />
          )}
        </div>

        {/* Labels */}
        <div className="tw-flex tw-flex-col tw-gap-3 tw-justify-center">
          {series.map((s: any, index: number) => (
            <div key={index} className="tw-flex tw-gap-3">
              <div
                className="tw-w-1 tw-rounded-sm"
                style={{ backgroundColor: colorOptions[index] }}
              ></div>
              <div>
                <p className="tw-text-gray-500 tw-text-xs">
                  {getFeeCollectionDashboardResp[index]?.termName}
                </p>
                <div className="tw-flex tw-items-baseline tw-text-xs">
                  <RupeeSvg className="tw-w-3 tw-h-3" />
                  <span className="tw-ml-1 tw-font-medium tw-text-gray-800">
                    {formatNumber(series[index])}{" "}
                    {seriesPercentage[index] !== 100
                      ? `(${seriesPercentage[index]?.toFixed(0)}%)`
                      : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Total Row */}
          {totalFeeData?.totalAmt > 0 && (
            <div className="tw-flex tw-gap-3 tw-mt-2">
              <div className="tw-w-1 tw-rounded-sm tw-bg-blue-500"></div>
              <div>
                <p className="tw-text-gray-500 tw-text-xs">{totalFeeData.lable}</p>
                <div className="tw-flex tw-items-baseline tw-text-xs">
                  <RupeeSvg className="tw-w-3 tw-h-3" />
                  <span className="tw-ml-1 tw-font-medium tw-text-gray-800">
                    {formatNumber(totalFeeData.totalAmt)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>



  );
};

export default FeeCollectionChart;

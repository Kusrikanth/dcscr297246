import React, { useEffect, useMemo, useState } from "react";
import UpdatedHorizontalTab from "../../../../Components/Common/UpdatedHorizontalTab";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getFeeCollectionDashboardAct } from "../../../../store/fee/feereport/feereportactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import ReactApexChart from "react-apexcharts";
import { formatNumber } from "../helper";
import { colorOptions, IMenuOptionsId, MenuOptions } from "./helper";

const FeeCollection = () => {
  const [activeId, setActiveId] = useState<IMenuOptionsId>("all");
  const [totalFeeData, setTotalFeeData] = useState({
    totalAmt: 0,
    lable: ""
  })
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
    if (Array.isArray(academicYearListResp?.data)) {
      getFeeCollectionApiCall("all")
    }
  }, [academicYearListResp])

  useEffect(() => {
    if (getFeeCollectionDashboardResp) {
      const totalAmt = getFeeCollectionDashboardResp?.reduce((acc: number, cur: any) => acc + cur?.amountPaid, 0);
      setTotalFeeData({ lable: "Total Fee Amount", totalAmt: +totalAmt });
    }
  }, [getFeeCollectionDashboardResp])

  const getFeeCollectionApiCall = (tabId:IMenuOptionsId)=>{
    const feeType = tabId === "all" ? "" : tabId === "academic" ? "FEE STRUCTURE" : "TRANSPORT FEE";
    const { academicYearId } = academicYearListResp?.data?.find((year: any) => year.yearStatus.toLowerCase() === "current") || {};
      const payload = {
        branchId, academicYearId , feeType
      }
      dispatch(getFeeCollectionDashboardAct(generateActionPayload("fee_dashboard_fee_collection", undefined, payload)))
  }

  const options: ApexCharts.ApexOptions = useMemo(() => {
    return {
      chart: {
        type: "donut",
      },
      labels: Array.isArray(getFeeCollectionDashboardResp) && getFeeCollectionDashboardResp.length > 0 ? getFeeCollectionDashboardResp.map((item:any)=>item?.termName) : [],
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
    <>
      <div className="tw-bg-white tw-rounded-md tw-shadow tw-mb-6">
        <div className="tw-py-2 tw-px-4 horizontal_tab_fee tw-border-b ">
          <div className="tw-grid tw-grid-cols-12 tw-items-center">
            <div className="tw-col-span-12 md:tw-col-span-4">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
                Fee Collection
              </h4>
            </div>

            <div className="tw-col-span-12 md:tw-col-span-8 tw-pt-3 md:tw-pt-0 tw-flex tw-justify-end tw-px-4 md:tw-px-0">
              <UpdatedHorizontalTab
                MenuOptions={MenuOptions}
                clickMenuHandler={clickMenuHandler}
                activeTabId={activeId}
                horizontalClass="tw-pl-0"
              />
            </div>
          </div>
        </div>

        <div className="tw-pt-2 tw-pb-0">
          <div className="tw-grid tw-grid-cols-12 tw-items-center tw-h-full">

            <div className="tw-col-span-12 md:tw-col-span-6">
              <div className="tw-flex tw-justify-center tw-w-full tw-mt-3 tw-mb-3">
                {Array.isArray(series) && series.length > 0 && (
                  <ReactApexChart
                    type="donut"
                    options={options}
                    series={series}
                    width={200}
                    height={200}
                  />
                )}
              </div>
            </div>

            <div className="tw-col-span-12 md:tw-col-span-6">
              <div className="tw-grid tw-grid-cols-12 tw-justify-center">

                {Array.isArray(series) &&
                  series.length > 0 &&
                  series.map((s: any, index: number) => (
                    <div key={index} className="tw-col-span-12 tw-flex tw-flex-col tw-mb-3">
                      <div
                        className="tw-flex tw-pl-3"
                        style={{ borderLeft: `3px solid ${colorOptions[index]}` }}
                      >
                        <div>
                          <h6 className="tw-text-muted tw-text-[12px] tw-font-normal">
                            {getFeeCollectionDashboardResp[index]?.termName}
                          </h6>

                          <div className="tw-flex tw-items-baseline">
                            <RupeeSvg height="12px" width="12px" fill="#495057" />
                            <span className="tw-text-[12px] tw-mb-0 tw-ml-1 tw-mr-2">
                              {series[index] !== undefined &&
                                seriesPercentage?.[index] !== undefined
                                ? `${formatNumber(+series[index])}${seriesPercentage[index] !== 100
                                  ? ` (${seriesPercentage[index].toFixed(0)}%)`
                                  : ""
                                }`
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {Array.isArray(series) &&
                  series.length > 0 &&
                  totalFeeData.totalAmt > 0 && (
                    <div className="tw-col-span-12 tw-flex tw-flex-col tw-mb-3">
                      <div
                        className="tw-flex tw-pl-3"
                        style={{ borderLeft: "3px solid #299CDB" }}
                      >
                        <div>
                          <h6 className="tw-text-muted tw-text-[12px] tw-font-normal">
                            {totalFeeData.lable}
                          </h6>

                          <div className="tw-flex tw-items-baseline">
                            <RupeeSvg height="12px" width="12px" fill="#495057" />
                            <span className="tw-text-[12px] tw-mb-0 tw-ml-1 tw-mr-2">
                              {totalFeeData.totalAmt
                                ? formatNumber(totalFeeData.totalAmt)
                                : ""}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default FeeCollection;

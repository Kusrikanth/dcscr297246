import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getFeeCollectionDashboardAct } from "../../../../store/fee/feereport/feereportactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import ReactApexChart from "react-apexcharts";
import { formatNumber } from "../../../../utility/commonutility";

const colorOptions = ["#0AB39C", "#405189", "#FEB019", "#F06530"];

const TransportFeeCollectionChartView = (props: any) => {
  const { academicYearId, branchIdState } = props || {}
  const [totalFeeData, setTotalFeeData] = useState({
    totalAmt: 0,
    lable: "",
  });
  const dispatch = useAppDispatch();
  const {
    academicYearListResp,
    currentInstIdResp: instituteId,
    currentBranchIdResp: branchId,
    getFeeCollectionDashboardResp,
  } = useAppSelector(
    ({ appData, instAcademics, feeReport }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentInstIdResp: appData.currentInstIdResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getFeeCollectionDashboardResp: feeReport.getFeeCollectionDashboardResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (instituteId && academicYearId) {
      getFeeCollectionApiCall();
    }
  }, [instituteId, branchIdState, academicYearId]);

  const getFeeCollectionApiCall = () => {
    const payload = {
      branchId: branchIdState,
      academicYearId,
      feeType: "TRANSPORT FEE",
    };
    dispatch(
      getFeeCollectionDashboardAct(
        generateActionPayload(
          "fee_dashboard_fee_collection",
          undefined,
          payload
        )
      )
    );
  };

  const options: ApexCharts.ApexOptions = useMemo(() => {
    return {
      chart: {
        type: "donut",
      },
      labels:
        Array.isArray(getFeeCollectionDashboardResp) &&
          getFeeCollectionDashboardResp.length > 0
          ? getFeeCollectionDashboardResp.map((item: any) => item?.termName)
          : [],
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
    };
  }, [getFeeCollectionDashboardResp]);
  const series = useMemo(() => {
    return Array.isArray(getFeeCollectionDashboardResp) &&
      getFeeCollectionDashboardResp.length > 0
      ? getFeeCollectionDashboardResp.map((item: any) => item?.amountPaid)
      : [];
  }, [getFeeCollectionDashboardResp]);
  const seriesSum = useMemo(
    () => series?.reduce((acc: any, cur: number) => acc + cur, 0),
    [series]
  );
  const seriesPercentage = useMemo(
    () => series?.map((ele: any) => (ele / seriesSum) * 100),
    [series, seriesSum]
  );
  const totalAmt = useMemo(() => (getFeeCollectionDashboardResp?.reduce((acc: number, cur: any) => acc + cur?.amountPaid, 0)), [getFeeCollectionDashboardResp]);
  return (
    <>
      <div className="card !tw-rounded-2xl">
        <div className="card-header !tw-my-1 !tw-rounded-t-2xl">
          <h4 className="tw-text-base tw-font-semibold tw-mb-0">
            Transport Fee Collection
          </h4>
        </div>
        <div className="card-body tw-p-4 tw-flex-grow tw-flex tw-flex-col">
          <div className="tw-flex-grow tw-flex tw-items-center tw-justify-center">
            {series && Array.isArray(series) && series?.length > 0 && (
              <ReactApexChart
                type="donut"
                options={options}
                series={series}
                width={218}
                height={218}
              />
            )}
          </div>
          <div className="tw-w-full">
            <div className="tw-grid tw-grid-cols-2 tw-gap-3 tw-bg-gray-100 tw-rounded-lg tw-p-2 tw-w-full tw-mx-auto">
              {Array.isArray(series) &&
                series.length > 0 &&
                series.map((s: any, index: number) => (
                  <div key={index} className="tw-flex tw-mb-3 tw-w-full tw-items-center">
                    {/* <div
                      className="tw-flex tw-pl-3"
                      style={{
                        borderLeft: `3px solid ${colorOptions[index]}`,
                      }}
                    > */}
                    <div
                        className="!tw-rounded-full"
                        style={{
                          width: "4px",
                          height: "43px",
                          backgroundColor: `${colorOptions[index]}`,
                          marginRight: "10px",
                        }}
                      ></div>
                      <div>
                        <h6 className="tw-text-gray-600 tw-text-xs tw-font-normal">
                          {getFeeCollectionDashboardResp[index]?.termName}
                        </h6>
                        <div className="tw-flex tw-items-baseline">
                          <RupeeSvg
                            height="12px"
                            width="12px"
                            fill={"#495057"}
                          />
                          <span className="tw-text-xs tw-mb-0 tw-ml-1 tw-mr-2">
                            {series &&
                              series[index] !== undefined &&
                              seriesPercentage &&
                              seriesPercentage[index] !== undefined
                              ? `${formatNumber(+series[index])} ${seriesPercentage[index] !== 100
                                ? `(${seriesPercentage[index]?.toFixed(
                                  0
                                )}%)`
                                : ""
                              }`
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  // </div>
                ))}
              {totalAmt && <div >
                <div
                  className="tw-flex tw-pl-3"
                  style={{
                    borderLeft: `3px solid #299CDB`,
                  }}
                >
                  <div>
                    <h6 className="tw-text-xs tw-font-normal">Total</h6>
                    <div className="tw-flex tw-items-baseline">
                      <span className="tw-text-sm tw-mb-0 tw-font-medium">{`₹ ${formatNumber(totalAmt || 0)}`}</span>{" "}
                    </div>
                  </div>
                </div>
              </div>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default TransportFeeCollectionChartView;
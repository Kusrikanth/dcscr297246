import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getFeeCollectionDashboardAct } from "../../../../store/fee/feereport/feereportactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { default as RupeeSvg } from "../../../../assets/imagesdps/feeDashboard/RupeeSvg.svg?react";
import ReactApexChart from "react-apexcharts";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";

import {
  colorOptions,
  formatNumber,
  IMenuOptionsId,
  MenuOptions,
} from "./helper";
import { UncontrolledTooltip } from "reactstrap";
import { useModal } from "../../../../hooks/modalhook";
import { Button, ModalContainerUpdated } from "../../../../Components/Common";
import { ConfirmExportUnpaidFee } from "./ConfirmExportUnpaidFee";

const FeeCollection = () => {
  const [totalFeeData, setTotalFeeData] = useState({
    totalAmt: 0,
    lable: "",
  });
  const dispatch = useAppDispatch();

      const { modalState: duedateSmsModalState, closeModal: closeDuedateSmsModalHndlr,
          openModal: openDuedateSmsModalHndlr
      } = useModal();

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
    if (Array.isArray(academicYearListResp?.data)) {
      getFeeCollectionApiCall();
    }
  }, [academicYearListResp,branchId,instituteId]);

  const getFeeCollectionApiCall = () => {
    const { academicYearId } =
      academicYearListResp?.data?.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      ) || {};
    const payload = {
      branchId,
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
      <div className="tw-bg-white tw-rounded-lg tw-shadow">
        <div className="tw-py-2 tw-px-4 tw-border-b">
          <div className="tw-grid tw-grid-cols-12 tw-items-center">
            <div className="tw-col-span-10">
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                Transport Fee Collection
              </h4>
            </div>

            <div className="tw-col-span-2 tw-flex tw-justify-end">
              <Button
                id="export-btn"
                variant="exportBtn" 
                onClick={openDuedateSmsModalHndlr}
              >
                <img src={ExportIcon} className="tw-h-5 tw-w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="tw-p-4">
          <div className="tw-flex tw-flex-col tw-items-center tw-h-full">
            <div className="tw-flex tw-justify-center tw-w-full tw-mb-4">
              {Array.isArray(series) && series.length > 0 && (
                <ReactApexChart
                  type="donut"
                  options={options}
                  series={series}
                  width={218}
                  height={218}
                />
              )}
            </div>

            <div className="tw-grid tw-grid-cols-12 tw-gap-y-3 tw-bg-gray-100 tw-rounded-lg tw-p-3 tw-w-full">
              {Array.isArray(series) &&
                series.length > 0 &&
                series.map((s: any, index: number) => (
                  <div key={index} className="tw-col-span-6">
                    <div
                      className="tw-flex tw-pl-3"
                      style={{
                        borderLeft: `3px solid ${colorOptions[index]}`,
                        minHeight: "50px",
                      }}
                    >
                      <div>
                        <h6 className="tw-text-gray-500 tw-text-xs tw-font-normal">
                          {getFeeCollectionDashboardResp[index]?.termName}
                        </h6>

                        <div className="tw-flex tw-items-baseline">
                          <RupeeSvg height="12px" width="12px" fill="#495057" />
                          <span className="tw-text-xs tw-ml-1 tw-mr-2">
                            {series[index] !== undefined &&
                              seriesPercentage?.[index] !== undefined
                              ? `${formatNumber(+series[index])} ${seriesPercentage[index] !== 100
                                ? `(${seriesPercentage[index].toFixed(0)}%)`
                                : ""
                              }`
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              <div className="tw-col-span-6">
                <div
                  className="tw-flex tw-pl-3"
                  style={{
                    borderLeft: "3px solid #299CDB",
                    minHeight: "50px",
                  }}
                >
                  <div>
                    <h6 className="tw-text-xs tw-font-normal tw-text-gray-500">
                      Total
                    </h6>
                    <div className="tw-flex tw-items-baseline">
                      <RupeeSvg height="12px" width="12px" fill="#495057" />
                      <span className="tw-text-xs tw-ml-1 tw-mr-2">
                        {formatNumber(totalAmt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
                      id="sendsmsduepassed-modal"
                      modalSize="md"
                      hideHeader
                      isOpen={duedateSmsModalState.showModal}
                      toggle={closeDuedateSmsModalHndlr}
                  >
                      <ConfirmExportUnpaidFee
                          toggleModal={closeDuedateSmsModalHndlr}
                          branchId={branchId}
                          getFeeCollectionApiCall={getFeeCollectionApiCall}
                      />
                  </ModalContainerUpdated>
    </>
  );
};

export default FeeCollection;

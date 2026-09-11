import React, { useEffect, useMemo, useRef, useState } from "react";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import ReactApexChart from "react-apexcharts";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getSourceWiseAnalysisAct } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { Button } from "../../../../Components/Common";

const color = [
  "#33b2df",
  "#405189D9",
  "#0AB39CD9",
  "#F7B84BD9",
  "#F06548D9",
  "#212529D9",
  "#299CDBD9",
];

const LeadCaptureSource = ({ branchId, curriculumId, academicYearId }: any) => {

  const dispatch = useAppDispatch();

  const stuAdmissionSourceWiseApiCall = (otherProps?: any) => {
    const payload = {
      academicYearId,
      curriculumId,
      branchId,
      instituteId,
      ...otherProps,
    };
    dispatch(getSourceWiseAnalysisAct(generateActionPayload('get_source_wise_analysis', undefined, payload)))
  }

  const {
    currentBranchIdResp,
    currentInstIdResp: instituteId,
    getSourceWiseAnalysisResp,
  } = useAppSelector(
    ({ appData, applicationSale }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getSourceWiseAnalysisResp: applicationSale.getSourceWiseAnalysisResp
    }),
    shallowEqual
  );

  useEffect(() => {
    if (branchId || academicYearId || curriculumId) {
      stuAdmissionSourceWiseApiCall()
    }
  }, [branchId, academicYearId, curriculumId])

  const series: any = useMemo(() => (getSourceWiseAnalysisResp ? Object.values(getSourceWiseAnalysisResp) : []), [getSourceWiseAnalysisResp]);
  const totalSeriesValue = useMemo(() => (series?.reduce((acc: number, value: number) => acc + value, 0)), [series])
  const labels = useMemo(() => (getSourceWiseAnalysisResp ? Object.keys(getSourceWiseAnalysisResp) : []), [getSourceWiseAnalysisResp])

  const options: ApexCharts.ApexOptions | undefined = useMemo(
    () => ({
      chart: {
        type: "donut",
      },
      labels: labels,
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: "22px",
                formatter: function () {
                  return "Total";
                },
              },
              value: {
                show: true,
                fontSize: "16px",
              },
              total: {
                show: true,
                color: "black",
                fontSize: "16px",
                showAlways: true,
                label: "Total",
                formatter: function () {
                  return `${totalSeriesValue}`;
                },
              },
            },
          },
        },
      },
      responsive: [
        {
          breakpoint: 1206,
          options: {
            chart: {
              width: 290,
              height: 290,
            },
            legend: {
              position: "bottom",
            },
          },
        },
        {
          breakpoint: 767,
          options: {
            chart: {
              width: 270,
              height: 270,
            },
          },
        },
      ],
      colors: color,
      legend: {
        show: false,
        position: "right",
        itemMargin: {
          vertical: 10,
        },
      },
      dataLabels: {
        enabled: true,
        dropShadow: {
          blur: 3,
          opacity: 1,
        },
      },
      fill: {
        type: "solid",
        opacity: 1,
        pattern: {
        },
      },
      stroke: {
        show: false,
      },
    }),
    [totalSeriesValue,labels]
  );
  return (
    <>
      <div className="card !tw-rounded-2xl tw-w-full">
        <div className="card-header !tw-rounded-t-2xl">
          <div className="tw-grid tw-grid-cols-12 tw-items-center">
            <div className="tw-col-span-9">
              <h4 className="card-title">Source</h4>
            </div>
            <div className="tw-col-span-3 tw-flex tw-justify-end">
              <div className="tw-flex tw-gap-3">
                <Button
                  id="export-btn-source"
                  variant="exportBtn"
                >
                  <img src={ExportIcon} className="img-fluid tw-max-w-full tw-h-full" />
                  <UncontrolledTooltip placement="bottom" target="export-btn-source">
                    Export
                  </UncontrolledTooltip>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body !tw-p-0">
          <div className="tw-grid tw-grid-cols-12 tw-items-center tw-h-full">
            <div className="tw-col-span-8">
              <ReactApexChart
                series={series}
                options={options}
                type="donut"
                height={300}
                dir="ltr"
                className="apex-charts"
              />
            </div>
            <div className="tw-col-span-4 tw-my-auto tw-mx-0">
              <div className="tw-flex tw-flex-col tw-justify-center">
                {Array.isArray(series) &&
                  series.length > 0 &&
                  series.map((s: any, index: number) => (
                    <div key={index} className="tw-flex tw-mb-3 tw-w-full tw-items-center">
                      <div
                        className="!tw-rounded-full"
                        style={{
                          width: "4px",
                          height: "43px",
                          backgroundColor: `${color[index]}`,
                          marginRight: "10px",
                        }}
                      ></div>
                        <div>
                          <h6 className="tw-text-gray-500 fs-12 tw-font-normal">
                            {labels?.[index]}
                          </h6>
                          <div className="tw-flex tw-items-baseline">
                            <span className="fs-12 tw-mb-0 tw-ml-1 tw-mr-2">{s}</span>
                          </div>
                        </div>
                      </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadCaptureSource;

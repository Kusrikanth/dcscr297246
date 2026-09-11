import React, { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Button } from "../../../../Components/Common";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { getGradeKeys } from "../GradeWiseStudents/helper";

const SchoolResults = (props: any) => {
    const categories = useMemo(() => {
      if (!props?.data) {
        return [];
      }
      return getGradeKeys(props?.data);
    }, [props.data]);

  const seriesData = useMemo(() => {
    if (!props?.data) {
      return [];
    }
    return Object.values(props?.data).map((item: any) => item.count);;
  }, [props.data]);
  
  const donutColors = ["#0AB39C", "#f06548"];
  const chartOptions: ApexCharts.ApexOptions = {
    labels: categories,
    colors: donutColors,
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        offsetY: 10,
        donut: {
          size: "60%",
          labels: {
            show: false,
            name: { show: true, fontSize: "14px", offsetY: 10 },
            value: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
              color: "#333",
             
            },
            total: {
              show: false,
              showAlways: true,
              label: "Total",
              fontSize: "16px",
              fontWeight: 700,
              formatter: (w: any) => `${w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0)}%`,
            },
          },
        },
      },
    },
    annotations: {
      texts: [
        
        {
          text: "Total",
          x: 150,
          y: 120,
          textAnchor: "middle",
          fontSize: "14px",
          fontWeight: 600,
    
        },
      ],
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return `${val.toFixed(2)}%`;
      },
      dropShadow: { enabled: false },
    },
    grid: { padding: { bottom: -120 } },
    legend: { show: false },
  };

  return (
    <>
      <div className="card">
        <div className="card-header horizontal_tab_fee tw-py-2">
          <div className="tw-grid tw-grid-cols-12 tw-items-center">
            <div className="tw-col-span-12 lg:tw-col-span-6">
              <h4 className="card-title tw-mb-0 tw-flex-grow">
                Overall Summary
              </h4>
            </div>
            <div className="tw-col-auto tw-ms-auto">
              <div className="tw-flex tw-items-center">
                <Button
                  id="export-btn"
                  variant="exportBtn"
                >
                  <img src={ExportIcon} className="tw-w-5 tw-h-5" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="tw-grid tw-grid-cols-12 tw-items-center tw-h-full">
            {seriesData.length > 0 ? (<div className="tw-col-span-12">
              <div className="tw-flex tw-justify-center tw-w-full tw-mb-5">
                <ReactApexChart
                  options={chartOptions}
                  series={seriesData}
                  height={248}
                  type="donut"
                />
              </div>
              <div className="tw-grid tw-gap-3 tw-mt-3">
                {categories?.map((lbl, index) => {
                  const actualCount = props?.data?.[lbl];
                  return (
                    <div key={index} className="tw-grid tw-grid-cols-12 tw-items-center tw-justify-between tw-w-full tw-mx-auto">
                      <div className="tw-col-span-7">
                        <span
                          className="legend-color tw-me-2 tw-inline-block tw-w-3 tw-h-3 tw-rounded-full"
                          style={{
                            backgroundColor: donutColors[index],
                          }}
                        ></span>
                        <span className="legend-text">{`${lbl}`}</span></div>
                      <div className="tw-col-span-4">
                        <span className="legend-text">
                          {`${actualCount?.count} (${actualCount?.percentage.toFixed(2)}%)`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>) : <div className="tw-col-span-12 tw-text-center">No record found</div>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default SchoolResults;

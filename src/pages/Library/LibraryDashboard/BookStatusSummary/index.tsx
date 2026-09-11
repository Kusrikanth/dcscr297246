import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const BookStatusSummary = () => {
  const chartRef = useRef(null);
  const [label, setLabel] = useState<string[]>([
    "Returned",
    "Issued",
    "Available",
    "Lost",
    "Discarded",
  ]);
  const [seriesData, setSeriesData] = useState<number[]>([0, 0, 0, 0, 0]);
  const [totalCount, setTotalCount] = useState<number>(0);


  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
      academicYearListResp, getLibraryDashboardDataResp, 
    } = useAppSelector(
      ({ instAcademics, appData, libraryBookCollection, librarysettings }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        getLibraryDashboardDataResp: libraryBookCollection.getLibraryDashboardDataResp,
  
      }),
      shallowEqual
    );

   useEffect(() => {
          if (getLibraryDashboardDataResp) {
              const { availableBooks, returnedBooks, discardedBooks, lostBooks, totalBooksCount, issuedBooks } = getLibraryDashboardDataResp.BookStatusSummary || {};
  
              setSeriesData([returnedBooks, issuedBooks, availableBooks, lostBooks, discardedBooks ]);
              setTotalCount(totalBooksCount);
          }
    }, [getLibraryDashboardDataResp]);

  const chartOptions: any = {
    chart: {
        type: 'donut',
    },
    labels: label,
    plotOptions: {
        pie: {
            donut: {
               labels: {
                show: true,
                name: {
                    show: true,
                    fontSize: '22px',
                    formatter: function () {
                        return "Total";
                    },
                },
                value: {
                    show: true,
                    fontSize: '16px',
                },
                total: {
                    show: true,
                    color: "black",
                    fontSize: "16px",
                    showAlways: true,
                    label: "Total",
                    formatter: function () {
                       
                        return `${totalCount}`; 
                    },
                }
               }
            }
        }
    },
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
    colors: ["#FEB019", "#405189", "#0AB39C", "#f06548", "#6C757D"],
    legend: {
        show: false,
    },
    dataLabels: {
        enabled: true,
        dropShadow: {
          blur: 3,
          opacity: 1
        }
    },
    stroke: {
        show: false,
    },
}

  return (
    <>
      <div className="tw-bg-white tw-rounded-lg tw-overflow-hidden tw-min-h-[420px]">
        <div className="horizontal_tab_fee tw-py-2 tw-px-3 tw-border-b">
          <div className="tw-flex tw-items-center tw-justify-between">
            <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
              Book Status Summary
            </h4>
            <div className="tw-invisible">
              <div className="tw-flex tw-items-center">
                <button
                  id="export-btn"
                  className="tw-rounded-full tw-bg-sky-100 tw-p-2"
                >
                  <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-p-4">
          <div className="tw-flex tw-flex-col">
            <div className="tw-flex tw-justify-center tw-mb-6">
              <ReactApexChart
                options={chartOptions}
                series={seriesData}
                type="donut"
                height={210}
                width={210}
              />
            </div>
            <div className="tw-mt-3 tw-px-4">
              <div className="tw-grid tw-grid-cols-3 tw-items-center tw-justify-center tw-mb-7 tw-gap-y-3">
                {label.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="tw-flex tw-items-center tw-justify-center"
                  >
                    <div
                      className="tw-flex tw-pl-3"
                      style={{
                        borderLeft: `3px solid ${chartOptions.colors[index]}`,
                      }}
                    >
                      <div>
                        <h6 className="tw-text-gray-500 tw-text-xs tw-font-normal">
                          {item}
                        </h6>
                        <div className="tw-flex tw-items-center">
                          <span className="tw-text-xs tw-ml-1 tw-mr-2">
                            {seriesData[index]}
                          </span>
                        </div>
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

export default BookStatusSummary;

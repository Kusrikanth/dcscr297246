import React, { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";

const BookCategory = () => {

  const { 
    getLibraryDashboardDataResp
  } = useAppSelector(
    ({ libraryBookCollection }) => ({
      getLibraryDashboardDataResp: libraryBookCollection.getLibraryDashboardDataResp,
    }),
    shallowEqual
  );

  const categories = useMemo(() => {
    return Object.keys(getLibraryDashboardDataResp?.bookCategory || {});
  }, [getLibraryDashboardDataResp?.bookCategory]);

  const rowData = useMemo(() => {
    return categories?.map((key) => ( getLibraryDashboardDataResp?.bookCategory[key] ))
  }, [getLibraryDashboardDataResp?.bookCategory]);
  
  const series = useMemo(() => {
    return [
      {
        name: "",
        data: rowData
      },
    ]
  }, [rowData]);

  const options: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      type: "bar",
      stacked: false,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: rowData.length < 6 ? "30px" : "30%",
        endingShape: "rounded",
        distributed: true,
        dataLabels: {
          position: 'top',
        },
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => val.toLocaleString(),
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#000"],
        fontWeight: '600',
      },
    },
    xaxis: {
      categories,
      labels: {
        rotate: 0,
        style: {
          fontSize: '10px'
        }
      },

    },
    yaxis: {
      title: {
        text: "No. of Books",
      },
    },
    colors: [ "#405189", "#0AB39C", "#FEB019", "#f06548", "#6C757D", "#556EE6", "#34C38F", "#F1B44C", "#F46A6A", "#7fc57d", "#3A9FF3", "#45CB85", "#FFA548", "#7b8de0", "#3daeb9" ]
,
    fill: {
      opacity: 1,
    },
    legend: {
      itemMargin: {
        horizontal: 10,
        vertical: 2
      },
      offsetY: 7,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    tooltip: {
      y: {
        formatter: (val: number) => `Total : ${val}`,
      },
    },
    responsive: [
      {
        breakpoint: 1845,
        options:{
          xaxis: {
            labels: {
              rotate: -40,
              style: {
                fontSize: '11px'
              }
            }
          }
        }
      },
      {
        breakpoint: 1350,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "20px",
            },
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '11px'
              }
            }
          },
        },
      },
      {
        breakpoint: 1150,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "15px",
            },
          },
        },
      },
      {
        breakpoint: 940,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "12px",
            },
          },
        },
      },
      {
        breakpoint: 845,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "10px",
            },
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "12px",
            },
          },
          xaxis: {
            labels: {
              style: {
                fontSize: '10px'
              }
            }
          },
        },
      },
      {
        breakpoint: 575,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "10px",
            },
          },
        },
      },
      {
        breakpoint: 510,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "8px",
            },
          },
          xaxis: {
            labels: {
              rotate: 270,
            }
          },
        },
      },
      {
        breakpoint: 490,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "8px",
            },
          },
        },
      },
      {
        breakpoint: 408,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "6px",
            },
          },
        },
      },
    ]
  }), [categories, rowData]);

  return (
    <div
      className="tw-bg-white tw-rounded-lg tw-overflow-hidden section-count-card tw-min-h-[478px]"
    >
      <div className="tw-pt-3 tw-pb-2 tw-px-3 horizontal_tab_fee tw-border-b">
        <div className="tw-flex tw-items-center">
          <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
            Book Category
          </h4>
        </div>
      </div>
      <div className="tw-pt-0 tw-px-3 tw-h-[488px]">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={460}
        />
      </div>
    </div>
  );
};

export default BookCategory;

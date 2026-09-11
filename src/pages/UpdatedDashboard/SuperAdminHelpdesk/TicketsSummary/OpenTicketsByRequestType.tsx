import ReactApexChart from "react-apexcharts";
import { formatRequestTypeLabel } from "./helper";
import { useMemo } from "react";

const colorOptions = [
  "#0AB39CD9",
  "#5A6BA5D9",
  "#13C4DED9",
  "#FACD76D9",
  "#F27E6AD9",
  "#383E47D9",
  "#3CB0EAD9"
];

const OpenTicketsByRequestType = (props: any) => {
  const openTicketData = props?.data?.openTickets?.find(
    (ticket) => ticket.complaintStatus === "OPEN"
  );

  if (!openTicketData || !openTicketData.requestTypeCounts.length) {
    return (
      <div className="!tw-flex !tw-items-center !tw-justify-center">
        <p>No open tickets data available</p>
      </div>
    );
  }

  // Extract series data and labels from API response
  const series = useMemo(
    () => openTicketData.requestTypeCounts.map((item) => item.count),
    [openTicketData]
  );
  const labels = useMemo(
    () =>
      openTicketData.requestTypeCounts.map((item) =>
        formatRequestTypeLabel(item.requestType)
      ),
    [openTicketData]
  );

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut"
    },
    labels: labels,
    // responsive: [
    //   // {
    //   //   breakpoint: 1206,
    //   //   options: {
    //   //     chart: {
    //   //       width: 248,
    //   //       height: 248,
    //   //     },
    //   //   },
    //   // },
    //   {
    //     breakpoint: 767,
    //     options: {
    //       chart: {
    //         width: 208,
    //         height: 208,
    //       },
    //     },
    //   },
    // ],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: false
            },
            value: {
              show: true
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
                return `${+total}`;
              }
            }
          }
        }
      }
    },
    colors: colorOptions.slice(0, series.length),
    legend: {
      show: false
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return ` ${val}`;
        }
      }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val: number) {
        return `${val.toFixed(0)}%`;
      },
      style: {
        fontSize: "10px",
        colors: ["#FFFFFF"]
      }
    }
  };

  return (
    <div className="!tw-flex !tw-items-center !tw-justify-between">
      <div className="!tw-flex !tw-flex-wrap !tw-items-center !tw-justify-between">
        <div className="!tw-w-full md:!tw-w-7/12 !tw-flex !tw-items-center !tw-justify-center">
          <ReactApexChart
            options={options}
            series={series}
            type="donut"
            width={268}
          />
        </div>
        <div className="!tw-w-full md:!tw-w-5/12">
          <div className="!tw-flex !tw-flex-wrap !tw-justify-center">
            {series.map((count: number, idx: number) => (
              <div key={idx} className="!tw-flex !tw-mb-2 !tw-w-full !tw-items-center">
                <div
                        className="!tw-rounded-full"
                        style={{
                          width: "4px",
                          height: "43px",
                          backgroundColor: colorOptions[idx],
                          marginRight: "10px",
                        }}
                      ></div>
                  <div>
                    <h6 className="!tw-text-gray-500 !tw-text-[12px] !tw-font-normal !tw-mb-1">
                      {labels[idx]}
                    </h6>
                    <p className="!tw-mb-0">{count}</p>
                  </div>
                
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenTicketsByRequestType;

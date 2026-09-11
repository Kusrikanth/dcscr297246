import ReactApexChart from "react-apexcharts";
import { formatRequestType } from "./helper";
import { useMemo } from "react";

const RequestByTicketType = (props: any) => {

  const processData = useMemo(() => {
    if (!props.data?.requestTypeWise) {
      return {
        categories: [],
        openedData: [],
        closedData: []
      };
    }

    const categories: string[] = [];
    const openedData: number[] = [];
    const closedData: number[] = [];

    props?.data.requestTypeWise.forEach((item: any) => {
      categories.push(formatRequestType(item.requestType));

      let openCount = 0;
      let closedCount = 0;

      item.statusCounts.forEach((status: any) => {
        if (status.complaintStatus === 'OPEN') {
          openCount = status.count;
        } else if (status.complaintStatus === 'CLOSED') {
          closedCount = status.count;
        }
      });

      openedData.push(openCount);
      closedData.push(closedCount);
    });

    return { categories, openedData, closedData };
  }, [props.data]);

  const { categories, openedData, closedData } = processData;

  const series = [
    {
      name: "Opened Tickets",
      data: openedData,
    },
    {
      name: "Closed Tickets",
      data: closedData,
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      height: 350,
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 1845,
        options: {
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
              columnWidth: "25px",
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
              columnWidth: "20px",
            },
          },
        },
      },
      {
        breakpoint: 940,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "17px",
            },
          },
        },
      },
      {
        breakpoint: 845,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "15px",
            },
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "25px",
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
              columnWidth: "20px",
            },
          },
        },
      },
      {
        breakpoint: 510,
        options: {
          plotOptions: {
            bar: {
              columnWidth: "15px",
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
              columnWidth: "14px",
            },
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: categories.length < 9 ? '35px' : '45%',
        borderRadius: 2,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: "500",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: true,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    legend: {
      position: "bottom",
    },
    xaxis: {
      categories: categories,
      labels: {
        style: {
          fontSize: "12px",
        },
        rotate: -45,
      },
    },
    yaxis: {
      title: {
        text: "No of Tickets",
        style: {
          fontSize: "12px",
        },
      },
    },
    colors: ["#0AB39C", "#405189"],
  };

  return (
    <div className="tw-pb-0">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={328}
      />
    </div>
  );
};

export default RequestByTicketType;
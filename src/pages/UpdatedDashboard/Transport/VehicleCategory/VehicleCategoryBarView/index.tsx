import ReactApexChart from "react-apexcharts";
import { useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useMemo } from "react";

const VehicleCategoryBarView = () => {

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    getVehicleCategoryResp
  } = useAppSelector(
    ({ appData, transportrequest }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getVehicleCategoryResp: transportrequest.getVehicleCategoryResp
    }),
    shallowEqual
  );

  const categories = useMemo(() => (getVehicleCategoryResp?.map((item: any) => item.vehicleType || "")) || [], [getVehicleCategoryResp])
  const rowData = useMemo(() => getVehicleCategoryResp?.map((item: any) => item.noOfVehicles || "") || [], [getVehicleCategoryResp])

  const series : ApexAxisChartSeries | ApexNonAxisChartSeries = useMemo(() => {
    return [
      {
        data: rowData,
      },
    ]
  }, [rowData]);
  
  const defaultBarHeight = 30;
  const maxVisibleBars = 5;
  const calculatedBarHeight = useMemo(() => (rowData?.length > maxVisibleBars ? defaultBarHeight - (rowData?.length - maxVisibleBars) * 1 : defaultBarHeight),[rowData])
  const minBarHeight = 5;

  const options: ApexCharts.ApexOptions | undefined = {
    chart: {
      type: "bar",
      height: Math.max(rowData?.length * calculatedBarHeight, 428),
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 2,
        distributed: true,
        borderRadiusApplication: "end",
        dataLabels: { position: "top" },
        barHeight: `${Math.max(minBarHeight, calculatedBarHeight)}px`,
      },
    },
    dataLabels: {
      enabled: false,
      offsetX: 24,
      formatter: function (val: any) {
        return val;
      },
      style: {
        fontSize: "14px",
        fontWeight: 400,
        colors: ["#adb5bd"],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: categories,
      labels: {
        show: true,
        formatter: function (val: any) {
          return val;
        }
      },
    },
    yaxis: {
      title: {
        text: "Type of Vehicle",
      },
      min: 0,
      max: 150,
      labels: {
        show: false,
      },
      axisBorder: {
        show: true,
        color: "#e9ebec",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val;
        },
        title: {
          formatter: function (seriesName: any) {
            return "";
          },
        },
      },
    },
    legend: {
      show: true,
      position: "right",
      itemMargin: {
        horizontal: 0,
        vertical: 10,
      },
      fontSize: "14px",
      offsetY: 10,
      formatter: (seriesName: string, opts: any) => {
        const seriesIndex = opts.seriesIndex;
        const value = opts.w.globals.series[0][seriesIndex];
        return `${seriesName}: ${value}`;
      },
    },
    colors: [
      "#0AB39C",
      "#F06548",
      "#405189",
      "#f7b84b",
      "#405189D9",
      "#0AB39CD9",
      "#F7B84BD9",
      "#F06548D9",
      "#212529D9",
      "#299CDBD9",
      "#5A6BA5D9",
      "#13C4DED9",
      "#FACD76D9",
      "#F27E6AD9",
      "#383E47D9",
      "#3CB0EAD9",
    ],
    responsive: [
      {
        breakpoint: 1200,
        options: {
          dataLabels: {
            enabled: false,
          },
        },
      },
      {
        breakpoint: 992,
        options: {
          dataLabels: {
            enabled: true,
            offsetX: 10,
            formatter: function (val: any, opts: any) {
              const labels = opts.w.globals.labels[opts.dataPointIndex];
              return `${labels}: ${val}`;
            }
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };
  return (
    <>
      <div className="tw-w-full">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={Math.max(rowData?.length * calculatedBarHeight, 428)}
        />
      </div>
    </>
  );
};
export default VehicleCategoryBarView;

import ReactApexChart from "react-apexcharts";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { useMemo } from "react";

const VehicleCategoryBarChart = () => {

  const { currentBranchIdResp: branchId,currentInstIdResp: instituteId,
    getVehicleCategoryResp
    } = useAppSelector(
      ({ appData, transportrequest }) => ({
        currentBranchIdResp:appData.currentBranchIdResp,
        currentInstIdResp:appData.currentInstIdResp,
        getVehicleCategoryResp:transportrequest.getVehicleCategoryResp

      }),
      shallowEqual
  );

  const filteredGetVehicleCategoryResp = getVehicleCategoryResp?.filter((item: any) => item.vehicleType !== null && item.noOfVehicles !== null);

  const categories = filteredGetVehicleCategoryResp?.map((item: any) => item.vehicleType);
  const rowData = filteredGetVehicleCategoryResp?.map((item: any) => item.noOfVehicles);

  const series = useMemo(() => {
      return [
      {
        data: rowData,
      },
    ]}, [rowData]);

  const defaultBarHeight = 30; 
  const maxVisibleBars = 5; 
  const calculatedBarHeight = rowData?.length > maxVisibleBars ? defaultBarHeight - (rowData?.length - maxVisibleBars) * 1 : defaultBarHeight; 
  const minBarHeight = 5; 

  const options: ApexCharts.ApexOptions = useMemo(() => ({
     chart: {
         type: "bar",
         height: Math.max(rowData?.length * calculatedBarHeight, 428),
         toolbar: { 
          show: false,
        },
         stacked: true,
     },
     plotOptions: {
         bar: {
             barHeight: `${Math.max(minBarHeight, calculatedBarHeight)}px`,
             horizontal: true,
             distributed: true,
             dataLabels: { position: 'bottom' },
         },
     },
     dataLabels: {
         enabled: false,
         textAnchor: "start",
         style: {
           colors: ["#fff"],
         },
         formatter: function (val: any) {
           return val;
         },
         offsetX: 0,
         dropShadow: {
           enabled: true,
         },
     },
     stroke: {
         show: true,
         width: 2,
         colors: ["transparent"],
     },
     xaxis: {
      categories: categories,
      position: "bottom",
      axisBorder: {
        show: true,
      },
      title: {
        text: "Number of Vehicles",
      },
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
          "#33b2df",
          "#405189D9",
          "#0AB39CD9",
          "#F7B84BD9",
          "#F06548D9",
          "#212529D9",
          "#299CDBD9",
    ],
     
     grid: {
         show: false,
     },
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
 }), [categories]);
 

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

export default VehicleCategoryBarChart;

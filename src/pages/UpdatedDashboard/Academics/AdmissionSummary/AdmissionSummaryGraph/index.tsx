import React, { useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { getAdmissionSummaryReportAct } from "../../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { shallowEqual } from "react-redux";

const admissionData = (data: object) => {
  return Object?.entries(data)?.map(([key, value]) => value);
};

const categoriesData = (response: object) => {
  return Object?.entries(response)?.map(([key, value]) => key);
}

const AdmissionSummaryBarView = ({ branchId, curriculumId, academicYearId }: any) => {
  
  const dispatch = useAppDispatch()

  const {
    currentInstIdResp: instituteId, getAdmissionSummaryReportResp, } =
    useAppSelector(({ appData, applicationSale }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      getAdmissionSummaryReportResp: applicationSale.getAdmissionSummaryReportResp,
    }), shallowEqual)

  const admissionSummaryWiseApiCall = (otherProps?: any) => {
    const payload = {
      academicYearId,
      curriculumId,
      branchId,
      instituteId,
      ...otherProps,
    };
    dispatch(getAdmissionSummaryReportAct(generateActionPayload('get_admission_summary_report', undefined, payload)))
  }

  useEffect(() => {
    if (branchId || academicYearId || curriculumId) {
      admissionSummaryWiseApiCall()
    }
  }, [branchId, academicYearId, curriculumId])

  const categories = useMemo(() => categoriesData(getAdmissionSummaryReportResp || {}), [getAdmissionSummaryReportResp]);

  const rowData = useMemo(() => admissionData(getAdmissionSummaryReportResp || {}), [getAdmissionSummaryReportResp]);

  const maxDataValue = useMemo(() => {
    if (rowData.length > 0) {
      return Math.max(...rowData);
    }
    return 0
  }, [rowData])

  const series = useMemo(() => {
    return [
      {
        data: rowData,
      },
    ]
  }, [rowData]);

  const colors = [
    "#33b2df",
    "#405189D9",
    "#0AB39CD9",
    "#F7B84BD9",
    "#F06548D9",
    "#212529D9",
    "#299CDBD9",
    "#0AB39CD9",
  ];

  const defaultBarHeight = 30;
  const maxVisibleBars = 5;
  const calculatedBarHeight = rowData.length > maxVisibleBars ? defaultBarHeight - (rowData.length - maxVisibleBars) * 1 : defaultBarHeight;
  const minBarHeight = 5;

  const options: ApexCharts.ApexOptions = useMemo(() => ({
    chart: {
      type: "bar",
      height: Math.max(rowData.length * calculatedBarHeight, 380),
      toolbar: { show: false },
      stacked: true,
      offsetX: -30
    },
    plotOptions: {
      bar: {
        barHeight: `${Math.max(minBarHeight, calculatedBarHeight)}px`,
        horizontal: true,
        distributed: true,
        dataLabels: { position: 'bottom' },
      },
    },
    colors,
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
    grid: {
      show: false,
    },
    xaxis: {
      position: "bottom",
      axisBorder: {
        show: true,
      },
      labels: {
        show: true,
        formatter: function (val: any) {
          return val;
        }
      },
      categories: categories,
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    fill: {
      opacity: 1
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
  }), [categories, maxDataValue]);

  return (
    <div className="row px-3">
      <div className="col-12 ">
        <ReactApexChart dir="ltr"
          options={options}
          series={series}
          type="bar"
          height={Math.max(rowData.length * calculatedBarHeight, 400)}
        />
      </div>
    </div>
  );
};

export default AdmissionSummaryBarView;

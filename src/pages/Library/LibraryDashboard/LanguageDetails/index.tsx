import React, { useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { categoriesData } from "./helper";

const LanguageDetails = () => {

  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId,
    academicYearListResp, getLibraryDashboardDataResp, libraryBookCollectionErrorAct, getStockVerificationResp,
    libraryDetailsRequestListResp
  } = useAppSelector(
    ({ instAcademics, appData, libraryBookCollection, librarysettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getLibraryDashboardDataResp: libraryBookCollection.getLibraryDashboardDataResp,
      libraryBookCollectionErrorAct: libraryBookCollection.libraryBookCollectionErrorAct,
      getStockVerificationResp: libraryBookCollection.getStockVerificationResp,
      libraryDetailsRequestListResp: librarysettings.libraryDetailsRequestListResp,


    }),
    shallowEqual
  );


  const categories = useMemo(() => {
    return Object.keys(getLibraryDashboardDataResp?.languageDetails || {});
  }, [getLibraryDashboardDataResp?.languageDetails]);

  const rowData = useMemo(() => {
    return categories?.map((key) => getLibraryDashboardDataResp?.languageDetails[key].count)
  }, [getLibraryDashboardDataResp?.languageDetails]);

  const series = [
    {
      name: "",
      data: rowData,
    },
  ];


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
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories,
      labels: {
        rotate: 0,
      },
    },
    yaxis: {
      title: {
        text: "No. of Books",
      },
    },
    colors: ["#405189", "#0AB39C", "#FEB019", "#f06548", "#6C757D"],
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
        formatter: (val: number) => `${val} books`,
      },
    },
  }), [categories, rowData]);

  return (
    <div
      className="tw-bg-white tw-rounded-lg tw-overflow-hidden section-count-card tw-min-h-[478px]"
    >
      <div className="tw-pt-3 tw-pb-2 tw-px-4 horizontal_tab_fee tw-border-b">
        <div className="tw-flex tw-items-center tw-mb-4">
          <h4 className="tw-text-base tw-font-semibold tw-mb-0 tw-flex-grow">
            Language Details
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

export default LanguageDetails;

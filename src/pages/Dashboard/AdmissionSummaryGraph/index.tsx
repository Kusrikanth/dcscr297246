import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { SelectInput } from "../../../Components/Common";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getAdmissionSummaryReportAct, getBranchAdmissionAnalysisAct, resetBrchAdmissionCurriculumAct } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { admissionData, categoriesData } from "./helper";
import Button from "../../../Components/Common/Button";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
};

const AdmissionSummaryGraph = ({ academicYearId }: any) => {
  const dispatch = useAppDispatch()

  const AdmissionSummaryWiseApiCall = (otherProps?: any) => {
    const { academicYearId, curriculumId } = upcomingEvents.values;
    let payload = {
      academicYearId,
      curriculumId,
      branchId,
      instituteId,
      ...otherProps,
    };
    dispatch(getAdmissionSummaryReportAct(generateActionPayload('get_admission_summary_report', undefined, payload)))
  }

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getAdmissionSummaryReportResp,
    brchAdmissionCurriculumResp,
  } = useAppSelector(
    ({ instAcademics, appData, applicationSale }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getAdmissionSummaryReportResp: applicationSale.getAdmissionSummaryReportResp,
      brchAdmissionCurriculumResp: applicationSale.brchAdmissionCurriculumResp
    }),
    shallowEqual
  );
  useEffect(() => {
    if (academicYearId) {
      upcomingEvents.setFieldValue("academicYearId", academicYearId)
      getCurriculumApiCall({ academicYearId });
      AdmissionSummaryWiseApiCall({ academicYearId })
    }
  }, [academicYearId]);


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
    colors: [
      "#33b2df",
      "#405189D9",
      "#0AB39CD9",
      "#F7B84BD9",
      "#F06548D9",
      "#212529D9",
      "#299CDBD9",
    ],
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

  const upcomingEvents = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: (values) => { },
  })

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: upcomingEvents.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchAdmissionAnalysisAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      if (value) {
        getCurriculumApiCall({ academicYearId: value });
        upcomingEvents.setValues((prev) => ({ ...prev, [name]: value, curriculumId: "" }))
        AdmissionSummaryWiseApiCall({ [name]: value, curriculumId: "" })
      }
      else {
        upcomingEvents.setValues((prev) => ({ ...prev, [name]: value, curriculumId: "" }))
        AdmissionSummaryWiseApiCall({ [name]: value, curriculumId: "" })
        dispatch(resetBrchAdmissionCurriculumAct(undefined))
      }
    }
    else if (name === 'curriculumId') {
      upcomingEvents.setValues((prev) => ({ ...prev, [name]: value }))
      AdmissionSummaryWiseApiCall({ [name]: value })
    }
  }

  const { data: curriculumTypes } = brchAdmissionCurriculumResp || {}
  const { data: academicYearList } = academicYearListResp || {};
  return (
    <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-w-full">

      <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
        
           <div className="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-items-center">

            <div>
              <h4 className="tw-text-base tw-font-semibold tw-mb-0">
              Admission Summary

              </h4>
            </div>

          <div className="tw-flex tw-justify-start md:tw-justify-end">
              <Button
                variant='exportBtn'
                id="export-btn"
              >
                <img
                  src={ExportIcon}
                  className="tw-h-full tw-w-auto"
                  alt="Export"
                />
                <UncontrolledTooltip placement="bottom" target="export-btn">
                  Export
                </UncontrolledTooltip>
              </Button>
            </div>

        </div>
      </div>

      <div className="tw-px-4 tw-py-4">

        <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-pb-2 tw-w-full tw-mx-auto">

          <div className="tw-col-span-6">
            <SelectInput
              name="academicYearId"
              value={upcomingEvents.values.academicYearId}
              onChange={filterHandler}
              menuItems={academicYearList || []}
              valueKey="academicYearId"
              textKey="academicYearName"
              formgroupClassName="tw-mb-0"
              labelText="Academic Year"
              floatingLabel
            />
          </div>

          <div className="tw-col-span-6">
            <SelectInput
              name="curriculumId"
              value={upcomingEvents.values.curriculumId}
              onChange={filterHandler}
              menuItems={curriculumTypes || []}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              formgroupClassName="tw-mb-0"
              labelText="Curriculum"
              floatingLabel
            />
          </div>

        </div>

        <div className="tw-px-3">
          <div className="tw-w-full">
            <ReactApexChart
              dir="ltr"
              options={options}
              series={series}
              type="bar"
              height={Math.max(rowData.length * calculatedBarHeight, 400)}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdmissionSummaryGraph;

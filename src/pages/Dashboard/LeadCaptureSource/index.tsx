import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { getSourceWiseAnalysisAct } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { generateActionPayload } from "../../../utility/reduxutility";
import ReactApexChart from "react-apexcharts";

const initialValues = {
  curriculumId: "",
};
const color = [
  "#33b2df",
  "#405189D9",
  "#0AB39CD9",
  "#F7B84BD9",
  "#F06548D9",
  "#212529D9",
  "#299CDBD9",
]

const LeadCaptureSource = ({ academicYearId }: any) => {
  const [filterState, setFilterState] = useState(initialValues);
  const dispatch = useAppDispatch();

  const StuAdmissionSourceWiseApiCall = (otherProps?: any) => {

    const { curriculumId } = sourceForm.values;
    let payload = {
      academicYearId,
      curriculumId,
      branchId,
      instituteId,
      ...otherProps,
    };
    dispatch(getSourceWiseAnalysisAct(generateActionPayload('get_source_wise_analysis', undefined, payload)))
  }
  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getSourceWiseAnalysisResp,
  } = useAppSelector(
    ({ appData, applicationSale }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getSourceWiseAnalysisResp: applicationSale.getSourceWiseAnalysisResp
    }),
    shallowEqual
  );

  useEffect(() => {
    if (academicYearId) {
      StuAdmissionSourceWiseApiCall();
    }
  }, [academicYearId]);


  const sourceForm = useFormik({
    enableReinitialize: true,
    initialValues: filterState,
    onSubmit: (values) => { },
  });

  const series: any = getSourceWiseAnalysisResp ? Object.values(getSourceWiseAnalysisResp) : [];
  const totalSeriesValue = series?.reduce((acc: number, value: number) => acc + value, 0);
  const labels = getSourceWiseAnalysisResp ? Object.keys(getSourceWiseAnalysisResp) : [];

  const patternStyles = ['verticalLines', 'squares', 'horizontalLines', 'circles', 'slantedLines'];

  const dynamicPatterns = Array(series.length)
    .fill(null)
    .map((_, index) => patternStyles[index % patternStyles.length]);

  const options: ApexCharts.ApexOptions | undefined = useMemo(() => ({
    chart: {
      type: 'donut',
    },
    labels: labels,
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
                return `${totalSeriesValue}`;
              },
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 1206,
        options: {
          chart: {
            width: 290,
            height: 290,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
      {
        breakpoint: 767,
        options: {
          chart: {
            width: 270,
            height: 270,
          },
        },
      },
    ],
    colors: color,
    legend: {
      show: false,
      position: "right",
      itemMargin: {
        vertical: 10,
      },
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        blur: 3,
        opacity: 1
      }
    },
    fill: {
      type: 'solid',
      opacity: 1,
      pattern: {
        style: dynamicPatterns,
      },
    },
    stroke: {
      show: false,
    },
  }), [getSourceWiseAnalysisResp, totalSeriesValue, dynamicPatterns]);


  return (
    <>
      <div className="card  w-100">
        <div className="card-header">
          <div className="row align-items-center">
            <div className="col-9">
              <h4 className="card-title mb-2 mb-md-0 flex-grow-1">Source</h4>
            </div>
            <div className="col-3 d-flex justify-content-end">
              <div className="d-flex gap-3">
                <button
                  id="export-btn"
                  className="btn btn-icon btn-rounded btn-soft-info p-2"
                >
                  <img src={ExportIcon} className="img-fluid h-100" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card-body ">
          <div className="row align-items-center h-100">
            <div className="col-8">
              <ReactApexChart
                series={series}
                options={options}
                type="donut"
                height={300}
                dir="ltr" className="apex-charts"
              />
            </div>
            <div className="col-4 my-auto mx-0">
              <div className="row d-flex justify-content-center">
                {Array.isArray(series) && series.length > 0 && series.map((s: any, index: number) => (
                  <div key={index} className="d-flex flex-column mb-3 col-12">
                    <div
                      className="d-flex ps-3"
                      style={{
                        borderLeft: `3px solid ${color[index % color.length]}`,
                      }}
                    >
                      <div>
                        <h6 className="text-muted fs-12 fw-normal">{options?.labels?.[index]}</h6>
                        <div className="d-flex align-items-baseline">
                          <span className="fs-12 mb-0 ms-1 me-2">
                            {s}
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

export default LeadCaptureSource;

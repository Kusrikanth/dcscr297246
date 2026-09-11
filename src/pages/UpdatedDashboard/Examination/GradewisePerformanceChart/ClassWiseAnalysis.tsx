import ReactApexChart from "react-apexcharts";
import { useEffect, useMemo, useRef } from "react";
import { customSort } from "./helper";
import { useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { toast } from "react-toastify";

interface SectionWiseAnalysisProps {
  data: any;
  sectionList: any;
  formValues: any; 
}

const ClassWiseAnalysis = (props: SectionWiseAnalysisProps) => {
  const categories = useMemo(() => {
  const sectionIds = Object.keys(props?.data || {});  

  return sectionIds.map((id) => {
    const secObj = props?.sectionList?.find((s) => s.id === Number(id));
    return secObj?.shortName || `class-${id}`;
  });
  
}, [props?.data, props?.sectionList]);

const gradeList = useMemo(() => {
  const allGrades = new Set<string>();

  Object.values(props?.data || {}).forEach((gradeObj: any) => {
    Object.keys(gradeObj).forEach((g) => allGrades.add(g));
  });

  return Array.from(allGrades).sort((a, b) => customSort(a, b));
}, [props?.data]);

const series = useMemo(() => {
  const sectionIds = Object.keys(props?.data || {});

  return gradeList.map((grade) => ({
    name: grade,
    data: sectionIds.map((secId) => props.data[secId]?.[grade] || 0),
  }));
}, [props?.data, gradeList]);


  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      stacked: true,
      height: 328,
      toolbar: { show: false },
      zoom: {
        enabled: true,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: categories.length < 12 ? '35px' : '40%',
        borderRadius: 2,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
            },
          },
        },
      },
    },
    xaxis: {
      categories,
      labels: {
        style: {
          fontSize: "10px",
        },
        rotate: -45,
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "11px",
        },
      },
    },
    legend: {
      position: "bottom",
      fontSize: "13px",
    },
    fill: {
      opacity: 1,
    },
    colors: [
      "#405189",
      "#0AB39C",
      "#FEB019",
      "#F06548",
      "#2A9D8F",
      "#E9C46A",
      "#F4A261",
      "#6C757D",
    ],
    tooltip: {
      shared: false,
      intersect: true,
    },
  };

  const {
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    examinationManagementErrorResp,
    showApiLoader,
  } = useAppSelector(
    ({ appData, examinationManagement, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
      showApiLoader: globalData.showApiLoader,

    }),
    shallowEqual
  );


  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-center">
            <div className="tw-col-span-12">
              <h4 className="card-title tw-mb-0">Class wise Analysis</h4>
            </div>
            {/* <div className="col-auto ms-auto">
              <div className="d-flex">
                <button
                  id="export-btn"
                  className="btn btn-icon btn-rounded btn-soft-info p-2"
                  onClick={() => openExportExcelModal()}
                >
                  <img src={ExportIcon} className="img-fluid h-100"></img>
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </button>
              </div>
            </div> */}

          </div>
        </div>
        <div className="card-body">
          <div>
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={328}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassWiseAnalysis;

import { useEffect, useMemo, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { exportClassWiseAdmAnalysisAct, getClassWiseAdmAnalysisAct } from "../../../../store/FrontDesk/Reports/reportsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { useModal } from "../../../../hooks/modalhook";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { Button, ModalContainerUpdated } from "../../../../Components/Common";

const ClassWiseAdmissionsAnalysisBar = (props: any) => {
  const { branchId, academicYearId, curriculumId } = props;
  const dispatch = useAppDispatch()
  const [chartData, setChartData] = useState<any[]>([])
  const { closeModal: closeExportModal, openModal: openExportModal, modalState: exportModalState } = useModal()

  const {
    currentInstIdResp: instituteId, getClassWiseAdmAnalysisResp, brchCurriculumResp, exportClassWiseAdmAnalysisResp } =
    useAppSelector(({ appData, reports, branchAcademics }) => ({
      currentInstIdResp: appData.currentInstIdResp,
      getClassWiseAdmAnalysisResp: reports.getClassWiseAdmAnalysisResp,
      exportClassWiseAdmAnalysisResp: reports.exportClassWiseAdmAnalysisResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
    }), shallowEqual)

  const classWiseAdmAnalysisRef = useRef({
    prevExportClassWiseAdmAnalysisResp: exportClassWiseAdmAnalysisResp,
  });

  useEffect(() => {
    const { prevExportClassWiseAdmAnalysisResp } =
      classWiseAdmAnalysisRef.current;
    if (exportClassWiseAdmAnalysisResp && exportClassWiseAdmAnalysisResp !== prevExportClassWiseAdmAnalysisResp) {
      toast.success("Exported successfully");
      closeExportModal()
      downloadExcelFile(exportClassWiseAdmAnalysisResp, "Class_Wise_Admission_Analysis");
    }
    classWiseAdmAnalysisRef.current.prevExportClassWiseAdmAnalysisResp = exportClassWiseAdmAnalysisResp;

  }, [exportClassWiseAdmAnalysisResp]);

  const getClassWiseAdmAnalysisApiCall = (otherProps?: any) => {
    const curriculumName = brchCurriculumResp && brchCurriculumResp?.data?.find((curriculum: any) => +curriculum.branchCurriculumId === +curriculumId)?.curriculumName
    const payload = { instituteId, academicYearId, branchId, curriculumName, ...otherProps };
    if (payload.academicYearId) {
      dispatch(getClassWiseAdmAnalysisAct(generateActionPayload("get_class_wise_adm_analysis", undefined, payload)));
    }
  }

  const exportSubmitHndlr = () => {
    const curriculumName = brchCurriculumResp && brchCurriculumResp?.data?.find((curriculum: any) => +curriculum.branchCurriculumId === +curriculumId)?.curriculumName
    const payload = { instituteId, academicYearId, branchId, curriculumName };
    dispatch(exportClassWiseAdmAnalysisAct(generateActionPayload("export_class_wise_adm_analysis", undefined, payload, {
      responseType: 'blob'
    })));
  }

  useEffect(() => {
    if (academicYearId) {
      getClassWiseAdmAnalysisApiCall()
    }
  }, [branchId, academicYearId, curriculumId])

  useEffect(() => {
    if (Array.isArray(getClassWiseAdmAnalysisResp) && getClassWiseAdmAnalysisResp.length > 0) {
      const modifiedResp = getClassWiseAdmAnalysisResp.reduce((acc: any, curr: any) => {
        const findIdx = acc?.findIndex((item: any) => item.classShortName === curr.classShortName)
        if (findIdx > -1) {
          acc[findIdx] = { ...acc[findIdx], applications: acc[findIdx].applications + (curr.applications || 0), admissions: acc[findIdx].admissions + (curr.admissions || 0), admissionsTarget: acc[findIdx].admissionsTarget + (curr.admissionsTarget || 0) }
        } else {
          acc = [...acc, {
            classShortName: curr.classShortName,
            applications: curr.applications || 0,
            admissions: curr.admissions || 0,
            admissionsTarget: curr.admissionsTarget || 0
          }]
        }
        return acc
      }, [])
      setChartData(modifiedResp)
    } else {
      setChartData([])
    }
  }, [getClassWiseAdmAnalysisResp])

  const series: ApexAxisChartSeries | ApexNonAxisChartSeries = useMemo(() => {
    return [
      {
        name: "Applications",
        type: "column",
        data: chartData.map((item: any) => item.applications),
        color: "#0AB39C",
      },
      {
        name: "Admissions",
        type: "column",
        data: chartData.map((item: any) => item.admissions),
        color: "#405189",
      },
      {
        name: "Target",
        type: "column",
        data: chartData.map((item: any) => item.admissionsTarget),
        color: "#FAC364",
        // fill: {
        //   type: "gradient",
        //   gradient: {
        //     shade: "light",
        //     type: "vertical",
        //     shadeIntensity: 0.5,
        //     gradientToColors: ["#CED4DC"],
        //     inverseColors: false,
        //     opacityFrom: 0.6,
        //     opacityTo: 0.8,
        //     stops: [0, 100],
        //   },
        // },
      },
    ];
  }, [chartData]);

  const options: ApexCharts.ApexOptions = useMemo(
    () => ({
      chart: {
        height: 350,
        type: "line",
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          borderRadiusApplication: "end",
          borderRadius: 2,
          dataLabels: {
            position: "top",
            total: {
              enabled: true,
              style: {
                fontSize: "10px",
                fontWeight: 600,
              },
            },
          },
        },
      },
      dataLabels: {
        enabled: false,
        position: "bottom",
        offsetY: -20,
        style: {
          fontSize: "10px",
          colors: ["#333"],
          fontWeight: 500,
        },
        formatter: function (val: any, { seriesIndex }: any) {
          return val;
        },
      },
      stroke: {
        width: [0, 0, 1],
        dashArray: [0, 0, 0],
        curve: "smooth",
      },
      fill: {
        opacity: [1, 1, 1],
        gradient: {
          opacityFrom: 0.6,
          opacityTo: 0.8,
        },
      },
      markers: {
        size: [0, 0, 6],
        strokeWidth: 2,
        hover: {
          size: 6,
        },
      },
      xaxis: {
        categories: chartData.map((item: any) => item.classShortName),
      },
      yaxis: [
        {
          seriesName: "Male",
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: "#008FFB",
          },
          labels: {
            style: {
              colors: "#008FFB",
            },
          },
          // title: {
          //   text: "No.Of Applications",
          //   style: {
          //     color: "#008FFB",
          //   },
          // },
          min: 0,
          tooltip: {
            enabled: true,
          },
        },
      ],
      legend: {
        show: true,
        position: "bottom",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
    }),
    [chartData]
  );

  return (
    <>
      <div className="card !tw-rounded-2xl tw-w-full">
        <div className="card-header !tw-rounded-t-2xl">
          <div className="tw-grid tw-grid-cols-12 tw-items-center tw-gap-3">
            <div className="tw-col-span-12 lg:tw-col-span-4">
              <h4 className="card-title !tw-mb-0">
                Class Wise Analysis
              </h4>
            </div>
            <div className="tw-col-span-12 lg:tw-col-span-8">
              <div className="tw-flex tw-justify-end tw-gap-3">
                <Button
                  id="export-btn"
                  variant="exportBtn"
                  onClick={openExportModal}
                >
                  <img src={ExportIcon} className="tw-h-full tw-w-auto" />
                  <UncontrolledTooltip placement="bottom" target="export-btn">
                    Export
                  </UncontrolledTooltip>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="tw-p-0">
          <ReactApexChart
            options={options}
            series={series}
            type="bar"
            height={350}
          />
        </div>
      </div>
      <ModalContainerUpdated
        id="export-class-wise-admissions-analysis-modal"
        isOpen={exportModalState.showModal}
        toggle={closeExportModal}
        modalTitle="Export Application to Admission Summary"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportModalState.showModal}
          toggle={closeExportModal}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={exportSubmitHndlr}
          feature="admission"
          subFeature={"class_wise_analysis"}
          remarksText="Enter remarks to export Class Wise Admissions Analysis ?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default ClassWiseAdmissionsAnalysisBar;
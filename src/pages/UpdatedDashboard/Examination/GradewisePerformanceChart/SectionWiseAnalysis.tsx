import ReactApexChart from "react-apexcharts";
import { Button, ModalContainerUpdated, SelectInput } from "../../../../Components/Common";
import { useEffect, useMemo, useRef } from "react";
import { customSort } from "./helper";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { exportMarksEntryReportAct, exportSectionWiseAnalysisAct } from "../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import ExportModal from "../../../Directory/StudentManagement/ExportModal";
import { useModal } from "../../../../hooks/modalhook";
import ExportIcon from "../../../../assets/imagesdps/common_icon/export_icon.svg";
import { UncontrolledTooltip } from "reactstrap";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../../utility/commonutility";
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap";

interface SectionWiseAnalysisProps {
  data: any;
  sectionList: any;
  formValues: any; // Add formValues prop
}

const SectionWiseAnalysis = (props: SectionWiseAnalysisProps) => {
  const { closeModal: closeExportExcelModal, modalState: exportExcelState, openModal: openExportExcelModal } = useModal();
  const { modalState: duedateSmsModalState, closeModal: closeDuedateSmsModalHndlr, openModal: openDuedateSmsModalHndlr } = useModal();
  const dispatch = useAppDispatch();
  const categories = useMemo(
    () =>
      props?.data?.sections?.map(
        (section) =>
          props?.sectionList[section.id.toString()] || `Section-${section.id}`
      ) || [],
    [props?.data, props?.sectionList]
  );

  const series = useMemo(
    () =>
      props?.data?.grades
        .filter((grade) => grade.name !== "total")
        .sort((a, b) => customSort(a.name, b.name))
        ?.map((grade) => ({
          name: grade.name,
          data:
            props?.data?.sections?.map((section) => {
              const sectionId = section.id.toString();
              const sectionData = props?.data?.sectionGradeData[sectionId];
              return sectionData ? sectionData[grade.name] || 0 : 0;
            }) || [],
        })) || [],
    [props?.data]
  );

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
        columnWidth: categories.length < 9 ? '35px' : '45%',
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
    exportSectionWiseAnalysisResp,
        examinationManagementErrorResp,
        showApiLoader,
        exportMarksEntryReportResp
  } = useAppSelector(
    ({ instAcademics, branchAcademics, appData, examinationSettings, assignLanguages, examinationManagement, academicRequest, globalData }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
exportSectionWiseAnalysisResp: examinationManagement.exportSectionWiseAnalysisResp,
      examinationManagementErrorResp: examinationManagement.examinationManagementErrorResp,
      showApiLoader: globalData.showApiLoader,
      exportMarksEntryReportResp: examinationManagement.exportMarksEntryReportResp,

    }),
    shallowEqual
  );
      const studentReportGradeBookRef = useRef({
          prevExportSectionWiseAnalysisResp: exportSectionWiseAnalysisResp,
          prevExportMarksEntryReportResp: exportMarksEntryReportResp,
          prevCbseExaminationErrorResp: examinationManagementErrorResp,
       })
      useEffect(() => {
              const { prevExportSectionWiseAnalysisResp, prevCbseExaminationErrorResp, prevExportMarksEntryReportResp } = studentReportGradeBookRef.current;
              if (exportSectionWiseAnalysisResp && prevExportSectionWiseAnalysisResp !== exportSectionWiseAnalysisResp) {
                  toast.success("Data Download Successfully.");
                  closeExportExcelModal();
                  downloadExcelFile(exportSectionWiseAnalysisResp, 'section_wise_analysis.xlsx')
              }
              else if (exportMarksEntryReportResp && prevExportMarksEntryReportResp !== exportMarksEntryReportResp) {
                          toast.success("Data Download Successfully.");
                          closeDuedateSmsModalHndlr();
                          downloadExcelFile(exportMarksEntryReportResp, 'marks_entry_status.xlsx')
                      }
              studentReportGradeBookRef.current.prevExportSectionWiseAnalysisResp = exportSectionWiseAnalysisResp;
              studentReportGradeBookRef.current.prevCbseExaminationErrorResp = examinationManagementErrorResp;
              studentReportGradeBookRef.current.prevExportMarksEntryReportResp = exportMarksEntryReportResp;
          }, [exportSectionWiseAnalysisResp, examinationManagementErrorResp, exportMarksEntryReportResp]);
      
  const exportExcelHndler = () => {
    // Use the passed formValues instead of undefined examinationForm
    dispatch(exportSectionWiseAnalysisAct(
      generateActionPayload(
        "export_section_wise_analysis",
        undefined,
        {
          ...props.formValues,  // Use props.formValues instead of examinationForm.values
          branchId,
          instituteId
        },
        {
          responseType: 'blob'
        }
      )
    ));
  };

  const exportHndler = () => {
          const payload: any = {branchId, classIds: props.formValues.classId, branchCurriculumId: props.formValues.curriculumId, academicYearId: props.formValues.academicYearId, examinationId: props.formValues.examinationId, sectionIds: props.formValues.sectionId}
          delete payload.classId
          dispatch(exportMarksEntryReportAct(generateActionPayload("export_marks_entry_report", undefined, payload, {
              responseType: 'blob'
          })));
      }
  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-items-center">
            <div className="tw-col-span-12 lg:tw-col-span-6">
              <h4 className="card-title tw-mb-0">Section wise Analysis</h4>
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
            <div className="tw-col-span-12 lg:tw-col-span-6 tw-ms-auto">
              <UncontrolledDropdown direction="down">
                <DropdownToggle tag="a" id={`action-rowId`} role="button">
                  <Button
                    disabled={showApiLoader}
                    variant="info"
                  >
                    <span>Export</span>
                    <i className="ri-arrow-drop-down-line fs-16 ms-2"></i>
                  </Button>
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={openExportExcelModal}
                  >
                    Section Wise Analysis
                  </DropdownItem>
                  <DropdownItem
                    onClick={openDuedateSmsModalHndlr}
                  >
                    Marks Entry Report
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
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
      <ModalContainerUpdated
        id="students-performance-data"
        isOpen={exportExcelState.showModal}
        toggle={closeExportExcelModal}
        modalTitle="Export Section Wise Analysis"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportExcelState.showModal}
          toggle={closeExportExcelModal}
          instituteId={instituteId}
          submitHndlr={exportExcelHndler}
          feature="EXAM"
          subFeature="ANNUAL_EXAMS_SUBJECT_WISE_REPORT"
          remarksText="Enter remarks to Export Section Wise Analysis?"
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
                      id="students-performance-data"
                      isOpen={duedateSmsModalState.showModal}
                      toggle={closeDuedateSmsModalHndlr}
                      modalTitle="Export Marks Entry Report"
                      modalSize="md"
                  >
                      <ExportModal
                          isOpen={duedateSmsModalState.showModal}
                          toggle={closeDuedateSmsModalHndlr}
                          instituteId={instituteId}
                          // branchId={branchId}
                          submitHndlr={exportHndler}
                          feature="examination"
                          subFeature="marks_entry_status_report"
                          remarksText="Enter remarks to export Marks Entry Report?"
                      />
                  </ModalContainerUpdated>
    </>
  );
};

export default SectionWiseAnalysis;

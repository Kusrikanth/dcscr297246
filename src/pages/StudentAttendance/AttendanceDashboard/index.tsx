import React, { useEffect, useMemo, useRef, useState } from "react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import TransportStatistics from "./Statistics";
import AttendanceSummary from "./AttendanceSummary";
import { UncontrolledTooltip } from "reactstrap";
import ExportIcon from "../../../assets/imagesdps/common_icon/export_icon.svg";
import MonthlyAttandanceAnalysis from "./MonthlyAttandanceAnalysis";
import { DateInput, ModalContainerUpdated, SelectInput } from "../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import SectionWiseAttandance from "./SectionWiseAttandance";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getSectionList } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { exportMostAbsenteesDataAct, getAttendanceDashboardAct, getAttendanceSectionAnalysisAct } from "../../../store/StudentAttendance/DailyAttendance/dailyattendanceaction";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Current_Date_YYYYMMDD } from "../../../utility/dateutility";
import { getMasterSectionAct } from "../../../store/academic/academicRequest/academicrequestactions";
import { generateRowData } from "./helper";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import Button from "../../../Components/Common/Button";
import ExportModal from "../../Directory/StudentManagement/ExportModal";
import { useModal } from "../../../hooks/modalhook";
import { toast } from "react-toastify";
import { downloadExcelFile } from "../../../utility/commonutility";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  sectionId: "",
  startDate: Current_Date_YYYYMMDD,
  endDate: Current_Date_YYYYMMDD,
  absentesStartDate: Current_Date_YYYYMMDD,
  absentesEndDate: Current_Date_YYYYMMDD,
};
const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required('Academic Year is required'),
  curriculumId: Yup.string().required('Curriculum is required'),
  classId: Yup.string().required('Class is required'),
  sectionId: Yup.string().required('Section is required'),
})

const AttandanceDashboard = () => {
  const dispatch = useAppDispatch();
  const isFirstLoad = useRef(true);
const { closeModal: closeExportStudentResultListHnldr, openModal: openExportLoginHistoryModalHnldr, modalState: exportStudentResultListModalState } = useModal();
    
  const StudentAttendanceList = (otherProps?: any) => {
    const { academicYearId, curriculumId, classId, sectionId, absentesStartDate, absentesEndDate } = attDashboardForm.values || {};
    const payload = {
      academicYearId,
      curriculumId,
      instituteId,
      branchId,
      classId,
      sectionId,
      startDate: otherProps?.startDate ?? absentesStartDate,
      endDate: otherProps?.endDate ?? absentesEndDate,
      analysisFlag: "ONE MONTH",
      ...otherProps,
    };
    if (payload.academicYearId && payload.curriculumId && payload.classId && payload.sectionId) {
      dispatch(getAttendanceDashboardAct(generateActionPayload('attendance_dashboard_data', undefined, payload)))
    }
  }

  const submitExportHndlr = (otherProps?: any) => {
    const { academicYearId, curriculumId, classId, sectionId, absentesStartDate, absentesEndDate } = attDashboardForm.values || {};
    const payload = {
      academicYearId,
      curriculumId,
      instituteId,
      branchId,
      classId,
      sectionId,
      startDate: otherProps?.startDate ?? absentesStartDate,
      endDate: otherProps?.endDate ?? absentesEndDate,
      analysisFlag: "ONE MONTH",
      ...otherProps,
    };
    dispatch(exportMostAbsenteesDataAct(
      generateActionPayload(
        "export_most_absentees_data",
        undefined,
        payload,
        {
          responseType: 'blob'
        }
      )
    ));
  };

  const sectionAnalysisApiCall = (otherProps?: any) => {
    const { academicYearId, curriculumId, classId, startDate, endDate } = attDashboardForm.values || {};

    let payload = {
      branchId,
      instituteId,
      academicYearId,
      curriculumId,
      classId,
      startDate,
      endDate,
      ...otherProps,
    };
    if (payload.academicYearId && payload.curriculumId && payload.classId) {
      dispatch(getAttendanceSectionAnalysisAct(generateActionPayload('section_analysis_data', undefined, payload)))
    }
  }
  
  const getMasterSectionApiCall = (otherProps?: any) => {
    const { academicYearId, curriculumId } = attDashboardForm.values;
    let payload = {
      academicYearId,
      branchId,
      curriculumId,
      ...otherProps,
    };
    if (payload.academicYearId && payload.curriculumId) {
      dispatch(getMasterSectionAct(generateActionPayload('get_master_section', undefined, payload)))
    }
  }


  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getAttendanceDashboardResp,
    sectionListResp,
    getMasterSectionResp,
    getAttendanceSectionAnalysisResp,
    exportMostAbsenteesDataResp,
    stuDailyAttErrResp ,
  } = useAppSelector(
    ({ globalData, instAcademics, branchAcademics, appData, classroomManagmentInfo, dailyAttendance, academicRequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      getAttendanceDashboardResp: dailyAttendance.getAttendanceDashboardResp,
      getMasterSectionResp: academicRequest.getMasterSectionResp,
      getAttendanceSectionAnalysisResp: dailyAttendance.getAttendanceSectionAnalysisResp,
      exportMostAbsenteesDataResp : dailyAttendance.exportMostAbsenteesDataResp ,
      stuDailyAttErrResp : dailyAttendance.stuDailyAttErrResp ,

    }),
    shallowEqual
  );

  const dailyAttendanceRef = useRef<any>({
    prevStuDailyAttErrResp: stuDailyAttErrResp,
    preexportMostAbsenteesDataResp: exportMostAbsenteesDataResp,
  });

  useEffect(() => {
    const { prevStuDailyAttErrResp, preexportMostAbsenteesDataResp } = dailyAttendanceRef.current;

    if (stuDailyAttErrResp && stuDailyAttErrResp !== prevStuDailyAttErrResp) {
      const { details } = stuDailyAttErrResp || {};
      toast.error(details || "Something went wrong");
    }
    else if (exportMostAbsenteesDataResp && exportMostAbsenteesDataResp !== preexportMostAbsenteesDataResp) {
      toast.success("Attendance updated successfully.")
      downloadExcelFile(exportMostAbsenteesDataResp, "most_absentees");
      closeExportStudentResultListHnldr();
      StudentAttendanceList()
    }

    dailyAttendanceRef.current.prevStuDailyAttErrResp = stuDailyAttErrResp;
    dailyAttendanceRef.current.preexportMostAbsenteesDataResp = exportMostAbsenteesDataResp;
  }, [stuDailyAttErrResp, exportMostAbsenteesDataResp]);

  const attDashboardForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      StudentAttendanceList();
      sectionAnalysisApiCall();
      getMasterSectionApiCall();
    },
  });

  const handleAbsenteesDateChange = ({ startDate, endDate }: any) => {
    const newStartDate = startDate || "";
    const newEndDate = endDate || "";
    const {academicYearId, curriculumId, classId, sectionId, absentesStartDate, absentesEndDate} = attDashboardForm.values;
    
    if (absentesStartDate === newStartDate && absentesEndDate === newEndDate) {
      return;
    }

    attDashboardForm.setValues(
      (prev: any) => ({
        ...prev,
        absentesStartDate: newStartDate,
        absentesEndDate: newEndDate,
      }),
      false
    );

    if (!newStartDate || !newEndDate) {
      return;
    }
    
    StudentAttendanceList({startDate: newStartDate, endDate: newEndDate, academicYearId, curriculumId, classId, sectionId});
  };

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: attDashboardForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }
  const getClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: attDashboardForm.values?.academicYearId, curriculumId: attDashboardForm.values?.curriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(getInstAcademicYearAct(generateActionPayload("get_inst_academic_year", undefined, payload)));

    isFirstLoad.current = true;
    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
    }

  }, []);

  useEffect(() => {
    if (academicYearListResp) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId
      attDashboardForm.setFieldValue("academicYearId", yearId);
      getCurriculumApiCall({ academicYearId: yearId });
    }
  }, [academicYearListResp, branchId, instituteId]);

  useEffect(() => {
    const { data } = brchCurriculumResp || {};

    if (Array.isArray(data) && data.length > 0 && attDashboardForm.values.academicYearId) {
      const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId, academicYearId: attDashboardForm.values.academicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      attDashboardForm.setFieldValue("curriculumId", data[0].branchCurriculumId);
    }
  }, [brchCurriculumResp])

  useEffect(() => {
    const { content } = branchClassResp || {};
    if (Array.isArray(content) && content.length > 0) {
      attDashboardForm.setValues((prev: any) => ({ ...prev, classId: content[0].id }))
      getSectionListResp({ branchClassId: content[0]?.id });
    }
  }, [branchClassResp])

  useEffect(() => {
    const { data } = sectionListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      attDashboardForm.setValues((prev: any) => ({ ...prev, sectionId: data[0]?.sectionId }))

      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        StudentAttendanceList({ sectionId: data[0]?.sectionId });
        getMasterSectionApiCall();
        sectionAnalysisApiCall();
      }
    }
  }, [sectionListResp])

  useEffect(() => {
    if (attDashboardForm.values.academicYearId && attDashboardForm.values.curriculumId && attDashboardForm.values.classId) {
      getMasterSectionApiCall();
      sectionAnalysisApiCall();
    }
  }, [attDashboardForm.values.startDate, attDashboardForm.values.endDate])


  const getSectionListResp = (otherProps?: any) => {
    let payload = { branchClassId: attDashboardForm.values.classId || null, masterAcademicYearId: attDashboardForm.values.academicYearId, curriculumId: attDashboardForm.values.curriculumId, pageNo: 0, pageSize: 20, sortBy: "sectionName", orderBy: "asc", ...otherProps }
    if (payload.branchClassId && payload.masterAcademicYearId) {
      dispatch(
        getSectionList(
          generateActionPayload("get_section_list", undefined, payload)
        )
      );
    }
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    attDashboardForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
    }
    else if (name === 'curriculumId') {
      if (!value) {
        dispatch(resetBrchClassAct(undefined))
      }
      else {
        getClassApiCall({ curriculumId: value, academicYearId: attDashboardForm.values.academicYearId });
      }
    }
    else if (name === 'classId') {
      getSectionListResp({ branchClassId: value })
    }
  }

  const rowData = useMemo(() => (generateRowData(getMasterSectionResp, getAttendanceSectionAnalysisResp)), [getMasterSectionResp, getAttendanceSectionAnalysisResp]);

  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { data: academicYearList } = academicYearListResp || {};
  const { content: classTypes } = branchClassResp || {};

  return (
    <>
      <div className="page-content transportaion_dashboard_wrapper">
        <div className="container-fluid">
          <BreadCrumb title="Dashboard" pageTitle="Student Attendance" />

          <div className="tw-w-full tw-mb-3 ">
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
              <div className="tw-col-span-12">
                <div className="tw-bg-white tw-rounded-lg tw-shadow">
                  <div className="tw-border-b tw-p-4">
                    <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                      Student Attendance Dashboard
                    </h4>
                  </div>
                </div>
              </div>
              <div className="tw-col-span-12">
                <MonthlyAttandanceAnalysis
                  getAttendanceDashboardResp={getAttendanceDashboardResp}
                />
              </div>
              <div className="tw-col-span-12">
                <div className="tw-bg-white tw-rounded-lg tw-shadow">
                  <div className="tw-p-4">
                    <form onSubmit={attDashboardForm.handleSubmit}>
                      <div className="tw-grid tw-grid-cols-12 tw-gap-3">
                        <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                          <SelectInput
                            name="academicYearId"
                            value={attDashboardForm.values.academicYearId}
                            onChange={filterHandler}
                            menuItems={academicYearList || []}
                            valueKey="academicYearId"
                            textKey="academicYearName"
                            formgroupClassName="tw-mb-0"
                            labelText="Academic Year"
                            floatingLabel
                            invalid={attDashboardForm.touched.academicYearId &&
                              attDashboardForm.errors.academicYearId
                              ? true
                              : false}
                            error={attDashboardForm.touched.academicYearId &&
                              attDashboardForm.errors.academicYearId
                              ? attDashboardForm.errors.academicYearId
                              : ""}
                          />
                        </div>

                        <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                          <SelectInput
                            name="curriculumId"
                            value={attDashboardForm.values.curriculumId}
                            onChange={filterHandler}
                            menuItems={curriculumTypes || []}
                            valueKey="branchCurriculumId"
                            textKey="curriculumName"
                            formgroupClassName="tw-mb-0"
                            labelText="Curriculum"
                            floatingLabel
                            invalid={attDashboardForm.touched.curriculumId &&
                              attDashboardForm.errors.curriculumId
                              ? true
                              : false}
                            error={attDashboardForm.touched.curriculumId &&
                              attDashboardForm.errors.curriculumId
                              ? attDashboardForm.errors.curriculumId
                              : ""}
                          />
                        </div>

                        <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                          <SelectInput
                            name="classId"
                            value={attDashboardForm.values.classId}
                            onChange={filterHandler}
                            menuItems={classTypes || []}
                            valueKey="id"
                            textKey="shortName"
                            labelText="Class"
                            floatingLabel
                            formgroupClassName="tw-mb-0"
                            invalid={attDashboardForm.touched.classId &&
                              attDashboardForm.errors.classId
                              ? true
                              : false}
                            error={attDashboardForm.touched.classId &&
                              attDashboardForm.errors.classId
                              ? attDashboardForm.errors.classId
                              : ""}
                          />
                        </div>

                        <div className="tw-col-span-12 lg:tw-col-span-3 xl:tw-col-span-2">
                          <SelectInput
                            name="sectionId"
                            value={attDashboardForm.values.sectionId}
                            onChange={filterHandler}
                            menuItems={sectionListResp?.data || []}
                            valueKey="sectionId"
                            textKey="sectionName"
                            formgroupClassName="tw-mb-0"
                            labelText="Section"
                            floatingLabel
                            invalid={attDashboardForm.touched.sectionId &&
                              attDashboardForm.errors.sectionId
                              ? true
                              : false}
                            error={attDashboardForm.touched.sectionId &&
                              attDashboardForm.errors.sectionId
                              ? attDashboardForm.errors.sectionId
                              : ""}
                          />
                        </div>

                        <div className=" tw-flex tw-justify-end tw-items-end tw-gap-2 tw-ml-3">
                          <Button
                            type="submit"
                            variant="primary"
                            className="tw-flex-shrink-0 !tw-py-1.5 !tw-px-2  tw-ml-3"
                          >
                            Get Report
                          </Button>

                          <div className="tw-hidden">
                            <button
                              id="export-btn"
                              type="button"
                              className="tw-p-2 tw-rounded-full tw-bg-sky-100"
                            >
                              <img
                                src={ExportIcon}
                                className="tw-h-5"
                                alt="Export"
                              />
                              <UncontrolledTooltip
                                placement="bottom"
                                target="export-btn"
                              >
                                Export
                              </UncontrolledTooltip>
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="tw-col-span-12 tw-py-2">
                <TransportStatistics
                  getAttendanceDashboardResp={getAttendanceDashboardResp}
                />
              </div>
            </div>

            <div className="tw-grid tw-grid-cols-12 tw-gap-4 tw-pb-3">
              

              <div className="tw-col-span-12 xl:tw-col-span-7 tw-grid">
                <AttendanceSummary
                  getAttendanceDashboardResp={getAttendanceDashboardResp}
                  filterState={attDashboardForm.values}
                  onAbsenteesDateChange={handleAbsenteesDateChange}
                  openExportModal={openExportLoginHistoryModalHnldr}
                />
              </div>

              <div className="tw-col-span-12 xl:tw-col-span-5 tw-grid">
                <SectionWiseAttandance
                  filterState={attDashboardForm.values}
                  setFilterState={attDashboardForm.setValues}
                  rowData={rowData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalContainerUpdated
        id="export-login-history-modal"
        isOpen={exportStudentResultListModalState.showModal}
        toggle={closeExportStudentResultListHnldr}
        modalTitle="Export Most Absentees Details"
        modalSize="md"
      >
        <ExportModal
          isOpen={exportStudentResultListModalState.showModal}
          toggle={closeExportStudentResultListHnldr}
          instituteId={instituteId}
          branchId={branchId}
          submitHndlr={submitExportHndlr}
          feature="attendance"
          subFeature="attendance_summary"
          remarksText="Enter remarks to export Most Absentees details?"
        />
      </ModalContainerUpdated>
    </>
  );
};

export default AttandanceDashboard;

import React, { useState, useMemo, useEffect, useRef } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getBranchClassAct, getBranchCurriculumAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getInstAcademicYearAct } from "../../../store/mastersettings/instacademics/instacademicactions";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import AttendanceOverview from "./AttendanceOverview";
import MonthWiseAttendance from "./MonthWiseAttendance";
import CalenderView from "./CalenderView";

const initialValues:any = {
  search: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  requestType: "",
  tcRequestStatus: "",
  tcApplicationStartDt: "",
  tcApplicationEndDt: "",
  date: "",
};

const Attendance = () => {
  const dispatch = useDispatch();

  const [transferCertificateFilterState, setTransferCertificateFilterState] =
    useState<any>(initialValues);

  const [paginationFilter, setPaginationFilter] = useState({ pageNo: 0, pageSize: 10 })
  const { currentBranchIdResp: branchId, currentInstIdResp: instituteId, academicYearListResp, brchCurriculumResp,}: any =
    useAppSelector(
      ({ appData, instAcademics, branchAcademics, classroomManagmentInfo, globalData, login, directoryStudent }) => ({
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        loginUserDetailsResp: appData.loginUserDetailsResp,
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
      }),
      shallowEqual
    );



  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "desc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
    const payload1 = { branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }, []);
  useEffect(() => {
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId
    // academicsFilterForm.setValues((prev:any)=>({...prev,masterAcademicYearId:yearId}))
    setTransferCertificateFilterState((prev: any) => ({ ...prev, academicYearId: yearId }))
  }, [academicYearListResp])
  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    if (Array.isArray(data) && data.length > 0) {
      const payload = { branchId: branchId, curriculumId: data[0].branchCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      setTransferCertificateFilterState((prev: any) => ({ ...prev, curriculumId: data[0].branchCurriculumId }))
    }
  }, [brchCurriculumResp])


  return (
    <>
      <div className="page-content">
        <div className="container-fluid">
          <BreadCrumb title="Transfer Certificate" pageTitle="Request" />
          <div className="tw-grid tw-grid-cols-1 lg:tw-grid-cols-12 tw-gap-6">
            <div className="lg:tw-col-span-5">
              <AttendanceOverview />
            </div>
            <div className="lg:tw-col-span-7">
              <CalenderView />
            </div>
          </div>
          <MonthWiseAttendance />

          
        </div>
      </div>



    </>
  );
};

export default Attendance;

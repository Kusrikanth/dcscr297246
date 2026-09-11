import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import { useAppSelector } from "../../hooks/storehook";
import { getInstAcademicYearAct } from "../../store/mastersettings/instacademics/instacademicactions";
import { generateActionPayload } from "../../utility/reduxutility";
import { getSectionSubjectList } from "../../store/academic/classroomManagment/classroommanagmentactions";
import TableContainer from "../../Components/Common/TableContainer";
import { generateSectionSubjectColumns } from "./helper";
import { IPaginationState } from "../../Components/Common/Pagination";
import { useLocation } from "react-router-dom";

const SubjectsTab = (props: any) => {
  const [filter,setFilter]=useState({
    pageNo:0,
    pageSize:10
  });
  const dispatch = useDispatch();
  const location:any =  useLocation();

  const SubjectDetailsColumns = useMemo(
    () =>
    generateSectionSubjectColumns(),
    []
  );

  const SectionSubjectList=(otherProps?:any)=>{
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current").academicYearId
    if (props.optionalDetails && props.optionalDetails.sectionId && location.state?.academicYearId) {
      dispatch(
        getSectionSubjectList(
          generateActionPayload("section_subject_details", undefined, {
            academicClassSectionId: props.optionalDetails.sectionId, academicYearId: location.state?.academicYearId,...filter,...otherProps
          })
        )
      );
    }
  }

  function paginationHndlr(paginationInfo: IPaginationState) {
    setFilter((pre:any)=>({...pre,pageNo:paginationInfo.pageNo,pageSize:paginationInfo.pageSize}));
    SectionSubjectList(paginationInfo);
  }
  const { sectionSubjectList, academicYearListResp, currentInstIdResp: instituteId }: any =
    useAppSelector(
      ({ classroomManagmentInfo, instAcademics, appData }) => ({
        sectionSubjectList:
          classroomManagmentInfo.sectionSubjectList,
        academicYearListResp: instAcademics.academicYearListResp,
        currentInstIdResp: appData.currentInstIdResp,

      }),
      shallowEqual
    );
  useEffect(() => {
    const payload = { instituteId: instituteId, pageNo: 0, pageSize: 100, sortBy: "academicYearName", orderBy: "asc" };
    dispatch(
      getInstAcademicYearAct(
        generateActionPayload("get_inst_academic_year", undefined, payload)
      )
    );
  }, [])
  useEffect(()=>{
    SectionSubjectList()
  },[academicYearListResp])

  const { data: subjectList,totalElements,pageNumber,totalPages } = sectionSubjectList || {};

  return (
    <>
      <div className="tw-bg-white tw-rounded-xl tw-shadow-sm tw-mb-4">
        <div className="tw-border-b tw-px-6 tw-py-4">
          <h4 className="tw-text-base tw-font-semibold tw-text-gray-800 tw-mb-0">
            Students
          </h4>
        </div>
        <div className="tw-p-0">
          <TableContainer
            columns={SubjectDetailsColumns || []}
            data={subjectList || []}
            divClass="tw-overflow-x-auto tw-mb-3"
            theadClass="tw-bg-gray-50 tw-text-gray-500 tw-text-sm tw-align-middle"
            showPagination={true}
            totalPages={totalPages}
            totalRecords={totalElements}
            callbackPaginationHndlr={paginationHndlr}
            currentPageNumber={pageNumber}
          />
        </div>
      </div>
    </>
  );
};

export default SubjectsTab;

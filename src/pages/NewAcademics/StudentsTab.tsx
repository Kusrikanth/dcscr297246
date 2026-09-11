import React, { useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";
import TableContainer from "../../Components/Common/TableContainer";
import { useAppSelector } from "../../hooks/storehook";
import { getStudentListBySection } from "../../store/academic/classroomManagment/classroommanagmentactions";
import { generateActionPayload } from "../../utility/reduxutility";
import { generateSectionStudentColumns } from "./helper";
import { getInstAcademicYearAct } from "../../store/mastersettings/instacademics/instacademicactions";
import { IPaginationState } from "../../Components/Common/Pagination";
import { useLocation } from "react-router-dom";

const StudentsTab = (props: any) => {
  const [studentList, setStudentList] = useState([]);
  const location :any = useLocation();
  const [filter,setFilter]=useState<any>({
    pageNo:0,
    pageSize:10
  });
  const dispatch = useDispatch();

  const StudentDetailsColumns = useMemo(
    () =>
      generateSectionStudentColumns(),
    []
  );
  const SectionStudentList=(otherProps?:any)=>{
    let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus.toLowerCase() === "current").academicYearId
    if (props.optionalDetails && props.optionalDetails.sectionId && location.state?.academicYearId) {
      
      dispatch(
        getStudentListBySection(
          generateActionPayload("get_student_list_by_section", undefined, {
            academicClassSectionId: props.optionalDetails.sectionId, academicYearId: location.state?.academicYearId, searchString: "",...filter,...otherProps
          })
        )
      );
    }
  }
  function paginationHndlr(paginationInfo: IPaginationState) {
    setFilter((pre:any)=>({...pre,pageNo:paginationInfo.pageNo,pageSize:paginationInfo.pageSize}));
    SectionStudentList(paginationInfo);
  }

  const { studentListBySectionResp, academicYearListResp, currentInstIdResp: instituteId }: any =
    useAppSelector(
      ({ classroomManagmentInfo, instAcademics, appData }) => ({
        studentListBySectionResp:
          classroomManagmentInfo.studentListBySectionResp,
        academicYearListResp: instAcademics.academicYearListResp,
        currentInstIdResp: appData.currentInstIdResp,

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
  }, [])

  useEffect(() => {
    SectionStudentList();
  }, [academicYearListResp])

  useEffect(() => {
    studentListBySectionResp && setStudentList(studentListBySectionResp.data[0].sectionStudents);
  }, [studentListBySectionResp])

  const { totalElements,pageNumber,totalPages } = studentListBySectionResp || {};

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
            columns={StudentDetailsColumns || []}
            data={studentList || []}
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

export default StudentsTab;

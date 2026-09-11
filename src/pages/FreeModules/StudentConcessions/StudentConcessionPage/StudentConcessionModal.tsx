import React, { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "../../../../hooks/storehook";
import {
  UserDetails,
} from "../../../../Components/Common";
import { generatePreviousConcessionColumns } from "./helper";
import TableContainer from "../../../../Components/Common/TableContainer";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getStudentByIdAct, setGetStudentByIdAct } from "../../../../store/directory/studentmanagement/studentmanagementactions";
import {
  getPreviousStudentConcessionAct,
  setPreviousStudentConcessionAct
} from "../../../../store/fee/feeconcessions/feeconcessionactions";

const StudentConcessionModal = (props: any) => {
  const [concessionState, setConcessionState] = useState<any>([]);
  const {
    previousStudentConcessionResp, getStudentByIdResp
  }: any = useAppSelector(
    ({ feeConcession, directoryStudent }) => ({
      getStudentByIdResp: directoryStudent.getStudentByIdResp,
      previousStudentConcessionResp: feeConcession.previousStudentConcessionResp
    }),
    shallowEqual);

  const concessionModalRespRef = useRef({
    prevPreviousStudentConcessionResp: previousStudentConcessionResp
  });
  useEffect(() => {
    const { concessionDetails, dispatch, branchId } = props;
    if (concessionDetails) {
      const { curriculumId, academicYearId, classId, studentId } = concessionDetails;
      if (curriculumId && classId && studentId) {
        dispatch(getStudentByIdAct(generateActionPayload("get_students_by_id", {
          studentId
        }, { academicYearId })));

        const payload = {
          studentId: studentId,
          academicYearId: academicYearId,
          curriculumId: curriculumId,
          classId: classId,
          branchId: branchId,
        };
        dispatch(getPreviousStudentConcessionAct(generateActionPayload("student_concession_list", {
          pageNo: 0, pageSize: 100
        }, payload)));
      }
    }
    return () => {
      dispatch(setPreviousStudentConcessionAct(undefined));
      dispatch(setGetStudentByIdAct(undefined));
    }
  }, [props.concessionDetails]);

  useEffect(() => {
    const { prevPreviousStudentConcessionResp } = concessionModalRespRef.current;
    if (previousStudentConcessionResp && previousStudentConcessionResp !== prevPreviousStudentConcessionResp) {
      const { data } = previousStudentConcessionResp;
      if (Array.isArray(data)) {
        const concessionList: any = [];
        data.forEach((item: any) => {
          const { concessionChildList } = item;
          if (Array.isArray(concessionChildList)) {
            concessionChildList.forEach((childItem: any) => {
              const updateItems: any = Object.assign({}, childItem, {
                academicYearName: item?.academicYearName,
                remarks: item?.remarks,
                concessionType: item?.concessionType
              });
              concessionList.push(updateItems);
            });
          }

        })
        setConcessionState(concessionList);
      }
    }
    concessionModalRespRef.current.prevPreviousStudentConcessionResp = previousStudentConcessionResp;
  }, [previousStudentConcessionResp]);

  // useEffect(() => {
  //   const { prevGetStudentByIdResp } = concessionModalRespRef.current;
  //   if (getStudentByIdResp && getStudentByIdResp !== prevGetStudentByIdResp) {
  //     //
  //   }

  //   concessionModalRespRef.current.prevGetStudentByIdResp = getStudentByIdResp;
  // }, [getStudentByIdResp])

  const roleColumns = useMemo(() => generatePreviousConcessionColumns(), []);

  const { studentDetails, studentAcademicDetails } = getStudentByIdResp || {};
  return (
    <>
      <div className="modal-body p-0">
        <div className="d-flex flex-column align-items-center">
          <div className="w-100 p-3">
            <div className="row">
              <div className="col-3">
                <div className="d-inline-block">
                  <UserDetails
                    displayName={studentDetails?.studentName}
                    displayId={studentDetails?.studentCode}
                    size={"md"}
                    contentNotCenter={true}
                    paddingTop={"p-2"}
                    defaultImgType="student"
                  />
                </div>
              </div>
              {/* <div className="row"> */}
              <div className="col-3 p-2">
                <div className="row">
                  <div className="col-2">
                    <h6>
                      <span className="fw-bold">Class:</span>
                    </h6>
                  </div>
                  <div className="col">
                    <h6>
                      <span className="fw-bold text-muted">
                        {studentAcademicDetails?.className}
                      </span>
                    </h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-2">
                    <h6>
                      <span className="fw-bold">Section:</span>
                    </h6>
                  </div>
                  <div className="col">
                    <h6>
                      <span className="fw-bold text-muted">
                        {studentAcademicDetails?.sectionName}
                      </span>
                    </h6>
                  </div>
                </div>
              </div>
              <div className="col-6 p-2">
                <div className="row">
                  <div className="col-3">
                    <h6>
                      <span className="fw-bold">Email:</span>
                    </h6>
                  </div>
                  <div className="col">
                    <h6>
                      <span className="fw-bold text-muted">
                        {studentDetails?.emailId}
                      </span>
                    </h6>
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <h6>
                      <span className="fw-bold">Phone Number:</span>
                    </h6>
                  </div>
                  <div className="col">
                    <h6>
                      <span className="fw-bold text-muted">
                        {studentDetails?.contactNo}
                      </span>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-100 mb-4">
            <TableContainer
              columns={roleColumns}
              data={concessionState}
              divClass="table-responsive"
              theadClass="table-light text-muted align-middle"
            />
          </div>
        </div>
      </div>

    </>
  );
};

export default StudentConcessionModal;

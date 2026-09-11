import  { useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import {
  UserDetails,
} from "../../../Components/Common";
import { generatePreviousConcessionColumns } from "./helper";
import TableContainer from "../../../Components/Common/TableContainer";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getStudentByIdAct, setGetStudentByIdAct } from "../../../store/directory/studentmanagement/studentmanagementactions";
import {
  getPrevStuConcessionListV2Act,
  setPrevStuConcessionListV2Act
} from "../../../store/fee/feeconcessions/feeconcessionactions";

const StudentConcessionModal = (props: any) => {
  const [concessionState, setConcessionState] = useState<any[]>([]);
  const {
    getPrevStuConcessionListV2Resp, getStudentByIdResp
  } = useAppSelector(
    ({ feeConcession, directoryStudent }) => ({
      getStudentByIdResp: directoryStudent.getStudentByIdResp,
      getPrevStuConcessionListV2Resp: feeConcession.getPrevStuConcessionListV2Resp
    }),
    shallowEqual);

  const concessionModalRespRef = useRef({
    prevGetPrevStuConcessionListV2Resp: getPrevStuConcessionListV2Resp
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
        dispatch(getPrevStuConcessionListV2Act(generateActionPayload("stu_concession_list_v2", {
          pageNo: 0, pageSize: 100
        }, payload)));
      }
    }
    return () => {
      dispatch(setPrevStuConcessionListV2Act(undefined));
      dispatch(setGetStudentByIdAct(undefined));
    }
  }, [props.concessionDetails]);

  useEffect(() => {
    const { prevGetPrevStuConcessionListV2Resp } = concessionModalRespRef.current;
    if (getPrevStuConcessionListV2Resp && getPrevStuConcessionListV2Resp !== prevGetPrevStuConcessionListV2Resp) {
      const { data } = getPrevStuConcessionListV2Resp;
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
    concessionModalRespRef.current.prevGetPrevStuConcessionListV2Resp = getPrevStuConcessionListV2Resp;
  }, [getPrevStuConcessionListV2Resp]);

  const roleColumns = useMemo(() => generatePreviousConcessionColumns(), []);

  const { studentDetails, studentAcademicDetails } = getStudentByIdResp || {};
  return (
    <>
      <div className="tw-p-0">
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-w-full tw-p-3">
            <div className="tw-grid tw-grid-cols-12 tw-gap-4">
              <div className="tw-col-span-3">
                <div className="tw-inline-block">
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

              <div className="tw-col-span-3 tw-p-2">
                <div className="tw-grid tw-grid-cols-12 tw-mb-1">
                  <div className="tw-col-span-3">
                    <h6 className="tw-font-bold">Class:</h6>
                  </div>
                  <div className="tw-col-span-9">
                    <h6 className="tw-font-bold tw-text-muted">
                      {studentAcademicDetails?.className}
                    </h6>
                  </div>
                </div>

                <div className="tw-grid tw-grid-cols-12">
                  <div className="tw-col-span-3">
                    <h6 className="tw-font-bold">Section:</h6>
                  </div>
                  <div className="tw-col-span-9">
                    <h6 className="tw-font-bold tw-text-muted">
                      {studentAcademicDetails?.sectionName}
                    </h6>
                  </div>
                </div>
              </div>

              <div className="tw-col-span-6 tw-p-2">
                <div className="tw-grid tw-grid-cols-12 tw-mb-1">
                  <div className="tw-col-span-3">
                    <h6 className="tw-font-bold">Email:</h6>
                  </div>
                  <div className="tw-col-span-9">
                    <h6 className="tw-font-bold tw-text-muted">
                      {studentDetails?.emailId}
                    </h6>
                  </div>
                </div>

                <div className="tw-grid tw-grid-cols-12">
                  <div className="tw-col-span-3">
                    <h6 className="tw-font-bold">Phone Number:</h6>
                  </div>
                  <div className="tw-col-span-9">
                    <h6 className="tw-font-bold tw-text-muted">
                      {studentDetails?.contactNo}
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tw-w-full tw-mb-4">
            <TableContainer
              columns={roleColumns}
              data={concessionState}
              divClass="tw-overflow-x-auto"
              theadClass="tw-table-light tw-text-gray-500 tw-align-middle"
            />
          </div>
        </div>
      </div>

    </>
  );
};

export default StudentConcessionModal;

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SelectInput,
  TextInput,
  UserDetails,
} from "../../../../Components/Common";
import {
  promotionTypeOp
} from "./helper";
import { useFormik } from "formik";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { generateActionPayload } from "../../../../utility/reduxutility";
import {  getPromotedClassList, setPromotedClassList } from "../../../../store/academic/classroomManagment/classroommanagmentactions";
import { debounce, searhWithTextInList } from "../../../../utility/commonutility";
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { getSaveHostelPromoteStuListAct, saveHostelPromoteStuAct } from "../../../../store/hostel/hostelrequest/hostelrequestactions";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  promotedBy: "",
  classId: "",
  nextClassId: "",
  nextClassName: "",
  studentId: "",
  studentName: "",
  studentClass: "",
  students: []
};

const PromoteStudentsModal = (props: any) => {
  const dispatch = useAppDispatch();
  const [studentList, setStudentList] = useState<any>([])
  const [searchString, setSearchString] = useState('');
  const validationSchema = Yup.object().shape({
    curriculumId: Yup.string().required("Curriculum is required."),
    promotedBy: Yup.string().required("Promoted By is required."),
    classId: Yup.string().required("Class is required."),
    nextClassId: Yup.string().required("Promoted Class is required."),
  });
  const PromoteStudentForm = useFormik({
    // enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      let payload = {
        academicYearId: +values.academicYearId - 1,
        // newAcademicYearId: nextAcademicYear.academicYearId,
        curriculumId: values.curriculumId,
        classId: values.classId,
        promotedBy: values.promotedBy,
        currentAcademicYearId: props.currentAcademicYearId,
        nextClassId: values.nextClassId,
        studentIds: isCheck
      }
      dispatch(saveHostelPromoteStuAct(generateActionPayload('save_hostel_promote_stu', undefined, payload)))
    },
  });

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    promotedClassList,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getSaveHostelPromoteStuListResp,
  } = useAppSelector(
    ({ classroomManagmentInfo, instAcademics, branchAcademics, appData, globalData, hostelRequest, }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      promotedClassList: classroomManagmentInfo.promotedClassList,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getSaveHostelPromoteStuListResp: hostelRequest.getSaveHostelPromoteStuListResp,
      showApiLoader: globalData.showApiLoader
    }),
    shallowEqual
  );

  const promoteStudentRef = useRef({
    prevPromotedClassList: promotedClassList
  })

  useEffect(() => {
    const { prevPromotedClassList } = promoteStudentRef.current;
    if (promotedClassList && prevPromotedClassList !== promotedClassList) {
      if (Array.isArray(promotedClassList)) {
        if (promotedClassList.length === 1) {
          PromoteStudentForm.setFieldValue('nextClassId', promotedClassList[0].classId);
          PromoteStudentForm.setFieldValue('nextClassName', promotedClassList[0].className);
        } else if (promotedClassList.length > 1) {
          PromoteStudentForm.setFieldValue('nextClassId', "")
          PromoteStudentForm.setFieldValue('nextClassName', "");
        } else {
          toast.error("No classes are available to promote the student from this class.")
        }
      }
    }
    promoteStudentRef.current.prevPromotedClassList = promotedClassList;
  }, [promotedClassList])

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: PromoteStudentForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getClassApiCall(curriculumId: string) {
    const payload = {
      curriculumId, branchId,
      academicYearId : PromoteStudentForm.values.academicYearId,
      pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    if(name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      dispatch(resetBrchClassAct(undefined));
      dispatch(setPromotedClassList(undefined))
      PromoteStudentForm.setValues((prev: any) => ({ ...prev, [name]: value , curriculumId:"",classId:"",promotedBy:"",nextClassId:"", }))
    }
    else if (name === "curriculumId") {
      dispatch(setPromotedClassList(undefined))
      PromoteStudentForm.setValues((prev: any) => ({ ...prev, [name]: value , classId:"",promotedBy:"",nextClassId:"", }))
      getClassApiCall(value);
    }
    else if (name === "promotedBy") {
      PromoteStudentForm.setValues((prev: any) => ({ ...prev, [name]: value , classId:"", }))
    }
    else if (name === "classId") {
      PromoteStudentForm.setValues((prev: any) => ({ ...prev, [name]: value }))
      const { academicYearId, curriculumId, promotedBy } = PromoteStudentForm.values;
      const payload = { classId: value, branchId: branchId, curriculumId: curriculumId }
      dispatch(getPromotedClassList(generateActionPayload('promoted_class_list', undefined, payload)))
      if (promotedBy === "STUDENT") {
        let params = { academicYearId: +academicYearId - 1, curriculumId: curriculumId, classId: value, promotedBy: promotedBy , branchId, }
        dispatch(getSaveHostelPromoteStuListAct(generateActionPayload('get_save_hostel_promote_stu_list', undefined, params)))
      }
    }else{
      PromoteStudentForm.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  const [isCheck, setIsCheck] = useState<Array<number>>([]);
  const handleClick = (event: any, studentId: any) => {
    const { checked } = event.target;

    let arr = [...isCheck];

    if (!checked) {
      arr = arr.filter((item) => item !== +studentId);
    } else {
      arr = [...arr, +studentId];
    }
    setIsCheck(arr);
  };

  function search(event: any) {

    let abc = searhWithTextInList(getSaveHostelPromoteStuListResp, ['studentName', 'studentCode'], event.target.value);
    setStudentList(abc);
  }

  const debounceFun = useCallback(debounce(search, 200), [getSaveHostelPromoteStuListResp])

  const searchHandler = (event: any) => {
    setSearchString(event.target.value)
    debounceFun(event)
  }

  const selectAllHandler = (event: any) => {
    let arr: any = [];
    studentList && studentList.map((student: any) => arr.push(student.studentId));
    setIsCheck(arr);
  }
  const resetHandler = (event: any) => {
    setIsCheck([]);
  }

  useEffect(() => {
    if(Array.isArray(getSaveHostelPromoteStuListResp)){
      setStudentList(getSaveHostelPromoteStuListResp);
    }
  }, [getSaveHostelPromoteStuListResp])

  useEffect(() => {
    if (!props.isOpen) {
      PromoteStudentForm.resetForm();
      setIsCheck([]);
      setStudentList([]);

    }
    else {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId;
      PromoteStudentForm.setFieldValue('academicYearId', yearId);
    }
  }, [props.isOpen])

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  return (
    <>

      <div className="tw-p-5">
        <div className="tw-grid tw-grid-cols-12 tw-gap-4">

          <div
            className={
              PromoteStudentForm.values.promotedBy === "STUDENT"
                ? "tw-col-span-12 md:tw-col-span-6"
                : "tw-col-span-12"
            }
          >
            <SelectInput
              name="academicYearId"
              labelText="Academic Year"
              value={PromoteStudentForm.values.academicYearId}
              onChange={filterHandler}
              onBlur={PromoteStudentForm.handleBlur}
              menuItems={academicYearList}
              valueKey="academicYearId"
              textKey="academicYearName"
              labelClass="required"
              invalid={PromoteStudentForm.touched.academicYearId && PromoteStudentForm.errors.academicYearId ? true : false}
              error={PromoteStudentForm.touched.academicYearId && PromoteStudentForm.errors.academicYearId ? PromoteStudentForm.errors.academicYearId : ""}
            />
          </div>

          <div
            className={
              PromoteStudentForm.values.promotedBy === "STUDENT"
                ? "tw-col-span-12 md:tw-col-span-6"
                : "tw-col-span-12"
            }
          >
            <SelectInput
              name="curriculumId"
              labelText="Curriculum"
              value={PromoteStudentForm.values.curriculumId}
              onChange={filterHandler}
              onBlur={PromoteStudentForm.handleBlur}
              menuItems={curriculumTypes}
              valueKey="branchCurriculumId"
              textKey="curriculumName"
              labelClass="required"
              invalid={
                PromoteStudentForm.touched.curriculumId &&
                  PromoteStudentForm.errors.curriculumId
                  ? true
                  : false
              }
              error={
                PromoteStudentForm.touched.curriculumId &&
                  PromoteStudentForm.errors.curriculumId
                  ? PromoteStudentForm.errors.curriculumId
                  : ""
              }
            />
          </div>

          <div
            className={
              PromoteStudentForm.values.promotedBy === "STUDENT"
                ? "tw-col-span-12 md:tw-col-span-6"
                : "tw-col-span-12"
            }
          >
            <SelectInput
              name="promotedBy"
              labelText="Promoted By"
              value={PromoteStudentForm.values.promotedBy}
              onChange={filterHandler}
              onBlur={PromoteStudentForm.handleBlur}
              menuItems={promotionTypeOp}
              valueKey="promotedByType"
              textKey="promotedBy"
              labelClass="required"
              invalid={!!(PromoteStudentForm.touched.promotedBy && PromoteStudentForm.errors.promotedBy)}
              error={PromoteStudentForm.touched.promotedBy && PromoteStudentForm.errors.promotedBy}
            />

            <SelectInput
              name="classId"
              labelText="Promote From Class"
              value={PromoteStudentForm.values.classId}
              onChange={filterHandler}
              onBlur={PromoteStudentForm.handleBlur}
              menuItems={classTypes}
              valueKey="id"
              textKey="shortName"
              labelClass="required"
              invalid={
                  PromoteStudentForm.touched.promotedBy &&
                    PromoteStudentForm.errors.promotedBy
                    ? true
                    : false
                }
                error={
                  PromoteStudentForm.touched.promotedBy &&
                    PromoteStudentForm.errors.promotedBy
                    ? PromoteStudentForm.errors.promotedBy
                    : ""
                }
            />

            {promotedClassList?.length > 1 ? (
              <SelectInput
                name="nextClassId"
                labelText="Promoted Class"
                value={PromoteStudentForm.values.nextClassId}
                onChange={filterHandler}
                onBlur={PromoteStudentForm.handleBlur}
                menuItems={promotedClassList}
                valueKey="classId"
                textKey="classShortName"
                labelClass="required"
                invalid={
                  PromoteStudentForm.touched.nextClassId &&
                    PromoteStudentForm.errors.nextClassId
                    ? true
                    : false
                }
                error={
                  PromoteStudentForm.touched.nextClassId &&
                    PromoteStudentForm.errors.nextClassId
                    ? PromoteStudentForm.errors.nextClassId
                    : ""
                }
              />
            ) : (
              <TextInput
                name="nextClassId"
                value={promotedClassList && promotedClassList.length > 0 ? promotedClassList[0].className : ""}
                onChange={PromoteStudentForm.handleChange}
                onBlur={PromoteStudentForm.handleBlur}
                inputClassName="tw-bg-gray-100"
                formgroupClassName="tw-mb-0"
                labelText="Promoted Class"
                isDisabled={true}
                invalid={
                  PromoteStudentForm.touched.nextClassId &&
                    PromoteStudentForm.errors.nextClassId
                    ? true
                    : false
                }
                error={
                  PromoteStudentForm.touched.nextClassId &&
                    PromoteStudentForm.errors.nextClassId
                    ? PromoteStudentForm.errors.nextClassId
                    : ""
                }
              />)}
          </div>
          {PromoteStudentForm.values.promotedBy === "STUDENT" && (
            <div className="tw-col-span-12 md:tw-col-span-6">
              <label className="tw-block tw-mb-2 tw-font-medium">Select Students</label>

              <div className="tw-border tw-border-gray-300 tw-rounded-md tw-p-3">
                <div className="tw-relative">
                  <TextInput
                    name="search"
                    value={searchString}
                    onChange={searchHandler}
                    inputClassName="tw-bg-gray-100"
                    placeHolder="Search..."
                  />
                  <i className="ri-search-line tw-absolute tw-right-3 tw-top-1/2 -tw-translate-y-1/2 tw-text-gray-400" />
                </div>

                <div className="tw-my-3 tw-text-sm">
                  <span>Select :</span>
                  <span className="tw-text-blue-600 tw-cursor-pointer tw-ml-2" onClick={selectAllHandler}>All</span>
                  <span className="tw-text-blue-600 tw-cursor-pointer tw-ml-2" onClick={resetHandler}>None</span>
                </div>

                <div className="tw-space-y-2">
                  {studentList?.map((student: any) => (
                    <div key={student.studentId} className="tw-flex tw-items-center tw-gap-3">
                      <input
                        type="checkbox"
                        checked={isCheck.includes(+student.studentId)}
                        onClick={(e: any) => handleClick(e, student.studentId)}
                        className="tw-h-4 tw-w-4"
                      />
                      <UserDetails
                        imageUrl={student.studentPic}
                        displayName={student.studentName}
                        displayId={student.studentCode}
                        defaultImgType="student"
                        size="xs"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={props.toggle}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="primary"
            onClick={(e: any) => PromoteStudentForm.handleSubmit(e)}
            disabled={showApiLoader}
          >
            Promote
          </Button>
        </div>
      </div>

    </>
  );
};

export default PromoteStudentsModal;

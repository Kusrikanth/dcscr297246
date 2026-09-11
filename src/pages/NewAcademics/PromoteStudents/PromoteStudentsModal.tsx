import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  SelectInput,
  TextInput,
  UserDetails,
} from "../../../Components/Common";
import {
  PromoteStudentModalProps,
  PromoteStudentsDataTypes,
} from "./promoteStudentTypes";
import {
  promotionTypeOp
} from "./helper";
import { useFormik } from "formik";
import { shallowEqual, useDispatch } from "react-redux";
import { useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getHigherClassStudentForPromotion, promoteHigherClassStudent } from "../../../store/academic/classroomManagment/classroommanagmentactions";
import { debounce, searhWithTextInList } from "../../../utility/commonutility";
import * as Yup from 'yup';
import { advanceFilterClassListAct, advanceFilterCurriculumListAct, getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../store/assignlanguages/assignlanguagesaction";
import { resetAssignLanClassListAct } from "../../../store/assignlanguages/assignlanguagesslice";
import Button from "../../../Components/Common/Button";

const initialValues: PromoteStudentsDataTypes = {
  academicYearId: "",
  fromCurriculumId: "",
  newCurriculumId: "",
  promotedBy: "",
  fromClassId: "",
  nextClassId: "",
  nextClassName: "",
  studentId: "",
  studentName: "",
  studentClass: "",
  students: []
};

const PromoteStudentsModal = (props: PromoteStudentModalProps) => {
  const dispatch = useDispatch();
  const [studentList, setStudentList] = useState<any>([])
  const [searchString, setSearchString] = useState('');
  const validationSchema = Yup.object().shape({
    fromCurriculumId: Yup.string().required("From Curriculum is required."),
    newCurriculumId: Yup.string().required("To Curriculum is required."),
    promotedBy: Yup.string().required("Promoted By is required."),
    fromClassId: Yup.string().required("From Class is required."),
    nextClassId: Yup.string().required("To Class is required."),
  });
  const PromoteStudentForm = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      let payload = {
        academicYearId: +values.academicYearId - 1,
        curriculumId: values.fromCurriculumId,
        newCurriculumId: values.newCurriculumId,
        classId: values.fromClassId,
        promotedBy: values.promotedBy,
        currentAcademicYearId: values.academicYearId,
        nextClassId: values.nextClassId,
        studentIds: isCheck
      }
      dispatch(promoteHigherClassStudent(generateActionPayload('promote_higher_class_student', undefined, payload)))
    },
  });

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    higherClassStudentForPromo,
    promotedClassList,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    showApiLoader,
    getAssignLanClassListResp,
    getAssignListCurriculumResp,
    advanceFilterClassListResp,
    advanceFilterCurriculumListResp,
  } = useAppSelector(
    ({ classroomManagmentInfo, instAcademics, branchAcademics, appData, globalData, assignLanguages }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      higherClassStudentForPromo: classroomManagmentInfo.higherClassStudentForPromo,
      promotedClassList: classroomManagmentInfo.promotedClassList,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      advanceFilterClassListResp: assignLanguages.advanceFilterClassListResp,
      advanceFilterCurriculumListResp: assignLanguages.advanceFilterCurriculumListResp,
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
        PromoteStudentForm.setFieldValue('nextClassId', "")
        PromoteStudentForm.setFieldValue('nextClassName', "");
      }
    }
    promoteStudentRef.current.prevPromotedClassList = promotedClassList;
  }, [promotedClassList])

  const getOldClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: +PromoteStudentForm.values?.academicYearId - 1, curriculumId: PromoteStudentForm.values?.fromCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getNewClassApiCall = (otherProps?: any) => {
    const payload = { branchId: branchId, academicYearId: PromoteStudentForm.values?.academicYearId, curriculumId: PromoteStudentForm.values?.newCurriculumId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100, ...otherProps };
    dispatch(advanceFilterClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getNewCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: PromoteStudentForm.values?.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const getOldCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: +PromoteStudentForm.values?.academicYearId - 1, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(advanceFilterCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const filterHandler = (event: any) => {
    const { name, value } = event.target;
    PromoteStudentForm.handleChange(event);
    if (name === "academicYearId") {
      getNewCurriculumApiCall({ academicYearId: value });
      getOldCurriculumApiCall({ academicYearId: +value - 1 });
      dispatch(resetAssignLanClassListAct(undefined))
      PromoteStudentForm.setValues((prevState) => ({ ...prevState, [name]: value, curriculumId: "", fromClassId: "" }));
    }
    else if (name === "newCurriculumId") {
      const { academicYearId, } = PromoteStudentForm.values;
      if (value) {
        getNewClassApiCall({ academicYearId, curriculumId: value })
      }
    }
    else if (name === "fromClassId") {
      PromoteStudentForm.setValues((prevState) => ({ ...prevState, [name]: value, nextClassId: "" }));
      const { academicYearId, promotedBy, fromCurriculumId } = PromoteStudentForm.values;
      if (fromCurriculumId && value) {
        if (promotedBy === "STUDENT") {
          let params = { academicYearId: +academicYearId - 1, curriculumId: fromCurriculumId, classId: value, promotedBy: promotedBy }
          dispatch(getHigherClassStudentForPromotion(generateActionPayload('higher_class_student_for_promotion', undefined, params)))
        }
      }
    }
    else if (name === "fromCurriculumId") {
      if (!value) {
        dispatch(resetAssignLanClassListAct(undefined))
      }
      else {
        getOldClassApiCall({ "curriculumId": value, academicYearId: +PromoteStudentForm.values.academicYearId - 1 });
        PromoteStudentForm.setValues((prev: any) => ({ ...prev, [name]: value, nextClassId: "", fromClassId: "" }))
      }
    }
    else if (name === "promotedBy") {
      PromoteStudentForm.setFieldValue('fromClassId', "");
      PromoteStudentForm.setFieldValue('promotedClassId', "");
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

    let abc = searhWithTextInList(higherClassStudentForPromo, ['studentName', 'studentCode'], event.target.value);
    setStudentList(abc);
  }
  const debounceFun = useCallback(debounce(search, 200), [higherClassStudentForPromo])
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
    higherClassStudentForPromo && setStudentList(higherClassStudentForPromo);
  }, [higherClassStudentForPromo])
  useEffect(() => {
    if (!props.isOpen) {
      PromoteStudentForm.resetForm();
      setIsCheck([]);
      setStudentList([]);

    }
    else {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.yearStatus === "CURRENT")?.academicYearId;
      PromoteStudentForm.setFieldValue('academicYearId', yearId);
      getNewCurriculumApiCall({ academicYearId: yearId });
      getOldCurriculumApiCall({ academicYearId: +(yearId || 0) - 1 });
    }
  }, [props.isOpen])

  const newClassOptions = useMemo(() => {
    if (Array.isArray(getAssignLanClassListResp?.content) && getAssignLanClassListResp?.content.length > 0) {
      const findClassSeq = getAssignLanClassListResp?.content?.find((i: any) => +i?.id === +PromoteStudentForm.values.fromClassId)?.classSequence;
      return advanceFilterClassListResp?.content?.filter((i: any) => +i?.classSequence > +findClassSeq)
    }
  }, [getAssignLanClassListResp, advanceFilterClassListResp, PromoteStudentForm.values.fromClassId])

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {};
  const { content: classTypes } = getAssignLanClassListResp || {};
  return (
    <>
      <div className="tw-p-6">
        <div className="tw-grid tw-grid-cols-12 tw-gap-6">
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="academicYearId"
              labelText="New Academic Year"
              value={PromoteStudentForm.values.academicYearId}
              onChange={filterHandler}
              onBlur={PromoteStudentForm.handleBlur}
              menuItems={academicYearList}
              valueKey="academicYearId"
              formgroupClassName="tw-mb-0"
              textKey="academicYearName"
              labelClass="required"
              invalid={PromoteStudentForm.touched.academicYearId && PromoteStudentForm.errors.academicYearId ? true : false}
              error={PromoteStudentForm.touched.academicYearId && PromoteStudentForm.errors.academicYearId ? PromoteStudentForm.errors.academicYearId : ""}
            />
          </div>
          <div className="tw-col-span-12 md:tw-col-span-6">
            <SelectInput
              name="promotedBy"
              labelText="Promoted By"
              value={PromoteStudentForm.values.promotedBy}
              onChange={filterHandler}
              onBlur={PromoteStudentForm.handleBlur}
              menuItems={promotionTypeOp}
              valueKey="promotedByType"
              textKey="promotedBy"
              formgroupClassName="tw-mb-0"
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
          </div>
        </div>
        <div className="tw-relative tw-border tw-rounded-lg tw-p-6 tw-mt-6">
          <span className="tw-absolute -tw-top-3 tw-left-4 tw-bg-white tw-px-3 tw-text-sm tw-font-semibold tw-text-gray-600">
            Promote From
          </span>
          <div className="tw-grid tw-grid-cols-12 tw-gap-6">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="fromCurriculumId"
                labelText="Curriculum"
                value={PromoteStudentForm.values.fromCurriculumId}
                onChange={filterHandler}
                onBlur={PromoteStudentForm.handleBlur}
                menuItems={advanceFilterCurriculumListResp?.data}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                formgroupClassName="tw-mb-0"
                labelClass="required"
                invalid={
                  PromoteStudentForm.touched.fromCurriculumId &&
                    PromoteStudentForm.errors.fromCurriculumId
                    ? true
                    : false
                }
                error={
                  PromoteStudentForm.touched.fromCurriculumId &&
                    PromoteStudentForm.errors.fromCurriculumId
                    ? PromoteStudentForm.errors.fromCurriculumId
                    : ""
                }
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="fromClassId"
                labelText="Class"
                value={PromoteStudentForm.values.fromClassId}
                onChange={filterHandler}
                onBlur={PromoteStudentForm.handleBlur}
                menuItems={classTypes}
                valueKey="id"
                textKey="shortName"
                formgroupClassName="tw-mb-0"
                labelClass="required"
                invalid={
                  PromoteStudentForm.touched.fromClassId &&
                    PromoteStudentForm.errors.fromClassId
                    ? true
                    : false
                }
                error={
                  PromoteStudentForm.touched.fromClassId &&
                    PromoteStudentForm.errors.fromClassId
                    ? PromoteStudentForm.errors.fromClassId
                    : ""
                }
              />
            </div>
          </div>
        </div>
        <div className="tw-relative tw-border tw-rounded-lg tw-p-6 tw-mt-8">
          <span className="tw-absolute -tw-top-3 tw-left-4 tw-bg-white tw-px-3 tw-text-sm tw-font-semibold tw-text-gray-600">
            Promote To
          </span>
          <div className="tw-grid tw-grid-cols-12 tw-gap-6">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="newCurriculumId"
                labelText="Curriculum"
                value={PromoteStudentForm.values.newCurriculumId}
                onChange={filterHandler}
                onBlur={PromoteStudentForm.handleBlur}
                menuItems={curriculumTypes}
                formgroupClassName="tw-mb-0"
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelClass="required"
                invalid={
                  PromoteStudentForm.touched.newCurriculumId &&
                    PromoteStudentForm.errors.newCurriculumId
                    ? true
                    : false
                }
                error={
                  PromoteStudentForm.touched.newCurriculumId &&
                    PromoteStudentForm.errors.newCurriculumId
                    ? PromoteStudentForm.errors.newCurriculumId
                    : ""
                }
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="nextClassId"
                labelText="Class"
                value={PromoteStudentForm.values.nextClassId}
                onChange={filterHandler}
                onBlur={PromoteStudentForm.handleBlur}
                menuItems={newClassOptions}
                valueKey="id"
                textKey="shortName"
                formgroupClassName="tw-mb-0"
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
            </div>
          </div>
        </div>
        {PromoteStudentForm.values.promotedBy === "STUDENT" && (
          <div className="tw-mt-8">
            <h6 className="tw-font-semibold tw-mb-3">Select Students</h6>
            <div className="tw-border tw-rounded-lg tw-p-4">
              <TextInput
                name="search"
                value={searchString}
                onChange={searchHandler}
                formgroupClassName="tw-mb-4"
                placeHolder="Search..."
              />
              <div className="tw-flex tw-gap-4 tw-text-sm tw-mb-4">
                <span>Select:</span>
                <span
                  className="tw-text-blue-600 tw-cursor-pointer"
                  onClick={selectAllHandler}
                >
                  All
                </span>
                <span
                  className="tw-text-blue-600 tw-cursor-pointer"
                  onClick={resetHandler}
                >
                  None
                </span>
              </div>
              <div className="tw-space-y-3 tw-max-h-60 tw-overflow-y-auto">
                {studentList?.map((student: any) => (
                  <div
                    key={student.studentId}
                    className="tw-flex tw-items-center tw-gap-3"
                  >
                    <input
                      className="form-check-input tw-mr-3"
                      type="checkbox"
                      value=""
                      name="allSubject"
                      checked={isCheck.includes(+student.studentId)}
                      onClick={(event: any) => handleClick(event, student.studentId)}
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
        <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-4">
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
            onClick={(event: any) =>
              PromoteStudentForm.handleSubmit(event)
            }
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

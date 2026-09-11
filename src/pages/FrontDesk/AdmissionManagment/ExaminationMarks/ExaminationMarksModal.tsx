import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import BreadCrumb from '../../../../Components/Common/BreadCrumb'
import BackButtonText from '../../../../Components/Common/BackButtonText'
import { DateInput, SelectInput, StatusLabel, Switch } from '../../../../Components/Common'
import { useFormik } from 'formik'
import TableContainer from '../../../../Components/Common/TableContainer'
// import { generateExaminationMarksColumns } from './helper'
import { useAppSelector } from '../../../../hooks/storehook'
import { shallowEqual, useDispatch } from 'react-redux'
import * as Yup from "yup";
import { editExamMarksAct, getExamMarksByIdAct, getExamMarksListWhileSaveAct, getExaminationMarksListAct, resetExamMarksByIdAct, resetExamMarksListWhileSaveAct, resetExaminationMarksList, saveExaminationMarksAct } from '../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction'
import { generateActionPayload } from '../../../../utility/reduxutility'
import { getInstAcademicYearAct } from '../../../../store/mastersettings/instacademics/instacademicactions'
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, resetBrchCurriculumAct } from '../../../../store/branchsettings/branchacademics/branchacademicsactions'
import { ka } from 'date-fns/locale'
import { getAssignedClassSubjectsList } from '../../../../store/academic/classSubjects/classsubjectsactions'
import { getEvaluationClassList, resetEvaluationClassList } from '../../../../store/FrontDesk/Interview/interviewactions'
import { getStreamList } from '../../../../store/academic/assignGroup/assigngroupactions'
import { toast } from 'react-toastify'
import { useHistory, useLocation } from 'react-router-dom'
import { computeSubmitButtonError, generateExaminationMarksColumns } from './helper'
import { Current_Date } from '../../../../utility/dateutility'
import Button from '../../../../Components/Common/Button'

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  examDate: "",
  streamGroupId: "",
}

const ExaminationMarksModal = () => {

  const dispatch = useDispatch();
  const history = useHistory();
  const location: any = useLocation();

  const validationSchema = Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    curriculumId: Yup.string().required("Curriculum is required."),
    classId: Yup.string().required("Class is required."),
    examDate: Yup.string().required("Interview Date is required."),
  });

  const [examinationMarksFilter, setExaminationMarksFilter] = useState(initialValues);
  const [examinationMarksData, setExaminationMarksData] = useState<any>([]);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const [showSubmitBtnErr, setShowSubmitBtnErr] = useState<boolean>(true);

  const filterForm = useFormik({
    initialValues: examinationMarksFilter,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (value) => {
      ClassSubjectsList(value)
      ExaminationMarksList(value)
    }
  })

  const paginationRef = useRef({
    pageNo: 0,
    pageSize: 10
  })

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    applicationSaleListResp,
    sendPaymentLinkApplicationSaleStatusResp,
    sendEmailNotificationStatusResp,
    sendSMSNotificationStatusResp,
    cancelApplicationSaleByIdResp,
    examinationMarksListResp,
    assignedClassSubjectsListResp,
    examMarksListWhileSaveResp,
    applicationSaleError,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    evaluationClassList,
    streamListResp,
    saveExaminationMarksResp,
    getExamMarksByIdResp,
    userMeResp,
    editExamMarksResp,
    showApiLoader,
  } = useAppSelector(
    ({ globalData, assignGroupInfo, login, instAcademics, branchAcademics, appData, feeConcession, interview, feeCollections, applicationSale, classSubjectsInfo }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      userMeResp: login.userMeResp,
      branchClassResp: branchAcademics.branchClassResp,
      evaluationClassList: interview.evaluationClassList,
      applicationSaleListResp: applicationSale.applicationSaleListResp,
      sendPaymentLinkApplicationSaleStatusResp: applicationSale.sendPaymentLinkApplicationSaleStatusResp,
      sendEmailNotificationStatusResp: applicationSale.sendEmailNotificationStatusResp,
      sendSMSNotificationStatusResp: applicationSale.sendSMSNotificationStatusResp,
      cancelApplicationSaleByIdResp: applicationSale.cancelApplicationSaleByIdResp,
      getExamMarksByIdResp: applicationSale.getExamMarksByIdResp,
      editExamMarksResp: applicationSale.editExamMarksResp,
      saveExaminationMarksResp: applicationSale.saveExaminationMarksResp,
      streamListResp: assignGroupInfo.streamListResp,
      examinationMarksListResp: applicationSale.examinationMarksListResp,
      examMarksListWhileSaveResp: applicationSale.examMarksListWhileSaveResp,
      assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
      applicationSaleError: applicationSale.applicationSaleError,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
  );

  const ExamMarksRef = useRef({
    prevSaveExaminationMarksResp: saveExaminationMarksResp,
    prevApplicationSaleError: applicationSaleError,
    prevEditExamMarksResp: editExamMarksResp,
  })

  useEffect(() => {
    const { prevApplicationSaleError, prevSaveExaminationMarksResp, prevEditExamMarksResp } = ExamMarksRef.current;

    if (saveExaminationMarksResp && prevSaveExaminationMarksResp !== saveExaminationMarksResp) {
      toast.success("Examination marks added successfully.")
      history.push('/admission-management')
    }
    else if (editExamMarksResp && prevEditExamMarksResp !== editExamMarksResp) {
      toast.success("Examination marks edited successfully.")
      history.push('/admission-management')
    }
    else if (applicationSaleError && prevApplicationSaleError !== applicationSaleError) {
      const { details } = applicationSaleError;
      toast.error(details)
    }
    ExamMarksRef.current.prevSaveExaminationMarksResp = saveExaminationMarksResp;
    ExamMarksRef.current.prevEditExamMarksResp = editExamMarksResp;
    ExamMarksRef.current.prevApplicationSaleError = applicationSaleError;
  }, [applicationSaleError, saveExaminationMarksResp, editExamMarksResp])

  const allStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    let updateStudentState = [...examinationMarksData];
    updateStudentState.forEach((item: any) => {
        item.isSelected = checked;
    });

    setExaminationMarksData(updateStudentState);
}, [examinationMarksData]);

const singleStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget,
        registrationNumber = event.currentTarget.getAttribute("data-id"),
        studentRowIndex = examinationMarksData.findIndex((item: any) => item.studentRegId === Number(registrationNumber));
    if (studentRowIndex > -1) {
        const studentDetails: any = examinationMarksData[studentRowIndex];
        let updateStudentState = [...examinationMarksData];
        updateStudentState.splice(studentRowIndex, 1, {
            ...studentDetails, isSelected: checked,
        });
        setExaminationMarksData(updateStudentState);
        const isAllSelected = updateStudentState.every((item: any) => item.isSelected);
        setAllStudentSelectedState(isAllSelected);
    }
}, [examinationMarksData]);

  const TableValueChanged = useCallback((studentRegId: any, fieldName: any, value: any, subjectId?: any) => {
    if (fieldName === "subjectMarks") {
      let newSubjectDetails = examinationMarksData.find((mark: any) => mark.studentRegId === studentRegId).subjects.map((sub: any) => {
        if (sub.subjectId === subjectId) {
          if (value > sub.maxMarks) {
            return sub
          }
          return { ...sub, marksObtained: value }
        } else {
          return sub
        }

      })
      let data = examinationMarksData?.map((mark: any) => {
        if (mark.studentRegId === studentRegId) {
          const allMarksObtained = newSubjectDetails?.every(
            (subject: any) => {
              return subject.marksObtained !== '';
            }
          );
          return { ...mark, subjects: newSubjectDetails, isRecommend: allMarksObtained ? (mark?.isRecommend === null ? "" : mark?.isRecommend) : null }
        } else {
          return mark
        }
      })
      setExaminationMarksData(data)
    }
    else if (fieldName === "isAbsent") {
      let data;
      if (value) {
        data = examinationMarksData.map((mark: any) => mark.studentRegId === studentRegId ? { ...mark, [fieldName]: value, isRecommend: false, subjects: mark?.subjects?.map((i: any) => ({ ...i, marksObtained: "" })) } : mark);
      } else {
        data = examinationMarksData.map((mark: any) => mark.studentRegId === studentRegId ? { ...mark, [fieldName]: value, isRecommend: null } : mark);
      }
      setExaminationMarksData(data)
    }
    else {
      let data = examinationMarksData.map((mark: any) => mark.studentRegId === studentRegId ? { ...mark, [fieldName]: value } : mark);
      setExaminationMarksData(data)
    }
  }, [examinationMarksData]);

  const SubmitExaminationMarks = () => {
    const studentsMarks = examinationMarksData?.map((item: any) => {
      if(item.isSelected){
        let totalMarks: any = 0;
        const newSubjects = item?.subjects?.map((i: any) => {
          totalMarks += +i?.marksObtained;
          return {
            subjectId: i?.subjectId,
            marks: i?.marksObtained,
          }
        })
        return {
          studentRegId: item?.studentRegId,
          examScheduleDetailId: item?.examScheduleDetailId,
          recommended: (item.isRecommend && item?.isRecommend?.toLowerCase())==="yes" ? "YES" : "NO",
          absent: item?.isAbsent ? "YES" : "NO",
          subjects: newSubjects,
          totalMarks
        }
      }
    }).filter((f: any)=>f)
    let payload = {
      instituteId: examinationMarksData[0].instituteId,
      academicYearId: examinationMarksData[0].academicYearId,
      branchId: examinationMarksData[0].branchId,
      curriculumId: examinationMarksData[0].curriculumId,
      classId: examinationMarksData[0].classId,
      userName: userMeResp?.username,
      createdBy: 46,
      studentsMarks,
    }
    if (location?.state?.meId && location?.state?.srId) {
      const newPayload = {
        marksEntryId: location?.state?.meId,
        totalMarks: payload?.studentsMarks[0]?.totalMarks,
        recommended: payload?.studentsMarks[0]?.recommended,
        absent: payload?.studentsMarks[0]?.absent,
        examScheduleDetailId: payload?.studentsMarks[0]?.examScheduleDetailId,
        userName: userMeResp?.username,
        createdBy: 46,
        setupPanel: null,
        subjects: payload?.studentsMarks[0]?.subjects,
      }
      dispatch(editExamMarksAct(generateActionPayload("edit_exam_marks", { studentRegId: location?.state?.srId }, newPayload)));
    } else {
      dispatch(saveExaminationMarksAct(generateActionPayload("save_exam_subject_marks", undefined, payload)));
    }
  }

  const RecommendChangeHandler = (studentRegId: any, recommend: any) => {
    const newData = examinationMarksData?.map((item: any) => {
      if (+item?.studentRegId === studentRegId) {
        return { ...item, isRecommend: recommend };
      } else {
        return item;
      }
    });
    setExaminationMarksData(newData);
  }

  const getStreams = (otherProps?: any) => {
    const payload = { ...examinationMarksFilter, branchId: branchId, ...otherProps }
    dispatch(
      getStreamList(
        generateActionPayload("get_stream_list", undefined, payload)
      )
    );
  }
  const ExaminationMarksList = (otherProps?: any) => {
    const payload = { ...examinationMarksFilter, ...paginationRef.current, ...otherProps, branchId: branchId, instituteId: instituteId };
    dispatch(getExamMarksListWhileSaveAct(generateActionPayload('get_examination_marks_while_save', undefined, payload)))
  }
  const ClassSubjectsList = (otherProps?: any) => {
    const payload = { academicYearId: examinationMarksFilter.academicYearId, curriculumId: examinationMarksFilter.curriculumId, classId: examinationMarksFilter.classId, branchId: branchId, instituteId: instituteId, ...otherProps };

    if (payload.academicYearId && payload.curriculumId && payload.classId) {
      dispatch(
        getAssignedClassSubjectsList(
          generateActionPayload("get_exam_subject_list", undefined, payload)
        )
      );
    }
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: filterForm.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc" , ...otherProps };
    dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  const ChangeHandler = (event: any) => {
    const { name, value } = event.target;
    if (name === 'curriculumId') {
      setExaminationMarksFilter((prev: any) => ({ ...prev, classId: "", [name]: value }));
        if (value) {
          getClassApiCall({ curriculumId: value });
        }
        else {
          dispatch(resetEvaluationClassList(undefined));
        }
    }
    else if (name === "classId") {
      getStreams({ [name]: value })
      setExaminationMarksFilter((prev: any) => ({ ...prev, [name]: value }));
    }
    else if(name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value })
      dispatch(resetEvaluationClassList(undefined));
      setExaminationMarksFilter((prev: any) => ({ ...prev, [name]: value , curriculumId : "" , classId : "" }));
    }
    else {
      setExaminationMarksFilter((prev: any) => ({ ...prev, [name]: value }));
      // ClassSubjectsList({[name]:value})
      // ExaminationMarksList({ [name]: value })
    }

  }


  const examinationMarksColumns = useMemo(() => generateExaminationMarksColumns(assignedClassSubjectsListResp, TableValueChanged, RecommendChangeHandler,allStudentSelectedState,allStudentCheckHndlr,singleStudentCheckHndlr), [examinationMarksData, assignedClassSubjectsListResp]);

  function paginationHndlr(paginationInfo: any) {
    paginationRef.current = paginationInfo;
    ExaminationMarksList(paginationInfo);
  }

  useEffect(() => {
    if (streamListResp?.content?.length === 0) {
      setExaminationMarksFilter((prev: any) => ({ ...prev, streamGroupId: "" }))
    }
  }, [streamListResp])
  useEffect(() => {

    return () => {
      dispatch(resetBrchCurriculumAct(undefined));
      dispatch(resetBrchClassAct(undefined));
      dispatch(resetExaminationMarksList(undefined));
      dispatch(resetExamMarksListWhileSaveAct(undefined));
      dispatch(resetExamMarksByIdAct(undefined));
    }
  }, []);

  useEffect(() => {
    const { data } = academicYearListResp || {};
    if (Array.isArray(data) && data.length > 0) {
      let yearId = academicYearListResp && academicYearListResp.data.find((year: any) => year.isAdmissionDefault)?.academicYearId
      setExaminationMarksFilter((prev: any) => ({ ...prev, academicYearId: yearId }))
      if(!location?.state?.meId){
        getCurriculumApiCall({ academicYearId: yearId })
      }
    }
  }, [academicYearListResp]);

  function getClassApiCall(otherProps?: any) {
    const payload = { academicYearId: examinationMarksFilter.academicYearId,branchId, curriculumId: examinationMarksFilter.curriculumId, evaluationCode: "EXAM", ...otherProps };
    if (payload.academicYearId && payload.curriculumId) {
      dispatch(getEvaluationClassList(generateActionPayload('get_evaluation_class_list', undefined, payload)));
    }
  }

  useEffect(() => {
    if (location?.state?.meId && location?.state?.srId) {
      dispatch(getExamMarksByIdAct(generateActionPayload('get_examination_marks_by_id', { studentRegId: location?.state?.srId, marksEntryId: location?.state?.meId }, undefined)));
    }
  }, [location?.state])

  useEffect(() => {
    if (getExamMarksByIdResp) {
      const { instituteId, branchId, academicYearId, curriculumId, classId, examDate } = getExamMarksByIdResp || {}
      getCurriculumApiCall({ academicYearId })
      getClassApiCall({ curriculumId,academicYearId });
      setExaminationMarksFilter((prev: any) => ({ ...prev, academicYearId, curriculumId, classId, examDate }))
      ClassSubjectsList({ instituteId, branchId, academicYearId, curriculumId, classId })
      let data = { ...getExamMarksByIdResp, isAbsent: (getExamMarksByIdResp?.absent?.toLowerCase() === "no" || getExamMarksByIdResp?.absent?.toLowerCase() === "false") ? false : true, isRecommend: getExamMarksByIdResp?.recommended ? (getExamMarksByIdResp?.recommended?.toLowerCase() === "no" ? "no" : "yes") : null , isSelected : true }
      setExaminationMarksData([data])
    }
  }, [getExamMarksByIdResp])

  useEffect(() => {

    if (examMarksListWhileSaveResp) {
      let data = examMarksListWhileSaveResp?.data?.map((prev: any) => ({ ...prev, isAbsent: false, isRecommend: null, subjects: prev?.subjects?.map((i: any) => ({ ...i, marksObtained: "",isSelected : false })) }))
      setExaminationMarksData(data)
    }

  }, [examMarksListWhileSaveResp])


  const submitButtonError = useMemo(() => computeSubmitButtonError(examinationMarksData), [examinationMarksData]);

  const { data: academicYearData } = academicYearListResp || {};
  const { data: curriculumTypes } = brchCurriculumResp || {};
  const { content: classTypes } = branchClassResp || {};
  const { content: branchStreamList } = streamListResp || {};

  return (
    <div className="page-content new_fee_receipt_page_warp">
      <div className="container-fluid">
        <BreadCrumb pageTitle="Admissions" />
        <div className="tw-bg-white tw-rounded-lg tw-shadow">
          <div className="tw-border-b tw-border-gray-200 tw-px-4 tw-py-3">
            <div className="tw-flex tw-items-center">
              <div className="tw-flex-1">
                <h4 className="tw-text-base tw-font-semibold tw-mb-0">
                  Marks Entry
                </h4>
              </div>
            </div>
          </div>
          <div className="tw-px-4 tw-py-4">
            <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-pb-2" style={{ borderBottom: "1px dashed #CFCFCF" }}>
              <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                <SelectInput
                  name="academicYearId"
                  formgroupClassName="tw-mb-1"
                  value={examinationMarksFilter?.academicYearId}
                  onChange={ChangeHandler}
                  menuItems={academicYearData || []}
                  valueKey="academicYearId"
                  textKey="academicYearName"
                  defaultSelect="Academic Year"
                  invalid={filterForm.touched.academicYearId && filterForm.errors.academicYearId ? true : false}
                  error={filterForm.touched.academicYearId && filterForm.errors.academicYearId ? filterForm.errors.academicYearId : ""}
                  isDisabled={location?.state?.meId && location?.state?.srId && true}
                />
              </div>

              <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                <SelectInput
                  name="curriculumId"
                  formgroupClassName="tw-mb-1"
                  value={examinationMarksFilter?.curriculumId}
                  onChange={ChangeHandler}
                  menuItems={curriculumTypes || []}
                  valueKey="branchCurriculumId"
                  textKey="curriculumName"
                  defaultSelect="Curriculum"
                  invalid={filterForm.touched.curriculumId && filterForm.errors.curriculumId ? true : false}
                  error={filterForm.touched.curriculumId && filterForm.errors.curriculumId ? filterForm.errors.curriculumId : ""}
                  isDisabled={location?.state?.meId && location?.state?.srId && true}
                />
              </div>

              <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                <SelectInput
                  name="classId"
                  formgroupClassName="tw-mb-1"
                  value={examinationMarksFilter?.classId}
                  onChange={ChangeHandler}
                  menuItems={evaluationClassList || []}
                  valueKey="branchClassId"
                  textKey="className"
                  defaultSelect="Class"
                  invalid={filterForm.touched.classId && filterForm.errors.classId ? true : false}
                  error={filterForm.touched.classId && filterForm.errors.classId ? filterForm.errors.classId : ""}
                  isDisabled={location?.state?.meId && location?.state?.srId && true}
                />
              </div>

              {branchStreamList?.length > 0 && (
                <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                  <SelectInput
                    name="streamGroupId"
                    formgroupClassName="tw-mb-1"
                    value={examinationMarksFilter?.streamGroupId}
                    onChange={ChangeHandler}
                    menuItems={branchStreamList || []}
                    valueKey="id"
                    textKey="shortName"
                    defaultSelect="Group"
                    invalid={filterForm.touched.streamGroupId && filterForm.errors.streamGroupId ? true : false}
                    error={filterForm.touched.streamGroupId && filterForm.errors.streamGroupId ? filterForm.errors.streamGroupId : ""}
                    isDisabled={location?.state?.meId && location?.state?.srId && true}
                  />
                </div>
              )}

              <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                <DateInput
                  name="examDate"
                  value={examinationMarksFilter?.examDate}
                  onChange={ChangeHandler}
                  placeHolder="dd-mm-yyyy"
                  invalid={filterForm.touched.examDate && filterForm.errors.examDate ? true : false}
                  error={filterForm.touched.examDate && filterForm.errors.examDate ? filterForm.errors.examDate : ""}
                  maxDate={Current_Date}
                  isDisabled={location?.state?.meId && location?.state?.srId && true}
                />
              </div>

              <div className="tw-col-span-12 md:tw-col-span-6 lg:tw-col-span-3 xl:tw-col-span-2">
                <button
                  type="submit"
                  className="tw-px-5 tw-py-2 tw-text-white tw-whitespace-nowrap tw-rounded"
                  style={{ background: "#5DA1C8" }}
                  disabled={location?.state?.meId && location?.state?.srId && true}
                  onClick={() => { filterForm.handleSubmit(); setShowSubmitBtnErr(true) }}
                >
                  Show Details
                </button>
              </div>
            </div>

            <TableContainer
              columns={examinationMarksColumns || []}
              data={examinationMarksData || []}
              divClass="tw-overflow-x-auto tw-mb-1"
              theadClass="tw-bg-gray-100 tw-text-gray-500 tw-align-middle"
              onChangeInputHndlr={TableValueChanged}
            />
          </div>

          <div className="tw-me-5 tw-mb-4">
            <div className="tw-flex tw-gap-2  tw-justify-end tw-items-end !tw-mb-3">
              <Button
                type="button"
                variant='secondary'
                onClick={() => { history.push('/admission-management') }}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant='primary'
                disabled={(submitButtonError === undefined || submitButtonError || showApiLoader) && true}
                onClick={() => SubmitExaminationMarks()}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExaminationMarksModal

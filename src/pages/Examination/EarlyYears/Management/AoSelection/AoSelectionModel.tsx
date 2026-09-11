import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {  generateColumnsI } from "./helper";
import { IChangeAoSelectionProps } from "./AoSelectionTypes";
import { SelectInput } from "../../../../../Components/Common";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../../store/assignlanguages/assignlanguagesaction";
import { getAoInsideSubjectsAct, resetAoInsideSubjectsAct, saveAoTermSubjectsAct, updateAoTermSubjectsAct } from "../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { getAoMappingSubjectAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { resetAssignLanClassListAct } from "../../../../../store/assignlanguages/assignlanguagesslice";

const initialValues = {
  academicYearId: "",
  subjectId: "",
  termId: "",
  classId: "",
  curriculumId: "",
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required."),
  curriculumId: Yup.string().required("Curriculum is required."),
  classId: Yup.string().required("Class is required.").nullable(),
  termId: Yup.string().required("Term is required."),
  subjectId: Yup.string().required("Subject is required."),
});

const AoSelection: React.FC<IChangeAoSelectionProps> = (props) => {
  const dispatch = useAppDispatch();
  const [selectedSubjectState, setSelectedSubjectState] = useState<any[]>([]);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);

  const isEy = location.pathname.includes("/early-years-management");

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    getIgseTermNameListResp,
    getAssignLanClassListResp,
    getAssignListCurriculumResp,
    getAoInsideSubjectsResp,
    getAoMappingSubjectResp,
    getAoTermSubjectsByIdResp

  } = useAppSelector(
    ({ instAcademics, appData, examinationManagement, examinationSettings, assignLanguages }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      getAoInsideSubjectsResp: examinationManagement.getAoInsideSubjectsResp,
      getAoMappingSubjectResp: examinationSettings.getAoMappingSubjectResp,
      getAoTermSubjectsByIdResp: examinationManagement.getAoTermSubjectsByIdResp,

    }),
    shallowEqual
  );

  const changeAoSelectionFormik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const selectedAos = selectedSubjectState
        .flatMap(subject => subject.examinationAos)
        .filter(ao => ao.isSelected)
        .map(ao => ao.aoSubjectDetailsId);
      const payload = {
        branchId,
        academicYearId: values.academicYearId,
        curriculumId: values.curriculumId,
        classId: values.classId,
        termId: values.termId,
        subjectId: values.subjectId,
        subjectDetailsIds: selectedAos,
      }
      if (props.modalData1) {
        dispatch(updateAoTermSubjectsAct(generateActionPayload("update_ao_term_subjects", { id: props.modalData1 }, { subjectDetailsIds: selectedAos })));
      }
      else {
        dispatch(saveAoTermSubjectsAct(generateActionPayload("save_ao_term_subjects", undefined, payload)));
      }
    },
  });


  const getAoMappingApiCall = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: changeAoSelectionFormik.values.academicYearId,
      curriculumId: changeAoSelectionFormik.values.curriculumId,
      classId: changeAoSelectionFormik.values.classId,
      termId: changeAoSelectionFormik.values.termId,
      subjectId: changeAoSelectionFormik.values.subjectId,
      ...otherProps,
    }
    if (payload.academicYearId && payload.curriculumId && payload.classId && payload.termId && payload.subjectId) {
      dispatch(getAoMappingSubjectAct(generateActionPayload("get_ao_mapping_subjects", undefined, payload)));
    }
  }

  const getSubjectList = (otherProps?: any) => {

    const payload = {
      academicYearId: changeAoSelectionFormik.values.academicYearId, curriculumId: changeAoSelectionFormik.values.curriculumId, branchClassId: changeAoSelectionFormik.values.classId,
      sortBy: "subjectName", orderBy: "asc",
      pageNo: 0, pageSize: 100,
      ...otherProps
    }
    if (payload.academicYearId && payload.curriculumId && payload.branchClassId) {
      dispatch(
        getAoInsideSubjectsAct(
          generateActionPayload("get_assigned_class_subject_list", undefined, payload)
        )
      );
    }
  }

  useEffect(() => {
    if (changeAoSelectionFormik.values.academicYearId && changeAoSelectionFormik.values.curriculumId) {
      getClassApiCall(changeAoSelectionFormik.values.curriculumId);
    }
  }, [changeAoSelectionFormik.values.academicYearId, changeAoSelectionFormik.values.curriculumId]);

  function getClassApiCall(selectedCurriculumId: string) {
    const payload = {
      academicYearId: changeAoSelectionFormik.values.academicYearId,
      curriculumId: selectedCurriculumId,
      branchId,
      pageNo: 0, classFilter: isEy ? "EARLY" : "HIGHER", pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };

    dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: changeAoSelectionFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }


  useEffect(() => {
    const content = getAoMappingSubjectResp?.content || [];
    const selectedAos = getAoTermSubjectsByIdResp?.examinationAos?.map((item: any) => item.aoSubjectDetailsId) || [];
    
    const updatedSubjects = content.map((subject: any) => ({
      ...subject,
      examinationAos: subject.examinationAos?.map((item: any) => ({
        ...item,
        isSelected: props.modalData1 ? selectedAos.includes(item.aoSubjectDetailsId) : false
      })) || []
    }));
  
    setSelectedSubjectState(updatedSubjects);
    const allSelected = selectedAos.length > 0 && props.modalData1 && selectedAos.length === content[0]?.examinationAos.length;
    setAllStudentSelectedState(allSelected);

  }, [getAoMappingSubjectResp, getAoTermSubjectsByIdResp]);

  useEffect(() => {
    if (getAoTermSubjectsByIdResp && props.modalData1) {
      const { academicYearId, curriculumId, classId, subjectId, termId } = getAoTermSubjectsByIdResp;
      changeAoSelectionFormik.setValues({ academicYearId, curriculumId, classId, subjectId, termId });
      getCurriculumApiCall({ academicYearId });
      getSubjectList({ academicYearId, curriculumId, branchClassId: classId });
      getAoMappingApiCall({ academicYearId, curriculumId, classId, subjectId, termId });
    }
  }, [getAoTermSubjectsByIdResp]);

  useEffect(() => {
    if (props.modalData) {
      const { academicYearId, subjectId, termId, classId, curriculumId } = props.modalData;
      changeAoSelectionFormik.setFieldValue("academicYearId", academicYearId);
      changeAoSelectionFormik.setFieldValue("curriculumId", curriculumId);
      changeAoSelectionFormik.setFieldValue("classId", classId);
      changeAoSelectionFormik.setFieldValue("subjectId", subjectId);
      changeAoSelectionFormik.setFieldValue("termId", termId);

      if (academicYearId) {
        getCurriculumApiCall({ academicYearId })
      }
      if (classId && curriculumId && academicYearId) {
        getSubjectList({ curriculumId, academicYearId, branchClassId: classId })
      }
      if (classId && curriculumId && academicYearId) {
        getAoMappingApiCall({ classId, curriculumId, academicYearId, subjectId, termId });
      }
    }
  }, []);

  useEffect(() => {
    const { data } = getAssignListCurriculumResp || {};

    if (Array.isArray(data) && data.length > 0 && changeAoSelectionFormik.values.academicYearId) {
      const selectedCurriculum = isEy ? data.find((item) => item.shortName === "EY1-EY3") : data.find(
        (item) => item.shortName === "IGCSE"
      );

      if (!selectedCurriculum) {
        dispatch(resetAoInsideSubjectsAct(undefined));
        dispatch(resetAssignLanClassListAct(undefined));
        changeAoSelectionFormik.setFieldValue("curriculumId", undefined)
        changeAoSelectionFormik.setFieldValue("subjectId", undefined)
        return;
      }

      const payload = {
        branchId,
        curriculumId: selectedCurriculum.branchCurriculumId,
        academicYearId: changeAoSelectionFormik.values.academicYearId,
        classFilter: isEy ? "EARLY" : "HIGHER",
        sortBy: "classSequence",
        orderBy: "asc",
        pageNo: 0,
        pageSize: 100,
      };

      dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));

      changeAoSelectionFormik.setFieldValue("curriculumId", selectedCurriculum.branchCurriculumId);
    }
  }, [getAssignListCurriculumResp]);

  const allStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    let updateStudentState = [...selectedSubjectState];
    updateStudentState?.[0]?.examinationAos.forEach((item: any) => {
      item.isSelected = checked;
      if (!checked) {
        item.errors = {};
      }
    });
    setSelectedSubjectState(updateStudentState);
  }, [selectedSubjectState]);

  const singleStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget
    const aoSubjectDetailsId = event.currentTarget.getAttribute("data-id")
    const studentRowIndex = selectedSubjectState?.[0]?.examinationAos.findIndex((item: any) => +item.aoSubjectDetailsId === Number(aoSubjectDetailsId));
    if (studentRowIndex > -1) {
      const studentDetails: any = selectedSubjectState?.[0]?.examinationAos[studentRowIndex];
      let updateStudentState: any = [...selectedSubjectState];
      updateStudentState?.[0]?.examinationAos.splice(studentRowIndex, 1, {
        ...studentDetails, isSelected: checked, ...(checked ? {} : { errors: {} }),
      });

      setSelectedSubjectState(updateStudentState);
      const isAllSelected = updateStudentState?.[0]?.examinationAos.every((item: any) => item.isSelected);
      setAllStudentSelectedState(isAllSelected);
    }
  }, [selectedSubjectState]);

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    getAoMappingApiCall({ [name]: value });
    if (name === "academicYearId") {
      getCurriculumApiCall({ academicYearId: value });
      changeAoSelectionFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classId: null,
        curriculumId: prev.curriculumId ? prev.curriculumId : "",
      }));
    }
    else if (name === 'classId') {
      changeAoSelectionFormik.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "" }));
      getSubjectList({ branchClassId: value });
    }
    else {
      changeAoSelectionFormik.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  }

  const roleColumns = useMemo(() => generateColumnsI(allStudentSelectedState, allStudentCheckHndlr, singleStudentCheckHndlr), [allStudentSelectedState, selectedSubjectState]);
  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {}
  const { content: classTypes } = getAssignLanClassListResp || {};

  return (
    <>
      <form>
        <div className="row px-4">
          <div className="row g-3 mb-3">

            <div className="col-xs-12 col-md-3">
              <SelectInput
                name="academicYearId"
                value={changeAoSelectionFormik.values.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                labelText="Academic Year"
                isDisabled={props.modalData1 && true}
                labelClass="required"
                invalid={(changeAoSelectionFormik.touched.academicYearId && changeAoSelectionFormik.errors.academicYearId) ? true : false}
                error={(changeAoSelectionFormik.touched.academicYearId && changeAoSelectionFormik.errors.academicYearId) ? changeAoSelectionFormik.errors.academicYearId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-3">
              <SelectInput
                name="curriculumId"
                value={changeAoSelectionFormik.values.curriculumId}
                onChange={filterHandler}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                labelClass="required"
                isDisabled={props.modalData1 && true || !isEy}
                invalid={(changeAoSelectionFormik.touched.curriculumId && changeAoSelectionFormik.errors.curriculumId) ? true : false}
                error={(changeAoSelectionFormik.touched.curriculumId && changeAoSelectionFormik.errors.curriculumId) ? changeAoSelectionFormik.errors.curriculumId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-3">
              <SelectInput
                name="classId"
                value={changeAoSelectionFormik.values.classId}
                onChange={filterHandler}
                menuItems={classTypes}
                valueKey="id"
                textKey="shortName"
                labelText="Class"
                isDisabled={props.modalData1 && true}
                labelClass="required"
                invalid={(changeAoSelectionFormik.touched.classId && changeAoSelectionFormik.errors.classId) ? true : false}
                error={(changeAoSelectionFormik.touched.classId && changeAoSelectionFormik.errors.classId) ? changeAoSelectionFormik.errors.classId : ""}
              />
            </div>

            <div className="col-xs-12 col-md-3">
              <SelectInput
                name="termId"
                labelText="Term Name"
                labelClass="required"
                value={changeAoSelectionFormik.values.termId}
                onChange={filterHandler}
                menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                valueKey="termId"
                textKey="termName"
                isDisabled={props.modalData1 && true}
                formgroupClassName="mb-0"
                invalid={changeAoSelectionFormik.touched.termId &&
                  changeAoSelectionFormik.errors.termId
                  ? true
                  : false}
                error={changeAoSelectionFormik.touched.termId &&
                  changeAoSelectionFormik.errors.termId
                  ? changeAoSelectionFormik.errors.termId
                  : ""}
              />
            </div>
            <div className="col-xs-12 col-md-3">
              <SelectInput
                name="subjectId"
                value={changeAoSelectionFormik.values.subjectId}
                onChange={filterHandler}
                menuItems={Array.isArray(getAoInsideSubjectsResp?.data) ? getAoInsideSubjectsResp?.data : []}
                valueKey="subjectId"
                textKey="subjectName"
                labelText="Subject Name"
                isDisabled={props.modalData1 && true}
                labelClass="required"
                invalid={(changeAoSelectionFormik.touched.subjectId && changeAoSelectionFormik.errors.subjectId) ? true : false}
                error={(changeAoSelectionFormik.touched.subjectId && changeAoSelectionFormik.errors.subjectId) ? changeAoSelectionFormik.errors.subjectId : ""}
              />
            </div>
          </div>
          <TableContainer
            columns={roleColumns || []}
            data={changeAoSelectionFormik.values.subjectId && selectedSubjectState?.[0]?.examinationAos || []}
            showCheckbox={false}
            divClass="table-responsive overflow-auto"
            theadClass="table-light text-muted align-middle"
          />
          <div className="row">
            <div className="d-flex gap-2 w-auto ms-auto mx-4 my-3">
              <button
                type="button"
                className={"btn btn-light"}
                onClick={(event: any) => props.toggle()}
              >
                Close
              </button>
              <button
                type="button"
                className={`btn btn-success
                `}
                onClick={(event: any) =>
                  changeAoSelectionFormik.handleSubmit(event)
                }
              >
                Submit
              </button>
            </div>
          </div>
        </div>

      </form>
    </>
  );
};

export default AoSelection;

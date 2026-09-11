import React, { useEffect, useRef } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import * as Yup from "yup";
import { CustomSelect, SelectInput, TextArea } from "../../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { getModelSubjectListAct, saveAoMappingSubjectAct, updateAoMappingSubjectAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { generateUniqueNumber } from "../../../../../utility/commonutility";
import { renderOptionsEmployee, renderValueSection } from "./helper";
import { getAssignLanClassListAct } from "../../../../../store/assignlanguages/assignlanguagesaction";
import { getBranchCurriculumAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getAoInsideSubjectsAct } from "../../../../../store/examination/examinationmanagement/examinationmanagementactions";
import { getAssignedClassSubjectsList } from "../../../../../store/academic/classSubjects/classsubjectsactions";

const initialValues = {
  subjectId: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  searchString: "",
  aosDetails: [
    {
      uniqueId: generateUniqueNumber(),
      aoName: "",
    },
  ]
};

const validationSchema = Yup.object().shape({
  curriculumId: Yup.string().required("Curriculum is required.").nullable(),
  classId: Yup.string().required("Class is required.").nullable(),
  subjectId: Yup.string().required("Subject is required.").nullable(),
  aosDetails: Yup.array().of(
    Yup.object().shape({
      aoName: Yup.string().nullable().required('Ao is required'),
    })
  )
});

const AoMappingModel = (props: any) => {
  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
const classApiCalled = useRef(false);
  const isEy = location.pathname.includes("/early-years-settings/ao-mapping");

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    getAoMappingSubjectByIdResp,
    getAssignLanClassListResp,
    assignedClassSubjectsListResp
  } = useAppSelector(
    ({ globalData, classSubjectsInfo, instAcademics, assignLanguages, branchAcademics, appData, examinationSettings }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getAoMappingSubjectByIdResp: examinationSettings.getAoMappingSubjectByIdResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      getModelSubjectListResp: examinationSettings.getModelSubjectListResp,
      assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,        
    }),
    shallowEqual
  );

  const changeAoMappingFormik = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (values) => {
      const aoNames = values.aosDetails
        ?.map((ele: any) => ele.aoName)
        .filter(Boolean);
      const payload = {
        branchId,
        academicYearId: values.academicYearId,
        curriculumId: values.curriculumId,
        classId: values.classId,
        subjectId: values.subjectId,
        aosDetails: aoNames
      }
      if (props.modalData1) {
        dispatch(updateAoMappingSubjectAct(generateActionPayload("update_ao_mapping_subjects", { id: props.modalData1 }, { aosDetails: aoNames })));
      }
      else {
        dispatch(saveAoMappingSubjectAct(generateActionPayload("save_ao_mapping_subjects", undefined, payload)));
      }
    },
  });

  useEffect(() => {
    let yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    if (yearId) {
      changeAoMappingFormik.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
      const payload1 = {
        academicYearId: yearId,
        branchId: branchId,
        pageNo: 0,
        pageSize: 100,
        sortBy: "curriculumName",
        orderBy: "asc",
      };
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
      classApiCalled.current = false;
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (props.modalData) {
      const { classId, curriculumId, subjectId } = props.modalData;
      changeAoMappingFormik.setFieldValue("classId", classId);
      changeAoMappingFormik.setFieldValue("curriculumId", curriculumId);
      getClassApiCall(curriculumId);
      const payload = {
        curriculumId, branchId,
      };
      dispatch(getModelSubjectListAct(generateActionPayload("get_ao_subject_list", undefined, payload)));
    }
  }, []);

  useEffect(() => {
    if (props.id && getAoMappingSubjectByIdResp) {
      const {
        curriculumId,
        classId,
        subjectId,
        examinationAos = [],
      } = getAoMappingSubjectByIdResp;
      const mappedAosDetails = examinationAos.map((item: any) => ({
        uniqueId: generateUniqueNumber(),
        aoName: item.aosDetails || "",
      }));
      changeAoMappingFormik.setFieldValue("aosDetails", mappedAosDetails);
      changeAoMappingFormik.setFieldValue("curriculumId", curriculumId);
      changeAoMappingFormik.setFieldValue("classId", classId);
      changeAoMappingFormik.setFieldValue("subjectId", subjectId);
      changeAoMappingFormik.setFieldValue("searchString", "");
    }
  }, [props.id, getAoMappingSubjectByIdResp]);

  function getClassApiCall(curriculumId: string,) {
    const payload = {
      curriculumId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      classFilter : isEy ? "EARLY" : "HIGHER",
      sortBy: "classSequence",
      orderBy: "asc",
    };
    dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'classId') {
      changeAoMappingFormik.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "" }));
      onSearchMultiSelectHandleremployee(name, value);
    } else if (name === 'curriculumId') {
      changeAoMappingFormik.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", subjectId: "" }))
      getClassApiCall(value);
    } else {
      changeAoMappingFormik.setValues((prev: any) => ({ ...prev, [name]: value }));
    }
  }

  function addNewDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        aoName: "",
      });
    }
  }

  function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  function selectSectionHndlr(selectedOptions: number | number[], config?: any) {
    const { name } = config;
    changeAoMappingFormik.setValues((prevState) => ({ ...prevState, [name]: selectedOptions }))
  }

  function onSearchMultiSelectHandleremployee(name: any, value: string) {
    const payload = {
      academicYearId: changeAoMappingFormik.values.academicYearId,
      curriculumId: changeAoMappingFormik.values.curriculumId,
      branchClassId: value,
      pageNo: 0,
      pageSize: 100,
      sortBy: "subjectName",
      orderBy: "asc",
    };
    if (payload.academicYearId && payload.branchClassId && payload.curriculumId) {
      dispatch(getAssignedClassSubjectsList(generateActionPayload("get_assigned_class_subject_list", undefined, payload)));
    }
  }

  const { data: curriculumTypes } = brchCurriculumResp || {}
  const { content: classTypes } = getAssignLanClassListResp || {};
  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <form>
        <div className="row px-4">
          <div className="row g-3 mt-0 mb-3">
            <div className="col-xs-12 col-md-6">
              <SelectInput
                name="academicYearId"
                value={changeAoMappingFormik.values.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                labelText="Academic Year"
                labelClass="required"
                isDisabled={true}
                invalid={(changeAoMappingFormik.touched.academicYearId && changeAoMappingFormik.errors.academicYearId) ? true : false}
                error={(changeAoMappingFormik.touched.academicYearId && changeAoMappingFormik.errors.academicYearId) ? changeAoMappingFormik.errors.academicYearId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-6">
              <SelectInput
                name="curriculumId"
                value={changeAoMappingFormik.values.curriculumId}
                onChange={filterHandler}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                labelClass="required"
                isDisabled={props.modalData1 && true || !isEy}
                invalid={(changeAoMappingFormik.touched.curriculumId && changeAoMappingFormik.errors.curriculumId) ? true : false}
                error={(changeAoMappingFormik.touched.curriculumId && changeAoMappingFormik.errors.curriculumId) ? changeAoMappingFormik.errors.curriculumId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-6 mt-md-0">
              <SelectInput
                name="classId"
                value={changeAoMappingFormik.values.classId}
                onChange={filterHandler}
                menuItems={classTypes}
                valueKey="id"
                textKey="shortName"
                labelText="Class"
                labelClass="required"
                isDisabled={props.modalData1 && true}
                invalid={(changeAoMappingFormik.touched.classId && changeAoMappingFormik.errors.classId) ? true : false}
                error={(changeAoMappingFormik.touched.classId && changeAoMappingFormik.errors.classId) ? changeAoMappingFormik.errors.classId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-6 mt-md-0">
              <SelectInput
                name="subjectId"
                value={changeAoMappingFormik.values.subjectId}
                onChange={changeAoMappingFormik.handleChange}
                menuItems={assignedClassSubjectsListResp?.data || []}
                valueKey="subjectId"
                textKey="subjectName"
                labelText="Subject"
                defaultSelect="Select"
                labelClass="required"
                invalid={(changeAoMappingFormik.touched.subjectId && changeAoMappingFormik.errors.subjectId) ? true : false}
                error={(changeAoMappingFormik.touched.subjectId && changeAoMappingFormik.errors.subjectId) ? changeAoMappingFormik.errors.subjectId : ""}
              />
            </div>
          </div>
        </div>
        <div className="row bg-light px-3 mx-0">
          <div className="col-12 py-2 m-0">
            <div className="hstack justify-content-between">
              <h6 className="mb-0 me-2 form-label required">Ao Name</h6>
              <button
                onClick={addNewDepartmentHndlr}
                className="btn-sm btn-icon btn btn-outline-primary"
              >
                <i className="ri-add-line fs-18" />
              </button>
            </div>
          </div>
        </div>
        <div className="row px-3 mx-0">
          <FormikProvider value={changeAoMappingFormik}>
            <FieldArray name="aosDetails">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }
                return (
                  <>
                    {changeAoMappingFormik.values.aosDetails.length >
                      0 &&
                      changeAoMappingFormik.values.aosDetails.map(
                        (aosDetails: any, index: any) => {
                          const inputFieldErrors: any = changeAoMappingFormik.errors.aosDetails && changeAoMappingFormik.errors.aosDetails[index] || {};
                          const inputFieldTouched = changeAoMappingFormik.touched.aosDetails && changeAoMappingFormik.touched.aosDetails[index] || {};
                          return (
                            <div
                              key={`${aosDetails.uniqueId}-${index}`}
                              className="row g-3 mb-3"
                            >
                              <div className="col-12 ps-2 mt-0">
                                <div className="hstack">
                                  <TextArea
                                    name={`aosDetails[${index}].aoName`}
                                    formgroupClassName="mb-0 w-90 me-4"
                                    value={aosDetails.aoName}
                                    onChange={changeAoMappingFormik.handleChange}
                                    invalid={(inputFieldTouched.aoName && inputFieldErrors.aoName) ? true : false}
                                    error={(inputFieldTouched.aoName && inputFieldErrors.aoName) ? inputFieldErrors.aoName : ""}
                                  />
                                  {index !== 0 && (
                                    <button
                                      type="button"
                                      data-index={index}
                                      onClick={removeDepartmentHndlr}
                                      className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                    >
                                      <i className="ri-delete-bin-2-fill" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                  </>
                );
              }}
            </FieldArray>
          </FormikProvider>
        </div>
        <div className="row">
          <div className="d-flex gap-2 w-auto ms-auto mx-4 my-3">
           <button
              type="button"
              className={"btn btn-light"}
              onClick={props.toggle}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-success
                `}
              onClick={(event: any) =>
                changeAoMappingFormik.handleSubmit(event)
              }
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AoMappingModel;

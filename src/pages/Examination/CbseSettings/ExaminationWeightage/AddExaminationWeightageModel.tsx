import React, { useRef, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { SelectInput, TextInputWithRegex } from "../../../../Components/Common";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editCbseWeightageListAct, getCbseExaminationListAct, saveCbseWeightageListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../store/assignlanguages/assignlanguagesaction";

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  termId: "",
  classId: "",
  examinations: [
    {
      id: generateUniqueNumber(),
      examinationId: "",
      weightagePercentage: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Year is required.").nullable(),
  curriculumId: Yup.string().required("Curriculum is required.").nullable(),
  classId: Yup.string().required("Class is required.").nullable(),
  termId: Yup.string().required("Term is required.").nullable(),
  examinations: Yup.array().of(
    Yup.object().shape({
      examinationId: Yup.string().required("Examination is required.").nullable(),
      weightagePercentage: Yup.string().required("Weightage is required.").nullable(),
    })
  )
});

const AddExaminationWeightageModel = (props: any) => {
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();

  function getMainExaminationListApiCall(classId: string, curriculumId: string) {
    const payload = {
      branchId,
      curriculumId: curriculumId,
      academicYearId: addExaminationWeightageFormik.values.academicYearId,
      classId: classId,
      pageNo: 0, pageSize: 100,
    };
    dispatch(getCbseExaminationListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
  }

  const { academicYearListResp,
    currentBranchIdResp: branchId,
    branchClassResp,
    brchCurriculumResp,
    getCbseWeightageListByIdResp,
    getAssignLanClassListResp,
    getAssignListCurriculumResp,
    getIgseTermNameListResp,
    getCbseExaminationRequestListResp,
    currentInstIdResp: showApiLoader } = useAppSelector(
      ({ instAcademics, branchAcademics, assignLanguages, appData, examinationManagement, examinationSettings, globalData }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        branchClassResp: branchAcademics.branchClassResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        currentInstIdResp: appData.currentInstIdResp,
        getAssignLanClassListResp: assignLanguages. getAssignLanClassListResp,
        getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
        getCbseWeightageListByIdResp: examinationSettings.getCbseWeightageListByIdResp,
        getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
        getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
        showApiLoader: globalData.showApiLoader,
      }),
      shallowEqual
    );
  const addExaminationWeightageFormik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        branchId,
        academicYearId: values.academicYearId,
        curriculumId: values.curriculumId,
        classId: values.classId,
        termId: values.termId,
        examinations: values.examinations.map(exam => ({
          examinationId: exam.examinationId,
          weightagePercentage: parseFloat(exam.weightagePercentage),
        })),
      };
      const editPayload = {
        termId: values.termId,
        examinations: values.examinations.map(exam => ({
          examinationId: exam.examinationId,
          weightagePercentage: parseFloat(exam.weightagePercentage),
        })),
      };

      if (props?.id) {
        dispatch(editCbseWeightageListAct(generateActionPayload("edit_cbse_weightage_list", { id: props.id }, editPayload)));
      } else {
        dispatch(saveCbseWeightageListAct(generateActionPayload("save_cbse_weightage", undefined, payload)));
      }
    },
  });

  const addExaminationDetailsRef = useRef({
    prevGetCbseWeightageListByIdResp: getCbseWeightageListByIdResp,
  })

  useEffect(() => {
    const { prevGetCbseWeightageListByIdResp } = addExaminationDetailsRef.current || {};
    if (getCbseWeightageListByIdResp && prevGetCbseWeightageListByIdResp !== getCbseWeightageListByIdResp) {
      if (props?.id) {
        const {
          examinationId,
          academicYearId,
          curriculumId,
          classId,
          termId,
          weightageChildDto,
        } = getCbseWeightageListByIdResp || {};
  
        const examinations = weightageChildDto?.map(
          (child: { weightagePercentage: number; examinationId: string }) => ({
            examinationId: child.examinationId,
            weightagePercentage: child.weightagePercentage,
          })
        ) || [];
  
        addExaminationWeightageFormik.setValues((prev) => ({
          ...prev,
          examinationId,
          academicYearId,
          curriculumId,
          classId,
          termId,
          examinations,
        }));
  
        if (curriculumId) {
          getClassApiCall(curriculumId);
        }
        getMainExaminationListApiCall(classId, curriculumId);
      }
    }
  
    addExaminationDetailsRef.current.prevGetCbseWeightageListByIdResp = getCbseWeightageListByIdResp;
  }, [getCbseWeightageListByIdResp]);

  function removeWeightageHndlr(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  function addWeightageHandler() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({ uniqueId: generateUniqueNumber(), examinationId: "", weightagePercentage: "" });
    }
  }

  useEffect(() => {

    if (props.modalData) {
      const { academicYearId, curriculumId, classId, sectionId, date } = props.modalData || {};
      addExaminationWeightageFormik.setValues((prev: any) => ({ ...prev, academicYearId, curriculumId, classId, sectionId, date }));

      if (academicYearId) {
        getCurriculumApiCall({ academicYearId })
      }
      if (curriculumId) {
        const payload = { branchId: branchId, curriculumId, academicYearId, classFilter: "HIGHER", sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
    }
    return () => {
      addExaminationWeightageFormik.resetForm();
    }
  }, [])

  useEffect(() => {
        if (addExaminationWeightageFormik.values.academicYearId && addExaminationWeightageFormik.values.curriculumId) {
          getClassApiCall(addExaminationWeightageFormik.values.curriculumId);
        }
      }, [addExaminationWeightageFormik.values.academicYearId, addExaminationWeightageFormik.values.curriculumId]);
      
      function getClassApiCall(selectedCurriculumId: string) {
        const payload = {
          academicYearId: addExaminationWeightageFormik.values.academicYearId,
          curriculumId: selectedCurriculumId,
          branchId,
          classFilter: "HIGHER",
          pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
        };
        
        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
      const getCurriculumApiCall = (otherProps?: any) => {
            const payload1 = { academicYearId: addExaminationWeightageFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
            dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
          }

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    addExaminationWeightageFormik.setFieldValue(name, value);
  
    if (value) {
      if (name === "academicYearId") {
        addExaminationWeightageFormik.setValues((prev) => ({
          ...prev,
          academicYearId: value,
          classId: "",
          examinationId: "",
        }));
        getCurriculumApiCall({ academicYearId: value });
      } else if (name === "curriculumId") {
        addExaminationWeightageFormik.setFieldValue("classId", "");
        addExaminationWeightageFormik.setFieldValue("sectionId", "");
      } else if (name === "classId") {
        addExaminationWeightageFormik.setFieldValue('examinationId', "");
        getMainExaminationListApiCall(value, addExaminationWeightageFormik.values.curriculumId);
      }
    }  
    
  }

  return (
    <>
      <form>
        <div className="card-body">
          <div className="row g-3">

            <div className="col-xs-12 col-md-6">
              <SelectInput
                name="academicYearId"
                labelText="Academic Year"
                labelClass="required"
                value={addExaminationWeightageFormik.values.academicYearId}
                onChange={handleSelectChange}
                menuItems={academicYearListResp?.data}
                valueKey="academicYearId"
                textKey="academicYearName"
                isDisabled={props?.id}
                invalid={(addExaminationWeightageFormik.touched.academicYearId && addExaminationWeightageFormik.errors.academicYearId) ? true : false}
                error={(addExaminationWeightageFormik.touched.academicYearId && addExaminationWeightageFormik.errors.academicYearId) ? addExaminationWeightageFormik.errors.academicYearId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-6">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                value={addExaminationWeightageFormik.values.curriculumId}
                onChange={handleSelectChange}
                menuItems={getAssignListCurriculumResp?.data}
                isDisabled
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelClass="required"
                invalid={(addExaminationWeightageFormik.touched.curriculumId && addExaminationWeightageFormik.errors.curriculumId) ? true : false}
                error={(addExaminationWeightageFormik.touched.curriculumId && addExaminationWeightageFormik.errors.curriculumId) ? addExaminationWeightageFormik.errors.curriculumId : ""}

              />
            </div>
            <div className="col-12 col-md-6 mt-0">
              <SelectInput
                name="classId"
                labelText="Class"
                value={addExaminationWeightageFormik.values.classId}
                onChange={handleSelectChange}
                menuItems={getAssignLanClassListResp?.content}
                valueKey="id"
                textKey="shortName"
                labelClass="required"
                isDisabled={props?.id}
                invalid={(addExaminationWeightageFormik.touched.classId && addExaminationWeightageFormik.errors.classId) ? true : false}
                error={(addExaminationWeightageFormik.touched.classId && addExaminationWeightageFormik.errors.classId) ? addExaminationWeightageFormik.errors.classId : ""}

              />
            </div>
            <div className="col-12 col-md-6 mt-0">
              <SelectInput
                name="termId"
                labelText="Term Name"
                menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                valueKey="termId"
                textKey="termName"
                value={addExaminationWeightageFormik.values.termId}
                onChange={addExaminationWeightageFormik.handleChange}
                labelClass="required"
                isDisabled={props?.id}
                invalid={(addExaminationWeightageFormik.touched.termId && addExaminationWeightageFormik.errors.termId) ? true : false}
                error={(addExaminationWeightageFormik.touched.termId && addExaminationWeightageFormik.errors.termId) ? addExaminationWeightageFormik.errors.termId : ""}

              />
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 mb-1">
              <div className="row">
                <div className="col-6">
                  <div className="hstack">
                    <h6 className="form-label fw-normal required me-2">Examination Name</h6>
                    <button
                      onClick={addWeightageHandler}
                      type="button"
                      className="btn-sm btn-icon btn btn-outline-primary"
                    >
                      <i className="ri-add-line fs-18" />
                    </button>
                  </div>
                </div>
                <div className="col-4">
                  <h6 className="form-label fw-normal required">
                    Weightage (%)
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-12 mt-0">
              <FormikProvider value={addExaminationWeightageFormik}>
                <FieldArray name="examinations">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }
                    return (
                      <>
                        {addExaminationWeightageFormik.values.examinations?.length > 0 &&
                          addExaminationWeightageFormik.values.examinations?.map((Weightage: any, index: any) => {
                            const inputFieldErrors: any = addExaminationWeightageFormik.errors.examinations && addExaminationWeightageFormik.errors.examinations[index] || {};
                            const inputFieldTouched = addExaminationWeightageFormik.touched.examinations && addExaminationWeightageFormik.touched.examinations[index] || {};
                            return (
                              <div key={Weightage.uniqueId} className="row">
                                <div className="col-6">
                                  <SelectInput
                                    name={`examinations[${index}].examinationId`}
                                    value={Weightage.examinationId}
                                    onChange={handleSelectChange}
                                    onBlur={addExaminationWeightageFormik.handleBlur}
                                    menuItems={(Array.isArray(getCbseExaminationRequestListResp?.data) && getCbseExaminationRequestListResp?.data) || []}
                                    valueKey="id"
                                    textKey="examinationName"
                                    formgroupClassName="w-100"
                                    invalid={(inputFieldTouched.examinationId && inputFieldErrors.examinationId) ? true : false}
                                    error={(inputFieldTouched.examinationId && inputFieldErrors.examinationId) ? inputFieldErrors.examinationId : ""}

                                  />
                                </div>
                                <div className="col-6 d-flex align-items-start">
                                  <div className="">
                                    <TextInputWithRegex
                                      name={`examinations[${index}].weightagePercentage`}
                                      inputClassName="w-80"
                                      value={addExaminationWeightageFormik.values.examinations[index]?.weightagePercentage || ''}
                                      onChange={addExaminationWeightageFormik.handleChange}
                                      onBlur={addExaminationWeightageFormik.handleBlur}
                                      invalid={(inputFieldTouched.weightagePercentage && inputFieldErrors.weightagePercentage) ? true : false}
                                      error={(inputFieldTouched.weightagePercentage && inputFieldErrors.weightagePercentage) ? inputFieldErrors.weightagePercentage : ""}
                                      allowedInputRegex="^\d{0,3}(\.\d{0,2})?$"
                                      maxLength={6}
                                    />
                                  </div>
                                  {(index !== 0) && <button type="button" data-index={index} onClick={removeWeightageHndlr} className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white">
                                    <i className="ri-delete-bin-2-fill" />
                                  </button>}
                                </div>
                              </div>
                            )
                          })}
                      </>
                    )
                  }}
                </FieldArray>

              </FormikProvider>


            </div>
          </div>
          <div className="row">
            <div className="d-flex gap-2 w-auto ms-auto mt-3">
              <button
                type="button"
                className={"btn btn-light"}
                onClick={props.toggle}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn btn-success
                `}
                onClick={(event: any) => addExaminationWeightageFormik.handleSubmit(event)}
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

export default AddExaminationWeightageModel;

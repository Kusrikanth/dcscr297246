import React, { useRef, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { SelectInput, TextArea, TextInputWithRegex } from "../../../../Components/Common";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editCbseExaminationOverAllGradesByIdAct, saveCbseExaminationOverAllGradesAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { FormGroup, Input } from "reactstrap";

export interface addCbseExaminationOverAllGradesModalProps {
  isOpen: boolean;
  toggle: any;
  modalTitle?: string;
  instituteId: string;
  instituteName: string;
  branchId: string;
  editBranchDetails: string | undefined;
  modalData?:any
}

const initialValues = {
  academicYearId: "",
  curriculumId: "",
  classId: "",
  grades: [
    {
      uniqueId:"",
      fromMarks: "",
      toMarks: "",
      overAllGrade: "",
      description: "",
      gradeColor: "",
    }
  ]
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required."),
  curriculumId: Yup.string().required("Curriculum is required."),
  classId: Yup.string().required("Class is required."),
  grades: Yup.array().of(
    Yup.object().shape({
      fromMarks: Yup.string().required("From Marks is required."),
      toMarks: Yup.string().required("To Marks is required."),
      overAllGrade: Yup.string().required("Overall Grade is required."),
      description: Yup.string().required("Overall Grade is required.")
    })
  )
});

const AddOverallGradesModel = (props:any) => {
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
        getAssignLanClassListResp,
        getAssignListCurriculumResp,
    getCbseExaminationOverAllGradesByIdResp,
} = useAppSelector(
    ({ globalData, instAcademics, assignLanguages, branchAcademics,appData, examinationSettings }) => ({
        academicYearListResp: instAcademics.academicYearListResp,
        brchCurriculumResp: branchAcademics.brchCurriculumResp,
        branchClassResp: branchAcademics.branchClassResp,
        getAssignLanClassListResp: assignLanguages. getAssignLanClassListResp,
        getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
        currentBranchIdResp: appData.currentBranchIdResp,
        getCbseExaminationOverAllGradesByIdResp: examinationSettings.getCbseExaminationOverAllGradesByIdResp,
        showApiLoader: globalData.showApiLoader,
    }),
    shallowEqual
);
  const addOverAllgradesFormik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema,
    onSubmit: (values) => {
      const payload = {
        branchId:branchId,
        academicYearId: values.academicYearId,
        curriculumId: values.curriculumId,
        classId: values.classId,
        grades : values.grades.map(({ uniqueId, ...rest }) => rest)
      }
      if(props?.id){
        dispatch(
          editCbseExaminationOverAllGradesByIdAct(
            generateActionPayload(
              "edit_cbse_examination_over_all_grades_by_id",
              { id: props?.id},
              {
                ...payload.grades[0]
              }
            )
          )
        )
      }else{
        dispatch(
          saveCbseExaminationOverAllGradesAct(
            generateActionPayload(
              "save_cbse_examination_over_all_grades",
              undefined,
              payload
            )
          )
        );
      }
      
    },
  });

  const addOverAllGradesRef = useRef({
    prevGetCbseExaminationOverAllGradesByIdResp: getCbseExaminationOverAllGradesByIdResp,
  });
useEffect(() => {
      if (addOverAllgradesFormik.values.academicYearId && addOverAllgradesFormik.values.curriculumId) {
        getClassApiCall(addOverAllgradesFormik.values.curriculumId);
      }
    }, [addOverAllgradesFormik.values.academicYearId, addOverAllgradesFormik.values.curriculumId]);
    
    function getClassApiCall(selectedCurriculumId: string) {
      const payload = {
        academicYearId: addOverAllgradesFormik.values.academicYearId,
        curriculumId: addOverAllgradesFormik.values.curriculumId,
        branchId,
        pageNo: 0, pageSize: 100,classFilter: "HIGHER", sortBy: "classSequence", orderBy: "asc",
      };
      
      dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
    }
const getCurriculumApiCall = (otherProps?: any) => {
      const payload1 = { academicYearId: addOverAllgradesFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
      dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
    }
  useEffect(() => {
    const { prevGetCbseExaminationOverAllGradesByIdResp } =
      addOverAllGradesRef.current || {};
    if (
      getCbseExaminationOverAllGradesByIdResp &&
      prevGetCbseExaminationOverAllGradesByIdResp !== getCbseExaminationOverAllGradesByIdResp
    ) {
      if (props?.id) {
        const { academicYearId, curriculumId, classId, fromMarks, toMarks, description, overAllGrade, gradeColor } = getCbseExaminationOverAllGradesByIdResp || {};
        addOverAllgradesFormik.setValues((prev: any) => ({
          ...prev,
          academicYearId,
          branchCurriculumName: curriculumId,
          classId,
          grades: [{
            fromMarks: fromMarks,
            toMarks: toMarks,
            description: description,
            overAllGrade: overAllGrade,
            gradeColor: gradeColor || "#364574"
          }]
        }));
        if(curriculumId){
          getClassApiCall(curriculumId);
        }
      }
    }

    addOverAllGradesRef.current.prevGetCbseExaminationOverAllGradesByIdResp =
      getCbseExaminationOverAllGradesByIdResp;
  }, [getCbseExaminationOverAllGradesByIdResp]);


  useEffect(() => {

    if (props.modalData) {
      const { academicYearId, curriculumId, classId, sectionId, date } = props.modalData || {};
      addOverAllgradesFormik.setValues((prev: any) => ({ ...prev, academicYearId, curriculumId, classId, sectionId, date }));

      if (academicYearId) {
        getCurriculumApiCall({ academicYearId })
      }
      if (curriculumId) {
        const payload = { branchId: branchId, curriculumId, academicYearId,classFilter: "HIGHER", sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
    }
    return () => {
      addOverAllgradesFormik.resetForm();
    }
  }, [])

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    addOverAllgradesFormik.setFieldValue(name, value);
  
    if (value) {
      if (name === "academicYearId") {
        addOverAllgradesFormik.setValues((prev) => ({
          ...prev,
          academicYearId: value,
          classId: "",
          examinationId: "",
        }));
        getCurriculumApiCall({ academicYearId: value });
      } else if (name === "curriculumId") {
        addOverAllgradesFormik.setFieldValue("classId", "");
        addOverAllgradesFormik.setFieldValue("sectionId", "");
      } 
    } 
  }

  function addNewOverAllGradesHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        fromMarks: "",
        toMarks: "",
        overAllGrade: "",
        description: "",
        gradeColor: "#364574"
      });
    }
  }
  function removeGradesHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {}
  const { content: classTypes } = getAssignLanClassListResp || {};

  return (
    <>
      <form>
        <div className="row px-4">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <SelectInput
                name="academicYearId"
                labelText="Academic Year"
                labelClass="required"
                value={addOverAllgradesFormik.values.academicYearId}
                onChange={handleSelectChange}
                menuItems={academicYearList}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="mb-0"
                isDisabled={props?.id ? true : false}
                invalid={addOverAllgradesFormik.touched.academicYearId &&
                  addOverAllgradesFormik.errors.academicYearId
                  ? true
                  : false}
                error={addOverAllgradesFormik.touched.academicYearId &&
                  addOverAllgradesFormik.errors.academicYearId
                  ? addOverAllgradesFormik.errors.academicYearId
                  : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                labelClass="required"
                value={addOverAllgradesFormik.values.curriculumId}
                onChange={handleSelectChange}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                formgroupClassName="mb-0 "
                isDisabled
                invalid={addOverAllgradesFormik.touched.curriculumId &&
                  addOverAllgradesFormik.errors.curriculumId
                  ? true
                  : false}
                error={addOverAllgradesFormik.touched.curriculumId &&
                  addOverAllgradesFormik.errors.curriculumId
                  ? addOverAllgradesFormik.errors.curriculumId
                  : ""}
              />
            </div>
            <div className="col-12 col-md-6">
              <SelectInput
                name="classId"
                labelText="Class"
                labelClass="required"
                value={addOverAllgradesFormik.values.classId}
                onChange={addOverAllgradesFormik.handleChange}
                menuItems={classTypes}
                valueKey="id"
                textKey="shortName"
                formgroupClassName="mb-0 "
                isDisabled={props?.id ? true : false}
                invalid={addOverAllgradesFormik.touched.classId &&
                  addOverAllgradesFormik.errors.classId
                  ? true
                  : false}
                error={addOverAllgradesFormik.touched.classId &&
                  addOverAllgradesFormik.errors.classId
                  ? addOverAllgradesFormik.errors.classId
                  : ""}
              />
            </div>
          </div>
          </div>
          <div className="py-3 px-2 mx-1">
            <div className="row mb-3 px-2">
              <div className="col-12">
            <div className="hstack">
              <h6 className="mb-0 me-2">Grade</h6>
              
              <button
                  onClick={addNewOverAllGradesHndlr}
                  className="btn-sm btn-icon btn btn-outline-primary"
                >
                  <i className="ri-add-line fs-18" />
                </button>
                </div>
            </div>
            </div>
            <div className="row bg-light px-2 py-2 mb-3">
            <div className="col-12 col-md-2">
              <h6 className="mb-0">From Marks (%)</h6>
            </div>
            <div className="col-12 col-md-2">
              <h6 className="mb-0">To Marks (%)</h6>
            </div>
            <div className="col-12 col-md-2">
              <h6 className="mb-0">Grade</h6>
            </div>
            <div className="col-12 col-md-3">
              <h6 className="mb-0">Description</h6>
            </div>
            <div className="col-12 col-md-3">
              <h6 className="mb-0">Color Code</h6>
            </div>
            </div>
          <div className="row px-2">
            <div className="col-12">
            <FormikProvider value={addOverAllgradesFormik}>
              <FieldArray name="grades">
                {(arrayHelpers: ArrayHelpers) => {
                  if (!formikArrayHelpers.current) {
                    formikArrayHelpers.current = arrayHelpers;
                  }
                  return (
                    <>
                      {addOverAllgradesFormik.values.grades.length >
                        0 &&
                        addOverAllgradesFormik.values.grades.map(
                          (grade:any, index:number) => {
                            const inputFieldErrors: any = addOverAllgradesFormik.errors.grades && addOverAllgradesFormik.errors.grades[index] || {};
                        const inputFieldTouched: any = addOverAllgradesFormik.touched.grades && addOverAllgradesFormik.touched.grades[index] || {};
                            return (
                              <div
                                key={grade.uniqueId}
                                className="mb-3 row"
                              >
                                <div className="col-12 col-md-2">
                                    <TextInputWithRegex
                                       name={`grades[${index}].fromMarks`}
                                       labelClass="required"
                                       value={grade.fromMarks}
                                          formgroupClassName="mb-0 "
                                          onChange={
                                            addOverAllgradesFormik.handleChange
                                          }
                                          allowedInputRegex="^\d{0,3}(\.\d{0,2})?$"
                                        maxLength={6}
                                      invalid={inputFieldTouched.fromMarks &&
                                        inputFieldErrors.fromMarks
                                          ? true
                                          : false}
                                      error={inputFieldTouched.fromMarks &&
                                        inputFieldErrors.fromMarks
                                          ? inputFieldErrors.fromMarks
                                          : ""}
                                        />
                                </div>
                                <div className="col-12 col-md-2">
                                  <div className="">
                                  <TextInputWithRegex
                                          name={`grades[${index}].toMarks`}
                                          labelClass="required"
                                          formgroupClassName="mb-0 "
                                          value={grade.toMarks}
                                          onChange={
                                            addOverAllgradesFormik.handleChange
                                          }
                                          allowedInputRegex="^\d{0,3}(\.\d{0,2})?$"
                                        maxLength={6}
                                          invalid={inputFieldTouched.toMarks &&
                                            inputFieldErrors.toMarks
                                              ? true
                                              : false}
                                          error={inputFieldTouched.toMarks &&
                                            inputFieldErrors.toMarks
                                              ? inputFieldErrors.toMarks
                                              : ""}
                                        />
                                  </div>
                                </div>
                                <div className="col-12 col-md-2">
                                  <div className="">
                                  <TextInputWithRegex
                                          name={`grades[${index}].overAllGrade`}
                                          labelClass="required"
                                          formgroupClassName="mb-0 "
                                          value={grade.overAllGrade}
                                          onChange={
                                            addOverAllgradesFormik.handleChange
                                          }
                                          maxLength={2}
                                          invalid={inputFieldTouched.overAllGrade &&
                                            inputFieldErrors.overAllGrade
                                              ? true
                                              : false}
                                          error={inputFieldTouched.overAllGrade &&
                                            inputFieldErrors.overAllGrade
                                              ? inputFieldErrors.overAllGrade
                                              : ""}
                                        />
                                  </div>
                                </div>
                                <div className="col-12 col-md-3">
                                  <div className="">
                                  <TextArea
                                         name={`grades[${index}].description`}
                                        labelClass="required"
                                        formgroupClassName="mb-0 "
                                        value={grade.description}
                                        maxLength={250}
                                        onChange={addOverAllgradesFormik.handleChange}
                                        invalid={inputFieldTouched.description && inputFieldErrors.description ? true : false}
                                        error={inputFieldTouched.description && inputFieldErrors.description ? inputFieldErrors.description : ""}
                                        />
                                  </div>
                                </div>
                                <div className="col-12 col-md-2">
                                  <FormGroup>
                                    <Input
                                      name={`grades[${index}].gradeColor`}
                                      type="color"
                                      className="form-control form-control-color w-100"
                                      id={`gradeColor-${index}`}
                                      value={grade.gradeColor || "#364574"} 
                                      onChange={addOverAllgradesFormik.handleChange} 
                                    />
                                  </FormGroup>
                                </div>
                                <div className="col-1">
                                  {index !== 0 && (
                                      <button
                                        data-index={index}
                                        onClick={removeGradesHndlr}
                                        className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
                                      >
                                        <i className="ri-delete-bin-2-fill" />
                                      </button>
                                    )}
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
          </div>
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
              onClick={(event: any) => {
                addOverAllgradesFormik.handleSubmit(event);
              }}
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddOverallGradesModel;

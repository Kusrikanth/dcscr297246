import React, { useEffect, useRef } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers } from "formik";
import * as Yup from "yup";
import { CustomSelect, SelectInput } from "../../../../Components/Common";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { languageType, renderOptionsEmployee, renderValueSection } from "./helper";
import { getBranchClassAct, getBranchCurriculumAct, resetBrchClassAct, setBranchClassScopeAct, setBrchClassAct, setBrchCurriculumScopeAct } from "../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { getClassSubjectsList } from "../../../../store/academic/classSubjects/classsubjectsactions";
import { getAcademicLanguagesDataAct } from "../../../../store/mastersettings/instituteinfo/instituteinfoactions";
import { saveBranchClassLanguageAct, updateBranchClassLanguageAct } from "../../../../store/FrontDesk/AdmissionSettings/admissionsettingaction";
import Button from "../../../../Components/Common/Button";

const initialValues = {
  subjectId: "",
  academicYearId: "",
  curriculumId: "",
  classId: "",
  classLanguages: [
    {
      uniqueId: generateUniqueNumber(),
      languageId: "",
      languageType: "",
    },
  ]
};

const validationSchema = Yup.object().shape({
  academicYearId: Yup.string().required("Academic Year is required.").nullable(),
  curriculumId: Yup.string().required("Curriculum is required.").nullable(),
  classId: Yup.string().required("Class is required.").nullable(),
  subjectId: Yup.string().required("Subject is required.").nullable(),
  classLanguages: Yup.array().of(
    Yup.object().shape({
      languageId: Yup.string().nullable().required('Language is required'),
      languageType: Yup.string().nullable().required('Language Type is required'),
    })
  )
});

const AddBranchClassLanguageModel = (props: any) => {
  const dispatch = useAppDispatch();
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);

  const {
    academicYearListResp,
    examinationCurriculumResp,
    examinationClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    academicLanguages,
    getBranchClassLanguageResp,
    academicSubjectsListResp
  } = useAppSelector(
    ({ classSubjectsInfo, instAcademics, branchAcademics, appData, examinationSettings, instituteInfo, admissionSettingRequest }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      examinationCurriculumResp: branchAcademics.branchCurriculumScopeResp?.frontdesk,
      examinationClassResp: branchAcademics.branchClassScopeResp?.frontdesk,
      currentBranchIdResp: appData.currentBranchIdResp,
      getModelSubjectListResp: examinationSettings.getModelSubjectListResp,
      academicSubjectsListResp: classSubjectsInfo.academicSubjectsListResp,
      currentInstIdResp: appData.currentInstIdResp,
      academicLanguages: instituteInfo.academicLanguages,
      getBranchClassLanguageResp: admissionSettingRequest.getBranchClassLanguageResp

    }),
    shallowEqual
  );


  const branchClassLanguageForm = useFormik({
    validationSchema,
    initialValues,
    onSubmit: (values) => {
      const classLanguages = values.classLanguages
        ?.map((ele: any) => ({ instituteLanguageId: ele.languageId, languageType: ele.languageType }))
      const payload = {
        branchId,
        instituteId,
        academicYearId: values.academicYearId,
        branchCurriculumId: values.curriculumId,
        branchClassId: values.classId,
        subjectId: values.subjectId,
        classLanguages: classLanguages
      }
      const classLanguages1 = values.classLanguages
        ?.map((ele: any) => ({ id: props.id, instituteLanguageId: ele.languageId, languageType: ele.languageType }))
      const payload1 = {
        branchId,
        instituteId,
        academicYearId: values.academicYearId,
        branchCurriculumId: values.curriculumId,
        branchClassId: values.classId,
        subjectId: values.subjectId,
        classLanguages: classLanguages1
      }

      if (props.modalData1) {
        dispatch(updateBranchClassLanguageAct(generateActionPayload("save_branch_class_language", undefined, payload1)));
      }
      else {
        dispatch(saveBranchClassLanguageAct(generateActionPayload("save_branch_class_language", undefined, payload)));
      }
    },
  });

  useEffect(() => {
    let yearId = academicYearListResp?.data.find((year: any) => year.yearStatus.toLowerCase() === "current")?.academicYearId;
    if (yearId) {
      branchClassLanguageForm.setValues((prev: any) => ({ ...prev, academicYearId: yearId }));
      const payload1 = {
        academicYearId: yearId,
        branchId: branchId,
        pageNo: 0,
        pageSize: 100,
        sortBy: "curriculumName",
        orderBy: "asc",
      };
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1, { scope: 'frontdesk' })));
    }
  }, [academicYearListResp]);

  useEffect(() => {
    if (props.modalData) {
      const { classId, curriculumId, subjectId } = props.modalData;
      branchClassLanguageForm.setFieldValue("classId", classId);
      branchClassLanguageForm.setFieldValue("curriculumId", curriculumId);
      getClassApiCall(curriculumId);
    }
    getMasterLanguageApiCall();
    return () => {
      dispatch(setBrchCurriculumScopeAct(undefined));
      dispatch(setBranchClassScopeAct(undefined));
    }
  }, []);

  useEffect(() => {
    if (props.id) {

      const data = getBranchClassLanguageResp?.content.find((item: any) => +item.id === +props.id);
      if (data) {
        const mappedClassLanguages = [
          {
            uniqueId: generateUniqueNumber(),
            languageType: data?.languageType || "",
            languageId: data?.instituteLanguageId || "",
          },
        ];

        branchClassLanguageForm.setFieldValue("classLanguages", mappedClassLanguages);
        branchClassLanguageForm.setFieldValue("curriculumId", data.branchCurriculumId);
        branchClassLanguageForm.setFieldValue("classId", data.branchClassId);
        branchClassLanguageForm.setFieldValue("subjectId", data.subjectId);
        branchClassLanguageForm.setFieldValue("academicYearId", data.academicYearId);
        getClassApiCall(data.branchCurriculumId);
        getSubjectListApiCall({ curriculumId: data.branchCurriculumId });
      }
    }
  }, [props.id, getBranchClassLanguageResp]);

  function getClassApiCall(curriculumId: string,) {
    const payload = {
      curriculumId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "classSequence",
      orderBy: "asc",
    };
    dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload, { scope: 'frontdesk' })));
  }

  const filterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      branchClassLanguageForm.setValues((prev: any) => ({ ...prev, [name]: value, curriculumId: "", classId: "", subjectId: "" }));
      const payload1 = {
        academicYearId: value,
        branchId: branchId,
        pageNo: 0,
        pageSize: 100,
        sortBy: "curriculumName",
        orderBy: "asc",
      };
      dispatch(getBranchCurriculumAct(generateActionPayload("get_brch_curriculum", undefined, payload1, { scope: 'frontdesk' })));
      dispatch(setBranchClassScopeAct(undefined));
    }
    else if (name === 'curriculumId') {
      branchClassLanguageForm.setValues((prev: any) => ({ ...prev, [name]: value, classId: "", subjectId: "" }))
      getClassApiCall(value);
      getSubjectListApiCall({ curriculumId: value });
    }
    else if (name === 'classId') {
      branchClassLanguageForm.setValues((prev: any) => ({ ...prev, [name]: value, subjectId: "" }));
    }
    else {
      branchClassLanguageForm.setValues((prev: any) => ({ ...prev, [name]: value }));
    }
  }

  function addNewDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        languageId: "",
        languageType: "",
      });
    }
  }

  function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  const getSubjectListApiCall = (otherProps?: any) => {
    let payload = { branchId: branchId, curriculumId: branchClassLanguageForm.values.curriculumId, languageTypes: "FIRST,SECOND,THIRD", pageNo: 0, pageSize: 100, sortBy: "subjectName", ...otherProps }
    dispatch(
      getClassSubjectsList(
        generateActionPayload("get_class_subject_list", undefined, payload)
      )
    );
  }

  const getMasterLanguageApiCall = () => {
    const payload = {
      instituteId, pageNo: 0, pageSize: 100, sortBy: "languageName", orderBy: "asc"
    }
    dispatch(
      getAcademicLanguagesDataAct(
        generateActionPayload("get_academic_language_data", undefined, payload)
      )
    );
  }

  const { data: academicYearList } = academicYearListResp || {};


  return (
    <>
      <form>
        <div className="tw-px-4">
          <div className="tw-grid tw-grid-cols-12 tw-gap-3 tw-mt-0 tw-mb-3">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="academicYearId"
                value={branchClassLanguageForm.values.academicYearId}
                onChange={filterHandler}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                labelText="Academic Year"
                isDisabled={props.modalData1 && true}
                labelClass="required"
                invalid={(branchClassLanguageForm.touched.academicYearId && branchClassLanguageForm.errors.academicYearId) ? true : false}
                error={(branchClassLanguageForm.touched.academicYearId && branchClassLanguageForm.errors.academicYearId) ? branchClassLanguageForm.errors.academicYearId : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                formgroupClassName="tw-mb-0"
                value={branchClassLanguageForm.values.curriculumId}
                onChange={filterHandler}
                menuItems={examinationCurriculumResp?.data}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                isDisabled={props.modalData1 && true}
                labelClass="required"
                invalid={(branchClassLanguageForm.touched.curriculumId && branchClassLanguageForm.errors.curriculumId) ? true : false}
                error={(branchClassLanguageForm.touched.curriculumId && branchClassLanguageForm.errors.curriculumId) ? branchClassLanguageForm.errors.curriculumId : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="classId"
                value={branchClassLanguageForm.values.classId}
                onChange={filterHandler}
                menuItems={examinationClassResp?.content}
                valueKey="id"
                textKey="shortName"
                labelText="Class"
                labelClass="required"
                isDisabled={props.modalData1 && true}
                invalid={(branchClassLanguageForm.touched.classId && branchClassLanguageForm.errors.classId) ? true : false}
                error={(branchClassLanguageForm.touched.classId && branchClassLanguageForm.errors.classId) ? branchClassLanguageForm.errors.classId : ""}
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="subjectId"
                value={branchClassLanguageForm.values.subjectId}
                onChange={branchClassLanguageForm.handleChange}
                menuItems={academicSubjectsListResp || []}
                valueKey="id"
                textKey="subjectName"
                labelText="Subject"
                defaultSelect="Select"
                isDisabled={props.modalData1 && true}
                labelClass="required"
                invalid={(branchClassLanguageForm.touched.subjectId && branchClassLanguageForm.errors.subjectId) ? true : false}
                error={(branchClassLanguageForm.touched.subjectId && branchClassLanguageForm.errors.subjectId) ? branchClassLanguageForm.errors.subjectId : ""}
              />
            </div>
          </div>
        </div>
        <div className="tw-bg-gray-50 tw-px-3 tw-mx-0">
          <div className="tw-w-full tw-py-2 tw-m-0">
            <div className="tw-flex tw-items-center">
              <h6 className="tw-mb-0 tw-mr-2 tw-text-sm tw-font-medium tw-text-gray-700 tw-w-5/12">Language Name <span className="tw-text-red-500">*</span></h6>
              <h6 className="tw-mb-0 tw-text-sm tw-font-medium tw-text-gray-700 tw-w-5/12">Language Type <span className="tw-text-red-500">*</span></h6>
              {!props.modalData1 && (
                <Button
                  onClick={addNewDepartmentHndlr}
                  variant="soft"
                  className="tw-h-8 tw-w-8 tw-flex tw-items-center tw-justify-center"
                >
                  <i className="ri-add-line tw-text-lg" />
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="tw-px-3 tw-mx-0">
          <FormikProvider value={branchClassLanguageForm}>
            <FieldArray name="classLanguages">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }
                return (
                  <>
                    {branchClassLanguageForm.values.classLanguages.length > 0 &&
                      branchClassLanguageForm.values.classLanguages.map(
                        (classLanguages: any, index: any) => {
                          const inputFieldErrors: any = branchClassLanguageForm.errors.classLanguages && branchClassLanguageForm.errors.classLanguages[index] || {};
                          const inputFieldTouched = branchClassLanguageForm.touched.classLanguages && branchClassLanguageForm.touched.classLanguages[index] || {};
                          return (
                            <div
                              key={`${classLanguages.uniqueId}-${index}`}
                              className="tw-mb-3"
                            >
                              <div className="tw-w-full tw-ps-2 tw-mt-2">
                                <div className="tw-flex tw-items-center tw-gap-4">
                                  <div className="tw-w-5/12">
                                    <SelectInput
                                      name={`classLanguages[${index}].languageId`}
                                      value={classLanguages?.languageId}
                                      menuItems={academicLanguages?.data}
                                      valueKey="languageId"
                                      textKey="languageName"
                                      formgroupClassName="tw-mb-0"
                                      onChange={branchClassLanguageForm.handleChange}
                                      invalid={(inputFieldTouched.languageId && inputFieldErrors.languageId) ? true : false}
                                      error={(inputFieldTouched.languageId && inputFieldErrors.languageId) ? inputFieldErrors.languageId : ""}
                                    />
                                  </div>
                                  <div className="tw-w-5/12">
                                    <SelectInput
                                      name={`classLanguages[${index}].languageType`}
                                      value={classLanguages.languageType}
                                      onChange={branchClassLanguageForm.handleChange}
                                      menuItems={languageType}
                                      formgroupClassName="tw-mb-0"
                                      valueKey="value"
                                      textKey="label"
                                      invalid={(inputFieldTouched.languageType && inputFieldErrors.languageType) ? true : false}
                                      error={(inputFieldTouched.languageType && inputFieldErrors.languageType) ? inputFieldErrors.languageType : ""}
                                    />
                                  </div>
                                  <div className="tw-w-2/12">
                                    {index !== 0 && (
                                      <Button
                                        type="button"
                                        data-index={index}
                                        onClick={removeDepartmentHndlr}
                                        variant="wrong"
                                      >
                                        <i className="ri-delete-bin-2-fill" />
                                      </Button>
                                    )}
                                  </div>
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
        <div className="tw-flex tw-gap-2 tw-w-auto tw-items-end tw-justify-end !tw-ml-auto tw-mx-4 tw-my-4">
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
              branchClassLanguageForm.handleSubmit(event)
            }
          >
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddBranchClassLanguageModel;

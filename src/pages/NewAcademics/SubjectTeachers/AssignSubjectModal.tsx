import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import {
  MultiSelectCheckbox,
  SelectInput,
  UserDetails,
} from "../../../Components/Common";
import {
  AssignSubjectModalProps,
  ISubjectsState,
} from "./subjectTeacherTypes";

import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { generateActionPayload } from "../../../utility/reduxutility";
import { shallowEqual } from "react-redux";
import { getAssignedClassSubjectsList, resetAssignedClassSubjectsListAct } from "../../../store/academic/classSubjects/classsubjectsactions";
import { assignSubjectToTeacher, updateAssignedSubjectToTeacher } from "../../../store/academic/classTeacher/classteacheractions";
import { getBranchClassAct, getBrchSectionsAct } from "../../../store/branchsettings/branchacademics/branchacademicsactions";
import { renderOptionsSubjects, renderValueSubjects } from "./helper";
import { getSecoundLanguagesList } from "../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import Button from "../../../Components/Common/Button";

const initialValues = (editData?: any) => {
  return {
    subjects: [
      {
        classId: editData?.classId || "",
        sections: editData?.sectionsResponse || [],
        subjectId: editData?.branchClassSubjectId || "",
        languageId: editData?.languageId || "",
      },
    ]
  }
};

const AssignSubjectModal = (props: AssignSubjectModalProps) => {
  
  const [sectionDictionary, setSectionDictionary] = useState<any>({})
  const [subjectDictionary, setSubjectDictionary] = useState<any>({})
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const [subjectsListState, setSubjectsListState] = useState<ISubjectsState>(initialValues());  
  const {
    assignedClassSubjectsListResp,
    branchClassResp,
    brchSectionsResp,
    currentBranchIdResp: branchId,
    showApiLoader,
    secoundLanguageResp
  } = useAppSelector(
    ({ classSubjectsInfo, appData, branchAcademics,globalData, applicationSale }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      branchClassResp: branchAcademics.branchClassResp,
      brchSectionsResp: branchAcademics.brchSectionsResp,
      assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
      showApiLoader:globalData.showApiLoader,
      secoundLanguageResp: applicationSale.secoundLanguageResp,

    }),
    shallowEqual
  );
  const dispatch = useAppDispatch();
  const validationSchema = Yup.object().shape({
    subjects: Yup.array().of(
      Yup.object().shape({
        classId: Yup.string().required("Class is required."),
        sections: Yup.array().min(1, "Section is required."),
        subjectId: Yup.string().required("Subject is required."),
      })
    ),
  });

  const formik: any = useFormik({
    initialValues: subjectsListState,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      let payload = values.subjects.map((sub) => {
        return {
          branchClassId: sub.classId,
          academicClassSectionIds: sub.sections.map((sec) => sec.sectionId),
          subjectId: sub.subjectId,
          languageId: sub.languageId
        }
      })
      if (props.editData) {
        dispatch(updateAssignedSubjectToTeacher(generateActionPayload('update_assigned_subject_to_teacher', {
          teacherId: props.filterState.activeTeacherId,
          academicYearId: props.filterState.masterAcademicYearId,
          oldSubjectId: props.editData.branchClassSubjectId,
        },
          payload[0]
        )))
      }
      else {
        dispatch(
          assignSubjectToTeacher(
            generateActionPayload(
              "assign_subject_to_teacher",
              {
                teacherId: props.filterState.activeTeacherId,
                academicYearId: props.filterState.masterAcademicYearId,
                branchCurriculumId: props.filterState.curriculumId
              },
              payload
            )
          )
        );
      }
    }
  })

  useEffect(() => {
    if (props.isOpen && props.filterState.curriculumId) {
      setSubjectsListState(initialValues(props.editData))
      const payload = { branchId: branchId, curriculumId: props.filterState.curriculumId, academicYearId: props.filterState.masterAcademicYearId, sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
      dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      if (props.editData) {
        const payload1 = { academicYearId: props.filterState.masterAcademicYearId, branchClassId: props.editData.classId,curriculumId:props.filterState.curriculumId, pageNo: 0, pageSize: 200 }
        dispatch(
          getAssignedClassSubjectsList(
            generateActionPayload("get_assigned_class_subject_list", undefined, payload1)
          )
        );
        const payload = { branchId: branchId, academicYearId: props.filterState.masterAcademicYearId, branchCurriculumId: props.filterState.curriculumId, classId: props.editData.classId, pageNo: 0, pageSize: 100 };
        dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload)));
        fetchLanguageApiCall({
          subjectId: props.editData.branchClassSubjectId,
          classId: props.editData.classId,
        });
      }
    }
    if (!props.isOpen) {
      formik.resetForm();
      dispatch(resetAssignedClassSubjectsListAct(undefined));
    }
  }, [props.isOpen]);
  useEffect(() => {
    if (brchSectionsResp) {
      let arr: any = []
      if (Array.isArray(brchSectionsResp.data) && brchSectionsResp.data.length === 1) {
        arr = brchSectionsResp.data[0].sectionsResponse;
        setSectionDictionary((prev: any) => ({ ...prev, [brchSectionsResp.data[0].branchClassId]: arr }))
      }
    }
  }, [brchSectionsResp]);
  useEffect(() => {
    if (assignedClassSubjectsListResp) {
      let arr: any = [], classId = "";
      if (Array.isArray(assignedClassSubjectsListResp.data) && assignedClassSubjectsListResp.data.length > 0) {
        arr = assignedClassSubjectsListResp.data;
        classId = arr[0].classId;
        setSubjectDictionary((prev: any) => ({ ...prev, [classId]: arr }))
      }
    }
  }, [assignedClassSubjectsListResp])

  const getSectionOption = (classId: any) => {
    if (sectionDictionary[classId]) {
      return sectionDictionary[classId]
    }
    return [];
  }
  const getSubjectOption = (classId: any) => {
    if (subjectDictionary[classId]) {
      return subjectDictionary[classId]
    }
    return [];
  }

  function addNewTermHndlr(event: any) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        classId: "",
        sections: [],
        subjectId: "",
        languageId: ""
      });
    }
  }

  function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }
   const fetchLanguageApiCall = (otherProps?: any) => {
          const params = { instituteId: props.instituteId, branchId: branchId, academicYearId: props.filterState.masterAcademicYearId, curriculumId: props.filterState.curriculumId, ...otherProps }
          if (params.classId && params.academicYearId && params.curriculumId) {
              dispatch(getSecoundLanguagesList(generateActionPayload('get_secound_language_list', undefined, params)));
          }
      }

  function classHandler(event: any, index: number) {
    formik.handleChange(event)
    const payload = { branchId: branchId, academicYearId: props.filterState.masterAcademicYearId, branchCurriculumId: props.filterState.curriculumId, classId: event.target.value, pageNo: 0, pageSize: 100 };
    dispatch(getBrchSectionsAct(generateActionPayload("get_brch_sections", undefined, payload)));
    const payload1 = { academicYearId: props.filterState.masterAcademicYearId,curriculumId:props.filterState.curriculumId, branchClassId: event.target.value, pageNo: 0, pageSize: 200 }
    dispatch(
      getAssignedClassSubjectsList(
        generateActionPayload("get_assigned_class_subject_list", undefined, payload1)
      )
    );
    formik.setFieldValue(`subjects.${index}.sections`, [])
    formik.setFieldValue(`subjects.${index}.subjectId`, "")
    formik.setFieldValue(`subjects.${index}.languageId`, "")
  }
  function subjectHandler(event: any, index: number) {
    formik.handleChange(event)
    fetchLanguageApiCall({ subjectId: event.target.value, classId: formik.values.subjects[index].classId });
    formik.setFieldValue(`subjects.${index}.languageId`, "")
  }
  
  const { content: classTypes } = branchClassResp || {};

  const subjectScholasticTypes = formik.values.subjects.map((subject: any) => {
    const subjectOptions = getSubjectOption(subject.classId) || [];
    const selectedSubjectObj = subjectOptions.find(
      (s: any) => +s.subjectId === +subject.subjectId
    );
    return selectedSubjectObj?.scholasticType;
  });

  return (
    <div className="tw-p-5">
      <div className="tw-inline-block tw-w-full tw-mb-4">
        <UserDetails
          imageUrl={props.teacherData?.base64Image}
          displayName={props.teacherData?.employeeName}
          displayId={props.teacherData?.employeeCode}
          defaultImgType={"employee"}
        />
      </div>
      <div className="tw-grid tw-grid-cols-12 tw-gap-4">
        {!props.editData && (
          <div className="tw-col-span-12 tw-mb-2">
            <div className="tw-flex tw-items-center tw-gap-2">
              <h6 className="tw-mb-0">Assign Subject</h6>
              <Button
                onClick={addNewTermHndlr}
                variant="soft"
                className="tw-w-8 tw-h-8 tw-flex tw-items-center tw-justify-center 
                       tw-border tw-border-blue-600 tw-rounded-md 
                       hover:tw-bg-blue-50"
              >
                <i className="ri-add-line tw-text-lg tw-text-blue-600" />
              </Button>
            </div>
          </div>
        )}
        <div className="tw-col-span-12">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-3 "><h6 className="form-label required">Class</h6></div>
            <div className="tw-col-span-3"><h6 className="form-label required">Sections</h6></div>
            <div className="tw-col-span-3"><h6 className="form-label required">Subject Name</h6></div>
            <div className="tw-col-span-3"><h6>Language Name</h6></div>
          </div>
        </div>
      </div>
      <FormikProvider value={formik}>
        <FieldArray name="subjects">
          {(arrayHelpers: ArrayHelpers) => {
            if (!formikArrayHelpers.current) {
              formikArrayHelpers.current = arrayHelpers;
            }

            return (
              <>
                {formik.values.subjects.map((subject: any, index: number) => (
                  <div key={index} className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">
                    <div className="tw-col-span-3">
                      <SelectInput
                        name={`subjects.${index}.classId`}
                        value={subject?.classId || ""}
                        onChange={(event: any) => classHandler(event, index)}
                        menuItems={classTypes ? classTypes : []}
                        valueKey="id"
                        textKey="shortName"
                        labelClass="required"
                        formgroupClassName="tw-mb-0"
                        isDisabled={props?.editData || false}
                        invalid={formik.errors.subjects && formik.touched.subjects &&
                          formik.errors.subjects[index] && formik.touched.subjects[index] && formik.touched.subjects[index]['classId'] &&
                          !!formik.errors.subjects[index]["classId"]}
                        error={formik.errors.subjects && formik.touched.subjects &&
                          formik.errors.subjects[index] && formik.touched.subjects[index] && formik.touched.subjects[index]['classId'] &&
                          formik.errors.subjects[index]["classId"]}
                      />
                    </div>
                    <div className="tw-col-span-3">
                      <MultiSelectCheckbox
                        name="sections"
                        containerClassName='tw-mb-3'
                        idKey="sectionId"
                        searchKey='sectionName'
                        value={subject.sections}
                        labelClass="required"
                        renderValue={renderValueSubjects}
                        renderOptions={renderOptionsSubjects}
                        onChange={(selectedOptions: any, config?: any) => {
                          if (Array.isArray(selectedOptions) && selectedOptions.length > 0) {
                            formik.setFieldValue(`subjects.${index}.sections`, selectedOptions);
                          } else {
                            formik.setFieldValue(`subjects.${index}.sections`, []);
                          }
                        }}
                        options={getSectionOption(subject.classId) || []}
                        invalid={(formik.errors.subjects && formik.touched.subjects &&
                          formik.errors.subjects[index] && formik.touched.subjects[index] && formik.touched.subjects[index]['sections'])
                          ? true : false}
                        error={formik.errors.subjects && formik.touched.subjects &&
                          formik.errors.subjects[index] && formik.touched.subjects[index] && formik.touched.subjects[index]['sections'] &&
                          formik.errors.subjects[index]["sections"]}
                      />
                    </div>
                    <div className="tw-col-span-3">
                      <SelectInput
                        name={`subjects.${index}.subjectId`}
                        value={subject.subjectId}
                        onChange={(event: any) => subjectHandler(event, index)}
                        menuItems={getSubjectOption(subject.classId) || []}
                        valueKey="subjectId"
                        textKey="subjectName"
                        formgroupClassName="tw-mb-0"
                        labelClass="required"
                        invalid={formik.errors.subjects && formik.touched.subjects && formik.touched.subjects[index] &&
                          formik.errors.subjects[index] && formik.touched.subjects[index]['subjectId'] && !!formik.errors.subjects[index]['subjectId']}
                        error={formik.errors.subjects && formik.touched.subjects && formik.touched.subjects[index] &&
                          formik.errors.subjects[index] && formik.touched.subjects[index]['subjectId'] && formik.errors.subjects[index]['subjectId']}
                      />
                    </div>
                    <div className="tw-col-span-2">
                      <SelectInput
                        name={`subjects.${index}.languageId`}
                        value={subject.languageId}
                        onChange={formik.handleChange}
                        menuItems={secoundLanguageResp?.data || []}
                        valueKey="languageId"
                        textKey="languageName"
                        formgroupClassName="tw-mb-0"
                        isDisabled={subjectScholasticTypes[index] === "LANGUAGE" ? false : true}
                      />
                    </div>
                    {index !== 0 && (
                      <div className="tw-col-span-1 tw-flex tw-items-center">
                        <Button
                          type="button"
                          variant="wrong"
                          onClick={removeDepartmentHndlr}
                          data-index={index}
                        >
                          <i className="ri-delete-bin-2-fill tw-text-red-500 tw-text-base" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </>
            );
          }}
        </FieldArray>
      </FormikProvider>
      <div className="tw-flex tw-justify-end tw-gap-3 tw-mt-2">
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
          onClick={(event: any) => formik.handleSubmit(event)}
          disabled={showApiLoader}
        >
          {props.editData ? "Update" : "Submit"}
        </Button>
      </div>
    </div>
  )
};

export default AssignSubjectModal;

import React, { useRef, useState, useEffect } from "react";
import { FieldArray, useFormik, FormikProvider, ArrayHelpers, FormikErrors } from "formik";
import * as Yup from "yup";
import { debounce, generateUniqueNumber } from "../../../utility/commonutility";
import { AutoSearchInputUpdated, SelectInput, TextInput } from "../../../Components/Common";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../hooks/storehook";
import { getStudentByFilterAct, getStudentsListAct } from "../../../store/directory/studentmanagement/studentmanagementactions";
import { generateActionPayload } from "../../../utility/reduxutility";
import { getAssignedClassSubjectsList } from "../../../store/academic/classSubjects/classsubjectsactions";
import { deleteChangeStudentSubjectsDetailsByIdAct, saveChangeStudentSubjectsDetailsAct, updateChangeStudentSubjectsDetailsAct } from "../../../store/examination/examinationmanagement/examinationmanagementactions";
import { toast } from "react-toastify";
import Button from "../../../Components/Common/Button";

interface IExaminationMarksProps {
  id: any;
  isOpen: boolean,
  toggle: any,
  modalTitle?: string,
}

const initialValues = {
  studentId: "",
  studentName: "",
  studentCode: "",
  academicYearId: "",
  curriculumId: "",
  curriculumName: "",
  sectionId: "",
  sectionName: "",
  className: "",
  classId: "",
  subjects: [
    {
      uniqueId: generateUniqueNumber(),
      existingSubId: "",
      replaceSubId: "",
    },
  ],
};

const validationSchema = Yup.object().shape({
  subjects: Yup.array().of(
    Yup.object().shape({
      existingSubId: Yup.string().required("Please select an existing subject"),
      replaceSubId: Yup.string().required("Please select a replacement subject"),
    })
  ),
});

const ChangeStudentModel: React.FC<IExaminationMarksProps> = (props) => {
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();
  const [searchStudentState, setSearchStudentState] = useState<{
    studentId: string;
    studentCode: string;
    studentName: string;
  } | null>(null);
  const [subjectDictionary, setSubjectDictionary] = useState<any>({})
  const [subjectsToDelete, setSubjectsToDelete] = useState<number[]>([]);

  const changeStudentSubjectsModelFormik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      if (subjectsToDelete.length > 0) {
        subjectsToDelete.forEach((id) => {
          dispatch(
            deleteChangeStudentSubjectsDetailsByIdAct(
              generateActionPayload("delete_saved_change_student_subjects", { id })
            )
          );
        });
      }
      if (props?.id) {
        const transformedPayload = {
          existingSubId: values.subjects.map((subject: any) => Number(subject.existingSubId)),
          replaceSubId: values.subjects.map((subject: any) => Number(subject.replaceSubId)),
        };
        
        dispatch(
          updateChangeStudentSubjectsDetailsAct(
            generateActionPayload("update_change_student_subjects",  { id: props.id }, transformedPayload)
          )
        );
        
      } else {
        const transformedPayload = {
          branchId: branchId,
          academicYearId: values.academicYearId,
          curriculumId: values.curriculumId === "CBSE" ? 1 : values.curriculumId,
          classId: values.classId,
          sectionId: values.sectionId,
          studentId: values.studentId,
          existingSubId: values.subjects.map((subject: any) => Number(subject.existingSubId)),
          replaceSubId: values.subjects.map((subject: any) => Number(subject.replaceSubId)),
        };
        dispatch(
          saveChangeStudentSubjectsDetailsAct(
            generateActionPayload("save_change_student_subjects", undefined, transformedPayload)
          )
        );
      }
      setSubjectsToDelete([]);
    },
  });

  const {
    academicYearListResp,
    brchCurriculumResp,
    branchClassResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    studentsListResp, getStudentsByFilterResp,
    assignedClassSubjectsListResp, changeStudentSubjectsDetailsByIdResp, deleteChangeStudentSubjectsByIdResp,
  } = useAppSelector(
    ({ instAcademics, branchAcademics, appData, classSubjectsInfo, examinationManagement, directoryStudent }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      branchClassResp: branchAcademics.branchClassResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      studentsListResp: directoryStudent.studentsListResp,
      getStudentsByFilterResp: directoryStudent.getStudentsByFilterResp,
      changeStudentSubjectsDetailsByIdResp: examinationManagement.changeStudentSubjectsDetailsByIdResp,
      deleteChangeStudentSubjectsByIdResp: examinationManagement.deleteChangeStudentSubjectsByIdResp,
      assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
    }),
    shallowEqual
  );

  const changeStudentSubjectsModelRef = useRef<any>({
    prevChangeStudentSubjectsDetailsByIdResp: changeStudentSubjectsDetailsByIdResp,
    prevDelChangeStudentSubjectsByIdResp: deleteChangeStudentSubjectsByIdResp,
  })

  useEffect(() => {
    const { prevChangeStudentSubjectsDetailsByIdResp, prevDelChangeStudentSubjectsByIdResp } = changeStudentSubjectsModelRef.current || {};

    if (
      changeStudentSubjectsDetailsByIdResp &&
      prevChangeStudentSubjectsDetailsByIdResp !== changeStudentSubjectsDetailsByIdResp
    ) {
      if (props?.id) {
        const { academicYearId, studentId, studentCode, studentName, classId, curriculumId, curriculumName, sectionId, className, sectionName, subjectsDetailsDtos } = changeStudentSubjectsDetailsByIdResp;

        const subjects = subjectsDetailsDtos?.map((subject: any) => ({
          uniqueId: generateUniqueNumber(),
          existingSubId: subject.existingSubjectId,
          existingSubName: subject.existingSubjectName,
          replaceSubId: subject.newSubjectId,
          replaceSubName: subject.newSubjectName,
        }));

        changeStudentSubjectsModelFormik.setValues((prev: any) => ({
          ...prev,
          academicYearId,
          studentId: String(studentId),
          studentCode,
          studentName,
          classId,
          curriculumId,
          curriculumName,
          sectionId,
          className,
          sectionName,
          subjects,
        }));
        if (classId && curriculumId) {
          const payload1 = {
            academicYearId,
            branchClassId: classId,
            curriculumId,
            pageNo: 0,
            pageSize: 200,
          };

          dispatch(
            getAssignedClassSubjectsList(
              generateActionPayload("get_assigned_class_subject_list", undefined, payload1)
            )
          );
        }
      }
    }
    changeStudentSubjectsModelRef.current.prevChangeStudentSubjectsDetailsByIdResp = changeStudentSubjectsDetailsByIdResp;
    changeStudentSubjectsModelRef.current.prevDelChangeStudentSubjectsByIdResp = deleteChangeStudentSubjectsByIdResp;
  }, [changeStudentSubjectsDetailsByIdResp, deleteChangeStudentSubjectsByIdResp]);

  useEffect(() => {
    if (!props?.id && academicYearListResp) {
      const yearId = academicYearListResp.data?.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;
      if (yearId) {
        changeStudentSubjectsModelFormik.setFieldValue("academicYearId", yearId);
      }
    }
  }, [academicYearListResp, props?.id]);

  useEffect(() => {
    if (Array.isArray(assignedClassSubjectsListResp?.data) && assignedClassSubjectsListResp?.data?.length>0) {
      const subjectsByClassId = assignedClassSubjectsListResp.data.reduce(
        (acc: any, subject: any) => {
          const { classId } = subject || {};
          if (!acc[classId]) {
            acc[classId] = [];
          }
          acc[classId].push(subject);
          return acc;
        },
        {}
      );
      setSubjectDictionary((prev: any) => ({
        ...prev,
        ...subjectsByClassId,
      }));
    }
  }, [assignedClassSubjectsListResp]);
  
  function delModalSubmitHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const index = Number(event.currentTarget.getAttribute("data-index"));
    const subjectDetailsId = changeStudentSubjectsDetailsByIdResp?.subjectsDetailsDtos?.[index]?.subjectDetailsId;

    if (subjectDetailsId) {
      setSubjectsToDelete((prev) => [...prev, subjectDetailsId]); // Store the ID instead of calling API immediately
    }
  }

  function onInputSearchChange(inputString: string) {
    const { academicYearId } = changeStudentSubjectsModelFormik.values;
    if (inputString && academicYearId) {
      const params = {
        branchId,
        academicYearId,
        searchString: inputString,
      };
      dispatch(getStudentsListAct(generateActionPayload("get_students", undefined, params)));
    }
  }

  const debouncedSearch = debounce(onInputSearchChange, 1000);

  function handleStudentSearchChange(inputString: string) {
    if (!inputString) {
      changeStudentSubjectsModelFormik.setValues({
        ...changeStudentSubjectsModelFormik.values,
        studentId: "",
        studentName: "",
        className: "",
        curriculumId: "",
        sectionName: "",
      });
      setSearchStudentState(null);
    } else {
      debouncedSearch(inputString);
    }
  }

  function selectedStudent(student: any) {
    if (student) {
      changeStudentSubjectsModelFormik.setValues({
        ...changeStudentSubjectsModelFormik.values,
        studentId: String(student.studentId),
        studentName: student.studentName,
        studentCode: student.studentCode,
        curriculumId: student.curriculumId,
        curriculumName: student.curriculumName,
        className: student.className,
        classId: student.classId,
        sectionId: student.sectionId,
        sectionName: student.sectionName,
      });
      setSearchStudentState({
        studentId: student.studentId,
        studentName: student.studentName,
        studentCode: student.studentCode,
      });
      if (student.classId && student.curriculumId) {
        const payload1 = {
          academicYearId: changeStudentSubjectsModelFormik.values.academicYearId,
          branchClassId: student.classId,
          curriculumId: student.curriculumId,
          pageNo: 0,
          pageSize: 200,
        };
        dispatch(
          getAssignedClassSubjectsList(
            generateActionPayload("get_assigned_class_subject_list", undefined, payload1)
          )
        );
      }
    }
  }

  function addNewDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        existingSubject: "",
        replaceSubId: "",
      });
    }
  }

  function removeDepartmentHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined || rowIndex !== null) {
      formikArrayHelpers.current?.remove(Number(rowIndex));
    }
  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    if (name === "academicYearId") {
      changeStudentSubjectsModelFormik.setValues((prev: any) => ({ ...prev, [name]: value }))
    } else {
      changeStudentSubjectsModelFormik.setValues((prev: any) => ({ ...prev, [name]: value }))
    }
  };

  const getSubjectOption = (classId: any) => {
    if (subjectDictionary[classId]) {
      return subjectDictionary[classId].map((subject: any) => ({
        subjectId: subject.subjectId,
        subjectName: subject.subjectName,
      }));
    }
    return [];
  };

  const { data: academicYearList } = academicYearListResp || {};

  return (
    <>
      <form>
        <div className="tw-p-5">
          <div className="tw-grid tw-grid-cols-12 tw-gap-4">
            <div className="tw-col-span-12 md:tw-col-span-6">
              <SelectInput
                name="academicYearId"
                labelText="Academic Year"
                labelClass="required"
                value={changeStudentSubjectsModelFormik.values.academicYearId}
                onChange={handleSelectChange}
                menuItems={academicYearList || []}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="tw-mb-0"
                isDisabled={!!props?.id}
                invalid={
                  !!changeStudentSubjectsModelFormik.touched.academicYearId &&
                  !!changeStudentSubjectsModelFormik.errors.academicYearId
                }
                error={
                  changeStudentSubjectsModelFormik.touched.academicYearId &&
                    changeStudentSubjectsModelFormik.errors.academicYearId
                    ? changeStudentSubjectsModelFormik.errors.academicYearId
                    : ""
                }
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="curriculumName"
                labelText="Curriculum"
                formgroupClassName="tw-mb-0"
                value={changeStudentSubjectsModelFormik.values.curriculumName}
                onChange={changeStudentSubjectsModelFormik.handleChange}
                inputClassName="tw-bg-gray-100 tw-border-0"
                isDisabled
              />
            </div>
            <div className="tw-col-span-12">
              <AutoSearchInputUpdated
                formgroupClassName="tw-mb-0"
                name="studentId"
                placeHolder="Search..."
                onChange={handleStudentSearchChange}
                valueKey="studentId"
                labelHeader="Student Code"
                labelKey="studentCode"
                subLabelHeader="Student Name"
                subLabelKey="studentName"
                labelText="Student"
                labelClass="required"
                isDisabled={!!props?.id}
                options={Array.isArray(studentsListResp?.data) ? studentsListResp?.data : []}
                selected={
                  searchStudentState?.studentId
                    ? searchStudentState
                    : changeStudentSubjectsModelFormik.values.studentId
                      ? {
                        studentId: changeStudentSubjectsModelFormik.values.studentId,
                        studentName: changeStudentSubjectsModelFormik.values.studentName,
                        studentCode: changeStudentSubjectsModelFormik.values.studentCode,
                      }
                      : null
                }
                selectedOptionCallbck={selectedStudent}
                invalid={
                  !!changeStudentSubjectsModelFormik.touched.studentId &&
                  !!changeStudentSubjectsModelFormik.errors.studentId
                }
                error={
                  changeStudentSubjectsModelFormik.touched.studentId &&
                    changeStudentSubjectsModelFormik.errors.studentId
                    ? changeStudentSubjectsModelFormik.errors.studentId
                    : ""
                }
              >
                <i className="ri-search-line tw-text-gray-400"></i>
              </AutoSearchInputUpdated>
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="className"
                labelText="Class"
                formgroupClassName="tw-mb-0"
                value={changeStudentSubjectsModelFormik.values.className}
                inputClassName="tw-bg-gray-100 tw-border-0"
                isDisabled
              />
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              <TextInput
                name="sectionName"
                labelText="Section"
                formgroupClassName="tw-mb-0"
                value={changeStudentSubjectsModelFormik.values.sectionName}
                inputClassName="tw-bg-gray-100 tw-border-0"
                isDisabled
              />
            </div>
          </div>
          <div className="tw-mt-6 tw-flex tw-items-center tw-gap-3">
            <h6 className="tw-text-sm tw-font-medium tw-text-gray-700">
              Change Subject
            </h6>
            <Button
              type="button"
              variant="hoverInfo"
              onClick={addNewDepartmentHndlr}
              className="!tw-py-1 !tw-px-2"
            >
              <i className="ri-add-line"></i>
            </Button>
          </div>
        </div>
        <div className="tw-bg-gray-100 tw-py-3 tw-px-5 tw-font-medium tw-text-gray-700">
          <div className="tw-grid tw-grid-cols-12">
            <div className="tw-col-span-12 md:tw-col-span-6 from-lable required">
              Existing Subject
            </div>
            <div className="tw-col-span-12 md:tw-col-span-6">
              Replacing Subject
            </div>
          </div>
        </div>
        <div className="tw-p-5">
          <FormikProvider value={changeStudentSubjectsModelFormik}>
            <FieldArray name="subjects">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }

                return (
                  <>
                    {changeStudentSubjectsModelFormik.values.subjects.map(
                      (subject, index) => {

                        const inputFieldErrors =
                          Array.isArray(changeStudentSubjectsModelFormik.errors.subjects) &&
                            typeof changeStudentSubjectsModelFormik.errors.subjects[index] === "object"
                            ? changeStudentSubjectsModelFormik.errors.subjects[index]
                            : {};

                        const inputFieldTouched =
                          Array.isArray(changeStudentSubjectsModelFormik.touched.subjects) &&
                            typeof changeStudentSubjectsModelFormik.touched.subjects[index] === "object"
                            ? changeStudentSubjectsModelFormik.touched.subjects[index]
                            : {};

                        return (
                          <div key={subject.uniqueId} className="tw-grid tw-grid-cols-12 tw-gap-4 tw-mb-4">
                            <div className="tw-col-span-12 md:tw-col-span-6">
                              <SelectInput
                                name={`subjects.${index}.existingSubId`}
                                value={subject.existingSubId}
                                onChange={changeStudentSubjectsModelFormik.handleChange}
                                menuItems={getSubjectOption(changeStudentSubjectsModelFormik.values.classId)}
                                valueKey="subjectId"
                                textKey="subjectName"
                                formgroupClassName="tw-mb-0"
                                invalid={!!inputFieldTouched?.existingSubId && !!inputFieldErrors?.existingSubId}
                                error={
                                  inputFieldTouched?.existingSubId && inputFieldErrors?.existingSubId
                                    ? inputFieldErrors.existingSubId
                                    : ""
                                }
                              />
                            </div>
                            <div className="tw-col-span-12 md:tw-col-span-6">
                              <div className="tw-flex tw-items-center tw-gap-3">
                                <div className="tw-w-full">
                                  <SelectInput
                                    name={`subjects.${index}.replaceSubId`}
                                    value={subject.replaceSubId}
                                    onChange={changeStudentSubjectsModelFormik.handleChange}
                                    menuItems={getSubjectOption(changeStudentSubjectsModelFormik.values.classId)}
                                    valueKey="subjectId"
                                    textKey="subjectName"
                                    formgroupClassName="tw-mb-0"
                                    invalid={!!inputFieldTouched?.replaceSubId && !!inputFieldErrors?.replaceSubId}
                                    error={
                                      inputFieldTouched?.replaceSubId && inputFieldErrors?.replaceSubId
                                        ? inputFieldErrors.replaceSubId
                                        : ""
                                    }
                                  />
                                </div>
                                {(props?.id || index !== 0) && (
                                  <Button
                                    type="button"
                                    variant="wrong"
                                    onClick={(event) => {
                                      removeDepartmentHndlr(event);
                                      if (props?.id) delModalSubmitHndlr(event);
                                    }}
                                    className="tw-p-2"
                                  >
                                    <i className="ri-delete-bin-2-fill"></i>
                                  </Button>
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
              onClick={(event: any) =>
                changeStudentSubjectsModelFormik.handleSubmit(event)
              }
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default ChangeStudentModel;

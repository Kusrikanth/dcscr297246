import React, { useRef, useState, useEffect } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { DateInput, InputCheckbox, SelectInput } from "../../../../Components/Common";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { getCbseExaminationSubjectOrderAct, saveCbseExaminationSubjectOrderAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import * as Yup from "yup";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { nanoid } from "nanoid";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { HugeiconsIcon } from "@hugeicons/react";
import { DragDropHorizontalIcon } from "@hugeicons-pro/core-stroke-standard";

const initialValues: any = {
  classId: "",
  academicYearId: "",
  curriculumId: "",
  allPrecentage: false,
  allprogresscard: false,
  examinationSubjects: [],
};

const validationSchema = () => {
  return Yup.object().shape({
    academicYearId: Yup.string().required("Academic year is required"),
    curriculumId: Yup.string().required("Curriculum is required"),
    classId: Yup.string().required("Class is required"),
    examinationSubjects: Yup.array().of(
      Yup.object().shape({
        subjectId: Yup.string()
          .required("Subject is required.")
          .nullable()
          .test("unique-subjectId", "Subject already chosen", function (value) {
            const { examinationSubjects } = this.options.context || {};
            if (!value || !examinationSubjects) return true;
            const subjectIds = examinationSubjects.map((s: any) => s.subjectId);
            return subjectIds.filter((id: string) => id === value).length <= 1;
          }),
        displayorder: Yup.string()
          .nullable()
          .test("unique-displayorder", "Display Order must be unique", function (value) {
            const { examinationSubjects } = this.options.context || {};
            if (!value || !examinationSubjects) return true;
            const currentPath = this.path;
            const currentIndexMatch = currentPath.match(/examinationSubjects\[(\d+)\]/);
            const currentIndex = currentIndexMatch ? parseInt(currentIndexMatch[1]) : -1;
            const duplicateCount = examinationSubjects.filter((subject: any, index: number) => 
              subject.displayorder === value && index !== currentIndex
            ).length;
            return duplicateCount === 0;
          }),
        gradeBookOrder: Yup.string()
          .nullable()
          .test("unique-gradeBookOrder", "Grade Book Order must be unique", function (value) {
            const { examinationSubjects } = this.options.context || {};
            if (!value || !examinationSubjects) return true;
            const currentPath = this.path;
            const currentIndexMatch = currentPath.match(/examinationSubjects\[(\d+)\]/);
            const currentIndex = currentIndexMatch ? parseInt(currentIndexMatch[1]) : -1;
            const duplicateCount = examinationSubjects.filter((subject: any, index: number) => 
              subject.gradeBookOrder === value && index !== currentIndex
            ).length;
            return duplicateCount === 0;
          }),
      })
    ),
  });
};

const SortableSubjectRow = ({ id, grade, index, props, formik, handleSubjectChange, handleIndividualCheckboxChange, handleRowSelectionChange, removeGradesHndlr, removeSlabHndlr, selectedSubjectTypes, getCbseExaminationSubjectOrderResp }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: 'none',
  };

  const inputFieldErrors: any = formik.errors.examinationSubjects && formik.errors.examinationSubjects[index] || {};
  const inputFieldTouched: any = formik.touched.examinationSubjects && formik.touched.examinationSubjects[index] || {};

  return (
    <div ref={setNodeRef} style={style} className="row pt-3 px-4 align-items-center">
      <div className="col-1 mb-4">
        <span {...attributes} {...listeners} style={{ cursor: 'grab', display: 'inline-flex' }}>
          <HugeiconsIcon icon={DragDropHorizontalIcon} size={24} color={"#6c757d"} />
        </span>
      </div>
      
      <div className="col-12 col-md-4 d-grid">
        <div className="d-flex">
          {props.id && (
            <InputCheckbox
              name={`examinationSubjects[${index}].isSelected`}
              formgroupClassName="d-flex align-items-center"
              value={grade.isSelected}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleRowSelectionChange(index, e.target.checked)
              }
            />
          )}
          <SelectInput
            name={`examinationSubjects[${index}].subjectId`}
            labelClass="required"
            formgroupClassName="mb-0 me-2 w-90"
            value={grade.subjectId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSubjectChange(index, e)}
            menuItems={getCbseExaminationSubjectOrderResp}
            valueKey="subjectId"
            textKey="subjectName"
            invalid={inputFieldTouched.subjectId && inputFieldErrors.subjectId}
            error={inputFieldTouched.subjectId && inputFieldErrors.subjectId ? inputFieldErrors.subjectId : ""}
            isDisabled={!!props.id && !grade.isSelected}
          />
        </div>
        {grade.subjectId && (
          <div className={`mt-2 ${props.id ? "ms-4" : "ms-2"} fs-12`}>
            <span className="fw-bold text-muted">
              {selectedSubjectTypes[index] || "n/a"}
            </span>
          </div>
        )}
      </div>
      
      {location.pathname.includes("cbse-settings") && (<><div className="col-12 col-md-3">
        <InputCheckbox
          name={`examinationSubjects[${index}].isDisplayInProgressCard`}
          value={grade.isDisplayInProgressCard}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIndividualCheckboxChange(index, "isDisplayInProgressCard", e)}
          isDisabled={!!props.id && !grade.isSelected}
        />
      </div>
      
      <div className="col-12 col-md-3">
        <InputCheckbox
          name={`examinationSubjects[${index}].isIncludeInPercentage`}
          value={grade.isIncludeInPercentage}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIndividualCheckboxChange(index, "isIncludeInPercentage", e)}
          isDisabled={!!props.id && !grade.isSelected}
        />
      </div></>)}
      
      {/* <div className="col-auto">
        {(props.id || index !== 0) && (
          <button
            data-index={index}
            onClick={props.id ? removeGradesHndlr : removeSlabHndlr}
            disabled={!!props.id && !grade.isSelected}
            className="btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white"
          >
            <i className="ri-delete-bin-2-fill" />
          </button>
        )}
      </div> */}
    </div>
  );
};

const AddExaminationMarksModel = (props: any) => {
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedSubjectTypes, setSelectedSubjectTypes] = useState<{ [key: number]: string }>({});

  const addExaminationMarksFormik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema(),
    initialValues,
    onSubmit: (values) => {
      const payload = {
        branchId: branchId,
        academicYearId: values.academicYearId,
        curriculumId: values.curriculumId,
        classId: values.classId,
        requestDTOList: values.examinationSubjects.map((subject: any, index: number) => {
          const payloadItem: any = {
            subjectId: subject.subjectId,
            isDisplayProgressCard: subject.isDisplayInProgressCard || false,
            isIncludePercentage: subject.isIncludeInPercentage || false,
            displayOrder: index + 1,
            gradeBookOrder: subject.gradeBookOrder || null
          };
  
          if (subject.apiId && typeof subject.apiId === 'number') {
            payloadItem.id = subject.apiId;
          }
  
          return payloadItem;
        })
      }

        dispatch(saveCbseExaminationSubjectOrderAct(
          generateActionPayload("save_cbse_examination_subject_order", undefined, payload)
        ));
    },
  });

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    getAssignLanClassListResp,
    getAssignListCurriculumResp,
    getCbseExaminationSubjectOrderResp
  } = useAppSelector(
    ({ instAcademics, appData, examinationSettings, assignLanguages }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      getCbseExaminationSubjectOrderResp: examinationSettings.getCbseExaminationSubjectOrderResp,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (getCbseExaminationSubjectOrderResp && Array.isArray(getCbseExaminationSubjectOrderResp)) {
      const subjects = getCbseExaminationSubjectOrderResp.map((item: any) => ({
        id: item.id && typeof item.id === 'number' ? item.id : nanoid(), 
        apiId: item.id && typeof item.id === 'number' ? item.id : null, 
        subjectId: item.subjectId?.toString() || "",
        isIncludeInPercentage: item.isIncludePercentage || false,
        isDisplayInProgressCard: item.isDisplayProgressCard || false,
        displayorder: item.displayOrder?.toString() || "",
        gradeBookOrder: item.gradeBookOrder?.toString() || "",
        isSelected: false,
        subjectType: item.subjectType || "",
      }));

      const sortedSubjects = subjects.sort((a: any, b: any) => {
        if (a.displayorder && b.displayorder) {
          return parseInt(a.displayorder) - parseInt(b.displayorder);
        }
        return 0;
      });

      addExaminationMarksFormik.setFieldValue("examinationSubjects", sortedSubjects);

      const types: { [key: number]: string } = {};
      sortedSubjects.forEach((subject: any, index: number) => {
        const apiSubject = getCbseExaminationSubjectOrderResp.find(
          (item: any) => item.subjectId?.toString() === subject.subjectId
        );
        if (apiSubject) {
          types[index] = apiSubject.subjectType || "n/a";
        }
      });
      setSelectedSubjectTypes(types);
    }
  }, [getCbseExaminationSubjectOrderResp]);

  useEffect(() => {
    if (props.modalData) {
      const { academicYearId, curriculumId } = props.modalData || {};
      addExaminationMarksFormik.setValues((prev: any) => ({ ...prev, academicYearId, curriculumId }));
      if (academicYearId) {
        getCurriculumApiCall({ academicYearId });
      }
      if (curriculumId) {
        const payload = { branchId: branchId, curriculumId, academicYearId, classFilter: "HIGHER", sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
    }
    return () => {
      addExaminationMarksFormik.resetForm();
    };
  }, []);

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: addExaminationMarksFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  };

  const getExaminationSubjectsApiCall = (classId: string) => {
    const payload: any = {
      branchId,
      curriculumId: addExaminationMarksFormik.values.curriculumId,
      academicYearId: addExaminationMarksFormik.values.academicYearId,
      classId,
      pageNo: 0,
      pageSize: 100,
    };
    if (payload.academicYearId && payload.classId && payload.curriculumId) {
      dispatch(getCbseExaminationSubjectOrderAct(generateActionPayload("get_cbse_examination_subject_order", undefined, payload)));
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    addExaminationMarksFormik.setFieldValue(name, value);

    if (value) {
      if (name === "academicYearId") {
        getCurriculumApiCall({ academicYearId: value });
        addExaminationMarksFormik.setValues((prev) => ({
          ...prev,
          academicYearId: value,
          classId: "",
          examinationSubjects: [],
        }));
      } else if (name === "curriculumId") {
        addExaminationMarksFormik.setValues((prev) => ({
          ...prev,
          curriculumId: value,
          classId: "",
          examinationSubjects: [],
        }));
      } else if (name === "classId") {
        addExaminationMarksFormik.setValues((prev) => ({
          ...prev,
          classId: value,
          examinationSubjects: [],
        }));
        getExaminationSubjectsApiCall(value);
      }
    }
  };

  const handleSubjectChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.subjectId`, selectedId);
    
    const selectedSubject = getCbseExaminationSubjectOrderResp?.find(
      (item: any) => item.subjectId?.toString() === selectedId
    );
    if (selectedSubject) {
      setSelectedSubjectTypes(prev => ({
        ...prev,
        [index]: selectedSubject.subjectType || "n/a"
      }));
    }
  };

  useEffect(() => {
    if (getAssignLanClassListResp && Array.isArray(getAssignLanClassListResp.content)) {
      const classId = getAssignLanClassListResp.content[0].id;
      addExaminationMarksFormik.setFieldValue("classId", classId);
      getExaminationSubjectsApiCall(classId);
    }
  }, [getAssignLanClassListResp]);

  const handleAllPrecentageChange = (isChecked: boolean) => {
    addExaminationMarksFormik.setFieldValue("allPrecentage", isChecked);
    const updatedSubjects = addExaminationMarksFormik.values.examinationSubjects.map((subject: any) => ({
      ...subject,
      isIncludeInPercentage: isChecked
    }));
    addExaminationMarksFormik.setFieldValue("examinationSubjects", updatedSubjects);
  };

  const handleAllProgressCardChange = (isChecked: boolean) => {
    addExaminationMarksFormik.setFieldValue("allprogresscard", isChecked);
    const updatedSubjects = addExaminationMarksFormik.values.examinationSubjects.map((subject: any) => ({
      ...subject,
      isDisplayInProgressCard: isChecked
    }));
    addExaminationMarksFormik.setFieldValue("examinationSubjects", updatedSubjects);
  };

  const handleIndividualCheckboxChange = (index: number, type: "isIncludeInPercentage" | "isDisplayInProgressCard", event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    const updatedSubjects = [...addExaminationMarksFormik.values.examinationSubjects];
    updatedSubjects[index][type] = checked;
    addExaminationMarksFormik.setFieldValue("examinationSubjects", updatedSubjects);
    const allChecked = updatedSubjects.every((subject: any) => subject[type]);
    if (type === "isIncludeInPercentage") {
      addExaminationMarksFormik.setFieldValue("allPrecentage", allChecked);
    } else if (type === "isDisplayInProgressCard") {
      addExaminationMarksFormik.setFieldValue("allprogresscard", allChecked);
    }
  };

  function removeGradesHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined && rowIndex !== null) {
      const subjectToRemove: any = addExaminationMarksFormik.values.examinationSubjects[Number(rowIndex)];
      if (!subjectToRemove.subjectId && !subjectToRemove.isSelected) {
        formikArrayHelpers.current?.remove(Number(rowIndex));
        return;
      }
      if (subjectToRemove.isSelected) {
        formikArrayHelpers.current?.remove(Number(rowIndex));
      }
    }
  }

  function removeSlabHndlr(event: React.MouseEvent<HTMLElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined && rowIndex !== null) {
      const index = Number(rowIndex);
      addExaminationMarksFormik.setFieldTouched(`examinationSubjects[${index}]`, false);
      addExaminationMarksFormik.setErrors({});
      formikArrayHelpers.current?.remove(index);
    }
  }

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    addExaminationMarksFormik.setFieldValue(
      "examinationSubjects",
      addExaminationMarksFormik.values.examinationSubjects.map((subject: any) => ({
        ...subject,
        isSelected: checked,
      }))
    );
  };

  const handleRowSelectionChange = (index: number, checked: boolean) => {
    const updatedSubjects = [...addExaminationMarksFormik.values.examinationSubjects];
    updatedSubjects[index].isSelected = checked;
    addExaminationMarksFormik.setFieldValue("examinationSubjects", updatedSubjects);
    setSelectAll(updatedSubjects.every((subject: any) => subject.isSelected));
  };

  // Drag and Drop Handler
  const handleDragEnd = (event: any) => {
    const { active, over } = event || {};
    if (active && over && active.id !== over.id) {
      const subjects = addExaminationMarksFormik.values.examinationSubjects;
      const oldIndex = subjects.findIndex((subject: any) => subject.id === active.id);
      const newIndex = subjects.findIndex((subject: any) => subject.id === over.id);
      
      const reorderedSubjects = arrayMove(subjects, oldIndex, newIndex);
      
      // Update displayorder after reordering
      const updatedSubjects = reorderedSubjects.map((subject: any, index: number) => ({
        ...subject,
        displayorder: (index + 1).toString()
      }));
      
      addExaminationMarksFormik.setFieldValue("examinationSubjects", updatedSubjects);
    }
  };

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {};
  const { content: classTypes } = getAssignLanClassListResp || {};

  return (
    <>
      <form onSubmit={addExaminationMarksFormik.handleSubmit} className="examination-setting">
        <div className="row px-4 mb-3">
          <div className="row g-3">
            <div className="col-xs-12 col-md-3 mt-2 mb-2">
              <SelectInput
                name="academicYearId"
                labelText="Academic Year"
                labelClass="required"
                value={addExaminationMarksFormik.values.academicYearId}
                onChange={handleSelectChange}
                menuItems={academicYearList}
                valueKey="academicYearId"
                textKey="academicYearName"
                formgroupClassName="mb-0"
                isDisabled={props?.id ? true : false}
                invalid={(addExaminationMarksFormik.touched.academicYearId && addExaminationMarksFormik.errors.academicYearId) ? true : false}
                error={(addExaminationMarksFormik.touched.academicYearId && addExaminationMarksFormik.errors.academicYearId) ? addExaminationMarksFormik.errors.academicYearId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-3 mt-2">
              <SelectInput
                name="curriculumId"
                labelText="Curriculum"
                labelClass="required"
                value={addExaminationMarksFormik.values.curriculumId}
                onChange={handleSelectChange}
                menuItems={curriculumTypes}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                formgroupClassName="mb-0"
                isDisabled={true}
                invalid={(addExaminationMarksFormik.touched.curriculumId && addExaminationMarksFormik.errors.curriculumId) ? true : false}
                error={(addExaminationMarksFormik.touched.curriculumId && addExaminationMarksFormik.errors.curriculumId) ? addExaminationMarksFormik.errors.curriculumId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-3 mt-2">
              <SelectInput
                name="classId"
                labelText="Class"
                labelClass="required"
                value={addExaminationMarksFormik.values.classId}
                onChange={handleSelectChange}
                menuItems={classTypes}
                valueKey="id"
                textKey="shortName"
                formgroupClassName="mb-0"
                isDisabled={props?.id ? true : false}
                invalid={(addExaminationMarksFormik.touched.classId && addExaminationMarksFormik.errors.classId) ? true : false}
                error={(addExaminationMarksFormik.touched.classId && addExaminationMarksFormik.errors.classId) ? addExaminationMarksFormik.errors.classId : ""}
              />
            </div>
          </div>
        </div>
        <div className="bg-light py-3 px-4">
          <div className="row">
            <div className="col-12 col-md-1">
            </div>
            <div className="col-12 col-md-4 d-flex">
              {props.id && (
                <InputCheckbox
                  name="selectAll"
                  value={selectAll}
                  onChange={(e: { target: { checked: boolean } }) =>
                    handleSelectAllChange(e.target.checked)
                  }
                />
              )}
              Subject
            </div>
            {location.pathname.includes("cbse-settings") && 
            (<><div className="col-12 col-md-3 d-flex">
              <InputCheckbox
                name="allprogresscard"
                value={addExaminationMarksFormik.values.allprogresscard}
                onChange={(e: { target: { checked: boolean } }) => handleAllProgressCardChange(e.target.checked)}
              />
              <span>
                <label className="fs-12 mb-0">Display In</label>
                <label className="fs-12 mb-0">ProgressCard</label>
              </span>
            </div>
            <div className="col-12 col-md-3 d-flex">
              <InputCheckbox
                name="allPrecentage"
                value={addExaminationMarksFormik.values.allPrecentage}
                onChange={(e: { target: { checked: boolean } }) => handleAllPrecentageChange(e.target.checked)}
              />
              <span>
                <label className="fs-12 mb-0">Include In</label>
                <label className="fs-12 mb-0">Percentage</label>
              </span>
            </div></>)
            }
          </div>
        </div>
        <div className="border-bottom pb-3">
          <FormikProvider value={addExaminationMarksFormik}>
            <FieldArray name="examinationSubjects">
              {(arrayHelpers: ArrayHelpers) => {
                if (!formikArrayHelpers.current) {
                  formikArrayHelpers.current = arrayHelpers;
                }
                return (
                  <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext 
                      items={addExaminationMarksFormik.values.examinationSubjects.map((s: any) => s.id)} 
                      strategy={verticalListSortingStrategy}
                    >
                      {addExaminationMarksFormik.values.examinationSubjects.length > 0 &&
                        addExaminationMarksFormik.values.examinationSubjects.map((grade: any, index: number) => (
                          <SortableSubjectRow
                            key={grade.id}
                            id={grade.id}
                            grade={grade}
                            index={index}
                            props={props}
                            formik={addExaminationMarksFormik}
                            handleSubjectChange={handleSubjectChange}
                            handleIndividualCheckboxChange={handleIndividualCheckboxChange}
                            handleRowSelectionChange={handleRowSelectionChange}
                            removeGradesHndlr={removeGradesHndlr}
                            removeSlabHndlr={removeSlabHndlr}
                            selectedSubjectTypes={selectedSubjectTypes}
                            getCbseExaminationSubjectOrderResp={getCbseExaminationSubjectOrderResp}
                          />
                        ))}
                    </SortableContext>
                  </DndContext>
                );
              }}
            </FieldArray>
          </FormikProvider>
        </div>
        <div className="row w-100">
          <div className="d-flex gap-2 w-auto ms-auto mx-4 my-3">
            <button type="button" className={"btn btn-light"} onClick={props.toggle}>
              Cancel
            </button>
            <button
              type="button"
              className={`btn btn-success`}
              onClick={(event: any) => addExaminationMarksFormik.handleSubmit(event)}
            >
              {props?.id ? "Update" : "Save"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default AddExaminationMarksModel;
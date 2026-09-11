import React, { useRef, useState, useEffect } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik, } from "formik";
import { DateInput, InputCheckbox, SelectInput, TextInputWithRegex, TimeInput } from "../../../../Components/Common";
import { subjectType } from "./helper";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editCbseExaminationSubjectsListAct, getCBSEAllSubjectsOrderAct, getCbseExaminationListAct, getSubjectsListAct, saveCbseExaminationSubjectsListAct, setCbseExaminationListAct, setSubjectsListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import * as Yup from "yup";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { nanoid } from "nanoid";
import { getAssignedClassSubjectsList, resetAssignedClassSubjectsListAct } from "../../../../store/academic/classSubjects/classsubjectsactions";

interface ExaminationSubject {
  id: string;
  subjectId: string;
  isIncludeInPercentage: boolean;
  isDisplayInProgressCard: boolean;
  maxMarks: string;
  passMarks: string;
  displayorder: string;
  gradeBookOrder: string;
  examDate: string;
  startTime: string;
  endTime: string;
  isSelected?: boolean;
}

interface ExaminationFormValues {
  classId: string;
  academicYearId: string;
  curriculumId: string;
  examinationId: string;
  subjectType: string;
  allPrecentage: boolean;
  allprogresscard: boolean;
  examinationSubjects: ExaminationSubject[];
}

const initialValues: ExaminationFormValues = {
  classId: "",
  academicYearId: "",
  curriculumId: "",
  examinationId: "",
  subjectType: "",
  allPrecentage: false,
  allprogresscard: false,
  examinationSubjects: [
    {
      id: nanoid(),
      subjectId: "",
      isIncludeInPercentage: false,
      isDisplayInProgressCard: false,
      maxMarks: "",
      passMarks: "",
      displayorder: "",
      gradeBookOrder: "",
      examDate: "",
      startTime: "",
      endTime: "",
    },
  ],
};

const validationSchema = (
  id: string | number | undefined,
  values: ExaminationFormValues,
  getSubjectType: (subjectId: string) => string
) => {
  return Yup.object().shape({
    academicYearId: Yup.string().required("Academic year is required"),
    curriculumId: Yup.string().required("Curriculum is required"),
    classId: Yup.string().required("Class is required"),
    examinationId: Yup.string().required("Examination is required"),
    subjectType: Yup.string().nullable(),
    examinationSubjects: Yup.array().of(
      Yup.object().shape({
        subjectId: Yup.string()
          .required("Subject is required.")
          .nullable()
          .test("unique-subjectId", "Subject already selected", function (value) {
            if (!value) return true;
            const { path, parent } = this;
            const currentIndexMatch = path.match(/examinationSubjects\[(\d+)\]/);
            const currentIndex = currentIndexMatch ? parseInt(currentIndexMatch[1]) : -1;
            const { examinationSubjects } = this.options.context || {};
            if (!examinationSubjects) return true;
            
            const duplicateCount = examinationSubjects.filter((subject: any, index: number) => 
              subject.subjectId === value && index !== currentIndex
            ).length;
            
            return duplicateCount === 0;
          }),
        maxMarks: Yup.string()
          .nullable()
          .test("maxMarks-required", "Max Marks is required", function (value, context) {
            const subjectId = context.parent.subjectId;
            const subjectType = getSubjectType(subjectId);
            if (subjectType !== "COSCHOLASTIC" && !value) {
              return this.createError({ message: "Max Marks is required" });
            }
            return true;
          })
          .test("maxMarks-format", "Invalid format (e.g. 45 or 12.34)", function (value) {
            if (!value) return true;

            const regex = /^(\d{1,3}|\d{1,2}\.\d{1,2})$/;
            return regex.test(value);
          }),

        passMarks: Yup.string()
          .nullable()
          .test("passMarks-required", "Pass % is required", function (value, context) {
            const subjectId = context.parent.subjectId;
            const subjectType = getSubjectType(subjectId);
            if (subjectType !== "COSCHOLASTIC" && !value) {
              return this.createError({ message: "Pass % is required" });
            }
            return true;
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


const AddExaminationMarksModel = (props: any) => {

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();
  const [selectAll, setSelectAll] = useState(false);
  const [deletedSubjects, setDeletedSubjects] = useState<string[]>([]);
  const [selectedSubjectTypes, setSelectedSubjectTypes] = useState<{ [key: number]: string }>({});

  const getSubjectType = (subjectId: number | string) => {
    return (
      getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.find(
        (subject: any) => subject.examinationSubjectId == subjectId
      )?.subjectType ||
      getCBSEAllSubjectsOrderResp?.find((subject: any) => subject.subjectId == subjectId)?.subjectType ||
      "n/a"
    );
  };

  const addExaminationMarksFormik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema(undefined, initialValues, getSubjectType),
    initialValues,
    onSubmit: (values) => {
      const subjectMap = new Map(
        getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.map((apiSub: { examinationSubjectId: any; id: any; }) => [
          apiSub.examinationSubjectId,
          apiSub.id,
        ])
      );
      let formattedSaveSubjects = values.examinationSubjects.map(subject => ({
        subjectId: subject.subjectId,
        maxMarks: subject.maxMarks,
        passMarks: subject.passMarks,
        examDate: subject.examDate,
        startTime: subject.startTime.length === 5 ? `${subject.startTime}:00` : subject.startTime,
        endTime: subject.endTime.length === 5 ? `${subject.endTime}:00` : subject.endTime,
        displayOrder: subject.displayorder,
        gradeBookOrder: subject.gradeBookOrder,
        isDisplayProgressCard: subject.isDisplayInProgressCard,
        isIncludePercentage: subject.isIncludeInPercentage,
      }));
      let formattedSubjects = formattedSaveSubjects
        .filter(subject => values.examinationSubjects.find(s => s.subjectId === subject.subjectId)?.isSelected)
        .map(subject => ({
          ...subject,
          id: subjectMap.get(subject.subjectId) || "",
        }));
      const commonPayload = {
        branchId,
        classId: values.classId,
        academicYearId: values.academicYearId,
        curriculumId: values.curriculumId,
        examinationId: values.examinationId,
      };
      const payload = { ...commonPayload, subjectDetails: formattedSaveSubjects };
      const editPayload = { ...commonPayload, subjectDetails: formattedSubjects, deleted: deletedSubjects };  
      if (!props?.id) {
        dispatch(
          saveCbseExaminationSubjectsListAct(
            generateActionPayload("save_cbse_examination_subject", undefined, payload)
          )
        );
      } else {
        dispatch(
          editCbseExaminationSubjectsListAct(
            generateActionPayload("edit_cbse_examination_subject_list", { id: props.id }, editPayload)
          )
        );
      }
    },
  });

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getSubjectsRequestListResp,
    getCbseExaminationRequestListResp,
    getAssignLanClassListResp,
    getAssignListCurriculumResp,
    assignedClassSubjectsListResp,
    getCbseExaminationSubjectsListByIdResp,
    getCBSEAllSubjectsOrderResp
  } = useAppSelector(
    ({ instAcademics, appData, classSubjectsInfo, examinationSettings, assignLanguages }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      getSubjectsRequestListResp: examinationSettings.getSubjectsRequestListResp,
      getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
      assignedClassSubjectsListResp: classSubjectsInfo.assignedClassSubjectsListResp,
      getCbseExaminationSubjectsListByIdResp: examinationSettings.getCbseExaminationSubjectsListByIdResp,
      getCBSEAllSubjectsOrderResp: examinationSettings.getCBSEAllSubjectsOrderResp,
    }),
    shallowEqual
  );

  const examiantionMarksRef = useRef({
    prevGetCbseExaminationSubjectsListByIdResp: getCbseExaminationSubjectsListByIdResp,
  })

  useEffect(() => {
    if (!props.id) return;
    const { prevGetCbseExaminationSubjectsListByIdResp } = examiantionMarksRef.current || {};
    if (getCbseExaminationSubjectsListByIdResp && prevGetCbseExaminationSubjectsListByIdResp !== getCbseExaminationSubjectsListByIdResp) {
      const updatedValues = {
        academicYearId: getCbseExaminationSubjectsListByIdResp.academicYearId || "",
        classId: getCbseExaminationSubjectsListByIdResp.classId || "",
        curriculumId: getCbseExaminationSubjectsListByIdResp.curriculumId || "",
        examinationId: getCbseExaminationSubjectsListByIdResp.examinationId || "",
        subjectType: "",
        allPrecentage: false,
        allprogresscard: false,
        examinationSubjects: getCbseExaminationSubjectsListByIdResp.examinationSubjectDtos?.map(
          (subject: {
            id: any;
            examinationSubjectId: any;
            isIncludePercentage: any;
            isDisplayProgressCard: any;
            maxMarks: any;
            passMarks: any;
            displayOrder: any;
            gradeBookOrder: any;
            examDate: any;
            startTime: any;
            endTime: any;
          }) => ({
            id: subject.id,
            subjectId: subject.examinationSubjectId || "",
            isIncludeInPercentage: subject.isIncludePercentage ?? false,
            isDisplayInProgressCard: subject.isDisplayProgressCard ?? false,
            maxMarks: subject.maxMarks || "",
            passMarks: subject.passMarks || "",
            displayorder: subject.displayOrder || "",
            gradeBookOrder: subject.gradeBookOrder || "",
            examDate: subject.examDate || "",
            startTime: subject.startTime || "",
            endTime: subject.endTime || "",
          })
        ) || [],
      };
      addExaminationMarksFormik.setValues(updatedValues);
    }
    examiantionMarksRef.current.prevGetCbseExaminationSubjectsListByIdResp = getCbseExaminationSubjectsListByIdResp;
  }, [getCbseExaminationSubjectsListByIdResp, props.id, assignedClassSubjectsListResp]);

  useEffect(() => {
    if (addExaminationMarksFormik.values.academicYearId && addExaminationMarksFormik.values.curriculumId) {
      getClassApiCall(addExaminationMarksFormik.values.curriculumId);
    }
  }, [addExaminationMarksFormik.values.academicYearId, addExaminationMarksFormik.values.curriculumId]);

  useEffect(() => {
    if (addExaminationMarksFormik.values.academicYearId && addExaminationMarksFormik.values.curriculumId && addExaminationMarksFormik.values.classId) {
      getMainExaminationListApiCall(addExaminationMarksFormik.values.classId, addExaminationMarksFormik.values.curriculumId);
      cbseSubjectOrderList({ classId: addExaminationMarksFormik.values.classId, curriculumId: addExaminationMarksFormik.values.curriculumId, academicYearId: addExaminationMarksFormik.values.academicYearId });
    }
  }, [addExaminationMarksFormik.values.academicYearId, addExaminationMarksFormik.values.curriculumId, addExaminationMarksFormik.values.classId,]);

  useEffect(() => {
    if (props.modalData) {
      const { academicYearId, curriculumId, } = props.modalData || {};
      addExaminationMarksFormik.setValues((prev: any) => ({ ...prev, academicYearId, curriculumId, }));
      if (academicYearId) {
        getCurriculumApiCall({ academicYearId })
      }
      if (curriculumId) {
        const payload = { branchId: branchId, curriculumId, academicYearId, classFilter:  "HIGHER",  sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
    }
    return () => {
      addExaminationMarksFormik.resetForm();
      dispatch(setSubjectsListAct(undefined));
      dispatch(resetAssignedClassSubjectsListAct(undefined));
      dispatch(setCbseExaminationListAct(undefined));
    }
  }, [])

  const classSubjectListApicall = (otherProps?: any) => {
    const payload = { academicYearId: addExaminationMarksFormik.values.academicYearId, curriculumId: addExaminationMarksFormik.values.curriculumId, branchClassId: addExaminationMarksFormik.values.classId, pageNo: 0,
      pageSize: 100,
      sortBy: 'subjectName',
      orderBy: 'asc', ...otherProps }
    if (props.id) {
      dispatch(
        getAssignedClassSubjectsList(
          generateActionPayload("get_assigned_class_subject_list", undefined, payload)
        )
      );
    }
  }

  const cbseSubjectOrderList = (otherProps?: any) => {
    const payload = {
      branchId,
      academicYearId: addExaminationMarksFormik.values.academicYearId,
      curriculumId: addExaminationMarksFormik.values.curriculumId,
      classId: addExaminationMarksFormik.values.classId,
      ...otherProps,
    };
    if (!payload.academicYearId || !payload.curriculumId || !payload.classId) return
    dispatch(getCBSEAllSubjectsOrderAct(generateActionPayload("get_cbse_all_subjects_order", undefined, payload)));
  }

  function getClassApiCall(selectedCurriculumId: string) {
    const payload = {
      academicYearId: addExaminationMarksFormik.values.academicYearId,
      curriculumId: selectedCurriculumId,
      branchId,
      classFilter:  "HIGHER", 
      pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };

    dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: addExaminationMarksFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getMainExaminationListApiCall(classId: string, curriculumId: string) {
    const payload = {
      branchId,
      curriculumId: curriculumId,
      academicYearId: addExaminationMarksFormik.values.academicYearId,
      classId: classId,
      pageNo: 0, pageSize: 100,
    };
    dispatch(getCbseExaminationListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
  }

  useEffect(() => {
    const { curriculumId, academicYearId, classId, examinationId } = addExaminationMarksFormik.values;

    if (curriculumId && academicYearId && classId && examinationId) {
      getExaminationSubjectsApiCall(examinationId);
    }
  }, [addExaminationMarksFormik.values.curriculumId, addExaminationMarksFormik.values.classId, addExaminationMarksFormik.values.examinationId]);

  useEffect(() => {
    const { curriculumId, academicYearId, classId } = addExaminationMarksFormik.values;

    if (curriculumId && academicYearId && classId) {
      classSubjectListApicall(classId);
    }
  }, [addExaminationMarksFormik.values.curriculumId, addExaminationMarksFormik.values.classId, addExaminationMarksFormik.values.academicYearId]);

  const getExaminationSubjectsApiCall = (examinationId: string) => {
    const payload: any = {
      branchId,
      curriculumId: addExaminationMarksFormik.values.curriculumId,
      academicYearId: addExaminationMarksFormik.values.academicYearId,
      classId: addExaminationMarksFormik.values.classId,
      subjectType: addExaminationMarksFormik.values.subjectType,
      examinationId,
      pageNo: 0,
      pageSize: 100,
    };
    if (addExaminationMarksFormik.values.subjectType) {
      payload.subjectType = addExaminationMarksFormik.values.subjectType;
    }
    // dispatch(getSubjectsListAct(generateActionPayload("get_subject_list", undefined, payload)));
  };

  useEffect(() => {
    const { curriculumId, academicYearId, classId, examinationId, subjectType } = addExaminationMarksFormik.values;

    if (curriculumId && academicYearId && classId && examinationId && subjectType) {
      getExaminationSubjectsApiCall(examinationId);
    }
  }, [addExaminationMarksFormik.values.curriculumId, addExaminationMarksFormik.values.academicYearId, addExaminationMarksFormik.values.classId, addExaminationMarksFormik.values.examinationId, addExaminationMarksFormik.values.subjectType]);

  useEffect(() => {
    if (!props.id && addExaminationMarksFormik.values.examinationId) {
      addWeightageHandler();
    }
  }, [addExaminationMarksFormik.values.examinationId, props.id]);
  
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
          examinationId: "",
          examinationSubjects: [],
        }));
      } else if (name === "curriculumId") {
        addExaminationMarksFormik.setValues((prev) => ({
          ...prev,
          curriculumId: value,
          classId: "",
          examinationId: "",
          examinationSubjects: [],
        }));
      } else if (name === "classId") {
        addExaminationMarksFormik.setValues((prev) => ({
          ...prev,
          classId: value,
          examinationId: "",
          examinationSubjects: [],
        }));
        getMainExaminationListApiCall(value, addExaminationMarksFormik.values.curriculumId);
        cbseSubjectOrderList({academicYearId: addExaminationMarksFormik.values.academicYearId, classId: value, curriculumId: addExaminationMarksFormik.values.curriculumId });
      } else if (name === "examinationId") {
        addExaminationMarksFormik.setValues((prev) => ({
          ...prev,
          examinationId: value,
          examinationSubjects: [],
        }));
        getExaminationSubjectsApiCall(value);
      }  else if (name === "subjectType") {
        if (addExaminationMarksFormik.values.examinationId) {
          getExaminationSubjectsApiCall(addExaminationMarksFormik.values.examinationId);
        }
      }
    }
  };

  const handleSubjectChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;

    if (!selectedId) {
      setSelectedSubjectTypes((prev) => ({
        ...prev,
        [index]: "",
      }));

      addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.subjectId`, "");
      addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.isDisplayInProgressCard`, false);
      addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.isIncludeInPercentage`, false);
      addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.displayorder`, "");
      addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.gradeBookOrder`, "");
      addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.subjectType`, "");
      addExaminationMarksFormik.setFieldError(`examinationSubjects.${index}.subjectId`, undefined);

      return;
    }

    const subjectType = getSubjectType(selectedId);
    setSelectedSubjectTypes((prev) => ({
      ...prev,
      [index]: subjectType,
    }));
    addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.subjectId`, selectedId);
    const subjectIds = addExaminationMarksFormik.values.examinationSubjects.map((subject, idx) =>
      idx === index ? selectedId : subject.subjectId
    );

    const isDuplicate = subjectIds.filter(id => id === selectedId).length > 1;

    if (isDuplicate) {
      addExaminationMarksFormik.setFieldError(
        `examinationSubjects.${index}.subjectId`,
        "Subject already selected"
      );
      addExaminationMarksFormik.setFieldTouched(`examinationSubjects.${index}.subjectId`, true);
    } else {
      addExaminationMarksFormik.setFieldError(`examinationSubjects.${index}.subjectId`, undefined);

      const subjectOrderData = getCBSEAllSubjectsOrderResp?.find(
        (item: any) => item.subjectId == selectedId
      );

      if (subjectOrderData) {
        addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.isDisplayInProgressCard`, subjectOrderData.isDisplayProgressCard ?? false);
        addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.isIncludeInPercentage`, subjectOrderData.isIncludePercentage ?? false);
        addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.displayorder`, subjectOrderData.displayOrder?.toString() || "");
        addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.gradeBookOrder`, subjectOrderData.gradeBookOrder?.toString() || "");
      }

      addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.subjectType`, subjectType);
    }
  };  
  
  useEffect(() => {
    const initialTypes: { [key: number]: string } = {};
    addExaminationMarksFormik.values.examinationSubjects.forEach((grade: any, index: number) => {
      initialTypes[index] = getSubjectType(grade.subjectId);
    });
    setSelectedSubjectTypes(initialTypes);
  }, [addExaminationMarksFormik.values.examinationSubjects]);

  function addWeightageHandler() {
    if (formikArrayHelpers.current) {
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        subjectId: "",
        isIncludeInPercentage: false,
        isDisplayInProgressCard: false,
        maxMarks: "",
        passMarks: "",
        displayorder: "",
        gradeBookOrder: "",
        examDate: "",
        startTime: "",
        endTime: "",
      });
    }
  }

  function removeGradesHndlr(event: React.MouseEvent<HTMLButtonElement>) {
    const rowIndex = event.currentTarget.getAttribute("data-index");
    if (rowIndex !== undefined && rowIndex !== null) {
      const subjectToRemove = addExaminationMarksFormik.values.examinationSubjects[Number(rowIndex)];
      if (!subjectToRemove.subjectId && !subjectToRemove.isSelected) {
        formikArrayHelpers.current?.remove(Number(rowIndex));
        return;
      }
      if (subjectToRemove.isSelected) {
        const apiSubject = getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.find(
          (apiSub: any) => apiSub.examinationSubjectId === subjectToRemove.subjectId
        );
        if (apiSubject) {
          setDeletedSubjects((prev) => {
            const updatedDeleted = [...prev, apiSubject.id];
            return updatedDeleted;
          });
        } 
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

  const handleAllPrecentageChange = (isChecked: boolean) => {
    addExaminationMarksFormik.setFieldValue("allPrecentage", isChecked);
    const updatedSubjects = addExaminationMarksFormik.values.examinationSubjects.map(subject => ({
      ...subject,
      isIncludeInPercentage: isChecked
    }));
    addExaminationMarksFormik.setFieldValue("examinationSubjects", updatedSubjects);
  };

  const handleAllProgressCardChange = (isChecked: boolean) => {
    addExaminationMarksFormik.setFieldValue("allprogresscard", isChecked);
    const updatedSubjects = addExaminationMarksFormik.values.examinationSubjects.map(subject => ({
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
    const allChecked = updatedSubjects.every(subject => subject[type]);
    if (type === "isIncludeInPercentage") {
      addExaminationMarksFormik.setFieldValue("allPrecentage", allChecked);
    } else if (type === "isDisplayInProgressCard") {
      addExaminationMarksFormik.setFieldValue("allprogresscard", allChecked);
    }
  };

  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    addExaminationMarksFormik.setFieldValue(
      "examinationSubjects",
      addExaminationMarksFormik.values.examinationSubjects.map((subject) => ({
        ...subject,
        isSelected: checked,
      }))
    );
  };

  const handleRowSelectionChange = (index: number, checked: boolean) => {
    const updatedSubjects = [...addExaminationMarksFormik.values.examinationSubjects];
    updatedSubjects[index].isSelected = checked;
    addExaminationMarksFormik.setFieldValue("examinationSubjects", updatedSubjects);
    setSelectAll(updatedSubjects.every((subject) => subject.isSelected));
  };

  const { data: academicYearList } = academicYearListResp || {};
  const { data: curriculumTypes } = getAssignListCurriculumResp || {}
  const { content: classTypes } = getAssignLanClassListResp || {};
  const mainExaminationList = Array.isArray(getCbseExaminationRequestListResp?.data) ? getCbseExaminationRequestListResp?.data : [];

  return (
    <>
      <form onSubmit={addExaminationMarksFormik.handleSubmit} className="examination-setting">
        <div className="row px-4 mb-3">
          <div className="row g-3">
            <div className="col-xs-12 col-md-2 mt-2 mb-2">
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
            <div className="col-xs-12 col-md-2 mt-2">
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
            <div className="col-xs-12 col-md-2 mt-2">
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
            <div className="col-xs-12 col-md-2 mt-2">
              <SelectInput
                name="examinationId"
                labelText="Examination"
                labelClass="required"
                value={addExaminationMarksFormik.values.examinationId}
                onChange={handleSelectChange}
                menuItems={mainExaminationList}
                valueKey="id"
                textKey="examinationName"
                isDisabled={props?.id ? true : false}
                invalid={(addExaminationMarksFormik.touched.examinationId && addExaminationMarksFormik.errors.examinationId) ? true : false}
                error={(addExaminationMarksFormik.touched.examinationId && addExaminationMarksFormik.errors.examinationId) ? addExaminationMarksFormik.errors.examinationId : ""}
              />
            </div>
            <div className="col-xs-12 col-md-2 mt-2">
              <SelectInput
                name="subjectType"
                value={addExaminationMarksFormik.values.subjectType}
                onChange={handleSelectChange}
                menuItems={subjectType}
                valueKey="id"
                textKey="name"
                labelText="Subject Type"
              />
            </div>
            <div className="col-auto ms-auto d-flex align-items-center">
            <button type="button"
              className="btn btn-outline-primary float-end d-flex align-items-center"
                  onClick={addWeightageHandler}
            >
              <i className="ri-add-line me-2" />
              Add Subject
            </button>
            </div>
          </div>
        </div>
        <div className="bg-light py-3 px-4">
          <div className="row">
            <div className="col-12 col-md-2 d-flex">
              {props.id && (
                <InputCheckbox
                  name="selectAll"
                  value={selectAll}
                  onChange={(e: { target: { checked: boolean } }) =>
                    handleSelectAllChange(e.target.checked)
                  }
                />)}Subject
            </div>
            <div className="col-12 col-md-1 d-flex">
              {/* <InputCheckbox
                name="allprogresscard"
                value={addExaminationMarksFormik.values.allprogresscard}
                onChange={(e: { target: { checked: boolean; }; }) => handleAllProgressCardChange(e.target.checked)}
              /> */}
              <span>
                <label className="fs-12 mb-0">
                  Display In
                </label>
                <label className="fs-12 mb-0">
                  ProgressCard
                </label>
              </span>
            </div>
            <div className="col-12 col-md-1 d-flex">
              {/* <InputCheckbox
                name="allPrecentage"
                value={addExaminationMarksFormik.values.allPrecentage}
                onChange={(e: { target: { checked: boolean; }; }) => handleAllPrecentageChange(e.target.checked)}
              /> */}
              <span>
                <label className="fs-12 mb-0">
                  Include In
                </label>
                <label className="fs-12 mb-0">
                  Percentage
                </label>
              </span>
            </div>
            <div className="col-12 col-md-1">
              Display Order
            </div>
            <div className="col-12 col-md-1">
              Grade Order
            </div>
            <div className="col-12 col-md-1">
              Exam Date
            </div>
            <div className="col-12 col-md-1">
              Start Time
            </div>
            <div className="col-12 col-md-1">
              End Time
            </div>
            <div className="col-12 col-md-1">
              Max Marks
            </div>
            <div className="col-12 col-md-1 pe-1">
                  Pass Percentage
            </div>
          </div>
        </div>
        <div className="border-bottom pb-3">
          {addExaminationMarksFormik.values.examinationId && (
            <div >
              <FormikProvider value={addExaminationMarksFormik}>
                <FieldArray name="examinationSubjects">
                  {(arrayHelpers: ArrayHelpers) => {
                    if (!formikArrayHelpers.current) {
                      formikArrayHelpers.current = arrayHelpers;
                    }
                    return (
                      <>
                        {addExaminationMarksFormik.values.examinationSubjects.length >
                          0 &&
                          addExaminationMarksFormik.values.examinationSubjects.map(
                            (grade: any, index: number) => {
                              const inputFieldErrors: any = addExaminationMarksFormik.errors.examinationSubjects && addExaminationMarksFormik.errors.examinationSubjects[index] || {};
                              const inputFieldTouched: any = addExaminationMarksFormik.touched.examinationSubjects && addExaminationMarksFormik.touched.examinationSubjects[index] || {};
                              return (
                                <div key={grade.uniqueId} className="row pt-3 px-4">
                                  <div className="col-12 col-md-2 d-grid">
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
                                        menuItems={
                                          getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.some(
                                            (subject: any) => subject.id === grade.id
                                          )
                                            ? assignedClassSubjectsListResp?.data
                                            : getCBSEAllSubjectsOrderResp?.filter((subject: any) => {
                                              const selectedSubjectIds = addExaminationMarksFormik.values.examinationSubjects
                                                .map((s: any) => s.subjectId)
                                                .filter((id: string) => id !== grade.subjectId); 
                                              return !selectedSubjectIds.includes(subject.subjectId);
                                            })
                                        }
                                        valueKey="subjectId"
                                        textKey="subjectName"
                                        invalid={inputFieldTouched.subjectId && inputFieldErrors.subjectId}
                                        error={inputFieldTouched.subjectId && inputFieldErrors.subjectId ? inputFieldErrors.subjectId : ""}
                                        isDisabled={
                                          !!props.id && !grade.isSelected ||
                                          getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.some(
                                            (subject: any) => subject.examinationSubjectId === grade.subjectId
                                          )
                                        }
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
                                  <div className="col-12 col-md-1">
                                    <InputCheckbox
                                      name={`examinationSubjects[${index}].isDisplayInProgressCard`}
                                      value={grade.isDisplayInProgressCard}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIndividualCheckboxChange(index, "isDisplayInProgressCard", e)}
                                      isDisabled
                                    />
                                  </div>
                                  <div className="col-12 col-md-1">
                                    <InputCheckbox
                                      name={`examinationSubjects[${index}].isIncludeInPercentage`}
                                      value={grade.isIncludeInPercentage}
                                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleIndividualCheckboxChange(index, "isIncludeInPercentage", e)}
                                      isDisabled
                                    />
                                  </div>
                                  <div className="col-12 col-md-1">
                                    <TextInputWithRegex
                                      name={`examinationSubjects[${index}].displayorder`}
                                      labelClass="required"
                                      formgroupClassName="mb-0 me-2"
                                      value={grade.displayorder}
                                      onChange={addExaminationMarksFormik.handleChange}
                                      onBlur={addExaminationMarksFormik.handleBlur}
                                      invalid={inputFieldTouched.displayorder && inputFieldErrors.displayorder ? true : false}
                                      error={inputFieldTouched.displayorder && inputFieldErrors.displayorder ? inputFieldErrors.displayorder : ""}
                                      allowedInputRegex="^[0-9]+$"
                                      isDisabled
                                    />
                                  </div>
                                  <div className="col-12 col-md-1">
                                    <TextInputWithRegex
                                      name={`examinationSubjects[${index}].gradeBookOrder`}
                                      labelClass="required"
                                      formgroupClassName="mb-0 me-2"
                                      value={grade.gradeBookOrder}
                                      onChange={addExaminationMarksFormik.handleChange}
                                      onBlur={addExaminationMarksFormik.handleBlur}
                                      invalid={inputFieldTouched.gradeBookOrder && inputFieldErrors.gradeBookOrder ? true : false}
                                      error={inputFieldTouched.gradeBookOrder && inputFieldErrors.gradeBookOrder ? inputFieldErrors.gradeBookOrder : ""}
                                      allowedInputRegex="^[0-9]+$"
                                      isDisabled
                                    />
                                  </div>
                                  <div className="col-12 col-md-1">
                                    <DateInput
                                      name={`examinationSubjects[${index}].examDate`}
                                      labelClass="required"
                                      formgroupClassName="mb-0"
                                      value={grade.examDate}
                                      onChange={addExaminationMarksFormik.handleChange}
                                      isDisabled={!!props.id && !grade.isSelected}
                                    />
                                  </div>
                                  <div className="col-12 col-md-1">
                                    <TimeInput
                                      name={`examinationSubjects[${index}].startTime`}
                                      labelClass="required"
                                      formgroupClassName="mb-0 me-2"
                                      inputClassName="pe-0"
                                      value={grade.startTime}
                                      onChange={addExaminationMarksFormik.handleChange}
                                      isDisabled={!!props.id && !grade.isSelected}
                                    />
                                  </div>
                                  <div className="col-12 col-md-1">
                                    <TimeInput
                                      name={`examinationSubjects[${index}].endTime`}
                                      labelClass="required"
                                      formgroupClassName="mb-0 me-2"
                                      inputClassName="pe-0"
                                      value={grade.endTime}
                                      onChange={addExaminationMarksFormik.handleChange}
                                      isDisabled={!!props.id && !grade.isSelected}
                                    />
                                  </div>
                                  <div className="col-12 col-md-1">
                                    <TextInputWithRegex
                                      name={`examinationSubjects[${index}].maxMarks`}
                                      labelClass={addExaminationMarksFormik.values.subjectType !== "COSCHOLASTIC" ? "required" : ""}
                                      formgroupClassName="mb-0 me-2"
                                      value={grade.maxMarks}
                                      onChange={addExaminationMarksFormik.handleChange}
                                      invalid={inputFieldTouched.maxMarks && inputFieldErrors.maxMarks ? true : false}
                                      error={
                                        inputFieldTouched.maxMarks && inputFieldErrors.maxMarks
                                          ? inputFieldErrors.maxMarks
                                          : ""
                                      }
                                      allowedInputRegex="^[0-9]{1,7}(\.[0-9]{0,2})?$"
                                      maxLength={6}
                                      isDisabled={!!props.id && !grade.isSelected}
                                    />
                                  </div>
                                  <div className="col-12 col-md-1 pe-1">
                                    <div className="hstack">
                                      <TextInputWithRegex
                                        name={`examinationSubjects[${index}].passMarks`}
                                        labelClass={addExaminationMarksFormik.values.subjectType !== "COSCHOLASTIC" ? "required" : ""}
                                        formgroupClassName="mb-0 w-60 me-2"
                                        value={grade.passMarks}
                                        onChange={addExaminationMarksFormik.handleChange}
                                        invalid={
                                          inputFieldTouched.passMarks &&
                                          inputFieldErrors.passMarks
                                            ? true
                                            : false
                                        }
                                        error={
                                          inputFieldTouched.passMarks &&
                                          inputFieldErrors.passMarks
                                            ? inputFieldErrors.passMarks
                                            : ""
                                        }
                                        allowedInputRegex="^\d{0,3}(\.\d{0,2})?$"
                                        maxLength={6}
                                        isDisabled={!!props.id && !grade.isSelected}
                                      />
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
          )}
        </div>
        <div className="row w-100">
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

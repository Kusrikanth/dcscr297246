import React, { useRef, useState, useEffect } from "react";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik, } from "formik";
import { DateInput, InputCheckbox, SelectInput, TextInputWithRegex, TimeInput } from "../../../../Components/Common";
import { coScholasticSubjects, scholasticSubjects, subjectType } from "./helper";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../../hooks/storehook";
import { generateActionPayload } from "../../../../utility/reduxutility";
import { editCbseExaminationSubjectsListAct, getCBSEAllSubjectsOrderAct, getCbseExaminationListAct, getIgseTermNameListAct, getSubjectsListAct, saveCbseExaminationSubjectsListAct } from "../../../../store/examination/examinationsettings/examinationsettingsaction";
import * as Yup from "yup";
import { getAssignCurriculumListAct, getAssignLanClassListAct } from "../../../../store/assignlanguages/assignlanguagesaction";
import { generateUniqueNumber } from "../../../../utility/commonutility";
import { nanoid } from "nanoid";
import { getSecoundLanguagesList } from "../../../../store/FrontDesk/AdmissionManagment/applicationmanagmentaction";
import { useLocation } from "react-router-dom";

interface LanguageMarks {
  languageCheckbox: boolean;
  languageId: string;
  languageName: string;
  languageMaxMarks: string;
}

interface ExaminationSubject {
  id: string;
  subjectId: string;
  subjectType: string;
  languages?: LanguageMarks[];
  scholasticType: string;
  coScholasticType: string;
  // isIncludeInPercentage: boolean;
  // isDisplayInProgressCard: boolean;
  maxMarks: string;
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
  termId: string;
  examinationId: string;
  allPrecentage: boolean;
  allprogresscard: boolean;
  examinationSubjects: ExaminationSubject[];
}

const initialValues: ExaminationFormValues = {
  classId: "",
  academicYearId: "",
  curriculumId: "",
  termId: "",
  examinationId: "",
  allPrecentage: false,
  allprogresscard: false,
  examinationSubjects: [
    {
      id: nanoid(),
      subjectId: "",
      subjectType: "",
      scholasticType: "",
      languages: [
        {
          languageCheckbox: false,
          languageId: "",
          languageName: "",
          languageMaxMarks: "",
        }
      ],
      coScholasticType: "",
      // isIncludeInPercentage: false,
      // isDisplayInProgressCard: false,
      maxMarks: "",
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
          .test("unique-subjectId", "Subject already chosen", function (value) {
            const { examinationSubjects } = this.options.context || {};
            if (!value || !examinationSubjects) return true;
            const subjectIds = examinationSubjects.map((s: any) => s.subjectId);
            return subjectIds.filter((id: string) => id === value).length <= 1;
          }),
        maxMarks: Yup.string()
          .nullable()
          .test("maxMarks-format", "Invalid format (e.g. 45 or 12.34)", function (value) {
            if (!value) return true;

            const regex = /^(\d{1,3}|\d{1,2}\.\d{1,2})$/;
            return regex.test(value);
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

const AddExaminationSubjectsIGSE = (props: any) => {

  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const dispatch = useAppDispatch();
  const [selectAll, setSelectAll] = useState(false);
  const [deletedSubjects, setDeletedSubjects] = useState<string[]>([]);
  const [selectedSubjectTypes, setSelectedSubjectTypes] = useState<{ [key: number]: string }>({});
  const [subjectTypes, setSubjectTypes] = useState<string[]>([]);
  const [scholasticTypes, setScholasticTypes] = useState<string[]>([]);
  const [secondLanguageMap, setSecondLanguageMap] = useState<Record<number, LanguageMarks[]>>({});
  const [currentLanguageRowIndex, setCurrentLanguageRowIndex] = useState<number | null>(null);
  const location = useLocation();
  const isIgcseManagementPage = location.pathname === "/igcse-management";

  const getSubjectType = (subjectId: number | string) => {
    return (
      getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.find(
        (subject: any) => subject.examinationSubjectId == subjectId
      )?.subjectType ||
      getCBSEAllSubjectsOrderResp?.find(
        (subject: any) => subject.subjectId == subjectId
      )?.subjectType ||
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
      let formattedSaveSubjects = values.examinationSubjects.map(subject => {
        const languagesDTOS = (subject.languages || [])
          .filter(lang => lang.languageId && lang.languageMaxMarks)
          .map(lang => ({
            languageId: String(lang.languageId),
            languageMaxMarks: String(lang.languageMaxMarks),
          }));
        return {
          subjectId: subject.subjectId,
          maxMarks: subject.maxMarks,
          examDate: subject.examDate,
          startTime: subject.startTime?.length === 5 ? `${subject.startTime}:00` : subject.startTime,
          endTime: subject.endTime?.length === 5 ? `${subject.endTime}:00` : subject.endTime,
          displayOrder: subject.displayorder,
          gradeBookOrder: subject.gradeBookOrder,
          isDisplayProgressCard: "true",
          isIncludePercentage: "true",
          languagesDTOS: languagesDTOS.filter(lang => lang.languageMaxMarks),
        };
      });
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
        dispatch(saveCbseExaminationSubjectsListAct(generateActionPayload("save_cbse_examination_subject", undefined, payload)));
      } else {
        dispatch(editCbseExaminationSubjectsListAct(generateActionPayload("edit_cbse_examination_subject_list", { id: props.id }, editPayload)));
      }
    },
  });

  const examinationTermList = (curriculumId: string) => {
    if (curriculumId) {
      let payload = {
        branchId,
        curriculumId: addExaminationMarksFormik.values.curriculumId,
      };
      dispatch(getIgseTermNameListAct(generateActionPayload("get_igse_term_name_list", undefined, payload)));
    }
  };

  const {
    academicYearListResp,
    currentBranchIdResp: branchId,
    currentInstIdResp: instituteId,
    getSubjectsRequestListResp,
    getCbseExaminationRequestListResp,
    getAssignLanClassListResp,
    getAssignListCurriculumResp,
    secoundLanguageResp,
    getIgseTermNameListResp,
    getCbseExaminationSubjectsListByIdResp,
    getCBSEAllSubjectsOrderResp
  } = useAppSelector(
    ({ instAcademics, appData, classSubjectsInfo, applicationSale, examinationSettings, assignLanguages }) => ({
      academicYearListResp: instAcademics.academicYearListResp,
      currentBranchIdResp: appData.currentBranchIdResp,
      currentInstIdResp: appData.currentInstIdResp,
      getAssignLanClassListResp: assignLanguages.getAssignLanClassListResp,
      getAssignListCurriculumResp: assignLanguages.getAssignListCurriculumResp,
      getSubjectsRequestListResp: examinationSettings.getSubjectsRequestListResp,
      getCbseExaminationRequestListResp: examinationSettings.getCbseExaminationRequestListResp,
      getCbseExaminationSubjectsListByIdResp: examinationSettings.getCbseExaminationSubjectsListByIdResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      secoundLanguageResp: applicationSale.secoundLanguageResp,
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
    if (
      getCbseExaminationSubjectsListByIdResp &&
      prevGetCbseExaminationSubjectsListByIdResp !== getCbseExaminationSubjectsListByIdResp
    ) {
      const updatedValues = {
        academicYearId: getCbseExaminationSubjectsListByIdResp?.academicYearId ?? "",
        classId: getCbseExaminationSubjectsListByIdResp?.classId ?? "",
        curriculumId: getCbseExaminationSubjectsListByIdResp?.curriculumId ?? "",
        termId: getCbseExaminationSubjectsListByIdResp?.termId ?? "",
        examinationId: getCbseExaminationSubjectsListByIdResp?.examinationId ?? "",
        allPrecentage: false,
        allprogresscard: false,
        examinationSubjects: getCbseExaminationSubjectsListByIdResp
          ?.examinationSubjectDtos
          ?.map((subject: any) => {
            const subjectOrder = getCBSEAllSubjectsOrderResp?.find(
              (s: any) => s.subjectId === subject.examinationSubjectId
            );

            return {
              id: subject?.id ?? "",
              subjectId: subject?.examinationSubjectId ?? "",
              maxMarks: subject?.maxMarks ?? "",
              subjectType: subject?.subjectType ?? "",
              scholasticType: subject?.scholasticType ?? "",
              coScholasticType: subject?.coScholasticType ?? "",
              displayorder:
                subject?.displayOrder ??
                subjectOrder?.displayOrder?.toString() ??
                "",

              gradeBookOrder:
                subject?.gradeBookOrder ??
                subjectOrder?.gradeBookOrder?.toString() ??
                "",
              examDate: subject?.examDate ?? "",
              startTime: subject?.startTime ?? "",
              endTime: subject?.endTime ?? "",
              languages: subject?.languagesDTOS?.map((lang: any) => ({
                languageCheckbox: true,
                languageId: lang?.languageId?.toString() ?? "",
                languageName: lang?.languageName ?? "",
                languageMaxMarks: lang?.languageMaxMarks?.toString() ?? "",
              })) ?? [],
            };
          }) ?? []
      };
      addExaminationMarksFormik.setValues(updatedValues);
      examiantionMarksRef.current.prevGetCbseExaminationSubjectsListByIdResp =
        getCbseExaminationSubjectsListByIdResp;

      getCbseExaminationSubjectsListByIdResp.examinationSubjectDtos?.forEach((subject: any, index: number) => {
        const hasValidLanguages = Array.isArray(subject.languagesDTOS) &&
          subject.languagesDTOS.length > 0 &&
          subject.languagesDTOS.every((lang: any) => lang.id);
        if (subject.subjectType === "SCHOLASTIC" && subject.languageType) {
          if (!hasValidLanguages) {
            getSecondLanguageList({
              classId: getCbseExaminationSubjectsListByIdResp.classId,
              type: subject.languageType,
              index,
            });
          } else {
            const formattedLanguages = subject.languagesDTOS.map((lang: any) => ({
              languageId: lang.languageId?.toString() || "",
              languageName: lang.languageName || "",
              languageCheckbox: true,
              languageMaxMarks: lang.languageMaxMarks?.toString() || "",
            }));
            setSecondLanguageMap((prev) => ({
              ...prev,
              [index]: formattedLanguages,
            }));
          }
        }
      });
    }
  }, [getCbseExaminationSubjectsListByIdResp, props.id]);

  useEffect(() => {
    examinationTermList(addExaminationMarksFormik.values.curriculumId);
  }, [addExaminationMarksFormik.values.curriculumId]);

  useEffect(() => {
    if (!props.id && addExaminationMarksFormik.values.academicYearId && addExaminationMarksFormik.values.curriculumId) {
      getClassApiCall(addExaminationMarksFormik.values.curriculumId);
    }
  }, [addExaminationMarksFormik.values.academicYearId, addExaminationMarksFormik.values.curriculumId, props.id]);

  useEffect(() => {
    if (!props.id && addExaminationMarksFormik.values.academicYearId && addExaminationMarksFormik.values.curriculumId && addExaminationMarksFormik.values.classId) {
      getMainExaminationListApiCall(addExaminationMarksFormik.values.classId, addExaminationMarksFormik.values.curriculumId);
    }
  }, [addExaminationMarksFormik.values.academicYearId, addExaminationMarksFormik.values.curriculumId, addExaminationMarksFormik.values.classId, props.id]);

  useEffect(() => {
    if (props.modalData) {
      const { academicYearId, curriculumId, } = props.modalData || {};
      addExaminationMarksFormik.setValues((prev: any) => ({ ...prev, academicYearId, curriculumId, }));
      if (academicYearId) {
        getCurriculumApiCall({ academicYearId })
      }
      if (curriculumId) {
        const payload = { branchId: branchId, curriculumId, academicYearId, classFilter: "HIGHER", sortBy: "classSequence", orderBy: "asc", pageNo: 0, pageSize: 100 };
        dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      }
    }
  }, [])

  useEffect(() => {
    if (secoundLanguageResp?.data && Array.isArray(secoundLanguageResp.data)) {
      const fetchedLanguages: LanguageMarks[] = secoundLanguageResp.data.map((subject: any) => ({
        languageId: subject.languageId || "",
        languageName: subject.languageName || "",
        languageCheckbox: false,
        languageMaxMarks: "",
      }));
      if (currentLanguageRowIndex !== null) {
        setSecondLanguageMap((prev) => ({
          ...prev,
          [currentLanguageRowIndex]: fetchedLanguages,
        }));
        const updatedSubjects = addExaminationMarksFormik.values.examinationSubjects.map((subject: any, index: number) => {
          if (index === currentLanguageRowIndex) {
            const existingLanguages = subject.languages || [];
            const mergedLanguages = fetchedLanguages.map((lang) => {
              const match = existingLanguages.find((l: any) => String(l.languageId) === String(lang.languageId));
              return {
                ...lang,
                languageMaxMarks: match?.languageMaxMarks || "",
                languageCheckbox: match?.languageCheckbox ?? false,
              };
            });
            return {
              ...subject,
              languages: mergedLanguages,
            };
          }
          return subject;
        });
        addExaminationMarksFormik.setFieldValue("examinationSubjects", updatedSubjects);
      }
    }
  }, [secoundLanguageResp]);

  useEffect(() => {
    const { curriculumId, academicYearId, classId, examinationId, } = addExaminationMarksFormik.values;
    if (curriculumId && academicYearId && classId && examinationId) {
      getExaminationSubjectsApiCall(examinationId);
      cbseSubjectOrderList({ classId: addExaminationMarksFormik.values.classId, curriculumId: addExaminationMarksFormik.values.curriculumId, academicYearId: addExaminationMarksFormik.values.academicYearId });
    }
  }, [addExaminationMarksFormik.values.curriculumId, addExaminationMarksFormik.values.academicYearId, addExaminationMarksFormik.values.classId, addExaminationMarksFormik.values.examinationId]);

  useEffect(() => {
    if (!props.id && addExaminationMarksFormik.values.examinationId) {
      addWeightageHandler();
    }
  }, [addExaminationMarksFormik.values.examinationId, props.id]);

  useEffect(() => {
    const initialTypes: { [key: number]: string } = {};
    addExaminationMarksFormik.values.examinationSubjects.forEach((grade: any, index: number) => {
      initialTypes[index] = getSubjectType(grade.subjectId);
    });
    setSelectedSubjectTypes(initialTypes);
  }, [addExaminationMarksFormik.values.examinationSubjects]);

  function getClassApiCall(selectedCurriculumId: string) {
    const payload = {
      academicYearId: addExaminationMarksFormik.values.academicYearId,
      curriculumId: selectedCurriculumId,
      branchId,
      classFilter: "HIGHER",
      pageNo: 0, pageSize: 100, sortBy: "classSequence", orderBy: "asc",
    };

    dispatch(getAssignLanClassListAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
  }

  const getCurriculumApiCall = (otherProps?: any) => {
    const payload1 = { academicYearId: addExaminationMarksFormik.values.academicYearId, branchId: branchId, pageNo: 0, pageSize: 100, sortBy: "curriculumName", orderBy: "asc", ...otherProps };
    dispatch(getAssignCurriculumListAct(generateActionPayload("get_brch_curriculum", undefined, payload1)));
  }

  function getMainExaminationListApiCall(classId: string, curriculumId: string, termId?: string) {
    const payload = {
      branchId,
      curriculumId: curriculumId,
      academicYearId: addExaminationMarksFormik.values.academicYearId,
      termId: termId ?? addExaminationMarksFormik.values.termId,
      classId: classId,
      pageNo: 0, pageSize: 100,
    };
    dispatch(getCbseExaminationListAct(generateActionPayload("get_cbse_examination_list", undefined, payload)));
  }

  const getSecondLanguageList = ({ classId, type, index }: { classId: any, type: string, index: number }) => {
    setCurrentLanguageRowIndex(index);
    const params = {
      instituteId,
      academicYearId: addExaminationMarksFormik.values.academicYearId,
      branchId,
      curriculumId: addExaminationMarksFormik.values.curriculumId,
      classId,
      type,
    };
    if (classId && type) {
      dispatch(getSecoundLanguagesList(generateActionPayload("get_secound_language_list", undefined, params)));
    }
  };


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

  const getExaminationSubjectsApiCall = (examinationId: string) => {
    const payload: any = {
      branchId,
      curriculumId: addExaminationMarksFormik.values.curriculumId,
      academicYearId: addExaminationMarksFormik.values.academicYearId,
      classId: addExaminationMarksFormik.values.classId,
      examinationId,
      pageNo: 0,
      pageSize: 100,
    };
    dispatch(getSubjectsListAct(generateActionPayload("get_subject_list", undefined, payload)));
  };

  const getFilteredSubjects = (
    subjectType: string,
    scholasticType: string,
    coScholasticType: string
  ) => {
    if (!getCBSEAllSubjectsOrderResp) return [];

    return getCBSEAllSubjectsOrderResp.filter((subject: any) => {
      if (subjectType === "COSCHOLASTIC") {
        return (
          subject.subjectType === "COSCHOLASTIC" &&
          subject.coScholasticType === coScholasticType
        );
      }

      return (
        subject.subjectType === "SCHOLASTIC" &&
        subject.scholasticType === scholasticType
      );
    });
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    addExaminationMarksFormik.setFieldValue(name, value);

    if (!value) return;

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
      const updatedValues = {
        ...addExaminationMarksFormik.values,
        classId: value,
        examinationId: "",
        examinationSubjects: [],
      };
      addExaminationMarksFormik.setValues(updatedValues);
      if (value && updatedValues.curriculumId) {
        getMainExaminationListApiCall(value, updatedValues.curriculumId);
        cbseSubjectOrderList({ academicYearId: addExaminationMarksFormik.values.academicYearId, classId: value, curriculumId: addExaminationMarksFormik.values.curriculumId });
      }
    } else if (name === "termId") {
      const updatedValues = {
        ...addExaminationMarksFormik.values,
        termId: value,
        examinationId: "",
        examinationSubjects: [],
      };
      addExaminationMarksFormik.setValues(updatedValues);

      if (updatedValues.classId && updatedValues.curriculumId) {
        getMainExaminationListApiCall(updatedValues.classId, updatedValues.curriculumId, value);
      }
    } else if (
      name.includes("subjectType") ||
      name.includes("scholasticType") ||
      name.includes("coScholasticType")
    ) {
      const { examinationId } = addExaminationMarksFormik.values;
      if (examinationId) {
        getExaminationSubjectsApiCall(examinationId);
      }
    }
  };

  const handleSubjectChange = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    const subjectType = getSubjectType(selectedId);
    setSelectedSubjectTypes((prev) => ({
      ...prev,
      [index]: subjectType,
    }));
    addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.subjectId`, selectedId);

    const selectedSubject = getCBSEAllSubjectsOrderResp?.find(
      (item) => String(item.subjectId) === String(selectedId)
    );

    if (selectedSubject) {
      const newSubjectTypes = [...subjectTypes];
      newSubjectTypes[index] = selectedSubject.subjectType || "";
      setSubjectTypes(newSubjectTypes);

      const newScholasticTypes = [...scholasticTypes];
      newScholasticTypes[index] = selectedSubject.scholasticType || selectedSubject.coScholasticType || "";
      setScholasticTypes(newScholasticTypes);
    }

    if (selectedSubject?.scholasticType === "LANGUAGE" && selectedSubject?.languageType) {
      getSecondLanguageList({
        classId: addExaminationMarksFormik.values.classId,
        type: selectedSubject.languageType,
        index,
      });
    }

    const subjectIds = addExaminationMarksFormik.values.examinationSubjects.map(
      (subject: any) => subject.subjectId
    );
    const duplicateIndices = subjectIds.reduce((acc: number[], id: string, i: number) => {
      if (id === selectedId) acc.push(i);
      return acc;
    }, []);

    if (duplicateIndices.length > 1) {
      duplicateIndices.forEach((idx: any) => {
        addExaminationMarksFormik.setFieldError(
          `examinationSubjects.${idx}.subjectId`,
          "This subject is selected multiple times."
        );
      });
    } else {
      addExaminationMarksFormik.setFieldError(
        `examinationSubjects.${index}.subjectId`,
        undefined
      );
      const subjectOrderData = getCBSEAllSubjectsOrderResp?.find(
        (item: any) => item.subjectId == selectedId
      );

      if (subjectOrderData) {
        addExaminationMarksFormik.setFieldValue(
          `examinationSubjects.${index}.displayorder`,
          subjectOrderData.displayOrder?.toString() || ""
        );
        addExaminationMarksFormik.setFieldValue(
          `examinationSubjects.${index}.gradeBookOrder`,
          subjectOrderData.gradeBookOrder?.toString() || ""
        );
      }

      addExaminationMarksFormik.setFieldValue(`examinationSubjects.${index}.subjectType`, subjectType);
    }
  };

  const { data: secoundLanguageList } = secoundLanguageResp || {};
  function addWeightageHandler() {
    if (formikArrayHelpers.current) {
      const languages = (secoundLanguageList || [])
        .filter((lang: any) => lang?.id)
        .map((lang: any) => ({
          languageCheckbox: false,
          languageName: String(lang.languageName || lang.name || ""),
          languageMaxMarks: "",
          languageId: String(lang.id),
        }));
      formikArrayHelpers.current.push({
        uniqueId: generateUniqueNumber(),
        subjectId: "",
        subjectType: "",
        scholasticType: "",
        languages,
        coScholasticType: "",
        maxMarks: "",
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

  const handleLanguageCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, langIndex: number) => {
    const { name, checked } = e.target;
    addExaminationMarksFormik.setFieldValue(name, checked);
    if (!checked) {
      addExaminationMarksFormik.setFieldValue(
        `examinationSubjects[${index}].languages[${langIndex}].languageMaxMarks`,
        ""
      );
    }
  };

  const shouldExpandMaxMarksCol = addExaminationMarksFormik.values.examinationSubjects.some((grade: any) => {
    const selectedSubjectId = Number(grade.subjectId);

    const shouldUseCbseList =
      props.id &&
      getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.some(
        (subject: any) => subject.id === grade.id
      );

    const selectedSubject = shouldUseCbseList
      ? getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.find(
        (item: any) => item.examinationSubjectId === selectedSubjectId
      )
      : getSubjectsRequestListResp?.find(
        (item: any) => item.id === selectedSubjectId
      );
    return selectedSubject?.languageType != null;
  });


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
                isDisabled
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
            {isIgcseManagementPage && (
              <div className="col-xs-12 col-md-2 mt-2">
                <SelectInput
                  name="termId"
                  value={addExaminationMarksFormik.values.termId}
                  onChange={handleSelectChange}
                  menuItems={Array.isArray(getIgseTermNameListResp?.data) ? getIgseTermNameListResp?.data : []}
                  valueKey="termId"
                  textKey="termName"
                  formgroupClassName="mb-2 mb-xl-0"
                  labelText="Term Name"
                  labelClass="required"
                  isDisabled={props?.id ? true : false}
                  invalid={(addExaminationMarksFormik.touched.termId && addExaminationMarksFormik.errors.termId) ? true : false}
                  error={(addExaminationMarksFormik.touched.termId && addExaminationMarksFormik.errors.termId) ? addExaminationMarksFormik.errors.termId : ""}
                />
              </div>
            )}
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
          <div className="row flex-nowrap justify-content-center">
            <div className="col-12 col-md-5 d-flex">
              <div className="row w-100">
                {props.id && (<div className="col-1">
                  <InputCheckbox
                    name="selectAll"
                    value={selectAll}
                    onChange={(e: { target: { checked: boolean } }) =>
                      handleSelectAllChange(e.target.checked)
                    }
                  /></div>)}
                <div className="col-3">Subject Type</div>
                <div className="col-3">Type</div>
                <div className="col-5">Subject Name</div>
              </div>
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
            <div className={`col-12 ${shouldExpandMaxMarksCol ? 'col-md-1' : 'col-md-1'}`}>
              Max Marks
            </div>
            <div className="col-12 col-md-1 pe-1">
            </div>
          </div>
        </div>
        <div className="" style={{ height: addExaminationMarksFormik.values.examinationSubjects.length >= 3 ? "50vh" : "35vh", overflowY: "auto" }}>
          {addExaminationMarksFormik.values.examinationId && (
            <FormikProvider value={addExaminationMarksFormik}>
              <FieldArray name="examinationSubjects">
                {(arrayHelpers: ArrayHelpers) => {
                  if (!formikArrayHelpers.current) { formikArrayHelpers.current = arrayHelpers; }
                  return (
                    <>
                      {addExaminationMarksFormik.values.examinationSubjects.length > 0 &&
                        addExaminationMarksFormik.values.examinationSubjects.map(
                          (grade: any, index: number) => {
                            const inputFieldErrors: any = addExaminationMarksFormik.errors.examinationSubjects && addExaminationMarksFormik.errors.examinationSubjects[index] || {};
                            const inputFieldTouched: any = addExaminationMarksFormik.touched.examinationSubjects && addExaminationMarksFormik.touched.examinationSubjects[index] || {};
                            const isTypePresent = grade.subjectType || grade.scholasticType;
                            const isGradeInExamSubjects = getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.some(
                              (subject: any) => subject.id === grade.id
                            );
                            const isSubjectAlreadySelected = getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.some(
                              (subject: any) => subject.examinationSubjectId === grade.subjectId
                            );
                            const menuItems = isTypePresent
                              ? isGradeInExamSubjects
                                ? getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.map((item: any) => ({
                                  subjectId: item.examinationSubjectId,
                                  subjectName: item.examinationSubjectName,
                                })) || []
                                : getFilteredSubjects(grade.subjectType, grade.scholasticType, grade.coScholasticType)
                              : [];
                            const valueKey = "subjectId";
                            const isDisabled = (!!props.id && !grade.isSelected) || isSubjectAlreadySelected;
                            const selectedSubjectId = Number(addExaminationMarksFormik.values.examinationSubjects?.[index]?.subjectId);
                            const shouldUseCbseList =
                              props.id &&
                              getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.some(
                                (subject: any) => subject.id === grade.id
                              );

                            const selectedSubject = shouldUseCbseList
                              ? getCbseExaminationSubjectsListByIdResp?.examinationSubjectDtos?.find(
                                (item: any) => item.examinationSubjectId === selectedSubjectId
                              )
                              : getSubjectsRequestListResp?.find(
                                (item: any) => item.id === selectedSubjectId
                              );

                            return (
                              <div key={grade.uniqueId} className="row pt-3 mx-2 justify-content-center" style={{ borderBottom: '2px dashed rgb(207, 207, 207)' }}>
                                <div className="col-12 col-md-5 d-grid">
                                  <div className="align-items-start">
                                    <div className="row">
                                      {props.id && (<div className="col-md-1 mb-3">
                                        <InputCheckbox
                                          name={`examinationSubjects[${index}].isSelected`}
                                          formgroupClassName="d-flex align-items-center"
                                          value={grade.isSelected}
                                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            handleRowSelectionChange(index, e.target.checked)
                                          }
                                        />
                                      </div>)}
                                      <div className="col-md-3 mb-3">
                                        <SelectInput
                                          name={`examinationSubjects[${index}].subjectType`}
                                          value={grade.subjectType}
                                          onChange={addExaminationMarksFormik.handleChange}
                                          menuItems={subjectType}
                                          formgroupClassName="mb-0 "
                                          valueKey="id"
                                          textKey="name"
                                          isDisabled={!!props.id && !grade.isSelected}
                                        />
                                      </div>
                                      <div className="col-md-3 mb-3">
                                        {grade.subjectType === "COSCHOLASTIC" ?
                                          <SelectInput
                                            name={`examinationSubjects[${index}].coScholasticType`}
                                            value={grade.coScholasticType}
                                            onChange={addExaminationMarksFormik.handleChange}
                                            formgroupClassName="mb-0"
                                            menuItems={coScholasticSubjects}
                                            valueKey="id"
                                            textKey="name"
                                            labelClass="required"
                                            isDisabled={!!props.id && !grade.isSelected}
                                          />
                                          :
                                          <SelectInput
                                            name={`examinationSubjects[${index}].scholasticType`}
                                            value={grade.scholasticType}
                                            onChange={addExaminationMarksFormik.handleChange}
                                            formgroupClassName="mb-0"
                                            menuItems={scholasticSubjects}
                                            valueKey="id"
                                            textKey="name"
                                            labelClass="required"
                                            isDisabled={!!props.id && !grade.isSelected}
                                          />
                                        }
                                      </div>
                                      <div className="col-md-5">
                                        <SelectInput
                                          name={`examinationSubjects[${index}].subjectId`}
                                          labelClass="required"
                                          formgroupClassName="mb-2"
                                          value={grade.subjectId}
                                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSubjectChange(index, e)}
                                          menuItems={menuItems}
                                          valueKey={valueKey}
                                          textKey="subjectName"
                                          onBlur={addExaminationMarksFormik.handleBlur}
                                          invalid={inputFieldTouched.subjectId && inputFieldErrors.subjectId}
                                          error={
                                            inputFieldTouched.subjectId && inputFieldErrors.subjectId
                                              ? inputFieldErrors.subjectId
                                              : ""
                                          }
                                          isDisabled={isDisabled}
                                        />
                                        {grade.subjectId && (
                                          <div className="mt-2 ms-2 fs-12">
                                            <span className="fw-bold text-muted">
                                              {selectedSubjectTypes[index] || "n/a"}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
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
                                    invalid={inputFieldTouched.startTime && inputFieldErrors.startTime ? true : false}
                                    error={inputFieldTouched.startTime && inputFieldErrors.startTime ? inputFieldErrors.startTime : ""}
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
                                    invalid={inputFieldTouched.endTime && inputFieldErrors.endTime ? true : false}
                                    error={inputFieldTouched.endTime && inputFieldErrors.endTime ? inputFieldErrors.endTime : ""}
                                    isDisabled={!!props.id && !grade.isSelected}
                                  />
                                </div>
                                {selectedSubject?.languageType !== null && secondLanguageMap[index]?.length > 0 ? (
                                  <div
                                    key={grade.id}
                                    className="col-xs-12 col-md-2 pt-2 rounded"
                                    style={{ border: '2px dashed rgb(207, 207, 207)', borderBottom: '0' }}
                                  >
                                    {secondLanguageMap[index]?.map((language, langIndex) => {
                                      if (!language.languageId) return null;
                                      return (
                                        <div key={langIndex} className="row d-flex justify-content-center">
                                          <div className="col-12 pe-1 d-flex col-md-8">
                                            <InputCheckbox
                                              name={`examinationSubjects[${index}].languages[${langIndex}].languageCheckbox`}
                                              value={
                                                addExaminationMarksFormik.values.examinationSubjects?.[index]?.languages?.[langIndex]?.languageCheckbox ??
                                                true
                                              }
                                              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                handleLanguageCheckboxChange(e, index, langIndex)
                                              }
                                              isDisabled={!!props.id && !grade.isSelected}
                                            />
                                            <SelectInput
                                              name={`examinationSubjects[${index}].languages[${langIndex}].languageId`}
                                              value={
                                                addExaminationMarksFormik.values.examinationSubjects?.[index]?.languages?.[langIndex]?.languageId
                                              }
                                              onChange={addExaminationMarksFormik.handleChange}
                                              formgroupClassName="mb-0"
                                              menuItems={secondLanguageMap[index]}
                                              valueKey="languageId"
                                              textKey="languageName"
                                              isDisabled={true}
                                            />
                                          </div>
                                          <div className="col-4 mb-2 d-flex px-1">
                                            <TextInputWithRegex
                                              name={`examinationSubjects[${index}].languages[${langIndex}].languageMaxMarks`}
                                              labelClass="required"
                                              formgroupClassName="mb-0"
                                              value={
                                                addExaminationMarksFormik.values.examinationSubjects?.[index]?.languages?.[langIndex]?.languageMaxMarks
                                              }
                                              onChange={addExaminationMarksFormik.handleChange}
                                              allowedInputRegex="^[0-9]+$"
                                              maxLength={3}
                                              isDisabled={
                                                addExaminationMarksFormik.values.examinationSubjects?.[index]?.languages?.[langIndex]
                                                  ?.languageCheckbox === false
                                              }
                                            />
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <div className={`col-12 ${shouldExpandMaxMarksCol ? 'col-md-1' : 'col-md-1'}`}>
                                    <TextInputWithRegex
                                      name={`examinationSubjects[${index}].maxMarks`}
                                      labelClass={grade.subjectType !== "COSCHOLASTIC" ? "required" : ""}
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
                                )}
                                <div className="col-12 col-md-1 pe-1">
                                  <div className="hstack align-items-start">
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

export default AddExaminationSubjectsIGSE;

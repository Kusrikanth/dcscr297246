import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { debounce } from "../../../../../utility/commonutility";
import { useLocation } from "react-router-dom";
import {
  ConfirmationModal,
  ModalContainerUpdated,
  SelectInput,
  TableExpandable,
  TextInput,
} from "../../../../../Components/Common";
import BreadCrumb from "../../../../../Components/Common/BreadCrumb";
import TableContainer from "../../../../../Components/Common/TableContainer";
import { generateColumns } from "./helper";
import { toast } from "react-toastify";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Delete02StrokeStandard,
  PencilEdit02Icon,
  Search01Icon,
} from "@hugeicons-pro/core-stroke-standard";
import { useModal } from "../../../../../hooks/modalhook";
import AddEditGradeEntryModal from "./AddEditGradeEntryModal";
import { generateActionPayload } from "../../../../../utility/reduxutility";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/storehook";
import { shallowEqual } from "react-redux";
import {
  getStudentSportsGradeEntryAct,
  getSportsMainAttributesWithSubAttributesAct,
  getSportsNamesAct,
  getSportsGradeListAct,
  getSportsClassesListByIdAct,
  saveStudentSportsGradeEntryAct,
} from "../../../../../store/examination/examinationSports/examinationSportsActions";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getIgseTermNameListAct } from "../../../../../store/examination/examinationsettings/examinationsettingsaction";
import {
  getBranchCurriculumAct,
  getBranchClassAct,
} from "../../../../../store/branchsettings/branchacademics/branchacademicsactions";
import { resetBrchClassAct } from "../../../../../store/branchsettings/branchacademics/branchacademicsslice";
import {
  resetSportsClassesListByIdAct,
  resetSportsMainAttributesWithSubAttributesAct,
  resetStudentSportsGradeEntryAct,
} from "../../../../../store/examination/examinationSports/examinationSportsSlice";
import {
  getSectionList,
  resetSectionListAct,
} from "../../../../../store/academic/classroomManagment/classroommanagmentactions";
import BmiDetailsModal from "./BmiDetailsModal";
import SchoolCompetitionModal from "./SchoolCompetitionModal";
import StateCompetitionModal from "./StateCompetitionModal";
import { getStudentsListAct } from "../../../../../store/directory/studentmanagement/studentmanagementactions";

const initialValues = {
  searchString: "",
  academicYearId: "",
  curriculumId: "",
  sportsId: "",
  classId: "",
  termId: "",
  sectionId: "",
  branchClassId: "",
};

const getValidationSchema = () => {
  return Yup.object().shape({
    academicYearId: Yup.string().required("Academic Year is required."),
    curriculumId: Yup.string().required("Curriculum is required."),
    sportsId: Yup.string().required("Sports is required."),
    termId: Yup.string().required("Term is required."),
    classId: Yup.string().required("Class is required.").nullable(),
    sectionId: Yup.string().required("Section is required.").nullable(),
  });
};

const SportsGradeEntry = () => {
  const location = useLocation();
  const [sportsAttributes, setSportsAttributes] = useState<any[]>([]);
  const isEarlyYearsManagement = location.pathname === "/sports-management";
  const [studentData, setStudentData] = useState<any[]>([]);
  const [allStudentSelectedState, setAllStudentSelectedState] = useState(false);
  const [lastFetchedCurriculumId, setLastFetchedCurriculumId] = useState("");

  const {
    openModal: openAddEditGradeEntryModal,
    closeModal: closeAddEditGradeEntryModal,
    modalState: addEditGradeEntryModalState,
  } = useModal();

  const {
    openModal: openDeleteGradeEntryModal,
    closeModal: closeDeleteGradeEntryModal,
    modalState: deleteGradeEntryModalState,
  } = useModal();

  const {
    openModal: bmiDetailsOpenModal,
    closeModal: bmiDetailsCloseModal,
    modalState: bmiDetailsModalState,
  } = useModal();

  const {
    openModal: schoolCompetitionOpenModal,
    closeModal: schoolCompetitionCloseModal,
    modalState: schoolCompetitionModalState,
  } = useModal();

  const {
    openModal: stateCompetitionOpenModal,
    closeModal: stateCompetitionCloseModal,
    modalState: stateCompetitionModalState,
  } = useModal();

  const dispatch = useAppDispatch();

  const {
    currentBranchIdResp: branchId,
    getStudentSportsGradeEntryResp,
    getSportsMainAttributesWithSubAttributesResp,
    academicYearListResp,
    brchCurriculumResp,
    getIgseTermNameListResp,
    branchClassResp,
    getSportsNamesResp,
    getSportsGradesListResp,
    getSportsClassesListByIdResp,
    saveStudentSportsGradeEntryResp,
    sectionListResp,
    showApiLoader,
    loggedInUserRole,
    getExaminationSportsErrResp,
  } = useAppSelector(
    ({
      appData,
      examinationSports,
      instAcademics,
      branchAcademics,
      examinationSettings,
      globalData,
      classroomManagmentInfo,
    }) => ({
      currentBranchIdResp: appData.currentBranchIdResp,
      getStudentSportsGradeEntryResp:
        examinationSports.getStudentSportsGradeEntryResp,
      getSportsMainAttributesWithSubAttributesResp:
        examinationSports.getSportsMainAttributesWithSubAttributesResp,
      academicYearListResp: instAcademics.academicYearListResp,
      brchCurriculumResp: branchAcademics.brchCurriculumResp,
      getIgseTermNameListResp: examinationSettings.getIgseTermNameListResp,
      branchClassResp: branchAcademics.branchClassResp,
      getSportsNamesResp: examinationSports.getSportsNamesResp,
      getSportsGradesListResp: examinationSports.getSportsGradesListResp,
      getSportsClassesListByIdResp:
        examinationSports.getSportsClassesListByIdResp,
      sectionListResp: classroomManagmentInfo.sectionListResp,
      saveStudentSportsGradeEntryResp:
        examinationSports.saveStudentSportsGradeEntryResp,
      showApiLoader: globalData.showApiLoader,
      loggedInUserRole: appData.loggedInUserRole,
      getExaminationSportsErrResp: examinationSports.getExaminationSportsErrResp,
    }),
    shallowEqual
  );

  const assignSportsToStudentsRef = useRef({
      prevGetExaminationSportsErrResp: getExaminationSportsErrResp,
    });
  
  useEffect(() => {
    const { prevGetExaminationSportsErrResp } = assignSportsToStudentsRef.current;
    if ( getExaminationSportsErrResp && getExaminationSportsErrResp !== prevGetExaminationSportsErrResp ) {
      const { details } = getExaminationSportsErrResp;
      toast.error(details || "Something went wrong");
    }
    assignSportsToStudentsRef.current.prevGetExaminationSportsErrResp = getExaminationSportsErrResp;
  }, [ getExaminationSportsErrResp ]);

  const formattedSportsGrades = useMemo(() => {
    const gradesData = getSportsGradesListResp?.data;
    if (!Array.isArray(gradesData)) {
      return [];
    }
    return gradesData.map((grade) => ({
      ...grade,
      displayLabel: `${grade.grade} - ${grade.label}`,
    }));
  }, [getSportsGradesListResp]);

  const handleGradeChange = useCallback(
    (studentId: string, attributeId: string, value: string) => {
      setStudentData((prevData) =>
        prevData.map((student) => {
          if (String(student.studentId) === String(studentId)) {
            return {
              ...student,
              gradeValues: {
                ...student.gradeValues,
                [attributeId]: value,
              },
            };
          }
          return student;
        })
      );
    },
    []
  );

  const allStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.target;
    setAllStudentSelectedState(checked);
    setStudentData((prevData) =>
      prevData.map((student) => ({
        ...student,
        isSelected: checked,
      }))
    );
  }, []);

  const singleStudentCheckHndlr = useCallback((event: any) => {
    const { checked } = event.currentTarget;
    const studentId = event.currentTarget.getAttribute("data-id");

    setStudentData((prevData) => {
      const updatedData = prevData.map((student) =>
        String(student.studentId) === String(studentId)
          ? { ...student, isSelected: checked }
          : student
      );

      const isAllSelected = updatedData.every((student) => student.isSelected);
      setAllStudentSelectedState(isAllSelected);

      return updatedData;
    });
  }, []);

  const gradeEntryFormik = useFormik({
    initialValues,
    validationSchema: getValidationSchema(),
    onSubmit: async (values) => {
      const errors = await gradeEntryFormik.validateForm();
      if (Object.keys(errors).length === 0) {
        const payload = {
          academicYearId: values.academicYearId || "",
          curriculumId: values.curriculumId || "",
          sportsId: values.sportsId || "",
          psSportsClassId: values.classId || "",
          termId: values.termId || "",
          searchString: values.searchString || "",
          ...(values.sectionId && {
            sectionId: values.sectionId,
          }),
        };
        getStudentSportsGradeEntry(payload);
      }
    },
  });

  const search = async (value: string) => {
    const errors = await gradeEntryFormik.validateForm();
    gradeEntryFormik.setTouched({
      academicYearId: true,
      curriculumId: true,
      sportsId: true,
      termId: true,
      classId: true,
      sectionId: true,
    });
    if (Object.keys(errors).length === 0) {
      getStudentSportsGradeEntry({
        searchString: value,
        academicYearId: gradeEntryFormik.values.academicYearId,
        curriculumId: gradeEntryFormik.values.curriculumId,
        termId: gradeEntryFormik.values.termId,
        sportsId: gradeEntryFormik.values.sportsId,
        psSportsClassId: gradeEntryFormik.values.classId,
        sectionId: gradeEntryFormik.values.sectionId,
      });
    }
  };

  const debounceFun = useCallback(debounce(search, 200), [
    gradeEntryFormik.values.academicYearId,
    gradeEntryFormik.values.curriculumId,
    gradeEntryFormik.values.termId,
    gradeEntryFormik.values.sportsId,
    gradeEntryFormik.values.classId,
  ]);

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        actionIcon: (
          <HugeiconsIcon
            icon={PencilEdit02Icon}
            className="text-muted"
            size={18}
          />
        ),
        actionName: "Edit",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openAddEditGradeEntryModal(id);
        },
      },
      {
        id: "delete",
        actionIcon: (
          <HugeiconsIcon
            icon={Delete02StrokeStandard}
            className="text-danger"
            size={18}
          />
        ),
        actionName: "Delete",
        onClickHndlr: (event: any) => {
          const id = event.currentTarget.getAttribute("data-id");
          openDeleteGradeEntryModal(id);
        },
      },
    ],
    []
  );

  const handleBmiModalOpen = (studentId: string) => {
    bmiDetailsOpenModal(studentId);
  };

  const handleSchoolCompetitionModalOpen = (studentId: string) => {
    schoolCompetitionOpenModal(studentId);
  };

  const handleStateCompetitionModalOpen = (studentId: string) => {
    stateCompetitionOpenModal(studentId);
  };

  const handleStateCompetitionSubmit = (stateCompetitionData: any) => {
    const { studentId, stateCompetitions } = stateCompetitionData;

    setStudentData((prevData) =>
      prevData.map((student) => {
        if (String(student.studentId) === String(studentId)) {
          return {
            ...student,
            stateLevelCompetitions: stateCompetitions,
          };
        }
        return student;
      })
    );
    toast.success("State Competitions updated successfully");
  };

  const handleSchoolCompetitionSubmit = (schoolCompetitionData: any) => {
    const { studentId, schoolCompetitions } = schoolCompetitionData;

    setStudentData((prevData) =>
      prevData.map((student) => {
        if (String(student.studentId) === String(studentId)) {
          return {
            ...student,
            schoolLevelCompetitions: schoolCompetitions,
          };
        }
        return student;
      })
    );
    toast.success("School Competitions updated successfully");
  };

  const handleBmiDetailsSubmit = (bmiData: any) => {
    const { studentId, bmiCalculation } = bmiData;

    setStudentData((prevData) =>
      prevData.map((student) => {
        if (String(student.studentId) === String(studentId)) {
          return {
            ...student,
            bmiCalculation: bmiCalculation,
          };
        }
        return student;
      })
    );
  };

  const tableColumns = useMemo(
    () =>
      generateColumns(
        menuOptions,
        sportsAttributes,
        formattedSportsGrades,
        handleGradeChange,
        allStudentCheckHndlr,
        singleStudentCheckHndlr,
        allStudentSelectedState,
        handleBmiModalOpen,
        handleSchoolCompetitionModalOpen,
        handleStateCompetitionModalOpen
      ),
    [
      menuOptions,
      sportsAttributes,
      formattedSportsGrades,
      studentData,
      allStudentSelectedState,
      handleGradeChange,
      allStudentCheckHndlr,
      singleStudentCheckHndlr,
    ]
  );

  const getStudentSportsGradeEntry = (otherProps?: any) => {
    let payload = {
      branchId: branchId,
      academicYearId: gradeEntryFormik.values.academicYearId,
      curriculumId: gradeEntryFormik.values.curriculumId,
      termId: gradeEntryFormik.values.termId,
      searchString: gradeEntryFormik.values.searchString,
      sportsId: gradeEntryFormik.values.sportsId,
      psSportsClassId: gradeEntryFormik.values.classId,
      ...(gradeEntryFormik.values.sectionId && {
        sectionId: gradeEntryFormik.values.sectionId,
      }),
      ...otherProps,
    };
    dispatch(
      getStudentSportsGradeEntryAct(
        generateActionPayload(
          "get_student_sports_grade_entry",
          undefined,
          payload
        )
      )
    );

    if (gradeEntryFormik.values.sportsId) {
      const attributesPayload = {
        sportsId: gradeEntryFormik.values.sportsId,
        sportsClassId: gradeEntryFormik.values.classId || null,
      };
      dispatch(
        getSportsMainAttributesWithSubAttributesAct(
          generateActionPayload(
            "get_sports_main_attributes_with_sub_attributes",
            undefined,
            attributesPayload
          )
        )
      );
    }
  };

  useEffect(() => {
    const rawData = Array.isArray(getStudentSportsGradeEntryResp)
      ? getStudentSportsGradeEntryResp
      : [];

    if (sportsAttributes.length === 0 && rawData.length > 0) {
      const dataWithSelection = rawData.map((student) => ({
        ...student,
        isSelected: false,
        stateLevelCompetitions: (student.stateLevels || []).map(
          (comp: any) => ({
            level: comp.level,
            location: comp.location,
            federation: comp.federation,
            results: comp.result,
            event: comp.event,
          })
        ),
        schoolLevelCompetitions: (student.schoolCompetitions || []).map(
          (comp: any) => ({
            level: comp.level,
            houseName: comp.houseName,
            result: comp.result,
            event: comp.event,
          })
        ),
        bmiCalculation: student.bmiDetails || student.bmiCalculation || null,
      }));
      setStudentData(dataWithSelection);
      return;
    }

    const transformedData = rawData.map((student) => {
      const gradeValues: { [key: string]: string } = {};

      if (student.finalGradeId) {
        gradeValues.finalGrade = student.finalGradeId;
        gradeValues.finalGrade_display = `${student.finalGradeName} - ${student.finalGradeLabel}`;
      }

      if (Array.isArray(student.attributeWiseGrades)) {
        student.attributeWiseGrades.forEach((attrGrade: any) => {
          const matchingAttribute = sportsAttributes.find(
            (sa) =>
              sa.id?.toString() === attrGrade.mainAttributeId?.toString() ||
              sa.mainAttributeName === attrGrade.mainAttribute
          );

          if (matchingAttribute && attrGrade.gradeId) {
            gradeValues[matchingAttribute.id] = attrGrade.gradeId;
            gradeValues[
              `${matchingAttribute.id}_display`
            ] = `${attrGrade.gradeCode} - ${attrGrade.learningLevel}`;
          }
        });
      }

      return {
        ...student,
        gradeValues,
        isSelected: false,
        stateLevelCompetitions: (student.stateLevels || []).map(
          (comp: any) => ({
            level: comp.level,
            location: comp.location,
            federation: comp.federation,
            results: comp.result,
            event: comp.event,
          })
        ),
        schoolLevelCompetitions: (student.schoolCompetitions || []).map(
          (comp: any) => ({
            level: comp.level,
            houseName: comp.houseName,
            result: comp.result,
            event: comp.event,
          })
        ),
        bmiCalculation: student.bmiDetails || student.bmiCalculation || null,
      };
    });

    setStudentData(transformedData);
  }, [getStudentSportsGradeEntryResp, sportsAttributes]);

  useEffect(() => {
    if (getSportsMainAttributesWithSubAttributesResp) {
      setSportsAttributes(getSportsMainAttributesWithSubAttributesResp);
    }
  }, [getSportsMainAttributesWithSubAttributesResp]);
  // useEffect(() => {
  //   const { academicYearId, curriculumId, sportsId, classId, termId, searchString } = gradeEntryFormik.values;

  //   if (branchId && academicYearId) {
  //     getStudentSportsGradeEntry(
  //       branchId,
  //       academicYearId,
  //       curriculumId,
  //       sportsId,
  //       classId,
  //       termId,
  //       searchString
  //     );
  //   }
  // }, [
  //   branchId,
  //   gradeEntryFormik.values.academicYearId,
  //   gradeEntryFormik.values.curriculumId,
  //   gradeEntryFormik.values.sportsId,
  //   gradeEntryFormik.values.classId,
  //   gradeEntryFormik.values.termId,
  //   gradeEntryFormik.values.searchString,
  // ]);

  useEffect(() => {
    const { academicYearId, curriculumId, termId, sportsId } =
      gradeEntryFormik.values;
    if (academicYearId && curriculumId && termId && sportsId) {
      fetchSportsClassesList();
    }
  }, [
    gradeEntryFormik.values.academicYearId,
    gradeEntryFormik.values.curriculumId,
    gradeEntryFormik.values.termId,
    gradeEntryFormik.values.sportsId,
  ]);

  useEffect(() => {
    const { curriculumId, sportsId } = gradeEntryFormik.values;
    if (curriculumId && sportsId) {
      fetchTermList(curriculumId);
    }
  }, [gradeEntryFormik.values.sportsId, gradeEntryFormik.values.curriculumId]);

  const gradeEntrySubmitRef = useRef({
    prevSaveStudentSportsGradeEntryResp : saveStudentSportsGradeEntryResp
  });

  useEffect(() => {
    const {prevSaveStudentSportsGradeEntryResp} = gradeEntrySubmitRef.current;
    if (saveStudentSportsGradeEntryResp && saveStudentSportsGradeEntryResp !== prevSaveStudentSportsGradeEntryResp) {
      setAllStudentSelectedState(false);
      setStudentData((prevData) =>
        prevData.map((student) => ({
          ...student,
          isSelected: false,
        }))
      );
      toast.success("Grades saved successfully");
      getStudentSportsGradeEntry();
    }
    gradeEntrySubmitRef.current.prevSaveStudentSportsGradeEntryResp = saveStudentSportsGradeEntryResp;
  }, [saveStudentSportsGradeEntryResp]);

  function fetchCurriculumList(otherProps?: any) {
    const payload = {
      academicYearId: gradeEntryFormik.values.academicYearId,
      branchId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "curriculumName",
      orderBy: "asc",
      ...otherProps,
    };
    if (loggedInUserRole === "TEACHER") {
      payload.progressCardType = "SPORTS";
    }
    dispatch(
      getBranchCurriculumAct(
        generateActionPayload("get_brch_curriculum", undefined, payload)
      )
    );
  }

  function fetchTermList(curriculumId: string, otherProps?: any) {
    if (curriculumId === lastFetchedCurriculumId) return;

    const payload = {
      branchId,
      curriculumId,
      ...otherProps,
    };

    dispatch(
      getIgseTermNameListAct(
        generateActionPayload("get_igse_term_name_list", undefined, payload)
      )
    );

    setLastFetchedCurriculumId(curriculumId);
  }

  // function fetchClassList(otherProps?: any) {
  //   const payload = {
  //     branchId,
  //     academicYearId: gradeEntryFormik.values.academicYearId,
  //     curriculumId: gradeEntryFormik.values.curriculumId,
  //     sortBy: "classSequence",
  //     orderBy: "asc",
  //     pageNo: 0,
  //     pageSize: 100,
  //     ...otherProps,
  //   };

  //   dispatch(
  //     getBranchClassAct(
  //       generateActionPayload("get_brch_curriculum_class", undefined, payload)
  //     )
  //   );
  // }

  useEffect(() => {
    const { data } = brchCurriculumResp || {};
    const curriculumMapping: Record<string, string> = {
      "/sports-management": "CBSE",
    };
    const selectedCurriculumName = curriculumMapping[location.pathname];
    if (
      Array.isArray(data) &&
      data.length > 0 &&
      gradeEntryFormik.values.academicYearId
    ) {
      const selectedCurriculum = data.find(
        (item) => item.shortName === selectedCurriculumName
      );

      if (!selectedCurriculum) {
        gradeEntryFormik.setFieldValue("curriculumId", undefined);
        return;
      }

      // const payload = {
      //   branchId,
      //   curriculumId: selectedCurriculum.branchCurriculumId,
      //   academicYearId: gradeEntryFormik.values.academicYearId,
      //   sortBy: "classSequence",
      //   orderBy: "asc",
      //   pageNo: 0,
      //   pageSize: 100,
      // };

      // dispatch(getBranchClassAct(generateActionPayload("get_brch_curriculum_class", undefined, payload)));
      gradeEntryFormik.setFieldValue(
        "curriculumId",
        selectedCurriculum.branchCurriculumId
      );
    }
  }, [brchCurriculumResp, gradeEntryFormik.values.academicYearId]);

  function fetchSportsList(otherProps?: any) {
    const payload = {
      branchId,
      pageNo: 0,
      pageSize: 100,
      ...otherProps,
    };

    dispatch(
      getSportsNamesAct(
        generateActionPayload("get_sports_names", undefined, payload)
      )
    );
  }

  function fetchSportsClassesList(otherProps?: any) {
    const payload = {
      academicYearId: gradeEntryFormik.values.academicYearId,
      curriculumId: gradeEntryFormik.values.curriculumId,
      termId: gradeEntryFormik.values.termId,
      sportsId: gradeEntryFormik.values.sportsId,
      ...otherProps,
    };
    dispatch(
      getSportsClassesListByIdAct(
        generateActionPayload("get_sports_classes_list", undefined, payload)
      )
    );
  }

  function fetchSectionList(otherProps?: any) {
    let payload = {
      masterAcademicYearId: gradeEntryFormik.values.academicYearId,
      curriculumId: gradeEntryFormik.values.curriculumId,
      pageNo: 0,
      pageSize: 100,
      sortBy: "sectionName",
      orderBy: "asc",
      ...otherProps,
    };
    if (loggedInUserRole === "TEACHER") {
      payload.progressCardType = "SPORTS";
    }
    dispatch(
      getSectionList(
        generateActionPayload("get_section_list", undefined, payload)
      )
    );
  }

  function fetchDirectoryStudentList(otherProps?: any) {
    const { academicYearId, curriculumId, sectionId } = gradeEntryFormik.values;

    if (academicYearId) {
      const params = {
        branchId,
        academicYearId,
        curriculumId,
        sectionId,
        pageSize: 200,
        ...otherProps,
      };
      dispatch(
        getStudentsListAct(
          generateActionPayload("get_students", undefined, params)
        )
      );
    }
  }

  function filterHandler(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    if (name === "academicYearId") {
      gradeEntryFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        curriculumId: "",
        termId: "",
        sportsId: "",
        classId: "",
        sectionId: "",
      }));

      if (value) {
        fetchCurriculumList({ academicYearId: value });
      }
    } else if (name === "curriculumId") {
      gradeEntryFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        termId: "",
        sportsId: "",
        classId: "",
        sectionId: "",
      }));

      if (value) {
        setLastFetchedCurriculumId("");
      } else {
        dispatch(resetBrchClassAct(undefined));
        setLastFetchedCurriculumId("");
      }
    } else if (name === "sportsId") {
      gradeEntryFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        termId: "",
        classId: "",
        sectionId: "",
      }));

      if (!value) {
        dispatch(resetSportsClassesListByIdAct(undefined));
        dispatch(resetSectionListAct(undefined));
      }
    } else if (name === "searchString") {
      gradeEntryFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
      debounceFun(value);
    } else if (name === "termId") {
      gradeEntryFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        classId: "",
        sectionId: "",
      }));
      if (!value) {
        dispatch(resetSportsClassesListByIdAct(undefined));
        dispatch(resetSectionListAct(undefined));
      }
    } else if (name === "classId") {
      gradeEntryFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
        sectionId: "",
      }));
      if (!value) {
        dispatch(resetSectionListAct(undefined));
      }
    } else if (name === "sectionId") {
      if (value) {
        gradeEntryFormik.setValues((prev: any) => ({
          ...prev,
          [name]: value,
        }));
        fetchDirectoryStudentList({ sectionId: value });
      }
    } else {
      gradeEntryFormik.setValues((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function fetchSportsGradesList() {
    const payload = {
      branchId,
      pageNo: 0,
      pageSize: 100,
    };

    dispatch(
      getSportsGradeListAct(
        generateActionPayload("get_sports_grades_list", undefined, payload)
      )
    );
  }

  useEffect(() => {
    if (branchId) {
      fetchSportsGradesList();
      fetchSportsList();
    }
  }, [branchId]);

  useEffect(() => {
    const yearId =
      academicYearListResp &&
      academicYearListResp.data.find(
        (year: any) => year.yearStatus.toLowerCase() === "current"
      )?.academicYearId;

    gradeEntryFormik.setFieldValue("academicYearId", yearId);
    fetchCurriculumList({ academicYearId: yearId });
    fetchDirectoryStudentList({ academicYearId: yearId });
  }, [academicYearListResp]);

  const submitHndlr = () => {
    const selectedStudents = studentData.filter(
      (item: any) => item?.isSelected
    );
    if (!selectedStudents.length) {
      toast.error("At least one student is required");
      return;
    }

    // const isValid = selectedStudents.every((student: any) => {
    //   if (!student.gradeValues?.finalGrade) return false;

    //   return sportsAttributes.every((attribute: any) => {
    //     return student.gradeValues?.[attribute.id];
    //   });
    // });

    // if (!isValid) {
    //   toast.error(
    //     "Please select grades for all attributes and final grade for selected students."
    //   );
    //   return;
    // }

    // Helper function - define once outside the loop
    const getNonEmptyArray = (...sources: any[]) => {
      for (const source of sources) {
        if (Array.isArray(source) && source.length > 0) {
          return source;
        }
      }
      return [];
    };

    const studentGradeData = selectedStudents.map((student: any) => {
      const apiStudent =
        (Array.isArray(getStudentSportsGradeEntryResp)
          ? getStudentSportsGradeEntryResp
          : []
        ).find((s: any) => String(s.studentId) === String(student.studentId)) ||
        {};

      const attributeWiseGrades = sportsAttributes.map((attribute: any) => {
        const selectedGrade = formattedSportsGrades.find(
          (grade: any) => +grade.id === +student.gradeValues?.[attribute.id]
        );

        return {
          mainAttributeId: attribute.id,
          mainAttribute: attribute.mainAttributeName,
          subAttributes:
            attribute.subAttributes
              ?.map((sub: any) => sub.subAttributeName)
              .join(", ") || "",
          learningLevel: selectedGrade?.label || "",
          gradeCode: selectedGrade?.grade || "",
          gradeId: student.gradeValues?.[attribute.id],
          ...(student.attributeWiseGrades?.find(
            (attr: any) =>
              attr.mainAttributeName === attribute.mainAttributeName
          )?.gradeStudentDetailId && {
            gradeStudentDetailId: student.attributeWiseGrades.find(
              (attr: any) =>
                attr.mainAttributeName === attribute.mainAttributeName
            ).gradeStudentDetailId,
          }),
        };
      });

      const studentPayload: any = {
        id: student.id,
        studentId: student.studentId,
        finalGradeId: student.gradeValues?.finalGrade,
        attributeWiseGrades,
        ...(student.gradeStudentEntryId && {
          gradeStudentEntryId: student.gradeStudentEntryId,
        }),
      };

      const bmiData =
        student?.bmiCalculation?.data ||
        student?.bmiCalculation ||
        apiStudent?.bmiCalculation?.data ||
        apiStudent?.bmiCalculation ||
        apiStudent?.bmiDetails;

      if (bmiData) {
        studentPayload.bmiCalculation = {
          height: bmiData.height ?? null,
          weight: bmiData.weight ?? null,
          ageInMonths: bmiData.ageInMonths ?? null,
          bmi: bmiData.bmi ?? null,
          bmiCategory: bmiData.bmiCategory ?? null,
          bmiWeightStatus: bmiData.bmiWeightStatus ?? null,
        };
      }

      const schoolSource = getNonEmptyArray(
        student.schoolLevelCompetitions,
        student.schoolCompetitions,
        student.schoolLevels,
        apiStudent.schoolCompetitions,
        apiStudent.schoolLevels
      );

      studentPayload.schoolCompetitions = schoolSource
        .filter((c: any) => c.level || c.houseName || c.result || c.event)
        .map((c: any) => ({
          level: c.level ?? null,
          houseName: c.houseName ?? null,
          result: c.result ?? null,
          event: c.event ?? null,
        }));

      const stateSource = getNonEmptyArray(
        student.stateLevelCompetitions,
        student.stateLevels,
        apiStudent.stateLevelCompetitions,
        apiStudent.stateLevels
      );

      studentPayload.stateLevelCompetitions = stateSource
        .filter(
          (c: any) =>
            c.level || c.location || c.federation || c.result || c.results || c.event
        )
        .map((c: any) => ({
          level: c.level ?? null,
          location: c.location ?? null,
          federation: c.federation ?? null,
          result: c.results || c.result || null,
          event: c.event ?? null, 
        }));

      return studentPayload;
    });

    const payload = {
      sportsId: gradeEntryFormik.values.sportsId,
      sportsClassId: gradeEntryFormik.values.classId,
      curriculumId: gradeEntryFormik.values.curriculumId,
      academicYearId: gradeEntryFormik.values.academicYearId,
      termId: gradeEntryFormik.values.termId,
      branchId,
      studentGradeData,
    };

    dispatch(
      saveStudentSportsGradeEntryAct(
        generateActionPayload(
          "save_student_sports_grade_entry",
          undefined,
          payload
        )
      )
    );
  };

  useEffect(() => {
    if (gradeEntryFormik.values.classId) {
      const branchClassId =
        getSportsClassesListByIdResp?.filter(
          (item) => +item?.id === +gradeEntryFormik.values.classId
        )[0]?.branchClassId || null;

      gradeEntryFormik.setFieldValue("branchClassId", branchClassId);
      if (branchClassId) {
        fetchSectionList({ branchClassId: branchClassId });
      }
    }
  }, [gradeEntryFormik.values.classId]);
  useEffect(() => {
    return () => {
      dispatch(resetStudentSportsGradeEntryAct(undefined));
      dispatch(resetSportsMainAttributesWithSubAttributesAct(undefined));
      dispatch(resetSectionListAct(undefined));
      dispatch(resetSportsClassesListByIdAct(undefined));
    };
  }, []);

  return (
    <>
      <div className="card d-inline-block w-100 !tw-mb-0">
        <div className="bg-light m-3 pt-1 rounded">
          <div className="row p-3 g-3 examination">
            <div className="col-xs-12 col-md-12 col-lg-3 col-xl-2">
              <SelectInput
                name="academicYearId"
                value={gradeEntryFormik.values.academicYearId}
                onChange={filterHandler}
                onBlur={gradeEntryFormik.handleBlur}
                menuItems={academicYearListResp?.data}
                valueKey="academicYearId"
                textKey="academicYearName"
                labelText="Academic Year"
                labelClass="required"
                floatingLabel
                formgroupClassName="mb-0"
                inputClassName="bg-light"
                invalid={
                  gradeEntryFormik.touched.academicYearId &&
                  gradeEntryFormik.errors.academicYearId
                    ? true
                    : false
                }
                error={
                  gradeEntryFormik.touched.academicYearId &&
                  gradeEntryFormik.errors.academicYearId
                    ? gradeEntryFormik.errors.academicYearId
                    : ""
                }
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="curriculumId"
                value={gradeEntryFormik.values.curriculumId}
                onChange={filterHandler}
                onBlur={gradeEntryFormik.handleBlur}
                menuItems={brchCurriculumResp?.data}
                valueKey="branchCurriculumId"
                textKey="curriculumName"
                labelText="Curriculum"
                labelClass="required"
                floatingLabel
                formgroupClassName="mb-0"
                inputClassName="bg-light"
                isDisabled={isEarlyYearsManagement}
                invalid={
                  gradeEntryFormik.touched.curriculumId &&
                  gradeEntryFormik.errors.curriculumId
                    ? true
                    : false
                }
                error={
                  gradeEntryFormik.touched.curriculumId &&
                  gradeEntryFormik.errors.curriculumId
                    ? gradeEntryFormik.errors.curriculumId
                    : ""
                }
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="sportsId"
                value={gradeEntryFormik.values.sportsId}
                onChange={filterHandler}
                onBlur={gradeEntryFormik.handleBlur}
                menuItems={getSportsNamesResp?.data || []}
                valueKey="id"
                textKey="sportName"
                labelText="Sports"
                labelClass="required"
                floatingLabel
                formgroupClassName="mb-0"
                inputClassName="bg-light"
                invalid={
                  gradeEntryFormik.touched.sportsId &&
                  gradeEntryFormik.errors.sportsId
                    ? true
                    : false
                }
                error={
                  gradeEntryFormik.touched.sportsId &&
                  gradeEntryFormik.errors.sportsId
                    ? gradeEntryFormik.errors.sportsId
                    : ""
                }
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="termId"
                value={gradeEntryFormik.values.termId}
                onChange={filterHandler}
                onBlur={gradeEntryFormik.handleBlur}
                menuItems={
                  Array.isArray(getIgseTermNameListResp?.data)
                    ? getIgseTermNameListResp?.data
                    : []
                }
                valueKey="termId"
                textKey="termName"
                labelText="Term"
                labelClass="required"
                floatingLabel
                formgroupClassName="mb-0"
                inputClassName="bg-light"
                invalid={
                  gradeEntryFormik.touched.termId &&
                  gradeEntryFormik.errors.termId
                    ? true
                    : false
                }
                error={
                  gradeEntryFormik.touched.termId &&
                  gradeEntryFormik.errors.termId
                    ? gradeEntryFormik.errors.termId
                    : ""
                }
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="classId"
                value={gradeEntryFormik.values.classId}
                onChange={filterHandler}
                onBlur={gradeEntryFormik.handleBlur}
                menuItems={getSportsClassesListByIdResp || []}
                valueKey="id"
                textKey="branchShortName"
                labelText="Class" // Sports Class
                labelClass="required"
                floatingLabel
                formgroupClassName="mb-0"
                inputClassName="bg-light"
                invalid={
                  gradeEntryFormik.touched.classId &&
                  gradeEntryFormik.errors.classId
                    ? true
                    : false
                }
                error={
                  gradeEntryFormik.touched.classId &&
                  gradeEntryFormik.errors.classId
                    ? gradeEntryFormik.errors.classId
                    : ""
                }
              />
            </div>
            <div className="col-xs-12 col-md-12 col-lg-3  col-xl-2">
              <SelectInput
                name="sectionId"
                value={gradeEntryFormik.values.sectionId}
                onChange={filterHandler}
                onBlur={gradeEntryFormik.handleBlur}
                menuItems={sectionListResp?.data}
                valueKey="sectionId"
                textKey="sectionName"
                labelText="Section"
                floatingLabel
                inputClassName="bg-light"
                invalid={
                  gradeEntryFormik.touched.sectionId &&
                  gradeEntryFormik.errors.sectionId
                    ? true
                    : false
                }
                error={
                  gradeEntryFormik.touched.sectionId &&
                  gradeEntryFormik.errors.sectionId
                    ? gradeEntryFormik.errors.sectionId
                    : ""
                }
              />
            </div>
            <div className="col-auto ms-auto d-flex align-items-center">
              <button
                disabled={showApiLoader}
                type="button"
                onClick={async (event: any) => {
                  const errors = await gradeEntryFormik.validateForm();
                  gradeEntryFormik.setTouched({
                    academicYearId: true,
                    curriculumId: true,
                    sportsId: true,
                    termId: true,
                    classId: true,
                    sectionId: true,
                  });
                  if (Object.keys(errors).length === 0) {
                    gradeEntryFormik.handleSubmit(event);
                  }
                }}
                className="btn text-white d-flex justify-content-center align-items-center"
                style={{ background: "#405189", border: "none" }}
              >
                <HugeiconsIcon
                  icon={Search01Icon}
                  className="me-2 text-white"
                  size={15}
                />
                Search
              </button>
            </div>
          </div>
        </div>
        <div className="row px-3 g-3 pt-2 mb-2">
          <div className="col-xs-12 col-md-12 col-lg-4 col-xl-3 mt-2">
            <div className="search-box">
              <TextInput
                name="searchString"
                placeHolder="Search"
                labelText="Search"
                floatingLabel
                formgroupClassName="mb-2"
                value={gradeEntryFormik.values.searchString}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const { value } = event.target;
                  gradeEntryFormik.setFieldValue("searchString", value);
                  debounceFun(value);
                }}
              />
              <i className="ri-search-line search-icon"></i>
            </div>
          </div>
        </div>

        <TableExpandable
          columns={tableColumns || []}
          data={studentData || []}
          tableClass="table-bordered table-nowrap table-sports"
          divClass="table-responsive max-h-500px mb-2"
          theadClass="table-light text-muted align-middle z-index-2"
          showPagination={false}
        />

        <div className="row">
          <div className="d-flex gap-2 w-auto ms-auto mx-4 my-3">
            <button
              type="button"
              className={`btn btn-success`}
              onClick={submitHndlr}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <ModalContainerUpdated
        id="add-edit-grade-entry-modal"
        isOpen={addEditGradeEntryModalState.showModal}
        toggle={closeAddEditGradeEntryModal}
        modalTitle={
          addEditGradeEntryModalState.modalData
            ? "Edit Grade Entry"
            : "Add Grade Entry"
        }
        modalSize="lg"
      >
        <AddEditGradeEntryModal
          isOpen={addEditGradeEntryModalState.showModal}
          toggle={closeAddEditGradeEntryModal}
        />
      </ModalContainerUpdated>

      <ModalContainerUpdated
        id="bmi-details-modal"
        isOpen={bmiDetailsModalState.showModal}
        toggle={bmiDetailsCloseModal}
        modalTitle="BMI Details"
        modalSize="md"
      >
        <BmiDetailsModal
          isOpen={bmiDetailsModalState.showModal}
          toggle={bmiDetailsCloseModal}
          studentId={bmiDetailsModalState.modalData}
          onSubmitHandler={handleBmiDetailsSubmit}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="school-competition-modal"
        isOpen={schoolCompetitionModalState.showModal}
        toggle={schoolCompetitionCloseModal}
        modalTitle="School Competition"
        modalSize="xl"
      >
        <SchoolCompetitionModal
          isOpen={schoolCompetitionModalState.showModal}
          toggle={schoolCompetitionCloseModal}
          studentId={schoolCompetitionModalState.modalData}
          onSubmitHandler={handleSchoolCompetitionSubmit}
        />
      </ModalContainerUpdated>
      <ModalContainerUpdated
        id="state-competition-modal"
        isOpen={stateCompetitionModalState.showModal}
        toggle={stateCompetitionCloseModal}
        modalTitle="State Competition"
        modalSize="xl"
      >
        <StateCompetitionModal
          isOpen={stateCompetitionModalState.showModal}
          toggle={stateCompetitionCloseModal}
          studentId={stateCompetitionModalState.modalData}
          onSubmitHandler={handleStateCompetitionSubmit}
        />
      </ModalContainerUpdated>

      <ConfirmationModal
        id="delete-grade-entry-modal"
        isOpen={deleteGradeEntryModalState.showModal}
        confirmMessage="Are you sure you want to delete this Grade Entry record?"
        cancelHndlr={closeDeleteGradeEntryModal}
        confirmHndlr={() => {}}
        iconType="reject"
      />
    </>
  );
};

export default SportsGradeEntry;

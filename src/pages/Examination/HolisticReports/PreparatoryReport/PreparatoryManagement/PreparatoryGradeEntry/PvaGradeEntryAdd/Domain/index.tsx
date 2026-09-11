import React, { useContext, useEffect, useState, useRef } from "react";
import { shallowEqual } from "react-redux";
import { ArrayHelpers, FieldArray, FormikProvider, useFormik } from "formik";
import { UncontrolledAccordion, AccordionBody, AccordionHeader, AccordionItem, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { StepperFormContext } from "../helper";
import { TextInput, TextArea, SelectInput } from "../../../../../../../../Components/Common";
import { HugeiconsIcon } from "@hugeicons/react";
import { CircleArrowRight01Icon, Target01Icon, StarIcon, FavouriteIcon, PaintBoardIcon, ArrowLeft01Icon, ArrowRight01Icon, Delete02StrokeStandard, ViewIcon, CircleArrowLeft01Icon, TeachingIcon, Home03Icon, PlusSignIcon } from "@hugeicons-pro/core-stroke-standard";
import { InputCheckbox } from "../../../../../../../../Components/Common/InputCheckbox";
import { rubricLevels, DomainData, transformApiDataToDomainData, transformToApiPayload, transformSavedDataToDomainData, ParentQuestions, selfQuestions, ActivityData, AssessmentRubric, RubricLevel } from "./helper";
import { generateUniqueNumber } from "../../../../../../../../utility/commonutility";
import { useAppDispatch, useAppSelector } from "../../../../../../../../hooks/storehook";
import { generateActionPayload } from "../../../../../../../../utility/reduxutility";
import { getPreparatoryDomainStudentsAct, getPreparatoryGradeEntryListByIdAct, savePreparatoryDomainStudentsAct, updatePreparatoryDomainStudentsAct } from "../../../../../../../../store/examination/examinationsettings/examinationsettingsaction";
import { toast } from "react-toastify";
import * as Yup from "yup";

const getInitialValues = (
  domainData?: any,
  apiDomainsData?: any[],
  savedDomainsData?: any[],
  currentIndex?: number
) => {
  if (domainData) return domainData;

  if (apiDomainsData?.length && currentIndex !== undefined) {
    const freshDomainData = getDefaultInitialValues(apiDomainsData, currentIndex);
    if (savedDomainsData?.length) {
      const transformedSavedData = transformSavedDataToDomainData(savedDomainsData);
      const savedDomainData = transformedSavedData.find(
        (d: any) => d?.id === freshDomainData.id
      );

      if (savedDomainData) {
        const optionsFromFresh =
          freshDomainData.activities?.[0]?.description ?? [];
        const mergedActivities =
          (savedDomainData.activities?.length
            ? savedDomainData.activities
            : freshDomainData.activities
          )?.map((activity: any, index: number) => {
            const freshAtIndex = freshDomainData.activities?.[index];

            return {
              ...(freshAtIndex ?? freshDomainData.activities?.[0] ?? {}),
              ...activity,
              description: optionsFromFresh,
            };
          }) ?? freshDomainData.activities;

        return {
          ...freshDomainData,
          studentDomainId: savedDomainData.studentDomainId,
          curriculumGoals:
            freshDomainData.curriculumGoals?.map((goal: any) => ({
              ...goal,
              selected:
                savedDomainData.curriculumGoals?.find((g: any) => g.id === goal.id)
                  ?.selected ?? goal.selected,
            })) || [],
          competencies:
            freshDomainData.competencies?.map((comp: any) => ({
              ...comp,
              selected:
                savedDomainData.competencies?.find((c: any) => c.id === comp.id)
                  ?.selected ?? comp.selected,
            })) || [],
          activities: mergedActivities,
        };
      }
    }
    return freshDomainData;
  }
  return getDefaultInitialValues();
};


const getDefaultInitialValues = (apiDomainsData?: any[], currentIndex?: number) => {
  if (apiDomainsData && apiDomainsData.length > 0 && currentIndex !== undefined) {
    const transformedData = transformApiDataToDomainData(apiDomainsData);
    const domainDataWithDefaults = transformedData[currentIndex] || {};
    if (domainDataWithDefaults.curriculumGoals?.length > 0) {
      domainDataWithDefaults.curriculumGoals[0].selected = true;
    }
    if (!Array.isArray(domainDataWithDefaults.activities) || domainDataWithDefaults.activities.length === 0) {
      domainDataWithDefaults.activities = [
        {
          activityId: "",
          description: [],
          questions: [{ id: generateUniqueNumber(), question: "", answer: "" }],
          teacherFeedback: {
            teacherAwarenessStatus: "beginner",
            teacherSensitivityStatus: "beginner",
            teacherCreativityStatus: "beginner",
            teacherFeedback: "",
            challengesFaced: "",
            overComeChallenges: "",
          },
          selfResponses: {},
          assessmentRubric: {
            awareness: { level: "beginner", notes: "" },
            sensitivity: { level: "beginner", notes: "" },
            creativity: { level: "beginner", notes: "" },
          },
        },
      ];
    }
    return domainDataWithDefaults;
  }

  return {
    id: 0,
    name: "",
    domainIndex: "",
    curriculumGoals: [],
    competencies: [],
    activities: [
      {
        activityId: "",
        description: [],
        questions: [{ id: generateUniqueNumber(), question: "", answer: "" }],
        teacherFeedback: {
          teacherAwarenessStatus: "beginner",
          teacherSensitivityStatus: "beginner",
          teacherCreativityStatus: "beginner",
          teacherFeedback: "",
          challengesFaced: "",
          overComeChallenges: "",
        },
        selfResponses: {},
        assessmentRubric: {
          awareness: { level: "beginner", notes: "" },
          sensitivity: { level: "beginner", notes: "" },
          creativity: { level: "beginner", notes: "" },
        },
      },
    ],
  };
};

const DomainAssessment = (props: any) => {
  const { stepId, entryId } = props;
  const formikArrayHelpers = useRef<ArrayHelpers | null>(null);
  const [activeActivityTab, setActiveActivityTab] = useState(0);
  const [shouldNavigateNext, setShouldNavigateNext] = useState(false);
  const { nextStepHndlr, submitCurrentFormCllbck, setTabsDataHandler, isViewMode } =
    useContext(StepperFormContext);

  const dispatch = useAppDispatch();

  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);
  const [transformedDomainData, setTransformedDomainData] = useState<DomainData[]>([]);
  const [domainUserData, setDomainUserData] = useState<{ [key: number]: DomainData }>({});
  const [savedDomainsData, setSavedDomainsData] = useState<any[]>([]);

  const {
    showApiLoader,
    getPreparatoryDomainStudentsResp,
    savePreparatoryGradeEntryListResp,
    getPreparatoryGradeEntryListByIdResp,
    updatePreparatoryDomainStudentsResp,
    savePreparatoryDomainStudentsResp,
    cbseExaminationErrorAct,
  } = useAppSelector(
    ({ globalData, examinationSettings }: any) => ({
      showApiLoader: globalData.showApiLoader,
      getPreparatoryDomainStudentsResp: examinationSettings.getPreparatoryDomainStudentsResp,
      getPreparatoryGradeEntryListByIdResp: examinationSettings.getPreparatoryGradeEntryListByIdResp,
      savePreparatoryGradeEntryListResp: examinationSettings.savePreparatoryGradeEntryListResp,
      updatePreparatoryDomainStudentsResp: examinationSettings.updatePreparatoryDomainStudentsResp,
      savePreparatoryDomainStudentsResp: examinationSettings.savePreparatoryDomainStudentsResp,
      cbseExaminationErrorAct: examinationSettings.cbseExaminationErrorAct,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (
      getPreparatoryGradeEntryListByIdResp?.studentDomains &&
      Array.isArray(getPreparatoryGradeEntryListByIdResp.studentDomains)
    ) {
      setSavedDomainsData(getPreparatoryGradeEntryListByIdResp.studentDomains);
    }
  }, [getPreparatoryGradeEntryListByIdResp]);

  useEffect(() => {
    if (getPreparatoryDomainStudentsResp && Array.isArray(getPreparatoryDomainStudentsResp)) {
      const transformed = transformApiDataToDomainData(getPreparatoryDomainStudentsResp);
      setTransformedDomainData(transformed);
    }
  }, [getPreparatoryDomainStudentsResp]);

  const getCurrentDomainData = () => {
    const domainId = transformedDomainData[currentDomainIndex]?.id;

    if (domainId && domainUserData[domainId]) return domainUserData[domainId];

    if (transformedDomainData.length > 0) {
      return getInitialValues(
        undefined,
        getPreparatoryDomainStudentsResp,
        savedDomainsData,
        currentDomainIndex
      );
    }

    return getInitialValues();
  };

  const getFilteredCompetencies = (domainData: DomainData) => {
    const selectedGoalIds =
      domainData.curriculumGoals?.filter((g) => g.selected)?.map((g) => g.id) || [];
    if (selectedGoalIds.length === 0) return [];
    return domainData.competencies?.filter((c) => selectedGoalIds.includes(c.goalId)) || [];
  };

  const domainAssessmentForm = useFormik({
    initialValues: getCurrentDomainData(),
    enableReinitialize: false,
    onSubmit: () => { },
  });

  useEffect(() => {
    if (transformedDomainData.length > 0 || savedDomainsData.length > 0) {
      const currentData = getCurrentDomainData();
      domainAssessmentForm.resetForm({ values: currentData });
      setActiveActivityTab(0);
    }
  }, [currentDomainIndex, transformedDomainData, savedDomainsData]);

  const getDomainDetailsApiCall = () => {
    dispatch(
      getPreparatoryDomainStudentsAct(
        generateActionPayload("get_preparatory_domain_students", undefined, {
          academicYearId: getPreparatoryGradeEntryListByIdResp?.academicYearId,
          branchId: getPreparatoryGradeEntryListByIdResp?.branchId,
          curriculumId: getPreparatoryGradeEntryListByIdResp?.curriculumId,
          classId: getPreparatoryGradeEntryListByIdResp?.classId,
        })
      )
    );
  };

  useEffect(() => {
    getDomainDetailsApiCall();
  }, []);

  useEffect(() => {
    if (savePreparatoryGradeEntryListResp?.data || entryId) {
      dispatch(getPreparatoryGradeEntryListByIdAct(generateActionPayload("get_preparatory_grade_entry_by_id", { id: savePreparatoryGradeEntryListResp?.data || entryId }, undefined)));
    }
  }, [entryId, savePreparatoryGradeEntryListResp]);

  const handleInputChange = (field: string, value: any) => {
    domainAssessmentForm.setFieldValue(field, value);
    const updatedData = { ...domainAssessmentForm.values, [field]: value };

    const domainId = transformedDomainData[currentDomainIndex]?.id;
    if (domainId) {
      setDomainUserData((prev) => ({ ...prev, [domainId]: updatedData }));
    }
    setTabsDataHandler(stepId, updatedData);
  };

  const handleDomainChange = (direction: "prev" | "next") => {
    const currentDomainId = transformedDomainData[currentDomainIndex]?.id;
    if (currentDomainId) {
      setDomainUserData((prev) => ({ ...prev, [currentDomainId]: domainAssessmentForm.values }));
    }

    let newIndex = currentDomainIndex;
    if (direction === "prev" && currentDomainIndex > 0) newIndex = currentDomainIndex - 1;
    else if (direction === "next" && currentDomainIndex < transformedDomainData.length - 1)
      newIndex = currentDomainIndex + 1;
    else return;

    setCurrentDomainIndex(newIndex);
  };

  const handleCurriculumGoalChange = (goalId: string) => {
    const updatedGoals = domainAssessmentForm.values.curriculumGoals.map((goal) =>
      goal.id === goalId ? { ...goal, selected: !goal.selected } : goal
    );

    const updatedCompetencies = domainAssessmentForm.values.competencies.map((c) => ({
      ...c,
      selected: false,
    }));

    const updatedData = {
      ...domainAssessmentForm.values,
      curriculumGoals: updatedGoals,
      competencies: updatedCompetencies,
    };

    domainAssessmentForm.setValues(updatedData);

    const domainId = transformedDomainData[currentDomainIndex]?.id;
    if (domainId) setDomainUserData((prev) => ({ ...prev, [domainId]: updatedData }));

    setTabsDataHandler(stepId, updatedData);
  };

  const handleCompetencyChange = (competencyId: string) => {
    const updatedCompetencies = domainAssessmentForm.values.competencies.map((c) =>
      c.id === competencyId ? { ...c, selected: !c.selected } : c
    );
    handleInputChange("competencies", updatedCompetencies);
  };

  const addQuestion = (activityIndex: number) => {
    const newQuestion = { id: +generateUniqueNumber(), question: "", answer: "" };
    const updatedActivities = [...domainAssessmentForm.values.activities];
    updatedActivities[activityIndex].questions.push(newQuestion);
    handleInputChange("activities", updatedActivities);
  };

  const emptyRubric: AssessmentRubric = {
    awareness: { level: "beginner", notes: "" },
    sensitivity: { level: "beginner", notes: "" },
    creativity: { level: "beginner", notes: "" },
  };

  const handleActivitySelection = (
    activityIndex: number,
    selectedActivityId: string
  ) => {
    const currentActivities = domainAssessmentForm.values.activities || [];
    domainAssessmentForm.setFieldTouched(
      `activities[${activityIndex}].activityId`,
      true,
      false
    );
    const isDuplicate = currentActivities.some(
      (a, idx) =>
        idx !== activityIndex &&
        a.activityId?.toString() === selectedActivityId?.toString()
    );
    if (isDuplicate) {
      toast.error(
        "This activity is already added. Please select a different activity.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }
    const updatedActivities = [...currentActivities];
    const activityRow = updatedActivities[activityIndex];
    const activityDescriptions = Array.isArray(activityRow?.description)
      ? activityRow.description
      : [];
    const selectedActivity = activityDescriptions.find(
      (a: any) =>
        a.activityId?.toString() === selectedActivityId?.toString()
    );
    const prefillQuestions =
      selectedActivity?.questions &&
        Array.isArray(selectedActivity.questions) &&
        selectedActivity.questions.length > 0
        ? selectedActivity.questions.map((questionText: string) => ({
          id: +generateUniqueNumber(),
          question: (questionText || "").trim(),
          answer: "",
        }))
        : [
          {
            id: +generateUniqueNumber(),
            question: "",
            answer: "",
          },
        ];
    updatedActivities[activityIndex] = {
      ...activityRow,
      activityId: selectedActivityId?.toString() || "",
      questions: prefillQuestions,
    };
    handleInputChange("activities", updatedActivities);
    domainAssessmentForm.validateField(
      `activities[${activityIndex}].activityId`
    );
  };

  const updateActivityField = (activityIndex: number, field: keyof ActivityData, value: any) => {
    const updatedActivities = [...domainAssessmentForm.values.activities];
    updatedActivities[activityIndex] = { ...updatedActivities[activityIndex], [field]: value };
    handleInputChange("activities", updatedActivities);
  };

  const handleAddActivity = () => {
    const optionsFromFirst =
      domainAssessmentForm.values.activities?.[0]?.description ?? [];

    const newActivity: ActivityData = {
      activityId: "",
      description: optionsFromFirst,
      questions: [{ id: Number(generateUniqueNumber()), question: "", answer: "" }],
      teacherFeedback: {
        teacherAwarenessStatus: "beginner",
        teacherSensitivityStatus: "beginner",
        teacherCreativityStatus: "beginner",
        teacherFeedback: "",
        challengesFaced: "",
        overComeChallenges: "",
      },
      selfResponses: {},
      assessmentRubric: emptyRubric,
    };

    const updatedActivities = [...domainAssessmentForm.values.activities, newActivity];
    handleInputChange("activities", updatedActivities);
    setActiveActivityTab(updatedActivities.length - 1);
  };
  const handleRemoveActivityTab = (removeIndex: number) => {
    const current = domainAssessmentForm.values.activities || [];
    if (current.length <= 1) return;

    const updated = current.filter((_, idx) => idx !== removeIndex);

    handleInputChange("activities", updated);
    setActiveActivityTab((prev) => {
      if (prev === removeIndex) return Math.max(0, removeIndex - 1);
      if (prev > removeIndex) return prev - 1;
      return prev;
    });
  };

  const gradeEntryDomainAddRef = useRef({
    prevUpdatePreparatoryDomainStudentsResp: updatePreparatoryDomainStudentsResp,
    prevSavePreparatoryDomainStudentsResp: savePreparatoryDomainStudentsResp,
    prevCbseExaminationErrorAct: cbseExaminationErrorAct,
  });

  useEffect(() => {
    const { prevUpdatePreparatoryDomainStudentsResp, prevSavePreparatoryDomainStudentsResp, prevCbseExaminationErrorAct } = gradeEntryDomainAddRef.current;

    const didUpdateSucceed =
      updatePreparatoryDomainStudentsResp &&
      prevUpdatePreparatoryDomainStudentsResp !== updatePreparatoryDomainStudentsResp;

    const didSaveSucceed =
      savePreparatoryDomainStudentsResp &&
      prevSavePreparatoryDomainStudentsResp !== savePreparatoryDomainStudentsResp;

    const didError =
      cbseExaminationErrorAct &&
      prevCbseExaminationErrorAct !== cbseExaminationErrorAct;

    if (didError) {
      const { details, error } = cbseExaminationErrorAct || {};
      toast.error(details || error || "Something went wrong.");
      setShouldNavigateNext(false);
    }

    if ((didUpdateSucceed || didSaveSucceed) && shouldNavigateNext) {
      toast.success(didUpdateSucceed ? "Updated successfully" : "Saved successfully");
      submitCurrentFormCllbck([], "NEXT_TAB");
      nextStepHndlr(stepId, domainAssessmentForm.values);
      setShouldNavigateNext(false);
    }

    gradeEntryDomainAddRef.current.prevUpdatePreparatoryDomainStudentsResp = updatePreparatoryDomainStudentsResp;
    gradeEntryDomainAddRef.current.prevSavePreparatoryDomainStudentsResp = savePreparatoryDomainStudentsResp;
    gradeEntryDomainAddRef.current.prevCbseExaminationErrorAct = cbseExaminationErrorAct;
  }, [updatePreparatoryDomainStudentsResp, savePreparatoryDomainStudentsResp, cbseExaminationErrorAct, shouldNavigateNext]);

  const validateForm = async () => {
    const errors = await domainAssessmentForm.validateForm();
    domainAssessmentForm.setTouched({
      activities: domainAssessmentForm.values.activities.map(() => ({
        activityId: true,
      })),
    });

    return Object.keys(errors).length === 0;
  };

  const getAllDomainsData = () => {
    const currentDomainId = transformedDomainData[currentDomainIndex]?.id;
    const updatedDomainUserData = currentDomainId
      ? { ...domainUserData, [currentDomainId]: domainAssessmentForm.values }
      : domainUserData;
    const transformedSaved = transformSavedDataToDomainData(savedDomainsData || []);
    const studentDomainIdMap = new Map<number, number | undefined>(
      transformedSaved.map((d: any) => [d.id, d.studentDomainId])
    );
    return transformedDomainData.map((domain) => {
      let domainData = updatedDomainUserData[domain.id];

      if (!domainData) {
        domainData = getInitialValues(
          undefined,
          getPreparatoryDomainStudentsResp,
          savedDomainsData,
          transformedDomainData.findIndex((d) => d.id === domain.id)
        );
      }
      const sid = (domainData as any).studentDomainId ?? studentDomainIdMap.get(domain.id);
      if (sid != null) (domainData as any).studentDomainId = sid;
      return domainData;
    });
  };

  const saveStudentSurroundings = async () => {
    const isValid = await validateForm();
    if (!isValid) return;
    const allDomainsData = getAllDomainsData();
    const isUpdate =
      Boolean(entryId) || (getPreparatoryGradeEntryListByIdResp?.studentDomains?.length > 0);
    const payload = transformToApiPayload(allDomainsData, isUpdate);
    if (isUpdate) {
      dispatch(
        updatePreparatoryDomainStudentsAct(
          generateActionPayload(
            "save_preparatory_domain_students",
            { id: savePreparatoryGradeEntryListResp?.data || entryId },
            payload
          )
        )
      );
    } else {
      dispatch(
        savePreparatoryDomainStudentsAct(
          generateActionPayload(
            "save_preparatory_domain_students",
            { id: savePreparatoryGradeEntryListResp?.data || entryId },
            payload
          )
        )
      );
    }
  };

  const handleNext = () => {
    validateForm().then((isValid) => {
      if (!isValid) return;
      setShouldNavigateNext(true);
      saveStudentSurroundings();
    });
  };

  const handleNextDomain = () => {
    if (currentDomainIndex === transformedDomainData.length - 1) {
      handleNext();
    } else {
      handleDomainChange("next");
    }
  };

  const handlePrevious = () => {
    dispatch(
      getPreparatoryGradeEntryListByIdAct(
        generateActionPayload(
          "get_preparatory_grade_entry_by_id",
          { id: savePreparatoryGradeEntryListResp?.data || entryId },
          undefined
        )
      )
    );

    submitCurrentFormCllbck([], "PREVIOUS_TAB");
    nextStepHndlr(stepId, domainAssessmentForm.values);
  };

  if (!transformedDomainData.length) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
        {showApiLoader ? <div>Loading domains...</div> : <div>No domains available</div>}
      </div>
    );
  }

  const filteredCompetencies = getFilteredCompetencies(domainAssessmentForm.values);
  const getMaxActivitiesAllowed = () => {
    const options = domainAssessmentForm.values.activities?.[0]?.description;
    return Array.isArray(options) ? options.length : 0;
  };

  const canAddActivity = () => {
    const max = getMaxActivitiesAllowed();
    const currentCount = domainAssessmentForm.values.activities?.length || 0;
    return max > 0 ? currentCount < max : false;
  };

  return (
    <div>
      <div className="tw-flex tw-justify-between tw-items-center tw-mb-4">
        <h3 className="tw-mb-0 tw-text-lg tw-font-semibold text-primary">
          {domainAssessmentForm.values.domainIndex ? `${domainAssessmentForm.values.domainIndex}. ` : ""}
          Domain: {domainAssessmentForm.values.name || `Domain ${currentDomainIndex + 1}`}
        </h3>

        <div className="tw-flex tw-items-center tw-gap-2">
          <button
            onClick={() => handleDomainChange("prev")}
            disabled={currentDomainIndex === 0}
            className="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full tw-border tw-border-gray-300 tw-text-gray-600 hover:tw-bg-gray-100 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
          </button>

          <div className="tw-flex tw-items-center tw-justify-center tw-px-4 tw-py-1 tw-rounded-full tw-bg-blue-50 tw-text-blue-700 tw-font-medium tw-text-sm tw-border tw-border-blue-200">
            {currentDomainIndex + 1}/{transformedDomainData.length}
          </div>

          <button
            onClick={() => handleDomainChange("next")}
            disabled={currentDomainIndex === transformedDomainData.length - 1}
            className="tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full tw-border tw-border-gray-300 tw-text-gray-600 hover:tw-bg-gray-100 disabled:tw-opacity-50 disabled:tw-cursor-not-allowed"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
          </button>
        </div>
      </div>

      <UncontrolledAccordion stayOpen defaultOpen={["curriculum-goals", "competencies"]}>
        <AccordionItem>
          <AccordionHeader tag="h5" targetId="curriculum-goals">
            <div className="d-flex align-items-center">
              <HugeiconsIcon icon={Target01Icon} size={24} className="me-2" style={{ color: "#0ab39c" }} />
              <div>
                <div className="fw-bold">Curricular Goals</div>
                <small className="text-muted">Select relevant curricular goals for this domain</small>
              </div>
            </div>
          </AccordionHeader>

          <AccordionBody accordionId="curriculum-goals">
            <div className="d-flex flex-wrap gap-2">
              {domainAssessmentForm.values.curriculumGoals?.map((goal: any) => (
                <button
                  key={goal.id}
                  className={`btn ${goal.selected
                    ? "!tw-bg-[#0ab39c]/20 !tw-text-[#0ab39c] !tw-text-sm !tw-font-semibold !tw-rounded-full !tw-py-2 !tw-px-4 !tw-border !tw-border-[#0ab39c]"
                    : "tw-bg-white !tw-text-sm tw-text-gray-600 tw-border !tw-border-gray-300 !tw-rounded-full !tw-py-2 !tw-px-4"
                    } btn-sm`}
                  onClick={() => handleCurriculumGoalChange(goal.id)}
                  disabled={isViewMode}
                >
                  {goal.goalIndex ? `${goal.goalIndex}. ` : ""}
                  {goal.title}
                </button>
              ))}
            </div>
          </AccordionBody>
        </AccordionItem>

        <AccordionItem>
          <AccordionHeader tag="h5" targetId="competencies">
            <div className="d-flex align-items-center">
              <HugeiconsIcon icon={StarIcon} size={24} className="me-2" style={{ color: "#D97705" }} />
              <div>
                <div className="fw-bold">Competency/Competencies</div>
                <small className="text-muted">Specific competencies derived from selected curricular goals</small>
              </div>
            </div>
          </AccordionHeader>

          <AccordionBody accordionId="competencies">
            {domainAssessmentForm.values.curriculumGoals?.some((g: any) => g.selected) ? (
              <div className="row">
                {filteredCompetencies.map((competency: any) => (
                  <div key={competency.id} className="col-md-6 mb-2">
                    <InputCheckbox
                      name={`competency-${competency.id}`}
                      labelName={`${competency.competencyIndex ? `${competency.competencyIndex}. ` : ""}${competency.title}`}
                      value={competency.selected}
                      onChange={() => handleCompetencyChange(competency.id)}
                      isDisabled={isViewMode}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted">Please select curricular goals first to see related competencies</div>
            )}
          </AccordionBody>
        </AccordionItem>
      </UncontrolledAccordion>

      <div className="tw-mt-4 tw-flex tw-justify-end">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleAddActivity}
          disabled={isViewMode || !canAddActivity()}
        >
          Add Activity
        </button>
      </div>
      <div className="tw-flex tw-justify-end">
        {!isViewMode && !canAddActivity() && (
          <span className="text-muted d-block mt-1">
            You have added all available activities.
          </span>
        )}
      </div>

      {domainAssessmentForm.values.activities?.length > 0 && (
        <>
          <Nav tabs>
            {domainAssessmentForm.values.activities.map((_, index) => (
              <NavItem key={index}>
                <NavLink
                  className={activeActivityTab === index ? "active" : ""}
                  onClick={() => setActiveActivityTab(index)}
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <span>Activity {index + 1}</span>

                  {!isViewMode && domainAssessmentForm.values.activities.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveActivityTab(index);
                      }}
                      className="btn btn-sm btn-link p-0 m-0 text-danger"
                      title="Remove Activity"
                    >
                      <HugeiconsIcon icon={Delete02StrokeStandard} size={16} />
                    </button>
                  )}
                </NavLink>
              </NavItem>
            ))}
          </Nav>

          <TabContent activeTab={activeActivityTab} className="tw-mt-4">
            {domainAssessmentForm.values.activities.map((activity: any, activityIndex: number) => (
              <TabPane key={activityIndex} tabId={activityIndex}>
                <UncontrolledAccordion
                  stayOpen
                  defaultOpen={[
                    `activity-${activityIndex}-assessment`,
                    `activity-${activityIndex}-teacher`,
                    `activity-${activityIndex}-self`,
                  ]}
                >
                  <AccordionItem>
                    <AccordionHeader targetId={`activity-${activityIndex}-assessment`}>
                      Assessment Activity
                    </AccordionHeader>

                    <AccordionBody accordionId={`activity-${activityIndex}-assessment`}>
                      <div className="mb-3">
                        <SelectInput
                          name={`activities[${activityIndex}].activityId`}
                          value={activity?.activityId?.toString() || ""}
                          menuItems={Array.isArray(activity?.description) ? activity.description : []}
                          textKey="title"
                          valueKey="activityId"
                          labelText="Select Activity"
                          onChange={(e) => handleActivitySelection(activityIndex, e.target.value)}
                        />
                      </div>
                      {activity?.activityId && (
                        <>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6>Assessment Questions</h6>
                            <button
                              type="button"
                              className="!tw-bg-[#5DA1C8] !tw-text-white !tw-text-sm btn-sm !tw-rounded-lg !tw-px-6 !tw-py-2"
                              onClick={() => addQuestion(activityIndex)}
                              disabled={isViewMode}
                            >
                              <HugeiconsIcon icon={PlusSignIcon} size={14} className="me-2" style={{ color: "#ffffff" }} />
                              Add Q&A
                            </button>
                          </div>
                          <FormikProvider value={domainAssessmentForm}>
                            <FieldArray name={`activities[${activityIndex}].questions`}>
                              {(arrayHelpers: ArrayHelpers) => {
                                if (!formikArrayHelpers.current) formikArrayHelpers.current = arrayHelpers;

                                return (
                                  <>
                                    {activity?.questions?.map((question: any, index: number) => (
                                      <div key={`question-${index}-${question.id}`} className="mb-3">
                                        <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5 position-relative">
                                          {index !== 0 && (
                                            <button
                                              type="button"
                                              className="btn btn-sm btn-icon btn-rounded btn-hover-danger btn btn-white position-absolute"
                                              onClick={() => arrayHelpers.remove(index)}
                                              disabled={isViewMode}
                                              style={{ top: 5, right: 10, zIndex: 1 }}
                                            >
                                              <HugeiconsIcon icon={Delete02StrokeStandard} className="text-danger" size={18} />
                                            </button>
                                          )}
                                          <div className="mb-3">
                                            <label className="form-label fw-bold">
                                              {index === 0 ? "1. Question" : `${index + 1}. Question`}
                                            </label>
                                            <TextInput
                                              name={`activities[${activityIndex}].questions[${index}].question`}
                                              value={question.question}
                                              onChange={domainAssessmentForm.handleChange}
                                              placeHolder="Enter question"
                                              isDisabled={isViewMode}
                                              formgroupClassName="mb-0"
                                              maxLength={500}
                                            />
                                          </div>
                                          <div>
                                            <label className="form-label fw-bold">Answer</label>
                                            <TextArea
                                              name={`activities[${activityIndex}].questions[${index}].answer`}
                                              value={question.answer}
                                              onChange={domainAssessmentForm.handleChange}
                                              placeHolder="Enter answer"
                                              isDisabled={isViewMode}
                                              formgroupClassName="mb-0"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </>
                                );
                              }}
                            </FieldArray>
                          </FormikProvider>
                        </>
                      )}
                    </AccordionBody>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionHeader targetId={`activity-${activityIndex}-teacher`}>
                      <div className="d-flex align-items-center">
                        <HugeiconsIcon icon={TeachingIcon} size={24} className="me-2 text-primary" />
                        <div>
                          <div className="fw-bold">Teacher's Feedback</div>
                          <small className="text-muted">Comprehensive assessment observations and recommendations</small>
                        </div>
                      </div>
                    </AccordionHeader>
                    <AccordionBody accordionId={`activity-${activityIndex}-teacher`}>
                      <div className="column">
                        <div className="col-md-12 mb-3">
                          <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5">
                            <div className="d-flex align-items-center mb-3">
                              <HugeiconsIcon icon={ViewIcon} size={24} className="me-2" style={{ color: "#5DA1C8" }} />
                              <h6 className="mb-0 fw-bold">Awareness</h6>
                            </div>
                            <div className="d-flex flex-row gap-2">
                              {rubricLevels.map((level) => {
                                const isSelected = activity.teacherFeedback?.teacherAwarenessStatus === level.id;

                                return (
                                  <div
                                    key={level.id}
                                    className={`flex-fill p-3 border !tw-rounded-lg cursor-pointer ${isSelected ? `${level.borderColor} ${level.backgroundColor}` : "border-light"
                                      }`}
                                    onClick={() =>
                                      !isViewMode &&
                                      updateActivityField(activityIndex, "teacherFeedback", {
                                        ...activity.teacherFeedback,
                                        teacherAwarenessStatus: level.id,
                                      })
                                    }
                                    style={{ cursor: isViewMode ? "default" : "pointer" }}
                                  >
                                    <div className="d-flex align-items-center">
                                      <div className={`me-3 ${isSelected ? level.textColor : "text-muted"}`}>
                                        <div
                                          className={`rounded-circle border ${isSelected ? `${level.iconBgColor} ${level.iconBorderColor}` : "border-secondary"
                                            }`}
                                          style={{ width: 20, height: 20 }}
                                        >
                                          {isSelected && (
                                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                              <div className="bg-white rounded-circle" style={{ width: 8, height: 8 }} />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex-grow-1">
                                        <div className={`fw-bold ${isSelected ? level.textColor : "text-dark"}`}>
                                          {level.name}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 mb-3">
                          <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5">
                            <div className="d-flex align-items-center mb-3">
                              <HugeiconsIcon icon={FavouriteIcon} size={24} className="me-2" style={{ color: "#EF4444" }} />
                              <h6 className="mb-0 fw-bold">Sensitivity</h6>
                            </div>
                            <div className="d-flex flex-row gap-2">
                              {rubricLevels.map((level) => {
                                const isSelected = activity.teacherFeedback?.teacherSensitivityStatus === level.id;

                                return (
                                  <div
                                    key={level.id}
                                    className={`flex-fill p-3 border !tw-rounded-lg cursor-pointer ${isSelected ? `${level.borderColor} ${level.backgroundColor}` : "border-light"
                                      }`}
                                    onClick={() =>
                                      !isViewMode &&
                                      updateActivityField(activityIndex, "teacherFeedback", {
                                        ...activity.teacherFeedback,
                                        teacherSensitivityStatus: level.id,
                                      })
                                    }
                                    style={{ cursor: isViewMode ? "default" : "pointer" }}
                                  >
                                    <div className="d-flex align-items-center">
                                      <div className={`me-3 ${isSelected ? level.textColor : "text-muted"}`}>
                                        <div
                                          className={`rounded-circle border ${isSelected ? `${level.iconBgColor} ${level.iconBorderColor}` : "border-secondary"
                                            }`}
                                          style={{ width: 20, height: 20 }}
                                        >
                                          {isSelected && (
                                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                              <div className="bg-white rounded-circle" style={{ width: 8, height: 8 }} />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex-grow-1">
                                        <div className={`fw-bold ${isSelected ? level.textColor : "text-dark"}`}>
                                          {level.name}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12 mb-3">
                          <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5">
                            <div className="d-flex align-items-center mb-3">
                              <HugeiconsIcon icon={PaintBoardIcon} size={24} className="me-2" style={{ color: "#F59E0B" }} />
                              <h6 className="mb-0 fw-bold">Creativity</h6>
                            </div>
                            <div className="d-flex flex-row gap-2">
                              {rubricLevels.map((level) => {
                                const isSelected = activity.teacherFeedback?.teacherCreativityStatus === level.id;

                                return (
                                  <div
                                    key={level.id}
                                    className={`flex-fill p-3 border !tw-rounded-lg cursor-pointer ${isSelected ? `${level.borderColor} ${level.backgroundColor}` : "border-light"
                                      }`}
                                    onClick={() =>
                                      !isViewMode &&
                                      updateActivityField(activityIndex, "teacherFeedback", {
                                        ...activity.teacherFeedback,
                                        teacherCreativityStatus: level.id,
                                      })
                                    }
                                    style={{ cursor: isViewMode ? "default" : "pointer" }}
                                  >
                                    <div className="d-flex align-items-center">
                                      <div className={`me-3 ${isSelected ? level.textColor : "text-muted"}`}>
                                        <div
                                          className={`rounded-circle border ${isSelected ? `${level.iconBgColor} ${level.iconBorderColor}` : "border-secondary"
                                            }`}
                                          style={{ width: 20, height: 20 }}
                                        >
                                          {isSelected && (
                                            <div className="w-100 h-100 d-flex align-items-center justify-content-center">
                                              <div className="bg-white rounded-circle" style={{ width: 8, height: 8 }} />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex-grow-1">
                                        <div className={`fw-bold ${isSelected ? level.textColor : "text-dark"}`}>
                                          {level.name}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="!tw-border-dotted !tw-border-2 !tw-border-gray-300 !tw-rounded-lg !tw-p-4 !tw-pt-5">
                            <TextArea
                              name={`activities[${activityIndex}].teacherFeedback.teacherFeedback`}
                              value={activity.teacherFeedback?.teacherFeedback || ""}
                              onChange={domainAssessmentForm.handleChange}
                              placeHolder="Enter teacher feedback..."
                              isDisabled={isViewMode}
                              labelText="Observational Notes"
                              formgroupClassName="mb-3"
                            />
                            <TextArea
                              name={`activities[${activityIndex}].teacherFeedback.challengesFaced`}
                              value={activity.teacherFeedback?.challengesFaced || ""}
                              onChange={domainAssessmentForm.handleChange}
                              placeHolder="Enter details..."
                              isDisabled={isViewMode}
                              labelText="What Challenges did learner face?"
                              formgroupClassName="mb-3"
                            />
                            <TextArea
                              name={`activities[${activityIndex}].teacherFeedback.overComeChallenges`}
                              value={activity.teacherFeedback?.overComeChallenges || ""}
                              onChange={domainAssessmentForm.handleChange}
                              placeHolder="Enter details..."
                              isDisabled={isViewMode}
                              labelText="How did they overcome them? / How did you help them?"
                              formgroupClassName="mb-0"
                            />
                          </div>
                        </div>
                      </div>
                    </AccordionBody>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionHeader targetId={`activity-${activityIndex}-self`}>
                      <div className="d-flex align-items-center">
                        <HugeiconsIcon icon={Home03Icon} size={24} className="me-2" style={{ color: "#17A34A" }} />
                        <div>
                          <div className="fw-bold">Self Assessment</div>
                          <small className="text-muted">
                            Please answer the following regarding the activity you just completed.
                          </small>
                        </div>
                      </div>
                    </AccordionHeader>
                    <AccordionBody accordionId={`activity-${activityIndex}-self`}>
                      <ParentQuestions
                        questions={selfQuestions}
                        values={activity.selfResponses}
                        onChange={(i, v) =>
                          updateActivityField(activityIndex, "selfResponses", {
                            ...activity.selfResponses,
                            [i]: v,
                          })
                        }
                        isViewMode={isViewMode}
                        prefix={`self-${activityIndex}`}
                      />
                    </AccordionBody>
                  </AccordionItem>
                </UncontrolledAccordion>
              </TabPane>
            ))}
          </TabContent>
        </>
      )}
      {!isViewMode && (
        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-between">
            <div>
              <button
                type="button"
                color="outline-secondary"
                className="me-2"
                onClick={() => handleDomainChange("prev")}
                disabled={currentDomainIndex === 0}
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} className="me-1" />
                Previous Domain
              </button>

              <button
                type="button"
                className="btn btn-outline-primary fs-12 px-3"
                onClick={handlePrevious}
                disabled={stepId === "generalInformation"}
              >
                <HugeiconsIcon icon={CircleArrowLeft01Icon} size={20} color="currentColor" className="!tw-mr-1" />
                Previous Step
              </button>
            </div>
            <div>
              <button type="button" className="btn btn-success" onClick={handleNextDomain}>
                {currentDomainIndex === transformedDomainData.length - 1 ? "Next Step" : "Next Domain"}{" "}
                <HugeiconsIcon icon={CircleArrowRight01Icon} size={20} color="currentColor" className="!tw-ml-1" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainAssessment;
